# B&V Phase 1 Reconciled Decisions

| Field   | Value                                                                            |
| ------- | -------------------------------------------------------------------------------- |
| Version | 1.0                                                                              |
| Status  | **PROPOSED** — each decision needs owner approval before it becomes an ADR       |
| Created | 2026-10-28                                                                       |
| Owner   | B&V project owner                                                                |
| Purpose | Resolve conflicts between the reference documents so agents do not have to guess |

## How to Use This Document

The reference library was written over several months. Several documents disagree on Phase 1 details. Each decision below records the conflict, the options, and a recommendation.

When a decision is approved:

1. Change its status here to **ACCEPTED** (or **REJECTED** / **CHANGED**, with the final choice).
2. Add a matching ADR to `docs/governance/DECISIONS.md`, continuing from ADR-0010.
3. Append a `docs/AI_SESSION_LOG.md` entry.

Until then, an agent that meets one of these topics must stop and ask rather than pick an option.

Status key: **PROPOSED** (awaiting approval), **VERIFIED** (already true in the repository), **ACCEPTED**, **REJECTED**, **CHANGED**.

## Summary

| ID   | Topic                          | Recommendation                                                                                        | Blocks                        |
| ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------- |
| D-01 | Hosting and deployment         | Vercel + managed PostgreSQL for Phase 1; GitHub Actions CI; Jenkins deferred                          | Deployment, env setup         |
| D-02 | User roles                     | `users.role` string: customer, editor, admin, super_admin; RBAC tables deferred                       | Identity schema, admin guards |
| D-03 | Auth scope and tables          | Auth.js Credentials + JWT for admin only; Auth.js DB tables stay Phase 2                              | Identity schema               |
| D-04 | Status vocabularies            | One unified list per entity (below)                                                                   | Orders, payments schema       |
| D-05 | Portfolio data model           | Static typed shoot data + one `collaboration_inquiries` table                                         | Portfolio sprint              |
| D-06 | Consultation booking scope     | Request form only (preferred date/time), no availability engine                                       | Portfolio sprint, phase gate  |
| D-07 | Portfolio routes               | `/portfolio`, `/portfolio/[slug]`, `/collaborate`                                                     | Routes config, SEO            |
| D-08 | Primary navigation             | Shop / Women / Men / Jewelry / Gifts / Couples / Custom / Portfolio, with Our Story in utility/footer | Header build                  |
| D-09 | Love Websites scope            | Landing + inquiry in Phase 1; builder Phase 3                                                         | Custom request types          |
| D-10 | Prototype placeholder content  | LKR, real payment methods, no fake ratings/stats                                                      | All storefront UI             |
| D-11 | Tailwind configuration         | Tailwind v4 CSS-first tokens in `globals.css`                                                         | **VERIFIED** (ADR-0003)       |
| D-12 | Route protection in Next.js 16 | Server-side guards in layouts/actions; check local docs for the middleware/proxy file                 | Admin build                   |
| D-13 | UUID generation                | Prisma `@default(uuid())` with `@db.Uuid`                                                             | First domain migration        |
| D-14 | Source folder layout           | Keep `app/` at root; shared code in `src/` with the `@/` alias                                        | Every code task               |
| D-15 | Language handling              | English only at launch; no language switch until translations exist                                   | Header build                  |
| D-16 | Sanity CMS                     | Deferred to Phase 2                                                                                   | —                             |
| D-17 | Payments                       | Inquiry + manual confirmation + WhatsApp at launch; PayHere/KOKO next                                 | Checkout                      |
| D-18 | Test tooling                   | Add `typecheck` script now; Vitest + Playwright when approved                                         | QA gates                      |
| D-19 | Non-B&V assets                 | Exclude Bilesma Natural material from the repository                                                  | Asset import                  |

---

## D-01 — Hosting and Deployment

**Conflict.** The Technology Stack says Vercel now and Railway later. The Phase 1 Step-by-Step guide designs a Jenkins pipeline that builds Docker images and deploys them to a server. `docs/governance/PLAN.md` puts CI/CD in the backlog.

