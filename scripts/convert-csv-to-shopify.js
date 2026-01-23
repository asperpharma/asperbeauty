/**
 * CSV to Shopify Product Converter
 * Converts scraped product data to Shopify-compatible CSV format
 * 
 * Usage: node scripts/convert-csv-to-shopify.js
 */

const fs = require('fs');
const path = require('path');

// Input and output paths
const INPUT_CSV = path.join(__dirname, '../../dataset_productss_2026-01-15_23-29-45-343 (1).csv');
const OUTPUT_CSV = path.join(__dirname, '../public/data/shopify-import.csv');
const OUTPUT_JSON = path.join(__dirname, '../public/data/products.json');

// Shopify CSV headers
const SHOPIFY_HEADERS = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
    'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
    'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty',
    'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
    'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable',
    'Image Src', 'Image Position', 'Image Alt Text', 'SEO Title', 'SEO Description',
    'Status'
];

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

/**
 * Create URL-safe handle from title
 */
function createHandle(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
}

/**
 * Convert price from cents or string to decimal
 */
function formatPrice(priceStr) {
    if (!priceStr) return '0.00';
    const price = parseFloat(priceStr);
    if (isNaN(price)) return '0.00';
    // If price > 100, assume it's in cents (like 8900 = 89.00)
    return price > 1000 ? (price / 100).toFixed(2) : price.toFixed(2);
}

/**
 * Extract clean description (strip HTML if needed)
 */
function cleanDescription(desc) {
    if (!desc) return '';
    return desc
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000);
}

/**
 * Map category to Shopify product type
 */
function mapCategory(category, title, brand) {
    const combined = `${category} ${title} ${brand}`.toLowerCase();
    
    if (combined.includes('serum') || combined.includes('cream') || combined.includes('moistur')) {
        return 'Skin Care';
    }
    if (combined.includes('shampoo') || combined.includes('hair') || combined.includes('conditioner')) {
        return 'Hair Care';
    }
    if (combined.includes('perfume') || combined.includes('fragrance') || combined.includes('eau de')) {
        return 'Fragrance';
    }
    if (combined.includes('makeup') || combined.includes('lipstick') || combined.includes('mascara')) {
        return 'Makeup';
    }
    if (combined.includes('body') || combined.includes('lotion') || combined.includes('soap')) {
        return 'Body Care';
    }
    return category || 'Beauty';
}

/**
 * Main conversion function
 */
