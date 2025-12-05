import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to Asper Beauty", {
        description: "You'll receive our exclusive updates soon.",
        position: "top-center",
      });
      setEmail("");
    }
  };

  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground">
      <div className="luxury-container">
        <div className="max-w-2xl mx-auto text-center">
          <p className="luxury-subheading text-gold-light mb-4">Stay Connected</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">
            Join Our World
          </h2>
          <p className="font-body text-primary-foreground/70 mb-10 leading-relaxed">
            Subscribe to receive exclusive offers, early access to new arrivals, 
            and expert beauty insights delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light transition-colors"
              required
            />
            <Button 
              type="submit"
              variant="luxury-gold"
              size="luxury"
              className="whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-primary-foreground/50 font-body mt-6">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
