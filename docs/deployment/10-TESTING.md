id: TESTING
title: TESTING
# Testing

## Test Structure

### **Admin Tests** (`admin/tests/`)
```
admin/tests/
├── _bootstrap.php          # Test bootstrap
├── _data/                  # Test data fixtures
│   └── login_data.php
├── _output/                # Test output
├── _support/               # Test support files
├── functional/             # Functional tests
│   └── functional.suite.yml
└── unit/                   # Unit tests
    ├── _bootstrap.php
    ├── AudioSharedRevenueCalculatorTest.php
    ├── MasterRevenueShareReportTest.php
    ├── ProviderRevenueShareReportTest.php
    ├── RahvaraamatRevenueShareReportTest.php
    └── VendorRevenueShareReportTest.php
    └── unit.suite.yml
```

### **API Tests** (`api/tests/`)
```
api/tests/
├── _bootstrap.php          # Test bootstrap
├── _data/                  # Test data fixtures
│   ├── user.php
│   ├── product.php
│   ├── order.php
│   ├── client-account.php
│   └── ... (50+ fixture files)
├── _output/                # Test output
├── _support/               # Test support files
├── acceptance/             # Acceptance tests
│   └── acceptance.suite.yml.example
├── api/                    # API tests
│   ├── LoginCest.php
│   ├── UserCest.php
│   ├── BasketCest.php
│   ├── ProductCest.php
│   └── ... (30+ API test files)
├── functional/             # Functional tests
│   └── functional.suite.yml
├── unit/                   # Unit tests
│   ├── _bootstrap.php
│   ├── UpdatePasswordFormTest.php
│   ├── CheckoutFormTest.php
│   ├── BasketDeliveryServiceTest.php
│   └── ... (40+ unit test files)
├── fixtures/               # Test fixtures
├── models/                 # Model tests
├── api.suite.yml           # API test configuration
├── functional.suite.yml    # Functional test configuration
└── unit.suite.yml          # Unit test configuration
```

### **Common Tests** (`common/tests/`)
```
common/tests/
├── _bootstrap.php          # Test bootstrap
├── _data/                  # Test data fixtures
├── _output/                # Test output
├── _support/               # Test support files
├── unit/                   # Unit tests
│   └── unit.suite.yml
```

## Running Tests

### **Unit Tests**
```bash
# Run all unit tests
vendor/bin/codecept run unit

# Run specific application unit tests
vendor/bin/codecept run unit -c admin
vendor/bin/codecept run unit -c api
vendor/bin/codecept run unit -c common

# Run specific test file
vendor/bin/codecept run unit tests/unit/UpdatePasswordFormTest.php -c api

# Run specific test method
vendor/bin/codecept run unit tests/unit/UpdatePasswordFormTest.php:testUpdatePasswordPassed -c api
```

### **Functional Tests**
```bash
# Run all functional tests
vendor/bin/codecept run functional

# Run specific application functional tests
vendor/bin/codecept run functional -c admin
vendor/bin/codecept run functional -c api
```

### **API Tests**
```bash
# Run all API tests
vendor/bin/codecept run api -c api

# Run specific API test file
vendor/bin/codecept run api tests/api/LoginCest.php -c api

# Run specific API test method
vendor/bin/codecept run api tests/api/LoginCest.php:loginUser -c api
```

### **Acceptance Tests**
```bash
# Run acceptance tests (requires WebDriver)
vendor/bin/codecept run acceptance -c api
```

### **All Tests**
```bash
# Run all tests from root
vendor/bin/codecept run

# Run with verbose output
vendor/bin/codecept run --verbose

# Run with coverage
vendor/bin/codecept run --coverage
```

## Test Configuration

### **Unit Test Configuration** (`unit.suite.yml`)
```yaml
suite_namespace: api\tests\unit
actor: UnitTester
modules:
    enabled:
        - Yii2:
            part: [orm, email, fixtures]
        - Asserts
```

### **Functional Test Configuration** (`functional.suite.yml`)
```yaml
suite_namespace: api\tests\functional
actor: FunctionalTester
modules:
    enabled:
        - Filesystem
        - Yii2
```

### **API Test Configuration** (`api.suite.yml`)
```yaml
actor: ApiTester
modules:
    enabled:
        - \api\tests\Helper\Api
        - REST:
            depends: Yii2
```

### **Acceptance Test Configuration** (`acceptance.suite.yml.example`)
```yaml
suite_namespace: frontend\tests\acceptance
actor: AcceptanceTester
modules:
    enabled:
        - WebDriver:
            url: http://localhost:8080
            browser: firefox
        - Yii2:
            part: init
```

## Fixtures and Test Data

