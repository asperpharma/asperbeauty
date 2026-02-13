import { Facebook, Instagram, MessageCircle } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/asper.beauty.shop/",
    color:
      "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/asper.beauty.shop",
    color: "hover:bg-[#1877F2]",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://wa.me/962790656666",
    color: "hover:bg-[#25D366]",
  },
  {
    name: "TikTok",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    url: "https://www.tiktok.com/@asper.beauty.shop",
    color: "hover:bg-black",
  },
];

export const FloatingSocials = () => {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center bg-foreground/90 text-cream transition-all duration-300 ${social.color} hover:text-white`}
            aria-label={social.name}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] group-hover:pr-3 transition-all duration-300 text-sm font-medium whitespace-nowrap">
              {social.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};
