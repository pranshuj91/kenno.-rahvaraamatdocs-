id: CORE_MODELS
title: CORE MODELS
#Project Login Flow-/-Core Model Documentation

![Login Flow](/img/login-flow.png)
## Project Login Flow Documentation

## Normal Login Flow

1. **User Accesses Login Page**
   - Navigates to the application's login URL.
   - Presented with email/password form.
   - For users with multiple roles, a role selection dropdown is shown.

2. **Credential Submission**
   - User enters registered email and password.
   - Optionally selects a role if multiple roles are associated with the user.
   - Submits the form.

3. **Server-Side Validation**
   - The system verifies the email exists and the account is active.
   - Password is checked against a securely stored hash.
   - If a role is selected, it is validated to ensure the user is allowed access.

4. **Authentication**
   - On successful validation, a session is created for the user.
   - Last login timestamp is updated.
   - User identity is established within the application context.

5. **Role-Based Redirect**
   - The system determines the appropriate dashboard based on the user's role.
   - User is redirected to their respective interface.

6. **Session Maintenance**
   - Future requests are authenticated through the session.
   - Access control is enforced according to the user's role.

## Important Points

### Security Features
- Passwords are hashed using SHA-512 with an application-defined salt.
- Password reset links use time-limited tokens.
- Email confirmation is handled with separate verification tokens.
- "Remember Me" functionality uses secure auth keys.
- Brute-force login attempts are mitigated with protection mechanisms.

### Role Management
- A single user may have multiple roles (e.g., Admin, Vendor).
- If multiple roles exist, the user must choose one during login.
- Each role defines distinct permissions within the system.
- Admin access requires an active status in the admin table.
- Vendor access requires an active status in the vendor users table.

### Account Status
- Only users with `is_activated = 1` are allowed to log in.
- Deleted accounts (determined by a `deleted_date` field) are blocked.
- The last login timestamp is automatically recorded.
- Password changes invalidate any active sessions for that user.

### Error Handling
- Generic login errors prevent attackers from enumerating valid accounts.
- Clear error messages are provided when role selection is necessary.
- Status-based errors are shown for inactive or deleted accounts.
- Validation errors are displayed for incorrect or malformed input.

### Internationalization
- All user-facing text supports translation (i18n).
- Each user’s language preference is stored and applied automatically.
- Error messages and system prompts are fully localized.

### Additional Features
- Password reset functionality using email-based tokens.
- Email verification is required for new user registrations.
- Login history is tracked for auditing and security purposes.
- Some users may be required to input a personal code for extra validation.

## Dummy Login: Master Role Emergency Access

This code snippet can be used to simulate a login for a specific user (e.g., master admin) without requiring password input. Useful for emergency access or debugging purposes.

```php
// Emergency login as master user (e.g., Admin ID: 206863)
$user = \common\models\User::findOne(206863);
if ($user) {
    // Force login without password check
    Yii::$app->user->login($user, 3600*24*30); // 30 days remember me

    // Log this emergency access
    Yii::warning("EMERGENCY ACCESS USED FOR USER ID: ".$user->id);

    // Redirect to appropriate admin dashboard or previous location
    return $this->goBack(LoginRedirectFactory::url());
}
```

> ⚠️ **Important:** Use this emergency access feature responsibly. Ensure audit logs are enabled and such entries are flagged for review.


















# Core Models Documentation

## Overview of `common/models/`

The `common/models/` directory contains all ActiveRecord models for the Rahvaraamat e-commerce backend. These models represent the core business entities and provide the data access layer for the application.

### Model Categories

#### **User Management Models**
- **`User.php`** - Main user accounts and authentication
- **`Admin.php`** - Administrative user accounts
- **`Vendor.php`** - Vendor/publisher accounts
- **`ClientAccount.php`** - Customer accounts (retail/wholesale/business)
- **`VendorUser.php`** - Vendor user associations
- **`UserDevice.php`** - User device tracking
- **`UserFailedLogin.php`** - Failed login attempts
- **`UserAdditionalAuthentication.php`** - Additional auth methods

#### **Product Management Models**
- **`Product.php`** - Main product catalog
- **`ProductAvailability.php`** - Stock availability
- **`ProductImage.php`** - Product images and media
- **`ProductComment.php`** - Product reviews
- **`ProductPerson.php`** - Authors, illustrators, contributors
- **`ProductPublisher.php`** - Publisher information
- **`ProductSeries.php`** - Product series and collections
- **`ProductCategory.php`** - Product-category relationships
- **`ProductBadge.php`** - Product badges and awards

