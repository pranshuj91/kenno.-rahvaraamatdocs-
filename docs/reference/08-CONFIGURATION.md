id: CONFIGURATION
title: CONFIGURATION
# Configuration Documentation

## Overview

The Rahvaraamat e-commerce platform uses a hierarchical configuration system based on Yii2 framework. Configuration is organized by application type (common, admin, api, console) and environment (development, staging, production).

**Configuration Hierarchy**:
```
config/
├── common/          # Shared configuration
├── admin/           # Admin panel configuration
├── api/             # API configuration
├── console/         # Console application configuration
└── environments/    # Environment-specific overrides
```

## Configuration File Hierarchy

### **Common Configuration** (`common/config/`)

Base configuration shared across all applications.

#### **Main Configuration** (`common/config/main.php`)
Core application components and settings.

**Key Components**:
```php
return [
    'bootstrap' => ['queue', 'queueFailedJobs'],
    'components' => [
        'cache' => [
            'class' => 'yii\redis\Cache',
            'redis' => [
                'hostname' => 'redis',
                'port' => 6379,
                'database' => 0,
            ]
        ],
        'log' => [
            'targets' => [
                [
                    'class' => 'common\components\CustomLogDbTarget',
                    'levels' => ['error', 'warning', 'info'],
                ],
            ],
        ],
        'classifier' => [
            'class' => common\components\classifier\ClassifierComponent::class,
            'cachingDuration' => CACHE_ENABLE ? 300 : 0,
        ],
        'system' => [
            'class' => common\components\state\SystemStateComponent::class,
            'cachingDuration' => CACHE_ENABLE ? 300 : 0,
        ],
        'authManager' => [
            'class' => AuthManager::class,
            'itemFile' => '@common/components/rbac/items.php',
            'assignmentFile' => '@common/components/rbac/assignments.php',
            'ruleFile' => '@common/components/rbac/rules.php'
        ],
        'queue' => [
            'class' => Queue::class,
            'db' => 'db',
            'tableName' => '{{%queue}}',
            'channel' => 'default',
            'mutex' => MysqlMutex::class,
            'mutexTimeout' => 60,
            'ttr' => 60 * 60, // 1h
        ],
        'queueFailedJobs' => [
            'class' => QueueFailedJobs::class
        ],
        'audioStreamManager' => [
            'class' => AudioStreamManager::class,
            'host' => 'your-wowza-host',
            'secret' => 'your-wowza-secret',
            'tokenName' => 'wowzatoken'
        ],
        'audioStreamManagerLive' => [
            'class' => AudioStreamManager::class,
            'host' => 'your-wowza-host',
            'secret' => 'your-wowza-secret',
            'tokenName' => 'wowzatoken'
        ],
        'i18n' => [
            'translations' => [
                '*' => [
                    'class' => yii\i18n\DbMessageSource::class,
                    'sourceMessageTable' => '{{%message}}',
                    'messageTable' => '{{%message_translation}}',
                    'cachingDuration' => 300,
                    'enableCaching' => CACHE_ENABLE
                ]
            ],
        ],
        'fileStorage' => [
            'class' => 'common\components\aws\Storage',
            'bucketClassName' => 'common\components\aws\Bucket',
            'awsKey' => '',
            'awsSecretKey' => '',
            'amazonS3Config' => [
                'version' => 'latest',
                'region' => 'us-east-2',
            ],
            'buckets' => [
                'uus-rahvaraamat-staging-public' => [],
                'uus-rahvaraamat-staging-private' => [],
                'rahvaraamat-staging-banner' => [
                    'acl' => 'public-read',
                ],
                // ... more buckets
            ]
        ],
        'europeRegionFileStorage' => [
            'class' => 'common\components\aws\Storage',
            'bucketClassName' => 'common\components\aws\Bucket',
            'awsKey' => '',
            'awsSecretKey' => '',
            'amazonS3Config' => [
                'version' => 'latest',
                'region' => 'eu-north-1',
            ],
            'buckets' => [
                'audio-books-staging-private' => [],
                'audio-books-staging' => [
                    'acl' => 'public-read',
                ],
            ]
        ],
        'localFileStorage' => [
            'class' => 'yii2tech\filestorage\local\Storage',
            'bucketClassName' => 'yii2tech\filestorage\local\Bucket',
            'basePath' => '@storage',
            'baseUrl' => '/storage',
            'dirPermission' => 0775,
            'filePermission' => 0755,
            'buckets' => [
                'audioFiles' => [
                    'baseSubPath' => 'audio',
                    'fileSubDirTemplate' => '{^name}',
                ],
            ]
        ],
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
        'apiUrlManager' => [
            'class' => 'yii\web\UrlManager',
            'enablePrettyUrl' => true,
            'baseUrl' => 'https://dev.rahvaraamat.ee',
            'scriptUrl' => 'https://dev.rahvaraamat.ee',
            'rules' => $apiUrlManagerRules
        ],
        'externalUrlManager' => [
            'class' => 'common\redirects\ExternalUrlManager',
            'webStoreVersions' => [
                'WEB' => UrlStructureVersionEnum::VERSION_2,
                'WEB2' => UrlStructureVersionEnum::VERSION_2,
            ],
            'repositoryConfig' => [
                'redis' => [
                    'class' => 'yii\redis\Connection',
                    'hostname' => 'redis',
                    'port' => 6379,
                    'database' => 1,
                ]
            ]
        ],
    ],
];
```

