import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Brands() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
              Our <span className="text-gold">Brands</span>
            </h1>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="font-body text-primary/70 max-w-2xl mx-auto">
              We partner with the world's most prestigious beauty brands to bring you exceptional quality.
            </p>
          </div>

          <div className="text-center py-20 border border-gold/20 rounded-lg bg-cream">
            <p className="font-display text-primary/60 text-lg">Brand showcase coming soon</p>
            <p className="font-body text-primary/40 mt-2">Check back for our premium brand partners</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
