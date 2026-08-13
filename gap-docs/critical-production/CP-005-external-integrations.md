---
id: CP-005-external-integrations
title: CP-005 — External Product Integrations
sidebar_label: CP-005 External Integrations
---

# CP-005 — External Product Integrations

| Field | Value |
|---|---|
| Priority | Critical |
| Category | Production |
| Gap item | External Product Integrations |
| Description | Gardners, Anvol, Insplay, Buroomaailm, EDRK, Raamatukoi — import schedules, mapping, sync logic |
| Documentation status | Documented |
| Code location | common/synchronizations/external/ |
| Assigned to | — |

## Related Developer Docs

- `docs/integrations/EXTERNAL_INTEGRATIONS.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.

---

### Developer Docs — `docs/integrations/EXTERNAL_INTEGRATIONS.md`

﻿---
id: EXTERNAL_INTEGRATIONS
title: External Product Integrations
sidebar_label: External Integrations
---

# External Product Integrations

This document describes the external product data sources integrated into Rahva Raamat, how imports work, and where the code lives.

Gardners and Büroomaailm each have a full end-to-end section below (pipeline, pricing, commands, file index). Other suppliers keep the shorter reference format.

## Overview

Products from external suppliers are imported via various protocols (XML feeds, SOAP APIs, REST APIs, FTP). Each integration follows a similar pattern:

```
External Source → Parser → Normalizer → Importer → RR Database
                                                   → Spool (for ES indexing)
```

All integrations are located under `common/synchronizations/external/` and have corresponding console controllers.

Exact production crontab minutes live in the **Zone.ee** panel and are **not** committed to this repository. Frequencies below are from code comments and known ops patterns.

### Integrations at a glance

| Integration | How data arrives | Endpoint / source | What is synced | Command | Frequency (what we know) |
|-------------|------------------|-------------------|----------------|---------|--------------------------|
| **Gardners** | FTP | `/Biblio/` ONIX or WeeklyExtract + `/INVENTORY` CSV | Books: catalog + EU stock/price | Preferred: `php yii sync/onixFeedGardnersProductImporter`; legacy: `php yii gardners/import-products` | Catalog feed is weekly-oriented; exact cron on server |
| **Büroomaailm** | FTP (`/v2/`); manual XML upload is fallback only | FTP folder `/v2/` | Office/tech: catalog, stock, price, image URL | `php yii buroomaailm/import-products` | Built as **daily** (skips if already synced today). Exact cron on server |
| **Insplay** | REST API | `https://api.insplay.eu/products` | Products, stock, prices, images | `php yii insplay/import-products` | Cron on server |
| **Anvol** | HTTP file download | Config URL + backup URL | Products, stock, prices, images | `php yii anvol/import-products` | Cron on server |
| **EDRK** | SOAP API | Partner WSDL (`GetBooksForSaleV6`) | E-books / audio books + files | `php yii edrk/import-products` | Cron on server |
| **Raamatukoi** | HTTP POST (Directo XML) | Config `productsUrl` + `stockUrl` | Products + stock | `php yii raamatukoi/import-products` | Cron on server |
| **Lasgo** | SFTP | `/CDBiblio/MusicBiblioGraphic.XML` + daily XLSX in `Feed/` | Music catalog + daily availability/price | `php yii lasgo/` | Availability **hourly** (`0 * * * *`). Catalog cron on server |
| **Nielsen** | SFTP | Image archives (used by Gardners) | Cover images for Gardners products | Gardners image / Nielsen sync jobs | With Gardners image update |
| **NAV (ERP)** | In: SQL to NAV DB. Out: SOAP | See [NAV Integration](/docs/integrations/NAV_INTEGRATION) | Products, stock, prices, orders, customers, … | `php yii sync/<handler>` | Availability ~35 min (09–22). Order sync ~30 min. Order post ~2 min |
| **Custobar / Klaviyo** | Outbound from us | Marketing platforms | Customer/product feeds | `php yii custobar/` / `php yii klaviyo/` | Cron on server |

**Bertrams** is discontinued (ops, 2026-06-18) and is not an active sync.

Typical supplier pipeline (all external product feeds):

```
External FTP/file/API
    → Parser (XML / CSV / ONIX / JSON)
    → Normalizer (ProductDto + prices / availability / categories)
    → Importer (ProductBuilder → DB)
    → Missing-products handler (OOS for items no longer in feed)
    → product_spooler_commit (Elasticsearch spool)
```

Each supplier is tracked as an `Integration` row (`rr_integration`) with enable/disable, blackout windows (`IntegrationAvailabilityGuardTrait`), run logs (`IntegrationRunLogTrait`), admin pricing overrides (`IntegrationPricingConfig`), and command maps in `IntegrationOperationalService`.

## Integrations

### Gardners

**Directory:** `common/synchronizations/external/gardners/`

