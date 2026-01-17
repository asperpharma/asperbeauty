import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LuxuryHero } from "@/components/LuxuryHero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { LuxuryCategories } from "@/components/LuxuryCategories";
import { DealOfTheDay } from "@/components/DealOfTheDay";
import { LuxuryPromoBanner } from "@/components/LuxuryPromoBanner";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { BestSellersSection } from "@/components/BestSellersSection";
import { Newsletter } from "@/components/Newsletter";
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
        {/* 1. EMOTIONAL LAYER: The Cinematic Hero */}
        <LuxuryHero />

        {/* 2. TRUST LAYER: Brand Logos (Global Standards) */}
        <BrandMarquee />

        {/* 3. NAVIGATION LAYER: Luxury Category Bubbles */}
        <LuxuryCategories />

        {/* 4. URGENCY LAYER: iHerb-style "Deal of the Day" */}
        <DealOfTheDay />

        {/* 5. ADVERTISEMENT LAYER: The "High-End" Promo */}
        <LuxuryPromoBanner variant="primary" />

        {/* 6. DISCOVERY LAYER: Featured Collection */}
        <FeaturedCollection />

        {/* 7. BEST SELLERS LAYER: Global Favorites */}
        <BestSellersSection />

        {/* 8. ADVERTISEMENT LAYER 2: Secondary Promo */}
        <LuxuryPromoBanner variant="secondary" />

        {/* 9. NEWSLETTER LAYER: Email Capture */}
        <Newsletter />
      </main>
      <Footer />
      <BeautyAssistant />
      <ScrollToTop />
      <FloatingSocials />
    </div>
  );
};

export default Index;
