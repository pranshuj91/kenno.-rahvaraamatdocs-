id: SECURITY
title: SECURITY
# Security

## Secure Configuration

### **Global Security Parameters**

#### **Global Salt Configuration** (`common/config/params.php`)
```php
'globalSalt' => 'd9pAxeSPaFr2Xu3E',
```

#### **Cookie Validation Keys**
```php
// Admin Panel
'cookieValidationKey' => 'your-admin-cookie-validation-key',

// API
'cookieValidationKey' => 'your-api-cookie-validation-key',

// OIDC
'cookieValidationKey' => 'your-oidc-cookie-validation-key',

// Hotline
'cookieValidationKey' => 'your-hotline-cookie-validation-key',
```

### **CSRF Protection**

#### **Admin Panel CSRF**
```php
'request' => [
    'csrfParam' => '_csrf-admin',
    'baseUrl' => '/admin-panel',
],
```

#### **API CSRF Configuration**
```php
'request' => [
    'enableCookieValidation' => false,
    'enableCsrfCookie' => false,
    'baseUrl' => '',
    'parsers' => [
        'application/json' => 'yii\web\JsonParser',
    ],
],
```

#### **OIDC CSRF Configuration**
```php
'request' => [
    'csrfParam' => '_csrf-oidc',
    'baseUrl' => '/oidc',
],
```

### **Session Security**

#### **Admin Panel Session**
```php
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
```

#### **API Session**
```php
'user' => [
    'identityClass' => 'api\models\UserWebStoreClientAccount',
    'enableAutoLogin' => false,
    'enableSession' => false,
],
'session' => [
    'name' => 'advanced-api',
],
```

#### **OIDC Session**
```php
'user' => [
    'class' => UserComponent::class,
    'identityClass' => User::class,
    'enableAutoLogin' => false,
    'authTimeout' => 60 * 60 * 6, // 6h
    'identityCookie' => ['name' => '_identity-oidc', 'httpOnly' => true],
],
'session' => [
    'name' => 'advanced-oidc',
],
```

### **JWT Token Security**

#### **Authorization Token Manager** (`api/components/AuthorizationTokenManager.php`)
```php
class AuthorizationTokenManager
{
    private string $apiSalt = 'private_string';
    public $algorithm = 'HS512';

    public function createAuthToken(User $user, ClientAccount $clientAccount, WebStore $webStore = null): string
    {
        $tokenData = [
            'iss' => $user->id, // Issuer
            'client' => $clientAccount->id,
            'store' => $webStore->id ?? null,
            'aud' => Yii::$app->request->getUserHost(), // Audience
            'iat' => time(), // Issued At
            'nbf' => time(), // Not Before
        ];

        return JWT::encode($tokenData, $this->apiSalt, $this->algorithm);
    }
}
```

#### **STACC Token Security** (`api/modules/stacc/components/StaccAuthorizationTokenManager.php`)
```php
class StaccAuthorizationTokenManager
{
    private string $apiSalt = 'private_string';
    public $algorithm = 'HS512';

    public function createAuthToken(StaccUser $user)
    {
        $tokenData = [
            'iss' => $user->id, // Issuer
            'ip' => $user->ip,
            'aud' => Yii::$app->request->getUserHost(), // Audience
            'iat' => time(), // Issued At
            'nbf' => time(), // Not Before
        ];

        return JWT::encode($tokenData, $this->apiSalt, $this->algorithm);
    }
}
```

### **OAuth2 Security**

#### **OIDC Module Configuration** (`oidc/config/oidc-module.php`)
```php
return [
    'class' => Oauth2Module::class,
    'identityClass' => User::class,
    'privateKey' => 'file://' . Yii::getAlias('@keys/openid-connect-private.key'),
    'publicKey' => 'file://' . Yii::getAlias('@keys/openid-connect-public.key'),
    'privateKeyPassphrase' => getenv('YII2_OAUTH2_SERVER_PRIVATE_KEY_PASSPHRASE'),
    'codesEncryptionKey' => getenv('YII2_OAUTH2_SERVER_CODES_ENCRYPTION_KEY'),
    'storageEncryptionKeys' => [
        '2024-01-01' => getenv('YII2_OAUTH2_SERVER_STORAGE_ENCRYPTION_KEY'),
    ],
    'defaultStorageEncryptionKey' => '2024-01-01',
    'defaultAccessTokenTTL' => 'P1D',
    'grantTypes' => [
        Oauth2BaseModule::GRANT_TYPE_AUTH_CODE,
        Oauth2BaseModule::GRANT_TYPE_REFRESH_TOKEN,
    ],
    'enableOpenIdConnect' => true,
    'openIdConnectRpInitiatedLogoutEndpoint' => true,
];
```

