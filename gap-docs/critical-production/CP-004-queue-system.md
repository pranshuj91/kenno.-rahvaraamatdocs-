---
id: CP-004-queue-system
title: CP-004 — Queue System
sidebar_label: CP-004 Queue System
---

# CP-004 — Queue System

| Field | Value |
|---|---|
| Priority | Critical |
| Category | Production |
| Gap item | Queue System |
| Description | Background job processing with priorities — queue configuration, workers, retry logic |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Source files used

- `docs/core/QUEUE_SYSTEM.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/core/QUEUE_SYSTEM.md`

# Queue System

This document describes the background job processing system.

## Overview

The application uses Yii2's database-backed queue (`yii\queue\db\Queue`) for asynchronous job processing. Jobs are stored in a MySQL table and processed by a worker command.

## Configuration

**File:** `common/config/main.php` (lines 77-88)

```
Component: yii\queue\db\Queue
Table:     {{%queue}}
Channel:   default
TTR:       3600 seconds (1 hour)
Mutex:     MysqlMutex (60-second timeout)
```

The queue and `queueFailedJobs` components are both bootstrapped on application startup.

## Running the Queue Worker

```bash
php yii queue/listen    # Start listening for jobs (daemon mode)
php yii queue/run       # Process pending jobs and exit
```

## Failed Job Handling

**File:** `common/components/queue/QueueFailedJobs.php`

A bootstrap component that hooks into `Queue::EVENT_AFTER_ERROR`:
- Stores failed jobs in the `queue_failed_job` table (only if the job won't be retried)
- Methods: `add()`, `getAll()`, `get()`, `remove()`, `flush()`

### Managing Failed Jobs

**File:** `console/controllers/QueueFailedJobsController.php`

| Command | Description |
|---------|-------------|
| `php yii queue-failed-jobs/index` | List all failed jobs |
| `php yii queue-failed-jobs/view <id>` | View details of a specific failed job |
| `php yii queue-failed-jobs/run-all` | Re-queue all failed jobs for retry |
| `php yii queue-failed-jobs/flush` | Delete all failed jobs |

## Job Classes

30+ job implementations across the codebase:

### Tracking & Analytics Jobs
- `common/models/jobs/FacebookConversionsTrackEventJob.php` — Facebook Conversions API tracking
- `common/models/jobs/custobar/CustobarTrackEventJob.php` — Custobar marketing event tracking

### Product Jobs
- `common/jobs/ProductEnrichmentJob.php` — Product data enrichment
- `common/synchronizations/external/gardners/jobs/UpdateGardnersProductImageFromNielsenJob.php` — Gardners image update from Nielsen
- `common/synchronizations/external/gardners/jobs/UpdateGardnersBasedProductImageFromNavOrNielsenJob.php` — Gardners/NAV image update

### Redirect Jobs
- `common/redirects/jobs/SynchroniseCategoriesSlugsJob.php` — Sync category URL slugs
- `common/redirects/jobs/RegenerateRedirectsBloomFilterJob.php` — Rebuild redirect bloom filter
- `common/redirects/jobs/AddRedirectsToBloomFilterJob.php` — Add/update redirects in bloom filter

### Payment Jobs
- `common/models/jobs/EveryPayCallbackHandlerJob.php` — Async EveryPay payment callback processing

## How Jobs Are Pushed

Jobs are pushed to the queue from application code:

```php
Yii::$app->queue->push(new SomeJob([
    'param1' => $value1,
    'param2' => $value2,
]));
```

Jobs implement `yii\queue\JobInterface` and define an `execute($queue)` method.

## Monitoring

- Check queue table size: `SELECT COUNT(*) FROM queue WHERE channel='default'`
- Check failed jobs: `php yii queue-failed-jobs/index`
- The `AlreadyRunningFilter` on the queue listener prevents multiple workers from competing


