---
id: CP-006-backups
title: CP-006 — Backups
sidebar_label: CP-006 Backups
---

# CP-006 — Backups

| Field | Value |
|---|---|
| Priority | Critical |
| Category | Production |
| Gap item | Backups |
| Description | Database backup strategy and restoration — backup schedule, retention, restore procedures |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/deployment/BACKUPS.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/deployment/BACKUPS.md`

# Backups

This document describes how Rahva Raamat data is backed up, what is and isn't covered, and the developer tooling that exists for moving data around between environments.

## Production Backups (Zone.ee)

Production backups are **managed by the hosting provider, Zone.ee**. They are not driven from this repository — there are no in-repo backup scripts, cron jobs, or CI workflows that snapshot the database or filesystem.

Zone.ee runs **two independent backup jobs** every day: a filesystem snapshot in the evening and a logical database dump after midnight.

### File Backups

| Setting | Value |
|---|---|
| Provider | Zone.ee hosting |
| Type | File backups (whole-server filesystem) |
| Schedule | Daily, ~22:00 UTC |
| Retention | **14 days** |
| Current size | ~566 GiB |
| Last verified | 2026-04-10 22:04 UTC |

File-level backups capture the **entire production filesystem**: application code, uploaded media, local files, and the on-disk MariaDB data directory as well. Use these when you need to recover non-DB assets or do a whole-server rollback.

### Database Backups

| Setting | Value |
|---|---|
| Provider | Zone.ee hosting |
| Type | Database backup (separate, logical) |
| Schedule | Daily, ~01:10 UTC |
| Retention | **14 days** |
| Current size | ~240 GiB |
| Last verified | 2026-04-11 01:17 UTC |

The DB backup is a separate, dedicated job that runs ~3 hours after the file backup. Because it runs while the DB is online, it is the **preferred source for restoring the database** — it is engine-consistent and avoids the crash-consistency risks of pulling InnoDB files out of a filesystem snapshot.

### What This Implies

- **Two independent recovery surfaces:** use the file backup for code/media/filesystem state, and the database backup for DB-only restores.
- **The DB backup is engine-consistent.** It does not require `innodb_force_recovery` or any of the workarounds a raw filesystem restore would.
- **Point-in-time recovery between daily snapshots is not available** unless MariaDB binlogs are also being archived. This is not configured in the repo and needs to be verified with Zone.ee.
- **Recovery RPO is up to 24 hours** worst case for the DB (one logical dump per day) and up to 24 hours for files.
- **Maximum recoverable age is 14 days** for both jobs. Anything destructive that goes unnoticed for more than 14 days is unrecoverable from backup.
- **Slight skew between the two jobs:** the file backup at 22:00 UTC and the DB dump at 01:10 UTC are ~3 hours apart. If you restore both from "the same day," the filesystem state will be ~3 h older than the DB state. For most restores this is fine; for tightly coupled artifacts (e.g. an uploaded file referenced by a freshly written DB row) prefer to restore the DB to match the file backup's window.

## Restore Procedure

Restores are initiated through Zone.ee — there is no self-service tooling in the repo. The right procedure depends on what you're recovering.

### Database-only restore (preferred for DB-only mistakes)

1. Open a restore request with Zone.ee support, asking for the **Database Backup** snapshot of the desired date.
2. Zone.ee provides the logical dump (or restores it into a staging schema).
3. Re-import selectively or wholesale into the production DB (`php yii db/import` for ad-hoc imports, or a direct `mysql` pipe for the full dump).
4. Run the "Post-Restore Checklist" below.

### Filesystem / whole-server restore

1. Open a restore request with Zone.ee support, asking for the **File Backup** snapshot of the desired date and the target paths.
2. Zone.ee restores the requested files into a staging path on the server.
3. If a database rollback is also part of this restore, prefer the **Database Backup** snapshot for the matching day rather than the InnoDB files inside the filesystem snapshot — the DB dump is engine-consistent.
4. Run the "Post-Restore Checklist" below.

> Document the actual Zone.ee request workflow (ticket template, support contact, expected SLA) separately — that information lives outside this codebase.

## What Is NOT Backed Up Here

The following data lives outside the production server's filesystem and is therefore **not** in the Zone.ee snapshot:

| System | Storage | Backup status |
|---|---|---|
| Product images, EPUB files | **AWS S3** (`uus-rahvaraamat-*` buckets, see `common/config/main.php` `fileStorage` component) | Whatever S3 versioning / cross-region replication is configured at the bucket level — not in repo |
| Search index | **Elasticsearch 7.16** | No snapshot configured here; can be fully rebuilt from the DB via `php yii elastic/import` |
| Cache | **Redis** | Not backed up; safe to lose (rebuilds on demand) |
| Bloom filter / redirect store | **Redis** | Rebuildable via `RegenerateRedirectsBloomFilterJob` (see `REDIRECTS.md`) |
| Kafka topic backlog | **Aiven Cloud Kafka** | Provider-managed; see Aiven console |
| Email outbound queue | DB (`rr_queue`) | Covered as part of the DB filesystem backup |

For S3 in particular: confirm bucket-level versioning and lifecycle rules are set up in the AWS console — they cannot be inferred from this repo.

## Post-Restore Checklist

After restoring the production DB from a Zone.ee snapshot:

1. **Verify schema head** — `php yii migrate/history` should show the migrations that were applied at snapshot time. Run `php yii migrate --interactive=0` if any newer migrations have been deployed since.
2. **Flush caches** — `php yii cache/flush-all`.
3. **Rebuild Elasticsearch** — `php yii elastic/import`. The DB is the source of truth.
4. **Regenerate the redirect bloom filter** — push a `RegenerateRedirectsBloomFilterJob` (see `REDIRECTS.md`).
5. **Inspect the queue table (`rr_queue`)** — restored jobs may re-run. Truncate or selectively delete if you don't want post-snapshot side effects to replay (notification emails, NAV pushes, payment retries).
6. **Reconcile NAV / external integrations** — re-trigger reconciliation per integration via the admin panel or by re-enabling the integration toggle (this fires `IntegrationReconciliationJob` — see `INTEGRATION_RECONCILIATION.md`).
7. **Sanity-check the orders pipeline** — confirm no double-charges by spot-checking the most recent payment transactions against EveryPay.

## In-Repo DB Tooling (Developer Use Only)

The repository ships with `console/controllers/DbController.php` which exposes two manual helpers. **These are not a backup mechanism** — they are developer conveniences for moving dumps between environments.

| Command | What it does |
|---|---|
| `php yii db/export [path]` | Interactive: prompts for a filename, then runs `mysqldump --skip-add-locks` against the configured DB to `<path>/dump-YYYY-MM-DD-HH-MM-SS.sql`. Default path: `@console/migrations/data`. |
| `php yii db/import [path]` | Interactive: prompts to pick a `.sql` file from the directory and pipes it into `mysql`. Default path: `@console/migrations/data`. |

Both shell out to `mysql` / `mysqldump` using credentials from the Yii `db` component. They are interactive (prompt for confirmation), single-pass, and have no scheduling, retention, encryption, or off-host upload — running them does not satisfy any production backup requirement.

> The Docker dev environment also seeds MariaDB from `docker/mysql/dumps/dump.sql` via the `docker-entrypoint-initdb.d` mechanism. That dump is a static developer fixture, not a refresh of production data.

## Open Items (Owned by DevOps / Hosting)

The following are not derivable from the codebase and need to be filled in by whoever owns Zone.ee + AWS:

- [ ] Are MariaDB binlogs being shipped anywhere for point-in-time recovery between the daily DB dumps?
- [ ] What format does the Zone.ee Database Backup use (logical dump? physical? per-table?), and how is it delivered on restore?
- [ ] Are S3 buckets versioned, and is cross-region replication enabled?
- [ ] Is there a documented Zone.ee restore SLA / ticket template for both the File and Database backup jobs?
- [ ] Has a restore drill been performed for either job? When? Notes?
- [ ] Is the 14-day retention sufficient for compliance / accounting requirements?
- [ ] Where are the Kafka topic backups (Aiven console) — confirm provider-side retention?


