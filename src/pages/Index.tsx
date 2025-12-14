import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <Testimonials />
        <About />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
