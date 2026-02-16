import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DigitalTrayProductCard } from "@/components/DigitalTrayProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

interface SkinAnalysis {
  skinType: string;
  concern: string;
  age: string;
}

/**
 * Recommend Page - Step 2 of 3-Click Solution
 * Displays personalized product regimen based on skin analysis
 * Features: Digital Tray product cards, RTL support, accessibility
 */
export default function Recommend() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const { data: productsData, isLoading } = useShopifyProducts();

  const isRTL = language === 'ar';

  useEffect(() => {
    // Get analysis from session storage
    const storedAnalysis = sessionStorage.getItem('skinAnalysis');
    if (!storedAnalysis) {
      // If no analysis, redirect to analyze page
      navigate('/analyze');
      return;
    }
    setAnalysis(JSON.parse(storedAnalysis));
  }, [navigate]);

  // Filter products based on skin analysis
  const recommendedProducts = (() => {
    if (!productsData || !analysis) return [];
    
    // Map concern keywords for product filtering
    const concernKeywords: Record<string, string[]> = {
      'aging': ['anti-aging', 'anti aging', 'retinol', 'wrinkle', 'firming', 'lift', 'age', 'mature'],
      'acne': ['acne', 'blemish', 'clear', 'purifying', 'salicylic', 'spot', 'anti-blemish'],
      'hydration': ['hydrat', 'moisture', 'hyaluronic', 'aqua', 'replenish', 'plump'],
      'brightening': ['bright', 'vitamin c', 'radiance', 'glow', 'illuminate', 'even tone', 'dark spot'],
      'sensitivity': ['sensitive', 'soothing', 'calm', 'gentle', 'tolerance', 'repair', 'comfort'],
      'dark-spots': ['dark spot', 'pigment', 'bright', 'even', 'vitamin c', 'niacinamide', 'hyperpigmentation']
    };
    
    // Map skin type keywords
    const skinTypeKeywords: Record<string, string[]> = {
      'normal': ['normal', 'balance', 'all skin'],
      'dry': ['dry', 'moisture', 'hydrat', 'nourish', 'rich', 'comfort'],
      'oily': ['oily', 'oil control', 'mattifying', 'pore', 'sebum', 'shine'],
      'combination': ['combination', 'balance', 'normalize', 'all skin'],
      'sensitive': ['sensitive', 'gentle', 'soothing', 'hypoallergenic', 'fragrance-free', 'tolerance']
    };
    
    const concernWords = concernKeywords[analysis.concern] || [];
    const skinTypeWords = skinTypeKeywords[analysis.skinType] || [];
    const allKeywords = [...concernWords, ...skinTypeWords];
    
    // Score and filter products
    const scoredProducts = productsData.map(product => {
      const searchText = [
        product.node.title,
        product.node.description,
        product.node.productType,
        ...(product.node.tags || [])
      ].join(' ').toLowerCase();
      
      let score = 0;
      
      // Score based on concern keywords (higher priority)
      concernWords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 3;
        }
      });
      
      // Score based on skin type keywords
      skinTypeWords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 2;
        }
      });
      
      // Bonus for specific product types
      if (analysis.concern === 'aging' && searchText.includes('serum')) score += 1;
      if (analysis.concern === 'hydration' && searchText.includes('cream')) score += 1;
      if (analysis.concern === 'acne' && (searchText.includes('cleanser') || searchText.includes('gel'))) score += 1;
      
      return { product, score };
    });
    
    // Sort by score and return top products
    const filtered = scoredProducts
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(p => p.product);
    
    // If we have filtered results, return top 6, otherwise return first 6 products as fallback
    return filtered.length > 0 ? filtered.slice(0, 6) : productsData.slice(0, 6);
  })();

  const handleProceedToRegimen = () => {
    navigate('/regimen');
  };

  if (!analysis) {
    return null;
  }

  const getSkinTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      normal: { en: 'Normal', ar: 'عادية' },
      dry: { en: 'Dry', ar: 'جافة' },
      oily: { en: 'Oily', ar: 'دهنية' },
      combination: { en: 'Combination', ar: 'مختلطة' },
      sensitive: { en: 'Sensitive', ar: 'حساسة' },
    };
    return isRTL ? labels[type]?.ar : labels[type]?.en;
  };

  const getConcernLabel = (concern: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      aging: { en: 'Anti-Aging', ar: 'مكافحة الشيخوخة' },
      acne: { en: 'Acne', ar: 'حب الشباب' },
      hydration: { en: 'Hydration', ar: 'الترطيب' },
      brightening: { en: 'Brightening', ar: 'التفتيح' },
      sensitivity: { en: 'Sensitivity', ar: 'الحساسية' },
      'dark-spots': { en: 'Dark Spots', ar: 'البقع الداكنة' },
    };
    return isRTL ? labels[concern]?.ar : labels[concern]?.en;
  };

  return (
    <div className="min-h-screen bg-luxury-ivory" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-gold/10 mb-6">
              <Sparkles className="w-8 h-8 text-luxury-gold" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-luxury-charcoal mb-4">
              {isRTL ? 'نظامك المخصص' : 'Your Personalized Regimen'}
            </h1>
            <p className="font-body text-lg text-luxury-charcoal/70 max-w-2xl mx-auto mb-6">
              {isRTL 
                ? 'بناءً على تحليلك، نوصي بنظام العناية بالبشرة التالي'
                : 'Based on your analysis, we recommend the following skincare regimen'
              }
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-luxury-charcoal/60">
              <span className="w-8 h-1 bg-luxury-gold rounded"></span>
              <span className="w-8 h-1 bg-luxury-gold rounded"></span>
              <span className="font-body">{isRTL ? 'الخطوة 2 من 3' : 'Step 2 of 3'}</span>
              <span className="w-8 h-1 bg-gray-300 rounded"></span>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100">
            <h2 className="font-display text-2xl text-luxury-charcoal mb-4">
              {isRTL ? 'ملخص تحليلك' : 'Your Analysis Summary'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="font-body text-sm text-luxury-charcoal/60">
                    {isRTL ? 'نوع البشرة' : 'Skin Type'}
                  </p>
                  <p className="font-body text-base font-semibold text-luxury-charcoal">
                    {getSkinTypeLabel(analysis.skinType)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="font-body text-sm text-luxury-charcoal/60">
                    {isRTL ? 'الاهتمام الأساسي' : 'Primary Concern'}
                  </p>
                  <p className="font-body text-base font-semibold text-luxury-charcoal">
                    {getConcernLabel(analysis.concern)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="font-body text-sm text-luxury-charcoal/60">
                    {isRTL ? 'الفئة العمرية' : 'Age Range'}
                  </p>
                  <p className="font-body text-base font-semibold text-luxury-charcoal">
                    {analysis.age}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products Grid */}
          <div className="mb-12">
            <h2 className="font-display text-3xl text-luxury-charcoal mb-8 text-center">
              {isRTL ? 'المنتجات الموصى بها' : 'Recommended Products'}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProducts.map((product) => (
                  <DigitalTrayProductCard key={product.node.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Button
              onClick={handleProceedToRegimen}
              className="bg-luxury-maroon hover:bg-luxury-maroon/90 text-white font-body text-base px-12 py-6 rounded-lg transition-all duration-300"
            >
              {isRTL ? 'راجع نظامك' : 'Review Your Regimen'}
              <ChevronRight className={`w-5 h-5 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
