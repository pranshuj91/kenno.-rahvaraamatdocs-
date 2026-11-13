---
id: knowledge-transfer
title: Knowledge Transfer & Open Items
sidebar_label: Knowledge Transfer
---

# Knowledge Transfer & Open Items

This page lists what is still open or **not documented anywhere in the sources**. Nothing here is guessed: each "to collect" line is a question for the existing dev/DevOps team.

## Open items (from the project documentation)

### Backend / Gift Advisor repo

| Item | Owner / note |
|---|---|
| GitHub deploy secrets (`DEPLOY_*`) | Needed for automatic deploys |
| Sentry DSN (backend; decide for the frontend) | Create the EU project, set `SENTRY_DSN` |
| Off-site backups | Set up the rclone crypt remote and `BACKUP_RCLONE_REMOTE` |
| AI prices in `src/config.php` `ai_prices` | Only `text-embedding-3-large` is priced; Gemini and `gpt-6.1-sol` count as $0 so the cap undercounts. Fill in prices |
| `AI_MONTHLY_BUDGET_USD` | Monthly budget to agree with Dagmar |
| Uptime monitor | Choose a tool, add the URLs from [Maintenance](./maintenance) and `SYNC_HEARTBEAT_URL` |
| `is_gift_book` in the e-shop feed | Then the gift-book rule starts working (reindex after) |
| 3 to 6 products with reasons | Dagmar to confirm, then `search.choice_count = [3, 6]` |
| Business query set | Dagmar writes it, product managers review (RR-269) |
| RR-264 embedding comparison | Not started |
| Production switch | `web.rahvaraamat.ee` + production keys, production secrets different from staging, `FRONTEND_MOCK_FALLBACK=false`, then `FRONTEND_AUTH=off` |
| Account handover | Server, Cloudflare, DNS, Tailscale from Kenno |
| Recipient themes (`sobrale`, `kolleegile`, `endale`) | Show best sellers until recipients are filterable |
| README pre-launch checklist | Was lost locally; can be re-added on a new branch |
| Small fixes | `docker-compose.yml` comment says PHP-FPM 8.2 (images are 8.5); `frontend/src/lib/api/adapters/live.ts` has unused `/stores`, `/parcel-machines`, `/checkout` paths on the backend URL |
| Dependabot | 4 major bumps (Tailwind 4, TypeScript 7, Vitest 5, @types/node 26) need separate work |

### E-shop repo

| Item | Notes |
|---|---|
| Merge to master + production release | All RR tickets are on staging only |
| `is_gift_book` feed column | Export the reviewed flag (needs the gift-book rule agreed and reviewed profiles) |
| Rename menu label | "Gift recommendation events" to "Gift recommendation occasions" (translation only) |
| Production cron | `track-changes` lines must be added on the production server |
| Production API key | Create/send privately; consider an IP limit |
| Promo preview / product details endpoints | Ideas only (`POST /gift-advisor/quote`, `GET /gift-advisor/products/{id}`), not built |
| NAV age/sex data (BE-3) | After launch |

## Not documented: information to collect from the teams

These areas of the requested documentation scope have **no information in the sources** and need input:

| Area | What to ask |
|---|---|
| Git branching strategy for `kingisoovitaja-be-fe` | Branch naming, PR review rules, protected branches, who may merge and deploy to production |
| Server details | Provider plan and sizing, OS, SSH users and access list, firewall rules, where `.env` is stored and who can edit it |
| Staging server | When and where the separate staging server will be created |
| Production server | Exact hostnames and the production `.env` ownership (values must never be written in docs) |
| Domain and DNS | Registrar, who owns the DNS and Cloudflare accounts, current record list |
| Monitoring tool | Which uptime tool is chosen, who receives alerts, on-call arrangement |
| Backups | Whether off-site backups are running, where, who holds the crypt password, last tested restore |
| Email / SMS | Whether any notification is needed from Kingisoovitaja itself (currently none; e-shop sends order mails) |
| Payment | Payment is handled in the e-shop via EveryPay; no Kingisoovitaja-side payment configuration exists. Confirm nothing else is planned |
| Frontend error tracking and analytics | No Sentry and no analytics provider yet (`NEXT_PUBLIC_ANALYTICS_DOMAIN` empty; provider not chosen) |
| Database | Full column-level schema and relationships are not summarised in the docs; read `src/schema.sql` and `migrations/` |
| Undocumented processes | How the e-shop feed job and its server crontab are managed; how occasion lists are curated in practice by product managers |
| Known limits | Rate limits of the frontend are in-memory per instance (move to a shared store before launch); no streaming from the backend; Estonian only |

## Technical limitations to keep in mind

- Chat turn budget 25 s; no backend streaming.
- Checkout is not idempotent and never retried.
- Only Estonian is supported at launch.
- Gift profiles are only auto-generated for products added since 2026-10-16 (max 500 per night).
- Deploys recreate php and cron: avoid 01:00 to 03:30.
- Production currently points to e-shop staging until the switch is done.
