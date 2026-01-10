import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Minus, Plus, Heart, Star, ChevronDown } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { toast } from "sonner";
import { getLocalizedDescription, extractKeyBenefits, getLocalizedCategory, translateTitle } from "@/lib/productUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductData {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor?: string;
  productType?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';
  const [product, setProduct] = useState<ProductData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductData["variants"]["edges"][0]["node"] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants.edges[0]) {
          const firstVariant = data.variants.edges[0].node;
          setSelectedVariant(firstVariant);
          const initialOptions: Record<string, string> = {};
          firstVariant.selectedOptions.forEach((opt: { name: string; value: string }) => {
            initialOptions[opt.name] = opt.value;
          });
          setSelectedOptions(initialOptions);
        }

        // Fetch related products
        const related = await fetchProducts(8);
        setRelatedProducts(related.filter((p: ShopifyProduct) => p.node.handle !== handle).slice(0, 4));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to fetch product:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    setSelectedImage(0);
  }, [handle]);

  useEffect(() => {
    if (!product) return;
    
    const matchingVariant = product.variants.edges.find((v) =>
      v.node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    );
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  }, [selectedOptions, product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success(isArabic ? "تمت الإضافة إلى السلة" : "Added to bag", {
      description: `${product.title}${selectedVariant.title !== "Default Title" ? ` - ${selectedVariant.title}` : ""}`,
      position: "top-center",
    });

    setCartOpen(true);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleItem({ node: product });
    if (!isInWishlist(product.id)) {
      toast.success(isArabic ? "تمت الإضافة إلى المفضلة" : "Added to wishlist", {
        description: product.title,
        position: "top-center",
      });
    }
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Check for sale
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const currentPrice = parseFloat(selectedVariant?.price?.amount || product?.priceRange.minVariantPrice.amount || "0");
  const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.amount) : null;
  const isOnSale = originalPrice && originalPrice > currentPrice;
  const discountPercent = isOnSale 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-36">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-36">
          <h1 className="font-display text-2xl text-foreground mb-4">
            {isArabic ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <Link to="/" className="text-gold hover:underline font-body text-sm">
            {isArabic ? 'العودة للمتجر' : 'Return to Shop'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const hasMultipleVariants = product.variants.edges.length > 1;
  const currencyCode = selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode;

  // Check if option might be a color (for round color circles)
  const isColorOption = (optionName: string) => {
    const colorNames = ['color', 'colour', 'shade', 'لون'];
    return colorNames.some(c => optionName.toLowerCase().includes(c));
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-36 pb-32 lg:pb-24">
        <div className="luxury-container">
          {/* Sticky Split-Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0">
            
            {/* Left Column - Image Gallery (Sticky) */}
            <div className="lg:sticky lg:top-[100px] lg:self-start lg:pr-8">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 group">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground font-body">No image</span>
                  </div>
                )}

                {/* Sale Badge */}
                {isOnSale && (
                  <div className="absolute top-4 left-4 bg-burgundy text-white px-4 py-2 font-body text-sm tracking-wide rounded">
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery - 4 images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-400 ${
                        selectedImage === idx 
                          ? "border-gold ring-2 ring-gold ring-offset-2" 
                          : "border-transparent hover:border-gold/50"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Buy Box */}
            <div className="lg:pl-[60px] pt-8 lg:pt-0">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm mb-6">
                <Link to="/" className="font-body text-muted-foreground hover:text-gold transition-colors duration-400">
                  {isArabic ? 'الرئيسية' : 'Home'}
                </Link>
                <span className="text-muted-foreground">&gt;</span>
                <Link to="/collections" className="font-body text-muted-foreground hover:text-gold transition-colors duration-400">
                  {product.productType ? getLocalizedCategory(product.productType, language) : (isArabic ? 'العناية بالبشرة' : 'Skincare')}
                </Link>
                <span className="text-muted-foreground">&gt;</span>
                <span className="font-body text-muted-foreground">
                  {isArabic ? 'سيروم' : 'Serums'}
                </span>
              </nav>
              
              {/* Title */}
              <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4 leading-tight">
                {translateTitle(product.title, language)}
              </h1>
              
              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <p className="font-display text-2xl lg:text-3xl font-bold text-burgundy">
                  {currencyCode} {currentPrice.toFixed(2)}
                </p>
                {isOnSale && originalPrice && (
                  <p className="font-body text-lg text-muted-foreground line-through">
                    {currencyCode} {originalPrice.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Review Stars & Share */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="font-body text-sm text-muted-foreground">(128 Reviews)</span>
                </div>
                <ShareButtons 
                  url={window.location.href} 
                  title={`${isArabic ? 'اكتشف' : 'Check out'} ${product.title} ${isArabic ? 'من آسبر بيوتي' : 'from Asper Beauty'}`}
                />
              </div>

              {/* Short Description */}
              <p className="font-body text-muted-foreground leading-relaxed mb-8" style={{ lineHeight: '1.6' }}>
                {getLocalizedDescription(product.description, language, 300) || (isArabic ? 'منتج تجميل فاخر من مجموعتنا المختارة، مصنوع بأجود المكونات للحصول على بشرة مشرقة ونضرة.' : 'A premium beauty product from our curated collection, crafted with the finest ingredients for radiant and youthful skin.')}
              </p>

              {/* Variant Options */}
              {hasMultipleVariants && product.options.map((option) => (
                <div key={option.name} className="mb-6">
                  <label className="font-body text-sm font-medium text-foreground mb-3 block">
                    {isArabic ? (isColorOption(option.name) ? 'اختر اللون' : 'الحجم') : (isColorOption(option.name) ? 'Select Shade' : option.name)}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      
                      // For color options, show round circles
                      if (isColorOption(option.name)) {
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value })}
                            className={`w-10 h-10 rounded-full transition-all duration-400 ${
                              isSelected
                                ? "ring-2 ring-gold ring-offset-2"
                                : "hover:ring-2 hover:ring-gold/50 hover:ring-offset-1"
                            }`}
                            style={{ backgroundColor: value.toLowerCase() }}
                            title={value}
                          />
                        );
                      }
                      
                      // For size/other options, show outlined buttons
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value })}
                          className={`px-5 py-2.5 rounded-lg border-2 font-body text-sm transition-all duration-400 ${
                            isSelected
                              ? "border-gold ring-2 ring-gold text-foreground"
                              : "border-gold/30 text-foreground hover:border-gold"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-8">
                <label className="font-body text-sm font-medium text-foreground mb-3 block">
                  {isArabic ? 'الكمية' : 'Quantity'}
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center border border-gold/30 rounded-l-lg hover:border-gold hover:bg-gold/10 transition-all duration-400 text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center border-t border-b border-gold/30">
                    <span className="font-display text-lg text-foreground">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center border border-gold/30 rounded-r-lg hover:border-gold hover:bg-gold/10 transition-all duration-400 text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Bag CTA - Full Width */}
              <div className="hidden lg:flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="flex-1 py-4 px-8 bg-burgundy text-white font-display text-sm tracking-widest uppercase transition-all duration-400 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {selectedVariant?.availableForSale 
                    ? (isArabic ? 'أضف إلى السلة' : 'Add to Bag') 
                    : (isArabic ? 'نفذ من المخزون' : 'Sold Out')
                  }
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 flex items-center justify-center rounded-lg border transition-all duration-400 ${
                    isWishlisted
                      ? 'bg-gold border-gold text-burgundy'
                      : 'border-gold/30 text-gold hover:border-gold hover:bg-gold/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Information Accordions */}
              <div className="border-t border-gold">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="ingredients" className="border-b border-gold">
                    <AccordionTrigger className="py-4 font-display text-sm text-foreground hover:no-underline hover:text-gold transition-colors duration-400">
                      {isArabic ? 'المكونات والفوائد' : 'Ingredients & Benefits'}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {isArabic 
                          ? 'مكونات طبيعية فاخرة تعمل على ترطيب البشرة وتجديدها. تحتوي على فيتامين سي وحمض الهيالورونيك والنياسيناميد لبشرة مشرقة وصحية.'
                          : 'Premium natural ingredients that hydrate and rejuvenate the skin. Contains Vitamin C, Hyaluronic Acid, and Niacinamide for a radiant, healthy complexion.'
                        }
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="how-to-use" className="border-b border-gold">
                    <AccordionTrigger className="py-4 font-display text-sm text-foreground hover:no-underline hover:text-gold transition-colors duration-400">
                      {isArabic ? 'طريقة الاستخدام' : 'How to Use'}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {isArabic 
                          ? 'ضعي كمية مناسبة على البشرة النظيفة صباحاً ومساءً. دلكي بلطف بحركات دائرية حتى يمتص المنتج بالكامل. للحصول على أفضل النتائج، استخدميه بانتظام.'
                          : 'Apply an appropriate amount to clean skin morning and evening. Gently massage in circular motions until fully absorbed. For best results, use consistently as part of your daily skincare routine.'
                        }
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="shipping" className="border-b border-gold">
                    <AccordionTrigger className="py-4 font-display text-sm text-foreground hover:no-underline hover:text-gold transition-colors duration-400">
                      {isArabic ? 'الشحن والإرجاع' : 'Shipping & Returns'}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {isArabic 
                          ? 'شحن مجاني للطلبات فوق 50 دينار. التوصيل خلال 2-5 أيام عمل داخل عمان. سياسة إرجاع سهلة خلال 30 يوم من الاستلام.'
                          : 'Free shipping on orders over 50 JOD. Delivery within 2-5 business days in Amman. Easy 30-day return policy from the date of receipt.'
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
            <section className="mt-20">
              <div className="text-center mb-12">
                <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-2">
                  {isArabic ? 'قد يعجبك أيضاً' : 'You May Also Like'}
                </h2>
                <div className="w-16 h-px bg-gold mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Sticky Mobile Add to Cart Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cream border-t border-gold/20 p-4 z-40 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={handleWishlistToggle}
            className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all duration-400 ${
              isWishlisted
                ? 'bg-gold border-gold text-burgundy'
                : 'border-gold/30 text-gold'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <div className="flex-shrink-0">
            <p className="font-display text-xl text-burgundy">
              {currencyCode} {currentPrice.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale}
            className="flex-1 py-3 px-4 bg-burgundy text-white font-display text-sm tracking-wider uppercase transition-all duration-400 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            {selectedVariant?.availableForSale 
              ? (isArabic ? 'أضف إلى السلة' : 'Add to Bag') 
              : (isArabic ? 'نفذ' : 'Sold Out')
            }
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
