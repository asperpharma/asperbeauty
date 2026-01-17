import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// List of real brands - fetches logos automatically via Clearbit API
const BRANDS = [
  { name: "CeraVe", domain: "cerave.com" },
  { name: "The Ordinary", domain: "theordinary.com" },
  { name: "La Roche-Posay", domain: "laroche-posay.us" },
  { name: "Paula's Choice", domain: "paulaschoice.com" },
  { name: "Olaplex", domain: "olaplex.com" },
  { name: "Dior", domain: "dior.com" },
  { name: "Estée Lauder", domain: "esteelauder.com" },
  { name: "Kérastase", domain: "kerastase-usa.com" },
];

export const BrandMarquee = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="w-full border-y border-muted bg-background py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-8 font-sans text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          {isAr ? "موزع معتمد لـ" : "Authorized Retailer For"}
        </p>
        
        {/* Logo Grid */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-70 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="group relative flex items-center justify-center">
              <img
                src={`https://logo.clearbit.com/${brand.domain}?size=80`}
                alt={`${brand.name} Logo`}
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  // Fallback: show brand name if logo fails
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = `<span class="font-serif text-lg text-foreground">${brand.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
