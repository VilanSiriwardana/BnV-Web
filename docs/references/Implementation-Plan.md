# B&V Implementation Plan

Version: 1.2 (2026-10-29)

This is the master plan for building B&V, from where the project stands now through Phase 4. It is a stable reference: work through it top to bottom, finishing each gate before starting the next.

Day-to-day progress is tracked elsewhere:

- [../governance/PLAN.md](../governance/PLAN.md) holds the current milestone and its ticked items.
- [../governance/PROGRESS.md](../governance/PROGRESS.md) is the journal.

Change this document only when scope or sequencing changes. When you do, bump the version and add a line to the changelog at the end.

## Project Information

- Project: B&V / BuwiNVila. A modern romantic lifestyle ecommerce web platform.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Prisma 7, PostgreSQL. Local development uses a native PostgreSQL 16 install with pgAdmin 4 (ADR-0010).
- Governance entry point: [../../AGENTS.md](../../AGENTS.md). Authoritative handbook: [AGENTS.md](../governance/AGENTS.md).
- Decisions: [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md) (proposals) and [../decisions/DECISIONS.md](../decisions/DECISIONS.md) (ADRs).
- Architecture index: [../architecture/README.md](../architecture/README.md).

### Reference Map (which doc drives which work)

| Reference                                                                                                                                              | Used for                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| [Phase-Development.md](Phase-Development.md)                                                                                                           | Phase 1–4 scope, page lists, portfolio rules                                |
| [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md)                                                                                                     | Sprint-level build guidance (adapted below to the real repo)                |
| [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md)                                                                                     | D-01 to D-23; wins over older references when they conflict                 |
| [Brand-Identity.md](Brand-Identity.md)                                                                                                                 | Tokens, typography, components, homepage order (§23), portfolio rules (§42) |
| [Research_and_Prototype.md](Research_and_Prototype.md)                                                                                                 | Market research, functional requirements, prototype review                  |
| [Visual-Asset-Inventory.md](Visual-Asset-Inventory.md)                                                                                                 | Image sources, naming, handling rules                                       |
| [Database-Design-Reference.md](Database-Design-Reference.md), [Database-Design.md](Database-Design.md), [Database-Standards.md](Database-Standards.md) | Schema, migrations, Prisma conventions                                      |
| [Authentication.md](Authentication.md)                                                                                                                 | Admin auth (S7)                                                             |
| [Hosting_Deployment.md](Hosting_Deployment.md)                                                                                                         | Deployment (S8, D-01)                                                       |
| [SEO-Guide.md](SEO-Guide.md)                                                                                                                           | Metadata, JSON-LD, sitemap (S4, S8)                                         |
| [Technology-Stack.md](Technology-Stack.md)                                                                                                             | Library choices                                                             |
| [Business-Strategy.md](Business-Strategy.md)                                                                                                           | Positioning, audience, copy tone                                            |

Source material outside the repo:

- `BnV Docs/B&V Ecommerce Prototype/` (a Vite single-file prototype). Use it as a **visual reference only**.
- `BnV Docs/Images/`, the raw image library.

## Status Snapshot (baseline, VERIFIED 2026-10-28)

| Area                | State                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Docs & governance   | Strong: 15 references, ADR-0001 to 0010, 19 decisions drafted                                                                                              |
| Tooling             | Next 16.2, TS, Tailwind v4, ESLint, Prettier, Husky + lint-staged. next-themes, lucide-react, clsx, tailwind-merge, cva, framer-motion, zod, tsx installed |
| Database            | 5 migrations, 22 models (identity, catalog, product, commerce including coupons/wishlists). Product uses direct `categoryId`/`collectionId` FKs            |
| Application code    | **None.** `app/page.tsx` is the create-next-app default. No `src/`                                                                                         |
| Seed / env          | `prisma/seed/` and `.env.example` missing (the seed path is referenced in `prisma.config.ts`)                                                              |
| Tests / CI / deploy | None                                                                                                                                                       |
| Assets in repo      | `public/` has only the default Next.js SVGs                                                                                                                |

Rough completion:

