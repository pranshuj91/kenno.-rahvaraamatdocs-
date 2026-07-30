---
id: IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING
title: IN-001 — SSL Certificate Management (Staging)
sidebar_label: IN-001 SSL (Staging)
---

# IN-001 — SSL Certificate Management (Staging)

Confirmed staging findings for SSL/TLS on the Rahva Raamat staging host.

## SSL certificates

Three SSL certificates are configured for staging:

| Domain | Status | Expiry |
|---|---|---|
| `dev.rahvaraamat.ee` | Active | 09-09-2026 |
| `audio.dev.rahvaraamat.ee` | Active | 22-09-2026 |
| `main.dev.rahvaraamat.ee` | Expiring | 28-08-2026 |

## HTTPS configuration

| Item | Value |
|---|---|
| HTTPS enabled | Yes |
| PHP version | PHP 8.3 |
| PHP upgrade strategy | Manual |
| Web Application Firewall (WAF) | Disabled |

## Virtual IP

| Item | Value |
|---|---|
| IPv4 | `217.146.71.63` |
| IPv6 | `2A02:29EA:A:295::1CA` |

## Document root

```text
/data01/virt20240/domeenid/www.dev.rahvaraamat.ee/uus-rahvaraamat/
```

## Summary

Staging HTTPS is **enabled**. Certificates for `dev.rahvaraamat.ee` and `audio.dev.rahvaraamat.ee` are **Active**. The certificate for `main.dev.rahvaraamat.ee` is marked **Expiring** (28-08-2026). PHP is **8.3** (manual upgrades). WAF is **disabled**.
