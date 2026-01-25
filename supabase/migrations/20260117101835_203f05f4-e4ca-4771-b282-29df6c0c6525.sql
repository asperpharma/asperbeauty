-- Add sensory fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS texture text,
ADD COLUMN IF NOT EXISTS scent text;

-- Add helpful comments
COMMENT ON COLUMN public.products.texture IS 'Product texture description (e.g., Silky serum, Rich cream)';
COMMENT ON COLUMN public.products.scent IS 'Product scent description (e.g., Fragrance-free, Light floral)';