---
id: testing
title: Testing & Quality Checks
sidebar_label: Testing
---

# Testing & Quality Checks

## Backend

```bash
bin/test                  # API contract + infrastructure checks, Gemini mocked
bin/test --group P0-4     # any PHPUnit arguments, e.g. a single audit item
bin/test --bench          # backend latency and DB queries per request
docker compose run --rm --no-deps -v "$PWD:/app" -w /app php composer stan   # PHPStan level 6
docker compose run --rm --no-deps -v "$PWD:/app" -w /app php composer cs:fix # PER-CS code style
```

- `bin/test` switches the local stack into test mode (`docker-compose.test.yml`), replaces Gemini with `tests/mock/gemini`, runs PHPUnit in the php image and restores the normal stack. `--keep` stays in test mode.
- Suites: `tests/Unit`, `tests/Integration`, `tests/Api`, `tests/Infra`. Infra checks the merged production compose (only Caddy public, only cron has the Meilisearch master key, DB internal, and so on).
- API tests use the local Meilisearch index, so load data first.
- Test data is written with the `phpunit-` prefix and removed afterwards.
- The mock reacts to markers in the message: `[mock:http-500]`, `[mock:invalid-json]`, `[mock:slow]`.
- Install with dev dependencies locally (`composer install`); use `composer install --no-dev` on servers.

## Quality runs with the real model

| Tool | Purpose |
|---|---|
| `php bin/chat_qa.php` | Hard rules; exit 1 on failure (`--no-fail` only reports); writes `data/chat-qa-<set>.csv` for the business |
| `php bin/compare_search.php`, `php bin/compare_choice.php`, `php bin/compare_models.php` | Search and choice comparison |
| `php bin/prompt_qa.php` | Gift profile prompt QA (real model, about $0.12) |

`chat_qa.php` fails when a shown product is out of stock, outside the allowed selection, a regular book, under the minimum price or over the budget, or when a reply names a product that is not shown.

Run the business set:

```bash
docker exec kingisoovitaja_php php /var/www/bin/chat_qa.php --suite=rc2-controller/business_suite.json
```

## Frontend

`npm run verify` (type-check, lint, vitest), Playwright e2e, Lighthouse. See [Website](./frontend).

## CI

See [CI/CD](./ci-cd).
