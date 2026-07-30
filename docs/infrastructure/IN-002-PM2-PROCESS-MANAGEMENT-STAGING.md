---
id: IN-002-PM2-PROCESS-MANAGEMENT-STAGING
title: IN-002 — PM2 Process Management (Staging)
sidebar_label: IN-002 PM2 (Staging)
---

# IN-002 — PM2 Process Management (Staging)

Confirmed staging findings for processes managed by **PM2**.

## PM2 managed processes

| Process | Status |
|---|---|
| `rahvaraamat-web` | Active |
| `queue-listener` | Active |
| `elasticsearch-7.16.2` | Active |
| `rahvaraamat-outlet-web` | Inactive |
| `elastic-search-audio` | Inactive |

## PM2 configuration files

- `rahvaraamat-main-web.pm2.config.js`
- `queue-listener.pm2.config.js`
- `elasticsearch.pm2.config.js`
- `rahvaraamat-outlet-web.pm2.config.js`
- `elasticsearch-audio.pm2.config.js`

## Observations

PM2 currently manages:

- Main web frontend
- Queue listener
- Elasticsearch
- Outlet web application
- Audio Elasticsearch instance

Inactive applications appear to be retained for optional or environment-specific use.

## Summary

Staging PM2 runs **three Active** processes (`rahvaraamat-web`, `queue-listener`, `elasticsearch-7.16.2`) and keeps **two Inactive** apps (`rahvaraamat-outlet-web`, `elastic-search-audio`) with dedicated config files.
