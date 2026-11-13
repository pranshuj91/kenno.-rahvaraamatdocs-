---
id: deployment
title: Deployment & Infrastructure
sidebar_label: Deployment
---

# Deployment & Infrastructure

## Servers and hosting

- One EU server per environment, Docker Compose (ADR-0001). Current production host: Adminor, Sweden.
- Cloudflare is in front of the **website only** (`kingisoovitaja.ee`). `app.kingisoovitaja.ee` is reached directly.
- **Current state (Nov 2026):** the production server runs against the **e-shop staging** `dev.rahvaraamat.ee` (feed, changes, checkout), behind the site password. Test orders land in e-shop staging. This was option 2, chosen by Dagmar. A separate staging server (`staging.kingisoovitaja.ee`) from ADR-0001 is not set up yet.
- Server checkout path used in the first deploy: `/srv/rr`.

## Domains

| Name | Use |
|---|---|
| `kingisoovitaja.ee`, `www.kingisoovitaja.ee` | Website (`FRONTEND_ADDRESS`); www redirects to the bare domain |
| `app.kingisoovitaja.ee` | Backend host (`SITE_ADDRESS`): health, webhook, admin |
| `staging.kingisoovitaja.ee`, `app-staging.kingisoovitaja.ee` | Planned staging names (README), not set up yet |

DNS: for staging, `A` records for both names point to the staging server; Caddy obtains the certificates itself. For a Caddy move, DNS for the three production names must already point at the server before first start (otherwise Caddy logs ACME errors and retries).

## Production commands

```bash
bin/prod_compose.sh up          # base + docker-compose.prod.yml, rebuild and start
bin/prod_compose.sh php-only    # recreate only php (safe default for code changes)
bin/prod_compose.sh logs php
```

Other subcommands: `frontend`, `migrate`, `meili-key`, `ps`, `config`.

What production changes:

