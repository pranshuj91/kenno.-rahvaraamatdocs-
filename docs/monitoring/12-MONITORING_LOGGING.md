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