#### **Local Configuration** (`common/config/main-local.php.dist`)
Environment-specific overrides for common components.

**Key Overrides**:
```php
return [
    'components' => [
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:unix_socket=/Applications/MAMP/tmp/mysql/mysql.sock;dbname=beta_rahvaraamat',
            'username' => '',
            'password' => '',
            'charset' => 'utf8',
            'tablePrefix' => 'rr_'
        ],
        'navDb' => [
            'class' => 'common\components\nav\NavDb',
            'dsn' => 'odbc:ODBCdsnNewLive',
            'username' => 'your-db-username',
            'password' => 'your-db-password',
        ],
        'elasticsearch' => [
            'class' => '\common\elastica\components\Connection',
            'index' => 'rahvaraamat',
            'nodes' => [
                ['http_address' => '127.0.0.1:9200'],
            ],
        ],
        'mailer' => [
            'class' => common\mail\Mailer::class,
            'viewPath' => '@common/mail/views',
            'useFileTransport' => true,
            'transport' => [
                'class' => 'Swift_SmtpTransport',
                'encryption' => 'tls',
                'host' => 'your_mail_server_host',
                'port' => 'your_smtp_port',
                'username' => 'your_username',
                'password' => 'your_password',
            ],
            'messageConfig' => [
                'from' => ['noreply@rahvaraamat.ee' => 'Rahva Raamat'],
                'replyTo' => ['info@rahvaraamat.ee' => 'Rahva Raamat']
            ]
        ],
        'authClientCollection' => [
            'class' => \yii\authclient\Collection::class,
            'clients' => [
                'google' => [
                    'class' => \common\components\auth\clients\Google::class,
                    'clientId' => '',
                    'clientSecret' => '',
                    'parametersToKeepInReturnUrl' => [
                        'authclient',
                        'web_store_nav_code'
                    ]
                ],
                'facebook' => [
                    'class' => \common\components\auth\clients\Facebook::class,
                    'clientId' => '',
                    'clientSecret' => '',
                    'parametersToKeepInReturnUrl' => [
                        'authclient',
                        'web_store_nav_code'
                    ]
                ],
            ],
        ],
    ],
];
```

#### **Parameters** (`common/config/params.php`)
Application parameters and business logic settings.

