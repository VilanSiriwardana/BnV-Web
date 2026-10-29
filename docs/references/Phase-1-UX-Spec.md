# B&V Phase 1 UX Specification

| Field   | Value                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------- |
| Version | 1.0                                                                                                     |
| Status  | PROPOSED (2026-10-29) — owner review pending; items marked **OPEN** need a decision before their sprint |
| Created | 2026-10-29                                                                                              |
| Owner   | B&V project owner                                                                                       |
| Purpose | Define the Phase 1 UX that neither the references nor the prototype define                              |

> **How to use.** This spec fills gaps; it does not repeat other references. Decisions live in [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md), tokens in [Brand-Identity.md](Brand-Identity.md) v1.3, routes and build order in [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md), SEO rules in [SEO-Guide.md](SEO-Guide.md), and every business value (fees, numbers, policy texts) in [Business-Facts.md](Business-Facts.md). Never hard-code a value from Business-Facts that is still TBD.

## 1. Sri Lanka Checkout

Guest checkout on one page with three short sections, then a review step. Built in sprint 1F.

### 1.1 Fields

| Section  | Field                  | Rule                                                                                                  |
| -------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| Contact  | Full name              | Required, 2–150 characters                                                                            |
| Contact  | Phone                  | Required (D-20). Sri Lankan mobile, normalised to `+94XXXXXXXXX`; accept `07X XXX XXXX` input         |
| Contact  | Email                  | Required — `orders.customer_email` is NOT NULL. **OPEN:** make it optional (needs a 1C schema change) |
| Contact  | Preferred contact      | WhatsApp (default) or phone call                                                                      |
| Delivery | Address line 1         | Required                                                                                              |
| Delivery | Address line 2         | Optional                                                                                              |
| Delivery | District               | Required, select from the 25 districts (1.2)                                                          |
| Delivery | City / town            | Required, free text (no city list in Phase 1)                                                         |
| Delivery | Province               | Derived from the district, read-only (`orders.province` is required)                                  |
| Delivery | Postal code            | Optional                                                                                              |
| Delivery | Delivery notes         | Optional, up to 300 characters (landmarks, timing)                                                    |
| Gift     | This is a gift         | Checkbox; reveals the gift fields                                                                     |
| Gift     | Gift wrap              | Checkbox. Fee from [Business-Facts.md](Business-Facts.md) (TBD; hide the fee line until confirmed)    |
| Gift     | Gift message           | Optional, up to 200 characters, printed on the card                                                   |
| Gift     | Hide prices in package | Checkbox                                                                                              |
| Payment  | Payment method         | Radio: Cash on Delivery, Bank transfer (D-20). Each shows one line of what happens next               |
| Consent  | Terms and privacy      | Required checkbox linking `/policies/terms` and `/policies/privacy`                                   |
| Consent  | Marketing              | Optional, unticked checkbox ("Send me new drops and offers"); creates a newsletter subscriber         |

Gift fields and preferred contact are stored in `orders.notes` as structured text until 1C decides on dedicated columns (**OPEN**, sprint 1C).

### 1.2 Districts by Province

| Province      | Districts                                         |
| ------------- | ------------------------------------------------- |
| Western       | Colombo, Gampaha, Kalutara                        |
| Central       | Kandy, Matale, Nuwara Eliya                       |
| Southern      | Galle, Matara, Hambantota                         |
| Northern      | Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu |
| Eastern       | Batticaloa, Ampara, Trincomalee                   |
| North Western | Kurunegala, Puttalam                              |
| North Central | Anuradhapura, Polonnaruwa                         |
| Uva           | Badulla, Monaragala                               |
| Sabaragamuwa  | Ratnapura, Kegalle                                |

Keep this list in `src/data/` as typed data. Delivery zones in [Business-Facts.md](Business-Facts.md) map districts to fees.

### 1.3 Order Summary and Fees

- The summary shows items, subtotal, delivery fee for the selected district, gift wrap (if any) and total, all in LKR with no decimals shown (`LKR 12,900`).
- Until the fee table is CONFIRMED, show "Delivery fee confirmed on WhatsApp" instead of a number, and store `shipping_amount = 0`.
- Free-delivery progress ("LKR X away from free delivery") appears in the cart only once the threshold is CONFIRMED.
- No promo-code field (coupons are Phase 2, ADR-0015).

