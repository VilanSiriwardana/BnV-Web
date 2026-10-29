# AI_SESSION_LOG.md - B&V AI Session History

Permanent, append-only, chronological record of meaningful AI-assisted work sessions on this repository. See the State Management Protocol in [governance/AGENTS.md](governance/AGENTS.md) for how this file relates to [governance/PLAN.md](governance/PLAN.md), [governance/PROGRESS.md](governance/PROGRESS.md), [governance/DECISIONS.md](governance/DECISIONS.md), and the root `plan.md`/`progress.md`.

## Rules

- Append-only. Never erase or rewrite a historical entry; add a follow-up entry to correct or update one.
- One entry per meaningful session: investigation, implementation, debugging, a completed milestone, or a significant decision.
- Never store secrets, credentials, tokens, personal data, or large raw code/log/terminal dumps. Summarize command results, don't paste them.
- At the start of a session, read only the entries relevant to the active task (use the index below once it is needed), not the whole file.
- Once this file exceeds roughly 300-500 lines, add an index at the top (entry date, title, and domain tags) and archive older entries to `docs/AI_SESSION_LOG_ARCHIVE/[YYYY]-[Qn].md`, moving rather than deleting them, per the archiving policy in the AGENTS.md Reference Guide (Section 6.5). Not needed yet.
- This file is finer-grained than [governance/PROGRESS.md](governance/PROGRESS.md): every meaningful AI session gets an entry here, even ones too small to be a roadmap milestone. When a session also completes a [governance/PLAN.md](governance/PLAN.md) milestone, add a corresponding entry to [governance/PROGRESS.md](governance/PROGRESS.md) as well.

## 2026-08-23 09:00 +05:30 - AI Agent Workflow Audit (plan.md, progress.md, AI_SESSION_LOG.md)

### Summary

- Audited the repository against the AGENTS.md Reference Guide methodology (five workflow artifacts: rulebook, task plan, task progress, session log, domain reference documents) at the user's request.
- Confirmed the repository already has a mature governance system (`AGENTS.md` root pointer, `docs/governance/{AGENTS,PLAN,PROGRESS,DECISIONS}.md`, `docs/references/*.md`, `docs/architecture/`, `docs/decisions/`) that covers most of the reference guide's requirements under different names.
- Added the two missing artifacts: ephemeral root `plan.md`/`progress.md` for the current task, and this file as the permanent session-level history. Confirmed with the user, via explicit questions, how to reconcile these with the existing `docs/governance/PLAN.md`/`PROGRESS.md` rather than assume.
- Extended `docs/governance/AGENTS.md` with a State Management Protocol, a Mechanical Enforcement section (verified `.husky` lint-staged hook; verified no Claude Code/Codex hooks exist), a When Stuck protocol, a Self-Improvement & Feedback protocol, and a Changelog.
- Verified `CLAUDE.md` already exists and correctly contains nothing but a pointer (`@AGENTS.md`) to the root `AGENTS.md` - no change needed. Found no evidence of Cursor, Cline, Windsurf, or GitHub Copilot use in this repository (`.cursorrules`, `.clinerules`, `.windsurfrules`, `.github/copilot-instructions.md` all absent) - no adapter files created for them.
- Decided, per user confirmation, not to create a `docs/plans/` directory or add STATUS headers to `docs/references/*.md`; the existing reference map in `docs/governance/AGENTS.md`'s Agent Workflow section already routes tasks to `docs/references/*.md` by domain.

### Files Inspected

- `AGENTS.md` (root), `CLAUDE.md` (root), `.gitignore`, `package.json`, `README.md`.
- `docs/governance/AGENTS.md`, `docs/governance/PLAN.md`, `docs/governance/PROGRESS.md`, `docs/governance/DECISIONS.md`.
- `docs/references/{Brand-Identity,Business-Strategy,Database-Design,Database-Standards,SEO-Guide,Technology-Stack,README}.md`.
- `docs/architecture/README.md`, `docs/decisions/README.md`.
- `.husky/pre-commit`, `.claude/` (commands only, no settings/hooks), `.agents/` (empty), `prisma.config.ts`, `prisma/schema.prisma` (head), directory listings of `app/`, `src/`, `prisma/`, `docker/`, `public/`.
- `git status --short`, `git branch --show-current`, `git log --oneline -15`.

### Files Modified / Created

