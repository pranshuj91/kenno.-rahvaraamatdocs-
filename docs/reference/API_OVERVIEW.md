---
id: API_OVERVIEW
title: API Overview
sidebar_label: API Overview
---
### Public API documentation

This document provides a practical overview of the HTTP API exposed by the api application. It explains common conventions (authentication, headers, localization, pagination, and CORS) and gives a discoverable index of the main endpoint groups (controllers).

## Base URL
- Depends on your environment and web server config. In the default Docker setup from README.md, the app runs under http://localhost:8080/.
- The API entry is the api app. If your web server maps it to a distinct base path, it is commonly available at one of:
  - http://localhost:8080/ (API as the default site)
  - http://localhost:8080/api

## Authentication
- Scheme: Bearer token in the Authorization header.
- Header: Authorization: Bearer `<token>`
- Getting a token: Use Auth endpoints. Example: POST /auth/login with credentials returns a token in the response if successful.
- Some Auth endpoints are available without a token (optional), while others (e.g., switch-web-store) require a valid bearer token. See Auth endpoints below.

## CORS and cross-origin
- The API sends CORS headers based on Yii params (params['corsOrigin']).
- Allowed methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.
- Options requests are allowed without authentication.

## Localization
- Pass the language you want to receive via request header x-app-language.
- Fallback is the default language configured in the app.

## Standard response headers
- action-time: UNIX timestamp (GMT) of the controller action start.
- X-Pagination-* headers may be present on list endpoints:
  - X-Pagination-Current-Page
  - X-Pagination-Page-Count
  - X-Pagination-Per-Page
  - X-Pagination-Total-Count
- is_active and available_languages: reflect current web-store state (when applicable). If the store is locked (maintenance), the API may respond with status 423 (Locked) and not process the request.

## Caching controls
- Some endpoints may control client-side caching; controllers can explicitly set no-cache headers when needed.

Error handling
- Conventional HTTP status codes are used (400, 401, 403, 404, 409, 422, 500, etc.).
- Validation failures often return 422 Unprocessable Entity with structured error info.
- Locked web store state may return 423 Locked.

Authentication endpoints (Auth)
See REGISTRATION_FLOW.md for detailed registration and social auth flows.
- POST /auth/login — authenticate and obtain a bearer token.
- POST /auth/social-login — login using social identity.
- POST /auth/register — register a simple client account.
- POST /auth/register-business — register a business account.
- POST /auth/register-wholesale — register a wholesale account.
- POST /auth/reset-password — start password reset.
- POST /auth/set-new-password — set a new password using reset token.
- POST /auth/verify-email — verify a client email.
- GET  /auth/verify-email-meta — fetch metadata about email verification token.
- GET|POST /auth/external — social login/registration redirect handler (Google/Facebook/Apple). Supports linking a social account when Authorization bearer is supplied.
- POST /auth/switch-web-store — switch current web store (requires bearer token).

## Main endpoint groups index

Other common endpoint groups
Note: Below is a discoverable index of major API groups by controller name. Each controller defines its own actions and allowed HTTP verbs. For exhaustive details, open the controller file and check verbs() and PHPDoc/OpenAPI annotations where present.

- App — application-level utilities and configuration.
- Author — authors catalogue endpoints.
- Autocomplete — search suggestions.
- BackInStockNotification — managing back-in-stock notification requests.
- Bank — payment/banking helpers.
- Basket — shopping basket operations (add/remove/update, merge, totals).
- Blog — blog posts listing and details.
- BoughtProduct — purchase history for authenticated users.
- CampaignList — campaign listings.
- Category — category tree, details, and products in category.
- CategoryGroupPreference — user category preferences.
- CategoryPage — pre-composed category landing pages.
- Checkout — checkout flow orchestration.
- ClientAccount — client profile, addresses, and preferences.
- ClientWishlist — wishlist management.
- CompanyUser — company user management.
- CompositePage — dynamic composite content pages.
- ContactPage — data for the contact page.
- ContentPage — generic CMS pages.
- Country — supported countries and metadata.
- Ctr — click-through statistics for banners (public-related endpoints if any).
- Digira — Digira integration endpoints.
- DirectDownload — direct file download links (when allowed).
- DiscountPage — discount/offer landing content.
- DiscountedProductsComponent — discounted product component data.
- Download — authenticated file downloads.
- Event — events and tracking endpoints.
- EveryPay — EveryPay payment gateway callbacks/operations.
- ExternalUrl — external URL redirects and mappings.
- HeaderBanner — header banner content.
- Insplay — Insplay integration endpoints.
- MainPage — home page composed content blocks.
- MegaMenu — mega menu tree data.
- NewestProductsComponent — newest products component data.
- News — news listing and details.
- NewsletterSubscription — newsletter subscribe/unsubscribe.
- Order — order placement, details, repeat, etc.
- Product — product catalogue endpoints (details, related, assets, prices).
- ProductAvailability — product availability state.
- ProductComment — comments and ratings.
- ProductDynamicFilter — dynamic filters for lists.
- ProductList — general product listing/search.
- ProductPerson — product-person relationships (authors, narrators, etc.).
- ProductPublisher — publishers and related content.
- ProductQuote — quotes for products.
- ProductSeries — product series endpoints.
- QrCode — QR code utilities.
- Recommendation — personalized recommendations.
- Shop — shops/locations and schedules.
- Site — site-level helpers (health checks, versions).
- SubCompany — sub-company related endpoints.
- Subscription — subscriptions (plans, manage) for the consumer app.
- SubscriptionCreditCard — saved card operations for subscriptions.
- SubscriptionPlan — subscription plans listing and details.
- TopProductsComponent — top/bestseller component data.
- User — current user profile endpoints.
- VirtualGiftCard — virtual gift card purchase and management.

Request examples
- Login
  - POST /auth/login
  - Headers: Content-Type: application/json
  - Body: \{ "email": "john@example.com", "password": "secret", "web_store_nav_code": "WEB" \}
  - Response: 200 OK with JSON including Authorization token and user info.

- Paged list
  - GET /product-list?categoryId=123&page=1&per-page=24
  - Response headers will include X-Pagination-* values to help build paging UI.

Notes and tips
- OPTIONS method is handled for every action to support CORS preflight.
- Many controllers include method verbs() specifying allowed methods per action — check those to understand correct usage.
- Some controllers carry OpenAPI annotations (OA\...), which can be aggregated using swagger-php if you want to generate a spec.
- If an endpoint appears locked due to maintenance, you will receive 423 Locked and should retry later.


