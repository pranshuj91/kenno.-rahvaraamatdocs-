id: CONTRIBUTING
title: CONTRIBUTING
# Contributing

## How to Contribute

### **Getting Started**

#### **Prerequisites**
- **PHP 8.0+** with required extensions
- **Composer 2.0+**
- **Git**
- **MySQL 8.0+**
- **Redis 6.0+**
- **Elasticsearch 7.x**
- **Docker** (optional but recommended)

#### **Initial Setup**

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Install Dependencies**:
   ```bash
   composer install
   ```

3. **Setup Environment**:
   ```bash
   cp environments/dev/.env.example environments/dev/.env
   # Edit .env file with your local settings
   ```

4. **Setup Database**:
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE rahvaraamat_dev;"
   
   # Run migrations
   php yii migrate
   php yii migrate --migrationPath=@console/migrations
   ```

5. **Setup Elasticsearch**:
   ```bash
   # Start Elasticsearch
   docker run -d --name elasticsearch -p 9200:9200 elasticsearch:7.17.0
   
   # Create indexes
   php yii elasticsearch/create-indexes
   ```

6. **Setup Redis**:
   ```bash
   # Start Redis
   docker run -d --name redis -p 6379:6379 redis:6-alpine
   ```

### **Development Workflow**

#### **1. Feature Development**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... edit files ...

# Run tests
./vendor/bin/codecept run

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create pull request
# ... via GitHub/GitLab ...
```

#### **2. Bug Fix Development**

```bash
# Create bug fix branch
git checkout -b fix/bug-description

# Make changes
# ... edit files ...

# Run tests
./vendor/bin/codecept run

# Commit changes
git add .
git commit -m "fix: resolve bug description"

# Push branch
git push origin fix/bug-description

# Create pull request
# ... via GitHub/GitLab ...
```

#### **3. Hotfix Development**

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-fix

# Make urgent changes
# ... edit files ...

# Run tests
./vendor/bin/codecept run

# Commit changes
git add .
git commit -m "hotfix: critical fix description"

# Push branch
git push origin hotfix/critical-fix

# Create pull request
# ... via GitHub/GitLab ...
```

### **Development Tools**

#### **IDE Configuration**

**VS Code Extensions**:
- PHP Intelephense
- Yii2 Snippets
- GitLens
- PHP Debug
- PHP CS Fixer

**PHPStorm Configuration**:
- Enable Yii2 framework support
- Configure PHP 8.0 interpreter
- Setup database connection
- Enable code inspection

#### **Git Hooks**

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run PHP CS Fixer
./vendor/bin/php-cs-fixer fix --dry-run --diff

# Run PHPStan
./vendor/bin/phpstan analyse

# Run tests
./vendor/bin/codecept run unit
```

### **Coding Standards**

#### **PHP Standards**

**PSR-12 Compliance**:
```php
<?php

declare(strict_types=1);

namespace common\models;

use yii\db\ActiveRecord;

/**
 * Product model
 *
 * @property int $id
 * @property string $name
 * @property float $price
 */
class Product extends ActiveRecord
{
    public const TABLE_NAME = '{{%product}}';
    
    public static function tableName(): string
    {
        return self::TABLE_NAME;
    }
    
    public function rules(): array
    {
        return [
            [['name', 'price'], 'required'],
            [['price'], 'number'],
            [['name'], 'string', 'max' => 255],
        ];
    }
    
    public function attributeLabels(): array
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'price' => 'Price',
        ];
    }
}
```

#### **Naming Conventions**

