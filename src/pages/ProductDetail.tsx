import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, ArrowLeft, Minus, Plus, Truck, RotateCcw, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getLocalizedDescription, extractKeyBenefits, getLocalizedCategory, translateTitle } from "@/lib/productUtils";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductData["variants"]["edges"][0]["node"] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

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
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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

    toast.success("Added to bag", {
      description: `${product.title}${selectedVariant.title !== "Default Title" ? ` - ${selectedVariant.title}` : ""}`,
      position: "top-center",
    });

    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <h1 className="font-display text-2xl text-cream mb-4">Product Not Found</h1>
          <Link to="/" className="text-gold hover:underline font-body text-sm">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const hasMultipleVariants = product.variants.edges.length > 1;
  const currentPrice = selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const currencyCode = selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-32 lg:pb-24">
        <div className="luxury-container">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors mb-8 font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          {/* Main Product Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
            
            {/* Left Side - Image Gallery */}
            <div className="w-full lg:w-[65%] lg:pr-10">
              <div className="aspect-square bg-secondary overflow-hidden border border-gold/20 mb-4">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-cream/40 font-body">No image</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === idx 
                          ? "border-gold shadow-lg shadow-gold/20" 
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

            {/* Divider */}
            <div className="hidden lg:block w-[2px] bg-gold/20 mx-2" />

            {/* Right Side - Purchase Info */}
            <div className="w-full lg:w-[35%] lg:pl-10">
              {/* Brand & Category */}
              <div className="flex items-center gap-2 mb-3">
                <p className="font-body text-xs tracking-widest uppercase text-gold">
                  {product.vendor || (language === 'ar' ? 'آسبر بيوتي' : 'Asper Beauty')}
                </p>
                <span className="w-1 h-1 rounded-full bg-gold/50" />
                <p className="font-body text-xs tracking-widest uppercase text-cream/50">
                  {getLocalizedCategory(product.productType || product.vendor || 'Beauty', language)}
                </p>
              </div>
              
              {/* Title */}
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-cream mb-4 leading-tight">
                {translateTitle(product.title, language)}
              </h1>
              
              {/* Price */}
              <p className="font-display text-2xl lg:text-3xl text-gold mb-6">
                {currencyCode} {parseFloat(currentPrice).toFixed(2)}
              </p>

              {/* Gold divider */}
              <div className="w-12 h-px bg-gold mb-6" />

              {/* Key Benefits */}
              {(() => {
                const benefits = extractKeyBenefits(product.description, language);
                return benefits.length > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span className="font-body text-xs tracking-widest uppercase text-cream">
                        {language === 'ar' ? 'الفوائد الرئيسية' : 'Key Benefits'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {benefits.map((benefit, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 bg-gold/10 border border-gold/30 text-cream/80 font-body text-xs rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Summarized Description */}
              <p className="font-body text-cream/70 leading-relaxed text-sm mb-8">
                {getLocalizedDescription(product.description, language, 200) || (language === 'ar' ? 'منتج تجميل فاخر من مجموعتنا المختارة، مصنوع بأجود المكونات.' : 'A premium beauty product from our curated collection, crafted with the finest ingredients for discerning individuals.')}
              </p>

              {/* Options */}
              {hasMultipleVariants && product.options.map((option) => (
                <div key={option.name} className="mb-6">
                  <label className="font-body text-xs tracking-widest uppercase text-cream mb-3 block">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value })}
                        className={`px-4 py-2 border font-body text-sm transition-all duration-300 ${
                          selectedOptions[option.name] === value
                            ? "border-gold bg-gold/10 text-cream"
                            : "border-gold/30 text-cream/60 hover:border-gold hover:text-cream"
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
                <label className="font-body text-xs tracking-widest uppercase text-cream mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-300 text-cream"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-display text-lg text-cream">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-300 text-cream"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart - Desktop Only */}
              <div className="hidden lg:block">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="w-full py-4 px-8 bg-gold text-background font-display text-base tracking-wider uppercase transition-all duration-300 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20"
                >
                  {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gold/20 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-cream">Free Shipping</p>
                    <p className="font-body text-xs text-cream/50">On orders over 50 JOD</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-cream">Easy Returns</p>
                    <p className="font-body text-xs text-cream/50">30-day hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-cream">Authentic Products</p>
                    <p className="font-body text-xs text-cream/50">100% genuine guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Mobile Add to Cart Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-gold/20 p-4 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <p className="font-display text-xl text-gold">
              {currencyCode} {parseFloat(currentPrice).toFixed(2)}
            </p>
            <p className="font-body text-xs text-cream/50">Qty: {quantity}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale}
            className="flex-1 py-4 px-6 bg-gold text-background font-display text-sm tracking-wider uppercase transition-all duration-300 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
