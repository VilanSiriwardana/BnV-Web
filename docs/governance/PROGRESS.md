# PROGRESS.md - B&V Engineering Journal

Entries are chronological. Do not delete historical entries; append corrections or follow-up entries.

Related documentation:

- Governance handbook: [AGENTS.md](AGENTS.md)
- Roadmap: [PLAN.md](PLAN.md)
- Decision index: [DECISIONS.md](../decisions/DECISIONS.md)
- Reference library: [../references/README.md](../references/README.md)
- Architecture index: [../architecture/README.md](../architecture/README.md)
- ADR directory: [../decisions/DECISIONS.md](../decisions/DECISIONS.md)

## 2026-07-26 - Governance Documentation Baseline

### Summary

Established the initial project governance documentation set.

### Files Changed

- `docs/AGENTS.md`
- `docs/PLAN.md`
- `docs/PROGRESS.md`
- `docs/DECISIONS.md`

### Database Changes

- None.
- Existing Prisma state observed: PostgreSQL datasource, Prisma client generator, and initial `HealthCheck` migration.

### API Changes

- None.

### UI Changes

- None.

### Infrastructure

- No infrastructure files were modified.
- Existing configuration observed: Next.js, TypeScript, Tailwind v4/PostCSS, Prisma config, Docker Compose for PostgreSQL and pgAdmin.

### Tests

- Not run; documentation-only task.

### Known Issues

- Current business domain model is not yet represented in Prisma schema.
- Current README appears to be the default create-next-app README.
- Current project branch was not verified during this documentation task.
- `rg` was unavailable due to local access denial, so bounded PowerShell reads were used for discovery.

### Technical Debt

- Replace default README content with B&V-specific setup and project guidance.
- Expand design tokens once brand identity references are finalized.
- Add automated test strategy once a test pattern is approved.

## 2026-10-28 - Local Database Moved to Native PostgreSQL + pgAdmin

### Summary

Migrated the local development database from Docker Compose (`postgres:16-alpine` + `dpage/pgadmin4`) to a natively installed PostgreSQL 16 + pgAdmin 4, per owner request and ADR-0010. Reused the existing `bnv` role/database/password so `DATABASE_URL`'s shape is unchanged. This was requested explicitly by the owner and is an approved exception to the M0.3 milestone's "no Docker changes this milestone" note.

### Files Changed

- `docker-compose.yml` (postgres/pgadmin services removed, left as placeholder)
- `.env.example` (created)
- `docs/decisions/DECISIONS.md` (ADR-0010 added, ADR-0006 marked partially superseded)
- `docs/governance/AGENTS.md`, `docs/governance/PLAN.md`, `docs/references/Technology-Stack.md`
- `README.md` (Local database setup section added)

### Database Changes

- No schema or migration content changes. Existing migrations (`init`, `001_identity_foundation`, `002_catalog_foundation`, `003_product_domain`, `004_commerce_domain`) are reapplied via `prisma migrate deploy` against the native instance.

### Infrastructure

- Local Postgres and pgAdmin now run as natively installed Windows services/applications instead of Docker containers. The Docker volume is retained until the owner deletes it manually.

### Tests

- Not run from this session; native install, role/database creation, and `prisma migrate deploy` are manual/owner steps outside this environment's reach.

### Next Step

- Owner to install PostgreSQL 16 + pgAdmin 4, create the `bnv` role/database, and run `prisma migrate deploy` per the README's Local database setup section.

### Next Step

- Use the governance documents as the source of truth before future application work.

## 2026-07-26 - Documentation Governance Reorganization

### Summary

Reorganized project documentation so root `AGENTS.md` remains a lightweight repository entry point while the authoritative governance set lives under `docs/governance/`.

### Files Changed

- `AGENTS.md`
- `docs/governance/AGENTS.md`
- `docs/governance/PLAN.md`
- `docs/governance/PROGRESS.md`
- `docs/governance/DECISIONS.md`
- `docs/references/Brand-Identity.md`
- `docs/references/Business-Strategy.md`
- `docs/references/Technology-Stack.md`
- `docs/references/Database-Design.md`
- `docs/references/SEO-Guide.md`
- `docs/references/README.md`
- `docs/architecture/README.md`
- `docs/decisions/README.md`

### Database Changes

- None.

### API Changes

- None.

### UI Changes

- None.

