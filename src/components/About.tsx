export const About = () => {
  return (
    <section id="about" className="py-24 bg-cream">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="luxury-subheading text-accent mb-4">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight">
              Beauty in 
              <span className="italic block">Simplicity</span>
            </h2>
            <div className="luxury-divider !mx-0 mb-8" />
            <div className="space-y-6 text-muted-foreground font-body leading-relaxed">
              <p>
                At Asper Beauty Shop, we believe true beauty emerges from the harmony 
                of premium ingredients, thoughtful formulations, and mindful rituals.
              </p>
              <p>
                Each product in our collection is meticulously selected to deliver 
                exceptional results while honoring your skin's natural balance. 
                We partner exclusively with brands that share our commitment to 
                quality, sustainability, and efficacy.
              </p>
              <p>
                Experience the difference of luxury beauty, where every detail 
                matters and every product tells a story of excellence.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <p className="font-display text-3xl text-foreground">100%</p>
                <p className="luxury-subheading text-muted-foreground mt-1">Authentic</p>
              </div>
              <div>
                <p className="font-display text-3xl text-foreground">50+</p>
                <p className="luxury-subheading text-muted-foreground mt-1">Brands</p>
              </div>
              <div>
                <p className="font-display text-3xl text-foreground">24/7</p>
                <p className="luxury-subheading text-muted-foreground mt-1">Support</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-[4/5] bg-secondary rounded overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-dark to-secondary">
                  <div className="text-center p-8">
                    <span className="font-display text-6xl text-accent/30">A</span>
                    <p className="luxury-subheading text-muted-foreground mt-4">Premium Beauty</p>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-accent/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
