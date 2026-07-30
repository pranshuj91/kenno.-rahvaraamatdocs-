---
id: IB-002-kafka-events
title: IB-002 — Kafka Event Streaming
sidebar_label: IB-002 Kafka Events
---

# IB-002 — Kafka Event Streaming

| Field | Value |
|---|---|
| Priority | Important |
| Category | Business |
| Gap item | Kafka Event Streaming |
| Description | Real-time event processing — topics, consumers, producers, error handling |
| Documentation status | Documented |
| Code location | — |
| Assigned to | — |
| Notes | Kafka controller is deprecated |

## Source files used

- `docs/integrations/KAFKA_EVENTS.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/integrations/KAFKA_EVENTS.md`

# Kafka Event Streaming

This document describes the Kafka-based event streaming system used for real-time event processing, primarily for audio/ebook consumption tracking.

## Overview

The system uses Apache Kafka (hosted on Aiven Cloud) with SSL encryption for publishing and consuming events related to audiobook/ebook usage. Events are processed by dedicated event processors that update user progress and statistics.

## Configuration

**File:** `common/config/main.php` (lines 228-253)

```
Component:  common\kafka\ConnectionProvider
Broker:     rahva-raamat-audio-singleton-a873.aivencloud.com:22620
Protocol:   SSL
SSL:        CA cert, client certificate, client key (paths configured in main-local.php)
```

Uses the **PHP-RdKafka** extension (librdkafka wrapper).

## Architecture

```
Producer (API/App) → Kafka Topic → Consumer (Console daemon) → Event Processor → Database
```

## Key Components

### Connection Provider

**File:** `common/kafka/ConnectionProvider.php`

Manages producer and consumer connections:
- `getProducer()` — Returns configured RdKafka producer
- `getConsumer()` — Returns configured RdKafka consumer
- SSL configuration for secure communication

### Event Manager

**File:** `common/kafka/EventManager.php`

Central class for publishing and consuming events:

**Publishing:**
- `publishEvent(topic, message, callback)` — Publishes a message to a topic
- Uses `RD_KAFKA_PARTITION_UA` (unassigned partition)
- Flush retries: 10 max, 10-second timeout per flush
- Throws `RuntimeException` if flush fails (messages may be lost)

**Consuming:**
- `consumeEvents(topic, timeout, callback)` — Infinite loop consuming from a topic
- Consume timeout: 120 seconds per poll
- Handles: `NO_ERROR` (process + commit), `PARTITION_EOF` (ignore), `TIMED_OUT` (ignore)
- Throws exception on unknown errors
- Reconfigures logger for daemon mode (flush interval: 1 in debug, 100 in production)

**Offset Management:**
- `commitOffset(topic)` — Manually commits consumer offset

### Event Processor Provider

**File:** `common/kafka/EventProcessorProvider.php`

Factory that maps topic names to event processor classes.

## Event Types

**Directory:** `common/kafka/models/`

| Event Model | Description |
|-------------|-------------|
| `ProductListenedTimeEvent` | Audiobook listening time. Fields: product_id, time_listened, timestamp, device_id, access_token |
| `ProductReadBreakpointEvent` | Ebook reading progress breakpoint |
| `ProductChapterPlaybackEvent` | Audiobook chapter playback tracking |
| `WowzaKeyGenerationEvent` | Wowza streaming key generation |

All extend `BaseEventModel` or `BaseAuthedEventModel` (for events requiring authentication).

## Event Processors

**Directory:** `common/kafka/processors/`

| Processor | Handles |
|-----------|---------|
| `ProductListenedTimeEventProcessor` | Updates listening time records |
| `ProductReadBreakpointEventProcessor` | Updates reading progress |
| `ProductChapterPlaybackEventProcessor` | Updates chapter playback state |
| `WowzaKeyGenerationEventProcessor` | Processes streaming key events |

All extend `BaseEventProcessor` which provides:
- Offset tracking via `SystemState`
- Timestamp utilities (month date ranges)
- Timezone: `Europe/Tallinn`

## Console Commands

Kafka consumer was historically run via `console/controllers/KafkaController.php`, now marked as **deprecated** in console commands documentation.

## Topic Configuration

Topic names are configured in `console/config/params.php`.

## Error Handling

- Producer: Throws `RuntimeException` after 10 failed flush attempts
- Consumer: Throws exception on unknown Kafka errors; ignores partition EOF and timeout
- No dead-letter queue — failed events are lost if processing throws an exception


