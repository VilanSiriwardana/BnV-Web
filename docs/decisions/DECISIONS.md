# DECISIONS.md - B&V Architecture Decision Index

This file indexes accepted architectural decisions. Future standalone ADRs belong in [./](./) using the Decision Format section below (the former `docs/decisions/README.md` was removed in commit e01b1ed).

Related documentation:

- Governance handbook: [AGENTS.md](AGENTS.md)
- Roadmap: [PLAN.md](PLAN.md)
- Progress journal: [PROGRESS.md](PROGRESS.md)
- Reference library: [../references/README.md](../references/README.md)
- Architecture index: [../architecture/README.md](../architecture/README.md)

## Decision Format

Each decision should include:

- Decision Number
- Status
- Context
- Decision
- Alternatives
- Consequences
- Related Documents

## ADR-0001 - Use Next.js App Router

- Status: Accepted
- Date: 2026-07-26
- Context: The repository is a Next.js application with an `app/` directory and Next.js `16.2.10`.
- Decision: Use the Next.js App Router as the primary routing and rendering architecture.
- Alternatives: Pages Router, separate backend/frontend applications.
- Consequences:
  - Route structure lives under `app/`.
  - Server components are preferred by default.
  - Application code changes must consult relevant local Next.js docs under `node_modules/next/dist/docs/`.
- Related Documents:
  - [AGENTS.md](AGENTS.md)
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)

## ADR-0002 - Use TypeScript

- Status: Accepted
- Date: 2026-07-26
- Context: The repository includes `tsconfig.json`, `next.config.ts`, and TypeScript dependencies.
- Decision: Use TypeScript for application and configuration code.
- Alternatives: JavaScript-only implementation.
- Consequences:
  - New code should be typed.
  - Avoid `any` unless there is a narrow documented reason.
  - Shared contracts should be represented with types or schemas.
- Related Documents:
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)

## ADR-0003 - Use Tailwind CSS v4 for Styling

- Status: Accepted
- Date: 2026-07-26
- Context: The project uses Tailwind CSS v4 with `@tailwindcss/postcss` and CSS theme variables in `app/globals.css`.
- Decision: Use Tailwind CSS v4 and centralized CSS theme variables for styling.
- Alternatives: CSS Modules only, styled-components, another utility framework.
- Consequences:
  - Theme tokens should be centralized and reused.
  - Avoid ad hoc colors, spacing, and typography.
  - Tailwind v4 conventions must be followed instead of older Tailwind assumptions.
- Related Documents:
  - [../references/Brand-Identity.md](../references/Brand-Identity.md)
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)

## ADR-0004 - Use PostgreSQL

- Status: Accepted
- Date: 2026-07-26
- Context: Prisma datasource is configured for PostgreSQL and Docker Compose defines a PostgreSQL service.
- Decision: Use PostgreSQL as the primary relational database.
- Alternatives: MongoDB, MySQL, SQLite.
- Consequences:
  - Schema design should use relational modeling, constraints, and indexes deliberately.
  - Database reset, migration application, and destructive SQL require explicit approval.
  - Local development can use the Docker Compose PostgreSQL service.
- Related Documents:
  - [../references/Database-Design.md](../references/Database-Design.md)
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)

## ADR-0005 - Use Prisma ORM

- Status: Accepted
- Date: 2026-07-26
- Context: The repository includes Prisma dependencies, Prisma config, schema, and migrations.
- Decision: Use Prisma as the ORM and migration tool.
- Alternatives: Direct SQL only, Drizzle ORM, TypeORM.
- Consequences:
  - Database models live in `prisma/schema/*.prisma` (multi-file since ADR-0016).
  - Migration files live under `prisma/migrations/`.
  - Generated artifacts must not be edited manually.
  - Migration SQL should be reviewed before use.
- Related Documents:
  - [../references/Database-Design.md](../references/Database-Design.md)
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)

## ADR-0006 - Use Docker Compose for Local Database Services

