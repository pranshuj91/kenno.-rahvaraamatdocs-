id: PERFORMANCE
title: PERFORMANCE
# Performance

## Caching Strategies

### **Redis Cache Configuration**

#### **Main Cache Component** (`common/config/main.php`)
```php
'cache' => [
    'class' => 'yii\redis\Cache',
    'redis' => [
        'hostname' => 'redis',
        'port' => 6379,
        'database' => 0,
    ]
],
```

#### **Cache Enable/Disable**
```php
// Enable cache only when not in CLI mode
defined('CACHE_ENABLE') || define('CACHE_ENABLE', php_sapi_name() !== 'cli');
```

#### **Classifier Component Caching**
```php
'classifier' => [
    'class' => common\components\classifier\ClassifierComponent::class,
    'cachingDuration' => CACHE_ENABLE ? 300 : 0,
],
```

#### **System State Component Caching**
```php
'system' => [
    'class' => common\components\state\SystemStateComponent::class,
    'cachingDuration' => CACHE_ENABLE ? 300 : 0,
],
```

### **API Response Caching**

#### **Base Cached Response Provider** (`api/providers/responses/BaseCachedResponseDataProvider.php`)
```php
abstract class BaseCachedResponseDataProvider implements IResponseDataProvider
{
    public function getResponse(array $queryParams, callable $serialization): array
    {
        if (!$this->clientAccount->getTypeManager()->isSimpleCustomer()) {
            return $this->getResponseDataProvider()->getResponse(
                $queryParams,
                $serialization
            );
        }

        return Yii::$app->cache->getOrSet($this->getCacheKey($queryParams), fn() => $this->getResponseDataProvider()->getResponse(
            $queryParams,
            $serialization
        ), $this->getCacheDuration());
    }

    protected function getCacheDuration(): int
    {
        return 600; // 10 minutes
    }
}
```

#### **Content Page Caching** (`api/providers/responses/CachedContentPageResponseDataProvider.php`)
```php
protected function getCacheDuration(): int
{
    return 600; // 10 minutes
}
```

#### **Dynamic Filter Caching** (`api/providers/responses/CachedDynamicFilterResponseDataProvider.php`)
```php
protected function getCacheDuration(): int
{
    return 600; // 10 minutes
}
```

### **Product Recommendation Caching**

#### **Base Cached Recommendation Provider** (`api/recommendations/BaseCachedProductRecommendationDataProvider.php`)
```php
abstract class BaseCachedProductRecommendationDataProvider implements IProductRecommendationDataProvider
{
    public function getData(Product $product): array
    {
        if (!$this->clientAccount->getTypeManager()->isSimpleCustomer()) {
            return $this->getProductRecommendationDataProvider()->getData($product);
        }

        return Yii::$app->cache->getOrSet($this->getCacheKey(), fn() => $this->getProductRecommendationDataProvider()->getData($product), $this->getCacheDuration());
    }

    protected function getCacheDuration(): int
    {
        return 600; // 10 minutes
    }
}
```

### **Category Path Caching**

#### **Category Path Cache Storage** (`api/categories/CategoryPathCacheStorage.php`)
```php
public const CACHE_DURATION = 60 * 60 * 24; // 1 Day

public function getPath(string $categoryId): ?array
{
    return Yii::$app->cache->getOrSet(
        $this->getCacheKey($categoryId),
        fn() => $this->getPathFromDatabase($categoryId),
        self::CACHE_DURATION
    );
}
```

#### **Category Nav Code Path Storage** (`api/categories/CategoryNavCodePathStorage.php`)
```php
public const CACHE_DURATION = 60 * 60 * 24; // 1 Day

public function getPath(string $navCode): ?array
{
    return Yii::$app->cache->getOrSet(
        $this->getCacheKey($navCode),
        fn() => $this->getPathFromDatabase($navCode),
        self::CACHE_DURATION
    );
}
```

### **User System Cache**

#### **System User Cache** (`console/models/User.php`)
```php
public const SYSTEM_USER_CACHE_DURATION = 600;

public static function getSystemUser(): ?User
{
    return self::find()
        ->where(['id' => self::SYSTEM_USER_ID])
        ->cache(self::SYSTEM_USER_CACHE_DURATION)
        ->one();
}
```

