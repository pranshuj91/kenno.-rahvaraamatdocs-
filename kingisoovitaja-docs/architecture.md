---
id: architecture
title: System Architecture
sidebar_label: Architecture
---

# System Architecture

```text
                         Internet
                            |
     kingisoovitaja.ee (Cloudflare)          app.kingisoovitaja.ee (direct)
                            |                         |
                    +-------v-------------------------v-------+
                    |                 Caddy                    |  80 / 443 (only public ports)
                    |  site password, IP allowlists, TLS       |
                    +--+---------------+--------------+--------+
            website    |   internal API| :8081        | /health, /stock_webhook, admin
                       v               v              v
              +--------------+   +--------------------------+      +--------------+
              | frontend     |-->| php (PHP-FPM)            |<---->| meilisearch  |
              | Next.js BFF  |   | rc2-controller/*.php     |      +--------------+
              +------+-------+   +----------+---------------+      +--------------+
                     | egress               |                 +--->| mariadb      |
                     v                      v                 |    +--------------+
        e-shop Gift Advisor API      Gemini / OpenAI      +---+------------+
        (stores, parcel machines,                         | cron           | feed sync, changes,
         checkout) X-API-Key                              | (PHP CLI)      | enrichment, backups
                                                          +----------------+
```

## Containers

| Service | Role | Production notes |
|---|---|---|
| `caddy` | Reverse proxy, TLS, access rules | Only container with public ports (80, 443 TCP/UDP) |
| `php` | PHP-FPM: chat API, website API, health, webhook, admin | Never gets the Meilisearch master key; read-only code |
| `cron` | Scheduled jobs (`docker/crontab`) | Has the master key (index rebuilds); outbound for feed, OpenAI, rclone |
| `mariadb` | Database | Internal network only, no host port, 1G buffer pool |
| `meilisearch` | Search index | Internal network only, `MEILI_ENV=production` forced |
| `frontend` | Next.js website (separate compose project `frontend/compose.yml`) | No published port; joins `kingisoovitaja-api` (no internet) and `egress` (outbound to rahvaraamat.ee) |
| `tailscale-db` | Optional DB access over Tailscale (profile `dbaccess`) | Forwards only port 3306 |

## Networks

- `kingisoovitaja_internal`: internal only (DB, Meilisearch).
- `kingisoovitaja_network`: outbound for php/cron (Gemini, OpenAI, feed).
- `kingisoovitaja-api`: **internal** network shared with the frontend project. Caddy is the only backend member (alias `backend-api`), so the website reaches only the internal API.
- `kingisoovitaja-frontend-egress`: outbound for the frontend, so its server can call the e-shop checkout API.

## Caddy routes (`docker/caddy/Caddyfile`)

**Backend host** (`SITE_ADDRESS`, `app.kingisoovitaja.ee`):

| Path | Goes to | Access |
|---|---|---|
| `/endpoint.php`, `/precart.php` | chat / pre-cart API | `API_ALLOWED_IPS` (empty in production = closed) + API key |
| `/health` | `src/public/health.php` | public |
| `/stock_webhook.php` | stock webhook | token |
| `/control-room-<hash>/debug`, `/metrics`, `/meili/*` | admin debug panel, metrics, Meilisearch UI proxy | `ADMIN_ALLOWED_IPS` + admin basic auth |
| anything else | 404 | |

**Website** (`FRONTEND_ADDRESS`, `kingisoovitaja.ee www.kingisoovitaja.ee`):

- `www.` redirects (308) to the bare domain.
- `/review/<REVIEW_TOKEN>` is the manager review page (replaces the site password).
- `/api/health` goes to the frontend **before** the site password (for uptime monitors).
- Everything else goes through the site password (`FRONTEND_AUTH=on` by default) to the frontend.

**Internal API** (`:8081`, never published, only on the internal networks):

- `/endpoint.php`, `/precart.php` go to chat / pre-cart.
- `/products`, `/products/*`, `/feedback` go to `rc2-controller/site.php`.

**Other Caddy settings:**

- `trusted_proxies` = Cloudflare IP ranges with `client_ip_headers CF-Connecting-IP`, so rate limits see the real visitor IP. The website gets exactly one `X-Forwarded-For` address.
- Security headers (`nosniff`, `no-referrer`, HSTS, `Permissions-Policy`), 1 MB body limit, `Server` header removed.

## Data flow between the two systems

```text
 e-shop (ecommerce-backend, Yii2)                      Kingisoovitaja (kingisoovitaja-be-fe)
 products-feed.csv (nightly, public URL) -----------> src/sync.php (01:00) -> MariaDB -> Meilisearch
 GET /gift-advisor/changes  <------------------------ shop changes job (every 10 min)
 GET /gift-advisor/stores, /parcel-machines <--------- website checkout (server side, X-API-Key)
 POST /gift-advisor/checkout <------------------------ website checkout
   -> normal rahvaraamat.ee order (WEB store)
   -> paymentUrl /gift-advisor/pay/{id}/{checksum}
 customer browser -> EveryPay -> https://kingisoovitaja.ee/kinnitus/{orderNumber}
```

Main ideas:

- The e-shop is the **source of truth** for products, prices, stock and orders. Kingisoovitaja never writes product data back.
- Kingisoovitaja **pulls** everything: the feed once a night and the change API every 10 minutes. The e-shop never calls Kingisoovitaja (no webhook).
- Orders placed on kingisoovitaja.ee are **normal rahvaraamat.ee orders** in the `WEB` store, created as guest orders.
