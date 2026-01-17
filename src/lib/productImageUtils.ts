// Placeholder image generator based on category and title keywords
// Returns relevant Unsplash URLs to ensure every product looks unique

const categoryImageMap: Record<string, string[]> = {
  'Best Seller': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
  ],
  'New Arrival': [
    'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  ],
  'Trending': [
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?auto=format&fit=crop&w=800&q=80',
  ],
  'Featured': [
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
  ],
};

// Keyword-based image mapping for more specific products
const keywordImageMap: Record<string, string> = {
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  cream: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  retinol: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
  eye: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  palette: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  hair: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  oil: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
  parfum: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  fragrance: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  lipstick: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  lip: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  sunscreen: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  spf: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  mascara: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80',
  foundation: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  cleanser: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?auto=format&fit=crop&w=800&q=80',
  moisturizer: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80',
  toner: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  mask: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
  vitamin: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
};

/**
 * Get a placeholder image URL based on product category and title
 * @param category - Product category (e.g., "Best Seller", "New Arrival")
 * @param title - Product title
 * @returns Unsplash URL for the placeholder image
 */
export const getPlaceholderImage = (category: string, title: string): string => {
  // First, try to match keywords in the title
  const lowerTitle = title.toLowerCase();
  
  for (const [keyword, url] of Object.entries(keywordImageMap)) {
    if (lowerTitle.includes(keyword)) {
      return url;
    }
  }
  
  // Fall back to category-based images
  const categoryImages = categoryImageMap[category] || categoryImageMap['Featured'];
  
  // Use a simple hash of the title to consistently select the same image
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % categoryImages.length;
  
  return categoryImages[index];
};

/**
 * Get the product image URL, using placeholder if no custom image is set
 * @param imageUrl - The product's image_url from database (can be null)
 * @param category - Product category
 * @param title - Product title
 * @returns Final image URL to display
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
