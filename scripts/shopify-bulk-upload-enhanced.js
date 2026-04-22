/**
 * Enhanced Shopify Admin Bulk Product Upload Script
 * Handles large product catalogs (4000-5000+ products) with:
 * - Progress tracking and resumable uploads
 * - Error recovery and retry logic
 * - Rate limiting to avoid API throttling
 * - Batch processing for efficiency
 * - Detailed logging and reporting
 * 
 * Usage: node scripts/shopify-bulk-upload-enhanced.js [--resume] [--batch-size=50]
 * 
 * Environment Variables:
 * - SHOPIFY_STORE: Your Shopify store domain (e.g., my-store.myshopify.com)
 * - SHOPIFY_ADMIN_API_KEY: Your Shopify Admin API access token
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'lovable-project-milns.myshopify.com';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_KEY || '';
const SHOPIFY_API_VERSION = '2025-07';
const PRODUCTS_JSON_PATH = path.join(__dirname, '../public/data/products.json');
const PROGRESS_FILE = path.join(__dirname, '../.upload-progress.json');

// Upload settings
const BATCH_SIZE = parseInt(process.argv.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '50');
const RESUME_MODE = process.argv.includes('--resume');
const RATE_LIMIT_DELAY = 500; // milliseconds between requests (2 requests per second)
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // milliseconds

// Validation
if (!SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing Shopify Admin API Key. Set SHOPIFY_ADMIN_API_KEY in your environment.');
  console.error('   Get your token from: https://shopify.dev/docs/api/admin-rest');
  process.exit(1);
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load or initialize progress state
 */
function loadProgress() {
  if (RESUME_MODE && fs.existsSync(PROGRESS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
      console.log(`📂 Resuming from previous session (${data.completed} of ${data.total} completed)\n`);
      return data;
    } catch (err) {
      console.warn('⚠️  Could not load progress file, starting fresh\n');
    }
  }
  return { completed: 0, total: 0, failed: [], successful: [], skipped: [] };
}

/**
 * Save progress state
 */
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
}

/**
 * Make Shopify Admin API request with retry logic
 */
