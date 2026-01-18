import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, ShieldCheck, Sparkles, Crown, Gem } from "lucide-react";

// Premium brand logos with elegant styling
import ceraveLogo from "@/assets/brands/cerave-logo.webp";
import theOrdinaryLogo from "@/assets/brands/the-ordinary-logo.webp";
import laRochePosayLogo from "@/assets/brands/la-roche-posay-logo.webp";
import paulasChoiceLogo from "@/assets/brands/paulas-choice-logo.webp";
import olaplexLogo from "@/assets/brands/olaplex-logo.webp";
import diorLogo from "@/assets/brands/dior-logo.webp";
import esteeLauderLogo from "@/assets/brands/estee-lauder-logo.webp";
import kerastaseLogo from "@/assets/brands/kerastase-logo.webp";

const BRANDS = [
  { name: "CeraVe", logo: ceraveLogo },
  { name: "The Ordinary", logo: theOrdinaryLogo },
  { name: "La Roche-Posay", logo: laRochePosayLogo },
  { name: "Paula's Choice", logo: paulasChoiceLogo },
  { name: "Olaplex", logo: olaplexLogo },
  { name: "Dior", logo: diorLogo },
  { name: "Estée Lauder", logo: esteeLauderLogo },
  { name: "Kérastase", logo: kerastaseLogo },
];

export const BrandMarquee = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="w-full bg-gradient-to-b from-cream to-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Elegant Header with Premium Icons */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/60" />
            <div className="relative flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold/70 animate-pulse" />
              <div className="relative">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
              </div>
              <Sparkles className="w-4 h-4 text-gold/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <p className="font-serif text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {isAr ? "موزع معتمد للعلامات الفاخرة" : "Authorized Luxury Retailer"}
          </p>
        </div>
        
        {/* Luxury Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8">
          {BRANDS.map((brand, index) => (
            <div
              key={brand.name}
              className="group relative flex items-center justify-center p-6 md:p-8 
                         bg-white/80 backdrop-blur-sm rounded-xl
                         border border-cream-dark/50 
                         shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)]
                         hover:shadow-[0_8px_32px_-4px_rgba(212,175,55,0.15)]
                         hover:border-gold/50
                         transition-all duration-500 ease-out
                         hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle gold glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-light/0 to-gold/0 
                              group-hover:from-gold-light/20 group-hover:to-gold/10 
                              transition-all duration-500" />
              
              <img
                src={brand.logo}
                alt={`${brand.name} Logo`}
                className="relative h-8 md:h-10 w-auto max-w-full object-contain 
                           filter grayscale opacity-70
                           group-hover:grayscale-0 group-hover:opacity-100
                           transition-all duration-500 ease-out"
                onError={(e) => {
                  // Elegant text fallback with luxury styling
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    const fallback = document.createElement('span');
                    fallback.className = 'relative font-serif text-sm md:text-base font-medium text-foreground/80 tracking-wider group-hover:text-burgundy transition-colors duration-300';
                    fallback.textContent = brand.name;
                    e.currentTarget.parentElement.appendChild(fallback);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom decorative element with Premium Icons */}
        <div className="flex items-center justify-center gap-3 mt-12 md:mt-16">
          <div className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 rounded-full border border-gold/20">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-gold drop-shadow-[0_1px_4px_rgba(212,175,55,0.3)]" strokeWidth={1.5} />
            <span className="text-gold text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase">
              {isAr ? "أصالة مضمونة" : "Authenticity Guaranteed"}
            </span>
            <Award className="w-5 h-5 md:w-6 md:h-6 text-gold drop-shadow-[0_1px_4px_rgba(212,175,55,0.3)]" strokeWidth={1.5} />
          </div>
          <div className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
        </div>
      </div>
    </section>
  );
};