### **Basic Authentication**

#### **STACC Basic Auth** (`api/modules/stacc/controllers/BaseController.php`)
```php
public function behaviors()
{
    $behaviors = parent::behaviors();
    $behaviors['basicAuth'] = [
        'class' => HttpBasicAuth::class,
        'auth' => function ($username, $password) {
            $user = StaccUser::find()->where(['user_name' => $username, 'is_active' => true])->one();
            if ($user && $user->validatePassword($password) && $user->validateIp(Yii::$app->request->getUserIP())) {
                return $user;
            }
            return null;
        },
    ];

    return $behaviors;
}
```

### **IP Access Control**

#### **Swagger API Access Control** (`api/modules/stacc/controllers/SwaggerController.php`)
```php
public function behaviors()
{
    return [
        'access' => [
            'class' => AccessControl::class,
            'only' => ['api-docs', 'api-json'],
            'rules' => [
                [
                    'ips' => [
                        '127.0.0.1',
                        '::1',
                        '37.120.141.158',
                        // STACC IP addresses
                        '193.40.10.242',
                        '52.51.195.68',
                        // Security audit company
                        '88.196.134.147',
                    ],
                    'allow' => true,
                ],
            ],
            'denyCallback' => function () {
                throw new ForbiddenHttpException(Yii::t('yii', 'You are not allowed to perform this action.'));
            }
        ]
    ];
}
```

## User Data Protection

### **Password Security**

#### **Password Hashing Algorithm**
```php
protected function getPasswordHash(string $password)
{
    return hash('sha512', sprintf('%s-%s-%s', 
        Yii::$app->params['globalSalt'], 
        $password, 
        null
    ));
}
```

#### **Password Validation**
```php
public function validatePassword(string $password)
{
    return $this->getPasswordHash($password) === $this->password_hash;
}
```

#### **Password Setting**
```php
public function setPassword(string $password)
{
    $this->password_hash = $this->getPasswordHash($password);
}
```

### **Personal Data Protection**

#### **Personal ID Code Handling**
```php
// User model with personal ID code
'personal_id_code' => $userData['personal_id_code'],
```

#### **GDPR Data Deletion**
```php
// Admin panel data deletion endpoint
'POST /user/delete-data/{userId}' - Delete user data (GDPR compliance)
```

#### **Privacy Page Management**
```php
// Privacy page content management
ContentPage::PRIVACY_PAGE = 'PRIVACY';

public static function getPrivacyPages()
{
    return self::find()->where(['content_page_type' => self::PRIVACY_PAGE]);
}
```

### **Data Encryption**

#### **User Pass Phrase Encryption**
```php
'userPassPhraseEncryptionPublicKeyPath' => Yii::getAlias("@common/config/keys/public.pem"),
```

#### **LCP (License Content Protection)**
```php
'lcp' => [
    'X509PemCertPath' => '/path/to/cert.pem',
    'pemPrivateKeyPath' => '/path/to/privkey.pem',
    'userPassPhraseEncryptionPublicKeyPath' => '/path/to/public.key'
],
```

#### **Payment Security**
```php
'everypay' => [
    'username' => 'your-everypay-username',
    'secret' => 'your-everypay-secret',
    'accountName' => 'your-account-name',
    'testMode' => true,
    'merchantIP' => '217.146.69.5',
],
```

### **File Storage Security**

#### **AWS S3 Bucket Security**
```php
'awsS3' => [
    'publicBucket' => 'uus-rahvaraamat-staging-public',
    'privateBucket' => 'uus-rahvaraamat-staging-private',
    'bucketMap' => [
        // Private buckets use "-private" postfix
        \common\models\Product::class.'_private' => 'rahvaraamat-staging-product-private',
        \common\models\OrderProduct::class.'_private' => 'rahvaraamat-staging-order-product-private',
        \common\models\ProductAudiobookChapter::class.'_private' => 'audio-books-staging-private',
    ]
],
```

#### **Protected Files Directory**
```php
// Name for protected file directory
defined('PROTECTED_FILES_DIRNAME') || define('PROTECTED_FILES_DIRNAME', 'files');
```

### **Data Anonymization**

#### **User Data Obfuscation**
```php
// API obfuscation flag
defined('API_OBFUSCATE_USER_DATA') || define('API_OBFUSCATE_USER_DATA', false);
```