#### **Order Management Models**
- **`Order.php`** - Main order records
- **`OrderProduct.php`** - Individual products in orders
- **`OrderProductDownload.php`** - Digital product downloads
- **`OrderVoucher.php`** - Vouchers applied to orders
- **`Payment.php`** - Payment transactions
- **`VoucherDiscountCode.php`** - Discount codes
- **`VoucherGiftCard.php`** - Gift card management

#### **Category Management Models**
- **`Category.php`** - Product categories
- **`CategoryGroup.php`** - Category groups
- **`CategoryTranslation.php`** - Multi-language category names
- **`CategoryTop.php`** - Featured categories

#### **Subscription Models**
- **`SubscriptionPlan.php`** - Subscription plans
- **`SubscriptionService.php`** - Subscription services
- **`SubscriptionStatistic.php`** - Subscription analytics
- **`SubscriptionProductRental.php`** - Product rentals

#### **Content Management Models**
- **`Banner.php`** - Banner advertisements
- **`News.php`** - News articles
- **`ContentPage.php`** - Static content pages
- **`SpecialOffer.php`** - Special offers and promotions

#### **System Models**
- **`Classifier.php`** - System classifiers
- **`ClassifierValue.php`** - Classifier values
- **`SystemState.php`** - System state and configuration
- **`Log.php`** - Application logs

## Model-to-Table Mapping

### Core Entity Mappings

| Model Class | Database Table | Description |
|-------------|----------------|-------------|
| `User` | `{{%user}}` | Main user accounts |
| `Product` | `{{%product}}` | Product catalog |
| `Order` | `{{%order}}` | Order records |
| `Vendor` | `{{%vendor}}` | Vendor/publisher accounts |
| `ClientAccount` | `{{%client_account}}` | Customer accounts |
| `Category` | `{{%category}}` | Product categories |
| `SubscriptionPlan` | `{{%subscription_plan}}` | Subscription plans |
| `Admin` | `{{%admin}}` | Administrative users |
| `VendorUser` | `{{%vendor_user}}` | Vendor user associations |
| `ProductPerson` | `{{%product_person}}` | Authors and contributors |
| `ProductPublisher` | `{{%product_publisher}}` | Publisher information |
| `ProductSeries` | `{{%product_series}}` | Product series |
| `ProductImage` | `{{%product_image}}` | Product images |
| `ProductComment` | `{{%product_comment}}` | Product reviews |
| `ProductAvailability` | `{{%product_availability}}` | Stock availability |
| `OrderProduct` | `{{%order_product}}` | Order line items |
| `Payment` | `{{%payment}}` | Payment transactions |
| `VoucherDiscountCode` | `{{%voucher_discount_code}}` | Discount codes |
| `VoucherGiftCard` | `{{%voucher_gift_card}}` | Gift cards |
| `Banner` | `{{%banner}}` | Banner advertisements |
| `News` | `{{%news}}` | News articles |
| `ContentPage` | `{{%content_page}}` | Static pages |
| `SpecialOffer` | `{{%special_offer}}` | Special offers |
| `Classifier` | `{{%classifier}}` | System classifiers |
| `ClassifierValue` | `{{%classifier_value}}` | Classifier values |
| `SystemState` | `{{%system_state}}` | System configuration |
| `Log` | `{{%log}}` | Application logs |

### Relationship Tables

| Model Class | Database Table | Description |
|-------------|----------------|-------------|
| `ProductCategory` | `{{%product_category}}` | Product-category relationships |
| `ProductProduct` | `{{%product_product}}` | Related products |
| `ProductProductPerson` | `{{%product_product_person}}` | Product-author relationships |
| `OrderVoucher` | `{{%order_voucher}}` | Order-voucher relationships |
| `WebStoreProduct` | `{{%web_store_product}}` | Store-product relationships |
| `WebStoreCategory` | `{{%web_store_category}}` | Store-category relationships |
| `SubscriptionPlanWebStore` | `{{%subscription_plan_web_store}}` | Plan-store relationships |

## Key Model Relationships

### User Hierarchy Relationships

