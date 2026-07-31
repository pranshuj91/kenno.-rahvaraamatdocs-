---
id: IN-002-PM2-PROCESS-MANAGEMENT
title: IN-002 — PM2 Process Management
sidebar_label: IN-002 PM2 Processes
---

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

- [IN-005 Production Server Architecture](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md)
- Gap mirror: [IN-002 PM2 Process](/gaps/infrastructure/IN-002-pm2-process)

## Summary

Three long-running production services run under PM2 and are reported as **Active**: Elasticsearch, the Kafka event consumer, and the queue listener. Each has a dedicated `.pm2.config.js` file.
