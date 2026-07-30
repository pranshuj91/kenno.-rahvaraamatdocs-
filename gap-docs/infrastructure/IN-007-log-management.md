---
id: IN-007-log-management
title: IN-007 — Log Management
sidebar_label: IN-007 Log Management
---

# IN-007 — Log Management

| Field | Value |
|---|---|
| Priority | Infrastructure |
| Category | Infrastructure |
| Gap item | Log Management |
| Description | Application logs, access logs, error logs — log rotation, storage |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Source files used

- `docs/monitoring/LOG_MANAGEMENT.md`
- `docs/monitoring/12-MONITORING_LOGGING.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/monitoring/LOG_MANAGEMENT.md`

# Log Management

This document describes how application logs are written, rotated, archived, and cleaned up.

## Overview

Rahva Raamat does **not** use Yii's default file logger. All application log messages (`error`, `warning`, `info`) are written to the database via a custom log target, with monthly table rollover and a dedicated archive command that flushes old data to flat files on disk.

## Log Target Configuration

**File:** `common/config/main.php` (component `log`)

```php
'log' => [
    'targets' => [
        [
            'class' => 'common\components\CustomLogDbTarget',
            'levels' => ['error', 'warning', 'info'],
            'except' => [
                'yii\db\*',
                'yii\filters\*',
                'yii\web\HttpException:404',
                'yii\web\Session::open',
                'yii\i18n\*',
                'yii\web\User*',
                'yii\debug\Module::checkAccess',
                'yii\httpclient\*',
            ],
        ],
    ],
],
```

The `except` list filters out high-volume noise (DB queries, framework session/auth chatter, 404s, i18n, HTTP client). Profile/debug levels are not captured at all.

## Custom DB Log Target

**File:** `common/components/CustomLogDbTarget.php`

Extends `yii\log\DbTarget`. Behavior:

1. For each log message, computes the **monthly table name** `rr_log_YYYY_MM` from the message timestamp.
2. If that table does not yet exist, creates it via `CREATE TABLE rr_log_YYYY_MM LIKE rr_log` and inserts a registry row in `rr_log_table_registry` (`table_name`, `year_month`, `created_at`).
3. Inserts the row with columns: `level`, `category`, `log_time`, `prefix`, `message`, `user_id`.
4. The `prefix` includes the requester IP (`[1.2.3.4]`).
5. The `level` is mapped from Yii's bitmask to a human string (`error`, `warning`, `info`, `debug`, `profile`, …).

This means each calendar month has its own physical table, automatically created on first write of that month. The base `rr_log` table is treated as a template.

> **Active transaction safety:** if a DB transaction is currently open on `db`, the target clones the connection before exporting, so log writes never get rolled back along with business transactions.

## Tables

| Table | Purpose |
|---|---|
| `rr_log` | Template / current-month catch-all (used by `LIKE` to create monthly tables) |
| `rr_log_YYYY_MM` | Per-month log rows (e.g. `rr_log_2026_04`) |
| `rr_log_table_registry` | Index of monthly tables — `table_name`, `year_month`, `created_at` |

The registry is consumed by the archive command to find tables that need flushing.

## Archive Command

**File:** `console/controllers/ArchiveController.php`

```bash
php yii archive/logs [--optimize=1]
```

Two-stage process.

### Stage 1 — main `rr_log` table

- Selects rows older than `MAX_LOG_AGE_INTERVAL` = **20 days** (`1_728_000` seconds).
- Streams them in batches of `LOG_FILE_ROW_COUNT` = **1000** rows.
- Writes batches to `console/runtime/archive/<from>-<to>/log.txt` (datetime format `Y.m.d_H.i.s`).
- Splits a file when it exceeds `LOG_MAX_FILE_SIZE` = **100 MB**.
- Deletes archived rows from `rr_log` inside a transaction per batch.
- After each batch, runs `OPTIMIZE TABLE rr_log` (skippable with `--optimize=0`).

### Stage 2 — monthly tables

- Iterates `IntegrationRunLog::find()` … wait — actually iterates `LogTableRegistry::find()->orderBy(['year_month' => SORT_ASC])`.
- For each registered monthly table:
  - If empty: drop the table and delete the registry row.
  - Otherwise: load all rows, dump them in 1000-row chunks to `console/runtime/archive/<from>-<to>/log.txt`, then `DROP TABLE` and delete the registry row.

So **all** monthly log tables are unconditionally archived to disk and dropped on each run — only the current calendar month's table will be re-created on the next write.

