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
  - Database models live in `prisma/schema.prisma`.
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
