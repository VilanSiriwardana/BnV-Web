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

## 2026-10-29 - Sprint 1F Cart + Checkout Inquiry

### Summary

- Implemented blueprint `.claude/blueprints/011-sprint-1f-cart-checkout.md`. Owner decisions: add `orders.payment_status`, decrement stock at dispatch, `BNV-YYMMDD-XXXX` order numbers, delivery fee confirmed on WhatsApp, no COD limit yet.

### Deviations

- The cart count is fetched client-side after mount instead of in the root layout, because reading cookies in the layout would make every ISR page dynamic.
- Vitest 3 instead of 5: Vitest 5 requires `@types/node` ≥ 22 and the project pins 20.
- `order_items` has no gift-note or variant-title column, so the snapshot stores options in `selected_options` only.

### Known Gotchas

- React 19 resets uncontrolled fields after an action, so checkout selects, radios and textareas are controlled.

## 2026-10-29 - 1F QA: checkout generic error

### Summary

- Implemented blueprint `.claude/blueprints/012-checkout-stale-prisma-client.md`. Checkout failed because `next dev` was started before migration 006 and kept the old Prisma client cached on `globalThis`. Fix: restart the dev server. Cart and checkout action `catch` blocks now log the cause with `console.error`.

## 2026-10-29 - Sprint 1G Custom, Contact, Portfolio

### Summary

- Implemented blueprint `.claude/blueprints/013-sprint-1g-custom-contact-portfolio.md`. Decisions: uploads deferred, portfolio empty with "Coming soon", policy stubs.

### Deviations

