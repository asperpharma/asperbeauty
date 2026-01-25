-- Fix user_roles: Update policy to explicitly require authentication
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Fix cod_orders: Update admin SELECT policy to explicitly require authentication
DROP POLICY IF EXISTS "Admins can view all COD orders" ON public.cod_orders;

CREATE POLICY "Admins can view all COD orders"
ON public.cod_orders
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);