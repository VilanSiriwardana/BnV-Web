# B&V Ecommerce Platform: Research, Prototype Audit and Build Considerations

**Final Knowledge and Reference Document**

| | |
|---|---|
| Project | B&V (Buwi & Vila) romantic lifestyle ecommerce web app |
| Document type | Final Knowledge and Reference Document |
| Version | 1.0 |
| Date generated | 28 October 2026 |
| Status | Working Reference |
| Prepared from | Online research (October 2026), B&V project reference library, Figma Make prototype source code, AI-generated image archive |

<!-- COVER-END -->

## Document Control

| Field | Value |
|---|---|
| Document purpose | Consolidate what was researched, audited, decided and planned for the B&V Next.js ecommerce build, and list the points to consider while building it |
| Scope | Modern Next.js ecommerce expectations, features, customer flows and marketing; Sri Lanka market and legal context; audit of the Figma Make prototype and image archive against that research |
| Current status | Working Reference. Most project decisions cited here are still **PROPOSED** in the project's decision register and need owner approval |
| Intended audience | B&V project owner, developers, designers, AI coding agents |
| Source period covered | One research and review session, 28 October 2026 |
| Version | 1.0 |
| Last updated | 28 October 2026 |
| Primary source of truth | Project reference library (`Phase-1-Reconciled-Decisions.md`, `PLAN.md`, `Technology-Stack.md`, `Phase-1-Step-by-Step.md`, `SEO-Guide.md`, `Visual-Asset-Inventory.md`), then the prototype source code, then cited external sources |

**Reference notation.** External sources are cited as `[R#]` and listed in Section 21. Project files are cited by file name.

## Table of Contents

[TOC]

## 1. Executive Summary

**Objective.** The session set out to understand what a modern Next.js ecommerce web app is expected to include (features, customer flows, marketing) and to check whether the existing B&V Figma Make prototype and image set already cover that.

**Most important findings.**

1. A modern store is judged on four things together: speed and mobile usability, a short and transparent checkout, product data that search engines and AI assistants can read, and a measurable marketing loop. Next.js handles the presentation layer; the commerce logic must come from a platform or from B&V's own backend [R1][R9].
2. Unexpected extra costs are the leading cause of checkout abandonment (48% of abandoners), followed by forced account creation (26%) and payment distrust (25%) [R6]. Delivery fees must be visible on the product page and in the cart.
3. In Sri Lanka, cash on delivery (COD) is the dominant and growing payment preference: 52% of online shoppers in 2025, up from 48% [R13]. This supports the project's proposed launch model of inquiry plus manual confirmation plus WhatsApp (decision D-17).
4. The core provisions of Sri Lanka's Personal Data Protection Act No. 9 of 2022 (PDPA) take effect on 1 January 2027 [R17]. Consent, privacy notices and data handling are launch requirements.
5. The Figma Make prototype covers most of the browsing experience but has **no checkout**. "Proceed to Checkout" jumps straight to the thank-you page. The only checkout design is an image mockup localised for the United States (USD, card, PayPal, Shop Pay, Apple Pay, no COD).
6. The prototype contains placeholder content that must not ship: fixed "4.9 · 48 reviews" on every product, a promotion code with nowhere to enter it, and conflicting return policies (7 days in code, 30 days in mockups).

**Agreed direction.** Keep the custom Next.js 16 + Prisma + PostgreSQL build rather than moving to a hosted commerce platform. Prioritise cost transparency, a guest-first Sri Lankan checkout with explicit COD, correct structured data, PDPA-ready consent, and consistent analytics events. Add reviews, customer accounts and online payment once real orders exist. This direction is a **recommendation** from this session; the underlying project decisions remain **PROPOSED** until the owner approves them.

**Current status.** Research and audit are complete. No production code was written in this session.

**Main blocker.** The business content needed for checkout does not exist yet: delivery zones and fees in LKR, a single returns and exchange policy, and the payment options shown to customers.

**Next major action.** Design a Sri Lanka checkout (in the mockup first, then in code) and settle the delivery-fee table and returns policy before Sprint 5 (Cart + Checkout Inquiry).

## 2. Background and Original Requirement

### 2.1 Business context

B&V is a modern romantic lifestyle ecommerce brand. Its promise is "Style for you. Gifts for them. Moments for two." It sells women's and men's fashion, jewelry, gifts, couple collections and custom pieces, and also offers Love Websites (custom digital pages for proposals, anniversaries and weddings) and a Visual Portfolio for creative collaborations. The primary market is Sri Lanka, with international readiness planned later (`SEO-Guide.md`, `Business-Strategy.md`).

"B&V" is the working public brand name derived from Buwi & Vila. The final name and logo may still change, so the codebase must keep brand name, logo paths, tagline and contact channels in central configuration (`Brand-Identity.md`).

### 2.2 Initial situation

- A detailed reference library already existed: business strategy, brand identity and design system, technology stack, database design, SEO guide, phase plan and a Phase 1 step-by-step guide.
- A Figma Make prototype had been built and exported as React code.
- About 210 AI-generated images had been produced for page mockups, banners, products and Love Website concepts.

### 2.3 Original requirements in this session

1. Research modern ecommerce websites built with Next.js: what is expected, which features they need, how products are marketed through them, which customer flows to include, and related topics. Fifteen source links were supplied as starting points.
2. Scan the Figma Make prototype and the image archive and check whether the researched points are covered.
3. Produce this consolidated reference document.

### 2.4 Constraints identified at the start

- Sri Lanka first; prices in LKR.
- Approved stack: Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Cloudinary, with Sanity deferred (D-16).
- Phase 1 must stay small: trustworthy, browsable, order-ready, inquiry-ready, admin-manageable and SEO-ready (`Phase-1-Step-by-Step.md`).
- No implementation code was requested.

## 3. Scope

### 3.1 In scope

- Features, flows and quality expectations of a modern Next.js store.
- Marketing mechanics on the site and around it (social, paid, search, direct).
- Sri Lanka payment behaviour, payment gateway rules and data protection law.
- Next.js 16 rendering model as it applies to product pages.
- Audit of the prototype source and the image archive.
- Points to consider while building the production system.

### 3.2 Out of scope

