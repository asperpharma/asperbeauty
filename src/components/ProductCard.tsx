import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { ShoppingBag, Eye, Heart, Star, Sparkles, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickViewModal } from "./QuickViewModal";
import { getLocalizedDescription, translateTitle } from "@/lib/productUtils";
import { OptimizedImage } from "./OptimizedImage";

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

  // Extract brand from vendor or title
  const brand = (node as any).vendor || node.title.split(' ')[0];

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
      {/* Luxury Card Container */}
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-400 ease-in-out border border-transparent group-hover:border-gold group-hover:shadow-lg">
        
        {/* Image Container */}
        <div className="aspect-square bg-secondary overflow-hidden relative">
          {firstImage ? (
            <>
              <OptimizedImage
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="w-full h-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-105"
                loading="lazy"
                width={400}
                height={400}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground font-body text-sm">{t.noImage}</span>
            </div>
          )}

          {/* Gold Badge Icons */}
          {(isBestseller || isNewArrival || isOnSale) && (
            <div className="absolute top-2 md:top-3 left-2 md:left-3 z-20 flex flex-col gap-1.5">
              {isBestseller && (
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gold flex items-center justify-center shadow-md" title="Bestseller">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-burgundy fill-burgundy" />
                </div>
              )}
              {isNewArrival && !isBestseller && (
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gold flex items-center justify-center shadow-md" title="New Arrival">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-burgundy" />
                </div>
              )}
              {isOnSale && (
                <div className="px-2 py-1 bg-burgundy text-white font-body text-[10px] md:text-xs tracking-wide rounded-full shadow-md">
                  -{discountPercent}%
                </div>
              )}
            </div>
          )}

          {/* Wishlist Button - Always visible on mobile */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 md:top-3 right-2 md:right-3 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-400 ${
              isWishlisted 
                ? 'bg-gold text-burgundy' 
                : 'bg-white/80 text-muted-foreground md:opacity-0 md:group-hover:opacity-100 hover:bg-gold hover:text-burgundy'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Smart Hover Buttons - Hidden on mobile (no hover) */}
          <div className="hidden md:flex absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-in-out">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-burgundy text-white hover:bg-burgundy-light rounded-none py-3 font-body text-xs tracking-widest uppercase border-r border-gold/20"
            >
              <ShoppingBag className="w-4 h-4 me-2" />
              {language === 'ar' ? 'إضافة' : 'Add to Bag'}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="flex-1 bg-cream text-burgundy hover:bg-gold hover:text-burgundy rounded-none py-3 font-body text-xs tracking-widest uppercase border-l border-gold/20"
            >
              <Info className="w-4 h-4 me-2" />
              {language === 'ar' ? 'لماذا يعمل؟' : 'Why this works?'}
            </Button>
          </div>

          {/* Quick View Button - Hidden on mobile */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="hidden md:flex absolute bottom-14 right-3 z-20 w-9 h-9 rounded-full bg-white/80 items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-gold hover:text-burgundy transition-all duration-400"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-5 bg-white">
          {/* Brand Name */}
          <p className="font-body text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-1">
            {brand}
          </p>
          
          {/* Product Title */}
          <h3 className="font-display text-sm md:text-base text-foreground mb-2 line-clamp-2 leading-snug">
            {translateTitle(node.title, language)}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            {isOnSale && originalPrice && (
              <p className="font-body text-xs md:text-sm text-muted-foreground line-through">
                {price.currencyCode} {originalPrice.toFixed(2)}
              </p>
            )}
            <p className={`font-display text-base md:text-lg font-semibold ${isOnSale ? 'text-burgundy' : 'text-burgundy'}`}>
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
