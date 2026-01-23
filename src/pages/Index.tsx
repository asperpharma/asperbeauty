import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-the-fold components for better initial load performance
const AmmanEdit = lazy(() => import("@/components/AmmanEdit").then(m => ({ default: m.AmmanEdit })));
const FeaturedBrands = lazy(() => import("@/components/FeaturedBrands").then(m => ({ default: m.FeaturedBrands })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const InstagramFeed = lazy(() => import("@/components/InstagramFeed").then(m => ({ default: m.InstagramFeed })));
const Newsletter = lazy(() => import("@/components/Newsletter").then(m => ({ default: m.Newsletter })));
const TrustBanner = lazy(() => import("@/components/TrustBanner").then(m => ({ default: m.TrustBanner })));
const BeautyAssistant = lazy(() => import("@/components/BeautyAssistant").then(m => ({ default: m.BeautyAssistant })));
const ScrollToTop = lazy(() => import("@/components/ScrollToTop").then(m => ({ default: m.ScrollToTop })));
const FloatingSocials = lazy(() => import("@/components/FloatingSocials").then(m => ({ default: m.FloatingSocials })));

// Lightweight skeleton for lazy sections
const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} bg-cream animate-pulse`}>
    <div className="luxury-container py-12">
      <Skeleton className="h-8 w-48 mx-auto mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

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
        
        {/* Lazy-loaded below-the-fold sections */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <AmmanEdit />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-32" />}>
          <FeaturedBrands />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <InstagramFeed />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <Newsletter />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-24" />}>
          <TrustBanner />
        </Suspense>
      </main>
      <Footer />
      
      {/* Lazy-loaded floating components */}
      <Suspense fallback={null}>
        <BeautyAssistant />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingSocials />
      </Suspense>
    </div>
  );
};

export default Index;
