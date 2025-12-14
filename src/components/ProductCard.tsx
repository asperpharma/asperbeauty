import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });

    toast.success("Added to bag", {
      description: node.title,
      position: "top-center",
    });

    setCartOpen(true);
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="bg-cream border border-transparent hover:border-gold transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div className="aspect-[3/4] bg-cream overflow-hidden relative">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cream">
              <span className="text-muted-foreground font-body text-sm">No image</span>
            </div>
          )}

          {/* Quick add button */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              variant="luxury"
              size="luxury"
              className="w-full bg-cream/95 backdrop-blur-sm text-foreground border border-gold hover:bg-cream"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Bag
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center bg-cream">
          <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-gold transition-colors">
            {node.title}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
            {node.description || "Premium beauty product"}
          </p>
          <p className="font-display text-lg text-gold">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};
