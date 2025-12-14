import { useEffect, useState, useMemo } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { ProductFilters, FilterState } from "./ProductFilters";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  showFilters?: boolean;
}

export const ProductGrid = ({ showFilters = false }: ProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(50);
        setProducts(data);
        
        // Set max price based on products
        if (data.length > 0) {
          const maxProductPrice = Math.max(
            ...data.map((p) => parseFloat(p.node.priceRange.minVariantPrice.amount))
          );
          setFilters((prev) => ({
            ...prev,
            priceRange: [0, Math.ceil(maxProductPrice)],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Extract unique categories and brands
  const { availableCategories, availableBrands, maxPrice } = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.node.productType).filter(Boolean))];
    const brands = [...new Set(products.map((p) => p.node.vendor).filter(Boolean))];
    const max = products.length > 0
      ? Math.ceil(Math.max(...products.map((p) => parseFloat(p.node.priceRange.minVariantPrice.amount))))
      : 1000;
    return { availableCategories: categories, availableBrands: brands, maxPrice: max };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const { node } = product;
      const price = parseFloat(node.priceRange.minVariantPrice.amount);

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(node.productType)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(node.vendor)) {
        return false;
      }

      // Price filter
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  return (
    <section id="products" className="py-24 bg-cream">
      <div className="luxury-container">
        {/* Section Header */}
        {!showFilters && (
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Featured Collections
            </h2>
            <div className="w-16 h-px bg-gold mx-auto" />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        {/* Content with Optional Filters */}
        {!loading && products.length > 0 && (
          <div className={showFilters ? "flex flex-col lg:flex-row gap-8" : ""}>
            {/* Filters Sidebar */}
            {showFilters && (
              <ProductFilters
                availableCategories={availableCategories}
                availableBrands={availableBrands}
                maxPrice={maxPrice}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results count */}
              {showFilters && (
                <div className="mb-6 font-body text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              )}

              {filteredProducts.length > 0 ? (
                <div className={`grid gap-12 lg:gap-16 ${showFilters ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'}`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-2xl text-gold">∅</span>
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-2">No products found</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-6 border border-gold/30">
                <span className="font-display text-3xl text-gold">∅</span>
              </div>
              <h3 className="font-display text-2xl text-foreground mb-4">No Products Yet</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                Our collection is being curated. Tell us what products you'd like to see in your store 
                by describing the product name and price in the chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
