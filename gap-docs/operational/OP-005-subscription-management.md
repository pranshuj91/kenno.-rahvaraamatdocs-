---
id: OP-005-subscription-management
title: OP-005 — Subscription Management
sidebar_label: OP-005 Subscription Management
---

# OP-005 — Subscription Management

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Subscription Management |
| Description | Plans, trials, renewals — billing cycles, plan changes, cancellation |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/commerce-ordering/SUBSCRIPTION_MANAGEMENT.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/commerce-ordering/SUBSCRIPTION_MANAGEMENT.md`

# Subscription Management

This document describes the subscription system for audio and ebook products, including billing, plan switching, trials, and cancellation.

## Overview

Rahva Raamat offers subscription plans for audio and ebook content. Subscriptions are billed recurring via EveryPay (MIT — Merchant Initiated Transactions) using saved credit cards.

## Key Components

**Directory:** `common/subscription/`

### Billing

**SubscriptionBillService** (`SubscriptionBillService.php`)
- General subscription billing orchestrator

**EveryPaySubscriptionBillService** (`EveryPaySubscriptionBillService.php`)
- EveryPay-specific billing implementation
- Flow:
  1. Marks subscription as pending
  2. Validates client account is active
  3. Validates billing credit card is present and valid
  4. Creates pending payment transaction via `SubscriptionPaymentInitiator`
  5. Bills via `EveryPayBillService` (MIT transaction)
  6. Handles result via `SubscriptionBillTransactionResultHandler`
- On failure: calls `FailedPaymentSubscriptionHandler`, sends billing-failed email

### Payment Handling

**FailedPaymentSubscriptionHandler** (`FailedPaymentSubscriptionHandler.php`)
- Marks subscription payment as FAILED
- Triggers billing-failed notification email via `SubscriptionBillingFailedMessageComposer`

**SuccessPaymentSubscriptionHandler** (`SuccessPaymentSubscriptionHandler.php`)
- Handles successful subscription payments
- Extends subscription period

### Plan Management

**SubscriptionPlanSwitcher** (`SubscriptionPlanSwitcher.php`)
- Manages switching between subscription plans (e.g., monthly to annual)

**PaymentSubscriptionInitializer** (`PaymentSubscriptionInitializer.php`)
- Initializes new subscription payments

### Cancellation

**PaymentSubscriptionCancellationService** (`PaymentSubscriptionCancellationService.php`)
- Handles subscription cancellation flow

### Trial Eligibility

**SubscriptionTrialAvailabilityChecker** (`SubscriptionTrialAvailabilityChecker.php`)
- Checks whether a user is eligible for a free trial

**ClientAccountSubscriptionTrialAvailabilityChecker** (`ClientAccountSubscriptionTrialAvailabilityChecker.php`)
- Client-account-specific trial eligibility checks

### Pricing

**Directory:** `common/subscription/prices/`

- `SubscriptionPriceCalculator.php` — Calculates subscription costs
- `SubscriptionPlanSwitchingPriceCalculator.php` — Calculates prorated costs when switching plans

### Statistics

**Directory:** `common/subscription/statistics/`

Calculators for subscription analytics:
- Revenue metrics
- Retention rates
- Trial conversion counts
- Active subscription counts

## Admin Panel

**Module:** `admin/modules/subscription/SubscriptionModule.php`

Admin interface for managing subscription plans, viewing subscriber data, and handling manual operations.

## Console Commands

**File:** `console/controllers/SubscriptionController.php`

| Command | Description |
|---------|-------------|
| `php yii subscription/bill` | Bills upcoming payment subscriptions via EveryPay |
| `php yii subscription/update-statistics` | Updates subscription statistics for audio/ebook stores |
| `php yii subscription/init` | Interactive setup for new subscription plans |

> Note: `SubscriptionController` does not use `AlreadyRunningFilter`.

## Payment Flow

```
Cron: php yii subscription/bill
  → EveryPaySubscriptionBillService::bill()
    → Validate subscription + credit card
    → SubscriptionPaymentInitiator::getPendingPaymentTransaction()
    → EveryPayBillService::bill() (MIT transaction)
    → SubscriptionBillTransactionResultHandler::handleTransactionResult()
      → Success: SuccessPaymentSubscriptionHandler (extend period)
      → Failure: FailedPaymentSubscriptionHandler (mark failed + email)
```

## Related Email Notifications

- `SubscriptionPurchasedMessageComposer` — New subscription confirmation
- `SubscriptionCancelledMessageComposer` — Cancellation confirmation
- `SubscriptionBillingFailedMessageComposer` — Failed billing alert