## Output Format

Archive files are UTF-8 with BOM. Each entry is rendered as:

```
2026-04-01 12:34:56
------------
id => 12345
level => error
category => api/foo
log_time => 2026-04-01 12:34:56
prefix => [1.2.3.4]
message => …full message text…
user_id => 42
------------
```

## Scheduling

The `archive/logs` command is wired into the system cron schedule — see [Cron Jobs](/docs/monitoring/CRON_JOBS) for the exact crontab line. It uses no `AlreadyRunningFilter`; rely on cron not to overlap.

## Operational Notes

- Disk pressure on `console/runtime/archive/` grows linearly with traffic. There is **no automatic cleanup** of the produced flat files — they need to be rotated/shipped off the box by an external process (logrotate, S3 sync, etc.).
- Archive files contain user IDs and request IPs; treat them as PII when shipping.
- `OPTIMIZE TABLE rr_log` rebuilds the table and reclaims space; on a busy production DB this can be slow — disable with `--optimize=0` if it conflicts with peak load.
- The custom log target writes one INSERT per message — high error storms can amplify DB load. The `except` list keeps normal traffic out.
- 404s are intentionally not logged. If you need to investigate missing pages, check the web server access log instead.
- Web/access logs and PHP error logs are handled at the Apache/Supervisor layer (outside the codebase) — see `docker/` for container-level configuration.

## Related Models

- `common/models/Log.php` — ActiveRecord on `rr_log` (used by Stage 1)
- `common/models/LogTableRegistry.php` — ActiveRecord on `rr_log_table_registry`


---

### From `docs/monitoring/12-MONITORING_LOGGING.md`

id: MONITORING_LOGGING
title: MONITORING LOGGING
# Monitoring & Logging

## Log File Locations and Rotation

### **Log File Locations**

#### **Application Logs**
```
runtime/logs/
├── app.log                    # Main application logs
├── api.log                    # API-specific logs
├── admin.log                  # Admin panel logs
├── console.log                # Console command logs
├── queue.log                  # Queue worker logs
└── error.log                  # Error logs
```

#### **System Logs**
```
/var/log/
├── nginx/
│   ├── access.log             # Nginx access logs
│   └── error.log              # Nginx error logs
├── php8.0-fpm.log            # PHP-FPM logs
├── mysql/
│   └── error.log              # MySQL error logs
├── redis/
│   └── redis-server.log       # Redis server logs
└── elasticsearch/
    └── elasticsearch.log      # Elasticsearch logs
```

### **Log Rotation Configuration**

#### **Application Log Rotation** (`/etc/logrotate.d/rahvaraamat`)
```bash
/var/www/rahvaraamat/runtime/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

#### **System Log Rotation**
```bash
# Nginx logs
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
}

# PHP-FPM logs
/var/log/php8.0-fpm.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}

# MySQL logs
/var/log/mysql/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 mysql mysql
}
```

### **Database Log Archiving**

#### **Log Archiving Command**
```bash
# Archive logs older than 20 days to files
php yii archive/logs

# Archive without table optimization
php yii archive/logs 0
```

#### **Archive Configuration** (`console/controllers/ArchiveController.php`)
```php
public const LOG_FILE_SUFFIX = 'log.txt';
public const LOG_FILE_NAME_DATETIME_FORMAT = 'Y.m.d_H.i.s';
public const LOG_MAX_FILE_SIZE = 104_857_600; // 100MB
public const LOG_FILE_ROW_COUNT = 1000;
public const MAX_LOG_AGE_INTERVAL = 1_728_000; // 20 days
```

#### **Archive File Structure**
```
console/runtime/archive/
├── 2024.01.15_10.30.00-2024.01.15_11.45.00/
│   └── log.txt
├── 2024.01.15_12.00.00-2024.01.15_13.15.00/
│   └── log.txt
└── 2024.01.16_09.00.00-2024.01.16_10.30.00/
    └── log.txt
