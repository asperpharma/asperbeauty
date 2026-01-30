import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatProduct {
  id: string;
  title: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  is_on_sale: boolean | null;
  discount_percent: number | null;
  image_url: string | null;
  category: string;
  skin_concerns: string[] | null;
}

interface ChatProductCardProps {
  product: ChatProduct;
  onAddToCart?: (product: ChatProduct) => void;
}

export const ChatProductCard: React.FC<ChatProductCardProps> = ({ product, onAddToCart }) => {
  const { language } = useLanguage();

  return (
    <div className="flex gap-3 p-3 bg-white/80 rounded-xl border border-gold/20 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-cream/50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-gold/50" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gold font-medium uppercase tracking-wider">
          {product.brand || 'Asper'}
        </p>
        <h4 className="text-xs font-semibold text-burgundy line-clamp-2 leading-tight mt-0.5">
          {product.title}
        </h4>
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-burgundy">
            {product.price.toFixed(2)} JOD
          </span>
          {product.is_on_sale && product.original_price && (
            <>
              <span className="text-[10px] text-muted-foreground line-through">
                {product.original_price.toFixed(2)}
              </span>
              <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                -{product.discount_percent}%
              </span>
            </>
          )}
        </div>

        {/* Skin Concerns Tags */}
        {product.skin_concerns && product.skin_concerns.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {product.skin_concerns.slice(0, 2).map((concern, idx) => (
              <span
                key={idx}
                className="text-[8px] px-1.5 py-0.5 bg-burgundy/10 text-burgundy rounded-full"
              >
                {concern}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add Button */}
      {onAddToCart && (
        <button
          onClick={() => onAddToCart(product)}
          className="self-center p-2 rounded-full bg-burgundy hover:bg-burgundy-light text-gold transition-colors duration-300"
          aria-label={language === 'ar' ? 'أضف للسلة' : 'Add to cart'}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default ChatProductCard;
