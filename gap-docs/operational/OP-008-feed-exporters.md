---
id: OP-008-feed-exporters
title: OP-008 — Feed Exporters
sidebar_label: OP-008 Feed Exporters
---

# OP-008 — Feed Exporters

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Feed Exporters |
| Description | Product feeds for external systems — feed formats, schedules, recipients |
| Documentation status | Documented |
| Code location | console/controllers/FeedExporterController.php |
| Assigned to | — |
| Notes | No dedicated feed-exporter page exists; content below is copied only from matching sections already in docs/ |

## Source files used

- `docs/monitoring/CRON_JOBS.md` (Feed Export section)
- `docs/reference/07-CONSOLE_COMMANDS.md` (FeedExporterController section)

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under `docs/`. Nothing invented. There is still no standalone full feed-exporter guide in this site.

---

### From `docs/monitoring/CRON_JOBS.md` — Feed Export

### Feed Export
- **Command:** `php yii feed-exporter/generate-csv`
- **Command:** `php yii feed-exporter/generate-facebook-csv`
- **Command:** `php yii feed-exporter/generate-google-csv`
- **Command:** `php yii feed-exporter/generate-google-watch-csv`
- **Command:** `php yii feed-exporter/generate-products-csv`
- **File:** `console/controllers/FeedExporterController.php`
- **Filter:** AlreadyRunningFilter
- **Purpose:** Generates product feeds for external systems (resellers, Facebook Catalog, Google Shopping)

---

### From `docs/reference/07-CONSOLE_COMMANDS.md` — FeedExporterController

#### **FeedExporterController** (`console/controllers/FeedExporterController.php`)
Data feed export operations.

**Key Commands**:
```bash
# Export product feed
php yii feed-exporter/export-products

# Export category feed
php yii feed-exporter/export-categories
```
