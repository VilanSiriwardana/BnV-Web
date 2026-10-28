# B&V Phase 1 Step-by-Step Development Guidance

| Field               | Value                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Version             | 2.0 (2026-10-28)                                                                            |
| Status              | Approved; aligned with the accepted decisions D-01 to D-19 (ADR-0011 to ADR-0016)           |
| Converted / updated | 2026-10-28                                                                                  |
| Based on            | BV_Phase_1_Step_by_Step_Guidance_Document.pdf (v1.0, July 2026), then updated for decisions |

> **How to read this document.** This is the build guidance for Phase 1: what to build, in what order, and the rules for each module. It now reflects the accepted decisions in [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md) and the ADRs in [../decisions/DECISIONS.md](../decisions/DECISIONS.md), and the design rules in [Brand-Identity.md](Brand-Identity.md) v1.2.
>
> - The sprint schedule, exit checks and approvals live in [Implementation-Plan.md](Implementation-Plan.md). Section 20 here only maps to it.
> - Decision tags such as **(D-08)** or **(ADR-0012)** mark where a decision changed the original guidance.
> - **OPEN** marks a topic still being decided in Gate B (D-20 to D-23). Stop and ask before building anything that depends on an OPEN item.
> - **VERIFIED** marks a statement checked against the repository on 2026-10-28.
> - The v1.0 text (Jenkins pipeline, `src/app` layout, Docker database, Sanity in Phase 1) is in git history. Section 23 lists what changed.

```text
                                    B&V
Phase 1 Step-by-Step Development
                                  Guidance
```

#### Full context development blueprint for the Launch / MVP website

### Style for you. Gifts for them. Moments for two.

Prepared for Phase 1 production development. Updated for the accepted Phase 1 decisions, October 2026.

## Document Control

| Item             | Decision                                                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project          | B&V modern romantic lifestyle ecommerce web app                                                                                                                                                    |
| Phase            | Phase 1 - Launch / MVP Website                                                                                                                                                                     |
| Primary goal     | Build a polished, trusted, premium, mobile-first ecommerce and brand-trust website that validates the B&V direction before advanced growth features.                                               |
| Brand promise    | Style for you. Gifts for them. Moments for two.                                                                                                                                                    |
| Design direction | Lavender Luxury Romance in light mode (primary experience); Midnight Lavender Luxury in dark mode.                                                                                                 |
| Core stack       | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Prisma 7.8.0, PostgreSQL 16, Zod, Auth.js (admin only), Cloudinary. PayHere/KOKO and Sanity are Phase 2 (D-16, D-17). |
| Hosting          | Vercel + managed PostgreSQL, GitHub Actions CI (D-01, ADR-0011). Local development uses native PostgreSQL 16 and pgAdmin 4 (ADR-0010).                                                             |
| Document output  | Step-by-step guidance, implementation sequencing, module breakdown, design rules, QA gates, and a map to the sprint plan.                                                                          |

## Table of Contents

1. Full Phase 1 Context
2. Phase 1 Product Scope
3. Architecture and Repository Foundation
4. Local Development Environment
5. Global Tailwind and Theme System
6. Reusable Component System
7. PostgreSQL and Prisma Implementation Plan
8. Authentication, Sessions, and Roles
9. Image, File, and Media Handling
10. Public Storefront Build Steps
11. Cart, Checkout, and Inquiry Flow
12. Custom Orders and Contact Flows
13. Visual Portfolio and Collaboration Hub
14. Admin Dashboard MVP
15. SEO and Metadata Implementation
16. Language Handling
17. Responsiveness, Accessibility, and Performance
18. Testing and QA Gates
19. CI and Deployment Design
20. Sprint-by-Sprint Execution Plan
21. Phase 2 Parking Lot
22. Final Acceptance Checklist
23. Changes from v1.0

## 1. Full Phase 1 Context

B&V is being developed as a modern romantic lifestyle ecommerce web app, not only as a couple store. Phase 1 must validate the brand direction, visual identity, product discovery experience, order/inquiry flow, and admin management workflow before advanced personalization or platform expansion. The current working public name is B&V. The name and logo can evolve later, therefore the implementation must centralize brand labels, logo assets, colors, metadata, social links, and theme values in configuration files instead of hard-coding them throughout components.

#### Phase 1 principle

Build a beautiful, reliable, SEO-ready, reusable MVP that can sell or collect inquiries for Women, Men, Jewelry, Gifts, Couples, Custom Orders, Love Websites, and the Visual Portfolio / Collaboration Hub without overbuilding Phase 2 features.

### 1.1 Strategic Positioning

| Area             | Phase 1 Direction                                                                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand category   | Modern Romantic Lifestyle Ecommerce Brand                                                                                                                                         |
| Audience         | Individuals, couples, gift buyers, women fashion customers, men fashion customers, jewelry customers, custom order customers, love website customers, and collaboration visitors. |
| Commerce pillars | Women, Men, Jewelry, Gifts, Couples, Custom, Love Websites, Visual Portfolio.                                                                                                     |
| Market           | Sri Lanka at launch: LKR prices, Sri Lanka delivery only (D-10).                                                                                                                  |
| Tone             | Premium, romantic, calm, editorial, cinematic, warm, emotionally genuine.                                                                                                         |
| Differentiator   | Couple-led storytelling and visual identity, but not a couple-only shopping experience. Copy must stay solo-inclusive.                                                            |

### 1.2 Phase 1 Must Answer

- What is B&V and why should a visitor trust it?
- Can I shop for myself, not only as a couple?
- What can I buy: fashion, jewelry, gifts, couples, custom products, and love websites?
- Can I browse products, see details, select options, and submit an order or inquiry?
- Can the team manage products, categories, collections, images, orders, custom requests, collaboration inquiries, and messages from an admin dashboard?
- Does the site look premium and consistent across mobile, tablet, desktop, light mode, and dark mode?
- Is the site SEO-ready from launch instead of being fixed later?

### 1.3 Content Truth Rules (D-10)

The Figma Make prototype and the mockups are **visual reference only**. Never copy their data or copy text without checking it. In production:

- Prices are in **LKR**, with a real free-delivery threshold from the owner.
- Delivery is **Sri Lanka only** at launch. No "worldwide shipping".
- **No star ratings, review counts, testimonials or `AggregateRating` schema** until real reviews exist.
- Payment is manual or inquiry-based with WhatsApp (D-17). No card, PayPal or Apple Pay UI.
- No "12-Month Warranty", "100K+ customers", "Bestseller" or similar claims unless true. The copyright year comes from the current date.
- Visual Portfolio images are **real B&V shoots only**. AI-generated people are never presented as real.

## 2. Phase 1 Product Scope

Phase 1 should launch only the features needed to make the website trustworthy, browsable, order-ready, inquiry-ready, admin-manageable, SEO-friendly, and visually aligned with the approved brand identity.

### 2.1 Included in Phase 1

| Module            | Included Phase 1 Scope                                                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation        | Next.js App Router, TypeScript, Tailwind v4, Prisma, PostgreSQL, environment structure, ESLint, Prettier, Husky, `typecheck` script. Shared code under `src/` (D-14).                               |
| Design System     | Brand-Identity v1.2 light/dark tokens, Playfair Display + Inter, buttons, forms, cards, product cards, category cards, drawers, modals, accordions, layout primitives, noindex `/style-guide`.      |
| Public Storefront | Homepage, shop and category pages, collection pages, product detail pages, cart, checkout/inquiry, custom orders, love websites landing, portfolio, collaborate, our story, contact, FAQ, policies. |
| Commerce Core     | Products, variants, images, categories, collections, carts, cart items, orders, order item snapshots, manual payment records.                                                                       |
| Auth              | **Admin login only** with Auth.js Credentials and JWT sessions (D-03). Customers check out as guests.                                                                                               |
| Admin Dashboard   | Dashboard, product CRUD, image upload, category/collection management, order inquiries, custom requests, collaboration inquiries, contact messages, newsletter subscribers.                         |
| Portfolio         | `/portfolio`, `/portfolio/[slug]` from static typed shoot data, `/collaborate` with collaboration, consultation request and event invitation forms (D-05, D-06, D-07).                              |
| Love Websites     | `/love-websites` landing page plus an inquiry stored as a custom request with `request_type = love_website` (D-09).                                                                                 |
| Media             | Cloudinary upload and metadata storage; no binary files in PostgreSQL. Curated placeholders in `public/images/prototype/` until real photography exists.                                            |
| SEO               | Metadata utilities, canonical URLs, robots, sitemap, JSON-LD, image alt text, page title/description patterns.                                                                                      |
| Deployment        | Vercel + managed PostgreSQL with a pooled connection string, GitHub Actions (lint, typecheck, build), `prisma migrate deploy`, health check (D-01).                                                 |

