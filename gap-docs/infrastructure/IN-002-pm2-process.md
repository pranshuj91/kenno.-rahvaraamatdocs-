---
id: IN-002-pm2-process
title: IN-002 — PM2 Process Management
sidebar_label: IN-002 PM2 Processes
---

# IN-002 — PM2 Process Management

| Field | Value |
|---|---|
| Priority | Infrastructure |
| Category | Infrastructure |
| Gap item | PM2 Process Management |
| Description | Node.js process management — PM2 configuration, ecosystem file |
| Documentation status | Documented |
| Code location | — |
| Assigned to | — |

## Source files used

- `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT.md`
- `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT.md`

# IN-002 — PM2 Process Management

Confirmed production findings for processes managed by **PM2**.

## PM2 managed processes

| Process | Status |
|---|---|
| `elasticsearch-7.16.2` | Active |
| `kafka-event-consumer` | Active |
| `queue-listener` | Active |

## PM2 configuration files

The following PM2 config files are in use:

- `elasticsearch-7.16.2.pm2.config.js`
- `kafka-event-consumer.pm2.config.js`
- `queue-listener.pm2.config.js`

## Observations

PM2 currently manages:

- **Elasticsearch** service (`7.16.2`)
- **Kafka Event Consumer**
- **Queue Listener**

## Summary

Three long-running production services run under PM2 and are reported as **Active**: Elasticsearch, the Kafka event consumer, and the queue listener. Each has a dedicated `.pm2.config.js` file.


---

### From `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md`

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


