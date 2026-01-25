import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormData } from "@/lib/validationSchemas";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Contact() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod
    const result = contactFormSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error(isAr ? 'يرجى تصحيح الأخطاء أدناه' : 'Please fix the errors below');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For now, we'll just simulate sending (you can add an edge function later)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast.success(isAr ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(isAr ? 'فشل في إرسال الرسالة. حاول مرة أخرى.' : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-40 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr ? (
                <>تواصل <span className="text-gold">معنا</span></>
              ) : (
                <>Contact <span className="text-gold">Us</span></>
              )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr 
                ? 'يسعدنا سماع رأيك. تواصلي معنا لأي استفسار حول منتجاتنا أو خدماتنا.'
                : "We'd love to hear from you. Reach out with any questions about our products or services."}
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="font-display text-2xl text-cream">
                {isAr ? 'تواصلي معنا' : 'Get in Touch'}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-cream mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </h3>
                    <a href="mailto:asperpharma@gmail.com" className="font-body text-cream/60 hover:text-gold transition-colors">
                      asperpharma@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-cream mb-1">
                      {isAr ? 'الهاتف' : 'Phone'}
                    </h3>
                    <a href="tel:+962790656666" className="font-body text-cream/60 hover:text-gold transition-colors" dir="ltr">
                      +962 79 065 6666
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-cream mb-1">
                      {isAr ? 'الموقع' : 'Location'}
                    </h3>
                    <p className="font-body text-cream/60">
                      {isAr ? 'عمان، الأردن' : 'Amman, Jordan'}
                    </p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-4">
                  <h3 className="font-display text-sm text-cream mb-4">
                    {isAr ? 'تابعينا' : 'Follow Us'}
                  </h3>
                  <div className="flex items-center gap-3">
                    <a href="https://www.instagram.com/asper.beauty.box/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <Instagram className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    <a href="https://web.facebook.com/robu.sweileh/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <Facebook className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    <a href="https://wa.me/962790656666" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-300">
                      <TikTokIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary border border-gold/20 p-8">
              <h2 className="font-display text-2xl text-cream mb-6">
                {isAr ? 'أرسلي رسالة' : 'Send a Message'}
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl text-cream">
                    {isAr ? 'تم الإرسال!' : 'Message Sent!'}
                  </h3>
                  <p className="text-cream/60">
                    {isAr ? 'سنرد عليك قريباً' : "We'll get back to you soon"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-body text-sm text-cream/60 mb-2">
                      {isAr ? 'الاسم' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 bg-background border font-body text-cream placeholder:text-cream/40 focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-gold/30 focus:border-gold'
                      }`}
                      placeholder={isAr ? 'اسمك' : 'Your name'}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-cream/60 mb-2">
                      {isAr ? 'البريد الإلكتروني' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 bg-background border font-body text-cream placeholder:text-cream/40 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gold/30 focus:border-gold'
                      }`}
                      placeholder={isAr ? 'بريدك@الإلكتروني.com' : 'your@email.com'}
                      dir="ltr"
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-cream/60 mb-2">
                      {isAr ? 'الرسالة' : 'Message'} *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`w-full px-4 py-3 bg-background border font-body text-cream placeholder:text-cream/40 focus:outline-none transition-colors resize-none ${
                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-gold/30 focus:border-gold'
                      }`}
                      placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                      maxLength={1000}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                    <p className="text-xs text-cream/40 mt-1 text-right">
                      {formData.message.length}/1000
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gold text-background font-display text-sm tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isAr ? 'جاري الإرسال...' : 'SENDING...'}
                      </>
                    ) : (
                      isAr ? 'إرسال الرسالة' : 'SEND MESSAGE'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}