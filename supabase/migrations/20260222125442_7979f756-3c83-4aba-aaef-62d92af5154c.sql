-- ============================================================================
-- Digital Tray System: "Head Pharmacist" Database Layer
-- ============================================================================
-- This migration creates the infrastructure for the Digital Tray feature,
-- enabling the "3-Click Solution" with curated skincare regimens.
-- ============================================================================

-- Create enum for valid skin concerns
CREATE TYPE public.skin_concern AS ENUM (
  'Concern_Acne',
  'Concern_Hydration',
  'Concern_AntiAging',
  'Concern_Brightening',
  'Concern_Sensitivity',
  'Concern_SunProtection',
  'Concern_DarkCircles'
);

-- Create enum for regimen steps
CREATE TYPE public.regimen_step AS ENUM (
  'Step_1',  -- Cleanse
  'Step_2',  -- Treat
  'Step_3'   -- Protect
);

-- ============================================================================
-- Table: digital_tray_products
-- Stores curated products for the Digital Tray feature with inventory tracking
-- ============================================================================
CREATE TABLE public.digital_tray_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Product identification
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  
  -- Product details
  title TEXT NOT NULL,
  description TEXT,
  vendor TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  image_url TEXT,
  
  -- Digital Tray classification
  concern skin_concern NOT NULL,
  step regimen_step NOT NULL,
  
  -- Priority flags for tie-breakers (Hero Tag > Bestseller > Stock)
  is_hero BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  
  -- Inventory tracking
  inventory_total INTEGER DEFAULT 0,
  available_for_sale BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique product per concern/step combination (one product per slot)
  CONSTRAINT unique_product_per_slot UNIQUE (shopify_product_id, concern, step)
);

-- Create indexes for optimal query performance
CREATE INDEX idx_digital_tray_concern ON public.digital_tray_products(concern);
CREATE INDEX idx_digital_tray_step ON public.digital_tray_products(step);
CREATE INDEX idx_digital_tray_inventory ON public.digital_tray_products(inventory_total) WHERE inventory_total > 0;
CREATE INDEX idx_digital_tray_priority ON public.digital_tray_products(concern, step, is_hero DESC, is_bestseller DESC, inventory_total DESC);

-- Enable Row Level Security
ALTER TABLE public.digital_tray_products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products (public catalog)
CREATE POLICY "Public read access for digital tray products"
ON public.digital_tray_products FOR SELECT
USING (true);

-- Policy: Only admins can manage products
CREATE POLICY "Admins can manage digital tray products"
ON public.digital_tray_products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_digital_tray_products_updated_at
BEFORE UPDATE ON public.digital_tray_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- Function: get_tray_by_concern
-- The "Head Pharmacist" RPC that assembles the Digital Tray
-- Returns the best available product for each step based on:
--   1. Hero Tag (highest priority)
--   2. Bestseller status
--   3. Stock level
-- Returns NULL for steps with no available products
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_tray_by_concern(concern_tag skin_concern)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  step1_product JSONB;
  step2_product JSONB;
  step3_product JSONB;
  result JSONB;