- Status: Partially superseded by ADR-0010 (database services)
- Date: 2026-07-26
- Context: `docker-compose.yml` defines PostgreSQL and pgAdmin services with persistent volumes.
- Decision: Use Docker Compose for local database and database administration services.
- Alternatives: Manually installed local PostgreSQL, hosted development database only.
- Consequences:
  - Local database services are reproducible.
  - Volume deletion is a destructive action and requires approval.
  - Service names and ports should remain stable unless a task requires change.
- Related Documents:
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)
  - [../references/Database-Design.md](../references/Database-Design.md)

## ADR-0007 - Keep Governance Documentation in `docs/governance/`

- Status: Accepted
- Date: 2026-07-26
- Context: The repository needs a lightweight root `AGENTS.md` for tool discovery and a richer authoritative handbook for future AI coding agents.
- Decision: Keep root `AGENTS.md` as the entry point and store the authoritative governance documents in `docs/governance/`.
- Alternatives: Root-level `PLAN.md`, `PROGRESS.md`, and `DECISIONS.md`; all governance files directly under `docs/`; `documentation/`; `project-docs/`.
- Consequences:
  - AI tools can discover the root entry point quickly.
  - Future agents have a single governance directory.
  - Application source remains separate from governance documentation.
- Related Documents:
  - [../../AGENTS.md](../../AGENTS.md)
  - [AGENTS.md](AGENTS.md)
  - [PLAN.md](PLAN.md)
  - [PROGRESS.md](PROGRESS.md)

## ADR-0008 - SEO-First Public Page Architecture

- Status: Accepted
- Date: 2026-07-26
- Context: Project governance requires SEO as a first-class public web concern.
- Decision: Design public pages with metadata, semantic structure, server-rendered content, and indexability in mind.
- Alternatives: Client-only marketing pages, SEO as a post-launch cleanup.
- Consequences:
  - Public routes should define accurate metadata.
  - Content hierarchy and accessibility support search quality.
  - Robots, sitemap, canonical, redirect, and structured-data changes require intentional review.
- Related Documents:
  - [../references/SEO-Guide.md](../references/SEO-Guide.md)
  - [../references/Business-Strategy.md](../references/Business-Strategy.md)

## ADR-0009 - Add Ephemeral Task State and a Session-Level AI Log Alongside Existing Governance

- Status: Accepted
- Date: 2026-08-23
- Context: An AI-workflow audit found that `docs/governance/PLAN.md` and `docs/governance/PROGRESS.md` already serve as a permanent living roadmap and a permanent milestone-level engineering journal, but the repository had no ephemeral, task-scoped working memory (a `plan.md`/`progress.md` pair) and no permanent, session-level record of every AI-assisted work session (finer-grained than a roadmap milestone).
- Decision: Add root `plan.md` and `progress.md` as local, gitignored, ephemeral state for the currently active task, distinct from `docs/governance/PLAN.md`. Add `docs/AI_SESSION_LOG.md` as a permanent, append-only, session-level record, distinct from `docs/governance/PROGRESS.md`'s milestone-level scope. Do not create a new `docs/plans/` directory or STATUS-headered domain documents; `docs/references/*.md` continues to serve that role via the existing reference map in [AGENTS.md](AGENTS.md).
- Alternatives: Treat `docs/governance/PROGRESS.md` as already fulfilling the session-log role (rejected: loses per-session granularity and root-cause/gotcha detail for small sessions that never rise to a roadmap milestone); rename/restructure the existing `docs/governance/` files to match the reference-guide naming exactly (rejected: would rewrite an already-working, committed governance system for no functional gain).
- Consequences:
  - Two permanent chronological logs now exist with different granularity: `docs/governance/PROGRESS.md` (milestone-level, tied to `PLAN.md` acceptance criteria) and `docs/AI_SESSION_LOG.md` (every meaningful AI session). Agents must append to both when a session also completes a milestone, and must not treat this as duplicate governance.
  - `plan.md`/`progress.md` are now gitignored; they must not be force-added.
- Related Documents:
  - [AGENTS.md](AGENTS.md)
  - [PLAN.md](PLAN.md)
  - [PROGRESS.md](PROGRESS.md)
  - [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md)

## ADR-0010 - Use Native PostgreSQL + pgAdmin for Local Development

