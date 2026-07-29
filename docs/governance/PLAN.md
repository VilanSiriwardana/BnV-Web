# PLAN.md - B&V Living Roadmap

## Project Information

- Project: B&V / BuwiNVila web platform.
- Stack: Next.js App Router, TypeScript, Tailwind CSS v4, Prisma, PostgreSQL, Docker.
- Governance Entry Point: [../../AGENTS.md](../../AGENTS.md).
- Authoritative Handbook: [AGENTS.md](AGENTS.md).
- Reference Library: [../references/README.md](../references/README.md).
- Architecture Index: [../architecture/README.md](../architecture/README.md).
- ADR Directory: [../decisions/README.md](../decisions/README.md).

## Current Phase

- Phase: Phase 0 - documentation governance and infrastructure baseline.
- Status: Documentation governance reorganization in progress.
- Current Branch: `UNCERTAIN`; check `git branch --show-current` before branch-specific work.

## Current Sprint

- Name: Governance documentation structure.
- Goal: Make root `AGENTS.md` a lightweight entry point and make [AGENTS.md](AGENTS.md), [PLAN.md](PLAN.md), [PROGRESS.md](PROGRESS.md), and [DECISIONS.md](DECISIONS.md) the authoritative governance set under `docs/governance/`.

## Current Milestone

### Documentation Governance Reorganization

- Priority: High.
- Dependencies:
  - Existing root `AGENTS.md`.
  - Existing governance files.
  - Existing project reference documents.
- Estimated Impact: Gives all future AI coding agents one consistent project operating model.
- Files:
  - `AGENTS.md`
  - `docs/governance/AGENTS.md`
  - `docs/governance/PLAN.md`
  - `docs/governance/PROGRESS.md`
  - `docs/governance/DECISIONS.md`
  - `docs/references/`
  - `docs/architecture/`
  - `docs/decisions/`
- Acceptance Criteria:
  - Root `AGENTS.md` remains lightweight and links to governance docs.
  - Governance files live in `docs/governance/`.
  - Reference documents live in `docs/references/`.
  - Architecture and decision directories exist with README anchors.
  - Governance docs use relative links.
  - No application, schema, Docker, package, or framework configuration files are changed.
- Notes:
  - Reference documents should be linked, not duplicated.
  - Existing progress and ADR history should be preserved.

## Repository Status

- Governance docs: Being reorganized.
- Reference docs: Available under [../references/README.md](../references/README.md).
- Architecture docs: Directory prepared at [../architecture/README.md](../architecture/README.md).
- Decision docs: Directory prepared at [../decisions/README.md](../decisions/README.md).
- Application code: Out of scope for the current milestone.
- Database schema: Out of scope for the current milestone.
- Docker configuration: Out of scope for the current milestone.

## Known Risks

- AI agents may read only root `AGENTS.md`; mitigation is a lightweight root entry point with explicit links.
- Internal links may break after moving files; mitigation is relative-link verification.
- Governance docs may duplicate long references; mitigation is linking to [../references/README.md](../references/README.md).
- Empty documentation directories may be lost in Git; mitigation is README files.
- Existing unrelated working tree changes may be present; mitigation is to avoid touching non-documentation files.

## Current Priorities

### P0 - Complete Governance Reorganization

- Dependencies: Existing Markdown files.
- Estimated Impact: High.
- Files: Governance and documentation directories.
- Acceptance Criteria: New hierarchy exists and links resolve.
- Notes: Documentation-only.

### P1 - Preserve Reference Documents

- Dependencies: Existing reference files.
- Estimated Impact: High.
- Files: `docs/references/*.md`.
- Acceptance Criteria: Reference contents are moved without rewriting.
- Notes: Use shorter filenames for stable relative links.

### P2 - Prepare Architecture and ADR Expansion

- Dependencies: Governance structure.
- Estimated Impact: Medium.
- Files: `docs/architecture/README.md`, `docs/decisions/README.md`.
- Acceptance Criteria: Directories explain their intended use.
- Notes: No standalone ADR migration required yet.

## Active Tasks

- Reorganize documentation hierarchy.
- Update root `AGENTS.md`.
- Refactor [AGENTS.md](AGENTS.md) to reference source documents instead of duplicating them.
- Improve [PLAN.md](PLAN.md), [PROGRESS.md](PROGRESS.md), and [DECISIONS.md](DECISIONS.md).
- Verify documentation links and Git diff scope.

