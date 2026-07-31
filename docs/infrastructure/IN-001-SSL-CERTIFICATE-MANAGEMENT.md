---
id: IN-001-SSL-CERTIFICATE-MANAGEMENT
title: IN-001 — SSL Certificate Management
sidebar_label: IN-001 SSL Certificates
---

# IN-001 — SSL Certificate Management

Confirmed production findings for SSL/TLS on the Rahva Raamat web host.

Source: Zone.ee portal screenshots, 31 July 2026.

## SSL certificate

| Item | Value |
|---|---|
| Certificate status | Active |
| Domain | `web.rahvaraamat.ee` |
| Certificate expiry | 28-10-2026 |
| Certificate label | `28.10.2026 - web…araamat.ee - YR2` |
| HTTPS enabled | Yes |
| HTTP → HTTPS redirect | Enabled |

## Runtime related to the web host

| Item | Value |
|---|---|
| PHP version | PHP 8.3 |
| PHP upgrade strategy | Manual |
| Web Application Firewall (WAF) | Disabled |
| Custom error pages (400–500) | Not configured |

## Document root

```text
/data01/virt102759/domeenid/www.web.rahvaraamat.ee/uus-rahvaraamat/
```

## Related pages

- [IN-005 Production Server Architecture](./IN-005-PRODUCTION-SERVER-ARCHITECTURE.md)
- Gap mirror: [IN-001 SSL Certificate](/gaps/infrastructure/IN-001-ssl-certificate)

## Summary

Production HTTPS is **enabled** for `web.rahvaraamat.ee`, the certificate is **active**, and it expires on **28 October 2026**. PHP on this host is **8.3** (upgraded manually). WAF is **disabled**. Custom Apache error pages are not configured.