- Created: `docs/AI_SESSION_LOG.md`, `plan.md`, `progress.md`.
- Modified: `AGENTS.md` (root, added state-file pointers), `docs/governance/AGENTS.md` (added sections listed above), `docs/governance/PLAN.md` (added a completed-milestone entry), `docs/governance/PROGRESS.md` (appended a journal entry), `docs/governance/DECISIONS.md` (added ADR-0009), `.gitignore` (added `/plan.md`, `/progress.md`).
- Not modified: any application code, Prisma schema/migrations, Docker configuration, or package files.

### Verification

- Verified every path referenced in the updated `docs/governance/AGENTS.md` exists in the repository (spot-checked via directory listings).
- Verified `.husky/pre-commit` content directly; confirmed it runs `npx lint-staged`, and confirmed `package.json`'s `lint-staged` config runs `eslint --fix` and `prettier --write` on staged files - this is the only mechanical enforcement currently active.
- Verified no `.claude/settings.json` or `.claude/settings.local.json` exists (no Claude Code hooks configured) and no Codex-specific configuration file exists.
- Verified `package.json` scripts (`dev`, `build`, `start`, `lint`, `prepare`) match what `docs/governance/AGENTS.md`'s Testing section already claimed; no test script exists.
- Did not run `npm run lint` or `npm run build`: no application source was touched, so no file-scoped verification target existed.

### Decisions

- Kept `docs/governance/PROGRESS.md` and this file both in active use rather than merging them, splitting by granularity (milestone-level vs. every session) - see ADR-0009 in `docs/governance/DECISIONS.md` for the full rationale and rejected alternatives.
- Left `docs/references/*.md` without STATUS headers and did not create a `docs/plans/` directory, per explicit user confirmation, since the existing reference map already fulfills the domain-reference-map requirement for this repository.

### Remaining Work

- No Claude Code `PreToolUse`/`PostToolUse` hooks or Codex sandbox/approval configuration exist yet to mechanically enforce the "Requires explicit approval" boundary in `docs/governance/AGENTS.md` (dependency installs, migrations, destructive SQL, schema changes, deletes, full builds/tests, git push/branch changes). Recommended as a follow-up, not yet approved.
- `prisma.config.ts` configures a seed script at `prisma/seed/index.ts`, which does not yet exist (`prisma/seed/data/` exists, empty of files). Seed data implementation remains open, consistent with `docs/governance/PLAN.md`'s Phase 1 Prisma Domain Schema milestone.
- Pre-existing uncommitted changes to `package.json`, `package-lock.json`, and `prisma.config.ts` were present at session start (per `git status --short`) and are unrelated to this task; they were left untouched and should be reviewed by the user separately.

## 2026-10-28 - Reference Library Refresh and Phase 1 Conflict Reconciliation

### Summary

- Reviewed all original PDF references, the five image archives, and the repository governance files (outside the repository, in a Claude.ai chat).
- Found that `docs/references/` held stale or partial content: SEO Guide v1.0 (v3.0 exists), a pre-pivot Brand Identity with broken Markdown, the BaseModel Convention filed as "Database Design" with no table blueprint, and no Phase Development or Phase 1 Step-by-Step references.
- Produced reference pack v1.1 and a Phase 1 Reconciled Decisions document (D-01 to D-19, all PROPOSED).

### Files Modified / Created

- Replaced: `docs/references/{Brand-Identity,Business-Strategy,SEO-Guide,Technology-Stack,Database-Design,Database-Standards,README}.md`.
- Added: `docs/references/{Database-Design-Reference,Phase-Development,Phase-1-Step-by-Step,Phase-1-Reconciled-Decisions,Visual-Asset-Inventory}.md`.
- Updated: `docs/governance/AGENTS.md` (reference map, changelog), `docs/governance/PLAN.md`.

### Verification

- Reference content converted from the source PDFs and spot-checked section by section. Repository facts were taken from the governance files, not from a live checkout. Re-verify versions in `package.json`.

### Decisions

- None accepted yet. D-01 to D-19 await owner approval.

### Remaining Work

- Approve D-01 to D-19 and record ADR-0010 onwards.
- Review the pre-existing uncommitted `package.json`, `package-lock.json`, and `prisma.config.ts` changes.

## 2026-10-28 - Local Database Migrated from Docker to Native PostgreSQL + pgAdmin