```

## Error Reporting

### **Log Levels**

#### **Yii2 Log Levels**
```php
Logger::LEVEL_ERROR     // 1 - Error messages
Logger::LEVEL_WARNING   // 2 - Warning messages
Logger::LEVEL_INFO      // 4 - Information messages
Logger::LEVEL_TRACE     // 8 - Trace messages
Logger::LEVEL_PROFILE   // 64 - Profiling messages
```

#### **Application Log Configuration**
```php
'log' => [
    'traceLevel' => YII_DEBUG ? 3 : 0,
    'targets' => [
        [
            'class' => 'common\components\CustomLogDbTarget',
            'levels' => ['error', 'warning', 'info'],
            'except' => [
                'yii\db\*',
                'yii\filters\*',
                'yii\web\HttpException:404',
                'yii\web\Session::open',
                'yii\i18n\*',
                'yii\web\User*',
                'yii\debug\Module::checkAccess',
                'yii\httpclient\*'
            ],
        ],
    ],
],
```

### **Custom Database Log Target**

#### **CustomLogDbTarget** (`common/components/CustomLogDbTarget.php`)
```php
class CustomLogDbTarget extends DbTarget
{
    private array $levelMap = [
        1 => 'error',
        4 => 'info',
        64 => 'profile',
        80 => 'beginProfile',
        96 => 'endProfile',
        8 => 'debug',
        2 => 'warning'
    ];

    public function export()
    {
        // Stores log messages to database table
        // Handles transaction rollback scenarios
        // Maps log levels to string representations
    }
}
```

### **Log Database Schema**

#### **Log Table Structure** (`common/models/Log.php`)
```sql
CREATE TABLE `rr_log` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `log_time` datetime NOT NULL,
    `category` varchar(128) NOT NULL,
    `level` varchar(128) NOT NULL,
    `user_id` int(11) DEFAULT NULL,
    `message` text DEFAULT NULL,
    `prefix` text DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_log_time` (`log_time`),
    KEY `idx_category` (`category`),
    KEY `idx_level` (`level`)
);
```

### **Error Handling**

#### **Console Command Logging**
```php
// BaseController logging
public function log($message, $level = Logger::LEVEL_INFO)
{
    $logger = Yii::getLogger();
    $colors = [
        Logger::LEVEL_TRACE => '1;34',
        Logger::LEVEL_ERROR => '0;31',
        Logger::LEVEL_WARNING => '1;35',
    ];

    Console::stdout(sprintf("\033[%sm%s: %s\n", $colors[$level] ?? 0, date('H:i:s'), $message));

    if ($level !== Logger::LEVEL_TRACE) {
        $logger->log($message, $level, "application.console.{$this->id}");
    }

    if (in_array($level, [Logger::LEVEL_WARNING, Logger::LEVEL_ERROR])) {
        $logger->flush(true);
    }
}
```

#### **Synchronization Logging**
```php
// BaseSyncCommand logging
public function log($message, $level = Logger::LEVEL_INFO)
{
    if (($level !== Logger::LEVEL_TRACE || $this->trace) && php_sapi_name() == 'cli') {
        $colors = [
            Logger::LEVEL_TRACE => '1;34',
            Logger::LEVEL_ERROR => '0;31',
            Logger::LEVEL_WARNING => '1;35',
        ];
        $this->output(sprintf("\033[%sm%s: %s\n", $colors[$level] ?? 0, date('H:i:s'), $message));
    }

    if (in_array($level, [Logger::LEVEL_WARNING, Logger::LEVEL_ERROR])) {
        Yii::getLogger()->log($message, $level, $this->getApiNamespace());
        Yii::getLogger()->flush(true);
    }
}
```

## Monitoring Tools

### **Health Check Commands**

#### **HealthCheckController** (`console/controllers/HealthCheckController.php`)
```bash
# Kafka health check
php yii health-check/kafka

# Wowza media server health check
php yii health-check/wowza

# Subscription service health check
php yii health-check/subscription-service
```

#### **Health Check Implementation**
```php
class HealthCheckController extends BaseController
{
    public function actionKafka()
    {
        $eventManager = new EventManager();
        $eventManager->publishEvent(EventTopicEnum::HEALTH_CHECK, 'check', function ($result) {
            var_dump($result);
        });
    }

    public function actionWowza()
    {
        $httpClient = new HttpClient;
        $response = $httpClient->get(
            Yii::$app->audioStreamManager->constructTestUrl(),
            [
                'connect_timeout' => 10,
                'http_errors' => true
            ]
        );

        if ($response->getStatusCode() !== 200) {
            throw new RuntimeException($response->getReasonPhrase());
        }
    }

    public function actionSubscriptionService()
    {
        $brokenSubscriptions = Yii::$app->db->createCommand("
            SELECT ps.id FROM `rr_payment_subscription` ps
            LEFT JOIN `rr_client_account_subscription_service` cass 
                ON ps.client_account_id = cass.client_account_id
            WHERE ps.join_date IS NOT NULL AND cass.id IS NULL;
        ")->queryAll();

        if (count($brokenSubscriptions) > 0) {
            $brokenSubscriptions = json_encode($brokenSubscriptions, JSON_THROW_ON_ERROR);
            Yii::$app->mailer->compose()->setToDevelopers()
                ->setSubject('Missing subscription services')
                ->setTextBody("Subscription services are missed for $brokenSubscriptions subscriptions")->send();
        }
    }
}
```

