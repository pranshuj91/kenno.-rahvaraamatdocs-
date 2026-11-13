---
id: eshop-api-checkout
title: E-shop API, Checkout & Attribution
sidebar_label: E-shop API & Checkout
---

# E-shop API, Checkout & Attribution

## Endpoints (RR-258)

The Kingisoovitaja website server sends **one** server-to-server call to the e-shop, which creates a **guest** basket and places a **normal rahvaraamat.ee order** through the existing `OrderCheckoutService` / `CheckoutForm`. A logged-in customer's basket is never touched.

| Method and path | Auth | Purpose |
|---|---|---|
| `GET /gift-advisor/stores` | `X-API-Key` | Shops for store pickup `[{id, name, city, address}]`. Cached 10 min |
| `GET /gift-advisor/parcel-machines` | `X-API-Key` | Parcel machines `[{id, name, city, address, carrier}]`, carrier `omniva` / `dpd` / `smartpost`. Cached 10 min |
| `POST /gift-advisor/checkout` | `X-API-Key` | Places the order |
| `GET /gift-advisor/pay/{orderId}/{checksum}` | none (order checksum) | Opened by the shopper's browser; starts or resumes payment |
| `GET /gift-advisor/changes` | `X-API-Key` | Same-day changes ([E-shop Features](./eshop-features)) |
| `GET /gift-advisor/openapi` | `X-API-Key` | The OpenAPI contract |

Routes in `api/config/url-manager-rules.php`. Staging host `https://dev.rahvaraamat.ee`, production `https://web.rahvaraamat.ee`. API keys are managed in admin, Settings, API access (type `GIFT_ADVISOR`, header `X-API-Key`, optional IP allow-list per key). Plan: one key per environment. Keys are sent privately, never in chat, tickets or git.

## `POST /gift-advisor/checkout` request

```json
{
  "items": [{ "productId": "2849642", "quantity": 1 }],
  "promoCode": "SOODUS10",
  "returnUrl": "https://kingisoovitaja.ee",
  "customer":  { "email": "buyer@example.com", "phone": "+372 5555 5555", "firstName": "Mari", "lastName": "Maasikas" },
  "recipient": { "firstName": "Jaan", "lastName": "Tamm", "email": null, "phone": null },
  "delivery":  { "method": "parcel_machine", "pointId": "12345", "carrier": "omniva",
                 "address": null, "city": null, "postalCode": null },
  "payment":   { "method": "bank_link", "bank": "swedbank" },
  "occasion": "Ema 60. sünnipäev",
  "attribution": { "referrer": "https://www.google.com/", "landingPage": "https://kingisoovitaja.ee/teemad/emale" },
  "analyticsConsent": true
}
```

| Field | Rules |
|---|---|
| `items` | Required, 1 to 50 lines. `productId` = feed `id` (positive, up to 10 digits), `quantity` 1 to 99. Same product twice is summed (max 99). E-gift cards are refused |
| `promoCode` | Optional, max 64. Discount code **or** gift card code |
| `returnUrl` | Optional, default `https://kingisoovitaja.ee`. Must be `https` on `kingisoovitaja.ee` or a subdomain, no path, query or fragment (open-redirect protection). `http` only for hosts in `insecureReturnUrlHosts` (for example `localhost` in dev) |
| `customer` | Required: `email`, `firstName`, `lastName` (max 100). `phone` required unless the recipient has one |
| `recipient` | Optional (gift to another person). Missing email or phone is taken from the customer |
| `delivery.method` | `parcel_machine` / `store_pickup` (need `pointId`) or `courier` (needs `address`, `city`, `postalCode`; `carrier` `omniva` default or `smartpost`). Estonia only |
| `payment` | `card` or `bank_link` with `bank`: `swedbank`, `seb`, `lhv`, `luminor`, `coop`, `citadele` |

Delivery method mapping: `parcel_machine` = `POST24` (Omniva), `WDPD` (DPD), `SMART_POST`; `courier` `omniva` = `ELS`, `smartpost` = `ITELLA_SMARTPOST`; `store_pickup` = `RR_SHOP`.

Mapping to the shop checkout: with a recipient, shipping = recipient, billing = buyer, `shipToAnotherPerson = 1`. The order goes to the **WEB** store. `agreeToTerms` is set to 1 (terms accepted on kingisoovitaja.ee). No saved cards.

## Responses

- **200:** `orderId` (NAV order code, or internal ID while empty), `paymentUrl` (missing when nothing is paid by bank, for example fully covered by a gift card), `totals` (`itemCount`, `subtotal`, `discount`, `delivery`, `total`, each `{amountMinor, currency, formatted}`) and `estimatedDelivery`.
- **422:** `{"error": "invalid_request", "issues": [{"path": "...", "message": "..."}]}`. Messages from the shop's own checkout can be in Estonian. The basket is cleared on a 422.
- **401:** wrong key. **500:** unexpected; the order **may already exist**.

:::warning[Not idempotent]
Every successful call creates an order. Never retry blindly after a timeout. On the website side, other failures return 503 and are never retried.
:::

## Payment and return

1. The browser opens `paymentUrl` (on the e-shop host, so the website must allow `rahvaraamat.ee` in `CHECKOUT_REDIRECT_HOSTS`).
2. `pay` checks the checksum (`hash_equals`) and that it is a Gift Advisor order, then starts the EveryPay payment (new order), replays the last payment form (pending payment, so "Proovi uuesti" works with the same link) or goes to the result page.
3. After payment `OrderTransactionResultHandler` sends the shopper to `{returnUrl}/kinnitus/{orderNumber}`, with `?makse=ebaonnestus` on failure or cancel.

