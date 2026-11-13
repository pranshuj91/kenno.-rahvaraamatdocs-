---
id: repository-structure
title: Repository & Codebase Structure
sidebar_label: Repository Structure
---

# Repository & Codebase Structure

Repo: `Rahva-Raamat/kingisoovitaja-be-fe` (backend + website in one repo).

```text
README.md                 full operator manual (~900 lines)
docs/frontend-api.md      API contract for the website
docs/adr/0001-...         plain PHP stack and EU hosting (RR-262)
docs/adr/0002-...         website endpoints and cost caps (RR-265/268)
.github/workflows/        ci.yml, deploy.yml, frontend.yml; dependabot.yml
bin/                      CLI tools and ops scripts
docker/                   Dockerfiles, Caddyfile, crontab, php ini, tailscale config
docker-compose.yml        base / local stack
docker-compose.prod.yml   production overlay (used through bin/prod_compose.sh)
docker-compose.test.yml   test mode (Gemini/OpenAI mock)
docker-compose.dbaccess.yml  fallback DB access via SSH tunnel
migrations/               001 ... 015 SQL migrations
rc2-controller/           HTTP entry points + JSON test sets
src/                      application code and config
tests/                    PHPUnit suites (unit, integration, api, infra)
frontend/                 Next.js website (own README and ADRs)
data/                     runtime state (feed copy, cursors, heartbeat, QA reports)
```

## Key configuration files

| File | Purpose |
|---|---|
| `.env` (from `.env.example`) | Secrets and per-server values only |
| `src/config.php` | Models, search switches, AI prices (`ai_prices`), admin settings (`admin.route_prefix`) |
| `src/catalog_rules.php` | What the assistant may recommend ([Catalogue Rules](./catalogue-rules)) |
| `src/App/Assistant/Rc2Config.php` | Assistant and search defaults |
| `data/rc2-config.json` | Search tuning overrides without a deploy (only keys with a default in `Rc2Config`, checked against `Rc2TuningSchema`) |
| `docker/caddy/Caddyfile` | Caddy routes and headers |
| `docker/crontab` | Scheduled jobs |
| `docker-compose*.yml` | Stack definitions |
| `composer.json` | PHP dependencies and scripts (`test`, `stan`, `cs`, `cs:fix`) |
| `frontend/.env.example` | Website environment (validated at startup by `src/lib/config/env.ts`) |

## `src/`

| Path | Purpose |
|---|---|
| `bootstrap.php` | Loaded by every entry point; starts Sentry error reporting |
| `config.php` | Models, search switches, AI prices, admin settings |
| `catalog_rules.php` | What may be recommended |
| `themes.php` | Website theme pages |
| `sync.php` | Nightly feed sync |
| `cleanup.php` | Retention cleanup |
| `schema.sql` | Schema for a fresh database |
| `enrichment_values.php`, `enrichment_hints.php`, `enrichment_qa.php` | Gift profile value lists, shop hints, prompt QA cases |
| `public/health.php`, `public/stock_webhook.php` | Health check, stock webhook |
| `review/` | Manager review page for gift profiles |
| `admin/` | Admin basic auth |

## `src/App/`

| Folder / file | Purpose |
|---|---|
| `Assistant/GiftAssistant` | One chat turn: understand, find, choose, reply |
| `Assistant/KingiSoovitajaExtract` | Gemini intent extraction, with a rule fallback |
| `Assistant/CandidateSearch` | Hybrid candidate search (about 60 candidates) |
| `Assistant/GiftChooser` | Gemini picks gifts, writes the reply and reasons |
| `Assistant/FollowUp` | Follow-up questions and suggested-reply chips (RR-265) |
| `Assistant/Exclusions` | "Not X" filter (RR-265) |
| `Assistant/ResultChecks` | Hard QA rules (RR-267/269) |
| `Assistant/TurnLog` | Anonymised per-turn log (RR-270) |
| `Assistant/GiftRecommendationService`, `RagReplyWriter` | Older non-AI-choice search path and optional RAG reply |
| `Assistant/GeminiClient`, `QueryEmbedder`, `Rc2Config`, `Rc2RuntimeConfig` | Clients and config |
| `Catalog/MeiliService`, `ProductUpsert`, `SyncGuard`, `FeedDownloader`, `ShopChanges` | Catalogue sync and index |
| `Catalog/CatalogFilter`, `CampaignRules`, `AddOns`, `SafetyAge`, `Audience`, `BrandFamilies`, `ShopOccasions` | Catalogue rules |
| `Catalog/PreCart` | Gift bag and card suggestions for a basket |
| `Catalog/ProductCard`, `ThemeProducts` | Website product shape and theme pages (RR-268) |
| `Enrichment/*` | AI gift profiles, product vectors, prompt QA |
| `Review/ReviewBoard` | Review page |
| `AiUsage` | AI token/cost ledger and monthly cap (RR-268) |
| `Metrics` | Daily metrics (RR-270) |
| `ErrorReporting` | Sentry with scrubbing (RR-262) |
| `Heartbeat`, `Database`, `OpenAIClient`, `MigrationRunner`, `Paths` | Infrastructure |

PHP classes are autoloaded by Composer (PSR-4, namespace `App\`).

## `rc2-controller/`

| File | Purpose |
|---|---|
| `endpoint.php` | Chat turn (POST) and forget conversation (DELETE) |
| `precart.php` | Gift bag + cards for a basket |
| `site.php` | Website endpoints: products, popular, themes, feedback (RR-268/270) |
| `metrics.php` | Admin metrics page (RR-270) |
| `debug.php` | Admin debug panel |
| `api.php` | Shared helpers: errors, API key, JSON body, rate limits |
| `*_suite.json`, `conversations_*.json`, `business_suite.json` | Test sets for QA tools |

## `bin/`

| Script | Purpose |
|---|---|
| `deploy.sh` | Deploys one commit of `main` on the server (RR-262) |
| `prod_compose.sh` | Production compose helper: `up`, `frontend`, `migrate`, `meili-key`, `logs`, `ps`, `config`, `php-only` |
| `migrate.php` | Applies pending migrations (`--status`) |
| `sync_to_meili.php` | Full MariaDB to Meilisearch rebuild with index swap |
| `shop_changes.php` | Same-day e-shop price/stock changes |
| `enrich_pilot.php` | AI gift profile runs (nightly `--all --since=2026-10-16 --limit=500`) |
| `profile_embeddings.php` | New vectors for changed profiles (RR-263) |
| `backup-db.sh` | Nightly DB dump, optional encrypted off-site copy (RR-262) |
| `metrics.php` | Metrics in the terminal (RR-270) |
| `chat_qa.php` | Runs test sets with hard checks; exit 1 on failure; CSV review sheet (RR-269) |
| `compare_search.php`, `compare_choice.php`, `compare_models.php`, `prompt_qa.php` | Quality comparison tools |
| `catalog_rules.php` | How many products each rule leaves |
| `add_ons.php`, `review_set.php`, `meili_keys.php`, `rc2_config_check.php` | Helpers |
| `ci`, `test` | CI script and local test runner |
