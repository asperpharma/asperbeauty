-- Add new columns for professional product catalog
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS volume_ml TEXT,
ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;