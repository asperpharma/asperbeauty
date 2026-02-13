# Asper Beauty Shop - GitHub Copilot Instructions

## Project Overview

Asper Beauty Shop is a luxury e-commerce storefront for premium skincare and
beauty products. The application provides a modern, responsive shopping
experience with full Arabic language support (RTL), product catalog, shopping
cart, wishlist, and Shopify integration for checkout.

**Live Site**: https://asperbeautyshop.lovable.app

## Tech Stack

### Core Technologies

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Language**: TypeScript 5.8+
- **Package Manager**: npm (with bun support)

### UI & Styling

- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Design System**: Custom tokens defined in `src/index.css`
- **Typography**: Playfair Display (headings), Montserrat (body), Tajawal
  (Arabic RTL)
- **Animations**: CSS animations with Tailwind

### State & Data Management

- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **API Integration**: Shopify Storefront API, Supabase

### Development Tools

- **Linter**: ESLint 9 with TypeScript ESLint
- **Type Checking**: TypeScript strict mode

## Architecture & File Structure

```
src/
├── assets/           # Images and static assets
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui base components (DO NOT modify directly)
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── integrations/    # External API integrations (Shopify, Supabase)
├── lib/             # Utility functions and helpers
├── pages/           # Route page components
└── stores/          # Zustand state stores
```

## Coding Standards

### TypeScript

- **ALWAYS** use TypeScript for all new code
- Define proper types and interfaces; avoid `any` type
- Use strict type checking
- Leverage TypeScript's type inference where appropriate
- Export types/interfaces that may be reused

### React Components

- Use **functional components** with hooks exclusively
- Keep components small and focused (single responsibility)
- Extract reusable logic into **custom hooks** in `src/hooks/`
- Prefer composition over complex component hierarchies
- Use proper TypeScript types for component props

### Component Structure Pattern

```typescript
// Type definitions at the top
interface ComponentProps {
  // Props definition
}

// Component implementation
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // JSX return
  return (
    // Component markup
  );
}
```

### Styling Guidelines

- **ALWAYS** use Tailwind CSS utility classes
- **NEVER** use inline styles or hardcoded colors
- Use semantic color tokens from the design system:
  - `--maroon` (#800020) - Primary brand color
  - `--soft-ivory` (#F8F8FF) - Background
  - `--shiny-gold` (#C5A028) - Accent color
  - `--dark-charcoal` (#333333) - Text color
- Use Tailwind's semantic tokens: `text-foreground`, `bg-primary`,
  `border-border`, etc.
- Ensure all components are **fully responsive** (mobile-first approach)
- Test layouts on mobile (375px+), tablet (768px+), and desktop (1024px+)

### RTL & Internationalization

- **CRITICAL**: Maintain full RTL (right-to-left) support for Arabic language
- Use logical properties: `start/end` instead of `left/right` where possible
- Test all UI changes in both LTR and RTL modes
- Arabic typography uses Tajawal font family
- Ensure directional icons and layouts flip correctly in RTL

### State Management

- Use Zustand stores in `src/stores/` for global state
- Keep store logic simple and focused
- Use React Query for server state and caching
- Prefer local component state for UI-only state

### File Naming

- Components: PascalCase (e.g., `ProductCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useCart.ts`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Stores: camelCase with 'Store' suffix (e.g., `cartStore.ts`)

## Testing & Quality

### Code Quality Checklist

- [ ] Code builds without errors: `npm run build`
- [ ] Code passes linting: `npm run lint`
- [ ] TypeScript compiles without errors
- [ ] Components are responsive (mobile, tablet, desktop)
- [ ] RTL support maintained for Arabic language
- [ ] No console errors or warnings in browser
- [ ] Accessibility: semantic HTML, proper ARIA labels

### Build & Development

- **Development**: `npm run dev` (starts Vite dev server)
- **Build**: `npm run build` (production build)
- **Preview**: `npm run preview` (preview production build)
- **Lint**: `npm run lint` (run ESLint)

## Component Library (shadcn/ui)

- Base UI components are in `src/components/ui/`
- **DO NOT** modify shadcn/ui components directly
- To customize, wrap them in new components or use className props
- shadcn/ui components follow Radix UI patterns
- All components support dark mode via `next-themes`

## Key Pages & Routes

| Route                  | Component    | Purpose                             |
| ---------------------- | ------------ | ----------------------------------- |
| `/`                    | Home         | Hero, featured products, categories |
| `/brands`              | Brands       | Browse all brands                   |
| `/brands/:slug`        | BrandPage    | Individual brand showcase           |
| `/collections/:handle` | Collection   | Product collections                 |
| `/products/:handle`    | ProductPage  | Product details                     |
| `/skin-concerns`       | SkinConcerns | Shop by skin concern                |
| `/offers`              | Offers       | Promotions                          |
| `/best-sellers`        | BestSellers  | Top products                        |
| `/contact`             | Contact      | Contact info                        |

## External Integrations

### Shopify

- Products fetched via Shopify Storefront API
- Checkout handled by Shopify
- Product data includes: title, description, images, variants, price

### Supabase

- Backend for additional data storage
- Authentication (if implemented)

## Common Patterns

### Data Fetching with TanStack Query

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
```

### Zustand Store Pattern

```typescript
import { create } from "zustand";

interface StoreState {
  items: Item[];
  addItem: (item: Item) => void;
}

export const useStore = create<StoreState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
```

### Form Handling with React Hook Form + Zod

```typescript
const schema = z.object({
  email: z.string().email(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## Git Workflow & Commits

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `style/description` - UI/styling changes

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

- `feat(cart): add quantity selector to cart items`
- `fix(search): resolve dropdown not closing on blur`
- `docs(readme): update installation instructions`

## Performance Considerations

- Lazy load route components where appropriate
- Optimize images (use WebP, proper sizing)
- Minimize bundle size (check `npm run build` output)
- Use React.memo() for expensive components
- Leverage TanStack Query caching for API calls

## Accessibility (a11y)

- Use semantic HTML elements
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers where applicable

## Additional Guidelines

- Prefer existing libraries over writing custom implementations
- Keep dependencies up to date (security patches)
- Document complex logic with comments
- Handle loading and error states in UI
- Validate user input properly
- Never commit secrets or API keys to the repository

## Project-Specific Notes

- This project uses Lovable platform for deployment
- Changes sync between Lovable and GitHub
- Production builds are automatically deployed
- Environment variables should be configured in Lovable dashboard
