# Asper Beauty Shop Documentation

Welcome to the Asper Beauty Shop documentation! This directory contains comprehensive guides for monitoring, deploying, and maintaining the Digital Concierge ecosystem.

---

## 📚 Documentation Index

### Core Monitoring & Operations

#### [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md)
**Central monitoring reference** for the Digital Concierge ecosystem

- Shopify Orders monitoring
- Gorgias customer support interface
- Chat logs and consultations (Supabase)
- Beauty Assistant audit logs
- Health URL checks and API verification
- Daily "Morning Rounds" checklist
- Weekly "Clinical Audit" checklist

**Use when:** You need to check system status, review orders, or perform routine maintenance.

---

#### [HEALTH-CHECK-PROTOCOL.md](./HEALTH-CHECK-PROTOCOL.md)
**Automated and manual health checks** for all system components

- Frontend build & lint verification
- Database health (Supabase connection tests)
- Edge Functions availability checks
- Shopify integration testing
- Automated health check script usage
- Troubleshooting common issues

**Use when:** Performing system health audits, debugging issues, or verifying deployment.

---

### Deployment & Launch

#### [LAUNCH_EXECUTION_PLAN.md](./LAUNCH_EXECUTION_PLAN.md)
**Comprehensive launch guide** with step-by-step instructions

- Secrets management (Supabase secrets, environment variables)
- Bulk product import from Shopify
- Database initialization
- Edge Functions deployment
- Frontend deployment
- Live-fire testing scenarios
- Post-launch monitoring
- Rollback procedures

**Use when:** Launching the system for the first time or performing major updates.

---

#### [NEXT_STEPS.md](./NEXT_STEPS.md)
**Deployment checklist and PR template**

- Pre-deployment checklist (code quality, testing, documentation)
- Correct deployment order (database → Edge Functions → frontend)
- Pull request template
- Post-deployment verification steps
- Rollback procedures
- CI/CD pipeline configuration
- Release notes template

**Use when:** Deploying changes to production or creating pull requests.

---

### Product & AI Configuration

#### [SHOPIFY_TAGGING_PROTOCOL.md](./SHOPIFY_TAGGING_PROTOCOL.md)
**Standardized product tagging system**

- Concern tags (Concern_Acne, Concern_Aging, etc.)
- Step tags (Step_Cleanser, Step_Serum, etc.)
- Brand, ingredient, and feature tags
- Tagging best practices
- Bulk tagging via CSV
- Tag validation queries

**Use when:** Adding new products, organizing catalog, or configuring AI recommendations.

---

#### [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md)
**Complete guide for the AI chatbot Edge Function**

- Prerequisites and setup
- Deployment steps (Supabase CLI)
- Environment variables and secrets
- Testing with curl commands
- Monitoring and logs
- Persona routing (Dr. Sami vs. Lina)
- Frontend integration examples
- Performance optimization

**Use when:** Deploying or updating the Beauty Assistant, troubleshooting AI responses.

---

## 🚀 Quick Start Paths

### For New Team Members
1. Start with [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) to understand the ecosystem
2. Review [SHOPIFY_TAGGING_PROTOCOL.md](./SHOPIFY_TAGGING_PROTOCOL.md) to learn product organization
3. Check [HEALTH-CHECK-PROTOCOL.md](./HEALTH-CHECK-PROTOCOL.md) to understand system checks

### For Developers
1. Read [NEXT_STEPS.md](./NEXT_STEPS.md) for the deployment workflow
2. Study [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md) for AI functionality
3. Review [LAUNCH_EXECUTION_PLAN.md](./LAUNCH_EXECUTION_PLAN.md) for comprehensive setup

### For Operations
1. Use [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) for daily routines
2. Run health checks from [HEALTH-CHECK-PROTOCOL.md](./HEALTH-CHECK-PROTOCOL.md)
3. Follow [NEXT_STEPS.md](./NEXT_STEPS.md) for deployments

---

## 🛠️ Scripts

All documentation references automated scripts located in `/scripts`:

- **`health-checks.ps1`** - PowerShell health check script (Windows)
- **`health-checks.sh`** - Bash health check script (macOS/Linux)

Run from project root:
```bash
# Windows PowerShell
.\scripts\health-checks.ps1

# macOS/Linux
./scripts/health-checks.sh
```

---

## 🔗 External Resources

### Dashboards
- **Shopify Admin:** [admin.shopify.com](https://admin.shopify.com/store/lovable-project-milns)
- **Supabase Dashboard:** [Project rgehleqcubtmcwyipyvi](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi)
- **Gorgias:** [asperbeauty.gorgias.com](https://asperbeauty.gorgias.com)
- **Production Site:** [asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app)

### APIs
- **Shopify Storefront API:** `https://lovable-project-milns.myshopify.com/api/2025-01/graphql.json`
- **Beauty Assistant:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`

---

## 📋 Routine Checklists

### Daily (Morning Rounds)
- [ ] Check Shopify orders for new COD orders
- [ ] Review Gorgias tickets for AI escalations
- [ ] Check `beauty_assistant_audit` for recent activity

### Weekly (Clinical Audit)
- [ ] Run `.\scripts\health-checks.ps1` (or `.sh`)
- [ ] Sync new products if added to Shopify
- [ ] Review and update product tags
- [ ] Check system metrics and logs

### Monthly
- [ ] Review and update documentation
- [ ] Update dependencies (security patches)
- [ ] Analyze Beauty Assistant performance
- [ ] Optimize slow database queries

---

## 🆘 Troubleshooting

If you encounter issues:

1. **Check health status:** Run health check script
2. **Review logs:** Supabase Dashboard → Edge Functions → Logs
3. **Verify configuration:** Check environment variables and secrets
4. **Consult docs:** Find relevant guide from index above
5. **Check database:** Query audit tables for error messages

---

## 🤝 Contributing

When updating documentation:

1. Keep documents focused on a single topic
2. Use clear headings and section breaks
3. Include code examples where applicable
4. Update this README if adding new docs
5. Cross-reference related documents
6. Test all commands and scripts before documenting

---

## 📝 Document Status

| Document | Status | Last Major Update |
|----------|--------|-------------------|
| SYSTEM_MONITOR.md | ✅ Active | Feb 2026 |
| HEALTH-CHECK-PROTOCOL.md | ✅ Active | Feb 2026 |
| LAUNCH_EXECUTION_PLAN.md | ✅ Active | Feb 2026 |
| NEXT_STEPS.md | ✅ Active | Feb 2026 |
| SHOPIFY_TAGGING_PROTOCOL.md | ✅ Active | Feb 2026 |
| BEAUTY_ASSISTANT_DEPLOY.md | ✅ Active | Feb 2026 |

---

## 📧 Support

For questions or issues:
- **Technical Issues:** Check Supabase logs and function errors
- **Documentation Errors:** Create an issue or PR
- **Emergency:** Follow rollback procedures in relevant guide

---

Built with ❤️ for Asper Beauty Shop
