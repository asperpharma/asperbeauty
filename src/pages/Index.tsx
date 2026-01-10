import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AmmanEdit } from "@/components/AmmanEdit";
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
    // Simulate initial page load with minimum skeleton display time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-cream animate-fade-in">
      <Header />
      <main className="pt-28 md:pt-32 lg:pt-36">
        <Hero />
        <AmmanEdit />
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
