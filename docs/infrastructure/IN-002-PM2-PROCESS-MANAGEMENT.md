---
id: IN-002-PM2-PROCESS-MANAGEMENT
title: IN-002 — PM2 Process Management
sidebar_label: IN-002 PM2 Processes
---

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
