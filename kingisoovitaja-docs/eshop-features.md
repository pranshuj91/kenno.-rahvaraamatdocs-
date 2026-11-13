---
id: eshop-features
title: E-shop Features (Occasions, Gift Profiles, Feed, Changes)
sidebar_label: E-shop Features
---

# E-shop Features

## RR-252: Curated gift occasion lists (admin)

Product managers keep a list of products per gift occasion (Christmas, birthday, Mother's Day and so on). Kingisoovitaja receives these through the feed (RR-255) and can then also suggest them when a shopper mentions that occasion. They are **added** to what the assistant can find; they are not the only allowed products and are not ranked higher.

- **Menu:** `Kingisoovitaja sündmused` (English "Gift recommendation events", meaning occasions). **URL:** `/content/gift-occasion`. **Permission:** `specialListManagement`.

| Page / action | What it does |
|---|---|
| `index` | List of occasions: name, code, validity, number of active products, active flag, last change |
| `create` | New occasion: `code`, `name_et`, `name_en`, `name_ru`, `valid_from`, `valid_to`, `is_active` |
| `update` | Edit (the **code is locked** after creation). Add products by pasting codes or importing a file. Shows last import report, active products (drag to reorder) and removed products ("Taasta" restores) |
| `remove-products` (POST) | **Switches off** selected products (`is_active = 0`); nothing is deleted |
| `restore-product` (POST) | Switches a removed product back on, at the end of the list |
| `sort-products` (POST, AJAX) | Saves the drag-and-drop order |
| `download-unmatched` (GET) | CSV (`;`, with BOM) of codes not found or matching several products |

There is **no delete** for occasions or their products; they are switched off so the next feed shows the removal (empty `occasions` value).

**Adding products:** paste (one code per line or comma separated) or file (`.xlsx`, `.xls`, `.csv`, codes in the first column, up to **2000 rows**). A code is matched (`ProductIdentifierResolver`) first by NAV product code, then EAN/ISBN (hyphens and spaces removed; a 12-digit code is also tried with a leading `0`), then product ID (digits only, up to 10). If a code matches several products the NAV-imported one is preferred; otherwise it is reported as **ambiguous**.

**Rules:** `code` required, max 50, only `a-z 0-9 _`, unique, cannot change. `name_et` required. `valid_to >= valid_from`; outside the window the occasion is not exported. `sort_order` is only for managers.

**Tables:** `rr_gift_occasion` (`code` unique) and `rr_gift_occasion_product` (unique `(gift_occasion_id, product_id)`; FK to occasion ON DELETE RESTRICT; FK to `rr_product` ON DELETE CASCADE). Migration `m261013_120000_create_gift_occasion_tables`.

**Main files:** `admin/modules/content/controllers/GiftOccasionController.php`, `common/managers/giftOccasions/*`, `common/models/GiftOccasion.php`, `GiftOccasionProduct.php`. Tests: `ProductIdentifierResolverTest.php` (9 tests).

## RR-253: AI gift profiles (admin review)

An AI writes a short gift profile per product: what it is, whether it is a gift book, ages, recipients, interests, characters, a one-sentence gift reason and a gift score.

:::caution[Current status]
Profiles are built and can be reviewed, but **Kingisoovitaja does not use them**. Kingisoovitaja makes its own gift profiles (Kenno's enrichment, RR-242/RR-263), so automatic generation here is off (`queueOnCurate => false`) and the profiles are **not in the feed**. Planned future use: the **gift-book flag** only.
:::

- **Menu:** `Kingisoovitaja kingiprofiilid`. **URL:** `/content/gift-profile`. **Permission:** `specialListManagement`.
- Pages: `index` (filters), `update?id=PRODUCT_ID` (review form; fields below confidence **0.7** are highlighted), `regenerate` (POST; refused for manually edited profiles). Saving marks the profile reviewed; changing any value sets `is_manually_edited = 1` and the AI never overwrites it.
- **Generation** (`GiftProfileGenerator`): primary **OpenAI `gpt-4.1-mini`**, fallback **Gemini** (`gemini-2.5-pro` by default), temperature 0.2, JSON output. Prompt stored in `rr_ai_prompt` key `product_gift_profile_json` (editable in admin, Settings, AI prompts).
- **Hard rules in code:** unknown kind becomes `other`; `is_gift_book` only for kind `book`; ages 0 to 99; an "under 3" / small parts / choking warning forces `age_from >= 3`; lists max 10 items; scores clamped 0 to 1; gift reason only in configured languages (`et`), max 300 characters.
- **Candidates:** `curated` (active occasions), `gift-books` (categories NAV code `KINKRAAMAT`, `KINK_MUUD`; Gardners excluded), `all`.
- **Commands:**

```bash
./yii gift-profile/stats
./yii gift-profile/queue --scope=curated --force=1 --limit=100
./yii gift-profile/generate --productIds=2849642,2907626 --force=1
```

No cron for these; run by hand. **Table:** `rr_product_gift_profile` (migration `m261014_120000_create_product_gift_profile_table`).

**Config** (`common/config/params.php`, `productEnrichment.giftProfile`): `primaryVendor` openai, `openAiModel` gpt-4.1-mini, `languages` `['et']`, `giftBookCategoryNavCodes` `['KINKRAAMAT','KINK_MUUD']`, `queueOnCurate` false.

## RR-255: Occasions in the product feed

Adds the **last column** `occasions` to `products-feed.csv`: codes of curated occasions, sorted and joined with `", "` (for example `birthday, christmas`). Included only when the occasion is active, the product row is active and today (Europe/Tallinn) is inside `valid_from`/`valid_to`. An **empty value** means not (or no longer) curated; that is how removals reach Kingisoovitaja. Gift profiles are deliberately not exported. Kingisoovitaja reads feed columns **by name**.

Files: `console/feeds/GiftAdvisorFeedColumns.php`, `console/feeds/ProductsCsvGenerator.php`.

## RR-257: Same-day price and stock changes

The feed is generated once a day, so Kingisoovitaja asks every 10 minutes "what changed since my last cursor?". **Pull only**, no webhook.

- **Detection:** `console/feeds/GiftAdvisorChangeTracker.php` keeps the last state per feed product in `rr_gift_advisor_product_state` and writes `rr_gift_advisor_change` rows on change (state hash). State: `in_feed`, `price`, `sale_price`, `availability`, `available_in_stock`. The first run only records. Changes are kept **7 days**; runs are logged in `rr_gift_advisor_tracker_run`.
- **Cron (e-shop server crontab, not in repo):**

```bash
*/10 * * * *   ./yii gift-advisor/track-changes
30 0 * * *     ./yii gift-advisor/track-changes --full=1
./yii gift-advisor/track-changes --dryRun=1
```

- **Alert rule:** a run with `error` set, or no finished run for over an hour, means changes are not reaching Kingisoovitaja.

### `GET /gift-advisor/changes`

- Auth: `X-API-Key` (type `GIFT_ADVISOR`); `?api_key=` also works but is discouraged. Optional IP allow-list (CIDR) on the key.
- Query: `cursor` (int at least 0, optional), `limit` (1 to 1000, default 500).
- Response: `cursor`, `has_more`, `cursor_expired`, `changes[]` with `product_id, in_feed, price, sale_price, availability, available_in_stock, changed_at`.
- No cursor: starts from the last 24 hours. Each product once per page with its current state. `has_more: true` means call again with the new cursor. `cursor_expired: true` means older than 7 days: full resync from the feed. `in_feed: false` means remove from the index. Errors: 400, 401.
- Migration `m261016_120000_create_gift_advisor_change_tables` also creates the API key (row in `rr_api_user_access`, named "Kingisoovitaja Gift Advisor", type `GIFT_ADVISOR`, random 48 characters, never in git), visible in admin under Settings, API access.

## Admin menu items in plain words

| Menu item | What it is | Used by Kingisoovitaja today? |
|---|---|---|
| Kampaaniate loendid (Campaign lists) | Normal e-shop campaign lists synced from NAV; existed before RR-233 | Indirectly: campaign prices reach Kingisoovitaja through `sale_price` and `/changes` |
| Kingisoovitaja sündmused | Curated occasion lists (RR-252) | **Yes**, through the nightly feed, as a supplement, not boosted |
| Kingisoovitaja kingiprofiilid | Review of AI gift profiles (RR-253) | **No**; gift-book flag planned |

"Events" is a weak translation of "sündmused"; "Gift recommendation occasions" would be clearer.
