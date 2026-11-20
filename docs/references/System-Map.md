# System Map — B&V Full System & Tech-Stack Mapping

| Field    | Value                                                                                                                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version  | 1.0                                                                                                                                                                                                |
| Status   | **PARTIALLY IMPLEMENTED** — Phase 1 ecommerce built (manual QA pending); Love Site built, release pending                                                                                          |
| Created  | 2026-11-20                                                                                                                                                                                         |
| Audience | AI coding agents (Codex, Claude Code, Cursor, Copilot) and the developer-reviewer                                                                                                                  |
| Purpose  | One navigable map of what exists in the full system, the tech stack per layer, and which reference document to open for which task. It does **not** duplicate those references; it points to them. |

**Confidence labels** (same convention as [../governance/AGENTS.md](../governance/AGENTS.md)): `VERIFIED` = confirmed from source/config/schema read during this audit (2026-11-20). `INFERRED` = strongly implied, not directly confirmed. `UNCERTAIN` = must be checked before use.

**Precedence:** current source code and the Prisma schema describe what **exists**; this map summarizes it as of the date above. Where this map and source disagree, source wins — correct this map. For approved _intent_ (strategy, design, data model), the documents in [README.md](README.md) remain authoritative.

---

## 1. The system at a glance

B&V (BuwiNVila) is a single Next.js 16 application (`BnV-Web`) that contains **two subsystems** in one codebase:

| Subsystem                         | What it is                                                                                                                                                 | Routes                                                                                                                                                           | Status (VERIFIED 2026-11-20)                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Storefront + Admin** (the shop) | A romantic-lifestyle ecommerce platform: catalog, inquiry-style cart/checkout, custom orders, portfolio, contact, collaboration, and an admin back office. | `/`, `/shop`, `/products`, `/collections`, `/portfolio`, `/custom`, `/contact`, `/collaborate`, `/policies`, `/cart`, `/checkout`, `/admin/*`, `/[pillar]/[sub]` | Phase 1 code **built** (1A–1I, 2026-10-29); manual QA + deploy pending                              |
| **Love Site** (private)           | A private, scroll-driven 3D birthday page. Separate route, its own theme, no shop chrome. First version of the future "Love Websites" product (D-09).      | `/love/[slug]` (`noindex`), `/love-websites`                                                                                                                     | **Built** through Phase 7 (v1.1 all-night); release pending (real photos, music licence, device QA) |

