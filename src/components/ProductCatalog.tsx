import { Plus, ShoppingBag, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// Product data structure
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: "New Arrival" | "Best Seller" | "Featured" | "Trending";
  image: string;
}

// Mock product data with high-quality Unsplash images
const products: Product[] = [
  {
    id: "1",
    title: "Luxury Hydrating Serum",
    price: 45.00,
    description: "Intensive hydration formula with hyaluronic acid for all skin types.",
    category: "Best Seller",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    title: "Vitamin C Brightening Cream",
    price: 52.00,
    description: "Powerful antioxidant cream that illuminates and evens skin tone.",
    category: "New Arrival",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Retinol Night Treatment",
    price: 68.00,
    description: "Advanced anti-aging formula that works while you sleep.",
    category: "Best Seller",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Rose Gold Eye Palette",
    price: 38.00,
    description: "Twelve shimmering shades for stunning eye looks day or night.",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    title: "Nourishing Hair Oil",
    price: 32.00,
    description: "Lightweight argan blend that restores shine and softness.",
    category: "Featured",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "6",
    title: "Signature Eau de Parfum",
    price: 95.00,
    description: "An enchanting blend of jasmine, amber, and warm vanilla notes.",
    category: "New Arrival",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "7",
    title: "Matte Velvet Lipstick",
    price: 24.00,
    description: "Long-lasting, richly pigmented color with a luxurious velvet finish.",
    category: "Best Seller",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "8",
    title: "SPF 50 Mineral Sunscreen",
    price: 42.00,
    description: "Lightweight, non-greasy protection with a natural matte finish.",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
  }
];

// Badge styling based on category
const getBadgeVariant = (category: Product["category"]) => {
  switch (category) {
    case "Best Seller":
      return "bg-gold text-burgundy";
    case "New Arrival":
      return "bg-burgundy text-white";
    case "Trending":
      return "bg-burgundy-light text-white";
    case "Featured":
      return "bg-gold/80 text-burgundy";
    default:
      return "bg-secondary text-foreground";
  }
};

// Badge icon based on category
const getBadgeIcon = (category: Product["category"]) => {
  switch (category) {
    case "Best Seller":
      return <Star className="w-3 h-3 fill-current" />;
    case "New Arrival":
      return <Sparkles className="w-3 h-3" />;
    default:
      return null;
  }
};

// ProductCard Component
const SimpleProductCard = ({ product }: { product: Product }) => {
  const { language } = useLanguage();

  const handleAddToCart = () => {
    toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart', {
      description: product.title,
      position: "top-center",
    });
  };

  return (
    <article className="group relative bg-white rounded-xl overflow-hidden border border-gold/10 shadow-gold-sm hover:shadow-gold-lg transition-all duration-500 ease-luxury">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-luxury group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge Overlay */}
        <Badge 
          className={`absolute top-3 left-3 z-10 ${getBadgeVariant(product.category)} font-body text-[10px] uppercase tracking-wider px-2.5 py-1 flex items-center gap-1.5 shadow-md border-0`}
        >
          {getBadgeIcon(product.category)}
          {product.category}
        </Badge>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Title */}
        <h3 className="font-display text-base md:text-lg text-foreground font-medium leading-tight line-clamp-1 group-hover:text-burgundy transition-colors duration-300">
          {product.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <p className="font-display text-lg md:text-xl font-semibold text-burgundy">
            JOD {product.price.toFixed(2)}
          </p>
          
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-burgundy hover:bg-burgundy-light text-white font-body text-xs uppercase tracking-wider px-4 py-2 shadow-gold-sm hover:shadow-gold-md transition-all duration-300"
          >
            <Plus className="w-4 h-4 me-1.5" />
            {language === 'ar' ? 'إضافة' : 'Add'}
          </Button>
        </div>
      </div>

      {/* Gold accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  );
};

// ProductCatalog Section Component
export const ProductCatalog = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-cream relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 mb-6 shadow-gold-badge">
            <ShoppingBag className="w-6 h-6 text-gold" />
          </div>

          {/* Subheading */}
          <p className="luxury-subheading text-gold mb-3">
            {language === 'ar' ? 'مجموعتنا المميزة' : 'Our Collection'}
          </p>

          {/* Main Heading */}
          <h2 className="luxury-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            {language === 'ar' ? 'منتجات فاخرة' : 'Luxury Essentials'}
          </h2>

          {/* Divider */}
          <div className="luxury-divider mt-6" />

          {/* Description */}
          <p className="font-body text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            {language === 'ar' 
              ? 'اكتشفي مجموعتنا المنتقاة بعناية من منتجات العناية بالبشرة والجمال الفاخرة'
              : 'Discover our carefully curated collection of premium skincare and beauty products'}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <SimpleProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16">
          <Button
            variant="outline"
            className="luxury-button-secondary px-8 py-4 font-body text-sm uppercase tracking-widest border-2 border-gold text-burgundy hover:bg-gold/10"
          >
            {language === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
          </Button>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
};

export default ProductCatalog;
