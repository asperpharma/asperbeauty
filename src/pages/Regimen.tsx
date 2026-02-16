import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2, ShoppingBag, Trash2, Plus, Minus, Package, Loader2 } from "lucide-react";
import { createStorefrontCheckout } from "@/lib/shopify";
import { toast } from "sonner";

/**
 * Regimen Page - Step 3 of 3-Click Solution
 * Digital tray/cart review before checkout
 * Features: Cart management, RTL support, accessibility, Shopify checkout integration
 */
export default function Regimen() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isRTL = language === 'ar';

  useEffect(() => {
    // If cart is empty, redirect to recommend page
    if (items.length === 0) {
      navigate('/recommend');
    }
  }, [items.length, navigate]);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Prepare cart items for Shopify checkout
      const checkoutItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));
      
      // Create Shopify checkout and get checkout URL
      const checkoutUrl = await createStorefrontCheckout(checkoutItems);
      
      // Redirect to Shopify hosted checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(
        isRTL 
          ? 'حدث خطأ أثناء إنشاء الدفع. يرجى المحاولة مرة أخرى.' 
          : 'An error occurred while creating checkout. Please try again.'
      );
      setIsCheckingOut(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-luxury-ivory" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-gold/10 mb-6">
              <Package className="w-8 h-8 text-luxury-gold" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-luxury-charcoal mb-4">
              {isRTL ? 'صينيتك الرقمية' : 'Your Digital Tray'}
            </h1>
            <p className="font-body text-lg text-luxury-charcoal/70 max-w-2xl mx-auto mb-6">
              {isRTL 
                ? 'راجع نظام العناية بالبشرة المخصص وتابع إلى الدفع'
                : 'Review your personalized skincare regimen and proceed to checkout'
              }
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-luxury-charcoal/60">
              <span className="w-8 h-1 bg-luxury-gold rounded"></span>
              <span className="w-8 h-1 bg-luxury-gold rounded"></span>
              <span className="w-8 h-1 bg-luxury-gold rounded"></span>
              <span className="font-body">{isRTL ? 'الخطوة 3 من 3' : 'Step 3 of 3'}</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <Package className="w-16 h-16 text-luxury-charcoal/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-luxury-charcoal mb-2">
                {isRTL ? 'صينيتك فارغة' : 'Your tray is empty'}
              </h2>
              <p className="font-body text-luxury-charcoal/60 mb-6">
                {isRTL 
                  ? 'أضف منتجات إلى نظامك للمتابعة'
                  : 'Add products to your regimen to continue'
                }
              </p>
              <Button
                onClick={() => navigate('/recommend')}
                className="bg-luxury-maroon hover:bg-luxury-maroon/90 text-white font-body"
              >
                {isRTL ? 'عودة إلى التوصيات' : 'Back to Recommendations'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const image = item.product.node.images.edges[0]?.node;
                  const price = parseFloat(item.price.amount);
                  
                  return (
                    <div 
                      key={item.variantId} 
                      className="bg-white rounded-lg shadow-md p-4 border border-gray-100 flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-luxury-ivory rounded-lg overflow-hidden flex-shrink-0">
                        {image ? (
                          <img 
                            src={image.url} 
                            alt={image.altText || item.product.node.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base text-luxury-charcoal mb-1 line-clamp-2">
                          {item.product.node.title}
                        </h3>
                        {item.variantTitle && item.variantTitle !== 'Default' && (
                          <p className="font-body text-sm text-luxury-charcoal/60 mb-2">
                            {item.variantTitle}
                          </p>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-luxury-charcoal" />
                            </button>
                            <span className="px-4 font-body text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-luxury-charcoal" />
                            </button>
                          </div>
                          
                          <p className="font-body text-base font-semibold text-luxury-charcoal">
                            {item.price.currencyCode} {(price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-4">
                  <h2 className="font-display text-2xl text-luxury-charcoal mb-6">
                    {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between font-body text-base">
                      <span className="text-luxury-charcoal/60">
                        {isRTL ? 'المجموع الفرعي' : 'Subtotal'}
                      </span>
                      <span className="text-luxury-charcoal font-semibold">
                        JOD {totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-body text-base">
                      <span className="text-luxury-charcoal/60">
                        {isRTL ? 'الشحن' : 'Shipping'}
                      </span>
                      <span className="text-luxury-charcoal">
                        {isRTL ? 'محسوب عند الدفع' : 'Calculated at checkout'}
                      </span>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between font-display text-xl">
                      <span className="text-luxury-charcoal">
                        {isRTL ? 'الإجمالي' : 'Total'}
                      </span>
                      <span className="text-luxury-maroon font-semibold">
                        JOD {totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6 space-y-3 p-4 bg-luxury-ivory rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm text-luxury-charcoal">
                        {isRTL ? 'شحن مجاني للطلبات فوق 50 دينار' : 'Free shipping on orders over JOD 50'}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm text-luxury-charcoal">
                        {isRTL ? 'إرجاع سهل خلال 30 يومًا' : 'Easy returns within 30 days'}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm text-luxury-charcoal">
                        {isRTL ? 'منتجات أصلية 100٪' : '100% authentic products'}
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-luxury-maroon hover:bg-luxury-maroon/90 text-white font-body text-base py-6 rounded-lg transition-all duration-300"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 me-2 animate-spin" />
                        {isRTL ? 'جاري التحميل...' : 'Loading...'}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 me-2" />
                        {isRTL ? 'المتابعة إلى الدفع' : 'Proceed to Checkout'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/recommend')}
                    variant="outline"
                    className="w-full mt-3 border-luxury-gold text-luxury-charcoal hover:bg-luxury-gold/10 font-body"
                  >
                    {isRTL ? 'إضافة المزيد من المنتجات' : 'Add More Products'}
                  </Button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
