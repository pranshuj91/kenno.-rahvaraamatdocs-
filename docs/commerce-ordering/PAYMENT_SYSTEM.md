---
id: payment-system
title: Payment System
sidebar_label: Payment System
---
# Payment System

This document describes the payment gateway integrations, payment flow, callback handling, and recurring billing.

## Overview

Rahva Raamat uses **EveryPay** as the primary payment gateway, supporting:
- One-time payments (card, bank links, open banking)
- Recurring/subscription payments via MIT (Merchant Initiated Transactions)
- Saved credit card tokenization

The integration uses the `swiftmade/omnipay-everypay` Omnipay package.

## Architecture

```
Customer checkout
  → Payment initiation (API)
  → Redirect to EveryPay hosted page
  → Customer completes payment
  → EveryPay callback → API callback endpoint
  → EveryPayCallbackHandler processes result
  → Order/Subscription status updated

Recurring billing (cron):
  → SubscriptionController::bill()
  → EveryPaySubscriptionBillService
  → MIT transaction via saved card token
  → EveryPayBillService::bill()
  → Result handler updates subscription
```

## Key Components

### Gateway Configuration

**File:** `api/payments/everypay/Gateway.php`

EveryPay gateway configuration. Settings managed via admin panel at `admin/modules/setting/controllers/IntegrationController.php`.

### One-Time Payment Flow

1. **Initiation:** Customer selects payment method at checkout
2. **Redirect:** Customer is redirected to EveryPay's hosted payment page
3. **Callback:** After payment, EveryPay sends callback to the API
4. **Processing:** `EveryPayCallbackHandler` processes the bank-returned payment notification

### EveryPay Callback Handler

**File:** `api/payments/everypay/EveryPayCallbackHandler.php`

Handles bank-returned payment notifications:
- Routes to appropriate transaction handler (Order or Subscription)
- Processes payment result (success/failure)
- Updates order or subscription status accordingly

**Async processing:** `common/models/jobs/EveryPayCallbackHandlerJob.php` — Queued job for processing callbacks asynchronously via the queue system.

### MIT Billing Service

**File:** `api/payments/everypay/EveryPayBillService.php`

Handles Merchant Initiated Transactions for recurring payments:
- Uses saved credit card tokens
- Processes purchase responses
- Used by subscription billing system

### MIT Payment Request

**File:** `api/payments/everypay/Messages/MitPaymentRequest.php`

Formats MIT payment requests with required parameters for EveryPay.

## Subscription Billing

**File:** `common/subscription/EveryPaySubscriptionBillService.php`

Recurring subscription billing flow:
1. Mark subscription as pending
2. Validate client account and credit card
3. Create pending transaction via `SubscriptionPaymentInitiator`
4. Execute MIT transaction via `EveryPayBillService`
5. Handle result via `SubscriptionBillTransactionResultHandler`

On failure: `FailedPaymentSubscriptionHandler` marks as failed and sends notification email.

See `./SUBSCRIPTION_MANAGEMENT.md` for full subscription details.

### Payment Initiator

**File:** `api/payments/initiators/SubscriptionPaymentInitiator.php`

Creates pending payment transactions for subscription billing.

### Transaction Handlers

**File:** `api/payments/handlers/SubscriptionBillTransactionResultHandler.php`

Routes successful/failed billing results to the appropriate subscription handler.

### Transaction Repository

**File:** `api/payments/transactions/repositories/SubscriptionTransactionRepository.php`

Database access layer for subscription payment transactions.

## Console Commands

```bash
# Bill upcoming subscriptions
php yii subscription/bill
```

## Admin Configuration

**File:** `admin/modules/setting/controllers/IntegrationController.php`

Admin interface for managing:
- EveryPay API credentials
- Payment method configuration
- Gateway settings

## Error Handling

- Payment failures update order/subscription status appropriately
- Failed subscription billing sends notification email to customer (`SubscriptionBillingFailedMessageComposer`)
- Callback handler uses queue-based async processing for reliability
- MIT billing validates credit card presence and validity before attempting charge