**Key Parameters**:
```php
return [
    'newBusinessCustomerCreditLimit' => 0,
    'globalSalt' => 'd9pAxeSPaFr2Xu3E',
    'productEbooks' => [
        'pathAlias' => '@storage'
    ],
    'loyaltyGiftCardNavItemNo' => '300081',
    'availabilityLimits' => [
        'OFFICE_EQUIPMENT' => ['limit' => 0],
        'MUSIC' => ['limit' => 0],
        'MOVIE' => ['limit' => 0],
        'GAME' => ['limit' => 0],
        'BOOK' => [
            'RU' => ['limit' => 0],
            'EN' => ['limit' => 0],
            'ET' => ['limit' => 0]
        ],
        'USED_BOOK' => ['limit' => 0],
        'typeMedia' => 0,
        'default' => 0,
        'expressDelivery' => 4,
        'boltDelivery' => 1,
        'gardnersBook' => 1,
        'buroomaailm' => 3,
        'anvol' => 3
    ],
    'mail' => [
        'adminEmails' => [],
        'supportEmails' => [],
        'developerEmails' => [],
        'businessClientManagerEmails' => [],
        'orderNotificationBcc' => [],
        'revenueShareReportReceiversEmails' => [
            'sander.tammer@rahvaraamat.ee',
            'tõnis.kink@rahvaraamat.ee',
            'arve@rahvaraamat.ee'
        ],
        'limit' => 10,
        'timeout' => 5,
        'safetyInterval' => 120,
        'maxExecutionTime' => 120,
    ],
    'smsSender' => [
        'senderName' => 'Rahvaraamat',
        'username' => '',
        'password' => '',
    ],
    'forceDefaultLanguage' => 'et',
    'basket' => [
        'delivery' => [
            DeliveryMethodCodeEnum::SMARTPOST_EXPRESS => [
                'final_ordering_time' => '12'
            ],
            'driveInDeliveryShopNavCodes' => [
                'VIRU',
            ],
        ],
        'discountPercentThreshold' => 5,
    ],
    'productLastCopiesThreshold' => 5,
    'awsS3' => [
        'publicBucket' => 'uus-rahvaraamat-staging-public',
        'privateBucket' => 'uus-rahvaraamat-staging-private',
        'bucketMap' => [
            \common\models\WebStoreLogo::class => 'rahvaraamat-staging-web-store-logo',
            \common\models\VendorOrderFile::class.'_private' => 'rahvaraamat-staging-vendor-order-file-private',
            // ... more bucket mappings
        ]
    ],
    'lcp' => [
        'X509PemCertPath' => '/path/to/cert.pem',
        'pemPrivateKeyPath' => '/path/to/privkey.pem',
        'userPassPhraseEncryptionPublicKeyPath' => '/path/to/public.key'
    ],
    'everypay' => [
        'username' => 'your-everypay-username',
        'secret' => 'your-everypay-secret',
        'accountName' => 'your-account-name',
        'testMode' => true,
        'merchantIP' => '217.146.69.5',
    ],
    'poeditor' => [
        'project_id' => '',
        'api_key' => ''
    ]
];
```

#### **Pre-initialization** (`common/config/preinit.php`)
Constants and environment setup loaded before configuration.

**Key Constants**:
```php
// Enable cache only when not in CLI mode
defined('CACHE_ENABLE') || define('CACHE_ENABLE', php_sapi_name() !== 'cli');

// Default debug mode is off
defined('YII_DEBUG') || define('YII_DEBUG', true);

// Specify how many levels of call stack should be shown in each log message
defined('YII_TRACE_LEVEL') || define('YII_TRACE_LEVEL', 3);

// If the environment is lacking SSL, enable this
defined('SSL_DISABLE') || define('SSL_DISABLE', false);

// Disable the hack where NVARCHAR data longer than 255 gets truncated
defined('API_SQL_SERVER_SEGFAULT_TRUNCATE') || define('API_SQL_SERVER_SEGFAULT_TRUNCATE', false);

// Do not write dummy data instead of actual user information
defined('API_OBFUSCATE_USER_DATA') || define('API_OBFUSCATE_USER_DATA', false);

// Name for protected file directory
defined('PROTECTED_FILES_DIRNAME') || define('PROTECTED_FILES_DIRNAME', 'files');

// Disable posting to NAV by default
defined('ENABLE_NAV_POST') || define('ENABLE_NAV_POST', true);

date_default_timezone_set('UTC');
```