### Summary

- Executed an owner-approved blueprint to move the local development database off Docker Compose onto a natively installed PostgreSQL 16 + pgAdmin 4, recorded as ADR-0010 in `docs/decisions/DECISIONS.md` (ADR-0006 marked partially superseded).
- Verified current repo state against the blueprint's assumptions before editing: confirmed `docker-compose.yml`'s actual services (`postgres:16-alpine`, `dpage/pgadmin4`, user/db `bnv`/`bnv`/`bnvpassword`), confirmed `docker/postgres/init/` has no files to replay, confirmed `.env.example` did not previously exist, confirmed `prisma.config.ts` already reads `DATABASE_URL` from `process.env` with no hardcoded host, and confirmed 5 real migrations exist (not just `HealthCheck` as an earlier, stale PROGRESS.md entry implied).
- Owner confirmed via explicit questions: reuse the existing `bnv`/`bnvpassword` identity rather than create a new role, and leave `docker-compose.yml` as a near-empty `services: {}` placeholder rather than deleting it.
- Updated `docker-compose.yml`, created `.env.example`, and updated governance/reference docs (`docs/decisions/DECISIONS.md`, `docs/governance/AGENTS.md`, `docs/governance/PLAN.md`, `docs/references/Technology-Stack.md`, `README.md`, `docs/governance/PROGRESS.md`) to match.
- Did not perform the install, role/database creation, or `prisma migrate deploy` steps - this session's environment has no native PostgreSQL installed and Docker Desktop was not running, so those are owner/manual follow-ups documented in the new README section.

### Files Modified / Created

- Modified: `docker-compose.yml`, `docs/decisions/DECISIONS.md`, `docs/governance/AGENTS.md`, `docs/governance/PLAN.md`, `docs/references/Technology-Stack.md`, `README.md`, `docs/governance/PROGRESS.md`.
- Created: `.env.example`.
- Not modified: Prisma schema/migrations, `.env`, `prisma.config.ts` (already correct), application code, package files.

### Verification

- Confirmed via `where psql`, `pg_isready`, and `docker ps -a` that native PostgreSQL is not installed and Docker Desktop is not running in this session's environment, so the manual installation and `prisma migrate deploy` steps could not be executed here.
- Did not run `npm run lint`/`npm run build`: no application source was touched.

### Remaining Work (owner, manual)

- Install PostgreSQL 16 + pgAdmin 4 natively, create the `bnv` role/database per the README's "Local database setup" section, and run `npx prisma migrate deploy` + `npx prisma generate`.
- Delete the Docker volume manually once the native database is verified working (out of scope for this session).

## 2026-10-28 - Mapped Research, Authentication, and Hosting References

### Summary

- Added `Research_and_Prototype.md`, `Authentication.md`, and `Hosting_Deployment.md` to the reference library index and the governance reference map, with task-routing entries.
- Flagged that the hosting review leaves the B&V platform open (Vercel vs VPS), which conflicts with D-01.
- Noted that the Logging & Observability and Payment Gateway references cited by these reviews are not yet in `docs/references/`.

### Files Modified

- `docs/references/README.md`, `docs/governance/AGENTS.md`, `docs/AI_SESSION_LOG.md`. Reference content was not changed.

## 2026-10-28 - Update-Audit: Docs Reconciled Against Repository

### Summary

- Ran `/update-audit` with an empty scope. The command template refers to `rettzy-docs/`, but this workspace's docs live in-repo under `BnV-Web/docs/`, so those were reconciled instead. There is no `PROJECT_CONTEXT.md`; `docs/governance/{AGENTS,PLAN,PROGRESS}.md` fill that role.
- Verified the repository on branch `main`. Staged but uncommitted: Research, Authentication, and Hosting references plus their index/governance entries.
- Found and repointed broken `DECISIONS.md` and `decisions/README.md` links left by the file move in e01b1ed.
- Found that `prisma.config.ts` loads only `prisma/schema.prisma`, while the `prisma/models/` per-model files are stale copies. Added a critical invariant to `docs/governance/AGENTS.md` and a reality note to `docs/references/Database-Design.md` §19.
- Corrected stale claims: HealthCheck-only schema, pending package changes, `src/` "currently empty", S1 installs pending, and ADR numbering. Recorded that `.env.example` (claimed created by the native-DB session), `prisma/seed/`, and `node_modules/` are absent.

