// Shopify Admin Bulk Product Upload Script
// Usage: node scripts/shopify-admin-bulk-upload.js
// Requires: Node.js, Shopify Admin API access token

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'lovable-project-milns.myshopify.com';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_KEY || '';
const SHOPIFY_API_VERSION = '2025-07';
const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'public/data/products.json');

if (!SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing Shopify Admin API Key. Set SHOPIFY_ADMIN_API_KEY in your environment.');
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function shopifyAdminRequest(endpoint, method = 'POST', body = {}) {
  const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify API error (${response.status}): ${error}`);
  }
  return response.json();
}

function toShopifyProduct(product) {
  return {
    product: {
      title: product.title,
      body_html: product.description,
      vendor: product.vendor || product.brand || 'Asper Beauty',
      product_type: product.productType || product.category || 'Beauty',
      tags: product.tags ? product.tags.join(', ') : '',
      variants: [
        {
          price: product.price ? product.price.toFixed(2) : '0.00',
          sku: product.sku || product.id,
          inventory_quantity: 100,
          inventory_management: 'shopify',
        },
      ],
      images: product.imageUrl ? [{ src: product.imageUrl }] : [],
      published: true,
    },
  };
}

async function main() {
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    console.error(`❌ Products file not found: ${PRODUCTS_JSON_PATH}`);
    process.exit(1);
  }
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  let success = 0, fail = 0;
  for (const product of products) {
    try {
      const shopifyProduct = toShopifyProduct(product);
      await shopifyAdminRequest('products.json', 'POST', shopifyProduct);
      success++;
      console.log(`✓ Uploaded: ${product.title}`);
      await sleep(500); // avoid rate limits
    } catch (err) {
      fail++;
      console.error(`❌ Failed: ${product.title} - ${err.message}`);
      await sleep(1000);
    }
  }
  console.log(`\nDone! Success: ${success}, Failed: ${fail}`);
}

main().catch(console.error);