### **System Monitoring Commands**

#### **Application Health Check**
```bash
#!/bin/bash
# /usr/local/bin/health-check.sh
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is not responding"
    exit 1
fi
```

#### **Database Health Check**
```bash
#!/bin/bash
if mysql -u rahvaraamat -p'secure_password' -e "SELECT 1" > /dev/null 2>&1; then
    echo "Database is healthy"
    exit 0
else
    echo "Database is not responding"
    exit 1
fi
```

### **Log Monitoring Commands**

#### **Application Log Monitoring**
```bash
# Monitor application errors
tail -f /var/www/rahvaraamat/runtime/logs/app.log

# Monitor API requests
tail -f /var/www/rahvaraamat/runtime/logs/api.log

# Monitor queue workers
tail -f /var/www/rahvaraamat/runtime/logs/queue.log

# Monitor console commands
tail -f /var/www/rahvaraamat/runtime/logs/console.log
```

#### **System Log Monitoring**
```bash
# Monitor nginx access logs
tail -f /var/log/nginx/access.log

# Monitor nginx error logs
tail -f /var/log/nginx/error.log

# Monitor PHP-FPM logs
tail -f /var/log/php8.0-fpm.log

# Monitor MySQL logs
tail -f /var/log/mysql/error.log

# Monitor Redis logs
tail -f /var/log/redis/redis-server.log

# Monitor Elasticsearch logs
tail -f /var/log/elasticsearch/elasticsearch.log
```

### **Performance Monitoring Commands**

#### **System Resource Monitoring**
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check MySQL connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Check Redis memory
redis-cli info memory

# Check Elasticsearch status
curl -X GET "localhost:9200/_cluster/health"
```

#### **Application Performance Monitoring**
```bash
# Check PHP-FPM status
sudo systemctl status php8.0-fpm

# Check queue worker processes
ps aux | grep "queue/worker"

# Check application memory usage
ps aux | grep php-fpm

# Monitor slow queries
sudo tail -f /var/log/mysql/slow.log

# Monitor PHP-FPM slow logs
sudo tail -f /var/log/php8.0-fpm-slow.log
```

### **Cron Job Monitoring**

#### **Health Check Cron Jobs**
```bash
# Daily health checks at 6 AM
0 6 * * * php yii health-check/kafka
0 6 * * * php yii health-check/wowza
0 6 * * * php yii health-check/subscription-service

# Log archiving weekly
0 2 * * 0 php yii archive/logs
```

#### **Monitoring Cron Jobs**
```bash
# Application health check every 5 minutes
*/5 * * * * /usr/local/bin/health-check.sh

# Database health check every 10 minutes
*/10 * * * * /usr/local/bin/db-health-check.sh

# Log rotation daily
0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/rahvaraamat
```

### **Email Notifications**

#### **Error Notification Configuration**
```php
// Subscription service error notification
if (count($brokenSubscriptions) > 0) {
    Yii::$app->mailer->compose()
        ->setToDevelopers()
        ->setSubject('Missing subscription services')
        ->setTextBody("Subscription services are missed for $brokenSubscriptions subscriptions")
        ->send();
}
```

#### **Developer Email Configuration**
```php
// Set to developers email group
->setToDevelopers()
```

### **Monitoring Metrics**

#### **Key Performance Indicators**
- **Response Time**: Average API response time
- **Error Rate**: Percentage of failed requests
- **Queue Length**: Number of pending background jobs
- **Database Connections**: Active database connections
- **Memory Usage**: Application memory consumption
- **Disk Usage**: Available disk space
- **CPU Usage**: Server CPU utilization

#### **Monitoring Thresholds**
```bash
# Memory usage threshold (80%)
free -h | grep Mem | awk '{if($3/$2 > 0.8) print "High memory usage"}'

# Disk usage threshold (90%)
df -h | awk '$5 > 90 {print "High disk usage: " $1 " " $5}'

# Database connection threshold (80%)
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';" | awk '$2 > 80 {print "High DB connections"}'
```


