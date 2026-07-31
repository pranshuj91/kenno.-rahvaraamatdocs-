---
id: IN-006-MONITORING-ALERTING
title: IN-006 — Monitoring & Alerting
sidebar_label: IN-006 Monitoring & Alerting
---

# IN-006 — Monitoring & Alerting

Confirmed production monitoring, logs, and scheduled-job signals for `web.rahvaraamat.ee`.

Source: Zone.ee portal screenshots, 31 July 2026.

## Server monitoring (Zone.ee)

Zone.ee provides monitoring for:

- Web Server
- MariaDB Server
- Resource Usage

## Redis monitoring

Available metrics include:

- Memory
- Operations
- Connections
- Keys

Observed (approx.): ~2.60 GiB used of ~92.9 GiB limit; ~247 ops/s mean.

## Available logs

- Apache Logs
- FTP Access Logs
- SSH Authentication Logs
- Webserver Email Logs

### Apache log retention (Zone.ee)

| Item | Value |
|---|---|
| Location | `/logs` folder on the host |
| Behaviour | Real-time; HTTP and HTTPS logged separately; PHP errors in a single file |
| Retention | Rotated daily at **00:00 UTC**; kept for **4 days** |
| Longer history | Custom crontab archive, or order past logs from Zone (`info@zone.ee`) up to ~3 months |

## Scheduled jobs

Production currently has **56 / 100** cron jobs configured.

Examples include:

- Order Processing / Order Sync / Order Shipping
- Product Sync / Product Price Sync / Large Product Import
- Availability Sync + main stock import
- Customer Price Group Sync
- Business / Wholesale Client Sync
- Gift Card Sync
- Sales History Sync
- Campaign Sync
- Product Feed Export
- Sitemap Export
- Elastic Spool
- Daily Report Operations
- Daily Health Report
- Currency Coefficient Fetch (ECB)
- Session / Action Cleanup
- Cleanup Failed Logins & Archive Logs
- Wish list email / Loyalty program jobs
- Cardoza Product importer
- Image Files Sync

## Elasticsearch

Confirmed:

- Elasticsearch runs under **PM2** (`elasticsearch-7.16.2`)
- An **Elastic Spool** cron job exists

## Health reporting

Confirmed:

- A **Daily Health Report** cron job exists

## Backups (Zone panel)

Zone Backups UI exposes Applications / Files / Databases / Mailboxes. The Applications (WordPress snapshot) tab showed **no applications installed** at capture time. File/database backup behaviour is also covered under [Backups](../deployment/BACKUPS.md).

## Related pages

- [IN-005 Production Server Architecture](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md)
- [IN-002 PM2 Processes](./IN-002-PM2-PROCESS-MANAGEMENT.md)
- Gap mirror: [IN-006 Monitoring & Alerting](/gaps/infrastructure/IN-006-monitoring-alerting)
- Related gap: [IN-007 Log Management](/gaps/infrastructure/IN-007-log-management)

## Summary

Production monitoring today is primarily through **Zone.ee** (web, MariaDB, resources) plus **Redis** metrics and standard host logs (Apache, FTP, SSH, email). Apache logs are retained **4 days**. Background work is driven by **56 cron jobs**, including Elastic Spool and Daily Health Report. Elasticsearch itself is managed via PM2.
