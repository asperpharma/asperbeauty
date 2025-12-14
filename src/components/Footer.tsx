import { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };

  return (
    <footer className="bg-primary py-16 md:py-20">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Navigation */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">Navigation</h3>
            <ul className="space-y-3">
              {["Home", "Collections", "New Arrivals", "Best Sellers", "Gift Sets"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">Customer Care</h3>
            <ul className="space-y-3">
              {["Contact Us", "Shipping Info", "Returns & Exchanges", "Order Tracking", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">Legal</h3>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter with gold border */}
          <div>
            <h3 className="font-display text-lg text-gold mb-6">Stay Connected</h3>
            <p className="font-body text-sm text-cream/70 mb-4">
              Subscribe to receive exclusive offers and updates.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-3 bg-transparent border border-gold text-cream font-body text-sm placeholder:text-cream/50 focus:outline-none focus:border-gold-light transition-colors"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-transparent border border-gold text-gold font-display text-sm tracking-wider hover:bg-gold hover:text-primary transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gold/20 my-12" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-gold">ASPER</span>
            <span className="font-body text-xs text-cream/50">Beauty Shop</span>
          </div>
          <p className="font-body text-xs text-cream/50">
            © {new Date().getFullYear()} Asper Beauty Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
