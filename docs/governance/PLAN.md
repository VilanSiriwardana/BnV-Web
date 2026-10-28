# PLAN.md - B&V Living Roadmap

## Project Information

- Project: B&V / BuwiNVila — modern romantic lifestyle ecommerce web platform.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Prisma 7, PostgreSQL, native PostgreSQL 16 + pgAdmin 4 (local, ADR-0010).
- Governance Entry Point: [../../AGENTS.md](../../AGENTS.md).
- Authoritative Handbook: [AGENTS.md](AGENTS.md).
- Reference Library: [../references/README.md](../references/README.md).
- Conflict resolutions: [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md).
- Architecture Index: [../architecture/README.md](../architecture/README.md).
- ADR Directory: [../decisions/DECISIONS.md](../decisions/DECISIONS.md).

## Current Phase

- Phase: Phase 0 → Phase 1 transition (reference refresh and decision approval).
- Status: Reference library refreshed 2026-10-28. Research, Authentication, and Hosting references added (staged, not committed). Phase 1 decisions D-01 to D-19 await approval.
- Current Branch: `main` (VERIFIED 2026-10-28). Re-check with `git branch --show-current` and `git status --short` before branch-specific work.

## Current Milestone

### M0.3 — Reference Refresh and Phase 1 Decision Approval

- Priority: High.
- Dependencies: Reference pack v1.1; owner availability for decisions.
- Files: `docs/references/*`, `docs/governance/AGENTS.md`, `docs/decisions/DECISIONS.md`, `docs/governance/PLAN.md`, `docs/governance/PROGRESS.md`, `docs/AI_SESSION_LOG.md`.
- Acceptance Criteria:
  - Refreshed references are committed under `docs/references/`, and the links in `references/README.md` resolve.
  - Each of D-01 to D-19 is ACCEPTED, REJECTED, or CHANGED, and accepted items are recorded as ADR-0011 onwards (ADR-0010 was used for native PostgreSQL).
  - ~~Pre-existing uncommitted changes to `package.json`, `package-lock.json`, and `prisma.config.ts` are reviewed and either committed or reverted by the owner.~~ Done: committed in e01b1ed (the `tsx` dev dependency and the seed command). VERIFIED 2026-10-28.
  - D-01 hosting is reconciled with [../references/Hosting_Deployment.md](../references/Hosting_Deployment.md), which leaves Vercel versus VPS open.
  - Decide whether the already-migrated Coupon, CouponRedemption, Wishlist, and WishlistItem tables stay in Phase 1. They exist in migration `004_commerce_domain`, but this plan parks coupons and wishlists in Phase 2+.
  - No application, schema, Docker, or package changes are made in this milestone.

## Phase 1 Sprint Plan (adapted from Phase-1-Step-by-Step.md to the verified repository)