```php
// User.php - Core user relationships
class User extends AdvancedActiveRecord implements IdentityInterface, UserRoleProvider
{
    // One-to-One Relationships
    public function getAdmin()
    {
        return $this->hasOne(Admin::class, ['user_id' => 'id']);
    }
    
    public function getRegistrationWebStore()
    {
        return $this->hasOne(WebStore::class, ['id' => 'registration_web_store_id']);
    }
    
    // One-to-Many Relationships
    public function getClientAccounts()
    {
        return $this->hasMany(ClientAccount::class, ['user_id' => 'id']);
    }
    
    public function getVendorUsers()
    {
        return $this->hasMany(VendorUser::class, ['user_id' => 'id']);
    }
    
    public function getApiPartners()
    {
        return $this->hasMany(ApiPartner::class, ['user_id' => 'id']);
    }
    
    public function getUserDevices()
    {
        return $this->hasMany(UserDevice::class, ['user_id' => 'id']);
    }
    
    public function getLogs()
    {
        return $this->hasMany(Log::class, ['user_id' => 'id']);
    }
}
```

### Product Relationships

```php
// Product.php - Complex product relationships
class Product extends AdvancedActiveRecord implements IEvaluatedProduct, IDropDownItem, ILeftoverStockProduct, ITypedProduct, IWebStoreCategorized, IDeliveredProduct
{
    // Core Relationships
    public function getVendor()
    {
        return $this->hasOne(Vendor::class, ['id' => 'vendor_id']);
    }
    
    public function getProductPublisher()
    {
        return $this->hasOne(ProductPublisher::class, ['id' => 'product_publisher_id']);
    }
    
    public function getSeries()
    {
        return $this->hasOne(ProductSeries::class, ['id' => 'series_id']);
    }
    
    // Many-to-Many Relationships
    public function getProductCategories()
    {
        return $this->hasMany(ProductCategory::class, ['product_id' => 'id']);
    }
    
    public function getCategories()
    {
        return $this->hasMany(Category::class, ['id' => 'category_id'])
            ->via('productCategories');
    }
    
    public function getProductProductPeople()
    {
        return $this->hasMany(ProductProductPerson::class, ['product_id' => 'id']);
    }
    
    public function getAuthors()
    {
        return $this->hasMany(ProductPerson::class, ['id' => 'product_person_id'])
            ->via('productProductPeople')
            ->andWhere(['product_product_person.role_type_id' => ClassifierValue::AUTHOR_ROLE_ID]);
    }
    
    public function getProductImages()
    {
        return $this->hasMany(ProductImage::class, ['product_id' => 'id']);
    }
    
    public function getProductComments()
    {
        return $this->hasMany(ProductComment::class, ['product_id' => 'id']);
    }
    
    public function getProductAvailabilities()
    {
        return $this->hasMany(ProductAvailability::class, ['product_id' => 'id']);
    }
    
    public function getOrderProducts()
    {
        return $this->hasMany(OrderProduct::class, ['product_id' => 'id']);
    }
    
    public function getWebStoreProducts()
    {
        return $this->hasMany(WebStoreProduct::class, ['product_id' => 'id']);
    }
    
    public function getWebStores()
    {
        return $this->hasMany(WebStore::class, ['id' => 'web_store_id'])
            ->via('webStoreProducts');
    }
}
```

### Order Relationships

```php
// Order.php - Order management relationships
class Order extends AdvancedActiveRecord
{
    // Core Relationships
    public function getClientAccount()
    {
        return $this->hasOne(ClientAccount::class, ['id' => 'client_account_id']);
    }
    
    public function getWebStore()
    {
        return $this->hasOne(WebStore::class, ['id' => 'web_store_id']);
    }
    
    public function getStatusType()
    {
        return $this->hasOne(ClassifierValue::class, ['id' => 'status_type_id']);
    }
    
    public function getPaymentType()
    {
        return $this->hasOne(ClassifierValue::class, ['id' => 'payment_type_id']);
    }
    
    public function getShippingType()
    {
        return $this->hasOne(ClassifierValue::class, ['id' => 'shipping_type_id']);
    }
    
    // One-to-Many Relationships
    public function getOrderProducts()
    {
        return $this->hasMany(OrderProduct::class, ['order_id' => 'id']);
    }
    
    public function getOrderVouchers()
    {
        return $this->hasMany(OrderVoucher::class, ['order_id' => 'id']);
    }
    
    public function getPayments()
    {
        return $this->hasMany(Payment::class, ['order_id' => 'id']);
    }
    
    public function getOrderNotes()
    {
        return $this->hasMany(OrderNote::class, ['order_id' => 'id']);
    }
}
```

