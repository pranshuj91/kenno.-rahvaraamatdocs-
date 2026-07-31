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

## Related Developer Docs

- `docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE.md`
- `docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE.md`
- `docs/infrastructure/INFRASTRUCTURE_OVERVIEW.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE.md`


# IN-005 — Production Server Architecture

Confirmed production hosting and server details for Rahva Raamat (`web.rahvaraamat.ee`).

Source: Zone.ee portal screenshots, 31 July 2026.

## Hosting

| Item | Value |
|---|---|
| Hosting provider | Zone.ee |
| Hosting package | Dedicated Webhosting |
| Domain | `web.rahvaraamat.ee` |
| IP address | `217.146.68.148` |
| Temporary domain | `web-rahvaraamat-ee.vserver.zonevs.eu` |
| System username | `virt102759` |
| Disk usage (observed) | ~1.72 TiB used (files + file backups + databases + DB backups) |

## Paths

| Item | Path |
|---|---|
| Document root | `/data01/virt102759/domeenid/www.web.rahvaraamat.ee/uus-rahvaraamat/` |
| Webhost root | `/data01/virt102759` |

## Database (MariaDB)

| Item | Value |
|---|---|
| Database server | `d103107.mysql.zonevs.eu` |
| Database name | `d103107_uusrahva` (label: Uus Rahvaraamat) |
| Database size (observed) | ~319.96 MiB |
| Current usage | 3 MariaDB users · 1 MariaDB database |
| Maximum capacity | 1000 users · 1000 databases |
| phpMyAdmin | `https://pma.tll01.zone.eu/web.rahvaraamat.ee` |

Confirmed MariaDB users (names only — no credentials):

| Username | Label |
|---|---|
| `d103107sa389320` | Administrator |
| `d103107_uusrahva` | Uus Rahvaraamat Admin |
| `d103107_niki` | niki |

## Redis

| Item | Value |
|---|---|
| Redis | Enabled (cache only — no data persistence) |
| Host | `virt102759.loopback.zonevs.eu` |
| IP | `127.1.184.119` |
| Port | `6379` |
| Memory limit (observed) | ~92.9 GiB |
| Memory used (observed) | ~2.60 GiB |
| Ops/s mean (observed) | ~247 |

Redis monitoring is available for:

- Memory
- Operations
- Connections
- Keys

:::warning
Zone Redis has no persistence. Data is deleted on restart.
:::

## Webserver notes

| Item | Value |
|---|---|
| PHP version | PHP 8.3 |
| PHP upgrade strategy | Manual |
| WAF | Disabled |
| HTTP → HTTPS redirect | Enabled |
| Custom error pages (400–500) | Not configured |

## Confirmed technology stack

- Apache Web Server
- PHP 8.3
- MariaDB
- Redis
- Elasticsearch
- PM2
- Cron Jobs

## Related pages

- [IN-001 SSL Certificates](/docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT)
- [IN-002 PM2 Processes](/docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT)
- [IN-006 Monitoring & Alerting](/docs/infrastructure/IN-006-MONITORING-ALERTING)
- Gap mirror: [IN-005 Server Architecture](/gaps/infrastructure/IN-005-server-architecture)

## Summary

Production runs on **Zone.ee Dedicated Webhosting** (`217.146.68.148`) under user `virt102759`. Document root is `.../uus-rahvaraamat/`. MariaDB database is **`d103107_uusrahva`** on `d103107.mysql.zonevs.eu`. Redis is enabled on loopback (cache-only). Confirmed stack: Apache, PHP 8.3, MariaDB, Redis, Elasticsearch, PM2, and cron jobs.


---

### Developer Docs — `docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE.md`


# IN-005 — Staging Server Architecture

Confirmed staging hosting and server details for Rahva Raamat (`dev.rahvaraamat.ee`).

Source: Zone.ee portal screenshots, 31 July 2026.

:::note Folder naming in source pack
The Zone screenshot pack folder named `prod/` contains **`dev.rahvaraamat.ee`** (this staging host). The folder named `staging/` contains **`web.rahvaraamat.ee`** (production). Docs use domain names, not those folder labels.
:::

## Hosting

| Item | Value |
|---|---|
| Hosting provider | Zone.ee |
| Hosting package | PRO Webhosting |
| Domain | `dev.rahvaraamat.ee` |
| IP address | `217.146.71.63` |
| IPv6 | `2A02:29EA:A:295::1CA` |
| Temporary domain | `dev-rahvaraamat-ee.vserver.zonevs.eu` |
| System username | `virt20240` |
| Resource usage (observed) | ~85% of package resources used |
| Delegation | Host delegated by Zone user `virt20240` |

## Paths

| Item | Path |
|---|---|
| Document root (main) | `/data01/virt20240/domeenid/www.dev.rahvaraamat.ee/uus-rahvaraamat/` |
| Webhost root | `/data01/virt20240` |

## Subdomains

