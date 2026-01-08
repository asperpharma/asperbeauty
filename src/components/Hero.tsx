import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

// Hero image - WebP for better compression
import heroSlide1 from "@/assets/hero/hero-slide-1.webp";

export const Hero = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="min-h-[80vh] lg:min-h-[90vh] flex flex-col-reverse lg:flex-row">
      {/* Left Side - Deep Burgundy (Text) - Shows second on mobile */}
      <div className="w-full lg:w-1/2 bg-burgundy flex items-center justify-center p-8 lg:p-16">
        <div className={`max-w-lg ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Script Sub-header */}
          <span className="font-script text-3xl lg:text-4xl text-gold mb-4 block">
            {isArabic ? 'الأناقة في كل تفصيلة' : 'Elegance in every detail'}
          </span>
          
          {/* Main Headline */}
          <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-6">
            {isArabic ? 'المعيار الجديد للجمال' : 'The New Standard of Beauty'}
          </h1>
          
          {/* Subtext */}
          <p className="font-body text-lg text-cream mb-10 leading-relaxed">
            {isArabic 
              ? 'مستحضرات تجميل طبية وعطور فاخرة منتقاة بعناية، توصل إلى باب منزلك.'
              : 'Curated dermo-cosmetics and luxury fragrances delivered to your door.'
            }
          </p>
          
          {/* CTA Button */}
          <Link to="/collections">
            <Button 
              className="bg-gold text-burgundy hover:bg-gold-light font-display text-sm tracking-widest uppercase px-10 py-6 transition-all duration-400"
            >
              {isArabic ? 'تسوق المجموعة' : 'Shop the Collection'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side - Hero Image with Parallax - Shows first on mobile */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative overflow-hidden">
        <div 
          ref={parallaxRef}
          className="absolute inset-0 lg:scale-110"
        >
          <img
            src={heroSlide1}
            alt={isArabic ? 'مجموعة الجمال الفاخرة' : 'Luxury Beauty Collection'}
            className="w-full h-full object-cover"
            fetchPriority="high"
            width={1920}
            height={1080}
            decoding="async"
          />
        </div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy/20 to-transparent pointer-events-none lg:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy/30 to-transparent pointer-events-none lg:hidden" />
      </div>
    </section>
  );
};
