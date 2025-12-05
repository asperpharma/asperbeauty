import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setCartOpen = useCartStore((state) => state.setOpen);

  const navLinks = [
    { name: "Shop", href: "/#products" },
    { name: "Collections", href: "/#collections" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="luxury-container">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="luxury-subheading luxury-link text-foreground hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Logo */}
          <Link to="/" className="text-center">
            <h1 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
              ASPER
            </h1>
            <p className="luxury-subheading text-muted-foreground -mt-1">
              Beauty Shop
            </p>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.slice(2).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="luxury-subheading luxury-link text-foreground hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-foreground hover:text-accent transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-body">
                {totalItems}
              </span>
            )}
          </button>
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
                  className="luxury-subheading text-foreground hover:text-accent transition-colors py-2"
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
