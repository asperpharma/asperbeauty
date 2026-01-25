-- Fix security vulnerabilities

-- 1. Remove the insecure INSERT policy for cod_orders
-- Orders are now ONLY created through the edge function using service role
DROP POLICY IF EXISTS "Anyone can create COD orders" ON public.cod_orders;

-- Create a restrictive INSERT policy - only service role (edge function) can insert
-- Regular users/anon cannot directly insert, they must go through the edge function
CREATE POLICY "Only service role can create orders"
ON public.cod_orders
FOR INSERT
WITH CHECK (false);  -- Blocks all direct inserts; edge function uses service role which bypasses RLS

-- 2. Drop the duplicate select policy we created earlier (keep only admin access)
DROP POLICY IF EXISTS "Users can read order by confirmation token" ON public.cod_orders;

-- 3. Fix storage policy - restrict uploads to admin only
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;

-- Create admin-only upload policy for product images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);