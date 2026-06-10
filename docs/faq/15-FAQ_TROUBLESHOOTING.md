id: FAQ_TROUBLESHOOTING
title: FAQ TROUBLESHOOTING
# FAQ & Troubleshooting

## Common Issues and Solutions

### **Application Issues**

#### **1. Application Not Responding (502/500 Errors)**

**Symptoms**: 502 Bad Gateway or 500 Internal Server Error

**Solutions**:
```bash
# Check PHP-FPM status
sudo systemctl status php8.0-fpm

# Restart PHP-FPM
sudo systemctl restart php8.0-fpm

# Check PHP-FPM logs
sudo tail -f /var/log/php8.0-fpm.log

# Check application logs
tail -f /var/www/rahvaraamat/runtime/logs/app.log
```

#### **2. Database Connection Issues**

**Symptoms**: Database connection errors in logs

**Solutions**:
```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Test database connection
mysql -u rahvaraamat -p -e "SELECT 1"
```

#### **3. Redis Connection Issues**

**Symptoms**: Cache-related errors

**Solutions**:
```bash
# Check Redis status
sudo systemctl status redis

# Restart Redis
sudo systemctl restart redis

# Test Redis connection
redis-cli ping

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

#### **4. Elasticsearch Issues**

**Symptoms**: Search not working

**Solutions**:
```bash
# Check Elasticsearch status
sudo systemctl status elasticsearch

# Restart Elasticsearch
sudo systemctl restart elasticsearch

# Check cluster health
curl -X GET "localhost:9200/_cluster/health"

# Check Elasticsearch logs
sudo tail -f /var/log/elasticsearch/elasticsearch.log
```

#### **5. Queue Worker Issues**

**Symptoms**: Background jobs not processing

**Solutions**:
```bash
# Check queue worker status
ps aux | grep "queue/worker"

# Restart queue workers
cd /var/www/rahvaraamat
php yii queue/worker --verbose=1 --color=0 &

# Check queue logs
tail -f /var/www/rahvaraamat/runtime/logs/queue.log
```

### **Performance Issues**

#### **1. Slow Response Times**

**Diagnosis**:
```bash
# Check nginx access logs for slow requests
tail -f /var/log/nginx/access.log | grep -E "GET|POST"

# Check PHP-FPM slow logs
tail -f /var/log/php8.0-fpm-slow.log

# Check database slow queries
sudo tail -f /var/log/mysql/slow.log
```

**Solutions**:
- Optimize database queries
- Add database indexes
- Increase PHP-FPM workers
- Enable OPcache
- Add Redis caching

#### **2. High Memory Usage**

**Diagnosis**:
```bash
# Check memory usage
free -h

# Check PHP-FPM memory usage
ps aux | grep php-fpm

# Check MySQL memory usage
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
```

**Solutions**:
- Reduce PHP-FPM max_children
- Optimize MySQL configuration
- Add more RAM
- Implement memory monitoring

### **Database Issues**

#### **1. Deadlock Errors**

**Symptoms**: MySQL error codes 1205 or 1213

**Solutions**:
```php
// Use DeadlockQueryRetry helper
use common\helpers\DeadlockQueryRetry;

$retry = new DeadlockQueryRetry(function() {
    // Your database query here
    return $result;
}, 5); // 5 retry attempts

$result = $retry->execute();
```

#### **2. Connection Timeout**

**Symptoms**: Database connection timeouts

**Solutions**:
```php
// Configure database connection timeout
'db' => [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=mysql;dbname=rahvaraamat',
    'username' => 'user',
    'password' => 'password',
    'attributes' => [
        PDO::ATTR_TIMEOUT => 60,
        PDO::ATTR_PERSISTENT => false,
    ],
],
```

### **API Issues**

#### **1. Authentication Errors**

**Symptoms**: 401 Unauthorized errors

**Solutions**:
```bash
# Check JWT token validity
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost/api/user

# Check token expiration
php yii debug/token-info YOUR_TOKEN
```

#### **2. Rate Limiting**

**Symptoms**: 429 Too Many Requests

**Solutions**:
- Reduce request frequency
- Implement request caching
- Contact support for rate limit increase

#### **3. Validation Errors**

**Symptoms**: 422 Unprocessable Entity

**Solutions**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Password is required"]
    }
  }
}
```

### **File Upload Issues**

#### **1. File Permission Errors**

**Symptoms**: File upload errors, permission denied

**Solutions**:
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/rahvaraamat
sudo chmod -R 755 /var/www/rahvaraamat/storage
sudo chmod -R 755 /var/www/rahvaraamat/runtime

