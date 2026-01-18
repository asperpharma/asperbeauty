-- Fix: Convert RESTRICTIVE policies to PERMISSIVE for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anonymous users cannot access profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix: Convert RESTRICTIVE policies to PERMISSIVE for user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users cannot insert their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix: Convert RESTRICTIVE policies to PERMISSIVE for cod_orders table
DROP POLICY IF EXISTS "Admins can view all COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Admins can update COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Admins can delete COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Only service role can create orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Drivers can view their assigned orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Drivers can update their assigned orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Anonymous users cannot access orders" ON public.cod_orders;

CREATE POLICY "Admins can view all COD orders"
ON public.cod_orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update COD orders"
ON public.cod_orders FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete COD orders"
ON public.cod_orders FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Drivers can view their assigned orders"
ON public.cod_orders FOR SELECT TO authenticated
USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their assigned orders"
ON public.cod_orders FOR UPDATE TO authenticated
USING (auth.uid() = driver_id);

-- Service role INSERT (bypass RLS anyway)
CREATE POLICY "Service role can create orders"
ON public.cod_orders FOR INSERT TO service_role
WITH CHECK (true);