- Writing production code or database migrations.
- Final legal advice on PDPA obligations.
- KOKO integration details (not researched).
- Platform availability in Sri Lanka for Google Merchant Center, Meta Shops and TikTok Shop (not verified).

### 3.3 Assumptions

- B&V is a business-to-consumer, direct-to-consumer store, not a marketplace or B2B store.
- The custom Next.js + Prisma architecture in the reference library is the intended build path.
- The prototype is a design reference, not code to port directly.
- Conversion statistics from US and UK studies apply to Sri Lanka directionally, not exactly (**INFERRED**).

## 4. Current Verified State

### 4.1 Project reference library

| Item | State | Label |
|---|---|---|
| Stack | Next.js App Router (version 16), TypeScript, Tailwind CSS v4, Prisma, PostgreSQL, Cloudinary; Sanity deferred | VERIFIED in project files |
| Hosting | Vercel + managed PostgreSQL proposed for Phase 1 (D-01); Jenkins/Docker deferred | PROPOSED |
| Payments | Inquiry + manual confirmation + WhatsApp at launch; PayHere/KOKO later (D-17) | PROPOSED |
| Placeholder content | LKR only, real payment methods, no fake ratings or statistics (D-10) | PROPOSED |
| Navigation | Shop / Women / Men / Jewelry / Gifts / Couples / Custom / Portfolio, Our Story in utility/footer (D-08) | PROPOSED |
| Language | English only at launch (D-15) | PROPOSED |
| Tailwind | v4 CSS-first tokens in `globals.css` (D-11) | VERIFIED (ADR-0003) |
| Tests | No `typecheck` or `test` script exists (D-18) | VERIFIED |
| Missing business content | Delivery areas and fees in LKR, policies, WhatsApp number, social URLs (`PLAN.md`) | VERIFIED as missing |

The decision register states that until a decision is approved, an agent meeting that topic must stop and ask rather than pick an option.

### 4.2 Figma Make prototype (code)

**VERIFIED by source inspection.**

- Vite + React 18 single-page app, not Next.js. Pages switch through React state; there are no URLs.
- One `src/app/App.tsx` file of 6,332 lines with 64 page components, plus shadcn/ui components.
- 97 product and page images are Unsplash placeholders, not the B&V image set.
- Phase 1, 2 and 3 pages are all present (Phase 3 includes AI stylist, subscription box, studio, café, VIP, international, mobile app, ambassador).
- Archive dated 8 July 2026. The update specification `bv-prototype-update-1.md` asks for a portfolio page, which is not in the code. The export probably predates the last update round (**INFERRED**).

### 4.3 Image archive

**VERIFIED by viewing all folders.**

| Folder | Count | Content |
|---|---|---|
| IntialPhase Images | 14 | Theme explorations, early page previews, "We're Launching Soon" posters |
| PageImages | 19 | Light and dark page mockups including Shop, Product Detail, Checkout, Visual Portfolio |
| Banners 01–05 | 44 | Hero banners for home, category, gifts, couples, custom, love websites, portfolio, story, collections, contact, FAQ, journal, care guide |
| LadyWare, MensWare | 39 | Model fashion images, light and dark sets |
| JewelleryImages | 20 | Gold jewelry on satin, light and dark |
| Accessories | 20 | Bags, hair accessories, wallets, watches, phone cases, keyrings, scarves, belts |
| CoupleOutfit, GiftBox | 20 | Couple looks, branded gift boxes |
| Website Images 01–03 | 30 | Love Website device mockups |

All images are AI-generated. `Visual-Asset-Inventory.md` already states they are prototype placeholders that real photography must replace before launch.

## 5. Research and Investigation Findings

### 5.1 Architecture of a modern Next.js store

- **Two layers.** In Vercel's current reference storefront, the commerce platform owns catalog, cart, checkout, customer accounts, predictive search and policies, while Next.js owns routing, Server Components, caching and invalidation, metadata, and the machine-readable surface for answer engines [R1]. **VERIFIED (official).**
- **Headless versus full-stack.** Headless means the storefront talks to a separate commerce backend through an API; full-stack bundles both. A template review summarises: choose full-stack for a single storefront, headless if you plan mobile apps or several sales channels [R3]. B&V is effectively full-stack. **Independent article.**
- **Stack fit.** Current full-stack templates such as CozyCommerce use Next.js 16, Tailwind v4, TypeScript, NextAuth, Prisma, Stripe and Cloudinary [R3], which is very close to B&V's stack. **INFERRED:** B&V's architecture matches the mainstream.
- **Reference feature set.** Vercel Shop includes an optimistic cart, opt-in customer accounts, webhook-invalidated caches, Markdown page representations, `/llms.txt`, Schema.org data, sitemap and robots, and an optional shopping assistant. Customer accounts and the agent are disabled by default [R1]. **VERIFIED (official).**

### 5.2 Rendering and caching in Next.js 16

- With Cache Components enabled, the server sends a static shell with cached content first, while dynamic parts wrapped in Suspense stream in afterwards [R8]. Data is dynamic by default; developers opt in to caching with `use cache` [R9].
- Cached shells revalidate on an interval set with `cacheLife` and can be invalidated on demand with `cacheTag` [R9].
- Runtime reads must be wrapped in Suspense and data accesses cached or wrapped, otherwise the build fails with a blocking-prerender error [R10].
- **Why it matters.** Product title, images, description and price can be cached and served instantly; cart count, stock and user-specific content stream in. Admin edits invalidate only the affected product. **INFERRED application.**

### 5.3 Customer expectations and features

From Zinc Digital (August 2026, UK data) [R5]:

- Mobile first: smartphones generate close to 80% of UK retail traffic but convert at about half the desktop rate.
- Rich product media: multiple angles, every variation, short video; try-on tools increasingly expected in fashion.
- Honest reviews: a wall of perfect five-star ratings can read as fake.
- Visible trust signals: SSL, payment badges, easy-to-find returns policy.
- Guest checkout, short forms, and the payment methods customers actually use.
- Clear calls to action; related items and bundles lift average order value.
- Urgency works best combined with personalisation (abandoned item, first-order incentive).
- Accessibility and answer-engine optimisation (structured product data that AI tools can read).

