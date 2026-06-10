id: CONSOLE_COMMANDS
title: CONSOLE COMMANDS
# Console Commands Documentation

## Overview

The Rahvaraamat console application provides command-line tools for data management, system maintenance, synchronization, and development tasks. Built on Yii2 framework, it offers comprehensive functionality for managing the e-commerce platform.

**Base Command**: `php yii`  
**Environment**: Development, Staging, Production  
**Framework**: Yii2 Console Application

## How to Run Console Commands

### **Basic Command Structure**

```bash
# General format
php yii <controller>/<action> [parameters] [options]

# Examples
php yii db/import
php yii order/process --orderId=123
php yii cleanup/index --noPrompt=1
```

### **Environment-Specific Commands**

```bash
# Development environment
php yii <controller>/<action>

# Production environment (with environment file)
php environments/prod/yii <controller>/<action>

# Docker environment
docker exec -it rahvaraamat php yii <controller>/<action>
```

### **Common Options**

```bash
# Verbose output
php yii <controller>/<action> --verbose=1

# No prompts (automated execution)
php yii <controller>/<action> --noPrompt=1

# Help for specific command
php yii <controller>/<action> --help
```

## Console Controllers

### **Base Controller** (`console/controllers/BaseController.php`)

Base controller providing common functionality for all console commands.

**Key Features**:
- **Process Management**: Signal handling and termination
- **Performance Monitoring**: Execution time and memory usage tracking
- **Logging**: Colored console output with different log levels
- **Transaction Management**: Automatic rollback on termination

**Common Methods**:
- `log($message, $level)` - Log messages with color coding
- `checkPrompt($message, $noPrompt)` - User confirmation prompts
- `terminationHandler()` - Graceful process termination

### **Database Management Controllers**

#### **DbController** (`console/controllers/DbController.php`)
Database import/export and setup operations.

**Key Commands**:
```bash
# Import SQL dump
php yii db/import [path]

# Export database to SQL file
php yii db/export [path]

# Create admin user
php yii db/create-admin [email]

# Create test user
php yii db/create-test-user [email]

# Add default client account notifications
php yii db/add-default-client-account-notifications

# Populate product tags
php yii db/populate-product-tags <keyword> <tags>
```

**Usage Examples**:
```bash
# Import from default path
php yii db/import

# Export to specific directory
php yii db/export /backups/

# Create admin with specific email
php yii db/create-admin admin@rahvaraamat.ee
```

#### **DataMigrationController** (`console/controllers/DataMigrationController.php`)
Data migration and transformation operations.

**Key Commands**:
```bash
# Main database migration
php yii data-migration/migrate

# User data migration
php yii data-migration/migrate-user-data

# Client data migration
php yii data-migration/migrate-client-data

# Blog data migration
php yii data-migration/migrate-blog-data

# Product ID migration
php yii data-migration/migrate-product-id-data

# Vendor data migration
php yii data-migration/migrate-vendor-data

# Product data migration
php yii data-migration/migrate-product-data

# Product description migration
php yii data-migration/migrate-product-description-data

# Order data migration
php yii data-migration/migrate-order-data

# Discount code migration
php yii data-migration/migrate-discount-code-data

# Gift card migration
php yii data-migration/migrate-gift-card-data

# Product list migration
php yii data-migration/migrate-product-list-data

# Content page migration
php yii data-migration/migrate-content-page-data

# Product-person relationship migration
php yii data-migration/migrate-product-product-person-data
```

### **Order Processing Controllers**

#### **OrderController** (`console/controllers/OrderController.php`)
Order processing and management operations.

**Key Commands**:
```bash
# Process pending orders
php yii order/process [--orderId=<id>] [--postToNav=<bool>]

# Process pending non-refundable orders
php yii order/process-pending-non-refundable-state
```

**Options**:
- `--orderId` - Process specific order ID
- `--postToNav` - Post orders to NAV system (default: true)

**Usage Examples**:
```bash
# Process all pending orders
php yii order/process

# Process specific order
php yii order/process --orderId=123

# Process without NAV posting
php yii order/process --postToNav=0
```