**Gardners** is a large UK/EU book wholesaler. Rahva Raamat imports their **book catalog** (ONIX metadata + EU inventory prices/stock) over **FTP**, creates/updates local products, enriches cover images via **Nielsen**, and posts orders to NAV with `TransferFrom = Gardners`.

| | |
|---|---|
| **Protocol** | FTP + ONIX3 ZIP + EDI inventory CSV |
| **Preferred console** | `php yii sync/onixFeedGardnersProductImporter` |
| **Legacy console** | `php yii gardners/import-products` |
| **Default delivery** | `WEEKS_2_4` |
| **Default discount group** | `RAAMATUD` (when empty) |
| **VAT** | Book VAT (`VatEnum::BOOK`) |
| **Product identity** | `source_type_id` = `PRODUCT_SOURCE` / `IMPORT_GARDNERS`; `source_id` = EAN / ISBN; typical type `BOOK` |
| **Stock threshold** | `availabilityLimits.gardnersBook` = `1` (stock must be **> 1** to stay `AVAILABLE`) |
| **NAV TransferFrom** | `IMPORT_GARDNERS` → `TransferFrom = Gardners` (`OrderXmlBuilder`) |

There is **no** Gardners REST/SOAP endpoint we call for catalog import — delivery is **FTP files** only.

**Admin:** Settings → Integrations → Gardners (on/off, blackout, price floor, run logs). Run log code: `IMPORT_GARDNERS`.

#### Gardners integration codes (`rr_integration`)

| Code | Name |
|------|------|
| `IMPORT_GARDNERS` | Gardners (legacy / console map key) |
| `IMPORT_GARDNERS_ONIX` | Gardners ONIX Feed Import (pricing config code) |
| `IMPORT_GARDNERS_EU_AVAIL` | Gardners EU Market Availability |
| `IMPORT_GARDNERS_NIELSEN_IMG` | Gardners Nielsen Image Update |

#### Two importers (important)

| Class | Status | Triggered by |
|-------|--------|--------------|
| `OnixFeedGardnersProductImporter` | **Current / preferred** | `php yii sync/onixFeedGardnersProductImporter` (via `SyncHandlerFactory`) |
| `GardnersProductImporter` | **Legacy** | `php yii gardners/import-products` (`GardnersController`) |

`IntegrationOperationalService` still maps `IMPORT_GARDNERS` → `gardners/import-products` (legacy controller). Pricing admin config for ONIX uses code **`IMPORT_GARDNERS_ONIX`**.

`SyncController` still lists `onixFeedGardnersProductImporter` with a TODO comment to remove the old path eventually.

#### Key files (quick map)

- `OnixFeedGardnersProductImporter.php` — Current ONIX importer
- `OnixFeedGardnersProductNormalizer.php` — ONIX → ProductDto + prices
- `GardnersProductImporter.php` — Legacy WeeklyExtract importer
- `GardnersProductNormalizer.php` — Legacy normalizer
- `GardnersEUMarketAvailabilityImporter.php` — EU inventory/price-only sync
- `GardnersCategoryMapExporter.php` / `GardnersCategoryMapImporter.php` — Category mapping
- `ProductBuilderWithPartialUpdateSupport.php` — Partial product updates
- **Parsers** (`parsers/`): `GardnersOnix3XmlFeedParser`, `ProductXmlFileParser`, `AvailabilityCsvFileParser`, `PricesAndAvailabilityCsvFileParser`, `EUMarketAvailabilityCsvFileParser`, `ProductQuantityCsvFileParser`, `CategoryMapCsvFileParser`
- **Jobs:** `UpdateGardnersProductImageFromNielsenJob`, `UpdateGardnersBasedProductImageFromNavOrNielsenJob`

#### ONIX feed import (current flow)

**Class:** `common/synchronizations/external/gardners/OnixFeedGardnersProductImporter.php`

Config from `params['gardners']` (see `environments/dev/common/config/params-local.php`):

```php
'gardners' => [
    'connection' => [
        'host' => '...',          // main FTP (catalog)
        'login' => '...',
        'password' => '...',
        'edi-host' => '...',      // separate EDI FTP for inventory
        'edi-password' => '...',
    ],
],
```

Step-by-step:

1. **Guard** — abort if integration disabled / blackout.
2. **Download ONIX catalog ZIP** from FTP:
   - Remote dir: `/Biblio/ONIX`
   - Must match: `GardnerspBookONIX3_wk{N}_Full.zip`
   - If multiple candidates → pick **largest** (~1.7 GB full extract)
   - Download to temp `.part`, verify size, rename, `unzip`
   - Local runtime: `@console/runtime/gardners/import/onix`
3. **Download EU inventory/price file** via `GardnersEUMarketAvailabilityImporter::downloadSourceFile()`:
   - EDI FTP: `/INVENTORY`
   - Picks latest `.TXT` that has a matching `.DONE` sibling
