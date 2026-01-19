-- Add explicit deny policies for anonymous access to sensitive tables

-- Deny anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to cod_orders table
CREATE POLICY "Deny anonymous access to cod_orders"
ON public.cod_orders
FOR SELECT
TO anon
USING (false);

-- Also deny anonymous INSERT/UPDATE/DELETE on cod_orders for completeness
CREATE POLICY "Deny anonymous insert on cod_orders"
ON public.cod_orders
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on cod_orders"
ON public.cod_orders
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on cod_orders"
ON public.cod_orders
FOR DELETE
TO anon
USING (false);

-- Deny anonymous INSERT/UPDATE/DELETE on profiles for completeness
CREATE POLICY "Deny anonymous insert on profiles"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on profiles"
ON public.profiles
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on profiles"
ON public.profiles
FOR DELETE
TO anon
USING (false);