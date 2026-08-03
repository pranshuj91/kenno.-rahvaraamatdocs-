---
id: SEARCH_FUNCTIONALITY
title: Search Functionality
sidebar_label: Search Functionality
---

# Search Functionality

This document describes **all searching capabilities** in the ecommerce platform: how search works for customers and staff, what Elasticsearch is used for, what can be searched, how results stay up to date, and which console commands / cron jobs support search.

It focuses on **behaviour and functionality**, not low-level implementation details. For indexing internals, see also [Elasticsearch Spool](./ELASTICSEARCH_SPOOL.md) and [Elasticsearch Reliability Plan](./ELASTICSEARCH_RELIABILITY_PLAN.md).

---

## 1. Overview

Customer-facing catalog search is powered by **Elasticsearch**.

| Role | System |
|------|--------|
| **Source of truth** | MySQL database (products, categories, authors, etc.) |
| **Search engine** | Elasticsearch (fast full-text search, filters, autocomplete, facets) |
| **How they stay in sync** | Change queue (“spool”) + cron command that pushes updates to Elasticsearch |

When a customer types in the search box or browses with filters, the storefront API queries Elasticsearch — not MySQL — for catalog results.

**Admin** product grids and most back-office filters use MySQL. Product edits in admin still flow into Elasticsearch through the spool, so storefront search reflects those changes after the next spool run.

---

## 2. What Can Be Searched

Elasticsearch holds dedicated indexes for these entities:

| What | Used for |
|------|----------|
| **Products** | Main catalog search, product lists, filters, sorting |
| **Categories** | Category listing and autocomplete |
| **Authors / product persons** | Author pages, author search, autocomplete |
| **Publishers** | Publisher browse, autocomplete |
| **Series** | Book series browse, autocomplete |
| **Product lists** | Curated collections |
| **Campaign lists** | Campaign / promotional product groupings |

Product documents also carry related data used during search, for example:

- Title and alternative names / tags  
- ISBN / EAN and related identifiers  
- Categories, authors, publisher, series  
- Prices, discounts, availability, stock, delivery time  
- Product type (book, ebook, audiobook, tech, game, …)  
- Language, binding/cover type  
- Sales / popularity signals  
- Badges, images, web-store visibility flags  

**Not searched via Elasticsearch (examples):** admin CRUD grids, blogs, events, orders, and partner feeds that use MySQL-only search models.

---

## 3. How Search Works (End to End)

### Customer search flow

