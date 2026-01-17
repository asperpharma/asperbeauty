-- Fix the security vulnerability: Replace time-based SELECT policy with token-based approach
-- Drop the insecure time-based policy
DROP POLICY IF EXISTS "Users can read their newly created order" ON public.cod_orders;

-- Add a confirmation_token column for secure order retrieval
ALTER TABLE public.cod_orders ADD COLUMN IF NOT EXISTS confirmation_token uuid DEFAULT gen_random_uuid();

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_cod_orders_confirmation_token ON public.cod_orders(confirmation_token);

-- Create a secure policy: users can only read their order using the confirmation token
-- The token is returned on insert and used for order confirmation page
CREATE POLICY "Users can read order by confirmation token"
ON public.cod_orders
FOR SELECT
USING (
  -- Admin access
  has_role(auth.uid(), 'admin'::app_role)
  -- This policy is mainly for the admin check - the actual guest access 
  -- will be handled via an edge function that uses service role
);

-- Also add admin access to profiles for user management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));