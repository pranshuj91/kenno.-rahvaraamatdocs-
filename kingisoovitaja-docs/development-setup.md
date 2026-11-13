---
id: development-setup
title: Development Setup
sidebar_label: Development Setup
---

# Development Setup

## Prerequisites

- Docker with Compose.
- A Gemini API key and an OpenAI API key.
- Composer (or use `docker compose run --rm php composer install`).
- For the website only: Node.js `>=20.11.0` (from `frontend/package.json`).

## Backend: run locally

```bash
cp .env.example .env              # fill in GEMINI_API_KEY, OPENAI_API_KEY, ADMIN_PASSWORD
echo "RC2_API_KEYS=$(openssl rand -hex 32)" >> .env
composer install                  # or: docker compose run --rm php composer install
docker compose up -d
```

- API: `http://localhost:8088/endpoint.php`
- Meilisearch: `http://localhost:7700` (local only)
- MariaDB: `localhost:13306`

### First data load on an empty database

`schema.sql` runs automatically on an empty DB. After that:

```bash
docker compose exec php php bin/migrate.php            # apply migrations/ (tracked in schema_migrations)
docker compose exec php php src/sync.php               # download feed -> DB -> index
docker compose exec cron php bin/sync_to_meili.php     # DB -> Meilisearch (staging index + swap; needs the master key)
```

- `sync.php --dry-run` gives a policy report with no writes.
- Only one `sync.php` runs at a time: a second run exits with code 75, from cron or from a manual `exec`.
- Removing more than 10% of the catalogue as stale is refused unless you pass `--allow-mass-delete`.

## Website: run locally

Two ways, both from the repo README and `frontend/` files:

```bash
docker compose --env-file .env -f frontend/compose.yml up -d --build     # http://localhost:8089
```

or with Node, using `frontend/.env.example` copied to `.env.local`:

```bash
cd frontend
npm run dev
```

Frontend environment (names and meaning from `frontend/.env.example`):

| Variable | Meaning |
|---|---|
| `CHAT_BACKEND` | `mock` (default; no credentials, no network; used by CI and e2e) or `live` (needs `BACKEND_API_URL` and `RC2_API_KEY`) |
| `BACKEND_API_URL` | `http://localhost:8088` for `npm run dev` on a Mac; `http://backend-api:8081` in a container |
| `RC2_API_KEY` | One of the backend's `RC2_API_KEYS` (at least 32 characters). Server-side only |
| `BACKEND_MOCK_FALLBACK` | `true` answers missing backend calls from mock data. Must be `false` in production |
| `BACKEND_TIMEOUT_MS`, `BACKEND_CONNECT_TIMEOUT_MS` | Upstream timeouts (35000 / 5000); must stay below `maxDuration` in the chat route |
| `RATE_LIMIT_PER_MINUTE` | Per-IP chat requests per minute (10). In-memory, per instance |
| `GIFT_ADVISOR_API_URL`, `GIFT_ADVISOR_API_KEY` | E-shop Gift Advisor API (set both or neither; without them checkout answers from the mock) |
| `CHECKOUT_REDIRECT_HOSTS` | Hosts checkout may redirect to (default `rahvaraamat.ee`) |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENVIRONMENT` | Public values inlined in the browser bundle: never put a secret here |
| `NEXT_PUBLIC_ENABLE_VOICE_INPUT`, `NEXT_PUBLIC_ENABLE_CONVERSATION_HISTORY`, `NEXT_PUBLIC_ENABLE_FEEDBACK` | Feature flags |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Empty disables tracking; provider not yet chosen |

:::note
The old widget that used to sit untracked in `frontend/` belongs in `frontend-old/` (ignored). Run `mv frontend frontend-old` before the first pull that brings the website.
:::

## Environment variables (backend)

Names only. Values live in the server's `.env` and are never committed or shared in chat.

| Group | Variables |
|---|---|
| Database | `DB_ROOT_PASSWORD`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_BUFFER_POOL_SIZE` |
| Chat API | `RC2_API_KEYS`, `RC2_API_DEBUG` (prod forced 0), `RC2_MAX_TURNS` (30), `RC2_HISTORY_RETENTION_DAYS` (90), `RC2_SEMANTIC_SEARCH`, `ENABLE_RAG`, `RC2_CONFIG_PATH` |
| AI | `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_BASE_URL`, `OPENAI_API_BASE_URL` (tests) |
| Cost | `AI_MONTHLY_BUDGET_USD` (empty = no cap), `AI_BUDGET_ALERT_SHARE` (0.8) |
| Search | `MEILI_HOST`, `MEILI_MASTER_KEY`, `MEILI_API_KEY` (scoped, prod), `MEILI_ENV`, `MEILI_UPGRADE_DB` |
| E-shop data | `FEED_URL`, `ESHOP_CHANGES_URL`, `ESHOP_CHANGES_API_KEY`, `STOCK_SYNC_TOKEN`, `CATALOG_MIN_PRODUCTS` (1000) |
| Caddy / access | `SITE_ADDRESS`, `FRONTEND_ADDRESS`, `ACME_EMAIL`, `API_ALLOWED_IPS`, `ADMIN_ALLOWED_IPS`, `FRONTEND_AUTH`, `FRONTEND_AUTH_USER`, `FRONTEND_AUTH_HASH` |
| Admin / review | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (`ADMIN_PASSWORD` locally), `REVIEW_TOKEN` |
| Website | `FRONTEND_CHAT_BACKEND` (live), `FRONTEND_MOCK_FALLBACK` (**false in prod**), `FRONTEND_SITE_URL`, `FRONTEND_ENVIRONMENT`, `FRONTEND_ENABLE_FEEDBACK`, `GIFT_ADVISOR_API_URL`, `GIFT_ADVISOR_API_KEY` |
| Monitoring | `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` (= `GIT_COMMIT`), `SYNC_HEARTBEAT_URL` |
| Backups | `BACKUP_KEEP_DAYS` (7), `BACKUP_DIR`, `BACKUP_RCLONE_REMOTE`, `BACKUP_REMOTE_KEEP_DAYS` (30), `RCLONE_CONFIG` |
| Runtime | `APP_ENV`, `FPM_MAX_CHILDREN` (16, at least 6), `COMPOSE_PROFILES`, `TS_AUTHKEY` |
| GitHub deploy secrets | `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_TARGET` (per environment) |

Rules followed:

- Production secrets differ from staging.
- Keys are rotated by adding the new key to `RC2_API_KEYS` first, then removing the old one.
- Only public keys are shared (for example the deploy key).

## Settings live in four places

1. **Environment** (`.env`): secrets and per-server values only.
2. **Catalogue rules** (`src/catalog_rules.php`).
3. **Code defaults**: `src/App/Assistant/Rc2Config.php` (assistant and search) and `src/config.php` (catalogue pipeline). Changing them means a commit.
4. **Tuning overrides** (`data/rc2-config.json`): search tuning without a deploy.

## Daily development workflow

- Change code, run `bin/test` (see [Testing](./testing)).
- An API change changes `docs/frontend-api.md` in the same commit (README rule).
- Open a pull request; CI runs on every PR and push to `main` ([CI/CD](./ci-cd)).
- The website has its own rules in `frontend/CONTRIBUTING.md` (comments of at most two lines, tokens and routes in the existing config files, commit message shown before pushing).
