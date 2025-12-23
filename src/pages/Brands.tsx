import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Brands() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr ? (
                <>علاماتنا <span className="text-gold">التجارية</span></>
              ) : (
                <>Our <span className="text-gold">Brands</span></>
              )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr 
                ? 'نتعاون مع أرقى العلامات التجارية العالمية للجمال لنقدم لك جودة استثنائية.'
                : "We partner with the world's most prestigious beauty brands to bring you exceptional quality."}
            </p>
          </div>

          <div className="text-center py-20 border border-gold/20 bg-secondary">
            <p className="font-display text-cream/60 text-lg">
              {isAr ? 'عرض العلامات التجارية قريباً' : 'Brand showcase coming soon'}
            </p>
            <p className="font-body text-cream/40 mt-2">
              {isAr ? 'ترقبوا شركاءنا من العلامات التجارية الفاخرة' : 'Check back for our premium brand partners'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
