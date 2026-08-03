---
id: ELASTICSEARCH_SPOOL
title: Elasticsearch Spool System
sidebar_label: Elasticsearch Spool
---
# Elasticsearch Spool System

This document describes the background search indexing system that keeps Elasticsearch in sync with the MySQL database.

## Overview

Products and related entities are indexed into Elasticsearch for search and filtering. Changes are tracked automatically via model behaviors and queued into a spool table (`rr_spool_item`). A console command processes the queue in batches, pushing updates to Elasticsearch via the bulk API.

## Architecture

```
Model change (insert/update/delete)
  → ElasticSpoolBehavior creates SpoolItem in rr_spool_item
  → php yii elastic/spool reads queued items
  → SpoolManager batches items (2000 per batch)
  → NDJSON bulk request to Elasticsearch
  → Processed items removed from spool table
```

## Key Components

### Console Commands

**File:** `console/controllers/ElasticController.php`

| Command | Description |
|---------|-------------|
| `php yii elastic/spool` | Process queued spool items (incremental update). Memory limit: 2GB |
| `php yii elastic/import` | Full reindex — resets mappings and re-queues all records |
| `php yii elastic/import-upgrade` | Full import for Elasticsearch cluster upgrade |
| `php yii elastic/import-products` | Selective product reindex |
| `php yii elastic/import-product-persons` | Selective author/person reindex |
| `php yii elastic/import-publishers` | Selective publisher reindex |
| `php yii elastic/import-series` | Selective series reindex |
| `php yii elastic/import-categories` | Selective category reindex |

### Spool Manager

**File:** `common/elastica/spooler/SpoolManager.php`

Central orchestrator for indexing operations:
- `reindex()` — Resets index mappings and queues all records for full reindex
- `spool()` — Processes queued items via data providers, builds NDJSON bulk bodies
- Default batch size: **2000 items**
- Iterates through registered data providers, processes saves and deletes separately

### Spooler (Database Operations)

**File:** `common/elastica/spooler/Spooler.php`

Manages the `rr_spool_item` database table:
- `saveItem()` — Adds a single item to the spool queue
- `reindexData()` — Bulk inserts all records with action_code `INDEX`
- `setProcessingRows()` — Marks a batch as processing (`is_processing=1`) with row locking
- `deleteProcessingRows()` — Removes successfully processed items
- `removeProcessingRows()` — Resets `is_processing` flag (for error recovery)

Uses `DeadlockQueryRetry` for safe batch updates (5 retries, 1s sleep between).

### Automatic Change Tracking

**File:** `common/behaviours/ElasticSpoolBehavior.php`

Attached to ActiveRecord models (e.g., Product). Listens to:
- `afterInsert` — Queues with action `SAVE`
- `afterUpdate` — Queues with action `SAVE` or `DELETE` depending on active status
- `afterDelete` — Queues with action `DELETE`

### Spool Item Model

**File:** `common/models/SpoolItem.php`

Table: `rr_spool_item`

| Column | Description |
|--------|-------------|
| `id` | Primary key |
| `model_class` | Fully qualified class name of the entity |
| `record_id` | ID of the record to index |
| `action_code` | SAVE, DELETE, or INDEX |
| `is_processing` | Lock flag for batch processing |
| `created_at` | Timestamp |

Action codes defined in `common/enums/SpoolItemActionCodeEnum.php`.

### Data Providers

**Directory:** `common/elastica/spooler/providers/`

Each provider maps an entity to an Elasticsearch index with field mappings:

| Provider | Index Name | Description |
|----------|-----------|-------------|
| `ProductDataProvider` | `live_product` | Products with 100+ fields (name, prices, categories, badges, authors, images, availability) |
| `CategoryDataProvider` | category index | Categories with translations |
| `ProductPersonDataProvider` | person index | Authors and contributors |
| `ProductSeriesDataProvider` | series index | Book series |
| `ProductPublisherDataProvider` | publisher index | Publishers |
| `ProductListDataProvider` | product list index | Product lists |
| `CampaignListDataProvider` | campaign index | Campaign lists |

All extend `AbstractDataProvider` (`common/elastica/spooler/AbstractDataProvider.php`).

## Configuration

**File:** `common/config/elastica/config.php`

- Spooler connection settings (optional custom host/port for spool operations)
- Spool table name: `rr_spool_item`
- Index definitions for: category, special_list, product
- Custom analyzers: `rahvaraamat`, `rahvaraamat_no_space`, `rahvaraamat_asciiFold`, `lowerCaseKeyword`
- Character filters for symbol removal and whitespace handling

### Elasticsearch Connection

**File:** `common/elastica/components/Connection.php`

Extends `yii\elasticsearch\Connection` with:
- Configurable spooler table name
- Cache support for queries
- DSL version: 7

## Failure Handling

### Deadlock Retry

**File:** `common/helpers/DeadlockQueryRetry.php`

When batch-updating spool items, MySQL deadlocks (error codes 1205, 1213) are retried:
- Default: 5 attempts
- 1-second sleep between retries
- Wrapped in transaction management

### Spool Error Recovery

If spool processing fails mid-batch:
- Items marked `is_processing=1` but not deleted remain in the table
- Next spool run picks them up again (via `removeProcessingRows()` reset)
- `ElasticController` registers a shutdown function and error handler for graceful cleanup

## Database Migrations

Key migrations for the spool system:
- `m200722_142220_update_rr_spool_item_table` — Added created_at default
- `m200723_181653_add_index_to_spool_item_table` — Performance indexes
- `m210407_122639_add_new_spool_procedures` — Stored procedures for spool operations
- `m210923_110407_add_spool_item_idx` — Additional indexes
- `m220922_102915_add_product_spooler_commit_idx` — Product spooler commit index
- `m250509_104346_fix_product_spooler_procedure` — Procedure fixes

## Typical Operations

**Incremental update (run frequently via cron):**
```bash
php yii elastic/spool
```

**Full reindex (after mapping changes or data corruption):**
```bash
php yii elastic/import
```

**Selective reindex (e.g., after bulk product update):**
```bash
php yii elastic/import-products
```

## Related documentation

- [Search Functionality](./SEARCH_FUNCTIONALITY.md) — storefront search, autocomplete, ranking, filters
- [Elasticsearch Reliability Plan](./ELASTICSEARCH_RELIABILITY_PLAN.md) — 503 contract and downtime QA
- Gap: [CP-001 Elasticsearch Spool](/gaps/critical-production/CP-001-elasticsearch-spool)