| Option                                                                                                               | Advantages                                                                                     | Disadvantages                                                                                    |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| A. Vercel (app) + managed PostgreSQL (Neon, Supabase, or Railway Postgres) + GitHub Actions for lint/typecheck/build | Native Next.js hosting, preview deployments, HTTPS and CDN included, almost no operations work | Serverless connection limits require a pooled database URL; usage-based cost; vendor coupling    |
| B. Docker image on a VPS, Jenkins pipeline, nginx                                                                    | Full control; matches the Phase 1 guide                                                        | A server and a Jenkins instance to maintain, plus TLS, backups, and monitoring. Heavy for an MVP |
| C. Railway for both app and database                                                                                 | One vendor, Docker-friendly, matches the "future scaling" note                                 | Less Next.js-specific optimisation than Vercel                                                   |

**Recommendation: A.** Keep Docker Compose for local development (already working). Defer Jenkins unless B&V moves to self-hosting. Reconsider if hosting cost or database connection limits become a problem; Railway (C) is the natural next step.

**Status:** PROPOSED.

## D-02 — User Roles

**Conflict.** The Database Design Reference uses `customer`, `admin`, `staff`. The Phase 1 guide uses `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`, `EDITOR`. The BaseModel Convention gives `Role`/`Permission` table examples.

**Recommendation.** A single `role` column on `users` (`varchar(30)`) with the values `customer` (default), `editor`, `admin`, and `super_admin`. Lowercase strings, consistent with the string-status rule. Guard helpers `requireRole`, `requireAdmin`, and `requireSuperAdmin` live in `src/lib/auth/`. Table-based RBAC (`roles`, `permissions`, `role_permissions`) arrives in Phase 3 together with `admin_activity_logs`. `staff` is dropped: `editor` covers content staff.

**Status:** PROPOSED.

## D-03 — Auth Scope and Auth.js Tables

**Conflict.** The Database Design Reference places `accounts`, `sessions`, and `verification_tokens` in Phase 2. The Phase 1 guide brings them forward "if login or Google sign-in is required".

**Recommendation.**

- Phase 1 needs **admin login only**. Customers check out as guests.
- Use the Auth.js Credentials provider with **JWT sessions**. The Credentials provider is designed around JWT sessions, so the database adapter tables are not required.
- Add `password_hash` (nullable) and `email_verified_at` to `users`. Hash passwords with a maintained algorithm (Argon2id or bcrypt).
- Create the first `super_admin` through an approved seed script, never through a public route.
- Rate-limit the admin login.
- Customer accounts and Google sign-in, with the adapter tables, move to Phase 2.

Reconsider if customer Google sign-in becomes a launch requirement.

**Status:** PROPOSED. Confirm the exact Auth.js v5 behaviour with the installed version.

## D-04 — Unified Status Vocabularies

| Entity                           | Values (Phase 1 subset in bold)                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `products.status`                | **draft, active, archived**                                                                     |
| `carts.status`                   | **active, converted, abandoned**                                                                |
| `orders.status`                  | **inquiry_received, pending_confirmation, confirmed, preparing, cancelled**, shipped, delivered |
| `orders.payment_status`          | **not_required, pending, paid**, failed, refunded                                               |
| `payments.provider`              | **manual**, payhere, koko                                                                       |
| `payments.status`                | **pending, paid**, failed, cancelled, refunded                                                  |
| `custom_requests.status`         | **new, reviewing, quoted, accepted, rejected, completed**                                       |
| `custom_requests.request_type`   | **custom_fashion, custom_jewelry, gift_box, embroidery, engraving, love_website, other**        |
| `contact_messages.status`        | **new, read, replied, archived**                                                                |
| `collaboration_inquiries.status` | **new, reviewing, replied, accepted, declined, archived**                                       |
| `newsletter_subscribers.status`  | **active, unsubscribed**                                                                        |
| `users.status`                   | **active, disabled** (deleted = soft state)                                                     |