### 1.4 Success Page (`/checkout/success`, noindex)

1. Order number, large and copyable.
2. "What happens next" for the chosen method:
   - Cash on Delivery: "We will call or WhatsApp you to confirm before dispatch."
   - Bank transfer: "We will send our bank details on WhatsApp. Your order is prepared once the transfer is confirmed."
3. Primary CTA: **Confirm on WhatsApp** — a `wa.me` deep link with a prefilled message containing the order number. Hidden if the WhatsApp number is still TBD.
4. Secondary: Continue shopping.

No order tracking link (D-22).

## 2. Shop Mega Menu

Built from D-08 and D-21. Desktop: opens on hover or focus of "Shop", full width under the header, closes on Escape and on pointer leave after 150ms. Mobile: an accordion inside the drawer.

| Column      | Links                                                                               |
| ----------- | ----------------------------------------------------------------------------------- |
| New In      | New In (`/shop?sort=newest`), Limited Drop (`/collections/limited-drop`)            |
| Women       | All Women (`/women`), then each child category (`/women/dresses`, …)                |
| Men         | All Men (`/men`), then each child category                                          |
| Jewelry     | All Jewelry (`/jewelry`), then each child category                                  |
| Gifts       | All Gifts (`/gifts`), then each child category (including Candles & Home)           |
| Collections | Couples (`/couples`), then active collections by sort order (`/collections/[slug]`) |
| Feature     | One image card (Custom Orders or a current collection) with a single CTA            |

- The child links come from active categories in the database, so the menu never lists an empty category.
- Navigation config lives only in `src/config/navigation.ts` (D-08).
- Keyboard: Tab moves through columns; the trigger has `aria-expanded` and `aria-controls`.

## 3. Visual Portfolio and Collaborate

Rules: [Brand-Identity.md](Brand-Identity.md) §42 and [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md) §13. Routes: D-07.

### 3.1 `/portfolio`

1. Page hero: H1 "Visual Portfolio", one line of positioning, CTA "Work With Us" (to `/collaborate`).
2. Filter bar (query parameters, not indexable): Featured (All, Couple, Buwi, Vila), Category, Media (All, Photos, Videos).
3. Shoot grid: 1 column (mobile), 2 (tablet), 3 (desktop). `ShootCard` per [Phase-Development.md](Phase-Development.md) Shoot Card Model.
4. Closing CTA band: the four collaboration CTAs.

Empty filter result: "No shoots match these filters yet" plus a "Clear filters" button.

### 3.2 `/portfolio/[slug]`

Hero image with title, featured type, category tags and media count; short description; media tabs (All, Photos, Videos); masonry gallery with a lightbox (keyboard and swipe); video cards with play icon, duration and type label; related shoots (up to 3, same featured type or category); collaboration CTA.

### 3.3 Shoot Data Shape (`src/data/portfolio/`, D-05)

```ts
type FeaturedType = 'couple' | 'buwi' | 'vila';
type ShootCategory =
  | 'fashion'
  | 'jewelry'
  | 'promotional'
  | 'bridal'
  | 'restaurant'
  | 'birthday'
  | 'cinematic'
  | 'lifestyle'
  | 'product'
  | 'event'
  | 'custom_concept';
type VideoLabel =
  | 'campaign_reel'
  | 'behind_the_scenes'
  | 'product_promo'
  | 'cinematic_clip'
  | 'outfit_reel'
  | 'couple_reel';

type ShootMedia =
  | {
      kind: 'photo';
      cloudinaryId: string;
      alt: string;
      width: number;
      height: number;
    }
  | {
      kind: 'video';
      cloudinaryId: string;
      posterId: string;
      alt: string;
      durationSec: number;
      label: VideoLabel;
    };

type Shoot = {
  slug: string;
  title: string;
  featured: FeaturedType;
  categories: ShootCategory[];
  summary: string; // one sentence
  context?: string; // longer text; the page is indexable only when this exists (D-07)
  cover: ShootMedia & { kind: 'photo' };
  media: ShootMedia[];
  shotOn?: string; // ISO date
};
```

Only real B&V shoots are added (D-10, §42). The array may be empty at launch; the page then shows a "Coming soon" state with the collaboration CTAs.

### 3.4 `/collaborate`

A segmented control switches between three forms, all saving to `collaboration_inquiries` (columns: [Database-Design-Reference.md](Database-Design-Reference.md), "Proposed Phase 1 table").