Other effects: a row in `rr_order_gift_advisor` (`order_id`, `return_url`, `created`) marks the order (`Order::isGiftAdvisorOrder()`). The **recipient's e-mail never shows prices**. The buyer's confirmation goes to `customer.email` as usual. NAV, stock and the rest of order processing are unchanged. Promo codes are checked by the e-shop at checkout.

## Website side of checkout

`frontend/src/lib/api/adapters/gift-advisor.ts` (FE ADR-0010) uses `GIFT_ADVISOR_API_URL` and `X-API-Key: GIFT_ADVISOR_API_KEY` over the `egress` network. A 422 is passed on as `{error: "rejected", issues}`. `occasion`, `attribution` and `analyticsConsent` are sent for tracking.

Safety guard: `bin/prod_compose.sh` refuses to start a public site (`FRONTEND_AUTH=off`, not staging) without the Gift Advisor variables or with `FRONTEND_MOCK_FALLBACK` not `false`. This prevents fake checkout orders.

## RR-259: Order source and occasion tracking

Every kingisoovitaja.ee order is tagged in the existing `rr_order_attribution` table:

| Column | Value |
|---|---|
| `utm_source` | `kingisoovitaja` |
| `utm_medium` | `assistant` |
| `utm_campaign` | occasion code `christmas`, `birthday`, `wedding`, `valentines`, or `other`; NULL when no occasion |
| `utm_content` | occasion text as typed (max 255) |
| `referrer`, `landing_page` | from `attribution` (kept only if `http(s)://` and up to 2000 chars) |
| `consent_given` | `analyticsConsent` (true only if literally `true`) |
| `event_id` | random UUID |

Occasion words are matched from `giftAdvisorCheckout.occasionWords` (same list as Kingisoovitaja's `add_ons.occasion_words`). Recording attribution never fails an order.

Two channels: `kingisoovitaja.ee` (orders placed through the checkout API) and `rahvaraamat.ee` (shopper followed a Kingisoovitaja product link with `utm_source=kingisoovitaja&utm_medium=assistant&utm_campaign=CODE`). The backend has no attribution time window.

Report (run by hand, no cron):

```bash
./yii gift-advisor/order-report --from=2026-11-01 --to=2026-11-30
```

The Rybbit purchase event is sent only when `consent_given`.

## RR-260: OpenAPI contract

`api/giftAdvisor/openapi.yaml` (OpenAPI 3.0.3, version 1.0.0), served at `GET /gift-advisor/openapi`. Auth `X-API-Key` (not Bearer). Errors: standard `{name, message, code, status, type}` for 400/401/404/405/500; checkout uses 422 `CheckoutError`. No webhook. No `/v1`; changes are additive (ignore unknown fields, read feed columns by name).

The contract test `GiftAdvisorContractTest.php` fails when code and contract drift apart (routes, feed columns, `/changes` limits, carriers, banks, limits, `OccasionCode` enum).

## Config (`common/config/params.php` → `giftAdvisorCheckout`)

`defaultReturnUrl` `https://kingisoovitaja.ee`, `returnUrlHosts` `['kingisoovitaja.ee']`, `insecureReturnUrlHosts` `[]`, `parcelMachineMethods` `['POST24','WDPD','SMART_POST']`, `courierMethods`, `defaultCourier` omniva, `countryCode` EE, `maxItems` 50, `occasionWords`.

## Production launch checklist (e-shop side)

- [ ] Merge the RR-252 to RR-260 work to `master` and release.
- [ ] Run the four migrations on production (in order: `m261013_120000`, `m261014_120000`, `m261016_120000`, `m261021_120000`).
- [ ] Check the `GIFT_ADVISOR` key in Settings, API access; send it privately; optionally set the server IP in `allowed_ips`.
- [ ] Add the cron lines for `gift-advisor/track-changes` (every 10 min and `--full=1` at 00:30) to the production crontab.
- [ ] Confirm the feed job runs at least daily and finishes before 01:00.
- [ ] Check `giftAdvisorCheckout.returnUrlHosts` contains `kingisoovitaja.ee`.
- [ ] Place one real small test order and check: order in admin and NAV, `rr_order_gift_advisor` row, attribution row, return to `/kinnitus/...`, recipient e-mail without prices.
- [ ] Create the occasion lists in admin and check the `occasions` column in the next feed.

## Useful SQL (staging checks)

```sql
SELECT * FROM rr_gift_advisor_tracker_run ORDER BY id DESC LIMIT 10;

SELECT o.id, o.nav_order_code, o.created, a.utm_campaign, a.utm_content, a.consent_given
FROM rr_order_gift_advisor g
JOIN rr_order o ON o.id = g.order_id
LEFT JOIN rr_order_attribution a ON a.order_id = o.id
ORDER BY o.id DESC LIMIT 20;
```

## E-shop tests

All new tests are unit tests without a database or AI calls: `ProductIdentifierResolverTest`, `GiftProfileGeneratorTest`, `GiftAdvisorFeedColumnsTest`, `GiftAdvisorChangesTest`, `GiftAdvisorCheckoutRequestTest`, `GiftAdvisorAttributionTest`, `GiftAdvisorContractTest`.
