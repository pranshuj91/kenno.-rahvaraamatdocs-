id: AUTHENTICATION_AUTHORIZATION
title: AUTHENTICATION AUTHORIZATION
# Authentication & Authorization

## User Roles

### **Role Hierarchy**

#### **Admin Roles**
```php
ROLE_ADMIN = 'admin'
├── ROLE_ADMIN_SUB_TYPE_MASTER = 'MASTER'
├── ROLE_ADMIN_SUB_TYPE_PURCHASING_MANAGER = 'ADMIN_PURCHASING_MANAGER'
├── ROLE_ADMIN_SUB_TYPE_EMPLOYEE = 'ADMIN_EMPLOYEE'
└── ROLE_ADMIN_SUB_TYPE_SELLER = 'ADMIN_SELLER'
```

#### **Vendor Roles**
```php
ROLE_VENDOR = 'vendor'
├── ROLE_VENDOR_SUB_TYPE_AUTHOR = 'AUTHOR'
├── ROLE_VENDOR_SUB_TYPE_EMPLOYEE = 'VENDOR_EMPLOYEE'
└── ROLE_VENDOR_SUB_TYPE_MASTER_USER = 'MASTER_USER'
```

#### **Client Roles**
```php
ROLE_CLIENT = 'client'
├── ROLE_CLIENT_SUB_TYPE_CUSTOMER = 'customer'
├── ROLE_CLIENT_SUB_TYPE_COMPANY_MASTER_USER = 'clientCompanyMasterUser'
├── ROLE_CLIENT_SUB_TYPE_WHOLESALE_MASTER_USER = 'clientWholesaleMasterUser'
├── ROLE_CLIENT_SUB_TYPE_COMPANY_EMPLOYEE = 'companyEmployee'
└── ROLE_CLIENT_SUB_TYPE_WHOLESALE_EMPLOYEE = 'wholesaleEmployee'
```

## RBAC Setup

### **Initialize RBAC System**
```bash
php yii rbac/init
```

### **Role Creation**
```php
// Admin roles
$admin = $auth->createRole(UserRoleEnum::ROLE_ADMIN);
$adminMaster = $auth->createRole(UserRoleEnum::ROLE_ADMIN_SUB_TYPE_MASTER);
$adminPurchasingManager = $auth->createRole(UserRoleEnum::ROLE_ADMIN_SUB_TYPE_PURCHASING_MANAGER);
$adminEmployee = $auth->createRole(UserRoleEnum::ROLE_ADMIN_SUB_TYPE_EMPLOYEE);
$adminSeller = $auth->createRole(UserRoleEnum::ROLE_ADMIN_SUB_TYPE_SELLER);

// Vendor roles
$vendor = $auth->createRole(UserRoleEnum::ROLE_VENDOR);
$vendorAuthor = $auth->createRole(UserRoleEnum::ROLE_VENDOR_SUB_TYPE_AUTHOR);
$vendorEmployee = $auth->createRole(UserRoleEnum::ROLE_VENDOR_SUB_TYPE_EMPLOYEE);
$vendorMaster = $auth->createRole(UserRoleEnum::ROLE_VENDOR_SUB_TYPE_MASTER_USER);

// Client roles
$client = $auth->createRole(UserRoleEnum::ROLE_CLIENT);
$customer = $auth->createRole(UserRoleEnum::ROLE_CLIENT_SUB_TYPE_CUSTOMER);
$companyMaster = $auth->createRole(UserRoleEnum::ROLE_CLIENT_SUB_TYPE_COMPANY_MASTER_USER);
$wholeSaleMaster = $auth->createRole(UserRoleEnum::ROLE_CLIENT_SUB_TYPE_WHOLESALE_MASTER_USER);
$wholeSaleEmployee = $auth->createRole(UserRoleEnum::ROLE_CLIENT_SUB_TYPE_WHOLESALE_EMPLOYEE);
$companyEmployee = $auth->createRole(UserRoleEnum::ROLE_CLIENT_SUB_TYPE_COMPANY_EMPLOYEE);
```

