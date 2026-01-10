import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const whatsappNumber = "962790656666";
  const message = isArabic 
    ? "مرحباً، أريد الاستفسار عن منتجاتكم" 
    : "Hello, I'd like to inquire about your products";
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip */}
      <div 
        className={`absolute bottom-full right-0 mb-3 whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-foreground text-cream px-4 py-2 rounded-lg shadow-lg font-body text-sm">
          {isArabic ? 'تحدث معنا على واتساب' : 'Chat with us on WhatsApp'}
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-foreground rotate-45" />
        </div>
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        
        {/* Main button */}
        <div className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
        </div>
      </div>
    </a>
  );
};
