import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Import category images
import skinCareImg from "@/assets/categories/skin-care.webp";
import hairCareImg from "@/assets/categories/hair-care.webp";
import makeUpImg from "@/assets/categories/make-up.webp";
import fragrancesImg from "@/assets/categories/fragrances.webp";
import bodyCareImg from "@/assets/categories/body-care.webp";

const CATEGORIES = [
  { 
    name: "Skin Care", 
    nameAr: "العناية بالبشرة", 
    image: skinCareImg,
    href: "/shop?category=Skin%20Care",
    color: "from-rose-200/80"
  },
  { 
    name: "Hair Care", 
    nameAr: "العناية بالشعر", 
    image: hairCareImg,
    href: "/shop?category=Hair%20Care",
    color: "from-amber-200/80"
  },
  { 
    name: "Make Up", 
    nameAr: "المكياج", 
    image: makeUpImg,
    href: "/shop?category=Makeup",
    color: "from-pink-200/80"
  },
  { 
    name: "Fragrances", 
    nameAr: "العطور", 
    image: fragrancesImg,
    href: "/shop?category=Fragrances",
    color: "from-purple-200/80"
  },
  { 
    name: "Body Care", 
    nameAr: "العناية بالجسم", 
    image: bodyCareImg,
    href: "/shop?category=Body%20Care",
    color: "from-emerald-200/80"
  },
];

export const LuxuryCategories = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block font-sans text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {isAr ? "تسوق حسب الفئة" : "Shop By Category"}
          </span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
            {isAr ? "اكتشف مجموعاتنا" : "Explore Our Collections"}
          </h2>
        </div>

        {/* Category Bubbles Grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group flex flex-col items-center gap-3"
            >
              {/* Circular Image with Hover Effect */}
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-muted bg-muted/30 transition-all duration-500 group-hover:border-primary group-hover:shadow-xl md:h-32 md:w-32">
                <img
                  src={category.image}
                  alt={isAr ? category.nameAr : category.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40`} />
              </div>
              
              {/* Category Name */}
              <span className="font-sans text-sm font-medium tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
                {isAr ? category.nameAr : category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryCategories;
