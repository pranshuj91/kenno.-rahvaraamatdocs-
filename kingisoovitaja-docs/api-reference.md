---
id: api-reference
title: API Reference (Backend)
sidebar_label: API Reference
---

# API Reference (Backend)

All endpoints below are on the internal listener `http://backend-api:8081`, called **only from the Next.js server** (never the browser). The full contract is in `docs/frontend-api.md` of the repo.

## Authentication and authorization

- `Authorization: Bearer KEY` or `X-API-Key: KEY`. The key must be in `RC2_API_KEYS` (comma separated, each at least 32 characters; the website uses the last one).
- Per-visitor limits use the `X-End-User-Id` header.
- Public `/endpoint.php` on the backend host answers only `API_ALLOWED_IPS` (empty in production = closed, 403 before PHP runs).
- Admin pages: IP allowlist (`ADMIN_ALLOWED_IPS`) plus HTTP basic auth (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`). Admin pages only run from their own form (same-origin POST) and cannot be framed.
- Stock webhook: token (`STOCK_SYNC_TOKEN`).
- Manager review page: secret link `/review/REVIEW_TOKEN` (at least 32 characters; empty closes it; a new value retires the old link).
- Errors are `{"error": "..."}`.

## Endpoints

| Endpoint | Method | Purpose | Limits / cache |
|---|---|---|---|
| `/endpoint.php` | POST | Chat turn | 10/min, 100/h per visitor; 30 turns per conversation; monthly budget |
| `/endpoint.php` | DELETE | Forget a conversation (history + turn log) | none stated |
| `/precart.php` | POST | Gift bag (S/M/L) and cards for the basket | 60/min, 1000/h |
| `/products/{id}` | GET | One product, or 404 if not sold now | 60 s |
| `/products/popular` | GET | Up to 8 recommendable best sellers | 1 h |
| `/products?theme=slug` | GET | Theme page `{items, total, nextCursor}` | 5 min |
| `/feedback` | POST | Thumbs up/down `{messageId, recommendationId?, vote, reason?}`, returns 202 | 20/min, 200/h |
| `/stock_webhook.php` | POST | Re-index or delete one product | token |
| `/health` | GET | Health (see [Maintenance](./maintenance)) | public |

Per key limits on the chat: 600/min and 20,000/h.

## Chat response (main fields)

`friendly_response` (Estonian Markdown), `products[]` (`id, title, author, price, sale_price, image_link, link, category, division, delivery_time, age_min, age_max, available_in_stock, min_age, warning_text, why_it_fits`), `featured_product_ids`, `suggested_replies` (chips), `conversation_id`, `thread_title` (first turn), `extraction`, `history`.

Errors:

- 400 validation
- 401 key
- 429 rate limit (with `Retry-After`) or conversation limit
- 503 not configured or budget used up
- 500, 502, 504 failures

## Website product shape (`ProductCard`)

`id, title, authors, description (up to 300), price / originalPrice ({amountMinor, currency, formatted}), availability, imageUrl, detailUrl, category, warning, ageMin, ageMax, deliveryDays, inOwnStock`.

## Admin tools (hidden prefix `/control-room-HASH`)

The prefix is defined in `src/config.php` (`admin.route_prefix`) and in `docker/caddy/Caddyfile`. Only `ADMIN_ALLOWED_IPS` get an answer (others get 404) and basic auth is required.

- `/debug`: control panel. Runs a message through the real pipeline (real Gemini and Meilisearch calls, one or two Gemini calls per message, no rate limit). Tabs: Debug, Index (read-only index overview, product lookup, raw search), Descriptions (short descriptions per division, CSV export, AI draft suggestions that are never saved).
- `/metrics`: daily metrics page.
- `/meili/`: Meilisearch behind the admin login; only routes that need no key (such as `/health`) work. Use the Index tab instead.

## Checkout (not through PHP)

The website server calls the e-shop directly. See [E-shop API & Checkout](./eshop-api-checkout).
