---
id: STRUCTURE
title: Project Structure
sidebar_label: Project Structure
---
### Project structure overview

This project is a Yii2-based PHP application composed of multiple entry points and shared modules.

## admin / api / console / common layers

The high-level layers are:

- Web admin panel (admin)
- Public API (api)
- Console utilities (console)
- Shared domain code (common)
- Environment/configuration and infrastructure (docker, environments, yii scripts)

Below is a concise map of the repository with brief descriptions to help you navigate. As requested, this focuses on how the project works today; deprecated/unused parts will be identified and removed in later iterations once confirmed.

## Top-level directories map

Top-level directories and files

- admin
  - Web entry for the back-office (admin panel). Contains controllers, views, assets, and config specific to the admin UI.
- api
  - Public/API entry. Hosts controllers, models/forms, and configuration used to serve HTTP endpoints.
  - See API.md for the API documentation overview and endpoints index.
## Shared synchronizations & models

- common
  - Shared application code reused by admin, api, and console.
  - Notable sub-areas:
    - models: ActiveRecord models and business entities shared across apps.
    - validators: Custom validators (e.g., PasswordValidator) used in forms and models.
    - synchronizations: Integration layer for importing/exporting data with external systems (e.g., NAV, image repo, partners). Central factory: common/synchronizations/SyncHandlerFactory.php, which exposes handler methods and metadata used by console sync actions.
      - nav/sync: NAV-specific synchronization handlers (e.g., CampaignSync, BoughtTogetherSync, tables/* for mapping and table helpers).
- console
  - CLI entry for background jobs, maintenance tasks, and scheduled syncs.
  - Key parts:
    - controllers: Console controllers, e.g., SyncController which dynamically exposes actions for each registered sync handler via SyncHandlerFactory.
    - filters: Cross-cutting CLI concerns (e.g., AlreadyRunningFilter to prevent concurrent runs).
    - models: Console-specific repositories/services (e.g., SystemStateProcessesRepository for process state tracking).
    - actions: Generic action classes plugged into controllers (e.g., SyncAction) [if present].
  - See CONSOLE_COMMANDS.md for a full list of console controllers and commands (TempController intentionally omitted).
## Docker & environments

- docker
  - Docker configuration for local development, including MySQL service and initialization via dumps in docker/mysql/dumps.
- environments
  - Yii environment templates/config sets for different deployment modes.
- vendor
  - Composer dependencies (auto-generated; do not edit).
- yii, yii.bat, yii_test, yii_test.bat
  - Yii console bootstrap scripts for Unix/Windows and test environments.
- INSTALLATION.md, README.md
  - Setup instructions. README.md covers Docker build/up and initial migrations.
- AVAILABILITY.md, PAYMENT.md, TESTS.md, MIGRATION.md, PRICE_OLD_LOGIC.md
  - Topic-specific documentation for business logic and processes.
- ORDER_PURCHASE_FLOW.md
  - Detailed end-to-end order purchase flow (API checkout, 2-minute processing cron, 30-minute NAV order sync).
- REGISTRATION_FLOW.md
  - Detailed registration and account lifecycle flow (simple/business/wholesale registration, email verification, password reset, social auth). 
- AVAILABILITY_SYNC.md
  - Deep dive into the NAV availability synchronizer, classification rules, and duplicate suppression.
- ADMIN_MODULE.md
  - Detailed overview of the admin module (structure, modules, workflows, data flows) and links to related docs.

Execution flows (high level)

- Admin and API requests
  - Requests enter via admin/web or api/web (app front controllers, not listed here), and resolve to Yii controllers. Shared logic lives under common/.

- Synchronization jobs (console)
  - The console/controllers/SyncController uses common/synchronizations/SyncHandlerFactory to enumerate valid handler names and expose a dynamic action per handler. Options for each action are provided by the factory.
  - A concurrency guard (console/filters/AlreadyRunningFilter) prevents simultaneous runs for most actions.
  - Typical usage: php yii sync/`<handlerName>` --option=value

Data and integrations

- NAV integration
  - Implemented under common/synchronizations/nav/sync and related tables helpers. Examples include CampaignSync, BoughtTogetherSync.
- Other importers (e.g., Gardners, Nielsen)
  - Exposed through factory methods in SyncHandlerFactory, enabling unified invocation via console.

Local development

- Check README.md for setup instructions.

