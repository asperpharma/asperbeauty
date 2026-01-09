import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { useLanguage } from "@/contexts/LanguageContext";

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