### **Admin Panel Configuration** (`admin/config/`)

#### **Main Configuration** (`admin/config/main.php`)
Admin panel specific configuration.

**Key Settings**:
```php
return [
    'id' => 'app-admin',
    'name' => "Rahvaraamat Admin Panel",
    'basePath' => dirname(__DIR__),
    'language' => 'et',
    'controllerNamespace' => 'admin\controllers',
    'bootstrap' => [
        'log',
        'common\bootstrap\Setup',
        'admin\bootstrap\Setup',
    ],
    'modules' => [
        'shop' => ['class' => ShopModule::class],
        'stacc' => ['class' => StaccModule::class],
        'vendor' => ['class' => VendorModule::class],
        'content' => ['class' => ContentModule::class],
        'setting' => ['class' => SettingModule::class],
        'debugger' => ['class' => DebugModule::class],
        'audio' => ['class' => AudioModule::class],
        'combo' => ['class' => ComboModule::class],
        'ebook' => ['class' => EBookModule::class],
        'redirect' => ['class' => RedirectModule::class]
    ],
    'components' => [
        'request' => [
            'csrfParam' => '_csrf-admin',
            'baseUrl' => '/admin-panel',
        ],
        'user' => [
            'identityClass' => User::class,
            'authTimeout' => 60 * 60 * 12, // 12h
            'absoluteAuthTimeout' => 60 * 60 * 12, // 12h
            'identityCookie' => ['name' => '_identity-admin', 'httpOnly' => true],
        ],
        'session' => [
            'name' => 'advanced-admin',
            'cookieParams' => ['lifetime' => 60 * 60 * 12],
            'timeout' => 60 * 60 * 12
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
        ],
        'formatter' => [
            'class' => yii\i18n\Formatter::class,
            'datetimeFormat' => 'php:d.m.Y H:i',
            'dateFormat' => 'php:d.m.Y',
            'nullDisplay' => '-',
        ],
        'i18n' => [
            'translations' => [
                '*' => [
                    'class' => yii\i18n\DbMessageSource::class,
                    'sourceMessageTable' => '{{%message}}',
                    'messageTable' => '{{%message_translation}}',
                    'cachingDuration' => 300,
                    'enableCaching' => CACHE_ENABLE
                ]
            ],
        ],
        'assetManager' => [
            'forceCopy' => true,
        ],
    ],
    'params' => $params,
];
```

### **API Configuration** (`api/config/`)

#### **Main Configuration** (`api/config/main.php`)
API application specific configuration.

**Key Settings**:
```php
return [
    'id' => 'app-api',
    'basePath' => dirname(__DIR__),
    'bootstrap' => [
        'log',
        'common\bootstrap\Setup',
        'api\bootstrap\Setup'
    ],
    'controllerNamespace' => 'api\controllers',
    'language' => 'et',
    'modules' => [
        'stacc' => ['class' => StaccModule::class],
        'audio' => ['class' => AudioModule::class],
        'ebook' => ['class' => EBookModule::class],
        'v2' => ['class' => v2::class],
    ],
    'components' => [
        'request' => [
            'enableCookieValidation' => false,
            'enableCsrfCookie' => false,
            'baseUrl' => '',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'staccSessionCache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'api\models\UserWebStoreClientAccount',
            'enableAutoLogin' => false,
            'enableSession' => false,
        ],
        'guestUser' => [
            'class' => 'api\components\GuestUserComponent',
        ],
        'webStore' => [
            'class' => 'api\components\WebStoreComponent',
            'defaultHeaderParamValue' => 'WEB'
        ],
        'requestDevice' => [
            'class' => 'api\components\RequestDeviceComponent'
        ],
        'basket' => [
            'class' => 'api\components\BasketComponent',
        ],
        'session' => [
            'name' => 'advanced-api',
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => $urlManagerRules,
        ],
        'formatter' => [
            'class' => yii\i18n\Formatter::class,
            'datetimeFormat' => 'php:Y-m-d H:i:s',
            'dateFormat' => 'php:d.m.Y',
            'nullDisplay' => '-',
        ]
    ],
    'params' => $params,
];
```

