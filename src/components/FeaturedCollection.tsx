import React from "react";
import { LuxuryProductCard } from "@/components/LuxuryProductCard";

// Mock data to visualize the result. 
// In production, fetch this from Supabase: 
// const { data } = await supabase.from('products').select('*').limit(4);
const FEATURED_PRODUCTS = [
  {
    id: "1",
    title: "Midnight Recovery Concentrate",
    category: "Skin Care",
    price: "42.000",
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    is_new: true,
  },
  {
    id: "2",
    title: "Velvet Matte Lip Elixir",
    category: "Makeup",
    price: "24.500",
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Gold Repair Shampoo",
    category: "Hair Care",
    price: "18.000",
    image_url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Radiance Boost Serum",
    category: "Skin Care",
    price: "36.000",
    image_url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
    is_new: true,
  },
];

export const FeaturedCollection = () => {
  return (
    <section id="featured-collection" className="bg-cream py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-3 inline-block font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-500">
            Selected For You
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-luxury-black md:text-5xl">
            The Iconic Edit
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gold-300" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <LuxuryProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;
