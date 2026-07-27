---
id: availability-sync
title: Availability Sync
sidebar_label: Availability Sync
---
# AvailabilitySync — deep dive

This document explains, in detail, how the NAV availability synchronization works via common/synchronizations/nav/sync/AvailabilitySync.

It covers: data sources, temporary tables, classification rules, duplicate suppression, special handling for preorders, ebooks and audiobooks, and how to run and schedule the job.


## How to run
- Console action: php yii sync/availabilitySync
  - The dynamic action name is the class short name with a lowercase first letter, exposed by console/controllers/SyncController via SyncHandlerFactory.
- Options
  - --markPermanentlyOutOfStockProducts=1
    - If set, products imported from NAV with no availability rows in the current NAV payload are force-marked PERMANENTLY_OUT_OF_STOCK (with exclusions, see below).

## Schedule
- Typically run by cron at every 35th minute past every hour from 9 through 22 (see AVAILABILITY.md). Frequency can be adjusted per environment.

## High-level phases
1) Pull availability from NAV into a temp table
2) Normalize and filter the temp table against our shops/products
3) Rebuild rr_product_availability fully from the temp
4) Classify product availability and compute stock_count into a staging table
5) Promote only changes into rr_product (availability_type_id, stock_count)
6) Post-phase updates: back-in-stock notifications, ebooks/audiobooks status, duplicate suppression and status resolution, preorder adjustments

Each phase is detailed below.

---

## 1) NAV source: ItemsAvailableForWeb
- Source table in NAV: [ItemsAvailableForWeb]
- Selected fields:
  - [Item] → temp.code
  - [Location] → temp.location
  - [Quantity] → temp.quantity
- Mechanism: NavTempTableSync streams the NAV query into a temporary MySQL table represented by AvailabilityTable.

## 2) Normalize temp against rr_shop and rr_product
- processTempTable(AvailabilityTable):
  - Enrich temp rows with:
    - shop_id by joining rr_shop on nav_code = temp.location
    - product_id by joining rr_product where:
      - product source_type is IMPORT_NAV or MANUAL
      - rr_product.nav_product_code = temp.code
      - product status is in \{CONFIRMED, REPLACED, SUSPENDED\}
  - Drop rows with product_id IS NULL (no matching product in our catalog); log how many were removed.
  - Drop rows with quantity = 0 (we don’t store zeroes in per-shop availability).
  - Autocreate missing shops: for any temp.location with no rr_shop match, insert a new rr_shop row with is_visible=0, is_active=1, then update temp.shop_id accordingly. This prevents the sync from failing due to previously unknown locations.

Notes
- Negative quantities from NAV are tolerated. They are kept (only quantity=0 is removed) and logged in aggregate during stage 3. Later classification uses SUM(amount_available), which can be negative; see Section 4.

## 3) Rebuild rr_product_availability (per-shop stock table)
- Complete rebuild each run:
  - DELETE FROM rr_product_availability; ALTER TABLE … AUTO_INCREMENT = 1
  - INSERT INTO rr_product_availability(product_id, shop_id, amount_available, updated, created)
    SELECT product_id, shop_id, quantity FROM temp
    ON DUPLICATE KEY UPDATE amount_available = VALUES(amount_available), updated = NOW()
- Logging: the sync outputs total count from NAV and the number of negatives found. Count of inserted vs updated is computed using the MySQL "insert … on duplicate" rows-affected formula.

Rationale
- Availability is transient and must match NAV. Rebuilding ensures full fidelity to the current NAV payload and avoids stale per-shop rows lingering.

## 4) Classify availability and compute stock_count
- Build a staging table: ProductAvailabilityTempTable with columns: product_id, stock_count, source_type_id, type_id, created_nav, availability_type_id
- stock_count is computed as SUM(amount_available) across a curated list of shops only:
  - Static whitelist AvailabilitySync::$availabilityShops contains NAV codes we consider for e-shop stock calculation: T1, KESK, VIRU, VANA, MUSTI, TASKU, NARVA, TELLISK, KRISTI, KINKROC, RAKVE, JÕHVI, SUVI, SAARE, WILJ, VÕRU, ARTER
  - The list is mapped at runtime to rr_shop IDs and also requires rr_shop.is_active = 1 and rr_shop.is_stock_calculation_allowed = 1.