### **Console Configuration** (`console/config/`)

#### **Main Configuration** (`console/config/main.php`)
Console application specific configuration.

**Key Settings**:
```php
return [
    'id' => 'app-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => [
        'oauth2',
        'oidc\bootstrap\Setup',
        'log',
        'common\bootstrap\Setup',
    ],
    'modules' => [
        'oauth2' => $oidc,
    ],
    'language' => 'et',
    'controllerNamespace' => 'console\controllers',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
    ],
    'controllerMap' => [
        'fixture' => [
            'class' => 'yii\console\controllers\FixtureController',
            'namespace' => 'common\fixtures',
        ],
        'migrate' => [
            'class' => 'yii\console\controllers\MigrateController',
            'migrationNamespaces' => [
                'console\migrations\oauth2',
            ],
        ],
    ],
    'components' => [
        'user' => [
            'class' => console\models\User::class,
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'baseUrl' => 'https://dev.rahvaraamat.ee',
            'scriptUrl' => 'https://dev.rahvaraamat.ee',
            'rules' => [
                'GET,HEAD qr-code/<code:\w+>' => 'qr-code/svg'
            ]
        ]
    ],
    'params' => $params,
];
```

## Environment Variables and Secrets

### **Environment-Specific Configuration**

#### **Development Environment** (`environments/dev/`)

**Admin Panel** (`environments/dev/admin/config/main-local.php`):
```php
$config = [
    'components' => [
        'request' => [
            'cookieValidationKey' => 'your-cookie-validation-key',
        ],
    ],
];

if (!YII_ENV_TEST) {
    // Debug module
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => [
            '37.120.141.158', '::1', '127.0.0.1', 'localhost', 
            '88.196.134.147', '82.29.96.108'
        ],
        'panels' => [
            'elasticsearch' => [
                'class' => 'yii\\elasticsearch\\DebugPanel',
            ],
        ],
    ];

    // Gii module
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => [
            '82.29.96.108', '37.120.141.158', '::1', 
            '127.0.0.1', 'localhost'
        ],
    ];
}

return $config;
```

**API** (`environments/dev/api/config/main-local.php`):
```php
$config = [
    'components' => [
        'request' => [
            'cookieValidationKey' => 'your-cookie-validation-key',
        ],
        'staccSessionCache' => [
            'class' => 'yii\redis\Cache',
            'redis' => [
                'hostname' => 'redis',
                'port' => 6379,
                'database' => 0,
            ]
        ],
        'audioStreamManagerLive' => [
            'class' => api\modules\audio\components\wowza\AudioStreamManager::class,
            'host' => 'your-wowza-host',
            'secret' => 'your-wowza-secret',
            'tokenName' => 'wowzatoken',
            'schema' => 'https'
        ]
    ],
];

if (!YII_ENV_TEST) {
    // Debug module
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => ['127.0.0.1', '::1', '37.120.141.158', '82.29.96.108'],
        'panels' => [
            'elasticsearch' => [
                'class' => 'yii\\elasticsearch\\DebugPanel',
            ],
        ],
    ];

    // Gii module
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['127.0.0.1', '::1', '37.120.141.158', '82.29.96.108'],
    ];
}

return $config;
```

### **Environment Variables**

