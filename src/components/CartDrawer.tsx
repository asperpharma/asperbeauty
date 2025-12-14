import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, isRTL } = useLanguage();

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent 
        className={`w-full sm:max-w-md flex flex-col h-full bg-background ${isRTL ? 'border-r border-l-0' : 'border-l'} border-border`}
        side={isRTL ? 'left' : 'right'}
      >
        <SheetHeader className={`flex-shrink-0 ${isRTL ? 'text-right' : 'text-left'}`}>
          <SheetTitle className="font-display text-2xl tracking-wide">{t.shoppingCart}</SheetTitle>
          <SheetDescription className="luxury-subheading">
            {items.length === 0 ? t.cartEmpty : `${items.length} ${t.itemsInCart}`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-8 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground font-body text-sm">{t.cartEmpty}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pe-2 min-h-0">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 pb-6 border-b border-border/50">
                      <div className="w-20 h-24 bg-secondary rounded overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lg truncate">{item.product.node.title}</h4>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground font-body mt-1">
                            {item.selectedOptions.map(option => option.value).join(' / ')}
                          </p>
                        )}
                        <p className="font-body text-sm mt-2">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-secondary transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-body">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-secondary transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-6 pt-6 border-t border-border bg-background">
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg">{t.total}</span>
                  <span className="font-display text-xl">
                    {items[0]?.price.currencyCode || 'JOD'} {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  variant="luxury"
                  size="luxury"
                  className="w-full"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 me-2 animate-spin" />
                      {t.creatingCheckout}
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 me-2" />
                      {t.checkout}
                    </>
                  )}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground font-body">
                  {isRTL ? 'دفع آمن بواسطة شوبيفاي' : 'Secure checkout powered by Shopify'}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
