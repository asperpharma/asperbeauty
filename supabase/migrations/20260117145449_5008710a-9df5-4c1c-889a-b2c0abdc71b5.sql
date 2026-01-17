-- Add driver assignment fields to cod_orders
ALTER TABLE public.cod_orders
ADD COLUMN IF NOT EXISTS driver_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS assigned_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivery_notes text,
ADD COLUMN IF NOT EXISTS customer_lat numeric,
ADD COLUMN IF NOT EXISTS customer_lng numeric;

-- Create index for driver queries
CREATE INDEX IF NOT EXISTS idx_cod_orders_driver_id ON public.cod_orders(driver_id);

-- Add driver role to app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'driver' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'driver';
  END IF;
END$$;

-- RLS policy for drivers to view their assigned orders
CREATE POLICY "Drivers can view their assigned orders"
ON public.cod_orders
FOR SELECT
USING (auth.uid() = driver_id);

-- RLS policy for drivers to update their assigned orders
CREATE POLICY "Drivers can update their assigned orders"
ON public.cod_orders
FOR UPDATE
USING (auth.uid() = driver_id)
WITH CHECK (auth.uid() = driver_id);