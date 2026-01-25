-- Add explicit deny policies for anonymous (anon) role as defense-in-depth

-- Deny anonymous access to cod_orders
CREATE POLICY "Deny anonymous access to orders"
ON public.cod_orders
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to profiles
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to user_roles
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);