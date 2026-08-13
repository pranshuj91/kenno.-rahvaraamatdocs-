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
| Architecture |
| Key Components |
| Configuration |
| Failure Handling |
| Database Migrations |
| Typical Operations |
| API contract (authoritative) |
| FE CORS note |
| Force degraded mode (staging QA) |
| Backend changes shipped |


### [CP-002](./critical-production/CP-002-cron-jobs.md) — Cron Jobs & Scheduled Tasks

| Inside this page |
|---|
| Concurrency Guard: AlreadyRunningFilter |
| Critical Scheduled Tasks |
| Notification Tasks |
| Cleanup & Maintenance Tasks |
| Statistics & Analytics Tasks |
| Subscription Tasks |
| Content Generation Tasks |
| External Integration Syncs |
| Parallel Execution Scripts |
| NAV Sync Handlers (via SyncController) |
| Server monitoring (Zone.ee) |
| Redis monitoring |
| Available logs |
| Scheduled jobs |


### [CP-003](./critical-production/CP-003-nav-integration.md) — NAV Integration

| Inside this page |
|---|
| Architecture |
| Incoming: Sync Handlers |
| Outgoing: Post Handlers |
| Configuration |
| Auto-Queue Behavior |
| Error Handling |
| Audit Logging |
| Console Commands |
| Sync Handler Factory |


### [CP-004](./critical-production/CP-004-queue-system.md) — Queue System

| Inside this page |
|---|
| Configuration |
| Running the Queue Worker |
| Failed Job Handling |
| Job Classes |
| How Jobs Are Pushed |
| Monitoring |


### [CP-005](./critical-production/CP-005-external-integrations.md) — External Product Integrations

| Inside this page |
|---|
| Gardners |
| Anvol |
| Insplay |
| Buroomaailm |
| EDRK |
| Raamatukoi |
| Other Integrations |
| Sync Handler Factory |
| Common Import Pattern |
| Console Commands |


### [CP-006](./critical-production/CP-006-backups.md) — Backups

| Inside this page |
|---|
| Production Backups (Zone.ee) |
| Restore Procedure |
| What Is NOT Backed Up Here |
| Post-Restore Checklist |
| In-Repo DB Tooling (Developer Use Only) |
| Open Items (Owned by DevOps / Hosting) |


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
| Architecture |
| Key Components |
| Subscription Billing |
| Console Commands |
| Admin Configuration |
| Error Handling |
| AdaptersAbstract |
| Dataset |
| PaymentHandlerBase |
| ServicesAbstract |
| Payment |
| Transaction |
| AdapterInterface |
| IPizza |


### [IB-002](./important-business/IB-002-kafka-events.md) — Kafka Event Streaming

| Inside this page |
|---|
| Configuration |
| Architecture |
| Key Components |
| Event Types |
| Event Processors |
| Console Commands |
| Topic Configuration |
| Error Handling |


### [IB-003](./important-business/IB-003-integration-reconciliation.md) — Integration Reconciliation & Scheduling

| Inside this page |
|---|
| Data Model |
| Active / Blackout Logic |
| Price Floors |
| Status- and Schedule-Change Side Effects |
| Reconciliation Job |
| Health Calculation |
| State Keys |
| Admin Panel |
| Operational Cheat-Sheet |


### [IB-004](./important-business/IB-004-notifications.md) — Email & SMS Notifications

| Inside this page |
|---|
| SMS (Messente) |
| Email System |
| Automated Notification System |
| Console Commands |
| Expiration Rules |


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
| Scope and audience |
| Environments and branches |
| Branch and release naming |
| Prerequisites |
| Staging workflow |
| Production deployment steps |
| Rollback (production) |
| Troubleshooting tips |
| Application components |
| Models |
| Controllers |


### [OP-002](./operational/OP-002-admin-panel-modules.md) — Admin Panel Modules

| Inside this page |
|---|
| Admin Panel Overview |
| Menu Structure & Navigation |
| Product Management |
| Discount & Coupon Management |
| Order Management |
| User Management |
| Content Management |
| Settings & Configuration |
| Vendor Management |
| Audio/Subscription Management |
| System Administration |
| Common Actions & Buttons |
| Technical Implementation |
| Security & Permissions |


