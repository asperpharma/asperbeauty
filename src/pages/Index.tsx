import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
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
  const navigate = useNavigate();

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
        <AnimatedShaderHero
          trustBadge={{
            text: "Trusted by 50,000+ Beauty Enthusiasts",
            icons: ["✨", "💎", "🌟"]
          }}
          headline={{
            line1: "Discover Luxury",
            line2: "Beauty & Skincare"
          }}
          subtitle="Curated collections of premium beauty products from the world's most prestigious brands. Experience the art of self-care."
          buttons={{
            primary: {
              text: "Explore Collections",
              onClick: () => navigate("/collections")
            },
            secondary: {
              text: "Shop Best Sellers",
              onClick: () => navigate("/best-sellers")
            }
          }}
        />
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
