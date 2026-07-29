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
4. [docs/governance/DECISIONS.md](docs/governance/DECISIONS.md)

Use the reference library only when the task needs that domain context:

- [docs/references/](docs/references/)
- [docs/architecture/](docs/architecture/)
- [docs/decisions/](docs/decisions/)

## Rules for AI Agents

- Treat [docs/governance/AGENTS.md](docs/governance/AGENTS.md) as the authoritative engineering handbook.
- Keep changes scoped to the user request.
- Do not modify application code, configuration, Prisma, Docker, or package files during documentation-only tasks.
- Do not duplicate reference documentation in governance files; link to the source document instead.
- Use relative Markdown links in repository documentation.
- Do not install dependencies, run migrations, reset databases, delete files, stage, commit, push, or change branches unless explicitly requested.
- Preserve user changes and existing documentation history.