The two share the same framework, design tokens, forms stack, and governance. The Love Site deliberately diverges in a few places (own scroll-driven theme, 3D event durations longer than the brand's UI motion tokens); those exceptions are recorded in its reference docs and in ADRs.

---

## 2. What has been built — Storefront + Admin

All paths VERIFIED 2026-11-20. Feature logic lives in `src/features/<feature>/`; shared UI in `src/components/`; server/data code in `src/lib/`.

### 2.1 Routes (`app/`)

- **Storefront:** `app/page.tsx` (home), `shop/`, `products/[slug]/`, `collections/[slug]/`, `portfolio/[slug]/`, `custom/`, `contact/`, `collaborate/`, `policies/[slug]/`, `cart/`, `checkout/` (+ `checkout/success/`), `[pillar]/[sub]/` (catalog pillar/sub navigation), `style-guide/`.
- **Admin** (`app/admin/`): `login/` and a `(panel)` route group containing `products/`, `categories/`, `collections/`, `orders/`, `custom-requests/`, `contact-messages/`, `collaboration-inquiries/`.
- **API routes** (`app/api/`): `auth/[...nextauth]/route.ts` (NextAuth v5), `health/route.ts`, `admin/uploads/sign/route.ts` and `uploads/custom-request/sign/route.ts` (Cloudinary signed uploads).

### 2.2 Feature modules (`src/features/`)

`home`, `catalog`, `cart`, `checkout`, `custom-request`, `contact`, `collaboration`, `newsletter`, `portfolio`, `admin-auth`, `admin-catalog`, `admin-orders`, `admin-inquiries`, and `love` (see §3). Each feature owns its Server Actions, Zod schema, and view components per the Forms convention (ADR-0019).

### 2.3 Shared libraries (`src/lib/`)

| Path                                                           | Role                                                                                   |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `prisma.ts`, `prisma-client.ts`                                | PostgreSQL data access — the Prisma client singleton. All DB access goes through here. |
| `auth/guards.ts`, `auth/rate-limit.ts`                         | Authorization guards (RBAC) and rate limiting (`guards.test.ts` covered).              |
| `forms/` (`types.ts`, `use-input.ts`, `fields.ts`, `parse.ts`) | Shared forms stack (ADR-0019): `FormState`, controlled-input hook, server parsing.     |
| `seo/` (`metadata.ts`, `canonical.ts`, `jsonld.tsx`)           | Metadata, canonical URLs, JSON-LD structured data.                                     |
| `cloudinary.ts`                                                | Cloudinary signing/config for image uploads.                                           |
| `consent.ts`                                                   | PDPA consent handling.                                                                 |
| `admin/list-params.ts`, `utils/`                               | Admin list params; `cn`, `format`, `image` (blur), `slug` helpers.                     |

### 2.4 Database (`prisma/`)

Multi-file schema under `prisma/schema/` (ADR-0016) — Prisma loads **every** `.prisma` file in that folder. Current domain files (VERIFIED 2026-11-20): `schema.prisma` (generator + datasource only), `identity.prisma`, `catalog.prisma`, `products.prisma`, `commerce.prisma`, `inquiries.prisma`, `settings.prisma`. **8 migrations** applied (`20260721…_init` through `20261029…_admin_dispatch_and_reference_images`). Seeders in `prisma/seed/` (ADR-0015). Table-level intent lives in [Database-Design-Reference.md](Database-Design-Reference.md); do not assert table/column names from this map without checking the schema.

### 2.5 Build status

Gate A done (2026-10-28); Gate B partial (owner business values open). Sprints **1A–1I built** 2026-10-29 (foundation, design system, database, homepage, catalog+PDP, cart+checkout inquiry, custom/contact/portfolio, admin MVP, SEO/QA scaffolding). Outstanding: manual QA across themes/breakpoints/flows, Cloudinary keys, Lighthouse, deploy (domain TBD). See [../governance/PLAN.md](../governance/PLAN.md) and [../governance/PROGRESS.md](../governance/PROGRESS.md) for the live status.

---

## 3. What has been built — Love Site

Private scroll-driven 3D page at `app/love/[slug]/page.tsx` (Server Component, `noindex`). Feature code in `src/features/love/` (kebab-case files), organized as `config/`, `engine/`, `canvas/`, `sections/`, `ui/`, `hooks/`, `dev/`. Built through **Phase 7** as the **all-night v1.1** experience (ADR-0029 amendment: no day/dawn tokens, no Pearl skin; fixed per-tier bloom; a particle-cloud Dance section added).

Architecture (VERIFIED in the love tech-stack doc, as-built): one GSAP ticker drives Lenis → ScrollTrigger → tweens → R3F render ("one clock"); a single `<Canvas>`; mutable `heart` state object (not React state) written by GSAP, read in `useFrame`; a `HeartDirector` enforces one-event-at-a-time with a baseline invariant; four quality tiers with a static WebGL-free fallback. Full behaviour: [love-site/Love-Site-Experience-Guidebook.md](love-site/Love-Site-Experience-Guidebook.md). Release-pending items: real photos replacing prototype images, a rights-cleared music track, deploy, and real-device QA.

---

## 4. Tech-stack mapping

Versions VERIFIED from `package.json` (2026-11-20). "Core" = used across the shop and the app shell. "Love Site" = additional packages the 3D page introduced.

### 4.1 Core platform

| Layer            | Tool                                        | Version                         | Where it is used                                                     |
| ---------------- | ------------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| Framework        | Next.js (App Router)                        | `16.2.10`                       | All routes, layouts, metadata, image optimisation, Server Actions    |
| UI runtime       | React                                       | `19.2.4`                        | Components (Server Components by default; Client where interactive)  |
| Language         | TypeScript                                  | `^5`                            | All app and config code                                              |
| Styling          | Tailwind CSS v4 (`@tailwindcss/postcss`)    | `^4`                            | Semantic tokens in `app/globals.css`; no ad-hoc hex in components    |
| ORM              | Prisma + `@prisma/adapter-pg`               | `7.8.0`                         | `src/lib/prisma*.ts`; multi-file schema `prisma/schema/`             |
| Database         | PostgreSQL                                  | 16 (native + pgAdmin, ADR-0010) | All persistence; `pg` driver `8.23.1`                                |
| Auth             | NextAuth (Auth.js)                          | `5.0.0-beta.32`                 | `app/api/auth/[...nextauth]`, `src/lib/auth/`; `bcryptjs` for hashes |
| Validation       | Zod                                         | `^4.4.3`                        | Shared form schemas (ADR-0019), server boundaries                    |
| Media            | Cloudinary                                  | `^2.11.0`                       | `src/lib/cloudinary.ts`, signed upload routes                        |
| UI primitives    | Radix UI / shadcn, `cmdk`                   | `^1.8.1`                        | `src/components/ui`                                                  |
| UI motion        | `framer-motion`                             | `^12.42.2`                      | `src/components/motion` (`Reveal`/`Stagger`), small transitions      |
| Theming / icons  | `next-themes`, `lucide-react`               | `0.4.6` / `^1.25.0`             | Dark mode, interface icons                                           |
| Utilities        | `clsx`, `tailwind-merge`, `cva`, `date-fns` | —                               | `cn()`, variant styling, formatting                                  |
| Carousel / dates | `embla-carousel-*`, `react-day-picker`      | —                               | Marketing carousels, date inputs                                     |
| Toasts           | `sonner`                                    | `^2.0.8`                        | Notifications                                                        |
| Package manager  | npm                                         | —                               | `package-lock.json`                                                  |

### 4.2 Love Site additions

| Layer               | Tool                                             | Version            | Role on `/love`                                      |
| ------------------- | ------------------------------------------------ | ------------------ | ---------------------------------------------------- |
| 3D engine           | `three`                                          | `0.186.1`          | Rendering (`@types/three` `0.186.0`)                 |
| 3D in React         | `@react-three/fiber`                             | `9.8.2`            | Scene graph as components (v9 pairs with React 19)   |
| 3D helpers          | `@react-three/drei`                              | `10.7.9`           | `useTexture`, `useProgress`, `PerformanceMonitor`    |
| Glow                | `@react-three/postprocessing` + `postprocessing` | `3.2.2` / `6.39.5` | Bloom pass on the heart                              |
| Smooth scroll       | `lenis`                                          | `1.3.27`           | Inertia scroll, `scrollTo`, `stop/start`             |
| Scroll choreography | `gsap` + `@gsap/react`                           | `3.15.0` / `2.1.2` | ScrollTrigger paths, timed heart events, theme shift |
| Audio               | Web Audio API (native)                           | —                  | Music + analyser-driven visuals (no package)         |

**Not used, on purpose** (per the love tech doc): Spline, Blender/GLB, Zustand, physics engines, `detect-gpu`, `maath`. Do not add packages without approval (an ADR and the owner sign-off).

### 4.3 Tooling & enforcement

| Concern      | Tool                            | Version              | Notes                                                                     |
| ------------ | ------------------------------- | -------------------- | ------------------------------------------------------------------------- |
| Lint         | ESLint + `eslint-config-next`   | `^9`                 | `npm run lint`                                                            |
| Format       | Prettier (+ tailwindcss plugin) | `^3.9.5`             | Enforced on commit via lint-staged                                        |
| Type check   | `tsc --noEmit`                  | —                    | `npm run typecheck`                                                       |
| Tests        | Vitest                          | `^3.2.7`             | `npm run test`                                                            |
| Pre-commit   | Husky + lint-staged             | `^9.1.7` / `^16.4.0` | `.husky/pre-commit` runs `eslint --fix` + `prettier --write` (mechanical) |
| Scripts/seed | `tsx`, `dotenv`                 | —                    | Seeders, image placeholder scripts                                        |

Verified npm scripts (do not invent others): `dev` (port 3002), `build`, `start`, `lint`, `typecheck`, `test`, and the `db:*` family (`validate`, `generate`, `migrate`, `deploy`, `seed`, `seed:demo`, `reset`, `setup`, `studio`). Full table in [../../README.md](../../README.md).

---

## 5. Reference-docs map (which document for which task)

Open **only** the document the task needs (progressive disclosure). Full index and versions: [README.md](README.md).

### 5.1 In-repo references (`docs/references/`)

| Task                                             | Document                                                                                                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack / tooling / versions                       | [Technology-Stack.md](Technology-Stack.md) (this map maps it to as-built code)                                                                                                                                 |
| Master build plan, gates, sprints, phases        | [Implementation-Plan.md](Implementation-Plan.md)                                                                                                                                                               |
| Business strategy, positioning, categories       | [Business-Strategy.md](Business-Strategy.md), [Business-Facts.md](Business-Facts.md)                                                                                                                           |
| Brand / design system / tokens / motion          | [Brand-Identity.md](Brand-Identity.md)                                                                                                                                                                         |
| Database tables / Prisma conventions / standards | [Database-Design-Reference.md](Database-Design-Reference.md), [Database-Design.md](Database-Design.md), [Database-Standards.md](Database-Standards.md)                                                         |
| SEO / metadata / routing                         | [SEO-Guide.md](SEO-Guide.md)                                                                                                                                                                                   |
| Auth / OAuth / sessions                          | [Authentication.md](Authentication.md)                                                                                                                                                                         |
| Hosting / deployment / environments              | [Hosting_Deployment.md](Hosting_Deployment.md) (platform choice OPEN — ask)                                                                                                                                    |
| Images / mockups / asset rules                   | [Visual-Asset-Inventory.md](Visual-Asset-Inventory.md)                                                                                                                                                         |
| Checkout flows, PDPA, prototype porting          | [Research_and_Prototype.md](Research_and_Prototype.md)                                                                                                                                                         |
| Phase scope, step-by-step, conflict resolutions  | [Phase-Development.md](Phase-Development.md), [Phase-1-Step-by-Step.md](Phase-1-Step-by-Step.md), [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md), [Phase-1-UX-Spec.md](Phase-1-UX-Spec.md) |
| Design-skill usage                               | [Design_Skills_Setup.md](Design_Skills_Setup.md)                                                                                                                                                               |

### 5.2 Love Site references (`docs/references/love-site/`)

Reading order (index: [love-site/README.md](love-site/README.md)):

1. [Love-Site-Implementation-Phases.md](love-site/Love-Site-Implementation-Phases.md) — **start here**: seven phases, exit criteria, file map, repo corrections (R1–R8) that override the guidebooks.
2. [Love-Site-Experience-Guidebook.md](love-site/Love-Site-Experience-Guidebook.md) — as-built behaviour per section (§0 has status, gaps, release-pending).
3. [Love-Site-Tech-Stack-and-Tools.md](love-site/Love-Site-Tech-Stack-and-Tools.md) — packages/versions, one-clock architecture, performance tiers, accessibility, governance.
4. Per-phase build guides: [love-site/phases/README.md](love-site/phases/README.md) (Phases 1–7).
5. Background research (optional): [Scroll-3D-Guide-Complete.md](love-site/Scroll-3D-Guide-Complete.md), [Scroll-3D-Guide-Overview.md](love-site/Scroll-3D-Guide-Overview.md). Ideas: [Love-Site-Improvement-Report.md](love-site/Love-Site-Improvement-Report.md).

### 5.3 Source material (outside the repo: `../BnV Docs/`)

Original PDFs/prototype the in-repo references were distilled from — background only, **not** source of truth (the repo is). Includes: `Technology_Stack_Reference_v1.0.pdf`, `BV_PostgreSQL_Database_Design_Reference_v1.0.pdf`, `BV_SEO_Reference_Guide_v3.0.pdf`, `Brand Identity & Design System Reference v1.1.pdf`, `Couple_Brand_Business_Ideas_And_Website_Strategy_v1.2.pdf`, `BV_Phase_Development_Reference_v1.1.pdf`, `BV_Phase_1_Step_by_Step_Guidance_Document.pdf`, `FIgmaTONextJS.*`, the `B&V Ecommerce Prototype` (Figma Make export), `Birthday-Bubzy-Docs`, and the `Images/` library. When an in-repo reference and a PDF disagree, the in-repo reference wins.

---

## 6. High-risk areas (verified in this repo)

Treat as requiring explicit approval before change (see [../governance/AGENTS.md](../governance/AGENTS.md) safety rules): authentication & RBAC (`src/lib/auth/`, NextAuth route), admin panel and dispatch (`app/admin/(panel)/`), Prisma schema & migrations (`prisma/`), signed uploads (`app/api/*/uploads/sign`, Cloudinary), customer/inquiry data (cart, checkout, custom-request, contact, collaboration), consent/PDPA (`src/lib/consent.ts`), and anything touching the Love Site's `heart` state / `HeartDirector` invariants.

---

## 7. Maintenance

Update this map when a subsystem, major route group, feature module, or stack component is added or removed, or when the build-status summary in §1–§3 changes. It is a **map**, not a changelog — keep milestone history in [../governance/PROGRESS.md](../governance/PROGRESS.md) and session history in [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md). Versions and per-document status live in [README.md](README.md).