#### **OAuth2 Server Keys** (`common/config/preinit.environment.php.dist`)
```php
<?php

putenv('YII2_OAUTH2_SERVER_CODES_ENCRYPTION_KEY=def00000797947f4a717be21e2ccc0940efb342431745aac2a1a6142e75c7b2c9b7cfec8f4586ea20e31f9a5c44692b2ee9bbef962a47fc4c3dafa5754c08ae5c45f4491');
putenv('YII2_OAUTH2_SERVER_STORAGE_ENCRYPTION_KEY=def0000004080bcf4e888e52db17e302dc75fa2e99019b291b1388fb846e912f5469d8ab16664e8d4fd811a19bb01a723bcec8769bfe99d8b263e825f6b0e590193933b3');
```

## Database Configuration

### **Table Prefix**
All database tables use the `rr_` prefix.

### **Database Connections**

#### **Main Database** (`common/config/main-local.php.dist`)
```php
'db' => [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:unix_socket=/Applications/MAMP/tmp/mysql/mysql.sock;dbname=beta_rahvaraamat',
    'username' => '',
    'password' => '',
    'charset' => 'utf8',
    'tablePrefix' => 'rr_'
],
```

#### **NAV Database** (Microsoft Dynamics)
```php
'navDb' => [
    'class' => 'common\components\nav\NavDb',
    'dsn' => 'odbc:ODBCdsnNewLive',
    'username' => 'your-db-username',
    'password' => 'your-db-password',
],
```

### **Docker Environment Database**
```php
'db' => [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=mysql;dbname=rahvaraamat',
    'username' => 'user',
    'password' => 'password',
    'charset' => 'utf8',
    'tablePrefix' => 'rr_',
    'enableLogging' => false,
],
```

## Cache Configuration

### **Redis Cache**
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

### **Cache Enable/Disable**
```php
// Enable cache only when not in CLI mode
defined('CACHE_ENABLE') || define('CACHE_ENABLE', php_sapi_name() !== 'cli');
```

## Mail Configuration

### **Mailer Component**
```php
'mailer' => [
    'class' => common\mail\Mailer::class,
    'viewPath' => '@common/mail/views',
    'useFileTransport' => true, // Use file transport in development
    'transport' => [
        'class' => 'Swift_SmtpTransport',
        'encryption' => 'tls',
        'host' => 'your_mail_server_host',
        'port' => 'your_smtp_port',
        'username' => 'your_username',
        'password' => 'your_password',
    ],
    'messageConfig' => [
        'from' => ['noreply@rahvaraamat.ee' => 'Rahva Raamat'],
        'replyTo' => ['info@rahvaraamat.ee' => 'Rahva Raamat']
    ]
],
```

### **Mail Parameters**
```php
'mail' => [
    'adminEmails' => [],
    'supportEmails' => [],
    'developerEmails' => [],
    'businessClientManagerEmails' => [],
    'orderNotificationBcc' => [],
    'revenueShareReportReceiversEmails' => [
        'sander.tammer@rahvaraamat.ee',
        'tõnis.kink@rahvaraamat.ee',
        'arve@rahvaraamat.ee'
    ],
    'limit' => 10, // emails per cron activation
    'timeout' => 5, // seconds between emails
    'safetyInterval' => 120, // minimum time between emails to same person
    'maxExecutionTime' => 120, // maximum email sending time
],
```

## Debug and Gii Modules

### **Debug Module**

#### **Enable Debug Module**
Add to environment-specific configuration:

```php
if (!YII_ENV_TEST) {
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => [
            '127.0.0.1', '::1', 'localhost',
            '37.120.141.158', '82.29.96.108'
        ],
        'panels' => [
            'elasticsearch' => [
                'class' => 'yii\\elasticsearch\\DebugPanel',
            ],
        ],
    ];
}
```

#### **Access Debug Panel**
- **URL**: `http://your-domain/debug`
- **IP Restrictions**: Only allowed IPs can access
- **Panels**: Database, Logs, Elasticsearch, Performance

#### **Custom Debug Module**
```php
'debugger' => [
    'class' => DebugModule::class,
],
```

### **Gii Module**

