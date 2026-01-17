// Placeholder image generator based on category and title keywords
// Returns relevant Unsplash URLs to ensure every product looks unique and matches BeautyBox/iHerb aesthetic

// Enhanced keyword-based image mapping for specific product types
const keywordImageMap: Record<string, string> = {
  // Skincare
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  cream: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  moisturizer: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  retinol: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
  cleanser: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?auto=format&fit=crop&w=800&q=80',
  toner: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  mask: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
  vitamin: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
  hyaluronic: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  niacinamide: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
  sunscreen: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  spf: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  lotion: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  
  // Eye care
  eye: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  
  // Makeup
  lipstick: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  lip: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  mascara: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80',
  foundation: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  palette: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  eyeshadow: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  blush: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  concealer: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  primer: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  
  // Hair care
  hair: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  shampoo: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  conditioner: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  oil: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  
  // Fragrance
  parfum: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  fragrance: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  cologne: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  
  // Body care
  body: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  hand: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  
  // Supplements
  capsule: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  supplement: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  multivitamin: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
};

// Category fallback images
const categoryFallbackMap: Record<string, string> = {
  'Skin Care': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  'Makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  'Hair Care': 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  'Fragrance': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  'Body Care': 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  'Best Seller': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  'New Arrival': 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  'Trending': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'Featured': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
};

const defaultImage = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';

/**
 * Get a placeholder image URL based on product category and title
 * Matches keywords like "Hyaluronic Acid Serum" to skincare serum images
 */
export const getPlaceholderImage = (category: string, title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  // First, try to match keywords in the title for more specific images
  for (const [keyword, url] of Object.entries(keywordImageMap)) {
    if (lowerTitle.includes(keyword)) {
      return url;
    }
  }
  
  // Fall back to category-based images
  return categoryFallbackMap[category] || defaultImage;
};

/**
 * Get the product image URL, using placeholder if no custom image is set
 */
export const getProductImage = (
  imageUrl: string | null | undefined,
  category: string,
  title: string
): string => {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  
  return getPlaceholderImage(category, title);
};

/**
 * Format price in JOD like BeautyBox (e.g., "16.000 JD") or iHerb (e.g., "JOD 2.434")
 */
export const formatPriceJOD = (price: number, style: 'beautybox' | 'iherb' = 'beautybox'): string => {
  const formattedPrice = price.toFixed(3);
  return style === 'beautybox' ? `${formattedPrice} JD` : `JOD ${formattedPrice}`;
};
