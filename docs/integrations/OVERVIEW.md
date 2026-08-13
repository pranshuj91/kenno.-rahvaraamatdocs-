---
id: OVERVIEW
title: Integrations Overview
sidebar_label: Overview
sidebar_position: 0
---

# Integrations

This section covers how Rahva Raamat connects to external systems: supplier product feeds, NAV ERP, Kafka messaging, and Elasticsearch search indexing.

Use the sidebar on the left, or the tables below, to open any page. Each topic lists what is covered inside so you can scan from this overview.

## In this section

| ID | Topic |
|---|---|
| [INT-001](./EXTERNAL_INTEGRATIONS.md) | External Product Integrations |
| [INT-002](./NAV_INTEGRATION.md) | NAV ERP Integration |
| [INT-003](./INTEGRATION_RECONCILIATION.md) | Integration Reconciliation |
| [INT-004](./KAFKA_EVENTS.md) | Kafka Events |
| [INT-005](./ELASTICSEARCH_SPOOL.md) | Elasticsearch Spool |
| [INT-006](./SEARCH_FUNCTIONALITY.md) | Search Functionality |
| [INT-007](./ELASTICSEARCH_RELIABILITY_PLAN.md) | Elasticsearch Reliability |

### [INT-001](./EXTERNAL_INTEGRATIONS.md) — External Product Integrations

