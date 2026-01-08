import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CuratedCategories } from "@/components/CuratedCategories";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { BestSellers } from "@/components/BestSellers";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-28 md:pt-32 lg:pt-36">
        <Hero />
        <CuratedCategories />
        <FeaturedBrands />
        <BestSellers />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <BeautyAssistant />
    </div>
  );
};

export default Index;
