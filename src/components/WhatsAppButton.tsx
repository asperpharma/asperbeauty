import { useLanguage } from "@/contexts/LanguageContext";

export const WhatsAppButton = () => {
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
      className="fixed bottom-6 right-6 z-50"
      aria-label="Chat on WhatsApp"
    >
      <svg 
        viewBox="0 0 48 48" 
        className="w-14 h-14 hover:scale-110 transition-transform duration-300 drop-shadow-lg"
      >
        <circle cx="24" cy="24" r="24" fill="#25D366" />
        <path
          fill="white"
          d="M24 11.5c-6.9 0-12.5 5.6-12.5 12.5 0 2.2.6 4.3 1.6 6.2l-1.7 6.3 6.5-1.7c1.8.9 3.8 1.4 5.9 1.4 6.9 0 12.5-5.6 12.5-12.5S30.9 11.5 24 11.5zm6.1 17.2c-.3.8-1.5 1.5-2.1 1.6-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-5-4.4-5.1-4.6-.1-.2-1-1.3-1-2.6s.6-1.8.9-2.1c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.3-.3.5-.1.2-.3.4-.4.5-.2.2-.4.3-.2.6.2.3 1 1.6 2.1 2.6 1.4 1.2 2.6 1.6 3 1.8.4.2.6.1.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 1.8.9 2.2 1 .4.2.6.3.7.4.1.2.1.9-.2 1.7z"
        />
      </svg>
    </a>
  );
};
