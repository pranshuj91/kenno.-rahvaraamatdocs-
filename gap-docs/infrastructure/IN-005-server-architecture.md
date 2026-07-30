---
id: IN-005-server-architecture
title: IN-005 — Server Architecture
sidebar_label: IN-005 Server Architecture
---

# IN-005 — Server Architecture

| Field | Value |
|---|---|
| Priority | Infrastructure |
| Category | Infrastructure |
| Gap item | Server Architecture |
| Description | Production server setup, load balancing, CDN — infrastructure diagram |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Source files used

- `docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE.md`
- `docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE.md`
- `docs/infrastructure/INFRASTRUCTURE_OVERVIEW.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE.md`

# IN-005 — Production Server Architecture

Confirmed production hosting and server details for Rahva Raamat.

## Hosting

| Item | Value |
|---|---|
| Hosting provider | Zone.ee |
| Hosting package | Dedicated Webhosting |
| IP address | `217.146.68.148` |
| Temporary domain | `web-rahvaraamat-ee.vserver.zonevs.eu` |
| System username | `virt102759` |

## Paths

| Item | Path |
|---|---|
| Document root | `/data01/virt102759/domeenid/www.web.rahvaraamat.ee/uus-rahvaraamat/` |
| Webhost root | `/data01/virt102759` |

## Database (MariaDB)

| Item | Value |
|---|---|
| Database server | `d103107.mysql.zonevs.eu` |
| Current usage | 3 MariaDB users · 1 MariaDB database |
| Maximum capacity | 1000 users · 1000 databases |

## Redis

| Item | Value |
|---|---|
| Redis | Enabled |
| Host | `virt102759.loopback.zonevs.eu` |
| IP | `127.1.184.119` |
| Port | `6379` |

Redis monitoring is available for:

- Memory
- Operations
- Connections
- Keys

## Confirmed technology stack

- Apache Web Server
- PHP 8.3
- MariaDB
- Redis
- Elasticsearch
- PM2
- Cron Jobs

## Summary

Production runs on **Zone.ee Dedicated Webhosting** (`217.146.68.148`) under user `virt102759`. The application document root is `.../uus-rahvaraamat/`. Data services in use include **MariaDB** (remote Zone host) and **Redis** (loopback). The confirmed stack also includes Apache, PHP 8.3, Elasticsearch, PM2, and cron jobs.


---

### From `docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE.md`

# IN-005 — Staging Server Architecture

Confirmed staging hosting and server details for Rahva Raamat.

## Hosting

| Item | Value |
|---|---|
| Hosting provider | Zone.ee |
| Hosting package | PRO Webhosting |
| IP address | `217.146.71.63` |
| IPv6 | `2A02:29EA:A:295::1CA` |
| Temporary domain | `dev-rahvaraamat-ee.vserver.zonevs.eu` |
| System username | `virt20240` |

## Paths

| Item | Path |
|---|---|
| Document root | `/data01/virt20240/domeenid/www.dev.rahvaraamat.ee/uus-rahvaraamat/` |
| Webhost root | `/data01/virt20240` |

## Database (MariaDB)

| Item | Value |
|---|---|
| Database server | `d19723.mysql.zonevs.eu` |
| Current usage | 1 MariaDB user · 1 MariaDB database |
| Maximum capacity | 64 users · 64 databases |

## Redis

| Item | Value |
|---|---|
| Redis | Enabled |
| Host | `virt20240.loopback.zonevs.eu` |
| IP | `127.0.118.32` |
| Port | `6379` |

Redis monitoring is available for:

- Memory
- Operations
- Connections
- Keys

## Confirmed technology stack

- Apache Web Server
- PHP 8.3
- MariaDB
- Redis
- Elasticsearch
- PM2
- Cron Jobs

## Summary

Staging runs on **Zone.ee PRO Webhosting** (`217.146.71.63` / IPv6 `2A02:29EA:A:295::1CA`) under user `virt20240`. Document root is `.../www.dev.rahvaraamat.ee/uus-rahvaraamat/`. Data services include **MariaDB** (`d19723.mysql.zonevs.eu`) and **Redis** on loopback. Confirmed stack: Apache, PHP 8.3, MariaDB, Redis, Elasticsearch, PM2, and cron jobs.


---

### From `docs/infrastructure/INFRASTRUCTURE_OVERVIEW.md`

# Infrastructure Overview

This section documents **confirmed findings** for Rahva Raamat infrastructure. Pages use investigation IDs (`IN-xxx`) and are split by **Production** and **Staging** so Ops and developers can find the same topic quickly.

## Production

| ID | Topic | Page |
|---|---|---|
| IN-005 | Production Server Architecture | [IN-005 Server Architecture](/docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE) |
| IN-001 | SSL Certificate Management | [IN-001 SSL Certificates](/docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT) |
| IN-002 | PM2 Process Management | [IN-002 PM2 Processes](/docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT) |
| IN-006 | Monitoring & Alerting | [IN-006 Monitoring & Alerting](/docs/infrastructure/IN-006-MONITORING-ALERTING) |

## Staging

| ID | Topic | Page |
|---|---|---|
| IN-005 | Staging Server Architecture | [IN-005 Server Architecture (Staging)](/docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE) |
| IN-001 | SSL Certificate Management | [IN-001 SSL (Staging)](/docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING) |
| IN-002 | PM2 Process Management | [IN-002 PM2 (Staging)](/docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING) |
| IN-006 | Monitoring & Alerting | [IN-006 Monitoring (Staging)](/docs/infrastructure/IN-006-MONITORING-ALERTING-STAGING) |

## Recommended reading order (per environment)

1. **Server Architecture (IN-005)** — where the environment runs  
2. **SSL Certificates (IN-001)** — HTTPS / TLS status  
3. **PM2 Processes (IN-002)** — long-running services under PM2  
4. **Monitoring & Alerting (IN-006)** — what is already monitored  

Only verified details from the Zone.ee portal / current findings are documented here.


