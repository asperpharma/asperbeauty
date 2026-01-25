import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn("group", className)}>
      {/* Image Skeleton with Premium Shimmer */}
      <div className="aspect-[3/4] bg-gradient-to-br from-cream via-cream-dark/30 to-cream rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      
      {/* Text Skeleton with Staggered Shimmer */}
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-muted rounded-full w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <div className="h-4 bg-muted/70 rounded-full w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="h-5 bg-muted/50 rounded-full w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export const BrandCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn("flex-shrink-0", className)}>
      <div className="w-40 lg:w-48 rounded-xl p-6 lg:p-8 border border-gold/10 bg-cream/30">
        {/* Logo Skeleton */}
        <div className="h-20 lg:h-24 flex items-center justify-center mb-4">
          <div className="w-24 h-12 bg-muted rounded relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
        {/* Text Skeleton */}
        <div className="h-3 bg-muted/70 rounded-full w-16 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Circle Skeleton */}
      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-cream via-cream-dark/30 to-cream relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      {/* Text Skeleton */}
      <div className="mt-4 md:mt-5 h-4 bg-muted rounded-full w-20 relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
};

export const TestimonialCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn("bg-burgundy/5 border border-gold/10 rounded-lg p-8", className)}>
      {/* Quote Icon Skeleton */}
      <div className="w-10 h-10 bg-gold/10 rounded mb-6 relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      
      {/* Review Text Skeleton */}
      <div className="space-y-2 mb-6 min-h-[100px]">
        {[100, 85, 70, 80].map((width, i) => (
          <div 
            key={i} 
            className="h-3 bg-muted/30 rounded-full relative overflow-hidden" 
            style={{ width: `${width}%` }}
          >
            <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
          </div>
        ))}
      </div>
      
      {/* Stars Skeleton */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gold/20 rounded relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: `${i * 0.05}s` }} />
          </div>
        ))}
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-gold/10 mb-6" />
      
      {/* Author Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gold/20 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted/30 rounded-full w-24 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="h-3 bg-muted/20 rounded-full w-20 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("bg-gradient-to-br from-cream via-cream-dark/30 to-cream relative overflow-hidden", className)}>
      <div className="absolute inset-0 skeleton-shimmer" />
    </div>
  );
};
