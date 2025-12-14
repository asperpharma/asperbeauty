import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

export default function Offers() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
              Special <span className="text-gold">Offers</span>
            </h1>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="font-body text-primary/70 max-w-2xl mx-auto">
              Exclusive deals on premium beauty products. Limited time only.
            </p>
          </div>

          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
