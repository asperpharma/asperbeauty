import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { LazyImage } from "./LazyImage";

// Brand logos
import vichyLogo from "@/assets/brands/vichy-logo.webp";
import eucerinLogo from "@/assets/brands/eucerin-logo.webp";
import svrLogo from "@/assets/brands/svr-logo.webp";
import cetaphilLogo from "@/assets/brands/cetaphil-logo.webp";
import biodermaLogo from "@/assets/brands/bioderma-logo.webp";
import bourjoisLogo from "@/assets/brands/bourjois-logo.webp";
import essenceLogo from "@/assets/brands/essence-logo.webp";
import isadoraLogo from "@/assets/brands/isadora-logo.webp";

const brands = [
  {
    id: 'vichy',
    name: 'Vichy',
    logo: vichyLogo,
    href: '/brands/vichy'
  },
  {
    id: 'eucerin',
    name: 'Eucerin',
    logo: eucerinLogo,
    href: '/brands/eucerin'
  },
  {
    id: 'svr',
    name: 'SVR',
    logo: svrLogo,
    href: '/brands/svr'
  },
  {
    id: 'cetaphil',
    name: 'Cetaphil',
    logo: cetaphilLogo,
    href: '/brands/cetaphil'
  },
  {
    id: 'bioderma',
    name: 'Bioderma',
    logo: biodermaLogo,
    href: '/brands/bioderma'
  },
  {
    id: 'bourjois',
    name: 'Bourjois',
    logo: bourjoisLogo,
    href: '/brands/bourjois'
  },
  {
    id: 'essence',
    name: 'Essence',
    logo: essenceLogo,
    href: '/brands/essence'
  },
  {
    id: 'isadora',
    name: 'IsaDora',
    logo: isadoraLogo,
    href: '/brands/isadora'
  }
];

export const FeaturedBrands = () => {
  const { language } = useLanguage();
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

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12" animation="slide-up" duration={800}>
          <span className="font-script text-2xl text-gold mb-2 block">
            {isArabic ? 'علامات تجارية فاخرة' : 'Luxury Brands'}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? 'العلامات المميزة' : 'Featured Brands'}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </AnimatedSection>

        {/* Carousel Container */}
        <AnimatedSection animation="fade-up" delay={200} duration={900}>
          <div className="relative group">
            {/* Navigation Arrows - Desktop */}
            <button 
              onClick={() => scroll('left')} 
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gold/30 items-center justify-center text-foreground hover:bg-gold hover:text-white transition-all duration-400 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gold/30 items-center justify-center text-foreground hover:bg-gold hover:text-white transition-all duration-400 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scrollable Brands */}
            <div 
              ref={scrollRef} 
              className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {brands.map(brand => (
                <Link 
                  key={brand.id} 
                  to={brand.href} 
                  className="group/brand flex-shrink-0"
                >
                  {/* Brand Card */}
                  <div className="w-40 lg:w-48 rounded-xl p-6 lg:p-8 border border-gold/10 bg-cream/30 transition-all duration-400 hover:border-gold/40 hover:shadow-xl hover:bg-white text-center">
                    {/* Brand Logo */}
                    <div className="h-20 lg:h-24 flex items-center justify-center mb-4">
                      <LazyImage 
                        src={brand.logo} 
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-400 group-hover/brand:scale-110"
                        loading="lazy"
                        width={150}
                        height={80}
                        skeletonClassName="rounded"
                      />
                    </div>
                    
                    {/* Shop Link - appears on hover */}
                    <span className="font-body text-xs uppercase tracking-widest text-burgundy/60 group-hover/brand:text-gold transition-colors duration-400">
                      {isArabic ? 'تسوق الآن' : 'Shop Now'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* View All Brands Link */}
        <AnimatedSection animation="zoom" delay={500} duration={800} className="text-center mt-10">
          <Link 
            to="/brands" 
            className="inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest group"
          >
            {isArabic ? 'عرض جميع العلامات' : 'View All Brands'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};
