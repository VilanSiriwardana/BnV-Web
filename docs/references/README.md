# Reference Library

This directory contains source-of-truth project references. Governance documents should link to these files instead of duplicating their content. References describe approved **intent**; the current source code and Prisma schema describe what **exists**.

Last refreshed: 2026-10-28 (reference pack v1.1).

## Available References

| File                                                               | Version        | Use for                                                                                               |
| ------------------------------------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------- |
| [Business-Strategy.md](Business-Strategy.md)                       | 1.2            | Positioning, audiences, categories, content strategy, Visual Portfolio purpose                        |
| [Brand-Identity.md](Brand-Identity.md)                             | 1.2            | Design system, semantic tokens, typography, UI, imagery, motion, accessibility, dark mode             |
| [Phase-Development.md](Phase-Development.md)                       | 1.1            | Phase 1–4 roadmap, Phase 1 pages, portfolio hub spec, phase gate                                      |
| [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md)                 | 1.0            | Phase 1 build sequence, modules, routes, QA gates, sprint plan                                        |
| [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md) | 1.0 (PROPOSED) | Resolutions for conflicts between the documents above. **Check here first when references disagree.** |
| [Technology-Stack.md](Technology-Stack.md)                         | 1.1            | Approved and verified-installed stack, tools, version policy                                          |
| [Database-Design-Reference.md](Database-Design-Reference.md)       | 1.0 + addendum | Full Phase 1–4 table blueprint, statuses, indexes, JSONB rules, seed plan                             |
| [Database-Design.md](Database-Design.md)                           | 1.1            | Prisma BaseModel Convention: naming, keys, money, timestamps, layout, workflow                        |
| [Database-Standards.md](Database-Standards.md)                     | 1.1            | Prisma Client generation standard and approval boundary                                               |
| [SEO-Guide.md](SEO-Guide.md)                                       | 3.0            | Metadata, structured data, routing, facets, media, analytics, launch checklist                        |
| [Visual-Asset-Inventory.md](Visual-Asset-Inventory.md)             | 1.0            | What the mockups and image sets contain, and how to handle assets                                     |

## Precedence When References Conflict

1. Current source code, schema, and configuration.
2. Accepted ADRs in [../governance/DECISIONS.md](../governance/DECISIONS.md).
3. [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md), once each item is accepted.
4. The newest version of the relevant reference document.
5. Figma mockups (visual direction only, never content truth).

## Pending References

None. The Phase Development and Phase 1 Step-by-Step references were added in this refresh.