- Status: Accepted
- Date: 2026-10-28
- Context: Local database and administration services ran as Docker Compose containers (`postgres:16-alpine` and `dpage/pgadmin4`) per ADR-0006. The owner requested moving local development off Docker to a natively installed PostgreSQL server managed through native pgAdmin 4, for local development only; production hosting (D-01) is unaffected.
- Decision: Install PostgreSQL 16 and pgAdmin 4 natively on the local development machine, reusing the existing `bnv` role, `bnv` database, and `bnvpassword` credential on port 5432 so `DATABASE_URL` keeps its existing shape. Remove the `postgres` and `pgadmin` services from `docker-compose.yml`, leaving the file as a placeholder. Recreate the schema with `prisma migrate deploy` against the existing migrations rather than restoring data. The Docker volume is kept until the owner deletes it manually.
- Alternatives: Keep Docker Compose for local database services (status quo, rejected by owner); create a new dedicated `bv_app`/`bv_dev` role and database instead of reusing `bnv` (rejected - unnecessary churn for a local-only dev database); hosted development database (not requested).
- Consequences:
  - Local Postgres and pgAdmin now require manual installation and OS-service management instead of `docker compose up`.
  - `docker-compose.yml` no longer defines database services; ADR-0006 is partially superseded.
  - Version parity with the previous Docker image tag (16) must be maintained manually going forward.
  - The Docker volume remains until explicitly deleted by the owner; deleting it is a separate, manual, destructive action outside this decision.
- Related Documents:
  - [../references/Technology-Stack.md](../references/Technology-Stack.md)
  - [AGENTS.md](AGENTS.md)
  - [PLAN.md](PLAN.md)

## ADR-0011 - Host Phase 1 on Vercel with Managed PostgreSQL

- Status: Accepted
- Date: 2026-10-28
- Context: D-01 in the Reconciled Decisions weighed Vercel, a Docker VPS with Jenkins, and Railway. [Hosting_Deployment.md](../references/Hosting_Deployment.md) left Vercel vs VPS open.
- Decision: Deploy the Next.js app on Vercel. Use a managed PostgreSQL provider (Neon, Supabase, or Railway Postgres; chosen in sprint 1I) through a pooled connection string. Run lint, typecheck and build in GitHub Actions. Jenkins is deferred.
- Alternatives: Single VPS with Docker, Jenkins and nginx; Railway for both app and database.
- Consequences:
  - Serverless connection limits require a pooled `DATABASE_URL` in production.
  - The single-VPS pilot in Hosting_Deployment.md is not used for Phase 1.
  - Local development stays on native PostgreSQL (ADR-0010).
  - Amendment 2026-10-29 (sprint 1I): the production provider is Supabase (pooled connection string).
- Related Documents:
  - [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md) (D-01)
  - [../references/Hosting_Deployment.md](../references/Hosting_Deployment.md)

## ADR-0012 - Keep Table-Based RBAC (D-02 Changed)

- Status: Accepted
- Date: 2026-10-28
- Context: D-02 proposed a single `users.role` string and deferred RBAC tables to Phase 3. Migration `001_identity_foundation` had already created `roles`, `permissions`, `role_permissions` and `user_roles`.
- Decision: Keep the migrated RBAC tables. Seed the roles `super_admin`, `admin`, `editor` and `customer`, and permissions named `module.action` (for example `products.manage`). Admin guards in S7 check role membership through `user_roles`.
- Alternatives: Drop the RBAC tables and add `users.role` (destructive migration, no benefit).
- Consequences:
  - No schema change is needed for roles.
  - `user_roles.assigned_by` is required, so the first super admin assigns its own role.
  - Guard helpers (`requireRole`, `requireAdmin`, `requireSuperAdmin`) read roles through a join.
- Related Documents:
  - [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md) (D-02)

## ADR-0013 - Accept Phase 1 Reconciled Decisions D-03 to D-19

