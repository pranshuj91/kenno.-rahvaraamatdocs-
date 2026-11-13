---
id: catalogue-rules
title: Catalogue Rules (What May Be Recommended)
sidebar_label: Catalogue Rules
---

# Catalogue Rules: What May Be Recommended

File: `src/catalog_rules.php`. A change needs a deploy but **no reindex**. Report with `php bin/catalog_rules.php`.

- **Mode:** allowlist.
- **Allowed divisions:** Kool ja kontor, Mängud, Ilu ja stiil, Kodu ja aed, Kingitused, Muusika, Söök ja jook, Tehnika, Sport ja harrastused.
- **Gift books (included):**
  - `Raamatud / Kinkeraamatud`
  - `Raamatud / Muud kinkeraamatud`
  - any `Raamatud` product with `is_gift_book = true`. This rule waits until the e-shop feed sends the column; until then it adds nothing and never opens the allowlist.
- **Excluded:** office supplies (`Kontoritarbed`).
- **Brand families:** Kuromi, Hello Kitty, My Melody, Cinnamoroll, Pompompurin, Pochacco, Keroppi, Badtz-Maru, Gudetama map to Sanrio.
- **Christmas 2026 campaign** (agreed 13 Oct):
  - minimum price 3.99 EUR
  - **no discounted products** (this is why the "Eripakkumised" theme can be empty)
  - only products in own stock
  - minimum gift score 6 (unprofiled products stay in)
  - order by gift score within 10% relevance bands
  - exclusions: outdoor games, acrylic paints, calendars not for 2027, advent calendars not for 2026
- **Add-ons:** gift bags, cards and wrapping are only offered by `/precart.php`, never as gifts.
- **Gardners:** no rule needed; the feed does not contain them.
- **Safety age** (`SafetyAge`) comes only from manufacturer data (`min_age`, `warning_text`), never from AI.
- **Hard QA rules** (`ResultChecks::HARD`): `out_of_stock`, `not_allowed`, `regular_book`, `under_min_price`.

`CatalogFilter` drops an included rule on a field the index cannot filter, so the allowlist never opens by mistake.

## Themes (website theme pages)

`src/themes.php` feeds `GET /products?theme=`. Each slug can set `query`, `audiences`, `occasions` (AI or curated codes), `on_sale`, `max_price`. No AI is used; the same catalogue rules apply.

| Group | Slugs |
|---|---|
| Quick topics | `koolitee-algus`, `harry-potter`, `muumid`, `wrendale`, `eripakkumised` (on sale), `kingiideed` (all) |
| Recipients | `emale` (WOMAN), `isale` (MAN), `lapsele` (CHILD), `sobrale`, `kolleegile`, `endale` (best sellers until recipients are filterable) |
| Occasions | `sobrapaev`, `naistepaev`, `emadepaev`, `opetajate-paev`, `isadepaev`, `joulud` |
| Banners | `joulukingid` (christmas), `alla-15` (up to 15 EUR) |

Filters: `recipient`, `price` (`under_10`, `10_20`, `20_40`, `over_40`), `type`, `age`, `sort` (`popular`, `price_asc`, `price_desc`, `newest`), `limit` (default 9, max 48), `cursor`. An unknown slug returns 404.

## Pre-cart (gift bag and cards)

`POST /precart.php` request `{items: [id or {id, quantity}], occasion?}`. Response: `bag {size S|M|L, products up to 6}`, `cards {occasions, products up to 6}`, `ignored_ids`. Bag size depends on the number and size of items; cards always match the occasion.
