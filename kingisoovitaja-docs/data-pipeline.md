---
id: data-pipeline
title: Catalogue Data Flow & Cron Jobs
sidebar_label: Data Pipeline & Cron
---

# Catalogue Data Flow & Cron Jobs

```text
 e-shop products-feed.csv --> src/sync.php (01:00) --> MariaDB products --> Meilisearch
 new products -------------> bin/enrich_pilot.php (02:30) --> gift profile + vector --> index
 changed profiles ---------> bin/profile_embeddings.php (04:00) --> new vectors --> index
 e-shop /gift-advisor/changes --> bin/shop_changes.php (every 10 min) --> MariaDB --> index
 stock webhook ------------> POST /stock_webhook.php --> index (one product)
 manual full rebuild ------> bin/sync_to_meili.php --> products_new --> swap
```

## Nightly feed sync (`src/sync.php`, 01:00)

- Feed URL: `FEED_URL`, default `https://web.rahvaraamat.ee/storage/feed-exports/web/products-feed.csv`. Staging uses `https://dev.rahvaraamat.ee/...`.
- Steps:
  1. Download.
  2. Upsert in-stock products (batches of 1000). The feed's `occasions` column goes to `products.shop_occasions`; `is_gift_book` goes to `products.is_gift_book` once the e-shop sends it.
  3. Delete products that left the feed. **Refused above 10%** (`SyncGuard`) unless `--allow-mass-delete` is given.
  4. Push changed products to Meilisearch (plus products whose sale started or ended).
  5. Ping `SYNC_HEARTBEAT_URL`.
- Lock `data/.sync.lock`; log `logs/sync.log`; feed info (Last-Modified) in `data/products-feed.json`.

## Same-day changes (`bin/shop_changes.php`, every 10 min at :02, :12 and so on)

- Calls `GET ESHOP_CHANGES_URL?cursor=N&limit=500` with `X-API-Key: ESHOP_CHANGES_API_KEY`. Off and silent while these are unset.
- Writes the new price, sale price and stock to `products` and re-indexes them. `in_feed: false` or `out of stock` removes the product until the feed brings it back. A product the database does not have yet waits for the nightly feed.
- The cursor is stored in `data/shop-changes.json`. After the nightly sync it rewinds to the last cursor before the feed. An expired cursor restarts from the oldest change.
- It skips a run while the sync holds the lock.

## AI gift profiles (enrichment)

- OpenAI `gpt-6.1-sol` (reasoning low, strict JSON schema). Fields: ages, recipients, occasions, interests, mood, character licence, why it is a good gift, gift score and 5 to 8 Estonian search keywords, each with a confidence.
- Stored per field and per source in `product_attributes` (`manual` > `feed` > `ai`). AI values below 50% confidence are not used until checked.
- About $0.003 per product; nightly cap 500 products (about $1.65). Only products added since 2026-10-16 are profiled automatically (deliberate).
- Vectors: `text-embedding-3-large`, 1536 dimensions. Recalculated only when the profile text changes (hash).

## Cron (`docker/crontab`, Europe/Tallinn)

```text
*/10 * * * *              heartbeat -> data/cron-alive
0 1 * * *                 src/sync.php                      (feed sync)
2,12,22,32,42,52 * * * *  bin/shop_changes.php              (same-day changes)
0 2 * * *                 src/cleanup.php                   (retention)
30 2 * * *                bin/enrich_pilot.php --all --since=2026-10-16 --limit=500
0 3 * * *                 bin/backup-db.sh                  (backup)
0 4 * * *                 bin/profile_embeddings.php        (vectors, RR-263)
```

- Avoid deploying between 01:00 and 03:30 (a deploy recreates php and cron).
- The cron container installs the crontab into `/etc/cron.d` as root when it starts (`docker/cron-start.sh`). After editing it, restart the container; its log starts with `[cron] 7 jobs from docker/crontab`.
- Job output goes to `docker logs kingisoovitaja_cron`.

## Retention (`src/cleanup.php`)

- rate-limit rows: 2 hours
- chat history: 90 days (`RC2_HISTORY_RETENTION_DAYS`; `0` keeps forever)
- turn log and feedback: 400 days

## Stock webhook

`POST /stock_webhook.php` re-indexes or removes one product. Auth: `X-Stock-Sync-Token: STOCK_SYNC_TOKEN` or a Bearer token. Body: `{"product_id": 123, "mode": "sync" | "delete"}`. While `STOCK_SYNC_TOKEN` is empty the webhook returns 503.

## Index rebuild

`bin/sync_to_meili.php` rebuilds the whole index from MariaDB with an index swap (under a minute per README). Needs the master key, so it runs in the cron container.
