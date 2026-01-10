import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

// Hero image - Lifestyle
import heroLifestyle from "@/assets/hero/hero-lifestyle.webp";

export const Hero = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.4;
        parallaxRef.current.style.transform = `translateY(${rate}px) scale(1.1)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[70vh] lg:min-h-[85vh] overflow-hidden">
      {/* Full-width background image with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          ref={parallaxRef}
          className="absolute inset-0 scale-110 will-change-transform"
          style={{ transform: 'translateY(0) scale(1.1)' }}
        >
          <img
            src={heroLifestyle}
            alt={isArabic ? 'مجموعة الجمال الفاخرة' : 'Luxury Beauty Collection'}
            className="w-full h-full object-cover"
            fetchPriority="high"
            width={1920}
            height={1080}
            decoding="async"
          />
        </div>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy/70 via-burgundy/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 luxury-container h-full min-h-[70vh] lg:min-h-[85vh] flex items-center">
        <div className={`max-w-xl ${isArabic ? 'text-right mr-auto' : 'text-left'}`}>
          {/* Script Sub-header */}
          <span className="font-script text-2xl lg:text-3xl text-gold mb-4 block animate-fade-in">
            {isArabic ? 'علم باريسي. أناقة أردنية.' : 'Parisian Science.'}
          </span>
          
          {/* Main Headline */}
          <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {isArabic ? 'المعيار الجديد للجمال' : 'Jordanian Elegance.'}
          </h1>
          
          {/* Subtext */}
          <p className="font-body text-lg text-cream/90 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isArabic 
              ? 'اكتشف فيلورغا، الرائد العالمي في مكافحة الشيخوخة، متوفر الآن مع خدمة التوصيل السريع في عمّان.'
              : 'Discover Filorga, the world leader in anti-aging, now available with same-day concierge delivery in Amman.'
            }
          </p>
          
          {/* CTA Button */}
          <Link to="/collections/skin-care" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              className="bg-gold text-burgundy hover:bg-gold-light font-display text-sm tracking-widest uppercase px-10 py-6 transition-all duration-400 shadow-lg hover:shadow-xl"
            >
              {isArabic ? 'استكشف المختبر' : 'Explore the Laboratory'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
