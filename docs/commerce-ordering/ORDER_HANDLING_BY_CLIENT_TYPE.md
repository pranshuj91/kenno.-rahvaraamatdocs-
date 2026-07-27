---
id: order-handling-by-client-type
title: Order Handling by Client Type
sidebar_label: Order Handling by Client Type
---
# Order handling by client type (Retail, Business, Wholesale)

This document explains how orders are created, paid, processed, and synchronized for different client types. It complements ORDER_PURCHASE_FLOW.md by focusing specifically on client-type nuances.

Contents
- Client type classifiers and account routing
- Retail (customers/guests) order handling
- Business clients (company) order handling
- Wholesale clients order handling
- NAV posting and synchronization differences
- Fulfillment and notifications
- Troubleshooting and operational notes

Client type classifiers and account routing
- Client types are determined via ClientAccount::getTypeManager() using classifier CLIENT_TYPE.
  - Retail: guests and logged-in retail users
  - Company: business and wholesale accounts (with discount group type and codes)
- Pricing is selected via ProductPriceCalculationManager which picks the calculator by client type. The resulting price affects order totals, VAT basis, and discount display.
- Checkout and post-payment processing are identical at the pipeline level (see ORDER_PURCHASE_FLOW.md), but the inputs (pricing, VAT flags, and identifiers) differ by client type.

Retail (customers/guests) order handling
- Who: Guests or logged-in retail customers.
- Price source and tax:
  - Prices are VAT-included (shop price) with optional VAT-free flag in special cases.
  - Discounts follow isPriceGroupDiscountRegular() and include default web-store guest/logged-in discounts and optional assigned discount.
  - Campaign prices for guests/retail are considered and can override the computed price; original reference becomes NAV current price if present.
- Order creation (CheckoutController::actionIndex → OrderCheckoutService::checkout):
  - Customer identity: for guests, a lightweight customer entry may be created or associated with the order; for logged-in, the ClientAccount is linked.
  - Totals: computed from the retail calculator; order lines contain VAT-included unit prices.
- Payment (BankController):
  - Most orders go through bank/PSP payment with status transitions NEW → PENDING_PAYMENT → PENDING_PROCESSING.
  - Zero/complimentary orders bypass external bank forms and proceed directly.
- Post-payment processing (console OrderController::actionProcess):
  - Stock reservation/issuance and digital entitlements are executed normally.
  - Discount display is shown in customer communications (CalculatedPrice includes original reference).
- NAV identifiers:
  - Customer codes usually map to website-generated retail customer codes (W%-prefixed) where applicable.
  - Orders are posted as web orders with web store NAV code.

Business clients (company) order handling
- Who: Company accounts using business terms but not necessarily wholesale price lists.
- Price source and tax:
  - Base price is max(original, shop). If product’s default discount (shop vs original) is better than assigned/custom, shop price is used; otherwise the highest applicable discount is applied when regular discounts are allowed.
  - Optional VAT-free mode can be applied depending on account settings.
  - Company campaign prices (CLIENT_TYPE=COMPANY) can override final price; original reference becomes NAV current/shop price for display.
- Order creation:
  - Order is linked to the company ClientAccount; discount group type id and product discount group codes may affect applied prices and later NAV mapping.
  - Lines can still be VAT-included or VAT-free based on the account (the calculators support both). Ensure tax flags on the order match what was used for pricing.
- Payment:
  - Can be bank/PSP like retail, or alternative terms if configured (e.g., invoice terms). In bank mode, status transitions mirror retail.
- Post-payment processing:
  - Same operational flow as retail (stock, entitlements, emails) but discount visuals are typically suppressed for company/wholesale contexts.
- NAV identifiers:
  - Company customer codes typically start with W% (website-originated) but map to the company master in NAV.
  - Discount group type id (e.g., OMA) influences discounts and may be relevant for NAV posting/validation.

