import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 border border-gold/50 hover:border-gold text-gold font-body text-sm transition-colors"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="font-display tracking-wide">
        {language === 'en' ? 'العربية' : 'EN'}
      </span>
    </button>
  );
};
