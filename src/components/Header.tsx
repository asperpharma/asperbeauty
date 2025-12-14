import { ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { t, isRTL } = useLanguage();

  const collections = [
    { name: t.hairCare, href: "/collections/hair-care", icon: "✦" },
    { name: t.bodyCare, href: "/collections/body-care", icon: "✦" },
    { name: t.makeUp, href: "/collections/make-up", icon: "✦" },
    { name: t.skincare, href: "/collections/skincare", icon: "✦" },
    { name: t.fragrances, href: "/collections/fragrances", icon: "✦" },
    { name: t.toolsDevices, href: "/collections/tools-devices", icon: "✦" },
  ];

  const navLinks = [
    { name: t.brands, href: "/brands" },
    { name: t.bestSellers, href: "/best-sellers" },
    { name: t.offers, href: "/offers" },
    { name: t.contactUs, href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-gold/20">
      <nav className="luxury-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-display text-2xl md:text-3xl tracking-wider text-gold">
              ASPER
            </h1>
            <span className="hidden sm:block font-display text-sm text-gold/80 tracking-widest">
              {t.beautyShop}
            </span>
          </Link>

          {/* Navigation Links - Center/Right (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className="font-display text-sm tracking-wider text-cream hover:text-gold transition-colors"
            >
              {t.home}
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button className="flex items-center gap-1 font-display text-sm tracking-wider text-cream hover:text-gold transition-colors">
                {t.collections}
                <ChevronDown className={`h-3 w-3 transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {collectionsOpen && (
                <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-1/2 -translate-x-1/2'} pt-4 z-50`}>
                  <div className="bg-cream border border-gold/30 rounded-lg shadow-2xl min-w-[320px] overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="bg-primary px-6 py-3 border-b border-gold/20">
                      <h3 className="font-display text-gold text-sm tracking-widest">
                        {isRTL ? 'تسوق حسب الفئة' : 'SHOP BY CATEGORY'}
                      </h3>
                    </div>
                    
                    {/* Categories */}
                    <div className="p-4">
                      {collections.map((collection, index) => (
                        <div key={collection.name}>
                          <Link
                            to={collection.href}
                            className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 rounded-md transition-colors group"
                          >
                            <span className="text-gold text-xs">{collection.icon}</span>
                            <span className="font-display text-sm tracking-wide group-hover:text-gold transition-colors">
                              {collection.name}
                            </span>
                          </Link>
                          {index < collections.length - 1 && (
                            <div className="mx-4 border-b border-gold/10" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-primary/5 px-6 py-3 border-t border-gold/10">
                      <Link
                        to="/collections"
                        className="font-display text-xs tracking-wider text-gold hover:text-gold/80 transition-colors"
                      >
                        {isRTL ? 'عرض جميع المجموعات ←' : 'VIEW ALL COLLECTIONS →'}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-display text-sm tracking-wider text-cream hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons - Right */}
          <div className="flex items-center gap-3">
            {/* Language Switcher - Desktop */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Search Icon */}
            <button className="p-2 text-gold border border-gold/30 rounded-full hover:bg-gold/10 transition-colors">
              <Search className="h-4 w-4" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gold hover:text-gold-light transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} h-5 w-5 rounded-full bg-cream text-primary text-xs flex items-center justify-center font-body font-medium`}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gold/20 animate-fade-in bg-primary">
            {/* Language Switcher - Mobile (Fixed at top of menu) */}
            <div className="border-b border-gold/20">
              <LanguageSwitcher variant="mobile" />
            </div>
            
            <div className="flex flex-col gap-2 py-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-cream hover:text-gold transition-colors py-2"
              >
                {t.home}
              </Link>

              {/* Mobile Collections Accordion */}
              <div>
                <button
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="flex items-center justify-between w-full font-display text-cream hover:text-gold transition-colors py-2"
                >
                  {t.collections}
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCollectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileCollectionsOpen && (
                  <div className={`${isRTL ? 'mr-4 border-r-2 pr-4' : 'ml-4 border-l-2 pl-4'} mt-2 space-y-1 border-gold/30`}>
                    {collections.map((collection) => (
                      <Link
                        key={collection.name}
                        to={collection.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 font-body text-sm text-cream/80 hover:text-gold transition-colors py-2"
                      >
                        <span className="text-gold text-xs">{collection.icon}</span>
                        {collection.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-cream hover:text-gold transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer />
    </header>
  );
};
