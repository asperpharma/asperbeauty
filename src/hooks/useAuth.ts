import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError, Factor } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  mfaRequired: boolean;
  isAdmin: boolean;
}

interface MFAFactors {
  totp: Factor[];
  phone: Factor[];
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    mfaRequired: false,
    isAdmin: false,
  });
  const [factors, setFactors] = useState<MFAFactors>({ totp: [], phone: [] });

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      return !error && data?.role === 'admin';
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          mfaRequired: false,
        }));

        // Defer MFA factor fetch and admin check with setTimeout
        if (session?.user) {
          setTimeout(async () => {
            fetchMFAFactors();
            const isAdmin = await checkAdminRole(session.user.id);
            setState(prev => ({ ...prev, isAdmin }));
          }, 0);
        } else {
          setState(prev => ({ ...prev, isAdmin: false }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) {
        fetchMFAFactors();
        const isAdmin = await checkAdminRole(session.user.id);
        setState(prev => ({ ...prev, isAdmin }));
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const fetchMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!error && data) {
        setFactors({
          totp: data.totp || [],
          phone: data.phone || [],
        });
      }
    } catch (err) {
      console.error('Error fetching MFA factors:', err);
    }
  };

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Check if MFA is required
    if (data?.session?.user && !error) {
      const { data: assuranceData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceData?.nextLevel === 'aal2' && assuranceData?.currentLevel === 'aal1') {
        setState(prev => ({ ...prev, mfaRequired: true }));
      }
    }

    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const verifyMFA = useCallback(async (factorId: string, code: string) => {
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    
    if (challengeError) {
      return { error: challengeError };
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (!error) {
      setState(prev => ({ ...prev, mfaRequired: false }));
    }

    return { data, error };
  }, []);

  const enrollTOTP = useCallback(async (friendlyName?: string) => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: friendlyName || 'Authenticator App',
    });
    
    return { data, error };
  }, []);

  const verifyTOTPEnrollment = useCallback(async (factorId: string, code: string) => {
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    
    if (challengeError) {
      return { error: challengeError };
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (!error) {
      await fetchMFAFactors();
    }

    return { data, error };
  }, []);

  const unenrollMFA = useCallback(async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    
    if (!error) {
      await fetchMFAFactors();
    }

    return { error };
  }, []);

  return {
    ...state,
    factors,
    signUp,
    signIn,
    signOut,
    verifyMFA,
    enrollTOTP,
    verifyTOTPEnrollment,
    unenrollMFA,
    refreshFactors: fetchMFAFactors,
  };
}
