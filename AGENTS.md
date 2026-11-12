<!-- BEGIN:nextjs-agent-rules -->

# This Is Not the Next.js You Know

This repository uses a newer Next.js version with breaking changes. Before writing application code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# B&V Repository Entry Point

B&V is a Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL web platform for the BuwiNVila project.

This root `AGENTS.md` is intentionally lightweight so AI coding tools can discover the project rules quickly. The authoritative engineering handbook lives at [docs/governance/AGENTS.md](docs/governance/AGENTS.md).

## Required Reading Order

Before implementing any feature, bug fix, refactor, schema change, or documentation governance change, read:

1. [docs/governance/AGENTS.md](docs/governance/AGENTS.md)
2. [docs/governance/PLAN.md](docs/governance/PLAN.md)
3. [docs/governance/PROGRESS.md](docs/governance/PROGRESS.md)
4. [docs/decisions/DECISIONS.md](docs/decisions/DECISIONS.md)

If a current task is in progress, also check the repository root for [plan.md](plan.md) and [progress.md](progress.md) (local, ephemeral, task-scoped; may not exist). Append meaningful AI-assisted work to [docs/AI_SESSION_LOG.md](docs/AI_SESSION_LOG.md). See [docs/governance/AGENTS.md](docs/governance/AGENTS.md) for the full State Management Protocol.

Use the reference library only when the task needs that domain context:

- [docs/references/](docs/references/)
- [docs/architecture/](docs/architecture/)
- [docs/decisions/](docs/decisions/)

## Love Site (private birthday page)

A private, scroll-driven 3D page built inside this repo as a separate route. It is not part of the shop navigation. For any Love Site task, read these first, in this order:

1. [docs/references/love-site/Love-Site-Implementation-Phases.md](docs/references/love-site/Love-Site-Implementation-Phases.md): six build phases, exit criteria, file map, and repo corrections that override the guidebooks.
2. [docs/references/love-site/Love-Site-Experience-Guidebook.md](docs/references/love-site/Love-Site-Experience-Guidebook.md): section-by-section behaviour.
3. [docs/references/love-site/Love-Site-Tech-Stack-and-Tools.md](docs/references/love-site/Love-Site-Tech-Stack-and-Tools.md): packages, architecture, performance, governance.

Index: [docs/references/love-site/README.md](docs/references/love-site/README.md).

| Area                    | Path (planned unless it already exists)                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Route                   | `app/love/[slug]/page.tsx` (Server Component, `noindex`)                                                       |
| Feature code            | `src/features/love/` (`config/`, `engine/`, `canvas/`, `sections/`, `ui/`, `hooks/`, `dev/`; kebab-case files) |
| Shop chrome exclusion   | `src/components/layout/storefront-chrome.tsx` (exists; hides chrome for `/admin`, to be extended to `/love`)   |
| Night/day token aliases | `[data-love-root]` block in `app/globals.css`                                                                  |
| Images                  | `public/images/prototype/love-*.webp`, produced by `scripts/prepare-love-images.mjs`                           |
| Audio                   | `public/audio/` (rights-cleared only)                                                                          |

Love Site rules: no new dependency beyond the approved list in the Tech Stack guide; no analytics or third-party scripts on `/love`; every animation has a reduced-motion variant; build one phase at a time.

## Rules for AI Agents

- Treat [docs/governance/AGENTS.md](docs/governance/AGENTS.md) as the authoritative engineering handbook.
- Keep changes scoped to the user request.
- Do not modify application code, configuration, Prisma, Docker, or package files during documentation-only tasks.
- Do not duplicate reference documentation in governance files; link to the source document instead.
- Use relative Markdown links in repository documentation.
- Do not install dependencies, run migrations, reset databases, delete files, stage, commit, push, or change branches unless explicitly requested.
- Preserve user changes and existing documentation history.