| Subdomain | PHP | Document root (confirmed) |
|---|---|---|
| `audio.dev.rahvaraamat.ee` | PHP 8.4 | `/data01/virt20240/domeenid/www.dev.rahvaraamat.ee/audio/uus-rahvaraamat` |
| `main.dev.rahvaraamat.ee` | PHP 8.4 | Under `www.dev.rahvaraamat.ee/` (path includes `rahvaraamat…-web/source`) |

Main host `dev.rahvaraamat.ee` runs **PHP 8.3**. Both listed subdomains run **PHP 8.4**. WAF is **disabled** on these hosts.

## Port forwards

| Port | Comment | Access |
|---|---|---|
| `3030` | `rahvaraamat-outlet-web` | Everywhere (IP whitelist present) |
| `3031` | `rahvaraamat-main-web` | Everywhere (IP whitelist present) |
| `9092` | `kafka-server` | Everywhere |
| `9093` | `kafka-server-1` | Everywhere |
| `3000` | `kafka-node-proxy` | Everywhere |

Forward target IP: `217.146.71.63`. Zone notes activation can take up to 10 minutes.

## Database (MariaDB)

| Item | Value |
|---|---|
| Database server | `d19723.mysql.zonevs.eu` |
| Database name | `d19723_betarahva2` (label: d19723_betarahva MAIN) |
| Database size (observed) | ~20.92 GiB |
| Current usage | 1 MariaDB user · 1 MariaDB database |
| Maximum capacity | 64 users · 64 databases |

Confirmed MariaDB user (name only — no credentials): `d19723sa346757` (label: `singleton_admin`).

## Redis

| Item | Value |
|---|---|
| Redis | Enabled (cache only — no data persistence) |
| Host | `virt20240.loopback.zonevs.eu` |
| IP | `127.0.118.32` |
| Port | `6379` |
| Memory limit (observed) | 512 MiB |
| Memory used (observed) | ~2.88 MiB mean |

Redis monitoring is available for:

- Memory
- Operations
- Connections
- Keys

:::warning
Zone Redis has no persistence. Data is deleted on restart.
:::

## Access inventory (high level — no credentials)

### FTP accounts (8)

Server address: `dev.rahvaraamat.ee`

- `www.dev.rahvaraamat.ee`
- `root.dev.rahvaraamat.ee`
- `avalik.dev.rahvaraamat.ee`
- `kliendihaldus.dev.rahvaraamat.ee`
- `arendus.dev.rahvaraamat.ee`
- `bonefarm.dev.rahvaraamat.ee`
- `authors.republic.dev.rahvaraamat.ee`
- `kenno.dev.rahvaraamat.ee`

### SSH

| Item | Value |
|---|---|
| SSH username | `virt20240` |
| Login form | `virt20240@dev.rahvaraamat.ee` |
| Access | Whitelisted IP addresses only |
| Authorized keys (observed) | 8 keys (owners include Kenno Kirspuu, Mediapark, Nikita, Artak, Abdullah, Rafayel, ray@gaincafe.com, plus a host key) |

### Email

| Item | Value |
|---|---|
| Mailbox | `admin@dev.rahvaraamat.ee` |
| Forwarding / Autoreply / 2FA | Off |

## Webserver notes

| Item | Value |
|---|---|
| PHP version (main) | PHP 8.3 |
| PHP upgrade strategy | Manual |
| WAF | Disabled |
| HTTP → HTTPS redirect | Enabled on main / audio |
| Custom error pages (400–500) | Not configured |

## Confirmed technology stack

- Apache Web Server
- PHP 8.3 (main) / PHP 8.4 (audio.dev, main.dev)
- MariaDB
- Redis
- Elasticsearch
- PM2
- Cron Jobs
- Kafka (via port forwards / related processes)

## Related pages

- [IN-001 SSL (Staging)](/docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING)
- [IN-002 PM2 (Staging)](/docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING)
- [IN-006 Monitoring (Staging)](/docs/infrastructure/IN-006-MONITORING-ALERTING-STAGING)
- Gap mirror: [IN-005 Server Architecture](/gaps/infrastructure/IN-005-server-architecture)

## Summary

Staging runs on **Zone.ee PRO Webhosting** (`217.146.71.63`) under user `virt20240`. Document root is `.../www.dev.rahvaraamat.ee/uus-rahvaraamat/`. Subdomains `audio.dev` and `main.dev` use **PHP 8.4**. MariaDB database is **`d19723_betarahva2`**. Redis is enabled on loopback (cache-only). Port forwards expose outlet/main web and Kafka-related ports. FTP/SSH access inventories are listed above without credentials.


---

### Developer Docs — `docs/infrastructure/INFRASTRUCTURE_OVERVIEW.md`


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
- [IN-005 Server Architecture](/gaps/infrastructure/IN-005-server-architecture)
- [IN-006 Monitoring & Alerting](/gaps/infrastructure/IN-006-monitoring-alerting)
- [IN-007 Log Management](/gaps/infrastructure/IN-007-log-management)

Still **Not Documented** in gaps: [IN-004 Web Store SSL](/gaps/infrastructure/IN-004-web-store-ssl) (no matching `/docs` content for per-store `ssl_enabled`).

