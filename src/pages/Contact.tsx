import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Contact() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-40 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr ? (
                <>تواصل <span className="text-gold">معنا</span></>
              ) : (
                <>Contact <span className="text-gold">Us</span></>
              )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr 
                ? 'يسعدنا سماع رأيك. تواصلي معنا لأي استفسار حول منتجاتنا أو خدماتنا.'
                : "We'd love to hear from you. Reach out with any questions about our products or services."}
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="font-display text-2xl text-cream">
                {isAr ? 'تواصلي معنا' : 'Get in Touch'}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-cream mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </h3>
                    <a href="mailto:asperpharma@gmail.com" className="font-body text-cream/60 hover:text-gold transition-colors">
                      asperpharma@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-cream mb-1">
                      {isAr ? 'الهاتف' : 'Phone'}
                    </h3>
                    <a href="tel:+962790656666" className="font-body text-cream/60 hover:text-gold transition-colors" dir="ltr">
                      +962 79 065 6666
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-cream mb-1">
                      {isAr ? 'الموقع' : 'Location'}
                    </h3>
                    <p className="font-body text-cream/60">
                      {isAr ? 'عمان، الأردن' : 'Amman, Jordan'}
                    </p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-4">
                  <h3 className="font-display text-sm text-cream mb-4">
                    {isAr ? 'تابعينا' : 'Follow Us'}
                  </h3>
                  <div className="flex items-center gap-3">
                    <a href="https://www.instagram.com/asper.beauty.box/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <Instagram className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    <a href="https://web.facebook.com/robu.sweileh/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <Facebook className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    <a href="https://wa.me/962790656666" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <TikTokIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary border border-gold/20 p-8">
              <h2 className="font-display text-2xl text-cream mb-6">
                {isAr ? 'أرسلي رسالة' : 'Send a Message'}
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-cream/60 mb-2">
                    {isAr ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-gold/30 font-body text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
                    placeholder={isAr ? 'اسمك' : 'Your name'}
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cream/60 mb-2">
                    {isAr ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-background border border-gold/30 font-body text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
                    placeholder={isAr ? 'بريدك@الإلكتروني.com' : 'your@email.com'}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cream/60 mb-2">
                    {isAr ? 'الرسالة' : 'Message'}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-gold/30 font-body text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-background font-display text-sm tracking-wider hover:bg-gold-light transition-colors"
                >
                  {isAr ? 'إرسال الرسالة' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
