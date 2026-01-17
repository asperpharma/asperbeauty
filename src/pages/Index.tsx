import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LuxuryHero } from "@/components/LuxuryHero";
import { AmmanEdit } from "@/components/AmmanEdit";
import { ProductCatalog } from "@/components/ProductCatalog";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { Testimonials } from "@/components/Testimonials";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Newsletter } from "@/components/Newsletter";
import { TrustBanner } from "@/components/TrustBanner";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingSocials } from "@/components/FloatingSocials";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    
    // Hide skeleton once window loads or timeout finishes (whichever comes last for safety)
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
    <div className="min-h-screen bg-cream animate-fade-in">
      <Header />
      <main>
        <LuxuryHero />
        <AmmanEdit />
        <ProductCatalog />
        <FeaturedBrands />
        <Testimonials />
        <InstagramFeed />
        <Newsletter />
        <TrustBanner />
      </main>
      <Footer />
      <BeautyAssistant />
      <ScrollToTop />
      <FloatingSocials />
    </div>
  );
};

export default Index;
