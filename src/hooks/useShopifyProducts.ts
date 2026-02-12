import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";

/**
 * Hook to fetch Shopify products using React Query
 * @param first - Number of products to fetch (default: 24)
 * @param query - Optional search query
 */
export function useShopifyProducts(first: number = 24, query?: string) {
  return useQuery({
    queryKey: ["shopify-products", first, query],
    queryFn: () => fetchProducts(first, query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
