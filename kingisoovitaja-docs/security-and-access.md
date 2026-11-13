---
id: security-and-access
title: SSL, Security & Access Control
sidebar_label: Security & Access
---

# SSL, Security & Access Control

## SSL / TLS

- Caddy obtains and renews Let's Encrypt certificates itself (`ACME_EMAIL` is the contact address) for `SITE_ADDRESS` and `FRONTEND_ADDRESS`, and redirects HTTP to HTTPS. Certificates live in the `caddy_data` volume.
- Cloudflare's certificate covers `staging.kingisoovitaja.ee` if the name is proxied (one level under the domain).
- HSTS and other security headers are set by Caddy.

## Access layers

| Surface | Protection |
|---|---|
| Website (`kingisoovitaja.ee`) | Site password (`FRONTEND_AUTH=on`, user + hash from `caddy hash-password`, hash in single quotes in `.env`). `/api/health` and `/review/REVIEW_TOKEN` bypass it. Without a user or hash everyone gets 401 |
| Public API `/endpoint.php`, `/precart.php` | `API_ALLOWED_IPS` (closed while empty) plus API key |
| Internal API (`backend-api:8081`) | Internal Docker network `kingisoovitaja-api` (no internet), API key; Caddy is the only backend member |
| Admin (`/control-room-HASH/...`) | `ADMIN_ALLOWED_IPS` (required in production, malformed value stops Caddy), basic auth |
| Stock webhook | `STOCK_SYNC_TOKEN` |
| Database | Internal network only; optional Tailscale access with a read-only user |
| Meilisearch | Internal network only; production runs without its web UI; php uses a scoped key, only cron has the master key |

## Hardening in the stack

- Source mounted read-only, `RC2_API_DEBUG` forced to 0 in production.
- Security headers: `nosniff`, `no-referrer`, HSTS, `Permissions-Policy`; 1 MB body limit; `Server`, `Via`, `X-Powered-By` removed.
- Caddy trusts `CF-Connecting-IP` only from Cloudflare's IP ranges (update when Cloudflare changes its list).
- Admin pages only run from their own same-origin form and cannot be framed.
- PHP hardening config in `docker/php-hardening.ini` and `docker/php-prod.ini`.

## Privacy and data handling

- Turn log has no message text; the conversation ID is hashed.
- Sentry: request cut down to method and URL without query; no messages, headers, cookies or IPs. Use the EU region.
- Conversation history is deleted after 90 days; DB dumps contain history, so off-site copies must be in the EU and encrypted (rclone `crypt`).
- A conversation can be forgotten with `DELETE /endpoint.php` (also removes its turn rows).
- ADR-0001 lists the data processors.

## Secrets rules

- Values live in the server's `.env`, never committed or pasted in chat.
- Production secrets differ from staging.
- Rotate API keys by adding the new one first.
- Admin password: hash in production (`password_hash`), in single quotes in `.env` (compose would expand `$`).
