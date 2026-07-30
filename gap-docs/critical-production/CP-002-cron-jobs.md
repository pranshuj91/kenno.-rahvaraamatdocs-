---
id: CP-002-cron-jobs
title: CP-002 — Cron Jobs & Scheduled Tasks
sidebar_label: CP-002 Cron Jobs
---

# CP-002 — Cron Jobs & Scheduled Tasks

| Field | Value |
|---|---|
| Priority | Critical |
| Category | Production |
| Gap item | Cron Jobs & Scheduled Tasks |
| Description | Order processing, NAV sync, cleanup jobs — full list of cron jobs, schedules, dependencies |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | Tomas |

## Source files used

- `docs/monitoring/CRON_JOBS.md`
- `docs/infrastructure/IN-006-MONITORING-ALERTING.md`
- `docs/infrastructure/IN-006-MONITORING-ALERTING-STAGING.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under ``docs/``. Nothing invented.


---

### From `docs/monitoring/CRON_JOBS.md`

# Cron Jobs & Scheduled Tasks

This document lists all console commands intended to run on a schedule, their purpose, and concurrency controls.

> **Note:** The production crontab is configured server-side and is not committed to this repository. The schedules listed below are approximate based on code comments and known operational patterns.

## Concurrency Guard: AlreadyRunningFilter

**File:** `console/filters/AlreadyRunningFilter.php`

Most scheduled commands use `AlreadyRunningFilter` to prevent concurrent execution:
- Stores process state in `SystemState` table
- 2-hour timeout before a stalled process is force-cleared
- State tracked via `SystemStateProcessesRepository` (`console/models/SystemStateProcessesRepository.php`)
- State key format: `activeProcessRunning/<processName>`

Used by 17+ console controllers.

## Critical Scheduled Tasks

### Order Processing
- **Command:** `php yii order/process [--orderId=ID] [--postToNav=0|1]`
- **File:** `console/controllers/OrderController.php`
- **Schedule:** ~Every 2 minutes
- **Filter:** AlreadyRunningFilter
- **Purpose:** Processes pending orders — allocates stock, issues digital entitlements, posts to NAV
- **Additional action:** `order/process-pending-non-refundable-state` — checks audio product refundability

### NAV Availability Sync
- **Command:** `php yii sync/availabilitySync [--markPermanentlyOutOfStockProducts=1]`
- **File:** `common/synchronizations/nav/sync/AvailabilitySync.php` (via SyncController)
- **Schedule:** ~Every 35 minutes, hours 9–22
- **Filter:** AlreadyRunningFilter
- **Purpose:** Pulls inventory from NAV `ItemsAvailableForWeb` table, updates product availability types, triggers back-in-stock notifications
- **Safety:** Minimum threshold of 30k items — aborts if NAV returns fewer (indicates sync error)

### NAV Order Sync
- **Command:** `php yii sync/orderSync [--webStoreNavCode=WEB|WEB2]`
- **File:** `common/synchronizations/nav/sync/OrderSync.php` (via SyncController)
- **Schedule:** ~Every 30 minutes
- **Filter:** AlreadyRunningFilter
- **Purpose:** Reconciles local orders with NAV posted documents and open orders

### Elasticsearch Spool
- **Command:** `php yii elastic/spool`
- **File:** `console/controllers/ElasticController.php`
- **Schedule:** Frequent (every few minutes)
- **Purpose:** Processes queued search index updates
- **Details:** See `../integrations/ELASTICSEARCH_SPOOL.md`

## Notification Tasks

### Notification Generation & Sending
- **Command:** `php yii notification/generate --type=basket|order|offers [--dayOffset=N] [--webStoreNavCode=...]`
- **Command:** `php yii notification/send [--webStoreNavCode=...]`
- **Command:** `php yii notification/clear-expired`
- **File:** `console/controllers/NotificationController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Generates special offer, basket reminder, and order feedback notifications; sends queued notifications; clears expired ones (3 days for wishlist, 2 days for product ending)

### Back-in-Stock Notifications
- **Command:** `php yii back-in-stock-notification/send-emails`
- **Command:** `php yii back-in-stock-notification/cleanup-old-emails`
- **File:** `console/controllers/BackInStockNotificationController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Sends back-in-stock emails; deletes notifications older than 14 days

## Cleanup & Maintenance Tasks

### General Cleanup
- **Command:** `php yii cleanup/<action>`
- **File:** `console/controllers/CleanupController.php`
- **Purpose:** See `./CLEANUP_JOBS.md` for full details

| Action | Threshold | Description |
|--------|-----------|-------------|
| `failed-orders` | 8 hours | Marks processing orders as failed |
| `failed-logins` | 30 days | Removes old failed login attempts |
| `obsolete-products` | 60 days | Deletes obsolete products |
| `failed-async-processes` | 8 hours | Clears stale async flags |
| `client-basket-sanitize` | 24 hours | Removes empty baskets |
| `playback-breakpoints` | — | Cleans orphaned audiobook playback data |
| `flush-cache` | — | Flushes entire cache |

### Queue Maintenance
- **Command:** `php yii queue-failed-jobs/run-all`
- **Command:** `php yii queue-failed-jobs/flush`
- **File:** `console/controllers/QueueFailedJobsController.php`
- **Purpose:** Re-queue or flush failed background jobs

## Statistics & Analytics Tasks

### Banner CTR Statistics
- **Command:** `php yii ctr/sync-stat`
- **Command:** `php yii ctr/clear-old-stat-data`
- **File:** `console/controllers/CtrController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Updates click-through rate statistics for banners; clears data older than 1 month

