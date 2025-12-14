import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

export default function BestSellers() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
              Best <span className="text-gold">Sellers</span>
            </h1>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="font-body text-primary/70 max-w-2xl mx-auto">
              Discover our most loved products, handpicked favorites from our discerning customers.
            </p>
          </div>

          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
