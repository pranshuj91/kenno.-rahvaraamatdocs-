---
id: INFRASTRUCTURE_OVERVIEW
title: Infrastructure Overview
sidebar_label: Overview
---

# Infrastructure & Production

This section documents **confirmed findings** for Rahva Raamat infrastructure. Pages use investigation IDs (`IN-xxx`) and are split by **Production** and **Staging** so Ops and developers can find the same topic quickly.

Use the sidebar on the left, or the tables below, to open any page. Each topic lists what is covered inside so you can scan from this overview.

## In this section

### Application-level SSL

| ID | Topic |
|---|---|
| [IN-004](./IN-004-WEB-STORE-SSL-SETTINGS.md) | Web Store SSL Settings |

### [IN-004](./IN-004-WEB-STORE-SSL-SETTINGS.md) — Web Store SSL Settings

| Inside this page |
|---|
| Database Configuration |
| Behavior |
| Configuration Source |
| Administration |
| Application Usage |
| What This Setting Controls |
| What This Setting Does NOT Control |
| Technical Flow |
| Notes |


### Production

| ID | Topic |
|---|---|
| [IN-005](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md) | Production Server Architecture |
| [IN-001](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md) | SSL Certificate Management |
| [IN-002](./IN-002-PM2-PROCESS-MANAGEMENT.md) | PM2 Process Management |
| [IN-006](./IN-006-MONITORING-ALERTING.md) | Monitoring & Alerting |

### [IN-005](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md) — Production Server Architecture

| Inside this page |
|---|
| Hosting |
| Paths |
| Database (MariaDB) |
| Redis |
| Webserver notes |
| Confirmed technology stack |


### [IN-001](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md) — SSL Certificate Management

| Inside this page |
|---|
| SSL certificate |
| Runtime related to the web host |
| Document root |


### [IN-002](./IN-002-PM2-PROCESS-MANAGEMENT.md) — PM2 Process Management

| Inside this page |
|---|
| PM2 managed processes |
| PM2 configuration files |
| Observations |


### [IN-006](./IN-006-MONITORING-ALERTING.md) — Monitoring & Alerting

| Inside this page |
|---|
| Server monitoring (Zone.ee) |
| Redis monitoring |
| Available logs |
| Scheduled jobs |
| Elasticsearch |
| Health reporting |
| Backups (Zone panel) |


### Staging

| ID | Topic |
|---|---|
| [IN-005](./IN-005-STAGING-SERVER-ARCHITECTURE.md) | Staging Server Architecture |
| [IN-001](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md) | SSL Certificate Management (Staging) |
| [IN-002](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md) | PM2 Process Management (Staging) |
| [IN-006](./IN-006-MONITORING-ALERTING-STAGING.md) | Monitoring & Alerting (Staging) |

### [IN-005](./IN-005-STAGING-SERVER-ARCHITECTURE.md) — Staging Server Architecture

| Inside this page |
|---|
| Hosting |
| Paths |
| Subdomains |
| Port forwards |
| Database (MariaDB) |
| Redis |
| Access inventory (high level — no credentials) |
| Webserver notes |
| Confirmed technology stack |


### [IN-001](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md) — SSL Certificate Management (Staging)

| Inside this page |
|---|
| SSL certificates |
| HTTPS configuration |
| Virtual IP |
| Document root |


### [IN-002](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md) — PM2 Process Management (Staging)

| Inside this page |
|---|
| PM2 managed processes |
| Observations |


### [IN-006](./IN-006-MONITORING-ALERTING-STAGING.md) — Monitoring & Alerting (Staging)

| Inside this page |
|---|
| Server monitoring (Zone.ee) |
| Quota notifications |
| Available logs |
| Scheduled jobs |
| Elasticsearch |


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