async function shopifyAdminRequest(endpoint, method = 'POST', body = {}, retries = 0) {
  const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify(body),
    });

    // Handle rate limiting (429)
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '2') * 1000;
      console.log(`⏱️  Rate limited, waiting ${retryAfter / 1000}s...`);
      await sleep(retryAfter);
      return shopifyAdminRequest(endpoint, method, body, retries);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${error}`);
    }

    return await response.json();
  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.log(`🔄 Retry ${retries + 1}/${MAX_RETRIES} after error: ${err.message}`);
      await sleep(RETRY_DELAY * (retries + 1)); // Exponential backoff
      return shopifyAdminRequest(endpoint, method, body, retries + 1);
    }
    throw err;
  }
}

/**
 * Convert local product format to Shopify product format
 */
function toShopifyProduct(product) {
  return {
    product: {
      title: product.title,
      body_html: `<p>${product.description || ''}</p>`,
      vendor: product.vendor || product.brand || 'Asper Beauty',
      product_type: product.productType || product.category || 'Beauty',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
      variants: [
        {
          price: (product.price || 0).toFixed(2),
          compare_at_price: product.compareAtPrice ? product.compareAtPrice.toFixed(2) : null,
          sku: product.sku || product.id,
          inventory_quantity: product.inStock ? 100 : 0,
          inventory_management: 'shopify',
          barcode: product.barcode || null,
        },
      ],
      images: product.imageUrl ? [{ src: product.imageUrl }] : [],
      published: true,
      status: 'active',
    },
  };
}

/**
 * Upload a single product
 */
async function uploadProduct(product, index, total) {
  const shopifyProduct = toShopifyProduct(product);
  const progressPercent = ((index / total) * 100).toFixed(1);
  
  try {
    await shopifyAdminRequest('products.json', 'POST', shopifyProduct);
    process.stdout.write(`\r✓ [${progressPercent}%] Uploaded ${index}/${total}: ${product.title.substring(0, 60)}...`);
    return { success: true, product };
  } catch (err) {
    console.error(`\n❌ Failed: ${product.title} - ${err.message}`);
    return { success: false, product, error: err.message };
  }
}

/**
 * Main upload function with batch processing
 */
async function uploadProductsBatch() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║   Enhanced Shopify Bulk Product Upload                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Load products
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    console.error(`❌ Products file not found: ${PRODUCTS_JSON_PATH}`);
    console.log('\n💡 Generate products.json first using:');
    console.log('   node scripts/convert-csv-to-shopify.js\n');
    process.exit(1);
  }

  const allProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  const progress = loadProgress();
  
  // Initialize progress if starting fresh
  if (progress.total === 0) {
    progress.total = allProducts.length;
  }

  // Filter out already processed products in resume mode
  const productsToProcess = RESUME_MODE 
    ? allProducts.filter((p, i) => 
        !progress.successful.includes(p.id || p.sku) && 
        !progress.skipped.includes(p.id || p.sku)
      )
    : allProducts;

  console.log(`📦 Total products: ${allProducts.length}`);
  console.log(`🎯 Products to upload: ${productsToProcess.length}`);
  console.log(`⚙️  Batch size: ${BATCH_SIZE}`);
  console.log(`⏱️  Rate limit: ${1000 / RATE_LIMIT_DELAY} requests/second\n`);
  console.log(`Starting upload...\n`);

  const startTime = Date.now();
  let successCount = progress.successful.length;
  let failCount = progress.failed.length;

  // Process in batches
  for (let i = 0; i < productsToProcess.length; i++) {
    const product = productsToProcess[i];
    const globalIndex = progress.completed + i + 1;
    
    const result = await uploadProduct(product, globalIndex, progress.total);
    
    if (result.success) {
      successCount++;
      progress.successful.push(product.id || product.sku);
    } else {
      failCount++;
      progress.failed.push({
        id: product.id || product.sku,
        title: product.title,
        error: result.error
      });
    }
    
    progress.completed = globalIndex;
    
    // Save progress every 10 products
    if (progress.completed % 10 === 0) {
      saveProgress(progress);
    }
    
    // Rate limiting
    await sleep(RATE_LIMIT_DELAY);
  }

  // Final save
  saveProgress(progress);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const avgTime = (duration / productsToProcess.length).toFixed(2);

  console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   Upload Complete!                                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Results:`);
  console.log(`   ✓ Successful: ${successCount}/${progress.total}`);
  console.log(`   ✗ Failed: ${failCount}/${progress.total}`);
  console.log(`   ⏱️  Total time: ${duration}s (${avgTime}s per product)\n`);

  if (progress.failed.length > 0) {
    console.log(`⚠️  ${progress.failed.length} products failed to upload:`);
    progress.failed.forEach((f, i) => {
      if (i < 10) { // Show first 10 failures
        console.log(`   ${i + 1}. ${f.title}: ${f.error}`);
      }
    });
    if (progress.failed.length > 10) {
      console.log(`   ... and ${progress.failed.length - 10} more`);
    }
    console.log(`\n💡 Run with --resume to retry failed products:\n`);
    console.log(`   node scripts/shopify-bulk-upload-enhanced.js --resume\n`);
  } else {
    console.log('✨ All products uploaded successfully!\n');
    // Clean up progress file on complete success
    if (fs.existsSync(PROGRESS_FILE)) {
      fs.unlinkSync(PROGRESS_FILE);
    }
  }

  console.log(`📝 Next Steps:`);
  console.log(`   1. Visit: https://${SHOPIFY_STORE}/admin/products`);
  console.log(`   2. Review and organize your products`);
  console.log(`   3. Set up collections and featured products\n`);
}

// Run the upload
uploadProductsBatch().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