### 2.2 Excluded or Parked for Phase 2

- Customer accounts, Google sign-in and the Auth.js adapter tables (D-03).
- Full customer dashboard with saved addresses and order tracking.
- Wishlist and coupons. Their tables are migrated but stay **unused and unseeded** until Phase 2 (ADR-0015).
- Reviews, customer memories, real testimonials, advanced campaigns, and gift finder.
- Real gift box builder with saved build sessions and item combinations (Phase 1 has a teaser only).
- PayHere and KOKO, payment webhooks, refunds, shipment tracking, and advanced order lifecycle (D-17).
- Sanity CMS: journal, lookbook, portfolio editing (D-16).
- `shoots` / `shoot_media` tables for admin-editable portfolio content (D-05).
- Language switch, Sinhala/Tamil routes and hreflang (D-15).
- Consultation availability or calendar engine (D-06).
- Love Website builder and generated public pages (Phase 3, D-09).
- AI stylist, subscriptions, inventory ledger, ambassador program, mobile app APIs, and offline showroom features.

## 3. Architecture and Repository Foundation

The first development task is not the homepage. The first task is a production-ready foundation that supports reusable development, global styling, database access, admin management, SEO, and deployment.

### 3.1 Foundation State (VERIFIED 2026-10-28)

Already done:

1. GitHub repository on `main`.
2. Next.js 16.2.10 App Router, React 19.2.4, TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`).
3. ESLint, Prettier (with the Tailwind plugin), Husky and lint-staged.
4. Installed: Prisma, `@prisma/client` and `@prisma/adapter-pg` pinned to 7.8.0 (ADR-0014), `pg`, Zod 4, Framer Motion, Lucide React, next-themes, clsx, tailwind-merge, class-variance-authority, bcryptjs, tsx.
5. `.env.example` committed, real `.env` ignored.
6. Scripts: `typecheck`, `db:validate`, `db:generate`, `db:migrate`, `db:deploy`, `db:seed`, `db:seed:demo`, `db:reset`, `db:setup`, `db:studio`.

Installed later, each with approval in its sprint:

| Package             | Sprint  | Decision |
| ------------------- | ------- | -------- |
| shadcn/ui (via CLI) | 1B      | —        |
| Vitest              | 1F      | D-18     |
| Cloudinary SDK      | 1G      | —        |
| Auth.js (v5)        | 1H      | D-03     |
| Playwright          | Phase 2 | D-18     |

Not installed in Phase 1: Sanity (D-16), PayHere/KOKO SDKs (D-17), an i18n library (D-15).

### 3.2 Folder Structure (D-14)

`app/` stays at the repository root. Shared code lives under `src/`. This replaces the v1.0 `src/app/` layout.

```text
app/
 (public)/            storefront routes
 (auth)/              admin login, auth error
 admin/               protected admin
 api/                 route handlers (health, uploads)
 globals.css          theme tokens (Tailwind v4)
 layout.tsx
 sitemap.ts
 robots.ts
src/
 components/
  ui/                 shadcn + cva primitives
  layout/
  commerce/
  home/
  product/
  portfolio/
  admin/
  forms/
 config/
  brand.ts
  navigation.ts
  routes.ts
  seo.ts
  theme.ts
 constants/
  statuses.ts         D-04 status values (Zod enums)
 features/
  auth/
  cart/
  checkout/
  products/
  collections/
  custom-orders/
  portfolio/
  admin/
 lib/
  prisma.ts           singleton using @prisma/adapter-pg (ADR-0014)
  auth/               requireRole, requireAdmin, requireSuperAdmin
  cloudinary/
  seo/
  validations/
  utils/
 data/
  portfolio/          static typed shoot data (D-05)
 types/
prisma/
 schema/              split by domain (ADR-0016)
  schema.prisma       generator + datasource
  identity.prisma
  catalog.prisma
  products.prisma
  commerce.prisma
 migrations/
 seed/                index.ts, seeders/, data/ (ADR-0015)
public/
 images/
  prototype/          curated placeholders (Gate B)
  brand/