#### **WholesaleOrderController** (`console/controllers/WholesaleOrderController.php`)
Wholesale order processing and management.

**Key Commands**:
```bash
# Process wholesale orders
php yii wholesale-order/process

# Generate wholesale reports
php yii wholesale-order/generate-reports
```

### **Cleanup and Maintenance Controllers**

#### **CleanupController** (`console/controllers/CleanupController.php`)
System cleanup and maintenance operations.

**Key Commands**:
```bash
# Run all cleanup processes
php yii cleanup/index

# Clean specific cache
php yii cleanup/clean-cache <key>

# Flush entire cache
php yii cleanup/flush-cache

# Cleanup playback breakpoints
php yii cleanup/playback-breakpoints

# Cleanup failed orders
php yii cleanup/failed-orders [--noPrompt=<bool>] [--interval=<seconds>]

# Cleanup failed logins
php yii cleanup/failed-logins [--noPrompt=<bool>] [--interval=<seconds>]

# Cleanup obsolete products
php yii cleanup/obsolete-products [--noPrompt=<bool>] [--interval=<seconds>]

# Cleanup failed async processes
php yii cleanup/failed-async-processes [--noPrompt=<bool>] [--interval=<seconds>]

# Sanitize client baskets
php yii cleanup/client-basket-sanitize [--noPrompt=<bool>]

# Cleanup queue
php yii cleanup/queue

# Cleanup outdated session actions
php yii cleanup/outdated-session-actions
```

**Cleanup Intervals**:
- **Failed Orders**: 8 hours (28,800 seconds)
- **Failed Logins**: 30 days (2,592,000 seconds)
- **Failed Async Processes**: 8 hours (28,800 seconds)
- **Obsolete Products**: 60 days (5,184,000 seconds)
- **Guest Cookies**: 30 days (2,592,000 seconds)
- **Empty Baskets**: 24 hours (86,400 seconds)

**Usage Examples**:
```bash
# Run all cleanup processes
php yii cleanup/index

# Cleanup failed orders with prompt
php yii cleanup/failed-orders

# Cleanup failed orders without prompt
php yii cleanup/failed-orders --noPrompt=1

# Cleanup with custom interval (7 days)
php yii cleanup/failed-logins --interval=604800
```

### **Health Check Controllers**

#### **HealthCheckController** (`console/controllers/HealthCheckController.php`)
System health monitoring and diagnostics.

**Key Commands**:
```bash
# Check Kafka connectivity
php yii health-check/kafka

# Check Wowza streaming service
php yii health-check/wowza

# Check subscription service integrity
php yii health-check/subscription-service
```

**Usage Examples**:
```bash
# Test Kafka event publishing
php yii health-check/kafka

# Verify streaming service availability
php yii health-check/wowza

# Check for broken subscriptions
php yii health-check/subscription-service
```

### **Synchronization Controllers**

#### **SyncController** (`console/controllers/SyncController.php`)
External system synchronization operations.

**Key Commands**:
```bash
# Sync with NAV ERP system
php yii sync/nav-sync

# Sync product images to AWS S3
php yii sync/aws-product-image-sync

# Sync EPUB files to AWS S3
php yii sync/aws-epub-file-sync

# Sync DRM EPUB files
php yii sync/aws-drm-epub-file-sync

# Import Gardners ONIX feed
php yii sync/onix-feed-gardners-product-importer
```

**Usage Examples**:
```bash
# Sync products with NAV
php yii sync/nav-sync

# Upload product images to S3
php yii sync/aws-product-image-sync

# Upload EPUB files to S3
php yii sync/aws-epub-file-sync
```

### **Notification Controllers**

#### **NotificationController** (`console/controllers/NotificationController.php`)
Email and push notification management.

**Key Commands**:
```bash
# Generate notifications
php yii notification/generate <type> [--dayOffset=<days>] [--webStoreNavCode=<code>]

# Send notifications
php yii notification/send [--webStoreNavCode=<code>]

# Clear expired notifications
php yii notification/clear-expired
```

**Notification Types**:
- `basket` - Basket reminder notifications
- `order` - Order feedback reminders
- `offers` - Special offer notifications

