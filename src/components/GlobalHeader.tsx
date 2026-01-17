"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  User, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export const GlobalHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { language } = useLanguage();
  const isAr = language === "ar";
  
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Effect to handle scroll-driven glass transparency
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Skin", nameAr: "البشرة", href: "/shop?category=Skin%20Care" },
    { name: "Hair", nameAr: "الشعر", href: "/shop?category=Hair%20Care" },
    { name: "Makeup", nameAr: "المكياج", href: "/shop?category=Makeup" },
    { name: "Brands", nameAr: "العلامات", href: "/brands" },
    { name: "Offers", nameAr: "العروض", href: "/offers" },
  ];

  const mobileNavItems = [
    { name: "Skin Care", nameAr: "العناية بالبشرة", href: "/shop?category=Skin%20Care" },
    { name: "Hair Care", nameAr: "العناية بالشعر", href: "/shop?category=Hair%20Care" },
    { name: "Makeup", nameAr: "المكياج", href: "/shop?category=Makeup" },
    { name: "New Arrivals", nameAr: "وصل حديثاً", href: "/shop" },
    { name: "Special Offers", nameAr: "عروض خاصة", href: "/offers" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-muted"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* LEFT: Mobile Menu & Search Trigger */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* CENTER: The Luxury Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <Link to="/" className="block">
              <h1 className="font-serif text-2xl font-light tracking-wider text-foreground md:text-3xl">
                <span className="font-normal">ASPER</span>
                <span className="text-primary ml-1 text-sm font-sans tracking-widest uppercase">Beauty</span>
              </h1>
            </Link>
          </div>

          {/* MIDDLE: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group flex items-center gap-1 font-sans text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-primary"
              >
                {isAr ? item.nameAr : item.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Tools (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Animated Search Bar */}
            <div 
              className={cn(
                "hidden md:flex items-center gap-2 rounded-full border border-muted bg-muted/50 px-4 py-2 transition-all duration-300",
                isSearchFocused ? "w-64 border-primary" : "w-44"
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={isAr ? "بحث..." : "Search..."}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Mobile Search Icon */}
            <button className="md:hidden text-foreground hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* User Account */}
            <Link 
              to="/account"
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
            >
              <User className="h-5 w-5" />
              <ChevronDown className="h-3 w-3 hidden md:block" />
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-foreground hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <button className="relative flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </div>
              {isScrolled && (
                <span className="hidden md:inline text-sm font-medium">
                  {isAr ? "السلة" : "Bag"}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background transition-all duration-500",
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="absolute top-8 right-8 text-foreground hover:text-primary transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
        
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl font-light text-foreground transition-colors hover:text-primary"
            >
              {isAr ? item.nameAr : item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default GlobalHeader;
