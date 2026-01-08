import { ShoppingBag, Menu, X, Search, User, Heart, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchDropdown } from "./SearchDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import asperLogo from "@/assets/asper-logo.jpg";
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const totalItems = useCartStore(state => state.getTotalItems());
  const wishlistItems = useWishlistStore(state => state.items);
  const setCartOpen = useCartStore(state => state.setOpen);
  const setWishlistOpen = useWishlistStore(state => state.setOpen);
  const {
    language,
    isRTL
  } = useLanguage();
  const navItems = [{
    name: language === 'ar' ? 'العناية بالبشرة' : 'Skincare',
    href: "/collections/skin-care",
    hasMegaMenu: true,
    megaMenu: {
      byCategory: [{
        name: language === 'ar' ? 'منظفات' : 'Cleansers',
        href: '/collections/skin-care?category=cleansers'
      }, {
        name: language === 'ar' ? 'تونر' : 'Toners',
        href: '/collections/skin-care?category=toners'
      }, {
        name: language === 'ar' ? 'مرطبات' : 'Moisturizers',
        href: '/collections/skin-care?category=moisturizers'
      }, {
        name: language === 'ar' ? 'سيروم' : 'Serums',
        href: '/collections/skin-care?category=serums'
      }],
      byConcern: [{
        name: language === 'ar' ? 'حب الشباب' : 'Acne',
        href: '/skin-concerns?concern=acne'
      }, {
        name: language === 'ar' ? 'مكافحة الشيخوخة' : 'Anti-Aging',
        href: '/skin-concerns?concern=anti-aging'
      }, {
        name: language === 'ar' ? 'الجفاف' : 'Dryness',
        href: '/skin-concerns?concern=dryness'
      }, {
        name: language === 'ar' ? 'التصبغات' : 'Hyperpigmentation',
        href: '/skin-concerns?concern=brightening'
      }],
      featuredBrands: [{
        name: 'Vichy',
        href: '/brands/vichy'
      }, {
        name: 'Eucerin',
        href: '/brands/eucerin'
      }, {
        name: 'SVR',
        href: '/brands/svr'
      }, {
        name: 'Cetaphil',
        href: '/brands/cetaphil'
      }, {
        name: 'Bio-Balance',
        href: '/brands/bio-balance'
      }]
    }
  }, {
    name: language === 'ar' ? 'المكياج' : 'Makeup',
    href: "/collections/make-up",
    hasMegaMenu: true,
    megaMenu: {
      byCategory: [{
        name: language === 'ar' ? 'الوجه' : 'Face',
        href: '/collections/make-up?category=face'
      }, {
        name: language === 'ar' ? 'العيون' : 'Eyes',
        href: '/collections/make-up?category=eyes'
      }, {
        name: language === 'ar' ? 'الشفاه' : 'Lips',
        href: '/collections/make-up?category=lips'
      }],
      byConcern: [{
        name: language === 'ar' ? 'تغطية كاملة' : 'Full Coverage',
        href: '/collections/make-up?type=full-coverage'
      }, {
        name: language === 'ar' ? 'طبيعي' : 'Natural Look',
        href: '/collections/make-up?type=natural'
      }, {
        name: language === 'ar' ? 'طويل الأمد' : 'Long-lasting',
        href: '/collections/make-up?type=long-lasting'
      }],
      featuredBrands: [{
        name: 'Bourjois',
        href: '/brands/bourjois'
      }, {
        name: 'Essence',
        href: '/brands/essence'
      }, {
        name: 'IsaDora',
        href: '/brands/isadora'
      }, {
        name: 'Mavala',
        href: '/brands/mavala'
      }]
    }
  }, {
    name: language === 'ar' ? 'العناية بالشعر' : 'Hair Care',
    href: "/collections/hair-care"
  }, {
    name: language === 'ar' ? 'العطور' : 'Fragrance',
    href: "/collections/fragrances"
  }, {
    name: language === 'ar' ? 'للرجال' : 'Men',
    href: "/collections/men"
  }, {
    name: language === 'ar' ? 'حصريات آسبر' : 'Asper Exclusives',
    href: "/collections/exclusives"
  }];
  return <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Header Row - Deep Burgundy */}
      <div className="bg-burgundy h-20">
        <div className="luxury-container h-full">
          <div className="flex items-center justify-between h-full gap-6">
            {/* Logo - Left */}
            <Link to="/" className="flex-shrink-0 group">
              <img alt="Asper Beauty Shop" className="h-12 sm:h-14 rounded transition-all duration-400 group-hover:opacity-90" src="/lovable-uploads/7831568c-30c3-4d7e-935c-aacc6f527765.jpg" />
            </Link>

            {/* Search Bar - Center (Pill-shaped) */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block relative">
              <div className="relative">
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} placeholder={language === 'ar' ? 'ابحثي عن سيروم، مكونات، أو علامات تجارية...' : 'Search for serums, ingredients, or brands...'} className="w-full px-6 py-3 pl-12 rounded-full bg-white text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-400" dir={isRTL ? 'rtl' : 'ltr'} />
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gold`} />
                {searchQuery && <button onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }} className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors duration-400`}>
                    <X className="w-5 h-5" />
                  </button>}
              </div>
              
              <SearchDropdown isOpen={searchFocused} onClose={() => setSearchFocused(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            {/* Icons - Right (Gold outline) */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button className="md:hidden p-2 text-gold hover:text-gold-light transition-colors duration-400">
                <Search className="w-5 h-5" />
              </button>

              {/* Account Icon */}
              <button className="p-2 text-gold hover:text-gold-light transition-colors duration-400">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Wishlist Icon */}
              <button onClick={() => setWishlistOpen(true)} className="relative p-2 text-gold hover:text-gold-light transition-colors duration-400">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistItems.length > 0 && <span className={`absolute -top-0.5 ${isRTL ? '-left-0.5' : '-right-0.5'} h-4 w-4 rounded-full bg-gold text-burgundy text-[10px] flex items-center justify-center font-body font-semibold`}>
                    {wishlistItems.length}
                  </span>}
              </button>

              {/* Cart Icon */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gold hover:text-gold-light transition-colors duration-400">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && <span className={`absolute -top-0.5 ${isRTL ? '-left-0.5' : '-right-0.5'} h-4 w-4 rounded-full bg-gold text-burgundy text-[10px] flex items-center justify-center font-body font-semibold`}>
                    {totalItems}
                  </span>}
              </button>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher variant="header" />
              </div>

              {/* Mobile menu button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gold">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row (Mega Menu) - Cream */}
      <nav className="bg-cream border-b border-gold/30 hidden lg:block" onMouseLeave={() => setActiveMenu(null)}>
        <div className="luxury-container">
          <ul className="flex items-center justify-center gap-10 py-4">
            {navItems.map(item => <li key={item.href} className="relative" onMouseEnter={() => item.hasMegaMenu ? setActiveMenu(item.name) : setActiveMenu(null)}>
                <Link to={item.href} className="flex items-center gap-1 font-display text-sm tracking-wide text-foreground hover:text-gold transition-colors duration-400 whitespace-nowrap group">
                  {item.name}
                  {item.hasMegaMenu && <ChevronDown className={`w-4 h-4 transition-transform duration-400 ${activeMenu === item.name ? 'rotate-180' : ''}`} />}
                </Link>
              </li>)}
          </ul>
        </div>

        {/* Mega Menu Dropdown */}
        {navItems.filter(item => item.hasMegaMenu).map(item => <div key={`mega-${item.name}`} className={`absolute left-0 right-0 bg-cream border-t border-gold/30 shadow-xl transition-all duration-400 ease-in-out ${activeMenu === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`} onMouseEnter={() => setActiveMenu(item.name)} onMouseLeave={() => setActiveMenu(null)}>
            <div className="luxury-container py-8">
              <div className="grid grid-cols-3 gap-12">
                {/* Column 1: By Category */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4 pb-2 border-b border-gold/30">
                    {language === 'ar' ? 'حسب الفئة' : 'By Category'}
                  </h3>
                  <ul className="space-y-3">
                    {item.megaMenu?.byCategory.map(subItem => <li key={subItem.href}>
                        <Link to={subItem.href} className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-400">
                          {subItem.name}
                        </Link>
                      </li>)}
                  </ul>
                </div>

                {/* Column 2: By Concern */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4 pb-2 border-b border-gold/30">
                    {language === 'ar' ? 'حسب المشكلة' : 'By Concern'}
                  </h3>
                  <ul className="space-y-3">
                    {item.megaMenu?.byConcern.map(subItem => <li key={subItem.href}>
                        <Link to={subItem.href} className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-400">
                          {subItem.name}
                        </Link>
                      </li>)}
                  </ul>
                </div>

                {/* Column 3: Featured Brands */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4 pb-2 border-b border-gold/30">
                    {language === 'ar' ? 'علامات مميزة' : 'Featured Brands'}
                  </h3>
                  <ul className="space-y-3">
                    {item.megaMenu?.featuredBrands.map(brand => <li key={brand.href}>
                        <Link to={brand.href} className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-400">
                          {brand.name}
                        </Link>
                      </li>)}
                  </ul>
                </div>
              </div>

              {/* Script tagline */}
              <div className="mt-8 pt-6 border-t border-gold/20 text-center">
                <span className="font-script text-2xl text-gold">
                  Elegance in every detail
                </span>
              </div>
            </div>
          </div>)}
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && <div className="lg:hidden bg-cream border-b border-gold/30 animate-fade-in">
          {/* Mobile Search Bar */}
          <div className="px-4 py-3 border-b border-gold/20 relative">
            <div className="relative">
              <input ref={mobileSearchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setMobileSearchFocused(true)} placeholder={language === 'ar' ? 'ابحثي عن المنتجات...' : 'Search for products...'} className="w-full px-5 py-3 pl-12 rounded-full border border-gold/30 bg-white text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors duration-400" dir={isRTL ? 'rtl' : 'ltr'} />
              <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gold`} />
              {searchQuery && <button onClick={() => {
            setSearchQuery("");
            mobileSearchInputRef.current?.focus();
          }} className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-muted-foreground`}>
                  <X className="w-5 h-5" />
                </button>}
            </div>
            
            <SearchDropdown isOpen={mobileSearchFocused} onClose={() => setMobileSearchFocused(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isMobile />
          </div>

          {/* Mobile Categories */}
          <div className="px-4 py-4">
            <ul className="space-y-1">
              {navItems.map(item => <li key={item.href}>
                  <Link to={item.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 px-2 font-display text-foreground hover:text-gold hover:bg-gold/5 transition-all duration-400 rounded">
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Mobile Language Switcher */}
          <div className="px-4 py-3 border-t border-gold/20 sm:hidden">
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>}

      <CartDrawer />
      <WishlistDrawer />
    </header>;
};