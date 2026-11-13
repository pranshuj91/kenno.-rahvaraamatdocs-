---
id: ga-tickets
title: GA Tickets RR-262 to RR-270 and Takeover History
sidebar_label: GA Tickets & History
---

# GA Tickets RR-262 to RR-270

Main work: commit `c588263` "feat(GA): RR-262-RR-270 hosting, deploy, monitoring, search rules, follow-ups, website endpoints, cost caps" (PR #15, 6 Nov 2026, 71 files).

Follow-ups: PR #16 `fb7b3a1` (`why_it_fits` added to the public-fields test, fixed red CI); `6db8b83` (Ruhab, frontend: backend review changes, stricter checkout validation, parcel machine/store picker, promo lookup removed); `f1a9f22` (website checkout through the Gift Advisor API); merge `4b71716`.

## RR-262: Service scaffold, database, hosting and CI

| Before | Done |
|---|---|
| No stack decision written | **ADR-0001**: keep plain PHP 8.5, one EU server per environment, Sentry EU, encrypted off-site backups, list of data processors |
| Manual deploys | `.github/workflows/deploy.yml` + `bin/deploy.sh`. Staging on every green push to `main`; production by manual dispatch with required reviewers. Skips with a warning while secrets are missing |
| No staging | Staging documented (`FEED_URL`, `ESHOP_CHANGES_URL` to dev, `FRONTEND_ENVIRONMENT=staging`) |
| No Sentry | `ErrorReporting.php` + `sentry/sentry`: on only with `SENTRY_DSN`; scrubs everything except request method and path |
| Backups on the same server | `bin/backup-db.sh` copies to an rclone **crypt** remote; rclone added to the cron image |
| `frontend/vercel.json` present | Deleted |
| `MEILI_ENV` only on php/cron | `MEILI_ENV=production` forced on meilisearch in `docker-compose.prod.yml` |

## RR-263: Catalogue sync, AI tagging and embeddings

- Feed `occasions` read: `sync.php` to `ProductUpsert::shopOccasions` to `products.shop_occasions` to index field `shop_occasion_codes`. `is_gift_book` is read the same way, ready for when the e-shop sends it.
- Vectors refreshed when a profile changes: `bin/profile_embeddings.php` in cron at 04:00.
- Index count alert: `/health?check=catalog` and `/health?check=cron`.
- OpenAI spend recorded in `AiUsage`; enrichment and embeddings stop when the monthly budget is used up.
- Kept on purpose: enrichment only for products since 2026-10-16, max 500 per night.

## RR-264: Embedding model evaluation

**Not done.** `text-embedding-3-large` (1536 dimensions) is still used with no comparison and no written decision. Planned after vector coverage is complete.

## RR-265: Intent extraction, follow-up questions and language

- "Not X" **exclusions** now filter candidates (`Exclusions.php`); before they were only in the prompt.
- **Follow-up rules** in code (`FollowUp.php`), remembered in `gift_assistant_history.follow_up`.
- **Suggested replies (chips)** returned as `suggested_replies`.
- Recorded in ADR-0002; tests in `tests/Unit/GaTicketsTest.php`.

## RR-266: Hybrid product search

- Curated occasions used in search (`ShopOccasions.php`, `CandidateSearch`): up to 10 added, not boosted.
- Gift-book flag rule in `catalog_rules.php` (inactive until the feed sends `is_gift_book`).
- Parent brands (`BrandFamilies.php`): Sanrio characters.
- Gardners documented as excluded by the feed.
- BE-5 (e-shop Elasticsearch search) is **not** closed based on this (Kenno: it needs its own test on e-shop queries).

## RR-267: Live check, rerank, reasons and guardrails

- One-line reason per product (`why_it_fits`).
- Product count configurable (`search.choice_count`, still `[8, 12]`; `[3, 6]` waits for Dagmar).
- Honest fallback reply (`GiftAssistant::fallbackReply`) in every path where the model did not choose.
- Hard rules in `ResultChecks` (shared with RR-269).

## RR-268: Chat API, sessions, rate limits and cost caps

- Website endpoints (`site.php`, `ProductCard.php`, `ThemeProducts.php`, `themes.php`) replace the frontend's mocks.
- Cost caps: `AiUsage` + `ai_usage_daily`, `AI_MONTHLY_BUDGET_USD` (503), `RC2_MAX_TURNS` (429), `/health?check=budget`.
- No fake orders in production: `frontend_guard()` in `bin/prod_compose.sh`.
- Cloudflare real IP: `trusted_proxies` + `CF-Connecting-IP`.
- Checkout path: `GIFT_ADVISOR_API_URL` / `GIFT_ADVISOR_API_KEY` in `frontend/compose.yml`; the frontend got its own `egress` network.

## RR-269: Evaluation set runner

`bin/chat_qa.php` checks the hard rules and exits 1 on failure, plus a CSV review sheet for the business. `business_suite.json` started (Hello Kitty, Kuromi). Dagmar's full query set is still to come.

## RR-270: Logging, monitoring and feedback

- Anonymised per-turn log (`TurnLog.php`, `gift_assistant_turns`).
- Metrics: `App\Metrics`, `bin/metrics.php`, admin page `/control-room-HASH/metrics`.
- Feedback endpoint `POST /feedback` + table `gift_assistant_feedback`.
- `/api/health` on the website reachable without the site password.
- Uptime targets documented.

## Timeline of the takeover (2026)

| Date | Event |
|---|---|
| 28 Oct | Repo reviewed ticket by ticket; questions sent to Kenno |
| 4 Nov | Kenno's and the FE team's answers; takeover plan |
| 6 Nov | PR #15 (RR-262 to RR-270) merged; PR #16 test fix; Ruhab's `update/kingisoovitaja-changes` merged: `main` = `4b71716`, CI green |
| After 6 Nov | Read-only deploy key added on the server (public key given to Kenno); server pulled to `4b71716`; manual first deploy; `/health` and `/api/health` OK |

Related internal documents (not part of this site): RR-233 Kenno GA tickets status, GA takeover plan, business answers, backend analysis.