### **Permission Creation**
```php
// Core permissions
$orderManagement = $auth->createPermission('orderManagement');
$adminManagement = $auth->createPermission('adminManagement');
$settingsManagement = $auth->createPermission('settingsManagement');
$discountCodeManagement = $auth->createPermission('discountCodeManagement');
$recommendationManagement = $auth->createPermission('recommendationManagement');
$specialListManagement = $auth->createPermission('specialListManagement');
$logManagement = $auth->createPermission('logManagement');
$userManagement = $auth->createPermission('userManagement');
$businessClientManagement = $auth->createPermission('businessClientManagement');
$wholesaleClientManagement = $auth->createPermission('wholesaleClientManagement');
$vendorUserManagement = $auth->createPermission('vendorUserManagement');
$adminUserManagement = $auth->createPermission('adminUserManagement');
$contentManagement = $auth->createPermission('contentManagement');
$vendorManagement = $auth->createPermission('vendorManagement');
$vendorSettingsManagement = $auth->createPermission('vendorSettingsManagement');
$debugManagement = $auth->createPermission('debugManagement');

// Product permissions
$productCatalogueManagement = $auth->createPermission('productCatalogueManagement');
$categoryManagement = $auth->createPermission('categoryManagement');
$subCategoryManagement = $auth->createPermission('subCategoryManagement');
$productManagement = $auth->createPermission('productManagement');
$productInfoUploadManagement = $auth->createPermission('productInfoUploadManagement');
$giftCardManagement = $auth->createPermission('giftCardManagement');
$commentManagement = $auth->createPermission('commentManagement');
$shopManagement = $auth->createPermission('shopManagement');

// Vendor permissions
$vendorStatisticsManagement = $auth->createPermission('vendorStatisticsManagement');
$vendorOrderManagement = $auth->createPermission('vendorOrderManagement');
$vendorProductManagement = $auth->createPermission('vendorProductManagement');
$vendorOrderInsertManagement = $auth->createPermission('vendorOrderInsertManagement');

// Client permissions
$userDetailsManagement = $auth->createPermission('userDetailsManagement');
$userFavoritesManagement = $auth->createPermission('userFavoritesManagement');
$companyEmployeeManagement = $auth->createPermission('companyEmployeeManagement');
$subWholesaleManagement = $auth->createPermission('subWholesaleManagement');
$companyManagement = $auth->createPermission('companyManagement');

// Reseller permissions
$resellerEdit = $auth->createPermission('resellerEdit');
$resellerProducts = $auth->createPermission('resellerProducts');
$resellerOrders = $auth->createPermission('resellerOrders');
$resellerUsers = $auth->createPermission('resellerUsers');
$partnerUsers = $auth->createPermission('partnerUsers');
$partnerOrders = $auth->createPermission('partnerOrders');
```

### **Role-Permission Assignment**

#### **Admin Master Permissions**
```php
$auth->addChild($adminMaster, $debugManagement);
$auth->addChild($adminMaster, $settingsManagement);
$auth->addChild($adminMaster, $discountCodeManagement);
$auth->addChild($adminMaster, $recommendationManagement);
$auth->addChild($adminMaster, $specialListManagement);
$auth->addChild($adminMaster, $logManagement);
$auth->addChild($adminMaster, $userManagement);
$auth->addChild($adminMaster, $businessClientManagement);
$auth->addChild($adminMaster, $wholesaleClientManagement);
$auth->addChild($adminMaster, $vendorUserManagement);
$auth->addChild($adminMaster, $adminUserManagement);
$auth->addChild($adminMaster, $contentManagement);
$auth->addChild($adminMaster, $vendorManagement);
$auth->addChild($adminMaster, $vendorSettingsManagement);
$auth->addChild($adminMaster, $resellerEdit);
$auth->addChild($adminMaster, $resellerProducts);
$auth->addChild($adminMaster, $resellerOrders);
$auth->addChild($adminMaster, $resellerUsers);
$auth->addChild($adminMaster, $partnerUsers);
$auth->addChild($adminMaster, $partnerOrders);
$auth->addChild($adminMaster, $productCatalogueManagement);
$auth->addChild($adminMaster, $categoryManagement);
$auth->addChild($adminMaster, $subCategoryManagement);
$auth->addChild($adminMaster, $productManagement);
$auth->addChild($adminMaster, $productInfoUploadManagement);
$auth->addChild($adminMaster, $giftCardManagement);
$auth->addChild($adminMaster, $commentManagement);
$auth->addChild($adminMaster, $shopManagement);
$auth->addChild($adminMaster, $vendorStatisticsManagement);
$auth->addChild($adminMaster, $vendorOrderManagement);
$auth->addChild($adminMaster, $vendorProductManagement);
```