1. Customer types a query or opens a category / list / filtered page.
2. Storefront calls the API (autocomplete while typing; full search + filters for results).
3. API checks whether Elasticsearch is available.
   - If unavailable → search is reported as temporarily down (see [Section 11](#11-when-search-is-unavailable)).
4. Request is scoped to the current **web store** and **client account** (B2C / B2B visibility, inactive integrations filtered out).
5. Elasticsearch returns matching products (and related suggestions for autocomplete).
6. API returns paginated results, facets, and sort options to the storefront.

### Keeping the search index up to date

```
Product / category / author / etc. is created, updated, or deleted
        ↓
Change is queued automatically (spool table)
        ↓
Cron runs: php yii elastic/spool
        ↓
Queued items are sent to Elasticsearch in batches
        ↓
Storefront search starts reflecting the change
```

Updates are **near real-time** (typically within a few minutes of the spool cron), not instantaneous on every save.

---

## 4. Autocomplete (Search-as-You-Type)

Autocomplete helps customers find products and related entities while typing.

### Main endpoint

| Endpoint | Purpose |
|----------|---------|
| `GET /autocomplete` | Unified suggestions (preferred) |
| `GET /product/autocomplete` | Legacy / deprecated product autocomplete |

Also available in specialized modules:

| Endpoint | Module |
|----------|--------|
| Audio module `/autocomplete` | Audiobook-oriented suggestions |
| Ebook module `/autocomplete` | Ebook-oriented suggestions |

### What autocomplete returns

For a search term, suggestions can include:

- **Products**
- **Authors**
- **Publishers**
- **Series**
- **Categories** (limited)
- **Tags** (from product alternative names / search tags)

### Behaviour notes

- Input is the search `term` (older product autocomplete may use `search`).
- Optional limits: product count, related-entity count, product type filter.
- If the term looks like an **ISBN / EAN**, autocomplete focuses on the exact product match and skips related-entity / tag suggestions.
- Products from inactive integration sources are excluded.
- Suggestions prefer products that are easier to buy (e.g. better availability, image present, stronger sales) and push out-of-stock items lower.

---

## 5. Product Catalog Search

### Main endpoint

| Endpoint | Purpose |
|----------|---------|
| `GET /product/search` | Full product search with filters, sort, and pagination |

Requires the **store** header (web store code, e.g. `WEB` / `WEB2`).

### What customers can search by

| Capability | Description |
|------------|-------------|
| **Free-text** | Matches title, tags/synonyms, authors, and related text (including cross-field matches like author + title in any order) |
| **ISBN / EAN** | If the query looks like an identifier, search treats it as an exact product lookup |
| **Author name** | Dedicated author text filter |
| **Publisher name** | Dedicated publisher text filter |
| **Series name** | Dedicated series text filter |

### Filters

| Filter area | Examples |
|-------------|----------|
| **Category** | Category ID, subcategory IDs, NAV codes, slug + level |
| **People** | Author / person ID(s) |
| **Publisher** | Publisher ID(s) |
| **Series** | Series ID(s) |
| **Lists** | Product list ID, campaign list ID (default sort can keep manual list order) |
| **Product type** | Book, ebook, audiobook, tech, game, etc. (`type` / `productType`) |
| **Cover / binding** | Cover type or multiple cover types |
| **Language** | ET / EN / RU, or `"other"` for languages outside the main app languages |
| **Price** | Minimum and maximum price |
| **Discount** | Minimum discount percent |
| **Availability** | Web, in-shop, coming soon, out of stock, or specific shop codes |
| **Other** | Preorder flag, new-products list, category “top” interval (e.g. 7 / 30 / 360 days), EAN |

### Sorting

Customers can sort results by options such as:

- Relevance (default ranking — see [Section 8](#8-how-results-are-ranked))
- Price (asc / desc)
- Discount percent
- Name
- Newest / created date
- Sales / popularity
- Category “top” ranking
- Manual sequence when browsing curated product / campaign lists

### Pagination

- Default page size: **20**
- Maximum page size: **100**
- Standard pagination headers (`X-Pagination-*`) are used

### Query safeguards

- Very long text queries are truncated so search stays stable.
- Overly complex queries may return an empty product list rather than failing the whole API.

---

## 6. Dynamic Filters (Facets)

Dynamic filters show **filter options with product counts** for the current search context (so customers see only relevant authors, publishers, etc.).

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /product-dynamic-filter/filters` | All main facets for the current search/filter context |
| `GET /product-dynamic-filter/search-author` | Search within author facet options (+ product counts) |
| `GET /product-dynamic-filter/search-series` | Search within series facet options (+ product counts) |
| `GET /product-dynamic-filter/search-publisher` | Search within publisher facet options (+ product counts) |

### Facet types typically included

- Categories  
- Authors  
- Binding / cover types  
- Publishers  
- Series  

Facet endpoints use the same filter parameters as product search, so counters stay consistent with the result list.

---

## 7. Related Entity Search Endpoints

Besides product search and autocomplete, the API exposes Elasticsearch-backed listing/search for related entities:

| Endpoint | What it searches |
|----------|------------------|
| `GET /category/search` | Categories |
| `GET /product-person/search` | Authors / product persons |
| `GET /author/search` | Authors (author-oriented API) |
| `GET /product-publisher/search` | Publishers |
| `GET /product-series/search` | Series |
| `GET /product-list/search` | Product lists |
| `GET /campaign-list/search` | Campaign lists |

These power browse pages and entity directories on the storefront.

---

## 8. How Results Are Ranked

Default product ranking is designed so that **useful, buyable products** appear first.

Functional ranking behaviours include:

| Behaviour | Effect for customers |
|-----------|----------------------|
| **Title matches** | Stronger than tag / synonym matches |
| **Author matches** | Authors contribute to relevance |
| **Cross-field matching** | Queries like “Rowling Harry” can still find the right title |
| **Typo tolerance** | Small spelling mistakes can still match |
| **Character / spacing flexibility** | Accent / spacing differences are handled more forgivingly |
| **Sales / popularity** | Better-selling products get a boost |
| **Images** | Products with a thumbnail are preferred in suggestions |
| **Delivery / availability** | Faster / available products are preferred |
| **Out of stock / coming soon** | Pushed lower in the list |
| **Product source** | Preferred sources (e.g. manual / NAV) can rank above weaker integration sources |

There is **no geo / location-based search**.

---

## 9. Synonyms, Tags & Search Enrichment

Search matching is improved beyond the product title alone.

### Manual search tags

- Staff can manage **product tags** (alternative names) in admin **Search settings**.
- Tags are stored on the product and indexed into Elasticsearch.
- They help customers find products using alternate wording, nicknames, or common misspellings.

**Admin area:** Search settings (`admin` → setting Search controller) — used to add tags that later appear in storefront search/autocomplete.

### AI search synonyms

- Non-book products can receive AI-generated synonym / typo-helper strings.
- These are stored on the product and merged into searchable alternative names when indexing.
- Generation is done via a console command (not a customer-facing feature):

```bash
php yii product-ai-search-synonyms/generate-batch
php yii product-ai-search-synonyms/verify
```

### Optional synonym analyzer

- An index-level synonym search mode can be enabled via configuration (`enableSynonymSearch`).
- Enabling it for live use requires rebuilding product mappings / reindex (typically via product import commands). Treat this as an ops-controlled feature.

---

## 10. Index Sync, Commands & Cron Jobs

### Automatic change tracking

When these entities change, they are queued for Elasticsearch update:

- Products  
- Categories  
- Authors / product persons  
- Publishers  
- Series  
- Product lists  
- Campaign lists  

Related product changes (e.g. images, badges) can also trigger re-queueing so search documents stay complete.

Queued actions are essentially: **save / update**, **delete**, or **full index**.

### Cron job (incremental updates)

| Item | Detail |
|------|--------|
| **Command** | `php yii elastic/spool` |
| **Schedule** | Frequent — every few minutes |
| **Purpose** | Process queued search index updates |
| **Documented in** | [Cron Jobs](../monitoring/CRON_JOBS.md), [Elasticsearch Spool](./ELASTICSEARCH_SPOOL.md) |

This is the main job that keeps storefront search fresh after catalog changes, imports, and admin edits.

### Elasticsearch console commands

| Command | What it does |
|---------|--------------|
| `php yii elastic/spool` | Process the queue (normal ongoing sync). Skips work if Elasticsearch is down. |
| `php yii elastic/import` | Full reindex of all search indexes (prompts for confirmation; use `--noPrompt=1` when automating) |
| `php yii elastic/import-upgrade` | Full import used during Elasticsearch cluster upgrades |
| `php yii elastic/import-products` | Reindex products only |
| `php yii elastic/import-product-persons` | Reindex authors / persons only |
| `php yii elastic/import-publishers` | Reindex publishers only |
| `php yii elastic/import-series` | Reindex series only |
| `php yii elastic/import-categories` | Reindex categories only |
| `php yii elastic/add-items-to-spool` | Manually queue specific record IDs for indexing |

Controller: `console/controllers/ElasticController.php`.

### Health & monitoring commands

| Command | What it does |
|---------|--------------|
| `php yii health-check/elasticsearch` | Checks cluster health; can alert if Elasticsearch is down or the spool lock looks stuck |
| `php yii health-check/elasticsearch --notify=0` | Check only (no email notification) |
| `php yii daily-report/health` | Daily ops health report (includes Elasticsearch / spool status) |

Recommended ops cadence for the Elasticsearch health check is frequent (about every 1–2 minutes) so downtime is noticed quickly.

### When to use which command

| Situation | What to run |
|-----------|-------------|
| Normal day-to-day | Cron already runs `elastic/spool` |
| After bulk catalog changes | Wait for spool, or selectively reindex the affected entity type |
| After mapping / analyzer changes | Full or product reindex (`elastic/import` / `elastic/import-products`) |
| After DB restore | Rebuild search indexes with `elastic/import` (see also `BACKUPS.md`) |
| Suspected stuck queue / ES issues | `health-check/elasticsearch`, then fix ES and run `elastic/spool` |

---

## 11. When Search Is Unavailable

If Elasticsearch is down or degraded, catalog search does **not** silently return empty results.

| Signal | Value |
|--------|--------|
| HTTP status | **503** |
| Response header | **`X-Search-Available: 0`** |
| Message | Search is temporarily unavailable. Please try again shortly. |

This applies to product search, autocomplete, dynamic filters, and other Elasticsearch-backed listing endpoints.

Important points:

- There is **no MySQL full-text fallback** for storefront catalog search.
- The frontend can detect the header and show a “search temporarily unavailable” state.
- While Elasticsearch is unhealthy, `elastic/spool` skips processing so the queue does not thrash.
- Staging can force this degraded mode for QA (`forceSearchUnavailable` query/header when allowed in config). Keep that disabled in production.

Details: [Elasticsearch Reliability Plan](./ELASTICSEARCH_RELIABILITY_PLAN.md).

---

## 12. Search Surfaces by Area

| Area | Uses Elasticsearch? | Purpose |
|------|---------------------|---------|
| **Storefront API** | Yes | Customer catalog search, autocomplete, facets, entity browse |
| **Hotline (in-store)** | Yes | In-store product lookup UI for shop staff (`hotline` Search) |
| **Admin product grids** | No (MySQL) | Staff filtering and management |
| **Admin Search settings** | Indirect | Manage tags that later feed Elasticsearch |
| **Audio / Ebook modules** | Yes (autocomplete / product search variants) | Format-specific storefront experiences |
| **Stacc / partner product feeds** | No (MySQL) | Partner recommendation/export flows — not catalog ES search |

---

## 13. Feature Summary Checklist

Storefront search supports:

- [x] Product full-text search (title, tags/synonyms, authors, cross-field)
- [x] Autocomplete across products and related entities
- [x] ISBN / EAN exact lookup
- [x] Category, author, publisher, series, type, language, cover filters
- [x] Price and discount range filters
- [x] Availability and shop-based availability filters
- [x] Curated product / campaign list browsing with sequence
- [x] Dynamic facets with counters
- [x] Multiple sort options + relevance ranking
- [x] Typo-tolerant / flexible matching
- [x] Manual tags and AI search synonyms
- [x] Web-store and client-account scoping
- [x] Hotline in-store search
- [x] Near-real-time index sync via spool + cron
- [x] Full and selective reindex commands
- [x] Explicit unavailable mode when Elasticsearch is down

Does **not** include:

- Geo / location-based product search  
- MySQL fallback for catalog search during Elasticsearch outages  
- Elasticsearch-backed admin product management grids  

---

## 14. Related Documentation

| Document | Contents |
|----------|----------|
| [Elasticsearch Spool](./ELASTICSEARCH_SPOOL.md) | Indexing pipeline, spool table, providers, recovery |
| [Elasticsearch Reliability Plan](./ELASTICSEARCH_RELIABILITY_PLAN.md) | 503 contract, force-degrade QA, health checks |
| [Cron Jobs](../monitoring/CRON_JOBS.md) | Scheduled `elastic/spool` and other jobs |
| [Console Commands](../reference/07-CONSOLE_COMMANDS.md) | Console command index |
| [Backups](../deployment/BACKUPS.md) | Rebuilding Elasticsearch after DB restore |
| [External Integrations](./EXTERNAL_INTEGRATIONS.md) | Imports → spool → search index |
| [Admin Module](../reference/ADMIN_MODULE.md) | Admin changes flowing into search via spool |
| [API Documentation](../reference/05-API_DOCUMENTATION.md) | High-level API notes (autocomplete / lists) |
| Gap: [OP-004 Search Functionality](/gaps/operational/OP-004-search-functionality) | Gap tracker view of this topic |

---

## 15. Quick Reference — Search-Related Commands

```bash
# Ongoing index updates (also run by cron)
php yii elastic/spool

# Full rebuild of all search indexes
php yii elastic/import --noPrompt=1

# Selective rebuilds
php yii elastic/import-products
php yii elastic/import-product-persons
php yii elastic/import-publishers
php yii elastic/import-series
php yii elastic/import-categories

# Health
php yii health-check/elasticsearch
php yii health-check/elasticsearch --notify=0

# AI synonyms for non-book products
php yii product-ai-search-synonyms/generate-batch
php yii product-ai-search-synonyms/verify
```
