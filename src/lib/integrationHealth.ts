/**
 * Integration Health Check Utility
 * Validates that all external service integrations are properly configured
 */

interface HealthCheckResult {
  service: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  configured: boolean;
}

interface IntegrationHealth {
  allHealthy: boolean;
  results: HealthCheckResult[];
  timestamp: string;
}

/**
 * Checks if environment variable is properly configured (not placeholder)
 */
function isProperlyConfigured(value: string | undefined, placeholders: string[]): boolean {
  if (!value) return false;
  return !placeholders.some(placeholder => value.includes(placeholder));
}

/**
 * Validates Shopify Storefront API configuration
 */
function checkShopifyIntegration(): HealthCheckResult {
  const store = import.meta.env.VITE_SHOPIFY_STORE;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  
  if (!store || !token) {
    return {
      service: 'Shopify Storefront API',
      status: 'error',
      message: 'Missing Shopify configuration. Check VITE_SHOPIFY_STORE and VITE_SHOPIFY_STOREFRONT_TOKEN',
      configured: false,
    };
  }
  
  // Validate Shopify store domain format (must end with .myshopify.com)
  if (!store.endsWith('.myshopify.com')) {
    return {
      service: 'Shopify Storefront API',
      status: 'error',
      message: 'Invalid Shopify store domain. Should be in format: store-name.myshopify.com',
      configured: false,
    };
  }
  
  return {
    service: 'Shopify Storefront API',
    status: 'ok',
    message: `Connected to ${store}`,
    configured: true,
  };
}

/**
 * Validates Supabase configuration
 */
function checkSupabaseIntegration(): HealthCheckResult {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  if (!url || !key) {
    return {
      service: 'Supabase',
      status: 'error',
      message: 'Missing Supabase configuration. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY',
      configured: false,
    };
  }
  
  // Validate Supabase URL format (must contain .supabase.co as the domain)
  if (!url.includes('.supabase.co/') && !url.endsWith('.supabase.co')) {
    return {
      service: 'Supabase',
      status: 'error',
      message: 'Invalid Supabase URL format',
      configured: false,
    };
  }
  
  return {
    service: 'Supabase',
    status: 'ok',
    message: 'Supabase connection configured',
    configured: true,
  };
}

/**
 * Validates hCaptcha configuration
 */
function checkHCaptchaIntegration(): HealthCheckResult {
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    return {
      service: 'hCaptcha',
      status: 'warning',
      message: 'hCaptcha not configured. Authentication forms will not have CAPTCHA protection.',
      configured: false,
    };
  }
  
  const placeholders = ['your-hcaptcha-site-key-here', 'placeholder', 'example'];
  if (!isProperlyConfigured(siteKey, placeholders)) {
    return {
      service: 'hCaptcha',
      status: 'warning',
      message: 'hCaptcha site key appears to be a placeholder. Update VITE_HCAPTCHA_SITE_KEY with actual key from hcaptcha.com',
      configured: false,
    };
  }
  
  return {
    service: 'hCaptcha',
    status: 'ok',
    message: 'hCaptcha configured for form protection',
    configured: true,
  };
}

/**
 * Runs all integration health checks
 */
export function checkIntegrationHealth(): IntegrationHealth {
  const results: HealthCheckResult[] = [
    checkShopifyIntegration(),
    checkSupabaseIntegration(),
    checkHCaptchaIntegration(),
  ];
  
  const hasErrors = results.some(r => r.status === 'error');
  const allHealthy = !hasErrors;
  
  return {
    allHealthy,
    results,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Logs integration health to console in development mode
 */
export function logIntegrationHealth(): void {
  if (import.meta.env.DEV) {
    const health = checkIntegrationHealth();
    
    console.group('🔗 Integration Health Check');
    console.log('Timestamp:', new Date(health.timestamp).toLocaleString());
    console.log('Status:', health.allHealthy ? '✅ All integrations healthy' : '⚠️ Some issues detected');
    console.log('');
    
    health.results.forEach(result => {
      const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${result.service}:`, result.message);
    });
    
    console.groupEnd();
  }
}

/**
 * Gets list of missing or misconfigured environment variables
 */
export function getMissingEnvVars(): string[] {
  const health = checkIntegrationHealth();
  return health.results
    .filter(r => !r.configured)
    .map(r => r.service);
}

/**
 * Validates all required environment variables are present
 */
export function validateRequiredEnvVars(): boolean {
  const required = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SHOPIFY_STORE: import.meta.env.VITE_SHOPIFY_STORE,
    VITE_SHOPIFY_STOREFRONT_TOKEN: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
  };
  
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}
