id: ENVIRONMENT_SETUP
title: ENVIRONMENT SETUP
# Enviroment Local Setup Guide

This guide helps developers set up the PHP ecommerce backend project locally without Docker, including installing dependencies like PHP 8.0+, Composer, MySQL, Node.js, and other required tools.

## 📦 SECTION 1: Setup PHP 8.0+ Project Without Docker

This project is built with **Yii2 Framework** and requires **PHP 8.0 or higher**. The setup process varies by operating system.

### ➤ For macOS:

#### Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Install PHP 8.1
```bash
# Add PHP repository
brew tap shivammathur/php

# Install PHP 8.1
brew install php@8.1

# Link PHP 8.1 as the default version
brew link php@8.1

# Verify installation
php -v
```

#### Install Composer
```bash
# Install Composer
brew install composer

# Verify installation
composer -V
```

#### Install MySQL
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation

# Verify MySQL is running
mysql -u root -p
```

#### Install Node.js (for frontend assets)
```bash
# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

### ➤ For Ubuntu:

#### Update system and install dependencies
```bash
sudo apt update
sudo apt install -y software-properties-common apt-transport-https ca-certificates curl wget
```

#### Install PHP 8.1
```bash
# Add PHP repository
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP 8.1 and required extensions
sudo apt install -y php8.1 php8.1-cli php8.1-fpm php8.1-common php8.1-mysql php8.1-zip php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml php8.1-bcmath php8.1-json php8.1-soap php8.1-intl php8.1-redis php8.1-ftp php8.1-fileinfo php8.1-pcntl php8.1-xmlwriter php8.1-xmlreader php8.1-dom php8.1-simplexml php8.1-openssl php8.1-libxml php8.1-zip php8.1-imagick

# Verify installation
php -v
```

#### Install Composer
```bash
# Download and install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Verify installation
composer -V
```

#### Install MySQL
```bash
# Install MySQL
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation

# Verify MySQL is running
sudo systemctl status mysql
```

#### Install Node.js
```bash
# Install Node.js using official source
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### ➤ For CentOS/RHEL:

#### Install EPEL and Remi repositories
```bash
# Install EPEL
sudo yum install -y epel-release

# Install Remi repository
sudo yum install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm

# Enable PHP 8.1
sudo yum-config-manager --enable remi-php81
```

#### Install PHP 8.1
```bash
# Install PHP 8.1 and extensions
sudo yum install -y php php-cli php-fpm php-common php-mysql php-zip php-gd php-mbstring php-curl php-xml php-bcmath php-json php-soap php-intl php-redis php-ftp php-fileinfo php-pcntl php-xmlwriter php-xmlreader php-dom php-simplexml php-openssl php-libxml php-imagick

# Verify installation
php -v
```

#### Install Composer
```bash
# Download and install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Verify installation
composer -V
```

#### Install MySQL/MariaDB
```bash
# Install MariaDB (MySQL alternative)
sudo yum install -y mariadb-server mariadb

# Start MariaDB service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure MariaDB installation
sudo mysql_secure_installation

# Verify service is running
sudo systemctl status mariadb
```

#### Install Node.js
```bash
# Install Node.js using NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

## 🛠 SECTION 2: Project Setup

### Clone and Install Dependencies
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd ecommerce-backend

# Install PHP dependencies
composer install