### Category Relationships

```php
// Category.php - Category hierarchy relationships
class Category extends AdvancedActiveRecord
{
    // Self-Referencing Relationship (Hierarchy)
    public function getParent()
    {
        return $this->hasOne(Category::class, ['id' => 'parent_id']);
    }
    
    public function getChildren()
    {
        return $this->hasMany(Category::class, ['parent_id' => 'id']);
    }
    
    // Many-to-Many Relationships
    public function getProductCategories()
    {
        return $this->hasMany(ProductCategory::class, ['category_id' => 'id']);
    }
    
    public function getProducts()
    {
        return $this->hasMany(Product::class, ['id' => 'product_id'])
            ->via('productCategories');
    }
    
    public function getCategoryTranslations()
    {
        return $this->hasMany(CategoryTranslation::class, ['category_id' => 'id']);
    }
    
    public function getCategoryGroup()
    {
        return $this->hasOne(CategoryGroup::class, ['id' => 'category_group_id']);
    }
}
```

## Model Behaviors

### Common Behaviors

#### **TimestampBehavior**
Automatically manages `created` and `updated` timestamps.

```php
public function behaviors()
{
    return [
        [
            'class' => TimestampBehavior::class,
            'createdAtAttribute' => 'created',
            'updatedAtAttribute' => 'updated',
            'value' => new Expression('NOW()'),
        ],
    ];
}
```

#### **UserBehaviour**
Automatically tracks `created_by` and `updated_by` user IDs.

```php
public function behaviors()
{
    return [
        [
            'class' => UserBehaviour::class,
            'createdByAttribute' => 'created_by',
            'updatedByAttribute' => 'updated_by',
        ],
    ];
}
```

#### **SoftDeleteBehavior**
Implements soft delete functionality instead of hard delete.

```php
public function behaviors()
{
    return [
        [
            'class' => SoftDeleteBehavior::class,
            'softDeleteAttributeValues' => [
                'deleted' => new Expression('NOW()'),
                'deleted_by' => Yii::$app->user->getId(),
            ],
            'replaceRegularDelete' => true
        ],
    ];
}
```

### Specialized Behaviors

#### **FileBehavior** (Product Images)
Manages file uploads and storage for product images.

```php
// Product.php
public function behaviors()
{
    return [
        'thumbnailImageFile' => [
            'class' => ImageFileBehavior::class,
            'attribute' => 'thumbnail_image',
            'fileStorage' => 'fileStorage',
            'bucket' => 'rahvaraamat-staging-product',
            'subDir' => 'thumbnails',
            'extensions' => ['jpg', 'jpeg', 'png', 'gif'],
            'maxSize' => 5 * 1024 * 1024, // 5MB
        ],
        'audioPreviewFile' => [
            'class' => FileBehavior::class,
            'attribute' => 'audio_preview_file_name',
            'fileStorage' => 'europeRegionFileStorage',
            'bucket' => 'audio-books-staging',
            'subDir' => 'previews',
            'extensions' => ['mp3'],
            'maxSize' => 10 * 1024 * 1024, // 10MB
        ],
    ];
}
```

#### **ElasticSpoolBehavior** (Product Search)
Manages Elasticsearch indexing for product search.

```php
// Product.php
public function behaviors()
{
    return [
        'elasticSpoolBehavior' => [
            'class' => ElasticSpoolBehavior::class,
            'spoolTable' => '{{%spool_item}}',
            'spoolType' => 'product',
            'spoolAction' => 'index',
        ],
    ];
}
```

#### **MultilingualBehavior** (Translations)
Handles multi-language content for categories, products, etc.

```php
// SubscriptionPlan.php
public function behaviors()
{
    return [
        [
            'class' => MultilingualBehavior::class,
            'languages' => LanguageEnum::appLanguageMap(),
            'langClassName' => SubscriptionPlanTranslation::class,
            'defaultLanguage' => 'et',
            'langForeignKey' => 'subscription_plan_id',
            'tableName' => SubscriptionPlanTranslation::tableName(),
            'requireTranslations' => false,
            'attributes' => ['title']
        ],
    ];
}
```

#### **VisibleContentUpdateTimestampBehavior** (Product Updates)
Tracks when visible content changes for cache invalidation.