### **Test Data Structure** (`_data/`)
```php
// api/tests/_data/user.php
return [
    'user1' => [
        'id' => 1,
        'display_name' => 'test1',
        'name' => 'test1',
        'email' => 'test1@mail.com',
        'personal_id_code' => '33012226859',
        'is_activated' => 1,
        'is_id_card_activated' => 1,
        'password_hash' => hash('sha512', sprintf('%s-%s-%s', Yii::$app->params['globalSalt'], 'Test1', null)),
        'password_reset_token' => '',
        'import_temp' => '',
        'created' => new Expression('NOW()'),
        'created_by' => 1,
        'updated' => new Expression('NOW()'),
        'updated_by' => 1,
        'auth_key' => null,
        'language_preference' => 'et',
        'registration_web_store_id' => WebStore::getMainStore()->id
    ],
    'user2' => [
        'id' => 2,
        'display_name' => 'test2',
        'name' => 'test2',
        'email' => 'test2@mail.com',
        'personal_id_code' => '32701135285',
        'is_activated' => 0,
        'is_id_card_activated' => 1,
        'password_hash' => hash('sha512', sprintf('%s-%s-%s', Yii::$app->params['globalSalt'], 'Test2', null)),
        'password_reset_token' => '',
        'import_temp' => '',
        'created' => new Expression('NOW()'),
        'created_by' => 1,
        'updated' => new Expression('NOW()'),
        'updated_by' => 1,
        'auth_key' => null,
        'language_preference' => 'et',
        'registration_web_store_id' => WebStore::getMainStore()->id
    ],
    // ... more test users
];
```

### **Available Fixtures**
- **User Fixtures**: `user.php` (5 test users)
- **Product Fixtures**: `product.php` (382 lines)
- **Order Fixtures**: `order.php` (125 lines)
- **Client Account Fixtures**: `client-account.php` (6.1KB)
- **Category Fixtures**: `category.php` (4.8KB)
- **Shop Fixtures**: `shop.php` (11KB, 363 lines)
- **Voucher Fixtures**: `voucher.php`, `voucher-gift-card.php`, `voucher-discount-code.php`
- **Subscription Fixtures**: `subscription-plan.php`, `subscription-service.php`
- **Payment Fixtures**: `payment-subscription.php`, `payment-credit.php`
- **Content Fixtures**: `news.php`, `content-page.php`, `banner.php`
- **Delivery Fixtures**: `delivery-fee-international.php`, `delivery-method-price.php`

### **Using Fixtures in Tests**
```php
public function _fixtures()
{
    return [
        'clients' => [
            'class' => ClientAccountFixture::class,
            'dataFile' => codecept_data_dir() . 'client-account.php'
        ],
        'users' => [
            'class' => UserFixture::class,
            'dataFile' => codecept_data_dir() . 'user.php'
        ]
    ];
}
```

## How to Write New Tests

### **Unit Test Example**
```php
<?php

namespace unit;

use api\models\forms\UpdatePasswordForm;
use api\tests\fixtures\ClientAccountFixture;
use Codeception\Test\Unit;
use common\models\User;

class UpdatePasswordFormTest extends Unit
{
    public function _fixtures()
    {
        return [
            'clientAccounts' => [
                'class' => ClientAccountFixture::class
            ]
        ];
    }

    public function testUpdatePasswordPassed()
    {
        $user = User::find()->where(['email' => 'test1@mail.com'])->one();
        $oldHash = $user->password_hash;
        $form = new UpdatePasswordForm($user);
        $form->load([
            'oldPassword' => 'Test1',
            'newPassword' => 'Test2'
        ]);
        $this->assertTrue($form->validate());
        $form->submit();
        $this->assertTrue($user->password_hash !== $oldHash);
    }

    public function testUpdatePasswordWrongOldPasswordFailed()
    {
        $user = User::find()->where(['email' => 'test1@mail.com'])->one();
        $form = new UpdatePasswordForm($user);
        $form->load([
            'oldPassword' => 'Test2',
            'newPassword' => 'Test3'
        ]);
        $this->assertFalse($form->validate());
        $this->assertCount(1, $form->errors);
    }

    public function testUpdatePasswordInvalidPasswordFailed()
    {
        $user = User::find()->where(['email' => 'test1@mail.com'])->one();
        $form = new UpdatePasswordForm($user);
        $form->load([
            'oldPassword' => 'Test1',
            'newPassword' => 'test2'
        ]);
        $this->assertFalse($form->validate());
        $this->assertCount(1, $form->errors);
    }
}
```