### Infrastructure

- Documentation directories prepared:
  - `docs/governance/`
  - `docs/references/`
  - `docs/architecture/`
  - `docs/decisions/`

### Tests

- Documentation link and scope verification required.
- `npm run lint` is optional for this documentation-only task because no application files should change.

### Known Issues

- Phase development reference documents were not present in the current `docs/` inventory at the time of reorganization.
- Git status contained pre-existing non-documentation changes before this task began.

### Technical Debt

- Add phase development and phase 1 step-by-step references to `docs/references/` if supplied later.
- Add architecture overview documents under `docs/architecture/`.
- Split ADRs into individual files under `docs/decisions/` if [DECISIONS.md](../decisions/DECISIONS.md) grows too large.

### Next Step

- Verify relative links in governance documents and confirm `git diff` contains only documentation changes from this task.

## 2026-07-29 - Prisma Client Generation Standard

### Summary

Documented the standard Prisma Client generation workflow so future agents preserve the default `prisma-client-js` generator and avoid custom generated source folders.

### Files Changed

- `docs/references/Database-Standards.md`
- `docs/references/README.md`
- `docs/governance/AGENTS.md`
- `.gitignore`

### Database Changes

- None.

### API Changes

- None.

### UI Changes

- None.

### Tests

- Import search found no references to `src/generated`.

### Next Step

- Continue using `npx prisma generate` with Prisma Client generated under `node_modules/@prisma/client`.

## 2026-08-23 - AI Agent Workflow Files Established

### Summary

Audited the repository against the AGENTS.md Reference Guide methodology and added the remaining tool-agnostic AI workflow artifacts: an ephemeral task-state pair (`plan.md`, `progress.md`) at the repository root, and a permanent session-level history file (`docs/AI_SESSION_LOG.md`). Extended [AGENTS.md](AGENTS.md) with a State Management Protocol, Mechanical Enforcement notes, a When Stuck protocol, a Self-Improvement & Feedback protocol, and a Changelog. Full session detail is recorded in [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md).

### Files Changed

- `docs/governance/AGENTS.md`
- `docs/governance/PLAN.md`
- `docs/governance/DECISIONS.md`
- `docs/AI_SESSION_LOG.md` (new)
- `plan.md`, `progress.md` (new, repository root)
- `.gitignore`
- `AGENTS.md` (root)

### Database Changes

- None.

### API Changes

- None.

### UI Changes

- None.

### Infrastructure

- Verified `.husky/pre-commit` already mechanically enforces lint/format via `lint-staged` on staged files.
- Confirmed no `.claude/settings.json` hooks and no Codex sandbox/approval configuration exist; the safety/approval boundary in [AGENTS.md](AGENTS.md) is currently prose-only beyond the lint/format hook.

### Tests

- Not run; no application, schema, Docker, or package files were changed.

### Known Issues

- `prisma.config.ts` points its seed script at `prisma/seed/index.ts`, but that file does not yet exist (`prisma/seed/data/` is present, the seed entry point is not). Seed data implementation remains a next step, consistent with [PLAN.md](PLAN.md)'s Phase 1 Prisma Domain Schema milestone.
- Pre-existing uncommitted changes to `package.json`, `package-lock.json`, and `prisma.config.ts` were present at session start and are unrelated to this task; they were left untouched.

### Technical Debt

- No Claude Code `PreToolUse`/`PostToolUse` hooks exist yet to mechanically enforce the "Requires explicit approval" boundary in [AGENTS.md](AGENTS.md) (dependency installs, migrations, destructive SQL, schema changes, deletes, full builds/tests, git push/branch changes). Recommended future improvement, not yet approved.

### Next Step

- Use `docs/AI_SESSION_LOG.md` for all future AI-assisted session entries; continue using this file for milestone-level roadmap completion against [PLAN.md](PLAN.md).

## 2026-10-28 - Reference Library Refresh (Pack v1.1)

### Summary

- Replaced stale references and added the missing Phase references and a conflict-resolution document. See [docs/AI_SESSION_LOG.md](../AI_SESSION_LOG.md) for detail.

### Database Changes / API Changes / UI Changes

- None.

### Next Step

- Owner review of [docs/references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md).

## 2026-10-28 - Documentation Reconciliation Audit (update-audit)

### Summary

