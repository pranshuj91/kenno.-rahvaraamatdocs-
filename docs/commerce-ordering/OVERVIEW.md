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
| [Integration Architecture](./Ecommerce%20Integration%20Guide.md#integration-architecture) |
| [Authentication & Authorization](./Ecommerce%20Integration%20Guide.md#authentication--authorization) |
| [Product Management](./Ecommerce%20Integration%20Guide.md#product-management) |
| [Order Management](./Ecommerce%20Integration%20Guide.md#order-management) |
| [Customer Management](./Ecommerce%20Integration%20Guide.md#customer-management) |
| [Payment Integration](./Ecommerce%20Integration%20Guide.md#payment-integration) |
| [Shipping Integration](./Ecommerce%20Integration%20Guide.md#shipping-integration) |
| [Webhook Integration](./Ecommerce%20Integration%20Guide.md#webhook-integration) |
| [Error Handling](./Ecommerce%20Integration%20Guide.md#error-handling) |
| [Rate Limiting](./Ecommerce%20Integration%20Guide.md#rate-limiting) |
| [Testing and Development](./Ecommerce%20Integration%20Guide.md#testing-and-development) |
| [Security Best Practices](./Ecommerce%20Integration%20Guide.md#security-best-practices) |
| [Performance Optimization](./Ecommerce%20Integration%20Guide.md#performance-optimization) |
| [Monitoring and Analytics](./Ecommerce%20Integration%20Guide.md#monitoring-and-analytics) |
| [Support and Resources](./Ecommerce%20Integration%20Guide.md#support-and-resources) |

### [COM-002](./ORDER_PURCHASE_FLOW.md) — Order Purchase Flow

| Inside this page |
|---|
| [API checkout (POST checkout/index)](./ORDER_PURCHASE_FLOW.md#api-checkout-post-checkoutindex) |
| [Bank payment create-form & return](./ORDER_PURCHASE_FLOW.md#bank-payment-create-form--return) |
| [Order status transitions](./ORDER_PURCHASE_FLOW.md#order-status-transitions) |
| [console/order/process (post-payment)](./ORDER_PURCHASE_FLOW.md#consoleorderprocess-post-payment) |
| [NAV order synchronization](./ORDER_PURCHASE_FLOW.md#nav-order-synchronization) |

### [COM-003](./Order%20Placement.md) — Order Management

| Inside this page |
|---|
| [Order Placement Flow](./Order%20Placement.md#order-placement-flow) |
| [Order Placement Components](./Order%20Placement.md#order-placement-components) |
| [Order Placement API](./Order%20Placement.md#order-placement-api) |
| [Order Creation Process](./Order%20Placement.md#order-creation-process) |
| [Payment Processing](./Order%20Placement.md#payment-processing) |
| [Post-Placement Actions](./Order%20Placement.md#post-placement-actions) |
| [Error Handling](./Order%20Placement.md#error-handling) |
| [Order Status Management](./Order%20Placement.md#order-status-management) |
| [Security and Validation](./Order%20Placement.md#security-and-validation) |
| [Performance Optimization](./Order%20Placement.md#performance-optimization) |
| [Testing and Monitoring](./Order%20Placement.md#testing-and-monitoring) |

### [COM-004](./ORDER_HANDLING_BY_CLIENT_TYPE.md) — Order Handling by Client Type

| Inside this page |
|---|
| [Client type classifiers and account routing](./ORDER_HANDLING_BY_CLIENT_TYPE.md#client-type-classifiers-and-account-routing) |
| [Retail (customers/guests)](./ORDER_HANDLING_BY_CLIENT_TYPE.md#retail-customersguests-order-handling) |
| [Business clients](./ORDER_HANDLING_BY_CLIENT_TYPE.md#business-clients-company-order-handling) |
| [Wholesale clients](./ORDER_HANDLING_BY_CLIENT_TYPE.md#wholesale-clients-order-handling) |
| [NAV posting differences](./ORDER_HANDLING_BY_CLIENT_TYPE.md#nav-posting-and-synchronization-differences) |
| [Fulfillment and notifications](./ORDER_HANDLING_BY_CLIENT_TYPE.md#fulfillment-and-notifications) |

### [COM-005](./Basket%20Management.md) — Basket Management

| Inside this page |
|---|
| [Basket Architecture](./Basket%20Management.md#basket-architecture) |
| [Basket Models](./Basket%20Management.md#basket-models) |
| [Basket API Endpoints](./Basket%20Management.md#basket-api-endpoints) |
| [Basket Validation](./Basket%20Management.md#basket-validation) |
| [Basket Calculation](./Basket%20Management.md#basket-calculation) |
| [Basket Storage](./Basket%20Management.md#basket-storage) |
| [Basket Merging](./Basket%20Management.md#basket-merging) |
| [Basket Expiration](./Basket%20Management.md#basket-expiration) |
| [Basket Analytics](./Basket%20Management.md#basket-analytics) |
| [Error Handling](./Basket%20Management.md#error-handling) |
| [Security Features](./Basket%20Management.md#security-features) |
| [Testing and Development](./Basket%20Management.md#testing-and-development) |

### [COM-006](./03-CHECKOUT_PROCESS.md) — Checkout Process

| Inside this page |
|---|
| [Checkout Flow Architecture](./03-CHECKOUT_PROCESS.md#checkout-flow-architecture) |
| [Checkout Components](./03-CHECKOUT_PROCESS.md#checkout-components) |
| [Checkout API Endpoints](./03-CHECKOUT_PROCESS.md#checkout-api-endpoints) |
| [Checkout Validation Rules](./03-CHECKOUT_PROCESS.md#checkout-validation-rules) |
| [Error Handling](./03-CHECKOUT_PROCESS.md#error-handling) |
| [Checkout Security](./03-CHECKOUT_PROCESS.md#checkout-security) |
| [Performance Considerations](./03-CHECKOUT_PROCESS.md#performance-considerations) |
| [Testing](./03-CHECKOUT_PROCESS.md#testing) |
| [Monitoring and Logging](./03-CHECKOUT_PROCESS.md#monitoring-and-logging) |
### Payments

| ID | Topic |
|---|---|
| [COM-007](./PAYMENT_SYSTEM.md) | Payment System |
| [COM-008](./PAYMENT.md) | Payment Overview |
| [COM-009](./Payment%20Integration.md) | Payment Integration |

### [COM-007](./PAYMENT_SYSTEM.md) — Payment System

| Inside this page |
|---|
| [Architecture](./PAYMENT_SYSTEM.md#architecture) |
| [Key Components](./PAYMENT_SYSTEM.md#key-components) |
| [Subscription Billing](./PAYMENT_SYSTEM.md#subscription-billing) |
| [Console Commands](./PAYMENT_SYSTEM.md#console-commands) |
| [Admin Configuration](./PAYMENT_SYSTEM.md#admin-configuration) |
| [Error Handling](./PAYMENT_SYSTEM.md#error-handling) |

### [COM-008](./PAYMENT.md) — Payment Overview

| Inside this page |
|---|
| [AdaptersAbstract](./PAYMENT.md#adaptersabstract) |
| [Dataset](./PAYMENT.md#dataset) |
| [PaymentHandlerBase](./PAYMENT.md#paymenthandlerbase) |
| [ServicesAbstract](./PAYMENT.md#servicesabstract) |
| [Payment](./PAYMENT.md#payment) |
| [Transaction](./PAYMENT.md#transaction) |
| [AdapterInterface](./PAYMENT.md#adapterinterface) |
| [IPizza](./PAYMENT.md#ipizza) |
| [SwedCard](./PAYMENT.md#swedcard) |
| [Payment related actions](./PAYMENT.md#payment-related-actions) |

### [COM-009](./Payment%20Integration.md) — Payment Integration

| Inside this page |
|---|
| [Payment Architecture](./Payment%20Integration.md#payment-architecture) |
| [Supported Payment Methods](./Payment%20Integration.md#supported-payment-methods) |
| [Payment Gateway Integration](./Payment%20Integration.md#payment-gateway-integration) |
| [Payment Processing Models](./Payment%20Integration.md#payment-processing-models) |
| [Payment API Endpoints](./Payment%20Integration.md#payment-api-endpoints) |
| [Payment Security](./Payment%20Integration.md#payment-security) |
| [Payment Workflows](./Payment%20Integration.md#payment-workflows) |
| [Payment Reconciliation](./Payment%20Integration.md#payment-reconciliation) |
| [Error Handling](./Payment%20Integration.md#error-handling) |
| [Payment Testing](./Payment%20Integration.md#payment-testing) |
| [Payment Analytics](./Payment%20Integration.md#payment-analytics) |
| [Compliance and Regulations](./Payment%20Integration.md#compliance-and-regulations) |
| [Troubleshooting](./Payment%20Integration.md#troubleshooting) |
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
| [Core concepts and entities](./PRICING.md#core-concepts-and-entities) |
| [Price calculators by client type](./PRICING.md#price-calculators-by-client-type-commonpricescalculators) |
| [Discounts and campaigns](./PRICING.md#discounts-and-campaigns) |
| [VAT handling](./PRICING.md#vat-handling) |
| [Assigned/custom discounts](./PRICING.md#assignedcustom-discounts-and-data-sources) |
| [Extension points](./PRICING.md#extension-points) |

### [COM-011](./AVAILABILITY.md) — Availability

| Inside this page |
|---|
| [Tables updated from NAV (rr_product_availability, rr_product)](./AVAILABILITY.md#tables-updated-from-nav-rr_product_availability-rr_product) |
| [Sync schedule](./AVAILABILITY.md#sync-schedule) |
| [Permanently out of stock](./AVAILABILITY.md#permanently-out-of-stock) |
| [Temporarily out of stock](./AVAILABILITY.md#temporarily-out-of-stock) |
| [Available / available in shops](./AVAILABILITY.md#available--available-in-shops) |
| [Coming soon](./AVAILABILITY.md#coming-soon) |

### [COM-012](./AVAILABILITY_SYNC.md) — Availability Sync

| Inside this page |
|---|
| [How to run](./AVAILABILITY_SYNC.md#how-to-run) |
| [Schedule](./AVAILABILITY_SYNC.md#schedule) |
| [High-level phases](./AVAILABILITY_SYNC.md#high-level-phases) |
| [1) NAV source: ItemsAvailableForWeb](./AVAILABILITY_SYNC.md#1-nav-source-itemsavailableforweb) |
| [2) Normalize temp against rr_shop and rr_product](./AVAILABILITY_SYNC.md#2-normalize-temp-against-rr_shop-and-rr_product) |
| [3) Rebuild rr_product_availability (per-shop stock table)](./AVAILABILITY_SYNC.md#3-rebuild-rr_product_availability-per-shop-stock-table) |
| [4) Classify availability and compute stock_count](./AVAILABILITY_SYNC.md#4-classify-availability-and-compute-stock_count) |
| [5) Apply to rr_product](./AVAILABILITY_SYNC.md#5-apply-to-rr_product) |
| [6) Post-phase updates](./AVAILABILITY_SYNC.md#6-post-phase-updates) |
| [Edge cases and safeguards](./AVAILABILITY_SYNC.md#edge-cases-and-safeguards) |
| [Data touched](./AVAILABILITY_SYNC.md#data-touched) |
| [Discoverability in code](./AVAILABILITY_SYNC.md#discoverability-in-code) |
| [Operational tips](./AVAILABILITY_SYNC.md#operational-tips) |

### [COM-013](./SUBSCRIPTION_MANAGEMENT.md) — Subscription Management

| Inside this page |
|---|
| [Key Components](./SUBSCRIPTION_MANAGEMENT.md#key-components) |
| [Admin Panel](./SUBSCRIPTION_MANAGEMENT.md#admin-panel) |
| [Console Commands](./SUBSCRIPTION_MANAGEMENT.md#console-commands) |
| [Payment Flow](./SUBSCRIPTION_MANAGEMENT.md#payment-flow) |

### [COM-014](./Shipping%20Integration.md) — Shipping Integration

| Inside this page |
|---|
| [Shipping Architecture](./Shipping%20Integration.md#shipping-architecture) |
| [Supported Shipping Providers](./Shipping%20Integration.md#supported-shipping-providers) |
| [Delivery Methods](./Shipping%20Integration.md#delivery-methods) |
| [Shipping Calculation](./Shipping%20Integration.md#shipping-calculation) |
| [Shipping API Endpoints](./Shipping%20Integration.md#shipping-api-endpoints) |
| [Shipping Label Generation](./Shipping%20Integration.md#shipping-label-generation) |
| [Delivery Time Calculation](./Shipping%20Integration.md#delivery-time-calculation) |
| [Shipping Configuration](./Shipping%20Integration.md#shipping-configuration) |
| [Shipping Webhooks](./Shipping%20Integration.md#shipping-webhooks) |
| [International Shipping](./Shipping%20Integration.md#international-shipping) |
| [Shipping Analytics](./Shipping%20Integration.md#shipping-analytics) |
| [Error Handling](./Shipping%20Integration.md#error-handling) |
| [Testing and Development](./Shipping%20Integration.md#testing-and-development) |
| [Troubleshooting](./Shipping%20Integration.md#troubleshooting) |