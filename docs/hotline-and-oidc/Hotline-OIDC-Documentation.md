id: Hotline-OIDC-Documentation
title: Hotline-OIDC-Documentation
# Hotline and OIDC Modules Documentation

## Overview

This document provides comprehensive documentation for two specialized modules in the ecommerce backend system:

1. **Hotline Module** - A product search and comparison service
2. **OIDC Module** - OpenID Connect authentication server for mobile applications


## 1. Hotline Module

### Purpose and Functionality

The **Hotline Module** is a specialized product search and comparison service that provides:

- **Product Search Interface**: A web-based search interface for browsing and comparing products
- **Elasticsearch Integration**: Advanced product search using Elasticsearch for fast and accurate results
- **IP-Based Access Control**: Restricted access to specific IP addresses (Hotline partners)
- **Product Comparison**: Tools for comparing products across different shops
- **Multi-language Support**: Support for Estonian language with internationalization

### Key Components

#### Directory Structure
```
hotline/
├── assets/          # Static assets (CSS, JS, images)
├── bootstrap/       # Application bootstrap files
├── config/          # Configuration files
├── controllers/     # Controller classes
├── models/          # Model classes
├── views/           # View templates
└── web/            # Web entry point
```

#### Main Controllers

1. **SearchController** (`hotline/controllers/SearchController.php`)
   - Handles product search functionality
   - IP-based access control for Hotline partners
   - Provides product listing and search results

#### Key Models

1. **ProductElasticSearch** (`hotline/models/ProductElasticSearch.php`)
   - Manages Elasticsearch queries for product search
   - Handles filtering, sorting, and pagination
   - Supports multiple search criteria (availability, language, product type)

2. **ProductViewDecorator** (`hotline/models/ProductViewDecorator.php`)
   - Decorates product data for display
   - Formats product information for the search interface

### Configuration

#### Main Configuration (`hotline/config/main.php`)
- Application ID: `app-hotline`
- Base URL: `/hotline`
- Language: Estonian (`et`)
- Session configuration for hotline-specific cookies
- Asset management for CSS/JS optimization

#### Access Control
- IP-based access control using `WebStoreIp::getHotlineIps()`
- Only allows access from predefined Hotline partner IP addresses

### How to Work with Hotline Module

#### 1. Setup and Installation

```bash
# Ensure Elasticsearch is running and configured
# Configure IP addresses for Hotline partners in WebStoreIp model
# Set up proper routing in main application
```

#### 2. Accessing the Module

- **URL**: `https://yourdomain.com/hotline`
- **Default Route**: `search/index`
- **Access**: Restricted to Hotline partner IP addresses

#### 3. Search Functionality

The search interface provides:
- **Product Search**: Search by product name, description, or keywords
- **Filtering Options**:
  - Availability status (Available, Out of Stock, Coming Soon)
  - Product types (Books, E-books, Games, Office Equipment, etc.)
  - Language selection
  - Shop selection
- **Sorting Options**: Price, relevance, popularity
- **Pagination**: Load more products with AJAX

#### 4. Product Display

Products are displayed with:
- Product images and basic information
- Price comparison across shops
- Availability status
- Shop information
- Product type categorization

#### 5. Integration Points

- **Elasticsearch**: For fast product search
- **Common Models**: Uses `common/models/Product` and related models
- **API Module**: Leverages API models for data consistency


## 2. OIDC (OpenID Connect) Module

### Purpose and Functionality

The **OIDC Module** is an OpenID Connect authentication server that provides:

- **OAuth 2.0 Authorization Server**: Complete OAuth 2.0 implementation
- **OpenID Connect Provider**: Identity provider for mobile applications
- **Social Login Integration**: Support for Google, Facebook, Apple OAuth
- **JWT Token Management**: Secure token generation and validation
- **User Authentication**: Login/logout functionality for external applications

### Key Components

#### Directory Structure
```
oidc/
├── assets/          # Static assets
├── bootstrap/       # Application bootstrap
├── components/      # Custom components
├── config/          # Configuration files
├── controllers/     # Controller classes
├── models/          # Model classes
├── views/           # View templates
├── web/            # Web entry point
└── README.md       # Setup instructions
```

#### Main Controllers

1. **AuthController** (`oidc/controllers/AuthController.php`)
   - Handles user authentication
   - Manages OAuth 2.0 authorization flow
   - Processes social login callbacks

2. **DefaultController** (`oidc/controllers/DefaultController.php`)
   - Handles default routes and error pages

#### Key Models

1. **User** (`oidc/models/User.php`)
   - User identity model for OIDC
   - Implements OAuth 2.0 user interface

2. **LoginForm** (`oidc/models/LoginForm.php`)
   - Form model for user login
   - Validates user credentials

3. **ExternalOauth2LoginHandler** (`oidc/models/ExternalOauth2LoginHandler.php`)
   - Handles social login integration
   - Processes external OAuth providers

### Configuration

#### Main Configuration (`oidc/config/main.php`)
- Application ID: `app-oidc`
- Base URL: `/oidc`
- Language: Estonian (`et`)
- OAuth 2.0 module integration

#### OIDC Module Configuration (`oidc/config/oidc-module.php`)
```php
return [
    'class' => Oauth2Module::class,
    'identityClass' => User::class,
    'privateKey' => 'file://' . Yii::getAlias('@keys/openid-connect-private.key'),
    'publicKey' => 'file://' . Yii::getAlias('@keys/openid-connect-public.key'),
    'enableOpenIdConnect' => true,
    'grantTypes' => [
        Oauth2BaseModule::GRANT_TYPE_AUTH_CODE,
        Oauth2BaseModule::GRANT_TYPE_REFRESH_TOKEN,
    ],
    // ... other configurations
];
```