- Status: Accepted
- Date: 2026-10-28
- Context: [Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md) resolved conflicts between the reference documents. The owner accepted the recommendations.
- Decision: Accept as recommended:
  - D-03: Admin-only Auth.js Credentials with JWT sessions; guest checkout; adapter tables in Phase 2.
  - D-04: One unified status vocabulary per entity.
  - D-05: Static typed portfolio shoot data plus one `collaboration_inquiries` table.
  - D-06: Consultation booking is a request form only.
  - D-07: Routes `/portfolio`, `/portfolio/[slug]`, `/collaborate`.
  - D-08: Primary navigation Shop, Women, Men, Jewelry, Gifts, Couples, Custom, Portfolio; Our Story in the footer and homepage.
  - D-09: Love Websites landing and inquiry in Phase 1; builder in Phase 3.
  - D-10: LKR, real payment methods, no fake ratings or stats.
  - D-11: Tailwind v4 CSS-first tokens (already VERIFIED, ADR-0003).
  - D-12: Server-side guards in layouts and actions.
  - D-13: `@default(uuid()) @db.Uuid` (already VERIFIED in every model).
  - D-14: `app/` at the root, shared code in `src/` with the `@/` alias.
  - D-15: English only at launch.
  - D-16: Sanity deferred to Phase 2.
  - D-17: Inquiry, manual confirmation and WhatsApp at launch; PayHere and KOKO next.
  - D-18: `typecheck` script now; Vitest and Playwright when approved.
  - D-19: Exclude Bilesma Natural material from the repository.
- Alternatives: Recorded per decision in the Reconciled Decisions document.
- Consequences:
  - Agents no longer need to stop on these topics.
  - New conflicts found in Gate B become D-20 onwards.
- Related Documents:
  - [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md)

## ADR-0014 - Prisma 7 Connects Through @prisma/adapter-pg; Prisma Pinned to 7.8.0

- Status: Accepted
- Date: 2026-10-28
- Context: Database-Standards.md left open how Prisma 7 connects. The installed `@prisma/client@7.8.0` runtime throws "Using engine type \"client\" requires either \"adapter\" or \"accelerateUrl\"". An accidental `npm i prisma@latest` also installed `8.0.0-rc.28`, which broke the CLI (`prisma validate` unknown) and mismatched the client.
- Decision: Keep the `prisma-client-js` generator with its default output. Construct `PrismaClient` with `new PrismaPg({ connectionString }, { schema })` from `@prisma/adapter-pg`, with the `schema` query parameter stripped from `DATABASE_URL`. Pin `prisma`, `@prisma/client` and `@prisma/adapter-pg` to exactly `7.8.0`. Upgrading Prisma needs its own ADR.
- Alternatives: Prisma Accelerate (`accelerateUrl`), unnecessary for local and Vercel use; upgrading to Prisma 8 (pre-release).
- Consequences:
  - `pg` is a runtime dependency.
  - The seed client (`prisma/seed/client.ts`) holds the adapter setup now; `src/lib/prisma.ts` reuses the same pattern in sprint 1C.
- Related Documents:
  - [../references/Database-Standards.md](../references/Database-Standards.md)

## ADR-0015 - Seeding Strategy