From Coursera (updated September 2026) [R4]: a store needs homepage, category and product pages, cart and checkout, about, contact, on-site search, email signup and legal pages. Launch marketing should combine sponsored posts or ads, Google and Facebook ads, and email newsletters. A cited claim that reviews raise conversion 190–380% comes from a vendor compilation and is **UNCERTAIN** in magnitude.

### 5.4 Checkout abandonment

- Average documented cart abandonment is 70.19% across 49 studies [R6].
- 48% of US shoppers abandoned because they were "just browsing"; this is largely unavoidable [R6].
- Among the remaining reasons: extra fees 48%, required account creation 26%, distrust of the site with card details 25%, complicated checkout 22% [R7].
- Better checkout design can raise conversion by 35.26% on large sites [R6].

### 5.5 Sri Lanka market behaviour

- COD preference: 52% of Sri Lankan online shoppers in 2025, up from 48% the previous year (Digital Outlook Sri Lanka 2025, APIDM and University of Kelaniya) [R13].
- Reasons: risk avoidance, cancellation flexibility, avoiding fees and data sharing, and being able to reject orders on delivery [R13].
- Clothes and accessories are the most purchased category (49.03%). Many shoppers prefer buying through social media direct messages and human contact rather than an automated platform [R14].
- Security concerns include misuse of financial information, weak data protection, fake products, delayed refunds, payment failures and stored card details [R15].
- In 2026, 81% of Sri Lankan internet users use AI when looking for information, and consumers put significant weight on reviews before buying from unfamiliar brands [R16].

### 5.6 Payments: PayHere rules (Phase 2)

From PayHere Checkout API documentation (updated December 2025) [R12], **VERIFIED (official)**:

- The Merchant Secret is specific to each domain or app; each new domain needs approval, which can take up to 24 hours.
- The request hash must be generated on the server, never in the browser, because it would expose the secret.
- Payment status is sent only to the `notify_url` server callback. The `return_url` receives no status; the return page must read status from the database.
- The `notify_url` cannot be tested on localhost; it needs a public URL.
- Notifications are form-encoded (`application/x-www-form-urlencoded`), not JSON.
- Every notification must be verified with the `md5sig` checksum before marking payment as successful; skipping this allows forged success notifications.
- Status codes: 2 success, 0 pending, -1 cancelled, -2 failed, -3 chargeback.

### 5.7 Search, structured data and AI discovery

- Google distinguishes **product snippets** (pages where the product cannot be bought directly) from **merchant listings** (pages where it can). Merchant listings support apparel sizing, shipping details and return policy [R11].
- Google recommends store-level policy markup nested under `Organization`, and notes that combining on-page structured data with a Merchant Center feed maximises eligibility [R11].
- Vercel Shop treats `/llms.txt`, Markdown page versions, structured data and sitemap as standard features [R1].

### 5.8 Paid social: TikTok

From TikTok Ads help documentation [R18]–[R20], **VERIFIED (official)**:

- Traffic objective: TikTok Pixel optional but recommended. Conversions objective: pixel required.
- Website conversions optimise delivery against website events using the Pixel, Events API and Advanced Matching.
- Search Ads guidance: start with the most upper-funnel conversion, aim for 20+ conversions in the first week, and move to a lower-funnel event after about 14 stable days.
- Spark Ads let brands partner with creators to make ads that feel organic [R21].

### 5.9 Data protection (PDPA)

- Gazette No. 2498/16 (22 July 2026) brings Sections 2 and 3, Part I (processing of personal data) and Part III (controllers and processors) into force on 1 January 2027 [R17].
- Part III includes, where applicable, Data Protection Officers, breach notifications and Data Protection Impact Assessments [R17].
- Part II (data-subject rights such as access and erasure) and administrative penalties are not yet in force, according to legal commentary [R22].
- This is not legal advice; a lawyer should confirm DPO and impact-assessment applicability.

### 5.10 Notable source limitations

- Reddit (2 links), Medium (2 links) and the TikTok ad landing page could not be read. Other sources covered the same themes.
- The Spree Commerce list of Next.js brands (Nike, Target, Wayfair, Bang & Olufsen) is vendor marketing; its "what Next.js enables" claims are interpretation, not disclosed engineering facts [R23].

## 6. Options Considered

### 6.1 Commerce architecture

| Option | Description | Advantages | Disadvantages | Status |
|---|---|---|---|---|
| A. Custom full-stack (Next.js + Prisma + PostgreSQL) | B&V owns catalog, cart, orders and payments | Fits LKR, COD, manual and PayHere/KOKO flows; full brand control; supports custom orders, Love Websites, portfolio; matches current templates | B&V owns all operational features (inventory, refunds, email, order lifecycle) | **Recommended** (consistent with reference library) |
| B. Headless Shopify (e.g. Vercel Shop) | Shopify owns commerce, Next.js the storefront | Mature checkout, accounts, search, analytics | Sri Lankan payment support not verified; custom-order and inquiry flows fit poorly; platform fees | **Conditional**: reconsider if order operations exceed team capacity |
| C. Self-hosted headless (Medusa, Saleor, Spree) | Open-source commerce backend + Next.js storefront | Owns data, avoids platform fees, multi-region support | Another service to run; integration work for local payments | **Conditional**: reconsider for multi-market expansion |

### 6.2 Launch payment model

| Option | Advantages | Disadvantages | Status |
|---|---|---|---|
| Inquiry + manual confirmation + WhatsApp, with COD and bank transfer named explicitly | Matches 52% COD preference and social-DM buying habits; no gateway dependency for launch | Manual work; no automatic payment confirmation | **Recommended** (extends D-17) |
| Online card payment at launch (PayHere) | Instant confirmation | Merchant approval, public staging domain and webhook security work before launch; low trust for card payment | Deferred to Phase 2 |
| US-style payments (card, PayPal, Shop Pay, Apple Pay) as in the mockup | None for this market | Wrong market | **Rejected** (also D-10) |

### 6.3 Reviews and social proof

| Option | Status |
|---|---|
| Fixed placeholder star ratings | **Rejected** (D-10, SEO guide) |
| Real "Love Notes" testimonials with permission, no Review schema | **Recommended** for launch |
| Verified-purchase reviews with Review schema | Phase 2, once real orders exist |

