import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LuxuryHero } from "@/components/LuxuryHero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingSocials } from "@/components/FloatingSocials";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        {/* 1. The High-End Editorial Banner */}
        <LuxuryHero />
        
        {/* 2. The Real Brand Logos (Dior, CeraVe, etc.) */}
        <BrandMarquee />
        
        {/* 3. The Actual Products (Olaplex, Ordinary, etc.) */}
        <FeaturedCollection />
      </main>
      <Footer />
      <BeautyAssistant />
      <ScrollToTop />
      <FloatingSocials />
    </div>
  );
};

export default Index;
