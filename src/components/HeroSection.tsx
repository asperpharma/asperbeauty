import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { AnimatedTrustBadge } from './AnimatedTrustBadge';

// Generate random gold particles
const generateParticles = (count: number) => {
  return Array.from({
    length: count
  }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.5
  }));
};
const GoldParticles = () => {
  const [particles] = useState(() => generateParticles(40));
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => <div key={particle.id} className="absolute rounded-full bg-gradient-to-br from-[#FFC300] to-[#D4AF37]" style={{
      left: `${particle.left}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      opacity: particle.opacity,
      animation: `floatUp ${particle.duration}s ease-in-out infinite`,
      animationDelay: `${particle.delay}s`,
      boxShadow: `0 0 ${particle.size * 2}px rgba(255, 195, 0, 0.6)`
    }} />)}
      
      {/* Keyframe styles */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: ${0.3 + Math.random() * 0.4};
          }
          90% {
            opacity: ${0.3 + Math.random() * 0.4};
          }
          100% {
            transform: translateY(-20vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>;
};
const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  return <section className="relative h-screen w-full overflow-hidden">
      
      {/* --- 1. VIDEO BACKGROUND --- */}
      <div className="absolute inset-0">
        {/* Fallback image while video loads */}
        <img src="/hero-banner.png" alt="Asper Beauty" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <video autoPlay muted loop playsInline onLoadedData={() => setVideoLoaded(true)} className={`h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* --- 2. OVERLAY GRADIENTS --- */}
      {/* Soft ivory/cream overlay for readability */}
      <div className="absolute inset-0 bg-[#FFF8E1]/30" />
      
      {/* Bottom fade to blend into cream background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FFF8E1] to-transparent" />
      
      {/* Subtle warm vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(235,235,211,0.4)_80%)]" />

      {/* --- 3. FLOATING GOLD PARTICLES --- */}
      <GoldParticles />

      {/* --- 4. MAIN CONTENT --- */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        
        {/* Rotating Trust Badge */}
        <div className="mb-8">
          <AnimatedTrustBadge />
        </div>

        {/* Gold divider above headline */}
        <div className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-asper-charcoal mb-4 drop-shadow-sm">
          Discover Your Ritual
        </h1>

        {/* Gold divider below headline */}
        <div className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Sub-Headline */}
        <p className="max-w-xl text-lg md:text-xl text-asper-charcoal/80 font-sans mb-10">
          Curated luxury skincare & beauty from the world's most prestigious brands
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-asper-charcoal font-semibold px-8 py-6 text-base hover:shadow-[0_4px_20px_rgba(212,175,55,0.5)] transition-all duration-300 hover:scale-105"
          >
            Shop Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-asper-charcoal/30 text-asper-charcoal px-8 py-6 text-base hover:bg-asper-charcoal/5 hover:border-asper-charcoal/50 transition-all duration-300"
          >
            Explore Brands
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-16 font-serif text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
          Eternal Elegance
        </p>
      </div>
      
      {/* --- 5. SCROLL INDICATOR --- */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[#D4AF37]/60 bg-white/50 pt-2 backdrop-blur-sm">
          <div className="h-2 w-1 rounded-full bg-[#D4AF37]" />
        </div>
      </div>

    </section>;
};
export default HeroSection;