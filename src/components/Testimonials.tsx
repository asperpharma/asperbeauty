import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LazyImage } from "./LazyImage";

const testimonials = [
  {
    id: 1,
    name: "Rania Al-Majali",
    nameAr: "رانيا المجالي",
    location: "Amman, Jordan",
    locationAr: "عمّان، الأردن",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review: "Absolutely love the Vichy products I ordered. The packaging was luxurious and arrived quickly. Asper has become my go-to for all skincare needs!",
    reviewAr: "منتجات رائعة وأصلية ١٠٠٪. طلبت من آسبر أكثر من مرة والتوصيل سريع جداً على عمّان. أنصح الكل فيهم!",
  },
  {
    id: 2,
    name: "Dana Al-Zoubi",
    nameAr: "دانا الزعبي",
    location: "Irbid, Jordan",
    locationAr: "إربد، الأردن",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review: "The customer service is exceptional. They helped me find the perfect anti-aging routine. My skin has never looked better!",
    reviewAr: "خدمة العملاء ممتازة والردود سريعة. ساعدوني أختار المنتجات المناسبة لبشرتي. شكراً آسبر!",
  },
  {
    id: 3,
    name: "Lina Haddad",
    nameAr: "لينا حداد",
    location: "Aqaba, Jordan",
    locationAr: "العقبة، الأردن",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review: "Finally, a beauty store that understands luxury. The selection of fragrances is unmatched. Every purchase feels like a special occasion.",
    reviewAr: "أخيراً لقيت متجر يوفر منتجات العناية الأصلية بالأردن. الأسعار منافسة والجودة عالية. ما رح أشتري من غيرهم!",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-gold text-gold' : 'text-gold/30'}`}
      />
    ))}
  </div>
);

export const Testimonials = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-20 lg:py-28 bg-burgundy overflow-hidden">
      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16" animation="slide-up" duration={800}>
          <span className="font-script text-2xl lg:text-3xl text-gold block mb-2">
            {isArabic ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-cream mb-4">
            {isArabic ? 'شهادات العملاء' : 'Testimonials'}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto" />
        </AnimatedSection>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} animation="zoom" delay={index * 200} duration={800}>
              <div className="bg-cream/5 backdrop-blur-sm border border-gold/20 rounded-lg p-8 transition-all duration-400 hover:border-gold/50 hover:bg-cream/10 group h-full">
                {/* Quote Icon */}
                <div className="text-gold/30 mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Review Text */}
                <p className="font-body text-cream/80 leading-relaxed mb-6 min-h-[100px]">
                  {isArabic ? testimonial.reviewAr : testimonial.review}
                </p>

                {/* Rating */}
                <div className="mb-6">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Gold Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar with Gold Ring */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-sm" />
                    <div className="relative w-14 h-14 rounded-full border-2 border-gold overflow-hidden">
                      <LazyImage
                        src={testimonial.avatar}
                        alt={isArabic ? testimonial.nameAr : testimonial.name}
                        className="w-full h-full object-cover"
                        skeletonClassName="rounded-full"
                      />
                    </div>
                  </div>

                  {/* Name & Location */}
                  <div>
                    <h4 className="font-display text-base text-cream">
                      {isArabic ? testimonial.nameAr : testimonial.name}
                    </h4>
                    <p className="font-body text-xs text-gold/70">
                      {isArabic ? testimonial.locationAr : testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom Accent */}
        <AnimatedSection animation="blur" delay={700} duration={1000} className="flex flex-col items-center mt-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="font-script text-2xl text-gold">
              {isArabic ? 'الأناقة في كل تفصيل' : 'Elegance in every detail'}
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
