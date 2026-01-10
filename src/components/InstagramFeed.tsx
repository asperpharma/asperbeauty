import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram } from "lucide-react";

export const InstagramFeed = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
      likes: 234,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop",
      likes: 187,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
      likes: 312,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop",
      likes: 156,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop",
      likes: 289,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=300&h=300&fit=crop",
      likes: 198,
    },
  ];

  return (
    <section className="py-16 bg-cream">
      <div className="luxury-container">
        <div className="text-center mb-10">
          <h2 className="luxury-heading text-3xl md:text-4xl mb-3">
            {isArabic ? "تابعنا على انستغرام" : "Follow Us on Instagram"}
          </h2>
          <a
            href="https://www.instagram.com/asper.beauty.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Instagram className="w-5 h-5" />
            @asper.beauty.shop
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/asper.beauty.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cream flex items-center gap-1">
                  <Instagram className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/asper.beauty.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-button luxury-button-secondary inline-flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            {isArabic ? "تابعنا" : "Follow Us"}
          </a>
        </div>
      </div>
    </section>
  );
};
