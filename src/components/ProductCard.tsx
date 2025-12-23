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

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { t } = useLanguage();
  
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
      <div className="bg-ivory border border-taupe/30 hover:border-gold hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 overflow-hidden relative">
        {/* Badges */}
        {(isBestseller || isNewArrival || isOnSale) && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {isOnSale && (
              <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg shadow-red-500/30 backdrop-blur-sm animate-pulse" style={{ animationDuration: '2s' }}>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                  </svg>
                  -{discountPercent}%
                </span>
              </div>
            )}
            {isBestseller && (
              <div 
                className="px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg shadow-gold/30 backdrop-blur-sm text-charcoal"
                style={{
                  background: 'linear-gradient(135deg, hsl(46 100% 50%), hsl(46 100% 65%), hsl(46 100% 50%))',
                }}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  Bestseller
                </span>
              </div>
            )}
            {isNewArrival && !isBestseller && !isOnSale && (
              <div className="bg-gradient-to-r from-taupe-dark via-taupe to-taupe-dark text-charcoal px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg shadow-taupe/20 backdrop-blur-sm border border-gold/40">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
                  </svg>
                  New
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Image Container with Fancy Effects */}
        <div className="aspect-[3/4] bg-gradient-to-b from-ivory via-ivory to-taupe-light/30 overflow-hidden relative">
          {firstImage ? (
            <>
              {/* Main Image */}
              <img
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
              />
              {/* Luxury Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ivory to-taupe-light">
              <span className="text-charcoal-light font-body text-sm">{t.noImage}</span>
            </div>
          )}

          {/* Elegant Corner Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons - Quick View & Wishlist */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
            {/* Wishlist Button - Always visible when wishlisted */}
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
                isWishlisted 
                  ? 'bg-gold border-gold text-charcoal' 
                  : 'bg-ivory/95 border-gold/50 text-charcoal opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 hover:bg-gold hover:text-charcoal'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="w-10 h-10 rounded-full bg-ivory/95 backdrop-blur-sm border border-gold/50 flex items-center justify-center text-charcoal hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg hover:scale-110 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick add button */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <Button
              variant="luxury"
              size="luxury"
              className="w-full bg-ivory/95 backdrop-blur-md text-charcoal border border-gold hover:bg-gold hover:text-charcoal shadow-lg shadow-gold/20"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 me-2" />
              {t.addToBag}
            </Button>
          </div>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="p-6 text-center bg-gradient-to-b from-ivory to-taupe-light/20 relative">
          {/* Top decorative line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          
          <h3 className="font-display text-xl text-charcoal mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2">
            {node.title}
          </h3>
          <p className="font-body text-sm text-charcoal-light mb-4 line-clamp-2 leading-relaxed">
            {node.description || t.premiumProduct}
          </p>
          
          {/* Enhanced Gold Lotus Separator */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-gold/60" />
            <svg className="w-5 h-5 text-gold animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDuration: '3s' }}>
              <path d="M12 2C12 2 9 6 9 9C9 11 10.5 12.5 12 12.5C13.5 12.5 15 11 15 9C15 6 12 2 12 2ZM6 8C6 8 3 11 3 13.5C3 15.5 4.5 17 6.5 17C7.5 17 8.5 16.5 9 15.5C7.5 14.5 6.5 12.5 6.5 10.5C6.5 9.5 6.5 8.5 6 8ZM18 8C17.5 8.5 17.5 9.5 17.5 10.5C17.5 12.5 16.5 14.5 15 15.5C15.5 16.5 16.5 17 17.5 17C19.5 17 21 15.5 21 13.5C21 11 18 8 18 8ZM12 14C10 14 8 15.5 7 17.5C8 19.5 10 21 12 21C14 21 16 19.5 17 17.5C16 15.5 14 14 12 14Z"/>
            </svg>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-gold to-gold/60" />
          </div>
          
          {/* Price with Shiny Gold Effect */}
          <div className="flex items-center justify-center gap-3">
            {isOnSale && originalPrice && (
              <p className="font-display text-sm text-charcoal-light line-through">
                {price.currencyCode} {originalPrice.toFixed(2)}
              </p>
            )}
            <p 
              className={`font-display text-xl font-medium tracking-wide ${isOnSale ? 'text-red-600' : ''}`}
              style={!isOnSale ? {
                background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 2px hsla(46, 100%, 50%, 0.3))'
              } : {}}
            >
              {price.currencyCode} {currentPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </Link>
  );
};
