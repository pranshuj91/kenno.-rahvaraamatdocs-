---
id: ELASTICSEARCH_RELIABILITY_PLAN
title: Elasticsearch Reliability & Downtime Reduction Plan
sidebar_label: Elasticsearch Reliability
---

# Elasticsearch Reliability & Downtime Reduction Plan

**Status:** Priority / Backend + FE staging QA  
**Date:** 2026-07-23 (updated 2026-07-28)

---

## API contract (authoritative)

| Item | Value |
|------|--------|
| Primary signal | **HTTP 503** |
| Header | **`X-Search-Available: 0`** (bonus; CORS-exposed) |
| Body message | `Search is temporarily unavailable. Please try again shortly.` |
| Never | `200` + empty list for ES downtime |

Applies to: `/product/search`, `/autocomplete`, `/product/autocomplete`, product dynamic filters, other ES-backed listing endpoints.

---

## FE CORS note

`X-Search-Available` is in `Access-Control-Expose-Headers` (same as `X-Pagination-*`).

---

## Force degraded mode (staging QA)

1. On staging API host set in `params-local.php`:
   ```php
   'allowForceSearchUnavailable' => true,
   ```
2. Call any search/autocomplete/filter URL with:
   - query: `?forceSearchUnavailable=1`
   - or header: `X-Force-Search-Unavailable: 1`
3. Expect **503** + `X-Search-Available: 0`
4. Retry without the flag → normal 200 when ES is healthy

**Keep `allowForceSearchUnavailable` false in production.**

---

## Backend changes shipped

- ES timeouts + spool lock recovery + health-check cron command  
- API ErrorHandler → 503 + header  
- CORS expose `X-Search-Available`  
- Autocomplete returns same 503 (not empty 200) on ES downtime  
- Staging force-degrade flag for QA  

## Related documentation

- [Search Functionality](./SEARCH_FUNCTIONALITY.md) — customer search behaviour and endpoints
- [Elasticsearch Spool](./ELASTICSEARCH_SPOOL.md) — indexing queue and recovery
- Gap: [OP-004 Search Functionality](/gaps/operational/OP-004-search-functionality)
- Gap: [CP-001 Elasticsearch Spool](/gaps/critical-production/CP-001-elasticsearch-spool)
