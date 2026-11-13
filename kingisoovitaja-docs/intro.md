---
id: intro
title: Kingisoovitaja Overview
sidebar_label: Overview
slug: /
---

# Kingisoovitaja (RR-233): Gift Advisor

Kingisoovitaja.ee is an AI gift advisor for Rahva Raamat. A shopper writes in Estonian (for example "kingitus emale, 40 eurot"). The assistant understands the request, searches Rahva Raamat's catalogue, picks fitting gifts and answers with a short reply and product cards. The shopper can add products to a basket and **check out on kingisoovitaja.ee**. The order becomes a normal rahvaraamat.ee order through the e-shop's Gift Advisor API.

:::info[Source of this section]
Everything here comes from the project's two documentation files (repo documentation and e-shop backend documentation) and from the repositories themselves. Where the sources say nothing, the page says so. See [Knowledge Transfer](./knowledge-transfer) for what is still missing.
:::

## Repositories

| Repo | What it holds |
|---|---|
| `Rahva-Raamat/kingisoovitaja-be-fe` | Backend (PHP) and website (Next.js in `frontend/`) in one repo |
| `Rahva-Raamat/ecommerce-backend` | The e-shop (Yii2, rahvaraamat.ee): feed, change API, checkout API, admin lists |

- **Original author:** Kenno. **Taken over by:** the RR backend team (GA tickets RR-262 to RR-270) and the FE team (website).
- **State documented:** `main` at `4b71716`. origin/main was 3 small frontend commits ahead (feedback switched on by default and two cart fixes).

## Technology stack

| Part | Technology |
|---|---|
| Backend (chat, search, catalogue sync) | Plain PHP 8.5, no framework (ADR-0001: deliberately kept) |
| Database | MariaDB 10.11 |
| Search | Meilisearch v1.54.3 (keyword + vector hybrid search) |
| AI | Google Gemini (understanding, choosing, reply); OpenAI (gift profiles `gpt-6.1-sol`, embeddings `text-embedding-3-large`) |
| Website | Next.js 16 (React 19) in `frontend/` |
| Web server / TLS | Caddy 2.11 |
| Runtime | Docker Compose on one EU server (Adminor, Sweden) |

## Core features

- Estonian chat that extracts recipient, age, occasion, budget, brand, exclusions and delivery speed.
- Hybrid (keyword + meaning) catalogue search with hard filters (stock, budget, age, allowed catalogue).
- AI choice of gifts with a one-line reason per product ("why it fits") and follow-up questions with suggested-reply chips.
- Gift bag and card suggestions for a basket (pre-cart).
- Website theme pages (recipients, occasions, topics), product pages, popular products.
- Basket and checkout on kingisoovitaja.ee, placed as a guest order in the e-shop.
- Thumbs up/down feedback, anonymised turn log and daily metrics.
- Cost caps: monthly AI budget, per-conversation turn limit, per-visitor rate limits.

## Business decisions the code follows

Decisions from Dagmar (9 Oct 2026):

- Curated occasion lists **supplement** the selection and are **not boosted**.
- **Gift books** are allowed, other books never.
- Gardners products are not in the feed.
- **Estonian only** at launch.
- Checkout happens on kingisoovitaja.ee.

## Where to go next

- How the pieces fit: [Architecture](./architecture)
- First day as a developer: [Development Setup](./development-setup)
- Production: [Deployment](./deployment)
- What is still open: [Knowledge Transfer](./knowledge-transfer)