- Phase 0 (foundation and documentation): about 90%.
- **Phase 1 MVP: about 15%.** The schema is about 60% of what Phase 1 needs, and nothing user-facing exists yet.
- Phases 2–4: 0%.

## Execution Order

```
Gate A  Phase 0 close-out        (decisions + repo hygiene)
Gate B  Sprint 0.5 Spec Sync     (docs, prototype, images brought in sync)
Phase 1 Sprints 1A → 1I          (MVP build → launch)
Phase 2 → Phase 3 → Phase 4
```

---

## Gate A — Phase 0 Close-out (≈ 1–2 days)

**Status: DONE (2026-10-28).** Seeding was added to this gate: `prisma/seed/` with reference and demo seeders (ADR-0015).

Milestone M0.3. No application, schema or package changes until this gate is done.

- [x] (ADR-0011 to ADR-0015) Decide D-01 to D-19 in [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md). Record the accepted ones as ADR-0011 onwards. These block the most work:
  - D-01: hosting. Reconcile it with [Hosting_Deployment.md](Hosting_Deployment.md), which leaves Vercel vs VPS open.
  - D-02 to D-05: roles, auth, statuses, portfolio model.
  - D-13: UUIDs.
  - D-14: `src/` layout.
  - D-17: payments.
  - D-18: tests.
- [x] Kept, unused until Phase 2 (ADR-0015). Decide whether the migrated Coupon, CouponRedemption, Wishlist and WishlistItem tables stay in Phase 1. They are migrated in `004_commerce_domain`, but this plan parks coupons and wishlists in Phase 2.
- [x] Deleted 2026-10-28. Decide what happens to the stale `prisma/models/` copies: delete them or regenerate them. The schema is now split by domain in `prisma/schema/` (ADR-0016).
- [x] Create `.env.example` and add a `!.env.example` exception to `.gitignore`.
- [x] Add a `typecheck` script (`tsc --noEmit`). Run `npm install`.
- [x] Replace the default README with B&V setup instructions.
- [x] Committed the pending `package.json`, `package-lock.json` and `prisma.config.ts` changes in e01b1ed.

---

## Gate B — Sprint 0.5 Spec Sync (≈ 3–5 days, docs and assets only)

### Sync findings (2026-10-28 audit)

Overall: Brand-Identity and the Reconciled Decisions mostly agree. The prototype and image library reflect the brief from before the Portfolio pivot. The asset inventory is stale.

