import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
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
          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal text-gold leading-tight mb-8 opacity-0 animate-fade-up">
            Unbox Pure Indulgence
          </h1>

          {/* Gold divider */}
          <div className="w-24 h-px bg-gold mx-auto my-10 opacity-0 animate-fade-up delay-100" />

          {/* Description */}
          <p className="font-body text-primary-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-up delay-200">
            Discover our curated collection of premium beauty boxes, 
            crafted with the finest ingredients for discerning individuals.
          </p>

          {/* CTA Button - Cream with gold border */}
          <div className="opacity-0 animate-fade-up delay-300">
            <Button 
              variant="luxury-outline" 
              size="luxury-lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-cream text-gold border-2 border-gold hover:bg-cream/90 font-display tracking-wider"
            >
              Discover Collections
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up delay-400">
          <a 
            href="#products"
            className="flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-gold transition-colors"
          >
            <span className="font-body text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
