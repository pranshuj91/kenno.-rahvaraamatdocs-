---
id: database
title: Database
sidebar_label: Database
---

# Database

MariaDB 10.11 (internal network only in production). Fresh installs use `src/schema.sql`, which runs automatically on an empty DB. Changes come as re-runnable migrations in `migrations/` (`bin/migrate.php`, state in `schema_migrations`; `--status` shows pending ones). Migrations must be safe to re-run.

## Migrations

| Migration | What it adds |
|---|---|
| 001 | Audience/occasion/mood moved out of JSON into indexed tables |
| 002 | `products.kingi_potentsiaal` (gift score) |
| 003 | `products.created_at` |
| 004 | `delivery_time`, `size` from the feed |
| 005 | `gift_assistant_history`, `gift_assistant_rate_limit` |
| 006 | Drops unused FULLTEXT indexes |
| 007 | `products.full_description` |
| 008 | `review_items`, `review_comments` |
| 009 | `available_in_stock`, `min_age`, `warning_text` |
| 010 | `products.brand`, `product_attributes` (per field and source), `review_verdicts` |
| 011 | `products.ai_model` |
| 012 | Run labels `model@day` |
| 013 | `profile_embedding` + hash |
| 014 | Index on `products.category` |
| 015 (GA) | `products.shop_occasions`, `products.is_gift_book` (RR-263); `gift_assistant_history.follow_up` (RR-265); `ai_usage_daily` (RR-268); `gift_assistant_turns`, `gift_assistant_feedback` (RR-270) |

## Tables named in the documentation

| Table | Purpose |
|---|---|
| `products` | Catalogue copy from the feed (price, sale price, stock, `shop_occasions`, `is_gift_book`, `brand`, `ai_model`, and so on) |
| `product_attributes` | Gift profile values per field and per source (`manual` > `feed` > `ai`) with confidence |
| `gift_assistant_history` | Conversation messages and replies (deleted after 90 days by default); has `follow_up` |
| `gift_assistant_rate_limit` | Rate limit counters (rows older than 2 hours are deleted) |
| `gift_assistant_turns` | Anonymised per-turn log (no message text, conversation ID hashed); kept 400 days |
| `gift_assistant_feedback` | Thumbs up/down; kept 400 days |
| `ai_usage_daily` | AI tokens and cost per day (monthly cap) |
| `review_items`, `review_comments`, `review_verdicts` | Manager review page |
| `schema_migrations` | Applied migrations |

:::note
The sources do not list every column or the relationships (keys) between these tables. For the exact schema read `src/schema.sql` and `migrations/`.
:::

## Meilisearch index

- Index `products`, hybrid (keyword + vector). Rebuilt from MariaDB by `bin/sync_to_meili.php` into `products_new` and swapped in.
- Not backed up (rebuild instead).
- Its tag is pinned exactly in `docker-compose.yml` because the index on disk is tied to the engine version ([Deployment](./deployment) has the upgrade steps).
- The php container uses a scoped key (`MEILI_API_KEY`, created with `bin/prod_compose.sh meili-key`); only cron holds the master key in production.
- Index field `shop_occasion_codes` (curated codes) is kept separate from the AI's `occasion_codes`.

## E-shop tables (Yii2 side)

See [E-shop Features](./eshop-features) for the `rr_` tables used by Kingisoovitaja.