## 7. Final Decision and Recommended Approach

**Selected approach (recommendation, pending owner approval).**

1. Keep the custom Next.js 16 + Prisma + PostgreSQL architecture.
2. Launch checkout as a guest-first order inquiry. Payment options: Cash on Delivery, bank transfer, and WhatsApp confirmation. Online payment (PayHere, KOKO) follows in Phase 2.
3. Show delivery fees and estimated delivery times on the product page, cart and checkout.
4. Add gift-order fields at checkout: deliver to a different recipient, gift message, hide prices on the packing slip, preferred delivery date.
5. Publish product pages as Google merchant listings, including shipping and return details, plus an Organization-level return policy.
6. Make the site PDPA-ready by 1 January 2027: privacy notice, newsletter consent, cookie and pixel consent, minimal data collection, known data locations.
7. Track the GA4 ecommerce events defined in the SEO guide first; add TikTok and Meta pixels behind consent before running conversion campaigns.
8. Keep Phase 2–4 prototype features (AI stylist, subscriptions, studio, café, VIP) out of the Phase 1 build.

**Evidence.** Abandonment data [R6][R7], Sri Lanka COD data [R13][R14], PayHere constraints [R12], Google structured data guidance [R11], PDPA commencement [R17].

**Why the alternatives were not selected.** Hosted platforms would not handle COD, manual inquiry, custom orders and Love Websites without significant workarounds. Online payment at launch adds security and approval work for a payment method most local shoppers avoid.

**Conditions for reconsideration.** Significant international growth, multi-currency requirements, or order volume that the team cannot handle manually.

## 8. Target Architecture and Customer Flows

### 8.1 System layers

```text
Customer (mobile-first browser)
    ↓
Next.js 16 storefront (App Router, Server Components, Cache Components)
    ├── Cached static shell: product, category, collection content
    └── Streamed dynamic parts: cart, stock, user state
    ↓
Server Actions / Route Handlers (Zod validation)
    ↓
Prisma → PostgreSQL (catalog, carts, orders, order item snapshots, payments)
    ├── Cloudinary (product and upload media)
    ├── WhatsApp link (confirmation channel)
    └── Phase 2: PayHere / KOKO notify_url callbacks (verified, idempotent)
    ↓
Admin dashboard (products, orders, custom requests, messages, subscribers)
```

### 8.2 Customer flows

| Flow | What it must do | Phase |
|---|---|---|
| Discovery and landing | Ad or social click lands on the matching collection or product page with UTM tags preserved | 1 |
| Browse, filter, search | Category and collection grids, sorting and filters that work, basic search | 1 |
| Product decision | Gallery of the product's own images, variants, price, delivery fee and time, returns summary, gift readiness, related products | 1 |
| Cart | Optimistic updates, variant kept with item, subtotal plus delivery estimate, free-delivery progress | 1 |
| Checkout inquiry | Guest-first; name, phone, district/city, address; delivery option with fee; gift section; payment choice; promo code; consent | 1 |
| Confirmation | Order number, next steps, WhatsApp confirmation link, confirmation email | 1 |
| Custom order | Request form with uploads; quote, approval, production status | 1 |
| Order tracking | Order number plus phone or email | 1 (manual statuses) |
| Returns and exchanges | One visible policy; request via WhatsApp or form | Policy at launch |
| Account | Order history, saved addresses, wishlist | 2 |
| Cart recovery | Reminder after abandonment (requires email or phone captured earlier) | 2 |
| Online payment | PayHere/KOKO with server-side hash, notify verification, idempotency | 2 |
| Reviews | Verified-purchase reviews, then Review schema | 2 |

### 8.3 Order and payment status flow (Phase 1)

```text
Checkout submitted
    ↓ (transaction: order + order item snapshots + payment row + cart converted)
orders.status = inquiry_received        payments.provider = manual
    ↓ admin contacts customer (WhatsApp / phone)
pending_confirmation → confirmed → preparing → shipped → delivered
                    ↘ cancelled
```

Status values follow D-04 (PROPOSED).

### 8.4 Marketing loop

```text
Organic TikTok / Instagram content (pillars in Business-Strategy.md)
    ↓
Spark Ads with creators → Traffic objective (pixel collecting data)
    ↓
Website Conversions objective once enough add-to-cart / checkout events exist
    ↓
Landing on matching collection or product page (UTM preserved)
    ↓
On-site merchandising: collections, gift guides, bundles, promo banner, newsletter
    ↓
Order → WhatsApp confirmation → delivery → review request → reorder
    ↑                                                     │
    └──────── Search (SEO pages, merchant listings) ←─────┘
```

## 9. Detailed Functional Requirements

| ID | Requirement | Expected behaviour | Status |
|---|---|---|---|
| FR-01 | Delivery cost visibility | Product page and cart show delivery fee (or estimate by district) and delivery time in LKR; free-delivery threshold and progress shown in cart | PLANNED; **BLOCKED** on fee table |
| FR-02 | Guest-first checkout | No account required; optional account offer after order | PLANNED |
| FR-03 | Sri Lanka address form | Name, phone (+94), district, city, address lines, notes; no US State/ZIP fields | PLANNED |
| FR-04 | Payment choice | Cash on Delivery, bank transfer, WhatsApp confirmation; stored as `payments.provider = manual` with the chosen method recorded | PLANNED; method field needs approval |
| FR-05 | Gift order | Different recipient address, gift message, hide prices, preferred delivery date | PLANNED; schema impact needs approval |
| FR-06 | Promo code | Field at checkout that validates codes such as BV10, or remove the code from marketing | PLANNED (coupons parked to Phase 2 in `PLAN.md`; needs decision) |
| FR-07 | Variant fidelity | Selected size, material, chain length, engraving text and quantity travel with the cart item and the order item snapshot | PLANNED |
| FR-08 | Availability | Product page shows stock state; add-to-cart blocked for unavailable variants | PLANNED |
| FR-09 | Own product gallery | Gallery shows only the product's own images | PLANNED |
| FR-10 | Working sort and filters | Sort changes order; filters by category, price, material, occasion as catalogue size requires | PLANNED |
| FR-11 | Size guide | Size guide per fashion product (FAQ already promises one) | PLANNED |
| FR-12 | Related products | Related items chosen by category, collection or manual curation | PLANNED |
| FR-13 | WhatsApp links | All WhatsApp buttons open a `wa.me` link with prefilled context (product or order number) | PLANNED |
| FR-14 | Newsletter consent | Explicit opt-in checkbox; duplicate-email handling | PLANNED |
| FR-15 | Cookie and pixel consent | Tracking scripts load only after consent | PLANNED |
| FR-16 | Structured data | Product merchant-listing JSON-LD with price, availability, shipping, returns; Organization return policy; BreadcrumbList | PLANNED |
| FR-17 | AI-readable surfaces | Sitemap, robots, `/llms.txt`, clean product text | PLANNED (`/llms.txt` is a new suggestion) |
| FR-18 | Analytics | GA4 ecommerce events from the SEO guide | PLANNED |
| FR-19 | Order confirmation | Order number, summary, WhatsApp confirmation link, email | PLANNED |
| FR-20 | Order tracking | Lookup by order number plus phone or email, showing admin-set status | PLANNED |

