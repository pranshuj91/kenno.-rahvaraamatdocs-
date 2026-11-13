---
id: maintenance
title: Maintenance & Troubleshooting
sidebar_label: Maintenance
---

# Maintenance & Troubleshooting

## Health and monitoring

Each answers `{"status":"ok"}` (200) or `{"status":"unavailable"}` (503). The reason goes to `docker logs` with the prefix `[health]`.

| Check | URL | Fails when |
|---|---|---|
| Backend | `https://app.kingisoovitaja.ee/health` | MariaDB or Meilisearch does not answer |
| Cron | `.../health?check=cron` | No cron job ran in 20 min (`data/cron-alive`) |
| Catalogue | `.../health?check=catalog` | Feed over 26 h old, or index under 90% of the DB's in-stock products or under `CATALOG_MIN_PRODUCTS` (1000) |
| AI budget | `.../health?check=budget` | Month's AI cost passed `AI_BUDGET_ALERT_SHARE` (0.8) of the budget |
| Website | `https://kingisoovitaja.ee/api/health` | Website down (reachable without the site password); shows backend status and commit |
| Sync heartbeat | `SYNC_HEARTBEAT_URL` | A push monitor pinged after each nightly sync; alerts when the sync fails or never runs |

## Logs and debugging

- `bin/prod_compose.sh logs php` (prefixes `[rc2 endpoint]`, `[rc2 extract]`, `[rc2 choice]`, `[site api]`, `[ai usage]`, `[health]`).
- `docker logs kingisoovitaja_cron` for job output; `logs/sync.log`, `logs/cleanup.log`.
- Metrics: admin `/control-room-HASH/metrics?days=30` or `php bin/metrics.php --days=30` (conversations, turns, nothing found, errors, refused, latency, AI cost and tokens, thumbs up/down).
- Admin debug panel `/control-room-HASH/debug` runs one message through every stage with real calls (costs one or two Gemini calls per message).
- Sentry: set `SENTRY_DSN` (EU). Errors the code catches and logs itself go only to `docker logs`. The frontend has no Sentry yet.
- Apply a Sentry change with `bin/prod_compose.sh up php cron`.

## Backups and recovery

- `bin/backup-db.sh` runs at 03:00, writes `backups/db-YYYYmmdd-HHMM.sql.gz`, kept 7 days (`BACKUP_KEEP_DAYS`).
- With `BACKUP_RCLONE_REMOTE` it also copies to encrypted EU storage (30 days). A failed upload fails the job in `docker logs kingisoovitaja_cron`; the local dump is kept.
- Keep the rclone crypt password in the password manager too: without it the copies cannot be read.
- Check once after setup: `docker exec kingisoovitaja_cron sh /var/www/bin/backup-db.sh`, then `docker exec kingisoovitaja_cron rclone ls offsite:`.
- **Restore:**

```bash
gunzip -c backups/db-XXXX.sql.gz | docker compose exec -T mariadb mariadb -u"$DB_USER" -p"$DB_PASS" "$DB_NAME"
```

- **Meilisearch is not backed up:** rebuild with `bin/sync_to_meili.php` (under a minute).

## Common issues (documented in the sources)

| Symptom | Cause / fix |
|---|---|
| `sync.php` exits with code 75 | Another sync holds the lock (`data/.sync.lock`) |
| Sync refuses to delete products | More than 10% would be removed (`SyncGuard`); use `--allow-mass-delete` only if intended |
| Cron seems dead | `cat data/cron-alive` older than 10 min means cron runs nothing (this happened from 2026-10-06 to 2026-10-17, per the crontab comment). After a crontab edit, the cron log should start with `[cron] 7 jobs from docker/crontab` |
| A crontab edit has no effect | Restart the cron container; the crontab must be installed as root (done by `docker/cron-start.sh`) |
| Website answers 502 | No frontend container is running (or the placeholder is using its name) |
| Everyone gets 401 on the website | `FRONTEND_AUTH=on` with a missing user or hash |
| Caddy fails to start | Malformed `API_ALLOWED_IPS` or `ADMIN_ALLOWED_IPS` |
| Caddy logs ACME errors | DNS for a name does not point at the server yet; it retries |
| Chat answers 503 | Monthly AI budget used up, or not configured |
| Chat answers 429 | Rate limit (see `Retry-After`) or 30 turns in the conversation |
| Public `/endpoint.php` answers 403 | Expected: `API_ALLOWED_IPS` is empty; use the internal listener |
| Rate limits count the wrong IP | Cloudflare IP ranges in the Caddyfile out of date |
| Theme "Eripakkumised" is empty | Christmas campaign rule excludes discounted products (by design) |
| Docker commands fail with odd errors after pasting | Curly quotes from chat; retype with plain quotes |
| `bin/prod_compose.sh` refuses to open the site | `FRONTEND_MOCK_FALLBACK` not `false`, or `GIFT_ADVISOR_API_URL`/`KEY` missing |
| `bin/ci` refuses to run | The database already has products (it never touches local data) |
| `gift-advisor/changes` returns `cursor_expired: true` | Cursor older than 7 days: full resync from the feed (the backend restarts from the oldest change) |
| E-shop changes not arriving | Check `rr_gift_advisor_tracker_run`: latest run must have finished within the last hour with no `error` |
| Checkout 500 or timeout | The order may already exist; never retry blindly |

## Routine maintenance

- Avoid deploying between 01:00 and 03:30.
- Update Cloudflare IP ranges in the Caddyfile when Cloudflare changes them.
- Rotate API keys with overlap (see [Deployment](./deployment)).
- Meilisearch upgrades follow the pinned-tag procedure.
- Dependabot: 4 major bumps (Tailwind 4, TypeScript 7, Vitest 5, @types/node 26) need separate work.
- E-shop: check daily that the feed `Last-Modified` is under about 26 hours old; run the monthly order report `./yii gift-advisor/order-report`.