| Field                                                | Collaboration | Consultation | Event invitation      |
| ---------------------------------------------------- | ------------- | ------------ | --------------------- |
| Name, email, phone                                   | Required      | Required     | Required              |
| Brand / organiser name                               | Optional      | Optional     | Required              |
| Project type                                         | Required      | Optional     | —                     |
| Required people (Couple, Buwi, Vila, Not sure)       | Required      | —            | Required              |
| Preferred date                                       | Optional      | Required     | Required (event date) |
| Preferred time                                       | —             | Required     | Optional              |
| Meeting mode (online, in person)                     | —             | Required     | —                     |
| Location                                             | Optional      | If in person | Required              |
| Budget range                                         | Optional      | —            | —                     |
| Expected audience                                    | —             | —            | Optional              |
| Requested role                                       | —             | —            | Required              |
| Message                                              | Required      | Required     | Required              |
| Reference links (up to 5)                            | Optional      | Optional     | Optional              |
| Reference files (up to 5, images or PDF, 10 MB each) | Optional      | —            | Optional              |
| Privacy consent                                      | Required      | Required     | Required              |

Success: a thank-you panel with the reply expectation and, for consultations, a "Confirm on WhatsApp" link (D-06). Partner testimonials follow D-23.

## 4. Admin Screens (sprint 1H)

Routes: [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md) §14.1. All lists are server-paginated (25 rows), sortable by date, with a search box and status filter chips. Every status change is a single action with a confirmation for `cancelled`, `rejected`, `declined` and `archived`.

| Screen                  | List columns                                                                                | Filters                      | Row actions                                       |
| ----------------------- | ------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| Login (`/admin/login`)  | Email, password; generic error message; no "sign up"                                        | —                            | —                                                 |
| Products                | Image, name, category, price range, stock, status, updated                                  | Status, category, collection | Edit, archive, view on site                       |
| Orders                  | Order number, date, customer, district, total, payment method, order status, payment status | Status, payment method, date | View, change status, mark paid, WhatsApp customer |
| Order detail            | Items with snapshots, address, gift fields, notes, payment rows, status history             | —                            | Status change, mark payment paid                  |
| Custom requests         | Date, name, request type, occasion, budget, needed date, status                             | Status, request type         | View, change status, WhatsApp                     |
| Collaboration inquiries | Date, type, name, brand, preferred date, status                                             | Type, status                 | View, change status, WhatsApp                     |
| Contact messages        | Date, name, subject, status                                                                 | Status                       | View (marks `read`), reply by email, archive      |
| Newsletter              | Email, status, source, subscribed date                                                      | Status                       | Export CSV, unsubscribe                           |

Dashboard cards: [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md) §14.3. Admin uses the same tokens with denser spacing (16px gutters, `small` text in tables).

## 5. Status Labels and Badges

Values: D-04. Badge style: `radius-sm`, `caption` text, tinted background with the token's foreground. Tone → tokens: **neutral** = `muted` / `muted-foreground`; **brand** = `primary` / `primary-foreground`; **warm** = `secondary` / `secondary-foreground`; **premium** = `gold` / `gold-foreground`; **success** = `success` / `success-foreground`; **danger** = `destructive` / `destructive-foreground`.

| Entity                | Value → label (tone)                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product               | draft → Draft (neutral); active → Active (success); archived → Archived (neutral)                                                                                                             |
| Order                 | inquiry_received → New inquiry (brand); pending_confirmation → Awaiting confirmation (warm); confirmed → Confirmed (success); preparing → Preparing (premium); cancelled → Cancelled (danger) |
| Order payment         | not_required → Not required (neutral); pending → Payment pending (warm); paid → Paid (success)                                                                                                |
| Payment method        | cod → Cash on Delivery (neutral); bank_transfer → Bank transfer (neutral)                                                                                                                     |
| Custom request        | new → New (brand); reviewing → Reviewing (warm); quoted → Quoted (premium); accepted → Accepted (success); rejected → Rejected (danger); completed → Completed (neutral)                      |
| Collaboration inquiry | new → New (brand); reviewing → Reviewing (warm); replied → Replied (neutral); accepted → Accepted (success); declined → Declined (danger); archived → Archived (neutral)                      |
| Contact message       | new → New (brand); read → Read (neutral); replied → Replied (success); archived → Archived (neutral)                                                                                          |
| Newsletter subscriber | active → Subscribed (success); unsubscribed → Unsubscribed (neutral)                                                                                                                          |

