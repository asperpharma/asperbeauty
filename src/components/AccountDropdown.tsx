"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  Sparkles, 
  CreditCard,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock User Data - In production, this comes from Supabase Auth
const USER_DATA = {
  name: "Sarah Ahmed",
  email: "sarah.a@example.com",
  tier: "Gold Member",
  points: 1250,
};

export const AccountDropdown = ({ isScrolled }: { isScrolled: boolean }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            isScrolled ? "bg-muted" : "bg-foreground/10"
          )}>
            <User className="h-4 w-4" />
          </div>
          <ChevronDown className="h-3 w-3 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 rounded-none border-border">
        <DropdownMenuLabel className="p-0">
          {/* A. LOYALTY CARD HEADER (The Luxury Touch) */}
          <div className="bg-gradient-to-br from-luxury-black to-gray-800 text-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 bg-gold-400 text-luxury-black text-[9px] font-bold uppercase tracking-widest rounded-sm">
                  {USER_DATA.tier}
                </span>
                <p className="text-lg font-serif mt-2">{USER_DATA.name}</p>
              </div>
              <Sparkles className="h-5 w-5 text-gold-400" />
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  {isAr ? "النقاط المتاحة" : "Available Rewards"}
                </p>
                <p className="text-xl font-bold">{USER_DATA.points} pts</p>
              </div>
              <button className="px-4 py-1.5 bg-gold-400 text-luxury-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-300 transition-colors">
                {isAr ? "استبدال" : "Redeem"}
              </button>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* B. NAVIGATION GROUPS */}
        <div className="p-2">
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
              onClick={() => navigate("/account?tab=orders")}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-gold-500" />
                  {isAr ? "طلباتك" : "Your Beauty Rituals (Orders)"}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
              onClick={() => navigate("/wishlist")}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-gold-500" />
                  {isAr ? "قائمة الأمنيات" : "The Wishlist"}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
              onClick={() => navigate("/account?tab=payment")}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gold-500" />
                  {isAr ? "طرق الدفع" : "Saved Methods"}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
              onClick={() => navigate("/account?tab=settings")}
            >
              <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
              {isAr ? "الإعدادات" : "Preferences"}
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream text-red-500"
              onClick={() => {
                // Handle sign out logic here
                navigate("/auth");
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              {isAr ? "تسجيل الخروج" : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>

        {/* C. FOOTER AD (iHerb Style Promotion) */}
        <div className="bg-cream p-4 border-t border-border">
          <p className="text-[11px] text-center text-muted-foreground">
            {isAr ? "احصلي على 10% مكافآت على كل عملية شراء. " : "Earn 10% back on every purchase. "}
            <Link to="/rewards" className="text-gold-500 font-bold hover:underline">
              {isAr ? "اعرفي المزيد" : "Learn More"}
            </Link>
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;