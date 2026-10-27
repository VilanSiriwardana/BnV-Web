# PLAN.md - B&V Living Roadmap

## Project Information

- Project: B&V / BuwiNVila — modern romantic lifestyle ecommerce web platform.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Prisma 7, PostgreSQL, Docker Compose (local).
- Governance Entry Point: [../../AGENTS.md](../../AGENTS.md).
- Authoritative Handbook: [AGENTS.md](AGENTS.md).
- Reference Library: [../references/README.md](../references/README.md).
- Conflict resolutions: [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md).
- Architecture Index: [../architecture/README.md](../architecture/README.md).
- ADR Directory: [../decisions/README.md](../decisions/README.md).

## Current Phase

- Phase: Phase 0 → Phase 1 transition (reference refresh and decision approval).
- Status: Reference library refreshed 2026-10-28. Phase 1 decisions D-01 to D-19 await approval.
- Current Branch: `UNCERTAIN` — run `git branch --show-current` and `git status --short` before branch-specific work.

## Current Milestone

### M0.3 — Reference Refresh and Phase 1 Decision Approval

- Priority: High.
- Dependencies: Reference pack v1.1; owner availability for decisions.
- Files: `docs/references/*`, `docs/governance/AGENTS.md`, `docs/governance/DECISIONS.md`, `docs/governance/PLAN.md`, `docs/governance/PROGRESS.md`, `docs/AI_SESSION_LOG.md`.
- Acceptance Criteria:
  - Refreshed references are committed under `docs/references/`, and the links in `references/README.md` resolve.
  - Each of D-01 to D-19 is ACCEPTED, REJECTED, or CHANGED, and accepted items are recorded as ADR-0010 onwards.
  - Pre-existing uncommitted changes to `package.json`, `package-lock.json`, and `prisma.config.ts` are reviewed and either committed or reverted by the owner.
  - No application, schema, Docker, or package changes are made in this milestone.

## Phase 1 Sprint Plan (adapted from Phase-1-Step-by-Step.md to the verified repository)

| Sprint | Name                       | Already done (VERIFIED)                                                                                                                                           | Remaining scope                                                                                                                                                                                                                              | Approval needed                                                        |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| S0     | Foundation                 | Next.js 16, TypeScript, Tailwind v4, ESLint, Prettier, Husky/lint-staged, Docker Compose Postgres + pgAdmin, Prisma config + split models + HealthCheck migration | `.env.example` review; `typecheck` script; `src/` folder skeleton (`config`, `components`, `features`, `lib`, `data`, `types`); `src/config/{brand,navigation,routes,seo}.ts`; README replacement                                            | `package.json` script edit                                             |
| S1     | Design System              | —                                                                                                                                                                 | Tokens (light/dark) in `app/globals.css` via Tailwind v4 theme; Playfair Display + Inter via `next/font`; theme provider + toggle; UI primitives; layout shell (Header, MegaMenu, MobileNav, Footer); internal `/style-guide` page (noindex) | Installs: next-themes, lucide-react (if missing), clsx, tailwind-merge |
| S2     | Database + Seed            | HealthCheck model only                                                                                                                                            | Phase 1 models per D-02 to D-05; Prisma client singleton; seed entry `prisma/seed/index.ts` (categories, collections, sample products, first super_admin)                                                                                    | Schema change, migration, seeding                                      |
| S3     | Homepage                   | —                                                                                                                                                                 | Sections in the approved homepage order (Brand Identity §23) using static then DB data; newsletter action                                                                                                                                    | —                                                                      |
| S4     | Catalog + PDP              | —                                                                                                                                                                 | `/shop`, category pillars, `/collections/[slug]`, `/products/[slug]`; filters (non-indexable); Product JSON-LD                                                                                                                               | —                                                                      |
| S5     | Cart + Checkout Inquiry    | —                                                                                                                                                                 | Cart actions, drawer, page; checkout with Zod; transactional order + snapshots + manual payment row; success page with WhatsApp link                                                                                                         | Test tooling proposal (D-18) before this sprint                        |
| S6     | Custom, Contact, Portfolio | —                                                                                                                                                                 | `/custom`, `/love-websites`, `/contact`, `/portfolio`, `/portfolio/[slug]`, `/collaborate` (collaboration, consultation request, event invitation); Cloudinary uploads                                                                       | Cloudinary install + credentials                                       |
| S7     | Admin MVP                  | —                                                                                                                                                                 | Auth.js Credentials (JWT) admin login; server-side guards; dashboard; product CRUD with images; categories/collections; inbox views                                                                                                          | Auth.js install; secrets                                               |
| S8     | SEO, QA, Deploy            | —                                                                                                                                                                 | `sitemap.ts`, `robots.ts`, metadata utilities, JSON-LD; Lighthouse/PSI/accessibility QA; hosting per D-01; GA4 + Search Console                                                                                                              | Hosting accounts, domain                                               |

## Known Risks

- Agents may act on stale or conflicting references. Mitigation: the Reconciled Decisions file plus the AGENTS.md rule to ask while a decision is PROPOSED.
- Next.js 16 and Prisma 7 conventions differ from the 2025-era guides. Mitigation: consult local docs before structural changes (D-12, Database-Standards.md).
- AI-generated imagery could leak into production as "real" content. Mitigation: Visual-Asset-Inventory rules and the D-10 checklist.
- Approval rules are prose-only (no hooks). Mitigation: optional Claude Code hooks task (backlog).

## Backlog

- Replace the default README with B&V setup instructions.
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