- **Classes**: PascalCase (`ProductController`)
- **Methods**: camelCase (`getProductById()`)
- **Properties**: camelCase (`$productName`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PRODUCT_COUNT`)
- **Database Tables**: snake_case (`product_category`)
- **Database Columns**: snake_case (`product_name`)

#### **File Organization**

```
common/
├── models/
│   ├── Product.php
│   ├── Category.php
│   └── queries/
│       ├── ProductQuery.php
│       └── CategoryQuery.php
├── services/
│   ├── ProductService.php
│   └── OrderService.php
├── components/
│   ├── AuthManager.php
│   └── CacheManager.php
└── helpers/
    ├── DateHelper.php
    └── StringHelper.php
```

### **Testing Guidelines**

#### **Test Structure**

```bash
tests/
├── unit/           # Unit tests
├── functional/     # Functional tests
├── api/           # API tests
└── _support/      # Test helpers
```

#### **Running Tests**

```bash
# Run all tests
./vendor/bin/codecept run

# Run specific test suite
./vendor/bin/codecept run unit
./vendor/bin/codecept run functional
./vendor/bin/codecept run api

# Run specific test
./vendor/bin/codecept run tests/unit/ProductTest.php
```

#### **Writing Tests**

```php
<?php

namespace tests\unit;

use common\models\Product;
use tests\UnitTester;

class ProductTest extends \Codeception\Test\Unit
{
    protected UnitTester $tester;

    public function testProductCreation()
    {
        $product = new Product();
        $product->name = 'Test Product';
        $product->price = 19.99;
        
        $this->assertTrue($product->save());
        $this->assertEquals('Test Product', $product->name);
    }
}
```

## Code Review Process

### **Self Review**

Before submitting a pull request, perform a self-review:

1. **Run All Tests**:
   ```bash
   ./vendor/bin/codecept run
   ```

2. **Check Code Style**:
   ```bash
   ./vendor/bin/php-cs-fixer fix --dry-run --diff
   ```

3. **Review for Security Issues**:
   - Check for SQL injection vulnerabilities
   - Verify input validation
   - Review authentication and authorization
   - Check for XSS vulnerabilities

4. **Update Documentation**:
   - Update relevant documentation files
   - Add inline comments for complex logic
   - Update API documentation if needed

### **Peer Review**

#### **Review Checklist**

**Code Functionality**:
- [ ] Code works as intended
- [ ] No breaking changes introduced
- [ ] Backward compatibility maintained
- [ ] Error handling implemented

**Performance Implications**:
- [ ] No performance regressions
- [ ] Database queries optimized
- [ ] Caching implemented where appropriate
- [ ] Memory usage considered

**Security Considerations**:
- [ ] Input validation implemented
- [ ] SQL injection prevented
- [ ] XSS protection in place
- [ ] Authentication/authorization checked

**Test Coverage**:
- [ ] Unit tests written
- [ ] Functional tests added
- [ ] Edge cases covered
- [ ] Integration tests updated

#### **Review Comments**

Use clear, constructive feedback:

```markdown
**Good Comment**:
"This method could benefit from caching to improve performance. Consider adding Redis caching for the product lookup."

**Better Comment**:
"Consider adding caching here to improve performance. The product lookup is called frequently and the data doesn't change often. Here's an example implementation: [code example]"
```

### **Merge Requirements**

#### **Automatic Checks**

All pull requests must pass:

1. **Tests**: All unit, functional, and API tests passing
2. **Code Style**: PSR-12 compliance
3. **Static Analysis**: PHPStan analysis passing
4. **Security Scan**: No security vulnerabilities detected

#### **Manual Checks**

1. **Documentation Updated**: Relevant docs updated
2. **Security Review**: Security implications reviewed
3. **Performance Review**: Performance impact assessed
4. **Code Review**: At least one approval from team member

### **Review Process Timeline**

1. **Initial Review**: Within 24 hours
2. **Address Feedback**: Within 48 hours
3. **Final Review**: Within 72 hours
4. **Merge**: After all requirements met

## Issue Tracking

### **Issue Types**

#### **Bug Reports**

**Template**:
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Ubuntu 20.04]
- PHP Version: [e.g. 8.0.30]
- Database: [e.g. MySQL 8.0]
- Browser: [e.g. Chrome 120]

## Additional Information
Screenshots, logs, etc.
```

#### **Feature Requests**

**Template**:
```markdown
## Feature Description
Brief description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How the feature should work

## Alternative Solutions
Other approaches considered

## Impact
- Performance impact
- Security implications
- Database changes needed
```

#### **Security Issues**

**Template**:
```markdown
## Security Issue Description
Brief description of the security issue

## Severity
- Critical: Immediate fix required
- High: Fix within 24 hours
- Medium: Fix within 1 week
- Low: Fix within 1 month

## Steps to Reproduce
Detailed steps to reproduce

## Impact Assessment
- Data exposure risk
- System compromise risk
- User impact

## Suggested Fix
Proposed solution
```

### **Issue Labels**

#### **Priority Labels**
- `priority: critical` - Immediate attention required
- `priority: high` - Fix within 24 hours
- `priority: medium` - Fix within 1 week
- `priority: low` - Fix within 1 month

#### **Type Labels**
- `type: bug` - Bug report
- `type: feature` - Feature request
- `type: enhancement` - Improvement request
- `type: security` - Security issue
- `type: documentation` - Documentation update

#### **Component Labels**
- `component: api` - API related
- `component: admin` - Admin panel
- `component: database` - Database related
- `component: payment` - Payment processing
- `component: subscription` - Subscription system

### **Issue Workflow**

#### **Bug Workflow**

1. **Report**: User reports bug
2. **Triage**: Team assigns priority and labels
3. **Investigation**: Developer investigates and reproduces
4. **Fix**: Developer creates fix
5. **Testing**: Fix tested thoroughly
6. **Review**: Code review completed
7. **Merge**: Fix merged to main branch
8. **Deploy**: Fix deployed to production
9. **Close**: Issue closed with resolution

#### **Feature Workflow**

1. **Request**: User requests feature
2. **Discussion**: Team discusses feasibility
3. **Design**: Technical design created
4. **Implementation**: Feature implemented
5. **Testing**: Feature tested thoroughly
6. **Review**: Code review completed
7. **Merge**: Feature merged to main branch
8. **Deploy**: Feature deployed to production
9. **Close**: Issue closed with resolution

### **Issue Management**

#### **Issue Templates**

Create issue templates in `.github/ISSUE_TEMPLATE/`:

**bug_report.md**:
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: ['type: bug']
assignees: ''
---

## Bug Description
[Description]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g. Ubuntu 20.04]
- PHP Version: [e.g. 8.0.30]
- Database: [e.g. MySQL 8.0]

