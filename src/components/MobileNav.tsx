import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export const MobileNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setOpen);
  
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/shop", icon: Search, label: "Search" },
    { path: "/wishlist", icon: Heart, label: "Wishlist", badge: totalWishlistItems },
    { action: "cart", icon: ShoppingBag, label: "Bag", badge: totalCartItems },
    { path: "/account", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border py-3 px-6 flex justify-between items-center lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.path ? isActive(item.path) : false;
        
        if (item.action === "cart") {
          return (
            <button
              key={item.label}
              onClick={() => setCartOpen(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground relative"
            >
              <Icon className="h-5 w-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
              <span className="text-[8px] uppercase tracking-tighter font-bold">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.path!}
            className={`flex flex-col items-center gap-1 relative ${
              active ? "text-gold" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-foreground text-background text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
            <span className="text-[8px] uppercase tracking-tighter font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
