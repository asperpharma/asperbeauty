import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import asperLogo from "@/assets/asper-logo-new.jpg";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, language, isRTL } = useLanguage();
  const isArabic = language === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };

  const navigationLinks = [
    { name: isArabic ? 'الرئيسية' : 'Home', href: '/' },
    { name: isArabic ? 'المجموعات' : 'Collections', href: '/collections' },
    { name: isArabic ? 'وصل حديثاً' : 'New Arrivals', href: '/collections?filter=new' },
    { name: isArabic ? 'الأكثر مبيعاً' : 'Best Sellers', href: '/best-sellers' },
    { name: isArabic ? 'العروض' : 'Offers', href: '/offers' },
  ];

  const customerCareLinks = [
    { name: isArabic ? 'اتصل بنا' : 'Contact Us', href: '/contact' },
    { name: isArabic ? 'معلومات الشحن' : 'Shipping Info', href: '/shipping' },
    { name: isArabic ? 'الإرجاع والاستبدال' : 'Returns & Exchanges', href: '/returns' },
    { name: isArabic ? 'تتبع الطلب' : 'Order Tracking', href: '/tracking' },
    { name: isArabic ? 'الأسئلة الشائعة' : 'FAQ', href: '/faq' },
  ];

  const legalLinks = [
    { name: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy' },
    { name: isArabic ? 'شروط الخدمة' : 'Terms of Service', href: '/terms' },
    { name: isArabic ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy', href: '/cookies' },
  ];

  return (
    <footer className="bg-burgundy text-cream">
      {/* Main Footer Content */}
      <div className="luxury-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Contact */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img 
                src={asperLogo} 
                alt="Asper Beauty Shop" 
                className="h-14 rounded"
              />
            </Link>
            <p className="font-script text-xl text-gold mb-6">
              Elegance in every detail
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+962791234567" className="flex items-center gap-3 font-body text-sm text-cream/70 hover:text-gold transition-colors duration-400">
                <Phone className="w-4 h-4 text-gold" />
                +962 79 123 4567
              </a>
              <a href="mailto:info@asperbeauty.com" className="flex items-center gap-3 font-body text-sm text-cream/70 hover:text-gold transition-colors duration-400">
                <Mail className="w-4 h-4 text-gold" />
                info@asperbeauty.com
              </a>
              <p className="flex items-start gap-3 font-body text-sm text-cream/70">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                {isArabic ? 'عمّان، الأردن' : 'Amman, Jordan'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">
              {isArabic ? 'التصفح' : 'Navigation'}
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors duration-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">
              {isArabic ? 'خدمة العملاء' : 'Customer Care'}
            </h3>
            <ul className="space-y-3">
              {customerCareLinks.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors duration-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">
              {isArabic ? 'ابقى على تواصل' : 'Stay Connected'}
            </h3>
            <p className="font-body text-sm text-cream/70 mb-4">
              {isArabic 
                ? 'اشترك للحصول على عروض حصرية ونصائح الجمال.'
                : 'Subscribe for exclusive offers and beauty tips.'
              }
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email'}
                className="w-full px-4 py-3 bg-burgundy-light border border-gold/30 text-cream font-body text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors duration-400 rounded"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button 
                type="submit" 
                className="w-full px-6 py-3 bg-gold text-burgundy font-display text-sm tracking-wider hover:bg-gold-light transition-colors duration-400 rounded"
              >
                {isArabic ? 'اشترك' : 'Subscribe'}
              </button>
            </form>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/20">
        <div className="luxury-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-cream/50">
              © {new Date().getFullYear()} Asper Beauty. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-6">
              {legalLinks.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href}
                  className="font-body text-xs text-cream/50 hover:text-gold transition-colors duration-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
