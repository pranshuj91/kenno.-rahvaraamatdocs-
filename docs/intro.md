---
id: intro
title: Introduction
sidebar_label: Introduction
---

# Rahva Raamat E-commerce Platform

Welcome to the comprehensive developer documentation for **Rahva Raamat**, Estonia's largest bookstore chain and digital content provider. This documentation covers the complete e-commerce backend system that powers their hybrid retail platform.

## What is Rahva Raamat?

Rahva Raamat is Estonia's premier bookstore chain that has evolved into a comprehensive digital content platform. Our e-commerce backend supports:

- **Physical Retail**: Traditional bookstores across Estonia
- **Digital Content**: E-books, audiobooks, and digital media
- **Subscription Services**: Monthly/yearly digital content access
- **B2B Operations**: Wholesale and corporate client services

## Platform Overview

Our platform addresses the complex challenges of managing a hybrid retail business by providing:

### Multi-format Product Support
- Books, e-books, audiobooks, office equipment, music, movies, games
- Digital content with DRM protection
- Physical product inventory management

### Comprehensive User Management
- Multi-role authentication (Admin, Vendor, Client, Customer, Company, Wholesale)
- Role-based access control
- Social login integration

### Advanced Order Processing
- Multi-channel order management (web, mobile, physical stores)
- Real-time order tracking
- Automated notifications

### Payment & Subscription Systems
- Multiple payment gateways (Swedbank, SEB, LHV, Coop, Luminor)
- Open Banking (PSD2) compliance
- Subscription billing and management

### Digital Content Management
- Audiobook streaming with Wowza Media Server
- E-book DRM protection with LCP
- Progress tracking and shelf management

## Documentation map (category-wise)

Follow this order if you are new to the project:

1. **[Onboarding Pack](./setup-guide/ONBOARDING.md)** — KT / delivery ownership (start here)
2. **[Local Setup Roadmap](./setup-guide/LOCAL_SETUP.md)** — get the app running locally
3. **[Project Structure](./core/STRUCTURE.md)** — admin / api / console / common layout
4. **[Environment Setup](./setup-guide/02-ENVIRONMENT_SETUP.md)** — install tools and run locally
5. **[Database Schema](./setup-guide/03-DATABASE_SCHEMA.md)** — tables and relationships
6. **[Authentication](./authentication/09-AUTHENTICATION_AUTHORIZATION.md)** — roles and security
7. **[Commerce & Ordering](./commerce-ordering/ORDER_PURCHASE_FLOW.md)** — basket, checkout, payments
8. **[Integrations](./integrations/EXTERNAL_INTEGRATIONS.md)** — NAV, Kafka, Elasticsearch
9. **[Admin & API](./reference/06-ADMIN_PANEL.md)** — admin panel and HTTP APIs
10. **[Infrastructure & Production](./infrastructure/INFRASTRUCTURE_OVERVIEW.md)** — SSL, PM2, server, monitoring (IN-xxx)
11. **[Deployment & Testing](./deployment/11-DEPLOYMENT_GUIDE.md)** — release and tests
12. **[Monitoring & Operations](./monitoring/12-MONITORING_LOGGING.md)** — logs, cron, cleanup

## Technology Stack

- **Backend**: PHP / Yii2
- **Database**: MySQL
- **Search**: Elasticsearch
- **Cache**: Redis
- **Storage**: AWS S3
- **Media**: Wowza Media Server
- **Payment**: EveryPay / Estonian banks (PSD2)

## Quick Start

1. Read the [Onboarding Pack](./setup-guide/ONBOARDING.md)
2. Open the [Local Setup Roadmap](./setup-guide/LOCAL_SETUP.md)
3. Read [Project Structure](./core/STRUCTURE.md)
4. Follow [Environment Setup](./setup-guide/02-ENVIRONMENT_SETUP.md)
5. Configure [Database Schema](./setup-guide/03-DATABASE_SCHEMA.md) and [Configuration Files](./reference/CONFIGURATION_FILES.md)
6. Review [Project Overview](./reference/01-PROJECT_OVERVIEW.md) and [API Documentation](./reference/05-API_DOCUMENTATION.md)

## Support

For questions, issues, or contributions:
- Check the [FAQ & Troubleshooting](./faq/15-FAQ_TROUBLESHOOTING.md) section
- Review the [Contributing Guidelines](./faq/17-CONTRIBUTING.md)
- Consult the [Glossary](./faq/16-GLOSSARY.md) for terminology

---

*This documentation is maintained by the Rahva Raamat development team and covers the complete e-commerce backend system.* 