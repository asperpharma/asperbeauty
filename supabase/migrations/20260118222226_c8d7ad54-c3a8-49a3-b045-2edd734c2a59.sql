-- Add explicit INSERT policy on user_roles to prevent privilege escalation
CREATE POLICY "Users cannot insert their own roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy on profiles (admin-only for data retention compliance)
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add explicit anonymous denial policy for cod_orders
CREATE POLICY "Anonymous users cannot access orders" 
ON public.cod_orders 
FOR SELECT 
TO anon
USING (false);

-- Add explicit anonymous denial policy for profiles
CREATE POLICY "Anonymous users cannot access profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);