- Status: Accepted
- Date: 2026-10-28
- Context: `prisma.config.ts` pointed its seed command at a missing `prisma/seed/index.ts`. Phase 1 needs reference data and a first super admin created without a public route (D-03).
- Decision:
  - `prisma/seed/index.ts` runs domain seeders in order: roles and permissions, super admin, brand, categories, collections, and demo products.
  - Every seeder upserts on unique keys, so re-running is safe. Product images are replaced per product.
  - Demo products load only with `--demo` (`npm run db:seed:demo`), never in a plain `db:seed`.
  - The super admin comes from `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (12+ characters) and `SEED_ADMIN_NAME`, hashed with bcryptjs at cost 12. Re-seeding never overwrites the password.
  - Products require a collection, so a neutral "Core Range" collection exists until `products.collection_id` becomes nullable in sprint 1C.
  - The migrated coupon and wishlist tables stay but are unused and unseeded until Phase 2.
  - The local database is named `bnv_db` (ADR-0010 assumed `bnv`).
- Alternatives: One monolithic seed file; SQL seed scripts; seeding the admin through a setup route (rejected for security).
- Consequences:
  - Shipping methods, FAQ, policies and site settings are seeded once their tables exist (sprint 1C).
  - Demo product image paths under `/images/prototype/` resolve only after the Gate B asset preparation.
- Related Documents:
  - [../references/Database-Design-Reference.md](../references/Database-Design-Reference.md) (§14 Seed Data Plan)
  - [../references/Database-Standards.md](../references/Database-Standards.md)

## ADR-0016 - Multi-File Prisma Schema Split by Domain

- Status: Accepted
- Date: 2026-10-28
- Context: `prisma/schema.prisma` held all 22 models in one file. The earlier `prisma/models/` copies were never read by Prisma and drifted, so they were deleted (ADR-0015). The owner wants per-domain files for easier maintenance.
- Decision: Point `prisma.config.ts` at the folder `prisma/schema`. Keep `generator` and `datasource` in `prisma/schema/schema.prisma`. Split the models verbatim into `identity.prisma` (Role, Permission, RolePermission, User, UserRole, Address), `catalog.prisma` (Category, Brand, Collection), `products.prisma` (Product, ProductVariant, ProductImage, Inventory) and `commerce.prisma` (Cart, CartItem, Order, OrderItem, Payment, Coupon, CouponRedemption, Wishlist, WishlistItem). Add `npm run db:validate`.
- Alternatives: One file per model (more files, relations harder to follow); keep a single file.
- Consequences:
  - Verified on Prisma 7.8.0: `prisma validate` loads all files, and `prisma migrate diff` from the previous single file and from the live `bnv_db` both give an empty migration. No database or client change.
  - Every `.prisma` file must live in `prisma/schema/`, and model names must be unique across files.
  - Migrations stay in `prisma/migrations/` (set explicitly in `prisma.config.ts`).
- Related Documents:
  - [../governance/AGENTS.md](../governance/AGENTS.md) (Prisma Schema Source of Truth)
  - [../references/Database-Design.md](../references/Database-Design.md)

## ADR-0017 - Accept Phase 1 Decisions D-20 to D-23

- Status: Accepted
- Date: 2026-10-29
- Context: The Gate B sync audit left four Phase 1 questions open (payment methods, catalog URLs and collections, order tracking, testimonials), and the D-08 summary row contradicted its own body. They block the Phase-1-UX-Spec, the sprint 1C schema work and the 1D–1F builds.
- Decision:
  - D-08: summary row corrected. Our Story, Love Websites and Collaborate are in the footer; Our Story is also on the homepage.
  - D-20: checkout offers Cash on Delivery and bank transfer (`cod`, `bank_transfer`, `provider = manual`), with WhatsApp confirmation for every order. Phone is required at checkout; COD orders are confirmed before dispatch.
  - D-21: category pillars at the root with subcategories at `/[pillar]/[sub]`; "New In" is the newest active products (`/shop?sort=newest`); no Home & Living pillar; collections become many-to-many through `collection_products`; `/custom` is a service page only.
  - D-22: no order tracking route in Phase 1.
  - D-23: testimonials stay hidden until real, permissioned ones exist; no `Review` or `AggregateRating` markup.
- Alternatives: Bank transfer only, or WhatsApp as a third method (D-20); `/shop/[category]`, a curated New In collection, or a nullable single collection (D-21); a `/track-order` lookup (D-22).
- Consequences:
  - D-20 needs no schema change: `orders.payment_method` and `payments.method` already exist (verified in `prisma/schema/commerce.prisma`).
  - Sprint 1C adds `collection_products`, drops `products.collection_id`, and retires the `core-range`, `new-arrivals` and `custom` seed entries. This supersedes ADR-0015's "Core Range until `products.collection_id` becomes nullable" line.
  - Sprint 1F has no tracking route.
  - The Research_and_Prototype corrections remain a separate Gate B item.
- Related Documents:
  - [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md) (D-20 to D-23)
  - [../references/SEO-Guide.md](../references/SEO-Guide.md) (§8 routes)
  - [../references/Database-Design-Reference.md](../references/Database-Design-Reference.md) (`collection_products`)

## ADR-0018 - Sprint 1C Schema Completion

- Status: Accepted
- Date: 2026-10-29
- Context: Sprint 1C had to apply D-21 (`collection_products`) and add the Phase 1 inquiry, newsletter and settings tables.
- Decision:
  - `collection_products` (composite key, `sort_order`, cascade) replaces `products.collection_id`. Migration `005_collections_and_inquiries` backfills the join table before dropping the column.
  - New tables `custom_requests` (optional `user_id`, `order_id`), `collaboration_inquiries`, `contact_messages`, `newsletter_subscribers` and `site_settings`. Status defaults follow Phase-1-Reconciled-Decisions §status. Emails are stored lowercase with a plain unique index instead of a `lower(email)` index.
  - Admin roles need no schema change (ADR-0012).
  - Retired collections (`core-range`, `new-arrivals`, `custom`) are archived and unlinked, never deleted. Their demo products move to the collection for their pillar (women/men → `fashion-edit`, jewelry → `jewelry-highlight`, gifts → `gift-ready`, couples → `couple-collection`).
  - Site settings are seeded as placeholders (`currency` LKR, `country` LK, empty WhatsApp, Instagram and TikTok) and are never overwritten on re-seed.
  - `src/lib/prisma-client.ts` (`createPrismaClient`) is shared by the app singleton `src/lib/prisma.ts` and the seed.
- Alternatives: delete retired collections; a functional `lower(email)` index through raw SQL; a separate seed client.
- Consequences:
  - `prisma migrate dev` is interactive and refuses a data-loss warning in a non-interactive shell; this migration was generated with `prisma migrate diff` and applied with `migrate deploy`.
  - Shipping methods, FAQ and policies (ADR-0015) still have no tables; they move to the sprint that builds them.
- Related Documents:
  - [../references/Database-Design-Reference.md](../references/Database-Design-Reference.md)
  - [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md)

## ADR-0019 - Form Validation Standard

- Status: Accepted
- Date: 2026-10-29
- Context: Newsletter QA showed that server-only validation gives late and invisible feedback. React 19 resets form fields after an action, and conditional error text shifts the layout. The owner asked for one standard for every form.
- Decision:
  - **One Zod schema per form** in `src/features/<feature>/schema.ts`. It is imported by both the client (for user experience) and the Server Action, which is the authority. Actions return `FormState` (`src/lib/forms/types.ts`).
  - **`useInput`** (`src/lib/forms/use-input.ts`), a custom hook:
    - inputs are controlled;
    - each field is validated with its schema field (`schema.shape.<key>`) on blur, then on every change once it has been touched;
    - checkboxes are supported;
    - server field errors are merged back into the inputs.
  - **`useFormValidation`** validates every field on submit, blocks the action and focuses the first invalid field.
  - **`FieldError` and `FormMessage`** (`src/components/ui/field-error.tsx`) are always rendered with a reserved `min-h-5` line, so errors never shift the layout.
  - **Newsletter** answers an already-active email with a neutral "already on our list" notice, and reactivates an unsubscribed email with a "Welcome back" message.
- Alternatives:
  - react-hook-form + `@hookform/resolvers` (a new dependency and a second pattern);
  - server-only validation;
  - native constraint validation.
- Consequences:
  - The newsletter reveals whether an email is subscribed. This is accepted as low sensitivity, and it must not be copied to auth or admin forms.
  - No `src/hooks/` folder (D-14); form hooks live in `src/lib/forms/`.
- Related Documents:
  - [../governance/AGENTS.md](../governance/AGENTS.md) (Forms)
  - [../references/Phase-1-UX-Spec.md](../references/Phase-1-UX-Spec.md) §6

## ADR-0020 - Sprint 1F Cart and Checkout Inquiry

- Status: Accepted
- Date: 2026-10-29
- Context: Sprint 1F needs a guest cart and an inquiry checkout (D-17, D-20). `orders.status` defaulted to `pending`, which violates D-04, and D-04 lists `orders.payment_status` but the column did not exist.
- Decision:
  - Migration `006_order_inquiry_status`: `orders.status` defaults to `inquiry_received` (and existing `pending` rows are backfilled); adds `orders.payment_status TEXT NOT NULL DEFAULT 'pending'` with an index.
  - Guest cart: an httpOnly `bnv_cart` cookie maps to `carts.guest_token`; it is set only inside Server Actions. The client holds the cart view in context, loaded after mount so ISR pages stay static.
  - Prices are always re-read from the variant; the client sends only `variantId`, `quantity` and `selectedOptions`.
  - Order numbers are `BNV-YYMMDD-XXXX` (random suffix, retried on a unique conflict). `orders.cart_id` uniqueness makes a double submit idempotent.
  - **Stock is not changed at checkout.** It is validated at add-to-cart and checkout and decremented when the order is dispatched (admin flow, 1H).
  - Delivery fee shows "Delivery fee confirmed on WhatsApp" and stores `0`; no COD limit is enforced (`src/config/commerce.ts` placeholders) until Business-Facts.md values are CONFIRMED.
  - Vitest 3 (not 5, which needs `@types/node` ≥ 22) for pure modules: `npm test`.
- Consequences:
  - Inquiries do not hold stock, so two customers can inquire for the last unit; the admin resolves this on confirmation.
  - `/policies/terms` and `/policies/privacy` are linked from checkout but are not built yet.
- Related Documents:
  - [../references/Phase-1-Step-by-Step.md](../references/Phase-1-Step-by-Step.md) §11
  - [../references/Phase-1-UX-Spec.md](../references/Phase-1-UX-Spec.md) §1

## ADR-0021 - Sprint 1H Admin MVP

- Status: Accepted
- Date: 2026-10-29
- Context: Sprint 1H adds the admin (D-03, D-12) and must decrement stock at dispatch (ADR-0020). `orders` had no dispatch timestamp, and reference images for custom requests were deferred from 1G.
- Decision:
  - Auth.js v5 (`next-auth@5.0.0-beta`) Credentials provider with JWT sessions, no adapter tables (`src/auth.ts`). Passwords are checked with bcryptjs against `users.password_hash`.
  - `src/lib/auth/guards.ts`: `requireAdmin()` and `requirePermission()` re-read the user's status and RBAC permissions from the database on every request, so disabling a user takes effect at once. The `/admin/(panel)` layout, every admin page, Server Action and Route Handler calls them. `proxy.ts` only redirects when there is no session cookie.
  - Permissions are per area, using the seeded names: `orders.manage`, `inquiries.manage`, `products.manage`, `catalog.manage`. `src/constants/permissions.ts` mirrors `prisma/seed/data/roles.ts`, with a type check that keeps them in step.
  - Admin login is rate-limited **in memory** (owner decision): 5 tries per email and 20 per IP per 15 minutes. The login error is the same for every failure.
  - Migration `admin_dispatch_and_reference_images` adds `orders.dispatched_at` and `custom_requests.reference_image_urls TEXT[]`.
  - Order statuses follow a whitelisted transition map (`src/features/admin-orders/transitions.ts`). **Dispatch is the move to `shipped`.** It sets `dispatched_at` and decrements `inventory.quantity` in one transaction, using a conditional `quantity >= n` update that aborts on oversell and a status-guarded order update that makes a double submit a no-op. Cancelling a dispatched order restocks in the same way.
  - Catalog images use Cloudinary signed direct uploads. The server signs (folder `bnv/catalog`, admin only; `bnv/custom-requests`, public and rate-limited per IP) and the browser uploads. Secure URLs are stored in the existing `image_url` columns. Saved URLs must come from our cloud and folder; local `/images/...` seed paths stay valid.
  - Archive instead of delete: products, categories and collections move to `archived` because of the `Restrict` relations.
- Consequences:
  - The in-memory limiter resets on restart and is not shared across instances. Replace it with a DB-backed store before running more than one server process.
  - Permission changes apply on the next request; JWTs only carry the user id.
  - The `/admin` pages render inside the root layout; `StorefrontChrome` hides the storefront header, footer and cart drawer there.
  - Public reference uploads appear only when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set; WhatsApp remains the fallback.
- Related Documents:
  - [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md) D-03, D-12
  - `.claude/blueprints/014-sprint-1h-admin.md`