4. **Parse inventory CSV** (`EUMarketAvailabilityCsvFileParser`) into meta map keyed by EAN/ISBN: `stock_count`, `discount`, `price` (EUR)
5. **Parse ONIX XML** (`GardnersOnix3XmlFeedParser`) → attributes
6. **Normalize** (`OnixFeedGardnersProductNormalizer`) → `ProductDto`
7. **Import** with `ProductBuilderWithPartialUpdateSupport` (create vs partial update)
8. **Safety guard** (after incident 2026-06-01): if provider product count &lt; max(1000, 50% of active Gardners catalog), **abort** and do **not** mark missing products OOS (wrong/partial feed protection — historically the tiny `Specials` ZIP caused ~348k products to flip `PERMANENTLY_OUT_OF_STOCK`)
9. **Missing products** → `MemoryEfficientNotPresentProductsHandler::markNotPresentProductsAsOutOfStock()`
10. Finish run log with added/updated/error counts

##### Validation (product skipped unless…)

For create notifications, product must have:

- non-empty ISBN
- matching inventory meta
- non-empty price in meta
- non-empty mapped categories

Skip reasons are logged (`EMPTY_ISBN`, `EMPTY_METADATA`, `EMPTY_PRICE`, `EMPTY_CATEGORIES`).

Also skipped if **price floor** configured on the integration is not met (`BELOW_PRICE_FLOOR`).

Products with **no mapped categories** are imported with `public_web_disabled = 1`.

##### ONIX notification types → actions

| ONIX notification | Action |
|-------------------|--------|
| `03` create | full create |
| `04` update | partial update |
| `05` delete | treated as **update** (mark OOS permanently — records are not deleted) |

##### Availability mapping (ONIX)

Publishing status + product availability codes map to RR classifiers:

- Cancelled / inactive / OOP / withdrawn → `PERMANENTLY_OUT_OF_STOCK`
- Active + available/in-stock/to-order/POD → `AVAILABLE` (then rechecked vs stock threshold)
- Otherwise → `TEMPORARILY_OUT_OF_STOCK`

Stock recalculation: if status would be `AVAILABLE` but stock ≤ `availabilityLimits.gardnersBook` → force `TEMPORARILY_OUT_OF_STOCK`.

##### Pricing (ONIX normalizer)

Legacy defaults (when admin pricing config empty):

| Field | Formula |
|-------|---------|
| Shop | `price × 2.0 × (1 − discount%)` |
| Vendor base | `price × (1 − discount%)` |
| Wholesale | same as shop (`× 2.0` unless wholesale multiplier set) |

Hardcoded coefficient `2.0` replaced the older `web_store_settings.gardners_coefficient` (that path is commented out).

Admin overrides via `IntegrationPricingConfig::forCode('IMPORT_GARDNERS_ONIX')`:

- `pricing_shop_multiplier` — replaces 2.0 for shop
- `pricing_wholesale_multiplier` — replaces 2.0 for wholesale (falls back to shop multiplier)
- `pricing_currency_coefficient_code` — optional FX rate
- Per-product discount still comes from the **supplier inventory feed**, not admin `vendor_base_discount`

##### Binding / language / people

- Product form codes (BB hardback, BC paperback, CD, DVD, etc.) → `BINDING_TYPE`
- Language from ONIX; default `EN` on create if missing
- Contributors → authors / translators / illustrators (`PersonDto`)

##### Images

On import, if product has no image: try `NielsenImageImporter::getImagePathForProduct(ean)`.

Separate sync: `UpdateGardnersProductImagesFromNielsen` queues jobs:

- `UpdateGardnersProductImageFromNielsenJob` — update Gardners product image
- `UpdateGardnersBasedProductImageFromNavOrNielsenJob` — also update matching NAV product with same EAN + `nav_product_code`

Run via sync factory: `UpdateGardnersProductImagesFromNielsen`.

#### Legacy WeeklyExtract importer

**Class:** `GardnersProductImporter`

- Downloads `/Biblio/WeeklyExtract.zip` → `WeeklyExtract.xml`
- Stock from EU market availability CSV
- Uses `GardnersProductNormalizer` + `ProductXmlFileParser`
- Pricing uses older Bertrams-style formula (`getPrice()` with 40% web shop discount + `bertramsCoefficient`)
- Images via Nielsen on create
- Missing products via `ProductMissingHandler` temp table `temp_edrk_status` (shared naming quirk)
- Spool commit after import

##### Fields mapped from WeeklyExtract XML (legacy path)

| Gardners field | Meaning |
|----------------|---------|
| EAN, ISBN | Identifiers |
| Title, series, description, publisher | Catalog text |
| Authors, illustrators, translators | People |
| Categories | Mapped to our categories |
| Publish date | Year |
| Recommended price | Shop price (book VAT) |
| Language, binding, weight, pages | Attributes |
| EU inventory CSV stock | Availability / stock count |

