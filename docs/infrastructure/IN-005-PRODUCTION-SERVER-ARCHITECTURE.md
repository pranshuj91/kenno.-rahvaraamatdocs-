---
id: IN-005-PRODUCTION-SERVER-ARCHITECTURE
title: IN-005 — Production Server Architecture
sidebar_label: IN-005 Server Architecture
---

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

- [IN-001 SSL Certificates](./IN-001-SSL-CERTIFICATE-MANAGEMENT.md)
- [IN-002 PM2 Processes](./IN-002-PM2-PROCESS-MANAGEMENT.md)
- [IN-006 Monitoring & Alerting](./IN-006-MONITORING-ALERTING.md)
- Gap mirror: [IN-005 Server Architecture](/gaps/infrastructure/IN-005-server-architecture)

## Summary

Production runs on **Zone.ee Dedicated Webhosting** (`217.146.68.148`) under user `virt102759`. Document root is `.../uus-rahvaraamat/`. MariaDB database is **`d103107_uusrahva`** on `d103107.mysql.zonevs.eu`. Redis is enabled on loopback (cache-only). Confirmed stack: Apache, PHP 8.3, MariaDB, Redis, Elasticsearch, PM2, and cron jobs.
