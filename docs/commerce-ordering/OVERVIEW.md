---
id: OVERVIEW
title: Commerce & Ordering Overview
sidebar_label: Overview
sidebar_position: 0
---

# Commerce & Ordering

This section covers the **purchase path**: ecommerce integration, basket, checkout, payments, pricing, availability, shipping, and order handling.

Use the sidebar on the left, or the tables below, to open any page. Each topic lists what is covered inside so you can scan from this overview.

## In this section

### Orders & Checkout

| ID | Topic |
|---|---|
| [COM-001](./Ecommerce%20Integration%20Guide.md) | Ecommerce Integration Guide |
| [COM-002](./ORDER_PURCHASE_FLOW.md) | Order Purchase Flow |
| [COM-003](./Order%20Placement.md) | Order Management |
| [COM-004](./ORDER_HANDLING_BY_CLIENT_TYPE.md) | Order Handling by Client Type |
| [COM-005](./Basket%20Management.md) | Basket Management |
| [COM-006](./03-CHECKOUT_PROCESS.md) | Checkout Process |

### [COM-001](./Ecommerce%20Integration%20Guide.md) — Ecommerce Integration Guide

| Inside this page |
|---|
| Integration Architecture |
| Authentication & Authorization |
| Product Management |
| Order Management |
| Customer Management |
| Payment Integration |
| Shipping Integration |
| Webhook Integration |
| Error Handling |
| Rate Limiting |
| Testing and Development |
| Security Best Practices |
| Performance Optimization |
| Monitoring and Analytics |
| Support and Resources |


### [COM-002](./ORDER_PURCHASE_FLOW.md) — Order Purchase Flow

| Inside this page |
|---|
| API checkout (POST checkout/index) |
| Bank payment create-form & return |
| Order status transitions |
| console/order/process (post-payment) |
| NAV order synchronization |


### [COM-003](./Order%20Placement.md) — Order Management

| Inside this page |
|---|
| Order Placement Flow |
| Order Placement Components |
| Order Placement API |
| Order Creation Process |
| Payment Processing |
| Post-Placement Actions |
| Error Handling |
| Order Status Management |
| Security and Validation |
| Performance Optimization |
| Testing and Monitoring |


### [COM-004](./ORDER_HANDLING_BY_CLIENT_TYPE.md) — Order Handling by Client Type

| Inside this page |
|---|
| Client type classifiers and account routing |
| Retail (customers/guests) |
| Business clients |
| Wholesale clients |
| NAV posting differences |
| Fulfillment and notifications |


### [COM-005](./Basket%20Management.md) — Basket Management

| Inside this page |
|---|
| Basket Architecture |
| Basket Models |
| Basket API Endpoints |
| Basket Validation |
| Basket Calculation |
| Basket Storage |
| Basket Merging |
| Basket Expiration |
| Basket Analytics |
| Error Handling |
| Security Features |
| Testing and Development |


### [COM-006](./03-CHECKOUT_PROCESS.md) — Checkout Process

| Inside this page |
|---|
| Checkout Flow Architecture |
| Checkout Components |
| Checkout API Endpoints |
| Checkout Validation Rules |
| Error Handling |
| Checkout Security |
| Performance Considerations |
| Testing |
| Monitoring and Logging |


### Payments

| ID | Topic |
|---|---|
| [COM-007](./PAYMENT_SYSTEM.md) | Payment System |
| [COM-008](./PAYMENT.md) | Payment Overview |
| [COM-009](./Payment%20Integration.md) | Payment Integration |

### [COM-007](./PAYMENT_SYSTEM.md) — Payment System

| Inside this page |
|---|
| Architecture |
| Key Components |
| Subscription Billing |
| Console Commands |
| Admin Configuration |
| Error Handling |


### [COM-008](./PAYMENT.md) — Payment Overview

| Inside this page |
|---|
| AdaptersAbstract |
| Dataset |
| PaymentHandlerBase |
| ServicesAbstract |
| Payment |
| Transaction |
| AdapterInterface |
| IPizza |
| SwedCard |
| Payment related actions |


### [COM-009](./Payment%20Integration.md) — Payment Integration

| Inside this page |
|---|
| Payment Architecture |
| Supported Payment Methods |
| Payment Gateway Integration |
| Payment Processing Models |
| Payment API Endpoints |
| Payment Security |
| Payment Workflows |
| Payment Reconciliation |
| Error Handling |
| Payment Testing |
| Payment Analytics |
| Compliance and Regulations |
| Troubleshooting |


### Catalog & Pricing

| ID | Topic |
|---|---|
| [COM-010](./PRICING.md) | Pricing Logic |
| [COM-011](./AVAILABILITY.md) | Availability |
| [COM-012](./AVAILABILITY_SYNC.md) | Availability Sync |
| [COM-013](./SUBSCRIPTION_MANAGEMENT.md) | Subscription Management |
| [COM-014](./Shipping%20Integration.md) | Shipping Integration |

### [COM-010](./PRICING.md) — Pricing Logic

| Inside this page |
|---|
| Core concepts and entities |
| Price calculators by client type |
| Discounts and campaigns |
| VAT handling |
| Assigned/custom discounts |
| Extension points |


### [COM-011](./AVAILABILITY.md) — Availability

| Inside this page |
|---|
| Tables updated from NAV (rr_product_availability, rr_product) |
| Sync schedule |
| Permanently out of stock |
| Temporarily out of stock |
| Available / available in shops |
| Coming soon |


### [COM-012](./AVAILABILITY_SYNC.md) — Availability Sync

| Inside this page |
|---|
| How to run |
| Schedule |
| High-level phases |
| 1) NAV source: ItemsAvailableForWeb |
| 2) Normalize temp against rr_shop and rr_product |
| 3) Rebuild rr_product_availability (per-shop stock table) |
| 4) Classify availability and compute stock_count |
| 5) Apply to rr_product |
| 6) Post-phase updates |
| Edge cases and safeguards |
| Data touched |
| Discoverability in code |
| Operational tips |


### [COM-013](./SUBSCRIPTION_MANAGEMENT.md) — Subscription Management

| Inside this page |
|---|
| Key Components |
| Admin Panel |
| Console Commands |
| Payment Flow |


### [COM-014](./Shipping%20Integration.md) — Shipping Integration

| Inside this page |
|---|
| Shipping Architecture |
| Supported Shipping Providers |
| Delivery Methods |
| Shipping Calculation |
| Shipping API Endpoints |
| Shipping Label Generation |
| Delivery Time Calculation |
| Shipping Configuration |
| Shipping Webhooks |
| International Shipping |
| Shipping Analytics |
| Error Handling |
| Testing and Development |
| Troubleshooting |

