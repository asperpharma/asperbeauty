/**
 * [UtilityName] Utility Functions
 * 
 * @description Brief description of what these utilities do
 * @module lib/utilityName
 */

/**
 * Format a price with currency symbol
 * 
 * @param amount - The numeric amount
 * @param currency - Currency code (e.g., 'USD', 'SAR')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted price string
 * 
 * @example
 * ```ts
 * formatPrice(99.99, 'SAR', 'ar-SA') // '٩٩٫٩٩ ر.س'
 * formatPrice(99.99, 'USD', 'en-US') // '$99.99'
 * ```
 */
export const formatPrice = (
  amount: number,
  currency: string = 'SAR',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date relative to now (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @param locale - Locale for formatting
 * @returns Relative time string
 * 
 * @example
 * ```ts
 * formatRelativeTime(new Date('2024-01-01')) // '2 months ago'
 * ```
 */
export const formatRelativeTime = (
  date: Date | string,
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
        -interval,
        unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return 'just now';
};

/**
 * Truncate text to a specified length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated text
 * 
 * @example
 * ```ts
 * truncateText('This is a long text', 10) // 'This is a...'
 * ```
 */
export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Debounce a function call
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching:', query);
 * }, 300);
 * 
 * debouncedSearch('test'); // Only called after 300ms of no calls
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle a function call
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('Scrolled');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate a unique ID
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 * 
 * @example
 * ```ts
 * generateId() // 'abc123def456'
 * generateId('product-') // 'product-abc123def456'
 * ```
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Deep clone an object
 * 
 * @param obj - Object to clone
 * @returns Cloned object
 * 
 * @example
 * ```ts
 * const original = { name: 'John', address: { city: 'NYC' } };
 * const cloned = deepClone(original);
 * cloned.address.city = 'LA';
 * console.log(original.address.city); // 'NYC'
 * ```
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  
  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * 
 * @param value - Value to check
 * @returns True if empty, false otherwise
 * 
 * @example
 * ```ts
 * isEmpty(null) // true
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty('text') // false
 * ```
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Sleep for a specified duration
 * 
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the duration
 * 
 * @example
 * ```ts
 * await sleep(1000); // Wait 1 second
 * console.log('After 1 second');
 * ```
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Convert a string to slug format
 * 
 * @param text - Text to convert
 * @returns Slugified text
 * 
 * @example
 * ```ts
 * slugify('Hello World!') // 'hello-world'
 * slugify('Café & Restaurant') // 'cafe-restaurant'
 * ```
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
};

// Export all utilities as a namespace (optional)
export default {
  formatPrice,
  formatRelativeTime,
  truncateText,
  debounce,
  throttle,
  generateId,
  deepClone,
  isEmpty,
  sleep,
  slugify,
};