# Check specific file permissions
ls -la /var/www/rahvaraamat/storage/
```

#### **2. File Size Limits**

**Symptoms**: File upload size exceeded

**Solutions**:
```ini
# PHP configuration
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
memory_limit = 512M
```

### **Synchronization Issues**

#### **1. NAV Sync Failures**

**Symptoms**: Product/order sync not working

**Solutions**:
```bash
# Check NAV connection
php yii sync/test-nav-connection

# Manually trigger sync
php yii sync/products --since=2024-01-01

# Check sync logs
tail -f /var/www/rahvaraamat/runtime/logs/sync.log
```

#### **2. Elasticsearch Index Issues**

**Symptoms**: Search not returning results

**Solutions**:
```bash
# Rebuild Elasticsearch index
php yii elastic/rebuild

# Check index status
curl -X GET "localhost:9200/_cat/indices"

# Check mapping
curl -X GET "localhost:9200/rahvaraamat/_mapping"
```

### **Payment Issues**

#### **1. Payment Processing Failures**

**Symptoms**: Payment gateway errors

**Solutions**:
```bash
# Check payment logs
tail -f /var/www/rahvaraamat/runtime/logs/payment.log

# Test payment gateway connection
php yii debug/test-payment-gateway

# Check payment configuration
php yii debug/payment-config
```

#### **2. Subscription Billing Issues**

**Symptoms**: Failed subscription payments

**Solutions**:
```bash
# Check subscription status
php yii subscription/check-failed-payments

# Retry failed payments
php yii subscription/retry-failed-payments

# Check subscription logs
tail -f /var/www/rahvaraamat/runtime/logs/subscription.log
```

### **Email Issues**

#### **1. Email Not Sending**

**Symptoms**: No email delivery

**Solutions**:
```bash
# Check mailer configuration
php yii debug/mailer-config

# Test email sending
php yii debug/send-test-email

# Check mail logs
tail -f /var/www/rahvaraamat/runtime/logs/mail.log
```

#### **2. Email Queue Issues**

**Symptoms**: Emails stuck in queue

**Solutions**:
```bash
# Check email queue
php yii queue/info

# Process email queue
php yii queue/worker --verbose=1

# Clear failed jobs
php yii queue/clear-failed
```

### **Security Issues**

#### **1. Unauthorized Access**

**Symptoms**: Failed login attempts, suspicious activity

**Solutions**:
```bash
# Check failed login attempts
grep "Failed login" /var/www/rahvaraamat/runtime/logs/app.log

# Check nginx access logs for suspicious IPs
tail -f /var/log/nginx/access.log | grep -E "(404|403|500)"

# Block suspicious IPs
sudo ufw deny from <suspicious_ip>
```

#### **2. CSRF Token Issues**

**Symptoms**: CSRF validation errors

**Solutions**:
```php
// Check CSRF configuration
'request' => [
    'csrfParam' => '_csrf-admin',
    'enableCookieValidation' => true,
],
```

### **Docker Issues**

#### **1. Container Not Starting**

**Symptoms**: Docker containers failing to start

**Solutions**:
```bash
# Check container status
docker ps -a

# Check container logs
docker logs rahvaraamat

# Restart containers
docker-compose down
docker-compose up -d

# Check resource usage
docker stats
```

#### **2. Volume Mount Issues**

**Symptoms**: File changes not reflected in container

**Solutions**:
```bash
# Check volume mounts
docker volume ls

# Recreate volumes
docker-compose down -v
docker-compose up -d
```

### **Development Issues**

#### **1. Composer Dependencies**

**Symptoms**: Missing dependencies, autoload errors

**Solutions**:
```bash
# Install dependencies
composer install

# Update dependencies
composer update

# Clear autoload cache
composer dump-autoload
```

#### **2. Asset Compilation**

**Symptoms**: CSS/JS not loading

**Solutions**:
```bash
# Compile assets
php yii asset/compress

