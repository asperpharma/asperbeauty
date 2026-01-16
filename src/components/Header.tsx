import { ShoppingBag, Menu, X, Search, User, Heart, ChevronDown, Instagram, Facebook, MessageCircle, Settings, Upload, ClipboardList } from "lucide-react";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchDropdown } from "./SearchDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import asperLogoHorizontal from "@/assets/asper-logo-horizontal.jpg";
import { PromotionBar } from "./PromotionBar";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const totalItems = useCartStore(state => state.getTotalItems());
  const wishlistItems = useWishlistStore(state => state.items);
  const setCartOpen = useCartStore(state => state.setOpen);
  const setWishlistOpen = useWishlistStore(state => state.setOpen);
  const { language, isRTL } = useLanguage();

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    {
      name: language === 'ar' ? 'العناية بالبشرة' : 'Skincare',
      href: "/collections/skin-care",
      hasMegaMenu: true,
      megaMenu: {
        byCategory: [
          { name: language === 'ar' ? 'منظفات' : 'Cleansers', href: '/collections/skin-care?category=cleansers' },
          { name: language === 'ar' ? 'تونر' : 'Toners', href: '/collections/skin-care?category=toners' },
          { name: language === 'ar' ? 'مرطبات' : 'Moisturizers', href: '/collections/skin-care?category=moisturizers' },
          { name: language === 'ar' ? 'سيروم' : 'Serums', href: '/collections/skin-care?category=serums' },
        ],
        byConcern: [
          { name: language === 'ar' ? 'حب الشباب' : 'Acne', href: '/skin-concerns?concern=acne' },
          { name: language === 'ar' ? 'مكافحة الشيخوخة' : 'Anti-Aging', href: '/skin-concerns?concern=anti-aging' },
          { name: language === 'ar' ? 'الجفاف' : 'Dryness', href: '/skin-concerns?concern=dryness' },
          { name: language === 'ar' ? 'التصبغات' : 'Hyperpigmentation', href: '/skin-concerns?concern=brightening' },
        ],
        featuredBrands: [
          { name: 'Vichy', href: '/brands/vichy' },
          { name: 'Eucerin', href: '/brands/eucerin' },
          { name: 'SVR', href: '/brands/svr' },
          { name: 'Cetaphil', href: '/brands/cetaphil' },
          { name: 'Bio-Balance', href: '/brands/bio-balance' },
        ]
      }
    },
    {
      name: language === 'ar' ? 'المكياج' : 'Makeup',
      href: "/collections/make-up",
      hasMegaMenu: true,
      megaMenu: {
        byCategory: [
          { name: language === 'ar' ? 'الوجه' : 'Face', href: '/collections/make-up?category=face' },
          { name: language === 'ar' ? 'العيون' : 'Eyes', href: '/collections/make-up?category=eyes' },
          { name: language === 'ar' ? 'الشفاه' : 'Lips', href: '/collections/make-up?category=lips' },
        ],
        byConcern: [
          { name: language === 'ar' ? 'تغطية كاملة' : 'Full Coverage', href: '/collections/make-up?type=full-coverage' },
          { name: language === 'ar' ? 'طبيعي' : 'Natural Look', href: '/collections/make-up?type=natural' },
          { name: language === 'ar' ? 'طويل الأمد' : 'Long-lasting', href: '/collections/make-up?type=long-lasting' },
        ],
        featuredBrands: [
          { name: 'Bourjois', href: '/brands/bourjois' },
          { name: 'Essence', href: '/brands/essence' },
          { name: 'IsaDora', href: '/brands/isadora' },
          { name: 'Mavala', href: '/brands/mavala' },
        ]
      }
    },
    { name: language === 'ar' ? 'العناية بالشعر' : 'Hair Care', href: "/collections/hair-care" },
    { name: language === 'ar' ? 'العطور' : 'Fragrance', href: "/collections/fragrances" },
    { name: language === 'ar' ? 'للرجال' : 'Men', href: "/collections/men" },
    { name: language === 'ar' ? 'حصريات آسبر' : 'Asper Exclusives', href: "/collections/exclusives" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Promotion Bar - Top */}
      <PromotionBar />
      
      {/* Main Header Row - Deep Burgundy */}
      <div className="bg-burgundy h-16 md:h-20">
        <div className="luxury-container h-full">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-full gap-6">
            {/* Logo - Left */}
            <Link to="/" className="flex-shrink-0 group">
              <img
                alt="Asper Beauty Shop"
                className="h-10 sm:h-12 w-auto transition-all duration-400 group-hover:opacity-90"
                src={asperLogoHorizontal}
                width={180}
                height={48}
              />
            </Link>

            {/* Search Bar - Center (Pill-shaped) */}
            <div className="flex-1 max-w-xl mx-4 relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder={language === 'ar' ? 'ابحثي عن سيروم، مكونات، أو علامات تجارية...' : 'Search for serums, ingredients, or brands...'}
                  className="w-full px-6 py-3 pl-12 rounded-full bg-white text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-400"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gold`} />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors duration-400`}
                  >
                    <X className="w-5 h-5" />
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

            {/* Social Media Icons */}
            <div className="flex items-center gap-1 border-r border-gold/30 pr-3 mr-1">
              <a 
                href="https://www.instagram.com/asper.beauty.box/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a 
                href="https://web.facebook.com/robu.sweileh/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a 
                href="https://www.tiktok.com/@asper.pharmacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/962790656666" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>

            {/* Icons - Right (Gold outline) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Admin Menu - Only visible for admins */}
              {isAdmin && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className="p-2 text-gold hover:text-gold-light transition-colors duration-400"
                    title="Admin"
                  >
                    <Settings className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  
                  {/* Admin Dropdown */}
                  {adminMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gold/20 py-2 z-50">
                      <Link
                        to="/admin/bulk-upload"
                        onClick={() => setAdminMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-charcoal hover:bg-cream hover:text-burgundy transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {language === 'ar' ? 'رفع المنتجات' : 'Bulk Upload'}
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setAdminMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-charcoal hover:bg-cream hover:text-burgundy transition-colors"
                      >
                        <ClipboardList className="w-4 h-4" />
                        {language === 'ar' ? 'الطلبات' : 'Orders'}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Account Icon */}
              <Link 
                to={user ? "/account" : "/auth"}
                className="p-2 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>

              {/* Wishlist Icon */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className={`absolute -top-0.5 ${isRTL ? '-left-0.5' : '-right-0.5'} h-4 w-4 rounded-full bg-gold text-burgundy text-[10px] flex items-center justify-center font-body font-semibold`}>
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gold hover:text-gold-light transition-colors duration-400"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className={`absolute -top-0.5 ${isRTL ? '-left-0.5' : '-right-0.5'} h-4 w-4 rounded-full bg-gold text-burgundy text-[10px] flex items-center justify-center font-body font-semibold`}>
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Language Switcher */}
              <LanguageSwitcher variant="header" />
            </div>
          </div>

          {/* Mobile Header - Hamburger | Logo | Bag */}
          <div className="flex md:hidden items-center justify-between h-full px-2">
            {/* Left - Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gold"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
            </button>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                alt="Asper Beauty Shop"
                className="h-8 w-auto max-w-[140px]"
                src={asperLogoHorizontal}
                width={140}
                height={32}
              />
            </Link>

            {/* Right - Shopping Bag Only */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gold"
            >
              <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold text-burgundy text-[10px] flex items-center justify-center font-body font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Full Width Below Header */}
      <div className="md:hidden bg-cream border-b border-gold/20 px-4 py-3">
        <div className="relative">
          <input
            ref={mobileSearchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setMobileSearchFocused(true)}
            placeholder={language === 'ar' ? 'ابحثي عن المنتجات...' : 'Search for products...'}
            className="w-full px-5 py-3 pl-12 rounded-full border border-gold/30 bg-white text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors duration-400"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gold`} />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                mobileSearchInputRef.current?.focus();
              }}
              className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-muted-foreground`}
            >
              <X className="w-5 h-5" />
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

      {/* Secondary Navigation Row (Mega Menu) - Cream - Desktop Only */}
      <nav
        className="bg-cream border-b border-gold/30 hidden lg:block"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="luxury-container">
          <ul className="flex items-center justify-center gap-10 py-4">
            {navItems.map(item => (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={() => item.hasMegaMenu ? setActiveMenu(item.name) : setActiveMenu(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1 font-display text-sm tracking-wide text-foreground hover:text-gold transition-colors duration-400 whitespace-nowrap group"
                >
                  {item.name}
                  {item.hasMegaMenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-400 ${activeMenu === item.name ? 'rotate-180' : ''}`} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mega Menu Dropdown */}
        {navItems.filter(item => item.hasMegaMenu).map(item => (
          <div
            key={`mega-${item.name}`}
            className={`absolute left-0 right-0 bg-cream border-t border-gold/30 shadow-xl transition-all duration-400 ease-in-out ${
              activeMenu === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
            onMouseEnter={() => setActiveMenu(item.name)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="luxury-container py-8">
              <div className="grid grid-cols-3 gap-12">
                {/* Column 1: By Category */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4 pb-2 border-b border-gold/30">
                    {language === 'ar' ? 'حسب الفئة' : 'By Category'}
                  </h3>
                  <ul className="space-y-3">
                    {item.megaMenu?.byCategory.map(subItem => (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-400"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: By Concern */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4 pb-2 border-b border-gold/30">
                    {language === 'ar' ? 'حسب المشكلة' : 'By Concern'}
                  </h3>
                  <ul className="space-y-3">
                    {item.megaMenu?.byConcern.map(subItem => (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-400"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Featured Brands */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4 pb-2 border-b border-gold/30">
                    {language === 'ar' ? 'علامات مميزة' : 'Featured Brands'}
                  </h3>
                  <ul className="space-y-3">
                    {item.megaMenu?.featuredBrands.map(brand => (
                      <li key={brand.href}>
                        <Link
                          to={brand.href}
                          className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-400"
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
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
          </div>
        ))}
      </nav>

      {/* Mobile Navigation Menu - Slide from Left */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-400 ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-400 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel - Slide from Left */}
        <div
          className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-burgundy transform transition-transform duration-400 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gold/30">
            <img
              src={asperLogoHorizontal}
              alt="Asper Beauty Shop"
              className="h-8 w-auto max-w-[120px]"
              width={120}
              height={32}
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gold"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-4 px-3 font-display text-xl text-white hover:text-gold transition-colors duration-400"
                    style={{ fontSize: '20px' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* Account Link */}
              <li className="border-t border-gold/30 mt-4 pt-4">
                <Link
                  to={user ? "/account" : "/auth"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-4 px-3 font-display text-xl text-gold hover:text-gold-light transition-colors duration-400"
                  style={{ fontSize: '20px' }}
                >
                  <User className="w-5 h-5" />
                  {user ? (language === 'ar' ? 'حسابي' : 'My Account') : (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                </Link>
              </li>
              {/* Admin Links - Only visible for admins */}
              {isAdmin && (
                <>
                  <li className="border-t border-gold/30 mt-2 pt-2">
                    <span className="block px-3 py-2 text-sm text-gold/60 font-body">
                      {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                    </span>
                  </li>
                  <li>
                    <Link
                      to="/admin/bulk-upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-3 font-display text-lg text-white hover:text-gold transition-colors duration-400"
                    >
                      <Upload className="w-5 h-5" />
                      {language === 'ar' ? 'رفع المنتجات' : 'Bulk Upload'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-3 font-display text-lg text-white hover:text-gold transition-colors duration-400"
                    >
                      <ClipboardList className="w-5 h-5" />
                      {language === 'ar' ? 'الطلبات' : 'Orders'}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Language Switcher */}
          <div className="absolute bottom-8 left-4 right-4">
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>
      </div>

      <CartDrawer />
      <WishlistDrawer />
    </header>
  );
};
