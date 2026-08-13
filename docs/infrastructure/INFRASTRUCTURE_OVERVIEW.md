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
| [Database Configuration](./IN-004-WEB-STORE-SSL-SETTINGS.md#database-configuration) |
| [Behavior](./IN-004-WEB-STORE-SSL-SETTINGS.md#behavior) |
| [Configuration Source](./IN-004-WEB-STORE-SSL-SETTINGS.md#configuration-source) |
| [Administration](./IN-004-WEB-STORE-SSL-SETTINGS.md#administration) |
| [Application Usage](./IN-004-WEB-STORE-SSL-SETTINGS.md#application-usage) |
| [What This Setting Controls](./IN-004-WEB-STORE-SSL-SETTINGS.md#what-this-setting-controls) |
| [What This Setting Does NOT Control](./IN-004-WEB-STORE-SSL-SETTINGS.md#what-this-setting-does-not-control) |
| [Technical Flow](./IN-004-WEB-STORE-SSL-SETTINGS.md#technical-flow) |
| [Notes](./IN-004-WEB-STORE-SSL-SETTINGS.md#notes) |
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
| [Hosting](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md#hosting) |
| [Paths](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md#paths) |
| [Database (MariaDB)](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md#database-mariadb) |
| [Redis](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md#redis) |
| [Webserver notes](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md#webserver-notes) |
| [Confirmed technology stack](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md#confirmed-technology-stack) |

### [IN-001](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md) — SSL Certificate Management

| Inside this page |
|---|
| [SSL certificate](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md#ssl-certificate) |
| [Runtime related to the web host](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md#runtime-related-to-the-web-host) |
| [Document root](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md#document-root) |

### [IN-002](./IN-002-PM2-PROCESS-MANAGEMENT.md) — PM2 Process Management

| Inside this page |
|---|
| [PM2 managed processes](./IN-002-PM2-PROCESS-MANAGEMENT.md#pm2-managed-processes) |
| [PM2 configuration files](./IN-002-PM2-PROCESS-MANAGEMENT.md#pm2-configuration-files) |
| [Observations](./IN-002-PM2-PROCESS-MANAGEMENT.md#observations) |

### [IN-006](./IN-006-MONITORING-ALERTING.md) — Monitoring & Alerting

| Inside this page |
|---|
| [Server monitoring (Zone.ee)](./IN-006-MONITORING-ALERTING.md#server-monitoring-zoneee) |
| [Redis monitoring](./IN-006-MONITORING-ALERTING.md#redis-monitoring) |
| [Available logs](./IN-006-MONITORING-ALERTING.md#available-logs) |
| [Scheduled jobs](./IN-006-MONITORING-ALERTING.md#scheduled-jobs) |
| [Elasticsearch](./IN-006-MONITORING-ALERTING.md#elasticsearch) |
| [Health reporting](./IN-006-MONITORING-ALERTING.md#health-reporting) |
| [Backups (Zone panel)](./IN-006-MONITORING-ALERTING.md#backups-zone-panel) |
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
| [Hosting](./IN-005-STAGING-SERVER-ARCHITECTURE.md#hosting) |
| [Paths](./IN-005-STAGING-SERVER-ARCHITECTURE.md#paths) |
| [Subdomains](./IN-005-STAGING-SERVER-ARCHITECTURE.md#subdomains) |
| [Port forwards](./IN-005-STAGING-SERVER-ARCHITECTURE.md#port-forwards) |
| [Database (MariaDB)](./IN-005-STAGING-SERVER-ARCHITECTURE.md#database-mariadb) |
| [Redis](./IN-005-STAGING-SERVER-ARCHITECTURE.md#redis) |
| [Access inventory (high level — no credentials)](./IN-005-STAGING-SERVER-ARCHITECTURE.md#access-inventory-high-level--no-credentials) |
| [Webserver notes](./IN-005-STAGING-SERVER-ARCHITECTURE.md#webserver-notes) |
| [Confirmed technology stack](./IN-005-STAGING-SERVER-ARCHITECTURE.md#confirmed-technology-stack) |

### [IN-001](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md) — SSL Certificate Management (Staging)

| Inside this page |
|---|
| [SSL certificates](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md#ssl-certificates) |
| [HTTPS configuration](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md#https-configuration) |
| [Virtual IP](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md#virtual-ip) |
| [Document root](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md#document-root) |

### [IN-002](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md) — PM2 Process Management (Staging)

| Inside this page |
|---|
| [PM2 managed processes](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md#pm2-managed-processes) |
| [Observations](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md#observations) |

### [IN-006](./IN-006-MONITORING-ALERTING-STAGING.md) — Monitoring & Alerting (Staging)

| Inside this page |
|---|
| [Server monitoring (Zone.ee)](./IN-006-MONITORING-ALERTING-STAGING.md#server-monitoring-zoneee) |
| [Quota notifications](./IN-006-MONITORING-ALERTING-STAGING.md#quota-notifications) |
| [Available logs](./IN-006-MONITORING-ALERTING-STAGING.md#available-logs) |
| [Scheduled jobs](./IN-006-MONITORING-ALERTING-STAGING.md#scheduled-jobs) |
| [Elasticsearch](./IN-006-MONITORING-ALERTING-STAGING.md#elasticsearch) |
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