Public product badges ([Brand-Identity.md](Brand-Identity.md) §24.4) are separate from status badges: Limited Drop and Premium Box (premium), Couple Favorite and Custom Made (warm), Gift Ready and New Arrival (brand). "New Arrival" appears only on products created in the last 30 days. No "Bestseller" badge until sales data exists (D-10).

## 6. Empty, Error, Loading and Stock States

| State                       | Where                | Behaviour                                                                                                                                                                                                                                                          |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Loading                     | Route segments       | `loading.tsx` skeletons that match the final layout (cards, gallery, table rows); no spinners on full pages                                                                                                                                                        |
| Empty category / collection | Listing pages        | "New pieces are on their way" + links to other pillars; page stays indexable only if it has content                                                                                                                                                                |
| Empty search / filters      | Shop, portfolio      | Message + "Clear filters"                                                                                                                                                                                                                                          |
| Empty cart                  | Drawer and `/cart`   | Short line + CTAs to New In and Gifts                                                                                                                                                                                                                              |
| Form error                  | All forms            | Shared Zod schema validated on blur and on submit (client) and in the Server Action (server). Each field has a reserved one-line message slot, so there is no layout shift. A summary at the top links to the fields. Focus moves to the first error. See ADR-0019 |
| Server error                | `error.tsx`          | Warm message, "Try again" (reset) and WhatsApp link; never shows raw errors                                                                                                                                                                                        |
| Not found                   | `not-found.tsx`      | H1 "This page has wandered off", links to Shop, Gifts and Custom; returns HTTP 404                                                                                                                                                                                 |
| Out of stock variant        | PDP variant selector | Variant shown but disabled with "Sold out"                                                                                                                                                                                                                         |
| Out of stock product        | PDP and cards        | "Sold out" badge (neutral); add-to-cart disabled; secondary CTA **Ask on WhatsApp** with the product name prefilled                                                                                                                                                |
| Low stock                   | PDP                  | "Only a few left" when quantity ≤ `low_stock_threshold`; never a fake countdown                                                                                                                                                                                    |

Availability comes from `inventory.quantity - inventory.reserved_quantity`.

## 7. Consent and Privacy (PDPA)

- **Cookie banner.** Shown on first visit, bottom of the screen, non-blocking. Buttons "Accept analytics" and "Only essential" have equal weight. GA4 and any marketing pixel load only after "Accept analytics". The choice is stored for 12 months and can be changed from a footer link "Cookie settings".
- **Newsletter.** Explicit, unticked consent checkbox with a link to the privacy policy. Store consent time and source. A double opt-in email is added when the email provider is chosen (**OPEN**, sprint 1G); until then, a single opt-in with a clear unsubscribe link in every email.
- **Forms.** Every form that collects personal data has a required privacy checkbox (checkout, custom request, collaborate, contact).
- **Privacy page outline (`/policies/privacy`)**, text from the owner ([Business-Facts.md](Business-Facts.md)): who we are and contact; what we collect (orders, forms, newsletter, analytics); why and the legal basis; who we share with (courier, Cloudinary, hosting, analytics); how long we keep it; your rights under the Personal Data Protection Act No. 9 of 2022 (access, correction, erasure, withdrawal of consent); cookies; how to contact us; last updated date.

## 8. Images (`next/image`)

| Use                        | Aspect ratio | Source size | `sizes`                                                                                                        |
| -------------------------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------- |
| Product card and gallery   | 4:5          | 960×1200    | `(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw` (cards); `(min-width: 1024px) 50vw, 100vw` (gallery) |
| Hero banner (desktop)      | 1920×650     | 1920×650    | `100vw`                                                                                                        |
| Hero banner (mobile)       | 1:1          | 1080×1080   | `100vw`, swapped with `<picture>`-style art direction below `md`                                               |
| Category / collection card | 4:5          | 960×1200    | as product card                                                                                                |
| Portfolio cover            | 3:4          | 1200×1600   | `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw`                                                     |
| Portfolio video poster     | 16:9         | 1600×900    | `(min-width: 1024px) 50vw, 100vw`                                                                              |
| OG image                   | 1.91:1       | 1200×630    | —                                                                                                              |