#### EU market availability-only sync

**Class:** `GardnersEUMarketAvailabilityImporter`

Standalone job (also registered in `SyncHandlerFactory`):

1. Download latest finished inventory `.TXT` from EDI `/INVENTORY`
2. Skip if same file already processed (`system` key `gardners-last-parsed-availability-file`)
3. Fill temp table `temp_gardners_eumarket_availability`
4. For each **AVAILABLE** Gardners product:
   - If EAN missing from file → set `PERMANENTLY_OUT_OF_STOCK`, stock 0
   - If present → refresh shop / vendor / wholesale prices when changed
5. Commit spool

Uses EDI host + `edi-password` from gardners config.

#### Other Gardners helpers

| Class | Role |
|-------|------|
| `GardnersProductAvailabilityImporter` | Older availability importer |
| `GardnersPricesAndAvailabilityImporter` | Prices + availability CSV sync |
| `GardnersCategoryMapExporter` / `Importer` | Category map CSV tools (`TempController` actions) |
| `ProductBuilderWithPartialUpdateSupport` | Partial field updates for ONIX update notifications |
| Parsers under `parsers/` | ONIX3, Weekly XML, availability CSVs, category map |

#### Console / sync commands (Gardners)

```bash
# Legacy full product import
php yii gardners/import-products

# Preferred ONIX import (SyncController dynamic action)
php yii sync/onixFeedGardnersProductImporter

# EU inventory / price refresh
php yii sync/gardnersEUMarketAvailabilityImporter

# Other registered handlers (names via SyncHandlerFactory)
php yii sync/gardnersProductImporter
php yii sync/gardnersProductAvailabilityImporter
php yii sync/gardnersPricesAndAvailabilityImporter
php yii sync/updateGardnersProductImagesFromNielsen

# Category map (temp utilities)
php yii temp/export-gardners-category-map
php yii temp/import-gardners-category-map <path>
```

Exact sync action IDs follow Yii’s camelCase → kebab-case convention of the handler method names; use `php yii help sync` in a configured environment to list them.

#### Business-customer visibility

Migration `m260616_120000_enable_gardners_products_for_business_customers.php` notes Gardners products were imported with `is_wholesale_web_disabled = 1`, which hid them from business customers. The migration sets them enabled and queues ES reindex. Current ONIX/legacy importers set `is_wholesale_web_disabled = false` on create.

#### Gardners availability / duplicate notes

- Preorder products that gain shop stock: Gardners source gets delivery type reset to **`WEEKS_2_4`** (NAV/manual → `DAYS_1_7`).
- Sales stats sync (`SalesStatSync`) has special SQL for duplicated Gardners/Bertrams vs NAV cards.
- See also [Availability Sync](/docs/commerce-ordering/availability-sync).

#### Gardners ops cheat sheet

```bash
# Preferred catalog import
php yii sync/onixFeedGardnersProductImporter

# Inventory / price-only refresh
php yii sync/gardnersEUMarketAvailabilityImporter

# Image enrichment jobs
php yii sync/updateGardnersProductImagesFromNielsen

# Legacy
php yii gardners/import-products
```

**Config needed:** `params['gardners']['connection']` with main FTP + EDI host/password.  
**Runtime dirs:** `@console/runtime/gardners/import`, `.../import/onix`.  
**Watch for:** wrong ZIP name / Specials feed / provider count abort; EDI `.DONE` markers.

#### Gardners file index

```
common/synchronizations/external/gardners/
  OnixFeedGardnersProductImporter.php
  OnixFeedGardnersProductNormalizer.php
  ProductBuilderWithPartialUpdateSupport.php
  GardnersProductImporter.php
  GardnersProductNormalizer.php
  GardnersEUMarketAvailabilityImporter.php
  GardnersProductAvailabilityImporter.php
  GardnersPricesAndAvailabilityImporter.php
  GardnersCategoryMapExporter.php
  GardnersCategoryMapImporter.php
  UpdateGardnersProductImagesFromNielsen.php
  jobs/
    UpdateGardnersProductImageFromNielsenJob.php
    UpdateGardnersBasedProductImageFromNavOrNielsenJob.php
  parsers/
    GardnersOnix3XmlFeedParser.php
    ProductXmlFileParser.php
    EUMarketAvailabilityCsvFileParser.php
    AvailabilityCsvFileParser.php
    PricesAndAvailabilityCsvFileParser.php
    ProductQuantityCsvFileParser.php
    CategoryMapCsvFileParser.php

console/controllers/GardnersController.php
console/migrations/m260616_120000_enable_gardners_products_for_business_customers.php
console/migrations/m260507_120000_seed_active_supplier_integrations.php
console/migrations/m260401_111852_add_integration_records.php
```

