# Shopify Tagging Protocol

**Purpose:** Standardized tagging system for product catalog to enable intelligent product recommendations and routine building in the Beauty Assistant.

---

## Overview

This protocol defines the tagging conventions used to categorize products in the Asper Beauty Shop. Tags enable the Beauty Assistant AI to make intelligent, context-aware product recommendations based on skin concerns and skincare routines.

---

## Tag Categories

### 1. Concern Tags (Concern_*)

Used to match products with specific skin concerns or conditions.

#### Format
```
Concern_[ConditionName]
```

#### Standard Concern Tags

| Tag | Description | Example Products |
|-----|-------------|------------------|
| `Concern_Acne` | Acne-prone, blemish-prone skin | Salicylic acid cleansers, benzoyl peroxide treatments |
| `Concern_Aging` | Anti-aging, wrinkles, fine lines | Retinol serums, collagen creams |
| `Concern_Dryness` | Dry, dehydrated skin | Hyaluronic acid, rich moisturizers |
| `Concern_Sensitivity` | Sensitive, reactive skin | Fragrance-free, hypoallergenic products |
| `Concern_Hyperpigmentation` | Dark spots, uneven tone | Vitamin C, niacinamide, brightening serums |
| `Concern_Redness` | Redness, rosacea | Calming serums, centella asiatica |
| `Concern_Oiliness` | Oily, combination skin | Mattifying products, oil-free formulas |
| `Concern_DarkCircles` | Under-eye dark circles | Eye creams with caffeine, vitamin K |
| `Concern_Pores` | Enlarged pores | Niacinamide, pore-minimizing products |
| `Concern_Dullness` | Dull, tired-looking skin | Exfoliants, vitamin C, brightening masks |

#### Multi-Concern Products

Products can have multiple concern tags if they address multiple issues:

```
Tags: Concern_Acne, Concern_Oiliness, Concern_Pores
Example: La Roche-Posay Effaclar Duo+ (treats acne, controls oil, minimizes pores)
```

---

### 2. Step Tags (Step_*)

Used to identify product's role in a skincare routine.

#### Format
```
Step_[RoutineStep]
```

#### Standard Step Tags

| Tag | Description | Order | When Used |
|-----|-------------|-------|-----------|
| `Step_Cleanser` | Face cleansers, makeup removers | 1 | AM & PM |
| `Step_Toner` | Toners, essences | 2 | AM & PM |
| `Step_Serum` | Treatment serums, ampoules | 3 | AM & PM |
| `Step_EyeCream` | Eye creams, eye serums | 4 | AM & PM |
| `Step_Moisturizer` | Face moisturizers, creams | 5 | AM & PM |
| `Step_Sunscreen` | SPF products, sun protection | 6 | AM only |
| `Step_Treatment` | Spot treatments, masks | * | As needed |
| `Step_Exfoliant` | Physical/chemical exfoliants | * | 2-3x/week |
| `Step_Mask` | Sheet masks, clay masks | * | Weekly |

**Note:** Products can have multiple step tags if they serve multiple functions:
```
Tags: Step_Serum, Step_Moisturizer
Example: Hyaluronic acid serum that also moisturizes
```

---

### 3. Brand Tags (Brand_*)

#### Format
```
Brand_[BrandName]
```

#### Examples
```
Brand_Vichy
Brand_LaRochePosay
Brand_CeraVe
Brand_TheOrdinary
Brand_Neutrogena
```

**Note:** Shopify also has a "Vendor" field - use that for the display name, but include brand tags for filtering.

---

### 4. Product Type Tags (Type_*)

#### Format
```
Type_[ProductType]
```

#### Examples
```
Type_Serum
Type_Cream
Type_Gel
Type_Oil
Type_Foam
Type_Lotion
Type_Balm
```

---

### 5. Ingredient Tags (Ingredient_*)

Used to highlight key active ingredients.

#### Format
```
Ingredient_[IngredientName]
```

#### Common Ingredient Tags

| Tag | Description |
|-----|-------------|
| `Ingredient_RetinolRetinoid` | Retinol, retinoids (anti-aging) |
| `Ingredient_VitaminC` | L-Ascorbic acid, ascorbyl derivatives |
| `Ingredient_Niacinamide` | Vitamin B3 (brightening, pore-refining) |
| `Ingredient_HyaluronicAcid` | Hyaluronic acid (hydration) |
| `Ingredient_SalicylicAcid` | BHA (acne, exfoliation) |
| `Ingredient_GlycolicAcid` | AHA (exfoliation, texture) |
| `Ingredient_Ceramides` | Ceramides (barrier repair) |
| `Ingredient_Peptides` | Peptides (anti-aging) |
| `Ingredient_AzelaicAcid` | Azelaic acid (redness, hyperpigmentation) |

---

### 6. Feature Tags

#### SPF Tags
```
SPF_15
SPF_30
SPF_50
SPF_50Plus
```

#### Special Features
```
Feature_FragranceFree
Feature_Hypoallergenic
Feature_NonComedogenic
Feature_CrueltyFree
Feature_Vegan
Feature_Organic
```

---

## Tagging Best Practices

### 1. Be Consistent
- Use exact tag names from this protocol
- Maintain capitalization: `Concern_Acne` not `concern_acne`
- No spaces in tags: `Concern_DarkCircles` not `Concern_Dark Circles`

