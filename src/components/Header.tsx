import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setCartOpen = useCartStore((state) => state.setOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/#products" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="luxury-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-display text-2xl md:text-3xl tracking-wider text-gold">
              ASPER
            </h1>
            <span className="hidden sm:block font-display text-sm text-gold/80 tracking-widest">
              Beauty Shop
            </span>
          </Link>

          {/* Navigation Links - Center/Right (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-display text-sm tracking-wider text-foreground hover:text-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Icons - Right */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button className="p-2 text-gold border border-gold/30 rounded-full hover:bg-gold/10 transition-colors">
              <Search className="h-4 w-4" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-foreground hover:text-gold transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-primary text-xs flex items-center justify-center font-body font-medium">
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
          <div className="lg:hidden py-6 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-foreground hover:text-gold transition-colors py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer />
    </header>
  );
};