This supersedes Section 10 of the Database Design Reference for these entities. Keep them as strings and centralise the allowed values in one TypeScript constants module, validated with Zod.

**Status:** PROPOSED.

## D-05 — Visual Portfolio Data Model

**Conflict.** The Phase Development Reference defines five models (Shoot, ShootMedia, CollaborationInquiry, ConsultationBooking, EventInvitation). The Database Design Reference has none of them. The Phase 1 guide suggests reusing `contact_messages` or adding `collaboration_requests`.

**Recommendation.**

- **Shoots and media:** static typed data in `src/data/portfolio/` in Phase 1, with media on Cloudinary. This follows the Phase Development rule to start static. `shoots` and `shoot_media` tables (or Sanity documents) arrive when shoots need admin editing (Phase 2).
- **Inquiries:** one `collaboration_inquiries` table with `inquiry_type` set to `collaboration`, `consultation`, or `event_invitation`. The full column list is in Section 18 of the Database Design Reference. Reference uploads follow the `custom_request_files` pattern.
- Do not store collaboration inquiries in `contact_messages`. They have structured fields the admin will want to filter.

**Status:** PROPOSED.

## D-06 — Creative Consultation Booking Scope

**Conflict.** The Phase Gate in the Phase Development Reference requires a consultation booking flow and an event invitation flow in Phase 1. The Phase 1 guide's sprints do not include them, and the same reference says not to build availability logic in Phase 1.

**Recommendation.** Phase 1 delivers both as **request forms**. The consultation form collects meeting type, mode (online or in person), preferred date, and preferred time. The success screen offers a WhatsApp confirmation link. The admin confirms manually. There is no calendar, slot availability, or payment. Add both forms to Sprint 6 and update the phase gate wording to "consultation request flow".

**Status:** PROPOSED.

## D-07 — Portfolio Routes

**Conflict.** The Phase 1 guide uses `/visual-portfolio`. SEO Guide v3.0 uses `/portfolio` and a separate `/collaborate`.

**Recommendation.** Follow the newer SEO Guide:

- `/portfolio` — page title "Visual Portfolio", with filters
- `/portfolio/[slug]` — shoot detail; indexable when it has real context text
- `/collaborate` — collaboration, consultation, and event invitation forms

Filter state uses query parameters, which are not indexable and canonicalise to `/portfolio`. Nothing has been published, so no redirects are needed.

**Status:** PROPOSED.

## D-08 — Primary Navigation

**Conflict.** There are four versions: Phase Development (Shop / Women / Men / Jewelry / Gifts / Portfolio / Custom / Our Story), its alternative with Couples, Business Strategy (adds New In), and the Figma mockups (Shop / Collections / Gifts / Couple Edit / Our Story / Love Notes).

**Recommendation.**

- **Main navigation:** Shop ▾ (mega menu: New In, Women, Men, Jewelry, Gifts, Couples, Collections), Women, Men, Jewelry, Gifts, Couples, Custom, Portfolio.
- **Utility navigation:** Search, Theme toggle, Cart. Wishlist and Account are hidden until Phase 2 rather than shown as placeholders.
- **Footer:** Our Story, Love Websites, Collaborate, Contact, FAQ, and policies.
- Our Story is also linked from the homepage and footer.
- On mobile, everything lives in the drawer.

The mockup navigation is **REJECTED** as pre-pivot: it has no Women/Men pillars and uses the old "Love Notes" label. Define the navigation only in `src/config/navigation.ts`.

**Status:** PROPOSED.

## D-09 — Love Websites Scope

The Business Strategy phase table lists love websites in Phase 2, but the Phase Development Reference includes a landing page in Phase 1.

**Recommendation.** Phase 1 has the `/love-websites` landing page (types, mockup previews, how it works, starting price or inquiry) plus an inquiry submitted as a `custom_requests` row with `request_type = love_website`. The builder and public generated pages are Phase 3.

**Status:** PROPOSED.

## D-10 — Prototype Placeholder Content Rules

