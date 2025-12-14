import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-primary">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="luxury-container relative z-10 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Gold divider above headline */}
          <div className="w-32 h-px bg-gold mx-auto mb-8 opacity-0 animate-fade-up" />
          
          {/* Main Heading - larger size */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-normal text-gold leading-tight opacity-0 animate-fade-up delay-100">
            {t.heroTitle}
          </h1>

          {/* Gold divider below headline */}
          <div className="w-32 h-px bg-gold mx-auto mt-8 mb-10 opacity-0 animate-fade-up delay-200" />

          {/* Description */}
          <p className="font-body text-primary-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-up delay-300">
            {t.heroSubtitle}
          </p>

          {/* CTA Button - Cream with gold border */}
          <div className="opacity-0 animate-fade-up delay-400">
            <Button 
              variant="luxury-outline" 
              size="luxury-lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-cream text-gold border-2 border-gold hover:bg-cream/90 font-display tracking-wider"
            >
              {t.discoverCollections}
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up delay-500">
          <a 
            href="#products"
            className="flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-gold transition-colors"
          >
            <span className="font-body text-xs tracking-widest uppercase">{t.scroll}</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
