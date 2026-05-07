# Shopify Tagging Protocol

**Purpose:** Standardized tagging system for product catalog to enable intelligent product recommendations and filtering.

---

## Overview

Products in the Asper Beauty Shop catalog use a structured tagging system to enable:
- AI-powered product recommendations (Beauty Assistant)
- Filtering by skin concern
- Skincare routine building
- Search optimization

---

## Tag Structure

All tags follow this format:
```
Category_Value
```

Examples:
- `Concern_Acne`
- `Step_Cleanse`
- `SkinType_Oily`

---

## 1. Skin Concern Tags (`Concern_*`)

Use these tags to indicate which skin concerns a product addresses.

### Required Concern Tags

| Tag | Description | Example Products |
|-----|-------------|------------------|
| `Concern_Acne` | Treats or prevents acne, breakouts, blemishes | Salicylic acid cleansers, benzoyl peroxide treatments |
| `Concern_Aging` | Anti-aging, reduces wrinkles, fine lines | Retinol serums, peptide creams |
| `Concern_Dryness` | Hydrates and moisturizes dry skin | Hyaluronic acid serums, rich moisturizers |
| `Concern_Sensitivity` | Gentle products for sensitive skin | Fragrance-free products, calming ingredients |
| `Concern_Pigmentation` | Addresses dark spots, uneven tone | Vitamin C serums, niacinamide products |
| `Concern_Redness` | Reduces redness and inflammation | Centella products, green tea extracts |
| `Concern_Dullness` | Brightens and evens skin tone | Exfoliants, vitamin C |
| `Concern_LargeePores` | Minimizes appearance of pores | Clay masks, niacinamide |
| `Concern_DarkCircles` | Treats under-eye darkness | Eye creams with caffeine, vitamin K |
| `Concern_Rosacea` | Manages rosacea symptoms | Azelaic acid, gentle cleansers |

### Multiple Concerns

Products can have multiple concern tags if they address multiple issues:
```
Tags: Concern_Acne, Concern_Oiliness, Concern_LargePores
Example: Salicylic acid cleanser that treats acne AND reduces oiliness AND minimizes pores
```

---

## 2. Skincare Step Tags (`Step_*`)

Use these tags to indicate where the product fits in a skincare routine.

### Required Step Tags

| Tag | Description | Order in Routine | Example Products |
|-----|-------------|------------------|------------------|
| `Step_Cleanse` | Cleansers, makeup removers | 1 | Gel cleansers, micellar water, cleansing balms |
| `Step_Tone` | Toners, essences | 2 | Hydrating toners, pH-balancing toners |
| `Step_Treat` | Treatments, serums | 3 | Vitamin C serum, retinol, niacinamide |
| `Step_Moisturize` | Moisturizers, creams | 4 | Day cream, night cream, gel moisturizer |
| `Step_Protect` | Sunscreen, UV protection | 5 (AM only) | SPF 50, tinted sunscreen |
| `Step_Mask` | Face masks, treatments | Weekly | Clay masks, sheet masks, overnight masks |
| `Step_Exfoliate` | Exfoliants, peels | 2-3x/week | AHA/BHA exfoliants, physical scrubs |
| `Step_Eye` | Eye creams, eye serums | After Step 3 | Eye cream, under-eye patches |
| `Step_Lip` | Lip care products | As needed | Lip balm, lip scrub |

### Routine Example

**Morning Routine:**
1. `Step_Cleanse` - Gentle cleanser
2. `Step_Tone` - Hydrating toner
3. `Step_Treat` - Vitamin C serum
4. `Step_Moisturize` - Day cream
5. `Step_Protect` - SPF 50 sunscreen

**Evening Routine:**
1. `Step_Cleanse` - Oil cleanser + foam cleanser (double cleanse)
2. `Step_Tone` - Hydrating toner
3. `Step_Treat` - Retinol serum
4. `Step_Eye` - Eye cream
5. `Step_Moisturize` - Night cream

---

## 3. Skin Type Tags (`SkinType_*`)

Use these tags to indicate which skin types a product is suitable for.

| Tag | Description |
|-----|-------------|
| `SkinType_Oily` | Best for oily skin |
| `SkinType_Dry` | Best for dry skin |
| `SkinType_Combination` | Best for combination skin |
| `SkinType_Normal` | Best for normal skin |
| `SkinType_Sensitive` | Best for sensitive skin |
| `SkinType_All` | Suitable for all skin types |

---

## 4. Product Type Tags (`Type_*`)

Additional categorization by product form.

| Tag | Description | Examples |
|-----|-------------|----------|
| `Type_Serum` | Concentrated treatments | Vitamin C serum, hyaluronic acid serum |
| `Type_Cream` | Thick creams | Night cream, rich moisturizer |
| `Type_Gel` | Gel formulations | Gel moisturizer, aloe vera gel |
| `Type_Oil` | Oil-based products | Facial oil, cleansing oil |
| `Type_Mask` | Face masks | Clay mask, sheet mask |
| `Type_Sunscreen` | Sun protection | SPF cream, tinted sunscreen |
| `Type_Cleanser` | Cleansing products | Foam cleanser, gel cleanser |
| `Type_Toner` | Toners and essences | Hydrating toner, exfoliating toner |