# Clear asset cache
rm -rf web/assets/*
rm -rf admin/web/assets/*
rm -rf api/web/assets/*
```

#### **3. Migration Issues**

**Symptoms**: Database migration errors

**Solutions**:
```bash
# Run migrations
php yii migrate

# Check migration status
php yii migrate/history

# Rollback migrations
php yii migrate/down 1
```

### **Monitoring and Health Checks**

#### **1. Application Health Check**

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

#### **2. Database Health Check**

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

#### **3. Service Health Checks**

```bash
# Check all services
php yii health-check/kafka
php yii health-check/wowza
php yii health-check/subscription-service
```

### **Recovery Procedures**

#### **1. Database Recovery**

```bash
# Restore from backup
mysql -u rahvaraamat -p rahvaraamat < /var/backups/rahvaraamat/db_20240115_120000.sql

# Check database integrity
mysqlcheck -u rahvaraamat -p --all-databases
```

#### **2. Application Recovery**

```bash
# Clear application cache
cd /var/www/rahvaraamat
php yii cache/flush-all

# Restart all services
sudo systemctl restart nginx
sudo systemctl restart php8.0-fpm
sudo systemctl restart redis
sudo systemctl restart elasticsearch
```

#### **3. File Recovery**

```bash
# Restore files from backup
sudo tar -xzf /var/backups/rahvaraamat/files_20240115_120000.tar.gz -C /

# Check file integrity
find /var/www/rahvaraamat/storage -type f -exec md5sum {} \;
```

## Where to Get Help

### **Documentation Resources**

#### **Official Documentation**
- **API Documentation**: `https://api.rahvaraamat.ee/site/api-docs`
- **Admin Panel**: `https://admin.rahvaraamat.ee`
- **Developer Guide**: `https://docs.rahvaraamat.ee/developer`
- **Deployment Guide**: `https://docs.rahvaraamat.ee/deployment`

#### **Code Documentation**
- **Inline Comments**: Check code comments for specific functionality
- **PHPDoc Blocks**: Method and class documentation
- **README Files**: Module-specific documentation

### **Support Channels**

#### **Technical Support**
- **System Administration**: sysadmin@rahvaraamat.ee
- **Development Team**: dev@rahvaraamat.ee
- **Emergency Contact**: +372 1234 5678

#### **Issue Reporting**
- **Bug Reports**: bugs@rahvaraamat.ee
- **Feature Requests**: features@rahvaraamat.ee
- **Security Issues**: security@rahvaraamat.ee

### **Community Resources**

#### **Internal Resources**
- **Team Chat**: Slack/Discord channels
- **Knowledge Base**: Internal wiki
- **Code Reviews**: Pull request discussions

#### **External Resources**
- **Yii2 Framework**: https://www.yiiframework.com/doc/guide/2.0/en
- **PHP Documentation**: https://www.php.net/manual/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Redis Documentation**: https://redis.io/documentation
- **Elasticsearch Documentation**: https://www.elastic.co/guide/

### **Debugging Tools**

#### **Application Debugging**
```bash
# Enable debug mode
YII_DEBUG=true

# Check debug logs
tail -f /var/www/rahvaraamat/runtime/logs/debug.log

# Use Yii debug toolbar
# Available in development environment
```

#### **Database Debugging**
```bash
# Enable query logging
'db' => [
    'enableLogging' => true,
    'enableProfiling' => true,
],

# Check slow queries
sudo tail -f /var/log/mysql/slow.log
```

#### **Performance Profiling**
```bash
# Use Xdebug for profiling
# Install Xdebug extension
# Configure profiling in php.ini

# Use Blackfire.io for production profiling
# Install Blackfire extension
# Configure Blackfire credentials
```

### **Log Locations**

#### **Application Logs**
```bash
# Main application logs
/var/www/rahvaraamat/runtime/logs/app.log
/var/www/rahvaraamat/runtime/logs/api.log
/var/www/rahvaraamat/runtime/logs/admin.log

# Console command logs
/var/www/rahvaraamat/runtime/logs/console.log

# Queue worker logs
/var/www/rahvaraamat/runtime/logs/queue.log
```

#### **System Logs**
```bash
# Web server logs
/var/log/nginx/access.log
/var/log/nginx/error.log
/var/log/apache2/access.log
/var/log/apache2/error.log

# PHP logs
/var/log/php8.0-fpm.log
/var/log/php8.0-fpm-slow.log

# Database logs
/var/log/mysql/error.log
/var/log/mysql/slow.log

# Service logs
/var/log/redis/redis-server.log
/var/log/elasticsearch/elasticsearch.log
```

### **Emergency Procedures**

#### **Critical Issues**
1. **Immediate Response**: Contact emergency support
2. **Service Restart**: Restart affected services
3. **Rollback**: Deploy previous stable version
4. **Communication**: Notify stakeholders

#### **Data Recovery**
1. **Backup Verification**: Check backup integrity
2. **Point-in-Time Recovery**: Restore to specific time
3. **Data Validation**: Verify data consistency
4. **Service Restoration**: Restore all services

#### **Security Incidents**
1. **Isolation**: Isolate affected systems
2. **Investigation**: Analyze security logs
3. **Remediation**: Fix security vulnerabilities
4. **Notification**: Report to relevant authorities 
