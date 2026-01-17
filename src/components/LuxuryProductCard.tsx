import React from "react";
import { ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductProps {
  id: string;
  title: string;
  category: string;
  price: string | number;
  image_url: string;
  is_new?: boolean;
}

export const LuxuryProductCard = ({ product }: { product: ProductProps }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden bg-soft-ivory transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]"
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {product.is_new && (
          <Badge className="absolute left-3 top-3 z-10 border-none bg-gold-300 font-sans text-[10px] font-medium uppercase tracking-widest text-luxury-black">
            New Arrival
          </Badge>
        )}

        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* 'Quick Add' Overlay - Slides up slowly */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-luxury-black/80 p-4 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:translate-y-0">
          <Button
            variant="ghost"
            className="w-full font-sans text-xs font-medium uppercase tracking-widest text-soft-ivory hover:bg-gold-300 hover:text-luxury-black"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Bag
          </Button>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex flex-grow flex-col p-4">
        <span className="mb-1 font-sans text-[10px] font-medium uppercase tracking-widest text-gold-500">
          {product.category}
        </span>

        <h3 className="font-serif text-base font-medium leading-snug text-luxury-black transition-colors group-hover:text-gold-500">
          {product.title}
        </h3>

        {/* Price & Rating */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-sans text-sm font-semibold text-luxury-charcoal">
            {product.price} JOD
          </span>
          <span className="flex items-center gap-1 text-gold-300">
            <Star className="h-3 w-3 fill-current" />
            <span className="font-sans text-xs text-luxury-charcoal">4.9</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default LuxuryProductCard;
