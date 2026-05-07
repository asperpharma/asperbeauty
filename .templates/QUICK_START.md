# Template Quick Reference Guide

## 🚀 Quick Start

Choose the template that fits your needs and follow the usage instructions.

### Component Template
```bash
cp .templates/component.template.tsx src/components/MyComponent.tsx
# Replace [ComponentName] with MyComponent
```

### Page Template
```bash
cp .templates/page.template.tsx src/pages/MyPage.tsx
# Replace [PageName] with MyPage
# Add route in App.tsx
```

### Hook Template
```bash
cp .templates/hook.template.ts src/hooks/useMyHook.ts
# Replace [HookName] with MyHook
```

### Store Template
```bash
cp .templates/store.template.ts src/stores/myStore.ts
# Replace [StoreName] with MyStore
```

### Form Template
```bash
cp .templates/form.template.tsx src/components/MyForm.tsx
# Replace [FormName] with MyForm
# Update Zod schema
```

### Utility Template
```bash
cp .templates/utility.template.ts src/lib/myUtils.ts
# Replace [UtilityName] with appropriate name
# Add/remove functions as needed
```

## 📋 Template Features

| Template | Features | Use Case |
|----------|----------|----------|
| **Component** | TypeScript, RTL support, Design tokens | General UI components |
| **Page** | SEO, Header/Footer, Loading states | New routes/pages |
| **Product Card** | Shopify integration, Cart/Wishlist | Product displays |
| **Hook** | TypeScript, Return types, Best practices | Custom logic extraction |
| **Store** | Zustand, Persist, TypeScript | Global state management |
| **Form** | React Hook Form, Zod validation, RTL | Forms with validation |
| **Utility** | Common helpers, TypeScript, JSDoc | Helper functions |

## 🎨 Design System Tokens

### Colors
- `bg-burgundy` / `text-burgundy` - Primary (#800020)
- `bg-cream` - Background (#F8F8FF)
- `bg-gold` / `text-gold` - Accent (#C5A028)
- `text-foreground` - Text (#333333)

### Typography
- `font-display` - Headings (Playfair Display)
- `font-body` - Body text (Montserrat)
- `font-arabic` - Arabic (Tajawal)

### Components
- `luxury-container` - Responsive container
- `shadow-gold-md` - Gold shadow
- `hover-lift` - Lift on hover

## ✅ Before Submitting

- [ ] Build passes: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Responsive (mobile, tablet, desktop)
- [ ] RTL support maintained
- [ ] No console errors

## 📚 Full Documentation

See [.templates/README.md](.templates/README.md) for complete documentation.
