# Documentation

Welcome to the Asper Beauty Shop documentation. This directory contains comprehensive guides for deploying, monitoring, and maintaining the system.

## 📚 Available Documentation

### Core Documentation

#### [System Monitor](./SYSTEM_MONITOR.md)
Central reference for monitoring the "Digital Concierge" ecosystem. Includes:
- Shopify Orders monitoring
- Gorgias customer service integration
- Chat logs and audit trails
- Health check URLs
- Daily and weekly routine checklists

#### [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md)
Automated and manual health checks for all system components:
- Build and lint verification
- Database health checks
- Edge Function testing
- Frontend validation
- Troubleshooting guides

### Deployment & Operations

#### [Next Steps](./NEXT_STEPS.md)
Deployment checklist and procedures:
- Pre-deployment checklist
- Step-by-step deployment guide
- Post-deployment verification
- Rollback procedures
- Pull request template

#### [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md)
Comprehensive launch guide covering:
- Environment configuration
- Bulk product upload
- Edge Functions deployment
- Frontend deployment
- Live fire testing
- Monitoring and maintenance

### Product Management

#### [Shopify Tagging Protocol](./SHOPIFY_TAGGING_PROTOCOL.md)
Standardized product tagging system:
- Skin concern tags (`Concern_*`)
- Skincare step tags (`Step_*`)
- Skin type tags (`SkinType_*`)
- Ingredient tags (`Ingredient_*`)
- AI Beauty Assistant integration
- Bulk tagging procedures

### AI & Edge Functions

#### [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md)
Deploy and configure the AI-powered Beauty Assistant:
- Edge Function deployment
- OpenAI API configuration
- Testing procedures
- Persona configuration
- Performance optimization
- Monitoring and troubleshooting

---

## 🚀 Quick Start

### For Developers

1. **Setup Environment**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Run Health Checks**
   ```bash
   # Windows
   .\scripts\health-checks.ps1
   
   # Linux/Mac
   ./scripts/health-checks.sh
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

### For Operators

1. **Daily Morning Rounds** (9:00 AM)
   - Check [Shopify Admin](https://admin.shopify.com/store/lovable-project-milns/orders) for new orders
   - Review [Gorgias](https://asperbeauty.gorgias.com) support tickets
   - Check [Supabase Dashboard](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi) for audit logs

2. **Weekly Clinical Audit** (Mondays)
   - Run health check script
   - Review product inventory
   - Update product tags if needed
   - Check Edge Function performance

See [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) for complete checklists.

---

## 🔗 External Resources

### Project URLs

- **Frontend:** https://asperbeautyshop.lovable.app
- **Shopify Admin:** https://admin.shopify.com/store/lovable-project-milns
- **Supabase Dashboard:** https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi
- **Gorgias:** https://asperbeauty.gorgias.com

### API Endpoints

- **Shopify Storefront API:** `https://lovable-project-milns.myshopify.com/api/2025-01/graphql.json`
- **Beauty Assistant:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`
- **Bulk Product Upload:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`

---

## 📖 Documentation Guide

### New to the Project?

Start with these documents in order:

1. [System Monitor](./SYSTEM_MONITOR.md) - Get an overview of the system
2. [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md) - Learn how to verify system health
3. [Next Steps](./NEXT_STEPS.md) - Understand deployment procedures

### Deploying Changes?

Follow this workflow:

1. Read [Next Steps](./NEXT_STEPS.md) for deployment checklist
2. Run health checks before and after deployment
3. Verify changes using [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md)
4. Monitor system using [System Monitor](./SYSTEM_MONITOR.md) checklists

### Managing Products?

Product management workflow:

1. Review [Shopify Tagging Protocol](./SHOPIFY_TAGGING_PROTOCOL.md)
2. Tag products appropriately
3. Use [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md) for bulk uploads
4. Test recommendations with [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md)

### Troubleshooting?

Each document includes a troubleshooting section:

- **Build failures:** See [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md)
- **Deployment issues:** See [Next Steps](./NEXT_STEPS.md)
- **Edge Function errors:** See [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md)
- **Product sync issues:** See [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md)

---

## 🤝 Contributing to Documentation

When updating documentation:

1. **Keep it current:** Update "Last Updated" dates
2. **Be specific:** Include exact URLs, commands, and code examples
3. **Test instructions:** Verify all commands and procedures work
4. **Add screenshots:** Visual aids help understanding
5. **Link between docs:** Cross-reference related documentation

### Documentation Standards

- Use Markdown formatting
- Include code blocks with syntax highlighting
- Add tables for structured information
- Use emoji for visual scanning (✅, ❌, ⚠️, ℹ️)
- Include real examples from the project

---

## 📝 Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| System Monitor | ✅ Active | February 2026 |
| Health Check Protocol | ✅ Active | February 2026 |
| Next Steps | ✅ Active | February 2026 |
| Launch Execution Plan | ✅ Active | February 2026 |
| Shopify Tagging Protocol | ✅ Active | February 2026 |
| Beauty Assistant Deploy | ✅ Active | February 2026 |

---

## 💡 Need Help?

- **Technical Issues:** Check troubleshooting sections in each document
- **Deployment Questions:** Review [Next Steps](./NEXT_STEPS.md) and [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md)
- **System Status:** Use health check scripts in `/scripts` directory
- **Emergency:** Follow rollback procedures in [Next Steps](./NEXT_STEPS.md)

---

**Last Updated:** February 2026