## 10. Technical Design and File Impact

### 10.1 Files and modules confirmed relevant

| File or module | Purpose | Expected impact | Status |
|---|---|---|---|
| `Phase-1-Reconciled-Decisions.md` | Decision register D-01 to D-19 | Approve D-04, D-10, D-17; add decisions for COD display, gift fields, promo code | PROPOSED |
| `PLAN.md` | Sprint plan; S5 = Cart + Checkout Inquiry | Add FR-01 to FR-07 to S5 scope | PLANNED |
| `SEO-Guide.md` | Metadata, schema, GA4 event list | Extend product schema with shipping and returns | PLANNED |
| `Visual-Asset-Inventory.md` | Image rules and placeholder bans | Add new folders reviewed in this session | PLANNED |
| Central brand/business config | Brand name, contact channels, policies | Hold returns window, free-delivery threshold, WhatsApp number in one place | PLANNED |
| Prototype `src/app/App.tsx` | Design reference only | Do not port directly | VERIFIED |

Code-level paths for the production repository were not inspected in this session.

### 10.2 Data model considerations

Tables from the Phase 1 set (`BV_PostgreSQL_Database_Design_Reference_v1_0.md`): users, categories, products, product_variants, product_images, product_categories, collections, collection_products, carts, cart_items, orders, order_items, payments, custom_requests, custom_request_files, contact_messages, newsletter_subscribers.

Points to decide before migrations (all **PLANNED**, not verified in schema):

- Where to store gift fields (recipient name, recipient address, gift message, hide price flag, preferred date).
- Where to record the customer's chosen manual payment method (COD, bank transfer, WhatsApp).
- Delivery zone and fee data (the database reference mentions `shipping_zones` and `shipping_rates` for later phases).
- Consent records for newsletter and marketing (timestamp and source).
- Order item snapshots must include selected options (size, material, engraving text).

### 10.3 Routes

From `Phase-1-Step-by-Step.md` and D-07: `/`, `/shop`, category pages, `/collections/[slug]`, product pages, `/cart`, `/checkout`, custom orders, love websites landing, `/portfolio`, `/portfolio/[slug]`, `/collaborate`, contact, policies. Cart, checkout, account, admin and utility pages must be `noindex` or protected.

### 10.4 UI impact

- Checkout mockup must be redrawn for Sri Lanka before it becomes the visual target.
- Shop mockup category tabs (Ladies Fashion, Gents Fashion, Home & Living, Accessories) must be aligned with D-08 navigation.
- Light and dark versions are needed for every page; the product detail page has no dark mockup.

## 11. Security, Privacy and Permissions

- **Admin access.** Auth.js Credentials + JWT for admin only (D-03, PROPOSED); server-side guards in layouts and actions (D-12).
- **Input validation.** Zod on every server action and form.
- **Duplicate submissions.** Order creation must be transactional; avoid double orders from repeated clicks.
- **Payment webhooks (Phase 2).** Generate the PayHere hash on the server; verify `md5sig` on every notification; process idempotently by provider and provider reference; never trust `return_url`.
- **Secrets.** Merchant secrets and database credentials only in server environment variables; one Merchant Secret per domain.
- **Personal data.** Collect only what delivery and contact need; know where data sits (PostgreSQL, Cloudinary uploads from custom requests, email provider, analytics).
- **Consent.** Newsletter opt-in and cookie/pixel consent before tracking (PDPA from 1 January 2027).
- **Truthful content.** No fake reviews, statistics or unsupported claims (warranty, worldwide shipping).

## 12. Configuration and Environment

```env
DATABASE_URL=<managed-postgres-connection-string>
AUTH_SECRET=<secure-random-value>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
NEXT_PUBLIC_SITE_URL=<https://production-domain>
NEXT_PUBLIC_GA_MEASUREMENT_ID=<ga4-id>
NEXT_PUBLIC_WHATSAPP_NUMBER=<+94-number>
# Phase 2
PAYHERE_MERCHANT_ID=<merchant-id>
PAYHERE_MERCHANT_SECRET=<domain-specific-secret>
PAYHERE_MODE=<sandbox|live>
```

Variable names are illustrative; the real names must match the repository's `.env.example`.

Local versus production: PayHere notifications require a public staging domain with its own Merchant Secret. Cloudinary should use separate production folders (`Phase-1-Step-by-Step.md`).

## 13. Implementation Status

| Area | Status | Evidence | Remaining work |
|---|---|---|---|
| Research on features, flows, marketing | Complete | This document | None |
| Prototype audit | Complete | Section 4.2, Appendix C | Confirm whether a newer export with portfolio exists |
| Image audit | Complete | Section 4.3, Appendix D | Plan real photography |
| Decision register | Partial | All key decisions PROPOSED | Owner approval |
| Business content (fees, policies, contacts) | Not started | `PLAN.md` lists as missing | Owner to supply |
| Sri Lanka checkout design | Not started | Only US mockup exists | Redesign |
| Production code | Not started in this session | — | Sprints per `PLAN.md` |
| Tests | Not started | No test scripts (D-18) | Add tooling |

## 14. Testing and Verification

### 14.1 Tests already performed

