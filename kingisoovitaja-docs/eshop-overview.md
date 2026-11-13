---
id: eshop-overview
title: E-shop Side Overview
sidebar_label: E-shop Overview
---

# E-shop Side: Overview

Repo: `Rahva-Raamat/ecommerce-backend` (Yii2, rahvaraamat.ee). This section covers what the e-shop does for Kingisoovitaja: curated occasion lists, AI gift profiles, the product feed, the price and stock change feed, the checkout API, order attribution and the API contract.

## Status and where the code is

| Ticket | What | Commit(s) | Date | Staging (dev.rahvaraamat.ee) | Master / production |
|---|---|---|---|---|---|
| RR-252 | Curated gift occasion lists (admin) | `b9b71f4da` | 13 Oct 2026 | Yes | **Not yet** |
| RR-253 | AI gift profiles + admin review | `81af01059`, `389ebd186` | 13 to 14 Oct 2026 | Yes | **Not yet** |
| RR-255 | `occasions` column in the product feed | `2e0ae06ce` | 16 Oct 2026 | Yes | **Not yet** |
| RR-257 | Same-day price and stock change API | `4f9d1b334` | 19 Oct 2026 | Yes | **Not yet** |
| RR-258 | Headless checkout API | `7bda3580c` | 22 Oct 2026 | Yes | **Not yet** |
| RR-259 | Order source attribution + report | `357f2d1f0` | 23 Oct 2026 | Yes | **Not yet** |
| RR-260 | OpenAPI contract + contract test | `65b01e28d` | 24 Oct 2026 | Yes | **Not yet** |
| Feed hotfixes | `available_in_stock`, `warning_text`, `min_age`, one-line descriptions | `e436b5804`, `0999924dc`, `d2999f660`, `aa1481b62` | 10 to 14 Oct 2026 | Yes | Yes (went through `hotfix/*`) |

## Branches

- One feature branch per ticket: `feat/RR-252/kingisoovitaja-curated-gift-occasions`, `feat/RR-253/kingisoovitaja-gift-profile-enrichment`, `feat/RR-255/kingisoovitaja-gift-advisor-export`, `feat/RR-257/kingisoovitaja-realtime-price-stock`, `feat/RR-258/kingisoovitaja-headless-basket-checkout`, `feat/RR-259/kingisoovitaja-order-source-attribution`, `feat/RR-260/kingisoovitaja-gift-advisor-openapi-feed-spec`.
- All are merged into `staging` and into the collecting branch `feat/RR-233/kingisoovitaja-rag-intent-setup`.
- **For production launch**, the collecting branch (or the ticket branches in order) must be merged to `master`, released, and the four migrations run on production.

## Business decisions the e-shop code follows

| # | Decision | Where it shows |
|---|---|---|
| 1 | Checkout on **kingisoovitaja.ee** through our API; **guest** orders | RR-258 |
| 2 | Curated occasion lists **supplement** the selection; not a whitelist, **not boosted** | RR-252 `sort_order` is admin-only; RR-255 only sends codes |
| 3 | **Gift books** across the catalogue; other books never | RR-253 gift-book flag; categories `KINKRAAMAT`, `KINK_MUUD` |
| 6 | **Gardners** products stay out of the feed | `feedQuery()` excludes `IMPORT_GARDNERS` |
| 9 | **Estonian only** at launch | `name_et` required; profile `languages => ['et']` |
| - | Same parcel machine carriers as rahvaraamat.ee (Dagmar, 21 Oct 2026) | `parcelMachineMethods` = POST24, WDPD, SMART_POST |
| - | Gift profiles come from Kenno's own AI enrichment for now (Kenno, 16 Oct 2026) | `queueOnCurate => false`; profiles not exported |
| - | Changes are **pulled**, not pushed (BE-6 option B) | RR-257 cursor API, no webhook |

## Tickets not built in the e-shop

| Planning name | Topic | Status |
|---|---|---|
| BE-3 | NAV age and sex data for products | After launch |
| BE-5 / RR-256 | Gift search on the e-shop's Elasticsearch | Not needed for Kingisoovitaja (own Meilisearch hybrid search). Suggested to close; improving the e-shop's own search would be a separate ticket with its own test (Kenno's caveat) |
| BE-10 | Data quality check | Done as analysis |
| - | `is_gift_book` feed column | Planned: export the reviewed gift-book flag from RR-253. Not built yet |

## Product feed (`products-feed.csv`)

- **Command:** `./yii feed-exporter/generate-products-csv` (`console/feeds/ProductsCsvGenerator.php`).
- **File:** `@storage/feed-exports/web/products-feed.csv`.
- **Public URL:** staging `https://dev.rahvaraamat.ee/storage/feed-exports/web/products-feed.csv`, production `https://web.rahvaraamat.ee/storage/feed-exports/web/products-feed.csv`. No key. Supports `Range` and `If-Modified-Since`.
- **Format:** UTF-8 with BOM, comma separated, one header row.
- **Schedule:** at least once a day (server crontab, not in the repo). Kingisoovitaja downloads it at 01:00.

Products in it: web-visible, not an e-book, **not Gardners**, not Russian-language, active for the web store; in stock or orderable, has an image, `price > 0`, a name, a URL, a real description (over 25 chars), condition new; not from publisher `REVAL-BUCH`; three excluded IDs (NRR-913). Books **are** in the feed; Kingisoovitaja applies its own rules.

Columns (in order): `id, availability, condition, description, image_link, link, title, price, gtin, product_type, brand, sale_price_effective_date, sale_price, custom_label_0, custom_label_1, custom_label_2, custom_label_3, custom_label_4, division, category, product_group, is_local, full_description, publisher, collections, in_popular_list, is_new, added_date, added_time, year, sales_30d_units, sales_30d_revenue, delivery_time, size, available_in_stock, warning_text, min_age, occasions`

| Column | Meaning for Kingisoovitaja |
|---|---|
| `id` | Product ID; `productId` in checkout, `product_id` in `/changes` |
| `availability` | `in stock` / `out of stock` |
| `price`, `sale_price` | like `19.99 EUR`. `sale_price` includes campaigns **and** the logged-in discount, so a guest checkout total can be a bit higher if that discount is set |
| `gtin` / `brand` | EAN / ISBN |
| `custom_label_0..4` | authors, publisher, language, series, category |
| `division`, `category`, `product_group` | root category, category, parent category |
| `full_description` | whole description on one line |
| `collections`, `in_popular_list`, `is_new`, `sales_30d_*` | popularity signals |
| `available_in_stock` | `1` = physically in at least one shop |
| `warning_text` | safety warning on one line |
| `min_age` | minimum age in years parsed from the warning, 1 to 21, empty if none |
| `occasions` | curated occasion codes (RR-255), last column |