### **API Test Example**
```php
<?php

namespace api\tests;

use api\tests\fixtures\ClientAccountFixture;
use Codeception\Util\HttpCode;
use common\models\WebStore;

class LoginCest
{
    public function _fixtures()
    {
        return [
            'clients' => [
                'class' => ClientAccountFixture::class,
                'dataFile' => codecept_data_dir() . 'client-account.php'
            ]
        ];
    }

    public function loginUser(ApiTester $I)
    {
        $I->sendPost('/auth/login', ['email' => 'test1@mail.com', 'password' => 'Test1']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType(['accessToken' => 'string']);
    }

    public function loginUserUsingWrongCredentials(ApiTester $I)
    {
        $I->sendPost('/auth/login', ['email' => 'wrong@mail.com', 'password' => 'Wrong']);
        $I->seeResponseCodeIs(HttpCode::UNPROCESSABLE_ENTITY);
        $I->seeResponseIsJson();
        $I->dontSeeResponseMatchesJsonType(['accessToken' => 'string']);
    }

    public function loginUserWithUnverifiedAccount(ApiTester $I)
    {
        $I->sendPost('/auth/login', ['email' => 'test2@mail.com', 'password' => 'Test2']);
        $I->seeResponseCodeIs(HttpCode::UNPROCESSABLE_ENTITY);
        $I->seeResponseIsJson();
        $I->dontSeeResponseMatchesJsonType(['accessToken' => 'string']);
    }

    public function tryToLoginWithEmptyCredentials(ApiTester $I)
    {
        $I->sendPost('/auth/login', []);
        $I->seeResponseCodeIs(HttpCode::UNPROCESSABLE_ENTITY);
        $I->seeResponseIsJson();
        $I->dontSeeResponseMatchesJsonType(['accessToken' => 'string']);
        $I->seeResponseMatchesJsonType(['field' => 'string', 'message' => 'string']);
    }

    public function loginUserOutlet(ApiTester $I)
    {
        $I->haveHttpHeader("store", WebStore::OUTLET_WEB_STORE_NAV_CODE);

        $I->sendPost('/auth/login', [
            'email' => 'test6@mail.com',
            'password' => 'Test1'
        ]);

        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseMatchesJsonType(['accessToken' => 'string']);
    }

    public function tryToLoginWholesaleUserOutletResult422(ApiTester $I)
    {
        $I->haveHttpHeader("store", WebStore::OUTLET_WEB_STORE_NAV_CODE);

        $I->sendPost('/auth/login', [
            'email' => 'test8@mail.com',
            'password' => 'Test1'
        ]);

        $I->seeResponseCodeIs(HttpCode::UNPROCESSABLE_ENTITY);
        $I->seeResponseMatchesJsonType(['field' => 'string', 'message' => 'string']);
    }
}
```

### **Functional Test Example**
```php
<?php

namespace api\tests\functional;

use api\tests\fixtures\ClientAccountFixture;
use common\models\WebStore;

class LoginFunctionalCest
{
    public function _fixtures()
    {
        return [
            'clients' => [
                'class' => ClientAccountFixture::class,
                'dataFile' => codecept_data_dir() . 'client-account.php'
            ]
        ];
    }

    public function testLoginForm(FunctionalTester $I)
    {
        $I->amOnPage('/auth/login');
        $I->fillField('input[name="email"]', 'test1@mail.com');
        $I->fillField('input[name="password"]', 'Test1');
        $I->click('button[type="submit"]');
        $I->see('Welcome');
    }

    public function testLoginValidation(FunctionalTester $I)
    {
        $I->amOnPage('/auth/login');
        $I->fillField('input[name="email"]', 'invalid-email');
        $I->fillField('input[name="password"]', '');
        $I->click('button[type="submit"]');
        $I->see('Invalid email format');
        $I->see('Password cannot be blank');
    }
}
```

### **Test Bootstrap** (`_bootstrap.php`)
```php
<?php
defined('YII_DEBUG') || define('YII_DEBUG', true);
defined('YII_ENV') || define('YII_ENV', 'test');
defined('YII_APP_BASE_PATH') || define('YII_APP_BASE_PATH', __DIR__.'/../../');

require_once YII_APP_BASE_PATH . '/vendor/autoload.php';
require_once YII_APP_BASE_PATH . '/vendor/yiisoft/yii2/Yii.php';
require_once YII_APP_BASE_PATH . '/common/config/bootstrap.php';
require_once __DIR__ . '/../config/bootstrap.php';
```

### **Creating New Test Data**
```php
// Create new fixture file: api/tests/_data/new-feature.php
return [
    'feature1' => [
        'id' => 1,
        'name' => 'Test Feature 1',
        'description' => 'Test description',
        'created_at' => new Expression('NOW()'),
        'updated_at' => new Expression('NOW()'),
    ],
    'feature2' => [
        'id' => 2,
        'name' => 'Test Feature 2',
        'description' => 'Another test description',
        'created_at' => new Expression('NOW()'),
        'updated_at' => new Expression('NOW()'),
    ],
];
```

### **Test Naming Conventions**
- **Unit Tests**: `ClassNameTest.php`
- **API Tests**: `FeatureCest.php`
- **Functional Tests**: `FeatureFunctionalCest.php`
- **Test Methods**: `testMethodName()` or `methodName()`

### **Test Assertions**
```php
// Unit test assertions
$this->assertTrue($condition);
$this->assertFalse($condition);
$this->assertEquals($expected, $actual);
$this->assertCount($expectedCount, $array);
$this->assertEmpty($array);
$this->assertNotEmpty($array);

// API test assertions
$I->seeResponseCodeIs(HttpCode::OK);
$I->seeResponseIsJson();
$I->seeResponseMatchesJsonType(['field' => 'string']);
$I->dontSeeResponseMatchesJsonType(['field' => 'string']);
$I->seeResponseContainsJson(['key' => 'value']);

// Functional test assertions
$I->see('Text on page');
$I->dontSee('Text not on page');
$I->seeElement('css-selector');
$I->dontSeeElement('css-selector');
$I->fillField('input[name="field"]', 'value');
$I->click('button[type="submit"]');
``` 
