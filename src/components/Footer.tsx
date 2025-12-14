import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/#products" },
      { name: "New Arrivals", href: "/#products" },
      { name: "Bestsellers", href: "/#products" },
      { name: "Gift Sets", href: "/#products" },
    ],
    about: [
      { name: "Our Story", href: "/#about" },
      { name: "Philosophy", href: "/#about" },
      { name: "Sustainability", href: "/#about" },
      { name: "Press", href: "/#about" },
    ],
    support: [
      { name: "Contact Us", href: "/#contact" },
      { name: "Shipping", href: "/#contact" },
      { name: "Returns", href: "/#contact" },
      { name: "FAQ", href: "/#contact" },
    ],
  };

  return (
    <footer className="bg-primary border-t border-gold/20">
      <div className="luxury-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h3 className="font-display text-2xl tracking-wider text-gold">ASPER</h3>
              <p className="luxury-subheading text-primary-foreground/60 -mt-1">Beauty Shop</p>
            </Link>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
              Curating premium beauty essentials for the discerning individual. 
              Elevate your skincare ritual with our carefully selected collection.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="luxury-subheading text-gold mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="luxury-subheading text-gold mb-6">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="luxury-subheading text-gold mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-primary-foreground/60">
            © {currentYear} Asper Beauty Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-xs text-primary-foreground/60 hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-xs text-primary-foreground/60 hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
