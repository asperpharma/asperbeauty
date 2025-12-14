import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { t } = useLanguage();

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

    toast.success(t.addedToBag, {
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
              <span className="text-muted-foreground font-body text-sm">{t.noImage}</span>
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
              <ShoppingBag className="w-4 h-4 me-2" />
              {t.addToBag}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center bg-cream">
          <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-gold transition-colors">
            {node.title}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
            {node.description || t.premiumProduct}
          </p>
          
          {/* Gold lotus separator */}
          <div className="flex items-center justify-center gap-2 my-3">
            <div className="w-8 h-px bg-gold/40" />
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 9 6 9 9C9 11 10.5 12.5 12 12.5C13.5 12.5 15 11 15 9C15 6 12 2 12 2ZM6 8C6 8 3 11 3 13.5C3 15.5 4.5 17 6.5 17C7.5 17 8.5 16.5 9 15.5C7.5 14.5 6.5 12.5 6.5 10.5C6.5 9.5 6.5 8.5 6 8ZM18 8C17.5 8.5 17.5 9.5 17.5 10.5C17.5 12.5 16.5 14.5 15 15.5C15.5 16.5 16.5 17 17.5 17C19.5 17 21 15.5 21 13.5C21 11 18 8 18 8ZM12 14C10 14 8 15.5 7 17.5C8 19.5 10 21 12 21C14 21 16 19.5 17 17.5C16 15.5 14 14 12 14Z"/>
            </svg>
            <div className="w-8 h-px bg-gold/40" />
          </div>
          
          <p className="font-display text-lg text-gold">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};