**Usage Examples**:
```bash
# Generate basket reminders
php yii notification/generate basket

# Generate order feedback reminders
php yii notification/generate order

# Generate special offers
php yii notification/generate offers

# Send all pending notifications
php yii notification/send

# Generate notifications for specific web store
php yii notification/generate basket --webStoreNavCode=WEB
```

### **Statistics Controllers**

#### **StatisticController** (`console/controllers/StatisticController.php`)
Statistical data processing and aggregation.

**Key Commands**:
```bash
# Sync blog statistics
php yii statistic/sync-blog-stat
```

**Usage Examples**:
```bash
# Update blog view counts
php yii statistic/sync-blog-stat
```

### **Subscription Controllers**

#### **SubscriptionController** (`console/controllers/SubscriptionController.php`)
Subscription management and billing operations.

**Key Commands**:
```bash
# Process subscription billing
php yii subscription/process-billing

# Generate subscription reports
php yii subscription/generate-reports

# Sync subscription data
php yii subscription/sync-data
```

### **Product Management Controllers**

#### **ProductStatisticsController** (`console/controllers/ProductStatisticsController.php`)
Product statistics and analytics.

**Key Commands**:
```bash
# Calculate product statistics
php yii product-statistics/calculate

# Generate product reports
php yii product-statistics/generate-reports
```

#### **ProductDiscountController** (`console/controllers/ProductDiscountController.php`)
Product discount management.

**Key Commands**:
```bash
# Apply product discounts
php yii product-discount/apply

# Calculate discount statistics
php yii product-discount/calculate-statistics
```

#### **ProductBadgeController** (`console/controllers/ProductBadgeController.php`)
Product badge and label management.

**Key Commands**:
```bash
# Assign product badges
php yii product-badge/assign

# Update badge statistics
php yii product-badge/update-statistics
```

### **Content Management Controllers**

#### **SitemapController** (`console/controllers/SitemapController.php`)
Sitemap generation and management.

**Key Commands**:
```bash
# Generate sitemap
php yii sitemap/generate

# Update sitemap
php yii sitemap/update

# Generate specific sitemap type
php yii sitemap/generate-product
php yii sitemap/generate-category
php yii sitemap/generate-blog
```

#### **FeedExporterController** (`console/controllers/FeedExporterController.php`)
Data feed export operations.

**Key Commands**:
```bash
# Export product feed
php yii feed-exporter/export-products

# Export category feed
php yii feed-exporter/export-categories
```

### **External Integration Controllers**

#### **CustobarController** (`console/controllers/CustobarController.php`)
Custobar analytics integration.

**Key Commands**:
```bash
# Sync customer data
php yii custobar/sync-customers

# Sync order data
php yii custobar/sync-orders

# Sync product data
php yii custobar/sync-products
```

#### **KlaviyoController** (`console/controllers/KlaviyoController.php`)
Klaviyo email marketing integration.

**Key Commands**:
```bash
# Sync customer data
php yii klaviyo/sync-customers

# Sync order data
php yii klaviyo/sync-orders
```

#### **KafkaController** (`console/controllers/KafkaController.php`)
Apache Kafka event streaming.

**Key Commands**:
```bash
# Publish events
php yii kafka/publish

# Consume events
php yii kafka/consume
```

### **File Management Controllers**

#### **FileController** (`console/controllers/FileController.php`)
File operations and management.

**Key Commands**:
```bash
# Upload files to S3
php yii file/upload-to-s3

# Download files from S3
php yii file/download-from-s3

# Cleanup orphaned files
php yii file/cleanup-orphaned
```

### **Elasticsearch Controllers**

#### **ElasticController** (`console/controllers/ElasticController.php`)
Elasticsearch indexing and management.

**Key Commands**:
```bash
# Reindex all data
php yii elastic/reindex

# Update product index
php yii elastic/update-product-index

# Update category index
php yii elastic/update-category-index

# Optimize index
php yii elastic/optimize
```

### **Development and Debug Controllers**

#### **DebugController** (`console/controllers/DebugController.php`)
Development and debugging tools.

