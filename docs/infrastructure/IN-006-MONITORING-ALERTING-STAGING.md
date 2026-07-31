---
id: IN-006-MONITORING-ALERTING-STAGING
title: IN-006 — Monitoring & Alerting (Staging)
sidebar_label: IN-006 Monitoring (Staging)
---

# IN-006 — Monitoring & Alerting (Staging)

Confirmed staging monitoring, logs, and scheduled-job signals for `dev.rahvaraamat.ee`.

Source: Zone.ee portal screenshots, 31 July 2026.

## Server monitoring (Zone.ee)

Zone.ee provides monitoring for:

- Resource Usage (~85% used at capture)
- Redis Memory
- Redis Operations
- Redis Connections
- Redis Keys
- Webalizer usage statistics for `dev.rahvaraamat.ee`

## Quota notifications

| Notification | Frequency | Status |
|---|---|---|
| Storage quota (90%) | Once a day | Active |
| Email quota | Once a day | Inactive |
| Inode quota | Once a day | Inactive |

## Available logs

Zone.ee provides:

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

Staging currently has **16 configured cron jobs** (16/16 slots in use — limit reached).

### Active examples

- Order Process & Upload Manually Added Chapters (`*/2 6-23 * * *`)
- Order Sync (`00,30 6-23 * * *`)
- Cleanup Failed Orders (`*/17 8-23 * * *`)
- Product Sync (`42 13 * * *`)
- Product Post & Client Post Sync (`0 8-22 * * *`)
- Product Price Sync (`30 7 * * *`)
- Product Discount Group Sync (`20 22 * * *`)
- Availability Sync & Buroomaailm import (`30 3 * * *`)
- Business Client Discount Group Sync (`30 8 * * *`)
- Customer Price Group Sync (`20 22 * * *`)
- Gift Card Sync (`0 4 * * *`)
- Cleanup Failed Logins & Archive Logs (`30 6 * * 6`)
- Elastic Spool (`*/7 8-23 * * *`)

### Inactive jobs

- Redirect Relations (`* * * * *`)
- Retail & Business Client Sync (`42 8-22 * * *`)
- Sales Statistics & Sales Top Sync (`45 5 * * *`)

## Elasticsearch

Confirmed:

- Elasticsearch is managed by **PM2**
- An **Elastic Spool** cron job exists

## Related pages

- [IN-005 Staging Server Architecture](./IN-005-STAGING-SERVER-ARCHITECTURE.md)
- [IN-002 PM2 (Staging)](./IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md)
- Gap mirror: [IN-006 Monitoring & Alerting](/gaps/infrastructure/IN-006-monitoring-alerting)
- Related gap: [IN-007 Log Management](/gaps/infrastructure/IN-007-log-management)

## Summary

Staging monitoring is primarily through **Zone.ee** resource and Redis metrics, Webalizer stats, and Apache / FTP / SSH / email logs. Apache logs are retained **4 days**. Storage quota notification at **90%** is active. Cron capacity is fully used (**16/16**). Elasticsearch runs under PM2 with an Elastic Spool cron present. Some sync/reporting jobs are configured but inactive.
