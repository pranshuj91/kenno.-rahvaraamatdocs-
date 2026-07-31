---
id: IN-003-kafka-ssl
title: IN-003 — Kafka SSL Configuration
sidebar_label: IN-003 Kafka SSL
---

# IN-003 — Kafka SSL Configuration

| Field | Value |
|---|---|
| Priority | Infrastructure |
| Category | Infrastructure |
| Gap item | Kafka SSL Configuration |
| Description | SSL CA, certificate, and key for Kafka |
| Documentation status | Documented |
| Code location | common/config/main.php (apacheKafka); paths in main-local.php |
| Assigned to | — |
| Notes | No dedicated Kafka SSL page exists; content below is copied only from matching sections already in docs/ |

## Related Developer Docs

- `docs/integrations/KAFKA_EVENTS.md` (Configuration section)
- `docs/reference/08-CONFIGURATION.md` (apacheKafka component)

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.

---

### Developer Docs — `docs/integrations/KAFKA_EVENTS.md` — Configuration

The system uses Apache Kafka (hosted on Aiven Cloud) with SSL encryption for publishing and consuming events related to audiobook/ebook usage.

**File:** `common/config/main.php` (lines 228-253)

```
Component:  common\kafka\ConnectionProvider
Broker:     rahva-raamat-audio-singleton-a873.aivencloud.com:22620
Protocol:   SSL
SSL:        CA cert, client certificate, client key (paths configured in main-local.php)
```

Uses the **PHP-RdKafka** extension (librdkafka wrapper).

Connection Provider notes SSL configuration for secure communication.

---

### Developer Docs — `docs/reference/08-CONFIGURATION.md` — apacheKafka component

```
'apacheKafka' => [
    'class' => 'common\kafka\ConnectionProvider',
    'producerConfig' => [
        'metadata.broker.list' => 'rahva-raamat-audio-singleton-a873.aivencloud.com:22620',
        'security.protocol' => 'ssl',
        'ssl.ca.location' => '',
        'ssl.certificate.location' => '',
        'ssl.key.location' => ''
    ],
    'consumerConfig' => [
        'metadata.broker.list' => 'rahva-raamat-audio-singleton-a873.aivencloud.com:22620',
        'group.id' => 'myConsumerGroup',
        'auto.offset.reset' => 'earliest',
        'security.protocol' => 'ssl',
        'ssl.ca.location' => '',
        'ssl.certificate.location' => '',
        'ssl.key.location' => ''
    ]
],
```

Empty SSL path values in this sample are placeholders; docs say actual paths are configured in `main-local.php`.
