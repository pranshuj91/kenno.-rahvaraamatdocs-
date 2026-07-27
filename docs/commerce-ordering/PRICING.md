---
id: pricing
title: Pricing Logic
sidebar_label: Pricing Logic
---
# Pricing Logic Overview

This document explains how product prices are calculated and presented across the application. The pricing logic lives primarily under `common/prices` with additional data providers in `api/prices`.

Contents
- Core concepts and entities
- Price calculators by client type
- Discounts and campaigns
- VAT handling
- Assigned/Custom discounts and data sources
- Extension points

Core concepts and entities
- IEvaluatedProduct (common/prices/entities/IEvaluatedProduct.php)
  - Abstraction used by all calculators. It provides:
    - getShopPrice(): ?float — web shop price (VAT included)
    - getWholesalePrice(): ?float — wholesale price (VAT excluded)
    - getOriginalPrice(): ?float — original/base list price
    - getNavCurrentPrice(): ?float — NAV current price (used as a reference when campaign price is active)
    - getCampaignPrice(?clientTypeId): ?float — campaign/special price per client type
    - getVat(): float — VAT rate as decimal (e.g., 0.09)
    - isPriceGroupDiscountRegular(): bool — whether regular discount rules apply for the product
    - getGroupDiscountCode(): ?string — product’s discount group code
    - getId(), getTypeId() — product identifiers and type

- CalculatedPrice (common/prices/entities/CalculatedPrice.php)
  - Output object returned by calculators containing:
    - price: ?float — final calculated price (rounded to 2 decimals in getter)
    - originalPrice: ?float — reference/base price for discount display
    - discount: int — computed from price vs originalPrice

- ProductPriceHelper (common/prices/ProductPriceHelper.php)
  - getPriceWithDiscount(price, percent)
  - getDiscountPercent(finalPrice, basePrice)
  - getHighestDiscountPercent(discounts[])

- ProductPriceCalculationManager (common/prices/ProductPriceCalculationManager.php)
  - Entry point that selects a calculator based on the authenticated client (customer, business, wholesale, shop, simple, regular) and injects flags/parameters such as VAT-free mode and assigned discount percent.

Price calculators by client type (common/prices/calculators)
- CustomerPriceCalculator
  - Audience: Retail customers (guests and logged-in).
  - Base price: `shopPrice` if available, otherwise `originalPrice`.
  - Discounts: Applies the highest of provided discounts when `isPriceGroupDiscountRegular()` is true.
    - May include assigned discount (from manager) and default e-shop or offline discounts (see below).
  - VAT: Optional VAT-free mode divides price by (1 + VAT).
  - Campaigns: If a campaign price exists for the appropriate client type and is lower than the computed price, it overrides and sets originalPrice to `navCurrentPrice` (fallback `shopPrice`).

- BusinessPriceCalculator
  - Audience: Company/business clients.
  - Discounts: Combines company assigned percent (if allowed) and company custom discount (via discount group). If the product’s default discount (shop vs original) is greater than all applicable discounts, uses `shopPrice`; else applies the highest discount to `max(originalPrice, shopPrice)` when regular discounts apply.
  - VAT: Optional VAT-free division by (1 + VAT).
  - Campaigns: If product has a lower campaign price for client type COMPANY, it overrides and uses `navCurrentPrice` (fallback `shopPrice`) as original reference.

- WholesalePriceCalculator
  - Audience: Wholesale clients (with potential custom prices per discount group code).
  - Base price: `wholesalePrice` (VAT excluded) or a wholesale custom price (see repositories). If missing or zero, falls back to `shopPrice`.
  - VAT handling:
    - Wholesale/custom prices are stored without VAT. If price is shown with VAT, multiply by (1 + VAT). If VAT-free mode is requested over a VAT-included base (shop or campaign), the VAT portion is removed.
  - Discounts: Highest of (custom wholesale discount via discount group OR company assigned percent) applied if `isPriceGroupDiscountRegular()`.
  - Campaigns: If a campaign price for COMPANY exists and is lower, it overrides; when VAT-free is requested, VAT is removed from the campaign price.
  - Output: For business/wholesale, discount display is not shown (original price in CalculatedPrice is set to 0 to suppress discount display).

- ShopPriceCalculator
  - Audience: Price display in e-shop context with default guest/logged-in/offline shop discounts.
  - Base: `shopPrice`.
  - Campaigns: If the product is in a web-only campaign and campaign price is lower, it’s used before discounts.
  - Discounts: Applies highest default discount when `isPriceGroupDiscountRegular()`.
  - Original reference: If campaign price is present, originalPrice is `navCurrentPrice` (fallback `shopPrice`); otherwise `max(originalPrice, shopPrice)`.

- SimplePriceCalculator and RegularPriceCalculator
  - SimplePriceCalculator: Lightweight version for guest/logged-in with optional VAT-free handling and campaign override.
  - RegularPriceCalculator: Applies highest provided discounts over `shopPrice` or `originalPrice` when regular discounts apply.