### Anvol

**Directory:** `common/synchronizations/external/anvol/`

- **Protocol:** HTTP file download (config URL + backup URL)
- **What is synced:** Products, stock, prices, images
- **Console:** `php yii anvol/import-products`, `anvol/import-category-map`, `anvol/import-delivery-method-offset`, `anvol/export-category-map`
- **Key Files:**
  - `AnvolProductImporter.php` — Main importer
  - `AnvolProductNormalizer.php` — Data normalization
  - `parsers/AnvolProductXmlFileParser.php` — XML parser
- **Temp table:** `__temp_anvol_status`
- **Image sync interval:** 14 days
- **Frequency:** Cron on server (exact minute in Zone crontab, not in repo)

### Insplay

**Directory:** `common/synchronizations/external/insplay/`

- **Protocol:** REST API (`https://api.insplay.eu/products`)
- **What is synced:** Products, stock, prices, images
- **Console:** `php yii insplay/<action>` (main: `insplay/import-products`)
- **Key Files:**
  - `InsplayProductImporter.php` — Main importer
  - `InsplayProductNormalizer.php` — Data normalization
- **Temp table:** `__temp_insplay_status`
- **Image sync interval:** 14 days
- **Frequency:** Cron on server

### Buroomaailm

**Directory:** `common/synchronizations/external/buroomaailm/`

**Büroomaailm** (often coded as `Buroomaailm` / `BM`) is an Estonian office / tech goods supplier. Rahva Raamat imports their catalog as **office equipment** and **tech** products (not books), maps supplier categories to RR categories under roots `KONTOR` / `TEHNIKA`, and posts orders to NAV with `TransferFrom = byroo`.

| | |
|---|---|
| **Protocol** | FTP XML `/v2/` (+ admin manual upload) |
| **Console** | `php yii buroomaailm/import-products` |
| **Option** | `--skipImages=1` |
| **Default delivery** | `DAYS_1_7` |
| **Default language** | `ET` |
| **Descriptions** | From the feed are **intentionally ignored** (poor multi-language quality) |
| **Product identity** | `source_type_id` = `PRODUCT_SOURCE` / `IMPORT_BUROOMAAILM`; `source_id` = supplier code (`Tootekood`); type `TECH` or `OFFICE_EQUIPMENT` via category map |
| **Stock threshold** | `availabilityLimits.buroomaailm` = `3` (stock must be **≥ 3** to be `AVAILABLE`) |
| **NAV TransferFrom** | `IMPORT_BUROOMAAILM` → `TransferFrom = byroo` (`OrderXmlBuilder`) |
| **Integration code** | `IMPORT_BUROOMAAILM` |

**Daily skip:** if already synced **today** and no manual upload is pending, the importer skips. Manual XML upload is a **fallback** only — not the normal path.

**Admin:** Settings → Integrations → Büroomaailm (on/off, blackout, price floor, run logs) and Settings → **Buroomaailm** (manual XML upload). Run log code: `IMPORT_BUROOMAAILM`.

Blackout: Büroomaailm historically had seeded blackout days in migration `m251104_100000_create_integration_management.php`. Importer calls `shouldAbortIntegrationRun()` before work.

#### Key files

- `BuroomaailmProductImporter.php` — Main importer
- `BuroomaailmProductNormalizer.php` — Data normalization
- `parsers/BuroomaailmProductXmlFileParser.php` — XML parser
- **Temp table:** `__temp_bm_status`
- Admin: `admin/modules/setting/controllers/BuroomaailmController`, `admin/models/forms/BuroomaailmSourceFileForm`

#### Main importer flow

**Class:** `common/synchronizations/external/buroomaailm/BuroomaailmProductImporter.php`

Config:

```php
'importer' => [
    BuroomaailmProductImporter::class => [
        'connection' => [
            'host' => '',
            'login' => '',
            'password' => '',
        ],
    ],
],
```

Step-by-step:

1. **Guard** — abort if disabled / blackout (`IMPORT_BUROOMAAILM`).
2. **Fetch source file:**
   - Prefer **manually uploaded** file from system key `BUROOMAAILM_MANUALLY_UPLOADED_FILE` (admin upload)
   - Else FTP scan directory **`/v2/`**, download the first listed file to `@console/runtime/buroomaailm/`
3. **Parse** XML with `BuroomaailmProductXmlFileParser` (element `Product`)
4. **Normalize** with `BuroomaailmProductNormalizer`
5. **Import** each DTO:
   - Skip / suspend if duplicate of NAV/manual vendor product (see below)
   - Optional image download from URL
   - Price-floor check
   - `ProductBuilder` persist
6. Set last sync date (`BuroomaailmProductImporter.LAST_PRODUCT_SYNC`)
7. Clear manual upload key if used
8. `product_spooler_commit`
9. `ProductMissingHandler` on temp table `__temp_bm_status` → mark products missing from feed as not available
10. Finish run log