**Key Commands**:
```bash
# Test transliteration
php yii debug/transliteration

# Resolve email conflicts
php yii debug/email-update-conflict-resolver

# Test EveryPay integration
php yii debug/every-pay

# Process order product
php yii debug/process-order-product <orderProductId>

# Test product builder
php yii debug/product-builder

# Test external date calculation
php yii debug/external-date-calculation

# Test translation
php yii debug/translation

# Bulk indexation approver
php yii debug/bulk-indexation-approver <id>

# Test delivery message
php yii debug/delivery-message

# Test repositories
php yii debug/repositories <categoryId> <productTypeId>

# Generate hash
php yii debug/hash

# Reprocess orders
php yii debug/re-process-orders

# Test ebook download
php yii debug/ebook-download <orderId>

# Test pin generation
php yii debug/pin

# Send gift card
php yii debug/send-gift-card <voucherGiftCardId>

# Test STACC integration
php yii debug/stacc

# Test DRM purchase
php yii debug/drm-purchase <orderProductId>

# Test wholesale order
php yii debug/wholesale-order

# Test wholesale price
php yii debug/wholesale-price

# Resubmit lost orders
php yii debug/resubmit-lost-orders

# Test date/time
php yii debug/date-time

# Test client accounts
php yii debug/client-accounts

# Add purchased ebook
php yii debug/add-purchased-ebook

# Test transliteration
php yii debug/transliterate

# Test price calculation
php yii debug/price

# Test general operations
php yii debug/run

# Test Nielsen integration
php yii debug/nielsen

# Test ebook processing
php yii debug/ebook <orderId>

# Test category page
php yii debug/category-page

# Test working hours
php yii debug/working-hours

# Test company operations
php yii debug/company

# Test delivery method offset
php yii debug/delivery-method-offset

# Test delivery fee international
php yii debug/delivery-fee-international

# Test delivery method price
php yii debug/delivery-method-price

# Test shop operations
php yii debug/shop

# Test logistic destination
php yii debug/logistic-destination

# Test order operations
php yii debug/order

# Test voucher gift card
php yii debug/voucher-gift-card

# Test email template
php yii debug/email-template

# Test client basket
php yii debug/client-basket

# Test SmartPost integration
php yii debug/smart-post

# Test logging
php yii debug/log

# Test Gardners prices
php yii debug/gardners-prices

# Test delivery operations
php yii debug/delivery

# Test download operations
php yii debug/download

# Test Edrk purchase
php yii debug/edrk-purchase <orderProductId>

# Test Digira purchase
php yii debug/digira-purchase <orderProductId>

# Test general index
php yii debug/index

# Test order post request
php yii debug/order-post-request

# Test other product operations
php yii debug/other-product

# Test product description
php yii debug/product-description [limit] [offset]

# Generalize product image sequence
php yii debug/generalize-product-image-sequence

# Cleanup Buroomaailm products
php yii debug/cleanup-buroomaailm-products

# Suspend Buroomaailm products
php yii debug/suspend-buroomaailm-products

# Reactivate NAV products
php yii debug/reactivate-nav-products

# Delete special offer product duplicates
php yii debug/delete-special-offer-product-duplicates

# Test playback operations
php yii debug/playback

# Create test plan
php yii debug/create-test-plan

# Populate test audio subscription
php yii debug/populate-test-audio-subscription

# Test LCP one-time operations
php yii debug/lcp-one-time

# Test LCP operations
php yii debug/lcp

# Calculate EPUB pages count
php yii debug/calculate-epub-pages-count

# Test user pass phrase
php yii debug/user-pass-phrase <encryptedUserPassPhrase>

# Test order validation
php yii debug/order-validation

# Test timestamp operations
php yii debug/timestamp

# Test NAV operations
php yii debug/nav [cursor]

# Test reference number
php yii debug/reference-number <id>

# Send subscription email
php yii debug/send-subscription-email <id>
```

#### **TempController** (`console/controllers/TempController.php`)
Temporary development and testing scripts.

**Key Commands**:
```bash
# Various temporary development scripts
php yii temp/<action>
```

### **RBAC Management Controllers**

#### **RbacController** (`console/controllers/RbacController.php`)
Role-based access control management.

