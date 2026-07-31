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

- [IN-005 Production Server Architecture](/docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE)
- Gap mirror: [IN-001 SSL Certificate](/gaps/infrastructure/IN-001-ssl-certificate)

## Summary

Production HTTPS is **enabled** for `web.rahvaraamat.ee`, the certificate is **active**, and it expires on **28 October 2026**. PHP on this host is **8.3** (upgraded manually). WAF is **disabled**. Custom Apache error pages are not configured.


---

### From `docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md`


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

- [IN-005 Staging Server Architecture](/docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE)
- Gap mirror: [IN-001 SSL Certificate](/gaps/infrastructure/IN-001-ssl-certificate)

## Summary

Staging HTTPS is **enabled**. Certificates for `dev.rahvaraamat.ee`, `audio.dev.rahvaraamat.ee`, and `main.dev.rahvaraamat.ee` are **Active** (expiry Sep–Oct 2026). Main host PHP is **8.3**; subdomain hosts use **8.4**. WAF is **disabled**. Custom Apache error pages are not configured.

