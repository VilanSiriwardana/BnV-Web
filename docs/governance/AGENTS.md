# AGENTS.md - B&V Engineering Handbook

This is the authoritative governance guide for AI coding agents working in the B&V repository. The root [../../AGENTS.md](../../AGENTS.md) is only a lightweight entry point.

## Project Overview

B&V is a Next.js web platform for the BuwiNVila project. It should be built as a maintainable, SEO-conscious, accessible, secure, and brand-aligned application.

## Business Vision

- Preserve the B&V brand voice, trust, clarity, and usability.
- Support future public-facing content, business workflows, and media-rich storytelling without locking the project into brittle early decisions.
- Use [../references/Business-Strategy.md](../references/Business-Strategy.md) as the source of truth for business strategy and positioning.
- Use [../references/Brand-Identity.md](../references/Brand-Identity.md) as the source of truth for brand identity, design tokens, typography, imagery, motion, accessibility, and dark mode.

## Documentation Hierarchy

Use this source-of-truth order:

1. Current source code, schema, migrations, and configuration.
2. [AGENTS.md](AGENTS.md).
3. [PLAN.md](PLAN.md).
4. [PROGRESS.md](PROGRESS.md).
5. [DECISIONS.md](DECISIONS.md).
6. Reference documents in [../references/README.md](../references/README.md).
7. Architecture notes in [../architecture/README.md](../architecture/README.md).
8. Future ADR files in [../decisions/README.md](../decisions/README.md).
9. Prior AI summaries.

If documents conflict with source code, source code wins and the affected documentation should be corrected.

Confidence labels:

- `VERIFIED`: directly confirmed from source, config, schema, tests, command output, or a named reference document.
- `INFERRED`: strongly implied by source or framework convention, but not directly verified.
- `UNCERTAIN`: insufficient evidence.

## State Management Protocol

This project uses seven workflow artifacts. Each answers a different question; do not blend their purposes.

- [AGENTS.md](AGENTS.md) (this file): What rules must every agent always follow? Permanent. Committed.
- [PLAN.md](PLAN.md): What is the permanent, living project roadmap (phases, sprints, milestones, backlog)? Permanent. Committed. Updated when priorities, scope, or phase status change.
- [PROGRESS.md](PROGRESS.md): What milestone-level engineering work has completed, chronologically, against [PLAN.md](PLAN.md)? Permanent, append-only. Committed. One entry per completed milestone or significant governance/infrastructure change.
- [DECISIONS.md](DECISIONS.md): What architectural decisions have been accepted, and why? Permanent. Committed.
- Root `plan.md` (repository root, outside `docs/`): What is the strategy for the _current, active task_ (may not exist between tasks)? Ephemeral, task-scoped, local/gitignored. Replaced when the task changes. Not permanent project knowledge - do not confuse with [PLAN.md](PLAN.md).
- Root `progress.md` (repository root): Where exactly are we right now on the current task (may not exist between tasks)? Ephemeral, local/gitignored, target under 50 lines. Reset when the task completes.
- [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md): What happened, permanently, session by session, across all AI-assisted work? Permanent, append-only. Committed. Finer-grained than [PROGRESS.md](PROGRESS.md): every meaningful AI session gets an entry here (investigation, fix, feature, decision, or documentation change), including sessions too small to warrant a [PROGRESS.md](PROGRESS.md) milestone entry. When a session also completes a [PLAN.md](PLAN.md) milestone, add a corresponding (shorter) [PROGRESS.md](PROGRESS.md) entry as well - the two are not mutually exclusive.

### Start-of-Session Sequence

1. Read [AGENTS.md](AGENTS.md), [PLAN.md](PLAN.md), [PROGRESS.md](PROGRESS.md), [DECISIONS.md](DECISIONS.md).
2. Check the repository root for `plan.md`/`progress.md`; if present, they describe an in-progress task - reconcile before continuing it.
3. Read only the reference document(s) relevant to the task (see Agent Workflow below).
4. Read the most recent [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md) entries relevant to the task's area, not the whole file.

### End-of-Session Sequence

