import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* --- 1. VIDEO BACKGROUND --- */}
      <div className="absolute inset-0">
        {/* Fallback image while video loads */}
        <img 
          src="/hero-banner.png"
          alt="Asper Beauty"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* --- 2. OVERLAY GRADIENTS --- */}
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-asper-merlot/40" />
      
      {/* Bottom fade to blend into next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-asper-merlot to-transparent" />
      
      {/* Radial vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(74,4,4,0.6)_80%)]" />

      {/* --- 3. MAIN CONTENT --- */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        
        {/* Gold divider above headline */}
        <div className="mb-6 h-px w-24 bg-gradient-to-r from-transparent via-asper-gold to-transparent" />

        {/* Headline */}
        <h1 className="mb-4 font-serif text-5xl font-bold leading-tight text-asper-ivory md:text-7xl lg:text-8xl">
          Unveil Your{' '}
          <span className="bg-gold-shimmer bg-clip-text text-transparent">
            Golden Glow
          </span>
        </h1>

        {/* Gold divider below headline */}
        <div className="mb-8 h-px w-24 bg-gradient-to-r from-transparent via-asper-gold to-transparent" />

        {/* Sub-Headline */}
        <p className="mb-10 max-w-2xl font-sans text-lg text-asper-ivory/85 md:text-xl">
          The perfect union of nature's purity and regal luxury.{' '}
          <br className="hidden md:block" />
          Organic skincare crafted to restore your eternal radiance.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-asper-gold px-10 py-6 font-sans text-sm font-semibold uppercase tracking-widest text-asper-merlot transition-all duration-300 hover:bg-asper-goldLight hover:shadow-lg hover:shadow-asper-gold/30"
          >
            Shop Collection
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="group border-2 border-asper-gold/60 bg-transparent px-10 py-6 font-sans text-sm font-semibold uppercase tracking-widest text-asper-ivory transition-all duration-300 hover:border-asper-gold hover:bg-asper-gold/10"
          >
            Discover Rituals
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-16 font-serif text-sm uppercase tracking-[0.3em] text-asper-gold/80">
          Eternal Elegance
        </p>
      </div>
      
      {/* --- 4. SCROLL INDICATOR --- */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-asper-gold/50 pt-2">
          <div className="h-2 w-1 rounded-full bg-asper-gold" />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
