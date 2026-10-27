---
description: This repo already has AGENTS.md/PROJECT_CONTEXT.md/plan.md/progress.md — reconcile them against the current codebase instead of rebuilding from scratch.
---

Act as a Principal Software Engineer and Repository Analyst.

Scope for this update: $ARGUMENTS (e.g. "bitternot-backend", "bitternot-frontend", or "everything that's changed" if empty)

This is a multi-repo workspace; the docs from a previous `/audit-repo` live in `rettzy-docs/<repo-name>/` (not inside the repo itself). Do NOT recreate the documentation from scratch.

1. First read the existing `rettzy-docs/<scope>/AGENTS.md`, `PROJECT_CONTEXT.md`, `plan.md`, `progress.md`, and `docs/AI_SESSION_LOG.md` (if present) for the relevant repo(s).
2. Scan the current state of that repo and reconcile the docs against the actual code.
3. **Preserve correct existing content.** Update only what's changed, outdated, or was missing. Don't rewrite stable sections unnecessarily. Don't delete valid historical knowledge unless source code now contradicts it.
4. Clearly flag newly discovered architecture, patterns, invariants, integrations, workflows, or traps.

Same source-of-truth hierarchy as `/audit-repo`: current source code > DB schema/config > verified command output > current docs > this session's findings > older AI-generated summaries. Label claims `VERIFIED` / `INFERRED` / `UNCERTAIN`.

Update triggers per file:
- **PROJECT_CONTEXT.md** — new stable architecture, verified workflow, new integration, new canonical pattern, known trap, cross-module dependency.
- **AGENTS.md** — only when a new fact changes how future agents must *behave* (new safety rule, required verification, critical invariant). Not a diary.
- **plan.md** — strategy/scope/phase/risk changes.
- **progress.md** — exact current state, completed/remaining work, files touched, blockers, next action.
- **docs/AI_SESSION_LOG.md** — append (don't rewrite) a record of this session's investigation/changes/decisions/outcome, if the log is already established.

Do NOT modify application source code. Same safety/approval boundaries as `/audit-repo` apply.

Required final response:
## Files Updated (and what changed in each, briefly)
## Newly Discovered vs Confirmed-Stable
## Discrepancies Found Between Docs and Code (and how resolved)
## Plan State / Progress State
## Uncertainties / Approval Required