1. Update root `progress.md` if the task is incomplete; delete/reset it once the task is complete.
2. Update root `plan.md` only if strategy/scope changed; remove it once the task is complete.
3. Append a new entry to [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md) for any meaningful session, regardless of whether `plan.md`/`progress.md` also changed.
4. If a [PLAN.md](PLAN.md) milestone completed, append a matching [PROGRESS.md](PROGRESS.md) entry and update [PLAN.md](PLAN.md).
5. If a stable new rule was discovered, propose adding it to this file's Changelog section at the bottom.
6. If source code contradicts any of these files, source code wins - correct the file, do not silently trust it next time.

## Repository Structure

- `app/`: Next.js App Router routes, layouts, global CSS, and page modules.
- `public/`: public static assets (currently the default `create-next-app` placeholders).
- `src/`: reserved for future centralized config/lib code; currently empty.
- `prisma/`: Prisma schema (`schema.prisma`), configuration (`prisma.config.ts`), split domain models under `models/`, migrations under `migrations/`, and a seed entry point configured at `prisma/seed/index.ts` (directory exists; seed script not yet written).
- `docker/`: Docker service initialization files.
- `docs/governance/`: AI governance, roadmap, progress, and decision index.
- `docs/references/`: authoritative project reference documents.
- `docs/architecture/`: architecture overviews and diagrams.
- `docs/decisions/`: future standalone ADR files.
- `docs/AI_SESSION_LOG.md`: permanent, append-only AI session history (see State Management Protocol above).
- `plan.md`, `progress.md` (repository root, gitignored): ephemeral current-task state (see State Management Protocol above).
- `node_modules/next/dist/docs/`: local Next.js documentation to consult before application code changes.

## Engineering Philosophy

- Reuse existing patterns before adding abstractions.
- Keep changes scoped, reviewable, and reversible.
- Prefer typed, explicit, framework-native solutions.
- Separate permanent standards from sprint state.
- Document architectural decisions once, then reference them.
- Do not invent routes, APIs, tables, commands, design tokens, or business rules.

## Technology Overview

The approved stack and tooling are defined in [../references/Technology-Stack.md](../references/Technology-Stack.md).

Verified from repository files:

- Framework: Next.js `16.2.10` with App Router.
- Language: TypeScript.
- Runtime/UI: React `19.2.4`.
- Styling: Tailwind CSS v4 through `@tailwindcss/postcss`.
- Database: PostgreSQL.
- ORM: Prisma `7.8.0`.
- Local services: native PostgreSQL 16 + pgAdmin 4 (ADR-0010).
- Package manager: npm.

Do not update framework, package, Docker, or database tooling without an explicit implementation task.

## Architecture Principles

- Use App Router conventions verified from local Next.js documentation before changing app structure.
- Prefer server components unless client-side state, effects, browser APIs, or interactivity require a client component.
- Keep public pages indexable, accessible, and semantic by default.
- Keep database access typed and isolated behind clear server-side boundaries.
- Record major architectural choices in [DECISIONS.md](DECISIONS.md); place future standalone ADRs in [../decisions/](../decisions/).

## Coding Standards

- Use TypeScript for application and configuration code.
- Keep functions and components focused on one responsibility.
- Use existing utilities, components, schemas, and helpers before adding new ones.
- Avoid broad rewrites, formatting churn, or unrelated cleanup.
- Validate input at API and server boundaries.
- Never expose secrets, credentials, tokens, cookies, or production data.

## Naming Conventions

- Components: PascalCase.
- Types/interfaces: PascalCase.
- Variables and functions: camelCase.
- Constants: UPPER_SNAKE_CASE only for true constants.
- Route folders and non-component files: kebab-case unless Next.js requires a special filename.
- Prisma models: PascalCase singular nouns.

## Folder Structure Rules

- Keep route-specific UI close to its route until shared reuse is verified.
- Add shared component folders only when a clear repeated use exists.
- Keep database schema and migrations under `prisma/`.
- Keep governance documents in `docs/governance/`.
- Keep long-form references in `docs/references/`.
- Keep ADR files in `docs/decisions/` once they are split out from the decision index.

