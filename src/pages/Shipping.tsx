import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Truck, Clock, MapPin, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Shipping() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-soft-ivory">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-playfair font-bold text-dark-charcoal mb-4">
              {isAr ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
            </h1>
            <p className="text-lg text-gray-600">
              {isAr 
                ? 'نقدم خدمة توصيل سريعة وآمنة لجميع طلباتك'
                : 'We provide fast and secure delivery for all your orders'}
            </p>
          </div>

          {/* Shipping Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <Truck className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'طرق الشحن' : 'Shipping Methods'}
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'توصيل قياسي (3-5 أيام عمل)' : 'Standard Delivery (3-5 business days)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'توصيل سريع (1-2 يوم عمل)' : 'Express Delivery (1-2 business days)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'توصيل في نفس اليوم (متاح في عمان)' : 'Same Day Delivery (available in Amman)'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <Clock className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'أوقات التوصيل' : 'Delivery Times'}
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'الأحد - الخميس: 9 صباحاً - 8 مساءً' : 'Sunday - Thursday: 9 AM - 8 PM'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'السبت: 10 صباحاً - 6 مساءً' : 'Saturday: 10 AM - 6 PM'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'الجمعة: مغلق' : 'Friday: Closed'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <MapPin className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'مناطق التوصيل' : 'Delivery Areas'}
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'عمان وضواحيها' : 'Amman and suburbs'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'جميع محافظات المملكة' : 'All governorates of Jordan'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'توصيل دولي (دول مختارة)' : 'International shipping (selected countries)'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <Package className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'تكاليف الشحن' : 'Shipping Costs'}
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'شحن مجاني للطلبات فوق 50 دينار' : 'Free shipping on orders over JOD 50'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'توصيل قياسي: 3 دنانير' : 'Standard delivery: JOD 3'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'توصيل سريع: 5 دنانير' : 'Express delivery: JOD 5'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-charcoal mb-6">
              {isAr ? 'معلومات إضافية' : 'Additional Information'}
            </h2>
            
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'تتبع الطلب' : 'Order Tracking'}
                </h3>
                <p>
                  {isAr 
                    ? 'ستتلقى رقم تتبع عبر البريد الإلكتروني أو الرسائل النصية بمجرد شحن طلبك. يمكنك تتبع طلبك من خلال صفحة تتبع الطلبات.'
                    : 'You will receive a tracking number via email or SMS once your order is shipped. You can track your order through our order tracking page.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'التعبئة والتغليف' : 'Packaging'}
                </h3>
                <p>
                  {isAr 
                    ? 'جميع المنتجات معبأة بعناية لضمان وصولها بحالة ممتازة. نستخدم مواد صديقة للبيئة عندما يكون ذلك ممكناً.'
                    : 'All products are carefully packaged to ensure they arrive in excellent condition. We use eco-friendly materials whenever possible.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'التسليم الآمن' : 'Safe Delivery'}
                </h3>
                <p>
                  {isAr 
                    ? 'فريق التوصيل لدينا مدرب على التعامل مع منتجات التجميل بعناية. في حالة وجود أي ضرر أثناء الشحن، يرجى الاتصال بنا فوراً.'
                    : 'Our delivery team is trained to handle beauty products with care. In case of any damage during shipping, please contact us immediately.'}
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
