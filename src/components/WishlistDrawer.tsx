import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart, Trash2, ShoppingBag, X } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { translateTitle } from "@/lib/productUtils";

export const WishlistDrawer = () => {
  const { items, isOpen, setOpen, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { t, language, isRTL } = useLanguage();

  const handleAddToCart = (product: typeof items[0]) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    if (!firstVariant) return;

    addToCart({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });

    toast.success(t.addedToBag, {
      description: product.node.title,
      position: "top-center",
    });

    removeItem(product.node.id);
    setOpen(false);
    setCartOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent 
        className={`w-full sm:max-w-md flex flex-col h-full bg-cream ${isRTL ? 'border-r border-l-0' : 'border-l'} border-gold/20`}
        side={isRTL ? 'left' : 'right'}
      >
        <SheetHeader className="flex-shrink-0 border-b border-gold/20 pb-4">
          <SheetTitle className="font-display text-2xl text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-gold fill-gold" />
            {language === 'ar' ? 'قائمة الرغبات' : 'My Wishlist'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gold" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                {language === 'ar' ? 'قائمة الرغبات فارغة' : 'Your wishlist is empty'}
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                {language === 'ar' ? 'احفظي منتجاتك المفضلة لشرائها لاحقاً' : 'Save your favorite products to purchase them later'}
              </p>
              <Button
                variant="outline"
                className="border-gold/30 hover:border-gold"
                onClick={() => setOpen(false)}
              >
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 px-1">
              {items.map((product) => {
                const firstImage = product.node.images.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;

                return (
                  <div
                    key={product.node.id}
                    className="flex gap-4 p-3 bg-white/50 border border-gold/10 hover:border-gold/30 transition-colors"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${product.node.handle}`}
                      onClick={() => setOpen(false)}
                      className="w-20 h-24 flex-shrink-0 bg-cream overflow-hidden"
                    >
                      {firstImage ? (
                        <img
                          src={firstImage.url}
                          alt={firstImage.altText || product.node.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-cream">
                          <Heart className="w-6 h-6 text-gold/30" />
                        </div>
                      )}
                    </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <Link
                          to={`/product/${product.node.handle}`}
                          onClick={() => setOpen(false)}
                          className="font-display text-sm text-foreground hover:text-gold transition-colors line-clamp-2 mb-1"
                        >
                          {translateTitle(product.node.title, language)}
                        </Link>
                        <p className="font-display text-gold text-sm mb-auto">
                          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs border-gold/30 hover:bg-gold hover:text-cream hover:border-gold"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingBag className="w-3 h-3 me-1" />
                            {language === 'ar' ? 'أضف للحقيبة' : 'Add to Bag'}
                          </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                          onClick={() => removeItem(product.node.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gold/20 pt-4 space-y-3">
            <p className="font-body text-sm text-muted-foreground text-center">
              {language === 'ar' 
                ? `${items.length} ${items.length === 1 ? 'منتج محفوظ' : 'منتجات محفوظة'}`
                : `${items.length} item${items.length !== 1 ? 's' : ''} saved`}
            </p>
            <Button
              variant="outline"
              className="w-full border-gold/30 hover:border-gold"
              onClick={() => setOpen(false)}
            >
              {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Wishlist Icon Button for Header
export const WishlistButton = () => {
  const { items, setOpen } = useWishlistStore();
  const itemCount = items.length;

  return (
    <button
      onClick={() => setOpen(true)}
      className="relative p-2 text-foreground hover:text-gold transition-colors"
      aria-label="Wishlist"
    >
      <Heart className={`w-5 h-5 ${itemCount > 0 ? 'fill-gold text-gold' : ''}`} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-cream text-xs font-display rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};
