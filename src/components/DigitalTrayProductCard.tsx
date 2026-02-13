import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { Heart, Info, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickViewModal } from "./QuickViewModal";
import { translateTitle } from "@/lib/productUtils";
import { OptimizedImage } from "./OptimizedImage";

interface DigitalTrayProductCardProps {
  product: ShopifyProduct;
}

/**
 * Digital Tray Product Card - Medical Luxury Design
 * Features:
 * - 1px gold border on hover
 * - Luxury typography (Playfair Display headings, Montserrat body)
 * - Quick Add CTA
 * - RTL support
 * - Accessibility optimized
 */
export const DigitalTrayProductCard = (
  { product }: DigitalTrayProductCardProps,
) => {
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

  // Extract brand from vendor
  const brand = (node as { vendor?: string }).vendor ||
    node.title.split(" ")[0];

  // Check for sale
  const compareAtPrice = firstVariant?.compareAtPrice;
  const currentPrice = parseFloat(firstVariant?.price?.amount || price.amount);
  const originalPrice = compareAtPrice
    ? parseFloat(compareAtPrice.amount)
    : null;
  const isOnSale = originalPrice && originalPrice > currentPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
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
      toast.success(
        language === "ar" ? "تمت الإضافة إلى المفضلة" : "Added to wishlist",
        {
          description: node.title,
          position: "top-center",
        },
      );
    }
  };

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block"
      aria-label={`View ${node.title}`}
    >
      {/* Digital Tray Card Container */}
      <div className="digital-tray-card h-full flex flex-col">
        {/* Image Container */}
        <div className="digital-tray-card-image aspect-square bg-luxury-ivory relative">
          {firstImage
            ? (
              <OptimizedImage
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="w-full h-full object-contain transition-transform duration-600 ease-luxury"
                loading="lazy"
                width={400}
                height={400}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )
            : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 font-body text-sm">
                  {t.noImage}
                </span>
              </div>
            )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? "bg-luxury-gold text-white"
                : "bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-luxury-gold hover:text-white"
            }`}
            aria-label={isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          {/* Quick View Button - Desktop Only */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="hidden md:flex absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-luxury-maroon hover:text-white transition-all duration-300"
            aria-label="Quick view"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col bg-white">
          {/* Brand */}
          <p className="font-body text-xs text-luxury-charcoal/60 uppercase tracking-wider mb-1.5">
            {brand}
          </p>

          {/* Title - Using Playfair Display via font-display */}
          <h3 className="font-display text-base text-luxury-charcoal mb-2 line-clamp-2 leading-snug flex-1">
            {translateTitle(node.title, language)}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {isOnSale && originalPrice && (
              <p className="font-body text-sm text-gray-400 line-through">
                {price.currencyCode} {originalPrice.toFixed(2)}
              </p>
            )}
            <p
              className={`font-body text-lg font-semibold ${
                isOnSale ? "text-luxury-maroon" : "text-luxury-charcoal"
              }`}
            >
              {price.currencyCode} {currentPrice.toFixed(2)}
            </p>
          </div>

          {/* Quick Add CTA */}
          <Button
            onClick={handleQuickAdd}
            className="w-full bg-luxury-maroon hover:bg-luxury-maroon/90 text-white font-body text-sm tracking-wide transition-all duration-300"
            aria-label={`Add ${node.title} to cart`}
          >
            <ShoppingBag className="w-4 h-4 me-2" />
            {language === "ar" ? "إضافة سريعة" : "Quick Add"}
          </Button>
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