### **Category Path Helper Caching**

#### **Category Path Helper** (`admin/helpers/CategoryPathHelper.php`)
```php
protected static $cacheDuration = 1800; // 30 minutes

public static function getPathMap(): array
{
    if (self::$pathMap === null) {
        self::$pathMap = self::getCacheHandler()->get(self::getCacheKey());
        
        if (self::$pathMap === false) {
            self::$pathMap = self::buildPathMap();
            self::getCacheHandler()->set(self::getCacheKey(), self::$pathMap, self::$cacheDuration);
        }
    }
    
    return self::$pathMap;
}
```

### **Redis Redirect Repository**

#### **Redis Redirect Storage** (`common/redirects/repositories/RedisRedirectRepository.php`)
```php
class RedisRedirectRepository implements RedirectRepositoryInterface
{
    public function save(RedirectValue $redirect): bool
    {
        if ($redirect->urlsAreTheSame()) {
            return false;
        }

        $value = $redirect->getToUrl();
        if ($redirect->getReason() === LogRedirectReasonEnum::MANUAL_REDIRECT_SETUP) {
            $value = $redirect->getHttpStatusCode() .
                self::HTTP_STATUS_CODE_SEPARATOR .
                $redirect->getToUrl();
        }

        $this->redis->set($redirect->getFromUrl(), $value);
        return true;
    }

    public function get(string $from): ?RedirectValue
    {
        if(!empty($to = $this->redis->get($from))) {
            if (count($parts = explode(self::HTTP_STATUS_CODE_SEPARATOR, $to, 1)) > 1) {
                return new RedirectValue($from, $parts[1], null, (int) $parts[0]);
            }
            return new RedirectValue($from, $to);
        }

        return null;
    }
}
```

## Database Optimization

### **Query Optimization**

#### **Eager Loading**
```php
// Bad: N+1 query problem
$products = Product::find()->all();
foreach ($products as $product) {
    echo $product->category->name; // Additional query for each product
}

// Good: Eager loading
$products = Product::find()->with('category')->all();
foreach ($products as $product) {
    echo $product->category->name; // No additional queries
}
```

#### **Batch Processing**
```php
// Process large datasets in chunks
Product::find()->batch(1000, function($products) {
    foreach ($products as $product) {
        // Process product
    }
});

// Use generators for large datasets
function getProducts(): Generator
{
    $query = Product::find();
    
    foreach ($query->each() as $product) {
        yield $product;
    }
}
```

#### **Query Caching**
```php
// Cache query results
$products = Product::find()
    ->cache(3600) // Cache for 1 hour
    ->byCategory($categoryId)
    ->all();
```

### **Elasticsearch Optimization**

#### **Product Search with Proper Counter** (`api/models/search/ProductElasticSearch.php`)
```php
public function search(): ProductsActiveDataProviderWithProperCounter
{
    $dataProvider = new ProductsActiveDataProviderWithProperCounter([
        'query' => $this->getProductsQuery(),
        'pagination' => [
            'pageSize' => $this->pageSize,
        ],
        'sort' => $this->sort,
    ]);

    // Cache total count for expensive queries
    $totalCount = Yii::$app->cache->get($this->getTotalCountCacheKey());
    
    if ($totalCount !== false) {
        $dataProvider->setTotalCount((int) $totalCount);
    } elseif ($dataProvider->getTotalCount() > ProductsActiveDataProviderWithProperCounter::MAX_ELASTIC_TOTAL_COUNT) {
        Yii::$app->cache->set(
            $this->getTotalCountCacheKey(),
            $dataProvider->getTotalCount(),
            $this->getTotalCountCacheDuration()
        );
    }

    return $dataProvider;
}

protected function getTotalCountCacheDuration(): int
{
    return 600; // 10 minutes
}
```

#### **Shop Query Optimization**
```php
// Optimized shop retrieval
$shops = Shop::find()
    ->select(['id'])
    ->visible()
    ->active()
    ->where(['in', 'nav_code', $shopsNavCodes])
    ->column();
```