Debug breadcrumbs are written to `/tmp/bm-breadcrumbs.log` (memory tracking around a past crash zone ~products 2500–3000).

#### XML field map

From `BuroomaailmProductXmlFileParser`:

| XML tag (Estonian) | Internal key | Meaning |
|--------------------|--------------|---------|
| `Kaubagrupp` | `category` | Category (first token = map key) |
| `Tootekood` | `source_id` | Supplier SKU |
| `Ribakood` | `ean` | Primary barcode |
| `Taiendavad_ribakoodid` | `other_eans` | Extra EANs (comma-separated) |
| `Tootenimi` | `name` | Name |
| `Brand` | `series` | Brand / series |
| `Tootepilt` | `image` | Image URL |
| `Kirjeldus` | `description` | (parsed but **not** stored) |
| `Laoseis_LOG` | `count` | Stock |
| `Uhik` | `unit` | Unit |
| `Jaehind_kmta` | `price_shop` | Net retail price from supplier |
| `Kaibemaksugrupp` | `vat` | VAT group (percent) |
| `Soodusprotsent` / `Soodushind_kmta` | discount fields | Legacy; discount price logic unused |
| `Dimensions` | `dimensions` | Depth/height/weight/width (multi-value) |

Dimensions: cm → mm for depth/height/width (`× 10`); weight as provided.

#### Validation / skips

Product is skipped when:

| Condition | Skip reason |
|-----------|-------------|
| Empty / zero `price_shop` | `EMPTY_PRICE` |
| Empty VAT | `EMPTY_VAT` |
| Category not in `CategoryMap` for BM | `UNMAPPED_CATEGORY` |
| Brand/series is `TIMER` or `SULEMEES` | `PROHIBITED_SERIES` |
| Below integration price floor | `BELOW_PRICE_FLOOR` |
| Duplicate of NAV/manual product (see below) | `DUPLICATE_OF_VENDOR` |

#### Duplicate of vendor product

BM will **not** sell items that already exist as NAV or MANUAL products for the same EAN/ISBN (unless the existing product’s vendor is in the exception list).

Exception vendor NAV code: **`H14169`** (`NOT_ORIGIN_VENDOR_NAV_CODES`).

If a BM product already exists in RR but is now considered a duplicate → status set to **`SUSPENDED`**.

This same vendor list is used by `AvailabilitySync::saveExternalProductsAsOrigin()` so BM can be treated as origin only for EANs tied to those excluded vendors.

#### Pricing

Legacy defaults (`BuroomaailmProductNormalizer::getPrices`):

| Field | Formula |
|-------|---------|
| Vendor base | supplier net price (optional FX) |
| Shop (pre-VAT) | `price × 1.05` if price ≤ **5 €**, else `price × 1.10` |
| Shop (stored) | pre-VAT shop × **(1 + VAT)** then special rounding |
| Wholesale | pre-VAT shop (rounded to 2 decimals) |

Admin overrides (`IntegrationPricingConfig::forCode('IMPORT_BUROOMAAILM')`):

- `pricing_low_tier_shop_multiplier` (default 1.05)
- `pricing_shop_multiplier` (default 1.10)
- `pricing_price_tier_threshold` (default 5)
- `pricing_vat_override_percent`
- `pricing_currency_coefficient_code`

**Price rounding:**

- If price ≥ 2 → decimal ends at `.50` or `.99`
- If price &lt; 2 → round up to nearest **5 cents**

Old discount-price multipliers (1.25 / 1.43 / 1.67) remain in code but are **not used**.

#### Availability from stock

```
stock >= availabilityLimits.buroomaailm (3)  → AVAILABLE
else                                         → TEMPORARILY_OUT_OF_STOCK
```

#### Category mapping

BM category string’s **first token** (before space) is the `CategoryMap.source_id`.

Console tools on `BuroomaailmController`:

| Action | Purpose |
|--------|---------|
| `export-category-map` | CSV of current BM category maps |
| `import-category-map` | Excel `BM_RR_matching_01.04.2022.xlsx` |
| `import-category-map-csv` | CSV import with level + nav code |
| `import-category-map-old` / `update-tech-category-map-old` | Legacy one-off imports |
| `import-delivery-method-offset` | Copy default delivery offsets for BM source (Fri evening + Sat tweaks) |

Product type from mapped root category:

- Root `KONTOR` → `OFFICE_EQUIPMENT`
- Root `TEHNIKA` → `TECH`

#### Admin manual import

- Menu: Admin → Settings → **Buroomaailm**
- Controller: `admin/modules/setting/controllers/BuroomaailmController`
- Form: `admin/models/forms/BuroomaailmSourceFileForm`
- Uploads file to `@console/runtime/buroomaailm/` and stores path in system key `BUROOMAAILM_MANUALLY_UPLOADED_FILE`
- Next `php yii buroomaailm/import-products` uses that file instead of FTP
- UI also shows last sync date via `BuroomaailmProductImporter::getLastSyncDateSystemKey()`

