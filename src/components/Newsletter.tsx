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
        position: "top-center"
      });
      setEmail("");
    }
  };
  return <section id="contact" className="py-24 bg-taupe">
      <div className="luxury-container">
        <div className="max-w-2xl mx-auto text-center">
          <p className="luxury-subheading text-gold mb-4">Stay Connected</p>
          <h2 style={{
          background: 'linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }} className="font-display text-4xl md:text-5xl mb-6 text-rose-800">
            Join Our World
          </h2>
          <p className="font-body text-charcoal/70 mb-10 leading-relaxed">
            Subscribe to receive exclusive offers, early access to new arrivals, 
            and expert beauty insights delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-6 py-4 bg-cream border border-gold/30 text-charcoal placeholder:text-charcoal/40 font-body text-sm focus:outline-none focus:border-gold transition-colors" required />
            <Button type="submit" variant="luxury-gold" size="luxury" className="whitespace-nowrap bg-gold text-charcoal hover:bg-gold-light shadow-md shadow-gold/30">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-charcoal/50 font-body mt-6">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>;
};