# Reference Library

This directory contains source-of-truth project references. Governance documents should link to these files instead of duplicating their content. References describe approved **intent**; the current source code and Prisma schema describe what **exists**.

Last refreshed: 2026-10-29 (Gate B spec sync).

## Available References

| File                                                               | Version          | Use for                                                                                                                         |
| ------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [Implementation-Plan.md](Implementation-Plan.md)                   | 1.2              | **Master build plan**: status baseline, sync findings, Gate A/B, Phase 1 sprints 1A–1I, Phases 2–4                              |
| [Business-Strategy.md](Business-Strategy.md)                       | 1.2              | Positioning, audiences, categories, content strategy, Visual Portfolio purpose                                                  |
| [Brand-Identity.md](Brand-Identity.md)                             | 1.3              | Design system, semantic tokens, typography, UI, imagery, motion, accessibility, dark mode                                       |
| [Phase-Development.md](Phase-Development.md)                       | 1.1              | Phase 1–4 roadmap, Phase 1 pages, portfolio hub spec, phase gate                                                                |
| [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md)                 | 2.1              | Phase 1 build guidance aligned with D-01 to D-23, ADR-0010 to 0017                                                              |
| [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md) | 1.2 (ACCEPTED)   | Resolutions for conflicts between the documents above. **Check here first when references disagree.**                           |
| [Phase-1-UX-Spec.md](Phase-1-UX-Spec.md)                           | 1.0 (PROPOSED)   | Checkout fields, mega menu, portfolio/collaborate layouts, admin screens, status badges, states, consent, images, metadata      |
| [Business-Facts.md](Business-Facts.md)                             | 1.0 (values TBD) | Owner-confirmed business values (contact, delivery fees, payments, policies, material claims); source for `src/config/brand.ts` |
| [Technology-Stack.md](Technology-Stack.md)                         | 1.1              | Approved and verified-installed stack, tools, version policy                                                                    |
| [Database-Design-Reference.md](Database-Design-Reference.md)       | 1.0 + addendum   | Full Phase 1–4 table blueprint, statuses, indexes, JSONB rules, seed plan                                                       |
| [Database-Design.md](Database-Design.md)                           | 1.1              | Prisma BaseModel Convention: naming, keys, money, timestamps, layout, workflow                                                  |
| [Database-Standards.md](Database-Standards.md)                     | 1.1              | Prisma Client generation standard and approval boundary                                                                         |
| [SEO-Guide.md](SEO-Guide.md)                                       | 3.0              | Metadata, structured data, routing, facets, media, analytics, launch checklist                                                  |
| [Visual-Asset-Inventory.md](Visual-Asset-Inventory.md)             | 2.0              | Full image library, banner → page mapping, exported placeholders, exclusions, archive, asset rules                              |
| [Research_and_Prototype.md](Research_and_Prototype.md)             | 1.1              | Ecommerce research, Sri Lanka market/PDPA context, Figma Make prototype and image audit, build points                           |
| [Authentication.md](Authentication.md)                             | 1.0              | Google OAuth + centralized auth review: canonical `users.id`, account linking, Auth.js spike, gaps                              |
| [Hosting_Deployment.md](Hosting_Deployment.md)                     | 1.0              | Hosting options and the self-hosting path. Phase 1 hosting is decided by ADR-0011 (Vercel)                                      |

## Precedence When References Conflict

1. Current source code, schema, and configuration.
2. Accepted ADRs in [../decisions/DECISIONS.md](../decisions/DECISIONS.md).
3. [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md), once each item is accepted.
4. The newest version of the relevant reference document.
5. Figma mockups (visual direction only, never content truth).

## Pending References

The Authentication and Hosting reviews cross-reference a **Logging & Observability Reference v1.0** and a **Payment Gateway Integration Reference v1.0**, which are not yet in this directory.