```

- **VERIFIED gap:** `tsconfig.json` maps `@/*` to `./*`. Sprint 1A must point it at `./src/*` (or decide to keep `./*` and import as `@/src/...`) before the first shared module is written.
- `src/i18n/` is not created in Phase 1 (D-15).
- Before any structural change, read the relevant guide in `node_modules/next/dist/docs/`.

### 3.3 Central Configuration Files

| File                      | Purpose                                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| src/config/brand.ts       | Brand name, logo paths, tagline, social links, WhatsApp number, email, currency (LKR), country (LK), delivery fees and free-delivery threshold. |
| src/config/navigation.ts  | The only place the D-08 navigation is defined: main nav, Shop mega menu, utility nav, mobile drawer, footer, admin nav.                         |
| src/config/routes.ts      | Single source of truth for route paths and route labels.                                                                                        |
| src/config/seo.ts         | Default title template, metadata defaults, canonical base URL (`NEXT_PUBLIC_SITE_URL`), social preview defaults.                                |
| src/config/theme.ts       | Semantic theme labels and design token documentation for developers. Hex values stay in `app/globals.css`.                                      |
| src/constants/statuses.ts | D-04 status vocabularies, shared by Zod schemas, admin badges and server actions.                                                               |

The business values in `brand.ts` (WhatsApp number, email, domain, social handles, delivery fees, returns window) come from the owner in Gate B. Do not invent them.

## 4. Local Development Environment

**Changed (ADR-0010).** Local PostgreSQL 16 and pgAdmin 4 run natively, not in Docker. `docker-compose.yml` is a placeholder with no services. Production does not use Docker for Phase 1 (D-01).

### 4.1 Local Services

| Service    | How it runs                                                              |
| ---------- | ------------------------------------------------------------------------ |
| app        | `npm run dev` (Next.js dev server).                                      |
| PostgreSQL | Native PostgreSQL 16, database `bnv_db`, port 5432 (ADR-0010, ADR-0015). |
| pgAdmin    | Native pgAdmin 4, optional, for inspecting tables and seed data.         |
| redis      | Not used in Phase 1. Phase 3 with background jobs.                       |
| nginx      | Not used. Vercel handles routing, HTTPS and CDN.                         |

### 4.2 Required Local Commands

Run `npx prisma` and the `db:*` scripts only from `BnV-Web/`. From a parent folder, npx can pick up a cached Prisma 8 pre-release.

```text
# First run
cp .env.example .env            # fill DATABASE_URL and SEED_ADMIN_*
npm install
npm run db:setup                # generate + migrate deploy + seed

# Optional demo catalogue
npm run db:seed:demo

# Schema work (approval required)
npm run db:validate
npm run db:migrate

# Daily development
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test                    # from sprint 1F (Vitest)
```

### 4.3 Local Environment Acceptance Criteria

- A new developer can clone the repo, install PostgreSQL 16, copy `.env.example`, run `npm run db:setup`, and open the app.
- Prisma connects using `DATABASE_URL` from environment variables only, through `@prisma/adapter-pg`.
- The seed is idempotent: running it twice gives the same counts.
- The first `super_admin` comes from `SEED_ADMIN_*` env values, never a public route.
- No secrets are committed to Git.

## 5. Global Tailwind and Theme System

The design system is global from the first sprint. Components never use raw hex codes. They use semantic tokens such as `background`, `foreground`, `surface`, `primary`, `accent`, `border`, `muted` and `destructive`. Components should not know whether the theme is ivory or midnight plum.

Source of truth: [Brand-Identity.md](Brand-Identity.md) §13–16, §24, §32–36, §41 and §43. The tables below summarise it.

### 5.1 Light Theme Tokens — Lavender Luxury Romance

| Token                | Brand Color        | Hex     | Usage                                                     |
| -------------------- | ------------------ | ------- | --------------------------------------------------------- |
| background           | Warm Ivory         | #FAF7F2 | Page backgrounds, editorial layouts, checkout base.       |
| foreground           | Soft Charcoal      | #1C1B1A | Main text, headings, prices, labels.                      |
| surface              | Soft Blush         | #F3D8D6 | Story sections, soft cards, gift blocks.                  |
| surface-elevated     | White              | #FFFFFF | Modals, dropdowns, elevated cards.                        |
| primary              | Signature Lavender | #C8B6E2 | Primary CTAs, active states, focus rings, hero accents.   |
| primary-hover        | Soft Lilac Glow    | #D8C9F0 | Button hover, active highlights, soft glows.              |
| primary-foreground   | Soft Charcoal      | #1C1B1A | Text on lavender.                                         |
| secondary            | Dusty Rose         | #C98F94 | Romantic badges, icons, emotional accents.                |
| secondary-foreground | White              | #FFFFFF | Text on Dusty Rose (contrast-check before use).           |
| accent               | Champagne Gold     | #C6A15B | Premium labels, jewelry details, limited drops, dividers. |
| accent-foreground    | Soft Charcoal      | #1C1B1A | Text on gold.                                             |
| border               | Warm Taupe         | #D8C8BD | Borders, forms, card outlines, dividers.                  |
| muted                | Warm Taupe         | #D8C8BD | Muted fills. **Gate B fix pending** (see 5.4).            |
| muted-foreground     | —                  | #6F625B | Secondary text.                                           |
| destructive          | —                  | #C75D6A | Errors, destructive actions.                              |
| success              | —                  | #7F9A83 | Success states.                                           |

### 5.2 Dark Theme Tokens — Midnight Lavender Luxury

| Token                | Brand Color        | Hex     | Usage                                   |
| -------------------- | ------------------ | ------- | --------------------------------------- |
| background           | Midnight Aubergine | #17121D | Main dark page background (not black).  |
| foreground           | Moon Ivory         | #F7F1EA | Readable dark text (not pure white).    |
| surface              | Deep Plum          | #241B2E | Cards, sections, navbars, drawers.      |
| surface-elevated     | Velvet Plum        | #2F243A | Modals, dropdowns, elevated cards.      |
| primary              | Signature Lavender | #C8B6E2 | CTAs, active states, highlights.        |
| primary-hover        | Soft Lilac Glow    | #D8C9F0 | Hover and active emphasis.              |
| primary-foreground   | Midnight Aubergine | #17121D | Text on lavender.                       |
| secondary            | Muted Rose         | #B9828A | Romantic micro accents.                 |
| secondary-foreground | Moon Ivory         | #F7F1EA | Text on Muted Rose.                     |
| accent               | Candlelight Gold   | #D2B16F | Jewelry highlights and premium details. |
| accent-foreground    | Midnight Aubergine | #17121D | Text on gold.                           |
| border               | Smoky Taupe Plum   | #4A3A50 | Dark mode borders and dividers.         |
| muted                | —                  | #2A2133 | Muted fills.                            |
| muted-foreground     | —                  | #B8AABD | Secondary text.                         |
| destructive          | —                  | #D07886 | Errors.                                 |
| success              | —                  | #9EB8A0 | Success states.                         |

**Colour balance (Brand-Identity §15):** about 60% ivory and light backgrounds, 20% blush surfaces, 10% lavender brand moments, 5% Dusty Rose, 3% Champagne Gold, 2% strong contrast. The site must not feel too purple, too pink or too decorative.

### 5.3 Typography, Shape, Shadow and Motion

| Area     | Rule                                                                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fonts    | Playfair Display for display headings only; Inter for UI and body. Load both with `next/font` and expose them as CSS variables. Replace the default Geist.                        |
| Headings | Playfair used sparingly: hero, section titles, product names. Inter for prices, labels, forms, navigation.                                                                        |
| Radius   | Small for inputs and badges, **medium for cards and buttons (buttons are not pills)**, large for feature sections and image blocks, full for tags only.                           |
| Spacing  | Generous and breathable. Max-width container 1440px (Gate B).                                                                                                                     |
| Shadows  | Soft and warm only. No heavy dark or harsh box shadows.                                                                                                                           |
| Icons    | Lucide React, thin outline, consistent stroke.                                                                                                                                    |
| Motion   | Framer Motion, subtle: fade-ins, soft slide-ups, section reveals, image hover scale, drawer and modal transitions. Respect `prefers-reduced-motion`. No bounce or heavy parallax. |

### 5.4 Design Items Being Finalised in Gate B

Brand-Identity v1.2 still has these gaps. They are part of the Gate B checklist in [Implementation-Plan.md](Implementation-Plan.md) and must be closed before sprint 1B ships tokens:

- A contrast-safe **darker lavender** and **darker gold** for text and small-text buttons (Signature Lavender fails contrast as text, Brand-Identity §16).
- Fix `muted` / `muted-foreground` in light mode: `muted` equals `border` (#D8C8BD), so muted text on it is about 3.7:1.
- Map the tokens to shadcn's names (`card`, `popover`, `input`, `ring`, and shadcn's hover `accent`, which must not collide with the gold `accent`).
- Type, spacing, radius, shadow and motion scales.

### 5.5 Theme Implementation Steps (D-11)

1. Load Playfair Display and Inter with `next/font` in `app/layout.tsx`.
2. Define every token as a CSS variable in `app/globals.css` on `:root` (light) and `.dark` (dark). Remove the current default `prefers-color-scheme` block.
3. Expose the variables through the Tailwind v4 `@theme` mechanism in `globals.css`, so `bg-background`, `text-foreground`, `bg-primary` and `border-border` exist. **There is no `tailwind.config.ts`.** Check the exact v4 syntax against the installed version.
4. Use `next-themes` with class-based switching.
5. Build a `ThemeToggle`: small, Lucide sun/moon icons, next to the utility icons, instant, saved, no reload. Light and Dark only in Phase 1; System later (Brand-Identity §41.5).
6. Developer rule: raw hex values are allowed only in `app/globals.css`.
7. Build a **noindex** `/style-guide` page that previews buttons, inputs, cards, typography, product cards, badges, drawers, modals and both themes. Exit check for 1B: visual review in both themes and contrast passes.

### 5.6 Dark Mode Component Rules (Brand-Identity §41.4)

| Component        | Dark rule                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Navbar           | Translucent Deep Plum with blur, soft border, Moon Ivory text, lavender active underline or dot.              |
| Hero             | Dark plum, soft lavender glow, warm imagery, Moon Ivory Playfair heading, small gold details. No neon purple. |
| Product cards    | Velvet or Deep Plum surface, Smoky Taupe Plum border, lavender hover border. Do not darken product photos.    |
| Primary button   | Lavender background, Midnight Aubergine text, Soft Lilac Glow hover.                                          |
| Secondary button | Transparent, Smoky Taupe Plum border, Moon Ivory text, Velvet Plum hover.                                     |
| Forms            | Deep plum fields, Smoky Taupe Plum borders, lavender focus ring.                                              |
| Drawers / modals | Dark overlay, Deep Plum panel, Velvet Plum elevated parts, lavender CTA.                                      |
| Toasts           | Muted dark success/error backgrounds, soft readable text.                                                     |
| Text over images | Always a gradient or overlay so text is readable; do not over-dim the photo (§42).                            |

## 6. Reusable Component System

Page files compose features from reusable components. They do not contain repeated card markup, button styling, form field layout, image aspect-ratio rules, or navigation logic.

**Approach:** generate shadcn/ui primitives with its CLI (do not copy the prototype's 48 unused `ui/*` files), then style them with cva variants and the semantic tokens.

### 6.1 UI Primitive Components

- Button (cva variants: primary, secondary, ghost, **luxury** (gold, sparingly), **whatsapp**), IconButton, LinkButton
- Input, Textarea, Select, Checkbox, Radio, Switch
- FormField, FieldError, FormSection
- Badge (Brand-Identity §24.4: Dusty Rose romantic labels, gold premium/limited, lavender brand), StatusBadge (D-04 statuses), PriceBadge (LKR)
- Card, ProductCard, CategoryCard, CollectionCard, FeatureCard, ShootCard
- Modal, Drawer, AlertDialog, Sheet
- Accordion, Tabs, Breadcrumbs, Pagination
- Toast, EmptyState, LoadingState, Skeleton
- Container (1440px max), Section, SectionHeader, Heading, Eyebrow
- ThemeToggle, CurrencyLabel

**Removed:** LanguageSwitch (D-15). Wishlist and Account icons are not built as placeholders (D-08).

### 6.2 Layout Components

| Component       | Responsibility                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| SiteShell       | Wraps public pages with announcement bar, header, footer, theme provider, metadata defaults, and analytics hooks.                               |
| AnnouncementBar | One short, true message (for example the real free-delivery threshold in LKR).                                                                  |
| Header          | Logo, D-08 main navigation, utility navigation: Search, ThemeToggle, Cart.                                                                      |
| MegaMenu        | Shop ▾: New In, Women, Men, Jewelry, Gifts, Couples, Collections.                                                                               |
| MobileNavDrawer | All navigation lives in the drawer on mobile, with expandable sections.                                                                         |
| Footer          | Our Story, Love Websites, Collaborate, Contact, FAQ, policies; newsletter; social links; current-year copyright. Expandable sections on mobile. |
| AdminShell      | Protected admin layout with sidebar, topbar, breadcrumbs, and action area.                                                                      |
| PageHero        | Reusable editorial hero with image, headline, subtitle, CTA group, readable overlay.                                                            |

**Primary navigation (D-08):** Shop ▾, Women, Men, Jewelry, Gifts, Couples, Custom, Portfolio. Defined only in `src/config/navigation.ts`. The mockup navigation (Collections / Couple Edit / Love Notes) is rejected as pre-pivot.

### 6.3 Commerce Components

- ProductGrid and ProductCard (no ratings, no fake "Bestseller")
- ProductGallery and ProductImageZoom placeholder
- VariantSelector for size/color/material/option selection
- QuantitySelector
- AddToCartButton
- CartDrawer and CartLineItem
- OrderSummary (no promo-code field in Phase 1)
- CheckoutForm (Sri Lanka address fields)
- CustomRequestForm
- CollaborationForm (collaboration, consultation, event invitation)
- ProductRecommendationsSection
- TrustBar and PolicySnippet (only true, owner-confirmed claims)

### 6.4 What to Take from the Prototype

| Reuse                                                                                                                                                                                                                                                              | Rewrite                                                                                                                                                                                           | Drop                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Hex values renamed to Brand-Identity tokens; section and component markup (`Btn`, `Chip`, ProductCard, AnnouncementBar, Navbar + drawer, CartDrawer, Footer, homepage sections); FAQ, Custom Order, Love Website and Contact layouts; hero copy and FAQ questions. | Routing → App Router; mock data → Prisma; cart and forms → server actions with Zod; `isDark` checks → tokens and `dark:`; images → `next/image`; add aria attributes and reduced-motion handling. | The translation table, Phase 2–4 pages, unused libraries (MUI, slick, dnd, confetti), fake content (D-10). |

## 7. PostgreSQL and Prisma Implementation Plan

The database is built in staged migrations. Five migrations and 22 models already exist (VERIFIED). Sprint 1C adds what Phase 1 still needs. Schema rules: [Database-Design.md](Database-Design.md), [Database-Standards.md](Database-Standards.md), [Database-Design-Reference.md](Database-Design-Reference.md).

Schema files live in `prisma/schema/` split by domain (ADR-0016). Every schema change, migration and seed change needs approval.

### 7.1 Phase 1 Tables: Current State

| Module               | Tables                                                                  | State                                                                                                              |
| -------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Identity             | roles, permissions, role_permissions, users, user_roles, addresses      | **Migrated.** Table-based RBAC kept (D-02 changed, ADR-0012). `users` has `password_hash` and `email_verified_at`. |
| Auth.js persistence  | accounts, sessions, verification_tokens                                 | **Not in Phase 1** (D-03, JWT sessions).                                                                           |
| Catalog              | categories, brands, collections                                         | **Migrated.**                                                                                                      |
| Products             | products, product_variants, product_images, inventory                   | **Migrated.** Products use direct `category_id` and `collection_id` FKs, not join tables.                          |
| Cart                 | carts, cart_items                                                       | **Migrated.**                                                                                                      |
| Orders               | orders, order_items                                                     | **Migrated.** Orders already hold Sri Lanka address fields (city, district, province) and `payment_method`.        |
| Payments             | payments                                                                | **Migrated.** Has `provider` and `method`.                                                                         |
| Coupons, wishlists   | coupons, coupon_redemptions, wishlists, wishlist_items                  | **Migrated, unused** until Phase 2 (ADR-0015).                                                                     |
| Custom orders        | custom_requests, custom_request_files                                   | **To add in 1C.**                                                                                                  |
| Collaboration        | collaboration_inquiries (+ files, same pattern as custom_request_files) | **To add in 1C** (D-05). Columns: Database-Design-Reference §18.                                                   |
| Support / marketing  | contact_messages, newsletter_subscribers                                | **To add in 1C.**                                                                                                  |
| Settings and content | site settings; shipping methods, FAQ, policies when their tables exist  | **To add in 1C**, then seeded (ADR-0015).                                                                          |

### 7.2 Changes Needed in Sprint 1C

- Make `products.collection_id` nullable; the neutral "Core Range" collection exists only until then (ADR-0015).
- Align status defaults with D-04: `orders.status` defaults to `pending` today, but D-04 starts orders at `inquiry_received`. `products.status` defaults to `active`; admin-created products should start as `draft`.
- D-04 lists `orders.payment_status`; the column does not exist yet. Add it, or derive it from `payments` (decide in 1C).
- Product SEO fields (SEO title, SEO description) used by the admin form are not in the schema yet.
- **OPEN (D-20):** the allowed values of `payments.method` / `orders.payment_method` (COD, bank transfer, WhatsApp).
- **OPEN (D-21):** how collections relate to categories, which decides whether `product_categories` / `collection_products` join tables replace the direct FKs.

### 7.3 Global Database Rules

- UUID primary keys with `@default(uuid()) @db.Uuid` (D-13, VERIFIED in every model).
- Money is `Decimal(12, 2)`. Never floating-point. Recalculate totals on the server.
- Explicit `currency_code` defaulting to `LKR`.
- `created_at` and `updated_at` (`timestamptz`) on every table.
- Status columns are strings. Allowed values are centralised in `src/constants/statuses.ts` and validated with Zod (D-04).
- JSON only for option snapshots, submitted personalization, gateway payloads, and preserved form submissions.
- No image binaries in PostgreSQL; store Cloudinary public IDs, secure URLs, alt text, dimensions, and ownership.
- Order items preserve product title, SKU, price, selected options, image URL, and personalization at the time of order.
- `PrismaClient` is built with `new PrismaPg(...)` from `@prisma/adapter-pg`, with the `schema` query parameter stripped from `DATABASE_URL` (ADR-0014). `src/lib/prisma.ts` reuses the pattern in `prisma/seed/client.ts`.

### 7.4 Status Vocabularies (D-04)

Phase 1 values in bold.

| Entity                                 | Values                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `products.status`                      | **draft, active, archived**                                                                     |
| `carts.status`                         | **active, converted, abandoned**                                                                |
| `orders.status`                        | **inquiry_received, pending_confirmation, confirmed, preparing, cancelled**, shipped, delivered |
| `orders.payment_status`                | **not_required, pending, paid**, failed, refunded                                               |
| `payments.provider`                    | **manual**, payhere, koko                                                                       |
| `payments.status`                      | **pending, paid**, failed, cancelled, refunded                                                  |
| `custom_requests.status`               | **new, reviewing, quoted, accepted, rejected, completed**                                       |
| `custom_requests.request_type`         | **custom_fashion, custom_jewelry, gift_box, embroidery, engraving, love_website, other**        |
| `contact_messages.status`              | **new, read, replied, archived**                                                                |
| `collaboration_inquiries.status`       | **new, reviewing, replied, accepted, declined, archived**                                       |
| `collaboration_inquiries.inquiry_type` | **collaboration, consultation, event_invitation**                                               |
| `newsletter_subscribers.status`        | **active, unsubscribed**                                                                        |
| `users.status`                         | **active, disabled**                                                                            |

### 7.5 Migration and Seed Sequence

Done (Gate A):

1. Identity, catalog, product and commerce migrations (`001`–`004`).
2. Multi-file schema (ADR-0016).
3. Idempotent seed: roles and permissions, super admin, brand, categories, collections, and `--demo` products (ADR-0015).

Sprint 1C:

4. `src/lib/prisma.ts` singleton.
5. Migration for custom requests, collaboration inquiries, contact messages, newsletter subscribers, settings.
6. Migration for the 7.2 changes once D-20 and D-21 are decided.
7. Seed shipping methods, FAQ, policies and settings once their tables exist.
8. Run `npm run db:validate`, `npm run db:migrate`, `npm run db:seed`, then check relations in Prisma Studio before building forms.

## 8. Authentication, Sessions, and Roles

Phase 1 needs **admin login only** (D-03). The public store is browsed and bought from as a guest. Authentication is built in sprint 1H, before the admin screens go live.

### 8.1 Role Model (D-02 changed, ADR-0012)

Roles are rows in `roles`, linked through `user_roles`. Permissions are named `module.action` (for example `products.manage`).

| Role          | Purpose                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `customer`    | Seeded for Phase 2 accounts. Not used for login in Phase 1.                                       |
| `editor`      | Content and media: products, portfolio, copy.                                                     |
| `admin`       | Products, images, categories, collections, orders, custom requests, inquiries, messages.          |
| `super_admin` | Manages admins, global settings and destructive operations. The first one is created by the seed. |

`staff` is not used. `user_roles.assigned_by` is required, so the first super admin assigns its own role.

### 8.2 Auth Build Steps

1. Read `node_modules/next/dist/docs/01-app/02-guides/authentication.md` and confirm Auth.js v5 behaviour with the installed version.
2. Install Auth.js (approval) and generate `AUTH_SECRET`.
3. Configure the **Credentials provider with JWT sessions**. No adapter tables.
4. Verify passwords with **bcryptjs** (cost 12, matching the seed).
5. Rate-limit the admin login and update `users.last_login_at`.
6. Create guards in `src/lib/auth/`: `getCurrentUser`, `requireRole`, `requireAdmin`, `requireSuperAdmin`. They read roles through `user_roles`.
7. **Enforce authorisation server-side (D-12)** in the `/admin` layout and inside every admin Server Action and Route Handler. In Next.js 16, Middleware is called **Proxy** (`proxy.ts`, VERIFIED in the local docs). Use it only for optimistic redirects, never as the authorisation check.
8. Build `app/(auth)` pages: admin login and auth error, plus a logout action. No public registration.
9. Test session persistence across refresh, protected-route redirects, and that a non-admin cannot reach `/admin`.

Customer accounts and Google sign-in move to Phase 2 with the adapter tables. See [Authentication.md](Authentication.md).

## 9. Image, File, and Media Handling

Cloudinary is the media source for product images, banners, custom request and collaboration reference files, and portfolio visuals. It is installed in sprint 1G. PostgreSQL stores metadata and relationships, never binaries.

### 9.1 Upload Rules

- Validate file type and size server-side before upload.
- Folders: `bv/products/{productId}`, `bv/custom-requests/{requestId}`, `bv/collaboration/{inquiryId}`, `bv/portfolio/{shootSlug}`. Separate production and development folders.
- Require useful alt text for product and marketing images.
- Store `public_id`, `secure_url`, width, height, format, alt text, sort order, `is_primary`, and the owning entity.
- Deliver through `next/image` or Cloudinary transformations.
- Do not put important text only inside images. SEO copy must be HTML text.

### 9.2 Placeholder and Asset Rules (Gate B, D-19)

Until real photography exists, curated placeholders live in `public/images/prototype/` and brand assets in `public/images/brand/`. Rules from [Visual-Asset-Inventory.md](Visual-Asset-Inventory.md) and the Implementation Plan:

- File names: `<area>-<subject>-<variant>.webp`, with an old→new mapping CSV.
- Banners: 1920×650 (web) and 1080×1080 (mobile). Product images: 4:5 at about 1200px. WebP/AVIF at quality 75–80.
- Exclude mockups, the watermarked file, and any image with wrong in-image text (for example "BEAUTY & VALUES", `$` prices, star ratings).
- No Bilesma Natural material in the repository (D-19).
- No AI-generated people presented as real people. Portfolio uses real B&V shoots only.

### 9.3 Admin Media Flow

1. Admin opens the product form.
2. Admin chooses image files and enters alt text.
3. Server validates and uploads to Cloudinary.
4. Server stores metadata in `product_images`.
5. Admin sets the primary image and sort order.
6. The product page renders the gallery ordered by `sort_order`.
7. SEO metadata uses the primary image as the Open Graph and Product schema image.

## 10. Public Storefront Build Steps

Build public pages after the design system, database models and seed data are ready. The prototype guides composition and visual direction only; production code is rebuilt with reusable components and real data.

### 10.1 Public Routes

| Route               | Purpose                                                                                             | Decision           |
| ------------------- | --------------------------------------------------------------------------------------------------- | ------------------ |
| /                   | Homepage (order in 10.2).                                                                           | Brand-Identity §23 |
| /shop               | All-product discovery landing page.                                                                 | —                  |
| /women              | Women category landing and product grid.                                                            | **OPEN (D-21)**    |
| /men                | Men category landing and product grid.                                                              | **OPEN (D-21)**    |
| /jewelry            | Jewelry category landing and product grid.                                                          | **OPEN (D-21)**    |
| /gifts              | Gift-focused landing page and collections.                                                          | **OPEN (D-21)**    |
| /couples            | Couple capsule and signature couple collections.                                                    | **OPEN (D-21)**    |
| /custom             | Custom order landing and inquiry flow.                                                              | —                  |
| /love-websites      | Love website landing (types, mockup previews, how it works, starting price or inquiry) and inquiry. | D-09               |
| /portfolio          | Visual Portfolio with filters (query parameters, not indexable).                                    | D-07               |
| /portfolio/[slug]   | Shoot detail.                                                                                       | D-07               |
| /collaborate        | Collaboration, consultation request, and event invitation forms.                                    | D-06, D-07         |
| /our-story          | Brand trust and story. Linked from footer and homepage, not the main nav.                           | D-08               |
| /contact            | Contact form and contact channel cards (WhatsApp, email).                                           | —                  |
| /faq                | Frequently asked questions.                                                                         | —                  |
| /policies/[slug]    | Delivery, returns, privacy (PDPA), terms. Texts from the owner.                                     | —                  |
| /products/[slug]    | Product detail page.                                                                                | —                  |
| /collections/[slug] | Curated product collection page.                                                                    | —                  |
| /cart               | Cart page (noindex).                                                                                | —                  |
| /checkout           | Order/inquiry checkout page (noindex).                                                              | —                  |
| /checkout/success   | Order number, next steps, WhatsApp deep link (noindex).                                             | D-17               |
| /style-guide        | Internal design preview (noindex).                                                                  | —                  |

`/visual-portfolio` from v1.0 is replaced by `/portfolio` (D-07). **OPEN (D-21):** whether category pillars stay at the root (`/women`) or move under `/shop/women`, and what "New In" means. **OPEN (D-22):** whether Phase 1 has an order tracking route.

### 10.2 Homepage Build Order (Brand-Identity §23)

Build the shared layout first (Header, MegaMenu, MobileNavDrawer, Footer), then the sections in the approved order:

1. Announcement bar
2. Navbar
3. Hero — "Style for you. Gifts for them. Moments for two." Imagery mixes solo fashion, jewelry close-ups, gift packaging and a couple moment; it never depends on one couple photo. Uses `PageHero`.
4. Featured categories: Women, Men, Jewelry, Gifts, Couples, Custom, Portfolio (`CategoryCard`).
5. New Arrivals / Limited Drop (`ProductGrid`, data from the DB).
6. Fashion Edit (women and men).
7. Jewelry Highlight.
8. Couple Collection.
9. Build Your Gift Box / Couple Box — **teaser only** in Phase 1.
10. Custom Orders.
11. Love Websites teaser.
12. Visual Portfolio preview (real shoots only).
13. Social gallery.
14. Testimonials / Memories — **hidden until real content exists** (D-10; D-23 OPEN to formalise). No "Love Notes" label.
15. Newsletter — server action, consent checkbox, duplicate-email handling, warm success message.
16. Footer.

Exit check for 1D: renders from the DB in both themes. Then run responsive QA at 360, 768, 1024, 1280 and 1536px.

Visual mood: Warm Ivory base, soft lavender identity moments, blush sections, Champagne Gold details, Playfair headings, Inter UI text, spacious layout, gentle motion.

### 10.3 Product Detail Page Requirements

- Gallery with primary image, thumbnails, alt text, and 4:5 responsive ratios.
- Title, price in LKR, sale price if any, SKU/variant information.
- Short emotional description above the fold.
- Variant selectors for size, color, material, or personalization options. Out-of-stock variants are shown as unavailable.
- Quantity selector and add-to-cart action.
- Gift readiness: packaging, message card, occasion suitability.
- Delivery, returns and payment/inquiry confidence information, using owner-confirmed values only.
- Accordions for description, material/care (verified claims only, for example 925 silver), size guide, gift packaging, delivery, FAQ.
- Related products or complete-the-look section.
- Product JSON-LD with price, currency (LKR), availability, images, brand and SKU. **No rating or review schema.**

## 11. Cart, Checkout, and Inquiry Flow

Phase 1 uses a stable inquiry-friendly flow with **manual payment confirmation and WhatsApp** (D-17), not automated payments. Order snapshots protect history from catalog changes.

### 11.1 Cart Flow

1. User opens a product page and selects a variant/options.
2. User clicks Add to Cart.
3. Server action validates product status, variant availability, quantity, and options with Zod.
4. If no active cart exists, create one for the anonymous session (customers are guests in Phase 1).
5. Create or update `cart_items` with the selected-option snapshot.
6. Open `CartDrawer` with items, subtotal and checkout CTA.
7. Allow quantity update, remove item, and continue shopping.
8. Persist the cart in the database; mirror only the item count in client state.

### 11.2 Checkout / Inquiry Flow

1. User proceeds to checkout.
2. The form collects name, email, phone, Sri Lanka delivery address (address lines, **city, district, province**, optional postal code), notes, preferred contact method, gift options, and consent. The full field spec comes from the Gate B UX spec.
3. Server validates with Zod.
4. Server recalculates totals from the database, including the delivery fee from the owner's fee table. Client values are never trusted.
5. In one transaction:
   - Create the `orders` row with status **`inquiry_received`**.
   - Create `order_items` snapshots (title, variant title, SKU, unit price, quantity, options, personalization, image URL).
   - Create a `payments` row with **`provider = manual`** and status `pending`.
   - Mark the cart `converted`.
6. Show the success page with the order number, next steps, and a **WhatsApp deep link** to confirm.
7. The order appears in the admin inbox. Email notification is a placeholder.

**OPEN (D-20):** which payment methods checkout offers (COD, bank transfer, WhatsApp) and the values stored in `payments.method`. **OPEN (D-22):** order tracking in Phase 1. Not in Phase 1: promo-code field (coupons are Phase 2), card/PayPal/Apple Pay, PayHere/KOKO.

Vitest is added in this sprint (D-18) to cover price calculation, Zod schemas and snapshot building.

### 11.3 Statuses

Use the D-04 vocabularies in Section 7.4. Do not invent new values; add them to `src/constants/statuses.ts` and the decision record first.

## 12. Custom Orders and Contact Flows

Custom orders are a Phase 1 differentiator: custom fashion, jewelry, gift boxes, embroidery, engraving, personalized notes, and love website inquiries. Collect structured information without making the flow long.

### 12.1 Custom Order Form Fields

| Field Group         | Fields                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Customer            | Name, email, phone, preferred contact method.                                                              |
| Request Type        | `custom_fashion`, `custom_jewelry`, `gift_box`, `embroidery`, `engraving`, `love_website`, `other` (D-04). |
| Occasion            | Birthday, anniversary, engagement, wedding, self-love, date night, other.                                  |
| Budget and timeline | Approximate budget (LKR), needed date, urgency.                                                            |
| Details             | Description, size/color/material preferences, message text, personalization details.                       |
| Reference files     | Images or documents uploaded through Cloudinary and linked to `custom_request_files`.                      |

The `/love-websites` inquiry uses the same table with `request_type = love_website` (D-09).

### 12.2 Contact and Newsletter

- Contact form validates name, email/phone, subject, message, and optional category.
- Contact messages appear in admin with `new`, `read`, `replied`, `archived`.
- Collaboration inquiries do **not** go into `contact_messages` (D-05); see Section 13.
- Newsletter signup requires consent, normalizes email to lowercase, and prevents duplicate active subscriptions.
- The newsletter success message is warm and premium, not generic.
- Never expose raw database errors in public forms.

## 13. Visual Portfolio and Collaboration Hub

The hub positions Buwi and Vila as **models, lifestyle creators and approachable creative collaborators**, never as a photography service (Brand-Identity §42). In Phase 1 it is a polished set of pages plus inquiry forms, not a booking platform.

### 13.1 Routes (D-07)

- `/portfolio` — page title "Visual Portfolio", with filters. Filter state uses query parameters, is not indexable, and canonicalises to `/portfolio`.
- `/portfolio/[slug]` — shoot detail; indexable when it has real context text.
- `/collaborate` — collaboration, consultation request, and event invitation forms.

### 13.2 Page Sections

1. Hero: premium romantic lifestyle visuals and collaboration positioning.
2. Collaboration style: modeling, lifestyle content, brand campaigns, event invitations, product shoots, restaurant/café features, fashion and jewelry campaigns.
3. Portfolio grid: shoots grouped by project. Each `ShootCard` has a cover image, title, featured type (Couple, Buwi or Vila), category tags, media count, short description and a "View Shoot" CTA.
4. Shoot detail: editorial masonry for photos; video cards with a play icon, duration and type label (Campaign Reel, Behind the Scenes, Product Promo, Cinematic Clip, Outfit Reel, Couple Reel).
5. Collaboration types and CTAs: "Work With Us", "Start a Collaboration", "Book a Creative Consultation", "Invite B&V to Your Event".
6. Tone: humble, professional, creative, approachable; not celebrity-like or photography-service-like.

### 13.3 Data and Forms (D-05, D-06)

- **Shoots and media** are static typed data in `src/data/portfolio/`, with media on Cloudinary. `shoots` / `shoot_media` tables (or Sanity) come in Phase 2.
- **Inquiries** go into one `collaboration_inquiries` table with `inquiry_type` = `collaboration`, `consultation` or `event_invitation`. Reference uploads follow the `custom_request_files` pattern.
- Collaboration form: brand name, contact person, email, phone, collaboration type, date, location, budget range, description, reference links.
- **Consultation is a request form only (D-06):** meeting type, mode (online or in person), preferred date and preferred time. No calendar, slot availability or payment. The success screen offers a WhatsApp confirmation link; the admin confirms manually.
- Event invitation: the same request pattern with event details.
- Every image is real B&V work. AI images are prototype placeholders only and never published as portfolio work.
- Internal links from the homepage, footer and Our Story.

## 14. Admin Dashboard MVP

Admin is functional and practical. It uses the brand tokens and a clean layout but does not need to look like the storefront. The team must be able to run the Phase 1 store without editing the database directly.

### 14.1 Admin Routes

| Route                          | Purpose                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| /admin                         | Dashboard overview with stats and recent activity.                      |
| /admin/products                | Product list, filters, status, edit/archive actions.                    |
| /admin/products/new            | Create product with variants, images, category, collection, SEO fields. |
| /admin/categories              | Manage navigation/filter categories.                                    |
| /admin/collections             | Manage curated collections and product ordering.                        |
| /admin/orders                  | View order inquiries and change status (D-04).                          |
| /admin/custom-requests         | View and update custom requests, including love website inquiries.      |
| /admin/collaboration-inquiries | View collaboration, consultation and event invitation requests (D-05).  |
| /admin/contact-messages        | Read and manage contact messages.                                       |
| /admin/newsletter              | Subscriber list and export.                                             |
| /admin/media                   | Optional media browser for uploaded images.                             |
| /admin/settings                | Basic brand/site settings (`super_admin`).                              |

Every route and action is guarded server-side (D-12). Destructive and settings actions need `super_admin`.

### 14.2 Admin Product CRUD Steps

1. Product list with status filter, search, category filter and pagination.
2. Product form schema with Zod.
3. Core fields: name, slug, description, short description, status (new products start as `draft`), category, brand, collection, featured flag, SEO title, SEO description (schema columns added in 1C).
4. Variants: SKU, price, sale price, stock or availability status, option values.
5. Category and collection assignment (shape depends on D-21).
6. Image upload, alt text, primary image and sort order.
7. Save product and variants in one transaction.
8. Preview the product page after save.
9. Archive instead of hard delete for products linked to past orders.

### 14.3 Admin Dashboard Cards

- Total products and active products.
- Draft products.
- New orders/inquiries.
- New custom requests.
- New collaboration inquiries.
- Unread contact messages.
- Newsletter subscribers.
- Low-stock or unavailable variants.
- Recent orders and recent custom requests.

## 15. SEO and Metadata Implementation

SEO is part of Phase 1 development, not a final polish task (ADR-0008). Every public template has metadata, a canonical URL, Open Graph preview, one clear H1, image alt text, and structured data where relevant. Source: [SEO-Guide.md](SEO-Guide.md) v3.0.

### 15.1 SEO Files to Build Early

```text
src/config/seo.ts
src/lib/seo/metadata.ts
src/lib/seo/jsonld.ts
src/lib/seo/canonical.ts
app/sitemap.ts
app/robots.ts
```

### 15.2 Metadata Rules

- Every public page has a unique title and useful meta description.
- Title template supports brand and page intent, for example: Lavender Initial Necklace | B&V.
- Canonical URLs point to the preferred public URL and ignore tracking and filter parameters.
- Open Graph and Twitter images for the homepage, categories, collections, products and portfolio shoots.
- Cart, checkout, success, admin, auth, `/style-guide` and utility pages are noindex or protected.
- Product pages have Product/Offer JSON-LD when data is available.
- Category and collection pages include CollectionPage and BreadcrumbList JSON-LD where useful.
- **No review or rating schema** until real reviews exist (D-10).

### 15.3 SEO-Friendly URL Structure

| Page Type        | Route Pattern                                                      |
| ---------------- | ------------------------------------------------------------------ |
| Homepage         | /                                                                  |
| Shop             | /shop                                                              |
| Core Category    | /women, /men, /jewelry, /gifts, /couples (**OPEN, D-21**), /custom |
| Love Websites    | /love-websites                                                     |
| Visual Portfolio | /portfolio, /portfolio/[slug]                                      |
| Collaborate      | /collaborate                                                       |
| Product          | /products/[slug]                                                   |
| Collection       | /collections/[slug]                                                |
| Policy           | /policies/[slug]                                                   |
| Journal          | /journal/[slug] (Phase 2, Sanity)                                  |

Nothing has been published yet, so no redirects are needed for the v1.0 → v2.0 route changes.

### 15.4 Pre-Launch SEO QA

- Sitemap includes canonical public pages only.
- robots.txt blocks admin, auth, cart, checkout and utility routes.
- Each page has one H1.
- Meaningful images have alt text.
- Product JSON-LD validates with LKR price and availability.
- Breadcrumbs work and their schema validates.
- No duplicate metadata or conflicting head tags.
- Lighthouse ≥ 90 and PageSpeed checked.
- Meta SEO Inspector verifies title, description, canonical, robots, Open Graph, Twitter, H1 and schema.
- Search Console and GA4 are set up, behind cookie consent.

## 16. Language Handling (D-15)

**English only at launch.**

- No language switch until Sinhala and Tamil translations exist with locale routes and hreflang (SEO Guide §13).
- No `src/i18n/` dictionaries in Phase 1. Centralise UI strings only where it is cheap (for example status labels in `src/constants/statuses.ts`).
- Never index translated routes until real translations and hreflang exist.
- The prototype's translation table is dropped.

## 17. Responsiveness, Accessibility, and Performance

The app is mobile-first. The prototype is desktop-rich, but every page must work on small devices first, then scale up.

### 17.1 Responsive Breakpoint QA

| Width   | What to Verify                                                                           |
| ------- | ---------------------------------------------------------------------------------------- |
| 360px   | Mobile header, drawer, hero stacking, product cards, cart drawer, forms, sticky buttons. |
| 768px   | Tablet grids, category sections, product detail layout, footer sections.                 |
| 1024px  | Laptop navigation, product grid density, admin table layout.                             |
| 1280px  | Desktop spacing, hero proportions, mega menu, marketing sections.                        |
| 1536px+ | 1440px container holds, image quality, no excessive stretching.                          |

### 17.2 Accessibility Rules

- Semantic HTML: header, nav, main, section, footer, form, button.
- Buttons are real buttons; links are real links.
- Keyboard navigation works for header, mega menu, drawers, modals, forms and admin actions.
- Focus states are visible in both themes (lavender focus ring).
- Text contrast is checked in both themes. Lavender and gold are never used as small text without the contrast-safe variants (5.4).
- Forms have labels, errors, helper text and aria attributes where needed.
- Meaningful images have alt text; decorative images use empty alt.
- Text over images always has an overlay.
- Motion is subtle, never blocks use, and respects `prefers-reduced-motion`.

### 17.3 Performance Rules

- Server Components by default; Client Components only for interactivity.
- `next/image` or Cloudinary-optimised images; no unoptimised source PNGs (the library averages about 1.8 MB per image).
- Keep Framer Motion out of static sections.
- Paginate or lazy-load large product grids.
- Cache safe read queries where appropriate.
- No large client-side global state for catalog data.
- Measure Core Web Vitals before launch.

## 18. Testing and QA Gates

Testing is built into every sprint. **Every sprint must pass `npm run lint`, `npm run typecheck` and `npm run build` before it is ticked.**

### 18.1 Automated Checks

| Check                                   | When                  |
| --------------------------------------- | --------------------- |
| `npm run lint`                          | Every sprint (exists) |
| `npm run typecheck`                     | Every sprint (exists) |
| `npm run build`                         | Every sprint (exists) |
| `npm run db:validate`, migration review | Every schema change   |
| `npm run test` (Vitest)                 | From sprint 1F (D-18) |
| GitHub Actions: lint, typecheck, build  | Sprint 1I (D-01)      |
| Playwright smoke and E2E tests          | Phase 2 (D-18)        |

### 18.2 Manual User Flow QA

| Flow                  | Acceptance Criteria                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Browse homepage       | Loads fast, correct tone, header/footer work, theme toggle saves, mobile layout clean, no fake content.                      |
| Browse category       | Correct products, filters/sorting do not break, metadata exists.                                                             |
| View product          | Images, variants, LKR price, description, accordions, add-to-cart, related products work.                                    |
| Cart                  | Add, update quantity, remove, subtotal, drawer and page work.                                                                |
| Checkout              | Validation, `inquiry_received` order, item snapshots, manual payment row, success page with WhatsApp link, admin visibility. |
| Custom request        | Submission, file upload, admin visibility, statuses.                                                                         |
| Collaboration inquiry | All three inquiry types save, admin visibility, WhatsApp link on consultation success.                                       |
| Admin                 | Only an admin reaches `/admin`; create/edit/archive product, upload images, assign category/collection.                      |
| SEO                   | Metadata, canonical, robots, sitemap, schema, alt text, Lighthouse ≥ 90.                                                     |

## 19. CI and Deployment Design

**Changed (D-01, ADR-0011).** Phase 1 deploys to **Vercel** with a **managed PostgreSQL** provider (Neon, Supabase or Railway Postgres, chosen in sprint 1I). The v1.0 Jenkins + Docker image + VPS pipeline is **deferred** unless B&V moves to self-hosting; Railway is the natural next step if cost or connection limits become a problem.

### 19.1 Pipeline

1. Push to GitHub.
2. GitHub Actions: `npm ci`, `npm run lint`, `npm run typecheck`, `npm run db:generate`, `npm run build` (and `npm run test` once Vitest exists).
3. Vercel builds preview deployments for branches and the production deployment for `main`.
4. Run `prisma migrate deploy` against production as a controlled step (approval required).
5. Health check against the deployed URL (`app/api/health`).
6. Notify success or failure.

### 19.2 Production Environment Requirements

- Production env values in Vercel, never in Git.
- **Pooled** `DATABASE_URL` for serverless connection limits.
- Managed PostgreSQL with backups.
- Separate Cloudinary production folder.
- `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL` set for the production domain.
- HTTPS and CDN through Vercel.
- Migration and rollback plan.
- Health endpoint, error logging and basic monitoring.
- GA4 and Search Console behind cookie consent.

## 20. Sprint-by-Sprint Execution Plan

The schedule, deliverables, exit checks and approvals are maintained in [Implementation-Plan.md](Implementation-Plan.md); live status is in [../governance/PLAN.md](../governance/PLAN.md). This table maps the v1.0 sprints to the current plan and to the sections of this guide.

| Plan   | v1.0 sprint | Focus                                                                                        | Guide sections   | Status (2026-10-28)            |
| ------ | ----------- | -------------------------------------------------------------------------------------------- | ---------------- | ------------------------------ |
| Gate A | —           | Decisions, env, seed, schema split                                                           | 3, 4, 7          | Done                           |
| Gate B | —           | Spec sync: Brand-Identity gaps, D-20 to D-23, UX spec, business content, assets              | 5.4, 9.2, 10, 11 | Next                           |
| 1A     | S0          | `src/` folders, config files, `@/` alias                                                     | 3                | Not started                    |
| 1B     | S1          | Tokens, fonts, theme toggle, shadcn primitives, header/footer, `/style-guide`                | 5, 6             | Not started                    |
| 1C     | S2          | Schema additions, `src/lib/prisma.ts`, seeds                                                 | 7                | Partial (22 models, seed done) |
| 1D     | S3          | Homepage                                                                                     | 10.2             | Not started                    |
| 1E     | S4          | Shop, categories, collections, PDP                                                           | 10.1, 10.3, 15   | Not started                    |
| 1F     | S5          | Cart, checkout inquiry, Vitest                                                               | 11               | Not started                    |
| 1G     | S6          | Custom, Love Websites, Contact, Our Story, FAQ, policies, Portfolio, Collaborate, Cloudinary | 9, 12, 13        | Not started                    |
| 1H     | S7          | Auth.js admin login, guards, admin screens                                                   | 8, 14            | Not started                    |
| 1I     | S8          | SEO files, QA, CI, Vercel, GA4                                                               | 15, 17, 18, 19   | Not started                    |

Do not jump into page polish before the foundation, components, data model and admin workflows are stable.

## 21. Phase 2 Parking Lot

These should not block the Phase 1 launch unless a business decision changes the MVP scope.

| Feature                                      | Reason to Wait                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Customer accounts, Google sign-in            | Admin-only auth in Phase 1 (D-03); needs the Auth.js adapter tables.           |
| Wishlist, coupons                            | Tables exist but stay unused (ADR-0015); need account and campaign UX.         |
| Saved addresses                              | Useful after customer accounts.                                                |
| Order tracking dashboard                     | After the order lifecycle and shipment statuses mature (D-22 decides Phase 1). |
| Reviews, testimonials, memories              | Need real customers and moderation rules (D-10).                               |
| Gift box builder                             | Needs a product/box combination model and UX testing; teaser only in Phase 1.  |
| PayHere / KOKO, webhooks, refunds            | Follow once sandbox credentials exist (D-17).                                  |
| Sanity: journal, lookbook, portfolio editing | Deferred (D-16).                                                               |
| Shoots / shoot media tables                  | Static portfolio data until admin editing is needed (D-05).                    |
| Search results page                          | After catalog size justifies it.                                               |
| Playwright E2E                               | After the core flows are stable (D-18).                                        |
| Multilingual routes                          | Need real translations and hreflang (D-15).                                    |
| AI gift finder / stylist                     | Needs mature catalog and analytics data (Phase 3).                             |

## 22. Final Acceptance Checklist

### 22.1 Development Foundation

- The project runs locally with native PostgreSQL and `npm run db:setup`.
- ESLint, Prettier, typecheck, build and tests pass.
- `app/` at the root, shared code in `src/`, `@/` alias resolves.
- Environment variables are documented in `.env.example`.
- Prisma migrations and seed scripts work from scratch and are idempotent.

### 22.2 Design System

- All colours use semantic tokens from `app/globals.css`; no raw hex in components.
- Light (Lavender Luxury Romance) and dark (Midnight Lavender Luxury) themes are intentional, and the toggle saves the choice.
- Contrast passes in both themes, using the contrast-safe lavender and gold variants for text.
- Typography uses Playfair Display (display) and Inter (UI) correctly.
- Buttons use medium radius; shadows are soft; motion respects reduced motion.
- Reusable components are used instead of repeated page markup.
- Header, footer, drawer, buttons, forms, cards and product cards work across breakpoints.

### 22.3 Storefront

- The homepage follows the Brand-Identity §23 order and communicates the modern romantic lifestyle brand.
- Navigation matches D-08: Women, Men, Jewelry, Gifts, Couples, Custom and Portfolio are visible; Our Story, Love Websites and Collaborate are in the footer.
- Product listing and detail pages use database data with LKR prices.
- Cart and checkout create an `inquiry_received` order, item snapshots and a manual payment row, and show a WhatsApp link.
- Custom requests, collaboration inquiries and contact messages are captured and visible to admin.
- No D-10 violations: no fake ratings, testimonials, stats, warranty claims or foreign currency.

### 22.4 Admin

- Admin is protected server-side by Auth.js and RBAC roles.
- Admin can create, edit and archive products.
- Admin can upload product images and manage alt text.
- Admin can manage categories and collections.
- Admin can view and update orders, custom requests, collaboration inquiries, contact messages and newsletter subscribers.

### 22.5 SEO, Performance, and Deployment

- Sitemap and robots are implemented.
- Each public page has metadata, canonical URL, Open Graph data and one clear H1.
- Product pages include valid Product schema.
- Cart, checkout, admin, auth and utility pages are noindex or protected.
- Lighthouse ≥ 90, accessibility, mobile and dark mode QA are complete.
- GitHub Actions passes and the site is live on Vercel with a pooled managed database.

### 22.6 Launch Criteria (Implementation Plan)

- Gate B business content is in place (WhatsApp, email, domain, socials, delivery fees, returns policy, verified material claims).
- Real logo and real Our Story / Portfolio photos.
- No AI-generated people presented as real.
- Placeholder images replaced or clearly product-only.

## 23. Changes from v1.0

| Area             | v1.0                                                             | v2.0                                                                                                                                 | Source              |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| Hosting          | Docker image, Jenkins, VPS                                       | Vercel + managed PostgreSQL + GitHub Actions; Jenkins deferred                                                                       | D-01, ADR-0011      |
| Local database   | Docker Compose PostgreSQL + pgAdmin                              | Native PostgreSQL 16 + pgAdmin 4                                                                                                     | ADR-0010            |
| Roles            | `CUSTOMER`/`ADMIN`/`SUPER_ADMIN`/`EDITOR` concept                | Table-based RBAC; lowercase roles via `user_roles`                                                                                   | D-02, ADR-0012      |
| Auth             | Admin + optional customer/Google, adapter tables                 | Admin only, Credentials + JWT, bcryptjs; customers are guests                                                                        | D-03                |
| Statuses         | Suggested list                                                   | Unified D-04 vocabularies in one constants module                                                                                    | D-04                |
| Portfolio        | `/visual-portfolio`, contact_messages or new table               | `/portfolio`, `/portfolio/[slug]`, `/collaborate`; static shoots; `collaboration_inquiries`                                          | D-05 to D-07        |
| Consultation     | Not in sprints                                                   | Request form only, WhatsApp confirmation                                                                                             | D-06                |
| Navigation       | Shop, Women, Men, Jewelry, Gifts, Couples, Custom, Love Websites | D-08 main nav with Portfolio; Our Story, Love Websites, Collaborate in footer; no wishlist/account placeholders                      | D-08                |
| Love Websites    | Landing                                                          | Landing + `love_website` custom request; builder Phase 3                                                                             | D-09                |
| Content          | —                                                                | LKR, Sri Lanka only, no fake ratings/testimonials/claims                                                                             | D-10                |
| Tailwind         | `tailwind.config.ts`                                             | Tailwind v4 CSS-first tokens in `app/globals.css`                                                                                    | D-11                |
| Route protection | "Create middleware"                                              | Server-side guards; `proxy.ts` only for optimistic redirects                                                                         | D-12                |
| Folder layout    | `src/app/`                                                       | `app/` at root, shared code in `src/`                                                                                                | D-14                |
| Language         | Dictionaries for en/si/ta                                        | English only, no switch                                                                                                              | D-15                |
| CMS              | Sanity in stack                                                  | Deferred to Phase 2                                                                                                                  | D-16                |
| Payments         | PayHere/KOKO in stack                                            | Manual + WhatsApp; PayHere/KOKO Phase 2                                                                                              | D-17                |
| Tests            | lint/typecheck/test assumed                                      | `typecheck` exists; Vitest in 1F; Playwright Phase 2                                                                                 | D-18                |
| Assets           | —                                                                | No Bilesma Natural material; naming and crop rules                                                                                   | D-19                |
| Prisma           | Single `schema.prisma`                                           | Prisma 7.8.0 pinned, `@prisma/adapter-pg`, schema split by domain, idempotent seed                                                   | ADR-0014 to 0016    |
| Design           | Token tables only                                                | Full Brand-Identity v1.2 token set, foregrounds, shape/motion rules, dark component rules, homepage order §23, portfolio imagery §42 | Brand-Identity v1.2 |
| Sprints          | S0–S8                                                            | Mapped to Gate A, Gate B and sprints 1A–1I                                                                                           | Implementation-Plan |

**Still OPEN (Gate B):** D-20 payment methods, D-21 category URL scheme and collection/category relationship, D-22 order tracking, D-23 hiding testimonials, plus the Brand-Identity gaps in 5.4 and the Phase-1-UX-Spec.

## Source Context Used

| Source Document                                                                                                                                        | How It Was Used                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Phase-Development.md](Phase-Development.md)                                                                                                           | Phase 1 scope, page list, portfolio hub, phase gate.                                                                                              |
| [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md)                                                                                     | D-01 to D-19 applied throughout; wins over older references.                                                                                      |
| [../decisions/DECISIONS.md](../decisions/DECISIONS.md)                                                                                                 | ADR-0010 to ADR-0016: local database, hosting, RBAC, Prisma adapter, seeding, schema split.                                                       |
| [Implementation-Plan.md](Implementation-Plan.md)                                                                                                       | Gate A/B, sprints 1A–1I, prototype reuse/rewrite/drop, asset rules, launch criteria.                                                              |
| [Brand-Identity.md](Brand-Identity.md) v1.2                                                                                                            | Tokens (§41.6), colour balance, typography, components (§24), motion, dark rules, homepage order (§23), portfolio rules (§42), Tailwind v4 (§43). |
| [Database-Design-Reference.md](Database-Design-Reference.md), [Database-Design.md](Database-Design.md), [Database-Standards.md](Database-Standards.md) | Tables, data types, snapshot rules, Prisma conventions.                                                                                           |
| [SEO-Guide.md](SEO-Guide.md) v3.0                                                                                                                      | Routes, metadata, structured data, facet handling, pre-launch QA.                                                                                 |
| [Authentication.md](Authentication.md), [Hosting_Deployment.md](Hosting_Deployment.md)                                                                 | Auth and hosting background (D-01, D-03).                                                                                                         |
| [Technology-Stack.md](Technology-Stack.md)                                                                                                             | Installed and planned libraries.                                                                                                                  |
| Prototype visuals and image library                                                                                                                    | Visual tone and composition only (D-10).                                                                                                          |

**Final working rule.** For every new idea, page, feature or design decision, ask whether it helps B&V become a premium romantic lifestyle ecommerce brand, supports the Phase 1 launch, can be built cleanly with reusable Next.js components, follows the lavender-led visual identity, respects the accepted decisions, and can scale into Phase 2 without rewriting.
