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

## Repository Structure

- `app/`: Next.js App Router routes, layouts, global CSS, and page modules.
- `public/`: public static assets.
- `prisma/`: Prisma schema, configuration, and migrations.
- `docker/`: Docker service initialization files.
- `docs/governance/`: AI governance, roadmap, progress, and decision index.
- `docs/references/`: authoritative project reference documents.
- `docs/architecture/`: architecture overviews and diagrams.
- `docs/decisions/`: future standalone ADR files.
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
- Local services: Docker Compose with PostgreSQL and pgAdmin.
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

## Documentation Standards

- Root [../../AGENTS.md](../../AGENTS.md): lightweight repository entry point.
- [AGENTS.md](AGENTS.md): permanent engineering handbook.
- [PLAN.md](PLAN.md): living roadmap and execution tracker.
- [PROGRESS.md](PROGRESS.md): chronological engineering journal.
- [DECISIONS.md](DECISIONS.md): decision index.
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

- Brand/design work: [../references/Brand-Identity.md](../references/Brand-Identity.md)
- Business/content strategy: [../references/Business-Strategy.md](../references/Business-Strategy.md)
- Stack/tooling work: [../references/Technology-Stack.md](../references/Technology-Stack.md)
- Database/schema work: [../references/Database-Design.md](../references/Database-Design.md)
- Database standards work: [../references/Database-Standards.md](../references/Database-Standards.md)
- SEO/routing/metadata work: [../references/SEO-Guide.md](../references/SEO-Guide.md)
- Architecture notes: [../architecture/README.md](../architecture/README.md)
- ADR conventions: [../decisions/README.md](../decisions/README.md)

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
- [Database Design](../references/Database-Design.md)
- [Database Standards](../references/Database-Standards.md)
- [SEO Guide](../references/SEO-Guide.md)
- [Reference Library Index](../references/README.md)
- [Architecture Index](../architecture/README.md)
- [ADR Directory](../decisions/README.md)

## Quick Checklist

- Read governance files in order.
- Check whether a specialized reference document is needed.
- Keep edits scoped to the request.
- Preserve user changes.
- Use relative Markdown links for docs.
- Run only appropriate verification.
- Update [PROGRESS.md](PROGRESS.md) for governance/documentation milestones.
