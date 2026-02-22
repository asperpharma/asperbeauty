// Product-related type definitions

export interface ProductRecommendation {
  id: string;
  title: string;
  brand?: string;
  price: string;
  currency?: string;
  image_url?: string;
  handle?: string;
  category?: string;
  discount_percent?: number;
  is_on_sale?: boolean;
  skin_concerns?: string[];
}

export interface ShopifyProductExtended {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  createdAt?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  products?: ProductRecommendation[];
}

export interface StreamedChatResponse {
  type?: 'products';
  products?: ProductRecommendation[];
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}
