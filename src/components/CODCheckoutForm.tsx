import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, MapPin, Phone, User, Mail, FileText } from "lucide-react";
import { translateTitle } from "@/lib/productUtils";

const JORDAN_CITIES = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Aqaba",
  "Salt",
  "Mafraq",
  "Jerash",
  "Madaba",
  "Karak",
  "Ajloun",
  "Ma'an",
  "Tafilah",
];

const SHIPPING_COST = 3; // JOD
const FREE_SHIPPING_THRESHOLD = 50; // JOD

interface CODCheckoutFormProps {
  onSuccess: (orderNumber: string) => void;
  onCancel: () => void;
}

export const CODCheckoutForm = ({ onSuccess, onCancel }: CODCheckoutFormProps) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    city: "",
    notes: "",
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast.error(isArabic ? "الرجاء إدخال الاسم" : "Please enter your name");
      return false;
    }
    if (!formData.customerPhone.trim()) {
      toast.error(isArabic ? "الرجاء إدخال رقم الهاتف" : "Please enter your phone number");
      return false;
    }
    if (!formData.deliveryAddress.trim()) {
      toast.error(isArabic ? "الرجاء إدخال عنوان التوصيل" : "Please enter delivery address");
      return false;
    }
    if (!formData.city) {
      toast.error(isArabic ? "الرجاء اختيار المدينة" : "Please select a city");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error(isArabic ? "سلة التسوق فارغة" : "Cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.product.node.id,
        productTitle: item.product.node.title,
        variantId: item.variantId,
        variantTitle: item.variantTitle,
        price: item.price.amount,
        currency: item.price.currencyCode,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        imageUrl: item.product.node.images?.edges?.[0]?.node?.url || null,
      }));

      // Generate a temporary order number for insert (will be replaced by trigger)
      const tempOrderNumber = 'ASP-' + Date.now().toString().slice(-8);

      const { data, error } = await supabase
        .from('cod_orders')
        .insert({
          order_number: tempOrderNumber,
          customer_name: formData.customerName.trim(),
          customer_phone: formData.customerPhone.trim(),
          customer_email: formData.customerEmail.trim() || null,
          delivery_address: formData.deliveryAddress.trim(),
          city: formData.city,
          notes: formData.notes.trim() || null,
          items: orderItems,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          total: total,
        })
        .select('order_number')
        .single();

      if (error) throw error;

      clearCart();
      onSuccess(data.order_number);
      
    } catch (error) {
      console.error('Failed to place COD order:', error);
      toast.error(isArabic ? "فشل في إرسال الطلب. حاول مرة أخرى." : "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-cream/50 rounded-lg p-4 space-y-3">
        <h3 className="font-display text-sm font-medium text-foreground">
          {isArabic ? 'ملخص الطلب' : 'Order Summary'}
        </h3>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[200px]">
                {translateTitle(item.product.node.title, language)} × {item.quantity}
              </span>
              <span className="text-foreground font-medium">
                {(parseFloat(item.price.amount) * item.quantity).toFixed(2)} JOD
              </span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gold/20 pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
            <span>{subtotal.toFixed(2)} JOD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isArabic ? 'الشحن' : 'Shipping'}</span>
            <span className={shippingCost === 0 ? "text-green-600" : ""}>
              {shippingCost === 0 ? (isArabic ? 'مجاني' : 'Free') : `${shippingCost.toFixed(2)} JOD`}
            </span>
          </div>
          <div className="flex justify-between font-display text-base font-bold pt-1">
            <span>{isArabic ? 'الإجمالي' : 'Total'}</span>
            <span className="text-burgundy">{total.toFixed(2)} JOD</span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gold" />
            {isArabic ? 'الاسم الكامل' : 'Full Name'} *
          </Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
            className="border-gold/30 focus:border-gold"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone" className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gold" />
            {isArabic ? 'رقم الهاتف' : 'Phone Number'} *
          </Label>
          <Input
            id="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            placeholder={isArabic ? '07XXXXXXXX' : '07XXXXXXXX'}
            className="border-gold/30 focus:border-gold"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail" className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gold" />
            {isArabic ? 'البريد الإلكتروني' : 'Email'} ({isArabic ? 'اختياري' : 'optional'})
          </Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            placeholder={isArabic ? 'example@email.com' : 'example@email.com'}
            className="border-gold/30 focus:border-gold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gold" />
            {isArabic ? 'المدينة' : 'City'} *
          </Label>
          <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
            <SelectTrigger className="border-gold/30 focus:border-gold">
              <SelectValue placeholder={isArabic ? 'اختر المدينة' : 'Select city'} />
            </SelectTrigger>
            <SelectContent>
              {JORDAN_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryAddress" className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gold" />
            {isArabic ? 'عنوان التوصيل' : 'Delivery Address'} *
          </Label>
          <Textarea
            id="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
            placeholder={isArabic ? 'أدخل عنوان التوصيل بالتفصيل' : 'Enter detailed delivery address'}
            className="border-gold/30 focus:border-gold min-h-[80px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-gold" />
            {isArabic ? 'ملاحظات' : 'Notes'} ({isArabic ? 'اختياري' : 'optional'})
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder={isArabic ? 'أي ملاحظات إضافية للتوصيل' : 'Any additional delivery notes'}
            className="border-gold/30 focus:border-gold min-h-[60px]"
          />
        </div>
      </div>

      {/* COD Notice */}
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 text-center">
        <p className="text-sm text-foreground font-medium">
          💵 {isArabic ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isArabic ? 'ادفع نقداً عند استلام طلبك' : 'Pay cash when you receive your order'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-gold/30"
          disabled={isSubmitting}
        >
          {isArabic ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="flex-1 bg-burgundy hover:bg-burgundy-light text-white"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isArabic ? 'جاري الإرسال...' : 'Placing Order...'}
            </span>
          ) : (
            isArabic ? 'تأكيد الطلب' : 'Confirm Order'
          )}
        </Button>
      </div>
    </form>
  );
};

// Order Success Component
export const OrderSuccess = ({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="text-center py-6 space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {isArabic ? 'تم استلام طلبك!' : 'Order Received!'}
        </h3>
        <p className="text-muted-foreground mt-1">
          {isArabic ? 'شكراً لطلبك' : 'Thank you for your order'}
        </p>
      </div>

      <div className="bg-cream/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          {isArabic ? 'رقم الطلب' : 'Order Number'}
        </p>
        <p className="font-display text-lg font-bold text-burgundy">
          {orderNumber}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        {isArabic 
          ? 'سنتواصل معك قريباً لتأكيد طلبك' 
          : 'We will contact you soon to confirm your order'}
      </p>

      <Button onClick={onClose} className="w-full bg-burgundy hover:bg-burgundy-light text-white">
        {isArabic ? 'متابعة التسوق' : 'Continue Shopping'}
      </Button>
    </div>
  );
};