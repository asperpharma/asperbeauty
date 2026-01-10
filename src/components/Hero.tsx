import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

// Hero assets
import heroLifestyle from "@/assets/hero/hero-lifestyle.webp";
import heroVideo from "@/assets/hero/hero-video.mp4";

// Toggle between video and image background
const USE_VIDEO_BACKGROUND = true;

export const Hero = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Enhanced parallax effect with multiple layers
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollY(scrolled);
      
      // Background moves slower (parallax depth effect)
      if (parallaxRef.current) {
        const bgRate = scrolled * 0.5;
        parallaxRef.current.style.transform = `translateY(${bgRate}px) scale(1.15)`;
      }
      
      // Content moves slightly faster for depth
      if (contentRef.current) {
        const contentRate = scrolled * 0.2;
        const opacity = Math.max(0, 1 - scrolled / 600);
        contentRef.current.style.transform = `translateY(${contentRate}px)`;
        contentRef.current.style.opacity = `${opacity}`;
      }
      
      // Overlay darkens as you scroll
      if (overlayRef.current) {
        const overlayOpacity = Math.min(0.8, 0.4 + scrolled / 1000);
        overlayRef.current.style.background = `linear-gradient(to right, rgba(103, 32, 46, ${overlayOpacity}), rgba(103, 32, 46, ${overlayOpacity * 0.6}), transparent)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[70vh] lg:min-h-[85vh] overflow-hidden">
      {/* Full-width background image with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          ref={parallaxRef}
          className="absolute inset-[-10%] scale-115 will-change-transform transition-transform duration-100 ease-out"
          style={{ transform: 'translateY(0) scale(1.15)' }}
        >
          {USE_VIDEO_BACKGROUND ? (
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              poster={heroLifestyle}
              className="w-full h-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
              {/* Fallback to image if video fails */}
              <img
                src={heroLifestyle}
                alt={isArabic ? 'مجموعة الجمال الفاخرة' : 'Luxury Beauty Collection'}
                className="w-full h-full object-cover"
              />
            </video>
          ) : (
            <img
              src={heroLifestyle}
              alt={isArabic ? 'مجموعة الجمال الفاخرة' : 'Luxury Beauty Collection'}
              className="w-full h-full object-cover"
              fetchPriority="high"
              width={1920}
              height={1080}
              decoding="async"
            />
          )}
        </div>
        
        {/* Animated gradient overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 transition-all duration-300 ease-out"
          style={{ background: 'linear-gradient(to right, rgba(103, 32, 46, 0.75), rgba(103, 32, 46, 0.45), transparent)' }}
        />
        
        {/* Decorative floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-2 h-2 bg-gold/30 rounded-full blur-sm"
            style={{ 
              top: '20%', 
              left: '15%',
              transform: `translateY(${scrollY * -0.3}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div 
            className="absolute w-3 h-3 bg-gold/20 rounded-full blur-sm"
            style={{ 
              top: '40%', 
              left: '25%',
              transform: `translateY(${scrollY * -0.5}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div 
            className="absolute w-1.5 h-1.5 bg-cream/30 rounded-full blur-sm"
            style={{ 
              top: '60%', 
              left: '10%',
              transform: `translateY(${scrollY * -0.4}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div 
            className="absolute w-2 h-2 bg-gold/25 rounded-full blur-sm"
            style={{ 
              top: '30%', 
              left: '35%',
              transform: `translateY(${scrollY * -0.6}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>
      </div>

      {/* Content overlay with parallax */}
      <div 
        ref={contentRef}
        className="relative z-10 luxury-container h-full min-h-[70vh] lg:min-h-[85vh] flex items-center will-change-transform"
        style={{ transform: 'translateY(0)', opacity: 1 }}
      >
        <div className={`max-w-xl ${isArabic ? 'text-right mr-auto' : 'text-left'}`}>
          {/* Script Sub-header with staggered animation */}
          <span 
            className="font-script text-2xl lg:text-3xl text-gold mb-4 block animate-fade-in"
            style={{ 
              animationDelay: '0.1s',
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {isArabic ? 'علم باريسي. أناقة أردنية.' : 'Parisian Science.'}
          </span>
          
          {/* Main Headline with different parallax rate */}
          <h1 
            className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-6 animate-fade-in" 
            style={{ 
              animationDelay: '0.2s',
              transform: `translateY(${scrollY * 0.08}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {isArabic ? 'المعيار الجديد للجمال' : 'Jordanian Elegance.'}
          </h1>
          
          {/* Subtext with subtle parallax */}
          <p 
            className="font-body text-lg text-cream/90 mb-10 leading-relaxed animate-fade-in" 
            style={{ 
              animationDelay: '0.3s',
              transform: `translateY(${scrollY * 0.05}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {isArabic 
              ? 'اكتشف فيلورغا، الرائد العالمي في مكافحة الشيخوخة، متوفر الآن مع خدمة التوصيل السريع في عمّان.'
              : 'Discover Filorga, the world leader in anti-aging, now available with same-day concierge delivery in Amman.'
            }
          </p>
          
          {/* CTA Button with hover lift effect */}
          <Link 
            to="/collections/skin-care" 
            className="inline-block animate-fade-in" 
            style={{ 
              animationDelay: '0.4s',
              transform: `translateY(${scrollY * 0.03}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <Button 
              className="bg-gold text-burgundy hover:bg-gold-light font-display text-sm tracking-widest uppercase px-10 py-6 
                transition-all duration-400 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
            >
              {isArabic ? 'استكشف المختبر' : 'Explore the Laboratory'}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500"
        style={{ opacity: scrollY > 100 ? 0 : 1 }}
      >
        <span className="text-cream/70 text-xs font-body tracking-widest uppercase">
          {isArabic ? 'اكتشف المزيد' : 'Scroll to explore'}
        </span>
        <div className="w-6 h-10 border-2 border-cream/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
        </div>
      </div>

      {/* Video Sound Control Button */}
      {USE_VIDEO_BACKGROUND && (
        <button
          onClick={toggleMute}
          className={`absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full 
            flex items-center justify-center transition-all duration-300
            backdrop-blur-sm border border-cream/30
            ${isMuted 
              ? 'bg-cream/10 hover:bg-cream/20' 
              : 'bg-gold/80 hover:bg-gold'
            }
            group shadow-lg hover:shadow-xl hover:scale-110`}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-cream group-hover:scale-110 transition-transform" />
          ) : (
            <Volume2 className="w-5 h-5 text-burgundy group-hover:scale-110 transition-transform" />
          )}
          
          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 px-3 py-1 bg-foreground text-cream text-xs font-body 
            rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {isMuted 
              ? (isArabic ? 'تشغيل الصوت' : 'Unmute') 
              : (isArabic ? 'كتم الصوت' : 'Mute')
            }
          </span>
        </button>
      )}
    </section>
  );
};