### Product Badge Computation
- **Command:** `php yii product-badge/compute-product-badges`
- **File:** `console/controllers/ProductBadgeController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Recomputes product badges (bestseller, new, etc.)

## Subscription Tasks

### Subscription Billing
- **Command:** `php yii subscription/bill`
- **Command:** `php yii subscription/update-statistics`
- **File:** `console/controllers/SubscriptionController.php`
- **Filter:** None
- **Purpose:** Bills upcoming payment subscriptions via EveryPay; updates subscription statistics for audio/ebook stores

## Content Generation Tasks

### Sitemap Generation
- **Command:** `php yii sitemap/index [--webStoreNavCode=...]` (cron also `scp`s the output to the FE web servers that serve it)
- **Schedule:** `11 7 * * 0` (weekly, Sunday 07:11; was `11 7 * * 4,0` twice-weekly until 2026-06)
- **File:** `console/controllers/SitemapController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Generates XML sitemaps for products, categories, authors, publishers, series, content pages. 8000 items per file.
- **Monitoring:** Daily health report "Sitemap — generation freshness" section (per-entity counts, partial-failure + staleness detection, section errors). See `../reference/SITEMAP.md`.

### Feed Export
- **Command:** `php yii feed-exporter/generate-csv`
- **Command:** `php yii feed-exporter/generate-facebook-csv`
- **Command:** `php yii feed-exporter/generate-google-csv`
- **Command:** `php yii feed-exporter/generate-google-watch-csv`
- **Command:** `php yii feed-exporter/generate-products-csv`
- **File:** `console/controllers/FeedExporterController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Generates product feeds for external systems (resellers, Facebook Catalog, Google Shopping)

## External Integration Syncs

All integration syncs are invoked via `php yii sync/<handlerName>` (dynamic actions from `SyncHandlerFactory`) or via dedicated controllers:

| Controller | Command Prefix | Integration |
|-----------|---------------|-------------|
| `AnvolController` | `php yii anvol/` | Anvol product import |
| `GardnersController` | `php yii gardners/` | Gardners ONIX feed |
| `InsplayController` | `php yii insplay/` | Insplay API import |
| `BuroomaailmController` | `php yii buroomaailm/` | Buroomaailm FTP import |
| `EdrkController` | `php yii edrk/` | EDRK SOAP import |
| `RaamatukoiController` | `php yii raamatukoi/` | Raamatukoi XML import |
| `LasgoController` | `php yii lasgo/` | Lasgo product import |
| `CustobarController` | `php yii custobar/` | Custobar marketing sync |
| `KlaviyoController` | `php yii klaviyo/` | Klaviyo feed generation |

## Parallel Execution Scripts

**Directory:** `console/scripts/`

Bash scripts that run sync operations with parallel workers:

| Script | Command | Workers | Items/Worker |
|--------|---------|---------|--------------|
| `aws-product-image-sync.sh` | `sync/awsProductImageSync` | 10 | 30,000 |
| `aws-epub-sync.sh` | `sync/awsEPubFileSync` | 10 | 27,000 |
| `aws-drm-epub-sync.sh` | `sync/awsDrmEPubFileSync` | 10 | 20,000 |

## NAV Sync Handlers (via SyncController)

The `console/controllers/SyncController.php` dynamically exposes actions for every handler in `SyncHandlerFactory`. Key NAV sync handlers include:

- `productSync`, `orderSync`, `availabilitySync`, `productPriceSync`
- `clientSync`, `businessClientSync`, `categorySync`, `vendorSync`
- `campaignSync`, `eanSync`, `giftCardSync`
- `authorSync`, `salesTopSync`, `salesStatSync`, `salesHistorySync`
- `wholesalePriceSync`, `countrySync`, `imageRepoSync`

Run `php yii help sync` to see the full list of available handlers.


---

### From `docs/infrastructure/IN-006-MONITORING-ALERTING.md`

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


---

### From `docs/infrastructure/IN-006-MONITORING-ALERTING-STAGING.md`

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