- Base classification CASE (applies to IMPORT_NAV and MANUAL products; excludes VIRTUAL_GIFT_CARD, EBOOK, GIFT_CARD, AUDIOBOOK types):
  - Preserve COMING_SOON for manually added products with zero stock:
    - If stock_count = 0 AND current availability_type = COMING_SOON AND source_type = MANUAL → keep COMING_SOON
  - Keep PERMANENTLY_OUT_OF_STOCK only when still below safe limits:
    - If current availability_type = PERMANENTLY_OUT_OF_STOCK AND stock_count &lt;= per-type threshold → keep PERMANENTLY_OUT_OF_STOCK
      - Thresholds are configurable via params['availabilityLimits']:
        - OFFICE_EQUIPMENT: limit (and must also have a thumbnail to ever become AVAILABLE)
        - MEDIA types (MUSIC, MOVIE, GAME): typeMedia
        - USED_BOOK: dedicated limit
        - BOOK: language-specific limits for ET, EN, RU (PRODUCT_LANGUAGE classifier)
        - Default fallback when no specific rule applies
  - AVAILABLE when above safe limits:
    - OFFICE_EQUIPMENT: stock_count > limit AND thumb_file_name IS NOT NULL
    - MEDIA (MUSIC/MOVIE/GAME): stock_count > typeMedia limit
    - USED_BOOK: stock_count > used-book limit
    - BOOK: stock_count > language-specific limit
    - Otherwise if stock_count > default limit
  - TEMPORARILY_OUT_OF_STOCK for everything else (including OFFICE_EQUIPMENT without image)

- Then, override to AVAILABLE_IN_SHOP when e-shop stock below threshold but there is any visible shop availability:
  - If availability currently TEMPORARILY_OUT_OF_STOCK or PERMANENTLY_OUT_OF_STOCK AND total availability across rr_shop.is_visible=1 shops > 0 → set AVAILABLE_IN_SHOP

- Then, mark certain NAV products as COMING_SOON (first-time arrival heuristic):
  - If source_type = IMPORT_NAV AND there are no rows in rr_product_availability AND no sales stats (rr_product_sell_statistics, rr_product_sell_statistics_web_store) AND created_nav is within the last 3 months (or NULL) → set COMING_SOON

- Promote only changed rows:
  - Build a temporary table nav_product_availability_temp consisting only of rows where either stock_count or availability_type_id differs from rr_product, or rr_product.stock_count is NULL
  - Truncate and fill ProductAvailabilityTempTable with only these changes for the next phase

Thresholds reference
- Config-driven via Yii::$app->params['availabilityLimits'] (per type/language and a default). See application params for concrete numbers.

## 5) Apply to rr_product
- updateAvailability():
  - UPDATE rr_product p
    INNER JOIN ProductAvailabilityTempTable pt ON p.id = pt.product_id
    SET p.availability_type_id = pt.availability_type_id,
        p.stock_count = pt.stock_count,
        p.updated = NOW()

- Preorder adjustments:
  - markPreorderItemsAsAvailable(): if delivery_time_type = PREORDER, force availability_type = AVAILABLE so the item can be purchased as a preorder.
  - markPreorderProductsDeliverable(): when a preorder item has any availability in the selected shops and either preorder_end_date is NULL or past:
    - Clear availability_date and preorder_end_date
    - Switch delivery_time_type depending on source/type:
      - EBOOK/AUDIOBOOK → INSTANT_DOWNLOAD
      - IMPORT_NAV or MANUAL → DAYS_1_7
      - IMPORT_GARDNERS → WEEKS_2_4

- Spooling integration: sets @spool_start at the beginning, and calls CALL product_spooler_commit(@spool_start) before committing. This triggers product spoolers (e.g., for search indexing) to process only changes since spool_start.

