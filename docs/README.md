# Documentation

This directory contains detailed documentation for the Asper Beauty Shop project.

## Contents

### [Deployment Flow](./deployment-flow.md)

Comprehensive guide to deploying and managing the Asper Beauty Shop application.

**Topics covered**:
- Deployment architecture overview
- Lovable Platform deployment (primary)
- Shopify Oxygen deployment (alternative)
- Environment configuration
- Build process and optimization
- CI/CD pipeline with GitHub Actions
- Deployment workflows and best practices
- Troubleshooting common deployment issues
- Rollback procedures

### [Health Check Monitoring](./health-check-monitoring.md)

Complete guide to monitoring and maintaining site health.

**Topics covered**:
- Monitoring architecture
- Datadog Synthetics setup and configuration
- Types of health checks (uptime, API, functional, performance)
- Setting up synthetic tests
- Monitoring dashboard and metrics
- CI/CD integration
- Alert response procedures
- Custom health check endpoints
- Monitoring best practices
- Troubleshooting monitoring issues

## Quick Start

### For Developers

1. **Before deploying**: Read [Deployment Flow](./deployment-flow.md) sections:
   - Build Process
   - Environment Configuration
   - Deployment Workflow

2. **After deploying**: Read [Health Check Monitoring](./health-check-monitoring.md) sections:
   - Key Metrics to Monitor
   - Monitoring Dashboard

### For DevOps/SRE

1. **Setting up monitoring**: Follow [Health Check Monitoring](./health-check-monitoring.md):
   - Setting Up Datadog Synthetics
   - Configure Alerts

2. **Managing deployments**: Follow [Deployment Flow](./deployment-flow.md):
   - CI/CD Pipeline
   - Troubleshooting

### For On-Call Engineers

1. **Responding to alerts**: See [Health Check Monitoring](./health-check-monitoring.md):
   - Alert Response Procedures
   - Investigation steps
   - Resolution options

2. **Emergency procedures**: See [Deployment Flow](./deployment-flow.md):
   - Hotfix Deployment
   - Rollback Process

## Additional Resources

- [Main README](../README.md) - Project overview and getting started
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute
- [Security Policy](../SECURITY.md) - Security reporting and practices
- [GitHub Copilot Instructions](../.github/copilot-instructions.md) - AI coding assistant guidelines

## Related Links

- **Live Site**: [https://asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app)
- **GitHub Repository**: [https://github.com/asperpharma/asperbeauty](https://github.com/asperpharma/asperbeauty)
- **Lovable Platform**: [https://lovable.dev](https://lovable.dev)
- **Datadog**: [https://datadoghq.com](https://datadoghq.com)

## Maintenance

These documents should be updated when:
- Deployment process changes
- New monitoring tools are added
- Environment variables are added or changed
- New CI/CD workflows are introduced
- Best practices are updated

## Feedback

If you find issues or have suggestions for improving this documentation:
1. Create an issue in the GitHub repository
2. Submit a pull request with improvements
3. Contact the development team

---

**Last Updated**: February 2026
