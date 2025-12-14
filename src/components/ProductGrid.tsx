import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export const ProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(20);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section id="products" className="py-24 bg-cream">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Featured Collections
          </h2>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
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

        {/* Products Grid - 2 large products per row for exclusive feel */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