## 6) Post-phase updates

### 6.1 Back in stock notifications
- updateBackInStockNotification():
  - Reset all rr_back_in_stock_notification.is_in_stock = 0
  - Set is_in_stock = 1 where linked product has availability_type IN (AVAILABLE) and delivery_time_type != PREORDER

### 6.2 E-books availability
- setEbooksAvailabilityStatus():
  - For products of type EBOOK imported via NAV/MANUAL (sources 142, 143), mark as AVAILABLE when an EPUB binary marker (epub_file_extension or epub_file_version) is present; otherwise mark as TEMPORARILY_OUT_OF_STOCK.
  - This is an additional guard: digital items are considered available based on file presence, independent of shop stock.

### 6.3 Audiobooks availability
- setAudiobooksAvailabilityStatus():
  - For type AUDIOBOOK with sources in \{IMPORT_NAV, MANUAL, IMPORT_EDRK\}:
    - If status != NOT_CONFIRMED → availability AVAILABLE
    - If status == NOT_CONFIRMED → availability TEMPORARILY_OUT_OF_STOCK

### 6.4 Duplicate suppression and status resolution
Goal: For products sharing the same EAN across multiple sources, determine the origin product and disable duplicates to keep catalog clean and avoid confusing users.

Key temporary tables
- AvailabilityDuplicateRuntimeTable (__availability_duplicate_runtime)
  - Filled from rr_product and rr_product_ean (both primary EAN and alternate EANs)
  - Holds ean, product_id, source_type_id, is_active, status_type_id, vendor_id, availability_type_id, plus working flags is_updated/is_duplicate
- DuplicateEanTable (__nav_duplicate_ean)
  - All EANs appearing on more than one product_id
- OriginEanTable (__nav_origin_ean)
  - Chosen origin product per EAN (one product_id per ean)
- AvailabilityOriginRuntimeTable (__availability_origin_runtime)
  - One row per product_id with resolved availability_type_id and final status_type_id to apply

Process
1) Initialize all potential duplicates:
   - fillAvailabilityRuntimeTable(): insert rows for all products with valid EAN, and also all alternate EANs from rr_product_ean
   - fillDuplicateEanTable(): insert EANs occurring on more than one product
2) Reset working statuses: set all rows previously marked REPLACED back to CONFIRMED in the runtime table so the algorithm recomputes them fresh
3) Suspend out-of-stock external products (suspendNotAvailableExternalProducts):
   - For products with source_type in \{IMPORT_ANVOL, IMPORT_BUROOMAAILM, IMPORT_INSPLAY\}
   - If availability_type is TEMPORARILY_OUT_OF_STOCK or PERMANENTLY_OUT_OF_STOCK → mark status_type = REPLACED (hidden)
4) NAV/MANUAL duplicates of external products: constrain their availability based on RR shops only (updateExternalSourceDuplicatesAvailability):
   - For any EAN that exists both as an external product and as NAV/MANUAL product(s):
     - Compute SUM(amount_available) in the selected shops; if NULL or &lt; 1 → force availability_type = TEMPORARILY_OUT_OF_STOCK for the NAV/MANUAL counterpart(s)
   - This ensures that if we do not physically have it in our own shops, the NAV/MANUAL duplicates won’t incorrectly show as available when the external source holds stock.
5) Choose origin products (saveProductsAsOrigin, saveExternalProductsAsOrigin):
   - Insert into OriginEanTable a row (ean, product_id) for candidates that are active, CONFIRMED and available (AVAILABLE or AVAILABLE_IN_SHOP)
   - Per-source special handling:
     - For Buroomaailm, Anvol, Insplay: use their importer-provided vendor exclusion lists (getNotOriginVendorIds). Only those EANs appearing under excluded vendors will be set as origin from those external sources; otherwise we fall back to the general rule.
   - Additionally, we persist origin rows for the main sources in order: IMPORT_NAV, MANUAL, IMPORT_EDRK, IMPORT_DIGIRA, IMPORT_GARDNERS (actual precedence is implicitly determined by insert order and IGNORE semantics).