- Textarea and Select primitives live in `src/components/ui/` (the blueprint's fallback path), next to `input.tsx`.
- Instead of three loose components, one `form-kit.tsx` registers fields with `FormShell` for submit-time validation. Registration goes through a stable callback ref, so focus order survives re-renders.
- `sriLankaPhoneSchema` moved to `src/lib/forms/fields.ts` and is re-exported from checkout. `checkout-form.tsx` now types `useInput<HTMLInputElement>` explicitly.
- Optional step 9 (Our Story, FAQ) was skipped.

### Known Gotchas

- `Omit` on the collaboration discriminated union keeps only the shared keys at type level. The runtime spread still carries the variant fields to Prisma.

## 2026-10-29 - Sprint 1I SEO, QA, CI (code only)

### Summary

- Implemented blueprint `.claude/blueprints/015-sprint-1i-seo-qa-ci.md`. Decisions: Supabase for production Postgres (ADR-0011 amendment); robots blocks only `/admin` and `/api/`; generated OG image, `/api/health` and security headers in scope; no deploy until the domain is confirmed.
- Added Twitter/OG defaults to `pageMetadata`, Organization and WebSite JSON-LD in the root layout, `app/error.tsx`, `app/global-error.tsx`, `app/opengraph-image.tsx`, the cookie-consent banner with consent-gated GA4 (`src/components/consent/`, `src/lib/consent.ts`), a footer "Cookie settings" link, `.github/workflows/ci.yml` and `postinstall: prisma generate`.

### Deviations

- Step 3 skipped: `CatalogListing` already renders CollectionPage and Breadcrumb JSON-LD.
- Next 16 error boundaries use `unstable_retry` (not `reset`).

### Known Gotchas

- `next build` queries the database (static product and collection params), so CI runs a Postgres 16 service plus `db:deploy` before the build.
- `brand` values are typed as literal `null`; cast to `string | null` before narrowing.

### Open

- Lighthouse, PSI and accessibility passes; Vercel + Supabase setup; domain; GA4 and Search Console IDs.

## 2026-10-30 - Design skills setup

### Summary

- Implemented blueprint `.claude/blueprints/016-design-skills-setup.md`. Installed 16 Emil Kowalski skills to `~/.claude/skills` with `npx skills@latest add emilkowalski/skills -g -a claude-code -y`.
- Added the Design Skills section to `docs/governance/AGENTS.md` and ADR-0022.

### Deviations

- Adapted the setup doc for React: dropped its jQuery rules and kept the React Emil skills.

### Open

- User actions: `npx impeccable install`, Taste Skill `/plugin` install, restart, `/impeccable init` and `/impeccable document`.

## 2026-10-30 - Impeccable context and brand fonts

### Summary

- `/impeccable init` and `document`: created `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json` from Brand-Identity v1.3 and the code.
- Implemented `.claude/blueprints/017-brand-fonts-cinzel-cormorant.md`: Cinzel display, Cormorant Garamond copy, Inter UI, Noto Serif Sinhala fallback (ADR-0023). Brand-Identity v1.4.

### Deviations

- Body fallback is Georgia rather than the requested Arial.

### Known Gotchas

- New controls outside `src/components/ui` must add `font-sans`, or they inherit Cormorant.

### Open

- Phase B: skills-driven homepage pass (critique → plan → implement → review-animations → break-ui → polish → audit).

## 2026-10-30 - Homepage redesign

### Summary

- Ran the `/impeccable critique` of the homepage (23/32, detector clean) and implemented `.claude/blueprints/018-homepage-redesign.md` (ADR-0024, Brand-Identity v1.5).
- New sections: trust strip, brand story, showcase rail with tabs, teaser bento, coming-soon strip. Rebuilt the hero; New In carries Limited Drop badges; the header condenses on scroll.

### Deviations

- Product names use the documented `text-small` step (Inter) instead of 15px, because the Impeccable detector flagged an off-ramp size.
- Eyebrows were kept and extracted into `Eyebrow`, although Impeccable's craft floor bans them. Pending an owner decision.

### Open

- Browser QA not yet run: Emil review-animations and break-ui, `/impeccable polish` and `audit`, and re-critique.

## 2026-10-30 - Mockup alignment: shared system and homepage

### Summary

- Compared all 10 PageImages mockups with the code (gap reports in the plan). Implemented `.claude/blueprints/019-mockup-alignment-system-and-home.md` (ADR-0025, Brand-Identity v1.6).
- Added `HeadingAccent`, `GoldHeart`, a split `PageHero` (default), `IconRow`, `Steps`, `FeatureCard` and `CtaBand`, plus bordered product and category cards. The announcement bar now shows on every storefront page, and the footer has a newsletter and trust box.
- Homepage: split hero, Shop by Collection cards, Featured Favorites carousel, Gift Box banner, and the closing row.

### Deviations

- `FeatureCard` uses its own markup with the `Card` styles rather than wrapping `Card`, whose padding and gap don't fit an image-top card.
- Lucide v1 has no brand icons, so footer social icons are inline SVG paths.

### Known Gotchas

- `/our-story` and `/faq` still return 404 until blueprint 020.
- The homepage shows two newsletter forms: the closing row and the footer.

### Open

- Blueprints 020 to 023. The owner still has to fill email, phone and social handles in `src/config/brand.ts`.

## 2026-10-30 - Design skills audit pass (Emil + Impeccable)

### Summary

- Implemented `.claude/blueprints/024-emil-skills-audit-pass.md`. This was a read-only pass, and no source files changed. Findings are in `.claude/plans/024-audit-findings.md`.
- First Emil runs: improve-animations (the motion system is sound; the sheet uses the default easing), break-ui as a report only (card badge and label overflow, LKR 0 price), mobile-native (no tap-highlight reset, no themeColor).
- Impeccable re-critique (dual-agent, source only): 22/32, down from 23. The detector found 1 advisory issue. P1 items: the gift-box builder promise contradicts its "coming soon" label, and trust content is duplicated in the closing row.

### Deviations

- Taste deferred (rebuild conflicts with approved mockups).
- `/impeccable audit` not run separately; overlaps the detector and Emil checks. Run before shipping.
- break-ui ran without its demo toggle so no code changed.

### Open

- Owner decisions: the gift-box builder roadmap, story-first vs shop-first order. Next: `/plan` the fixes as blueprint 025.

## 2026-10-30 - Audit fixes: homepage polish

### Summary

- Implemented `.claude/blueprints/025-audit-fixes-homepage-polish.md`. It fixes all P1–P3 findings from `.claude/plans/024-audit-findings.md`.
- The gift banner now reads "Ready-to-give gift boxes" (the builder is not in launch scope). The closing row's duplicated ordering steps are replaced by a Shop New In / Find a Gift card. The page stays shop-first.
- Two mid-page headings (gift banner, large bento tile) drop from h1 to h2 size. Hearts stay only on the hero, the brand story and the closing row. "Featured Favorites" is renamed "New In".
- Sheets use `ease-standard` (300ms open, 200ms close). Carousel dots no longer use `transition-all`.
- Cards: product badges truncate, collection names clamp to two lines, and a price of 0 shows "Price on request".
- Mobile: the tap-highlight colour is reset, `viewport.themeColor` is set, and scrollers use `overscroll-x-contain`.
- Removed the disabled search icon (and `search` from `utilityNav`), the header scroll-progress bar with its CSS, and the spotlight on the Coming-soon pills. Image hover zooms all run at 700ms. The testimonial quote mark uses `text-h1`.

### Open

- Browser QA at 375/768/1440, then run `/impeccable critique` again (baseline 22/32). Verify the Sinhala font fallback and the showcase-tab keyboard motion on a device.

## 2026-10-30 - UI refinement: status colours, forms, nav, gallery

### Summary

- Implemented `.claude/blueprints/026-ui-refinement-forms-status-nav-gallery.md` (ADR-0026).
- Status tokens: destructive, success, warning and info, each with soft and text variants (saturated in light, softened in dark, all AA). New `text-label` and `text-micro` steps. Badges are smaller, and the form and PDP text is larger.
- Form kit: `SelectField` now renders `Combobox`, and a new `DateField` wraps `DatePicker`. Both post through hidden inputs. All native selects and date inputs were replaced (forms, checkout district, admin filters and status). Placeholders and hints were added to 61 fields. `useInput` gained `change()`, and Combobox and DatePicker accept `ref` and aria props.
- Nav: `NavPill` and `useHoverIndex` (`components/motion/nav-pill.tsx`), the `navItem` style, `HeaderNav` with a gliding underline, and the admin and mobile navs with gliding pills.
- PDP gallery: sticky and viewport-high on `lg`, a vertical thumbnail strip, a 2x hover lens and a blur crossfade; a swipe carousel on mobile. The lightbox zooms 1x–4x (buttons, wheel, pinch, double-click, keys) and pans by dragging.

### Deviations

- The light warning colour was darkened from #b26b00 to #9a5c00 so white text passes AA (5.38:1).
- The shop filters are a top bar, not a sidebar. They got the richer field and option hover through `fieldTrigger` and `optionRow` instead of `navItem`.
- The gallery's desktop layout starts at `lg`, matching the PDP's two-column grid.
- The lightbox wheel zoom scales around the centre, not the cursor.

### Open

- Browser QA: form submissions, nav motion, and gallery zoom on desktop and a phone.

## 2026-11-12 - Love Site: docs moved in and six-phase plan written

### Summary

- Moved the four birthday Love Site docs from the notes folder into `docs/references/love-site/`. Renamed the two general scroll-3D guides to `Scroll-3D-Guide-Overview.md` and `Scroll-3D-Guide-Complete.md` (no spaces in file names).
- Wrote `docs/references/love-site/Love-Site-Implementation-Phases.md`: six phases covering milestones M0 to M16, with exit criteria, a file map and a deadline cut line. Added the folder index `love-site/README.md`.
- Recorded the repo corrections to the guidebooks (R1 to R8). The main ones: the root layout's `StorefrontChrome` only hides the shop chrome on `/admin`, so `/love` must be added there. Component files are kebab-case. The `[data-love-root]` token aliases must include `gold-text`, `ring`, `border`, `muted-foreground`, `secondary` and `surface-elevated`. `/love` stays out of `robots.ts`.
- Linked the Love Site from the root `AGENTS.md`, `CLAUDE.md`, `docs/references/README.md` and the handbook's routing list (`docs/governance/AGENTS.md`).
- No application code, configuration or package files were changed.

### Open

- Owner approval of the phase plan and the Phase 1 approvals (dependencies, route and chrome exception, motion exception, GSAP skills, music).
- Birthday date (decides whether to follow the full plan or the cut line in §11).
- `SpotlightProvider` behaviour on `/love` (R8, UNCERTAIN).

## 2026-11-12 - Love Site: detailed per-phase guides

### Summary

- Added `docs/references/love-site/phases/` with six step-by-step phase guides (Phase 1 to 6) and an index. Each guide has: context, what you will see, a read-first list, the tech used, numbered steps with "you should see" checks and reduced-motion versions, contracts, tests, skills, an exit checklist, risks, doc updates, a commit plan and the handoff to the next phase.
- Linked them from the overview (now v1.1), `love-site/README.md` and the root `AGENTS.md`.
- Documentation only; no application code, configuration or package changes.

## 2026-11-12 - Love Site Phase 1: foundations and static skeleton

### Summary

- Version research with read-only `npm view`. Chose versions at least 14 days old: three 0.186.1, @types/three 0.186.0, @react-three/fiber 9.8.2, drei 10.7.9, @react-three/postprocessing 3.2.2, postprocessing 6.39.5, gsap 3.15.0, @gsap/react 2.1.2, lenis 1.3.27. Nothing installed.
- Added ADR-0027 (dependencies), ADR-0028 (route and chrome exception) and ADR-0029 (motion exceptions and tiers) as Accepted; the owner approved all Phase 1 items on 2026-11-12, GSAP skills included. ADR-0030 (audio) is Proposed until the music is chosen.
- `scripts/prepare-love-images.mjs` uses Next's own `sharp` 0.34.5 (owner choice). It produced 25 `love-*.webp` placeholders plus 8 orb squares from couple, gift-box and jewellery prototypes. The sources are 960–1122 px, so outputs are not enlarged.
- `StorefrontChrome` now also hides on `/love` and `/love/*` (an exact segment check, so `/love-websites` is unchanged). R8 resolved: `SpotlightProvider` only reacts to `[data-spotlight]` elements and needs no exclusion.
- Typed config in `src/features/love/config/` with placeholder names, English only and a 28-character random slug, plus a Vitest shape test.
- `app/love/[slug]/page.tsx`: noindex/nofollow, neutral title, `notFound()` for unknown slugs.
- `[data-love-root]` night/day alias block in `app/globals.css`. The derived tokens are redeclared on every `[data-dawn]` element, because `var()` resolves where a token is declared. Phase 2 drives `--dawn` on the root only.
- Client root `love-experience.tsx` and ten static sections with a shared `LoveSection` shell and `LovePhoto` (`next/image` with blur).

### Verification

- `typecheck` passes. `lint` has 0 errors (all warnings are in existing skill scripts). The Vitest config test passes.
- Dev server: the slug renders all ten sections, one `h1`, no header, `noindex, nofollow` and the title "A little something". A wrong slug renders the 404 page; the HTTP status is 200 because the root `loading.tsx` streams first, and `noindex` is still added.
- `npm run build` compiled, then failed collecting `/products/[slug]` data: local Postgres was "in recovery mode" after a worker out-of-memory crash. This is an environment problem, unrelated to `/love`.

### Open

- Re-run `npm run build` once Postgres is healthy.
- Browser checks: Tab to the skip link, 375 px layout, contrast. Then `/impeccable critique` and `break-ui` (phase Step 10).
- Commits not made (not requested).

## 2026-11-12 - Love Site Phase 2: scroll engine, theme and 3D smoke test

### Summary

- Branch `feat/love-phase-2`, 7 commits (blueprint `.claude/blueprints/028-…`). Packages installed with `--save-exact` at the ADR-0027 versions; GSAP agent skills copied to `.claude/skills/gsap-*` (gitignored, local only).
- Lenis 1.3.27 facts (VERIFIED in the installed `.d.ts`): RAF off is `options.autoRaf: false` (the `autoRaf` prop is deprecated); CSS is `lenis/dist/lenis.css`; `useLenis()` returns the instance.
- `engine/motion-prefs.ts` + `motion-prefs-provider.tsx`: `useSyncExternalStore` for reduced motion, Save-Data and the `sessionStorage` Calm flag (`love:calm`); server snapshot = motion, so no hydration mismatch.
- `engine/scroll-engine.tsx`: `ReactLenis root` driven by `gsap.ticker`, `lagSmoothing(0)`, `ignoreMobileResize`; not mounted in Calm. `useLoveScroll()` falls back to native scroll.
- Repo fix: the Phase 1 per-section `[data-dawn]` rules would override a scrubbed root `--dawn`. They are now scoped to `[data-love-root]:not([data-love-motion])` (Calm/static only, with a 300 ms colour transition).
- `StickyStage` + `LoveSection stage` prop. Deviation from the guide: the stage is `min-height: 100svh` without `overflow: hidden`, because the Phase 1 static content of Memories, Timeline and Letter is taller than a screen and would be clipped. Switch to `height: 100svh; overflow: hidden` when Phases 3–5 replace that content.
- `engine/story.ts` (`gsap.matchMedia`, section stubs, `applyStaticStory`), `theme-timeline.ts` (`--dawn` over Dawn, `--depth` over Memories/Timeline), `--progress` trigger, `ui/progress-heart.tsx`, `ui/calm-mode-toggle.tsx`.
- `engine/tiers.ts` (+ Vitest), `tier-provider.tsx`, `heart-state.ts`, `canvas/token-colors.ts` (reads the hex `--night-*`/`--day-*` aliases; derived roles are `color-mix()` strings that three cannot parse) (+ Vitest), `canvas/love-canvas.tsx` (test sphere, `PerformanceMonitor`, one Bloom, off on `low`), `dev/heart-debug-panel.tsx`.

### Verification

- `tsc --noEmit`, ESLint on `src/features/love` and `app`, and Vitest (12 tests) pass.
- NOT verified: `npm run build` and the browser checks. The machine had ~1.5 GB free RAM with ~800 orphaned `node.exe` processes; builds failed with out-of-memory, local Postgres went into recovery mode, and the Turbopack dev server panicked. Environment problem, not `/love` code.

### Open

- Clean up the orphaned node processes (or reboot), then: `npm run build` (check three/R3F only in `/love` chunks), browser pass on desktop + phone width, Calm/reduced-motion toggling, `?debug` tier switching, 4× CPU step-down, Safari/Firefox, production `?debug` absent.

## 2026-11-13 - Love Site Phase 3: the heart

### Summary

- On `main` by request (no branch), 8 commits (blueprint `.claude/blueprints/029-…`).
- `canvas/heart-geometry.ts` (seeded `heartPoint`/ribbon/scatter generators, Vitest), `heart-shaders.ts`, `heart.tsx` (one `Points`, 18k buffers, `setDrawRange` per tier, NDC → world from the live viewport, invisible hit disc for taps).
- `engine/heart-director-core.ts` (pure queue/drop/settle state machine, Vitest) + `heart-director.ts` (GSAP timelines per Experience §3.5; Phase 4–5 events stubbed as `pulse`). `pulse` tweens `heart.flinch` as a scale offset so it never fights the scrubbed `heart.scale`.
- `canvas/mini-hearts.tsx` (instanced, `spawnTapHearts`), `canvas/petals.tsx` (shader-driven, `heart.petalRelease`), `tiers.ts` gains `petals`.
- `engine/audio-engine.ts` + `audio-bands.ts` (Vitest), `ui/music-toggle.tsx`. Reads `site.music.src`; the 72 bpm synthetic lub-dub runs when the file is missing, errors, or is muted.
- Gate is now a fixed overlay (`sections/gate.tsx`), outside `<main>`. Heart state additions: `roll`, `idleScale`, `idleGlow`, `petalRelease`, `cameraZ`. Token roles: `primary-hover` (lilac), `surface`, `foreground`.
- Deviations: (1) drei `useProgress` not used in the gate, because importing drei there pulls three into the main chunk; readiness comes from the canvas `onCreated` plus the 6 s timeout. (2) Reduced motion = Calm in this codebase (no canvas), so canvas reduced-motion variants (still petals, no parallax) never render; the director still has reduced variants. (3) Audio was committed before gate/hero, and gate + hero share one commit, because the tap handler needs both.

### Verification

- `tsc --noEmit`, ESLint on `src/features/love`, Vitest (27 tests) pass. `npm run build` passes with `NODE_OPTIONS=--max-old-space-size=6144`.
- NOT verified (UNCERTAIN): any browser behaviour: the weave look and timing, shader tuning, SplitText aria output, iOS audio unlock, fast-scroll stress, positions at 375/768/1440, draw calls.

### Open

- Add the music file to `public/audio/` and set `music.src` in the site config.
- Browser pass with `?debug`; tune shader brightness and ribbon sizes by eye. ADR-0029/0030 notes, `PROGRESS.md` entry after verification.

## 2026-11-13 - /love dev-log cleanup

- `CartProvider` no longer calls `getCartSnapshot()` on `/love` paths (reuses the now-exported `isLovePath` from `storefront-chrome.tsx`); it loads once on the first non-Love path. Blueprint `030`.
- `THREE.Clock` deprecation warning left as is: it comes from `@react-three/fiber` 9.8.2's own store under three 0.186, not our code. Harmless.

## 2026-11-13 - Love Site: heart canvas hidden behind sections

- Cause: `[data-love-root] main` (z-index 10) sits above the fixed canvas (z-index 0) and every `LoveSection` had an opaque `bg-background`, so the heart (and Phase 2's test sphere) was never visible. Fix: `[data-love-motion] main [data-dawn] { background-color: transparent; }` in `app/globals.css`; Calm keeps solid sections. Blueprint `031`.

## 2026-11-13 - Love Site Phase 4: Memories and Timeline

### Summary

- Blueprint `.claude/blueprints/033-love-site-phase-4-night-story.md`. Not committed.
- Memories: `canvas/memory-orbs.tsx` + `orb-shaders.ts` (fresnel shell, desaturated photo disc in a `Billboard`, invisible hit sphere, tier orb count), `engine/memories-state.ts` (hover/focus/projected screen positions, open-request bus), `engine/memory-layout.ts` (orb formula, rail end), `canvas/projection.ts`, `ui/memory-dialog.tsx` (Radix primitives + framer-motion scale from the orb, `lenis.stop/start`, portal inside `[data-love-root]`), `sections/memories.tsx` (sr-only twin buttons, ticker-driven focus ring, counter, completion `glowUp`; Calm/static = card grid that opens the same dialog).
- Timeline: `sections/timeline.tsx` (desktop S-curve + mobile left-edge SVG thread, node buttons with `aria-current`, cards; Calm/static = list with a glowing featured card), `engine/timeline-progress.ts`, `engine/svg-ndc.ts`, `buildTimeline` in `story.ts` (one trigger: dashoffset, heart on the tip via a stage-relative CTM, node activation, strike armed / re-armed below 45 %).
- Arrow strike: `canvas/arrow.tsx` (mounted only while `heart.arrow > 0`), `canvas/shock-ring.tsx`, `canvas/sparks.tsx` (60-point pool, `emitSparks`), director `arrowStrike` + timeline-only `boost` (+0.15, set at strike start so an interrupted strike settles bright; `director.resetBoost()`).
- Heart state: `lean`, `cameraShake`, `arrow`. `heart.tsx` damps depth with the camera, snaps on jumps > 10 units, exports `heartWorld`.
- Decisions: no `engine/camera-rig.ts` (`heart.cameraZ` stays the only camera writer); optional `memories[].orb` in the config; shared `DialogContent` untouched; pointer routing = default layers (ADR-0029 amendment).
- Deviation: the camera flies with the heart (`heart.depth` follows `cameraZ`) and snaps home at the Timeline's `top top`. Petals stay at the origin, so they are left behind during the rail.

### Verification

- `tsc --noEmit`, ESLint (0 errors in love), Vitest 72/72 (new: memory-layout, timeline-progress, svg-ndc), `npm run build` pass. `/love/<slug>` returns 200 on the dev server with no server errors.
- NOT verified (UNCERTAIN): all browser behaviour (orb look, hover/click on Safari and touch, dialog focus restore, thread placement and card overlap at 375/768/1440, strike timing and look, fast-scroll stress, draw calls, texture memory).

## 2026-11-13 - Love Site Phase 4 fixes: arrow strike

- Cause: `arrowStrike` was dropped by the director queue (max 2 pending) while node `glowUp`/`pulse` were waiting, and `armed` was cleared anyway, so it never retried. Fix: `interrupt()` in `heart-director-core.ts` (clears the queue, kills the current event, starts the strike; Vitest), `director.interrupt`; `buildTimeline` uses it and skips the featured node's own glowUp/pulse. Blueprint `034`.
- Arrow visibility: sized to 16 % of viewport height, thicker shaft/head/fletching, starts just outside the top-left edge, `power1.in`, gold × 2.5 so it blooms, denser trail.
- Orb photos: `#include <colorspace_fragment>` + sRGB textures.
- NOT verified in a browser (UNCERTAIN): arrow look and timing, photo colours.

## 2026-11-13 - Love Site Phase 5: Dawn, Gallery, Wish, Letter, Finale

### Summary

- Blueprint `.claude/blueprints/035-love-site-phase-5-day-story.md`. Not committed. Phase 4 browser check and commits still open (owner decision: start Phase 5 anyway).
- Pearl skin: second normal-blended `ShaderMaterial` on the shared heart geometry (`uPearl`, day colours, shared dynamic uniforms), cross-faded with Aura by `uSkin`; `canvas/heart-pearl.tsx` (extruded `heartShape`, `MeshPhysicalMaterial` on `high`, `MeshStandardMaterial` elsewhere, fresnel gold rim, fake contact shadow). `DayBloom` in `love-canvas.tsx` dims bloom to 40 % per frame.
- Director: `skinSwap`, `wishMerge`, `dockToSeal` (`PlayOptions.scale`), `sealBreak`, `finaleBurst` + reduced variants; `toBaseline` restores `skin` and `starHold`.
- New: `engine/confetti-state.ts` (three-free launch signal, one launch per 1.5 s), `canvas/confetti.tsx`, `canvas/wish-star.tsx`, `hooks/use-hold.ts` (pure `createHoldController` + hook), `engine/session.ts` (`resetSession`, `onSessionReset`), `ui/lightbox.tsx` (wraps the shared `components/ui/lightbox.tsx` and stops Lenis).
- Sections: Dawn (sunrise layer, text after 75 %), Gallery (tile buttons, hover scrim captions, lightbox), Wish (hold ring, "Or tap once", aria-live message, local-only textarea), Letter (envelope, hold or passphrase, GSAP sequence, inner scroll), Finale (Replay + music button via new `useMusicToggle`). `buildDawn/Gallery/Wish/Letter/Finale` in `story.ts`; hero `onEnterBack` replays the weave after Replay (`replayHeroWeave`). Memories counter resets on Replay.
- Deviations: confetti launch lives in `engine/confetti-state.ts` instead of `confetti.tsx` (keeps three.js out of engine imports); Calm (which already includes OS reduced motion) drives the quiet variants instead of framer's `useReducedMotion` (avoids a hydration mismatch).

### Verification

- `tsc --noEmit`, ESLint (0 problems in love), Vitest 81/81 (new: use-hold 5, session 2), `npm run build` pass.
- Follow-up (blueprint 036, owner: "day doesn't look like much, heart should be lavender, wish is weak"). Causes: `[data-stage-inner]` kept opaque backgrounds (Wish `bg-surface`) over the canvas; the opaque envelope hid the docked heart; Pearl body was lavender lerped 45 % to Ivory and tone-mapped to near white, Pearl particles ≈ alpha⁴; gallery clip used undefined `--radius`. Fixes: transparency rule now covers stage inners (motion only), radial mask hole at the seal, Pearl body `primary` → `primary-hover` with `toneMapped: false`, lilac sheen, stronger rim/shadow, particle alpha × 0.9; Wish Blush/gold glow, larger star, thicker ring, heart rest y −0.45; `--radius-lg`.
- NOT verified (UNCERTAIN): all browser behaviour: Pearl look and no pop, Dawn text window, gallery CLS and lightbox keys/swipe, wish hold feel and confetti, seal docking scale (`sealScale` from a formula only), letter sequence, finale burst, Replay, fast-scroll stress.

## 2026-11-13 — Love Site: half-heart mobile fix + all-night theme (blueprint 038)

### Summary

- Bug: `buildHeartAttributes` gave particles `i < count/2` to the left ribbon and `heart.tsx` draws a tier prefix (8k/3k), so mid/low tiers showed only the left half until the tier stepped up. Sides now alternate and `s` is seeded random; new balance test.
- All-night theme (owner decision): `--dawn` and `--day-*` removed from the `[data-love-root]` block; `LoveSection` takes `depth` (data-depth, Calm stops); `theme-timeline.ts` scrubs `--depth` only (memories → finale). Pearl skin, `skinSwap`, `heart.skin`, `heart-pearl.tsx`, DayBloom removed; `heart.gold`/`uGold` per section; `sealRim` replaces `pearlRim`. `readTokenColors` night only.
- Dawn → Starlight (`sections/starlight.tsx`, `copy.starlightLine`, aurora + 40 deterministic CSS stars, twinkle/drift keyframes off for reduced motion). Gold section titles, lavender names, gold hairlines on cards, letter and gallery; finale gold/lavender halo.
- Docs: ADR-0029 amendment, Experience Guidebook change note, Implementation-Phases changelog 1.2.

### Verification

- `tsc --noEmit`, ESLint (0 problems in love), Vitest 82/82 pass. `npm run build` not run (sandbox blocks Google Fonts fetch).
- NOT verified (UNCERTAIN): browser look on all tiers at 375 px, contrast on night surfaces, Starlight visuals, fast-scroll ×10.

## 2026-11-13 — Love Site ngrok gate and opening refresh

- The reported `/_next/webpack-hmr` WebSocket failure is the Next.js development hot reload connection. The ngrok inspector confirms the current tunnel forwards to `http://localhost:3002`; localhost responds with HTTP 200. Public ngrok requests were unreachable from the agent environment, so the remote tap failure and WebSocket recovery remain unverified.
- Added the specific ngrok hostname to development-only `allowedDevOrigins`. The dev server must restart to load that configuration; update the hostname if the tunnel changes.
- Restyled the gate as a romantic editorial welcome with layered night palette, ornamental frame, larger seed, personal heading, and a thumb-reachable action. Preserved audio unlock, scroll start, seed position, loading timeout, and 600 ms exit. An entrance animation exception is logged without retaining the gate.
- Targeted TypeScript and ESLint checks pass. The production build is blocked by unavailable Google Fonts requests in this environment. Remote browser verification remains open.

## 2026-11-13 — Love Site Phase 7: refinements, letter and dance (blueprints 039, 040)

### Summary

- Docs: new `phases/Phase-7-Refinements-Letter-and-Dance.md`, Experience Guidebook §19 (overrides Gate, Hero, Timeline, Letter; adds ambient hearts and the Dance section after Gallery), Implementation Phases (row, dependency chain, file map), phases/README, love-site README, `Love-Site-Improvement-Report.md`.
- Hero: resting glow 0.6 (matches the intro), intro `shine` removed (cause of the post-intro brightening), heart floats up by `HERO_RISE` as the title types in.
- Timeline: spiral thread (desktop inward spiral, mobile winding helix), mobile layer starts below the title, arrow strike fires on `pastLastNode` (just after the birthdate) and rearms before the last node; `REARM_BELOW` removed.
- Gate: heart button (seed for the 3D entrance) with "Tap this" and a drawn gold arrow, grain and inner frame.
- Letter: parchment with gold stripes, curls, ribbon, heart dividers and drop cap; backdrop of grain plus three parallax layers of tiny gold hearts; rods-and-unroll opening; `LETTER_OPEN_EVENT` auto-open at 55 % (not with a passphrase); draft letter text and `salutation` in config.
- Ambient hearts: `AmbientHearts` in `canvas/mini-hearts.tsx` (6 instances, one draw call), every 4–9 s while petals are off, tier mid/high.
- Dance: `engine/dance-state.ts` (keyframed `poseAt`, tested), `canvas/dance-duo.tsx` (11 low-poly emissive meshes), `sections/dance.tsx` (SVG dip silhouettes for calm/low/static), `buildDance`, `dance` section pose and copy.

### Verification

- See the Phase 7 implementation report in the session. Browser behaviour NOT verified by the agent (UNCERTAIN): spiral look, arrow timing feel, gate layout at 320–390 px, unroll, dance poses, cluster frequency, fps.

## 2026-11-13 — Love Site: dance v2, particle silhouette couple (blueprint 041)

- Owner rejected the low-poly mesh duo (read as mannequins). Replaced with one `Points` cloud in the heart's additive style: 8 side-view skeleton poses in `canvas/dance-silhouettes.ts` (2-bone IK `solveLimb` keeps joined hands and the waist hold together), parametric per-shape sampling in `canvas/dance-geometry.ts` (same body spot in every pose), GPU frame blend + hair/skirt sway in `canvas/dance-shaders.ts`, `engine/dance-state.ts` `frameAt` (hold then ease per pose), `danceParticles` tier field (14k/7k/0/0). Still SVG is generated from the dip pose.
- Deviation from blueprint: skeleton + shape primitives instead of rasterised SVG paths (pure, testable, guaranteed correspondence).
- Verification: tsc, ESLint, Vitest 55/55 pass. Browser look NOT verified (pose proportions, sway amount, framing at 390 px).

## 2026-11-13 - Love Site follow-ups (blueprint 042)

- Adjusted formed-heart alpha and hero beat, moved letter auto-open into the sticky pin range, widened the mobile timeline, and replaced ambient clusters with independent edge hearts.
- Expanded the dance to 10 key poses and 32 sampled frames with an added leg; positions are read from a float DataTexture.
- Verification: TypeScript and focused dance tests passed. TypeScript, Love Site ESLint and Vitest (92 tests) passed. The production build could not fetch Google Fonts. Browser appearance and frame rate remain unverified because browser access was unavailable.

## 2026-11-13 - Love Site fixes (blueprint 043)

- Letter auto-opens when the seal centre crosses the viewport centre (checked in `buildLetter`'s `follow()` ticker, plus a forward-leave fallback); stage 200vh; hint hides as soon as opening starts.
- Hero glow lowered to 0.4 with bloom 0.7/0.4; `toBaseline` eases glow over 1.2 s and `uBeatScale` is damped, removing the post-intro brightening.
- Dance dip split into lunge, half-dip and dip keyframes (12 keyframes, 48 frames); new tests cap per-frame movement and keep her on his right.
- Gate reduced to title, heart button with "Tap this" scribble (right of the heart on desktop), and one line.
- Verification: tsc, Love Site ESLint and Vitest (57 tests) pass. Browser look not verified in this session.

## 2026-11-19 - Love Site docs: as-built Experience Guidebook (blueprint 044)

- Audited `src/features/love/` against the Experience Guidebook and rewrote it as v2.0, an as-built reference: new §0 (status per section, better-than-planned list, changed-by-decision table, known gaps, release pending); §3–§14 now state built values; §19 folded into sections; Dawn → Starlight; Dance added as §11b.
- Tech Stack guide v1.1: status Adopted, as-built notes (all-night removals, fixed bloom), actual kebab-case folder map.
- Docs only; no code changed. Known gaps recorded (bloom not glow-driven, treble unused, no shine glints or ribbon-dust, smaller sealBreak, no calm gallery fade). Release items still pending (real photos, music licence, deploy, device QA).

## 2026-11-20 — Audit: full-system map + governance reconciliation

### Summary

Ran a map-and-reconcile audit (not a rebuild — the governance set already exists and is mature). Created a new full-system map and tech-stack mapping, and corrected stale structural facts in the governance handbook against current source. Documentation only; no application source, schema, config, or package files were changed.

### Files Inspected

- `package.json`, `README.md`; `app/` and `app/api/` route tree; `src/` tree (`components/`, `features/`, `lib/`, `config/`, `constants/`, `data/`, `types/`); `prisma/schema/` and `prisma/migrations/`; `public/`.
- Governance: `docs/governance/AGENTS.md`, `PLAN.md`, `PROGRESS.md`; `docs/AI_SESSION_LOG.md`; `docs/references/README.md` and `docs/references/love-site/` (README + Tech-Stack-and-Tools); `.gitignore`; `docs/decisions/DECISIONS.md` (ADR range).

### Files Created / Modified

- **Created** `docs/references/System-Map.md` (v1.0, STATUS: PARTIALLY IMPLEMENTED): two-subsystem overview (Storefront+Admin, Love Site), as-built route/feature/lib/schema inventory, layered tech-stack mapping with verified versions, reference-docs map (in-repo + love-site + `../BnV Docs/` source material), high-risk areas.
- **Modified** `docs/governance/AGENTS.md`: reconciled Repository Structure (`src/` now exists; `public/` has `images/`+`audio/`; 8 migrations; schema gained `inquiries.prisma` + `settings.prisma`), Technology Overview (previously "not imported" deps now in use; NextAuth + Cloudinary + Love Site 3D stack recorded), added System-Map to the reference map, reference list, and a Changelog entry.
- **Modified** `docs/references/README.md`: added the System-Map row.

### Verification

- Structure, versions, migration count, schema file list, ADR range (through ADR-0030), and gitignore strategy (`/plan.md`, `/progress.md`) confirmed by direct file reads on 2026-11-20. No build/lint/test run (documentation-only task). Source of every corrected fact is the current repository, not prior docs.

### Remaining Work

- Recommended but not authored (owner approval needed): a `Logging-Observability` and a `Payment-Gateway` reference (already flagged in `references/README.md` Pending), and an architecture overview under `docs/architecture/`. The Love Site release items (real photos, music licence, deploy, device QA) remain open.

## 2026-11-20 — Update-audit: Love Site animation tooling + stack reconciliation

### Summary

Follow-up to the map/reconcile audit, scoped to Love Site animations, stack and tools so future implementations know what to reference. Confirmed the Love Site reference library (Experience Guidebook v2.0, Tech Stack v1.1, Improvement Report, two Scroll-3D guides) is already comprehensive and as-built — not rewritten. Closed the remaining gaps: the installed GSAP skills were not recorded in the governance Design Skills section, and `Technology-Stack.md` still marked several now-installed packages as "not installed". Documentation only; no application source changed.

### Files Inspected

- All five Love Site reference docs (Experience Guidebook, Tech-Stack-and-Tools, Improvement-Report, Scroll-3D-Guide-Complete, Scroll-3D-Guide-Overview); `docs/references/Technology-Stack.md`; `docs/governance/AGENTS.md` Design Skills section; `.claude/skills/` (8 `gsap-*` + `impeccable` confirmed on disk); Love Site test files (15 `*.test.ts`).

### Files Modified

- `docs/governance/AGENTS.md`: Design Skills section now lists the installed GSAP skills and adds a "Scroll-driven / 3D animation (Love Site)" row routing to them and to the love Tech Stack guide §10; changelog entry added.
- `docs/references/Technology-Stack.md`: reconciled §3 status cells (Zod, Auth.js/NextAuth, Framer Motion, next-themes, Lucide, Cloudinary → VERIFIED installed with versions) and §4 (Vitest is the test framework; `typecheck`/`test` scripts exist; brand fonts corrected to Cinzel/Cormorant/Inter). The Love Site 3D/scroll row (ADR-0027, exact pins) was already present and was left intact.
- `docs/references/love-site/Love-Site-Tech-Stack-and-Tools.md`: §10 updated from "GSAP skills need install/approval" to "installed (VERIFIED)" with the on-disk skill names.

### Verification

- GSAP skills presence, 15 Love Site test files, and all install-status corrections confirmed by direct reads on 2026-11-20. No build/lint/test run (documentation-only). Love Site as-built behaviour detail is unchanged and remains sourced from the Experience Guidebook v2.0 (audited 2026-11-19).

### Remaining Work

- Unchanged from the prior entry: Love Site release items (real photos, music licence, deploy, device QA) and the Improvement-Report proposals (P1–P7, G1–G6) remain owner-gated and unbuilt.

## 2026-11-20 — Love Site Romance Additions: phase guides 8–11 (blueprint 045)

### Summary

Imported the owner's two specs (`Phase-8-Romance-Additions.md`, `Dance-Clip-Production-Guide.md`) into `docs/references/love-site/` and corrected every `INFERRED` item against the source code. Split the work into four phase guides with the Dance reel last: Phase 8 look, polish and foundations (M22–M27), Phase 9 interactive heart moments (M28–M33), Phase 10 Afterglow room and QA (M34–M37), Phase 11 Dance reel (M38–M40; clip production starts now in parallel; `/plan` before building). Documentation only; no application source changed.

### Files Inspected

- `src/features/love/` engine, canvas, sections, ui, hooks, config and dev files (heart state, director, story builders, heart path, theme timeline, tiers, audio, shaders, letter, wish, finale, debug panel); `src/components/ui/button.tsx`; `app/globals.css`; `next.config.ts`; `package.json`; `vitest.config.ts`; love-site docs and phase guides; `docs/decisions/DECISIONS.md`.

### Files Modified

- New: `docs/references/love-site/Love-Site-Romance-Additions.md` (master spec v1.2, §0 delivery map, verified facts), `docs/references/love-site/Dance-Clip-Production-Guide.md` (v1.1, renumbered to Phase 11), `docs/references/love-site/phases/Phase-8-Look-Polish-and-Foundations.md`, `Phase-9-Interactive-Heart-Moments.md`, `Phase-10-Afterglow-Room-and-QA.md`, `Phase-11-Dance-Reel.md`; `.claude/blueprints/045-love-phase-guides-8-11-romance.md`.
- Updated: `docs/references/love-site/phases/README.md` (rows 8–11), `docs/references/love-site/README.md` (eleven phases, two new files), `Love-Site-Implementation-Phases.md` (§3 rows, dependency chain, changelog 1.3), `Love-Site-Experience-Guidebook.md` (§15 row).

### Verification

- No `INFERRED` left in the master spec except its own verification note; relative links checked by script; `git status` shows only Markdown changes. No build/lint/test run (documentation-only).

### Remaining Work

- Phase 8 starts with `/plan` (ADR-0031–0034 are written in M22, not yet). Owner: start the dance clip (production guide §16) and provide the content in spec §7.

## 2026-11-20 — Love Site Phase 8: look, polish and foundations (blueprint 046)

### Summary

Implemented M22–M27: ADR-0031–0034; optional romance config fields with validation; device-only `persist.ts`; procedural `chime.ts` with a lazy shared `getAudioContext()`; darker look (aurora, gate, depth cap at Deep Plum, grain); heart point size and alpha now scale with the heart (fixes the white small heart) with a scale-aware draw range; bloom 0.8 / 0.45 / 0.28 plus ACES tone mapping and vignette; token-tinted mini and ambient hearts; Bloom line emerging word by word from the burst with petal dimming; `love-primary` / `love-ghost` / `love-link` button variants and an `inline` size; new Finale layout with a quiet music link; Wish medallion as the whole hold target; Letter frame inside a growing sheet with fades, gold scrollbar and scroll hint; full-stage letter backdrop.

### Deviations

- Bloom words are pre-split into spans at render time instead of runtime SplitText (keeps the per-word gradient, no revert needed, one sentence for screen readers).
- Ambient hearts reduced to 8 on all tiers (constant) rather than 8 on high only.

### Verification

- `tsc --noEmit` clean; `vitest` 24 files / 105 tests pass; `eslint` 0 errors (188 warnings, all in pre-existing `.claude`/`.github` skill scripts).
- `next build`: first run compiled and failed collecting `/products/[slug]` data (database unreachable); second run failed fetching Google Fonts. Both environmental; not verified as a full build.
- Not yet checked in a browser or on devices.

### Remaining Work

- Browser pass at 1440 and 375 px with before/after screenshots; tune values (heart alpha at small scales, bloom, vignette); real iPhone and Android; Experience Guidebook section updates to as-built.

## 2026-11-20 — Love Site Phase 9: interactive heart moments (blueprint 047)

### Summary

Implemented M28–M33 in the order M28 → M32 → M29 → M31 → M30 → M33:

- Pure, tested helpers: `blow-detector`, `ring-physics`, `text-points`, `sky-layout` and `audio-duck`.
- Four new director events, `finaleSpell`, `skyHeartIn`, `candleOut` and `reasonFront`, each with a reduced-motion case. `toBaseline()` resets `spell` and `spellB`.
- A new Reasons section after Dance (CSS 3D ring turned by scroll and drag).
- Finale: the heart spells the name, then "I love you".
- Our sky: an interactive constellation in Starlight.
- Voice-note channel with music ducking. It stays hidden until `letter.voice` is configured.
- Candle wish with microphone blow detection. Hold and tap always work.
- Placeholder reasons, copy, `wish.mode` and `finale.spell` added to the site config.

### Deviations

- `engine/mic-input.ts` was added so the debug panel and `use-blow` share one microphone path.
- New state objects `reasons-state.ts` and `candle-state.ts` follow the `dance-state` pattern.
- `HEART_PATH.starlight` now holds the constellation-centre pose (the `skyHeartIn` target). The `SKY_WAIT` pose is used while she plays.
- `skyStarLayout` spaces stars by arc length, because equal parameters bunched up at the tip.
- The voice note and the candle use an `IntersectionObserver` for "section leave" instead of a new ScrollTrigger.
- `WishCandle` is mounted whenever candle mode is on. It skips all work while `candle.visible` is 0.
- `wishMerge` takes a time offset so `candleOut` can chain into it.

### Verification

- `tsc --noEmit` clean.
- `eslint src/features/love` clean.
- Prettier clean.
- Vitest: 23 files, 91 tests pass (love).
- `next build` was blocked by the Google Fonts fetch (environment).
- Not yet checked in a browser or on devices.

### Remaining Work

- Device tuning of the blow thresholds on an iPhone and an Android phone, then accept ADR-0033.
- Browser and fast-scroll QA.
- Owner content: the real reasons, the voice note and its transcript.
- Remove `finaleBurst` after the release QA.
- Experience Guidebook as-built updates.

## 2026-11-20 — Love Site Phase 10: Afterglow room (blueprint 048)

### Summary

- Added the Afterglow section after the Finale (natural flow, heart in the corner, `ScrollTrigger.batch` reveals) and the Finale link "There's a little more…".
- Gifts (F7): `ui/gift-box.tsx`, `sections/afterglow-gifts.tsx`, plan card with countdown, `.ics` download and Maps link. Pure `engine/ics.ts` and `engine/countdown.ts` with tests.
- Notes (F8): `sections/afterglow-notes.tsx` and `ui/note-dialog.tsx` (mirrors MemoryDialog), `unlockAt` soft lock.
- Hidden hearts (F9): `engine/hidden-hearts.ts` (persisted set, also used for opened gifts/notes), `ui/hidden-heart.tsx`, placements constants, `ui/found-chip.tsx`, `sections/afterglow-secret.tsx`.
- New heart events `giftOpen`, `noteOpen`, `hiddenFound` with reduced-motion cases.
- Story re-dated: Dec 2025 → Nov 2026; "Our first home" became "Our little rituals". Placeholder Afterglow content is marked `TODO(owner)`.

### Verification

- `tsc --noEmit`, `eslint src/features/love`, Prettier clean.
- Vitest: 32 files, 141 tests pass. `next build` passes.
- Not yet checked in a browser or on devices (M37).

## 2026-11-23 — Love Site polish pass (blueprint 049)

- Hydration: `skyStarLayout` rounds star positions to 2 decimals.
- Overflow: letter backdrop no longer `w-screen`; `[data-love-root]` gets `overflow-x: clip`; scrollbar arrow buttons hidden (styled vertical scrollbar kept).
- Petals: audio speed integrated into the clock (no idle jumps), seam fade, span only updates on real resizes, gentle 3.5 s release at Bloom `top 85%`.
- Letter: title + scroll in normal flow (was centred on the title box), idle float 3 px, auto-open at 50 % pin progress.
- Starlight: stage 320vh, reveal starts at `top 40%`; completion fades labels, glows the outline and plays `copy.skyReveal` lines.
- Timeline: thread dash measured in screen px (fixes broken-looking spiral); cards fold into photo chips on nodes after 2.6 s, chips/cards open `NoteDialog`.
- Afterglow: gifts `mode: 'sequence'`; open-when notes never date-locked + `openWhenIntro`; hint clue chips; wish panel close (X, Escape, outside tap).
- Glow: heart base ×1.25, arrow GLOW 4.2. Coloured Lucide UI icons.
- Not done: heart-formation-on-first-load bug (needs browser repro); arrow halo sprite skipped (GLOW bump only).

## 2026-11-23 — Love follow-ups (blueprint 050)

- Open-when notes re-open with one tap (`useHold` reset after each open).
- Letter frame hugs the paper edge (padding moved from the article to the text), rounded borders, corner curls grow from the inner border.
- Native scrollbar hidden on the love route; ProgressHeart rail is the scrollbar.
- Arrow: thinner shaft, single larger head, dim swept-back fletching, additive glow halo, denser trail.

## 2026-11-23 — Phase 12 Gallery Walk, M41 Foundations (blueprint 051)

- Plan `.claude/plans/025-gallery-walk.md`, blueprint `.claude/blueprints/051-gallery-walk.md`. Owner decisions: 150 MB mobile gallery texture budget, clickable end frame (`galleryEnd`), procedural gilding, 550 vh pin, note in fallback lightbox.
- ADR-0035 (gallery walk and camera ownership) and ADR-0036 (CC0 textures and budget) drafted as Proposed.
- Config: `PhotoRef.note?`, `LoveSiteConfig.galleryEnd?`; config test validates both.
- `scripts/prepare-love-images.mjs`: `portrait` kind (1600 px) and `-1024` variants for gallery and portrait. Script not re-run.
- `love-canvas.tsx`: debug-only `PointerProbe` plane (bottom right) to prove canvas clicks through the pass-through DOM; remove in M42.

### Verification

- `tsc --noEmit` clean; eslint 0 errors; Vitest 32 files, 141 tests pass.
- `next build`: compiles and type-checks; prerender of shop pages fails because PostgreSQL is not running (unrelated).
- Pointer probe not yet clicked in a browser or on an iPhone.

## 2026-11-23 — Phase 12 Gallery Walk, M42 Corridor prototype (blueprint 051)

- `engine/gallery-state.ts` (mutable state, `claimCamera` / `releaseCamera`), `engine/gallery-path.ts` (left-sweep CatmullRom, min radius about 11 m, 16 wall slots + end slot, `walkPose`) with tests.
- `canvas/gallery-corridor.tsx` (flat-colour ribbons: floor, walls, ceiling, wainscot, rails, cove), `canvas/gallery-camera-rig.tsx`, `canvas/gallery-walk.tsx`; corridor sits at z -400, behind the story camera.
- `heart.tsx` skips camera writes while the gallery owns the camera; rig restores rotation and fov 45 on release, heart snaps z back.
- `buildGallery`: masonry reveal and parallax removed from the motion path; a trigger over the 550vh sticky stage writes progress and claims/releases the camera. Deviation from blueprint: uses the repo's CSS `StickyStage` instead of GSAP `pin`.
- `sections/gallery.tsx`: quiet → masonry + lightbox (unchanged), motion → walk stage with title, hidden heart, "Skip gallery" button. Twins arrive in M44.
- `dev/gallery-debug-panel.tsx` (?debug): owner/progress readout and a progress slider. M41 pointer probe removed.
- Fix: `heart-debug-panel.tsx` snapshot skips GSAP's self-referencing `_gsap` cache (crashed `?debug`).

### Verification

- `tsc --noEmit`, eslint (love) clean; Vitest 33 files, 146 tests pass. Dev server returns 200 for the love page.
- Not yet checked visually in a browser or on a phone.

## 2026-11-23 — Phase 12 Gallery Walk, M43–M46 (blueprint 051)

- Frames: instanced gold borders + ivory mats, photo planes with blur placeholders, texture residency window (`engine/gallery-textures.ts`), decor (map, mirror, empty frame), clickable end portrait (`galleryEnd` → `gallery[0]`).
- Surfaces are procedural canvas textures (`canvas/gallery-surfaces.ts`); `CC0_MAPS` stays empty until the owner approves picks. Lights: emissive sconces, additive wall washes, 1–3 camera-following point lights (allocated once), scoped fog, doorway glow, end spotlight + exit glow.
- Inspect: `engine/gallery-director-core.ts` (pure, tested) + `gallery-director.ts` (one tween on `galleryState.blend`), rig blends walk/inspect poses with aspect-fitted distance (fov 62 on portrait screens). Overlay: Back/Prev/Next, Esc/arrows, swipe, tap outside, wheel blocked, Lenis stopped, exact scroll restore, focus back to the twin. Gold note + CSS hearts (tap hearts sit off-camera, so not reused).
- Tiers: gallery flags in `TIERS`; Steady camera toggle (`love:gallery-comfort`). Calm fade for the masonry, lightbox `caption` (note), `webglcontextlost` → static tier.
- Lint gotcha: React compiler `react-hooks/immutability` rejects writes to `useMemo` objects inside `useFrame`; write through mesh refs or module setter functions instead.

### Verification

- `tsc --noEmit`, eslint (love + lightbox) clean; Vitest 35 files, 156 tests pass.
- Headless Chrome (SwiftShader, low tier, 1280×800): walk renders, twin opens frame, Next works, Esc closes, scroll identical before/after, focus returns to twin, no console errors. Later fixes (title fade, inspect fit, end glow timing) not re-screenshotted.
- Not checked: real devices, 375px, high/mid tier look, iOS tap.

## 2026-11-23 — Gallery entrance and smooth glide (blueprint 052)

- Rig: sway removed, damp 6 → 3.5; Steady camera toggle and `galleryState.comfort` removed.
- Entrance: `ENTRANCE = 0.15`, `walkProgress` / `stageProgress` / `doorOpen` (tested); `galleryState.walk` drives the camera, residency, lights and companion; stage 650vh. `canvas/gallery-doorway.tsx`: fluted pilasters, gold pediment with heart crest, aubergine lacquer leaves with filigree panels and ring handles, swinging 105° inward; light spill fades once through. Door moved to `DOOR_T = 0.09` (2.6 m) so it fills the view; first frame slot moved to 0.15.
- Section: "Welcome, {recipient}" heading (Cinzel display) pops in, then `copy.galleryLines` (three defaults) rise and fade one by one; "Exit gallery" glass pill with gold edge fades in after the entrance.
- Motes use a round glow map; companion heart appears only after the door.

### Verification

- `tsc --noEmit`, eslint (love) clean; Vitest 35 files, 158 tests pass.
- Headless Chrome screenshots: closed doors + welcome, opening doors, lines after the welcome, glide through, Exit gallery visible. Not checked on real devices.

## 2026-11-23 — Gallery door unlock ritual (blueprint 053)

- `engine/gallery-ritual-core.ts` (pure state machine, tested), `engine/gallery-ritual.ts` (runtime: Lenis stop on forward arrival, one GSAP tween per step, chimes, `session.galleryUnlocked`, `exitGalleryRitual`, `resetGalleryRitual` on leave/Replay), `engine/glass-fracture.ts` (jittered-grid shards + motion, tested).
- Canvas: `gallery-ritual.tsx` (pedestal left of the doors, glass case without transmission, CPU-updated shard mesh, sparkle points, sledgehammer, key with drag/return/insert poses, screen projections), `gallery-key.ts` (merged key geometry), doorway lever handles, keyhole escutcheon and a leaf-mounted key that turns and swings with the door.
- UI: `ui/gallery-ritual-overlay.tsx` (wheel/touch blocked, swipe across the case, drag to the keyhole, pulsing target ring, prompts, Break the glass / Use the key / Exit gallery, Open it for me after 20 s); welcome plays on arrival and rises away. Scrubbed entrance (`ENTRANCE`, `walkProgress`, `doorOpen`, floating lines, `galleryLines`) removed; `copy.galleryRitual` added; tiers `galleryShards`, `gallerySparkle`.
- Deviation: walk progress is not gated on the unlock (scroll is locked at 0 during the ritual anyway; gating would freeze the camera when returning from below after an exit). The arrival snaps 2 px inside the stage so the trigger stays active.

### Verification

- `tsc --noEmit`, eslint (love) clean; Vitest 37 files, 165 tests pass.
- Headless Chrome with real CDP mouse input: scroll stays put under wheel input while locked; a mouse swipe across the case swings the hammer and advances to "Carefully take the key…"; a far drop returns the key; Use the key inserts, turns and opens the doors; wheel scroll works afterwards. Not checked on real devices or with a real touch drag into the keyhole.

## 2026-11-23 — Gallery polish (blueprint 054)

- Soft 3D hearts: `softHeartShape()` + `SOFT_HEART_EXTRUDE` (béziers, round lobes, one point, pillowy bevel) for mini, ambient, companion and the door crest; particle heart unchanged (test `canvas/soft-heart.test.ts`).
- Diagonal hammer: the head follows a curve from up-left of the case to the pane (handle trailing up-left), wind-up → strike → rebound, camera kick (`ritualState.kick`, decayed in the rig), shards pushed along the swipe. Deviation: a single fixed pivot cannot read as a top-left → bottom-right strike, so the head travels a bézier path instead.
- Overlay: only a down-right diagonal (15–75°, ≥ 70 px, across the case) counts; an animated DrawSVG arrow shows the stroke; misses shake the prompt with a hint; Break the glass / Use the key / Open it for me appear after 3 misses or via the Help pill (20 s timer removed).
- Welcome: bloom, drawn flourishes, spaced Cinzel "WELCOME" (SplitText), italic Cormorant name lifting in letter by letter, a foil band on an unsplit overlay (background-clip text breaks on split letters), heart dot, then rises. Dev double-mount fix: kill pending tweens on mount, revert the split on cleanup.
- `ui/love-scrollbar.tsx` replaces `ProgressHeart` (left in place, unused): gold rail + draggable gold-heart thumb on `--progress`, click-to-jump, dimmed/inert while Lenis is stopped, phone thumb on the right edge while scrolling; `role="scrollbar"` controlling `#love-main`.

### Verification

- `tsc --noEmit`, eslint (love) clean; Vitest 38 files, 167 tests pass.
- Headless Chrome: Help only at first; a sideways swipe shakes the prompt with the hint; after 3 misses Break the glass + Open it for me appear; a real diagonal mouse swipe swings the hammer and moves on to the key; the welcome animates and rises; the heart scrollbar shows and reports position. Not checked on phones (thumb drag, touch swipe).

## 2026-11-23 — Love Site: glossy gold/lavender hearts, swipe-aligned hammer (blueprint 055)

- `canvas/mini-hearts.tsx`: `inflatedHeartGeometry()` (one smooth pillow surface from `softHeartShape`, no bevel rings), module-shared `sharedHeartGeometry()`, `useHeartEnvMap()` (local `RoomEnvironment` PMREM, not `scene.environment`). Mini and ambient hearts use metallic `meshPhysicalMaterial` in gold shades plus lavender `#b9a6e0`; `low`/`static` tiers keep the extrude.
- Companion (`gallery-lights.tsx`) and door crest (`gallery-doorway.tsx`) use the inflated geometry; the companion is now polished gold. Hero particle heart unchanged.
- Hammer (`canvas/gallery-ritual.tsx`): the strike arc and orientation follow `ritualState.swipe`; head leads along the stroke, handle trails toward its start. Any stroke direction across the case breaks the glass; the prompts no longer name a direction.

### Verification

- `tsc --noEmit`, eslint (love) clean; Vitest love suite 32 files, 133 tests pass (new inflated-geometry tests). Not checked visually in a browser.

## 2026-11-23 — Love Site: heart-born petals, face-first hammer, custom grab cursor (blueprint 057)

- `engine/story.ts`: petals fade out early in the Memories rail (the dolly carried the camera past them, and the Timeline camera snap made them pop back). They scrub back in on Timeline entry from the heart's position, with a `glowUp` cue.
- `canvas/gallery-ritual.tsx`: hammer orientation is an explicit basis. The head's long axis follows the swipe so a face strikes, and the head is offset by half its width so the face lands on `IMPACT`.
- `ui/cursor-svgs.ts`: `CURSOR_GRAB` / `CURSOR_GRABBING` gold fist cursors. `ui/love-cursor.tsx` applies them to the scrollbar thumb and track; `ui/love-scrollbar.tsx` drops the native `cursor-grab` classes.

### Verification

- `tsc --noEmit` and eslint (love) clean. Not checked visually in a browser.

## 2026-11-25: Blueprint 061 (screen-locked petals, welcome arch plaque, quill letter, Reasons book)

- `canvas/petals.tsx`: petals live in camera space (portal into the camera); span from the frustum on resize only; alpha/size fade, no heart-origin spawn. `engine/story.ts`: one scrubbed petal owner (Bloom → top of Memories); removed the memories, timeline and wish-approach `petalRelease` writers.
- `canvas/gallery-doorway.tsx` `WelcomePlaque` + `galleryState.welcome`; `ui/gallery-ritual-overlay.tsx` flies the DOM welcome onto the plaque and cross-fades (fallback: old rise).
- `sections/letter.tsx` `writeLetter`: SplitText lines inked left to right with `LetterQuill` (`letter-ornaments.tsx`).
- `canvas/reasons-book.tsx`: 3D page-turning book driven by `reasons.progress`; `sections/reasons.tsx` book stage + sr-only buttons; low/static tiers keep `ReasonsRing`, calm keeps the list.

### Verification

- `tsc --noEmit`, eslint (love) and vitest (love, 135 tests) pass. Not checked visually in a browser.

## 2026-11-26: Blueprint 072 (Two Lights gate, Lenis handoff)

- `sections/gate.tsx`: Gate rebuilt as two lights joined by press-and-hold (`useHold`, 1.4 s). `--sep` is written by hold progress; GSAP only for intro drift and an idle nudge. Removed frame, arrow, ring, heart button and halo; ambient hearts kept. Audio starts on first press. Seed now measured from the merge core.
- Lenis: scroll reset to top before `start()`, and `resize()` + `ScrollTrigger.refresh()` 650 ms after entry. `engine/scroll-engine.tsx` `useLoveScroll` exposes `resize`.
- Config: optional `copy.gateEyebrow` / `copy.gateHint`, passed to Gate from `love-experience.tsx`. `app/globals.css`: additive `love-gate-*` rules (old frame/halo rules left as dead code).
- Owner TODO: "A story waiting to unfold." is still a placeholder in `gate.tsx`.

### Verification

- `tsc --noEmit`, eslint (changed files) and vitest (39 files, 177 tests) pass. Full `npm run lint` ran out of memory (V8 crash), so it was run on the changed files only. Not checked on devices or in a browser.

## 2026-11-26: Blueprint 073 (Starlight before Gallery, scrubbed gallery entry)

- Order is Timeline → Starlight → Gallery → Dance again (`love-experience.tsx`, `story.ts` `sections`). This reverts the order change from blueprint 071.
- `story.ts`: Starlight starts from the Timeline pose; `buildGallery` restores the pre-071 approach scrub (Starlight pose → gallery pose, `top bottom` → `top 20%`); Dance starts from the gallery pose.
- `heart-director.ts` `arrowStrike`: no longer calls `requestGalleryReveal`. `HeartIris` / `gallery-reveal.ts` are now dormant (cleanup later).
- Guidebook §4 already lists this order; no doc edit needed.

### Verification

- `tsc --noEmit`, eslint (changed files) and vitest (love: 33 files, 140 tests) pass. Not checked in a browser.

## 2026-11-26: Blueprint 075 (Love console errors and flicker)

- `sections/gate.tsx`: `AMBIENT` `left`/`dur`/`delay` rounded with `toFixed(2)` to fix the hydration mismatch (the server and client serialised the floats differently).
- Ran `scripts/prepare-love-images.mjs` (no sourceDir): added the missing `love-gallery-*-1024.webp` and `love-portrait-01(-1024).webp`; existing originals unchanged. Fixes the `smallSrc` 404s.
- `THREE.Clock` deprecation comes from @react-three/fiber internals; X4122 is ANGLE shader noise. Neither needs action.
- Flicker: not yet diagnosed; the owner still needs to check a prod build (`npm run build && npm run start`).

### Verification

- `tsc --noEmit`, eslint (gate.tsx) and `gallery-textures.test.ts` pass. Not checked in a browser.

## 2026-11-26: Blueprint 076 (tier change no longer rebuilds the story)

- Cause of the mid-Memories breakage: a PerformanceMonitor step-down changed `tier`, which re-ran `useGSAP` in `love-experience.tsx`. That reverted every ScrollTrigger, called `window.scrollTo(0,0)` while Lenis was mid-page, and left the heart at hero values.
- `love-experience.tsx`: the story depends on `quiet` only; the tier is read through `tierRef`; a tier change now only calls `ScrollTrigger.refresh()`. Decline steps down once per visit (`steppedRef`); `onIncline` was removed.
- `canvas/love-canvas.tsx`: `PerformanceMonitor` has `onDecline` only, `flipflops={1}`.
- `sections/gate.tsx`: the 6 s load fallback is now high → mid (was → low).

### Verification

- tsc, eslint (changed files) and love vitest; see the session report. Not checked in a browser.

## 2026-11-26: Blueprint 077 (HeartIris removed, plain dark fade)

- Deleted `ui/heart-iris.tsx` (full-screen SVG mask with a drop-shadow over the canvas, repainted every scroll frame near the Gallery) and `engine/gallery-reveal.ts`.
- `love-experience.tsx`: a plain `div[data-gallery-veil]` (night background, opacity only) replaces it.
- `story.ts` `buildGallery`: the existing scrubbed veil still closes in; on forward entry it fades out (0.5 s) after `arriveAtDoor`, and resets to 0 when the Gallery deactivates. `requestGalleryReveal` and its Lenis force-jump were removed. `heart-director.ts` needed no change.
- Next: the owner profiles a prod build (Memories → Gallery) before any off-screen scene pausing.

### Verification

- eslint (changed files) and love vitest (140 tests) pass; tsc reports errors only in generated `.next/dev/types` (dev server output), none in `src/`. Not checked in a browser.

## 2026-11-26: Blueprint 078 (Dance keyframe reel, smooth dip and asset loading)

- Interim Phase 11 player: the Dance now plays four AI keyframe stills (standing → close hold → twirl → dip) instead of the particle couple. Sources are in git-ignored `private/dance-keyframes/`.
- `scripts/prepare-dance-reel.mjs`: scales each still so his head-to-floor height matches, sets a shared floor line, remaps the backdrop onto the page night color (per-channel levels), feathers the edges and writes `public/dance-reel/{desktop 768×960, mobile 512×640}`, `posters/{start,dip}.webp` and `manifest.json` (desktop set ≈ 120 KB). Tuning sheet: `private/dance-reel-contact.webp`.
- `engine/dance-reel-math.ts` (+ test): `reelFrame` (55 % hold, smoothstep crossfade, last 10 % held on the dip), `REEL_BEATS`, `damp`, `loadOrder`, `nearestLoaded`. `engine/dance-reel-loader.ts`: start pose and dip first, 2 concurrent, `img.decode()`.
- `sections/dance-reel.tsx`: one 2D canvas on `gsap.ticker`, damped `dance.t`, DPR ≤ 1.5, draws only on change. `sections/dance.tsx`: Calm/static show the dip poster.
- `story.ts` `buildDance`: `pulse` at the close hold, `shine` at the twirl, `pulse` + `spawnTapHearts(6)` at the dip; each beat re-arms 0.1 below itself.
- `DANCE_REEL` (engine/dance-state.ts) = false restores the particle duo. Its dip jitter is fixed: `dance-shaders.ts` clamped the next frame to 31 of 48.

### Verification

- tsc, eslint (changed files) and love vitest (34 files, 148 tests) pass. Contact sheet checked by eye (floor, scale, backdrop blend).
- Headless Chrome on the dev server (canvas captured at 7 scroll stops): poses play in order and the dip holds. A ghost of the previous pose in the feathered edges was found and fixed (the outgoing pose now fades over the second half of each crossfade). Not checked on a real phone or with the gate passed by hand.

## 2026-11-26: Blueprint 079 (particle couple dances the keyframes; reel removed)

- Direction change: the 4 AI stills are pose references only; the particle couple performs the dance. 078's reel player, loader, math and frame sets were removed; `public/dance-reel/posters/dip.webp` stays as the Calm / reduced-motion / low / static still (`scripts/prepare-dance-reel.mjs` now writes only that).
- `canvas/dance-silhouettes.ts`: 9 new keyframes after the stills (standing → join → close hold → hands rise → twirl → turn completes → close hold → hands lifted into the lunge → dip with hands released). `solveLimb` takes a fixed bend side (his arms −1, hers +1), so elbows no longer flip overhead. `build` exported as `buildPose`; `SHAPE_COUNT` = 26. The 48-frame bake (`buildFrames`, `DANCE_FRAMES`, `FRAME_COUNT`, `DIP_FRAME`) is gone.
- Live skeleton: `dance-geometry.ts` `buildDanceParticles` (fixed shape, u, v per particle), `packShapes`/`unpackShape` (3 vec4 per shape); `dance-shaders.ts` evaluates `pointOn` in GLSL from `uShapes[78]`; `dance-duo.tsx` damps `dance.t`, rebuilds the pose with `poseAt` + `interpolateSpec` when it changes, and mirrors with a negative x-scale. The 11 MB DataTexture and its mount-time build are gone.
- `engine/dance-state.ts`: `poseAt` (25 % hold, one smoothstep, last 12 % on the dip), `keyAt`, `DANCE_BEATS`, `BEAT_REARM`, `damp`. `story.ts` fires the beats (pulse / shine / pulse + tap hearts).
- Found while testing: in the first draft the joined hands sat on her shoulder in the lunge, so releasing them swung her forearm through the shoulder (an IK near-singularity, a visible snap). Fixed by lifting the joined hands overhead in that key. His front shin in the dip was also put near vertical, so the foot stays on the floor.

### Verification

- tsc, eslint (changed files) and love vitest pass. Poses checked as a mirrored SVG strip against the stills.

## 2026-11-27: Blueprint 080 (Dance video reel after the particle Dance)

- New section `#dance-reel` (`sections/dance-reel.tsx`) mounted after `<Dance>`; the particle couple is untouched. Silent continuation: sr-only heading, canvas with an aria label, edge-fade mask over the clip's plum backdrop.
- `scripts/prepare-dance-video.mjs`: system ffmpeg (winget `Gyan.FFmpeg`, found in the winget Packages folder or via `FFMPEG`) extracts the 121 frames of `public/dance-reel/dance-vid.mp4` (no audio); sharp writes `public/dance-reel/{desktop 720×757, mobile 480×505}` WebP q74 (≈ 1.8 MB / 1.1 MB), `posters/reel-{start,dip}.webp` and `canvas/dance-reel-manifest.json`.
- `engine/dance-reel-math.ts` (+ test): `frameAt`, `windowAround`, `loadOrder`, `REEL_WINDOW`. `engine/dance-reel-player.ts`: 4 concurrent fetches into blobs, ImageBitmaps only within ±16 / ±12 frames (closed on eviction), damped progress on `gsap.ticker`, DPR ≤ 1.5, draws only when the shown frame changes.
- `story.ts` `buildDanceReel`: loading starts when `#gallery` enters the viewport; the frame fades in over the section's entry; `pulse` + `spawnTapHearts(6)` at progress 0.85, re-armed `BEAT_REARM` below. The heart keeps the dance pose and baseline.

### Verification

- tsc, eslint (changed files) and love vitest (34 files, 145 tests) pass. Dev server: `/love/<slug>` returns 200 with `#dance` → `#dance-reel` → `#reasons`; frames are served. Scrub smoothness, memory and real devices not yet checked by hand.

## 2026-11-27: Blueprint 081 (Dance Reel background removal)

- Tooling (dev-only, git-ignored): Python 3.12 (winget), venv `private/matte-venv` with CPU torch 2.15, torchvision, av, pims, tqdm; RVM weights in `private/torch-cache`.
- `scripts/matte-dance-video.py`: Robust Video Matting resnet50 (`torch.hub`, downsample 0.4) writes 1-based alpha PNGs to `private/dance-video-alpha/` (121 frames, ~75 s on CPU).
- `scripts/lib/dance-levels.mjs`: `PAGE`, `backgroundOf`, `levels` moved out of `prepare-dance-reel.mjs` (its `dip.webp` output is byte-identical).
- `scripts/prepare-dance-video.mjs`: `--matte` (decontaminate F = (C − (1−a)·bg)/a, alpha WebP q74 / alphaQuality 50), `--preview` (hold/spin/dip composites over the page colour in `private/dance-matte-preview/`), default = colour-match fallback. Manifest gains `alpha`. Run: `node scripts/prepare-dance-video.mjs --matte` → desktop 4.28 MB, mobile 2.56 MB.
- `sections/dance-reel.tsx`: edge mask only when `!manifest.alpha`; `data-dance-reel-floor` spotlight pool (theme tokens) when alpha.
- Preview gate: hold and dip clean; spin shows a faint back leg (his) and grey smudges inside her skirt. The owner accepted this.

## 2026-11-27: Blueprint 082 (particle-dance code removed)

- The reel now plays inside `#dance` (sections/dance.tsx → `DanceReelFrame`; story.ts `buildDance` drives it; the heart moves to the `dance` pose top-right; `PETAL_SECTIONS.dance`). The separate `#dance-reel` section and the `DanceDuo` mount are gone.
- `damp` and `BEAT_REARM` moved verbatim into `engine/dance-reel-math.ts` (+ a `damp` test).
- Deleted: `canvas/dance-duo.tsx`, `canvas/dance-points.ts` (+ test), `canvas/dance-shaders.ts`, `canvas/dance-manifest.json`, `engine/dance-state.ts` (+ test), `public/dance-reel/points.bin`, `public/dance-reel/posters/dip.webp`, `scripts/prepare-dance-points.mjs`, `scripts/prepare-dance-reel.mjs`; `danceParticles` dropped from `engine/tiers.ts`.

### Verification

- tsc and eslint (src/features/love, scripts) are clean; love vitest has 32 files and 134 tests passing. Dev server `/love/<slug>` returns 200. Not re-checked in a browser.