Wholesale clients order handling
- Who: Company accounts using wholesale price lists and/or custom per-product wholesale prices.
- Price source and tax:
  - Primary source is wholesalePrice (VAT-excluded) or a per-product custom wholesale price from WholesaleClientPriceRepository based on the company group code.
  - If wholesale/custom price is 0/missing, falls back to shop price.
  - VAT handling:
    - Wholesale/custom prices are VAT-excluded. If order/pricing is VAT-inclusive, VAT is added (price * (1+VAT)). If VAT-free pricing is required, VAT is kept excluded. When falling back to shop or campaign (VAT-included) but an order must be VAT-free, the VAT part is removed.
  - Discounts: Highest of wholesale custom discount (by discount group) or company assigned percent, only if regular discounts apply.
  - Campaign: COMPANY campaign price can override and is then normalized for VAT if needed.
- Order creation:
  - Order is linked with company account and company_price_group_code (used for custom wholesale prices).
  - Order lines reflect VAT-excluded unit prices if VAT-free mode is active, otherwise VAT-included (depending on configuration at checkout).
- Payment:
  - Wholesale often uses invoice/terms; however, the bank flow is supported too. Status transitions are the same.
- Post-payment processing:
  - Same operational flow (stock, entitlements, postbacks). For wholesale/business, CalculatedPrice’s original price is set to 0 in wholesale to suppress discount/strike-through UI.
- NAV identifiers:
  - Orders are posted to NAV as website-originated company orders. Company discount group type and codes (e.g., OMA, group code strings) may control pricing/validation within NAV.

NAV posting and synchronization differences
- Posting after processing: console order/process invokes common\synchronizations\nav\post\order\OrderPost to retry/ensure posting to NAV for processed orders.
- Periodic reconciliation: common\synchronizations\nav\sync\OrderSync merges NAV’s posted and open orders into local temp tables and updates RR orders:
  - Keeps totals and line amounts in sync for all client types.
  - Filters by website-originated codes (WT%, WN%, W%).
  - Optional scoping by webStoreNavCode.
- Expect that business/wholesale amounts may be VAT-excluded at line level depending on the configuration; NAV becomes the source of truth after posting.

Fulfillment and notifications
- Regardless of client type, after payment authorization/capture:
  - OrderPurchaseManager::process() allocates inventory and issues entitlements.
  - EmailNotificationHandler sends confirmations. For company/wholesale, templates typically omit consumer-oriented discount visuals.
  - PostBackHandler triggers external system hooks where configured.

Troubleshooting and operational notes
- If prices/discounts look wrong on a company/wholesale order:
  - Verify discount group type id and product group_discount_code.
  - Check assigned discount percent via ClientAccount->getDiscountManager()->getAssignedDiscountPercent().
  - For wholesale: verify company_price_group_code and custom prices via WholesaleClientPriceRepository.
  - Confirm isPriceGroupDiscountRegular() is true; otherwise discounts are not applied.
  - Inspect whether a campaign price (CLIENT_TYPE null/RETAIL/COMPANY) is overriding the computation.
- VAT mismatches between UI and NAV:
  - Ensure the calculator’s VAT-free flag matched the order’s tax settings at checkout.
  - Remember that wholesale/custom prices start VAT-excluded; falling back to shop/campaign may require VAT normalization.
- Payment edge cases:
  - Duplicate payment attempts are blocked if the order is no longer NEW.
  - Zero-amount orders bypass bank/PSP and go straight to processing.

Related documents and classes
- ORDER_PURCHASE_FLOW.md — end-to-end checkout and processing timeline.
- PRICING.md — pricing calculators and rules per client type.
- console/controllers/OrderController.php — cron processing entry point.
- common/synchronizations/nav/sync/OrderSync.php — reconciliation with NAV.
- api/prices/WholesaleClientPriceRepository.php — wholesale custom prices.
- api/prices/ProductCampaignRepository.php — web campaign participation checks.

