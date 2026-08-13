---
id: TESTS_OVERVIEW
title: Tests Overview
sidebar_label: Tests Overview
---
## Test database setup

### Tests Init Flow

Tests require an additional database, which will be cleaned up between tests. This database will be used to hold data
that matches the data in your live database. Its purpose is to run those tests that store data without affecting your own data.
Create database in your database server, using a similar setup to the live database, so that the tests are run in an environment
that is as close to your live environment as possible.

   1. Your live database connection string is probably in `common/config/main-local.php`. It is something like 
   `'dsn' => 'mysql:host=localhost;dbname=yii2advanced'`. Copy it to `common/config/test-local.php` and change the 
   `dbname` so it is obvious that it is the test database: `'dsn' => 'mysql:host=localhost;dbname=your_test_db_name'`.
   
   2. Create an empty database. In this example it would be `your_test_db_name` in MySql
   (according to config in `common/config/test-local.php`).

## yii_test migrate

3. Execute: `./yii_test migrate` (`yii_test` and `yii_test.bat` must be manually copied from the `environments/dev`
    folder into the project root directory.)

## codecept build

4. Build the test suite: `./vendor/bin/codecept build`

## API test suite setup

5. API tests are not included in any Yii templates so you need to set up them manually if you developing a web service. 
   To do it execute `./vendor/bin/codecept g:suite api -c api`.
   
   6. You will need to enable `REST`, `Yii2` module in `api/tests/api.suite.yml`:
        ```  
            actor: ApiTester
            modules:
                enabled:
                    - \api\tests\Helper\Api
                    - REST:
                        #url:
                        depends: Yii2
                        #part: Json
        ```

## Running sample tests

Then all sample tests can be started by running: `./vendor/bin/codecept run`.