### **Database Indexing**

#### **Recommended Indexes**
```sql
-- Product indexes
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_product_price ON product(price);
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_product_active ON product(is_active);
CREATE INDEX idx_product_created ON product(created);

-- Composite indexes for complex queries
CREATE INDEX idx_product_category_price ON product(category_id, price);
CREATE INDEX idx_product_active_created ON product(is_active, created);

-- Order indexes
CREATE INDEX idx_order_user ON `order`(user_id);
CREATE INDEX idx_order_status ON `order`(status);
CREATE INDEX idx_order_created ON `order`(created);

-- User indexes
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_active ON user(is_active);
```

### **Connection Pooling**

#### **Database Connection Configuration**
```php
'db' => [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=mysql;dbname=rahvaraamat',
    'username' => 'user',
    'password' => 'password',
    'charset' => 'utf8',
    'tablePrefix' => 'rr_',
    'enableLogging' => false,
    'enableProfiling' => false,
    'attributes' => [
        PDO::ATTR_TIMEOUT => 60,
        PDO::ATTR_PERSISTENT => false,
    ],
],
```

## Asset Optimization

### **Asset Bundle Configuration**

#### **Admin Asset Bundle** (`admin/assets/AppAsset.php`)
```php
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/styles.css',
        'css/styles_print.css',
        'css/styles_screen.css',
    ];
    public $js = [
        'js/parseUri.js',
        'js/thickbox.js',
        'js/jquery.thickbox.alt.js',
        'js/main.js'
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
```

#### **Asset Manager Configuration**
```php
'assetManager' => [
    'class' => 'yii\web\AssetManager',
    'bundles' => [
        'yii\web\JqueryAsset' => [
            'sourcePath' => null,
            'js' => ['jquery.min.js'],
        ],
    ],
    'appendTimestamp' => true,
    'forceCopy' => YII_DEBUG,
],
```

### **Asset Compression**

#### **Asset Compression Command**
```bash
# Compress assets
php yii asset/compress

# Or use Node.js build tools
npm install
npm run build
```

#### **Asset Structure**
```
web/assets/
├── css/                    # Compiled CSS files
├── js/                     # Compiled JavaScript files
├── images/                 # Optimized images
└── fonts/                  # Web fonts

admin/web/assets/
├── css/
├── js/
└── images/

api/web/assets/
├── css/
└── js/
```

### **Image Optimization**

#### **Image Processing**
```php
// Optimize image uploads
use yii\imagine\Image;

$image = Image::getImagine()->open($uploadedFile->tempName);
$image->resize($image->getSize()->widen(800))
    ->save($destinationPath, ['quality' => 85]);
```

#### **File Storage Optimization**
```php
'fileStorage' => [
    'class' => 'common\components\aws\Storage',
    'buckets' => [
        'rahvaraamat-staging-public' => ['acl' => 'public-read'],
        'rahvaraamat-staging-private' => [],
        // ... more buckets
    ]
],
```

### **Web Server Optimization**

#### **Nginx Configuration**
```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;

# Static file caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### **Apache Configuration**
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### **PHP-FPM Optimization**

#### **PHP-FPM Configuration**
```ini
[www]
user = www-data
group = www-data
listen = /run/php/php8.0-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

#### **OPcache Configuration**
```ini
[opcache]
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### **Redis Optimization**

#### **Redis Configuration**
```conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### **MySQL Optimization**

#### **MySQL Configuration**
```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
query_cache_size = 128M
query_cache_type = 1
max_connections = 200
```

### **Performance Monitoring**

#### **Cache Hit Rate Monitoring**
```bash
# Check Redis memory usage
redis-cli info memory

# Check cache hit rate
redis-cli info stats | grep keyspace_hits
```

#### **Database Performance Monitoring**
```bash
# Check slow queries
sudo tail -f /var/log/mysql/slow.log

# Check MySQL status
mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';"
```

#### **Application Performance Monitoring**
```bash
# Check PHP-FPM status
sudo systemctl status php8.0-fpm

# Monitor memory usage
free -h

# Check disk usage
df -h
``` 
