---
id: OIDC_SERVER
title: OpenID Connect Server
sidebar_label: OIDC Server
---
# OpenID connect server

The application is responsible for providing OIDC functionality for authenticating users to the external mobile application.
The solution is done based on [the library](https://github.com/rhertogh/yii2-oauth2-server/tree/master).

## Setup
Here are the steps that should be done to set up the OIDC server.

- `composer install`.
- configure pcntl PHP extension (can be done in zone admin panel).
- Add OIDC application apache config in the root `.htaccess` file like it's done in `.htaccess.example`.
- Add OIDC application apache config in the web root: `cp oidc/web/.htaccess.example oidc/web/.htaccess`.
- `cp oidc/config/main-local.php.dist oidc/config/main-local.php` NOTE: configure redis as session storage for the oidc application for better performance (see `oidc/config/main-local.php.dist.php`)
- `cp oidc/config/params-local.php.dist oidc/config/params-local.php`.
- `cd common/config/keys`.
- `openssl genrsa -out openid-connect-private.key 2048` generate private key
- `openssl rsa -in openid-connect-private.key -pubout -out openid-connect-public.key` - extract the public key from the private key
- `chmod 660 openid-connect-*.key`
- `vendor/bin/generate-defuse-key` Run the command twice to generate `YII2_OAUTH2_SERVER_CODES_ENCRYPTION_KEY` and `YII2_OAUTH2_SERVER_STORAGE_ENCRYPTION_KEY`
- Put the received values into `preinit.environment.php` as it's done in `common/config/preinit.environment.php.dist`
- `php yii migrate`
- Define the client for mobile app: `php yii oauth2/client/create --type=1 --grantTypes=1` && Store the secret to provide it to mobile app team
- Configure created client: `php yii oidc/configure-client {client_identifier}`
- Add new redirect URI's for Google/Facebook/Apple Oauth2 applications. (see `oidc/controllers/AuthController.php`)
- Validate installation by running the command: `php yii oauth2/debug/config`

