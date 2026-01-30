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
  
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF8E1] via-[#FFFDF5] to-[#FFF8E1]">
      
      {/* --- FLOATING GOLD PARTICLES --- */}
      <GoldParticles />
      
      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 lg:py-20">
        
        {/* Rotating Trust Badge */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <AnimatedTrustBadge />
        </div>

        {/* Gold divider above headline */}
        <div className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-fade-in" style={{ animationDelay: '0.3s' }} />

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-asper-charcoal mb-4 drop-shadow-sm text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Discover Your Ritual
        </h1>

        {/* Gold divider below headline */}
        <div className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-fade-in" style={{ animationDelay: '0.5s' }} />

        {/* Sub-Headline */}
        <p className="max-w-xl text-lg md:text-xl text-asper-charcoal/70 font-sans mb-10 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Curated luxury skincare & beauty from the world's most prestigious brands
        </p>

        {/* --- CINEMATIC VIDEO SHOWCASE --- */}
        <div className="relative w-full max-w-5xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          
          {/* Decorative Corner Accents */}
          <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-[#D4AF37]/60 rounded-tl-lg" />
          <div className="absolute -top-3 -right-3 w-16 h-16 border-r-2 border-t-2 border-[#D4AF37]/60 rounded-tr-lg" />
          <div className="absolute -bottom-3 -left-3 w-16 h-16 border-l-2 border-b-2 border-[#D4AF37]/60 rounded-bl-lg" />
          <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-[#D4AF37]/60 rounded-br-lg" />
          
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 via-transparent to-[#D4AF37]/20 blur-2xl -z-10 scale-105" />
          
          {/* Video Container with Gold Border */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.3),0_10px_30px_-10px_rgba(0,0,0,0.15)]">
            
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none z-10" />
            
            {/* Fallback image while video loads */}
            <img 
              src="/hero-banner.png" 
              alt="Asper Beauty" 
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} 
            />
            
            {/* Main Video */}
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              onLoadedData={() => setVideoLoaded(true)} 
              className={`w-full aspect-video object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            
            {/* Inner Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.15)_100%)] pointer-events-none" />
          </div>
          
          {/* "Now Playing" Label */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-[#D4AF37]/30 shadow-lg">
            <span className="text-xs uppercase tracking-[0.2em] text-asper-charcoal/60 font-sans">The Asper Experience</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-asper-charcoal font-semibold px-10 py-6 text-base hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] transition-all duration-300 hover:scale-105 rounded-full"
          >
            Shop Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-asper-charcoal/20 text-asper-charcoal px-10 py-6 text-base hover:bg-asper-charcoal/5 hover:border-[#D4AF37]/50 transition-all duration-300 rounded-full"
          >
            Explore Brands
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-12 font-serif text-sm uppercase tracking-[0.3em] text-[#D4AF37] animate-fade-in" style={{ animationDelay: '1s' }}>
          Eternal Elegance
        </p>
      </div>
      
      {/* --- SCROLL INDICATOR --- */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[#D4AF37]/60 bg-white/70 pt-2 backdrop-blur-sm shadow-lg">
          <div className="h-2 w-1 rounded-full bg-[#D4AF37]" />
        </div>
      </div>

    </section>
  );
};
export default HeroSection;