### Files Modified

- `AGENTS.md` (root, one link), `docs/governance/{AGENTS,PLAN,PROGRESS}.md`, `docs/decisions/DECISIONS.md` (header link), `docs/architecture/README.md`, `docs/references/{README,Database-Standards,Database-Design,Database-Design-Reference,Phase-1-Reconciled-Decisions}.md` (link or path fixes; Database-Design §19 note), and this file.
- No application, Prisma, config, Docker, or package files were touched.

### Verification

- `git status`/`git log`/`git show --stat`, directory listings, a `package.json` read, and a diff of `prisma/models/*` against `schema.prisma` (the copies lack back-relations). A grep afterwards confirmed no remaining `governance/DECISIONS.md` links outside historical entries.
- `npx prisma validate` was aborted: with no local `node_modules`, npx began fetching an unpinned `prisma@8.0.0-rc` into its cache. No project files were affected.

### Remaining Work

- Owner decisions: D-01 vs the Hosting reference; whether the migrated coupons/wishlists stay in Phase 1; recreate `.env.example` with a gitignore exception; delete or regenerate the `prisma/models/` copies; `npm install`.

## 2026-10-28 - Status Analysis, Reference Sync Audit, Implementation Plan

### Summary

- Verified the repo state: 22 Prisma models and 5 migrations. There is no application code, `src/`, seed, `.env.example`, tests or CI.
- Read-only audit of the prototype (`BnV Docs/B&V Ecommerce Prototype/src/app/App.tsx`, `src/styles/theme.css`) against Brand-Identity.md, Research_and_Prototype.md and the Reconciled Decisions. It found:
  - Token-name mismatches.
  - Stale nav and homepage order.
  - D-10 violations (fake ratings, testimonials and claims) and D-15 violations (language switcher).
  - Missing checkout and Portfolio pages.
- Read-only audit of `BnV Docs/Images/` (316 files, 276 unique, about 583 MB of PNG) against Visual-Asset-Inventory.md. The inventory covers about 20% of the library. It also found:
  - Duplicate Phase 2 folders.
  - A watermarked file and wrong text inside one banner.
  - Banner crops that don't match D-19.
  - No logo, Portfolio or Our Story assets.
- Published the master plan as `docs/references/Implementation-Plan.md` (findings, Gate A and Gate B, sprints 1A–1I, Phases 2–4). Reduced `docs/governance/PLAN.md` to a short tracker that links to it.

### Files Modified

- `docs/governance/PLAN.md`, `docs/governance/PROGRESS.md`, this file. No code, schema, config or asset changes.

### Remaining Work

- Gate B doc updates: Brand-Identity v1.2, D-20 to D-23, Research corrections, a new Phase-1-UX-Spec.md, and the Visual-Asset-Inventory rewrite.
- Asset cleanup.

## 2026-10-28 - Gate A Implementation (Blueprint 001)

### Summary

- Implemented `.claude/blueprints/001-gate-a-seeding-env.md`.
- **Incident:** the owner ran `npm i prisma@latest`, which installed `prisma@8.0.0-rc.28` (`validate` became an unknown command, and the CLI no longer matched `@prisma/client@7.10.1`). It was reverted with `git checkout` of the package files. Prisma, the client and the adapter are now pinned to exactly 7.8.0 (ADR-0014).
- Verified in `node_modules/@prisma/client/runtime/client.js` that Prisma 7 requires an `adapter` or `accelerateUrl`. Added `@prisma/adapter-pg` and `pg`.
- Owner decisions:
  - D-01: Vercel plus managed PostgreSQL.
  - D-02: CHANGED, keep RBAC.
  - D-03 to D-19: accepted as recommended.
  - bcryptjs; a "Core Range" collection; a `--demo` flag; coupon and wishlist tables kept.
  - The local database is `bnv_db`.
- Recorded as ADR-0011 to ADR-0015.

### Files Modified

- See the PROGRESS.md entry "Gate A Closed".

### Verification

- `prisma -v`: CLI and client 7.8.0. `prisma validate`: valid. `prisma migrate status`: `bnv_db` up to date (5 migrations).
- `npm run typecheck` and `npm run lint` passed. Prettier is clean on `prisma/seed`.
- Ran `npm run db:seed` twice without `SEED_ADMIN_*`. Each run seeded roles 4, permissions 7 and role_permissions 15 (same counts both times, so idempotent), then stopped with the intended error "SEED_ADMIN_EMAIL is not set" (exit 1).
- Super admin, brand, categories, collections and demo products are not yet verified against the DB: waiting for the owner to add `SEED_ADMIN_*` to `.env`.