#### **Enable Gii Module**
Add to environment-specific configuration:

```php
if (!YII_ENV_TEST) {
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => [
            '127.0.0.1', '::1', 'localhost',
            '37.120.141.158', '82.29.96.108'
        ],
    ];
}
```

#### **Access Gii**
- **URL**: `http://your-domain/gii`
- **IP Restrictions**: Only allowed IPs can access
- **Generators**: Model, Controller, CRUD, etc.

### **Security Considerations**

#### **IP Restrictions**
```php
'allowedIPs' => [
    '127.0.0.1',    // localhost
    '::1',          // IPv6 localhost
    'localhost',     // hostname
    '37.120.141.158', // development server
    '82.29.96.108',   // development server
],
```

#### **Environment-Specific Enablement**
```php
if (!YII_ENV_TEST) {
    // Only enable in development environment
    $config['bootstrap'][] = 'debug';
    $config['bootstrap'][] = 'gii';
}
```

## Configuration File Structure

### **File Hierarchy**
```
config/
├── common/
│   ├── main.php              # Base configuration
│   ├── main-local.php.dist   # Local overrides template
│   ├── params.php            # Application parameters
│   ├── preinit.php           # Pre-initialization constants
│   └── bootstrap.php         # Bootstrap configuration
├── admin/
│   ├── main.php              # Admin panel configuration
│   ├── main-local.php.dist   # Admin local overrides
│   └── params.php            # Admin parameters
├── api/
│   ├── main.php              # API configuration
│   ├── main-local.php.dist   # API local overrides
│   ├── params.php            # API parameters
│   └── url-manager-rules.php # API URL rules
├── console/
│   ├── main.php              # Console configuration
│   ├── main-local.php.dist   # Console local overrides
│   └── params.php            # Console parameters
└── environments/
    ├── dev/                  # Development environment
    │   ├── admin/
    │   ├── api/
    │   ├── console/
    │   └── common/
    ├── prod/                 # Production environment
    │   ├── admin/
    │   ├── api/
    │   ├── console/
    │   └── common/
    └── test/                 # Testing environment
        ├── admin/
        ├── api/
        ├── console/
        └── common/
```

### **Configuration Loading Order**
1. **Pre-initialization**: `common/config/preinit.php`
2. **Environment constants**: `common/config/preinit.environment.php`
3. **Base configuration**: `common/config/main.php`
4. **Local overrides**: `common/config/main-local.php`
5. **Application-specific**: `{app}/config/main.php`
6. **Application local**: `{app}/config/main-local.php`
7. **Environment-specific**: `environments/{env}/{app}/config/main-local.php`

## Environment Setup

### **Development Environment**
```bash
# Copy environment files
cp common/config/main-local.php.dist common/config/main-local.php
cp admin/config/main-local.php.dist admin/config/main-local.php
cp api/config/main-local.php.dist api/config/main-local.php
cp console/config/main-local.php.dist console/config/main-local.php

# Copy environment-specific files
cp -r environments/dev/* ./
```

### **Production Environment**
```bash
# Copy production environment files
cp -r environments/prod/* ./

# Disable debug and gii modules
# Remove or comment out debug/gii module configurations
```

### **Environment Variables**
```bash
# Set environment variables
export YII_ENV=prod
export YII_DEBUG=false

# Or use environment files
source .env
```

## Configuration Best Practices

### **Security**
1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Restrict debug/gii access** to development IPs only
4. **Use different keys** for each environment

### **Performance**
1. **Enable caching** in production
2. **Disable debug** in production
3. **Use appropriate log levels**
4. **Configure database connections** properly

### **Maintenance**
1. **Document configuration changes**
2. **Use version control** for configuration templates
3. **Test configuration** in staging environment
4. **Backup configuration** files regularly

---

*This comprehensive configuration documentation provides complete coverage of the Rahvaraamat configuration system, including file hierarchy, environment variables, database connections, cache settings, mail configuration, and debug/gii module management.* 