| Test | Expected | Actual | Status |
|---|---|---|---|
| Prototype: cart to checkout | Checkout form | Jumps to thank-you page | Gap confirmed |
| Prototype: sort dropdown | Products reorder | State stored, not applied | Gap confirmed |
| Prototype: add to cart from product page | Size and quantity kept | Only product passed | Gap confirmed |
| Prototype: promo code | Code entry field | None exists | Gap confirmed |

These were source-code inspections, not runtime tests.

### 14.2 Tests still required

- Unit: price and delivery-fee calculation, promo validation, status transitions.
- Integration: order transaction (order + snapshots + payment row + cart conversion).
- UI: mobile checkout at 360 px, dark mode readability, keyboard navigation.
- SEO: unique titles and descriptions, canonical tags, valid merchant-listing schema, `noindex` on cart and checkout.
- Privacy: consent blocks pixels until granted.
- Phase 2 security: forged PayHere notification is rejected; duplicate notification processed once.

### 14.3 Acceptance criteria for launch

- A guest can complete a checkout inquiry on a phone, seeing the full LKR total including delivery before submitting.
- The order appears in admin with correct item snapshots, options and gift details.
- The customer receives an order number and a working WhatsApp confirmation link.
- No placeholder content from D-10 is visible anywhere.
- Privacy notice, consent and policy pages are live and consistent with each other.

## 15. Errors, Failed Attempts and Lessons Learned

| Issue | Cause | Status | Lesson |
|---|---|---|---|
| Reddit, Medium and TikTok landing pages unreadable | Site blocking or URL length | Unresolved; covered by other sources | Prefer official documentation and fetchable sources |
| Prototype checkout missing | Figma Make output skipped it | Open | Prototypes look complete but miss transactional steps; audit flows, not screens |
| Checkout mockup localised for the US | AI image generation defaults | Open | Always state country, currency and payment methods in design prompts |
| Conflicting policies (7 vs 30 days, warranty, worldwide shipping) | Separate generation rounds | Open | Keep policies in central config and generate copy from it |
| Garbled text in a launch poster | AI image text rendering | Open | Never publish AI images with embedded text without checking it |
| Product gallery filled with other products | Prototype shortcut | Open | Each product must own its images |

## 16. Risks and Limitations

| Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| Checkout abandonment from hidden delivery cost | High | High | FR-01 | Open |
| Shopper distrust of AI product images | Medium | High | Real photography before launch | Open |
| PDPA non-compliance after 1 January 2027 | Medium | High | Section 11 consent and privacy work; legal review | Open |
| Fake reviews damaging trust and SEO | High if shipped | High | D-10 enforcement | Open |
| Scope creep from Phase 2–4 prototype pages | Medium | Medium | Port only Phase 1 pages | Open |
| COD refusals at the door | Medium | Medium | Phone confirmation before dispatch (**INFERRED**) | Open |
| Forged payment notifications (Phase 2) | Low if verified | High | `md5sig` verification, idempotency | Planned |
| Taxonomy drift between mockups and navigation | Medium | Low | Align to D-08 | Open |

## 17. Open Questions and Blockers

### 17.1 Blocking questions

1. What are the delivery zones, fees and times in LKR?
2. What is the single returns and exchange policy (7 days per code and FAQ, or another window)?
3. Which payment methods appear at checkout at launch (COD, bank transfer, WhatsApp)?
4. Are decisions D-04, D-08, D-10, D-15 and D-17 approved?

### 17.2 Non-blocking questions

1. Is there a newer Figma Make export containing the Visual Portfolio?
2. Is BV10 a launch promotion (needs a code field) or removed until Phase 2?
3. Do Google Merchant Center, Meta Shops and TikTok Shop support Sri Lankan merchants?
4. What does KOKO's integration and webhook model require?
5. Does B&V need a Data Protection Officer under PDPA?
6. Will "Home & Living" be a category, or folded into Gifts?

### 17.3 Required decisions

- Gift-order fields in the schema.
- Recording of the manual payment method.
- Final brand name for launch materials (B&V versus Buwi & Vila).

## 18. Recommended Next Steps

**Immediate.**

1. Supply the delivery-fee table, returns policy, WhatsApp number and social links.
2. Approve or change D-04, D-08, D-10, D-15 and D-17, and record the new decisions in Section 17.3.
3. Redesign the checkout mockup for Sri Lanka (LKR, district/city, delivery options, gift section, COD/bank/WhatsApp, promo code, consent).
4. Add FR-01 to FR-07 to Sprint 5 scope in `PLAN.md`.
5. Brief a real photo shoot using the AI sets as the style reference.

**During the build.**

6. Implement Phase 1 pages only; keep Phase 2–4 prototype pages in the backlog.
7. Implement product merchant-listing schema, sitemap, robots and GA4 events.
8. Implement consent and privacy pages before launch.

**Phase 2.**

9. PayHere sandbox on a public staging domain; then KOKO.
10. Customer accounts, wishlist, verified reviews, cart recovery, coupons.

## 19. AI Agent Handoff Context

### Objective

Build the B&V Phase 1 storefront in Next.js 16 so a guest can browse, add to cart and submit a Sri Lankan checkout inquiry, with admin management, SEO and privacy readiness.

### Current state

- Reference library exists; decisions D-01 to D-19 are mostly PROPOSED.
- Prototype is a Vite + React design reference only; it has no checkout.
- Images are AI-generated placeholders.
- No production code or tests were written in this session.

### Agreed approach (recommendation)

Custom Next.js + Prisma + PostgreSQL; guest-first checkout inquiry with COD, bank transfer and WhatsApp confirmation; visible delivery fees; gift fields; merchant-listing schema; consent before tracking.

### Hard constraints

- Prices in LKR only. No USD, PayPal, Shop Pay, Apple Pay, fake ratings, fake statistics, warranty or worldwide-shipping claims (D-10).
- No binary files in PostgreSQL; media goes to Cloudinary.
- Order creation is transactional with item snapshots.
- PayHere hash generated server-side; notifications verified with `md5sig`; never trust `return_url`.
- Cart, checkout, account and admin pages are `noindex` or protected.
- English only at launch (D-15), although the prototype has Sinhala and Tamil switches.
- Brand values in central configuration.

### Existing patterns to reuse

