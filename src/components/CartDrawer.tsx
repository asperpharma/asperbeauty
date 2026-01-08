import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, X, Lock, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTitle } from "@/lib/productUtils";

const FREE_SHIPPING_THRESHOLD = 50; // JOD

export const CartDrawer = () => {
  const { 
    items, 
    isLoading, 
    isOpen,
    updateQuantity, 
    removeItem, 
    createCheckout,
    setOpen,
    getTotalPrice,
  } = useCartStore();
  
  const totalPrice = getTotalPrice();
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  // Calculate shipping progress
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setOpen(false);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Checkout failed:', error);
      }
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent 
        className={`w-full sm:max-w-md flex flex-col h-full bg-white p-0 ${isRTL ? 'border-r border-l-0' : 'border-l'} border-gold/30`}
        side={isRTL ? 'left' : 'right'}
        style={{
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 p-6 pb-4 border-b border-gold/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-2xl text-foreground tracking-wide">
              {isArabic ? 'اختياراتك' : 'Your Selection'}
            </SheetTitle>
            <button 
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Shipping Progress Bar */}
          <div className="mt-4">
            <div className="h-1.5 bg-cream rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-500 ease-out rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
            <p className="font-body text-xs text-muted-foreground mt-2 text-center">
              {hasFreeShipping 
                ? (isArabic ? '🎁 شحن مجاني مفعّل!' : '🎁 Complimentary Shipping Unlocked!')
                : (isArabic 
                    ? `أنت على بعد ${amountToFreeShipping.toFixed(0)} دينار من الشحن المجاني`
                    : `You are ${amountToFreeShipping.toFixed(0)} JOD away from Complimentary Shipping`
                  )
              }
            </p>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground font-body text-sm">
                  {isArabic ? 'سلتك فارغة' : 'Your selection is empty'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 py-4 border-b border-gold/10">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-cream rounded overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm text-foreground leading-tight line-clamp-2">
                          {translateTitle(item.product.node.title, language)}
                        </h4>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground font-body mt-1">
                            {item.selectedOptions.map(option => option.value).join(' / ')}
                          </p>
                        )}
                        <p className="font-display text-sm text-burgundy mt-1">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Quantity Stepper & Remove */}
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        {/* Stepper */}
                        <div className="flex items-center border border-gold/30 rounded">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-gold/10 transition-colors duration-400"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-body text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-gold/10 transition-colors duration-400"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer - Pinned to Bottom */}
              <div className="flex-shrink-0 p-6 border-t border-gold/20 bg-white">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-lg text-foreground">
                    {isArabic ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {items[0]?.price.currencyCode || 'JOD'} {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isLoading}
                  className="w-full py-4 px-8 bg-burgundy text-white font-display text-sm tracking-widest uppercase transition-all duration-400 hover:bg-burgundy-light hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isArabic ? 'جاري التحميل...' : 'Creating Checkout...'}
                    </span>
                  ) : (
                    isArabic ? 'المتابعة للدفع' : 'Proceed to Checkout'
                  )}
                </button>
                
                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-body">
                    {isArabic ? 'دفع آمن' : 'Secure Checkout'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
