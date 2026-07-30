---
id: OP-009-statistics
title: OP-009 — Statistics & Analytics
sidebar_label: OP-009 Statistics
---

# OP-009 — Statistics & Analytics

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Statistics & Analytics |
| Description | CTR tracking, campaign analytics — tracking implementation, data flow |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Source files used

- `docs/monitoring/STATISTICS.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/monitoring/STATISTICS.md`

# Statistics & Analytics

This document describes the CTR tracking, campaign analytics, and product statistics systems.

## CTR (Click-Through Rate) Tracking

### Overview

The system tracks views and clicks on banners (including small banners) to calculate click-through rates. Statistics are periodically synced and old data is cleaned up.

### Components

**CtrService** (`common/synchronizations/ctr/CtrService.php`)
- Core CTR calculation logic
- Tracks views and clicks
- Calculates CTR ratio (clicks / views)

**ICtrStat Interface** (`common/models/interfaces/ICtrStat.php`)
- Interface implemented by models that support CTR tracking (Banner, SmallBanner)

### API Endpoint

**File:** `api/controllers/CtrController.php`
- REST endpoint for recording CTR events (views, clicks) from the frontend

### Console Commands

**File:** `console/controllers/CtrController.php`

| Command | Description |
|---------|-------------|
| `php yii ctr/sync-stat` | Syncs banner and small banner CTR statistics from raw events |
| `php yii ctr/clear-old-stat-data` | Clears banner stat data older than 1 month |

Both actions use `AlreadyRunningFilter`.

### Data Flow

```
User views/clicks banner → API CtrController records event
  → php yii ctr/sync-stat aggregates into statistics
  → php yii ctr/clear-old-stat-data removes data older than 1 month
```

## Product Statistics

**File:** `console/controllers/ProductStatisticsController.php`

> Note: Marked as **DEPRECATED** in console commands documentation.

Product-level statistics tracking (views, sales counts, etc.).

## General Statistics

**File:** `console/controllers/StatisticController.php`

> Note: Marked as **DEPRECATED** in console commands documentation.

General statistical aggregation commands.

## Subscription Statistics

**Directory:** `common/subscription/statistics/`

Subscription analytics calculators (not deprecated):
- Revenue metrics
- Retention rates
- Trial conversion counts
- Active subscription counts

Updated via: `php yii subscription/update-statistics`


