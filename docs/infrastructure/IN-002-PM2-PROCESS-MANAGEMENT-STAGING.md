---
id: IN-002-PM2-PROCESS-MANAGEMENT-STAGING
title: IN-002 — PM2 Process Management (Staging)
sidebar_label: IN-002 PM2 (Staging)
---

# IN-002 — PM2 Process Management (Staging)

Confirmed staging findings for processes managed by **PM2** on `dev.rahvaraamat.ee`.

Source: Zone.ee portal screenshots, 31 July 2026.

## PM2 managed processes

| Process | Status | Memory (observed) | Config file |
|---|---|---|---|
| `rahvaraamat-web` | Active | ~200 MiB | `rahvaraamat-main-web.pm2.config.js` |
| `queue-listener` | Active | ~200 MiB | `queue-listener.pm2.config.js` |
| `elasticsearch-7.16.2` | Active | ~200 MiB | `elasticsearch.pm2.config.js` |
| `rahvaraamat-outlet-web` | Inactive | ~201 MiB | `rahvaraamat-outlet-web.pm2.config.js` |
| `elastic-search-audio` | Inactive | ~200 MiB | `elastic-search-audio.pm2.config.js` |

## Observations

PM2 currently manages:

- Main web frontend (`rahvaraamat-web`)
- Queue listener
- Elasticsearch
- Outlet web application (inactive)
- Audio Elasticsearch instance (inactive)

Inactive applications appear to be retained for optional or environment-specific use. Related staging **port forwards** for outlet/main web are documented in [IN-005 Staging Server Architecture](./IN-005-STAGING-SERVER-ARCHITECTURE.md).

## Related pages

- [IN-005 Staging Server Architecture](./IN-005-STAGING-SERVER-ARCHITECTURE.md)
- Gap mirror: [IN-002 PM2 Process](/gaps/infrastructure/IN-002-pm2-process)

## Summary

Staging PM2 runs **three Active** processes (`rahvaraamat-web`, `queue-listener`, `elasticsearch-7.16.2`) and keeps **two Inactive** apps (`rahvaraamat-outlet-web`, `elastic-search-audio`) with dedicated config files.
