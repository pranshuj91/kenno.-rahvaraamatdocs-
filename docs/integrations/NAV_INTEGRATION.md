---
id: NAV_INTEGRATION
title: NAV ERP Integration
sidebar_label: NAV Integration
---
# NAV ERP Integration

This document describes the two-way integration between Rahva Raamat and Microsoft Dynamics NAV (ERP system).

## Overview

The NAV integration is bidirectional:

- **Sync (IN):** Pull data from NAV into the application (products, orders, availability, prices, clients, categories, etc.)
- **Post (OUT):** Push data from the application to NAV (orders, new products, clients, authors, series)

Communication uses SOAP/NTLM for outgoing posts and database-level sync (via temp tables) for incoming data.

**Admin does not talk to NAV directly.** Admin reads/writes **our** database. Background jobs are the bridge: SQL pulls from `navDb` on the way in, and SOAP posts on the way out.

### Approximate schedules (NAV)

| Job | Approx. schedule |
|-----|------------------|
| Order processing (including post to NAV) | Every ~2 minutes |
| Order sync from NAV | Every ~30 minutes |
| Availability / stock from NAV | Every ~35 minutes, 09:00–22:00 |
| Other NAV syncs (products, clients, prices, …) | Cron on server (Zone crontab; not in repo) |

Exact production crontab lives in the Zone.ee panel.

## Architecture

```
NAV ERP ←→ Rahva Raamat

INCOMING (Sync):
  NAV Database → NavTempTableSync → Temp Tables → Sync Handler → RR Database

OUTGOING (Post):
  RR Model → XmlBuilder → NavPoster (SOAP/NTLM) → NAV Web Service
  
LOGGING:
  All requests/responses → log_nav table (LogNav model)
```

## Incoming: Sync Handlers

**Directory:** `common/synchronizations/nav/sync/`

34 sync handlers that pull data FROM NAV:

### Core Product & Catalog Syncs

| Handler | Description |
|---------|-------------|
| `ProductSync` | Product data, attributes, images, categories, author associations. Cursor-based pagination |
| `ProductPriceSync` | Prices and discount information |
| `AvailabilitySync` | Inventory from physical shops (T1, KESK, VIRU, etc.). Safety threshold: 30k items minimum |
| `CategorySync` | Product categories |
| `EanSync` | EAN barcodes and duplicate EAN handling |
| `ProductDimensionSync` | Product dimensions (measurements) |
| `ProductCommentSync` | Product comments/reviews |
| `ProductProductPersonSync` | Product-to-person associations |
| `ProductCategorySync` | Product category associations |
| `ProductImageSync` | Product images |
| `ImageRepoSync` | Image repository |

### Order & Sales Syncs

| Handler | Description |
|---------|-------------|
| `OrderSync` | Updates orders from NAV. Only updates system-created orders (prefixed WT%, WN%). Pulls from `w_posted_documents` and `w_open_orders` |
| `SalesTopSync` | Top sales data |
| `SalesStatSync` | Sales statistics |
| `SalesHistorySync` | Historical sales data |
| `BoughtTogetherSync` | Cross-sell / bought together associations |

### Client & Business Syncs

| Handler | Description |
|---------|-------------|
| `ClientSync` | Customer/client data. Uses transaction rollback on error |
| `BusinessClientSync` | Wholesale/business client data |
| `CustomerPriceGroupSync` | Customer price groups |
| `CustomClientDiscountGroupSync` | Custom discount groups |
| `BusinessClientDiscountGroupSync` | Business client discount groups |
| `RealizationCustomerSync` | Customer realization/performance data |

### Other Syncs

| Handler | Description |
|---------|-------------|
| `AuthorSync` | Author/contributor data |
| `VendorSync` | Vendor information |
| `CampaignSync` | Campaign/promotion data |
| `GiftCardSync` | Gift card data |
| `GiftRecommendationSync` | Gift card recommendations |
| `WholesalePriceSync` | Wholesale pricing |
| `ProductDiscountGroupPriceSync` | Discount group pricing |
| `CountrySync` | Country/region data |
| `AwsEPubFileSync` | Sync e-pub files to AWS |
| `AwsDrmEPubFileSync` | DRM-protected e-pub files |

### Sync Infrastructure

**NavTempTableSync** (`common/synchronizations/nav/sync/NavTempTableSync.php`)
- Manages temporary table creation and syncing from NAV
- Cursor-based pagination for large datasets
- Batch processing with query parameter binding

**NavDataReader** (`common/synchronizations/nav/sync/NavDataReader.php`)
- Reads data in batches from NAV database
- Retry logic: 3 attempts for deadlock handling
- Cursor-based continuation across batches

**NavProductBuilder** (`common/synchronizations/nav/sync/NavProductBuilder.php`)
- Builds/updates product models from NAV data
- Handles transliteration, category mapping, classifier mapping, vendor mapping, image syncing

**Temp Tables** (`common/synchronizations/nav/sync/tables/`)
- 70+ temporary table definitions for staging NAV data
- Each extends a `TempTable` base class

## Outgoing: Post Handlers

**Directory:** `common/synchronizations/nav/post/`

### Post Handlers

