# PROGRESS.md - B&V Engineering Journal

Entries are chronological. Do not delete historical entries; append corrections or follow-up entries.

Related documentation:

- Governance handbook: [AGENTS.md](AGENTS.md)
- Roadmap: [PLAN.md](PLAN.md)
- Decision index: [DECISIONS.md](../decisions/DECISIONS.md)
- Reference library: [../references/README.md](../references/README.md)
- Architecture index: [../architecture/README.md](../architecture/README.md)
- ADR directory: [../decisions/DECISIONS.md](../decisions/DECISIONS.md)

## 2026-07-26 - Governance Documentation Baseline

### Summary

Established the initial project governance documentation set.

### Files Changed

- `docs/AGENTS.md`
- `docs/PLAN.md`
- `docs/PROGRESS.md`
- `docs/DECISIONS.md`

### Database Changes

- None.
- Existing Prisma state observed: PostgreSQL datasource, Prisma client generator, and initial `HealthCheck` migration.

### API Changes

- None.

### UI Changes

- None.

### Infrastructure

- No infrastructure files were modified.
- Existing configuration observed: Next.js, TypeScript, Tailwind v4/PostCSS, Prisma config, Docker Compose for PostgreSQL and pgAdmin.

### Tests

- Not run; documentation-only task.

### Known Issues

- Current business domain model is not yet represented in Prisma schema.
- Current README appears to be the default create-next-app README.
- Current project branch was not verified during this documentation task.
- `rg` was unavailable due to local access denial, so bounded PowerShell reads were used for discovery.

### Technical Debt

- Replace default README content with B&V-specific setup and project guidance.
- Expand design tokens once brand identity references are finalized.
- Add automated test strategy once a test pattern is approved.

## 2026-10-28 - Local Database Moved to Native PostgreSQL + pgAdmin

### Summary

Migrated the local development database from Docker Compose (`postgres:16-alpine` + `dpage/pgadmin4`) to a natively installed PostgreSQL 16 + pgAdmin 4, per owner request and ADR-0010. Reused the existing `bnv` role/database/password so `DATABASE_URL`'s shape is unchanged. This was requested explicitly by the owner and is an approved exception to the M0.3 milestone's "no Docker changes this milestone" note.

### Files Changed

- `docker-compose.yml` (postgres/pgadmin services removed, left as placeholder)
- `.env.example` (created)
- `docs/decisions/DECISIONS.md` (ADR-0010 added, ADR-0006 marked partially superseded)
- `docs/governance/AGENTS.md`, `docs/governance/PLAN.md`, `docs/references/Technology-Stack.md`
- `README.md` (Local database setup section added)

### Database Changes

- No schema or migration content changes. Existing migrations (`init`, `001_identity_foundation`, `002_catalog_foundation`, `003_product_domain`, `004_commerce_domain`) are reapplied via `prisma migrate deploy` against the native instance.

### Infrastructure

- Local Postgres and pgAdmin now run as natively installed Windows services/applications instead of Docker containers. The Docker volume is retained until the owner deletes it manually.

### Tests

- Not run from this session; native install, role/database creation, and `prisma migrate deploy` are manual/owner steps outside this environment's reach.

### Next Step

- Owner to install PostgreSQL 16 + pgAdmin 4, create the `bnv` role/database, and run `prisma migrate deploy` per the README's Local database setup section.

### Next Step

- Use the governance documents as the source of truth before future application work.

## 2026-07-26 - Documentation Governance Reorganization

### Summary

Reorganized project documentation so root `AGENTS.md` remains a lightweight repository entry point while the authoritative governance set lives under `docs/governance/`.

### Files Changed

- `AGENTS.md`
- `docs/governance/AGENTS.md`
- `docs/governance/PLAN.md`
- `docs/governance/PROGRESS.md`
- `docs/governance/DECISIONS.md`
- `docs/references/Brand-Identity.md`
- `docs/references/Business-Strategy.md`
- `docs/references/Technology-Stack.md`
- `docs/references/Database-Design.md`
- `docs/references/SEO-Guide.md`
- `docs/references/README.md`
- `docs/architecture/README.md`
- `docs/decisions/README.md`

### Database Changes

- None.

### API Changes

- None.

### UI Changes

- None.

### Infrastructure

- Documentation directories prepared:
  - `docs/governance/`
  - `docs/references/`
  - `docs/architecture/`
  - `docs/decisions/`

### Tests

- Documentation link and scope verification required.
- `npm run lint` is optional for this documentation-only task because no application files should change.

### Known Issues

- Phase development reference documents were not present in the current `docs/` inventory at the time of reorganization.
- Git status contained pre-existing non-documentation changes before this task began.