## Upcoming Tasks

### Phase 1 - Product Shell and Design System

- Priority: High.
- Dependencies: [../references/Brand-Identity.md](../references/Brand-Identity.md), [../references/Business-Strategy.md](../references/Business-Strategy.md), local Next.js documentation.
- Estimated Impact: Creates the reusable UI foundation.
- Files: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, future shared UI folders.
- Acceptance Criteria:
  - Layout uses accessible HTML and metadata.
  - Tailwind v4 theme variables align with the brand reference.
  - No one-off visual system conflicts are introduced.
- Notes: Application code is not part of the current documentation reorganization.

### Phase 1 - SEO Baseline

- Priority: High.
- Dependencies: [../references/SEO-Guide.md](../references/SEO-Guide.md), page/content requirements.
- Estimated Impact: Improves crawlability and public page quality.
- Files: `app/layout.tsx`, route metadata files, future sitemap/robots files.
- Acceptance Criteria:
  - Metadata is accurate and brand-specific.
  - Public pages have clear headings and indexable content.
  - Canonical, robots, and structured data changes are intentional.
- Notes: Do not add broad indexing directives without review.

### Phase 1 - Prisma Domain Schema

- Priority: High.
- Dependencies: [../references/Database-Design.md](../references/Database-Design.md), approved entities.
- Estimated Impact: Establishes the data model for application features.
- Files: `prisma/schema.prisma`, `prisma/migrations/`.
- Acceptance Criteria:
  - Models have clear ownership, relations, indexes, and timestamps.
  - Migration SQL is reviewed.
  - Major schema decisions are logged in [DECISIONS.md](DECISIONS.md) or [../decisions/](../decisions/).
- Notes: Database writes and migration application require explicit approval.

## Backlog

- Replace default README content with B&V-specific project setup.
- Add architecture overview documents under [../architecture/](../architecture/).
- Split major ADRs from [DECISIONS.md](DECISIONS.md) into standalone files when the list grows.
- Add CI/CD once build, lint, and deployment requirements are stable.
- Add automated tests once a test framework and pattern are approved.
- Add analytics and monitoring after privacy and event taxonomy decisions.

## Parking Lot

- CMS integration.
- Cloudinary media workflows.
- Authentication and authorization.
- Admin workflows.
- Content operations and editorial preview.

## Completed

### Initial Governance Baseline

- Priority: High.
- Dependencies: Existing repository structure.
- Estimated Impact: Established a first governance source of truth.
- Files:
  - `docs/AGENTS.md`
  - `docs/PLAN.md`
  - `docs/PROGRESS.md`
  - `docs/DECISIONS.md`
- Acceptance Criteria:
  - Governance files existed in one documentation location.
  - Root application source remained unchanged.
  - Files had distinct responsibilities.
- Notes: This milestone is superseded by the current `docs/governance/` reorganization.

### Local Infrastructure Baseline

- Priority: High.
- Dependencies: Docker Desktop or compatible Docker runtime.
- Estimated Impact: Enables local PostgreSQL-backed development.
- Files: `docker-compose.yml`, `docker/postgres/init/`, `prisma/`.
- Acceptance Criteria:
  - PostgreSQL service is defined.
  - pgAdmin service is defined.
  - Prisma configuration points to `prisma/schema.prisma`.
- Notes: Existing files indicate Docker Compose, PostgreSQL, pgAdmin, Prisma config, and one initial migration.

## Dependencies

- [../references/Brand-Identity.md](../references/Brand-Identity.md)
- [../references/Business-Strategy.md](../references/Business-Strategy.md)
- [../references/Technology-Stack.md](../references/Technology-Stack.md)
- [../references/Database-Design.md](../references/Database-Design.md)
- [../references/SEO-Guide.md](../references/SEO-Guide.md)
- [../architecture/README.md](../architecture/README.md)
- [../decisions/README.md](../decisions/README.md)

## Notes

- Use [PROGRESS.md](PROGRESS.md) for chronological implementation history.
- Use [DECISIONS.md](DECISIONS.md) for accepted architectural decisions.
- Use [../references/README.md](../references/README.md) as the reference-document index.
