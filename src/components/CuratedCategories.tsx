import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Category images - WebP for better compression
import skinCare from "@/assets/categories/skin-care.webp";
import fragrances from "@/assets/categories/fragrances.webp";
import hairCare from "@/assets/categories/hair-care.webp";
import bodyCare from "@/assets/categories/body-care.webp";
import makeUp from "@/assets/categories/make-up.webp";
import toolsDevices from "@/assets/categories/tools-devices.webp";

const categories = [
  {
    id: 'dermo-cosmetics',
    name: 'Dermo-Cosmetics',
    nameAr: 'مستحضرات طبية',
    image: skinCare,
    href: '/collections/skin-care'
  },
  {
    id: 'luxury-scents',
    name: 'Luxury Scents',
    nameAr: 'عطور فاخرة',
    image: fragrances,
    href: '/collections/fragrances'
  },
  {
    id: 'organic-hair',
    name: 'Organic Hair',
    nameAr: 'عناية الشعر',
    image: hairCare,
    href: '/collections/hair-care'
  },
  {
    id: 'mother-baby',
    name: 'Mother & Baby',
    nameAr: 'الأم والطفل',
    image: bodyCare,
    href: '/collections/body-care'
  },
  {
    id: 'supplements',
    name: 'Supplements',
    nameAr: 'المكملات',
    image: toolsDevices,
    href: '/collections/supplements'
  },
  {
    id: 'mens-care',
    name: "Men's Care",
    nameAr: 'عناية الرجال',
    image: makeUp,
    href: '/collections/men'
  },
];

export const CuratedCategories = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? 'منتقى لك' : 'Curated for You'}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        {/* Circular Category Cards - Horizontal Scroll on Mobile */}
        <div 
          className="flex md:grid md:grid-cols-6 gap-6 lg:gap-10 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={category.href}
              className="group flex flex-col items-center flex-shrink-0"
            >
              {/* Circular Image Container */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-gold transition-all duration-400 group-hover:border-gold-light group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <div className="absolute inset-0 transition-transform duration-400 group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={isArabic ? category.nameAr : category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={128}
                    height={128}
                  />
                </div>
                {/* Gold glow overlay on hover */}
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-400" />
              </div>
              
              {/* Category Label */}
              <span className="mt-3 md:mt-4 font-body text-xs md:text-sm text-foreground text-center transition-colors duration-400 group-hover:text-gold whitespace-nowrap">
                {isArabic ? category.nameAr : category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
