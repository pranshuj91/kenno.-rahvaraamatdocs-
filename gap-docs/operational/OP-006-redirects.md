---
id: OP-006-redirects
title: OP-006 — External URL & Redirect Management
sidebar_label: OP-006 Redirects
---

# OP-006 — External URL & Redirect Management

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | External URL & Redirect Management |
| Description | Bloom filter redirects, version migration — redirect rules, 301/302 handling |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/reference/REDIRECTS.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/reference/REDIRECTS.md`

# External URL & Redirect Management

This document describes the URL redirect system including bloom filter-based lookups, versioned URL structures, and redirect management.

## Overview

The system manages URL redirects for SEO and URL structure version migrations. It uses a bloom filter for fast redirect lookups, with Redis and database-backed storage for the actual redirect data.

## Architecture

```
Incoming request URL
  → BloomFilterRedirectRepository (fast probabilistic check)
    → If maybe exists: RedisRedirectRepository (exact lookup)
      → If found: serve 301/302 redirect
      → If not in Redis: PersistentRedirectRepository (DB fallback)
  → LogRedirectRepository (log the redirect)
```

## Key Components

### ExternalUrlManager

**File:** `common/redirects/ExternalUrlManager.php`

Main orchestrator for the redirect system:
- Manages URL structure versions (v1, v2) per web store
- Configures the redirect repository chain
- Requires Redis connection for redirect lookups

Version mapping:
- `VERSION_1` → `common/redirects/v1/DynamicUrlStructure.php`
- `VERSION_2` → `common/redirects/v2/DynamicUrlStructure.php`

### Bloom Filter

**Directory:** `common/redirects/bloomFilters/`

| File | Description |
|------|-------------|
| `BloomFilterRepository.php` | Main bloom filter storage |
| `CacheBloomFilterRepository.php` | Cached bloom filter variant |

Bloom filter provides O(1) probabilistic membership checks — if a URL is "not in" the filter, it definitely has no redirect. False positives are checked against the actual redirect store.

### Redirect Repositories

**Directory:** `common/redirects/repositories/`

| Repository | Storage | Description |
|-----------|---------|-------------|
| `BloomFilterRedirectRepository` | Memory | Fast probabilistic check |
| `RedisRedirectRepository` | Redis | Primary exact lookup |
| `PersistentRedirectRepository` | Database | Fallback storage |
| `LogRedirectRepository` | Database | Logs redirect activity |
| `ImmutableRedirectRepository` | — | Immutable redirect data |
| `WebStoreUrlStructureVersionFilterRepository` | — | Filters by URL version per web store |

### URL Builders

**v1:** `common/redirects/v1/builders/`
- ProductUrlBuilder, CategoryUrlBuilder, SeriesUrlBuilder, PublisherUrlBuilder, ContentPageUrlBuilder, EventUrlBuilder

**v2:** `common/redirects/v2/`
- Updated URL structure with new patterns

### Background Jobs

**Directory:** `common/redirects/jobs/`

| Job | Description |
|-----|-------------|
| `RegenerateRedirectsBloomFilterJob` | Rebuilds the entire bloom filter from scratch |
| `AddRedirectsToBloomFilterJob` | Adds/updates specific redirects in the bloom filter |
| `SynchroniseCategoriesSlugsJob` | Syncs category URL slugs when categories change |

These run via the queue system (`php yii queue/listen`).

## Admin Interface

**Module:** `admin/modules/redirect/`

| Controller | Description |
|-----------|-------------|
| `ExternalUrlRedirectController` | Manage automatic URL redirects |
| `ManualExternalUrlRedirectController` | Manage manually created redirects |
| `LogRedirectController` | View redirect activity logs |

## Console Commands

**File:** `console/controllers/ExternalUrlController.php`

| Command | Description |
|---------|-------------|
| `php yii external-url/test` | Test redirect resolution |
| `php yii external-url/truncate-repository [--withLogs=0\|1]` | Clear redirect store |
| `php yii external-url/monitor-repository` | Monitor repository state |
| `php yii external-url/monitor-bloom-filter` | Monitor bloom filter state |
| `php yii external-url/monitor-redirects <webStore> <from> <to> [--limit=N]` | Monitor redirects between versions |
| `php yii external-url/synchronize-categories-slugs` | Sync category slugs |
| `php yii external-url/migrate-between-versions <webStore> <from> <to> [--limit=N]` | Migrate all URLs between versions |
| `php yii external-url/migrate-products-between-versions <webStore> <from> <to>` | Migrate product URLs |
| `php yii external-url/migrate-categories-between-versions <webStore> <from> <to>` | Migrate category URLs |
| `php yii external-url/migrate-product-series-between-versions <webStore> <from> <to> [--limit=N]` | Migrate series URLs |

## URL Structure Versions

The system supports versioned URL structures per web store (configured in `ExternalUrlManager::$webStoreVersions`). When a web store migrates from v1 to v2 URLs:

1. Old v1 URLs need to redirect to new v2 URLs
2. Migration commands generate redirect entries for all affected entity types
3. Bloom filter is regenerated to include new redirects
4. Redis cache is populated for fast lookups


