# Supabase Database Setup Guide

This guide will help you set up and manage the Supabase database for the Asper Beauty Shop project.

## Prerequisites

- Node.js 18+
- npm or bun
- A Supabase account ([sign up here](https://supabase.com))

## Database Setup

The project uses Supabase for backend services including:
- User authentication and profiles
- Product management
- Order tracking
- Wishlist and cart persistence
- Beauty assistant chat history

### Step 1: Login to Supabase

First, authenticate with your Supabase account:

```bash
npx supabase login
```

This will open a browser window for you to authenticate. Once authenticated, the CLI will store your access token locally.

### Step 2: Link Your Project

Link your local development environment to the Supabase project:

```bash
npx supabase link --project-ref rgehleqcubtmcwyipyvi
```

This connects your local Supabase configuration to the remote project. The project reference ID `rgehleqcubtmcwyipyvi` is already configured in `supabase/config.toml`.

### Step 3: Push Database Schema

Push the local database migrations to your Supabase project:

```bash
npx supabase db push
```

This command will:
- Read all migration files from `supabase/migrations/`
- Apply them to your remote database in order
- Create all necessary tables, functions, and policies

## Database Schema Overview

The database includes the following main tables:

### Users & Authentication
- `profiles` - User profiles with role management
- `user_sessions` - Active user sessions
- `mfa_challenges` - Multi-factor authentication challenges

### Products & Catalog
- `products` - Product information
- `product_embeddings` - Vector embeddings for AI-powered product search
- `brands` - Brand information
- `collections` - Product collections

### Shopping & Orders
- `cart_items` - Shopping cart persistence
- `wishlist_items` - User wishlists
- `orders` - Order tracking
- `order_items` - Individual items in orders

### Chat & AI
- `chat_sessions` - Beauty assistant conversations
- `chat_messages` - Individual chat messages

## Common Operations

### View Database Status

Check the status of your database and migrations:

```bash
npx supabase db status
```

### Create a New Migration

If you need to make schema changes:

```bash
npx supabase migration new migration_name
```

This creates a new migration file in `supabase/migrations/`.

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
npx supabase db reset
```

### Pull Remote Schema Changes

If the remote database has been updated:

```bash
npx supabase db pull
```

## Environment Variables

Make sure you have the following environment variables configured:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are available in your Supabase project settings under Settings > API.

## Troubleshooting

### "Not logged in" error

If you get authentication errors:
```bash
npx supabase logout
npx supabase login
```

### "Project not found" error

Verify the project reference:
```bash
cat supabase/config.toml | grep project_id
```

It should show: `project_id = "rgehleqcubtmcwyipyvi"`

### Migration conflicts

If you encounter migration conflicts:
1. Pull the latest migrations: `npx supabase db pull`
2. Resolve any conflicts in migration files
3. Push again: `npx supabase db push`

## Edge Functions

The project includes several Supabase Edge Functions in `supabase/functions/`:

- `beauty-assistant` - AI-powered beauty consultant
- `bulk-product-upload` - Batch product import
- `create-cod-order` - Cash on delivery orders
- `get-order-status` - Order tracking
- `delete-account` - User account deletion
- `enrich-products` - Product data enrichment
- `scrape-product` - Product data scraping
- `generate-product-images` - AI image generation
- `remove-background` - Background removal service
- `verify-captcha` - CAPTCHA verification
- `generate-embeddings` - Vector embeddings for search

### Deploy Edge Functions

To deploy all functions:

```bash
npx supabase functions deploy
```

To deploy a specific function:

```bash
npx supabase functions deploy beauty-assistant
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/managing-config#database-migrations)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

## Support

For issues specific to this project:
- Create an issue in the GitHub repository
- Check existing issues for similar problems

For Supabase-specific issues:
- Visit [Supabase Support](https://supabase.com/support)
- Join the [Supabase Discord](https://discord.supabase.com)