The Figma mockups contain placeholder content that must not reach production:

- Prices in USD and "Free shipping over $75" → **LKR** with a real threshold.
- "Worldwide shipping" → Sri Lanka delivery only at launch.
- Star ratings and review counts → **hidden** until real reviews exist. No `AggregateRating` schema.
- Card/PayPal/Apple Pay checkout → manual or inquiry payment with WhatsApp, then PayHere/KOKO.
- "12-Month Warranty", "100K+ customers", "© 2025" and similar claims → removed unless true. The year comes from the current date.
- Visual Portfolio images → real B&V shoots only.

**Status:** PROPOSED (strongly recommended; SEO Guide v3.0 already forbids fake reviews and claims).

## D-11 — Tailwind v4 Token Configuration

**VERIFIED** (ADR-0003). Tokens are CSS variables in `app/globals.css` (`:root` for light, `.dark` for dark), exposed through the Tailwind v4 theme mechanism. Every `tailwind.config.ts` instruction in older documents is superseded.

## D-12 — Route Protection in Next.js 16

The Phase 1 guide says "create middleware". Next.js 16 changed some conventions, and the governance handbook requires reading `node_modules/next/dist/docs/` before structural changes. Whether request interception is still called `middleware.ts` or has been renamed is **UNCERTAIN** until checked there.

**Recommendation.** Treat the edge or proxy layer as a convenience redirect only. Enforce authorisation **server-side** in the `/admin` layout and inside every admin Server Action and Route Handler.

**Status:** PROPOSED.

## D-13 — UUID Generation

**Recommendation.** Use `@default(uuid()) @db.Uuid` (Prisma generates the ID), as in the BaseModel Convention. This keeps IDs available before insert, which helps transactional order creation. Database-side `gen_random_uuid()` is the rejected alternative, unless raw SQL inserts become common.

**Status:** PROPOSED.

## D-14 — Source Folder Layout

**VERIFIED:** `app/` is at the repository root and `src/` is empty. The Phase 1 guide assumes `src/app/`.

**Recommendation.** Keep `app/` at the root (no churn) and put shared code under `src/`: `src/components`, `src/config`, `src/features`, `src/lib`, `src/data`, `src/types`, and `src/i18n` (later). Use the `@/*` path alias, and confirm its target in `tsconfig.json`. Route groups: `app/(public)`, `app/(auth)`, `app/admin`, `app/api`.

**Status:** PROPOSED.

## D-15 — Language Handling

English only at launch. Centralise UI strings only if it is cheap to do so. Show no language switch until Sinhala and Tamil translations exist with locale routes and hreflang (SEO Guide, Section 13).

**Status:** PROPOSED.

## D-16 — Sanity CMS

Deferred to Phase 2 (journal, lookbook, portfolio editing). Phase 1 content is static typed data or Prisma data.

**Status:** PROPOSED (consistent with the Phase 1 guide's parking lot).

## D-17 — Payments

Phase 1 checkout creates an order with status `inquiry_received` and a `payments` row with `provider = manual`. A WhatsApp confirmation link is shown on success. PayHere and KOKO integration (with webhook verification and idempotency) follows once sandbox credentials exist.

**Status:** PROPOSED.

## D-18 — Test Tooling

**VERIFIED:** there is no `typecheck` or `test` script.

**Recommendation.**

1. Add `"typecheck": "tsc --noEmit"` now. Low risk, but it edits `package.json`, so it needs approval.
2. Propose Vitest (utilities, Zod schemas, price calculations) and Playwright (smoke tests for home, product, cart, checkout, and admin login) as a separate approved task before Sprint 5.

**Status:** PROPOSED.

## D-19 — Non-B&V Assets

The `Posters_and_Image_ideas` archive belongs to Bilesma Natural, an Ayurvedic skincare client used as the SEO audit reference. Do not import it into the B&V repository. Keep only the learnings: hero pairs at 1920×650 (web) and 1080×1080 (mobile), and product image sets of main, detail, benefits, and context shots.

**Status:** PROPOSED.
