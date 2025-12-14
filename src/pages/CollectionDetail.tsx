import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

const collectionInfo: Record<string, { title: string; description: string }> = {
  "hair-care": {
    title: "Hair Care",
    description: "Luxurious treatments and products for every hair type, from nourishing shampoos to revitalizing treatments."
  },
  "body-care": {
    title: "Body Care",
    description: "Pamper your skin with our premium body care collection, featuring moisturizers, scrubs, and more."
  },
  "make-up": {
    title: "Make Up",
    description: "Enhance your natural beauty with our curated selection of premium makeup products."
  },
  "skincare": {
    title: "Skincare",
    description: "Premium skincare solutions for radiant, healthy-looking skin."
  },
  "fragrances": {
    title: "Fragrances",
    description: "Captivating scents for every occasion, from signature perfumes to subtle body mists."
  },
  "tools-devices": {
    title: "Tools & Devices",
    description: "Professional-grade beauty tools and devices for salon-quality results at home."
  }
};

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? collectionInfo[slug] : null;

  if (!collection) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-32 pb-20">
          <div className="luxury-container text-center">
            <h1 className="font-display text-4xl text-primary mb-4">Collection Not Found</h1>
            <p className="font-body text-primary/70">The collection you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="luxury-container">
          {/* Collection Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
              {collection.title}
            </h1>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="font-body text-primary/70 max-w-2xl mx-auto">
              {collection.description}
            </p>
          </div>

          {/* Products Grid - Will filter by collection in future */}
          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
