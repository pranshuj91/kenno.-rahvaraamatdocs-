---
id: ADMIN_MODULE
title: Admin Module Overview
sidebar_label: Admin Module
---
# Admin module — detailed overview

This document describes the back‑office (admin) application: its structure, main modules, typical workflows, and how it interacts with the shared domain (common/) and background processes.

Scope and goals
- Help developers and operators find features quickly in admin code.
- Explain how the admin UI manipulates catalog, orders, customers, content, audio/e‑books, and settings.
- Point to related processes (sync, spoolers, console jobs) that reflect admin changes to external systems.


## Architecture at a glance
- Entry point: admin web application (Yii2) with its own module namespace under admin/modules/*.
- Each business area is packaged as a Yii Module with its own controllers, models (admin‑side forms, search models), views, and assets.
- Domain entities and business logic live in common/ (ActiveRecord models, services). Admin primarily orchestrates those.
- RBAC/authorization, widgets, and shared components are registered in admin app config (see admin/config/*).

Directory conventions (high level)
- admin/modules/`<feature>`/
  - controllers/ — HTTP controllers for admin routes
  - models/ — form models, search models, DTOs specific to admin
  - views/ — view templates used by controllers
  - assets/ — optional feature‑specific assets
  - Module.php — feature module class registering routes and labels


## Authentication and authorization
- Admin authentication is handled by the Yii user component configured for the admin app.
- Authorization is primarily role/permission based (RBAC). Controllers typically extend a BaseController with access control. Sensitive actions (publishing, deletions, price changes) require specific permissions.
- Multi‑web‑store context: many actions operate in the context of a particular WebStore (see common/models/WebStore). Admin UIs reflect and/or switch context when applicable.


## Major feature modules and what they do
Below is a non‑exhaustive but practical map of important modules under admin/modules. File paths indicate where to look. Controller names convey available CRUD and tools.

- Shop (admin/modules/shop)
  - Purpose: Back‑office for commerce operations: products, orders, customers, sync tools.
  - Notable views: views/sync/* include NAV sync helpers (upload/trigger pages), views/order/* search and detail pages.
  - Ties to console: UIs may invoke or monitor SyncController handlers (php yii sync/*). Refer to common/synchronizations/* for the actual jobs.
  - Related domain: common/models/Product, Order, ClientAccount, Category, Price, Availability.

- Content (admin/modules/content)
  - Purpose: Content management for marketing pages, events, banners, and editorial content.
  - Draft workflow helpers: drafts/EventDraftService.php and similar utilities.
  - Analytics/CTR: Works together with Banner/BannerStat and SmallBanner/SmallBannerStat (see console/controllers/CtrController for nightly CTR aggregation).

~~- Audio (admin/modules/audio)~~ **(DEPRECATED)**

~~- E‑Book (admin/modules/ebook)~~ **(DEPRECATED)**
- 
- Redirects (admin/modules/redirect)
  - Purpose: Manage manual external URL redirects.
  - Notable models: ManualExternalUrlRedirectStorage, ExternalUrlRedirectSearch (search/filtering).

- Settings (admin/modules/setting)
  - Purpose: Global and per‑feature settings surfaces (e.g., shop IP allows/blocks, feature flags, templates).
  - Example: views/ip/* provides management of allowed IPs for admin features.

- Vendor (admin/modules/vendor)
  - Purpose: Tools for vendor relations and data hygiene related to suppliers.

- C~~ombo (admin/modules/combo)~~ (DEPRECATED)

- ~~STACC (admin/modules/stacc)~~ (DEPRECATED)
  - Purpose: STACC‑related integrations and ops surfaces (e.g., personalization feeds or analytics if present).

- Debug (admin/modules/debug)
  - Purpose: Embedded diagnostics and log viewing during development or operations.

Note: The exact set of modules may vary by deployment. Some modules may be experimental or deprecated. See the repository for the current list.


## Typical admin workflows and their system effects
- Product management
  - Create/edit products; attach images, categories, people, and metadata.
  - Changing availability/status/stock directly is uncommon; stock and availability are computed by NAV sync jobs. Manual overrides exist for special cases.
  - Effects: Changes spool to product spoolers which reindex search, update caches, and propagate to storefronts.

- Order management
  - View orders, statuses, payment info, and customer shipping/billing data.
  - Admin does not charge cards directly; payments flow via API + bank. However, admins can see and troubleshoot failed or pending payments.
  - Effects: Some actions may trigger post‑purchase handlers (emails, postbacks). For totals reconciliation, periodic NAV OrderSync aligns numbers.

- Customer accounts
  - Manage client accounts, link companies, reset or assist with access issues.
  - Effects: Touches common/models/User, ClientAccount and can influence API authentication contexts.

- Marketing and content
  - Manage banners, small banners, landing pages, and event drafts.
  - Effects: CTR nightly/periodic jobs aggregate stats and roll up to entities via console CtrController.

- Digital audio/e‑books handling
  - For audiobooks: upload chapters, validate processing, manage availability and previews.
  - Admin actions often queue background work handled by console AudioController (compute durations, file sizes, previews).
  - For e‑books: reporting and operations; availability derives from file presence and sync logic.

- Synchronization tools
  - Admin contains helper pages to inspect and trigger import/sync state for NAV and external suppliers (views under shop/sync/*).
  - Effects: Actual synchronization runs via console (php yii sync/*), guarded by AlreadyRunningFilter. See AvailabilitySync and OrderSync docs.


## Data flow with the common layer and background jobs
- Admin invokes persistence through common ActiveRecord models, validators, and services.
- Many changes write to tables that are later consumed by background jobs or spoolers (e.g., product_spooler_commit) to update secondary systems like Elasticsearch.
- Sync jobs (AvailabilitySync, OrderSync, price imports, image sync) are owned by console/common and merely surfaced for operators in admin.


## Operations and troubleshooting
- Logs: Admin actions log to rr_log. Old logs can be archived using console/controllers/ArchiveController::actionLogs.
- Concurrency guards: Background jobs initiated from admin links or buttons are protected with AlreadyRunningFilter to avoid overlap.
- Health signals: Some admin pages may surface last run timestamps (e.g., lastOrderProcess via system state repository).


## Extending admin
- Create a new module under admin/modules/`<yourModule>` with a Module class extending yii\base\Module.
- Register routes and menu entries in the admin layout/config.
- Place controllers and views following Yii conventions. Use form models for validation.
- Reuse common/ domain models and services. Avoid duplicating business logic in admin; prefer to call services from common/.


## See also
- ../core/STRUCTURE.md — high‑level repository structure and execution flows.
- ./CONSOLE_COMMANDS_SUMMARY.md — console controllers and dynamic sync actions.
- ../commerce-ordering/ORDER_PURCHASE_FLOW.md — end‑to‑end purchase pipeline.
- ../commerce-ordering/AVAILABILITY_SYNC.md and [Availability](../commerce-ordering/AVAILABILITY.md) — availability computation.
- ./API_OVERVIEW.md and ../authentication/REGISTRATION_FLOW.md — public API and auth/registration flows.


## Notes on deprecated/unused areas
- Some modules or pages might be legacy or disabled in current deployments. If you find modules that are unused (e.g., legacy sync helpers, prototype features), please list them so we can prune the documentation and optionally follow up with code cleanup in a separate change.



