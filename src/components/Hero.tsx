import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="luxury-container relative z-10 text-center pt-20">
        <div className="max-w-3xl mx-auto">
          {/* Tagline */}
          <p className="luxury-subheading text-accent mb-6 opacity-0 animate-fade-up">
            Luxury Beauty Essentials
          </p>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-none mb-8 opacity-0 animate-fade-up delay-100">
            Unveil Your
            <span className="block italic text-accent mt-2">Natural Radiance</span>
          </h1>

          {/* Divider */}
          <div className="luxury-divider my-10 opacity-0 animate-fade-up delay-200" />

          {/* Description */}
          <p className="font-body text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-up delay-300">
            Discover our curated collection of premium skincare and beauty products, 
            crafted with the finest ingredients for discerning individuals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up delay-400">
            <Button 
              variant="luxury" 
              size="luxury-lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Collection
            </Button>
            <Button 
              variant="luxury-outline" 
              size="luxury-lg"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Our Story
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up delay-500">
          <a 
            href="#products"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <span className="luxury-subheading">Scroll</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
