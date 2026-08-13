---
id: CONFIGURATION_FILES
title: Configuration Files
sidebar_label: Configuration Files
---
# Configuration files overview (main, main-local, params, params-local, modules)

This project uses Yii2 Advanced Template style configuration with layered config files per application (admin, api, hotline, oidc, console) and shared config under common/.

The layers let you keep defaults in VCS, while overriding sensitive or environment-specific values locally without changing the base files.

Contents
- Where configuration files live
- Merge order and precedence
- What goes into each file (main.php vs main-local.php, params.php vs params-local.php)
- How and when configs are loaded (web/console entry scripts)
- Environment templates (environments/dev, environments/prod) and the init tool
- Module configuration
- Typical keys/components configured here
- Recommendations and gotchas

## Where configuration files live
- Shared (applies to all apps):
  - common/config/
    - main.php, main-local.php
    - params.php, params-local.php
    - bootstrap.php (early bootstrap for all apps)
- Per application:
  - api/config/, admin/config/, hotline/config/, oidc/config/, console/config/
    - main.php, main-local.php
    - params.php, params-local.php
    - bootstrap.php (early bootstrap for that app)
- Entry scripts that load configs:
  - Web apps: [app]/web/index.php
  - Console: yii (root), yii_test

## Merge order and precedence
Config arrays are merged at runtime using yii\helpers\ArrayHelper::merge in the entry scripts. The later files override earlier ones:
- Web (example for API):
  1) common/config/main.php
  2) common/config/main-local.php
  3) api/config/main.php
  4) api/config/main-local.php
- Console:
  1) common/config/main.php
  2) common/config/main-local.php
  3) console/config/main.php
  4) console/config/main-local.php
- Params use the same idea inside each app’s main.php:
  - $params = array_merge(
      common/config/params.php,
      common/config/params-local.php,
      [app]/config/params.php,
      [app]/config/params-local.php
    );

Practical effect: values in any *-local.php override the base files; per-app files override common; per-app local overrides everything else.

## What goes into each file

### main.php vs main-local.php

- main.php (base, committed):
  - Stable defaults and non-sensitive configuration for components, modules, aliases, bootstrap, and DI. Example: urlManager rules, i18n sources, queue settings defaults.
- main-local.php (overrides, not for production VCS):
  - Environment-specific or secret overrides: DB credentials, Redis hosts, mailer transports, allowed hosts, debug flags, etc. Each app and common has its own main-local.php so you can override at the correct scope.

### params.php vs params-local.php

- params.php (base scalar/key-value settings):
  - Project-wide or app-specific simple values used via Yii::$app->params. Example: feature flags, limits, external URLs, API keys placeholders.
- params-local.php (secret/override values for params):
  - Secrets and developer- or environment-specific values that replace keys from params.php.

## How and when configs are loaded
- Web requests (e.g., API): api/web/index.php sets YII_DEBUG/YII_ENV, includes vendor autoloaders and bootstraps, then merges the four main config arrays listed above and starts new yii\web\Application($config)->run().
- Console commands: the root yii script does the same for console with yii\console\Application.
- Bootstrapping: Files common/config/bootstrap.php and [app]/config/bootstrap.php are included early to register aliases, define constants, or perform light setup before the main config is evaluated.

## Environment templates and the init tool
- The environments folder contains ready-to-copy templates for dev and prod:
  - environments/dev|prod/[app]/config/main-local.php, params-local.php, bootstrap.php, and web/entry scripts.
  - The init (php init) tool copies these templates into the actual locations (e.g., common/config/main-local.php), depending on the chosen environment.
- In Docker, the image entrypoint runs `php init --env=Development --overwrite=None` on first start if files are missing, ensuring the local configs exist.

## Module configuration
- Modules are registered under the modules section in each app’s main.php (e.g., api has modules stacc, audio, ebook, v2). You can configure module-specific components/params here or within the module itself.
- Shared components (e.g., cache, queue, classifier, system) are typically defined in common/config/main.php so they are available to all apps; app main-local.php can override them if needed.

## Typical keys/components configured
- Components: cache (Redis), db, log targets, i18n, mailer, urlManager, session, queue (yii\queue\db\Queue with MysqlMutex), custom components (e.g., classifier, system, audioStreamManager), and DI container singletons via bootstrap where applicable.
- Modules: API submodules (audio, ebook, v2, stacc), admin-side modules as needed.
- Aliases: @bower, @npm, storage/paths, S3 buckets, etc.
- Params: web store settings, discounts, external integrations, feature flags.

## Recommendations and gotchas
- Do not commit secrets: keep credentials, tokens, and environment-only switches in *-local.php files. Sample/dist files (e.g., main-local.php.dist) may exist as references.
- Verify local files exist: if you see errors like failed DB connection in development, ensure common/config/main-local.php and [app]/config/main-local.php are present. Run `php init` if missing.
- Precedence surprises: remember that [app]/config/main-local.php overrides the same keys defined in common/config/main.php or [app]/config/main.php.
- Params access: read values via Yii::$app->params['key']; prefer params-local.php for environment-specific overrides.
- Caching: when changing configuration that affects DI or i18n, clear runtime caches if necessary (runtime/ folders); in long-running containers, restart the service.
- Docker environment variables: Many values can be sourced from docker-compose (e.g., Redis host is `redis`, DB is `mysql` by service name). Align your *-local.php accordingly.

See also
- common/config/main.php — shared components and bootstrap
- [app]/config/main.php — per-app modules and components (e.g., api/config/main.php)
- environments/ — init templates for dev/prod
- README.md and INSTALLATION.md — setup and environment notes