#### **Admin Purchasing Manager Permissions**
```php
$auth->addChild($adminPurchasingManager, $settingsManagement);
$auth->addChild($adminPurchasingManager, $discountCodeManagement);
$auth->addChild($adminPurchasingManager, $recommendationManagement);
$auth->addChild($adminPurchasingManager, $specialListManagement);
$auth->addChild($adminPurchasingManager, $logManagement);
$auth->addChild($adminPurchasingManager, $userManagement);
$auth->addChild($adminPurchasingManager, $businessClientManagement);
$auth->addChild($adminPurchasingManager, $wholesaleClientManagement);
$auth->addChild($adminPurchasingManager, $vendorUserManagement);
$auth->addChild($adminPurchasingManager, $adminUserManagement);
$auth->addChild($adminPurchasingManager, $contentManagement);
$auth->addChild($adminPurchasingManager, $vendorManagement);
$auth->addChild($adminPurchasingManager, $vendorSettingsManagement);
$auth->addChild($adminPurchasingManager, $resellerEdit);
$auth->addChild($adminPurchasingManager, $resellerProducts);
$auth->addChild($adminPurchasingManager, $resellerOrders);
$auth->addChild($adminPurchasingManager, $resellerUsers);
$auth->addChild($adminPurchasingManager, $partnerUsers);
$auth->addChild($adminPurchasingManager, $partnerOrders);
$auth->addChild($adminPurchasingManager, $productCatalogueManagement);
$auth->addChild($adminPurchasingManager, $categoryManagement);
$auth->addChild($adminPurchasingManager, $subCategoryManagement);
$auth->addChild($adminPurchasingManager, $productManagement);
$auth->addChild($adminPurchasingManager, $productInfoUploadManagement);
$auth->addChild($adminPurchasingManager, $giftCardManagement);
$auth->addChild($adminPurchasingManager, $commentManagement);
$auth->addChild($adminPurchasingManager, $shopManagement);
$auth->addChild($adminPurchasingManager, $vendorStatisticsManagement);
$auth->addChild($adminPurchasingManager, $vendorOrderManagement);
$auth->addChild($adminPurchasingManager, $vendorProductManagement);
```

#### **Admin Employee Permissions**
```php
$auth->addChild($adminEmployee, $productCatalogueManagement);
$auth->addChild($adminEmployee, $categoryManagement);
$auth->addChild($adminEmployee, $subCategoryManagement);
$auth->addChild($adminEmployee, $productManagement);
$auth->addChild($adminEmployee, $productInfoUploadManagement);
$auth->addChild($adminEmployee, $giftCardManagement);
$auth->addChild($adminEmployee, $commentManagement);
$auth->addChild($adminEmployee, $shopManagement);
$auth->addChild($adminEmployee, $vendorStatisticsManagement);
$auth->addChild($adminEmployee, $vendorOrderManagement);
```

#### **Vendor Permissions**
```php
$auth->addChild($vendor, $adminManagement);
$auth->addChild($vendor, $vendorStatisticsManagement);
$auth->addChild($vendor, $vendorProductManagement);

$auth->addChild($vendorMaster, $vendorUserManagement);
$auth->addChild($vendorMaster, $vendorManagement);
$auth->addChild($vendorMaster, $vendorOrderInsertManagement);
$auth->addChild($vendorMaster, $vendorOrderManagement);
```

