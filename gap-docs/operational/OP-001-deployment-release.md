---
id: OP-001-deployment-release
title: OP-001 — Deployment & Release Process
sidebar_label: OP-001 Deployment & Release
---

# OP-001 — Deployment & Release Process

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Deployment & Release Process |
| Description | Branch strategy, migrations, rollback — CI/CD pipeline, deployment steps |
| Documentation status | Documented |
| Code location | — |
| Assigned to | — |

## Related Developer Docs

- `docs/deployment/11-DEPLOYMENT_GUIDE.md`
- `docs/setup-guide/DOCKER_SETUP.md`
- `docs/setup-guide/MIGRATION.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/deployment/11-DEPLOYMENT_GUIDE.md`

# Deployment guide — environments and release process

This guide standardizes how we deploy changes across environments. It covers branch conventions, staging verification, production rollout, post‑deploy checks, and rollback.

## Scope and audience
- For developers and operators deploying the Yii2 application (admin, api, console).
- Complements the project structure and console command references.

## Environments and branches
- Local: work on feature branches from master.
- Staging: branch staging (testing environment).
- Production: release-YYYYMMDD (e.g., release-20250130).

## Branch and release naming
- Feature branch: NRR-\{task number\} (e.g., NRR-1234) created from master.
- Release branch: release-YYYYMMDD created from master when preparing a production deployment.

## Prerequisites
- Ensure composer dependencies are installed and the app builds in CI.
- Database migrations are idempotent and tested on staging.

## Staging workflow
1. Create a feature branch from master: NRR-XXXX.
2. Open a PR to staging when ready for integration testing; merge after review.
3. On the staging server:
   - Pull latest staging.
   - Run database migrations.
   - Optionally clear caches if behavior or config changed.
   - Verify key flows (login, admin access, critical console jobs) and that no concurrency guard is blocking expected runs.

Command snippets
```bash
# Run DB migrations
php yii migrate

# Clear/flush caches (if needed)
php yii cleanup/clean-cache --key=all
php yii cleanup/flush-cache
```

If staging is tested, open a PR from staging to master (or directly from feature to master, depending on repository policy) and obtain approvals.

## Production deployment steps
1. Create a release branch from master: release-YYYYMMDD.
2. Connect to the production environment and switch to the release branch.
3. Switch to the new release branch and install prod dependencies if applicable.
4. Run database migrations.
5. Clear/flush caches when needed (config/DI/feature‑flag changes, view/layout changes, or after large imports).
6. Verify health and critical flows.

Command snippets
```bash
# Pull code and ensure vendor up to date (depends on deploy tooling)
composer install --no-dev -o

# Apply DB migrations
php yii migrate

# Clear caches (only if necessary)
php yii cleanup/clean-cache --key=all
php yii cleanup/flush-cache

# Optional: check console controllers list if diagnosing
php yii
```

