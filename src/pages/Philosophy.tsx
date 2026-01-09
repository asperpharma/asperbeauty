import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { FlaskConical, Sparkles, Globe, Award } from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TimelineSection = ({ isArabic }: { isArabic: boolean }) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const timelineData: { en: TimelineItem[]; ar: TimelineItem[] } = {
    en: [
      {
        year: "2015",
        title: "The Pharmacy Roots",
        description: "Asper began as a trusted community pharmacy in Amman, built on the foundation of clinical expertise and genuine care for every customer.",
        icon: <FlaskConical className="w-5 h-5" />,
      },
      {
        year: "2018",
        title: "Dermatology Focus",
        description: "We expanded into clinical skincare, partnering with dermatologists to curate medical-grade products that deliver real results.",
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        year: "2021",
        title: "Digital Evolution",
        description: "Asper Beauty was born—bringing our pharmacy heritage online with a curated selection of luxury skincare and expert guidance.",
        icon: <Globe className="w-5 h-5" />,
      },
      {
        year: "2024",
        title: "Jordan's Premier Destination",
        description: "Today, we are recognized as Amman's leading digital beauty concierge, trusted by thousands for authentic, effective products.",
        icon: <Award className="w-5 h-5" />,
      },
    ],
    ar: [
      {
        year: "2015",
        title: "الجذور الصيدلانية",
        description: "بدأت آسبر كصيدلية مجتمعية موثوقة في عمّان، مبنية على أساس الخبرة السريرية والرعاية الحقيقية لكل عميل.",
        icon: <FlaskConical className="w-5 h-5" />,
      },
      {
        year: "2018",
        title: "التركيز على طب الجلدية",
        description: "توسعنا في العناية بالبشرة السريرية، بالشراكة مع أطباء الجلدية لاختيار منتجات طبية تحقق نتائج حقيقية.",
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        year: "2021",
        title: "التطور الرقمي",
        description: "ولدت آسبر بيوتي—لنقل إرثنا الصيدلاني عبر الإنترنت مع مجموعة مختارة من مستحضرات العناية الفاخرة وإرشادات الخبراء.",
        icon: <Globe className="w-5 h-5" />,
      },
      {
        year: "2024",
        title: "الوجهة الأولى في الأردن",
        description: "اليوم، نحن معروفون كأفضل خدمة كونسيرج رقمية للجمال في عمّان، موثوقون من الآلاف للحصول على منتجات أصلية وفعالة.",
        icon: <Award className="w-5 h-5" />,
      },
    ],
  };

  const items = timelineData[isArabic ? "ar" : "en"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => 
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = timelineRef.current?.querySelectorAll("[data-index]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-burgundy/5 -mx-6 md:-mx-8 px-6 md:px-8 my-16 md:my-24 rounded-lg">
      <div className="text-center mb-12 md:mb-16">
        <span className="font-script text-xl md:text-2xl text-gold mb-3 block">
          {isArabic ? "رحلتنا" : "Our Journey"}
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy">
          {isArabic ? "من الصيدلية إلى الفخامة" : "From Pharmacy to Luxury"}
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        {/* Central Line */}
        <div className={`absolute ${isArabic ? 'right-6 md:right-1/2 md:translate-x-1/2' : 'left-6 md:left-1/2 md:-translate-x-1/2'} top-0 bottom-0 w-px bg-gold/40`} />

        {/* Timeline Items */}
        <div className="space-y-12 md:space-y-0">
          {items.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className={`relative md:flex md:items-center md:justify-center transition-all duration-700 ease-out ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Content Card */}
              <div
                className={`${isArabic ? 'mr-12 md:mr-0' : 'ml-12 md:ml-0'} md:w-5/12 ${
                  index % 2 === 0
                    ? isArabic ? 'md:ml-auto md:mr-8' : 'md:mr-auto md:ml-8'
                    : isArabic ? 'md:mr-auto md:ml-8' : 'md:ml-auto md:mr-8'
                } ${index > 0 ? 'md:mt-16' : ''}`}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gold/20 hover:shadow-md hover:border-gold/40 transition-all duration-400">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-2xl md:text-3xl text-gold font-semibold">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl text-burgundy mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Icon Node */}
              <div
                className={`absolute ${isArabic ? 'right-0' : 'left-0'} md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-burgundy shadow-lg z-10 transition-transform duration-500 ${
                  visibleItems.includes(index) ? "scale-100" : "scale-0"
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const content = {
    en: {
      pageTitle: "Our Philosophy",
      section1: {
        headline: "Born from Science. Curated for You.",
        body: "Asper Beauty is not just a store; it is the digital evolution of our pharmacy heritage. We bridge the gap between clinical dermatology and high-end luxury, ensuring that every product we offer is as effective as it is elegant.",
      },
      section2: {
        headline: "The Art of Selection.",
        body: "We reject 90% of the products we review. If a formulation does not meet our strict standards for ingredient purity and performance, it does not make it to our shelves. We navigate the noise of the beauty industry so you don't have to.",
      },
      section3: {
        headline: "Amman's Digital Concierge.",
        body: "From the moment you browse to the moment our signature package arrives at your door, you are treated with the care of a private client. Expert advice is just a click away.",
      },
      signature: "The Asper Team",
    },
    ar: {
      pageTitle: "فلسفتنا",
      section1: {
        headline: "ولدت من العلم. مختارة لكِ.",
        body: "آسبر بيوتي ليست مجرد متجر؛ إنها التطور الرقمي لإرثنا الصيدلاني. نحن نسد الفجوة بين طب الجلدية السريري والفخامة الراقية، مما يضمن أن كل منتج نقدمه فعال بقدر ما هو أنيق.",
      },
      section2: {
        headline: "فن الاختيار.",
        body: "نرفض 90% من المنتجات التي نراجعها. إذا لم تستوفِ التركيبة معاييرنا الصارمة لنقاء المكونات والأداء، فلن تصل إلى رفوفنا. نحن ننقذك من ضجيج صناعة الجمال حتى لا تضطري للتعامل معه.",
      },
      section3: {
        headline: "الكونسيرج الرقمي في عمّان.",
        body: "من لحظة تصفحك إلى لحظة وصول طردنا المميز إلى بابك، يتم التعامل معك بعناية العميل الخاص. النصيحة الخبيرة على بعد نقرة واحدة.",
      },
      signature: "فريق آسبر",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-cream" dir={isArabic ? "rtl" : "ltr"}>
      <Header />

      {/* Main Content - Editorial Style */}
      <main className="pt-40 md:pt-48 pb-24">
        {/* Narrow Content Column */}
        <article className="max-w-[800px] mx-auto px-6 md:px-8">
          
          {/* Page Title */}
          <header className="text-center mb-16 md:mb-24">
            <span className="font-script text-2xl md:text-3xl text-gold mb-4 block">
              {isArabic ? "قصتنا" : "Our Story"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-burgundy leading-tight">
              {t.pageTitle}
            </h1>
          </header>

          {/* Section 1: The Origin */}
          <section className="mb-16 md:mb-24">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy mb-6 leading-snug">
              {t.section1.headline}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
              {t.section1.body}
            </p>
            
            {/* Gold Line Separator */}
            <div className="flex justify-center my-12 md:my-16">
              <div className="w-24 h-px bg-gold"></div>
            </div>
          </section>

          {/* Animated Timeline */}
          <TimelineSection isArabic={isArabic} />

          {/* Section 2: The Rejection Policy */}
          <section className="mb-16 md:mb-24">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy mb-6 leading-snug">
              {t.section2.headline}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
              {t.section2.body}
            </p>
            
            {/* Gold Line Separator */}
            <div className="flex justify-center my-12 md:my-16">
              <div className="w-24 h-px bg-gold"></div>
            </div>
          </section>

          {/* Section 3: The Service Promise */}
          <section className="mb-16 md:mb-24">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy mb-6 leading-snug">
              {t.section3.headline}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
              {t.section3.body}
            </p>
          </section>

          {/* The Signature */}
          <footer className="text-center pt-8 md:pt-12 border-t border-gold/30">
            <span className="font-script text-3xl md:text-4xl text-gold">
              {t.signature}
            </span>
          </footer>

        </article>
      </main>

      <Footer />
      <BeautyAssistant />
    </div>
  );
};

export default Philosophy;