Design tokens in Tailwind v4 `globals.css` (D-11); `app/` at root with shared code in `src/` and the `@/` alias (D-14); status vocabularies in one TypeScript constants module validated with Zod (D-04).

### High-risk areas

Checkout and order creation, payment status handling, personal data and consent, stock and variant snapshots.

### Remaining tasks

FR-01 to FR-20 (Section 9) in sprint order from `PLAN.md`.

### Verification required

Typecheck, lint, build; checkout end-to-end on mobile; schema validation; consent behaviour; admin visibility of orders.

### Do not assume

- That any PROPOSED decision is approved.
- Delivery fees, returns window, payment methods or the WhatsApp number.
- That the prototype's code or copy is production-ready.
- That AI images can be used as product photos.
- That Sri Lankan merchants can use Google Merchant Center, Meta Shops or TikTok Shop.

## 20. Glossary

| Term | Meaning |
|---|---|
| AEO | Answer Engine Optimisation: structuring content so AI assistants can understand and recommend it |
| App Router | Next.js routing system based on the `app/` directory and React Server Components |
| Cache Components | Next.js 16 model where a cached static shell is served first and dynamic parts stream in |
| COD | Cash on Delivery |
| D-xx | Decision identifier in `Phase-1-Reconciled-Decisions.md` |
| Headless commerce | Storefront and commerce backend separated and connected through an API |
| `llms.txt` | Plain-text file that summarises a site for AI systems |
| Merchant listing | Google structured-data class for pages where a product can be bought |
| `notify_url` | PayHere server callback URL that receives payment status |
| PDPA | Personal Data Protection Act No. 9 of 2022 (Sri Lanka) |
| Spark Ads | TikTok ads that promote organic creator posts |
| UTM | URL tags that identify the source, medium and campaign of a visit |

## 21. References

### Official documentation and primary sources

- **[R1]** Vercel Shop template, Vercel. Reference feature set and architecture. https://vercel.com/templates/next.js/vercel-shop
- **[R8]** Cache Components, Next.js documentation. https://nextjs.org/docs/app/getting-started/cache-components
- **[R9]** Getting started with Partial Prerendering, Vercel documentation. https://vercel.com/docs/partial-prerendering/quickstart
- **[R10]** Building, Next.js documentation. https://nextjs.org/docs/app/guides/building
- **[R11]** Introduction to Product structured data, Google Search Central. https://developers.google.com/search/docs/advanced/structured-data/product
- **[R12]** Checkout API, PayHere Knowledge Base (updated December 2025). https://support.payhere.lk/api-&-mobile-sdk/checkout-api
- **[R18]** TikTok Pixel FAQ, TikTok Ads Help. https://ads.tiktok.com/help/article/tiktok-pixel-faq
- **[R19]** What is the Website conversions objective, TikTok Ads Help. https://ads.tiktok.com/help/article/what-is-website-conversions-objective?lang=en
- **[R20]** Search Ads Campaign Objectives, TikTok Ads Help. https://ads.tiktok.com/help/article/search-ads-campaign-objectives?lang=en
- **[R21]** Generate small business leads on TikTok, TikTok for Business. https://ads.tiktok.com/business/ar/blog/generate-small-business-leads-on-tiktok

### Research and reporting

- **[R6]** Cart Abandonment Rate statistics, Baymard Institute. https://baymard.com/lists/cart-abandonment-rate
- **[R7]** Abandonment Issues (summary of Baymard reasons), Magazine Manager. https://www.magazinemanager.com/?p=35429
- **[R13]** Sri Lankan online shoppers stick to cash on delivery, Daily Mirror (May 2025). https://www.dailymirror.lk/print/breaking-news/Sri-Lankan-online-shoppers-stick-to-cash-on-delivery-amid-digital-payment-hesitation/108-307888
- **[R14]** Security Matters: Empowering E-Commerce in Sri Lanka, Humanities and Social Sciences Communications (Springer Nature). https://link.springer.com/article/10.1057/s41599-024-03585-2
- **[R15]** SLIIT Business School study exposes SL's digital trust gap, Sunday Times (July 2026). https://www.sundaytimes.lk/260719/business-times/sliit-business-school-study-exposes-sls-digital-trust-gap-649141.html
- **[R16]** Local businesses urged to adapt as AI transforms online consumer behaviour, Daily Mirror (August 2026). https://www.dailymirror.lk/business/Local-businesses-urged-to-adapt-as-AI-transforms-online-consumer-behaviour/215-347615
- **[R17]** Data protection compliance regime takes effect on 1 Jan 2027, Daily FT (August 2026). https://www.ft.lk/front-page/Data-protection-compliance-regime-takes-effect-on-1-Jan-2027/44-795776
- **[R22]** Legal experts flag unique compliance landscape in staggered PDPA rollout, Daily Mirror. https://www.dailymirror.lk/breaking-news/Legal-experts-flag-unique-compliance-landscape-in-staggered-PDPA-rollout/108-346685

### Articles and technical analysis

- **[R3]** 11+ Best Next.js E-commerce Templates for 2026, nextjstemplates.com (June 2026). https://nextjstemplates.com/blog/best-nextjs-ecommerce-templates
- **[R4]** How to Build an E-commerce Website: Your 2026 Guide, Coursera (September 2026). https://www.coursera.org/articles/ecommerce-website
- **[R5]** What Does Every eCommerce Site Need in 2026?, Zinc Digital (August 2026). https://www.zinc.digital/2026/essential-ecommerce-website-features/
- **[R23]** 15 Amazing eCommerce Websites Built with Next.js, Spree Commerce (vendor article). https://spreecommerce.org/15-amazing-ecommerce-websites-built-with-next-js/

### Project files and internal evidence

`Phase-1-Reconciled-Decisions.md`, `PLAN.md`, `Technology-Stack.md`, `Phase-1-Step-by-Step.md`, `SEO-Guide.md`, `Business-Strategy.md`, `Brand-Identity.md`, `Visual-Asset-Inventory.md`, `BV_PostgreSQL_Database_Design_Reference_v1_0.md`, prototype archive `B_V_Ecommerce_Prototype.zip`, image archive `Images.zip`.

## Appendix A — Decision Log

