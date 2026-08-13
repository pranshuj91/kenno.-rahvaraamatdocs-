---
id: OVERVIEW
title: Getting Started Overview
sidebar_label: Overview
sidebar_position: 0
---

# Getting Started

This section covers how to **set up and run** the Rahva Raamat ecommerce backend — onboarding, local/Docker setup, environment, database, configuration, and migration notes.

Use the sidebar on the left, or the tables below, to open any page. Each topic lists what is covered inside so you can scan from this overview.

## In this section

| ID | Topic |
|---|---|
| [GS-001](./ONBOARDING.md) | Onboarding Pack |
| [GS-002](./LOCAL_SETUP.md) | Local Setup Roadmap |
| [GS-003](./DOCKER_SETUP.md) | Docker Setup |
| [GS-004](../core/STRUCTURE.md) | Project Structure |
| [GS-005](./02-ENVIRONMENT_SETUP.md) | Environment Setup |
| [GS-006](./03-DATABASE_SCHEMA.md) | Database Schema |
| [GS-007](../reference/CONFIGURATION_FILES.md) | Configuration Files |
| [GS-008](../reference/08-CONFIGURATION.md) | Configuration Reference |
| [GS-009](./MIGRATION.md) | Migration Guide |
| [GS-010](./LEGACY_INSTALLATION.md) | Legacy Installation |

### [GS-001](./ONBOARDING.md) — Onboarding Pack

