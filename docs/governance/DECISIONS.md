# DECISIONS.md - B&V Architecture Decision Index

This file indexes accepted architectural decisions. Future standalone ADRs belong in [../decisions/](../decisions/) using the convention documented in [../decisions/README.md](../decisions/README.md).

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

- Status: Accepted
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
