---
id: EXTERNAL_INTEGRATIONS
title: External Product Integrations
sidebar_label: External Integrations
---
# External Product Integrations

This document describes the external product data sources integrated into Rahva Raamat, how imports work, and where the code lives.

## Overview

Products from external suppliers are imported via various protocols (XML feeds, SOAP APIs, REST APIs, FTP). Each integration follows a similar pattern:

```
External Source → Parser → Normalizer → Importer → RR Database
                                                   → Spool (for ES indexing)
```

All integrations are located under `common/synchronizations/external/` and have corresponding console controllers.

## Integrations

### Gardners

**Directory:** `common/synchronizations/external/gardners/`

- **Protocol:** ONIX3 XML feed
- **Console:** `php yii gardners/<action>`
- **Key Files:**
  - `GardnersProductImporter.php` — Main importer
  - `GardnersProductNormalizer.php` — Data normalization
  - `OnixFeedGardnersProductImporter.php` — ONIX3-specific importer
  - `GardnersCategoryMapExporter.php` / `GardnersCategoryMapImporter.php` — Category mapping
- **Parsers** (`parsers/`):
  - `ONIX3XmlFeedParser` — ONIX 3 XML feed
  - `ProductXmlFileParser` — Generic product XML
  - `AvailabilityCsvFileParser` — Availability CSV
  - `PricesAndAvailabilityCsvFileParser` — Prices + availability CSV
  - `EUMarketAvailabilityCsvFileParser` — EU market availability
  - `ProductQuantityCsvFileParser` — Quantity data
  - `CategoryMapCsvFileParser` — Category mappings
- **Jobs:**
  - `UpdateGardnersProductImageFromNielsenJob` — Image enrichment from Nielsen
  - `UpdateGardnersBasedProductImageFromNavOrNielsenJob` — NAV/Nielsen image fallback
- **Builder:** `ProductBuilderWithPartialUpdateSupport` — Supports partial product updates

### Anvol

**Directory:** `common/synchronizations/external/anvol/`

- **Protocol:** XML file
- **Console:** `php yii anvol/import-products`, `anvol/import-category-map`, `anvol/import-delivery-method-offset`, `anvol/export-category-map`
- **Key Files:**
  - `AnvolProductImporter.php` — Main importer
  - `AnvolProductNormalizer.php` — Data normalization
  - `parsers/AnvolProductXmlFileParser.php` — XML parser
- **Temp table:** `__temp_anvol_status`
- **Image sync interval:** 14 days

### Insplay

**Directory:** `common/synchronizations/external/insplay/`

- **Protocol:** REST API (`https://api.insplay.eu/products`)
- **Console:** `php yii insplay/<action>`
- **Key Files:**
  - `InsplayProductImporter.php` — Main importer
  - `InsplayProductNormalizer.php` — Data normalization
- **Temp table:** `__temp_insplay_status`
- **Image sync interval:** 14 days

### Buroomaailm

**Directory:** `common/synchronizations/external/buroomaailm/`

- **Protocol:** FTP (directory `/v2/`), XML files
- **Console:** `php yii buroomaailm/<action>`
- **Key Files:**
  - `BuroomaailmProductImporter.php` — Main importer
  - `BuroomaailmProductNormalizer.php` — Data normalization
  - `parsers/BuroomaailmProductXmlFileParser.php` — XML parser
- **Temp table:** `__temp_bm_status`

### EDRK

**Directory:** `common/synchronizations/external/edrk/`

- **Protocol:** SOAP API (new API)
- **Console:** `php yii edrk/<action>`
- **Key Files:**
  - `EdrkProductImporter.php` — Main importer
  - `EdrkProductNormalizer.php` — Data normalization
  - `EdrkProductEpubImporter.php` — ePub file import
  - `EdrkProductAudioFileImporter.php` — Audio file import
  - `EdrkCategoryMapExporter.php` — Category map export
  - `EdrkResponseParserNewApi.php` — SOAP response parser
- **Price multiplier:** 1.0

### Raamatukoi

**Directory:** `common/synchronizations/external/raamatukoi/`

- **Protocol:** XML files
- **Console:** `php yii raamatukoi/<action>`
- **Key Files:**
  - `RaamatukoiProductImporter.php` — Main importer
  - `RaamatukoiProductNormalizer.php` — Data normalization
  - `RaamatukoiProductBuilder.php` — Product builder
  - `parsers/RaamatukoiProductXmlFileParser.php` — Product XML parser
  - `parsers/RaamatukoiProductStockXmlFileParser.php` — Stock XML parser
- **Temp table:** `__temp_raamatukoi_status`

### Other Integrations

| Integration | Directory | Notes |
|-------------|-----------|-------|
| Digira | `common/synchronizations/external/digira/` | Deprecated per console commands |
| Lasgo | `common/synchronizations/external/lasgo/` | Product + availability import |
| Nielsen | `common/synchronizations/external/nielsen/` | Image data enrichment for Gardners |
| Authors Republic | `common/synchronizations/external/authorsrepublic/` | Deprecated per console commands |
| Digiread | `common/synchronizations/external/digiread/` | Digital reading content |
| Custobar | via `console/controllers/CustobarController.php` | Marketing platform integration |

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

# Via SyncController (NAV-based)
php yii sync/<handlerName>
```

Most import commands use `AlreadyRunningFilter` to prevent concurrent execution.