| Sprint | Name                       | Already done (VERIFIED)                                                                                                                                                     | Remaining scope                                                                                                                                                                                                                              | Approval needed                                                        |
| ------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| S0     | Foundation                 | Next.js 16, TypeScript, Tailwind v4, ESLint, Prettier, Husky/lint-staged, native PostgreSQL 16 + pgAdmin 4 (ADR-0010), Prisma config + 5 migrations (22 models, HealthCheck dropped in 001) | `.env.example` (absent on disk; `.gitignore` `.env*` also ignores it, so it needs a `!.env.example` exception); `typecheck` script; `src/` folder skeleton (`config`, `components`, `features`, `lib`, `data`, `types`); `src/config/{brand,navigation,routes,seo}.ts`; README replacement                                            | `package.json` script edit                                             |
| S1     | Design System              | —                                                                                                                                                                           | Tokens (light/dark) in `app/globals.css` via Tailwind v4 theme; Playfair Display + Inter via `next/font`; theme provider + toggle; UI primitives; layout shell (Header, MegaMenu, MobileNav, Footer); internal `/style-guide` page (noindex) | None for these: next-themes, lucide-react, clsx, tailwind-merge, cva, framer-motion are already installed (VERIFIED 2026-10-28) |
| S2     | Database + Seed            | Identity (Role, Permission, RolePermission, User, UserRole, Address), catalog (Category, Brand, Collection), products (Product, Variant, Image, Inventory), commerce (Cart, CartItem, Order, OrderItem, Payment, Coupon, CouponRedemption, Wishlist, WishlistItem). Product uses direct `categoryId`/`collectionId` FKs, not the reference join tables. | Reconcile the migrated models with D-02 to D-05 (CMS, inquiries, portfolio, settings are not yet modelled); Prisma client singleton; seed entry `prisma/seed/index.ts` (categories, collections, sample products, first super_admin)                                                                                    | Schema change, migration, seeding                                      |
| S3     | Homepage                   | —                                                                                                                                                                           | Sections in the approved homepage order (Brand Identity §23) using static then DB data; newsletter action                                                                                                                                    | —                                                                      |
| S4     | Catalog + PDP              | —                                                                                                                                                                           | `/shop`, category pillars, `/collections/[slug]`, `/products/[slug]`; filters (non-indexable); Product JSON-LD                                                                                                                               | —                                                                      |
| S5     | Cart + Checkout Inquiry    | —                                                                                                                                                                           | Cart actions, drawer, page; checkout with Zod; transactional order + snapshots + manual payment row; success page with WhatsApp link                                                                                                         | Test tooling proposal (D-18) before this sprint                        |
| S6     | Custom, Contact, Portfolio | —                                                                                                                                                                           | `/custom`, `/love-websites`, `/contact`, `/portfolio`, `/portfolio/[slug]`, `/collaborate` (collaboration, consultation request, event invitation); Cloudinary uploads                                                                       | Cloudinary install + credentials                                       |
| S7     | Admin MVP                  | —                                                                                                                                                                           | Auth.js Credentials (JWT) admin login; server-side guards; dashboard; product CRUD with images; categories/collections; inbox views                                                                                                          | Auth.js install; secrets                                               |
| S8     | SEO, QA, Deploy            | —                                                                                                                                                                           | `sitemap.ts`, `robots.ts`, metadata utilities, JSON-LD; Lighthouse/PSI/accessibility QA; hosting per D-01; GA4 + Search Console                                                                                                              | Hosting accounts, domain                                               |

## Known Risks

- Agents may act on stale or conflicting references. Mitigation: the Reconciled Decisions file plus the AGENTS.md rule to ask while a decision is PROPOSED.
- Next.js 16 and Prisma 7 conventions differ from the 2025-era guides. Mitigation: consult local docs before structural changes (D-12, Database-Standards.md).
- AI-generated imagery could leak into production as "real" content. Mitigation: Visual-Asset-Inventory rules and the D-10 checklist.
- Approval rules are prose-only (no hooks). Mitigation: optional Claude Code hooks task (backlog).
- Schema drift trap: Prisma reads only `prisma/schema.prisma`, but `prisma/models/` copies look authoritative and are already stale. Mitigation: invariant in [AGENTS.md](AGENTS.md); decide on deleting or regenerating the copies (backlog).
- Hosting reference vs D-01 conflict (Vercel vs VPS). Mitigation: resolve as part of M0.3.
- `.env.example` is documented as created (2026-10-28) but is absent on disk, and `.gitignore`'s `.env*` would exclude it from commits. Mitigation: recreate it with a `!.env.example` gitignore exception (approval: config change).

## Backlog

- Replace the default README with B&V setup instructions.
- Decide the fate of `prisma/models/` copies (delete, or regenerate from `schema.prisma`).
- Add Logging & Observability and Payment Gateway references (cited by the Authentication and Hosting reviews, not yet in `docs/references/`).
- Architecture overview under `docs/architecture/` (route map, data flow, auth boundary).
- Claude Code `PreToolUse` hooks for the approval list.
- CI (GitHub Actions: lint, typecheck, build) once D-01 is decided.
- Vitest + Playwright (D-18).
- Real photography briefs from the Visual Asset Inventory.
- Business content: delivery areas and fees in LKR, policies, WhatsApp number, social URLs.

## Parking Lot (Phase 2+)

Customer accounts and Google sign-in, wishlist, reviews, gift box builder, Sanity journal, PayHere/KOKO webhooks, coupons, multilingual routes, love website builder, AI features.

## Completed

- Initial Governance Baseline (2026-07-26).
- Documentation Governance Reorganization (2026-07-26).
- Local Infrastructure Baseline (Docker Compose, PostgreSQL, pgAdmin, Prisma config).
- Prisma Client Generation Standard (2026-07-29).
- AI Agent Workflow Files (2026-08-23).
