-- Fix RLS policies to use PERMISSIVE type correctly for proper security

-- Drop and recreate profiles policies
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create proper PERMISSIVE policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate cod_orders policies  
DROP POLICY IF EXISTS "Deny anonymous access to orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Admins can view all COD orders" ON public.cod_orders;

-- Create proper PERMISSIVE policy for cod_orders
CREATE POLICY "Admins can view all COD orders" 
ON public.cod_orders 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate user_roles policies
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create proper PERMISSIVE policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);