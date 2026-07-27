---
id: MIGRATION
title: Migration Guide
sidebar_label: Migration Guide
---
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

