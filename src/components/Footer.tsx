import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, isRTL } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };

  const navigationLinks = [t.home, t.collections, t.newArrivals, t.bestSellers, t.giftSets];
  const customerCareLinks = [t.contactUs, t.shippingInfo, t.returnsExchanges, t.orderTracking, t.faq];
  const legalLinks = [t.privacyPolicy, t.termsOfService, t.cookiePolicy, t.accessibility];

  return (
    <footer className="bg-taupe py-16 md:py-20">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Navigation */}
          <div>
            <h3 
              className="font-display text-lg mb-6"
              style={{
                background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.navigation}
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 
              className="font-display text-lg mb-6"
              style={{
                background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.customerCare}
            </h3>
            <ul className="space-y-3">
              {customerCareLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 
              className="font-display text-lg mb-6"
              style={{
                background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.legal}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter with taupe-dark background */}
          <div className="bg-taupe-dark p-6 -m-2 border border-gold/20">
            <h3 
              className="font-display text-lg mb-6"
              style={{
                background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.stayConnected}
            </h3>
            <p className="font-body text-sm text-charcoal/70 mb-4">
              {t.subscribeText}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.yourEmail}
                className="w-full px-4 py-3 bg-ivory border border-gold/50 text-charcoal font-body text-sm placeholder:text-charcoal/50 focus:outline-none focus:border-gold transition-colors"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gold text-charcoal font-display text-sm tracking-wider hover:bg-gold-light transition-colors shadow-md shadow-gold/30"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-12" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span 
              className="font-display text-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ASPER
            </span>
            <span className="font-body text-xs text-charcoal/50">{t.beautyShop}</span>
          </div>
          <p className="font-body text-xs text-charcoal/50">
            © {new Date().getFullYear()} Asper {t.beautyShop}. {t.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};