BEGIN
  -- Get best product for Step 1 (Cleanse)
  SELECT jsonb_build_object(
    'id', id,
    'shopify_product_id', shopify_product_id,
    'shopify_variant_id', shopify_variant_id,
    'handle', handle,
    'title', title,
    'description', description,
    'vendor', vendor,
    'price', price,
    'compare_at_price', compare_at_price,
    'image_url', image_url,
    'step', step,
    'is_hero', is_hero,
    'is_bestseller', is_bestseller,
    'inventory_total', inventory_total
  ) INTO step1_product
  FROM public.digital_tray_products
  WHERE concern = concern_tag
    AND step = 'Step_1'
    AND inventory_total > 0
    AND available_for_sale = TRUE
  ORDER BY 
    is_hero DESC,
    is_bestseller DESC,
    inventory_total DESC
  LIMIT 1;

  -- Get best product for Step 2 (Treat)
  SELECT jsonb_build_object(
    'id', id,
    'shopify_product_id', shopify_product_id,
    'shopify_variant_id', shopify_variant_id,
    'handle', handle,
    'title', title,
    'description', description,
    'vendor', vendor,
    'price', price,
    'compare_at_price', compare_at_price,
    'image_url', image_url,
    'step', step,
    'is_hero', is_hero,
    'is_bestseller', is_bestseller,
    'inventory_total', inventory_total
  ) INTO step2_product
  FROM public.digital_tray_products
  WHERE concern = concern_tag
    AND step = 'Step_2'
    AND inventory_total > 0
    AND available_for_sale = TRUE
  ORDER BY 
    is_hero DESC,
    is_bestseller DESC,
    inventory_total DESC
  LIMIT 1;

  -- Get best product for Step 3 (Protect)
  SELECT jsonb_build_object(
    'id', id,
    'shopify_product_id', shopify_product_id,
    'shopify_variant_id', shopify_variant_id,
    'handle', handle,
    'title', title,
    'description', description,
    'vendor', vendor,
    'price', price,
    'compare_at_price', compare_at_price,
    'image_url', image_url,
    'step', step,
    'is_hero', is_hero,
    'is_bestseller', is_bestseller,
    'inventory_total', inventory_total
  ) INTO step3_product
  FROM public.digital_tray_products
  WHERE concern = concern_tag
    AND step = 'Step_3'
    AND inventory_total > 0
    AND available_for_sale = TRUE
  ORDER BY 
    is_hero DESC,
    is_bestseller DESC,
    inventory_total DESC
  LIMIT 1;

  -- Assemble the final tray object
  result := jsonb_build_object(
    'concern', concern_tag,
    'step_1', COALESCE(step1_product, 'null'::jsonb),
    'step_2', COALESCE(step2_product, 'null'::jsonb),
    'step_3', COALESCE(step3_product, 'null'::jsonb),
    'generated_at', NOW()
  );

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_tray_by_concern(skin_concern) TO anon, authenticated;

-- ============================================================================
-- Helper Function: sync_tray_product
-- Upserts a product into the digital tray system
-- ============================================================================
CREATE OR REPLACE FUNCTION public.sync_tray_product(
  p_shopify_product_id TEXT,
  p_shopify_variant_id TEXT,
  p_handle TEXT,
  p_title TEXT,
  p_description TEXT,
  p_vendor TEXT,
  p_price DECIMAL,
  p_compare_at_price DECIMAL,
  p_image_url TEXT,
  p_concern skin_concern,
  p_step regimen_step,
  p_is_hero BOOLEAN,
  p_is_bestseller BOOLEAN,
  p_inventory_total INTEGER,
  p_available_for_sale BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.digital_tray_products (
    shopify_product_id,
    shopify_variant_id,
    handle,
    title,
    description,
    vendor,
    price,
    compare_at_price,
    image_url,
    concern,
    step,
    is_hero,
    is_bestseller,
    inventory_total,
    available_for_sale
  ) VALUES (
    p_shopify_product_id,
    p_shopify_variant_id,
    p_handle,
    p_title,
    p_description,
    p_vendor,
    p_price,
    p_compare_at_price,
    p_image_url,
    p_concern,
    p_step,
    COALESCE(p_is_hero, FALSE),
    COALESCE(p_is_bestseller, FALSE),
    COALESCE(p_inventory_total, 0),
    COALESCE(p_available_for_sale, TRUE)
  )
  ON CONFLICT (shopify_product_id, concern, step)
  DO UPDATE SET
    shopify_variant_id = EXCLUDED.shopify_variant_id,
    handle = EXCLUDED.handle,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    vendor = EXCLUDED.vendor,
    price = EXCLUDED.price,
    compare_at_price = EXCLUDED.compare_at_price,
    image_url = EXCLUDED.image_url,
    is_hero = EXCLUDED.is_hero,
    is_bestseller = EXCLUDED.is_bestseller,
    inventory_total = EXCLUDED.inventory_total,
    available_for_sale = EXCLUDED.available_for_sale,
    updated_at = NOW()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Grant execute permission to service role only
GRANT EXECUTE ON FUNCTION public.sync_tray_product(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DECIMAL, DECIMAL, TEXT, skin_concern, regimen_step, BOOLEAN, BOOLEAN, INTEGER, BOOLEAN) TO service_role;

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE public.digital_tray_products IS 'Curated products for the Digital Tray feature - the "3-Click Solution" for skincare regimens';
COMMENT ON FUNCTION public.get_tray_by_concern(skin_concern) IS 'Returns the best available products for a 3-step skincare regimen based on concern. Uses Hero > Bestseller > Stock priority.';
COMMENT ON FUNCTION public.sync_tray_product IS 'Upserts a product into the digital tray system. Used by sync jobs to keep inventory current.';
