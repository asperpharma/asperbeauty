import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const brands = [{
  id: 'vichy',
  name: 'Vichy',
  href: '/brands/vichy'
}, {
  id: 'eucerin',
  name: 'Eucerin',
  href: '/brands/eucerin'
}, {
  id: 'svr',
  name: 'SVR',
  href: '/brands/svr'
}, {
  id: 'cetaphil',
  name: 'Cetaphil',
  href: '/brands/cetaphil'
}, {
  id: 'bioderma',
  name: 'Bioderma',
  href: '/brands/bioderma'
}, {
  id: 'bourjois',
  name: 'Bourjois',
  href: '/brands/bourjois'
}, {
  id: 'essence',
  name: 'Essence',
  href: '/brands/essence'
}, {
  id: 'isadora',
  name: 'IsaDora',
  href: '/brands/isadora'
}];
export const FeaturedBrands = () => {
  const {
    language
  } = useLanguage();
  const isArabic = language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  return <section className="py-16 lg:py-20 bg-cream">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-script text-2xl text-gold mb-2 block">
            {isArabic ? 'علامات تجارية فاخرة' : 'Luxury Brands'}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? 'العلامات المميزة' : 'Featured Brands'}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Arrows - Desktop */}
          <button onClick={() => scroll('left')} className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gold/30 items-center justify-center text-foreground hover:bg-gold hover:text-burgundy transition-all duration-400 opacity-0 group-hover:opacity-100 shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll('right')} className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gold/30 items-center justify-center text-foreground hover:bg-gold hover:text-burgundy transition-all duration-400 opacity-0 group-hover:opacity-100 shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Brands */}
          <div ref={scrollRef} className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {brands.map(brand => <Link key={brand.id} to={brand.href} className="group/brand flex-shrink-0 w-36 lg:w-44">
                {/* Brand Card */}
                <div className="rounded-lg p-6 lg:p-8 border border-gold/20 transition-all duration-400 hover:border-gold hover:shadow-lg text-center bg-rose-950">
                  {/* Brand Logo Placeholder - Gold text */}
                  <div className="h-16 lg:h-20 flex items-center justify-center mb-4">
                    <span className="font-display text-xl tracking-wider text-gold lg:text-3xl">
                      {brand.name}
                    </span>
                  </div>
                  
                  {/* Shop Link */}
                  <span className="font-body text-xs uppercase tracking-widest transition-colors duration-400 text-rose-50">
                    {isArabic ? 'تسوق الآن' : 'Shop Now'}
                  </span>
                </div>
              </Link>)}
          </div>
        </div>

        {/* View All Brands Link */}
        <div className="text-center mt-10">
          <Link to="/brands" className="inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest">
            {isArabic ? 'عرض جميع العلامات' : 'View All Brands'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>;
};