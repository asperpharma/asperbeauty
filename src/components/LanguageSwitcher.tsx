import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher = ({ variant = "default" }: { variant?: "default" | "mobile" }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={toggleLanguage}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-cream font-display text-sm tracking-wider transition-colors hover:bg-gold-light"
        aria-label="Toggle language"
      >
        <Globe className="w-4 h-4" />
        <span>{language === 'en' ? 'العربية' : 'English'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-gold text-cream font-display text-sm tracking-wider transition-all hover:bg-gold-light shadow-sm"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'EN'}</span>
      <span className="sm:hidden">{language === 'en' ? 'ع' : 'EN'}</span>
    </button>
  );
};