## Frontend Standards

Use [../references/Brand-Identity.md](../references/Brand-Identity.md) for the detailed design system.

- Use accessible semantic HTML before custom controls.
- Use `lucide-react` icons for common interface actions.
- Use Tailwind v4 and centralized theme variables.
- Avoid ad hoc colors, spacing, and typography outside the design system.
- Verify responsive layouts so text and controls do not overlap or overflow.

## Backend Standards

- Keep server-side behavior explicit and typed.
- Validate inputs with existing patterns or `zod` where appropriate.
- Return consistent status codes and response shapes.
- Preserve authentication, authorization, validation, logging, and side effects.
- Do not expose stack traces or internal configuration in user-facing responses.

## Database Standards

Use [../references/Database-Design.md](../references/Database-Design.md) for PostgreSQL and Prisma modeling rules, and [../references/Database-Standards.md](../references/Database-Standards.md) for database engineering standards that agents must preserve.

- PostgreSQL is the database standard.
- Prisma is the ORM and migration standard.
- Prisma Client uses the standard `prisma-client-js` generator and must generate into `node_modules/@prisma/client`, not custom source folders.
- Review generated migration SQL before applying it.
- Never run migrations, destructive SQL, seeders, or data writes without explicit approval.
- Do not edit generated Prisma artifacts manually.

## SEO Standards

Use [../references/SEO-Guide.md](../references/SEO-Guide.md) as the detailed SEO implementation source of truth.

- Treat SEO as a first-class requirement for public pages.
- Use clear metadata, canonical URLs where needed, semantic headings, structured content, and meaningful alt text.
- Prefer server-rendered/indexable content for public pages.
- Do not add noindex, robots changes, redirects, or canonical changes without an explicit reason.

## Accessibility

- Use semantic elements and proper heading order.
- Provide labels for form controls and accessible names for icon buttons.
- Preserve keyboard navigation and visible focus states.
- Maintain sufficient contrast.
- Respect reduced-motion needs for nonessential animation.

## Performance

- Avoid unnecessary client JavaScript.
- Optimize images and media using framework-supported patterns.
- Avoid expensive effects and avoid broad re-renders.
- Keep database queries explicit and indexed when query patterns are known.

## Security

- Do not expose secrets or sensitive data.
- Do not weaken auth, permissions, validation, sanitization, upload restrictions, or CSRF protections.
- Treat user data, admin operations, external integrations, uploads, and database writes as high risk.
- Flag mutating GET endpoints if discovered.

## Testing

Use verified commands only:

- `npm run lint`
- `npm run build`
- `npm run dev`
- `npm run start`

Prefer file-scoped or narrow verification when possible. Do not introduce a new test framework without approval. If automated coverage is unavailable or inappropriate for a documentation-only task, state that clearly.

## Git Workflow

- Inspect `git status --short` before editing.
- Do not revert user changes.
- Do not create branches, stage, commit, push, or open pull requests unless requested.
- Keep unrelated file changes out of the task.
- Mention unverified or skipped checks in the final handoff.
- Commit: this file, [PLAN.md](PLAN.md), [PROGRESS.md](PROGRESS.md), [DECISIONS.md](DECISIONS.md), `../../CLAUDE.md`, `../../AGENTS.md`, `../references/*.md`, `../architecture/*.md`, `../decisions/*.md`, `../AI_SESSION_LOG.md`. These are permanent project knowledge.
- Keep local/gitignored: root `plan.md`, root `progress.md`. These are ephemeral and task-scoped (see `.gitignore`).
- Do not modify `.gitignore` to change this strategy without explicit request.

## Mechanical Enforcement

Prose guardrails above are backed by mechanical enforcement only where verified below; everything else is prose-only and depends on the agent honoring it.

