---
id: IN-006-MONITORING-ALERTING
title: IN-006 — Monitoring & Alerting
sidebar_label: IN-006 Monitoring & Alerting
---

# IN-006 — Monitoring & Alerting

Confirmed production monitoring, logs, and scheduled-job signals.

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

## Available logs

- Apache Logs
- FTP Access Logs
- SSH Authentication Logs
- Webserver Email Logs

## Scheduled jobs

Production currently has **52 cron jobs**.

Examples include:

- Order Processing
- Product Sync
- Product Price Sync
- Customer Price Group Sync
- Business Client Sync
- Gift Card Sync
- Sales History Sync
- Campaign Sync
- Product Feed Export
- Sitemap Export
- Elastic Spool
- Daily Report Operations
- Daily Health Report
- Currency Coefficient Fetch
- Session Cleanup
- Back in Stock Notifications
- Loyalty Program Jobs

## Elasticsearch

Confirmed:

- Elasticsearch runs under **PM2**
- An **Elastic Spool** cron job exists

## Health reporting

Confirmed:

- A **Daily Health Report** cron job exists

## Summary

Production monitoring today is primarily through **Zone.ee** (web, MariaDB, resources) plus **Redis** metrics and standard host logs (Apache, FTP, SSH, email). Background work is driven by **52 cron jobs**, including Elastic Spool and Daily Health Report. Elasticsearch itself is managed via PM2.