Reconciled the governance docs against the current repository. This was a documentation-only session: no application, schema, config, or package files were changed. Full detail is in [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md).

### Corrections (VERIFIED against source)

- `DECISIONS.md` moved from `docs/governance/` to `docs/decisions/` and `docs/decisions/README.md` was deleted in commit e01b1ed. About 20 links pointed at the old paths; they are repointed. Historical file lists in this journal were left unchanged.
- The schema is no longer "HealthCheck only". There are 5 migrations and 22 models, and HealthCheck was dropped in `001_identity_foundation`.
- The `package.json`/`package-lock.json`/`prisma.config.ts` changes listed as pending were committed in e01b1ed.
- `src/`, `prisma/seed/`, `.env.example`, and `node_modules/` are all absent on disk.
- Sprint S1's listed installs are already present in `package.json`.
- ADR-0010 is taken, so Phase 1 decisions start at ADR-0011.

### New Findings

- Prisma loads only `prisma/schema.prisma`. The `prisma/models/` copies are stale (no back-relations). This is recorded as a critical invariant in [AGENTS.md](AGENTS.md).
- `Product` uses direct `categoryId`/`collectionId` FKs, which differs from the join-table design in the Database Design Reference.
- Coupons and wishlists are already migrated, although PLAN parks them in Phase 2+.

### Database Changes / API Changes / UI Changes

- None.

### Tests

- Not run. `npx prisma validate` could not run because there is no local install, and it was aborted rather than fetching an unpinned Prisma release.

### Next Step

- Owner: resolve the M0.3 items, which now include D-01 vs Hosting, the Phase 1 scope of coupons/wishlists, `.env.example`, and the `prisma/models/` copies.

## 2026-10-28 - Status + Sync Audit and Full Implementation Plan

### Summary

Audited how far Phase 1 has got: Phase 0 is about 90% done and the Phase 1 MVP about 15%, with no application code yet. Cross-checked Brand-Identity.md, Research_and_Prototype.md, the Figma-Make prototype, the `BnV Docs/Images/` library, and Visual-Asset-Inventory.md. They are not in sync. Rewrote [PLAN.md](PLAN.md) as the full implementation plan: Gate A (Phase 0 close-out), Gate B (Sprint 0.5 Spec Sync), Phase 1 sprints 1A–1I with exit checks and reference links, and Phases 2–4.

### Files Changed

- `docs/references/Implementation-Plan.md` (new master plan), `docs/references/README.md`, `docs/governance/PLAN.md` (now a short tracker), `docs/governance/PROGRESS.md`, `docs/AI_SESSION_LOG.md`.

### Database Changes / API Changes / UI Changes

- None.

### Next Step

- Owner: work through Gate A (decisions D-01 to D-19), then Gate B.

## 2026-10-28 - Gate A Closed: Decisions, Seeding, Env

### Summary

Closed Gate A (milestone M0.3):

- D-01 to D-19 are decided: D-01 Vercel (ADR-0011), D-02 changed to keep the RBAC tables (ADR-0012), the rest accepted (ADR-0013).
- Prisma is pinned to 7.8.0 and connects through `@prisma/adapter-pg` (ADR-0014).
- Built `prisma/seed/` with idempotent seeders and the `db:*` scripts (ADR-0015).
- Added `.env.example`, deleted the stale `prisma/models/` copies, and replaced the README.

### Files Changed

