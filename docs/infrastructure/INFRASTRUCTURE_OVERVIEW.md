---
id: INFRASTRUCTURE_OVERVIEW
title: Infrastructure Overview
sidebar_label: Overview
---

# Infrastructure Overview

This section documents **confirmed findings** for Rahva Raamat infrastructure. Pages use investigation IDs (`IN-xxx`) and are split by **Production** and **Staging** so Ops and developers can find the same topic quickly.

## Production

| ID | Topic | Page |
|---|---|---|
| IN-005 | Production Server Architecture | [IN-005 Server Architecture](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md) |
| IN-001 | SSL Certificate Management | [IN-001 SSL Certificates](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md) |
| IN-002 | PM2 Process Management | [IN-002 PM2 Processes](./IN-002-PM2-PROCESS-MANAGEMENT.md) |
| IN-006 | Monitoring & Alerting | [IN-006 Monitoring & Alerting](./IN-006-MONITORING-ALERTING.md) |

## Staging

| ID | Topic | Page |
|---|---|---|
| IN-005 | Staging Server Architecture | [IN-005 Server Architecture (Staging)](./IN-005-STAGING-SERVER-ARCHITECTURE.md) |
| IN-001 | SSL Certificate Management | [IN-001 SSL (Staging)](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md) |
| IN-002 | PM2 Process Management | [IN-002 PM2 (Staging)](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md) |
| IN-006 | Monitoring & Alerting | [IN-006 Monitoring (Staging)](./IN-006-MONITORING-ALERTING-STAGING.md) |

## Recommended reading order (per environment)

1. **Server Architecture (IN-005)** — where the environment runs  
2. **SSL Certificates (IN-001)** — HTTPS / TLS status  
3. **PM2 Processes (IN-002)** — long-running services under PM2  
4. **Monitoring & Alerting (IN-006)** — what is already monitored  

Only verified details from the Zone.ee portal / current findings are documented here.
