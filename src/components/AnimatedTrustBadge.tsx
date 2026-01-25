import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ShieldCheck, 
  Award, 
  Truck, 
  Sparkles, 
  Crown, 
  Gem, 
  BadgeCheck,
  Star
} from "lucide-react";

const trustBadges = [
  {
    id: 'authentic',
    icon: ShieldCheck,
    label: '100% Authentic',
    labelAr: 'أصلي 100%',
    color: 'from-gold via-gold-light to-gold',
  },
  {
    id: 'certified',
    icon: BadgeCheck,
    label: 'JFDA Certified',
    labelAr: 'معتمد من JFDA',
    color: 'from-gold-light via-gold to-gold-light',
  },
  {
    id: 'delivery',
    icon: Truck,
    label: 'Same-Day Delivery',
    labelAr: 'توصيل في نفس اليوم',
    color: 'from-gold via-gold-light to-gold',
  },
  {
    id: 'premium',
    icon: Crown,
    label: 'Premium Selection',
    labelAr: 'اختيار فاخر',
    color: 'from-gold-light via-gold to-gold-light',
  },
  {
    id: 'award',
    icon: Award,
    label: 'Award Winning',
    labelAr: 'حائز على جوائز',
    color: 'from-gold via-gold-light to-gold',
  },
];

export const AnimatedTrustBadge = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % trustBadges.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentBadge = trustBadges[currentIndex];
  const IconComponent = currentBadge.icon;

  return (
    <div 
      className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full 
        bg-gradient-to-r from-burgundy/90 via-burgundy to-burgundy/90
        border-2 border-gold/50 hover:border-gold/80
        backdrop-blur-md 
        shadow-[0_4px_30px_rgba(212,175,55,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] 
        hover:shadow-[0_8px_40px_rgba(212,175,55,0.35)]
        transition-all duration-500 group cursor-default
        relative overflow-hidden"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 animate-pulse opacity-50" />
      
      {/* Sparkle decorations */}
      <Sparkles 
        className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gold/50 animate-pulse" 
        style={{ animationDelay: '0.2s' }}
      />
      <Sparkles 
        className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gold/50 animate-pulse" 
        style={{ animationDelay: '0.7s' }}
      />

      {/* Rotating Icon Container */}
      <div className="relative flex-shrink-0">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-gold/30 blur-md scale-150 animate-pulse" />
        
        <div 
          className={`
            relative w-9 h-9 rounded-full 
            bg-gradient-to-br ${currentBadge.color}
            flex items-center justify-center
            shadow-[0_2px_15px_rgba(212,175,55,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
            transition-all duration-500
            ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
          `}
        >
          <IconComponent 
            className="w-5 h-5 text-burgundy drop-shadow-sm" 
            strokeWidth={2} 
          />
        </div>

        {/* Orbiting gems */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <Gem className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 text-gold/70" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDelay: '-4s' }}>
          <Star className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 text-gold/70 fill-gold/30" />
        </div>
      </div>

      {/* Rotating Text */}
      <div className="relative overflow-hidden h-5 min-w-[140px]">
        <span 
          className={`
            absolute inset-0 flex items-center
            font-display text-sm text-cream tracking-wider uppercase
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]
            transition-all duration-300 ease-out
            ${isAnimating 
              ? 'translate-y-full opacity-0' 
              : 'translate-y-0 opacity-100'
            }
          `}
        >
          {isArabic ? currentBadge.labelAr : currentBadge.label}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 ml-1">
        {trustBadges.map((_, idx) => (
          <div 
            key={idx}
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300
              ${idx === currentIndex 
                ? 'bg-gold shadow-[0_0_6px_rgba(212,175,55,0.8)] scale-125' 
                : 'bg-cream/30 hover:bg-cream/50'
              }
            `}
          />
        ))}
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};
