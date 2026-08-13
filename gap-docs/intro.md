---
id: intro
title: Gap Documents Overview
sidebar_label: Overview
---

# Gap Documents

The detailed write-ups for these topics already live in **[Developer Docs](/docs/intro)**. This Gap Documents area brings the same topics together in one place, organised by gap ID, so the team can review coverage clearly — what is documented, what is still open, and which developer doc each item maps to.

Use the sidebar on the left, or the tables below, to open any gap page. Each gap lists what is covered inside so you can scan from this overview.

## Categories

### Critical — Production

| ID | Topic |
|---|---|
| [CP-001](./critical-production/CP-001-elasticsearch-spool.md) | Elasticsearch Spool System |
| [CP-002](./critical-production/CP-002-cron-jobs.md) | Cron Jobs & Scheduled Tasks |
| [CP-003](./critical-production/CP-003-nav-integration.md) | NAV Integration |
| [CP-004](./critical-production/CP-004-queue-system.md) | Queue System |
| [CP-005](./critical-production/CP-005-external-integrations.md) | External Product Integrations |
| [CP-006](./critical-production/CP-006-backups.md) | Backups |

### [CP-001](./critical-production/CP-001-elasticsearch-spool.md) — Elasticsearch Spool System

| Inside this page |
|---|
| [Architecture](./critical-production/CP-001-elasticsearch-spool.md#architecture) |
| [Key Components](./critical-production/CP-001-elasticsearch-spool.md#key-components) |
| [Configuration](./critical-production/CP-001-elasticsearch-spool.md#configuration) |
| [Failure Handling](./critical-production/CP-001-elasticsearch-spool.md#failure-handling) |
| [Database Migrations](./critical-production/CP-001-elasticsearch-spool.md#database-migrations) |
| [Typical Operations](./critical-production/CP-001-elasticsearch-spool.md#typical-operations) |
| [API contract (authoritative)](./critical-production/CP-001-elasticsearch-spool.md#api-contract-authoritative) |
| [FE CORS note](./critical-production/CP-001-elasticsearch-spool.md#fe-cors-note) |
| [Force degraded mode (staging QA)](./critical-production/CP-001-elasticsearch-spool.md#force-degraded-mode-staging-qa) |
| [Backend changes shipped](./critical-production/CP-001-elasticsearch-spool.md#backend-changes-shipped) |

### [CP-002](./critical-production/CP-002-cron-jobs.md) — Cron Jobs & Scheduled Tasks

| Inside this page |
|---|
| [Concurrency Guard: AlreadyRunningFilter](./critical-production/CP-002-cron-jobs.md#concurrency-guard-alreadyrunningfilter) |
| [Critical Scheduled Tasks](./critical-production/CP-002-cron-jobs.md#critical-scheduled-tasks) |
| [Notification Tasks](./critical-production/CP-002-cron-jobs.md#notification-tasks) |
| [Cleanup & Maintenance Tasks](./critical-production/CP-002-cron-jobs.md#cleanup--maintenance-tasks) |
| [Statistics & Analytics Tasks](./critical-production/CP-002-cron-jobs.md#statistics--analytics-tasks) |
| [Subscription Tasks](./critical-production/CP-002-cron-jobs.md#subscription-tasks) |
| [Content Generation Tasks](./critical-production/CP-002-cron-jobs.md#content-generation-tasks) |
| [External Integration Syncs](./critical-production/CP-002-cron-jobs.md#external-integration-syncs) |
| [Parallel Execution Scripts](./critical-production/CP-002-cron-jobs.md#parallel-execution-scripts) |
| [NAV Sync Handlers (via SyncController)](./critical-production/CP-002-cron-jobs.md#nav-sync-handlers-via-synccontroller) |
| [Server monitoring (Zone.ee)](./critical-production/CP-002-cron-jobs.md#server-monitoring-zoneee) |
| [Redis monitoring](./critical-production/CP-002-cron-jobs.md#redis-monitoring) |
| [Available logs](./critical-production/CP-002-cron-jobs.md#available-logs) |
| [Scheduled jobs](./critical-production/CP-002-cron-jobs.md#scheduled-jobs) |

### [CP-003](./critical-production/CP-003-nav-integration.md) — NAV Integration

| Inside this page |
|---|
| [Architecture](./critical-production/CP-003-nav-integration.md#architecture) |
| [Incoming: Sync Handlers](./critical-production/CP-003-nav-integration.md#incoming-sync-handlers) |
| [Outgoing: Post Handlers](./critical-production/CP-003-nav-integration.md#outgoing-post-handlers) |
| [Configuration](./critical-production/CP-003-nav-integration.md#configuration) |
| [Auto-Queue Behavior](./critical-production/CP-003-nav-integration.md#auto-queue-behavior) |
| [Error Handling](./critical-production/CP-003-nav-integration.md#error-handling) |
| [Audit Logging](./critical-production/CP-003-nav-integration.md#audit-logging) |
| [Console Commands](./critical-production/CP-003-nav-integration.md#console-commands) |
| [Sync Handler Factory](./critical-production/CP-003-nav-integration.md#sync-handler-factory) |

### [CP-004](./critical-production/CP-004-queue-system.md) — Queue System

| Inside this page |
|---|
| [Configuration](./critical-production/CP-004-queue-system.md#configuration) |
| [Running the Queue Worker](./critical-production/CP-004-queue-system.md#running-the-queue-worker) |
| [Failed Job Handling](./critical-production/CP-004-queue-system.md#failed-job-handling) |
| [Job Classes](./critical-production/CP-004-queue-system.md#job-classes) |
| [How Jobs Are Pushed](./critical-production/CP-004-queue-system.md#how-jobs-are-pushed) |
| [Monitoring](./critical-production/CP-004-queue-system.md#monitoring) |

### [CP-005](./critical-production/CP-005-external-integrations.md) — External Product Integrations

| Inside this page |
|---|
| [Gardners](./critical-production/CP-005-external-integrations.md#gardners) |
| [Anvol](./critical-production/CP-005-external-integrations.md#anvol) |
| [Insplay](./critical-production/CP-005-external-integrations.md#insplay) |
| [Buroomaailm](./critical-production/CP-005-external-integrations.md#buroomaailm) |
| [EDRK](./critical-production/CP-005-external-integrations.md#edrk) |
| [Raamatukoi](./critical-production/CP-005-external-integrations.md#raamatukoi) |
| [Other Integrations](./critical-production/CP-005-external-integrations.md#other-integrations) |
| [Sync Handler Factory](./critical-production/CP-005-external-integrations.md#sync-handler-factory) |
| [Common Import Pattern](./critical-production/CP-005-external-integrations.md#common-import-pattern) |
| [Console Commands](./critical-production/CP-005-external-integrations.md#console-commands) |

### [CP-006](./critical-production/CP-006-backups.md) — Backups

| Inside this page |
|---|
| [Production Backups (Zone.ee)](./critical-production/CP-006-backups.md#production-backups-zoneee) |
| [Restore Procedure](./critical-production/CP-006-backups.md#restore-procedure) |
| [What Is NOT Backed Up Here](./critical-production/CP-006-backups.md#what-is-not-backed-up-here) |
| [Post-Restore Checklist](./critical-production/CP-006-backups.md#post-restore-checklist) |
| [In-Repo DB Tooling (Developer Use Only)](./critical-production/CP-006-backups.md#in-repo-db-tooling-developer-use-only) |
| [Open Items (Owned by DevOps / Hosting)](./critical-production/CP-006-backups.md#open-items-owned-by-devops--hosting) |
### Important — Business

| ID | Topic |
|---|---|
| [IB-001](./important-business/IB-001-payment-gateway.md) | Payment Gateway Integrations |
| [IB-002](./important-business/IB-002-kafka-events.md) | Kafka Event Streaming |
| [IB-003](./important-business/IB-003-integration-reconciliation.md) | Integration Reconciliation & Scheduling |
| [IB-004](./important-business/IB-004-notifications.md) | Email & SMS Notifications |

### [IB-001](./important-business/IB-001-payment-gateway.md) — Payment Gateway Integrations

| Inside this page |
|---|
| [Architecture](./important-business/IB-001-payment-gateway.md#architecture) |
| [Key Components](./important-business/IB-001-payment-gateway.md#key-components) |
| [Subscription Billing](./important-business/IB-001-payment-gateway.md#subscription-billing) |
| [Console Commands](./important-business/IB-001-payment-gateway.md#console-commands) |
| [Admin Configuration](./important-business/IB-001-payment-gateway.md#admin-configuration) |
| [Error Handling](./important-business/IB-001-payment-gateway.md#error-handling) |
| [AdaptersAbstract](./important-business/IB-001-payment-gateway.md#adaptersabstract) |
| [Dataset](./important-business/IB-001-payment-gateway.md#dataset) |
| [PaymentHandlerBase](./important-business/IB-001-payment-gateway.md#paymenthandlerbase) |
| [ServicesAbstract](./important-business/IB-001-payment-gateway.md#servicesabstract) |
| [Payment](./important-business/IB-001-payment-gateway.md#payment) |
| [Transaction](./important-business/IB-001-payment-gateway.md#transaction) |
| [AdapterInterface](./important-business/IB-001-payment-gateway.md#adapterinterface) |
| [IPizza](./important-business/IB-001-payment-gateway.md#ipizza) |

### [IB-002](./important-business/IB-002-kafka-events.md) — Kafka Event Streaming

| Inside this page |
|---|
| [Configuration](./important-business/IB-002-kafka-events.md#configuration) |
| [Architecture](./important-business/IB-002-kafka-events.md#architecture) |
| [Key Components](./important-business/IB-002-kafka-events.md#key-components) |
| [Event Types](./important-business/IB-002-kafka-events.md#event-types) |
| [Event Processors](./important-business/IB-002-kafka-events.md#event-processors) |
| [Console Commands](./important-business/IB-002-kafka-events.md#console-commands) |
| [Topic Configuration](./important-business/IB-002-kafka-events.md#topic-configuration) |
| [Error Handling](./important-business/IB-002-kafka-events.md#error-handling) |

### [IB-003](./important-business/IB-003-integration-reconciliation.md) — Integration Reconciliation & Scheduling

| Inside this page |
|---|
| [Data Model](./important-business/IB-003-integration-reconciliation.md#data-model) |
| [Active / Blackout Logic](./important-business/IB-003-integration-reconciliation.md#active--blackout-logic) |
| [Price Floors](./important-business/IB-003-integration-reconciliation.md#price-floors) |
| [Status- and Schedule-Change Side Effects](./important-business/IB-003-integration-reconciliation.md#status--and-schedule-change-side-effects) |
| [Reconciliation Job](./important-business/IB-003-integration-reconciliation.md#reconciliation-job) |
| [Health Calculation](./important-business/IB-003-integration-reconciliation.md#health-calculation) |
| [State Keys](./important-business/IB-003-integration-reconciliation.md#state-keys) |
| [Admin Panel](./important-business/IB-003-integration-reconciliation.md#admin-panel) |
| [Operational Cheat-Sheet](./important-business/IB-003-integration-reconciliation.md#operational-cheat-sheet) |

### [IB-004](./important-business/IB-004-notifications.md) — Email & SMS Notifications

| Inside this page |
|---|
| [SMS (Messente)](./important-business/IB-004-notifications.md#sms-messente) |
| [Email System](./important-business/IB-004-notifications.md#email-system) |
| [Automated Notification System](./important-business/IB-004-notifications.md#automated-notification-system) |
| [Console Commands](./important-business/IB-004-notifications.md#console-commands) |
| [Expiration Rules](./important-business/IB-004-notifications.md#expiration-rules) |
### Operational

| ID | Topic |
|---|---|
| [OP-001](./operational/OP-001-deployment-release.md) | Deployment & Release Process |
| [OP-002](./operational/OP-002-admin-panel-modules.md) | Admin Panel Modules |
| [OP-003](./operational/OP-003-cleanup-jobs.md) | Cleanup & Maintenance Jobs |
| [OP-004](./operational/OP-004-search-functionality.md) | Search Functionality |
| [OP-005](./operational/OP-005-subscription-management.md) | Subscription Management |
| [OP-006](./operational/OP-006-redirects.md) | External URL & Redirect Management |
| [OP-007](./operational/OP-007-sitemap.md) | Sitemap Generation |
| [OP-008](./operational/OP-008-feed-exporters.md) | Feed Exporters |
| [OP-009](./operational/OP-009-statistics.md) | Statistics & Analytics |

### [OP-001](./operational/OP-001-deployment-release.md) — Deployment & Release Process

| Inside this page |
|---|
| [Scope and audience](./operational/OP-001-deployment-release.md#scope-and-audience) |
| [Environments and branches](./operational/OP-001-deployment-release.md#environments-and-branches) |
| [Branch and release naming](./operational/OP-001-deployment-release.md#branch-and-release-naming) |
| [Prerequisites](./operational/OP-001-deployment-release.md#prerequisites) |
| [Staging workflow](./operational/OP-001-deployment-release.md#staging-workflow) |
| [Production deployment steps](./operational/OP-001-deployment-release.md#production-deployment-steps) |
| [Rollback (production)](./operational/OP-001-deployment-release.md#rollback-production) |
| [Troubleshooting tips](./operational/OP-001-deployment-release.md#troubleshooting-tips) |
| [Application components](./operational/OP-001-deployment-release.md#application-components) |
| [Models](./operational/OP-001-deployment-release.md#models) |
| [Controllers](./operational/OP-001-deployment-release.md#controllers) |

### [OP-002](./operational/OP-002-admin-panel-modules.md) — Admin Panel Modules

| Inside this page |
|---|
| [Admin Panel Overview](./operational/OP-002-admin-panel-modules.md#admin-panel-overview) |
| [Menu Structure & Navigation](./operational/OP-002-admin-panel-modules.md#menu-structure--navigation) |
| [Product Management](./operational/OP-002-admin-panel-modules.md#product-management) |
| [Discount & Coupon Management](./operational/OP-002-admin-panel-modules.md#discount--coupon-management) |
| [Order Management](./operational/OP-002-admin-panel-modules.md#order-management) |
| [User Management](./operational/OP-002-admin-panel-modules.md#user-management) |
| [Content Management](./operational/OP-002-admin-panel-modules.md#content-management) |
| [Settings & Configuration](./operational/OP-002-admin-panel-modules.md#settings--configuration) |
| [Vendor Management](./operational/OP-002-admin-panel-modules.md#vendor-management) |
| [Audio/Subscription Management](./operational/OP-002-admin-panel-modules.md#audiosubscription-management) |
| [System Administration](./operational/OP-002-admin-panel-modules.md#system-administration) |
| [Common Actions & Buttons](./operational/OP-002-admin-panel-modules.md#common-actions--buttons) |
| [Technical Implementation](./operational/OP-002-admin-panel-modules.md#technical-implementation) |
| [Security & Permissions](./operational/OP-002-admin-panel-modules.md#security--permissions) |

### [OP-003](./operational/OP-003-cleanup-jobs.md) — Cleanup & Maintenance Jobs

| Inside this page |
|---|
| [Main Cleanup Controller](./operational/OP-003-cleanup-jobs.md#main-cleanup-controller) |
| [Other Cleanup Commands](./operational/OP-003-cleanup-jobs.md#other-cleanup-commands) |
| [Constants Summary](./operational/OP-003-cleanup-jobs.md#constants-summary) |

### [OP-004](./operational/OP-004-search-functionality.md) — Search Functionality

| Inside this page |
|---|
| [1. Overview](./operational/OP-004-search-functionality.md#1-overview) |
| [2. What Can Be Searched](./operational/OP-004-search-functionality.md#2-what-can-be-searched) |
| [3. How Search Works (End to End)](./operational/OP-004-search-functionality.md#3-how-search-works-end-to-end) |
| [4. Autocomplete (Search-as-You-Type)](./operational/OP-004-search-functionality.md#4-autocomplete-search-as-you-type) |
| [5. Product Catalog Search](./operational/OP-004-search-functionality.md#5-product-catalog-search) |
| [6. Dynamic Filters (Facets)](./operational/OP-004-search-functionality.md#6-dynamic-filters-facets) |
| [7. Related Entity Search Endpoints](./operational/OP-004-search-functionality.md#7-related-entity-search-endpoints) |
| [8. How Results Are Ranked](./operational/OP-004-search-functionality.md#8-how-results-are-ranked) |
| [9. Synonyms, Tags & Search Enrichment](./operational/OP-004-search-functionality.md#9-synonyms-tags--search-enrichment) |
| [10. Index Sync, Commands & Cron Jobs](./operational/OP-004-search-functionality.md#10-index-sync-commands--cron-jobs) |
| [11. When Search Is Unavailable](./operational/OP-004-search-functionality.md#11-when-search-is-unavailable) |
| [12. Search Surfaces by Area](./operational/OP-004-search-functionality.md#12-search-surfaces-by-area) |
| [13. Feature Summary Checklist](./operational/OP-004-search-functionality.md#13-feature-summary-checklist) |
| [15. Quick Reference — Search-Related Commands](./operational/OP-004-search-functionality.md#15-quick-reference--search-related-commands) |

### [OP-005](./operational/OP-005-subscription-management.md) — Subscription Management

| Inside this page |
|---|
| [Key Components](./operational/OP-005-subscription-management.md#key-components) |
| [Admin Panel](./operational/OP-005-subscription-management.md#admin-panel) |
| [Console Commands](./operational/OP-005-subscription-management.md#console-commands) |
| [Payment Flow](./operational/OP-005-subscription-management.md#payment-flow) |

### [OP-006](./operational/OP-006-redirects.md) — External URL & Redirect Management

| Inside this page |
|---|
| [Architecture](./operational/OP-006-redirects.md#architecture) |
| [Key Components](./operational/OP-006-redirects.md#key-components) |
| [Admin Interface](./operational/OP-006-redirects.md#admin-interface) |
| [Console Commands](./operational/OP-006-redirects.md#console-commands) |
| [URL Structure Versions](./operational/OP-006-redirects.md#url-structure-versions) |

### [OP-007](./operational/OP-007-sitemap.md) — Sitemap Generation

| Inside this page |
|---|
| [Console Command](./operational/OP-007-sitemap.md#console-command) |
| [Entity Types](./operational/OP-007-sitemap.md#entity-types) |
| [Last Modification Tracking](./operational/OP-007-sitemap.md#last-modification-tracking) |
| [Output](./operational/OP-007-sitemap.md#output) |
| [Monitoring](./operational/OP-007-sitemap.md#monitoring) |
| [Resilience & failure handling](./operational/OP-007-sitemap.md#resilience--failure-handling) |
| [Models Used](./operational/OP-007-sitemap.md#models-used) |

### [OP-008](./operational/OP-008-feed-exporters.md) — Feed Exporters

| Inside this page |
|---|
| [Feed Export (cron)](./operational/OP-008-feed-exporters.md#feed-export) |
| [FeedExporterController commands](./operational/OP-008-feed-exporters.md#feedexportercontroller-commands) |
| [Product & category feed export](./operational/OP-008-feed-exporters.md#feed-export) |

### [OP-009](./operational/OP-009-statistics.md) — Statistics & Analytics

| Inside this page |
|---|
| [CTR (Click-Through Rate) Tracking](./operational/OP-009-statistics.md#ctr-click-through-rate-tracking) |
| [Product Statistics](./operational/OP-009-statistics.md#product-statistics) |
| [General Statistics](./operational/OP-009-statistics.md#general-statistics) |
| [Subscription Statistics](./operational/OP-009-statistics.md#subscription-statistics) |
### Infrastructure

| ID | Topic |
|---|---|
| [IN-001](./infrastructure/IN-001-ssl-certificate.md) | SSL Certificate Management |
| [IN-002](./infrastructure/IN-002-pm2-process.md) | PM2 Process Management |
| [IN-003](./infrastructure/IN-003-kafka-ssl.md) | Kafka SSL Configuration |
| [IN-004](./infrastructure/IN-004-web-store-ssl.md) | Web Store SSL Settings |
| [IN-005](./infrastructure/IN-005-server-architecture.md) | Server Architecture |
| [IN-006](./infrastructure/IN-006-monitoring-alerting.md) | Monitoring & Alerting |
| [IN-007](./infrastructure/IN-007-log-management.md) | Log Management |

### [IN-001](./infrastructure/IN-001-ssl-certificate.md) — SSL Certificate Management

| Inside this page |
|---|
| [SSL certificate](./infrastructure/IN-001-ssl-certificate.md#ssl-certificate) |
| [Runtime related to the web host](./infrastructure/IN-001-ssl-certificate.md#runtime-related-to-the-web-host) |
| [Document root](./infrastructure/IN-001-ssl-certificate.md#document-root) |
| [SSL certificates](./infrastructure/IN-001-ssl-certificate.md#ssl-certificates) |
| [HTTPS configuration](./infrastructure/IN-001-ssl-certificate.md#https-configuration) |
| [Virtual IP](./infrastructure/IN-001-ssl-certificate.md#virtual-ip) |

### [IN-002](./infrastructure/IN-002-pm2-process.md) — PM2 Process Management

| Inside this page |
|---|
| [PM2 managed processes](./infrastructure/IN-002-pm2-process.md#pm2-managed-processes) |
| [PM2 configuration files](./infrastructure/IN-002-pm2-process.md#pm2-configuration-files) |
| [Observations](./infrastructure/IN-002-pm2-process.md#observations) |

### [IN-003](./infrastructure/IN-003-kafka-ssl.md) — Kafka SSL Configuration

| Inside this page |
|---|
| [Kafka SSL / TLS configuration](./infrastructure/IN-003-kafka-ssl.md#kafka-ssl--tls-configuration) |
| [apacheKafka component settings](./infrastructure/IN-003-kafka-ssl.md#apachekafka-component-settings) |

### [IN-004](./infrastructure/IN-004-web-store-ssl.md) — Web Store SSL Settings

| Inside this page |
|---|
| [Database Configuration](./infrastructure/IN-004-web-store-ssl.md#database-configuration) |
| [Behavior](./infrastructure/IN-004-web-store-ssl.md#behavior) |
| [Configuration Source](./infrastructure/IN-004-web-store-ssl.md#configuration-source) |
| [Administration](./infrastructure/IN-004-web-store-ssl.md#administration) |
| [Application Usage](./infrastructure/IN-004-web-store-ssl.md#application-usage) |
| [What This Setting Controls](./infrastructure/IN-004-web-store-ssl.md#what-this-setting-controls) |
| [What This Setting Does NOT Control](./infrastructure/IN-004-web-store-ssl.md#what-this-setting-does-not-control) |
| [Technical Flow](./infrastructure/IN-004-web-store-ssl.md#technical-flow) |
| [Notes](./infrastructure/IN-004-web-store-ssl.md#notes) |

### [IN-005](./infrastructure/IN-005-server-architecture.md) — Server Architecture

| Inside this page |
|---|
| [Hosting](./infrastructure/IN-005-server-architecture.md#hosting) |
| [Paths](./infrastructure/IN-005-server-architecture.md#paths) |
| [Database (MariaDB)](./infrastructure/IN-005-server-architecture.md#database-mariadb) |
| [Redis](./infrastructure/IN-005-server-architecture.md#redis) |
| [Webserver notes](./infrastructure/IN-005-server-architecture.md#webserver-notes) |
| [Confirmed technology stack](./infrastructure/IN-005-server-architecture.md#confirmed-technology-stack) |
| [Subdomains](./infrastructure/IN-005-server-architecture.md#subdomains) |
| [Port forwards](./infrastructure/IN-005-server-architecture.md#port-forwards) |
| [Access inventory (high level — no credentials)](./infrastructure/IN-005-server-architecture.md#access-inventory-high-level--no-credentials) |
| [Production](./infrastructure/IN-005-server-architecture.md#production) |
| [Staging](./infrastructure/IN-005-server-architecture.md#staging) |
| [Recommended reading order (per environment)](./infrastructure/IN-005-server-architecture.md#recommended-reading-order-per-environment) |
| [Environments (quick map)](./infrastructure/IN-005-server-architecture.md#environments-quick-map) |

### [IN-006](./infrastructure/IN-006-monitoring-alerting.md) — Monitoring & Alerting

| Inside this page |
|---|
| [Server monitoring (Zone.ee)](./infrastructure/IN-006-monitoring-alerting.md#server-monitoring-zoneee) |
| [Redis monitoring](./infrastructure/IN-006-monitoring-alerting.md#redis-monitoring) |
| [Available logs](./infrastructure/IN-006-monitoring-alerting.md#available-logs) |
| [Scheduled jobs](./infrastructure/IN-006-monitoring-alerting.md#scheduled-jobs) |
| [Elasticsearch](./infrastructure/IN-006-monitoring-alerting.md#elasticsearch) |
| [Health reporting](./infrastructure/IN-006-monitoring-alerting.md#health-reporting) |
| [Backups (Zone panel)](./infrastructure/IN-006-monitoring-alerting.md#backups-zone-panel) |
| [Quota notifications](./infrastructure/IN-006-monitoring-alerting.md#quota-notifications) |
| [Log File Locations and Rotation](./infrastructure/IN-006-monitoring-alerting.md#log-file-locations-and-rotation) |
| [Error Reporting](./infrastructure/IN-006-monitoring-alerting.md#error-reporting) |
| [Monitoring Tools](./infrastructure/IN-006-monitoring-alerting.md#monitoring-tools) |

### [IN-007](./infrastructure/IN-007-log-management.md) — Log Management

| Inside this page |
|---|
| [Log Target Configuration](./infrastructure/IN-007-log-management.md#log-target-configuration) |
| [Custom DB Log Target](./infrastructure/IN-007-log-management.md#custom-db-log-target) |
| [Tables](./infrastructure/IN-007-log-management.md#tables) |
| [Archive Command](./infrastructure/IN-007-log-management.md#archive-command) |
| [Output Format](./infrastructure/IN-007-log-management.md#output-format) |
| [Scheduling](./infrastructure/IN-007-log-management.md#scheduling) |
| [Operational Notes](./infrastructure/IN-007-log-management.md#operational-notes) |
| [Log File Locations and Rotation](./infrastructure/IN-007-log-management.md#log-file-locations-and-rotation) |
| [Error Reporting](./infrastructure/IN-007-log-management.md#error-reporting) |
| [Monitoring Tools](./infrastructure/IN-007-log-management.md#monitoring-tools) |