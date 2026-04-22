import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductReviewsProps {
  productId?: string;
  rating?: number;
  reviewCount?: number;
  compact?: boolean;
}

export const ProductReviews = ({ 
  rating = 4.8, 
  reviewCount = 24,
  compact = false 
}: ProductReviewsProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  // Generate full and partial stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Star Rating */}
      <div className="flex items-center gap-0.5">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star 
            key={`full-${i}`} 
            className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gold fill-gold`} 
          />
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gold`} />
            <Star 
              className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gold fill-gold absolute inset-0`}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        )}
        
        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-muted-foreground/30`} 
          />
        ))}
      </div>
      
      {/* Rating Number & Review Count */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span className="font-medium text-foreground">{rating}</span>
        <span className="text-muted-foreground/60">•</span>
        <span>
          ({reviewCount} {isArabic ? 'تقييم' : 'Reviews'})
        </span>
      </div>
    </div>
  );
};
