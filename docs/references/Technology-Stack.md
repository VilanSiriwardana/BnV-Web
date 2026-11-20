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

| Layer                                  | Technology                                                                   | Status                                                 | Notes                                                                                                                                                                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework (frontend + backend)         | Next.js App Router: Server Components, Route Handlers, Server Actions        | **VERIFIED installed** — 16.2.10                       | ADR-0001. `app/` is at the repository root. Consult `node_modules/next/dist/docs/` before structural changes; Next.js 16 conventions differ from older guides.                                                                                            |
| UI runtime                             | React                                                                        | **VERIFIED installed** — 19.2.4                        |                                                                                                                                                                                                                                                           |
| Language                               | TypeScript                                                                   | **VERIFIED installed**                                 | ADR-0002. Avoid `any`.                                                                                                                                                                                                                                    |
| Styling                                | Tailwind CSS v4 + global CSS                                                 | **VERIFIED installed** — v4 via `@tailwindcss/postcss` | ADR-0003. CSS-first configuration in `app/globals.css`. There is no `tailwind.config.ts`; older guides that use one are out of date.                                                                                                                      |
| ORM                                    | Prisma                                                                       | **VERIFIED installed** — 7.8.0                         | ADR-0005. `prisma.config.ts`, multi-file schema in `prisma/schema/` (ADR-0016), `prisma-client-js` generator, `@prisma/adapter-pg` (ADR-0014). Pinned exactly.                                                                                            |
| Database                               | PostgreSQL                                                                   | **VERIFIED** — native install                          | ADR-0004.                                                                                                                                                                                                                                                 |
| Local infrastructure                   | Native PostgreSQL 16 + pgAdmin 4                                             | **VERIFIED**                                           | ADR-0010 (supersedes ADR-0006's Docker Compose approach). No app, nginx, or Redis container yet.                                                                                                                                                          |
| Validation                             | Zod                                                                          | **VERIFIED installed** — `^4.4.3` (2026-11-20)         | Required at every server boundary. Shared form schemas (ADR-0019).                                                                                                                                                                                        |
| Authentication                         | Auth.js (NextAuth)                                                           | **VERIFIED installed** — `5.0.0-beta.32` (2026-11-20)  | Admin login live; `src/lib/auth/`, `app/api/auth/[...nextauth]`, `bcryptjs` for hashes.                                                                                                                                                                   |
| Animation                              | Framer Motion                                                                | **VERIFIED installed** — `^12.42.2` (2026-11-20)       | Subtle DOM motion (`src/components/motion`); respect reduced motion. Love Site adds GSAP/ScrollTrigger (see the Love Site row).                                                                                                                           |
| Icons                                  | Lucide React                                                                 | **VERIFIED installed** — `^1.25.0` (2026-11-20)        |                                                                                                                                                                                                                                                           |
| Theme switching                        | next-themes                                                                  | **VERIFIED installed** — `^0.4.6` (2026-11-20)         | Class-based light/dark.                                                                                                                                                                                                                                   |
| CMS                                    | Sanity                                                                       | Approved, **deferred to Phase 2** (D-16)               | Phase 1 uses static typed content and Prisma.                                                                                                                                                                                                             |
| Media                                  | Cloudinary                                                                   | **VERIFIED installed** — `^2.11.0` (2026-11-20)        | Product, portfolio, and upload media via signed uploads (`src/lib/cloudinary.ts`). PostgreSQL stores metadata only.                                                                                                                                       |
| Payments                               | PayHere + KOKO                                                               | Approved, **deferred** (D-17)                          | Phase 1 uses inquiry/manual confirmation with a WhatsApp option.                                                                                                                                                                                          |
| Hosting                                | Vercel (current) + Railway (future) per v1.0                                 | **PROPOSED decision D-01**                             | Conflicts with the Jenkins/Docker deployment design in the Phase 1 guide.                                                                                                                                                                                 |
| Love Site 3D and scroll (`/love` only) | three, @react-three/fiber, drei, postprocessing, GSAP + ScrollTrigger, Lenis | **VERIFIED installed** 2026-11-12 (exact pins)         | ADR-0027: three 0.186.1, @react-three/fiber 9.8.2, @react-three/drei 10.7.9, @react-three/postprocessing 3.2.2, postprocessing 6.39.5, gsap 3.15.0, @gsap/react 2.1.2, lenis 1.3.27, @types/three 0.186.0 (dev). Imported only from `src/features/love/`. |

## 4. Development Tools

| Tool                | Status                                                                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git & GitHub        | In use                                                                                                                                                                     |
| npm                 | VERIFIED package manager                                                                                                                                                   |
| ESLint              | VERIFIED; runs via lint-staged                                                                                                                                             |
| Prettier            | VERIFIED; runs via lint-staged                                                                                                                                             |
| Husky + lint-staged | VERIFIED; `.husky/pre-commit` runs `npx lint-staged`                                                                                                                       |
| Visual Studio Code  | In use                                                                                                                                                                     |
| Docker Desktop      | No longer used for local database services (ADR-0010)                                                                                                                      |
| Figma / Figma Make  | Visual prototype only (see Phase 1 Step-by-Step and the Figma-to-Next.js workflow)                                                                                         |
| next/font           | In use. Brand fonts are Cinzel (display), Cormorant Garamond (copy), Inter (UI) per Brand-Identity v1.4+ (the earlier Playfair Display note is superseded)                 |
| Test framework      | **VERIFIED installed** — Vitest `^3.2.7` (`npm run test`). 15 Love Site unit-test files alone; `src/lib/auth/guards.test.ts`. No Playwright/e2e yet (would need approval). |

Verified `package.json` scripts (2026-11-20): `dev` (port 3002), `build`, `start`, `lint`, `typecheck`, `test`, `prepare`, and the `db:*` family. The earlier "no `typecheck`/`test` script" note is superseded.

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