Post‑deploy checks (suggested)
- Admin login, dashboard loads.
- A read‑only API endpoint responds with 200.
- Background jobs that normally run (e.g., sync/*) are not stuck by AlreadyRunningFilter; last‑run timestamps look recent.

## Rollback (production)
If a rollback is required:
1. Evaluate whether migrations introduced irreversible changes. If safe to revert, run down migrations for the release.
2. Switch the environment back to the previous release branch.
3. Re‑run migrations if needed to match the previous schema state.
4. Clear relevant caches if behavior changed.

Command snippets
```bash
# Roll back last batch (confirm number of steps first)
php yii migrate/down

# Switch branch to previous release and bring up
# (use your deploy tooling or git checkout <prev-release>)
```

Notes
- Only run migrate/down if migrations support safe down and data safety is confirmed.
- Some data migrations may be irreversible; in such cases, consult the team before attempting down.

## Troubleshooting tips
- Use php yii help `<controller-id>` to inspect available commands and their options.
- See ../reference/CONSOLE_COMMANDS_SUMMARY.md for a curated list of controllers and dynamic sync actions.
- Logs and archives: see console/controllers/ArchiveController::actionLogs and rr_log usage.
- Cache anomalies after config or DI changes usually resolve with cleanup/flush-cache.

## Related documentation
- ../core/STRUCTURE.md — repository structure and flows.
- ../reference/CONSOLE_COMMANDS_SUMMARY.md — console controllers and dynamic sync actions.
- README.md — local setup and migration commands.


---

### Developer Docs — `docs/setup-guide/DOCKER_SETUP.md`

### Project setup with Docker

To install the project locally follow the instructions below:

1. Install Docker Desktop.

2. Download MySQL dump file.

3. Move the dump file to the folder `[project root]/docker/mysql/dumps/`.

4. Rename the dump file to `dump.sql`.

5. Run `docker compose build`. (from the docker directory)

6. Run `docker compose up`. (from the docker directory)

7. Wait for mysql to import the dump and output a similar message to the docker console:

```text
12:53:40+00:00 [Note] [Entrypoint]: /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/dump.sql
13:01:25+00:00 [Note] [Entrypoint]: Stopping temporary server
13:01:26+00:00 [Note] [Entrypoint]: Temporary server stopped
13:01:26+00:00 [Note] [Entrypoint]: MariaDB init process done. Ready for start up.
```

8. Access application container console and run next commands:
```text
composer install

php yii migrate
```
NOTE: some error might appear during migration execution. It will depends on the dump that is used.
The issues can be solved just by commenting problem parts of the migrations.

9. Access application using http://localhost:8080/admin-panel


See also
- [Local Setup Roadmap](/docs/setup-guide/LOCAL_SETUP)
- [Console Commands](/docs/reference/CONSOLE_COMMANDS_SUMMARY)
- [Elasticsearch Spool](/docs/integrations/ELASTICSEARCH_SPOOL)
- [Payment System](/docs/commerce-ordering/payment-system)
- [Order Purchase Flow](/docs/commerce-ordering/order-purchase-flow)
- [Order Handling by Client Type](/docs/commerce-ordering/order-handling-by-client-type)
- [Pricing Logic](/docs/commerce-ordering/pricing)
- [Admin Module](/docs/reference/ADMIN_MODULE)
- [Registration Flow](/docs/authentication/REGISTRATION_FLOW)
- [Hotline & OIDC](/docs/hotline-and-oidc/Hotline-OIDC-Documentation)


---

### Developer Docs — `docs/setup-guide/MIGRATION.md`

# This file describes changes applied to file system structure during codebase migration

## Application components
*  `classifier` -> `classifier`
*  `state` -> `system` application component (name `state` already in use in Yii2).
*  `fs` -> `\common\helpers\FileHelper` class (extended from Yii2 File helper).


## Models
*  Prefix `Rr` removed for all models. 
*  Store all ActiveRecord models in the `common\models` namespace.
*  Added `ActiveQuery` classes for expand a query building logic of ActiveRecords. Stored at the `common\models\queries` namespace.
*  `ConsoleUser` -> `console\models\User`.
*  `ActiveRecord` ->
   *  `beforeValidate()` -> `common\models\behaviours\UserBehaviour` + `yii\behaviors\TimestampBehaviour`.
   *  `log()` -> `common\models\LogTrait`.
*  constants of `Payment` -> `common\enums\PaymentStatusEnum`.
*  `Mailer` -> `Yii::$app->mailer` - application component.
   * `sendUserMail()` -> `common\mail\UserMailer->send()`
*  `RrOrder` ->
   * `markAsFailed()` -> `common\models\order\FailedOrderProcessor`.
   * `finalize()`
   * `finalizeOrderProducts()`  -> `common\models\order\SuccessOrderProcessor`.
   * `process()`  -> `common\models\order\PurchaseOrderManager`.
*  `RrOrderProduct` ->
   * `process()`  -> `common\models\order\PurchaseOrderManager`.
   * `ensureDownloadable()`  -> `common\models\order\PurchaseOrderManager`.
   * `processAdditionalAttributes()`  -> `common\models\order\PurchaseOrderManager`.
   * `postProcess()`  -> `common\models\order\PurchaseOrderManager`.
   * `getApiOrderHandler()` -> `common\purchases\ProductPurchaseServiceFactory`.
*  `\ExternalApi\Edrk\ProductOrder` -> `common\purchases\EdrkPurchaseService`.
*  `\ExternalApi\Digira\ProductOrder` -> `common\purchases\DigiraPurchaseService`.
*  `DrmManager` -> `common\purchases\DrmPurchaseService`.
*  `rahvaraamat\offers\specialOffer\SpecialOfferChannelEnum` -> `common\enums\SpecialOfferChannelEnum`
*  `rahvaraamat\offers\specialOffer\SpecialOfferTypeEnum` -> `common\enums\SpecialOfferTypeEnum`
*  `rahvaraamat\offers\specialOffer\SpecialOfferChannelStatusEnum` -> `common\enums\SpecialOfferChannelStatusEnum`
*  `rahvaraamat\offers\specialOffer\SpecialOfferPublisher` ->  `common\notifications\SpecialOfferNotificationManager`
*  `rahvaraamat\offers\specialOffer\SpecialOfferGenerator` ->  `common\notifications\SpecialOfferGenerationManager`
*  `rahvaraamat\offers\specialOffer\generators\AbstractGenerator` -> `common\notifications\generators\SpecialOfferGenerator`
   * `BasketReminder` -> `common\notifications\generators\BasketReminder`
   * `NewSameAuthorProducts` -> `common\notifications\generators\NewSameAuthorProducts`
   * `OrderFeedbackReminder` -> `common\notifications\generators\OrderFeedbackReminder`
   * `WishlistProductDiscount` -> `common\notifications\generators\WishlistProductDiscount`
   * `WishlistProductGlobalDiscount` -> `common\notifications\generators\WishlistProductGlobalDiscount`
   * `WishlistProductOutOfStock` -> `common\notifications\generators\WishlistProductOutOfStock`
*  `rahvaraamat\offers\specialOffer\senders\AbstractSender` -> `common\notifications\offers\SpecialOfferNotification`
   * `BasketReminderSender` -> 
      * `BasketReminderNotification`
      * `common\notifications\formatters\BasketReminderEmailFormatter`
   * `NewAuthorProductSender` ->
      * `NewAuthorProductNotification`
      * `NewAuthorProductEmailFormatter`
      * `NewAuthorProductPushFormatter`
   * `OrderFeedbackReminderSender` -> 
      * `OrderFeedbackReminderNotification`
      * `OrderFeedbackReminderEmailFormatter`
   * `SpecialOfferSender` ->
      * `SimpleSpecialOfferNotification`
      * `SimpleSpecialOfferEmailFormatter`
      * `SimpleSpecialOfferPushFormatter`
   * `WishlistProductDiscountSender` ->
      * `WishlistProductDiscountNotification`
      * `WishlistProductDiscountEmailFormatter`
      * `WishlistProductDiscountPushFormatter`
   * `WishlistProductEndingSender` -> 
      * `WishlistProductEndingNotification`
      * `WishlistProductEndingEmailFormatter`
      * `WishlistProductEndingPushFormatter`
* `rahvaraamat\offers\specialOffer\senders\channelPublisher\ChannelPublisher` -> `common\notifications\publishers\SpecialOfferNotificationPublisher`
   * `EmailChannel` -> `SpecialOfferEmailPublisher`
   * `PushNotificationChannel` -> `SpecialOfferPushPublisher`
* `rahvaraamat\offers\specialOffer\SentNotificationCache` -> 
   * `common\notifications\cache\SentNotificationCache`
   * `common\notifications\cache\ExcludedClientAccountCache`
* `rahvaraamat\notification\PushNotificationSender` -> `common\notifications\MobilePushNotificationSender`


## Controllers
* `ConsoleCommand` -> `console\controllers\BaseController`.
* `CleanupCommand` -> `console\controllers\CleanupController`.
  *  `actionArchiveLogs` -> `console\controllers\ArchiveController->actionLogs`.
* `SitemapCommand` -> `console\controllers\SitemapController`.
* `OrderCommand` -> `console\controllers\OrderController`.
* `NotificationCommand` -> `console\controllers\NotificationController`.
* `SubscriptionCommand` -> `console\controllers\SubscriptionController`.
    * `SubscriptionProcessor` -> `common\subscriptions\SubscriptionManager`.
    * `SubscriptionFactory` -> `common\subscriptions\SubscriptionDecoratorFactory`.

