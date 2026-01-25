-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE
-- RESTRICTIVE requires ALL policies to pass, PERMISSIVE requires ANY to pass

-- =====================
-- PROFILES TABLE
-- =====================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- USER_ROLES TABLE
-- =====================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- COD_ORDERS TABLE
-- =====================
DROP POLICY IF EXISTS "Admins can view all COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Admins can update COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Admins can delete COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Only service role can create orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Drivers can view their assigned orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Drivers can update their assigned orders" ON public.cod_orders;

CREATE POLICY "Admins can view all COD orders"
ON public.cod_orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update COD orders"
ON public.cod_orders FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete COD orders"
ON public.cod_orders FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service role can create orders"
ON public.cod_orders FOR INSERT
WITH CHECK (false);

CREATE POLICY "Drivers can view their assigned orders"
ON public.cod_orders FOR SELECT
USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their assigned orders"
ON public.cod_orders FOR UPDATE
USING (auth.uid() = driver_id);

-- =====================
-- PRODUCTS TABLE (also fixing)
-- =====================
DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Products are publicly viewable"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));