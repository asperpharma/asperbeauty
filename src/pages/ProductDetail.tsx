import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ArrowLeft, Minus, Plus, Truck, RotateCcw, Shield, Sparkles, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getLocalizedDescription, extractKeyBenefits, getLocalizedCategory, translateTitle } from "@/lib/productUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import asperLogo from "@/assets/asper-logo.jpg";

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
        console.error("Failed to fetch product:", error);
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-36 pb-32 lg:pb-24">
        <div className="luxury-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="font-body text-muted-foreground hover:text-gold transition-colors duration-400">
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/collections" className="font-body text-muted-foreground hover:text-gold transition-colors duration-400">
              {isArabic ? 'المنتجات' : 'Products'}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-body text-foreground">{translateTitle(product.title, language)}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Side - Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gold/20 mb-4 group">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground font-body">No image</span>
                  </div>
                )}

                {/* Sale Badge */}
                {isOnSale && (
                  <div className="absolute top-4 left-4 bg-burgundy text-white px-4 py-2 font-body text-sm tracking-wide">
                    -{discountPercent}% OFF
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-gold/30 flex items-center justify-center text-foreground hover:bg-gold hover:text-burgundy transition-all duration-400 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-gold/30 flex items-center justify-center text-foreground hover:bg-gold hover:text-burgundy transition-all duration-400 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-400 ${
                        selectedImage === idx 
                          ? "border-gold shadow-lg" 
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

            {/* Right Side - Product Info */}
            <div>
              {/* Brand Badge */}
              <div className="flex items-center gap-3 mb-4">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                  {product.vendor || 'Asper Beauty'}
                </p>
                {product.productType && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gold" />
                    <p className="font-body text-xs tracking-widest uppercase text-gold">
                      {getLocalizedCategory(product.productType, language)}
                    </p>
                  </>
                )}
              </div>
              
              {/* Title */}
              <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4 leading-tight">
                {translateTitle(product.title, language)}
              </h1>
              
              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {isOnSale && originalPrice && (
                  <p className="font-body text-xl text-muted-foreground line-through">
                    {currencyCode} {originalPrice.toFixed(2)}
                  </p>
                )}
                <p className={`font-display text-3xl ${isOnSale ? 'text-burgundy' : 'text-burgundy'}`}>
                  {currencyCode} {currentPrice.toFixed(2)}
                </p>
              </div>

              {/* Gold divider */}
              <div className="w-16 h-px bg-gold mb-6" />

              {/* Key Benefits */}
              {(() => {
                const benefits = extractKeyBenefits(product.description, language);
                return benefits.length > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span className="font-body text-xs tracking-widest uppercase text-foreground">
                        {isArabic ? 'الفوائد الرئيسية' : 'Key Benefits'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {benefits.map((benefit, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 bg-gold/10 border border-gold/30 text-foreground font-body text-xs rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Description */}
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                {getLocalizedDescription(product.description, language, 250) || (isArabic ? 'منتج تجميل فاخر من مجموعتنا المختارة، مصنوع بأجود المكونات.' : 'A premium beauty product from our curated collection, crafted with the finest ingredients for discerning individuals.')}
              </p>

              {/* Variant Options */}
              {hasMultipleVariants && product.options.map((option) => (
                <div key={option.name} className="mb-6">
                  <label className="font-body text-sm font-medium text-foreground mb-3 block">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value })}
                        className={`px-5 py-2.5 rounded-lg border font-body text-sm transition-all duration-400 ${
                          selectedOptions[option.name] === value
                            ? "border-gold bg-gold text-burgundy"
                            : "border-gold/30 text-foreground hover:border-gold"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
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

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="flex-1 py-4 px-8 bg-burgundy text-white font-display text-sm tracking-widest uppercase transition-all duration-400 hover:bg-burgundy-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {selectedVariant?.availableForSale 
                    ? (isArabic ? 'أضف إلى السلة' : 'Add to Cart') 
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

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gold/20">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-2">
                    <Truck className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-body text-xs text-foreground">{isArabic ? 'توصيل مجاني' : 'Free Shipping'}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{isArabic ? 'فوق 50 دينار' : 'Over 50 JOD'}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-2">
                    <RotateCcw className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-body text-xs text-foreground">{isArabic ? 'إرجاع سهل' : 'Easy Returns'}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{isArabic ? '30 يوم' : '30 Days'}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-body text-xs text-foreground">{isArabic ? 'أصلي 100%' : '100% Authentic'}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{isArabic ? 'مضمون' : 'Guaranteed'}</p>
                </div>
              </div>

              {/* Brand Assurance */}
              <div className="mt-6 flex items-center gap-4 p-4 bg-burgundy/5 rounded-lg border border-gold/20">
                <img src={asperLogo} alt="Asper Beauty Shop" className="h-12 rounded" />
                <div>
                  <p className="font-script text-lg text-gold">Elegance in every detail</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {isArabic ? 'منتقى بعناية من خبرائنا في الصيدلة' : 'Curated by Pharmacists. Powered by Intelligence.'}
                  </p>
                </div>
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
            className="flex-1 py-3 px-4 bg-burgundy text-white font-display text-sm tracking-wider uppercase transition-all duration-400 hover:bg-burgundy-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            {selectedVariant?.availableForSale 
              ? (isArabic ? 'أضف إلى السلة' : 'Add to Cart') 
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
