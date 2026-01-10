import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram } from "lucide-react";

export const InstagramFeed = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      likes: 342,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
      likes: 287,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      likes: 456,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
      likes: 198,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
      likes: 523,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
      likes: 389,
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