- **Caddy is the only public entry** (80, 443, HTTP/3). It gets and renews Let's Encrypt certificates for `SITE_ADDRESS` and `FRONTEND_ADDRESS` and redirects HTTP to HTTPS. Certificates live in the `caddy_data` volume.
- Public `/endpoint.php` only answers `API_ALLOWED_IPS` (nobody while empty). The frontend uses the internal listener `backend-api:8081`.
- MariaDB and Meilisearch are on the internal network only, no outbound access.
- php, cron and Caddy also join a bridge network for outbound calls (Gemini, OpenAI, the feed, Let's Encrypt).
- Source is mounted read-only, debug is off, security headers are set.
- Container logs are rotated (10 MB x 5 files per service). Every container has a Docker healthcheck.
- Docker-published ports bypass UFW, so never publish the database on `0.0.0.0`.

## Deploy procedure

**Normal deploy:** `bin/deploy.sh SHA` on the server, or the GitHub "Deploy" workflow once its secrets are set. Steps:

1. Lock; require a clean `main` checkout.
2. `git fetch` and fast-forward to the commit (it must be on `origin/main`).
3. Build the php image and run `composer install --no-dev`.
4. `bin/prod_compose.sh up` (including the frontend).
5. `bin/prod_compose.sh migrate`.
6. Restart Caddy or cron if their config changed.
7. Wait up to 150 s for `https://SITE_ADDRESS/health`.

`.env` changes are manual. **Rollback** = revert on `main` and deploy again. Avoid deploying between 01:00 and 03:30.

On the first deploy also run `bin/prod_compose.sh meili-key`, put the printed `MEILI_API_KEY` in `.env` and run `bin/prod_compose.sh up php`.

**First deploy / manual steps (done in `/srv/rr`):**

```bash
git pull
docker compose -f docker-compose.yml run --rm --no-deps -T --user $(id -u):$(id -g) -e COMPOSER_HOME=/tmp/composer -v /srv/rr:/app -w /app php composer install --no-dev --optimize-autoloader
bin/prod_compose.sh up
bin/prod_compose.sh migrate
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart caddy
docker exec kingisoovitaja_cron php /var/www/src/sync.php
docker exec kingisoovitaja_cron php /var/www/bin/sync_to_meili.php
```

Tip: type commands with plain quotes, or none. Curly quotes copied from chat break `-v` and URLs.

**Smoke test after a bigger change:** a `curl` to the API without a key (expect 401) and one with a key (expect 200), both from the frontend container. From anywhere else the public `/endpoint.php` answers 403.

## Website deploy

```bash
bin/prod_compose.sh frontend                                            # production: rebuild and restart
docker compose --env-file .env -f frontend/compose.yml up -d --build     # locally, http://localhost:8089
```

A plain `bin/prod_compose.sh up` deploys it too. A placeholder in `docker/frontend-placeholder/` stands in for tests and uses the same container name, so stop it before the website starts (`bin/prod_compose.sh frontend` does that). Without any frontend container the site answers 502.

## Staging environment (planned configuration)

Same stack on its own small server. Its `.env` differs from production only in:

| Setting | Staging |
|---|---|
| `SITE_ADDRESS` | `app-staging.kingisoovitaja.ee` |
| `FRONTEND_ADDRESS` | `staging.kingisoovitaja.ee` |
| `FRONTEND_SITE_URL`, `FRONTEND_ENVIRONMENT` | `https://staging.kingisoovitaja.ee`, `staging` (website sends `noindex`) |
| `FRONTEND_AUTH` | `on`, with its own login |
| `FEED_URL` | `https://dev.rahvaraamat.ee/storage/feed-exports/web/products-feed.csv` |
| `ESHOP_CHANGES_URL` | `https://dev.rahvaraamat.ee/gift-advisor/changes` with the staging Gift Advisor key |
| `SENTRY_ENVIRONMENT` | `staging` |
| Every key and password | its own; never production's |

## Going public (production switch)

Before switching the site password off: production must point to `web.rahvaraamat.ee` with the production key, production secrets differ from staging, and `FRONTEND_MOCK_FALLBACK=false` (the guard in `bin/prod_compose.sh` enforces this). Then `FRONTEND_AUTH=off`.

## Upgrading Meilisearch

The tag is pinned exactly in `docker-compose.yml` because the index on disk is tied to the engine version.

1. Back up the volume: `docker run --rm -v PROJECT_meili_data:/data:ro -v "$PWD:/backup" alpine tar czf /backup/meili-$(date +%F).tgz -C /data .`
2. Change the tag, then start once with the upgrade enabled: `MEILI_UPGRADE_DB=true bin/prod_compose.sh up meilisearch`. Check `docker logs kingisoovitaja_meili` for the `upgradeDatabase` task to succeed.
3. Run `bin/prod_compose.sh up meilisearch` again without the variable.

If an upgrade fails, restore the backup or rebuild the index with `bin/sync_to_meili.php`. Other images are pinned to a minor version (`caddy:2.11-alpine`, `php:8.5-*`).

## Rotating the API key

Add the new key to `RC2_API_KEYS` alongside the old one, run `bin/prod_compose.sh php-only` and `bin/prod_compose.sh frontend` (the website uses the last key in the list), then remove the old key and recreate php again.

## Moving a server from Traefik + nginx to Caddy

Stop the old edge with `docker rm -f traefik kingisoovitaja_nginx` so ports 80 and 443 are free. Set `SITE_ADDRESS`, `ACME_EMAIL`, `ADMIN_ALLOWED_IPS`, `FRONTEND_ADDRESS` and the `FRONTEND_AUTH_*` login in `.env`, then run `bin/prod_compose.sh up`.

## Database access (DBeaver) over Tailscale

The `tailscale-db` container joins the tailnet as device `kingisoovitaja-db` and forwards port 3306 to MariaDB only (`docker/tailscale-db/serve.json`). No host port is published. One-time setup:

1. In the Tailscale access controls add the tag `tag:kingisoovitaja-db` and allow only yourself on `tcp:3306`.
2. Generate an auth key with that tag (not ephemeral, not reusable). In `.env` set `COMPOSE_PROFILES=dbaccess` and `TS_AUTHKEY`, then run `bin/prod_compose.sh up tailscale-db`.
3. Give DBeaver its own MariaDB user with `GRANT SELECT` on the database.
4. In DBeaver: MariaDB, host `kingisoovitaja-db.TAILNET.ts.net`, port 3306.

`docker exec kingisoovitaja_tailscale_db tailscale status` shows whether it is online. To close access: remove `dbaccess` from `COMPOSE_PROFILES`, `docker rm -f kingisoovitaja_tailscale_db`, delete the device in the Tailscale admin. Fallback if Tailscale is down: `docker-compose.dbaccess.yml` publishes MariaDB on `127.0.0.1:13306` for an SSH tunnel.

## Process management

The sources describe Docker containers with healthchecks and a cron container. PM2 is not mentioned in the Kingisoovitaja sources.