- `package.json`, `package-lock.json`, `.gitignore`, `.env.example` (new), `README.md`.
- `prisma/seed/**` (new), `prisma/models/**` (deleted).
- `docs/decisions/DECISIONS.md`, `docs/references/{Phase-1-Reconciled-Decisions,Database-Standards,Database-Design,Technology-Stack,Implementation-Plan}.md`, `docs/governance/{AGENTS,PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.

### Database Changes

- No schema or migration changes. The seed writes reference data (roles, permissions, super admin, brand, categories, collections) and, with `--demo`, demo products.

### Tests

- `npx prisma validate`, `npm run typecheck` and ESLint on `prisma/seed` passed. Seed runs are recorded in the AI session log.

### Next Step

- Gate B (Sprint 0.5 Spec Sync).

## 2026-10-29 - Gate B Spec Sync (Partial)

### Summary

- Decisions D-20 to D-23 accepted (ADR-0017); D-08 summary row fixed.
- Brand-Identity v1.3 (computed contrast, full token set, shadcn mapping, scales), Research_and_Prototype v1.1, Phase-1-Step-by-Step v2.1, Implementation-Plan v1.2.
- New references: Phase-1-UX-Spec.md (PROPOSED) and Business-Facts.md (values TBD).
- Image library cleaned (duplicates and non-B&V material moved to `BnV Docs/_archive/`), 124 WebP placeholders exported to `public/images/prototype/`, Visual-Asset-Inventory v2.0 with a mapping CSV.

### Files Changed

- `docs/references/**` (including new `Business-Facts.md`, `Phase-1-UX-Spec.md`, `assets/image-mapping.csv`), `docs/decisions/DECISIONS.md`, `docs/governance/{PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.
- `public/images/prototype/` (124 new WebP files).

### Database Changes

- None.

### Tests

- Contrast script: 36 pairs pass. Export check: 124 files, correct dimensions, all ≤ 300 KB. Archive move: file count and hashes unchanged.

### Next Step

- Owner: fill Business-Facts.md and commission the logo and real photography.
- Phase 1 sprint 1A.

## 2026-10-29 - Sprint 1A Foundation Finish

### Summary

- `@/*` now resolves to `./src/*` (D-14).
- Added `src/config/{brand,routes,navigation,seo,theme}.ts`, `src/constants/statuses.ts` (D-04 + D-20 with Zod enums) and `src/lib/utils/cn.ts`. Unconfirmed business values in `brand.ts` are `null` (Business-Facts.md).
- Pulled forward from 1C: the demo seed's image URLs now point at the exported `product-*.webp` placeholders.

### Files Changed

- `tsconfig.json`, `src/**` (new), `prisma/seed/data/products.ts`, `docs/references/{Phase-1-Step-by-Step,Visual-Asset-Inventory}.md`, `docs/governance/{PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.

### Database Changes

- None. Demo seed re-run twice: products 12, variants 26 both times.

### Tests

- `npm run typecheck`, `npm run lint` and `npm run build` pass. All 12 seed image URLs exist under `public/`.

### Next Step

- Sprint 1B (design system).

## 2026-10-29 - Sprint 1B Design System

### Summary

- Brand-Identity v1.3 tokens (light and dark), shadcn aliases, and the type, radius, shadow and motion scales in `app/globals.css` (Tailwind v4 `@theme inline`, class-based dark variant).
- Playfair Display and Inter through `next/font`; next-themes provider and Sun/Moon toggle (Light/Dark only, saved).
- shadcn Button (adds `luxury`, `whatsapp`), Badge (`rose`, `gold`), Input, Card, Sheet, Accordion, re-mapped to B&V tokens.
- SiteHeader, MobileNav (Sheet) and SiteFooter from `src/config/navigation.ts`; null social/WhatsApp values are hidden.
- `/style-guide` (noindex, nofollow).

### Files Changed

- `app/{globals.css,layout.tsx,style-guide/page.tsx}`, `components.json`, `src/components/{ui,layout,theme}/**`, `package.json`, `package-lock.json`, `docs/governance/{PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.

### Dependencies

- Added `radix-ui` and `tw-animate-css` (shadcn CLI, approved).

### Tests

- `npm run typecheck`, `npm run lint` and `npm run build` pass. `/style-guide` renders `noindex, nofollow`. Visual review in both themes is pending (owner).

### Next Step

- Sprint 1C (database completion).

## 2026-10-29 - Sprint 1C Database Completion

### Summary

- `collection_products` join table (D-21); `products.collection_id` dropped after backfill.
- New tables: `custom_requests`, `collaboration_inquiries`, `contact_messages`, `newsletter_subscribers`, `site_settings` (ADR-0018).
- `src/lib/prisma.ts` app singleton over a shared `createPrismaClient()` (`src/lib/prisma-client.ts`); the seed uses the same factory.
- Seed: products list `collectionSlugs`; retired collections archived; placeholder site settings.

### Files Changed

- `prisma/schema/{catalog,products,identity,commerce,inquiries,settings}.prisma`, `prisma/migrations/20261029105640_005_collections_and_inquiries/`, `prisma/seed/**`, `src/lib/{prisma,prisma-client}.ts`, `docs/decisions/DECISIONS.md`, `docs/governance/{PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.

### Database Changes

- Migration `005_collections_and_inquiries` applied; no schema drift. Collections: 5 active, 2 archived with 0 links; 119 active products, all linked; 5 site settings.

### Tests

- `prisma validate` and `tsc --noEmit` pass. `db:seed` and `db:seed:demo` each ran twice with exit 0 and stable counts.

### Next Step

- Sprint 1D (homepage).

## 2026-10-29 - Sprint 1D Homepage (built, manual QA pending)

### Summary

- Homepage in Brand-Identity §23 order, server-rendered from the DB with 5-minute revalidation: announcement bar, hero, featured categories, New In, Limited Drop, Fashion Edit, Jewelry Highlight, Couple Collection, Gift Box teaser, Custom Orders, Love Websites, Portfolio "coming soon", Testimonials (hidden while empty, D-23), newsletter.
- Reusable primitives for 1E: `PageHero`, `SectionHeading`, `CategoryCard`, `TeaserBand`, `ArtDirectedImage`, `AnnouncementBar`, `ProductCard`, `ProductGrid`, `formatLkr`.
- Newsletter Server Action with Zod and required consent; upsert with `source = 'homepage'`, reactivates unsubscribed emails, same response for duplicates.

### Files Changed

- `app/page.tsx`, `app/loading.tsx`, `src/components/{marketing,product}/**`, `src/features/{home,newsletter}/**`, `src/data/{home,testimonials}.ts`, `src/lib/utils/{format,index}.ts`, `docs/governance/{PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.

### Tests

- Typecheck, lint and build pass; `/` prerenders as static with 5m revalidate. Served HTML shows DB products with LKR prices and no USD, ratings or "Love Notes".

### Next Step

- Manual QA (both themes; 360–1536px; newsletter new/duplicate/unsubscribed), then sprint 1E.

## 2026-10-29 - Image Quality, Lazy Loading and Motion

### Summary

- Images:
  - AVIF + WebP output, a qualities allowlist `[75, 85]` and a 31-day image cache.
  - `sizes`/quality presets in `src/config/images.ts`.
  - Generated blur placeholders.
  - Art-directed `<picture>` banners.
  - Only the hero is eager (`fetchPriority="high"`); `priority` was removed.
- Sources re-exported from the originals: products about 1122×1403 (were 960×1200), banners at quality 85 with no resolution gain possible.
- Motion: Framer Motion `Reveal`/`Stagger` with Brand-Identity §25.1 tokens and reduced motion as opacity only, applied to the homepage. Hover scale fixed to 1.03.

### Files Changed

- `next.config.ts`
- `src/config/{images,motion}.ts`
- `src/components/motion/*`
- `src/components/marketing/{art-directed-image,page-hero,category-card,teaser-band}.tsx`
- `src/components/product/product-card.tsx`
- `src/features/home/sections/*`
- `src/lib/utils/image.ts`
- `src/data/image-placeholders.ts` (generated)
- `scripts/images/{reexport,placeholders}.ts`
- `public/images/prototype/*` (201 files)
- Docs: AGENTS.md, UX-Spec §8, Visual-Asset-Inventory §8

### Tests

- Lint, typecheck and build pass.
- The served HTML has 1 eager/high-priority image and 47 lazy images, `<picture>` art direction, blur backgrounds and no `scale-105`.
- `/_next/image` returns `image/avif` (7.1 KB) for AVIF clients and `image/webp` (7.5 KB) otherwise.

## 2026-10-29 - Form Validation Standard (ADR-0019)

### Summary

- Forms validate on both the client and the server with a shared Zod schema.
- New: `useInput` / `useFormValidation` (`src/lib/forms/`), `FieldError` / `FormMessage` with a reserved line, and `FormState`.
- Newsletter rebuilt on the new pieces:
  - already-active emails get an "already on our list" notice;
  - unsubscribed emails are reactivated with "Welcome back";
  - the success panel has a "Subscribe another email" reset.
- Docs: AGENTS.md Forms, ADR-0019, UX-Spec §6.

### Tests

- Lint, typecheck and build pass.
- Calling the action directly: missing consent, bad email and empty email return field errors; the existing email in capitals returns the info notice with no write.

## 2026-10-29 - Sprint 1E Catalog + PDP (built, manual QA pending)

### Summary

- Implemented blueprint `.claude/blueprints/010-sprint-1e-catalog-pdp.md`.
- Shared catalog data layer `src/features/catalog/` (`queries`, `schema`, `variants`). The homepage now reuses `cardSelect`/`toCards` from it. Public visibility is enforced in queries: active products and variants, active collections inside their start/end dates.
- Routes:
  - `/shop`: dynamic, GET-form filters (category, collection, min/max LKR, in stock) and sorts (newest, price asc/desc). Canonical is always `/shop`.
  - `/[pillar]` and `/[pillar]/[sub]` (D-21): ISR. Unknown pillars return 404 (`dynamicParams = false`). Empty subcategories are `noindex`.
  - `/collections/[slug]` and `/products/[slug]`: ISR with `generateStaticParams`.
- PDP:
  - Gallery (primary image eager, high fetch priority, quality 85).
  - `VariantSelector` parses options from `variant.name` (UX-Spec §9.1) and shows sold-out and "Only a few left" states plus quantity.
  - Add to cart is a disabled stub carrying the 1F payload `{variantId, quantity, selectedOptions}`.
  - "Ask on WhatsApp" appears once `brand.contact.whatsapp` is set. Until then it links to `/contact`.
  - Accordions and up to 4 related products (UX-Spec §9.3).
- SEO:
  - `src/lib/seo/{canonical,metadata,jsonld}`.
  - Product JSON-LD with LKR offers and no ratings; Breadcrumb and CollectionPage JSON-LD.
  - `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`.

### Files Changed

- `app/{shop,[pillar],collections,products}/**`, `app/{sitemap,robots}.ts`, `app/not-found.tsx`.
- `src/features/catalog/**`, `src/features/home/queries.ts`.
- `src/components/catalog/**`, `src/components/product/{product-gallery,variant-selector,product-accordions,size-guide-sheet}.tsx`.
- `src/lib/seo/**`, `src/config/brand.ts` (`whatsappUrl`, `policyCopy`), `src/data/size-guides/index.ts`.

### Tests

- Typecheck, lint and build pass. Build output: 5 pillars, 15 subcategories, 5 collections and 119 products prerendered with 5m revalidation.
- Against `next start`:
  - `/shop` price sorts are correctly ordered.
  - An impossible filter shows "No pieces match these filters." with "Clear filters".
  - `/women/dresses` and `/jewelry/rings` return 200; `/foo` returns 404.
  - PDP HTML has Product JSON-LD in LKR with no `aggregateRating` and no USD.
  - `robots.txt` and `sitemap.xml` (146 URLs) are served.

### Known Gotchas

- `/products/<unknown>` renders the not-found page with `noindex` but HTTP 200. This is caused by streaming from the root `app/loading.tsx`.
- Shop price sort and the in-stock filter run in memory. That is fine for the Phase 1 catalog size; add pagination or SQL sorting before the catalog grows large.
- The demo seed has quantity 10 for every variant, so the sold-out and low-stock states are untested against real data. Verify them by editing inventory.
- Size guide, care copy, delivery/returns values and the WhatsApp number are owner TBDs. The size guide stays hidden until `src/data/size-guides` has data.

### Next Step

- Manual QA (both themes; 360–1536px; filters; variant selection), then sprint 1F.

## 2026-10-29 - Sprint 1F Cart + Checkout Inquiry (built, manual QA pending)

### Summary

- Implemented blueprint `.claude/blueprints/011-sprint-1f-cart-checkout.md` (ADR-0020).
- Migration `006_order_inquiry_status`: `orders.status` default `inquiry_received` (pending rows backfilled) and new `orders.payment_status` (default `pending`).
- Guest cart (`src/features/cart/`): httpOnly `bnv_cart` cookie → `carts.guest_token`; `addToCart`, `updateCartItemQuantity`, `removeCartItem`, `getCartSnapshot` Server Actions. Same variant + options increments the line; quantity capped by stock and `commerce.maxLineQuantity` (10).
- UI: `CartProvider` + `CartButton` (count badge) + `CartDrawer` (Sheet) + `/cart`; PDP Add to cart is live and opens the drawer.
- Checkout (`src/features/checkout/`): UX-Spec §1.1 form, phone normalised to `+947XXXXXXXX`, province derived from district. `placeOrder` creates the order (`inquiry_received`), item snapshots, a `manual`/`pending` payment and marks the cart `converted` in one transaction, then redirects to `/checkout/success` (order number, next steps per method, WhatsApp CTA).
- Vitest 3 added (`npm test`).

### Files Changed

- `prisma/schema/commerce.prisma`, `prisma/migrations/*_006_order_inquiry_status/`.
- `src/features/cart/**`, `src/features/checkout/**`, `src/components/cart/**`, `src/data/sri-lanka-districts.ts`, `src/config/{commerce,images}.ts`.
- `app/layout.tsx`, `app/cart/page.tsx`, `app/checkout/{page,success/page}.tsx`.
- `src/components/layout/site-header.tsx`, `src/components/product/variant-selector.tsx`.
- `package.json` (`test` script, `vitest` dev dependency), `vitest.config.ts`.

### Tests

- `npm test`: 18 passing (districts, pricing/totals/snapshot/order number, phone and checkout schema).
- Typecheck, lint and build pass; product, pillar and collection pages are still ISR. `/cart`, `/checkout`, `/checkout/success` are dynamic and `noindex`.
- Dev server: empty `/checkout` redirects to `/cart`; an unknown order number returns not-found.
- DB: `orders.status` default `inquiry_received`, `payment_status` column present, 0 `pending` orders.

### Known Gotchas

- `prisma migrate dev` fails locally on the shadow database (`permission denied to terminate process`); the migration was applied by `migrate dev` before that error, and `migrate status` reports up to date. Use `--create-only` + `npm run db:deploy` if it recurs.
- The cart count loads after mount, so the badge appears a moment after first paint (keeps ISR pages static).
- Stock is not reserved or decremented at checkout (ADR-0020); decrement at dispatch belongs to 1H.
- `/policies/*` pages are linked but not built.
- After a migration or `prisma generate`, restart `next dev`: `src/lib/prisma.ts` caches the client on `globalThis`, so a running server keeps the old schema. During 1F QA this surfaced as checkout's generic "Something went wrong" (`paymentStatus` unknown). Cart and checkout actions now `console.error` the cause.
- Harmless noise: `chrome-extension://invalid` console errors (browser extensions such as Grammarly) and Prisma Studio `ERR_STREAM_UNABLE_TO_PIPE` (cancelled Studio request).

### Next Step

- Manual QA: add → drawer → `/cart` → checkout (COD and bank transfer) → success; check rows in Prisma Studio; both themes at 360px and 1440px.

## 2026-10-29 - Sprint 1G Custom, Contact, Portfolio (built, manual QA pending)

- Blueprint: `.claude/blueprints/013-sprint-1g-custom-contact-portfolio.md`. Owner decisions: defer Cloudinary uploads; portfolio ships empty with "Coming soon"; policy pages are stubs until the owner supplies the text.
- Shared form kit: `src/lib/forms/{fields,parse}.ts` (phone, email, consent, optional, future date, reference links, honeypot; `parseForm`) and `src/components/forms/form-kit.tsx` (`FormShell`, `TextField`, `TextareaField`, `SelectField`, `ConsentField`, `FormSuccess`). `useInput` now also binds textareas and selects.
- `/custom` and `/love-websites` (preset `love_website`) save to `custom_requests`; `/contact` to `contact_messages`; `/collaborate` (three forms, `?type=` deep links) to `collaboration_inquiries`. Reference images go to WhatsApp after submit.
- `/portfolio` (link filters, "Coming soon" while `src/data/portfolio` is empty) and `/portfolio/[slug]` (gallery, lightbox, related; indexable only with `context`).
- `/policies/{terms,privacy,delivery,returns}` render a "being finalised" panel, `noindex`, not in the sitemap.

### Tests

- `npm test`: 28 passing (10 new inquiry schema tests). Typecheck, lint and build pass.
- `next start`: all new routes 200; `/portfolio` shows "Coming soon"; policies carry `noindex`; sitemap lists the five new pages. No form submissions yet (DB writes need approval).

### Known Gotchas

- Unknown `/portfolio/*` and `/policies/*` slugs return HTTP 200 with `noindex`, the same as products (root `loading.tsx` streams).
- Shoot media `cloudinaryId` values need `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and a `next.config.ts` remote pattern once real shoots are added; local `/images/...` paths work now.
- Our Story and FAQ pages (optional step 9) are not built yet.

### Next Step

- Manual QA: submit each form once and check the rows in Prisma Studio, in both themes at 360px and 1440px.