#### AvailabilitySync special rule

After duplicate/origin resolution, `markBuroomaailmNotOriginProductsAsReplaced()`:

- Any **CONFIRMED** BM product that is a duplicate EAN but **not** the origin product → force **`REPLACED`**

So BM duplicates do not remain sellable alongside the chosen origin card.

#### Debug helpers

`DebugController`:

- `actionCleanupBuroomaailmProducts`
- `actionSuspendBuroomaailmProducts`

#### Buroomaailm availability / duplicate notes

- Origin selection uses `getNotOriginVendorIds()` (vendor `H14169`).
- Extra pass: confirmed BM non-origin duplicates → `REPLACED` (see AvailabilitySync special rule above).
- See also [Availability Sync](/docs/commerce-ordering/availability-sync).

#### Buroomaailm ops cheat sheet

```bash
php yii buroomaailm/import-products
php yii buroomaailm/import-products --skipImages=1

php yii buroomaailm/export-category-map
php yii buroomaailm/import-category-map-csv <filename-in-runtime>
php yii buroomaailm/import-delivery-method-offset
```

**Config needed:** `params['importer'][BuroomaailmProductImporter::class]['connection']`.  
**Runtime dir:** `@console/runtime/buroomaailm`.  
**Admin:** Settings → Buroomaailm → upload XML for next run.  
**Watch for:** empty `/v2/` → `SourceFileNotFoundException`; unmapped categories; TIMER/SULEMEES brand skip; memory around large imports.

#### Buroomaailm file index

```
common/synchronizations/external/buroomaailm/
  BuroomaailmProductImporter.php
  BuroomaailmProductNormalizer.php
  parsers/BuroomaailmProductXmlFileParser.php

console/controllers/BuroomaailmController.php
admin/modules/setting/controllers/BuroomaailmController.php
admin/modules/setting/views/buroomaailm/import.php
admin/models/forms/BuroomaailmSourceFileForm.php
console/migrations/m210728_061411_add_buroomaailm_classifier.php
```

### EDRK

**Directory:** `common/synchronizations/external/edrk/`

- **Protocol:** SOAP API (new API) — partner WSDL action `GetBooksForSaleV6`
- **What is synced:** E-books / audio books + related files
- **Console:** `php yii edrk/<action>` (main: `edrk/import-products`)
- **Key Files:**
  - `EdrkProductImporter.php` — Main importer
  - `EdrkProductNormalizer.php` — Data normalization
  - `EdrkProductEpubImporter.php` — ePub file import
  - `EdrkProductAudioFileImporter.php` — Audio file import
  - `EdrkCategoryMapExporter.php` — Category map export
  - `EdrkResponseParserNewApi.php` — SOAP response parser
- **Price multiplier:** 1.0
- **Frequency:** Cron on server

### Raamatukoi

**Directory:** `common/synchronizations/external/raamatukoi/`

- **Protocol:** HTTP POST (Directo XML)
- **Source config:** `productsUrl` + `stockUrl`
- **What is synced:** Products + stock
- **Console:** `php yii raamatukoi/<action>` (main: `raamatukoi/import-products`)
- **Key Files:**
  - `RaamatukoiProductImporter.php` — Main importer
  - `RaamatukoiProductNormalizer.php` — Data normalization
  - `RaamatukoiProductBuilder.php` — Product builder
  - `parsers/RaamatukoiProductXmlFileParser.php` — Product XML parser
  - `parsers/RaamatukoiProductStockXmlFileParser.php` — Stock XML parser
- **Temp table:** `__temp_raamatukoi_status`
- **Frequency:** Cron on server

### Other Integrations

| Integration | Directory | How data arrives | Notes |
|-------------|-----------|------------------|-------|
| Digira | `common/synchronizations/external/digira/` | — | Deprecated per console commands |
| Lasgo | `common/synchronizations/external/lasgo/` | SFTP: `/CDBiblio/MusicBiblioGraphic.XML` + daily XLSX in `Feed/` | Music catalog + availability/price; availability cron **hourly** (`0 * * * *`) |
| Nielsen | `common/synchronizations/external/nielsen/` | SFTP image archives | Cover enrichment for Gardners |
| Authors Republic | `common/synchronizations/external/authorsrepublic/` | — | Deprecated per console commands |
| Digiread | `common/synchronizations/external/digiread/` | — | Digital reading content |
| Custobar | via `console/controllers/CustobarController.php` | Outbound feeds | Marketing platform integration (`php yii custobar/`) |
| Klaviyo | via `console/controllers/KlaviyoController.php` | Outbound feeds | Marketing feeds (`php yii klaviyo/`) |