6) Disable remaining duplicates by EAN:
   - For any EAN present in OriginEanTable, every other product_id with that EAN is marked REPLACED and flagged as is_duplicate.
   - Special Buroomaailm rule (markBuroomaailmNotOriginProductsAsReplaced): if a Buroomaailm product remains CONFIRMED yet is not the origin for its EAN, mark it REPLACED as well.
7) Consolidate the result and apply to rr_product:
   - fillAvailabilityOriginRuntimeTable():
     - Build one row per product in AvailabilityOriginRuntimeTable with the intended availability_type and final status_type
     - CONFIRMED for origin products, REPLACED for rows flagged is_duplicate, otherwise retain the runtime status
   - Update rr_product by joining on this table: set availability_type_id and status_type_id (plus updated timestamps)
8) Spool commit and transaction

---

## Edge cases and safeguards
- Minimum dataset size: if NAV temp row count is &lt; 30,000, the sync aborts with an error to avoid corrupting the site with a partial NAV export.
- Negative quantities: counted and logged, not dropped (only zero is dropped). They participate in SUM(amount_available) and can lead to TEMPORARILY_OUT_OF_STOCK unless overridden by AVAILABLE_IN_SHOP or other rules.
- OFFICE_EQUIPMENT images: items of this type require a thumbnail to ever become AVAILABLE; otherwise they remain TEMPORARILY_OUT_OF_STOCK even with stock.
- COMING_SOON preservation: manually created products in COMING_SOON remain so when stock_count = 0, to avoid prematurely flipping state.
- Preorder promotions to deliverable: once shop availability appears, delivery_time is moved off PREORDER (based on source/type) and dates cleared.
- Digital items are handled post-sync by file presence (ebooks) and status (audiobooks), independent of rr_product_availability.

## Data touched
- Read
  - NAV [ItemsAvailableForWeb]
  - rr_shop, rr_product, rr_product_availability, rr_product_sell_statistics, rr_product_sell_statistics_web_store, rr_product_ean
- Write
  - rr_product_availability (full rebuild)
  - rr_product (availability_type_id, stock_count, delivery_time_type_id, availability_date, preorder_end_date, status_type_id)
  - rr_shop (auto-insert of unknown NAV locations; invisible by default)
  - rr_back_in_stock_notification (is_in_stock)
  - Runtime temp tables used during updateSuspendedStatuses: __availability_duplicate_runtime, __nav_duplicate_ean, __nav_origin_ean, __availability_origin_runtime

## Discoverability in code
- Handler class: common/synchronizations/nav/sync/AvailabilitySync.php
- Action wiring: console/controllers/SyncController.php + common/synchronizations/SyncHandlerFactory.php
- Temp/runtime table helpers:
  - common/synchronizations/nav/sync/tables/AvailabilityTable
  - common/synchronizations/nav/sync/tables/ProductAvailabilityTempTable
  - common/synchronizations/nav/sync/tables/AvailabilityDuplicateRuntimeTable
  - common/synchronizations/nav/sync/tables/OriginEanTable
  - common/synchronizations/nav/sync/tables/DuplicateEanTable
  - common/synchronizations/nav/sync/tables/AvailabilityOriginRuntimeTable

## Operational tips
- If NAV export drops unexpectedly low, the sync will abort. Investigate NAV [ItemsAvailableForWeb] and NAV connectivity before forcing updates.
- To force marking NAV-imported items without any availability as PERMANENTLY_OUT_OF_STOCK (outside regular rules), pass --markPermanentlyOutOfStockProducts=1.
- Changes trigger the product spooler to update secondary systems (e.g., search). Monitor spoolers if availability updates do not reflect in frontend search.
- For external suppliers (Anvol, Buroomaailm, Insplay), be aware of the duplicate suppression: out-of-stock items can be auto-REPLACED, and origin selection may depend on vendor exclusions supplied by importer implementations.



