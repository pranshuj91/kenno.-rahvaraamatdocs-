---
id: OP-003-cleanup-jobs
title: OP-003 — Cleanup & Maintenance Jobs
sidebar_label: OP-003 Cleanup Jobs
---

# OP-003 — Cleanup & Maintenance Jobs

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Cleanup & Maintenance Jobs |
| Description | Failed orders, obsolete products, queue cleanup — job schedules, retention policies |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/monitoring/CLEANUP_JOBS.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/monitoring/CLEANUP_JOBS.md`

# Cleanup & Maintenance Jobs

This document describes the automated cleanup jobs that maintain data hygiene and prevent stale records from accumulating.

## Main Cleanup Controller

**File:** `console/controllers/CleanupController.php`

### Failed Orders

**Command:** `php yii cleanup/failed-orders [--noPrompt=0|1] [--interval="..."]`

- **Threshold:** 8 hours (`FAILED_ORDER_INTERVAL = 28800`)
- **Purpose:** Marks orders stuck in "processing" state as failed
- Uses `FailedOrderHandler` (`common/orders/FailedOrderHandler.php`)

### Failed Logins

**Command:** `php yii cleanup/failed-logins [--noPrompt=0|1] [--interval="..."]`

- **Threshold:** 30 days (`FAILED_LOGIN_INTERVAL = 2,592,000`)
- **Purpose:** Removes old `UserFailedLogin` records from the database

### Obsolete Products

**Command:** `php yii cleanup/obsolete-products [--noPrompt=0|1] [--interval="..."]`

- **Threshold:** 60 days (`OBSOLETE_PRODUCT_INTERVAL = 5,184,000`)
- **Purpose:** Deletes products that have been marked obsolete for longer than the threshold

### Failed Async Processes

**Command:** `php yii cleanup/failed-async-processes [--noPrompt=0|1] [--interval="..."]`

- **Threshold:** 8 hours (`FAILED_ASYNC_PROCESSES_INTERVAL = 28800`)
- **Purpose:** Clears stale async process flags in `SystemState` table

### Client Basket Sanitize

**Command:** `php yii cleanup/client-basket-sanitize [--noPrompt=0|1]`

- **Threshold:** 24 hours (`EMPTY_BASKET_INTERVAL = 86400`)
- **Purpose:** Removes empty `ClientBasket` records

### Temp Client Basket Sanitize

**Command:** `php yii cleanup/temp-client-basket-sanitize [--noPrompt=0|1]`

- **Purpose:** Removes empty `ClientTempBasket` records

### Playback Breakpoints

**Command:** `php yii cleanup/playback-breakpoints`

- **Purpose:** Deletes orphaned audiobook playback data — `ClientAccountAudiobook` and `ClientAccountAudiobookChapter` records where the parent `ClientAccountProductShelfItem` no longer exists

### Cache Management

**Command:** `php yii cleanup/clean-cache --key=<key>`
- **Purpose:** Deletes a specific cached value by key

**Command:** `php yii cleanup/flush-cache`
- **Purpose:** Flushes the entire cache

### Queue Cleanup

**Command:** `php yii cleanup/queue`
- **Purpose:** Cleans up the job queue table

### Pre-saved Credit Card Tokens

**Command:** `php yii cleanup/pre-saved-credit-card-tokens`
- **Purpose:** Removes expired `PreSavedCreditCardToken` records

### Outdated Session Actions

**Command:** `php yii cleanup/outdated-session-actions`
- **Purpose:** Removes old `SessionAction` records

## Other Cleanup Commands

### Queue Failed Jobs

**File:** `console/controllers/QueueFailedJobsController.php`

| Command | Description |
|---------|-------------|
| `php yii queue-failed-jobs/index` | List all failed jobs |
| `php yii queue-failed-jobs/view <id>` | View failed job details |
| `php yii queue-failed-jobs/run-all` | Re-queue all failed jobs |
| `php yii queue-failed-jobs/flush` | Delete all failed jobs |

### CTR Statistics Cleanup

**File:** `console/controllers/CtrController.php`

- `php yii ctr/clear-old-stat-data` — Clears banner statistics older than 1 month

### Back-in-Stock Notification Cleanup

**File:** `console/controllers/BackInStockNotificationController.php`

- `php yii back-in-stock-notification/cleanup-old-emails` — Deletes notifications older than 14 days

### Notification Expiry

**File:** `console/controllers/NotificationController.php`

- `php yii notification/clear-expired` — Clears expired notifications (3 days for wishlist, 2 days for product ending)

## Constants Summary

| Constant | Value | Description |
|----------|-------|-------------|
| `FAILED_ORDER_INTERVAL` | 28,800s (8h) | Processing orders declared dead |
| `FAILED_LOGIN_INTERVAL` | 2,592,000s (30d) | Failed login retention |
| `FAILED_ASYNC_PROCESSES_INTERVAL` | 28,800s (8h) | Async flag timeout |
| `OBSOLETE_PRODUCT_INTERVAL` | 5,184,000s (60d) | Obsolete product retention |
| `GUEST_COOKIE_TTL` | 2,592,000s (30d) | Guest cookie lifetime |
| `EMPTY_BASKET_INTERVAL` | 86,400s (24h) | Empty basket retention |

