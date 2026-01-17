import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface LuxuryPromoBannerProps {
  variant?: "primary" | "secondary";
}

export const LuxuryPromoBanner = ({ variant = "primary" }: LuxuryPromoBannerProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const content = {
    primary: {
      eyebrow: isAr ? "عرض حصري" : "Exclusive Offer",
      headline: isAr ? "مجموعة الشتاء" : "Winter Collection",
      subheadline: isAr ? "خصم 25% على جميع منتجات العناية بالبشرة" : "25% Off All Skincare",
      cta: isAr ? "تسوق الآن" : "Shop Now",
      href: "/offers",
      bgClass: "bg-gradient-to-r from-primary/90 via-primary to-primary/80",
    },
    secondary: {
      eyebrow: isAr ? "وصل حديثاً" : "Just Arrived",
      headline: isAr ? "مجموعة الربيع الجديدة" : "Spring Essentials",
      subheadline: isAr ? "اكتشف أحدث المنتجات" : "Discover Fresh Arrivals",
      cta: isAr ? "اكتشف المزيد" : "Explore",
      href: "/shop",
      bgClass: "bg-gradient-to-r from-muted via-muted/80 to-muted",
    },
  };

  const c = content[variant];
  const isSecondary = variant === "secondary";

  return (
    <section className={`${c.bgClass} py-16 md:py-20`}>
      <div className="container mx-auto max-w-4xl px-4 text-center">
        {/* Eyebrow */}
        <span className={`mb-3 inline-block font-sans text-xs font-bold uppercase tracking-[0.3em] ${isSecondary ? "text-primary" : "text-primary-foreground/80"}`}>
          {c.eyebrow}
        </span>

        {/* Main Headline */}
        <h2 className={`font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl ${isSecondary ? "text-foreground" : "text-primary-foreground"}`}>
          {c.headline}
        </h2>

        {/* Subheadline */}
        <p className={`mx-auto mt-4 max-w-md font-sans text-lg ${isSecondary ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
          {c.subheadline}
        </p>

        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          variant={isSecondary ? "default" : "outline"}
          className={`group mt-8 px-8 py-6 font-sans text-sm font-medium uppercase tracking-widest transition-all duration-300 ${
            isSecondary 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          }`}
        >
          <Link to={c.href}>
            {c.cta}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LuxuryPromoBanner;
