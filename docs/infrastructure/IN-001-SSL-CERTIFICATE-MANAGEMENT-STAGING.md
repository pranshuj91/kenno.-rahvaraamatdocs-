---
id: IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING
title: IN-001 — SSL Certificate Management (Staging)
sidebar_label: IN-001 SSL (Staging)
---

# IN-001 — SSL Certificate Management (Staging)

Confirmed staging findings for SSL/TLS on the Rahva Raamat staging host.

Source: Zone.ee portal screenshots, 31 July 2026.

## SSL certificates

Three SSL certificates are configured for staging:

| Domain | Status | Expiry |
|---|---|---|
| `dev.rahvaraamat.ee` | Active | 09-09-2026 |
| `audio.dev.rahvaraamat.ee` | Active | 22-09-2026 |
| `main.dev.rahvaraamat.ee` | Active | 27-10-2026 |

## HTTPS configuration

| Item | Value |
|---|---|
| HTTPS enabled | Yes |
| PHP version (main `dev.rahvaraamat.ee`) | PHP 8.3 |
| PHP version (`audio.dev` / `main.dev`) | PHP 8.4 |
| PHP upgrade strategy (main) | Manual |
| Web Application Firewall (WAF) | Disabled |
| Custom error pages (400–500) | Not configured |

## Virtual IP

| Item | Value |
|---|---|
| IPv4 | `217.146.71.63` |
| IPv6 | `2A02:29EA:A:295::1CA` |

## Document root

```text
/data01/virt20240/domeenid/www.dev.rahvaraamat.ee/uus-rahvaraamat/
```

## Related pages

- [IN-005 Staging Server Architecture](./IN-005-STAGING-SERVER-ARCHITECTURE.md)
- Gap mirror: [IN-001 SSL Certificate](/gaps/infrastructure/IN-001-ssl-certificate)

## Summary

Staging HTTPS is **enabled**. Certificates for `dev.rahvaraamat.ee`, `audio.dev.rahvaraamat.ee`, and `main.dev.rahvaraamat.ee` are **Active** (expiry Sep–Oct 2026). Main host PHP is **8.3**; subdomain hosts use **8.4**. WAF is **disabled**. Custom Apache error pages are not configured.
