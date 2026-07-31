---
id: IN-005-STAGING-SERVER-ARCHITECTURE
title: IN-005 — Staging Server Architecture
sidebar_label: IN-005 Server Architecture (Staging)
---

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

- [IN-001 SSL (Staging)](./IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md)
- [IN-002 PM2 (Staging)](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md)
- [IN-006 Monitoring (Staging)](./IN-006-MONITORING-ALERTING-STAGING.md)
- Gap mirror: [IN-005 Server Architecture](/gaps/infrastructure/IN-005-server-architecture)

## Summary

Staging runs on **Zone.ee PRO Webhosting** (`217.146.71.63`) under user `virt20240`. Document root is `.../www.dev.rahvaraamat.ee/uus-rahvaraamat/`. Subdomains `audio.dev` and `main.dev` use **PHP 8.4**. MariaDB database is **`d19723_betarahva2`**. Redis is enabled on loopback (cache-only). Port forwards expose outlet/main web and Kafka-related ports. FTP/SSH access inventories are listed above without credentials.