- **Verified - Husky pre-commit hook** (`.husky/pre-commit` running `npx lint-staged`): staged `.ts/.tsx/.js/.jsx` files are run through `eslint --fix`, and `.ts/.tsx/.js/.jsx/.css/.json/.md` files through `prettier --write`, before a commit completes. This mechanically enforces lint/format standards, not the safety boundaries below.
- **Not yet configured - Claude Code hooks**: no `PreToolUse`/`PostToolUse` hook rules exist in `.claude/settings.json` (no such file is present). The "Requires explicit approval" list above (dependency installs, migrations, destructive SQL, schema changes, deletes, full builds/tests, git push/branch changes) is currently enforced by agent judgment only, not blocked mechanically. Adding hooks for this list is a recommended future improvement, not yet approved or implemented.
- **Not yet configured - Codex sandbox/approval policy**: no Codex-specific configuration exists in this repository.
- If a tool's mechanical configuration and this file ever disagree, treat that as a bug to fix immediately, not a conflict to silently tolerate.

## When Stuck

If blocked on a fact, file, or decision:

1. Re-read the relevant governance/reference file(s) and search for exact route, table, component, or command names before guessing.
2. Apply the Anti-Loop Rules above (max two discovery attempts per target) before concluding information is missing.
3. Mark unresolved facts as `UNCERTAIN` rather than guessing or hallucinating behavior.
4. State plainly what was checked and what remains unknown.
5. Ask a precise question, or propose a short investigation plan, instead of proceeding on an assumption.

## Self-Improvement & Feedback

- If a recurring mistake, friction point, or reusable gotcha surfaces during a session, record it in root `progress.md` while the task is active, and as a Known Gotcha/Decision in that session's [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md) entry.
- If a gotcha proves stable across sessions, propose promoting it into the relevant section of this file, with a dated line in the Changelog section at the bottom.
- Do not add generic advice that does not prevent a real, observed mistake in this repository.

## Documentation Standards

- Root [../../AGENTS.md](../../AGENTS.md): lightweight repository entry point.
- Root [../../CLAUDE.md](../../CLAUDE.md): Claude Code adapter file; contains nothing but a pointer to the root `AGENTS.md`.
- Root `plan.md`, `progress.md` (gitignored, may not exist): ephemeral current-task state.
- [AGENTS.md](AGENTS.md): permanent engineering handbook.
- [PLAN.md](PLAN.md): living roadmap and execution tracker.
- [PROGRESS.md](PROGRESS.md): chronological, milestone-level engineering journal.
- [DECISIONS.md](DECISIONS.md): decision index.
- [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md): permanent, append-only, session-level AI work history.
- [../references/README.md](../references/README.md): reference library index.
- [../architecture/README.md](../architecture/README.md): architecture documentation index.
- [../decisions/README.md](../decisions/README.md): standalone ADR convention.

Governance documents should link to reference documents instead of duplicating their full content.

## Decision Rules

- Source code and schema are the first authority for current behavior.
- Reference documents are authoritative for approved strategy, design, SEO, stack, and data modeling intent.
- Architectural decisions belong in [DECISIONS.md](DECISIONS.md) or future files under [../decisions/](../decisions/).
- Mark unresolved claims as `UNCERTAIN` rather than guessing.

## Agent Workflow

Before implementation, read:

1. [AGENTS.md](AGENTS.md)
2. [PLAN.md](PLAN.md)
3. [PROGRESS.md](PROGRESS.md)
4. [DECISIONS.md](DECISIONS.md)

Then read only the specific reference document needed for the task:

- Any Phase 1 feature, route, schema, or navigation work: first check [../references/Phase-1-Reconciled-Decisions.md](../references/Phase-1-Reconciled-Decisions.md); if the topic is listed there and still PROPOSED, ask before choosing an option
- Phase scope and build order: [../references/Phase-Development.md](../references/Phase-Development.md) and [../references/Phase-1-Step-by-Step.md](../references/Phase-1-Step-by-Step.md)
- Brand/design work: [../references/Brand-Identity.md](../references/Brand-Identity.md)
- Images and mockups: [../references/Visual-Asset-Inventory.md](../references/Visual-Asset-Inventory.md)
- Business/content strategy: [../references/Business-Strategy.md](../references/Business-Strategy.md)
- Stack/tooling work: [../references/Technology-Stack.md](../references/Technology-Stack.md)
- Database/schema work: [../references/Database-Design-Reference.md](../references/Database-Design-Reference.md) (tables) and [../references/Database-Design.md](../references/Database-Design.md) (Prisma conventions)
- Database standards work: [../references/Database-Standards.md](../references/Database-Standards.md)
- SEO/routing/metadata work: [../references/SEO-Guide.md](../references/SEO-Guide.md)
- Architecture notes: [../architecture/README.md](../architecture/README.md)
- ADR conventions: [../decisions/README.md](../decisions/README.md)