---

## 5. Brand Tags

Always include the brand name as a tag:
```
Tags: Vichy, La Roche-Posay, CeraVe, The Ordinary, etc.
```

---

## 6. Ingredient Tags (`Ingredient_*`)

Tag key active ingredients for searchability.

### Common Ingredient Tags

| Tag | Ingredient | Benefits |
|-----|------------|----------|
| `Ingredient_VitaminC` | Vitamin C, Ascorbic Acid | Brightening, antioxidant |
| `Ingredient_Retinol` | Retinol, Retinoids | Anti-aging, cell turnover |
| `Ingredient_Niacinamide` | Niacinamide, Vitamin B3 | Pore minimizing, brightening |
| `Ingredient_HyaluronicAcid` | Hyaluronic Acid | Hydration, plumping |
| `Ingredient_SalicylicAcid` | Salicylic Acid, BHA | Acne treatment, exfoliation |
| `Ingredient_GlycolicAcid` | Glycolic Acid, AHA | Exfoliation, brightening |
| `Ingredient_Peptides` | Peptides | Anti-aging, firming |
| `Ingredient_Ceramides` | Ceramides | Barrier repair, hydration |
| `Ingredient_AzelaicAcid` | Azelaic Acid | Rosacea, pigmentation |
| `Ingredient_Centella` | Centella Asiatica, Cica | Soothing, healing |

---

## Tagging Best Practices

### 1. Be Specific

❌ **Bad:** `Acne, Cleanser`
✅ **Good:** `Concern_Acne, Step_Cleanse, SkinType_Oily, Ingredient_SalicylicAcid`

### 2. Tag All Relevant Categories

Each product should have:
- At least 1 `Concern_*` tag
- At least 1 `Step_*` tag
- At least 1 `SkinType_*` tag (or `SkinType_All`)
- Brand tag
- Key `Ingredient_*` tags (if applicable)

### 3. Use Consistent Capitalization

Always use PascalCase after the underscore:
- ✅ `Concern_Acne`
- ❌ `concern_acne`
- ❌ `Concern_acne`

### 4. Don't Over-Tag

Only tag concerns that the product actually addresses. Don't tag every concern just to increase visibility.

---

## Bulk Tagging

### Using CSV Import

When using Matrixify or CSV import to Shopify:

1. Add a `Tags` column to your CSV
2. Separate multiple tags with commas
3. Example row:

```csv
Handle,Title,Vendor,Tags
vichy-normaderm,Vichy Normaderm Phytosolution,Vichy,"Concern_Acne,Concern_Oiliness,Step_Cleanse,SkinType_Oily,Vichy,Ingredient_SalicylicAcid"
```

### Using Shopify Admin

1. Go to Products → Select product
2. Scroll to "Tags" section
3. Enter tags separated by commas
4. Save

### Using Bulk Editor

1. Go to Products → Bulk Editor
2. Select multiple products
3. Click "Tags" column
4. Add tags to multiple products at once
5. Save changes

---

## Validation Checklist

Before importing products, verify:

- [ ] All products have at least one `Concern_*` tag
- [ ] All products have at least one `Step_*` tag
- [ ] All products have a `SkinType_*` tag
- [ ] Brand name is included as a tag
- [ ] Key ingredients are tagged
- [ ] Tags use consistent format: `Category_Value`
- [ ] No typos in tag names
- [ ] No duplicate tags

---

## AI Beauty Assistant Integration

The Beauty Assistant uses these tags to:

1. **Recommend products:** When a user says "I have acne", it filters products with `Concern_Acne`
2. **Build routines:** Creates AM/PM routines using `Step_*` tags in correct order
3. **Filter by skin type:** Recommends products matching user's skin type
4. **Explain ingredients:** Provides information about tagged ingredients

**Example conversation:**
```
User: "I have oily skin and acne. What should I use?"

Beauty Assistant:
- Searches for: Concern_Acne + SkinType_Oily
- Builds routine using Step_* tags
- Recommends:
  1. Step_Cleanse: Vichy Normaderm Gel Cleanser (Concern_Acne, SkinType_Oily)
  2. Step_Treat: The Ordinary Niacinamide 10% (Concern_Acne, SkinType_Oily)
  3. Step_Moisturize: CeraVe PM Lotion (SkinType_Oily)
  4. Step_Protect: La Roche-Posay Anthelios SPF 50 (SkinType_Oily)
```

---

## Maintenance

### Monthly Review

- [ ] Audit products for missing tags
- [ ] Update tags based on new product knowledge
- [ ] Add new concerns/ingredients as needed
- [ ] Remove obsolete tags

### When Adding New Products

1. Research product benefits and concerns
2. Identify key ingredients
3. Determine routine step
4. Assign appropriate skin types
5. Apply all relevant tags
6. Verify tags in Beauty Assistant recommendations

---

## Related Documentation

- [System Monitor](./SYSTEM_MONITOR.md) - System monitoring
- [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md) - Product import procedures
- [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md) - AI recommendation system