#### **Facebook Conversion Tracking**
```php
// Don't pass personal user data for guest accounts
// don't pass personal user data for guest accounts
```

## Common Security Practices

### **Input Validation**

#### **Model Validation Rules**
```php
public function rules()
{
    return [
        [['log_time', 'category', 'level', 'message'], 'required'],
        [['log_time'], 'safe'],
        [['user_id'], 'integer'],
        [['message', 'prefix'], 'string'],
        [['category', 'level'], 'string', 'max' => 128],
        [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['user_id' => 'id']],
    ];
}
```

#### **API Input Validation**
```php
// Form validation with error codes
'code' => 'VALIDATION_ERROR',
'message' => 'Validation failed',
```

### **SQL Injection Prevention**

#### **ActiveRecord Usage**
```php
// Use parameterized queries
$products = Product::find()
    ->where(['category_id' => $categoryId])
    ->andWhere(['like', 'name', $searchTerm])
    ->all();
```

#### **Raw Query Security**
```php
// Use prepared statements for raw queries
$products = Yii::$app->db->createCommand(
    'SELECT * FROM product WHERE category_id = :category_id AND price > :min_price'
)
->bindParam(':category_id', $categoryId)
->bindParam(':min_price', $minPrice)
->queryAll();
```

### **XSS Prevention**

#### **Output Encoding**
```php
// Escape output in views
<?= Html::encode($product->name) ?>

// Use ActiveForm for automatic escaping
<?= $form->field($model, 'name')->textInput() ?>

// Sanitize user input
$cleanDescription = Html::purify($userInput);
```

### **Access Control**

#### **Role-Based Access Control (RBAC)**
```php
// Define roles and permissions
public function behaviors(): array
{
    return [
        'access' => [
            'class' => AccessControl::class,
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['index', 'view'],
                    'roles' => ['?', '@'],
                ],
                [
                    'allow' => true,
                    'actions' => ['create', 'update', 'delete'],
                    'roles' => ['admin'],
                ],
            ],
        ],
    ];
}
```

#### **API Authentication**
```php
// JWT Token validation
public function behaviors()
{
    $behaviors = parent::behaviors();
    $behaviors['authenticator'] = [
        'class' => HttpBearerAuth::class,
    ];
    return $behaviors;
}
```

### **Error Handling**

#### **Secure Error Messages**
```php
// Don't expose sensitive information in error messages
'errorHandler' => [
    'errorAction' => 'site/error',
],
```

#### **Logging Security**
```php
// Log security events
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
                'yii\httpclient\*'
            ],
        ],
    ],
],
```

### **Environment Security**

#### **Development vs Production**
```php
// Disable debug in production
defined('YII_DEBUG') || define('YII_DEBUG', true);

// SSL configuration
defined('SSL_DISABLE') || define('SSL_DISABLE', false);
```

#### **Database Security**
```php
// SQL Server segfault prevention
defined('API_SQL_SERVER_SEGFAULT_TRUNCATE') || define('API_SQL_SERVER_SEGFAULT_TRUNCATE', false);
```

### **CORS Configuration**

#### **OIDC CORS Settings**
```php
$behaviors['corsFilter'] = [
    'class' => Cors::class,
    'cors' => [
        'Origin' => Yii::$app->params['corsOrigins'] ?? ['*'],
        'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        'Access-Control-Request-Headers' => ['*'],
        'Access-Control-Allow-Credentials' => true,
        'Access-Control-Max-Age' => 3600,
    ]
];
```

### **Session Security**

#### **Redis Session Storage**
```php
'session' => [
    'class' => 'yii\redis\Session',
    'redis' => [
        'hostname' => 'redis',
        'port' => 6379,
        'database' => 2,
    ],
    'cookieParams' => [
        'domain' => '.rahvaraamat.ee',
        'httpOnly' => false,
        'secure' => false,
        'path' => '/',
        'sameSite' => 'None',
    ],
],
```

### **Security Headers**

#### **Content Security Policy**
```php
// Register CSRF meta tags
<?php $this->registerCsrfMetaTags() ?>
```

### **Audit Trail**

#### **User Action Logging**
```php
// Log user actions with timestamps
'log_time' => date("Y-m-d H:i:s", (int)$timestamp),
'user_id' => Yii::$app->user->getId(),
'prefix' => $this->getMessagePrefix($message),
```

#### **Login Tracking**
```php
public function afterLogin()
{
    $this->last_login_date = date('Y-m-d H:i:s');
    $this->saveSafe(true, ['last_login_date']);
}
``` 
