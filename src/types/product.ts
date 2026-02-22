// Shared Product type definitions

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  category: string;
  image_url: string | null;
  brand: string | null;
  volume_ml: string | null;
  is_on_sale: boolean | null;
  original_price: number | null;
  discount_percent: number | null;
  created_at: string;
  updated_at: string;
}

export interface ChatProduct {
  id: string;
  title: string;
  price?: number;
  image_url?: string;
  brand?: string;
  category?: string;
  description?: string;
}

// Type for product data in various contexts
export type ProductData = Product | ChatProduct;

// Helper type for partial product updates
export type PartialProduct = Partial<Product>;
