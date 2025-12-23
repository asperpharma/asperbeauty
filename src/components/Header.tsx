import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchDropdown } from "./SearchDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import asperLogo from "@/assets/asper-logo-new.jpg";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { language, isRTL } = useLanguage();

  const categories = [
    { name: language === 'ar' ? 'العناية بالبشرة' : 'Skin Care', href: "/collections/skin-care" },
    { name: language === 'ar' ? 'العناية بالشعر' : 'Hair Care', href: "/collections/hair-care" },
    { name: language === 'ar' ? 'العناية بالجسم' : 'Body Care', href: "/collections/body-care" },
    { name: language === 'ar' ? 'المكياج' : 'Make Up', href: "/collections/make-up" },
    { name: language === 'ar' ? 'مشاكل البشرة' : 'Skin Concerns', href: "/skin-concerns" },
    { name: language === 'ar' ? 'العلامات التجارية' : 'Brands', href: "/brands" },
    { name: language === 'ar' ? 'العروض' : 'Offers', href: "/offers" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-shiny-gold py-2 px-4">
        <div className="luxury-container flex items-center justify-between">
          <div className="flex-1" />
          <p className="text-center text-black font-body text-xs sm:text-sm font-medium">
            Free Delivery on orders over 50 JOD | توصيل مجاني للطلبات فوق ٥٠ دينار
          </p>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher variant="announcement" />
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="bg-soft-ivory border-b border-gray-200">
        <div className="luxury-container py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img 
                src={asperLogo} 
                alt="Asper Beauty" 
                className="w-12 h-12 rounded object-cover shadow-md"
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-display text-xl text-dark-charcoal tracking-wider">ASPER</span>
                <span className="font-body text-xs text-gray-500 tracking-widest uppercase">
                  {language === 'ar' ? 'متجر التجميل' : 'Beauty Shop'}
                </span>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder={language === 'ar' ? 'ابحثي عن المنتجات، العلامات التجارية...' : 'Search for products, brands...'}
                  className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 bg-white text-dark-charcoal placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-shiny-gold focus:ring-1 focus:ring-shiny-gold transition-colors"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {searchQuery ? (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-shiny-gold transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-shiny-gold transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <SearchDropdown
                isOpen={searchFocused}
                onClose={() => setSearchFocused(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Icons - Right */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button className="md:hidden p-2 text-dark-charcoal hover:text-shiny-gold transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Account Icon */}
              <button className="p-2 text-dark-charcoal hover:text-shiny-gold transition-colors">
                <User className="w-5 h-5" />
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-dark-charcoal hover:text-shiny-gold transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} h-5 w-5 rounded-full bg-shiny-gold text-black text-xs flex items-center justify-center font-body font-semibold shadow-md`}>
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-dark-charcoal"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row (Categories) - Desktop */}
      <nav className="bg-soft-ivory border-b border-gray-200 hidden lg:block">
        <div className="luxury-container">
          <ul className="flex items-center justify-center gap-8 py-3">
            {categories.map((category) => (
              <li key={category.href}>
                <Link
                  to={category.href}
                  className="font-display text-sm tracking-wide text-dark-charcoal hover:text-shiny-gold transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-soft-ivory border-b border-gray-200 animate-fade-in">
          {/* Mobile Search Bar */}
          <div className="px-4 py-3 border-b border-gray-200 relative">
            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setMobileSearchFocused(true)}
                placeholder={language === 'ar' ? 'ابحثي عن المنتجات...' : 'Search for products...'}
                className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 bg-white text-dark-charcoal placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-shiny-gold transition-colors"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {searchQuery ? (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    mobileSearchInputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <SearchDropdown
              isOpen={mobileSearchFocused}
              onClose={() => setMobileSearchFocused(false)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isMobile
            />
          </div>

          {/* Mobile Categories */}
          <div className="px-4 py-4">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    to={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-2 font-display text-dark-charcoal hover:text-shiny-gold hover:bg-gray-50 transition-colors rounded"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <CartDrawer />
      <WishlistDrawer />
    </header>
  );
};
