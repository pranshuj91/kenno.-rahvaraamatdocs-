---
id: IB-003-integration-reconciliation
title: IB-003 — Integration Reconciliation & Scheduling
sidebar_label: IB-003 Integration Reconciliation
---

# IB-003 — Integration Reconciliation & Scheduling

| Field | Value |
|---|---|
| Priority | Important |
| Category | Business |
| Gap item | Integration Reconciliation & Scheduling |
| Description | Automated sync scheduling, blackout windows — sync timing, conflict resolution |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Source files used

- `docs/integrations/INTEGRATION_RECONCILIATION.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under ``docs/``. Nothing invented.


---

### From `docs/integrations/INTEGRATION_RECONCILIATION.md`

# Integration Reconciliation & Scheduling

This document describes how external product integrations are scheduled, gated by blackout windows, reconciled after toggle/edit, and how their health is calculated.

## Overview

Each external product integration (Gardners, Anvol, Insplay, Buroomaailm, …) is represented in the database by an `Integration` row. Around it are four cooperating components:

| Component | Responsibility |
|---|---|
| `IntegrationManager` | Active/inactive decisions, blackout matching, price-floor enforcement |
| `IntegrationOperationalService` | Status-change & schedule-change side effects, queueing reconciliation, running console sync commands |
| `IntegrationHealthService` | Calculates `ok` / `degraded` / `error` health from recent run logs |
| `IntegrationReconciliationJob` | Queue job that runs the appropriate sync command after an integration is re-enabled |

All four are wired as application components in `common/config/main.php`:

```php
'integrationManager'      => common\components\IntegrationManager::class,
'integrationBlackout'     => common\components\IntegrationBlackoutService::class, // legacy alias
'integrationOperational'  => common\components\IntegrationOperationalService::class,
'integrationHealth'       => common\components\IntegrationHealthService::class,
```

## Data Model

### `integration` table — `common/models/Integration.php`

| Column | Description |
|---|---|
| `code` | Unique integration code, e.g. `IMPORT_GARDNERS` (matches `PRODUCT_SOURCE` classifier) |
| `name` | Human-readable name |
| `is_enabled` | Manual on/off toggle |
| `hide_products_when_off` | If true, products from this source are hidden when manually disabled |
| `price_floor_min_cost` | Minimum supplier cost; cheaper products get hidden |
| `apply_price_floor_to_existing` | When true, the floor is applied to historic products on reconciliation |
| `variables_json` | Free-form integration-specific settings (typed via `getVariables()`) |
| `last_sync_at`, `next_run_at` | Scheduling state |
| `last_error` | Last error message |
| `health_status` | `ok` \| `degraded` \| `error` (set by `IntegrationHealthService`) |

### `integration_schedule` table — `common/models/IntegrationSchedule.php`

| Column | Description |
|---|---|
| `integration_id` | FK |
| `type` | `one_time` / `date_range` / `daily` / `weekly` |
| `starts_at`, `ends_at` | Window bounds (datetime; for `daily`/`weekly` only the time-of-day matters) |
| `days_of_week` | Comma-separated `1..7` (Mon..Sun) for `weekly` |
| `meta_json` | Reserved |

> **Schedules describe blackouts, not run windows.** When `now` is inside any matching schedule entry, the integration is treated as inactive — its products are hidden and reconciliation jobs queued for it will skip.

### `integration_run_log` table — `common/models/IntegrationRunLog.php`

| Column | Description |
|---|---|
| `integration_id` | FK |
| `started_at`, `finished_at` | Estonia timezone |
| `status` | `success` / `failed` / `aborted` |
| `error_message` | Populated for failed/aborted |
| `products_added`, `products_updated`, `products_failed` | Counters per run |
| `execution_time_seconds` | Per-run wall time |

Helper factories: `logSuccess()`, `logFailure()`, `logAborted()`.

## Active / Blackout Logic

**File:** `common/components/IntegrationManager.php`

`isActiveByCode($code)` returns true iff:
1. The integration row exists *and* `is_enabled = 1`
2. `now` (in `Europe/Tallinn`) is **not** inside any of the integration's schedule entries

`getInactiveIntegrationSourceTypeIds()` returns the `PRODUCT_SOURCE` classifier IDs of all integrations whose products should currently be hidden:
- Always hidden when in a blackout window
- Hidden when manually disabled *only if* `hide_products_when_off = 1`

The result is cached per request and consumed by product list/filter queries.

### Schedule matching (`matchesSchedule`)

| `type` | Match rule |
|---|---|
| `one_time` / `date_range` | `now` is between `starts_at` and `ends_at` (absolute datetimes) |
| `daily` | `now` is between today's `H:i` of `starts_at` and `ends_at` |
| `weekly` | Today's ISO weekday is in `days_of_week` AND time-of-day matches |

All comparisons use `Europe/Tallinn`.

## Price Floors

`IntegrationManager` also enforces a minimum supplier cost per integration:

- `isBelowPriceFloor($code, $supplierCost)` — single-product gate used during import
- `getPriceFloor($code)` — returns the configured minimum, or `null`
- `applyPriceFloorToExistingProducts($code)` — bulk pass:
  - Hides products with `price_vendor_base &lt; floor` by setting `is_public_web_disabled = 1`
  - Unhides products that were previously disabled but whose `price_vendor_base &gt;= floor`
  - Returns `['hidden' => N, 'checked' => N, 'unhidden' => N]`

The bulk pass only runs if `apply_price_floor_to_existing = 1`. It is invoked automatically by `IntegrationOperationalService::applyPostSyncRules()` after a successful sync.

## Status- and Schedule-Change Side Effects

**File:** `common/components/IntegrationOperationalService.php`

### `handleStatusChange(Integration, bool $wasEnabled)`
Called when an admin flips `is_enabled`:
- **Enabled → Disabled:** `stopScheduledJobs()` — sets `next_run_at = NULL` and writes state keys `integration:<code>:jobs_active = false`, `…:jobs_stopped_at = time()`
- **Disabled → Enabled:** `queueReconciliation()` — pushes an `IntegrationReconciliationJob` onto the queue at `QueuePriorityEnum::INTEGRATION_RECONCILIATION_PRIORITY`

### `handleScheduleChange(Integration)`
Called after an admin edits the integration's blackout schedules:
- If the integration is now inactive (manual or in blackout), `stopScheduledJobs()` is invoked.
- (Re-enabling at the schedule level does **not** auto-queue a reconciliation; only the `is_enabled` flip does.)

### `runSyncCommand(Integration, $background = true)`
Looks up the console command for the integration code in `consoleCommandMap` and shells out:

```php
public array $consoleCommandMap = [
    'IMPORT_BUROOMAAILM' => 'buroomaailm/import-products',
    'IMPORT_GARDNERS'    => 'gardners/import-products',
    'IMPORT_LASGO'       => null,                // not yet wired
    'IMPORT_ANVOL'       => 'anvol/import-products',
    'IMPORT_INSPLAY'     => 'insplay/import-products',
];
```

Builds the command as:
```bash
cd <@console> && php <@console>/yii <action>
```
…and (when `$background = true`) appends `> /dev/null 2>&1 &`. Non-zero exit codes are logged via `Yii::error`.

> Mapping `null` (`IMPORT_LASGO`) is a noop — reconciliation will warn and return false.

### `applyPostSyncRules(Integration)`
Currently only one rule: re-apply the price floor to existing products if configured.

## Reconciliation Job

**File:** `common/jobs/IntegrationReconciliationJob.php`

```php
public function execute($queue): void
{
    $integration = Integration::findOne($this->integrationId);
    if (!$integration || (int)$integration->is_enabled !== 1) {
        return;            // disabled mid-flight → skip
    }
    Yii::$app->integrationOperational->runSyncCommand($integration, false);
    Yii::$app->integrationOperational->applyPostSyncRules($integration);
    Yii::$app->system->set("integration:{$integration->code}:last_reconciled_at", time());
}
```

Runs synchronously inside the queue worker (`runSyncCommand($integration, false)` waits for the import to finish), so make sure the queue worker has enough TTR — see `QUEUE_SYSTEM.md` (`ttr` is 1h by default in `common/config/main.php`).

## Health Calculation

**File:** `common/components/IntegrationHealthService.php`

| Setting | Default |
|---|---|
| `lookbackRuns` | last **10** runs |
| `degradedThreshold` | 0.50 |
| `errorThreshold` | 0.50 |

`calculateHealth()` rules over the most recent `lookbackRuns` rows in `integration_run_log`:
- All runs `aborted`: → `ok` (intentionally disabled)
- Otherwise compute `successRate = success / (total − aborted)`:
  - `1.0` → `ok`
  - `&gt;= 0.50` → `degraded`
  - `< 0.50` → `error`

`updateHealth(Integration)` writes the result to `integration.health_status`. `updateAllHealth()` iterates every integration. `getHealthStats(Integration)` returns counts and last-success/last-failure timestamps for the admin panel.

## State Keys

The service stamps the system state component with operational markers (consumed by the admin panel for "last action" displays):

| Key | Set when |
|---|---|
| `integration:<code>:jobs_active` | After `stopScheduledJobs` (= false) |
| `integration:<code>:jobs_stopped_at` | After `stopScheduledJobs` (= unix ts) |
| `integration:<code>:reconcile_job_queued_at` | After `queueReconciliation` |
| `integration:<code>:last_reconciled_at` | After the reconciliation job finishes |

## Admin Panel

The admin module that exposes integration toggles, schedule editing, and price-floor configuration lives under `admin/modules/setting/`. Toggling `is_enabled` from there is the entry point that triggers `handleStatusChange()`. See `ADMIN_MODULE.md` for the broader admin layout.

## Operational Cheat-Sheet

| Question | Where to look |
|---|---|
| Is integration X currently active right now? | `Yii::$app->integrationManager->isActiveByCode($code)` |
| Why are products from X hidden? | `getInactiveIntegrationSourceTypeIds()` returns the IDs; cross-check `is_enabled`, `hide_products_when_off`, and matching schedule rows |
| Did the last sync succeed? | `integration_run_log` (latest by `started_at`) and `integration.health_status` |
| Why did reconciliation not run? | `consoleCommandMap[$code]` is `null`, OR `is_enabled = 0`, OR queue worker is stopped |
| Why didn't price floor get applied? | `apply_price_floor_to_existing` flag, or `price_floor_min_cost` is null |

