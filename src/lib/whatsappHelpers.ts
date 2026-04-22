const WHATSAPP_NUMBER = "962790656666";

export interface WhatsAppContext {
  type: 'product' | 'cart' | 'general' | 'support';
  productTitle?: string;
  productUrl?: string;
  cartTotal?: number;
  cartItems?: number;
}

/**
 * Generate a context-aware WhatsApp URL with pre-filled message
 */
export const getWhatsAppUrl = (context: WhatsAppContext, language: 'en' | 'ar' = 'en'): string => {
  let message = '';
  
  switch (context.type) {
    case 'product':
      if (language === 'ar') {
        message = `مرحباً فريق آسبر! 👋\n\nأنا مهتم/ة بـ${context.productTitle ? ` *${context.productTitle}*` : ' هذا المنتج'} وأود طرح سؤال سريع. 🌹`;
      } else {
        message = `Hello Asper Team! 👋\n\nI am interested in${context.productTitle ? ` *${context.productTitle}*` : ' this product'} and have a quick question. 🌹`;
      }
      
      if (context.productUrl) {
        message += `\n\n${context.productUrl}`;
      }
      break;
      
    case 'cart':
      if (language === 'ar') {
        message = `مرحباً! 👋\n\nأحتاج إلى مساعدة في إتمام طلبي. 🛒`;
        if (context.cartItems) {
          message += `\n\nلدي ${context.cartItems} ${context.cartItems === 1 ? 'منتج' : 'منتجات'} في السلة`;
          if (context.cartTotal) {
            message += ` (${context.cartTotal.toFixed(3)} دينار)`;
          }
        }
      } else {
        message = `Hello! 👋\n\nI need help with my checkout. 🛒`;
        if (context.cartItems) {
          message += `\n\nI have ${context.cartItems} ${context.cartItems === 1 ? 'item' : 'items'} in my cart`;
          if (context.cartTotal) {
            message += ` (${context.cartTotal.toFixed(3)} JOD)`;
          }
        }
      }
      break;
      
    case 'support':
      message = language === 'ar' 
        ? 'مرحباً! أحتاج إلى مساعدة بخصوص طلبي. 📦'
        : 'Hello! I need help with my order. 📦';
      break;
      
    case 'general':
    default:
      message = language === 'ar'
        ? 'مرحباً فريق آسبر! 👋\n\nأود الاستفسار عن...'
        : 'Hello Asper Team! 👋\n\nI would like to inquire about...';
      break;
  }
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

/**
 * Generate WhatsApp URL for product page
 */
export const getProductWhatsAppUrl = (productTitle: string, productUrl: string, language: 'en' | 'ar' = 'en'): string => {
  return getWhatsAppUrl({
    type: 'product',
    productTitle,
    productUrl
  }, language);
};

/**
 * Generate WhatsApp URL for cart
 */
export const getCartWhatsAppUrl = (cartItems: number, cartTotal: number, language: 'en' | 'ar' = 'en'): string => {
  return getWhatsAppUrl({
    type: 'cart',
    cartItems,
    cartTotal
  }, language);
};