async function convertCSVToShopify() {
    console.log('🔄 Starting CSV conversion...\n');
    
    if (!fs.existsSync(INPUT_CSV)) {
        console.error(`❌ Input file not found: ${INPUT_CSV}`);
        console.log('Available CSV files in parent directory:');
        const parentDir = path.join(__dirname, '../..');
        const files = fs.readdirSync(parentDir).filter(f => f.endsWith('.csv'));
        files.forEach(f => console.log(`  - ${f}`));
        return;
    }

    const content = fs.readFileSync(INPUT_CSV, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        console.error('❌ CSV file is empty or has no data rows');
        return;
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]);
    console.log(`📋 Found ${headers.length} columns`);
    console.log(`📦 Processing ${lines.length - 1} products...\n`);

    // Find column indices
    const colIndex = {};
    headers.forEach((h, i) => {
        colIndex[h.toLowerCase().trim()] = i;
    });

    // Map column names
    const titleCol = colIndex['title'] || colIndex['name'];
    const descCol = colIndex['description'];
    const brandCol = colIndex['brand'] || colIndex['vendor'];
    const categoryCol = colIndex['categories/0'] || colIndex['category'];
    const imageCol = colIndex['medias/0/url'] || colIndex['image'];
    const priceCol = colIndex['variants/0/price/current'] || colIndex['price'];
    const comparePriceCol = colIndex['variants/0/price/previous'] || colIndex['compare_at_price'];
    const skuCol = colIndex['variants/0/sku'] || colIndex['sku'];
    const urlCol = colIndex['source/canonicalurl'] || colIndex['url'];
    const tagsCol0 = colIndex['tags/0'];
    const tagsCol1 = colIndex['tags/1'];
    const optionTypeCol = colIndex['options/0/type'];
    const option1ValueCol = colIndex["options/0/values/0/name"];

    const shopifyProducts = [];
    const jsonProducts = [];
    let processed = 0;
    let skipped = 0;

    for (let i = 1; i < lines.length; i++) {
        try {
            const row = parseCSVLine(lines[i]);
            
            const title = row[titleCol] || '';
            if (!title || title.length < 3) {
                skipped++;
                continue;
            }

            const brand = row[brandCol] || 'Asper Beauty';
            const category = row[categoryCol] || '';
            const description = row[descCol] || '';
            const imageUrl = row[imageCol] || '';
            const price = formatPrice(row[priceCol]);
            const comparePrice = formatPrice(row[comparePriceCol]);
            const sku = row[skuCol] || `ASPER-${Date.now()}-${i}`;
            const handle = createHandle(title);
            const productType = mapCategory(category, title, brand);
            
            // Build tags
            const tags = [];
            if (row[tagsCol0]) tags.push(row[tagsCol0]);
            if (row[tagsCol1]) tags.push(row[tagsCol1]);
            if (brand) tags.push(brand);
            if (productType) tags.push(productType);

            // Option handling
            const optionName = row[optionTypeCol] || 'Title';
            const optionValue = row[option1ValueCol] || 'Default Title';

            // Shopify row
            const shopifyRow = {
                Handle: handle,
                Title: title,
                'Body (HTML)': `<p>${description}</p>`,
                Vendor: brand,
                'Product Category': `Health & Beauty > Personal Care > Cosmetics`,
                Type: productType,
                Tags: tags.join(', '),
                Published: 'TRUE',
                'Option1 Name': optionName,
                'Option1 Value': optionValue,
                'Option2 Name': '',
                'Option2 Value': '',
                'Variant SKU': sku,
                'Variant Grams': '100',
                'Variant Inventory Tracker': 'shopify',
                'Variant Inventory Qty': '100',
                'Variant Inventory Policy': 'deny',
                'Variant Fulfillment Service': 'manual',
                'Variant Price': price,
                'Variant Compare At Price': comparePrice !== '0.00' ? comparePrice : '',
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Image Src': imageUrl,
                'Image Position': '1',
                'Image Alt Text': title,
                'SEO Title': title.substring(0, 70),
                'SEO Description': cleanDescription(description).substring(0, 320),
                Status: 'active'
            };

            shopifyProducts.push(shopifyRow);

            // JSON format for frontend
            jsonProducts.push({
                id: sku,
                sku: sku,
                handle: handle,
                title: title,
                description: cleanDescription(description),
                vendor: brand,
                productType: productType,
                price: parseFloat(price),
                compareAtPrice: comparePrice !== '0.00' ? parseFloat(comparePrice) : null,
                imageUrl: imageUrl,
                tags: tags,
                inStock: true
            });

            processed++;
            
            if (processed % 1000 === 0) {
                console.log(`  ✓ Processed ${processed} products...`);
            }
        } catch (err) {
            console.error(`  ⚠️ Error on row ${i}: ${err.message}`);
            skipped++;
        }
    }

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_CSV);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write Shopify CSV
    const csvLines = [SHOPIFY_HEADERS.join(',')];
    shopifyProducts.forEach(p => {
        const values = SHOPIFY_HEADERS.map(h => {
            const val = p[h] || '';
            // Quote fields that contain commas or quotes
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        });
        csvLines.push(values.join(','));
    });
    
    fs.writeFileSync(OUTPUT_CSV, csvLines.join('\n'), 'utf-8');
    console.log(`\n✅ Shopify CSV saved: ${OUTPUT_CSV}`);

    // Write JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(jsonProducts, null, 2), 'utf-8');
    console.log(`✅ JSON saved: ${OUTPUT_JSON}`);

    console.log(`\n📊 Summary:`);
    console.log(`   - Processed: ${processed} products`);
    console.log(`   - Skipped: ${skipped} rows`);
    console.log(`   - Output files ready for Shopify import!`);

    console.log(`\n📝 Next Steps:`);
    console.log(`   1. Go to Shopify Admin: https://lovable-project-milns.myshopify.com/admin`);
    console.log(`   2. Products → Import → Upload ${path.basename(OUTPUT_CSV)}`);
    console.log(`   3. Review and publish products`);
}

// Run the conversion
convertCSVToShopify().catch(console.error);
