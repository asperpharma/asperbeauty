import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, Minus, Plus, Heart, Star, ShieldCheck, Droplets, Sparkles, ShoppingBag } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { toast } from "sonner";
import { getLocalizedDescription, getLocalizedCategory, translateTitle } from "@/lib/productUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface SupabaseProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number | null;
  is_on_sale: boolean | null;
  image_url: string | null;
  category: string;
  subcategory: string | null;
  brand: string | null;
  tags: string[] | null;
  volume_ml: string | null;
  skin_concerns: string[] | null;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', handle)
          .maybeSingle();

        if (error) throw error;
        setProduct(data);

        if (data?.category) {
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .neq('id', handle)
            .limit(4);
          
          setRelatedProducts(related || []);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to fetch product:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      product: {
        node: {
          id: product.id,
          title: product.title,
          handle: product.id,
          description: product.description || "",
          priceRange: {
            minVariantPrice: { amount: product.price.toString(), currencyCode: "JOD" },
          },
          images: { edges: [{ node: { url: product.image_url || "", altText: product.title } }] },
          variants: { edges: [] },
          options: [],
        }
      },
      variantId: product.id,
      variantTitle: "Default",
      price: { amount: product.price.toString(), currencyCode: "JOD" },
      quantity,
      selectedOptions: [],
    };

    addItem(cartItem);
    toast.success(isArabic ? "تمت الإضافة إلى الحقيبة" : "Added to your ritual", {
      description: product.title,
      position: "top-center",
    });
    setCartOpen(true);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const shopifyFormat = {
      node: {
        id: product.id,
        title: product.title,
        handle: product.id,
        description: product.description || "",
        priceRange: { minVariantPrice: { amount: product.price.toString(), currencyCode: "JOD" } },
        images: { edges: [{ node: { url: product.image_url || "", altText: product.title } }] },
        variants: { edges: [] },
        options: [],
      }
    };
    toggleItem(shopifyFormat);
    if (!isInWishlist(product.id)) {
      toast.success(isArabic ? "تمت الإضافة إلى المفضلة" : "Added to wishlist", {
        description: product.title,
        position: "top-center",
      });
    }
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const currentPrice = product?.price || 0;
  const originalPrice = product?.original_price || null;
  const isOnSale = product?.is_on_sale && originalPrice && originalPrice > currentPrice;
  const discountPercent = product?.discount_percent || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-36">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-36">
          <h1 className="font-serif text-2xl text-foreground mb-4">
            {isArabic ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <Link to="/" className="text-primary hover:underline text-sm">
            {isArabic ? 'العودة للمتجر' : 'Return to Shop'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Split Screen Layout */}
      <div className="grid lg:grid-cols-2 min-h-screen pt-20">
        
        {/* LEFT: The Gallery */}
        <div className="bg-muted/30 lg:overflow-y-auto">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img 
              src={product.image_url || "https://images.unsplash.com/photo-1571781535014-53bd44f29186?q=80&w=1200"} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {isOnSale && (
              <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded">
                -{discountPercent}% OFF
              </div>
            )}
            <div className="absolute bottom-6 left-6 text-xs font-light tracking-widest text-white/70 uppercase">
              Figure 01 — The Vessel
            </div>
          </div>
        </div>

        {/* RIGHT: The Editorial Details */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-background">
          <div className="p-8 lg:p-16 flex flex-col justify-center min-h-full">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/collections" className="text-muted-foreground hover:text-primary transition-colors">
                {getLocalizedCategory(product.category, language)}
              </Link>
            </nav>

            {/* Brand & Title */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
                {product.brand || product.category}
              </span>
              <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-6">
                {translateTitle(product.title, language)}
              </h1>
              
              {/* Price & Rating */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-light text-foreground">
                    {currentPrice.toFixed(3)} JOD
                  </span>
                  {isOnSale && originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {originalPrice.toFixed(3)} JOD
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (128 {isArabic ? "تقييم" : "Reviews"})
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8 font-light">
              {getLocalizedDescription(product.description, language, 300) || 
                (isArabic 
                  ? 'منتج تجميل فاخر من مجموعتنا المختارة، مصنوع بأجود المكونات للحصول على بشرة مشرقة ونضرة.'
                  : 'A premium beauty product from our curated collection, crafted with the finest ingredients for radiant and youthful skin.'
                )
              }
            </p>

            {/* Sensory Details */}
            <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-border">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Droplets className="w-4 h-4 text-primary" />
                  {isArabic ? "القوام" : "Texture"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "سيروم حريري خفيف" : "Silky, lightweight serum"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {isArabic ? "العطر" : "Scent"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "خالٍ من العطور" : "Fragrance-free"}
                </p>
              </div>
            </div>

            {/* Quantity & Add to Bag */}
            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-center gap-8 py-4 border border-border">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 py-6 text-base font-medium tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  {isArabic ? "أضف إلى الحقيبة" : "Add to Ritual"} — {(currentPrice * quantity).toFixed(3)} JOD
                </Button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 flex items-center justify-center border transition-all ${
                    isWishlisted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-primary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {isArabic ? "موزع معتمد • منتج أصلي 100%" : "Authorized Retailer • 100% Authentic"}
              </div>

              <ShareButtons 
                url={window.location.href} 
                title={`${isArabic ? 'اكتشف' : 'Check out'} ${product.title} ${isArabic ? 'من آسبر بيوتي' : 'from Asper Beauty'}`}
              />
            </div>

            {/* Accordions */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ritual" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isArabic ? "طريقة الاستخدام" : "The Ritual"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-start gap-3 py-2">
                    <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isArabic 
                        ? "ضعيه صباحاً ومساءً على بشرة نظيفة قبل المرطب. استخدمي كمية مناسبة ووزعيها بلطف على الوجه والرقبة."
                        : "Apply AM and PM on clean skin before your moisturizer. Gently smooth over face and throat."
                      }
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ingredients" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isArabic ? "المكونات الرئيسية" : "Key Ingredients"}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isArabic 
                      ? "مكونات طبيعية فاخرة تعمل على ترطيب البشرة وتجديدها. تحتوي على فيتامين سي وحمض الهيالورونيك والنياسيناميد."
                      : "Premium natural ingredients that hydrate and rejuvenate. Contains Vitamin C, Hyaluronic Acid, and Niacinamide."
                    }
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isArabic ? "الشحن والإرجاع" : "Shipping & Returns"}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isArabic 
                      ? "شحن مجاني للطلبات فوق 50 دينار. التوصيل خلال 24-48 ساعة في عمان. 3 دينار للتوصيل داخل عمان، 5 دينار للمحافظات."
                      : "Free shipping on all orders over 50 JOD. Delivered within 24-48 hours in Amman. 3 JOD for Amman, 5 JOD for Governorates."
                    }
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 px-8 lg:px-16 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl lg:text-3xl text-center mb-12">
              {isArabic ? "أكملي طقوسك" : "Complete The Ritual"}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link 
                  key={related.id} 
                  to={`/product/${related.id}`}
                  className="group bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={related.image_url || "/placeholder.svg"} 
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {related.brand || related.category}
                    </p>
                    <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2">
                      {related.title}
                    </h3>
                    <p className="text-primary font-medium">
                      {related.price.toFixed(3)} JOD
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={handleWishlistToggle}
            className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border transition-all ${
              isWishlisted
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border text-foreground'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <div className="flex-shrink-0">
            <p className="text-xl text-primary font-medium">
              {currentPrice.toFixed(3)} JOD
            </p>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-none"
          >
            {isArabic ? 'أضف إلى الحقيبة' : 'Add to Bag'}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