| ID | Topic | Recommendation | Status |
|---|---|---|---|
| D-01 | Hosting | Vercel + managed PostgreSQL; Jenkins deferred | PROPOSED |
| D-04 | Status vocabularies | Unified string lists, Zod-validated | PROPOSED |
| D-07 | Portfolio routes | `/portfolio`, `/portfolio/[slug]`, `/collaborate` | PROPOSED |
| D-08 | Navigation | Shop / Women / Men / Jewelry / Gifts / Couples / Custom / Portfolio | PROPOSED |
| D-10 | Placeholder content | LKR, real payment methods, no fake ratings or statistics | PROPOSED; reinforced by this audit |
| D-15 | Language | English only at launch | PROPOSED |
| D-16 | Sanity CMS | Deferred to Phase 2 | PROPOSED |
| D-17 | Payments | Inquiry + manual + WhatsApp; PayHere/KOKO next | PROPOSED; this session recommends naming COD and bank transfer explicitly |
| New | Architecture | Keep custom Next.js + Prisma; no hosted platform | Recommended in this session |
| New | Delivery-fee visibility | Product page, cart and checkout | Recommended |
| New | Gift-order fields | Recipient, message, hide price, date | Recommended; needs schema decision |
| New | Reviews | No fake ratings; real Love Notes; verified reviews Phase 2 | Recommended |
| New | PDPA readiness | Consent and privacy before 1 January 2027 | Recommended |

## Appendix B — Points to Consider While Building

**Commerce and checkout**

- Show the full LKR total, including delivery, before the customer submits.
- Ask only for fields delivery and contact require; sources disagree on the ideal count (7–8 versus 12–14), so minimise.
- Offer COD clearly; consider phone or WhatsApp confirmation before dispatching COD orders.
- Keep variants and personalisation text with the cart item and order snapshot.
- Prevent duplicate orders from repeated submissions.

**Product pages**

- Use each product's own images: packshot, detail, on-model or in-hand scale, and video where possible.
- Show availability, size guide, materials, care, delivery and returns.
- Keep headlines as real HTML text over text-free banners.

**Trust**

- Real testimonials only; no fixed ratings.
- One policy source in configuration; pages read from it.
- Visible WhatsApp help on product, cart, checkout and tracking pages.

**Performance and SEO**

- Cache product content with Cache Components; stream cart and stock.
- Convert images to WebP or AVIF through Cloudinary; the source PNGs are about 2 MB each.
- Merchant-listing schema with shipping and returns; BreadcrumbList; sitemap; robots; `/llms.txt`.

**Marketing**

- Every campaign lands on a matching collection or product page with UTM tags.
- Create 9:16 (1080×1920) assets for TikTok and Reels, and 1:1 mobile banners.
- Start TikTok with Traffic, move to Website Conversions once pixel events accumulate.
- Use creators through Spark Ads; repurpose strong content into collection pages and journal posts.

**Privacy**

- Consent before pixels and marketing email.
- Record where personal data is stored and who processes it.
- Keep privacy notice and policies current and dated correctly.

## Appendix C — Prototype Gap List

| # | Gap | Location in prototype |
|---|---|---|
| 1 | No checkout page; cart goes to thank-you | `App.tsx` line 6326 |
| 2 | No delivery fee or estimate in cart | `CartDrawer` |
| 3 | BV10 advertised, no coupon field | Announcement bar; admin campaigns |
| 4 | Size and quantity not passed to cart | `ProductDetailPage`, `addToCart(product)` |
| 5 | Gallery uses other products' images | `ProductDetailPage` images array |
| 6 | Fixed "4.9 · 48 reviews"; founder posing as customer | `ProductDetailPage`; `TESTIMONIALS` |
| 7 | Sort dropdown does not sort | `ShopPage` `sortBy` |
| 8 | No size guide although FAQ promises one | `FAQS` versus `ProductDetailPage` |
| 9 | Related products not related | "Complete the Look" |
| 10 | WhatsApp buttons have no link | Multiple pages |
| 11 | Newsletter has no consent checkbox | Home newsletter |
| 12 | Thin privacy policy dated January 2025 | `PolicyPage` |
| 13 | No Visual Portfolio page | Missing |
| 14 | Sinhala/Tamil switch conflicts with D-15 | Navbar |
| 15 | No `aria-` attributes; icon buttons unlabeled | Throughout |

## Appendix D — Image Archive Review

**Strengths.** Consistent light/dark pairs; text-free banners with space for HTML headlines; consistent styling within product sets; clear Love Website concepts.

**Issues.**

- All images are AI-generated and must be replaced by real photography for products.
- Launch poster with long file name in IntialPhase contains garbled text ("Buvi & Vila", "withare", "Luxy 4k Categoiey"); do not publish.
- Brand name inconsistent across posters (Buwi & Vila versus B&V).
- Many images have embedded text or logos (ladieswear 14–19, accessories, gift boxes, posters); use for social only.
- Shop mockup tabs do not match D-08 navigation.
- Mockups include "© 2025 B&W" typo, USD prices, star counts, 30-day returns, 12-month warranty and worldwide shipping.
- Missing formats: per-product angle sets, 9:16 vertical, 1:1 mobile banners.

## Appendix E — Source Review Status

| Source | Read status | Relevance |
|---|---|---|
| TikTok web traffic ads landing page | Unreadable (URL too long); replaced by official TikTok help | Medium |
| Reddit r/nextjs ecommerce platform thread | Unreadable (blocked) | Medium |
| Medium: build ecommerce with just Next.js | Unreadable (blocked) | Medium |
| Vercel Shop template | Fully read | High |
| Next.js Showcase | Fully read | Low |
| nextjstemplates.com templates list | Fully read | Medium |
| Shopco GitHub repository | README read | Low |
| dev.to ecommerce showcase (2022) | Fully read | Low |
| Spree Commerce: 15 Next.js sites | Fully read | Medium |
| Web Lankan homepage (two links, same page) | Read once | Low |
| Medium (Design Bootcamp): 12 essential things | Unreadable (blocked) | Medium |
| Reddit r/webdevelopment features thread | Unreadable (blocked) | Medium |
| Coursera ecommerce website guide | Fully read | Medium |
| Zinc Digital essential features 2026 | Fully read | High |
