---
id: chat-turn
title: How a Chat Turn Works
sidebar_label: Chat Turn
---

# How a Chat Turn Works

`POST /endpoint.php` with `{message, conversation_id?}`.

1. **Checks:** method, API key, message 1 to 2000 characters, `conversation_id` sanitised (max 64; new random ID if empty).
2. **Rate limits:** per key 600/min and 20,000/h; per visitor (`X-End-User-Id`) 10/min and 100/h.
3. **Cost caps:**
   - more than `RC2_MAX_TURNS` (30) messages in a conversation gives **429**;
   - monthly AI budget used up gives **503** "The assistant is unavailable right now."
4. **Understand** (`KingiSoovitajaExtract`, Gemini `gemini-3.1-flash-lite`, 10 s, 2 attempts):
   - the last 20 messages are sent as context;
   - output: recipient, gender, age, audience, occasion, mood, topic, author, brand, language, budget (`max_price` / `price_level`), delivery speed, **exclusions**, search keywords, thread title;
   - if Gemini fails, a rule-based fallback extracts what it can.
5. **Rules become hard filters** (Meilisearch filters):
   - catalogue rules ([Catalogue Rules](./catalogue-rules)); add-ons (bags, cards) are never gifts;
   - Christmas campaign rules; budget `price <= N OR sale_price <= N`;
   - fast delivery = in own stock or at most 1 day;
   - child safety age; age fit (plus or minus 1 year).
6. **Find** (`CandidateSearch`, up to 60):
   - hybrid search (semantic ratio 0.5) with an OpenAI query vector;
   - named brands, licences and authors are also searched by name, including brand families (Kuromi to Sanrio);
   - "Not X" exclusions remove products;
   - **curated shop occasions:** when the occasion matches, up to **10** curated products are **added after** the best matches, **not boosted**;
   - nothing fits the budget: the 20 cheapest, with a note.
7. **Choose** (`GiftChooser`, Gemini `gemini-3.8-flash`, fallback `gemini-3.1-flash-lite`, up to 10 s):
   - picks **8 to 12** products (config `search.choice_count`; 3 to 6 is planned once the business agrees);
   - gives each a one-line reason (`why_it_fits`) and writes a 40 to 70 word Estonian reply;
   - the code checks: only candidate IDs, max 2 variants of the same product, products named in the reply are shown.
8. **Follow-up** (`FollowUp`): recipient first, then a child's age, then budget. Each is asked at most once, max 2 per conversation, with chips (`Emale, Isale, Sõbrale, Lapsele, Kolleegile` / age ranges / `Kuni 15 €, Kuni 30 €, Kuni 50 €, Eelarve pole oluline`).
9. **Fallback:** if choosing fails or there are no candidates, products are shown in search order with a fixed, honest reply. The pre-search draft is never shown (RR-267).
10. **Store and log:** history in `gift_assistant_history`, anonymised turn in `gift_assistant_turns` (no message text), AI cost in `ai_usage_daily`.

**Time budget:** 25 s (Caddy cuts at 30 s, the website waits 35 s). Typical turn: 4 to 6 s. No streaming from the backend.

**Model choice** (README, blind judgement on 123 messages, 17 Oct): `gemini-3.8-flash` had 78% good top picks and 1% wrong products, against 63% and 6% for `gemini-3.1-flash-lite`.

## Alternative path (AI choice off)

With `search.ai_choice` off, the chat ranks search results by rules and writes the reply before the search, or after it with RAG (`ENABLE_RAG=1`, a second Gemini call, about 1 to 2 s more per message).

## Data kept

Shopper messages and replies are stored in `gift_assistant_history`, deleted after `RC2_HISTORY_RETENTION_DAYS` (default 90). The full conversation is sent to Gemini on each turn. The README says to confirm that the Gemini API tier in use does not train on prompts; the documentation records the vendor as Gemini paid tier (no training on prompts), agreed with the business.
