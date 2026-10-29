# PLAN.md - B&V Living Roadmap

Master plan (stable, versioned): [../references/Implementation-Plan.md](../references/Implementation-Plan.md). It holds the full gate and sprint breakdown, deliverables, exit checks, reference map, and Phases 2–4.

This file tracks only **where we are now**. Update it as work progresses, and record finished milestones in [PROGRESS.md](PROGRESS.md).

## Project Information

- Project: B&V / BuwiNVila. A modern romantic lifestyle ecommerce web platform.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Prisma 7, PostgreSQL. Local development uses a native PostgreSQL 16 install with pgAdmin 4 (ADR-0010).
- Governance entry point: [../../AGENTS.md](../../AGENTS.md). Authoritative handbook: [AGENTS.md](AGENTS.md).
- Reference library: [../references/README.md](../references/README.md). Decisions: [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md), [../decisions/DECISIONS.md](../decisions/DECISIONS.md).
- Current branch: `main` (VERIFIED 2026-10-28).

## Current Position

- Stage: **Gate B — Partial** (docs and assets done; owner business values and commissions open). Next: **Phase 1 sprint 1B** (design system).
- Next: Phase 1 sprint 1B.

## Gate Progress

| Step                          | Status                                                            |
| ----------------------------- | ----------------------------------------------------------------- |
| Gate A — Phase 0 close-out    | Done (2026-10-28)                                                 |
| Gate B — Spec Sync            | Partial (2026-10-29): owner values in Business-Facts.md open      |
| 1A Foundation finish          | Done (2026-10-29)                                                 |
| 1B Design system              | Next                                                              |
| 1C Database completion        | Partial (22 models migrated; seed done; schema additions pending) |
| 1D Homepage                   | Not started                                                       |
| 1E Catalog + PDP              | Not started                                                       |
| 1F Cart + checkout inquiry    | Not started                                                       |
| 1G Custom, Contact, Portfolio | Not started                                                       |
| 1H Admin MVP                  | Not started                                                       |
| 1I SEO, QA, deploy            | Not started                                                       |

## Current Milestone: Gate B (Sprint 0.5 Spec Sync)

See the Gate B checklist in [../references/Implementation-Plan.md](../references/Implementation-Plan.md).

- [x] Decisions D-20 to D-23 and the D-08 row fix (ADR-0017, 2026-10-29).

## Gate A (M0.3) — Done 2026-10-28

- [x] D-01 to D-19 decided: D-01 Vercel (ADR-0011), D-02 CHANGED to keep RBAC (ADR-0012), the rest accepted (ADR-0013).
- [x] Coupon and wishlist tables kept, unused until Phase 2 (ADR-0015).
- [x] `prisma/models/` copies deleted.
- [x] `.env.example` created, with a `!.env.example` exception in `.gitignore`.
- [x] `typecheck` and `db:*` scripts added. Prisma pinned to 7.8.0 with `@prisma/adapter-pg` (ADR-0014).
- [x] README replaced.
- [x] `prisma/seed/` built: roles, permissions, super admin, brand, categories, collections, opt-in demo products (ADR-0015).
- [x] Committed the pending package and Prisma config changes in e01b1ed.

## Backlog

- Logging & Observability and Payment Gateway references.
- Architecture overview under `docs/architecture/`.
- Claude Code `PreToolUse` hooks for the approval list.

## Parking Lot (Phase 2+)

Customer accounts and Google sign-in, wishlist, reviews, gift box builder, Sanity journal, PayHere/KOKO webhooks, coupons, multilingual routes, love website builder, AI features.

## Completed

- Initial Governance Baseline (2026-07-26).
- Documentation Governance Reorganization (2026-07-26).
- Local Infrastructure Baseline. Moved to native PostgreSQL 2026-10-28 (ADR-0010).
- Prisma Domain Schema: migrations 001–004 (2026-07-29).
- Prisma Client Generation Standard (2026-07-29).
- AI Agent Workflow Files (2026-08-23).
- Reference Library Refresh, pack v1.1 (2026-10-28).
- Status + Sync Audit; master plan published as `references/Implementation-Plan.md` (2026-10-28).
