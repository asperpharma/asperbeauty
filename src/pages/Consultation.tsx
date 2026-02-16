import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageCircle, Video, Calendar, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Consultation() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-soft-ivory">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-playfair font-bold text-dark-charcoal mb-4">
              {isAr ? 'استشارات التجميل' : 'Beauty Consultations'}
            </h1>
            <p className="text-lg text-gray-600">
              {isAr 
                ? 'احصل على نصائح شخصية من خبراء العناية بالبشرة لدينا'
                : 'Get personalized advice from our skincare experts'}
            </p>
          </div>

          {/* Consultation Types */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-maroon/10 rounded-full">
                  <MessageCircle className="w-8 h-8 text-maroon" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-dark-charcoal mb-2">
                {isAr ? 'استشارة عبر الدردشة' : 'Chat Consultation'}
              </h2>
              <p className="text-gray-600 mb-4">
                {isAr 
                  ? 'احصل على إجابات فورية لأسئلتك عبر الدردشة المباشرة'
                  : 'Get instant answers to your questions via live chat'}
              </p>
              <p className="text-2xl font-bold text-maroon mb-4">
                {isAr ? 'مجاني' : 'Free'}
              </p>
              <Button 
                onClick={() => navigate('/analyze')}
                className="w-full bg-maroon hover:bg-maroon/90"
              >
                {isAr ? 'ابدأ الآن' : 'Start Now'}
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-maroon/10 rounded-full">
                  <Video className="w-8 h-8 text-maroon" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-dark-charcoal mb-2">
                {isAr ? 'استشارة عبر الفيديو' : 'Video Consultation'}
              </h2>
              <p className="text-gray-600 mb-4">
                {isAr 
                  ? 'استشارة فيديو مباشرة مع خبير العناية بالبشرة'
                  : 'Live video consultation with a skincare expert'}
              </p>
              <p className="text-2xl font-bold text-maroon mb-4">
                {isAr ? '15 دينار' : 'JOD 15'}
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="w-full bg-maroon hover:bg-maroon/90"
              >
                {isAr ? 'احجز موعد' : 'Book Now'}
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-maroon/10 rounded-full">
                  <Calendar className="w-8 h-8 text-maroon" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-dark-charcoal mb-2">
                {isAr ? 'استشارة شخصية' : 'In-Person Consultation'}
              </h2>
              <p className="text-gray-600 mb-4">
                {isAr 
                  ? 'زيارة شخصية مع تحليل شامل للبشرة'
                  : 'Personal visit with comprehensive skin analysis'}
              </p>
              <p className="text-2xl font-bold text-maroon mb-4">
                {isAr ? '25 دينار' : 'JOD 25'}
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="w-full bg-maroon hover:bg-maroon/90"
              >
                {isAr ? 'احجز موعد' : 'Book Now'}
              </Button>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-dark-charcoal mb-6">
              {isAr ? 'ماذا تتوقع من الاستشارة' : 'What to Expect'}
            </h2>
            
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'تحليل البشرة' : 'Skin Analysis'}
                </h3>
                <p>
                  {isAr 
                    ? 'سيقوم خبيرنا بتحليل نوع بشرتك، وتحديد مشاكلها، وفهم احتياجاتها الخاصة لتقديم توصيات مخصصة.'
                    : 'Our expert will analyze your skin type, identify concerns, and understand your unique needs to provide personalized recommendations.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'روتين العناية بالبشرة' : 'Skincare Routine'}
                </h3>
                <p>
                  {isAr 
                    ? 'ستحصل على روتين عناية بالبشرة مخصص يتناسب مع نوع بشرتك واحتياجاتها، مع توصيات بالمنتجات المناسبة.'
                    : 'You will receive a customized skincare routine tailored to your skin type and needs, with product recommendations.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'نصائح الخبراء' : 'Expert Tips'}
                </h3>
                <p>
                  {isAr 
                    ? 'احصل على نصائح احترافية حول كيفية استخدام المنتجات بشكل صحيح، وأفضل الممارسات للعناية بالبشرة.'
                    : 'Get professional tips on how to use products correctly and best practices for skincare.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'المتابعة' : 'Follow-up'}
                </h3>
                <p>
                  {isAr 
                    ? 'يمكنك التواصل معنا في أي وقت لطرح الأسئلة أو الحصول على مشورة إضافية بعد الاستشارة.'
                    : 'You can reach out anytime to ask questions or get additional advice after your consultation.'}
                </p>
              </div>
            </div>
          </div>

          {/* AI-Powered Tool CTA */}
          <div className="bg-gradient-to-r from-maroon to-maroon/80 text-white p-8 rounded-lg text-center mb-8">
            <Star className="w-12 h-12 mx-auto mb-4 text-shiny-gold" />
            <h2 className="text-2xl font-semibold mb-4">
              {isAr ? 'جرب مساعدنا الذكي للعناية بالبشرة' : 'Try Our AI Beauty Assistant'}
            </h2>
            <p className="mb-6 text-white/90">
              {isAr 
                ? 'احصل على توصيات فورية ومخصصة باستخدام تقنية الذكاء الاصطناعي المتقدمة'
                : 'Get instant, personalized recommendations using advanced AI technology'}
            </p>
            <Button 
              onClick={() => navigate('/analyze')}
              className="bg-shiny-gold text-dark-charcoal hover:bg-yellow-500 px-8 py-3 text-lg"
            >
              {isAr ? 'ابدأ التحليل الآن' : 'Start Analysis Now'}
            </Button>
          </div>

          {/* Testimonials */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-charcoal mb-6 text-center">
              {isAr ? 'آراء العملاء' : 'Customer Reviews'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-shiny-gold text-shiny-gold" />
                  ))}
                </div>
                <p className="text-gray-600 mb-2">
                  {isAr 
                    ? '"استشارة رائعة! ساعدتني الخبيرة في اختيار المنتجات المناسبة لبشرتي الحساسة."'
                    : '"Amazing consultation! The expert helped me choose the right products for my sensitive skin."'}
                </p>
                <p className="text-sm font-semibold text-dark-charcoal">
                  {isAr ? '- سارة م.' : '- Sarah M.'}
                </p>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-shiny-gold text-shiny-gold" />
                  ))}
                </div>
                <p className="text-gray-600 mb-2">
                  {isAr 
                    ? '"تجربة ممتازة! حصلت على روتين عناية مخصص وبدأت أرى النتائج بعد أسبوعين."'
                    : '"Excellent experience! I got a personalized routine and started seeing results after two weeks."'}
                </p>
                <p className="text-sm font-semibold text-dark-charcoal">
                  {isAr ? '- ليلى ع.' : '- Layla A.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
