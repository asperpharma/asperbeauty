import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickViewModal } from "./QuickViewModal";
import { getLocalizedDescription, translateTitle } from "@/lib/productUtils";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { t, language } = useLanguage();
  
  const isWishlisted = isInWishlist(node.id);

  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  
  // Check for badges based on tags
  const tags = (node as any).tags || [];
  const isBestseller = Array.isArray(tags) 
    ? tags.some((tag: string) => tag.toLowerCase().includes('bestseller'))
    : typeof tags === 'string' && tags.toLowerCase().includes('bestseller');
  
  // Check if product is new (created within last 30 days)
  const createdAt = (node as any).createdAt;
  const isNewArrival = createdAt 
    ? (Date.now() - new Date(createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;
    
  // Check for sale/discount
  const compareAtPrice = firstVariant?.compareAtPrice;
  const currentPrice = parseFloat(firstVariant?.price?.amount || price.amount);
  const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.amount) : null;
  const isOnSale = originalPrice && originalPrice > currentPrice;
  const discountPercent = isOnSale 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    
    if (!isWishlisted) {
      toast.success("Added to wishlist", {
        description: node.title,
        position: "top-center",
      });
    }
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="bg-soft-ivory border border-border hover:border-shiny-gold/50 hover:shadow-xl hover:shadow-shiny-gold/5 transition-all duration-500 overflow-hidden relative rounded-sm">
        {/* Badges */}
        {(isBestseller || isNewArrival || isOnSale) && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {isOnSale && (
              <div className="bg-primary text-primary-foreground px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg">
                <span className="flex items-center gap-1.5">
                  -{discountPercent}%
                </span>
              </div>
            )}
            {isBestseller && (
              <div className="bg-shiny-gold text-dark-charcoal px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  Bestseller
                </span>
              </div>
            )}
            {isNewArrival && !isBestseller && !isOnSale && (
              <div className="bg-primary text-primary-foreground border border-shiny-gold/40 px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg">
                New
              </div>
            )}
          </div>
        )}
        
        {/* Image Container */}
        <div className="aspect-[3/4] bg-secondary overflow-hidden relative">
          {firstImage ? (
            <>
              <img
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground font-body text-sm">{t.noImage}</span>
            </div>
          )}

          {/* Corner Accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-shiny-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-shiny-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-shiny-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-shiny-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
                isWishlisted 
                  ? 'bg-shiny-gold border-shiny-gold text-dark-charcoal' 
                  : 'bg-soft-ivory/90 border-shiny-gold/40 text-shiny-gold opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 hover:bg-shiny-gold hover:text-dark-charcoal'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="w-10 h-10 rounded-full bg-soft-ivory/90 backdrop-blur-sm border border-shiny-gold/40 flex items-center justify-center text-shiny-gold hover:bg-shiny-gold hover:text-dark-charcoal transition-all duration-300 shadow-lg hover:scale-110 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick add button */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <Button
              variant="luxury"
              size="luxury"
              className="w-full bg-soft-ivory/95 backdrop-blur-md text-primary border border-shiny-gold hover:bg-shiny-gold hover:text-dark-charcoal shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 me-2" />
              {t.addToBag}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 text-center bg-soft-ivory relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-shiny-gold/50 to-transparent" />
          
          <h3 className="font-display text-base text-dark-charcoal mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {translateTitle(node.title, language)}
          </h3>
          <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-1 leading-relaxed">
            {getLocalizedDescription(node.description, language, 60) || t.premiumProduct}
          </p>
          
          {/* Gold Separator */}
          <div className="flex items-center justify-center gap-2 my-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-shiny-gold/60 to-shiny-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-shiny-gold/60" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent via-shiny-gold/60 to-shiny-gold/30" />
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            {isOnSale && originalPrice && (
              <p className="font-display text-sm text-muted-foreground line-through">
                {price.currencyCode} {originalPrice.toFixed(2)}
              </p>
            )}
            <p className={`font-display text-lg font-medium tracking-wide ${isOnSale ? 'text-primary' : 'text-shiny-gold'}`}>
              {price.currencyCode} {currentPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </Link>
  );
};
