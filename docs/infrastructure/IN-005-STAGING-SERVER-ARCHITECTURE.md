---
id: IN-005-STAGING-SERVER-ARCHITECTURE
title: IN-005 — Staging Server Architecture
sidebar_label: IN-005 Server Architecture (Staging)
---

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
