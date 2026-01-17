import { useEffect, useState, useMemo } from "react";
import { ShoppingBag, Star, Sparkles, Loader2, Eye, Percent, Grid3X3, LayoutList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage, formatJOD } from "@/lib/productImageUtils";
import { ProductQuickView } from "@/components/ProductQuickView";
import { ProductSearchFilters, FilterState } from "@/components/ProductSearchFilters";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Extended Product type with new columns
interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  brand: string | null;
  volume_ml: string | null;
  is_on_sale: boolean | null;
  original_price: number | null;
  discount_percent: number | null;
  skin_concerns: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

// Product Card Component
const ShopProductCard = ({ 
  product, 
  onQuickView,
  viewMode
}: { 
  product: Product; 
  onQuickView: (product: Product) => void;
  viewMode: 'grid' | 'list';
}) => {
  const { language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const imageUrl = getProductImage(product.image_url, product.category, product.title);
  
  const isOnSale = product.is_on_sale && product.original_price && product.original_price > product.price;
  const discountPercent = product.discount_percent || 
    (isOnSale ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100) : 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const cartProduct = {
      node: {
        id: product.id,
        title: product.title,
        handle: product.id,
        description: product.description || '',
        priceRange: { minVariantPrice: { amount: product.price.toString(), currencyCode: 'JOD' } },
        images: { edges: [{ node: { url: imageUrl, altText: product.title } }] },
        variants: { edges: [{ node: { id: product.id, title: 'Default', price: { amount: product.price.toString(), currencyCode: 'JOD' }, selectedOptions: [] } }] }
      }
    };

    addItem({
      product: cartProduct as any,
      variantId: product.id,
      variantTitle: 'Default',
      price: { amount: product.price.toString(), currencyCode: 'JOD' },
      quantity: 1,
      selectedOptions: [],
    });
    
    toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart', {
      description: product.title,
      position: "top-center",
    });
    setCartOpen(true);
  };

  if (viewMode === 'list') {
    return (
      <article 
        className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex"
        onClick={() => onQuickView(product)}
      >
        <div className="relative w-40 md:w-48 flex-shrink-0 bg-gray-50">
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
          {isOnSale && discountPercent > 0 && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-[#E53E3E] text-white px-2 py-1 rounded-sm text-xs font-semibold">
              <Percent className="w-3 h-3" />-{discountPercent}%
            </div>
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col">
          {product.brand && <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{product.brand}</p>}
          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-burgundy transition-colors">{product.title}</h3>
          {product.volume_ml && <p className="text-xs text-gray-500 mb-2">{product.volume_ml}</p>}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">{product.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-2">
              {isOnSale && product.original_price && (
                <span className="text-sm text-gray-400 line-through">{formatJOD(product.original_price)}</span>
              )}
              <span className={`text-base font-bold ${isOnSale ? 'text-[#E53E3E]' : 'text-gray-900'}`}>{formatJOD(product.price)}</span>
            </div>
            <Button onClick={handleAddToCart} size="sm" className="bg-burgundy hover:bg-burgundy-light text-white text-xs">
              <ShoppingBag className="w-4 h-4 me-1" />
              {language === 'ar' ? 'إضافة' : 'Add'}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col animate-fade-in"
      onClick={() => onQuickView(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {isOnSale && discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-[#E53E3E] text-white px-2 py-1 rounded-sm text-xs font-semibold shadow-md">
            <Percent className="w-3 h-3" />-{discountPercent}%
          </div>
        )}
        {(product.category === 'Best Seller' || product.category === 'New Arrival') && (
          <Badge className={`absolute ${isOnSale ? 'top-10' : 'top-2'} left-2 z-10 font-medium text-[10px] uppercase tracking-wide px-2 py-1 flex items-center gap-1 shadow-sm border-0 ${product.category === 'Best Seller' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {product.category === 'Best Seller' && <Star className="w-3 h-3 fill-current" />}
            {product.category === 'New Arrival' && <Sparkles className="w-3 h-3" />}
            {product.category}
          </Badge>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-burgundy hover:text-white transition-all duration-200">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {product.brand && <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-medium">{product.brand}</p>}
        <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-burgundy transition-colors flex-grow">{product.title}</h3>
        {product.volume_ml && <p className="text-xs text-gray-500 mb-2">{product.volume_ml}</p>}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            {isOnSale && product.original_price && <span className="text-sm text-gray-400 line-through">{formatJOD(product.original_price)}</span>}
            <span className={`text-base font-bold ${isOnSale ? 'text-[#E53E3E]' : 'text-gray-900'}`}>{formatJOD(product.price)}</span>
          </div>
          <Button onClick={handleAddToCart} size="sm" className="w-full bg-burgundy hover:bg-burgundy-light text-white text-xs uppercase tracking-wide py-2.5">
            <ShoppingBag className="w-4 h-4 me-2" />{language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </article>
  );
};

// Main Shop Page
export default function Shop() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    categories: [],
    subcategories: [],
    brands: [],
    skinConcerns: [],
    priceRange: [0, 200],
    onSaleOnly: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          product.title.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Brand filter
      if (filters.brands.length > 0) {
        if (!product.brand || !filters.brands.includes(product.brand)) return false;
      }

      // Skin concerns filter
      if (filters.skinConcerns.length > 0) {
        const productConcerns = product.skin_concerns || [];
        const hasMatchingConcern = filters.skinConcerns.some(concern => 
          productConcerns.includes(concern)
        );
        if (!hasMatchingConcern) return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // On sale filter
      if (filters.onSaleOnly && !product.is_on_sale) return false;

      return true;
    });
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Hero Banner */}
        <div className="bg-burgundy text-white py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h1 className="text-2xl md:text-4xl font-semibold mb-2">
              {language === 'ar' ? 'تسوق جميع المنتجات' : 'Shop All Products'}
            </h1>
            <p className="text-cream/80 text-sm md:text-base">
              {language === 'ar' ? 'اكتشف أفضل منتجات العناية بالبشرة والجمال' : 'Discover premium skincare and beauty products'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="lg:flex lg:gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <ProductSearchFilters 
                filters={filters} 
                onFiltersChange={setFilters} 
                productCount={filteredProducts.length}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  {language === 'ar' 
                    ? `${filteredProducts.length} منتج`
                    : `${filteredProducts.length} products`}
                </p>
                
                <div className="flex items-center gap-3">
                  {/* Mobile Filters */}
                  <div className="lg:hidden">
                    <ProductSearchFilters 
                      filters={filters} 
                      onFiltersChange={setFilters} 
                      productCount={filteredProducts.length}
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-burgundy text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-burgundy text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500 mb-4">
                    {language === 'ar' ? 'لا توجد منتجات مطابقة للفلاتر' : 'No products match your filters'}
                  </p>
                  <Button variant="outline" onClick={() => setFilters({
                    searchQuery: '', categories: [], subcategories: [], brands: [], skinConcerns: [], priceRange: [0, 200], onSaleOnly: false,
                  })}>
                    {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                  </Button>
                </div>
              )}

              {/* Product Grid/List */}
              {!isLoading && filteredProducts.length > 0 && (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <ShopProductCard 
                      key={product.id} 
                      product={product} 
                      onQuickView={(p) => { setSelectedProduct(p); setIsQuickViewOpen(true); }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => { setIsQuickViewOpen(false); setTimeout(() => setSelectedProduct(null), 300); }}
      />
    </div>
  );
}