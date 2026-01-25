-- Add source_url column to products table for web scraping enrichment
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS source_url text;

-- Add index for efficient querying of products needing enrichment
CREATE INDEX IF NOT EXISTS idx_products_source_url_image 
ON public.products (source_url) 
WHERE source_url IS NOT NULL AND image_url IS NULL;