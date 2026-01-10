import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CuratedCategories } from "@/components/CuratedCategories";
import { AmmanEdit } from "@/components/AmmanEdit";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { TrustBanner } from "@/components/TrustBanner";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingSocials } from "@/components/FloatingSocials";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-28 md:pt-32 lg:pt-36">
        <Hero />
        <CuratedCategories />
        <AmmanEdit />
        <FeaturedBrands />
        <Testimonials />
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