**Key Commands**:
```bash
# Initialize RBAC system
php yii rbac/init

# Create roles and permissions
php yii rbac/create-roles

# Assign permissions to roles
php yii rbac/assign-permissions
```

### **External Service Controllers**

#### **AuthorsRepublicController** (`console/controllers/AuthorsRepublicController.php`)
Authors Republic integration.

**Key Commands**:
```bash
# Sync Authors Republic data
php yii authors-republic/sync

# Import Authors Republic products
php yii authors-republic/import-products
```

#### **BuroomaailmController** (`console/controllers/BuroomaailmController.php`)
Buroomaailm integration.

**Key Commands**:
```bash
# Sync Buroomaailm data
php yii buroomaailm/sync

# Import Buroomaailm products
php yii buroomaailm/import-products
```

#### **DigiraController** (`console/controllers/DigiraController.php`)
Digira integration.

**Key Commands**:
```bash
# Sync Digira data
php yii digira/sync

# Import Digira products
php yii digira/import-products
```

#### **DigireadController** (`console/controllers/DigireadController.php`)
Digiread integration.

**Key Commands**:
```bash
# Sync Digiread data
php yii digiread/sync

# Import Digiread products
php yii digiread/import-products
```

#### **EdrkController** (`console/controllers/EdrkController.php`)
Edrk integration.

**Key Commands**:
```bash
# Sync Edrk data
php yii edrk/sync

# Import Edrk products
php yii edrk/import-products
```

#### **GardnersController** (`console/controllers/GardnersController.php`)
Gardners integration.

**Key Commands**:
```bash
# Sync Gardners data
php yii gardners/sync

# Import Gardners products
php yii gardners/import-products
```

#### **InsplayController** (`console/controllers/InsplayController.php`)
Insplay integration.

**Key Commands**:
```bash
# Sync Insplay data
php yii insplay/sync

# Import Insplay products
php yii insplay/import-products
```

#### **RaamatukoiController** (`console/controllers/RaamatukoiController.php`)
Raamatukoi integration.

**Key Commands**:
```bash
# Sync Raamatukoi data
php yii raamatukoi/sync

# Import Raamatukoi products
php yii raamatukoi/import-products
```

#### **WoltOfferController** (`console/controllers/WoltOfferController.php`)
Wolt integration.

**Key Commands**:
```bash
# Sync Wolt offers
php yii wolt-offer/sync

# Import Wolt offers
php yii wolt-offer/import-offers
```

## Common/Important Commands

### **Daily Maintenance Commands**

```bash
# Process pending orders
php yii order/process

# Cleanup system data
php yii cleanup/index

# Generate notifications
php yii notification/generate basket
php yii notification/generate order
php yii notification/generate offers

# Send notifications
php yii notification/send

# Sync blog statistics
php yii statistic/sync-blog-stat

# Health checks
php yii health-check/kafka
php yii health-check/wowza
php yii health-check/subscription-service
```

### **Weekly Maintenance Commands**

```bash
# Cleanup failed orders (8 hours old)
php yii cleanup/failed-orders --noPrompt=1

# Cleanup failed logins (30 days old)
php yii cleanup/failed-logins --noPrompt=1

# Cleanup obsolete products (60 days old)
php yii cleanup/obsolete-products --noPrompt=1

# Cleanup failed async processes (8 hours old)
php yii cleanup/failed-async-processes --noPrompt=1

# Sanitize client baskets (24 hours old)
php yii cleanup/client-basket-sanitize --noPrompt=1

# Cleanup queue
php yii cleanup/queue

# Cleanup outdated session actions
php yii cleanup/outdated-session-actions
```

### **Data Import/Export Commands**

```bash
# Import database dump
php yii db/import

# Export database
php yii db/export

# Create admin user
php yii db/create-admin admin@rahvaraamat.ee

# Create test user
php yii db/create-test-user test@rahvaraamat.ee
```

### **Synchronization Commands**

```bash
# Sync with NAV ERP
php yii sync/nav-sync

# Sync product images to S3
php yii sync/aws-product-image-sync

# Sync EPUB files to S3
php yii sync/aws-epub-file-sync

# Sync DRM EPUB files
php yii sync/aws-drm-epub-file-sync
```

