import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, Sparkles } from "lucide-react";

/**
 * Analyze Page - Step 1 of 3-Click Solution
 * Medical intake/quiz for skin analysis
 * Features: RTL support, accessibility, luxury design
 */
export default function Analyze() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [skinType, setSkinType] = useState("");
  const [concern, setConcern] = useState("");
  const [age, setAge] = useState("");

  const isRTL = language === "ar";

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();

    // Store analysis results
    const analysis = { skinType, concern, age };
    sessionStorage.setItem("skinAnalysis", JSON.stringify(analysis));

    // Navigate to recommendations
    navigate("/recommend");
  };

  const isFormValid = skinType && concern && age;

  return (
    <div className="min-h-screen bg-luxury-ivory" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      <main className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-gold/10 mb-6">
              <Sparkles className="w-8 h-8 text-luxury-gold" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-luxury-charcoal mb-4">
              {isRTL ? "تحليل بشرتك" : "Analyze Your Skin"}
            </h1>
            <p className="font-body text-lg text-luxury-charcoal/70 max-w-2xl mx-auto">
              {isRTL
                ? "دعونا نفهم احتياجات بشرتك الفريدة لتوصية المنتجات المثالية"
                : "Let's understand your unique skin needs to recommend the perfect products"}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-luxury-charcoal/60">
              <span className="w-8 h-1 bg-luxury-gold rounded"></span>
              <span className="font-body">
                {isRTL ? "الخطوة 1 من 3" : "Step 1 of 3"}
              </span>
              <span className="w-8 h-1 bg-gray-300 rounded"></span>
              <span className="w-8 h-1 bg-gray-300 rounded"></span>
            </div>
          </div>

          {/* Quiz Form */}
          <form
            onSubmit={handleAnalyze}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100"
          >
            {/* Question 1: Skin Type */}
            <div className="mb-10">
              <h2 className="font-display text-2xl text-luxury-charcoal mb-6">
                {isRTL ? "ما هو نوع بشرتك؟" : "What is your skin type?"}
              </h2>
              <RadioGroup value={skinType} onValueChange={setSkinType}>
                <div className="space-y-4">
                  {[
                    { value: "normal", label: isRTL ? "عادية" : "Normal" },
                    { value: "dry", label: isRTL ? "جافة" : "Dry" },
                    { value: "oily", label: isRTL ? "دهنية" : "Oily" },
                    {
                      value: "combination",
                      label: isRTL ? "مختلطة" : "Combination",
                    },
                    {
                      value: "sensitive",
                      label: isRTL ? "حساسة" : "Sensitive",
                    },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-200 rounded-lg hover:border-luxury-gold transition-colors cursor-pointer"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`skin-${option.value}`}
                      />
                      <Label
                        htmlFor={`skin-${option.value}`}
                        className="flex-1 cursor-pointer font-body text-base"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Question 2: Primary Concern */}
            <div className="mb-10">
              <h2 className="font-display text-2xl text-luxury-charcoal mb-6">
                {isRTL
                  ? "ما هو اهتمامك الأساسي بالبشرة؟"
                  : "What is your primary skin concern?"}
              </h2>
              <RadioGroup value={concern} onValueChange={setConcern}>
                <div className="space-y-4">
                  {[
                    {
                      value: "aging",
                      label: isRTL ? "مكافحة الشيخوخة" : "Anti-Aging",
                    },
                    { value: "acne", label: isRTL ? "حب الشباب" : "Acne" },
                    {
                      value: "hydration",
                      label: isRTL ? "الترطيب" : "Hydration",
                    },
                    {
                      value: "brightening",
                      label: isRTL ? "التفتيح" : "Brightening",
                    },
                    {
                      value: "sensitivity",
                      label: isRTL ? "الحساسية" : "Sensitivity",
                    },
                    {
                      value: "dark-spots",
                      label: isRTL ? "البقع الداكنة" : "Dark Spots",
                    },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-200 rounded-lg hover:border-luxury-gold transition-colors cursor-pointer"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`concern-${option.value}`}
                      />
                      <Label
                        htmlFor={`concern-${option.value}`}
                        className="flex-1 cursor-pointer font-body text-base"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Question 3: Age Range */}
            <div className="mb-10">
              <h2 className="font-display text-2xl text-luxury-charcoal mb-6">
                {isRTL ? "ما هي الفئة العمرية؟" : "What is your age range?"}
              </h2>
              <RadioGroup value={age} onValueChange={setAge}>
                <div className="space-y-4">
                  {[
                    { value: "18-25", label: "18-25" },
                    { value: "26-35", label: "26-35" },
                    { value: "36-45", label: "36-45" },
                    { value: "46-55", label: "46-55" },
                    { value: "56+", label: "56+" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-200 rounded-lg hover:border-luxury-gold transition-colors cursor-pointer"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`age-${option.value}`}
                      />
                      <Label
                        htmlFor={`age-${option.value}`}
                        className="flex-1 cursor-pointer font-body text-base"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-luxury-maroon hover:bg-luxury-maroon/90 text-white font-body text-base py-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRTL ? "احصل على توصياتك" : "Get Your Recommendations"}
              <ChevronRight
                className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
              />
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