# Install Node.js dependencies (if any)
npm install
```

### Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE rahvaraamat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create user (optional)
mysql -u root -p -e "CREATE USER 'rahvaraamat_user'@'localhost' IDENTIFIED BY 'your_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON rahvaraamat.* TO 'rahvaraamat_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Environment Configuration

The project uses Yii2's environment-based configuration. Copy the development environment configuration:

```bash
# Copy development environment configuration
cp -r environments/dev/* ./

# Set proper permissions
chmod -R 775 runtime/
chmod -R 775 web/assets/
```

### Configure Database Connection

Edit `common/config/main-local.php` to match your local database settings:

```php
'db' => [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=rahvaraamat',
    'username' => 'your_username',
    'password' => 'your_password',
    'charset' => 'utf8',
    'tablePrefix' => 'rr_',
    'enableLogging' => false,
],
```

### Run Migrations
```bash
# Run database migrations
php yii migrate

# Run test migrations (if needed)
php yii_test migrate
```

### Initialize Application
```bash
# Initialize the application
php init

# Select development environment when prompted
```

## ⚠️ SECTION 3: Common Setup Problems and How to Fix Them

| ❌ Problem | ✅ Solution |
|-------------|-------------|
| **Composer version conflict** | Delete `composer.lock`, run `composer update`, or manually match versions in `composer.json` |
| **PDO or mbstring missing** | Install missing PHP extensions: `sudo apt install php8.1-pdo php8.1-mbstring` (Ubuntu) or `sudo yum install php-pdo php-mbstring` (CentOS) |
| **MySQL not starting** | Run `sudo systemctl start mysql` and check logs with `sudo journalctl -u mysql` |
| **Node modules missing** | Run `npm install` inside the project directory |
| **Permission denied errors** | Run `chmod -R 775 storage bootstrap/cache runtime web/assets` |
| **Configuration not loading** | Clear config cache: `php yii cache/flush-all` |
| **Redis connection failed** | Install Redis: `sudo apt install redis-server` (Ubuntu) or `sudo yum install redis` (CentOS), then start with `sudo systemctl start redis` |
| **Elasticsearch connection failed** | Install Elasticsearch or update configuration in `main-local.php` |
| **GD extension missing** | Install: `sudo apt install php8.1-gd` (Ubuntu) or `sudo yum install php-gd` (CentOS) |
| **XML extensions missing** | Install: `sudo apt install php8.1-xml php8.1-dom php8.1-simplexml` (Ubuntu) or `sudo yum install php-xml php-dom php-simplexml` (CentOS) |
| **SOAP extension missing** | Install: `sudo apt install php8.1-soap` (Ubuntu) or `sudo yum install php-soap` (CentOS) |
| **FTP extension missing** | Install: `sudo apt install php8.1-ftp` (Ubuntu) or `sudo yum install php-ftp` (CentOS) |
| **PCNTL extension missing** | Install: `sudo apt install php8.1-pcntl` (Ubuntu) or `sudo yum install php-pcntl` (CentOS) |
| **Fileinfo extension missing** | Install: `sudo apt install php8.1-fileinfo` (Ubuntu) or `sudo yum install php-fileinfo` (CentOS) |
| **OpenSSL extension missing** | Install: `sudo apt install php8.1-openssl` (Ubuntu) or `sudo yum install php-openssl` (CentOS) |
| **Imagick extension missing** | Install: `sudo apt install php8.1-imagick` (Ubuntu) or `sudo yum install php-imagick` (CentOS) |

## 💡 SECTION 4: What Changes Might Be Needed

### Configuration Files to Edit:

1. **`composer.json`** - PHP version requirements (currently >=8.0.0)
2. **`environments/dev/common/config/main-local.php`** - Database, Redis, Elasticsearch, AWS credentials
3. **`environments/dev/common/config/params-local.php`** - Application parameters
4. **`environments/dev/admin/config/main-local.php`** - Admin panel specific configurations
5. **`environments/dev/api/config/main-local.php`** - API specific configurations
6. **Web server configuration** - Apache/Nginx virtual host setup

### Web Server Configuration:

#### Apache Virtual Host Example:
```apache
<VirtualHost *:80>
    ServerName rahvaraamat.local
    DocumentRoot /path/to/ecommerce-backend/web
    
    <Directory /path/to/ecommerce-backend/web>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx Configuration Example:
```nginx
server {
    listen 80;
    server_name rahvaraamat.local;
    root /path/to/ecommerce-backend/web;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Additional Services:

- **Redis**: Required for caching and sessions
- **Elasticsearch**: Required for search functionality
- **AWS S3**: Required for file storage (configure credentials in `main-local.php`)

### Application-Specific Configuration:

#### Admin Panel Configuration (`environments/dev/admin/config/main-local.php`):
```php
<?php

$config = [
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'your-secret-key-here',
        ],
    ],
];

if (!YII_ENV_TEST) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // allowed ips - add your local IP here
        'allowedIPs' => ['127.0.0.1', '::1', 'localhost', 'your-local-ip'],
        'panels' => [
            'elasticsearch' => [
                'class' => 'yii\\elasticsearch\\DebugPanel',
            ],
        ],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['127.0.0.1', '::1', 'localhost', 'your-local-ip'],
    ];
}

return $config;
```

#### API Configuration (`environments/dev/api/config/main-local.php`):
```php
<?php

$config = [
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'your-secret-key-here',
        ],
        'staccSessionCache' => [
            'class' => 'yii\redis\Cache',
            'redis' => [
                'hostname' => 'localhost', // Change from 'redis' to 'localhost' for local setup
                'port' => 6379,
                'database' => 0,
            ]
        ],
        'audioStreamManagerLive' => [
            'class' => api\modules\audio\components\wowza\AudioStreamManager::class,
            'host' => 'your-wowza-host',
            'secret' => 'your-secret',
            'tokenName' => 'wowzatoken',
            'schema' => 'https'
        ]
    ],
];

if (!YII_ENV_TEST) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => ['127.0.0.1', '::1', 'localhost', 'your-local-ip'],
        'panels' => [
            'elasticsearch' => [
                'class' => 'yii\\elasticsearch\\DebugPanel',
            ],
        ],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['127.0.0.1', '::1', 'localhost', 'your-local-ip'],
    ];
}

return $config;
```

**Important Notes:**
- Replace `your-secret-key-here` with unique secret keys for each application
- Update `allowedIPs` arrays with your local IP address
- Change Redis hostname from `'redis'` to `'localhost'` in API config for local setup
- Configure Wowza streaming settings according to your setup

## 🚀 SECTION 5: Verification

After setup, verify everything is working:

```bash
# Check PHP requirements
php requirements.php

# Test database connection
php yii db/test

# Run tests
php yii_test run

# Check application status
php yii status
```

## 📚 Additional Resources

- [Yii2 Framework Documentation](https://www.yiiframework.com/doc/guide/2.0/en)
- [Composer Documentation](https://getcomposer.org/doc/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Redis Documentation](https://redis.io/documentation)
- [Elasticsearch Documentation](https://www.elastic.co/guide/)

---

**Note**: This project uses Yii2 Framework with multiple applications (admin, api, console). Make sure to configure each application's specific requirements in their respective configuration files. 

## Running admin panel with PHP built‑in server (no Docker)

This document explains how to run the **Rahvaraamat admin panel** with the PHP built‑in server on Windows and how to fix the issue where the page loads **without CSS/styles**.

It assumes:

- **Project is already installed** (dependencies, DB, migrations) and works via CLI.
- You are **not** using Docker/nginx, but want a quick local setup using `php -S`.

If you want the officially supported setup instead, see **`README.md`** (Docker‑based) and **`doocumentation/LOCAL_SETUP.md`**.

---

## 1. How the admin app is expected to run

In production (and in the provided Docker setup), the admin app is served behind the URL prefix **`/admin-panel`**.

Key configuration in `admin/config/main.php`:

```php
'components' => [
    'request' => [
        'csrfParam' => '_csrf-admin',
        'baseUrl' => '/admin-panel',
    ],
    // ...
]
```

Because of this:

- All generated URLs in the admin app use **`/admin-panel`** as the base.
- CSS/JS are expected to be reachable under URLs like:
  - `/admin-panel/css/styles.css`
  - `/admin-panel/css/styles_screen.css`

The Docker/nginx config knows that `/admin-panel` should be served from the `admin/web` directory, so those paths work correctly there.

---

## 2. What happens with `php -S localhost:8080 -t admin/web`

When you run:

```bash
php -S localhost:8080 -t admin/web
```

PHP’s built‑in server:

- Uses `admin/web` as the **document root** for `/`.
- Serves static files directly from `admin/web/...`.

But the application **still thinks** its base URL is `/admin-panel`, so it generates CSS URLs like:

- `http://localhost:8080/admin-panel/css/styles.css`

With the above `php -S` command, that URL maps to a filesystem path:

- `admin/web/admin-panel/css/styles.css`

which **does not exist**, so the CSS/JS requests return **404** and the page looks unstyled (plain HTML, no layout).

This is exactly the issue shown in the screenshot where the login page is visible but not styled.

---

## 3. Fix: override `baseUrl` in `admin/config/main-local.php`

For a local environment where the admin lives at the root (`/`) instead of `/admin-panel`, you should override the `request.baseUrl` only in your **local config**, not in the main shared config.

### 3.1. Create `admin/config/main-local.php`

There is a template file:

- `admin/config/main-local.php.dist.php`

Copy it to `main-local.php` in the same directory:

```bash
cd ecommerce-backend/admin/config
copy main-local.php.dist.php main-local.php   # PowerShell / cmd
```

Or do the equivalent copy in your editor/Explorer.

### 3.2. Edit `admin/config/main-local.php`

Open `admin/config/main-local.php` and **add/extend** the `request` component so it overrides `baseUrl` to an empty string.

Example `admin/config/main-local.php`:

```php
<?php

$config = [
    'components' => [
        'request' => [
            // keep or generate your own secret key
            'cookieValidationKey' => '93A7_cJtipPNll5usW98DSXDD45WrQF2',

            // IMPORTANT: for php -S admin/web setup, serve app at /
            'baseUrl' => '',
        ],
    ],
];

if (!YII_ENV_TEST) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'generators' => [
            'swagger-model' => [
                'class' => \common\components\gii\swagger\Generator::class,
            ],
            'crud' => [
                'class' => \common\components\gii\crud\Generator::class,
            ],
        ],
    ];
}

return $config;
```

Notes:

- The `ArrayHelper::merge()` in `environments/dev/admin/web/index.php` loads configs in this order:
  - `common/config/main.php`
  - `common/config/main-local.php`
  - `admin/config/main.php`
  - `admin/config/main-local.php`
- Because `main-local.php` is loaded **last**, any values you set there (like `baseUrl`) override the ones in `main.php`.

---

## 4. Start the PHP built‑in server and open the correct URL

From the project root (`ecommerce-backend`), run:

```bash
php -S localhost:8080 -t admin/web
```

Then open in your browser:

- `http://localhost:8080/site/login`
  - or simply `http://localhost:8080` and navigate to the login page.

Because `baseUrl` is now `''`:

- CSS/JS URLs will be like `/css/styles.css`.
- With `-t admin/web`, those files are served from `admin/web/css/...`.
- The login page should now be **fully styled**.

If you still see no styling, open the browser dev tools (Network tab) and check:

- That CSS files such as `/css/styles.css` load with **status 200**.
- That the responses are not 404/500.

---

## 5. Alternative: use the official Docker setup (recommended)

If you want to match the production‑like environment used by the project authors (and avoid manual `baseUrl` tweaks), use the Docker setup from `README.md`:

1. Install Docker Desktop.
2. Place the DB dump as `docker/mysql/dumps/dump.sql`.
3. From the `docker` directory, run:
   - `docker compose build`
   - `docker compose up`
4. Access the admin panel at:
   - `http://localhost:8080/admin-panel`

In that setup, the web server knows how to map `/admin-panel` to `admin/web`, so CSS and JS work out of the box without changing `baseUrl`.