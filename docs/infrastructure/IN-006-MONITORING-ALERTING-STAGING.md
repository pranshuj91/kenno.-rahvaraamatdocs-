---
id: IN-006-MONITORING-ALERTING-STAGING
title: IN-006 — Monitoring & Alerting (Staging)
sidebar_label: IN-006 Monitoring (Staging)
---

# IN-006 — Monitoring & Alerting (Staging)

Confirmed staging monitoring, logs, and scheduled-job signals.

## Server monitoring (Zone.ee)

Zone.ee provides monitoring for:

- Resource Usage
- Redis Memory
- Redis Operations
- Redis Connections
- Redis Keys

## Available logs

Zone.ee provides:

- Apache Logs
- FTP Access Logs
- SSH Authentication Logs
- Webserver Email Logs

## Scheduled jobs

Staging currently has **16 configured cron jobs** (16/16 slots in use).

### Active examples

- Order Process & Upload Manually Added Chapters
- Order Sync
- Cleanup Failed Orders
- Product Sync
- Product Post & Client Post Sync
- Product Price Sync
- Product Discount Group Sync
- Availability Sync
- Business Client Discount Group Sync
- Customer Price Group Sync
- Gift Card Sync
- Cleanup Failed Logins & Archive Logs
- Elastic Spool

### Inactive jobs

- Redirect Relations
- Retail & Business Client Sync
- Sales Statistics & Sales Top Sync

## Elasticsearch

Confirmed:

- Elasticsearch is managed by **PM2**
- An **Elastic Spool** cron job exists

## Summary

Staging monitoring is primarily through **Zone.ee** resource and Redis metrics, plus Apache / FTP / SSH / email logs. Cron capacity is fully used (**16/16**). Elasticsearch runs under PM2 with an Elastic Spool cron present. Some sync/reporting jobs are configured but inactive.
