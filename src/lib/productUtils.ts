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
 * Extracts key benefits/features from product description
 */
export function extractKeyBenefits(description: string): string[] {
  if (!description) return [];
  
  const benefits: string[] = [];
  const cleanText = description.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Common benefit keywords in beauty products
  const benefitPatterns = [
    { pattern: /hydrat/i, benefit: "Deep Hydration" },
    { pattern: /moistur/i, benefit: "Intense Moisture" },
    { pattern: /anti[- ]?aging|wrinkle/i, benefit: "Anti-Aging" },
    { pattern: /vitamin\s*c|brightening/i, benefit: "Brightening" },
    { pattern: /spf|sun\s*protect/i, benefit: "Sun Protection" },
    { pattern: /natural|organic/i, benefit: "Natural Ingredients" },
    { pattern: /gentle|sensitive/i, benefit: "Gentle Formula" },
    { pattern: /repair|restor/i, benefit: "Repair & Restore" },
    { pattern: /firm|lift/i, benefit: "Firming & Lifting" },
    { pattern: /smooth|soft/i, benefit: "Smooth & Soft" },
    { pattern: /volumiz|volume/i, benefit: "Volume Boost" },
    { pattern: /long[- ]?lasting|24[- ]?hour/i, benefit: "Long-Lasting" },
    { pattern: /nourish/i, benefit: "Nourishing" },
    { pattern: /protect/i, benefit: "Protective" },
    { pattern: /strength|strong/i, benefit: "Strengthening" },
    { pattern: /clean|cleans/i, benefit: "Deep Cleansing" },
    { pattern: /sooth/i, benefit: "Soothing" },
    { pattern: /whiten|whitening/i, benefit: "Whitening" },
    { pattern: /lash|mascara/i, benefit: "Lash Enhancement" },
    { pattern: /color|pigment/i, benefit: "Rich Color" },
  ];
  
  for (const { pattern, benefit } of benefitPatterns) {
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
