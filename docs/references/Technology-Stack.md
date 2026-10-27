# B&V Technology Stack & Tools Reference

| Field               | Value                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Version             | 1.1                                                                                                                         |
| Status              | Approved stack; hosting is a PROPOSED decision (D-01)                                                                       |
| Converted / updated | 2026-10-28                                                                                                                  |
| Based on            | Technology_Stack_Reference_v1_0.pdf, plus repository facts recorded in `docs/governance/AGENTS.md` and ADR-0001 to ADR-0006 |

> **Reference-library note.** Version 1.0 listed approved technologies without versions and contained broken Markdown headings. Version 1.1 restores the structure, separates **verified installed** tooling from **approved but not yet installed** tooling, and records the open hosting decision. Installed versions come from the governance handbook as of 2026-08-23. Re-check `package.json` before relying on them.

## 1. Purpose

This document defines the approved technology stack, supporting tools, and engineering philosophy for the B&V platform. Architecture, database, API, UI, SEO, DevOps, and AI documents build on it.

## 2. Engineering Philosophy

- SEO-first, performance-first, mobile-first development.
- Modern web standards using TypeScript.
- Scalable architecture without unnecessary complexity.
- Content-driven commerce with a premium user experience.
- Developer productivity, maintainability, and future AI readiness.

## 3. Core Stack

| Layer                          | Technology                                                            | Status                                                 | Notes                                                                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework (frontend + backend) | Next.js App Router: Server Components, Route Handlers, Server Actions | **VERIFIED installed** — 16.2.10                       | ADR-0001. `app/` is at the repository root. Consult `node_modules/next/dist/docs/` before structural changes; Next.js 16 conventions differ from older guides. |
| UI runtime                     | React                                                                 | **VERIFIED installed** — 19.2.4                        |                                                                                                                                                                |
| Language                       | TypeScript                                                            | **VERIFIED installed**                                 | ADR-0002. Avoid `any`.                                                                                                                                         |
| Styling                        | Tailwind CSS v4 + global CSS                                          | **VERIFIED installed** — v4 via `@tailwindcss/postcss` | ADR-0003. CSS-first configuration in `app/globals.css`. There is no `tailwind.config.ts`; older guides that use one are out of date.                           |
| ORM                            | Prisma                                                                | **VERIFIED installed** — 7.8.0                         | ADR-0005. `prisma.config.ts`, split models in `prisma/models/`, `prisma-client-js` generator (see Database-Standards.md).                                      |
| Database                       | PostgreSQL                                                            | **VERIFIED** — Docker Compose service                  | ADR-0004.                                                                                                                                                      |
| Local infrastructure           | Docker Compose: PostgreSQL + pgAdmin                                  | **VERIFIED**                                           | ADR-0006. No app, nginx, or Redis container yet.                                                                                                               |
| Validation                     | Zod                                                                   | Approved; install status UNCERTAIN                     | Required at every server boundary.                                                                                                                             |
| Authentication                 | Auth.js                                                               | Approved, not installed                                | Phase 1: admin login (D-03).                                                                                                                                   |
| Animation                      | Framer Motion                                                         | Approved, not installed                                | Subtle motion only; respect reduced motion. Recent releases are published as the `motion` package; confirm the package name at install time.                   |
| Icons                          | Lucide React                                                          | Approved; governance requires `lucide-react`           |                                                                                                                                                                |
| Theme switching                | next-themes (or equivalent)                                           | Approved by Phase 1 guide, not installed               | Class-based light/dark.                                                                                                                                        |
| CMS                            | Sanity                                                                | Approved, **deferred to Phase 2** (D-16)               | Phase 1 uses static typed content and Prisma.                                                                                                                  |
| Media                          | Cloudinary                                                            | Approved, not installed                                | All product, portfolio, and upload media. PostgreSQL stores metadata only.                                                                                     |
| Payments                       | PayHere + KOKO                                                        | Approved, **deferred** (D-17)                          | Phase 1 uses inquiry/manual confirmation with a WhatsApp option.                                                                                               |
| Hosting                        | Vercel (current) + Railway (future) per v1.0                          | **PROPOSED decision D-01**                             | Conflicts with the Jenkins/Docker deployment design in the Phase 1 guide.                                                                                      |

## 4. Development Tools

| Tool                | Status                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Git & GitHub        | In use                                                                                                 |
| npm                 | VERIFIED package manager                                                                               |
| ESLint              | VERIFIED; runs via lint-staged                                                                         |
| Prettier            | VERIFIED; runs via lint-staged                                                                         |
| Husky + lint-staged | VERIFIED; `.husky/pre-commit` runs `npx lint-staged`                                                   |
| Visual Studio Code  | In use                                                                                                 |
| Docker Desktop      | In use                                                                                                 |
| Figma / Figma Make  | Visual prototype only (see Phase 1 Step-by-Step and the Figma-to-Next.js workflow)                     |
| next/font           | Approved for Playfair Display + Inter                                                                  |
| Test framework      | **None installed.** Proposal: Vitest for unit tests and Playwright for smoke tests (requires approval) |

Verified `package.json` scripts: `dev`, `build`, `start`, `lint`, `prepare`. There is no `typecheck` or `test` script yet, although the Phase 1 guide assumes both.

## 5. SEO and Analytics Toolchain

- Ubersuggest — keyword research and SEO planning
- Google Search Console — indexing and search performance
- Google Analytics 4 — visitor analytics and conversion tracking
- Google Trends — trend discovery
- Google Lighthouse — performance, SEO, and accessibility audits
- Google PageSpeed Insights — Core Web Vitals monitoring
- Rich Results Test and the Schema.org validator — structured data
- Meta SEO Inspector — rendered metadata checks

## 6. Future Expansion

- Dedicated NestJS backend hosted on Railway
- Redis and background job queues
- AI recommendation engine
- Semantic product search
- Mobile application APIs
- Advanced analytics and personalization

## 7. Version Policy

Do not upgrade the framework, packages, Docker images, or database tooling without an explicit implementation task (governance handbook). When a new package is approved, pin a version that has been published for at least two weeks and record the addition in `docs/governance/PROGRESS.md`.
