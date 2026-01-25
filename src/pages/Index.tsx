import { useState, useEffect } from "react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { LuxuryHero } from "@/components/LuxuryHero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { LuxuryCategories } from "@/components/LuxuryCategories";
import { LuxuryPromoBanner } from "@/components/LuxuryPromoBanner";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingSocials } from "@/components/FloatingSocials";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { MobileNav } from "@/components/MobileNav";
import { CategoryHighlights } from "@/components/CategoryHighlights";

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
      <GlobalHeader />
      <main>
        {/* 1. EMOTIONAL LAYER: The Cinematic Hero */}
        <LuxuryHero />

        {/* 2. TRUST LAYER: Brand Logos (Global Standards) */}
        <BrandMarquee />

        {/* 3. NAVIGATION LAYER: Luxury Category Bubbles */}
        <LuxuryCategories />

        {/* 4. EDITORIAL LAYER: Shop By Category - Large Image Blocks */}
        <CategoryHighlights />

        {/* 5. ADVERTISEMENT LAYER: The "High-End" Promo - Image Left */}
        <LuxuryPromoBanner variant="primary" position="left" />

        {/* 6. ADVERTISEMENT LAYER 2: Secondary Promo - Image Right */}
        <LuxuryPromoBanner variant="secondary" position="right" />

        {/* 7. NEWSLETTER LAYER: Email Capture */}
        <Newsletter />
      </main>
      <Footer />
      <BeautyAssistant />
      <ScrollToTop />
      <FloatingSocials />
      <MobileNav />
      {/* Add bottom padding on mobile for the fixed nav */}
      <div className="h-16 lg:hidden" />
    </div>
  );
};

export default Index;