```php
// Product.php
public function behaviors()
{
    return [
        [
            'class' => VisibleContentUpdateTimestampBehavior::class,
            'visibleAttributes' => [
                'name', 'thumbnail_image_version', 'year', 'series_id',
                'vendor_id', 'product_publisher_id', 'isbn', 'ean',
                'price_shop', 'price_campaign', 'description',
                'description_special', 'description_image_version',
                'pages', 'height', 'width', 'depth', 'weight',
                'is_active', 'is_public_web_disabled', 'meta_title',
                'meta_description', 'status_type_id'
            ]
        ],
    ];
}
```

## Model Traits

### **LogTrait**
Provides logging functionality for model operations.

```php
// User.php, Product.php, Order.php
use common\traits\LogTrait;

class User extends AdvancedActiveRecord
{
    use LogTrait;
    
    // Automatically logs model changes
}
```

### **SoftDeleteAllTrait**
Provides comprehensive soft delete functionality.

```php
// User.php, UserDevice.php
use common\traits\SoftDeleteAllTrait;

class User extends AdvancedActiveRecord
{
    use SoftDeleteAllTrait;
    
    // Enhanced soft delete with related record handling
}
```

## Model Interfaces

### **IdentityInterface** (User Authentication)
```php
// User.php
class User extends AdvancedActiveRecord implements IdentityInterface
{
    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id, 'is_activated' => 1]);
    }
    
    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['auth_key' => $token, 'is_activated' => 1]);
    }
    
    public function getId()
    {
        return $this->getPrimaryKey();
    }
    
    public function getAuthKey()
    {
        return $this->auth_key;
    }
    
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }
}
```

### **UserRoleProvider** (Role Management)
```php
// User.php
class User extends AdvancedActiveRecord implements UserRoleProvider
{
    public function getRoles()
    {
        if ($this->roles === null) {
            $this->roles = [];
            
            if ($this->admin) {
                $this->roles[] = 'admin';
            }
            
            if ($this->vendorUsers) {
                $this->roles[] = 'vendor';
            }
            
            if ($this->clientAccounts) {
                $this->roles[] = 'customer';
            }
        }
        
        return $this->roles;
    }
}
```

### **IEvaluatedProduct** (Product Pricing)
```php
// Product.php
class Product extends AdvancedActiveRecord implements IEvaluatedProduct
{
    public function getPriceCalculationManager(): ProductPriceCalculationManager
    {
        return new ProductPriceCalculationManager($this);
    }
    
    public function getId(): int
    {
        return $this->id;
    }
    
    public function getLabel()
    {
        return $this->name;
    }
}
```

## Model Query Classes

### **Custom Query Classes**
Each model has a corresponding query class in `common/models/queries/` that extends `ActiveQuery`:

```php
// common/models/queries/UserQuery.php
class UserQuery extends ActiveQuery
{
    public function active()
    {
        return $this->andWhere(['is_activated' => 1]);
    }
    
    public function system()
    {
        return $this->andWhere(['id' => 1]);
    }
    
    public function byEmail($email)
    {
        return $this->andWhere(['email' => $email]);
    }
}

// common/models/queries/ProductQuery.php
class ProductQuery extends ActiveQuery
{
    public function active()
    {
        return $this->andWhere(['is_active' => 1]);
    }
    
    public function byCategory($categoryId)
    {
        return $this->joinWith('productCategories')
            ->andWhere(['product_category.category_id' => $categoryId]);
    }
    
    public function byVendor($vendorId)
    {
        return $this->andWhere(['vendor_id' => $vendorId]);
    }
    
    public function inStock()
    {
        return $this->joinWith('productAvailabilities')
            ->andWhere(['>', 'product_availability.amount_available', 0]);
    }
}
```

### **Usage Examples**
```php
// Find active users
$activeUsers = User::find()->active()->all();

// Find products in a specific category
$categoryProducts = Product::find()->byCategory($categoryId)->active()->all();

// Find orders for a specific customer
$customerOrders = Order::find()->where(['client_account_id' => $customerId])->all();

// Find products by vendor with stock
$vendorProducts = Product::find()->byVendor($vendorId)->inStock()->all();
```

## Model Validation Rules

### **Common Validation Patterns**