## Additional Information
[Any additional information]
```

**feature_request.md**:
```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: ['type: feature']
assignees: ''
---

## Feature Description
[Description]

## Use Case
[Why this feature is needed]

## Proposed Solution
[How the feature should work]

## Impact
- Performance impact
- Security implications
- Database changes needed
```

### **Issue Tracking Tools**

#### **GitHub Issues**

- **Repository**: GitHub issues for public projects
- **Features**: Labels, milestones, assignees
- **Integration**: Automatic linking with pull requests

#### **Jira Integration**

- **Project Management**: Jira for enterprise projects
- **Workflow**: Custom workflows and automation
- **Reporting**: Advanced reporting and analytics

#### **Slack Integration**

- **Notifications**: Automatic issue notifications
- **Updates**: Real-time issue updates
- **Collaboration**: Team communication

### **Issue Metrics**

#### **Tracking Metrics**

- **Time to First Response**: Average time to first response
- **Time to Resolution**: Average time to close issues
- **Issue Volume**: Number of issues per period
- **Resolution Rate**: Percentage of issues resolved

#### **Quality Metrics**

- **Bug Reopening Rate**: Percentage of bugs reopened
- **Customer Satisfaction**: User feedback on issue resolution
- **Code Quality**: Impact of fixes on code quality

### **Issue Communication**

#### **Status Updates**

Regular status updates for long-running issues:

```markdown
## Status Update - 2024-01-15

**Progress**: Investigation completed, fix identified
**Next Steps**: Implement fix and test
**Timeline**: Expected completion by 2024-01-20
**Blockers**: None
```

#### **Resolution Communication**

When closing issues:

```markdown
## Resolution Summary

**Root Cause**: [Description of root cause]
**Solution Implemented**: [Description of solution]
**Testing Performed**: [Description of testing]
**Deployment**: [Deployment information]
**Prevention**: [Measures to prevent recurrence]
```

### **Support Channels**

#### **Technical Support**
- **Development Team**: dev@rahvaraamat.ee
- **System Administration**: sysadmin@rahvaraamat.ee
- **Emergency Contact**: +372 1234 5678

#### **Issue Reporting**
- **Bug Reports**: bugs@rahvaraamat.ee
- **Feature Requests**: features@rahvaraamat.ee
- **Security Issues**: security@rahvaraamat.ee

#### **Community Resources**
- **Team Chat**: Slack/Discord channels
- **Knowledge Base**: Internal wiki
- **Code Reviews**: Pull request discussions 
