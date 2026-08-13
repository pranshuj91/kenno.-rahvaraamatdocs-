---
id: CONSOLE_COMMANDS_SUMMARY
title: Console Commands Summary
sidebar_label: Console Commands Summary
---
### Console controllers and commands

## How to invoke commands

This document lists the available console controllers and their actions. Invoke any command via:

- php yii `<controller-id>`/`<action-id>` [--option=value ...]

Notes
- temp controller are intentionally omitted as requested
## AlreadyRunningFilter notes

- Some controllers use the AlreadyRunningFilter to avoid concurrent execution.
## SyncController dynamic actions

- For dynamic sync actions, see SyncController section below.

## Controllers overview (anvol, archive, cleanup, …)
- anvol (INTEGRATION)
  - import-products
  - import-category-map
  - import-delivery-method-offset
  - export-category-map

- archive
  - logs

- ~~audio~~ **(DEPRECATED)**

- ~~authors-republic~~ **(DEPRECATED)**

- back-in-stock-notification
  - send-emails
  - cleanup-old-emails

- cleanup
  - clean-cache --key=...
  - flush-cache
  - playback-breakpoints
  - index
  - pre-saved-credit-card-tokens
  - failed-orders --noPrompt=0|1 --interval="..."
  - failed-logins --noPrompt=0|1 --interval="..."
  - obsolete-products --noPrompt=0|1 --interval="..."
  - failed-async-processes --noPrompt=0|1 --interval="..."
  - client-basket-sanitize --noPrompt=0|1
  - temp-client-basket-sanitize --noPrompt=0|1
  - queue
  - outdated-session-actions

- ctr
  - clear-old-stat-data
  - sync-stat

- custobar (INTEGRATION)
  - see php yii help custobar

- data-migration
  - see php yii help data-migration

- db
  - see php yii help db

- debug
  - see php yii help debug

- ~~digira~~ **(DEPRECATED)**

- ~~digiread~~ (**DEPRECATED)**

- ~~duplicate~~ **(DEPRECATED)**

- edrk (INTEGRATION)

- ~~edrk-file-importer~~ **(DEPRECATED)**

- elastic
  - see php yii help elastic
  - For implementation details and usage of import/spool commands, see ../integrations/ELASTICSEARCH_SPOOL.md

- external-url
  - test
  - truncate-repository --withLogs=0|1
  - monitor-repository
  - monitor-bloom-filter
  - monitor-redirects `<webStore>` `<fromVersion>` `<toVersion>` [--limit=N]
  - synchronize-categories-slugs
  - migrate-between-versions `<webStore>` `<fromVersion>` `<toVersion>` [--limit=N]
  - migrate-products-between-versions `<webStore>` `<fromVersion>` `<toVersion>`
  - migrate-categories-between-versions `<webStore>` `<fromVersion>` `<toVersion>`
  - migrate-product-series-between-versions `<webStore>` `<fromVersion>` `<toVersion>` [--limit=N]

- feed-exporter
  - see php yii help feed-exporter

- file
  - see php yii help file

- gardners (INTEGRATION)
  - see php yii help gardners

- health-check
  - see php yii help health-check

- insplay (INTEGRATION)
  - see php yii help insplay

- ~~kafka~~ **(DEPRECATED)**
  - see php yii help kafka

- klaviyo (INTEGRATION)
  - see php yii help klaviyo

- loyalty-program
  - see php yii help loyalty-program

- mail
  - see php yii help mail

- notification
  - see php yii help notification

- oidc
  - see php yii help oidc

- order
  - see php yii help order

- product-badge
  - see php yii help product-badge

- product-discount
  - see php yii help product-discount

- ~~product-epub-file-pages-count-calculation~~ **(DEPRECATED)**

- product-product-person
  - see php yii help product-product-person

- ~~product-statistics~~ **(DEPRECATED)**

- ~~product-web-store-category-update~~ **(DEPRECATED)**

- queue-failed-jobs
  - see php yii help queue-failed-jobs

- raamatukoi (INTEGRATION)
  - see php yii help raamatukoi

- rbac
  - see php yii help rbac

- remove-authors-with-number-names
  - see php yii help remove-authors-with-number-names

- ~~revenue-share~~ **(DEPRECATED)**

- sitemap
  - see php yii help sitemap

- ~~statistic~~ **(DEPRECATED)**

- sync
  - Dynamic sync controller. It exposes an action for every valid handler returned by common/synchronizations/SyncHandlerFactory::getValidHandlerNames().
  - Usage: php yii sync/`<handler-name>` [--option=value]
  - To discover available handlers: inspect SyncHandlerFactory or run php yii help sync to see generated actions.
  - Options per handler are provided by SyncHandlerFactory::getHandlerOptions($actionId).

- web-store
  - see php yii help web-store

- ~~wholesale-order~~ **(DEPRECATED)**

- wolt-offer
  - see php yii help wolt-offer

Omitted controllers per request
- temp (TempController)
- subscription (SubscriptionController)

Tips
- Use php yii to list all controllers and php yii help `<controller-id>` to list actions and their parameters with your local config.
- Many long-running commands include a concurrency guard to prevent overlapping runs.

## See also
- ../setup-guide/LOCAL_SETUP.md — getting the project running locally
- ../integrations/ELASTICSEARCH_SPOOL.md — implementation details and how to run elastic/import and elastic/spool