### [OP-003](./operational/OP-003-cleanup-jobs.md) — Cleanup & Maintenance Jobs

| Inside this page |
|---|
| Main Cleanup Controller |
| Other Cleanup Commands |
| Constants Summary |


### [OP-004](./operational/OP-004-search-functionality.md) — Search Functionality

| Inside this page |
|---|
| 1. Overview |
| 2. What Can Be Searched |
| 3. How Search Works (End to End) |
| 4. Autocomplete (Search-as-You-Type) |
| 5. Product Catalog Search |
| 6. Dynamic Filters (Facets) |
| 7. Related Entity Search Endpoints |
| 8. How Results Are Ranked |
| 9. Synonyms, Tags & Search Enrichment |
| 10. Index Sync, Commands & Cron Jobs |
| 11. When Search Is Unavailable |
| 12. Search Surfaces by Area |
| 13. Feature Summary Checklist |
| 15. Quick Reference — Search-Related Commands |


### [OP-005](./operational/OP-005-subscription-management.md) — Subscription Management

| Inside this page |
|---|
| Key Components |
| Admin Panel |
| Console Commands |
| Payment Flow |


### [OP-006](./operational/OP-006-redirects.md) — External URL & Redirect Management

| Inside this page |
|---|
| Architecture |
| Key Components |
| Admin Interface |
| Console Commands |
| URL Structure Versions |


### [OP-007](./operational/OP-007-sitemap.md) — Sitemap Generation

| Inside this page |
|---|
| Console Command |
| Entity Types |
| Last Modification Tracking |
| Output |
| Monitoring |
| Resilience & failure handling |
| Models Used |


### [OP-008](./operational/OP-008-feed-exporters.md) — Feed Exporters

| Inside this page |
|---|
| Feed Export (cron) |
| FeedExporterController commands |
| Product & category feed export |


### [OP-009](./operational/OP-009-statistics.md) — Statistics & Analytics

| Inside this page |
|---|
| CTR (Click-Through Rate) Tracking |
| Product Statistics |
| General Statistics |
| Subscription Statistics |


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
| SSL certificate |
| Runtime related to the web host |
| Document root |
| SSL certificates |
| HTTPS configuration |
| Virtual IP |


### [IN-002](./infrastructure/IN-002-pm2-process.md) — PM2 Process Management

| Inside this page |
|---|
| PM2 managed processes |
| PM2 configuration files |
| Observations |


### [IN-003](./infrastructure/IN-003-kafka-ssl.md) — Kafka SSL Configuration

| Inside this page |
|---|
| Kafka SSL / TLS configuration |
| apacheKafka component settings |


### [IN-004](./infrastructure/IN-004-web-store-ssl.md) — Web Store SSL Settings

| Inside this page |
|---|
| Database Configuration |
| Behavior |
| Configuration Source |
| Administration |
| Application Usage |
| What This Setting Controls |
| What This Setting Does NOT Control |
| Technical Flow |
| Notes |


### [IN-005](./infrastructure/IN-005-server-architecture.md) — Server Architecture

| Inside this page |
|---|
| Hosting |
| Paths |
| Database (MariaDB) |
| Redis |
| Webserver notes |
| Confirmed technology stack |
| Subdomains |
| Port forwards |
| Access inventory (high level — no credentials) |
| Production |
| Staging |
| Recommended reading order (per environment) |
| Environments (quick map) |


### [IN-006](./infrastructure/IN-006-monitoring-alerting.md) — Monitoring & Alerting

| Inside this page |
|---|
| Server monitoring (Zone.ee) |
| Redis monitoring |
| Available logs |
| Scheduled jobs |
| Elasticsearch |
| Health reporting |
| Backups (Zone panel) |
| Quota notifications |
| Log File Locations and Rotation |
| Error Reporting |
| Monitoring Tools |


### [IN-007](./infrastructure/IN-007-log-management.md) — Log Management

| Inside this page |
|---|
| Log Target Configuration |
| Custom DB Log Target |
| Tables |
| Archive Command |
| Output Format |
| Scheduling |
| Operational Notes |
| Log File Locations and Rotation |
| Error Reporting |
| Monitoring Tools |