### Remaining Work

- Owner: add `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (12+ characters) and `SEED_ADMIN_NAME` to `.env`, then run `npm run db:seed` and `npm run db:seed:demo`.
- Commit the changes (not done; awaiting owner).

## 2026-10-28 - Multi-File Prisma Schema (ADR-0016)

### Summary

- Split `prisma/schema.prisma` verbatim into `prisma/schema/{schema,identity,catalog,products,commerce}.prisma` (moved with `git mv`). `prisma.config.ts` now sets `schema: 'prisma/schema'`. Added `npm run db:validate`.
- Updated: ADR-0016 (new), ADR-0005's consequences, `docs/governance/AGENTS.md` (Prisma Schema Source of Truth), Database-Design.md, Technology-Stack.md, Implementation-Plan.md, README.

### Verification

- `npm run db:validate`: "The schemas at prisma\schema are valid".
- `prisma migrate diff` from the committed single-file schema, and from the live `bnv_db`, to `prisma/schema`: both give an empty migration.
- `prisma migrate status`: up to date. `db:generate`, `typecheck` and ESLint on `prisma.config.ts` pass. The seed still runs with the same counts.

### Gotchas

- Run `npx prisma` only from `BnV-Web/`. Run from the parent folder, npx picked up a cached `prisma@8.0.0-rc` (where `validate` and `migrate diff` are "unknown/moved" commands).
- In Windows PowerShell 5, `Set-Content -Encoding utf8` writes a BOM, which makes a temp `.prisma` file unreadable for `migrate diff`. Write temp files from bash, or use a BOM-free encoding.

## 2026-10-28 - Phase-1-Step-by-Step v2.0 (Decisions and Design Sync)

### Summary

- Rewrote `docs/references/Phase-1-Step-by-Step.md` as v2.0, applying the accepted decisions D-01 to D-19, ADR-0010 to ADR-0016, and the Brand-Identity v1.2 design rules (full light/dark token set, shape/motion rules, dark component rules, §23 homepage order, §42 portfolio rules).
- Marked Gate B items as OPEN (D-20 to D-23, Brand-Identity contrast/muted/shadcn gaps) instead of deciding them. Added a "Changes from v1.0" section; v1.0 text stays in git history.
- Section 20 now maps v1.0 sprints S0–S8 to Gate A/B and sprints 1A–1I and links to Implementation-Plan.md instead of duplicating it.

### Findings recorded in the guide (VERIFIED)

- `tsconfig.json` maps `@/*` to `./*`, not `./src/*`; sprint 1A must settle it.
- `orders.status` defaults to `pending` (D-04 starts at `inquiry_received`); `orders.payment_status` (D-04) does not exist; products have no SEO columns. Listed as sprint 1C changes.
- Next.js 16 renamed Middleware to Proxy (`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`); D-12 server-side guards stand.

### Files Modified

- `docs/references/Phase-1-Step-by-Step.md`, `docs/references/README.md` (version row), this file. No code, schema, config or asset changes.

## 2026-10-29 - Gate B: Decisions D-20 to D-23 (ADR-0017) and Spec Sync

### Summary

- Blueprint 003: Reconciled Decisions v1.2 (D-08 row fixed; D-20 to D-23 ACCEPTED), ADR-0017, Phase-1-Step-by-Step v2.1 (all `OPEN (D-2x)` markers resolved), Implementation-Plan (1C/1F rows corrected), PLAN.md.
- Blueprint 002 steps 2–6: Brand-Identity v1.3 (computed contrast, full light/dark token set, shadcn mapping, `gold`/`primary-text`/`gold-text`, scales); new Business-Facts.md (all values TBD); Research_and_Prototype v1.1 (counts corrected, superseded notes); new Phase-1-UX-Spec.md (PROPOSED); `BnV Docs/` duplicates and non-B&V material moved to `BnV Docs/_archive/`.
- Owner ran `npm run db:seed` twice: identical counts (roles 4, permissions 7, role_permissions 15, super admin, brands 1, categories 18, collections 7). Closes the Gate A seed verification. Demo seed not yet run.

### Verification

- Prototype counts re-verified from `App.tsx`: 56 `PageId` values; 22 unique Unsplash URLs (102 references).
- Contrast: 36 token pairs computed with a script; all pass (≥ 4.5 text, ≥ 3 UI). Six v1.2 pairs failed and were changed.
- Archive: every moved folder/zip was SHA-256 checked first (Phase 2 sets 40/40 match; all 9 zips fully present as loose files). `BnV Docs/` file count 451 before and after; hash multiset identical.
- Image library after cleanup: 276 unique images, 533 MB, 0 duplicates.

- Owner approved the image picks. Exported 124 WebP placeholders (82 banner files for 21 pages, 42 product images for 7 categories); every file has the right size and is ≤ 300 KB (largest 136 KB). Excluded the Journal banners (Phase 2) and the dark FAQ banner, whose in-image text reads "BLUSH & VIOLET". Mapping: `docs/references/assets/image-mapping.csv`.
- Visual-Asset-Inventory v2.0; references README, Hosting note, Implementation-Plan v1.2, PLAN.md (Gate B Partial, next 1A), PROGRESS.md.

### Remaining Work

- Owner values in Business-Facts.md and the launch-blocking commissions.
- Open items in Phase-1-UX-Spec.md (optional checkout email, gift columns, variant options, double opt-in).
- The demo seed's image paths (`prisma/seed/data/products.ts`) do not match the exported names; align them in 1C.

### Known Gotchas

- No Python on this machine; use Node for scripted edits.
- `D-20` needs no schema change: `orders.payment_method` and `payments.method` already exist.

## 2026-10-29 - Sprint 1A Foundation Finish (Blueprint 004)

### Summary

- Pointed `@/*` at `./src/*` and created the sprint 1A config, constants and utils modules (Phase-1-Step-by-Step §3.2–3.3).
- Fixed the demo seed image paths (pulled forward from 1C).

### Verification

- Checked `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`: `src/` is supported; the root `app/` is used because there is no `src/app/`.
- `typecheck`, `lint` and `build` pass. `db:seed:demo` twice with identical counts (products 12, variants 26).

### Known Gotchas

- Never create `src/app/`; routes stay in the root `app/` (D-14).

## 2026-10-29 - Demo Catalog Expanded to 119 Products

### Summary

- One demo product per Phase 1 product image (owner request): 19 women, 20 men, 20 jewelry, 20 accessories, 20 candles & home, 10 gift boxes, 10 couples. Names come from viewing each image; no unverified material claims (`gold-tone`, `satin-finish`), LKR prices (D-10).
- Exported 77 more WebP images (`product-<group>-07…`) and appended them to `docs/references/assets/image-mapping.csv`.
- Added child categories women-knitwear, women-outerwear, men-knitwear, men-outerwear (categories now 22).
- The products seeder now archives demo products that are no longer in the data file (never deletes).

### Verification

- 119 products, 227 variants, unique slugs and SKUs; every image URL exists. `db:seed:demo` twice: first run archived the 12 old demo products, second run identical with 0 archived. Typecheck and ESLint pass.

## 2026-10-29 - Sprint 1B Design System

### Summary

- Implemented blueprint `.claude/blueprints/005-sprint-1b-design-system.md`: tokens and fonts, theme toggle, six shadcn primitives, header/footer/mobile drawer, `/style-guide`.

### Verification

- Typecheck, lint and build pass; built CSS contains the token utilities and `.dark` variant; `/style-guide` HTML has `noindex, nofollow`.

### Known Gotchas

- The shadcn CLI resolved a `utils` alias of `@/lib/utils/cn` to a bare `"cn"` import and installed the unrelated npm package `cn`. Fixed: `components.json` now uses `@/lib/utils`, backed by `src/lib/utils/index.ts` re-exporting `cn`. Keep that alias.
- shadcn `add` without `init` does not install `tw-animate-css`; Sheet and Accordion animations need it.

## 2026-10-29 - Sprint 1C Database Completion

### Summary

- Implemented blueprint `.claude/blueprints/006-sprint-1c-database-completion.md`: join table, five Phase 1 tables, shared Prisma client, seed update (ADR-0018).

### Verification

- Migration applied with no drift; seeds run twice clean; every active product is linked to a collection; typecheck passes.

### Known Gotchas

- `prisma migrate dev` is refused in non-interactive shells when it raises a data-loss warning. Generate the SQL with `prisma migrate diff --from-config-datasource --to-schema prisma/schema --script`, hand-edit it, and apply it with `prisma migrate deploy`.

## 2026-10-29 - Sprint 1D Homepage

### Summary

- Implemented blueprint `.claude/blueprints/007-sprint-1d-homepage.md`.
- Decisions taken as the plan's recommended defaults:
  - The Portfolio preview is a "coming soon" teaser with a Work With Us CTA.
  - The social gallery is hidden until handles are confirmed.
  - The announcement bar uses neutral copy with no claims.
  - Consent time = `subscribedAt` (no schema change).
  - Links to routes built in 1G are accepted.
  - The `custom` seed category is untouched.
  - Category images come from the prototype banners.

### Deviations from the blueprint

- The four teasers share one file, `src/features/home/sections/teasers.tsx`, and the product sections share `product-section.tsx`.
- `ArtDirectedImage` was added for the light/dark × desktop/mobile swap.
- "New Arrival" is computed in the query (`isNew`) because the React purity lint rule forbids `Date.now()` during render.

### Verification

- Typecheck, lint and build pass.
- `next start` HTML contains all sections with LKR prices and the tagline title.
- Newsletter submissions were not exercised, because DB writes need approval.

### Known Gotchas

- Zod 4: use `z.flattenError(error)`; `error.flatten()` is deprecated.
- A Prisma select reused across queries needs `satisfies Prisma.ProductSelect`, not `as const`, because readonly `orderBy` arrays fail typecheck.
- The announcement bar renders below the header because the header lives in the layout. Follow-up: move it into the layout when 1E needs it site-wide.

## 2026-10-29 - Image Quality, Lazy Loading and Motion

### Summary

- Implemented blueprint `.claude/blueprints/008-image-quality-lazy-loading-motion.md`.
- User decisions: generated blur, re-export now, AVIF + WebP, Framer Motion.
- The user asked whether animations were planned from the start. Answer: yes (Brand-Identity §25, Step-by-Step §5.3). `framer-motion` was installed but unused, and 1D's `scale-105` broke the 1.03 maximum.

### Deviations

- `blurFor` lives in `src/lib/utils/image.ts` and is **not** re-exported from the `@/lib/utils` barrel, so client components importing `cn` never pull in the 36 KB placeholder map.
- `ArtDirectedImage` puts the blur as a CSS background on `<picture>`, because `getImageProps` does not support `placeholder` (Next docs).

### Known Gotchas

- Banner originals (1672–1916×821) cannot produce 2× banners.
- Every product original sits below 1200px wide, so all 119 were capped at their native 4:5 crop.
- `Reveal` content is server-rendered at `opacity: 0` until hydration, so it is invisible without JS. The text is still in the HTML for SEO.
- The light hero image is still fetched eagerly in dark mode (accepted cost).

## 2026-10-29 - Form Validation Standard

### Summary

- Implemented blueprint `.claude/blueprints/009-form-validation-standard.md`.
- The owner's "failure" was that a duplicate email showed the normal success message. The server was correct (no duplicate row); the behaviour was intentional anti-enumeration. It now shows an info notice (ADR-0019).

### Known Gotchas

- `useActionState` cannot be reset. The newsletter form tracks a `dismissed` state object to return from the success panel to the form.
- Zod checkboxes: `useInput` parses an unchecked box as `null`, so `z.literal('on')` reports its custom message.
- Hooks live in `src/lib/forms/` because D-14 defines no `src/hooks/`.

## 2026-10-29 - Sprint 1E Catalog + PDP

### Summary

- Implemented blueprint `.claude/blueprints/010-sprint-1e-catalog-pdp.md`. Decisions: dynamic `[pillar]` routing, add-to-cart stubbed until 1F, owner TBD placeholders, and a lean set of shop filters.

### Deviations

- Shop filters use a plain GET form (works without JS) instead of a client sort select.
- The PDP primary image uses `loading="eager"` with `fetchPriority="high"`, because Next 16 deprecates `priority`.
- `cardSelect` now also selects variant inventory. `toCard`/`toCards` output is unchanged.

### Known Gotchas

- `notFound()` on an ISR product page returns HTTP 200 with `noindex`, because the root `loading.tsx` streams the response.
