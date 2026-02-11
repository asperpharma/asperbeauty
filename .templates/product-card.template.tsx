/**
 * Product Card Component Template
 * 
 * @description A template for creating product card components
 * Use this as a reference for building consistent product display cards
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { ShoppingBag, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ProductCardTemplateProps {
  product: ShopifyProduct;
  showWishlist?: boolean;
  showQuickView?: boolean;
}

export const ProductCardTemplate = ({ 
  product,
  showWishlist = true,
  showQuickView = true 
}: ProductCardTemplateProps) => {
  const { node } = product;
  const { t, language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(node.id);

  // Extract product data
  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  // Handle add to cart
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

  // Handle wishlist toggle
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
    <Link 
      to={`/product/${node.handle}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gold/20 hover:border-gold hover:shadow-gold-lg">
        
        {/* Image Container */}
        <div className="aspect-square bg-secondary overflow-hidden relative">
          {firstImage ? (
            <OptimizedImage
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width={400}
              height={400}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground font-body text-sm">
                {language === 'ar' ? 'لا توجد صورة' : 'No Image'}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted 
                  ? 'bg-gold text-burgundy' 
                  : 'bg-white/80 text-muted-foreground hover:bg-gold hover:text-burgundy'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Add to Cart Button - Shows on hover */}
          <div className={`absolute inset-x-0 bottom-0 transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-burgundy text-white hover:bg-burgundy-light rounded-none py-3 font-body text-xs tracking-widest uppercase"
            >
              <ShoppingBag className="w-4 h-4 me-2" />
              {language === 'ar' ? 'إضافة إلى الحقيبة' : 'Add to Bag'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-white">
          {/* Product Title */}
          <h3 className="font-display text-base text-foreground mb-2 line-clamp-2">
            {node.title}
          </h3>
          
          {/* Price */}
          <p className="font-display text-lg font-semibold text-burgundy">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardTemplate;