Reference documents in `../references/` describe approved strategy, design, and data-modeling _intent_. They are not implementation-status trackers - verify against current source/schema before treating any section as already built, and mark unconfirmed claims `UNCERTAIN`.

## Anti-Loop Rules

- Use a maximum of two discovery attempts per target file.
- If a primary path is missing, use the documented fallback or closest logical equivalent.
- Do not perform broad repository-wide scans unless the task genuinely requires it.
- Do not reread identical files repeatedly.
- Prefer exact-name searches over exploratory browsing.
- After limited discovery, proceed with best logical judgment and mark uncertainty.

## Forbidden Actions

- Do not modify application source during documentation-only tasks.
- Do not alter Prisma schema, migrations, Docker, Next.js, Tailwind, package files, or environment configuration unless explicitly in scope.
- Do not install dependencies without approval.
- Do not run destructive commands or database resets without approval.
- Do not create duplicate governance systems.
- Do not replace project-specific standards with generic boilerplate.
- Do not hallucinate completed work, test results, business requirements, or reference documents.

## Reference Documents

- [Brand Identity](../references/Brand-Identity.md)
- [Business Strategy](../references/Business-Strategy.md)
- [Technology Stack](../references/Technology-Stack.md)
- [Database Design Reference](../references/Database-Design-Reference.md)
- [Database BaseModel Convention](../references/Database-Design.md)
- [Phase Development](../references/Phase-Development.md)
- [Phase 1 Step-by-Step](../references/Phase-1-Step-by-Step.md)
- [Phase 1 Reconciled Decisions](../references/Phase-1-Reconciled-Decisions.md)
- [Visual Asset Inventory](../references/Visual-Asset-Inventory.md)
- [Database Standards](../references/Database-Standards.md)
- [SEO Guide](../references/SEO-Guide.md)
- [Reference Library Index](../references/README.md)
- [Architecture Index](../architecture/README.md)
- [ADR Directory](../decisions/README.md)
- [AI Session Log](../AI_SESSION_LOG.md)

## Quick Checklist

- Read governance files in order; check the repository root for `plan.md`/`progress.md`.
- Check whether a specialized reference document is needed.
- Keep edits scoped to the request.
- Preserve user changes.
- Use relative Markdown links for docs.
- Run only appropriate verification.
- Update root `progress.md` for an in-progress task; remove it once the task completes.
- Append an entry to [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md) for any meaningful session.
- Update [PROGRESS.md](PROGRESS.md) and [PLAN.md](PLAN.md) when a roadmap milestone completes.

## AGENTS.md Changelog

- 2026-10-28: Local database and pgAdmin moved from Docker Compose to a native install (ADR-0010). Updated Technology Overview accordingly.
- 2026-10-28: Reference library refreshed (pack v1.1). Added Phase Development, Phase 1 Step-by-Step, Phase 1 Reconciled Decisions, Database Design Reference, and Visual Asset Inventory to the reference map. Agents must check Reconciled Decisions before choosing between conflicting reference options.
- 2026-08-23: Added State Management Protocol, Mechanical Enforcement, When Stuck, and Self-Improvement & Feedback sections; wired in root `plan.md`/`progress.md` and `docs/AI_SESSION_LOG.md` after a full AI-workflow audit. See the corresponding [../AI_SESSION_LOG.md](../AI_SESSION_LOG.md) entry.
- 2026-07-26: Initial governance handbook created from repository audit (documented in [PROGRESS.md](PROGRESS.md)).