### **Elasticsearch Commands**

```bash
# Reindex all data
php yii elastic/reindex

# Update product index
php yii elastic/update-product-index

# Update category index
php yii elastic/update-category-index

# Optimize index
php yii elastic/optimize
```

### **Sitemap Generation**

```bash
# Generate sitemap
php yii sitemap/generate

# Update sitemap
php yii sitemap/update

# Generate product sitemap
php yii sitemap/generate-product

# Generate category sitemap
php yii sitemap/generate-category

# Generate blog sitemap
php yii sitemap/generate-blog
```

### **Development and Debug Commands**

```bash
# Test transliteration
php yii debug/transliteration

# Test product builder
php yii debug/product-builder

# Test delivery message
php yii debug/delivery-message

# Generate hash
php yii debug/hash

# Test order validation
php yii debug/order-validation

# Test timestamp operations
php yii debug/timestamp

# Test NAV operations
php yii debug/nav
```

## Cron Job Examples

### **Daily Cron Jobs**

```bash
# Process orders every 15 minutes
*/15 * * * * php yii order/process

# Cleanup system data daily at 2 AM
0 2 * * * php yii cleanup/index

# Generate notifications daily at 8 AM
0 8 * * * php yii notification/generate basket
0 8 * * * php yii notification/generate order
0 8 * * * php yii notification/generate offers

# Send notifications daily at 9 AM
0 9 * * * php yii notification/send

# Health checks daily at 6 AM
0 6 * * * php yii health-check/kafka
0 6 * * * php yii health-check/wowza
0 6 * * * php yii health-check/subscription-service
```

### **Weekly Cron Jobs**

```bash
# Weekly cleanup on Sundays at 3 AM
0 3 * * 0 php yii cleanup/failed-orders --noPrompt=1
0 3 * * 0 php yii cleanup/failed-logins --noPrompt=1
0 3 * * 0 php yii cleanup/obsolete-products --noPrompt=1
0 3 * * 0 php yii cleanup/failed-async-processes --noPrompt=1
0 3 * * 0 php yii cleanup/client-basket-sanitize --noPrompt=1

# Weekly statistics on Sundays at 4 AM
0 4 * * 0 php yii statistic/sync-blog-stat
```

### **Monthly Cron Jobs**

```bash
# Monthly sitemap generation on 1st at 5 AM
0 5 1 * * php yii sitemap/generate

# Monthly Elasticsearch optimization on 1st at 6 AM
0 6 1 * * php yii elastic/optimize
```

## Error Handling and Logging

### **Log Levels**

- **TRACE**: Detailed debugging information
- **INFO**: General information messages
- **WARNING**: Warning messages
- **ERROR**: Error messages

### **Performance Monitoring**

Each command automatically logs:
- **Execution Time**: Total time taken
- **Memory Usage**: Current and peak memory usage
- **Process Status**: Running/stopped status

### **Process Management**

- **Signal Handling**: Graceful termination on SIGINT
- **Transaction Rollback**: Automatic rollback on termination
- **Process Locking**: Prevents duplicate execution

## Best Practices

### **Command Execution**

1. **Always use environment-specific commands**:
   ```bash
   # Development
   php yii <command>
   
   # Production
   php environments/prod/yii <command>
   ```

2. **Use --noPrompt for automated execution**:
   ```bash
   php yii cleanup/failed-orders --noPrompt=1
   ```

3. **Monitor command output**:
   ```bash
   php yii order/process --verbose=1
   ```

### **Error Handling**

1. **Check exit codes**:
   ```bash
   php yii order/process
   echo $?  # 0 = success, non-zero = error
   ```

2. **Use try-catch in scripts**:
   ```bash
   php yii order/process || echo "Order processing failed"
   ```

### **Performance Optimization**

1. **Use batch processing for large datasets**
2. **Monitor memory usage**
3. **Use appropriate cleanup intervals**
4. **Schedule commands during low-traffic periods**

---

*This comprehensive console commands documentation provides complete coverage of all command-line tools available in the Rahvaraamat e-commerce platform, including usage examples, cron job configurations, and best practices.* 