### How to Work with OIDC Module

#### 1. Setup and Installation

Follow the setup instructions in `oidc/README.md`:

```bash
# 1. Install dependencies
composer install

# 2. Configure PHP extensions
# Enable pcntl PHP extension

# 3. Configure Apache
# Add OIDC application apache config in root .htaccess
cp oidc/web/.htaccess.example oidc/web/.htaccess

# 4. Configure application
cp oidc/config/main-local.php.dist oidc/config/main-local.php
cp oidc/config/params-local.php.dist oidc/config/params-local.php

# 5. Generate cryptographic keys
cd common/config/keys
openssl genrsa -out openid-connect-private.key 2048
openssl rsa -in openid-connect-private.key -pubout -out openid-connect-public.key
chmod 660 openid-connect-*.key

# 6. Generate encryption keys
vendor/bin/generate-defuse-key  # Run twice for different keys

# 7. Configure environment variables
# Add keys to preinit.environment.php

# 8. Run migrations
php yii migrate

# 9. Create OAuth client
php yii oauth2/client/create --type=1 --grantTypes=1

# 10. Configure client
php yii oidc/configure-client {client_identifier}

# 11. Validate installation
php yii oauth2/debug/config
```

#### 2. OAuth 2.0 Flow

The OIDC module supports standard OAuth 2.0 flows:

1. **Authorization Code Flow**:
   ```
   Client → OIDC Server → User Login → Authorization Code → Access Token
   ```

2. **Refresh Token Flow**:
   ```
   Client → Refresh Token → New Access Token
   ```

#### 3. OpenID Connect Features

- **Discovery Endpoint**: `/.well-known/openid_configuration`
- **User Info Endpoint**: `/openid-connect/userinfo`
- **End Session Endpoint**: `/openid-connect/end-session`
- **JWKS Endpoint**: `/oauth2/jwks`

#### 4. Social Login Integration

The module supports external OAuth providers:
- Google OAuth 2.0
- Facebook OAuth 2.0
- Apple OAuth 2.0

Configuration in `AuthController.php`:
```php
public function actions(): array
{
    return [
        'external' => [
            'class' => AuthAction::class,
            'successCallback' => [$this, 'onAuthSuccess'],
        ],
    ];
}
```

#### 5. Token Management

- **Access Tokens**: JWT-based with configurable TTL
- **Refresh Tokens**: For long-term access
- **ID Tokens**: OpenID Connect identity tokens
- **Token Encryption**: AES encryption for sensitive data

#### 6. Security Features

- **Private/Public Key Pair**: RSA key pair for token signing
- **Encryption Keys**: AES keys for data encryption
- **HTTPS Enforcement**: TLS required in production
- **Session Management**: Secure session handling

### API Endpoints

#### OAuth 2.0 Endpoints
- `POST /oauth2/token` - Token endpoint
- `GET /oauth2/authorize` - Authorization endpoint
- `POST /oauth2/revoke` - Token revocation

#### OpenID Connect Endpoints
- `GET /.well-known/openid_configuration` - Discovery
- `GET /openid-connect/userinfo` - User info
- `GET /openid-connect/end-session` - Logout

### Integration with Mobile Applications

1. **Client Registration**: Register mobile app as OAuth client
2. **Redirect URIs**: Configure allowed redirect URIs
3. **Scopes**: Define required scopes (openid, profile, email, etc.)
4. **Token Handling**: Implement token storage and refresh logic

### Monitoring and Debugging

```bash
# Check OAuth 2.0 configuration
php yii oauth2/debug/config

# List registered clients
php yii oauth2/client/list

# View client details
php yii oauth2/client/view {client_id}
```


## Common Integration Points

### Database Integration
Both modules share the same database schema and use common models:
- User management
- Product data
- Shop information
- Configuration settings

### Shared Components
- **Common Models**: Both modules use models from `common/models/`
- **Configuration**: Shared configuration in `common/config/`
- **Authentication**: Common user authentication system

### Security Considerations

#### Hotline Module
- IP-based access control
- Session management
- CSRF protection

#### OIDC Module
- Cryptographic key management
- Token security
- HTTPS enforcement
- Rate limiting


## Troubleshooting

### Hotline Module Issues

1. **Access Denied**: Check IP whitelist configuration
2. **Search Not Working**: Verify Elasticsearch connection
3. **Products Not Loading**: Check database connectivity

### OIDC Module Issues

1. **Token Generation Failed**: Verify cryptographic keys
2. **Client Authentication Failed**: Check client credentials
3. **Social Login Issues**: Verify OAuth provider configuration

### Common Issues

1. **Configuration Errors**: Check all required configuration files
2. **Database Connection**: Verify database connectivity
3. **File Permissions**: Ensure proper file permissions for keys


## Best Practices

### Development
- Use environment-specific configurations
- Implement proper error handling
- Follow security guidelines
- Test thoroughly before deployment

### Production
- Use HTTPS for all communications
- Implement proper logging
- Monitor system performance
- Regular security updates

### Maintenance
- Regular key rotation
- Database backups
- Log monitoring
- Performance optimization


This documentation provides a comprehensive overview of both the Hotline and OIDC modules, their functionality, setup procedures, and integration guidelines. For specific implementation details, refer to the individual module files and the existing README files. 