#### **Client Permissions**
```php
$auth->addChild($client, $userDetailsManagement);

$auth->addChild($customer, $userFavoritesManagement);

$auth->addChild($companyMaster, $companyEmployeeManagement);
$auth->addChild($companyMaster, $userFavoritesManagement);

$auth->addChild($wholeSaleMaster, $subWholesaleManagement);
$auth->addChild($wholeSaleMaster, $companyEmployeeManagement);

$auth->addChild($wholeSaleEmployee, $companyManagement);

$auth->addChild($companyEmployee, $companyManagement);
$auth->addChild($companyEmployee, $userFavoritesManagement);
```

## Password Hashing

### **Password Hash Generation**
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

### **Password Validation**
```php
public function validatePassword(string $password)
{
    return $this->getPasswordHash($password) === $this->password_hash;
}
```

### **Password Setting**
```php
public function setPassword(string $password)
{
    $this->password_hash = $this->getPasswordHash($password);
}
```

## Login Flow

### **Identity Interface Implementation**
```php
class User extends AdvancedActiveRecord implements IdentityInterface, UserRoleProvider
{
    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id, 'status' => self::STATUS_ACTIVE]);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['auth_key' => $token]);
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

### **Auth Key Generation**
```php
public function generateAuthKey()
{
    $this->auth_key = Yii::$app->security->generateRandomString();
}
```

### **After Login Hook**
```php
public function afterLogin()
{
    $this->last_login_date = date('Y-m-d H:i:s');
    $this->saveSafe(true, ['last_login_date']);
}
```

## Session/Cookie/Token Management

### **Admin Panel Session**
```php
'user' => [
    'identityClass' => User::class,
    'authTimeout' => 60 * 60 * 12, // 12h
    'absoluteAuthTimeout' => 60 * 60 * 12, // 12h
    'identityCookie' => ['name' => '_identity-admin', 'httpOnly' => true],
    'on afterLogin' => function() {
        $user = Yii::$app->user->identity;
        if ($user->hasMethod('afterLogin')) {
            $user->afterLogin();
        }
    }
],
'session' => [
    'name' => 'advanced-admin',
    'cookieParams' => ['lifetime' => 60 * 60 * 12],
    'timeout' => 60 * 60 * 12
],
```

### **API Session**
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

### **Password Reset Token**
```php
public function generatePasswordResetToken()
{
    $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
}

public function removePasswordResetToken()
{
    $this->password_reset_token = null;
}
```

### **Email Verification Token**
```php
public function generateEmailVerificationToken(WebStore $webStore = null)
{
    $this->verification_token = base64_encode(implode('-', [
        Yii::$app->security->generateRandomString(),
        time(),
        $webStore->nav_code ?? WebStore::MAIN_WEB_STORE_NAV_CODE
    ]));
}
```

### **Role Management**
```php
public function getRoles()
{
    if (!is_null($this->roles)) {
        return $this->roles;
    }

    $loginAccountType = LoginUserAccountType::findOne([
        'web_store_id' => null,
        'user_id' => $this->id
    ]);

    if (!empty($loginAccountType) && !empty($loginAccountType->getRoleProvider())) {
        $this->roles = $loginAccountType->getRoleProvider()->getRoles();
        return $this->roles;
    }

    $this->roles = [];
    if (!empty($this->admin)) {
        array_merge($this->roles, $this->admin->getRoles());
    }

    foreach ($this->notDeletedClientAccounts as $clientAccount) {
        array_merge($this->roles, $clientAccount->getRoles());
    }

    foreach ($this->vendorUsers as $vendorUser) {
        array_merge($this->roles, $vendorUser->getRoles());
    }

    return $this->roles;
}
```

### **CSRF Protection**
```php
'request' => [
    'csrfParam' => '_csrf-admin',
    'baseUrl' => '/admin-panel',
],
```

### **Authentication Flow**
1. **User Login**: Email/password validation
2. **Role Assignment**: Based on user type (admin/vendor/client)
3. **Session Creation**: With timeout and cookie settings
4. **Permission Check**: RBAC-based access control
5. **Token Generation**: For API access and password reset
6. **Logout**: Session cleanup and token invalidation 
