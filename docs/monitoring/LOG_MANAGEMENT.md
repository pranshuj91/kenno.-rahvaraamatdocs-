---
id: LOG_MANAGEMENT
title: Log Management
sidebar_label: Log Management
---
# Log Management

This document describes how application logs are written, rotated, archived, and cleaned up.

## Overview

Rahva Raamat does **not** use Yii's default file logger. All application log messages (`error`, `warning`, `info`) are written to the database via a custom log target, with monthly table rollover and a dedicated archive command that flushes old data to flat files on disk.

## Log Target Configuration

**File:** `common/config/main.php` (component `log`)

```php
'log' => [
    'targets' => [
        [
            'class' => 'common\components\CustomLogDbTarget',
            'levels' => ['error', 'warning', 'info'],
            'except' => [
                'yii\db\*',
                'yii\filters\*',
                'yii\web\HttpException:404',
                'yii\web\Session::open',
                'yii\i18n\*',
                'yii\web\User*',
                'yii\debug\Module::checkAccess',
                'yii\httpclient\*',
            ],
        ],
    ],
],
```

The `except` list filters out high-volume noise (DB queries, framework session/auth chatter, 404s, i18n, HTTP client). Profile/debug levels are not captured at all.

## Custom DB Log Target

**File:** `common/components/CustomLogDbTarget.php`

Extends `yii\log\DbTarget`. Behavior:

1. For each log message, computes the **monthly table name** `rr_log_YYYY_MM` from the message timestamp.
2. If that table does not yet exist, creates it via `CREATE TABLE rr_log_YYYY_MM LIKE rr_log` and inserts a registry row in `rr_log_table_registry` (`table_name`, `year_month`, `created_at`).
3. Inserts the row with columns: `level`, `category`, `log_time`, `prefix`, `message`, `user_id`.
4. The `prefix` includes the requester IP (`[1.2.3.4]`).
5. The `level` is mapped from Yii's bitmask to a human string (`error`, `warning`, `info`, `debug`, `profile`, …).

This means each calendar month has its own physical table, automatically created on first write of that month. The base `rr_log` table is treated as a template.

> **Active transaction safety:** if a DB transaction is currently open on `db`, the target clones the connection before exporting, so log writes never get rolled back along with business transactions.

## Tables

| Table | Purpose |
|---|---|
| `rr_log` | Template / current-month catch-all (used by `LIKE` to create monthly tables) |
| `rr_log_YYYY_MM` | Per-month log rows (e.g. `rr_log_2026_04`) |
| `rr_log_table_registry` | Index of monthly tables — `table_name`, `year_month`, `created_at` |

The registry is consumed by the archive command to find tables that need flushing.

## Archive Command

**File:** `console/controllers/ArchiveController.php`

```bash
php yii archive/logs [--optimize=1]
```

Two-stage process.

### Stage 1 — main `rr_log` table

- Selects rows older than `MAX_LOG_AGE_INTERVAL` = **20 days** (`1_728_000` seconds).
- Streams them in batches of `LOG_FILE_ROW_COUNT` = **1000** rows.
- Writes batches to `console/runtime/archive/<from>-<to>/log.txt` (datetime format `Y.m.d_H.i.s`).
- Splits a file when it exceeds `LOG_MAX_FILE_SIZE` = **100 MB**.
- Deletes archived rows from `rr_log` inside a transaction per batch.
- After each batch, runs `OPTIMIZE TABLE rr_log` (skippable with `--optimize=0`).

### Stage 2 — monthly tables

- Iterates `IntegrationRunLog::find()` … wait — actually iterates `LogTableRegistry::find()->orderBy(['year_month' => SORT_ASC])`.
- For each registered monthly table:
  - If empty: drop the table and delete the registry row.
  - Otherwise: load all rows, dump them in 1000-row chunks to `console/runtime/archive/<from>-<to>/log.txt`, then `DROP TABLE` and delete the registry row.

So **all** monthly log tables are unconditionally archived to disk and dropped on each run — only the current calendar month's table will be re-created on the next write.

## Output Format

Archive files are UTF-8 with BOM. Each entry is rendered as:

```
2026-04-01 12:34:56
------------
id => 12345
level => error
category => api/foo
log_time => 2026-04-01 12:34:56
prefix => [1.2.3.4]
message => …full message text…
user_id => 42
------------
```

## Scheduling

The `archive/logs` command is wired into the system cron schedule — see [Cron Jobs](./CRON_JOBS.md) for the exact crontab line. It uses no `AlreadyRunningFilter`; rely on cron not to overlap.

## Operational Notes

- Disk pressure on `console/runtime/archive/` grows linearly with traffic. There is **no automatic cleanup** of the produced flat files — they need to be rotated/shipped off the box by an external process (logrotate, S3 sync, etc.).
- Archive files contain user IDs and request IPs; treat them as PII when shipping.
- `OPTIMIZE TABLE rr_log` rebuilds the table and reclaims space; on a busy production DB this can be slow — disable with `--optimize=0` if it conflicts with peak load.
- The custom log target writes one INSERT per message — high error storms can amplify DB load. The `except` list keeps normal traffic out.
- 404s are intentionally not logged. If you need to investigate missing pages, check the web server access log instead.
- Web/access logs and PHP error logs are handled at the Apache/Supervisor layer (outside the codebase) — see `docker/` for container-level configuration.

## Related Models

- `common/models/Log.php` — ActiveRecord on `rr_log` (used by Stage 1)
- `common/models/LogTableRegistry.php` — ActiveRecord on `rr_log_table_registry`



