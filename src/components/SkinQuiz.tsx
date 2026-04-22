import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Flame, Sparkles, Sun, Leaf, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type SkinConcern = 'acne' | 'aging' | 'dryness' | 'pigmentation';
type SkinType = 'oily' | 'dry' | 'normal' | 'combination';

interface QuizStep {
  step: number;
  question: string;
  questionAr: string;
}

interface ConcernOption {
  id: SkinConcern;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
}

interface TypeOption {
  id: SkinType;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  description: string;
  descriptionAr: string;
}

const concerns: ConcernOption[] = [
  {
    id: 'acne',
    label: 'Acne & Blemishes',
    labelAr: 'حب الشباب والبثور',
    icon: Flame,
    color: 'bg-red-50 hover:bg-red-100 border-red-200',
  },
  {
    id: 'aging',
    label: 'Fine Lines & Aging',
    labelAr: 'التجاعيد والشيخوخة',
    icon: Sparkles,
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
  },
  {
    id: 'dryness',
    label: 'Dryness & Dehydration',
    labelAr: 'الجفاف وفقدان الرطوبة',
    icon: Droplets,
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
  {
    id: 'pigmentation',
    label: 'Dark Spots & Pigmentation',
    labelAr: 'البقع الداكنة والتصبغات',
    icon: Sun,
    color: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
  },
];

const skinTypes: TypeOption[] = [
  {
    id: 'oily',
    label: 'Oily',
    labelAr: 'دهنية',
    icon: Droplets,
    description: 'Shiny, enlarged pores',
    descriptionAr: 'لامعة، مسام واسعة',
  },
  {
    id: 'dry',
    label: 'Dry',
    labelAr: 'جافة',
    icon: Wind,
    description: 'Tight, flaky skin',
    descriptionAr: 'مشدودة، متقشرة',
  },
  {
    id: 'normal',
    label: 'Normal',
    labelAr: 'عادية',
    icon: Leaf,
    description: 'Balanced, comfortable',
    descriptionAr: 'متوازنة، مريحة',
  },
  {
    id: 'combination',
    label: 'Combination',
    labelAr: 'مختلطة',
    icon: Sun,
    description: 'Oily T-zone, dry cheeks',
    descriptionAr: 'منطقة T دهنية، خدود جافة',
  },
];

export const SkinQuiz = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedConcern, setSelectedConcern] = useState<SkinConcern | null>(null);
  const [selectedType, setSelectedType] = useState<SkinType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConcernSelect = (concern: SkinConcern) => {
    setSelectedConcern(concern);
    animateToNextStep(2);
  };

  const handleTypeSelect = (type: SkinType) => {
    setSelectedType(type);
    animateToNextStep(3);
  };

  const animateToNextStep = (step: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 400);
  };

  const handleViewResults = () => {
    // Navigate to filtered collection or skin concerns page
    if (selectedConcern) {
      navigate(`/skin-concerns?concern=${selectedConcern}&type=${selectedType}`);
    } else {
      navigate('/skin-concerns');
    }
  };

  const handleReset = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedConcern(null);
      setSelectedType(null);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-cream/30 to-background">
      <div className="luxury-container">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
            {isArabic ? 'اكتشفي روتينك المثالي' : 'Find Your Perfect Routine'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isArabic 
              ? 'أجيبي على سؤالين بسيطين لنساعدك في اختيار المنتجات المناسبة لبشرتك'
              : 'Answer 2 simple questions to get personalized product recommendations'}
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1 rounded-full transition-all duration-400 ${
                  step <= currentStep
                    ? 'w-12 bg-gold'
                    : 'w-8 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quiz Steps */}
        <div 
          className={`max-w-4xl mx-auto transition-opacity duration-400 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          
          {/* Step 1: Skin Concern */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-serif text-center text-foreground mb-8">
                {isArabic ? 'ما هو أكبر اهتمام لديك؟' : 'What is your main concern?'}
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {concerns.map((concern) => {
                  const Icon = concern.icon;
                  return (
                    <button
                      key={concern.id}
                      onClick={() => handleConcernSelect(concern.id)}
                      className={`p-6 rounded-lg border-2 transition-all duration-400 ${concern.color} hover:scale-105 active:scale-95`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-3 text-foreground" />
                      <p className="text-sm font-medium text-foreground text-center">
                        {isArabic ? concern.labelAr : concern.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Skin Type */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-serif text-center text-foreground mb-8">
                {isArabic ? 'ما هو نوع بشرتك؟' : 'What is your skin type?'}
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {skinTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className="p-6 rounded-lg border-2 bg-white hover:bg-cream border-border hover:border-gold transition-all duration-400 hover:scale-105 active:scale-95"
                    >
                      <Icon className="w-8 h-8 mx-auto mb-3 text-gold" />
                      <p className="text-sm font-medium text-foreground mb-1">
                        {isArabic ? type.labelAr : type.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? type.descriptionAr : type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && (
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 mb-4">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-serif text-foreground">
                {isArabic ? '✨ روتينك المخصص جاهز!' : '✨ Your Custom Routine is Ready!'}
              </h3>
              
              <div className="max-w-md mx-auto space-y-4 text-muted-foreground">
                <p>
                  {isArabic 
                    ? `اخترت: ${concerns.find(c => c.id === selectedConcern)?.labelAr || ''}`
                    : `You selected: ${concerns.find(c => c.id === selectedConcern)?.label || ''}`
                  }
                </p>
                <p>
                  {isArabic 
                    ? `نوع بشرتك: ${skinTypes.find(t => t.id === selectedType)?.labelAr || ''}`
                    : `Your skin type: ${skinTypes.find(t => t.id === selectedType)?.label || ''}`
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Button
                  onClick={handleViewResults}
                  className="px-8 py-6 bg-burgundy text-white hover:bg-burgundy-light font-medium tracking-wide"
                >
                  {isArabic ? 'عرض المنتجات المقترحة' : 'View Recommended Products'}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-8 py-6 border-border hover:border-gold"
                >
                  {isArabic ? 'ابدأ من جديد' : 'Start Over'}
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