#### **User Validation**
```php
// User.php
public function rules()
{
    return [
        [['name', 'email'], 'required'],
        [['email'], 'email'],
        [['email'], 'unique'],
        [['personal_id_code'], PersonalCodeValidator::class],
        [['is_activated', 'is_id_card_activated'], 'boolean'],
        [['created', 'updated', 'last_login_date'], 'safe'],
        [['created_by', 'updated_by'], 'integer'],
        [['name', 'email', 'display_name'], 'string', 'max' => 255],
        [['personal_id_code'], 'string', 'max' => 11],
    ];
}
```

#### **Product Validation**
```php
// Product.php
public function rules()
{
    return [
        [['name', 'type_id'], 'required'],
        [['type_id', 'series_id', 'vendor_id', 'product_publisher_id'], 'integer'],
        [['price_shop', 'price_campaign', 'price_wholesale'], 'number'],
        [['isbn', 'ean'], 'string', 'max' => 20],
        [['name', 'alternative_names'], 'string', 'max' => 500],
        [['description', 'description_special'], 'string'],
        [['is_active', 'is_public_web_disabled'], 'boolean'],
        [['year'], 'integer', 'min' => 1900, 'max' => date('Y') + 10],
        [['pages', 'height', 'width', 'depth', 'weight'], 'integer', 'min' => 0],
    ];
}
```

#### **Order Validation**
```php
// Order.php
public function rules()
{
    return [
        [['client_account_id', 'payment_type_id', 'shipping_type_id', 'status_type_id'], 'required'],
        [['price', 'delivery_price'], 'number'],
        [['is_tracked', 'is_feedback_generated'], 'boolean'],
        [['reference_number'], 'string', 'max' => 50],
        [['shipping_name', 'billing_name', 'selling_name'], 'string', 'max' => 255],
        [['shipping_email', 'billing_email', 'selling_email'], 'email'],
        [['shipping_phone', 'billing_phone'], 'string', 'max' => 25],
        [['shipping_address', 'billing_address', 'selling_address'], 'string', 'max' => 500],
        [['shipping_city', 'billing_city', 'selling_city'], 'string', 'max' => 100],
        [['shipping_postcode', 'billing_postcode', 'selling_postcode'], 'string', 'max' => 10],
        [['notes'], 'string'],
        [['language'], 'string', 'max' => 5],
    ];
}
```

## Model Scenarios

### **Custom Scenarios**
Models define custom scenarios for different use cases:

```php
// User.php
public function scenarios()
{
    $scenarios = parent::scenarios();
    $scenarios[self::SCENARIO_REST_UPDATE] = [
        'display_name',
        'name',
        'personal_id_code'
    ];
    return $scenarios;
}

// Vendor.php
public const SCENARIO_INSERT = 'insert';
public const SCENARIO_UPDATE = 'update';

public function rules()
{
    return [
        [
            ['vendor_name'],
            'unique', 'on' => [self::SCENARIO_INSERT, self::SCENARIO_UPDATE],
            'message' => Yii::t('RrVendor', 'Selline hankija on juba loodud!')
        ],
        [
            ['nav_vendor_code'],
            'unique', 'on' => [self::SCENARIO_INSERT, self::SCENARIO_UPDATE],
            'message' => Yii::t('RrVendor', 'Sellise hankija numbriga hankija on juba olemas!')
        ],
    ];
}
```

## Model Events

### **Lifecycle Events**
Models implement various lifecycle events:

```php
// User.php
public function afterLogin()
{
    $this->last_login_date = new Expression("NOW()");
    $this->save(false, ['last_login_date']);
}

// Product.php
public function afterSave($insert, $changedAttributes)
{
    parent::afterSave($insert, $changedAttributes);
    
    // Trigger Elasticsearch indexing
    if (!$insert && $this->hasVisibleContentChanged($changedAttributes)) {
        $this->triggerElasticSpool();
    }
}

// Order.php
public function beforeSave($insert)
{
    if (parent::beforeSave($insert)) {
        if ($insert) {
            $this->setDefaultAttributeValues();
        }
        return true;
    }
    return false;
}
```

## Model Methods

### **Business Logic Methods**

