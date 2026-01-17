-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Featured',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for products (everyone can view products)
CREATE POLICY "Products are publicly viewable"
ON public.products
FOR SELECT
USING (true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (title, price, description, category, image_url) VALUES
('Luxury Hydrating Serum', 45.00, 'Intensive hydration formula with hyaluronic acid for all skin types.', 'Best Seller', NULL),
('Vitamin C Brightening Cream', 52.00, 'Powerful antioxidant cream that illuminates and evens skin tone.', 'New Arrival', NULL),
('Retinol Night Treatment', 68.00, 'Advanced anti-aging formula that works while you sleep.', 'Best Seller', NULL),
('Rose Gold Eye Palette', 38.00, 'Twelve shimmering shades for stunning eye looks day or night.', 'Trending', NULL),
('Nourishing Hair Oil', 32.00, 'Lightweight argan blend that restores shine and softness.', 'Featured', NULL),
('Signature Eau de Parfum', 95.00, 'An enchanting blend of jasmine, amber, and warm vanilla notes.', 'New Arrival', NULL),
('Matte Velvet Lipstick', 24.00, 'Long-lasting, richly pigmented color with a luxurious velvet finish.', 'Best Seller', NULL),
('SPF 50 Mineral Sunscreen', 42.00, 'Lightweight, non-greasy protection with a natural matte finish.', 'Trending', NULL);