import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// Hero slide images
import heroSlide1 from "@/assets/hero/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero/hero-slide-2.jpg";
import newArrivalsTile from "@/assets/hero/new-arrivals-tile.jpg";
import specialOffersTile from "@/assets/hero/special-offers-tile.jpg";

const slides = [
  {
    image: heroSlide1,
    title: "Asper Luxury Collections",
    titleAr: "مجموعات أسبر الفاخرة",
    subtitle: "Discover Premium Beauty",
    subtitleAr: "اكتشفي الجمال الفاخر",
  },
  {
    image: heroSlide2,
    title: "Exclusive Gift Sets",
    titleAr: "مجموعات هدايا حصرية",
    subtitle: "Perfect for Every Occasion",
    subtitleAr: "مثالية لكل مناسبة",
  },
];

export const Hero = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const progress = count > 0 ? ((current + 1) / count) * 100 : 0;

  return (
    <section className="bg-soft-ivory pt-4 pb-8">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main Slider - 70% width */}
          <div className="lg:col-span-7 relative">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                      <img
                        src={slide.image}
                        alt={isArabic ? slide.titleAr : slide.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Text Content */}
                      <div className={`absolute bottom-8 ${isArabic ? 'right-8' : 'left-8'} text-white`}>
                        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-normal mb-2 drop-shadow-lg">
                          {isArabic ? slide.titleAr : slide.title}
                        </h2>
                        <p className="font-body text-lg md:text-xl text-white/90 mb-4">
                          {isArabic ? slide.subtitleAr : slide.subtitle}
                        </p>
                        <Button
                          asChild
                          className="bg-shiny-gold text-black hover:bg-shiny-gold/90 font-display tracking-wider border-0"
                        >
                          <Link to="/collections">
                            {isArabic ? "تسوق الآن" : "Shop Now"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation Arrows */}
              <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-0 text-dark-charcoal" />
              <CarouselNext className="right-4 bg-white/80 hover:bg-white border-0 text-dark-charcoal" />
            </Carousel>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-charcoal/20 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-shiny-gold transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    current === index
                      ? "bg-shiny-gold w-6"
                      : "bg-dark-charcoal/30 hover:bg-dark-charcoal/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Static Tiles - 30% width */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* New Arrivals Tile */}
            <Link
              to="/collections"
              className="group relative flex-1 min-h-[200px] lg:min-h-0 overflow-hidden rounded-lg border-2 border-shiny-gold"
            >
              <img
                src={newArrivalsTile}
                alt={isArabic ? "وصل حديثاً" : "New Arrivals"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className={`absolute bottom-4 ${isArabic ? 'right-4' : 'left-4'} ${isArabic ? 'text-right' : 'text-left'}`}>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-2 drop-shadow-lg">
                  {isArabic ? "وصل حديثاً" : "New Arrivals"}
                </h3>
                <Button
                  className="bg-shiny-gold text-black hover:bg-shiny-gold/90 font-display tracking-wider border-0 text-sm"
                >
                  {isArabic ? "تسوق الآن" : "Shop Now"}
                </Button>
              </div>
            </Link>

            {/* Special Offers Tile */}
            <Link
              to="/offers"
              className="group relative flex-1 min-h-[200px] lg:min-h-0 overflow-hidden rounded-lg border-2 border-shiny-gold"
            >
              <img
                src={specialOffersTile}
                alt={isArabic ? "عروض خاصة" : "Special Offers"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className={`absolute bottom-4 ${isArabic ? 'right-4' : 'left-4'} ${isArabic ? 'text-right' : 'text-left'}`}>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-2 drop-shadow-lg">
                  {isArabic ? "عروض خاصة" : "Special Offers"}
                </h3>
                <Button
                  className="bg-shiny-gold text-black hover:bg-shiny-gold/90 font-display tracking-wider border-0 text-sm"
                >
                  {isArabic ? "تسوق الآن" : "Shop Now"}
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
