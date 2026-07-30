---
id: IN-001-ssl-certificate
title: IN-001 — SSL Certificate Management
sidebar_label: IN-001 SSL Certificates
---

# IN-001 — SSL Certificate Management

| Field | Value |
|---|---|
| Priority | Infrastructure |
| Category | Infrastructure |
| Gap item | SSL Certificate Management |
| Description | Certificate renewal, web server SSL configuration — handled at server/infrastructure level |
| Documentation status | Documented |
| Code location | Outside codebase |
| Assigned to | — |

## Source files used

- `docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT.md`
- `docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented.


---

### From `docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT.md`

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


---

### From `docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md`

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