Discounts and campaigns
- Regular discount applicability
  - All discount application is gated by `IEvaluatedProduct::isPriceGroupDiscountRegular()`.
  - If false, discounts in calculators are not applied.

- Default e-shop and offline discounts (Customer/Shop/Simple calculators)
  - Guest discount: `WebStore->webStoreSettings->getGuestUserDiscount()`
  - Logged-in discount: `WebStore->webStoreSettings->getLoggedInUserDiscount()`
  - Offline shop client discount: `Yii::$app->system->get('shopClientDiscountPercent', 0)`
  - Important exclusion: EBOOK products (by `PRODUCT_TYPE` classifier) do not receive default discounts.

- Assigned discount percent (ProductPriceCalculationManager)
  - Determined via `ClientAccount->getDiscountManager($webStore)->getAssignedDiscountPercent($totalCost, $product)`.
  - Applied differently by client type:
    - Retail/simple customers: added when allowed (not for EBOOKs).
    - Business/wholesale: added alongside company custom/wholesale rules.

- Campaign prices
  - Sourced via `IEvaluatedProduct::getCampaignPrice(?clientTypeId)` and for web-campaign checks via `ProductCampaignRepository::isInWebCampaign(productId)`.
  - Calculators consider campaign price if present and lower than computed price. When set, original reference price becomes `navCurrentPrice` (fallback `shopPrice`) so displayed discount reflects campaign.
  - Client types:
    - Guest: null clientTypeId
    - Retail (logged-in): classifier CLIENT_TYPE=RETAIL
    - Company/Wholesale: classifier CLIENT_TYPE=COMPANY

VAT handling
- Customer/Shop/Simple calculators compute with VAT included by default and can switch to VAT-free by dividing by `(1 + VAT)`.
- Wholesale calculator starts from VAT-free wholesale or custom price; if showing with VAT, it multiplies by `(1 + VAT)`. When falling back to a VAT-included price (shop or campaign) and VAT-free is requested, the VAT component is subtracted.

Assigned/Custom discounts and data sources
- Company client custom discount (Business/Wholesale):
  - `CompanyClientCustomDiscountCache::get(discountGroupTypeId, groupDiscountCode)` returns a configured discount percent.
  - For OMA employees (CompanyDiscountGroupTypeEnum::OMA) special handling applies in wholesale custom price resolution.
- Wholesale custom price:
  - `WholesaleClientPriceRepository::getCustomPrice(companyGroupCode, productId)` returns a per-product, per-discount-group absolute price (VAT excluded). If 0, calculator falls back to wholesale or shop price.
- Web campaign participation:
  - `ProductCampaignRepository::isInWebCampaign(productId)` checks whether a product is in a web-only campaign to allow campaign price use in ShopPriceCalculator.

ProductPriceCalculationManager flow
- For a given IEvaluatedProduct and a ClientAccount/WebStore:
  1) Resolve assigned discount percent via client’s DiscountManager and store settings.
  2) Select calculator based on client type:
     - System user or simple customer: CustomerPriceCalculator
     - Business client: BusinessPriceCalculator
     - Wholesale client: WholesalePriceCalculator
  3) Configure VAT-free flag based on client type (e.g., VAT-exempt clients).
  4) Provide discount group type id, company group code, and assigned discounts where applicable.
  5) Calculator returns CalculatedPrice (final price, original reference, computed discount).

Important rules and edge cases
- EBOOK type products: default/automatic discounts are not applied.
- When campaign price is present and lower, it overrides computed price and changes the original reference to NAV current price where available.
- For business/wholesale, CalculatedPrice’s original price is set to 0 in Wholesale (and effectively suppressed for Business via logic), so UI should not display strikethrough discounts for those client types.
- getHighestDiscountPercent is used — discounts do not stack additively.

Extension points
- Add a new calculator under `common/prices/calculators` implementing `IProductPriceCalculator`.
- Extend `ProductPriceCalculationManager` to route new client types to the new calculator and feed required parameters.
- Extend `IEvaluatedProduct` implementation if additional price inputs are required (e.g., regional prices), keeping VAT handling consistent.
- Add new discount sources by adapting manager to call `addDiscount()` on calculators when `isPriceGroupDiscountRegular()` applies.

Related classes of interest
- api/prices/ProductCampaignRepository.php — campaign participation cache/queries.
- api/prices/WholesaleClientPriceRepository.php — per-group custom wholesale prices.
- common/prices/cache/CompanyClientCustomDiscountCache.php — cached access to company custom discount percentages.
- common/enums/PriceGroupDiscountEnum.php — discount group constants.
- common/enums/CompanyDiscountGroupTypeEnum.php — used for special wholesale/business cases (e.g., OMA).


## See also
- ./ORDER_PURCHASE_FLOW.md — end-to-end order checkout and processing
- ../reference/ADMIN_MODULE.md — where and how prices are managed/seen in admin



