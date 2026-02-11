import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Minus,
  Plus,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTitle } from "@/lib/productUtils";
import { CODCheckoutForm, OrderSuccess } from "./CODCheckoutForm";

const FREE_SHIPPING_THRESHOLD = 50; // JOD

export const CartDrawer = () => {
  const [checkoutMode, setCheckoutMode] = useState<"cart" | "cod" | "success">(
    "cart",
  );
  const [orderNumber, setOrderNumber] = useState<string>("");

  const {
    items,
    isLoading,
    isOpen,
    updateQuantity,
    removeItem,
    setOpen,
    getTotalPrice,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === "ar";

  // Calculate shipping progress
  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - totalPrice,
  );
  const shippingProgress = Math.min(
    100,
    (totalPrice / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setOpen(false);
    } else {
      toast.error("Checkout not available. Please try again.");
    }
  };

  // Sync cart when drawer opens
  const handleDrawerOpen = (open: boolean) => {
    if (open) syncCart();
    handleOpenChange(open);
  };

  const handleCODSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setCheckoutMode("success");
  };

  const handleCloseAfterSuccess = () => {
    setCheckoutMode("cart");
    setOrderNumber("");
    setOpen(false);
  };

  const handleBackToCart = () => {
    setCheckoutMode("cart");
  };

  // Reset checkout mode when drawer closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCheckoutMode("cart");
    }
    setOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleDrawerOpen}>
      <SheetContent
        className={`w-full sm:max-w-md flex flex-col h-full bg-background p-0 ${
          isRTL ? "border-r border-l-0" : "border-l"
        } border-gold/20`}
        side={isRTL ? "left" : "right"}
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gold/20">
          <div className="flex items-center justify-between">
            {checkoutMode === "cod" && (
              <button
                onClick={handleBackToCart}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <SheetTitle className="font-serif text-xl text-foreground tracking-wide flex-1">
              {checkoutMode === "success"
                ? (isArabic ? "تم الطلب" : "Order Placed")
                : checkoutMode === "cod"
                ? (isArabic ? "الدفع عند الاستلام" : "Cash on Delivery")
                : (isArabic ? "اختياراتك" : "Your Selection")}
            </SheetTitle>
            <button
              onClick={() => handleOpenChange(false)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress Bar - Only show in cart mode */}
          {checkoutMode === "cart" && items.length > 0 && (
            <div className="mt-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {hasFreeShipping
                  ? (isArabic
                    ? "🎁 شحن مجاني مفعّل!"
                    : "🎁 Complimentary Shipping Unlocked!")
                  : (isArabic
                    ? `أنت على بعد ${
                      amountToFreeShipping.toFixed(0)
                    } دينار من الشحن المجاني`
                    : `You are ${
                      amountToFreeShipping.toFixed(0)
                    } JOD away from Complimentary Shipping`)}
              </p>
            </div>
          )}
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Success Mode */}
          {checkoutMode === "success" && (
            <div className="flex-1 p-6">
              <OrderSuccess
                orderNumber={orderNumber}
                onClose={handleCloseAfterSuccess}
              />
            </div>
          )}

          {/* COD Checkout Mode */}
          {checkoutMode === "cod" && (
            <div className="flex-1 p-6 overflow-y-auto">
              <CODCheckoutForm
                onSuccess={handleCODSuccess}
                onCancel={handleBackToCart}
              />
            </div>
          )}

          {/* Cart Mode */}
          {checkoutMode === "cart" && (
            <>
              {items.length === 0
                ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        {isArabic ? "سلتك فارغة" : "Your selection is empty"}
                      </p>
                    </div>
                  </div>
                )
                : (
                  <>
                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.variantId}
                            className="flex gap-4 group"
                          >
                            {/* Thumbnail */}
                            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {item.product.node.images?.edges?.[0]?.node && (
                                <img
                                  src={item.product.node.images.edges[0].node
                                    .url}
                                  alt={item.product.node.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                {item.product.node.vendor || "Brand"}
                              </p>
                              <h4 className="font-serif text-sm text-foreground leading-tight line-clamp-2 mt-0.5">
                                {translateTitle(
                                  item.product.node.title,
                                  language,
                                )}
                              </h4>
                              <p className="text-sm text-foreground mt-1">
                                {parseFloat(item.price.amount).toFixed(3)}{" "}
                                {item.price.currencyCode}
                              </p>
                            </div>

                            {/* Quantity Stepper & Remove */}
                            <div className="flex flex-col items-end justify-between flex-shrink-0">
                              <button
                                onClick={() => removeItem(item.variantId)}
                                className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              {/* Stepper */}
                              <div className="flex items-center border border-border rounded overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variantId,
                                      item.quantity - 1,
                                    )}
                                  className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm text-foreground">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variantId,
                                      item.quantity + 1,
                                    )}
                                  className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
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
                    <div className="flex-shrink-0 p-6 border-t border-gold/20 bg-background">
                      {/* Subtotal */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">
                          {isArabic ? "المجموع الفرعي" : "Subtotal"}
                        </span>
                        <span className="font-serif text-lg text-foreground">
                          {totalPrice.toFixed(3)}{" "}
                          {items[0]?.price.currencyCode || "JOD"}
                        </span>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={() => setCheckoutMode("cod")}
                        disabled={items.length === 0 || isLoading}
                        className="w-full py-3.5 bg-foreground text-background font-medium text-sm tracking-wide uppercase transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : (
                            <>
                              <Lock className="w-4 h-4" />
                              {isArabic ? "الدفع — آمن" : "Checkout — Securely"}
                            </>
                          )}
                      </button>
                    </div>
                  </>
                )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