## Admin: where to look (partner integrations)

Admin reads **our** database after scheduled jobs have pulled partner data. It does not open live FTP/API sessions to suppliers.

| Question | Answer |
|----------|--------|
| Can I see Gardners / Büroomaailm raw FTP files? | **No.** We download, parse, then discard. Admin shows run summary (success/fail, products added/updated). |
| Can I browse live web/API traffic? | **No** request inspector for supplier calls. Swagger at `/site/api-docs` (IP-restricted) is the API **spec**, not live traffic. |
| Why do sync pages show little detail? | **Debug → Sünkroniseerimised** starts a job and shows last run time — it is not a traffic viewer. |

| Page | What you see | Who can see it |
|------|----------------|----------------|
| Settings → **Integrations → run logs** | Per-run: status, duration, added/updated/failed, error text | Admin |
| Debug → **Armatuurlaud** | Integration health (`ok` / `degraded` / `error`) | Debugger role |
| Debug → **Sünkroniseerimised** | Trigger sync + last execution time | Debugger role |
| Debug → **Süsteemilogi** | App errors / warnings | Debugger role |
| Debug → **NAV logi** | NAV SOAP request + response (see [NAV Integration](/docs/integrations/NAV_INTEGRATION)) | Debugger role |

### Monitoring imports

| What | Where |
|------|--------|
| Did last night’s imports run? | Daily health email — section **Importations — last 24h** (`php yii daily-report/health`) |
| Stale sync (job did not run when expected) | Same report; cadence inferred from `integration_run_log` |
| Health per integration | `ok` / `degraded` / `error` from last 10 runs (Admin + DB) |
| App errors | Admin → Süsteemilogi + daily health “top errors” |

There is no separate public “supplier request log” UI. Full request/response viewing in Admin exists for **NAV outgoing SOAP** only.

### Still only on the server (not in this repo)

- Exact crontab minutes for Gardners, Büroomaailm, Anvol, Insplay, EDRK, Raamatukoi, etc.
- Live FTP/API hostnames and credentials (`params-local` / server config)

## Availability / duplicate handling (platform)

Multiple products can share an EAN (NAV card + external supplier card). `AvailabilitySync` picks an **origin** product per EAN and marks others **REPLACED** / suspended so only one sellable card wins.

Partner-specific rules live under each supplier section above (**Gardners** / **Buroomaailm**). See also [Availability Sync](/docs/commerce-ordering/availability-sync) and [Integration Reconciliation](/docs/integrations/INTEGRATION_RECONCILIATION).

## Cross-cutting code (all suppliers)

```
common/synchronizations/SyncHandlerFactory.php
common/synchronizations/nav/post/order/OrderXmlBuilder.php
common/synchronizations/nav/sync/AvailabilitySync.php
common/synchronizations/nav/sync/SalesStatSync.php
common/services/IntegrationPricingConfig.php
common/components/IntegrationOperationalService.php
common/config/params.php                       # availabilityLimits
environments/dev/common/config/params-local.php
```

## Sync Handler Factory

**File:** `common/synchronizations/SyncHandlerFactory.php`

Central factory that registers all sync handlers (NAV and external). Provides:

- Dynamic method generation for handler instantiation
- Handler name validation
- Options/parameters per handler

## Common Import Pattern

Each integration typically follows this pattern:

1. **Parser** reads the external data format (XML, CSV, API response)
2. **Normalizer** transforms external data into a standard internal structure
3. **Importer** persists the normalized data:
   - Creates or updates `Product` records
   - Maps categories via category map tables
   - Downloads and stores images (with configurable sync intervals)
   - Uses temporary status tables to track import state
4. **Spool** — Modified products are automatically queued for Elasticsearch indexing via `ElasticSpoolBehavior`

## Console Commands

Each integration has a dedicated controller or uses `SyncController`:

```bash
# Dedicated controllers
php yii gardners/import-products
php yii anvol/import-products
php yii insplay/import-products
php yii buroomaailm/import-products
php yii edrk/import-products
php yii raamatukoi/import-products

# Preferred Gardners ONIX path
php yii sync/onixFeedGardnersProductImporter

# Via SyncController (NAV / registered handlers)
php yii sync/<handlerName>
```

Most import commands use `AlreadyRunningFilter` to prevent concurrent execution.

## Related docs

- [Availability Sync](/docs/commerce-ordering/availability-sync) — origin / duplicate / `REPLACED` rules
- [Integration Reconciliation](/docs/integrations/INTEGRATION_RECONCILIATION) — integration rows, enable/disable, reconciliation
- [Pricing](/docs/commerce-ordering/pricing) — broader RR pricing by client type
- [Console Commands](/docs/reference/CONSOLE_COMMANDS) / [Cron Jobs](/docs/monitoring/CRON_JOBS) — scheduling in ops
