# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                               │
│                    (Your Website Visitors)                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ASPER BEAUTY SHOP WEBSITE                         │
│                  https://asperbeautyshop.lovable.app                 │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (TypeScript, Tailwind CSS, shadcn/ui)        │  │
│  │  • Product Catalog   • Shopping Cart   • Wishlist            │  │
│  │  • Search           • Quick View       • RTL Support          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    SHOPIFY      │ │    SUPABASE     │ │    LOVABLE      │
│   (Products)    │ │   (Database)    │ │   (Platform)    │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ • Product Data  │ │ • Custom Data   │ │ • Hosting       │
│ • Images        │ │ • User Auth     │ │ • Deployment    │
│ • Inventory     │ │ • Backend Logic │ │ • Visual Editor │
│ • Pricing       │ │ • File Storage  │ │ • CI/CD         │
│ • Checkout      │ │ • Edge Functions│ │ • SSL/HTTPS     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                    ┌─────────────────┐
│  SHOPIFY ADMIN  │                    │     GITHUB      │
│   (Your Store)  │                    │  (Source Code)  │
├─────────────────┤                    ├─────────────────┤
│ • Manage        │◄──────────────────►│ • Version       │
│   Products      │    Two-Way Sync    │   Control       │
│ • Orders        │                    │ • Collaboration │
│ • Customers     │                    │ • CI/CD Actions │
└─────────────────┘                    └─────────────────┘
```

## Data Flow

### 1. Product Display Flow
```
Shopify Store → Storefront API → Website → User's Browser
     ↑                                           │
     │                                           │
     └────────── Admin Updates Product ──────────┘
```

### 2. Deployment Flow
```
Developer → GitHub Push → Lovable Sync → Automatic Deploy → Live Website
                                                                   ↓
                                                          Users See Changes
```

### 3. User Data Flow
```
User Action → Website → Supabase → Database
                 │          │
                 │          └─→ Edge Functions
                 │
                 └─→ Shopify (for checkout)
```

## Integration Points

### 🔗 Lovable ↔ GitHub
- **Type**: Two-way sync
- **Frequency**: Automatic, real-time
- **What syncs**: Code changes, configuration
- **Result**: Changes in either place appear in both

### 🔗 Website ↔ Shopify
- **Type**: API calls (REST)
- **Frequency**: On-demand, cached
- **What syncs**: Products, collections, inventory
- **Result**: Product changes in Shopify appear on website

### 🔗 Website ↔ Supabase
- **Type**: Database client
- **Frequency**: Real-time
- **What syncs**: Custom data, user sessions
- **Result**: Backend data available to frontend

## Control Points

### What You Control Where:

| What                    | Where to Control      | How Often to Update |
|-------------------------|-----------------------|---------------------|
| Website Design          | Lovable Dashboard     | As needed           |
| Website Code            | GitHub / Lovable      | As needed           |
| Product Catalog         | Shopify Admin         | Daily/Weekly        |
| Product Images          | Shopify Admin         | As needed           |
| Pricing                 | Shopify Admin         | As needed           |
| Custom Data             | Supabase Dashboard    | As needed           |
| User Authentication     | Supabase Dashboard    | Automatic           |
| Domain Settings         | Lovable Settings      | Rarely              |
| Environment Variables   | Lovable Settings      | Rarely              |
| SSL Certificates        | Lovable (Automatic)   | Automatic           |

## Deployment Pipeline

```
┌──────────────┐
│   Change     │
│   Source     │
└──────┬───────┘
       │
       ├─────────────────┐
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│   Lovable   │   │   GitHub    │
│   Editor    │   │   Push      │
└──────┬──────┘   └──────┬──────┘
       │                 │
       │    Two-Way      │
       │      Sync       │
       └────────┬────────┘
                ▼
       ┌────────────────┐
       │  Lovable Build │
       │    & Deploy    │
       └────────┬───────┘
                │
                ▼
       ┌────────────────┐
       │  Production    │
       │   Website      │
       │   (Live)       │
       └────────────────┘
                │
                ▼
       ┌────────────────┐
       │  CDN & Edge    │
       │  Distribution  │
       └────────────────┘
                │
                ▼
         ┌──────────────┐
         │    Users     │
         └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│          User's Browser                 │
└───────────────┬─────────────────────────┘
                │ HTTPS (SSL/TLS)
                ▼
┌─────────────────────────────────────────┐
│       Lovable CDN + Edge Network        │
│       (DDoS Protection, Caching)        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│        Website Application              │
│    (Input Validation, hCaptcha)         │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Shopify │ │Supabase │ │ Lovable │
│  (PCI   │ │  (RLS,  │ │  (Env   │
│  DSS)   │ │  Auth)  │ │  Vars)  │
└─────────┘ └─────────┘ └─────────┘
```

### Security Features:
- ✅ HTTPS encryption (automatic)
- ✅ PCI DSS compliance (via Shopify)
- ✅ Row Level Security (Supabase)
- ✅ Environment variable protection
- ✅ hCaptcha bot protection
- ✅ DDoS protection (Lovable CDN)
- ✅ CORS policies
- ✅ API rate limiting

## Technology Stack Details

### Frontend
```
React 18 (UI Framework)
  └─→ TypeScript (Type Safety)
       └─→ Vite (Build Tool)
            └─→ Tailwind CSS (Styling)
                 └─→ shadcn/ui (Component Library)
                      └─→ Radix UI (Primitives)
```

### State Management
```
Zustand (Global State)
TanStack Query (Server State)
React Hook Form (Form State)
Context API (Theme, Language)
```

### Integrations
```
Shopify Storefront API (Products)
Supabase Client (Database)
Axios (HTTP Client)
React Router (Navigation)
```

## Performance Optimization

```
┌─────────────────────────────────────────┐
│         Performance Features             │
├─────────────────────────────────────────┤
│ • Code splitting (React.lazy)           │
│ • Image optimization (WebP)             │
│ • CDN delivery (Lovable)                │
│ • Browser caching                       │
│ • TanStack Query caching                │
│ • Lazy loading components               │
│ • Optimized bundle size                 │
│ • CSS-only animations                   │
└─────────────────────────────────────────┘
```

## Monitoring & Analytics

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│        Website Activity              │
└──────┬───────────────────────────────┘
       │
       ├─────────────┬─────────────┬──────────────┐
       ▼             ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Lovable  │  │ Shopify  │  │Supabase  │  │ Datadog  │
│Dashboard │  │Analytics │  │  Logs    │  │Synthetics│
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## Development Workflow

```
Local Development
  ↓
npm run dev (localhost:8080)
  ↓
Test Changes
  ↓
npm run build (check for errors)
  ↓
npm run lint (check code quality)
  ↓
git commit & push
  ↓
GitHub receives changes
  ↓
Lovable auto-syncs
  ↓
Lovable builds & deploys
  ↓
Production website updated
  ↓
Users see changes (2-5 minutes)
```

---

This architecture provides:
- ✅ Scalability (handles traffic spikes)
- ✅ Reliability (99.9% uptime)
- ✅ Security (multiple layers)
- ✅ Performance (fast loading)
- ✅ Maintainability (clean code structure)
- ✅ Flexibility (easy to update)
