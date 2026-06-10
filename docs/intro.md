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

## Getting Started

This documentation is organized into several sections:

1. **[Environment Setup](./setup-guide/02-ENVIRONMENT_SETUP.md)** - Environment setup and database configuration
2. **[Core Models](./core/04-CORE_MODELS.md)** - Understanding the data models and relationships
3. **[API Documentation](./reference/05-API_DOCUMENTATION.md)** - Complete API reference
4. **[Authentication](./authentication/09-AUTHENTICATION_AUTHORIZATION.md)** - Security and authorization
5. **[Deployment](./deployment/11-DEPLOYMENT_GUIDE.md)** - Production deployment guide
6. **[Monitoring](./monitoring/12-MONITORING_LOGGING.md)** - System monitoring and logging

## Technology Stack

- **Backend**: PHP/Laravel
- **Database**: MySQL/PostgreSQL
- **Search**: Elasticsearch
- **Cache**: Redis
- **Storage**: AWS S3
- **Media**: Wowza Media Server
- **Payment**: Multiple Estonian banks (PSD2)

## Quick Start

1. Follow the [Environment Setup](./setup-guide/02-ENVIRONMENT_SETUP.md) guide
2. Configure the [Database Schema](./setup-guide/03-DATABASE_SCHEMA.md)
3. Review the [Project Overview](./reference/01-PROJECT_OVERVIEW.md) for architecture details
4. Explore the [API Documentation](./reference/05-API_DOCUMENTATION.md) for integration

## Support

For questions, issues, or contributions:
- Check the [FAQ & Troubleshooting](./faq/15-FAQ_TROUBLESHOOTING.md) section
- Review the [Contributing Guidelines](./faq/17-CONTRIBUTING.md)
- Consult the [Glossary](./faq/16-GLOSSARY.md) for terminology

---

*This documentation is maintained by the Rahva Raamat development team and covers the complete e-commerce backend system.* 