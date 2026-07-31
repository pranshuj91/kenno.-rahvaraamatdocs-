---
id: OP-007-sitemap
title: OP-007 — Sitemap Generation
sidebar_label: OP-007 Sitemap
---

# OP-007 — Sitemap Generation

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Sitemap Generation |
| Description | Automated SEO sitemaps — generation schedule, URL priorities |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/reference/SITEMAP.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/reference/SITEMAP.md`

# Sitemap Generation

This document describes the automated XML sitemap generation system.

## Overview

The system generates XML sitemaps for SEO, covering all public-facing entity types. Sitemaps follow the [sitemaps.org](https://www.sitemaps.org/) protocol and are split into multiple files when exceeding the per-file item limit.

## Console Command

**File:** `console/controllers/SitemapController.php`

```bash
php yii sitemap/index [--webStoreNavCode=WEB|WEB2]
```

- Uses `AlreadyRunningFilter` to prevent concurrent execution
- Supports multiple web stores via `--webStoreNavCode` option
- Items per file: **8,000** (`ITEMS_COUNT_PER_FILE`)

## Entity Types

The sitemap covers these entity types, each with a dedicated data provider and last-modification extractor:

| Entity | Data Provider | Last Modified Extractor |
|--------|--------------|------------------------|
| Products | `SitemapProductDataProvider` | `ProductLastModificationExtractor` |
| Categories | `SitemapCategoryDataProvider` | `CategoryLastModificationExtractor` |
| Content Pages | `SitemapContentPageDataProvider` | `ContentPageLastModificationExtractor` |
| Authors | `SitemapAuthorDataProvider` | `ProductPersonLastModificationExtractor` |
| Other person types (illustrators, translators, actors, compilers, performers, readers) | `SitemapProductPersonDataProvider` (one pass per type) | `ProductPersonLastModificationExtractor` |
| Publishers | `SitemapPublisherDataProvider` | `ProductPublisherLastModificationExtractor` |
| Series | `SitemapSeriesDataProvider` | `ProductSeriesLastModificationExtractor` |
| Product lists | `SitemapProductListDataProvider` (`activeAndAvailable` scope) | `ProductList.updated` |
| Campaign lists | `SitemapCampaignListDataProvider` (active + web-visible + public + url) | `CampaignList.updated` |
| Blog posts | `SitemapBlogDataProvider` (`origin` + `active` + store) | `Blog.updated` |
| Events | `SitemapEventDataProvider` (`origin` + `active` + `visible`) | `Event.updated` |

Product lists use the model's own `activeAndAvailable()` visibility scope
(`is_active` + within the `visible_from`/`visible_to` window) so the sitemap
matches the storefront. They are emitted in the store's default language only —
lists are language-specific (`language_type_id`) and resolve by their unique
slug, so no hreflang alternates are fabricated.

Campaign lists mirror the storefront API's public lookup
(`CampaignListController::findModel`): `active()` (within the visibility window —
**excludes expired campaigns**) + `availableForWeb()` (`do_not_show_in_web = 0`) +
the current store + `forClientType(null)` (no client-type restriction, i.e. what
an anonymous crawler sees) + a non-empty `url` (campaigns are resolved by their
stored slug, so urlless ones are unreachable). Same single-file, default-language,
`updated`-based lastmod approach as product lists.

Blog posts are single-language (the `language` column); each published post
(`origin` = not a draft, `active`) is emitted once, in its own language, at
`/{lang}/{blog}/{category}/{slug}` (category = the post's `mainTag`).
`getBlogUrl()` instantiates the v2 `BlogUrlBuilder` directly — blogs are not
registered with the version-aware builder factory.

Events are global (no `web_store_id`), so they are emitted only into the main
store's sitemap to avoid cross-store duplication, and only when currently
`visible()` (within the visible_from/visible_to window — past events are
excluded). Each event is multilingual via `rr_event_translation`: one URL per
language that has a translation slug (the builder throws for languages without
one, which the section skips). `getEventUrl()` goes through the wired
`forEvent()` factory method.

Authors keep their own provider (author-specific bulk indexation approver +
`productPersonTops` boost); the other PRODUCT_PERSON_TYPE pages go through the
generic `SitemapProductPersonDataProvider` + `getProductPersonUrl()`, which
routes the URL path by type (`/illustrators/…`, `/translators/…`, etc.). A
person can appear under more than one type, yielding one URL per qualifying type.

**Data providers directory:** `console/sitemap/`

## Last Modification Tracking

Each entity type has specialized repositories to determine the most recent modification datetime:

**Directory:** `console/sitemap/fieldExtractor/repositories/`

### Category
- `CategoryPageComponentUpdatedDateTimeRepository`
- `CategorySeoUpdatedDateTimeRepository`
- `CategoryStatisticUpdatedDateTimeRepository`

### Content Page
- `ContentPageComponentUpdatedDateTimeRepository`

### Person (Author)
- `ProductPersonMetaUpdatedDateTimeRepository`

### Publisher
- `ProductPublisherMetaUpdatedDateTimeRepository`

### Series
- `ProductSeriesDescriptionUpdatedDateTimeRepository`

## Output

Sitemaps are generated as XML files using PHP's `XMLWriter`. Each file contains up to 8,000 URLs with:
- `<loc>` — Full URL
- `<lastmod>` — Last modification datetime

Files are written to the web-accessible directory for search engine crawlers.

## Monitoring

`actionIndex` records a `sitemap/lastRun` entry in `rr_system_state` on every
fully-completed run, holding per-store/per-entity URL counts, the completion
timestamp and the total runtime. The write is best-effort — a bookkeeping
failure never breaks generation — and is only reached when the run finishes, so
a stale `finished_at` is itself a signal that the run died partway.

The daily health report (`common/reports/SystemHealthReport.php`, section
"Sitemap — generation freshness") surfaces this:

- **Per-entity URL counts** and **last successful regen timestamp** from the
  `sitemap/lastRun` state record.
- **Partial-failure detection** by comparing the oldest vs newest
  `sitemap-*.xml` mtimes on disk. A healthy run writes all sub-sitemaps within
  one multi-hour pass, so a spread wider than 24h means the cron died mid-run
  and the tail (content pages / authors / publishers / series) is frozen.
- **Staleness detection** when the newest file is older than 192h / 8 days (a
  weekly run was fully missed / the cron stopped firing; the bound sits above
  the normal ~168h weekly gap). Thresholds live on `SystemHealthReport`.

## Resilience & failure handling

The product phase performs per-product/per-image S3 existence checks
(`fileExists` → `S3::doesObjectExist`), so it is network-bound and by far the
longest, most failure-prone step. To stop a failure there from freezing the
cheap tail entities:

- Each entity section runs through `runSection()`, which catches any throwable,
  logs it, records it under `errors[<section>]` in the `sitemap/lastRun` state,
  and lets the run continue. A single failing section no longer aborts the rest.
- The master index (`general()`) is always rebuilt afterwards from whatever
  sub-sitemaps exist on disk (`prepareDirectory` never wipes).
- Recorded section errors are surfaced in the daily health report as both an
  action line and a per-store `⚠️ <section> failed` note.

Note: the generation cron runs weekly (Sunday 07:11) and is scheduled via the
Zone control panel (not in this repo). The cron generates on the build box and then
`scp`s the output to the FE web servers that serve it (`rahvaraamat.ee` and
`raoutlet.ee`). The health report runs on the build box and checks the
generated files, so it does **not** detect scp/delivery failures — a follow-up
live HTTP freshness check against the served sitemap would close that gap.

## Models Used

- `Product` — `common/models/Product.php`
- `Category` / `CategoryPage` — `common/models/Category.php`, `common/models/CategoryPage.php`
- `ContentPage` — `common/models/ContentPage.php`
- `ProductPerson` — `common/models/ProductPerson.php`
- `ProductPublisher` — `common/models/ProductPublisher.php`
- `ProductSeries` — `common/models/ProductSeries.php`
- `WebStore` — `common/models/WebStore.php`


