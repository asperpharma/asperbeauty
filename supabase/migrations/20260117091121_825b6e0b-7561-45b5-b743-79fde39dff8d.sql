-- Add subcategory and skin_concerns columns for granular filtering
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS skin_concerns TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update existing products with subcategories and skin concerns
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['hydration', 'anti-aging'] WHERE title ILIKE '%Minéral 89%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['anti-aging', 'wrinkles'] WHERE title ILIKE '%LiftActiv%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['acne', 'oily-skin'] WHERE title ILIKE '%Normaderm%';
UPDATE public.products SET subcategory = 'Sun Protection', skin_concerns = ARRAY['anti-aging', 'sun-protection'] WHERE title ILIKE '%Soleil%' OR title ILIKE '%SPF%' OR title ILIKE '%Sun%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['hydration', 'anti-aging'] WHERE title ILIKE '%Hyaluron%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['acne', 'oily-skin'] WHERE title ILIKE '%DermoPure%' OR title ILIKE '%Effaclar%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['sensitivity', 'redness'] WHERE title ILIKE '%Sensitive%' OR title ILIKE '%Soothing%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['cleansing'] WHERE title ILIKE '%Micellar%' OR title ILIKE '%Cleanser%';
UPDATE public.products SET subcategory = 'Face', skin_concerns = ARRAY['acne', 'coverage'] WHERE title ILIKE '%Cover%';