/**
 * Summarizes a product description to a concise, useful format
 * Extracts key benefits and creates a clean summary
 */
export function summarizeDescription(description: string, maxLength: number = 150): string {
  if (!description) return "";
  
  // Remove HTML tags if any
  const cleanText = description.replace(/<[^>]*>/g, '').trim();
  
  // Split into sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return cleanText.slice(0, maxLength);
  
  // Take first 1-2 meaningful sentences
  let summary = sentences[0].trim();
  if (sentences.length > 1 && summary.length < 80) {
    summary += '. ' + sentences[1].trim();
  }
  
  // Truncate if too long
  if (summary.length > maxLength) {
    summary = summary.slice(0, maxLength - 3).trim() + '...';
  }
  
  return summary;
}

/**
 * Arabic translations for common beauty product terms
 */
const arabicTranslations: Record<string, string> = {
  // Product types
  'mascara': 'ماسكارا',
  'lipstick': 'أحمر شفاه',
  'lip tint': 'صبغة شفاه',
  'cream': 'كريم',
  'lotion': 'لوشن',
  'serum': 'سيروم',
  'cleanser': 'منظف',
  'toner': 'تونر',
  'sunscreen': 'واقي شمس',
  'moisturizer': 'مرطب',
  'eye cream': 'كريم العين',
  'day cream': 'كريم نهاري',
  'night cream': 'كريم ليلي',
  'hair treatment': 'علاج الشعر',
  'hair oil': 'زيت الشعر',
  'shampoo': 'شامبو',
  'conditioner': 'بلسم',
  'foundation': 'كريم أساس',
  'concealer': 'كونسيلر',
  'powder': 'بودرة',
  'blush': 'أحمر خدود',
  'eyeshadow': 'ظلال العيون',
  'eyeliner': 'محدد العيون',
  'hand cream': 'كريم اليدين',
  'body lotion': 'لوشن الجسم',
  'face wash': 'غسول الوجه',
  'whitening': 'تبييض',
  'anti-aging': 'مضاد للشيخوخة',
  'hydrating': 'مرطب',
  'nourishing': 'مغذي',
  'gel': 'جل',
  
  // Common words
  'volume': 'كثافة',
  'extreme': 'فائق',
  'bold': 'جريء',
  'big': 'كبير',
  'black': 'أسود',
  'natural': 'طبيعي',
  'organic': 'عضوي',
  'vitamin': 'فيتامين',
  'skin': 'بشرة',
  'face': 'وجه',
  'body': 'جسم',
  'hair': 'شعر',
  'lash': 'رموش',
  'lashes': 'رموش',
  'double': 'مضاعف',
  'long': 'طويل',
  'lasting': 'ثابت',
  'care': 'عناية',
  'beauty': 'جمال',
  'premium': 'فاخر',
  'luxury': 'فخم',
  'gentle': 'لطيف',
  'sensitive': 'حساس',
  'dry': 'جاف',
  'oily': 'دهني',
  'combination': 'مختلط',
  'all skin types': 'جميع أنواع البشرة',
  'protection': 'حماية',
  'repair': 'إصلاح',
  'strengthen': 'تقوية',
  'smooth': 'ناعم',
  'soft': 'رقيق',
  'bright': 'مشرق',
  'glow': 'توهج',
  'radiant': 'مشع',
  'clear': 'صافي',
  'fresh': 'منعش',
  'lightweight': 'خفيف',
  'intensive': 'مكثف',
  'daily': 'يومي',
  'for': 'لـ',
  'with': 'مع',
  'and': 'و',
  'the': '',
  'a': '',
  'an': '',
};

/**
 * Translates product description to Arabic
 */
export function translateToArabic(text: string): string {
  if (!text) return "";
  
  let translated = text.toLowerCase();
  
  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(arabicTranslations).sort((a, b) => b.length - a.length);
  
  for (const english of sortedKeys) {
    const arabic = arabicTranslations[english];
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, arabic);
  }
  
  // Capitalize first letter of remaining English words (that weren't translated)
  // and clean up spacing
  translated = translated.replace(/\s+/g, ' ').trim();
  
  return translated;
}

/**
 * Gets localized description based on language
 */
export function getLocalizedDescription(description: string, language: 'en' | 'ar', maxLength?: number): string {
  const summarized = summarizeDescription(description, maxLength);
  
  if (language === 'ar' && summarized) {
    return translateToArabic(summarized);
  }
  
  return summarized;
}

/**
 * Extracts key benefits/features from product description
 */
export function extractKeyBenefits(description: string, language: 'en' | 'ar' = 'en'): string[] {
  if (!description) return [];
  
  const benefits: string[] = [];
  const cleanText = description.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Common benefit keywords in beauty products with Arabic translations
  const benefitPatterns = [
    { pattern: /hydrat/i, en: "Deep Hydration", ar: "ترطيب عميق" },
    { pattern: /moistur/i, en: "Intense Moisture", ar: "ترطيب مكثف" },
    { pattern: /anti[- ]?aging|wrinkle/i, en: "Anti-Aging", ar: "مضاد للشيخوخة" },
    { pattern: /vitamin\s*c|brightening/i, en: "Brightening", ar: "تفتيح" },
    { pattern: /spf|sun\s*protect/i, en: "Sun Protection", ar: "حماية من الشمس" },
    { pattern: /natural|organic/i, en: "Natural Ingredients", ar: "مكونات طبيعية" },
    { pattern: /gentle|sensitive/i, en: "Gentle Formula", ar: "تركيبة لطيفة" },
    { pattern: /repair|restor/i, en: "Repair & Restore", ar: "إصلاح وتجديد" },
    { pattern: /firm|lift/i, en: "Firming & Lifting", ar: "شد ورفع" },
    { pattern: /smooth|soft/i, en: "Smooth & Soft", ar: "ناعم ورقيق" },
    { pattern: /volumiz|volume/i, en: "Volume Boost", ar: "زيادة الكثافة" },
    { pattern: /long[- ]?lasting|24[- ]?hour/i, en: "Long-Lasting", ar: "طويل الأمد" },
    { pattern: /nourish/i, en: "Nourishing", ar: "مغذي" },
    { pattern: /protect/i, en: "Protective", ar: "حماية" },
    { pattern: /strength|strong/i, en: "Strengthening", ar: "تقوية" },
    { pattern: /clean|cleans/i, en: "Deep Cleansing", ar: "تنظيف عميق" },
    { pattern: /sooth/i, en: "Soothing", ar: "مهدئ" },
    { pattern: /whiten|whitening/i, en: "Whitening", ar: "تبييض" },
    { pattern: /lash|mascara/i, en: "Lash Enhancement", ar: "تعزيز الرموش" },
    { pattern: /color|pigment/i, en: "Rich Color", ar: "لون غني" },
  ];
  
  for (const { pattern, en, ar } of benefitPatterns) {
    const benefit = language === 'ar' ? ar : en;
    if (pattern.test(cleanText) && !benefits.includes(benefit)) {
      benefits.push(benefit);
    }
    if (benefits.length >= 4) break;
  }
  
  return benefits;
}

/**
 * Gets product category/type for display
 */
export function getProductCategory(productType?: string, vendor?: string): string {
  if (productType) return productType;
  if (vendor) return vendor;
  return "Beauty";
}
