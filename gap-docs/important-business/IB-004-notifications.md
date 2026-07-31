---
id: IB-004-notifications
title: IB-004 — Email & SMS Notifications
sidebar_label: IB-004 Notifications
---

# IB-004 — Email & SMS Notifications

| Field | Value |
|---|---|
| Priority | Important |
| Category | Business |
| Gap item | Email & SMS Notifications |
| Description | Queued email/SMS with rate limiting — templates, queue config, delivery tracking |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/core/NOTIFICATIONS.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/core/NOTIFICATIONS.md`

# Email & SMS Notifications

This document describes the notification system including email templates, SMS sending, push notifications, and automated notification generation.

## Overview

The system sends notifications through three channels:
- **Email** — Transactional and marketing emails via Yii mailer
- **SMS** — Via Messente API (Estonian phone numbers)
- **Push** — Mobile push notifications

## SMS (Messente)

**File:** `common/infrastructure/SmsSender.php`

- Uses `Messente\Api\OmnimessageApi`
- Configuration from `Yii::$app->params['smsSender']` (username, password, senderName)
- `sendMessage(to, content, throw)` — Sends SMS, returns boolean
- `getNormalizedEstonianPhoneNumber()` — Normalizes Estonian numbers (adds +372 prefix for numbers starting with 5)
- Error handling: Catches `ApiException`, optionally throws `RuntimeException`

## Email System

### Email Templates

**Directory:** `common/mail/views/`

23 templates with HTML and text variants:

| Template | Purpose |
|----------|---------|
| `emailVerify-html/text` | Email verification |
| `passwordResetToken-html/text` | Password reset |
| `orderCompleteItems*` | Order completion details |
| `basketReminder` | Abandoned basket reminder |
| `wishList*` | Wishlist notifications |
| `authorNewProducts` | New products by followed authors |
| `feedbackReminder` | Post-purchase feedback request |
| `vendorProductConfirmed` | Vendor product approval |
| `vendorAddedProduct` | New vendor product added |
| `mergedProducts` | Product merge notification |
| `voucherGiftCard*` | Gift card emails |
| `wholesaleClientRegistration` | Wholesale registration |

Layouts: `templateWrapper.php`, `html.php`, `text.php`

### Email Message Composers

**Directory:** `common/mail/composers/`

25+ composers, each building a specific email type. All implement `IEmailMessageComposer` interface.

**Order-related:**
- `OrderCompletedBuyerMessageComposer` — Order confirmation to buyer
- `OrderCompletedReceiverMessageComposer` — Order confirmation to receiver (if different)
- `OrderReminderMessageComposer` — Order pickup/action reminder
- `OrderDriveInReminderMessageComposer` — Drive-in pickup reminder

**User account:**
- `EmailVerificationMessageComposer` — Email verification link
- `PasswordResetMessageComposer` — Password reset link

**Gift cards:**
- `VoucherGiftCardMessageComposer` — Voucher gift card delivery
- `LoyaltyGiftCardMessageComposer` — Loyalty gift card notification

**Subscriptions:**
- `SubscriptionPurchasedMessageComposer` — Subscription confirmation
- `SubscriptionCancelledMessageComposer` — Cancellation confirmation
- `SubscriptionBillingFailedMessageComposer` — Failed billing notification

**Other:**
- `BackInStockNotificationMessageComposer` — Product back in stock
- `WholesaleRegistrationMessageComposer` — Wholesale registration
- `WholesaleBasketMergeReceiverMessageComposer` — Wholesale basket merge
- `VendorProductConfirmationMessageComposer` — Vendor product confirmed
- `VendorProductManagerProductAddedMessage` — New vendor product alert
- `RevenueShareReportMessageComposer` — Revenue share reports
- `WoltOfferEmailMessageComposer` — Wolt delivery offers

Base class: `UserMessageComposer` — provides common email building logic with store-specific URL management and activity tracking (objectId, activityType).

## Automated Notification System

**Directory:** `common/notifications/`

### Notification Generation

**Generators** (`common/notifications/generators/`):

| Generator | Type | Description |
|-----------|------|-------------|
| `BasketReminderGenerator` | basket | Abandoned basket reminders |
| `NewSameAuthorProductsGenerator` | offers | New products by authors the user follows |
| `OrderFeedbackReminderGenerator` | order | Post-purchase feedback requests |
| `SpecialOfferGenerator` | offers | Special offer notifications |
| `WishlistProductDiscountGenerator` | offers | Wishlist items on discount |
| `WishlistProductGlobalDiscountGenerator` | offers | Wishlist items in global discount |
| `WishlistProductOutOfStockGenerator` | offers | Wishlist items back in stock |
| `WishlistProductEndingGenerator` | offers | Wishlist items ending soon |

### Notification Formatting

**Formatters** format notifications for specific channels:

- **Email formatters:** `BasketReminderEmailFormatter`, `NewAuthorProductEmailFormatter`, `OrderFeedbackReminderEmailFormatter`, `SimpleSpecialOfferEmailFormatter`, `WishlistProductDiscountEmailFormatter`, `WishlistProductEndingEmailFormatter`
- **Push formatters:** Corresponding push notification variants

### Publishing

**Publishers** (`common/notifications/publishers/`):
- `SpecialOfferEmailPublisher` — Sends special offer emails
- `SpecialOfferPushPublisher` — Sends special offer push notifications
- `BackInStockNotificationPublisher` — Back-in-stock emails
- `VendorRentalReportEmailPublisher` — Vendor rental reports
- `WoltOfferEmailPublisher` — Wolt delivery offer emails

### Management

**Managers:**
- `SpecialOfferGenerationManager` — Orchestrates offer generation
- `SpecialOfferNotificationManager` — Manages offer notification lifecycle
- `BackInStockNotificationManager` — Back-in-stock notification management
- `VendorRentalReportEmailManager` — Vendor report email scheduling
- `WoltOfferEmailManager` — Wolt offer email management

### Caching

- `ExcludedClientAccountCache` — Prevents sending to excluded accounts
- `SentNotificationCache` — Prevents duplicate notifications

### Mobile Push

**File:** `common/notifications/MobilePushNotificationSender.php`

Handles mobile push notification delivery.

## Console Commands

```bash
# Generate notifications
php yii notification/generate --type=basket [--dayOffset=N] [--webStoreNavCode=...]
php yii notification/generate --type=order
php yii notification/generate --type=offers

# Send queued notifications
php yii notification/send [--webStoreNavCode=...]

# Clear expired notifications
php yii notification/clear-expired

# Back-in-stock
php yii back-in-stock-notification/send-emails
php yii back-in-stock-notification/cleanup-old-emails
```

## Expiration Rules

- Wishlist notifications: expire after 3 days
- Product ending notifications: expire after 2 days
- Back-in-stock notifications: cleaned up after 14 days

