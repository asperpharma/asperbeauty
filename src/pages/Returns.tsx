import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RotateCcw, Shield, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Returns() {
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
              {isAr ? 'سياسة الإرجاع والاستبدال' : 'Return & Exchange Policy'}
            </h1>
            <p className="text-lg text-gray-600">
              {isAr 
                ? 'نحن نسعى لضمان رضاك التام عن مشترياتك'
                : 'We strive to ensure your complete satisfaction with your purchases'}
            </p>
          </div>

          {/* Return Policy Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <Clock className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'فترة الإرجاع' : 'Return Period'}
                </h2>
              </div>
              <p className="text-gray-600">
                {isAr 
                  ? 'يمكنك إرجاع أو استبدال المنتجات خلال 14 يوماً من تاريخ الاستلام، بشرط أن تكون في حالتها الأصلية وغير مستخدمة.'
                  : 'You can return or exchange products within 14 days of receipt, provided they are in their original condition and unused.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <Shield className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'ضمان الجودة' : 'Quality Guarantee'}
                </h2>
              </div>
              <p className="text-gray-600">
                {isAr 
                  ? 'جميع منتجاتنا أصلية 100%. إذا وجدت أي مشكلة في الجودة، سنستبدل المنتج فوراً أو نعيد المبلغ كاملاً.'
                  : 'All our products are 100% authentic. If you find any quality issues, we will replace the product immediately or provide a full refund.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <RotateCcw className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'عملية الإرجاع' : 'Return Process'}
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">1.</span>
                  <span>{isAr ? 'اتصل بخدمة العملاء' : 'Contact customer service'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">2.</span>
                  <span>{isAr ? 'احصل على رقم إرجاع (RMA)' : 'Get a return number (RMA)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">3.</span>
                  <span>{isAr ? 'أعد تعبئة المنتج' : 'Repackage the product'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">4.</span>
                  <span>{isAr ? 'أرسل المنتج إلينا' : 'Ship the product to us'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-maroon/10 rounded-full">
                  <CheckCircle className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-xl font-semibold text-dark-charcoal">
                  {isAr ? 'شروط الإرجاع' : 'Return Conditions'}
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'المنتج غير مستخدم ومختوم' : 'Product unused and sealed'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'التعبئة الأصلية سليمة' : 'Original packaging intact'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-1">•</span>
                  <span>{isAr ? 'إيصال الشراء متوفر' : 'Purchase receipt available'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-dark-charcoal mb-6">
              {isAr ? 'سياسة الإرجاع التفصيلية' : 'Detailed Return Policy'}
            </h2>
            
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'المنتجات المؤهلة للإرجاع' : 'Eligible Products for Return'}
                </h3>
                <p>
                  {isAr 
                    ? 'معظم منتجات العناية بالبشرة والتجميل مؤهلة للإرجاع أو الاستبدال، بشرط أن تكون مختومة وغير مفتوحة. لا يمكن إرجاع المنتجات المخصصة أو العروض الخاصة إلا في حالة وجود عيب.'
                    : 'Most skincare and beauty products are eligible for return or exchange, provided they are sealed and unopened. Personalized products or special offers can only be returned if defective.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'المنتجات غير القابلة للإرجاع' : 'Non-Returnable Products'}
                </h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{isAr ? 'المنتجات المفتوحة أو المستخدمة' : 'Opened or used products'}</li>
                  <li>{isAr ? 'منتجات النظافة الشخصية' : 'Personal hygiene products'}</li>
                  <li>{isAr ? 'المنتجات المخصصة' : 'Customized products'}</li>
                  <li>{isAr ? 'منتجات التخليص النهائي' : 'Final sale clearance items'}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'رد الأموال' : 'Refunds'}
                </h3>
                <p>
                  {isAr 
                    ? 'سيتم رد الأموال إلى طريقة الدفع الأصلية خلال 7-10 أيام عمل بعد استلام المرتجعات ومعالجتها. تكاليف الشحن غير قابلة للاسترداد إلا في حالة وجود خطأ من جانبنا.'
                    : 'Refunds will be issued to the original payment method within 7-10 business days after receiving and processing returns. Shipping costs are non-refundable except in case of our error.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'الاستبدال' : 'Exchanges'}
                </h3>
                <p>
                  {isAr 
                    ? 'إذا كنت ترغب في استبدال منتج، سنقوم بشحن المنتج البديل بمجرد استلام المنتج الأصلي. الاستبدالات مجانية للمنتجات المعيبة.'
                    : 'If you wish to exchange a product, we will ship the replacement item once we receive the original product. Exchanges are free for defective products.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-charcoal mb-2">
                  {isAr ? 'المنتجات التالفة أو المعيبة' : 'Damaged or Defective Products'}
                </h3>
                <p>
                  {isAr 
                    ? 'إذا استلمت منتجاً تالفاً أو معيباً، يرجى الاتصال بنا خلال 48 ساعة من الاستلام. سنستبدل المنتج أو نعيد المبلغ كاملاً، بما في ذلك تكاليف الشحن.'
                    : 'If you receive a damaged or defective product, please contact us within 48 hours of receipt. We will replace the product or provide a full refund, including shipping costs.'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-maroon text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">
              {isAr ? 'هل لديك أسئلة؟' : 'Have Questions?'}
            </h3>
            <p className="mb-4">
              {isAr 
                ? 'فريق خدمة العملاء لدينا هنا لمساعدتك'
                : 'Our customer service team is here to help you'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+962123456789" className="bg-white text-maroon px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {isAr ? 'اتصل بنا' : 'Call Us'}
              </a>
              <a href="/contact" className="bg-shiny-gold text-dark-charcoal px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                {isAr ? 'راسلنا' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