### 2. Be Comprehensive
- Tag all products with at least one Concern tag
- Tag all products with at least one Step tag
- Include ingredient tags for key actives

### 3. Be Accurate
- Only add tags that genuinely apply
- Don't over-tag to game the system
- Verify claims with product packaging/website

### 4. Minimum Required Tags

Every product should have:
- ✅ At least 1 `Concern_*` tag
- ✅ At least 1 `Step_*` tag
- ✅ 1 `Brand_*` tag (or use Vendor field)

---

## Tagging Workflow

### For New Products

1. **Review Product Information**
   - Read product description
   - Check ingredients
   - Review brand marketing materials

2. **Assign Concern Tags**
   - What skin concerns does it address?
   - Add 1-3 relevant `Concern_*` tags

3. **Assign Step Tag**
   - Where does it fit in a routine?
   - Add appropriate `Step_*` tag(s)

4. **Add Supporting Tags**
   - Key ingredients: `Ingredient_*`
   - Special features: `Feature_*`
   - SPF rating if applicable

5. **Verify in Shopify**
   - Tags appear in product admin
   - No typos or formatting errors

### Bulk Tagging (CSV Import)

When importing products via CSV:

```csv
Handle,Title,Tags
vichy-normaderm-cleanser,"Vichy Normaderm Cleansing Gel","Concern_Acne, Concern_Oiliness, Step_Cleanser, Brand_Vichy, Ingredient_SalicylicAcid"
la-roche-posay-hyalu-b5,"La Roche-Posay Hyalu B5 Serum","Concern_Aging, Concern_Dryness, Step_Serum, Brand_LaRochePosay, Ingredient_HyaluronicAcid"
```

**Important:** Tags in CSV must be comma-separated within quotes.

---

## Using Tags in Beauty Assistant

### Example Query Logic

When a user says: **"I have acne and oily skin"**

The Beauty Assistant queries:
```sql
SELECT * FROM products 
WHERE tags LIKE '%Concern_Acne%' 
  AND tags LIKE '%Concern_Oiliness%'
ORDER BY popularity DESC
LIMIT 5;
```

### Routine Building

For morning routine:
```sql
-- Get cleanser
SELECT * FROM products 
WHERE tags LIKE '%Step_Cleanser%' 
  AND tags LIKE '%Concern_Acne%' 
LIMIT 1;

-- Get moisturizer
SELECT * FROM products 
WHERE tags LIKE '%Step_Moisturizer%' 
  AND tags LIKE '%Concern_Acne%' 
LIMIT 1;

-- Get sunscreen
SELECT * FROM products 
WHERE tags LIKE '%Step_Sunscreen%' 
LIMIT 1;
```

---

## Tag Maintenance

### Quarterly Review
- [ ] Audit random product sample for correct tagging
- [ ] Check for new concerns/ingredients to add
- [ ] Remove obsolete tags
- [ ] Update this protocol with new tags

### When to Update Tags
- Product formulation changes
- New scientific research about ingredients
- Customer feedback about product efficacy
- Expanding to new product categories

---

## Tag Validation

Use this SQL query to find untagged or improperly tagged products:

```sql
-- Products missing concern tags
SELECT handle, title, tags 
FROM products 
WHERE tags NOT LIKE '%Concern_%';

-- Products missing step tags
SELECT handle, title, tags 
FROM products 
WHERE tags NOT LIKE '%Step_%';

-- Products with no tags at all
SELECT handle, title 
FROM products 
WHERE tags IS NULL OR tags = '';
```

---

## Examples of Well-Tagged Products

### Example 1: Treatment Serum
```
Product: The Ordinary Niacinamide 10% + Zinc 1%
Tags: 
  Concern_Oiliness,
  Concern_Pores,
  Concern_Acne,
  Step_Serum,
  Brand_TheOrdinary,
  Ingredient_Niacinamide,
  Feature_Vegan,
  Feature_CrueltyFree
```

### Example 2: Moisturizer
```
Product: CeraVe Moisturizing Cream
Tags:
  Concern_Dryness,
  Concern_Sensitivity,
  Step_Moisturizer,
  Brand_CeraVe,
  Ingredient_Ceramides,
  Ingredient_HyaluronicAcid,
  Feature_FragranceFree,
  Feature_NonComedogenic
```

### Example 3: Sunscreen
```
Product: La Roche-Posay Anthelios Fluid SPF 50+
Tags:
  Step_Sunscreen,
  Brand_LaRochePosay,
  SPF_50Plus,
  Feature_FragranceFree,
  Concern_Sensitivity
```

---

## Tools for Tagging

### Shopify Admin
- Navigate to Products
- Edit individual products
- Add/remove tags in Tags field

### Matrixify (Excel Import/Export)
- Export products to Excel
- Edit tags in bulk
- Re-import to Shopify

### CSV Import
- Use Shopify's native CSV import
- Format: `Handle,Title,Tags`
- Tags must be comma-separated in quotes

---

## Related Documentation
- [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) - Monitoring and checklists
- [LAUNCH_EXECUTION_PLAN.md](./LAUNCH_EXECUTION_PLAN.md) - Bulk import process
- [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md) - How tags are used by AI