### Technical Debt

- Add phase development and phase 1 step-by-step references to `docs/references/` if supplied later.
- Add architecture overview documents under `docs/architecture/`.
- Split ADRs into individual files under `docs/decisions/` if [DECISIONS.md](../decisions/DECISIONS.md) grows too large.

### Next Step

- Verify relative links in governance documents and confirm `git diff` contains only documentation changes from this task.

## 2026-07-29 - Prisma Client Generation Standard

### Summary

Documented the standard Prisma Client generation workflow so future agents preserve the default `prisma-client-js` generator and avoid custom generated source folders.

### Files Changed

- `docs/references/Database-Standards.md`
- `docs/references/README.md`
- `docs/governance/AGENTS.md`
- `.gitignore`

### Database Changes

- None.

### API Changes

- None.

### UI Changes

- None.

### Tests

- Import search found no references to `src/generated`.

### Next Step

- Continue using `npx prisma generate` with Prisma Client generated under `node_modules/@prisma/client`.

## 2026-08-23 - AI Agent Workflow Files Established

### Summary

Audited the repository against the AGENTS.md Reference Guide methodology and added the remaining tool-agnostic AI workflow artifacts: an ephemeral task-state pair (`plan.md`, `progress.md`) at the repository root, and a permanent session-level history file (`docs/AI_SESSION_LOG.md`). Extended [AGENTS.md](AGENTS.md) with a State Management Protocol, Mechanical Enforcement notes, a When Stuck protocol, a Self-Improvement & Feedback protocol, and a Changelog. Full session detail is recorded in [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md).

### Files Changed

- `docs/governance/AGENTS.md`
- `docs/governance/PLAN.md`
- `docs/governance/DECISIONS.md`
- `docs/AI_SESSION_LOG.md` (new)
- `plan.md`, `progress.md` (new, repository root)
- `.gitignore`
- `AGENTS.md` (root)

### Database Changes

- None.

### API Changes

- None.

### UI Changes

- None.

### Infrastructure

- Verified `.husky/pre-commit` already mechanically enforces lint/format via `lint-staged` on staged files.
- Confirmed no `.claude/settings.json` hooks and no Codex sandbox/approval configuration exist; the safety/approval boundary in [AGENTS.md](AGENTS.md) is currently prose-only beyond the lint/format hook.

### Tests

- Not run; no application, schema, Docker, or package files were changed.

### Known Issues

- `prisma.config.ts` points its seed script at `prisma/seed/index.ts`, but that file does not yet exist (`prisma/seed/data/` is present, the seed entry point is not). Seed data implementation remains a next step, consistent with [PLAN.md](PLAN.md)'s Phase 1 Prisma Domain Schema milestone.
- Pre-existing uncommitted changes to `package.json`, `package-lock.json`, and `prisma.config.ts` were present at session start and are unrelated to this task; they were left untouched.

### Technical Debt

- No Claude Code `PreToolUse`/`PostToolUse` hooks exist yet to mechanically enforce the "Requires explicit approval" boundary in [AGENTS.md](AGENTS.md) (dependency installs, migrations, destructive SQL, schema changes, deletes, full builds/tests, git push/branch changes). Recommended future improvement, not yet approved.

### Next Step

- Use `docs/AI_SESSION_LOG.md` for all future AI-assisted session entries; continue using this file for milestone-level roadmap completion against [PLAN.md](PLAN.md).

## 2026-10-28 - Reference Library Refresh (Pack v1.1)

### Summary

- Replaced stale references and added the missing Phase references and a conflict-resolution document. See [docs/AI_SESSION_LOG.md](../AI_SESSION_LOG.md) for detail.

### Database Changes / API Changes / UI Changes

- None.

### Next Step

- Owner review of [docs/references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md).

## 2026-10-28 - Documentation Reconciliation Audit (update-audit)

### Summary

Reconciled the governance docs against the current repository. This was a documentation-only session: no application, schema, config, or package files were changed. Full detail is in [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md).

### Corrections (VERIFIED against source)

- `DECISIONS.md` moved from `docs/governance/` to `docs/decisions/` and `docs/decisions/README.md` was deleted in commit e01b1ed. About 20 links pointed at the old paths; they are repointed. Historical file lists in this journal were left unchanged.
- The schema is no longer "HealthCheck only". There are 5 migrations and 22 models, and HealthCheck was dropped in `001_identity_foundation`.
- The `package.json`/`package-lock.json`/`prisma.config.ts` changes listed as pending were committed in e01b1ed.
- `src/`, `prisma/seed/`, `.env.example`, and `node_modules/` are all absent on disk.
- Sprint S1's listed installs are already present in `package.json`.
- ADR-0010 is taken, so Phase 1 decisions start at ADR-0011.

