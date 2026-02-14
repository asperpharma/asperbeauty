// Extended Shopify types with optional metadata fields
import { ShopifyProduct } from '@/lib/shopify';

export type ShopifyProductNode = ShopifyProduct['node'];

// Metadata that may be available on product nodes
export interface ProductMetadata {
  tags?: string | string[];
  createdAt?: string;
}

// Helper to get a product node with metadata
export type ProductNodeWithMetadata = ShopifyProductNode & ProductMetadata;
