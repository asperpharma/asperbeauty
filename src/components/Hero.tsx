import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-taupe">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="luxury-container relative z-10 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Gold divider above headline */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8 opacity-0 animate-fade-up" />
          
          {/* Main Heading - Shiny Gold with glow effect */}
          <h1 
            className="font-display text-6xl md:text-8xl lg:text-9xl font-normal leading-tight opacity-0 animate-fade-up delay-100"
            style={{
              background: 'linear-gradient(135deg, hsl(46 100% 50%), hsl(46 100% 65%), hsl(46 100% 50%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 20px hsla(46, 100%, 50%, 0.3)',
              filter: 'drop-shadow(0 2px 4px hsla(46, 100%, 50%, 0.2))'
            }}
          >
            {t.heroTitle}
          </h1>

          {/* Gold divider below headline */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8 mb-10 opacity-0 animate-fade-up delay-200" />

          {/* Description - Charcoal text */}
          <p className="font-body text-charcoal text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-up delay-300">
            {t.heroSubtitle}
          </p>

          {/* CTA Button - Ivory with gold border */}
          <div className="opacity-0 animate-fade-up delay-400">
            <Button 
              variant="luxury-outline" 
              size="luxury-lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-ivory text-gold border-2 border-gold hover:bg-gold hover:text-charcoal font-display tracking-wider shadow-lg shadow-gold/20"
            >
              {t.discoverCollections}
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up delay-500">
          <a 
            href="#products"
            className="flex flex-col items-center gap-2 text-charcoal/60 hover:text-gold transition-colors"
          >
            <span className="font-body text-xs tracking-widest uppercase">{t.scroll}</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
