---
id: DEPLOYMENT_GUIDE
title: Deployment Guide
sidebar_label: Deployment Guide
---
# Deployment guide — environments and release process

This guide standardizes how we deploy changes across environments. It covers branch conventions, staging verification, production rollout, post‑deploy checks, and rollback.

## Scope and audience
- For developers and operators deploying the Yii2 application (admin, api, console).
- Complements the project structure and console command references.

## Environments and branches
- Local: work on feature branches from master.
- Staging: branch staging (testing environment).
- Production: release-YYYYMMDD (e.g., release-20250130).

## Branch and release naming
- Feature branch: NRR-\{task number\} (e.g., NRR-1234) created from master.
- Release branch: release-YYYYMMDD created from master when preparing a production deployment.

## Prerequisites
- Ensure composer dependencies are installed and the app builds in CI.
- Database migrations are idempotent and tested on staging.

## Staging workflow
1. Create a feature branch from master: NRR-XXXX.
2. Open a PR to staging when ready for integration testing; merge after review.
3. On the staging server:
   - Pull latest staging.
   - Run database migrations.
   - Optionally clear caches if behavior or config changed.
   - Verify key flows (login, admin access, critical console jobs) and that no concurrency guard is blocking expected runs.

Command snippets
```bash
# Run DB migrations
php yii migrate

# Clear/flush caches (if needed)
php yii cleanup/clean-cache --key=all
php yii cleanup/flush-cache
```

If staging is tested, open a PR from staging to master (or directly from feature to master, depending on repository policy) and obtain approvals.

## Production deployment steps
1. Create a release branch from master: release-YYYYMMDD.
2. Connect to the production environment and switch to the release branch.
3. Switch to the new release branch and install prod dependencies if applicable.
4. Run database migrations.
5. Clear/flush caches when needed (config/DI/feature‑flag changes, view/layout changes, or after large imports).
6. Verify health and critical flows.

Command snippets
```bash
# Pull code and ensure vendor up to date (depends on deploy tooling)
composer install --no-dev -o

# Apply DB migrations
php yii migrate

# Clear caches (only if necessary)
php yii cleanup/clean-cache --key=all
php yii cleanup/flush-cache

# Optional: check console controllers list if diagnosing
php yii
```

Post‑deploy checks (suggested)
- Admin login, dashboard loads.
- A read‑only API endpoint responds with 200.
- Background jobs that normally run (e.g., sync/*) are not stuck by AlreadyRunningFilter; last‑run timestamps look recent.

## Rollback (production)
If a rollback is required:
1. Evaluate whether migrations introduced irreversible changes. If safe to revert, run down migrations for the release.
2. Switch the environment back to the previous release branch.
3. Re‑run migrations if needed to match the previous schema state.
4. Clear relevant caches if behavior changed.

Command snippets
```bash
# Roll back last batch (confirm number of steps first)
php yii migrate/down

# Switch branch to previous release and bring up
# (use your deploy tooling or git checkout <prev-release>)
```

Notes
- Only run migrate/down if migrations support safe down and data safety is confirmed.
- Some data migrations may be irreversible; in such cases, consult the team before attempting down.

## Troubleshooting tips
- Use php yii help `<controller-id>` to inspect available commands and their options.
- See ../reference/CONSOLE_COMMANDS_SUMMARY.md for a curated list of controllers and dynamic sync actions.
- Logs and archives: see console/controllers/ArchiveController::actionLogs and rr_log usage.
- Cache anomalies after config or DI changes usually resolve with cleanup/flush-cache.

## Related documentation
- ../core/STRUCTURE.md — repository structure and flows.
- ../reference/CONSOLE_COMMANDS_SUMMARY.md — console controllers and dynamic sync actions.
- README.md — local setup and migration commands.


