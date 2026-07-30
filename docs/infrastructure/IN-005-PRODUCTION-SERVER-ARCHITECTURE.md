---
id: IN-005-PRODUCTION-SERVER-ARCHITECTURE
title: IN-005 — Production Server Architecture
sidebar_label: IN-005 Server Architecture
---

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
