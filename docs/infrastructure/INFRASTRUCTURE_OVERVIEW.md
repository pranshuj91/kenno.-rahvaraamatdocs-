---
id: INFRASTRUCTURE_OVERVIEW
title: Infrastructure Overview
sidebar_label: Overview
---

# Infrastructure Overview

This section documents **confirmed findings** for Rahva Raamat infrastructure. Pages use investigation IDs (`IN-xxx`) and are split by **Production** and **Staging** so Ops and developers can find the same topic quickly.

## Application-level SSL

| ID | Topic | Page |
|---|---|---|
| IN-004 | Web Store SSL Settings (`ssl_enabled`) | [IN-004 Web Store SSL](./IN-004-WEB-STORE-SSL-SETTINGS.md) |

Controls whether the app generates `http://` or `https://` storefront URLs. It does **not** manage server certificates (see IN-001 for that).

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
2. **SSL Certificates (IN-001)** — HTTPS / TLS status on the host  
3. **Web Store SSL (IN-004)** — app URL protocol (`ssl_enabled`)  
4. **PM2 Processes (IN-002)** — long-running services under PM2  
5. **Monitoring & Alerting (IN-006)** — what is already monitored  

Only verified details from the Zone.ee portal / current findings (and confirmed application behaviour) are documented here.

## Environments (quick map)

| Role in docs | Domain | Zone package | Hosting ID |
|---|---|---|---|
| Production | `web.rahvaraamat.ee` | Dedicated | 103107 (`virt102759`) |
| Staging | `dev.rahvaraamat.ee` | PRO | 19723 (`virt20240`) |

:::note
A Zone screenshot pack may label folders the opposite way (`prod/` = `dev…`, `staging/` = `web…`). Prefer the domain names above.
:::

## Gap Documents

Mirrored gap pages (filled from these docs when content exists):

- [IN-001 SSL Certificate](/gaps/infrastructure/IN-001-ssl-certificate)
- [IN-002 PM2 Process](/gaps/infrastructure/IN-002-pm2-process)
- [IN-004 Web Store SSL](/gaps/infrastructure/IN-004-web-store-ssl)
- [IN-005 Server Architecture](/gaps/infrastructure/IN-005-server-architecture)
- [IN-006 Monitoring & Alerting](/gaps/infrastructure/IN-006-monitoring-alerting)
- [IN-007 Log Management](/gaps/infrastructure/IN-007-log-management)