- Use `fill` inside an aspect-ratio box so layout never shifts. Only the first hero image and the PDP primary image get `priority`.
- Every image needs alt text describing the product or scene, not "image of". Decorative images use `alt=""`.
- Placeholders live in `public/images/prototype/`; real images come from Cloudinary.
- Output formats are AVIF then WebP. Allowed qualities are 75 (default) and 85 (hero, PDP primary). Presets live in `src/config/images.ts`. Local images get a generated blur placeholder (`src/data/image-placeholders.ts`). Art-directed banners use `<picture>` via `getImageProps`, so only one size downloads.

## 9. Catalog Rules

### 9.1 Variant Options per Category

Phase 1 variants carry their options in `product_variants.name` (for example `M / Lavender`), because the schema has no option columns. Structured options are **OPEN** for sprint 1C.

| Category        | Options                                     |
| --------------- | ------------------------------------------- |
| Women, Men      | Size (XS–XXL), Color                        |
| Jewelry — rings | Ring size, Metal finish                     |
| Jewelry — other | Length (necklaces, bracelets), Metal finish |
| Gifts           | Variant only if the box contents differ     |
| Couples         | Set size pair (for example `M + L`), Color  |

### 9.2 Size Guide

A size guide link opens a sheet on the PDP for fashion and ring products. One guide per category (women, men, rings), stored as typed data in `src/data/size-guides/`, with centimetre measurements and a "Not sure? Ask on WhatsApp" line. The measurements come from the owner (TBD).

### 9.3 Related Products

On the PDP, show up to 4 related products: first other products in the same collection(s), then the same category, excluding the current product, archived and sold-out items, newest first. Couples products may show a "Complete the look" row from the same collection instead.

## 10. Metadata and OG Templates

Rules: [SEO-Guide.md](SEO-Guide.md). The brand name comes from `src/config/brand.ts` (written below as B&V).

| Page                                           | Title template                                        | Description source                     | OG image                  | Index                                                |
| ---------------------------------------------- | ----------------------------------------------------- | -------------------------------------- | ------------------------- | ---------------------------------------------------- |
| Home                                           | B&V — Style for you. Gifts for them. Moments for two. | Brand positioning line                 | Default OG                | Yes                                                  |
| Pillar                                         | {Category} — Fashion, Jewelry & Gifts \| B&V          | Category description                   | Category image or default | Yes                                                  |
| Subcategory                                    | {Child} for {Pillar} \| B&V                           | Category description                   | Category image or default | Yes, if it has products                              |
| Collection                                     | {Collection} \| B&V                                   | Collection description                 | Collection banner         | Yes                                                  |
| Product                                        | {Product name} \| B&V                                 | Short description (max 160 characters) | Primary product image     | Yes (canonical `/products/[slug]`)                   |
| Shop                                           | Shop All \| B&V                                       | Fixed copy                             | Default OG                | Yes (sort/filter parameters canonicalise to `/shop`) |
| Custom, Love Websites, Our Story, FAQ, Contact | {Page} \| B&V                                         | Fixed copy per page                    | Default OG                | Yes                                                  |
| Portfolio                                      | Visual Portfolio \| B&V                               | Fixed copy                             | Default OG                | Yes                                                  |
| Shoot                                          | {Shoot title} — Visual Portfolio \| B&V               | Shoot summary                          | Shoot cover               | Only with `context` text (D-07)                      |
| Collaborate                                    | Work With Us \| B&V                                   | Fixed copy                             | Default OG                | Yes                                                  |
| Policies                                       | {Policy} \| B&V                                       | Fixed copy                             | Default OG                | Yes                                                  |
| Cart, Checkout, Success, Admin, Style guide    | {Page} \| B&V                                         | —                                      | —                         | No (noindex)                                         |

The default OG image is a launch-blocking commission ([Business-Facts.md](Business-Facts.md)); until then, use a generated text-on-ivory OG image from `opengraph-image.tsx`.

## Open Items

| Item                                         | Section | Decide in |
| -------------------------------------------- | ------- | --------- |
| Optional email at checkout (schema change)   | 1.1     | 1C        |
| Dedicated gift and preferred-contact columns | 1.1     | 1C        |
| Structured variant options                   | 9.1     | 1C        |
| Newsletter double opt-in provider            | 7       | 1G        |