| Handler | Description |
|---------|-------------|
| `OrderPost` | Posts orders to NAV via SOAP. Handles wholesale vs. regular orders, loyalty gift cards. Retry count: 2 |
| `ProductPost` | Posts new products to NAV, receives NAV codes. Queues products with `nav_sync_queued=1`. Handles barcode conflicts |
| `ClientPost` | Posts customer/client accounts. Uses strategy pattern (ClientAccountPostStrategy, CompanyAccountPostStrategy) |
| `AuthorPost` | Posts author data |
| `SeriesPost` | Posts product series |

### XML Builders

| Builder | Description |
|---------|-------------|
| `OrderXmlBuilder` | Order XML (payment, amounts, delivery, recipients, line items) |
| `WholesaleOrderXmlBuilder` | Wholesale order variant |
| `LoyaltyGiftCardOrderXmlBuilder` | Gift card order variant |
| `ProductXmlBuilder` | Product XML payload |
| `ClientAccountXmlBuilder` | Customer account XML |
| `CompanyAccountXmlBuilder` | Company account XML |
| `AuthorXmlBuilder` | Author XML |
| `SeriesXmlBuilder` | Product series XML |

### NavPoster (SOAP Client)

**File:** `common/synchronizations/nav/post/NavPoster.php`

Core SOAP communication handler:

- NTLM authentication via SoapClient
- XML validation against XSD schemas
- Logs all requests/responses to `log_nav` table via `LogNav` model
- Configurable for test vs. production WSDL
- SOAP connection timeout: 30 seconds

#### WEBImport endpoints (ops reference)

When an order / customer / new product is posted, XML is sent to NAV Codeunit `WEBImport`:

| Env | Endpoint |
|-----|----------|
| Production | `http://kontor.rahvaraamat.ee:7067/DynamicsNAV80_WS_WEB/WS/Rahva%20Raamat%20AS/Codeunit/WEBImport` |
| Test | `http://kontor.rahvaraamat.ee:8047/TEST_DynamicsNAV80_TEST/WS/Rahva%20Raamat%20AS/Codeunit/WEBImport` |

Auth: NTLM. Every outgoing call is stored in `log_nav` (request XML + response XML).

### WSDL Schema Files

**Directory:** `common/synchronizations/nav/post/schema/`
- `nav-test.wsdl` — Test environment
- `nav-production.wsdl` — Production environment
- `nav-multistore.wsdl` — Multi-store variant

## Configuration

**File:** `common/config/params.php`

- `ENABLE_NAV_POST` constant — Controls whether posts are actually sent to NAV
- WSDL file selection: `nav-test.wsdl` (TEST) or `nav-production.wsdl` (PRODUCTION)
- SOAP connection timeout: 30 seconds
- Loyalty gift card NAV code: `300081`

## Auto-Queue Behavior

**File:** `common/behaviours/NavSyncQueuedBehaviour.php`

Attached to models to automatically set `nav_sync_queued=1` when tracked attributes are modified. This flags the record for the next outgoing sync cycle.

## Error Handling

### Custom Exceptions

**Directory:** `common/exceptions/external/`

| Exception | When Thrown |
|-----------|------------|
| `InvalidResponseException` | NAV response is invalid or malformed |
| `ConnectionException` | SOAP connection fails |
| `InternalProcessingException` | Internal processing error during sync |

### Error Patterns

- **Post handlers:** Wrap operations in try-catch, log errors, update order status to `PENDING_NAV_PROCESSING` on failure
- **Sync handlers:** Use database transactions with rollback on exception
- **NavPoster:** Catches `SoapFault`, calls `externalExceptionHandler` if set, otherwise throws `InvalidResponseException`
- **Deadlock recovery:** `NavDataReader` retries up to 3 times on deadlock

## Audit Logging

**File:** `common/models/LogNav.php`

Table: `log_nav`

All NAV API interactions are logged with:

- Datetime
- Request XML
- Response XML
- Element class (which entity type)
- Element ID

### Where to view in Admin

| Page | What you see | Who can see it |
|------|----------------|----------------|
| Debug → **NAV logi** | Full request XML + response XML per call | Debugger role |
| Order debug | Last NAV XML for that order | Debugger role |

Empty SOAP responses in **NAV logi** usually indicate a problem. There is no separate public “API request log” site — NAV outgoing is the integration with a full request/response viewer in Admin.

## Console Commands

Sync handlers are invoked dynamically via `SyncController`:
```bash
php yii sync/productSync
php yii sync/orderSync --webStoreNavCode=WEB
php yii sync/availabilitySync --markPermanentlyOutOfStockProducts=1
```

Post operations are triggered as part of order processing:
```bash
php yii order/process --postToNav=1
```

Admin UI for manual single-product sync:
- `admin/modules/shop/controllers/SyncController.php`
- Form: `admin/models/forms/SyncNavProductForm.php`

## Sync Handler Factory

**File:** `common/synchronizations/SyncHandlerFactory.php`

Central factory that registers 40+ sync handlers. Maps handler names to classes and provides:
- `getValidHandlerNames()` — List of available sync handler names
- `getHandlerOptions($actionId)` — Options/parameters per handler
- Dynamic method generation (e.g., `getNavProductSyncHandler()`)

