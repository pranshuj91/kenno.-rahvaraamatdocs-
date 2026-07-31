---
id: IN-002-pm2-process
title: IN-002 — PM2 Process Management
sidebar_label: IN-002 PM2 Process
---

# IN-002 — PM2 Process Management

| Field | Value |
|---|---|
| Priority | Infrastructure |
| Category | Infrastructure |
| Gap item | PM2 Process Management |
| Description | Node process manager configuration, restart policies, logging |
| Documentation status | Documented |
| Code location | Outside codebase / server |
| Assigned to | — |

## Source files used

- `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT.md`
- `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT.md`


# IN-002 — PM2 Process Management

Confirmed production findings for processes managed by **PM2** on `web.rahvaraamat.ee`.

Source: Zone.ee portal screenshots, 31 July 2026.

## PM2 managed processes

| Process | Status | Memory (observed) |
|---|---|---|
| `elasticsearch-7.16.2` | Active | ~204 MiB |
| `kafka-event-consumer` | Active | ~1200 MiB |
| `queue-listener` | Active | ~1024 MiB |

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

Zone notes applications should listen on `localhost (127.0.0.1)` with port forwarding or `mod_proxy`.

## Related pages

- [IN-005 Production Server Architecture](/docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE)
- Gap mirror: [IN-002 PM2 Process](/gaps/infrastructure/IN-002-pm2-process)

## Summary

Three long-running production services run under PM2 and are reported as **Active**: Elasticsearch, the Kafka event consumer, and the queue listener. Each has a dedicated `.pm2.config.js` file.


---

### From `docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md`


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

Inactive applications appear to be retained for optional or environment-specific use. Related staging **port forwards** for outlet/main web are documented in [IN-005 Staging Server Architecture](/docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE).

## Related pages

- [IN-005 Staging Server Architecture](/docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE)
- Gap mirror: [IN-002 PM2 Process](/gaps/infrastructure/IN-002-pm2-process)

## Summary

Staging PM2 runs **three Active** processes (`rahvaraamat-web`, `queue-listener`, `elasticsearch-7.16.2`) and keeps **two Inactive** apps (`rahvaraamat-outlet-web`, `elastic-search-audio`) with dedicated config files.