| Source                             | Status                          | Key problems                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand-Identity.md                  | Mostly OK, has gaps             | No type, spacing, radius, shadow or motion scale. No contrast-safe lavender or gold text variant. `muted` equals `border` (`#D8C8BD`), so muted text is about 3.7:1. No mapping to shadcn tokens (card, popover, input, ring, and shadcn's hover `accent`). Stale mentions of Sanity, Railway, `tailwind.config.ts` and "Framer Motion". The couple-only sample copy breaks §1                                                                                                                                                                       |
| Research_and_Prototype.md          | Factual errors and conflicts    | Count errors: 56 page IDs (not 64) and 22 unique images (not 97). COD and bank transfer go beyond D-17. "Love Notes" conflicts with D-08. The promo-code field conflicts with coupons being parked. Order tracking is listed for Phase 1 but has no route in D-07                                                                                                                                                                                                                                                                                    |
| Phase-1-Reconciled-Decisions       | One conflict inside the doc     | The D-08 summary row puts Our Story in "utility/footer". The D-08 body says footer and homepage only                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Prototype (`App.tsx`, 6,332 lines) | Visual reference only           | Token names differ from Brand-Identity: secondary is Blush, not Rose, and accent is gold. Inter is never applied. Nav and homepage order are stale: no Portfolio, Couple or Custom sections. Language switcher (breaks D-15). Fake "4.9 · 48 reviews", testimonials, a timeline, "Bestseller", "© 2025", and unconfirmed delivery and returns values (break D-10). No checkout, Portfolio or Collaborate page. None of its 48 shadcn `ui/*` files are imported                                                                                       |
| Images (`BnV Docs/Images/`)        | Placeholders after cleanup      | 316 files (276 unique), about 583 MB of PNGs, all over 1 MB. ChatGPT export filenames and folder-name typos. Root `Phase 2/` and `Phase2/` duplicate the LadyWare/MensWare Phase 2 sets. Banners are 1916×821, not 1920×650 / 1080×1080, and there are no mobile crops. `IntialPhase Images/dcddbfd2….png` has an "Oreate AI" watermark. A Banners/05 image reads "B&V BEAUTY & VALUES". The DarkMode and PageImages mockups show $, star ratings and the old nav. Nothing is usable for Portfolio, Our Story, the logo, the favicon or the OG image |
| Visual-Asset-Inventory.md          | Covers about 20% of the library | Written from the small zips only. Missing: Banners, Accessories, Candle, CoupleOutfit, GiftBox, Website Images, DarkMode, IntialPhase and the Phase 2 sets. Counts (Jewellery 20, LadyWare 39, MensWare 40) and archive names (spaces, not underscores) are wrong                                                                                                                                                                                                                                                                                    |

**Reusable from the prototype:**

- Hex values, renamed to Brand-Identity tokens.
- Section and component markup: `Btn` becomes cva variants (add luxury and WhatsApp). `Chip` becomes a Badge re-mapped to Brand-Identity §24.4. Also `ProductCard`, `AnnouncementBar`, the Navbar with its drawer, `CartDrawer`, Footer, and the homepage sections.
- The FAQ, Custom Order, Love Website and Contact layouts.
- Hero copy and FAQ questions.

**Rewrite:**

- Routing → App Router.
- Mock data → Prisma, with integer LKR prices, UUIDs and variants.
- Cart and forms → server actions with Zod.
- Theme handling → `dark:` variants and tokens instead of `isDark` checks.
- Images → `next/image`.
- Add aria attributes and reduced-motion handling.
- Regenerate shadcn with its CLI rather than copying the files.

**Drop:**

- The translation table.
- Phase 2–4 pages.
- Unused libraries (MUI, slick, dnd, confetti).

### Gate B checklist

- [x] (2026-10-29) **Brand-Identity v1.3:**
  - Shadcn token mapping (decide what shadcn's hover `accent` is).
  - Contrast-safe lavender and gold text variants.
  - Fix `muted` and `muted-foreground`.
  - Type, spacing, radius, shadow and motion scales, and a 1440px container.
  - Button radius: medium, not a pill.
  - Remove the stale tech mentions. Make the sample copy solo-inclusive.
- [x] (ADR-0017, 2026-10-29) **Reconciled Decisions:**
  - Fix the D-08 summary row.
  - Add D-20: checkout payment methods (COD, bank transfer, WhatsApp) and a `payments.method` field.
  - Add D-21: category URL scheme (`/women` vs `/shop/women`), what "New In" means, whether Home & Living exists, and how collections relate to categories.
  - Add D-22: order tracking in Phase 1, yes or no, and its route.
  - Add D-23: hide the testimonials section until real reviews exist.
- [x] (v1.1, 2026-10-29) **Research_and_Prototype.md:** correct the counts. Mark Love Notes, promo codes and the checkout payment recommendations as superseded by the decisions.
- [x] (PROPOSED, 2026-10-29) **New reference `Phase-1-UX-Spec.md`** covering everything neither the docs nor the prototype define:
  - Sri Lanka checkout: district and city fields, delivery fee table, gift options, consent.
  - The Shop mega menu.
  - `/portfolio`, `/portfolio/[slug]` and `/collaborate` layouts, and the shoot and media data shape (D-05).
  - Phase 1 admin screens: login, product CRUD, order inquiries, custom requests, messages, subscribers.
  - Labels and badge colours for D-04 statuses.
  - Empty, error, 404 and loading states, and the out-of-stock state.
  - Cookie and newsletter consent, and a PDPA privacy page.
  - `next/image` aspect-ratio rules.
  - Variant options per category, the size guide, and related-product rules.
  - Per-page metadata and OG templates.
- [ ] **Business content (owner)** — fields set up as TBD in [Business-Facts.md](Business-Facts.md):
  - WhatsApp number, email, domain and social handles.
  - Delivery fees in LKR and the free-delivery threshold.
  - The returns window and policy texts.
  - Verified material claims (925 silver, 18k gold and similar).
- [x] (2026-10-29) **Asset preparation:**
  - Remove the duplicate root `Phase 2/`, `Phase2/` and `Phase2.zip`. Archive the redundant zips.
  - Move `Posters and Image ideas*` out of the B&V folders (D-19).
  - Curate about 2 banners per Phase 1 page (light and dark) and 4–8 product images per category. Exclude the mockups, the watermarked file, the long-name JPG, and any image with wrong in-image text.
  - Rename to `<area>-<subject>-<variant>.webp` and keep an old→new mapping CSV.
  - Crop banners to 1920×650 and 1080×1080. Product images stay 4:5 at about 1200px. Export as WebP/AVIF at quality 75–80.
  - Place them in `public/images/prototype/` (placeholders) and `public/images/brand/`.
- [x] (v2.0, 2026-10-29) **Rewrite Visual-Asset-Inventory.md:** full inventory, a confirmed banner-to-page mapping, crop gaps, exclusions.
- [ ] **Commission (launch-blocking, not dev-blocking):** logo SVG, favicon and app icons, OG image, real Buwi and Vila photos (Our Story, Portfolio, Collaborate), real product photography.

---

## Phase 1 — MVP Launch (≈ 8–10 weeks solo, about 1 week per sprint)

Scope: [Phase-Development.md §4–5](Phase-Development.md). Build guidance: [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md).

Every sprint must pass `npm run lint`, `npm run typecheck` and `next build` before it is ticked.

| Sprint | Name                            | Deliverables                                                                                                                                                                                                                                                                                                                                                                                                  | Exit check                                    | Approval needed                  | References                                                              |
| ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| 1A     | Foundation finish (S0)          | `src/{config,components,features,lib,data,types}`, `src/config/{brand,navigation,routes,seo}.ts` (brand config holds the business values from Gate B), `@/` alias                                                                                                                                                                                                                                             | lint + typecheck clean                        | —                                | D-14, Technology-Stack                                                  |
| 1B     | Design system (S1)              | Brand-Identity v1.3 tokens (light and dark) in `app/globals.css`, Playfair + Inter via `next/font`, theme provider and saved toggle, shadcn via CLI + cva primitives (Button, Badge, Input, Card, Sheet, Accordion), Header, MegaMenu, MobileNav, Footer per D-08, noindex `/style-guide`                                                                                                                     | Visual review in both themes; contrast passes | shadcn CLI                       | Brand-Identity §14–41, D-08, D-11, D-15                                 |
| 1C     | Database completion (S2)        | Schema additions for D-02 to D-05 (role field, custom/collaboration/contact inquiries, newsletter subscribers, settings) and D-21 `collection_products` join table (drops `products.collection_id`; retires `core-range`, `new-arrivals`, `custom`); `src/lib/prisma.ts` singleton; `prisma/seed/index.ts` (categories, collections, sample products using the curated placeholder images, first super_admin) | `prisma migrate dev` + seed run clean         | Schema, migration, seed          | Database-Design-Reference, Database-Standards, D-02 to D-05, D-13, D-21 |
| 1D     | Homepage (S3)                   | Sections in Brand-Identity §23 order (including Couple Collection, Custom Orders and the Portfolio preview); data from the DB; newsletter server action with consent                                                                                                                                                                                                                                          | Renders from the DB in both themes            | —                                | Brand-Identity §23, Phase-Development §4                                |
| 1E     | Catalog + PDP (S4)              | `/shop`, category pillars (D-21 URL scheme), `/collections/[slug]`, `/products/[slug]` with variants and gallery, non-indexable filters, Product JSON-LD, size guide                                                                                                                                                                                                                                          | Browsing works end to end                     | —                                | SEO-Guide, UX-Spec                                                      |
| 1F     | Cart + checkout inquiry (S5)    | Server cart, drawer and page; Sri Lanka checkout with Zod; transactional order with item snapshots and a manual payment row; success page with a WhatsApp deep link; **Vitest added here**                                                                                                                                                                                                                    | An order row is created; unit tests pass      | Vitest install (D-18)            | D-04, D-17, D-20, D-22, UX-Spec                                         |
| 1G     | Custom, Contact, Portfolio (S6) | `/custom`, `/love-websites`, `/contact`, `/our-story`, `/faq`, policy pages, `/portfolio`, `/portfolio/[slug]` (static typed data), `/collaborate` (collaboration, consultation request, event invitation), Cloudinary uploads                                                                                                                                                                                | Forms save to the DB                          | Cloudinary install + credentials | D-05 to D-07, D-09, Brand-Identity §42                                  |
| 1H     | Admin MVP (S7)                  | Auth.js Credentials (JWT) admin login, server-side guards (D-12), dashboard, product/category/collection CRUD with images, order and inquiry inboxes with status changes                                                                                                                                                                                                                                      | Only an admin can reach `/admin`              | Auth.js install; secrets         | Authentication, D-02, D-03, D-12                                        |
| 1I     | SEO, QA, deploy (S8)            | `sitemap.ts`, `robots.ts`, metadata utilities, JSON-LD, OG images, 404/500 pages; Lighthouse, PSI and accessibility QA; GitHub Actions CI (lint, typecheck, build); hosting per D-01; GA4 + Search Console; cookie consent                                                                                                                                                                                    | Live on the domain; Lighthouse ≥ 90           | Hosting accounts, domain         | SEO-Guide, Hosting_Deployment, D-01                                     |

**Launch criteria:**

- Gate B business content is in place.
- Real logo and real Our Story / Portfolio photos.
- No AI-generated people presented as real.
- No D-10 violations.
- Placeholder images replaced or clearly product-only.

---

## Phase 2 — Growth & Personalization

Scope: [Phase-Development.md §6](Phase-Development.md).

- Customer accounts (Auth.js plus Google sign-in, DB session tables): My Account, My Orders, Order Detail, Saved Addresses.
- Wishlist and coupons. The tables already exist.
- Search results.
- Gift Finder and Build Your Gift Box.
- Sanity CMS (D-16): Blog/Journal, Lookbook.
- Customer Memories submissions and real testimonials.
- PayHere/KOKO with webhooks, payment success and failure pages, order tracking.
- Playwright E2E tests.

## Phase 3 — Platform Expansion

Scope: [Phase-Development.md §7](Phase-Development.md).

- Love Website builder, template gallery and public pages.
- AI stylist and gift finder, semantic search.
- Subscription boxes, ambassador program.
- Advanced admin and analytics dashboards.
- International shipping.
- Redis and background jobs.
- API-ready mobile flows.

## Phase 4 — Brand Ecosystem

Scope: [Phase-Development.md §8](Phase-Development.md).

Physical studio and showroom, photoshoot packages, content production house, café concept, luxury line. Mostly business work, with light web additions.

---

## Known Risks

- Agents may act on stale or conflicting references. Mitigation: Reconciled Decisions plus the AGENTS.md rule to ask while a decision is PROPOSED. Gate B closes the known conflicts.
- Next.js 16 and Prisma 7 conventions differ from the 2025-era guides. Mitigation: check local docs before structural changes (D-12, Database-Standards.md).
- The prototype carries D-10 and D-15 violations: fake ratings, a language switcher, unconfirmed policies. Mitigation: treat it as visual reference only; never copy data or copy text without checking it.
- AI-generated imagery, especially realistic people, could leak into production as "real" content. Mitigation: the Visual-Asset-Inventory rules, the D-10 checklist, and the Phase 1 launch criteria.
- Unoptimised source images (about 1.8 MB each) would hurt Core Web Vitals. Mitigation: the Gate B conversion step and `next/image`.
- Approval rules are prose-only (no hooks). Mitigation: optional Claude Code hooks task (backlog).
- Schema drift trap: resolved. The stale `prisma/models/` copies were deleted in Gate A.

## Changelog

- 1.0 (2026-10-28): First version, based on the status audit and on the cross-check of the brand docs, prototype and images.
- 1.1 (2026-10-28): Gate A marked done (ADR-0011 to ADR-0015), seeding added.
- 1.2 (2026-10-29): Gate B spec sync done except the owner business values and commissions; D-20 to D-23 accepted (ADR-0017); 1C and 1F rows corrected.