#### **User Methods**
```php
// User.php
public function validatePassword(string $password): bool
{
    return Yii::$app->security->validatePassword($password, $this->password_hash);
}

public function setPassword(string $password): void
{
    $this->password_hash = $this->getPasswordHash($password);
}

public function generateAuthKey(): void
{
    $this->auth_key = Yii::$app->security->generateRandomString();
}

public function generatePasswordResetToken(): void
{
    $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
}

public function isBirthdayWeek(): bool
{
    if (!$this->personal_id_code) {
        return false;
    }
    
    $birthday = $this->getBirthday();
    if (!$birthday) {
        return false;
    }
    
    $birthdayDate = new DateTime($birthday);
    $now = new DateTime();
    $birthdayThisYear = new DateTime($now->format('Y') . '-' . $birthdayDate->format('m-d'));
    
    return $birthdayThisYear->diff($now)->days <= 7;
}
```

#### **Product Methods**
```php
// Product.php
public function isVirtual(): bool
{
    return $this->type_id === ClassifierValue::PRODUCT_TYPE_VIRTUAL_GIFT_CARD;
}

public function isGiftCard(): bool
{
    return $this->type_id === ClassifierValue::PRODUCT_TYPE_GIFT_CARD;
}

public function isEbook(): bool
{
    return $this->type_id === ClassifierValue::PRODUCT_TYPE_EBOOK;
}

public function isBook(): bool
{
    return $this->type_id === ClassifierValue::PRODUCT_TYPE_BOOK;
}

public function isAudioBook(): bool
{
    return $this->type_id === ClassifierValue::PRODUCT_TYPE_AUDIOBOOK;
}

public function isDeliverable(): bool
{
    return !$this->isVirtual() && !$this->isEbook() && !$this->isAudioBook();
}

public function isInStock(int $shopId, $stockCount = null): bool
{
    if ($stockCount !== null) {
        return $stockCount > 0;
    }
    
    $availability = $this->getProductAvailabilities()
        ->andWhere(['shop_id' => $shopId])
        ->one();
    
    return $availability && $availability->amount_available > 0;
}

public function getCalculatedPriceDiscountPercent($clientDiscount = 0): int
{
    return $this->getPriceCalculationManager()->getCalculatedPriceDiscountPercent($clientDiscount);
}

public function getAuthorsInPrimaryOrder(): array
{
    return $this->getProductProductPeople()
        ->joinWith('productPerson')
        ->andWhere(['product_product_person.role_type_id' => ClassifierValue::AUTHOR_ROLE_ID])
        ->orderBy(['product_product_person.primary_order' => SORT_ASC])
        ->all();
}
```

#### **Order Methods**
```php
// Order.php
public function isFailed(): bool
{
    return $this->status_type_id === PaymentStatusEnum::FAILED;
}

public function isGuestOrder(): bool
{
    return empty($this->client_account_id);
}

public function isOrderWithoutBankPayment(): bool
{
    return $this->payment_type_id === ClassifierValue::PAYMENT_TYPE_CASH_ON_DELIVERY ||
           $this->payment_type_id === ClassifierValue::PAYMENT_TYPE_CASH_IN_SHOP;
}

public function isProcessedOrder(): bool
{
    return $this->status_type_id === PaymentStatusEnum::PROCESSED;
}

public function isPendingPayment(): bool
{
    return $this->status_type_id === PaymentStatusEnum::PENDING_PAYMENT;
}

public function markAsPendingPayment()
{
    $this->status_type_id = PaymentStatusEnum::PENDING_PAYMENT;
    $this->save(false, ['status_type_id']);
}

public function markOrderPaid()
{
    $this->status_type_id = PaymentStatusEnum::PAID;
    $this->posted_datetime = new Expression('NOW()');
    $this->save(false, ['status_type_id', 'posted_datetime']);
}

public function getFinalPrice(): float
{
    $price = $this->price ?? 0;
    $deliveryPrice = $this->delivery_price ?? 0;
    $voucherAmount = $this->voucher_gift_card_amount ?? 0;
    
    return $price + $deliveryPrice - $voucherAmount;
}
```

## Model Constants

### **Status Constants**
```php
// User.php
public const SCENARIO_REST_UPDATE = 'rest-update';

// Vendor.php
public const DEFAULT_RETAIL_COEFFICIENT = 1.76;
public const DEFAULT_WHOLESALE_COEFFICIENT = 1.28;
public const SCENARIO_INSERT = 'insert';
public const SCENARIO_UPDATE = 'update';

// Order.php
public const LAST_DUMP_ORDER_DATETIME = '2021-04-27 17:09:24';
public const MISSING_ORDERS = ['WT1035358'];
```

---

*This comprehensive documentation provides a complete overview of the core models in the Rahvaraamat e-commerce backend, including their relationships, behaviors, and key functionality.* 
