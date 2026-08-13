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
| 00 — Read this first |
| 01 — What Rahvaraamat is |
| 02 — People and who to ask |
| 03 — System map and where truth lives |
| 04 — The stack and the Yii2 constraint |
| 05 — Environments and ticket lifecycle |
| 06 — How work actually flows |
| 07 — Triage playbook |
| 08 — Issue classes to expect |
| 09 — Landmines and fragile areas |
| 10 — Migration context |
| 11 — Day one access checklist |
| 12 — First 30 days |
| 13 — Glossary |
| 14 — Open KT gaps |


### [GS-002](./LOCAL_SETUP.md) — Local Setup Roadmap

| Inside this page |
|---|
| Setup path (start here) |
| After the app runs |
| Related quick links |


### [GS-003](./DOCKER_SETUP.md) — Docker Setup

| Inside this page |
|---|
| Install Docker Desktop |
| MySQL dump into docker/mysql/dumps |
| docker compose build / up |
| composer install & migrate |
| Access admin panel |


### [GS-004](../core/STRUCTURE.md) — Project Structure

| Inside this page |
|---|
| admin / api / console / common layers |
| Top-level directories map |
| Shared synchronizations & models |
| Docker & environments |


### [GS-005](./02-ENVIRONMENT_SETUP.md) — Environment Setup

| Inside this page |
|---|
| SECTION 1: Setup PHP 8.0+ Project Without Docker |
| SECTION 2: Project Setup |
| SECTION 3: Common Setup Problems and How to Fix Them |
| SECTION 4: What Changes Might Be Needed |
| SECTION 5: Verification |
| Additional Resources |
| Running admin panel with PHP built‑in server (no Docker) |
| 1. How the admin app is expected to run |
| 2. What happens with php -S localhost:8080 -t admin/web |
| 3. Fix: override baseUrl in admin/config/main-local.php |
| 4. Start the PHP built‑in server and open the correct URL |
| 5. Alternative: use the official Docker setup (recommended) |


### [GS-006](./03-DATABASE_SCHEMA.md) — Database Schema

| Inside this page |
|---|
| Schema Source |
| Table Prefix |
| Key Tables |
| ERD/Relationships |
| Migrations |


### [GS-007](../reference/CONFIGURATION_FILES.md) — Configuration Files

| Inside this page |
|---|
| Where configuration files live |
| Merge order and precedence |
| main.php vs main-local.php |
| params.php vs params-local.php |
| Environment templates & init |
| Module configuration |


### [GS-008](../reference/08-CONFIGURATION.md) — Configuration Reference

| Inside this page |
|---|
| Configuration File Hierarchy |
| Environment Variables and Secrets |
| Database Configuration |
| Cache Configuration |
| Mail Configuration |
| Debug and Gii Modules |
| Configuration File Structure |
| Environment Setup |
| Configuration Best Practices |


### [GS-009](./MIGRATION.md) — Migration Guide

| Inside this page |
|---|
| Application components |
| Models |
| Controllers |


### [GS-010](./LEGACY_INSTALLATION.md) — Legacy Installation

| Inside this page |
|---|
| Requirements |
| Installation and setup |
