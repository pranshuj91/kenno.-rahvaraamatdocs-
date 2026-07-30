---
id: IN-001-SSL-CERTIFICATE-MANAGEMENT
title: IN-001 — SSL Certificate Management
sidebar_label: IN-001 SSL Certificates
---

# IN-001 — SSL Certificate Management

Confirmed production findings for SSL/TLS on the Rahva Raamat web host.

## SSL certificate

| Item | Value |
|---|---|
| Certificate status | Active |
| Domain | `web.rahvaraamat.ee` |
| Certificate expiry | 29-08-2026 |
| HTTPS enabled | Yes |

## Runtime related to the web host

| Item | Value |
|---|---|
| PHP version | PHP 8.3 |
| PHP upgrade strategy | Manual |
| Web Application Firewall (WAF) | Disabled |

## Document root

```text
/data01/virt102759/domeenid/www.web.rahvaraamat.ee/uus-rahvaraamat/
```

## Summary

Production HTTPS is **enabled** for `web.rahvaraamat.ee`, the certificate is **active**, and it expires on **29 August 2026**. PHP on this host is **8.3** (upgraded manually). WAF is **disabled**.
