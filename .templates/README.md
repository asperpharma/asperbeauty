# Asper Beauty Shop - Code Templates

This directory contains code templates to help maintain consistency across the Asper Beauty Shop codebase.

## 📚 Available Templates

### 1. Component Template (`component.template.tsx`)

A general-purpose React component template with TypeScript.

**Features:**
- ✅ TypeScript interfaces with JSDoc comments
- ✅ Proper hook organization
- ✅ Event handler patterns
- ✅ Language support (English/Arabic RTL)
- ✅ Tailwind CSS styling with design system tokens
- ✅ Accessibility considerations

**Usage:**
```bash
# Copy the template
cp .templates/component.template.tsx src/components/MyNewComponent.tsx

# Replace [ComponentName] with your actual component name
# Update props interface
# Implement your component logic
```

**Example:**
```tsx
import { MyNewComponent } from "@/components/MyNewComponent";

<MyNewComponent 
  prop1="value"
  prop2="optional value"
  className="custom-classes"
/>
```

---

### 2. Page Template (`page.template.tsx`)

A template for creating new page components with routing.

**Features:**
- ✅ Complete page structure with Header and Footer
- ✅ SEO meta tags with Helmet
- ✅ Loading states with skeleton
- ✅ Responsive layout with luxury styling
- ✅ RTL support
- ✅ Navigation hooks integration

**Usage:**
```bash
# Copy the template
cp .templates/page.template.tsx src/pages/MyNewPage.tsx

# Replace [PageName] with your actual page name
# Update SEO meta tags
# Implement page sections
# Add route in App.tsx
```

**Route Setup:**
```tsx
// In App.tsx
import MyNewPage from "@/pages/MyNewPage";

<Route path="/my-new-page" element={<MyNewPage />} />
```

---

### 3. Product Card Template (`product-card.template.tsx`)

A specialized template for product display cards.

**Features:**
- ✅ Shopify product integration
- ✅ Cart and Wishlist functionality
- ✅ Hover effects and transitions
- ✅ Optimized images
- ✅ Responsive design
- ✅ Toast notifications

**Usage:**
```bash
# Use as reference for product display components
# Customize hover effects, buttons, or layout as needed
```

---

## 🎨 Design System Reference

When using these templates, always use the design system tokens:

### Colors
```tsx
// Primary
bg-burgundy        // #800020 - Primary brand color
text-burgundy      // Burgundy text

// Backgrounds
bg-cream          // #F8F8FF - Soft ivory background
bg-secondary      // Secondary background

// Accents
bg-gold           // #C5A028 - Shiny gold accent
border-gold       // Gold borders
shadow-gold-md    // Gold shadows

// Text
text-foreground   // #333333 - Dark charcoal
text-muted-foreground // Muted text
```

### Typography
```tsx
// Headings
font-display      // Playfair Display

// Body text
font-body         // Montserrat

// Arabic (RTL)
font-arabic       // Tajawal
```

### Spacing & Layout
```tsx
// Container
luxury-container  // Responsive container with proper padding

// Shadows
shadow-gold-md    // Medium gold shadow
shadow-gold-lg    // Large gold shadow

// Transitions
hover-lift        // Lift effect on hover
```

---

## 📝 Best Practices

### TypeScript
- ✅ **Always define proper interfaces** for component props
- ✅ **Use type inference** where possible
- ❌ **Avoid `any` type** - use `unknown` or proper types
- ✅ **Add JSDoc comments** for exported functions and components

### Component Structure
```tsx
// 1. Imports
import statements

// 2. Types & Interfaces
interface definitions

// 3. Component
export const Component = (props) => {
  // 3.1. Hooks (useState, useEffect, custom hooks)
  // 3.2. Computed values
  // 3.3. Event handlers
  // 3.4. Render helpers
  // 3.5. Return JSX
};

// 4. Default export (if needed for lazy loading)
export default Component;
```

### Styling Rules
- ✅ **Use Tailwind CSS** utility classes exclusively
- ❌ **Never use inline styles** or hardcoded colors
- ✅ **Use semantic tokens** from design system
- ✅ **Mobile-first approach** - start with mobile, add md:, lg: breakpoints
- ✅ **Test in both LTR and RTL** modes

### RTL Support
```tsx
// Use language context
const { language } = useLanguage();

// Conditional content
{language === 'ar' ? 'محتوى عربي' : 'English content'}

// Use logical properties where possible
className="me-2"  // Instead of mr-2
className="ps-4"  // Instead of pl-4
```

### State Management
- ✅ **Local state** for UI-only state (useState)
- ✅ **Zustand stores** for global state (cart, wishlist)
- ✅ **React Query** for server state
- ✅ **Context** for theme, language, auth

### Performance
- ✅ **Lazy load** below-the-fold components
- ✅ **Use `OptimizedImage`** for images
- ✅ **Memoize expensive computations** with useMemo
- ✅ **Use React.memo()** for expensive components
- ✅ **Code split** routes with lazy imports

---

## 🔍 Code Review Checklist

Before submitting your code:

### Build & Quality
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes without errors
- [ ] No TypeScript errors
- [ ] No console warnings or errors

### Functionality
- [ ] Component works as expected
- [ ] All interactive elements are functional
- [ ] Error states are handled
- [ ] Loading states are implemented

### Design & UX
- [ ] Responsive on mobile (375px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] Works in RTL mode (Arabic)
- [ ] Animations are smooth
- [ ] Colors use design system tokens

### Accessibility
- [ ] Semantic HTML elements used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Alt text for images

---

## 📖 Examples

### Creating a New Feature Component

```bash
# 1. Copy the template
cp .templates/component.template.tsx src/components/PromoCard.tsx

# 2. Update the component
# - Replace ComponentName with PromoCard
# - Define PromoCardProps interface
# - Implement the component logic
# - Add proper styling with design tokens

# 3. Use the component
import { PromoCard } from "@/components/PromoCard";

<PromoCard 
  title="Summer Sale"
  discount={20}
  expiresAt="2024-08-31"
/>
```

### Creating a New Page

```bash
# 1. Copy the template
cp .templates/page.template.tsx src/pages/CustomerReviews.tsx

# 2. Update the page
# - Replace PageName with CustomerReviews
# - Update SEO meta tags
# - Implement page sections
# - Add data fetching logic

# 3. Add route
# In App.tsx:
<Route path="/reviews" element={<CustomerReviews />} />
```

---

## 🚀 Quick Start

1. **Choose the right template** for your needs
2. **Copy the template** to the appropriate directory
3. **Replace placeholder names** with your actual component/page name
4. **Implement your logic** following the structure
5. **Test thoroughly** (responsive, RTL, functionality)
6. **Run lint and build** to ensure quality
7. **Submit PR** using the PR template

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zustand State Management](https://zustand-demo.pmnd.rs)
- [React Query](https://tanstack.com/query/latest)

---

## 💡 Tips

- **Start with the template** - Don't write from scratch
- **Follow the patterns** - Consistency is key
- **Use the design system** - Don't reinvent styling
- **Test RTL early** - Don't wait until the end
- **Keep it simple** - Break complex components into smaller ones
- **Document as you go** - Add JSDoc comments
- **Review existing code** - Learn from similar components

---

## 🤝 Contributing

When adding new templates:

1. Follow the existing template structure
2. Include comprehensive JSDoc comments
3. Add examples and usage instructions
4. Update this README with the new template
5. Test the template by creating a real component
6. Submit PR with clear description

---

**Questions?** Check the [Contributing Guide](../CONTRIBUTING.md) or open an issue.

Built with ❤️ for Asper Beauty Shop
