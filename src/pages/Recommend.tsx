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

  // Filter products based on skin concern and type
  const recommendedProducts = (() => {
    if (!productsData || productsData.length === 0) return [];
    
    // Define keywords for each concern and skin type
    const concernKeywords: Record<string, string[]> = {
      'aging': ['retinol', 'anti-aging', 'wrinkle', 'collagen', 'peptide', 'vitamin c', 'firming'],
      'acne': ['acne', 'salicylic', 'bha', 'benzoyl', 'niacinamide', 'clay', 'purifying'],
      'hydration': ['hyaluronic', 'hydrating', 'moisturizer', 'aqua', 'water', 'moisture'],
      'brightening': ['vitamin c', 'brightening', 'glow', 'radiance', 'luminous', 'even tone'],
      'sensitivity': ['sensitive', 'soothing', 'calming', 'gentle', 'fragrance-free', 'hypoallergenic'],
      'dark-spots': ['dark spot', 'pigment', 'vitamin c', 'brightening', 'even tone', 'niacinamide'],
    };

    const skinTypeKeywords: Record<string, string[]> = {
      'dry': ['dry', 'rich', 'nourishing', 'cream', 'oil', 'butter'],
      'oily': ['oily', 'matte', 'oil-free', 'gel', 'lightweight', 'sebum'],
      'combination': ['combination', 'balance', 'normal', 'all skin'],
      'sensitive': ['sensitive', 'gentle', 'soothing', 'fragrance-free'],
      'normal': ['normal', 'all skin', 'balance'],
    };

    // Score products based on relevance
    const scoredProducts = productsData.map(product => {
      const title = product.node.title.toLowerCase();
      const description = product.node.description.toLowerCase();
      const productType = product.node.productType?.toLowerCase() || '';
      const nodeWithTags = product.node as typeof product.node & { tags?: string | string[] };
      const tags = Array.isArray(nodeWithTags.tags) 
        ? nodeWithTags.tags.join(' ').toLowerCase()
        : typeof nodeWithTags.tags === 'string' 
          ? nodeWithTags.tags.toLowerCase() 
          : '';
      
      const searchText = `${title} ${description} ${productType} ${tags}`;
      
      let score = 0;
      
      // Score based on concern (highest priority)
      const concernWords = concernKeywords[analysis.concern] || [];
      concernWords.forEach(keyword => {
        if (searchText.includes(keyword)) score += 3;
      });
      
      // Score based on skin type (medium priority)
      const skinTypeWords = skinTypeKeywords[analysis.skinType] || [];
      skinTypeWords.forEach(keyword => {
        if (searchText.includes(keyword)) score += 2;
      });
      
      // Bonus for essential products (cleanser, moisturizer, serum)
      if (searchText.includes('cleanser') || searchText.includes('wash')) score += 1;
      if (searchText.includes('moisturizer') || searchText.includes('cream')) score += 1;
      if (searchText.includes('serum')) score += 1;
      if (searchText.includes('sunscreen') || searchText.includes('spf')) score += 1;
      
      return { product, score };
    });

    // Sort by score (highest first) and return top 6
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.product);
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
