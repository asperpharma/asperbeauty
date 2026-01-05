import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import asperLogo from "@/assets/asper-logo.jpg";
export const Footer = () => {
  const [email, setEmail] = useState("");
  const {
    t,
    isRTL
  } = useLanguage();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };
  const navigationLinks = [t.home, t.collections, t.newArrivals, t.bestSellers, t.giftSets];
  const customerCareLinks = [t.contactUs, t.shippingInfo, t.returnsExchanges, t.orderTracking, t.faq];
  const legalLinks = [t.privacyPolicy, t.termsOfService, t.cookiePolicy, t.accessibility];
  return <footer className="bg-secondary py-16 md:py-20 border-t border-gold/20">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Navigation */}
          <div>
            <h3 className="font-display text-lg mb-6 text-gold">
              {t.navigation}
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map(item => <li key={item} className="text-primary">
                  <a href="#" className="font-body text-sm text-cream/60 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-display text-lg mb-6 text-gold">
              {t.customerCare}
            </h3>
            <ul className="space-y-3">
              {customerCareLinks.map(item => <li key={item}>
                  <a href="#" className="font-body text-sm text-cream/60 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display text-lg mb-6 text-gold">
              {t.legal}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map(item => <li key={item}>
                  <a href="#" className="font-body text-sm text-cream/60 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-background p-6 -m-2 border border-gold/20">
            <h3 className="font-display text-lg mb-6 text-gold">
              {t.stayConnected}
            </h3>
            <p className="font-body text-sm text-cream/60 mb-4">
              {t.subscribeText}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.yourEmail} className="w-full px-4 py-3 bg-secondary border border-gold/30 text-cream font-body text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors" dir={isRTL ? 'rtl' : 'ltr'} />
              <button type="submit" className="w-full px-6 py-3 bg-gold text-background font-display text-sm tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20">
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-12" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={asperLogo} alt="Asper Beauty" className="w-10 h-10 rounded object-cover" />
            <div className="flex flex-col">
              <span className="font-display text-lg text-cream">ASPER</span>
              <span className="font-body text-xs text-gold">{t.beautyShop}</span>
            </div>
          </div>
          <p className="font-body text-xs text-cream/50">
            © {new Date().getFullYear()} Asper {t.beautyShop}. {t.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>;
};