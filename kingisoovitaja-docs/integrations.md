---
id: integrations
title: Third-Party Integrations
sidebar_label: Integrations
---

# Third-Party Integrations

Credentials are named here, never shown. All live in `.env` (see [Development Setup](./development-setup)).

| Service | Used for | Credentials / config |
|---|---|---|
| **Google Gemini** | Intent extraction (`gemini-3.1-flash-lite`), choosing gifts and writing the reply (`gemini-3.8-flash`, fallback `gemini-3.1-flash-lite`), optional RAG reply, QA judge, admin description drafts. Paid tier (no training on prompts), agreed with the business | `GEMINI_API_KEY` |
| **OpenAI** | Gift profiles (`gpt-6.1-sol`), search vectors and query vectors (`text-embedding-3-large`, 1536 dimensions) | `OPENAI_API_KEY` |
| **Meilisearch** | Hybrid product search (self-hosted container, v1.54.3) | `MEILI_HOST`, `MEILI_MASTER_KEY`, `MEILI_API_KEY` |
| **E-shop feed** | Nightly catalogue (`products-feed.csv`) | `FEED_URL` (public URL, no key) |
| **E-shop change API** | Same-day price/stock changes | `ESHOP_CHANGES_URL`, `ESHOP_CHANGES_API_KEY` (`X-API-Key`) |
| **E-shop Gift Advisor API** | Stores, parcel machines, checkout | `GIFT_ADVISOR_API_URL`, `GIFT_ADVISOR_API_KEY` |
| **EveryPay** (via the e-shop) | Card and bank-link payment. Kingisoovitaja never handles card data: it receives a `paymentUrl` on the e-shop host | Handled in the e-shop |
| **NAV** (via the e-shop) | Order processing as for any e-shop order | Handled in the e-shop |
| **Rybbit** (via the e-shop) | Purchase event after successful payment, only with analytics consent | Handled in the e-shop |
| **Sentry** (EU region) | Backend error reporting (frontend has none yet) | `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` |
| **Cloudflare** | In front of the website only; real visitor IP via `CF-Connecting-IP` | DNS / account (handover from Kenno is open) |
| **Let's Encrypt** | TLS certificates through Caddy | `ACME_EMAIL` |
| **Tailscale** | Optional DB access | `COMPOSE_PROFILES=dbaccess`, `TS_AUTHKEY` |
| **rclone** (EU S3-compatible or SFTP storage with `crypt`) | Encrypted off-site DB backups | `BACKUP_RCLONE_REMOTE`, `BACKUP_REMOTE_KEEP_DAYS`, `RCLONE_CONFIG` |
| **Uptime monitor** (Better Stack, Uptime Kuma or healthchecks.io, to be chosen) | Health URLs and sync heartbeat | `SYNC_HEARTBEAT_URL` |
| **GitHub Actions** | CI and deploy | `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_TARGET` |

## Email and notifications

Kingisoovitaja itself sends no email or SMS. Order confirmation e-mails come from the e-shop: the buyer's confirmation goes to `customer.email`, and the recipient's e-mail never shows prices. Monitoring alerts depend on the uptime tool still to be chosen.

## Cost control for AI vendors

- `AiUsage` records every Gemini/OpenAI call in `ai_usage_daily`, priced from `ai_prices` in `src/config.php`.
- `AI_MONTHLY_BUDGET_USD`: chat answers 503 once reached; nightly enrichment and embeddings stop until next month. `/health?check=budget` alerts at 80%.
- Set budget alerts in the Google Cloud and OpenAI accounts too as a second line.
- Known gap: only `text-embedding-3-large` is priced, so Gemini and `gpt-6.1-sol` currently count as $0 and the cap undercounts.
