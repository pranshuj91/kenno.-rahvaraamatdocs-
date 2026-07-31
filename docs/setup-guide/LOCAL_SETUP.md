---
id: LOCAL_SETUP
title: Local Setup Quick Guide
sidebar_label: 1. Local Setup Quick Guide
---

# Local Setup Quick Guide

Use this page if you are setting up the Rahva Raamat backend for the **first time**. Follow the steps in order.

## Setup path (start here)

| Step | What to do | Doc |
|---|---|---|
| 1 | Understand the repo layout (admin, api, console, common) | [Project Structure](../core/STRUCTURE.md) |
| 2 | Install via Docker (recommended) or tools manually | [Docker Setup](./DOCKER_SETUP.md) / [Environment Setup](./02-ENVIRONMENT_SETUP.md) |
| 3 | Learn the database tables and relationships | [Database Schema](./03-DATABASE_SCHEMA.md) |
| 4 | Configure `main-local`, `params-local`, and modules | [Configuration Files](../reference/CONFIGURATION_FILES.md) |
| 5 | Apply / understand filesystem migration notes | [Migration Guide](./MIGRATION.md) |
| 6 | Run and verify the app | [Deployment Guide](../deployment/11-DEPLOYMENT_GUIDE.md) |

## After the app runs

1. **Auth** — [Authentication & Authorization](../authentication/09-AUTHENTICATION_AUTHORIZATION.md), [Registration Flow](../authentication/REGISTRATION_FLOW.md)
2. **Orders & payments** — [Order Purchase Flow](../commerce-ordering/ORDER_PURCHASE_FLOW.md), [Payment System](../commerce-ordering/PAYMENT_SYSTEM.md)
3. **Integrations** — [External Integrations](../integrations/EXTERNAL_INTEGRATIONS.md), [NAV Integration](../integrations/NAV_INTEGRATION.md)
4. **Ops** — [Console Commands](../reference/07-CONSOLE_COMMANDS.md), [Cron Jobs](../monitoring/CRON_JOBS.md), [Backups](../deployment/BACKUPS.md)
5. **Troubleshoot** — [FAQ & Troubleshooting](../faq/15-FAQ_TROUBLESHOOTING.md)

## Related quick links

- [Onboarding Pack](./ONBOARDING.md) — KT, triage playbook, first 30 days
- [Project Overview](../reference/01-PROJECT_OVERVIEW.md) — business context and architecture
- [API Documentation](../reference/05-API_DOCUMENTATION.md) — HTTP API reference
- [Admin Panel](../reference/06-ADMIN_PANEL.md) — back-office UI guide
- [Elasticsearch Spool](../integrations/ELASTICSEARCH_SPOOL.md) — search import / spool jobs
- [Hotline & OIDC](../hotline-and-oidc/Hotline-OIDC-Documentation.md) — Hotline module and OpenID Connect