| Inside this page |
|---|
| [00 — Read this first](./ONBOARDING.md#00--read-this-first) |
| [01 — What Rahvaraamat is](./ONBOARDING.md#01--what-rahvaraamat-is) |
| [02 — People and who to ask](./ONBOARDING.md#02--people-and-who-to-ask) |
| [03 — System map and where truth lives](./ONBOARDING.md#03--system-map-and-where-truth-lives) |
| [04 — The stack and the Yii2 constraint](./ONBOARDING.md#04--the-stack-and-the-yii2-constraint) |
| [05 — Environments and ticket lifecycle](./ONBOARDING.md#05--environments-and-ticket-lifecycle) |
| [06 — How work actually flows](./ONBOARDING.md#06--how-work-actually-flows) |
| [07 — Triage playbook](./ONBOARDING.md#07--triage-playbook) |
| [08 — Issue classes to expect](./ONBOARDING.md#08--issue-classes-to-expect) |
| [09 — Landmines and fragile areas](./ONBOARDING.md#09--landmines-and-fragile-areas) |
| [10 — Migration context](./ONBOARDING.md#10--migration-context) |
| [11 — Day one access checklist](./ONBOARDING.md#11--day-one-access-checklist) |
| [12 — First 30 days](./ONBOARDING.md#12--first-30-days) |
| [13 — Glossary](./ONBOARDING.md#13--glossary) |
| [14 — Open KT gaps](./ONBOARDING.md#14--open-kt-gaps) |

### [GS-002](./LOCAL_SETUP.md) — Local Setup Roadmap

| Inside this page |
|---|
| [Setup path (start here)](./LOCAL_SETUP.md#setup-path-start-here) |
| [After the app runs](./LOCAL_SETUP.md#after-the-app-runs) |
| [Related quick links](./LOCAL_SETUP.md#related-quick-links) |

### [GS-003](./DOCKER_SETUP.md) — Docker Setup

| Inside this page |
|---|
| [Install Docker Desktop](./DOCKER_SETUP.md#install-docker-desktop) |
| [MySQL dump into docker/mysql/dumps](./DOCKER_SETUP.md#mysql-dump-into-dockermysqldumps) |
| [docker compose build / up](./DOCKER_SETUP.md#docker-compose-build--up) |
| [composer install & migrate](./DOCKER_SETUP.md#composer-install--migrate) |
| [Access admin panel](./DOCKER_SETUP.md#access-admin-panel) |

### [GS-004](../core/STRUCTURE.md) — Project Structure

| Inside this page |
|---|
| [admin / api / console / common layers](../core/STRUCTURE.md#admin--api--console--common-layers) |
| [Top-level directories map](../core/STRUCTURE.md#top-level-directories-map) |
| [Shared synchronizations & models](../core/STRUCTURE.md#shared-synchronizations--models) |
| [Docker & environments](../core/STRUCTURE.md#docker--environments) |

### [GS-005](./02-ENVIRONMENT_SETUP.md) — Environment Setup

| Inside this page |
|---|
| [SECTION 1: Setup PHP 8.0+ Project Without Docker](./02-ENVIRONMENT_SETUP.md#-section-1-setup-php-80-project-without-docker) |
| [SECTION 2: Project Setup](./02-ENVIRONMENT_SETUP.md#-section-2-project-setup) |
| [SECTION 3: Common Setup Problems and How to Fix Them](./02-ENVIRONMENT_SETUP.md#️-section-3-common-setup-problems-and-how-to-fix-them) |
| [SECTION 4: What Changes Might Be Needed](./02-ENVIRONMENT_SETUP.md#-section-4-what-changes-might-be-needed) |
| [SECTION 5: Verification](./02-ENVIRONMENT_SETUP.md#-section-5-verification) |
| [Additional Resources](./02-ENVIRONMENT_SETUP.md#-additional-resources) |
| [Running admin panel with PHP built‑in server (no Docker)](./02-ENVIRONMENT_SETUP.md#running-admin-panel-with-php-builtin-server-no-docker) |
| [1. How the admin app is expected to run](./02-ENVIRONMENT_SETUP.md#1-how-the-admin-app-is-expected-to-run) |
| [2. What happens with php -S localhost:8080 -t admin/web](./02-ENVIRONMENT_SETUP.md#2-what-happens-with-php--s-localhost8080--t-adminweb) |
| [3. Fix: override baseUrl in admin/config/main-local.php](./02-ENVIRONMENT_SETUP.md#3-fix-override-baseurl-in-adminconfigmain-localphp) |
| [4. Start the PHP built‑in server and open the correct URL](./02-ENVIRONMENT_SETUP.md#4-start-the-php-builtin-server-and-open-the-correct-url) |
| [5. Alternative: use the official Docker setup (recommended)](./02-ENVIRONMENT_SETUP.md#5-alternative-use-the-official-docker-setup-recommended) |

### [GS-006](./03-DATABASE_SCHEMA.md) — Database Schema

| Inside this page |
|---|
| [Schema Source](./03-DATABASE_SCHEMA.md#schema-source) |
| [Table Prefix](./03-DATABASE_SCHEMA.md#table-prefix) |
| [Key Tables](./03-DATABASE_SCHEMA.md#key-tables) |
| [ERD/Relationships](./03-DATABASE_SCHEMA.md#erdrelationships) |
| [Migrations](./03-DATABASE_SCHEMA.md#migrations) |

### [GS-007](../reference/CONFIGURATION_FILES.md) — Configuration Files

| Inside this page |
|---|
| [Where configuration files live](../reference/CONFIGURATION_FILES.md#where-configuration-files-live) |
| [Merge order and precedence](../reference/CONFIGURATION_FILES.md#merge-order-and-precedence) |
| [main.php vs main-local.php](../reference/CONFIGURATION_FILES.md#mainphp-vs-main-localphp) |
| [params.php vs params-local.php](../reference/CONFIGURATION_FILES.md#paramsphp-vs-params-localphp) |
| [Environment templates & init](../reference/CONFIGURATION_FILES.md#environment-templates-and-the-init-tool) |
| [Module configuration](../reference/CONFIGURATION_FILES.md#module-configuration) |

### [GS-008](../reference/08-CONFIGURATION.md) — Configuration Reference

| Inside this page |
|---|
| [Configuration File Hierarchy](../reference/08-CONFIGURATION.md#configuration-file-hierarchy) |
| [Environment Variables and Secrets](../reference/08-CONFIGURATION.md#environment-variables-and-secrets) |
| [Database Configuration](../reference/08-CONFIGURATION.md#database-configuration) |
| [Cache Configuration](../reference/08-CONFIGURATION.md#cache-configuration) |
| [Mail Configuration](../reference/08-CONFIGURATION.md#mail-configuration) |
| [Debug and Gii Modules](../reference/08-CONFIGURATION.md#debug-and-gii-modules) |
| [Configuration File Structure](../reference/08-CONFIGURATION.md#configuration-file-structure) |
| [Environment Setup](../reference/08-CONFIGURATION.md#environment-setup) |
| [Configuration Best Practices](../reference/08-CONFIGURATION.md#configuration-best-practices) |

### [GS-009](./MIGRATION.md) — Migration Guide

| Inside this page |
|---|
| [Application components](./MIGRATION.md#application-components) |
| [Models](./MIGRATION.md#models) |
| [Controllers](./MIGRATION.md#controllers) |

### [GS-010](./LEGACY_INSTALLATION.md) — Legacy Installation

| Inside this page |
|---|
| [Requirements](./LEGACY_INSTALLATION.md#requirements) |
| [Installation and setup](./LEGACY_INSTALLATION.md#installation-and-setup) |