| Inside this page |
|---|
| [Integrations at a glance](./EXTERNAL_INTEGRATIONS.md#integrations-at-a-glance) |
| [Gardners](./EXTERNAL_INTEGRATIONS.md#gardners) |
| [Anvol](./EXTERNAL_INTEGRATIONS.md#anvol) |
| [Insplay](./EXTERNAL_INTEGRATIONS.md#insplay) |
| [Buroomaailm](./EXTERNAL_INTEGRATIONS.md#buroomaailm) |
| [EDRK](./EXTERNAL_INTEGRATIONS.md#edrk) |
| [Raamatukoi](./EXTERNAL_INTEGRATIONS.md#raamatukoi) |
| [Other Integrations](./EXTERNAL_INTEGRATIONS.md#other-integrations) |
| [Admin: where to look (partner integrations)](./EXTERNAL_INTEGRATIONS.md#admin-where-to-look-partner-integrations) |
| [Availability / duplicate handling (platform)](./EXTERNAL_INTEGRATIONS.md#availability--duplicate-handling-platform) |
| [Cross-cutting code (all suppliers)](./EXTERNAL_INTEGRATIONS.md#cross-cutting-code-all-suppliers) |
| [Sync Handler Factory](./EXTERNAL_INTEGRATIONS.md#sync-handler-factory) |
| [Common Import Pattern](./EXTERNAL_INTEGRATIONS.md#common-import-pattern) |
| [Console Commands](./EXTERNAL_INTEGRATIONS.md#console-commands) |

### [INT-002](./NAV_INTEGRATION.md) — NAV ERP Integration

| Inside this page |
|---|
| [Approximate schedules (NAV)](./NAV_INTEGRATION.md#approximate-schedules-nav) |
| [Architecture](./NAV_INTEGRATION.md#architecture) |
| [Incoming: Sync Handlers](./NAV_INTEGRATION.md#incoming-sync-handlers) |
| [Outgoing: Post Handlers](./NAV_INTEGRATION.md#outgoing-post-handlers) |
| [WEBImport endpoints (ops reference)](./NAV_INTEGRATION.md#webimport-endpoints-ops-reference) |
| [Configuration](./NAV_INTEGRATION.md#configuration) |
| [Auto-Queue Behavior](./NAV_INTEGRATION.md#auto-queue-behavior) |
| [Error Handling](./NAV_INTEGRATION.md#error-handling) |
| [Audit Logging](./NAV_INTEGRATION.md#audit-logging) |
| [Where to view in Admin](./NAV_INTEGRATION.md#where-to-view-in-admin) |
| [Console Commands](./NAV_INTEGRATION.md#console-commands) |
| [Sync Handler Factory](./NAV_INTEGRATION.md#sync-handler-factory) |

### [INT-003](./INTEGRATION_RECONCILIATION.md) — Integration Reconciliation

| Inside this page |
|---|
| [Data Model](./INTEGRATION_RECONCILIATION.md#data-model) |
| [Active / Blackout Logic](./INTEGRATION_RECONCILIATION.md#active--blackout-logic) |
| [Price Floors](./INTEGRATION_RECONCILIATION.md#price-floors) |
| [Status- and Schedule-Change Side Effects](./INTEGRATION_RECONCILIATION.md#status--and-schedule-change-side-effects) |
| [Reconciliation Job](./INTEGRATION_RECONCILIATION.md#reconciliation-job) |
| [Health Calculation](./INTEGRATION_RECONCILIATION.md#health-calculation) |
| [State Keys](./INTEGRATION_RECONCILIATION.md#state-keys) |
| [Admin Panel](./INTEGRATION_RECONCILIATION.md#admin-panel) |
| [Operational Cheat-Sheet](./INTEGRATION_RECONCILIATION.md#operational-cheat-sheet) |

### [INT-004](./KAFKA_EVENTS.md) — Kafka Events

| Inside this page |
|---|
| [Configuration](./KAFKA_EVENTS.md#configuration) |
| [Architecture](./KAFKA_EVENTS.md#architecture) |
| [Key Components](./KAFKA_EVENTS.md#key-components) |
| [Event Types](./KAFKA_EVENTS.md#event-types) |
| [Event Processors](./KAFKA_EVENTS.md#event-processors) |
| [Console Commands](./KAFKA_EVENTS.md#console-commands) |
| [Topic Configuration](./KAFKA_EVENTS.md#topic-configuration) |
| [Error Handling](./KAFKA_EVENTS.md#error-handling) |

### [INT-005](./ELASTICSEARCH_SPOOL.md) — Elasticsearch Spool

| Inside this page |
|---|
| [Architecture](./ELASTICSEARCH_SPOOL.md#architecture) |
| [Key Components](./ELASTICSEARCH_SPOOL.md#key-components) |
| [Configuration](./ELASTICSEARCH_SPOOL.md#configuration) |
| [Failure Handling](./ELASTICSEARCH_SPOOL.md#failure-handling) |
| [Database Migrations](./ELASTICSEARCH_SPOOL.md#database-migrations) |
| [Typical Operations](./ELASTICSEARCH_SPOOL.md#typical-operations) |

### [INT-006](./SEARCH_FUNCTIONALITY.md) — Search Functionality

| Inside this page |
|---|
| [1. Overview](./SEARCH_FUNCTIONALITY.md#1-overview) |
| [2. What Can Be Searched](./SEARCH_FUNCTIONALITY.md#2-what-can-be-searched) |
| [3. How Search Works (End to End)](./SEARCH_FUNCTIONALITY.md#3-how-search-works-end-to-end) |
| [4. Autocomplete (Search-as-You-Type)](./SEARCH_FUNCTIONALITY.md#4-autocomplete-search-as-you-type) |
| [5. Product Catalog Search](./SEARCH_FUNCTIONALITY.md#5-product-catalog-search) |
| [6. Dynamic Filters (Facets)](./SEARCH_FUNCTIONALITY.md#6-dynamic-filters-facets) |
| [7. Related Entity Search Endpoints](./SEARCH_FUNCTIONALITY.md#7-related-entity-search-endpoints) |
| [8. How Results Are Ranked](./SEARCH_FUNCTIONALITY.md#8-how-results-are-ranked) |
| [9. Synonyms, Tags & Search Enrichment](./SEARCH_FUNCTIONALITY.md#9-synonyms-tags--search-enrichment) |
| [10. Index Sync, Commands & Cron Jobs](./SEARCH_FUNCTIONALITY.md#10-index-sync-commands--cron-jobs) |
| [11. When Search Is Unavailable](./SEARCH_FUNCTIONALITY.md#11-when-search-is-unavailable) |
| [12. Search Surfaces by Area](./SEARCH_FUNCTIONALITY.md#12-search-surfaces-by-area) |
| [13. Feature Summary Checklist](./SEARCH_FUNCTIONALITY.md#13-feature-summary-checklist) |
| [14. Related Documentation](./SEARCH_FUNCTIONALITY.md#14-related-documentation) |
| [15. Quick Reference — Search-Related Commands](./SEARCH_FUNCTIONALITY.md#15-quick-reference--search-related-commands) |

### [INT-007](./ELASTICSEARCH_RELIABILITY_PLAN.md) — Elasticsearch Reliability

| Inside this page |
|---|
| [API contract (authoritative)](./ELASTICSEARCH_RELIABILITY_PLAN.md#api-contract-authoritative) |
| [FE CORS note](./ELASTICSEARCH_RELIABILITY_PLAN.md#fe-cors-note) |
| [Force degraded mode (staging QA)](./ELASTICSEARCH_RELIABILITY_PLAN.md#force-degraded-mode-staging-qa) |
| [Backend changes shipped](./ELASTICSEARCH_RELIABILITY_PLAN.md#backend-changes-shipped) |