### New Findings

- Prisma loads only `prisma/schema.prisma`. The `prisma/models/` copies are stale (no back-relations). This is recorded as a critical invariant in [AGENTS.md](AGENTS.md).
- `Product` uses direct `categoryId`/`collectionId` FKs, which differs from the join-table design in the Database Design Reference.
- Coupons and wishlists are already migrated, although PLAN parks them in Phase 2+.

### Database Changes / API Changes / UI Changes

- None.

### Tests

- Not run. `npx prisma validate` could not run because there is no local install, and it was aborted rather than fetching an unpinned Prisma release.

### Next Step

- Owner: resolve the M0.3 items, which now include D-01 vs Hosting, the Phase 1 scope of coupons/wishlists, `.env.example`, and the `prisma/models/` copies.

## 2026-10-28 - Status + Sync Audit and Full Implementation Plan

### Summary

Audited how far Phase 1 has got: Phase 0 is about 90% done and the Phase 1 MVP about 15%, with no application code yet. Cross-checked Brand-Identity.md, Research_and_Prototype.md, the Figma-Make prototype, the `BnV Docs/Images/` library, and Visual-Asset-Inventory.md. They are not in sync. Rewrote [PLAN.md](PLAN.md) as the full implementation plan: Gate A (Phase 0 close-out), Gate B (Sprint 0.5 Spec Sync), Phase 1 sprints 1A–1I with exit checks and reference links, and Phases 2–4.

### Files Changed

- `docs/references/Implementation-Plan.md` (new master plan), `docs/references/README.md`, `docs/governance/PLAN.md` (now a short tracker), `docs/governance/PROGRESS.md`, `docs/AI_SESSION_LOG.md`.

### Database Changes / API Changes / UI Changes

- None.

### Next Step

- Owner: work through Gate A (decisions D-01 to D-19), then Gate B.

## 2026-10-28 - Gate A Closed: Decisions, Seeding, Env

### Summary

Closed Gate A (milestone M0.3):

- D-01 to D-19 are decided: D-01 Vercel (ADR-0011), D-02 changed to keep the RBAC tables (ADR-0012), the rest accepted (ADR-0013).
- Prisma is pinned to 7.8.0 and connects through `@prisma/adapter-pg` (ADR-0014).
- Built `prisma/seed/` with idempotent seeders and the `db:*` scripts (ADR-0015).
- Added `.env.example`, deleted the stale `prisma/models/` copies, and replaced the README.

### Files Changed

- `package.json`, `package-lock.json`, `.gitignore`, `.env.example` (new), `README.md`.
- `prisma/seed/**` (new), `prisma/models/**` (deleted).
- `docs/decisions/DECISIONS.md`, `docs/references/{Phase-1-Reconciled-Decisions,Database-Standards,Database-Design,Technology-Stack,Implementation-Plan}.md`, `docs/governance/{AGENTS,PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.

### Database Changes

- No schema or migration changes. The seed writes reference data (roles, permissions, super admin, brand, categories, collections) and, with `--demo`, demo products.

### Tests

- `npx prisma validate`, `npm run typecheck` and ESLint on `prisma/seed` passed. Seed runs are recorded in the AI session log.

### Next Step

- Gate B (Sprint 0.5 Spec Sync).

## 2026-10-29 - Gate B Spec Sync (Partial)

### Summary

- Decisions D-20 to D-23 accepted (ADR-0017); D-08 summary row fixed.
- Brand-Identity v1.3 (computed contrast, full token set, shadcn mapping, scales), Research_and_Prototype v1.1, Phase-1-Step-by-Step v2.1, Implementation-Plan v1.2.
- New references: Phase-1-UX-Spec.md (PROPOSED) and Business-Facts.md (values TBD).
- Image library cleaned (duplicates and non-B&V material moved to `BnV Docs/_archive/`), 124 WebP placeholders exported to `public/images/prototype/`, Visual-Asset-Inventory v2.0 with a mapping CSV.

### Files Changed

- `docs/references/**` (including new `Business-Facts.md`, `Phase-1-UX-Spec.md`, `assets/image-mapping.csv`), `docs/decisions/DECISIONS.md`, `docs/governance/{PLAN,PROGRESS}.md`, `docs/AI_SESSION_LOG.md`.
- `public/images/prototype/` (124 new WebP files).

### Database Changes

- None.

### Tests

- Contrast script: 36 pairs pass. Export check: 124 files, correct dimensions, all ≤ 300 KB. Archive move: file count and hashes unchanged.

### Next Step

- Owner: fill Business-Facts.md and commission the logo and real photography.
- Phase 1 sprint 1A.
