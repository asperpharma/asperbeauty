export const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-primary">
      <div className="luxury-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Large italicized quote */}
          <blockquote className="font-display text-2xl md:text-4xl lg:text-5xl italic text-cream leading-relaxed mb-12">
            "True beauty is found in the pursuit of indulgence, where luxury meets the art of self-care."
          </blockquote>

          {/* Small gold logo element */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-px bg-gold" />
            <span className="font-display text-lg tracking-widest text-gold">
              ASPER
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
};
