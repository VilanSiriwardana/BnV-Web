---
description: Audit this repository from scratch and build/rebuild the persistent AI knowledge system (AGENTS.md, PROJECT_CONTEXT.md, plan.md, progress.md, docs/AI_SESSION_LOG.md). Read-only against source code.
---

Act as a Principal Software Engineer, Repository Analyst, and AI Engineering Workflow Designer.

Scope for this audit: $ARGUMENTS (e.g. "bitternot-backend", "bitternot-frontend", or "everything" if empty)

This is a multi-repo workspace: `bitternot-backend/`, `bitternot-frontend/`, and `rettzy-docs/` (centralized docs) are sibling folders under this root. Write output docs into `rettzy-docs/<scope>/`, not into the individual repo roots — e.g. auditing the backend produces `rettzy-docs/bitternot-backend/PROJECT_CONTEXT.md`, not `bitternot-backend/PROJECT_CONTEXT.md`. If scope is "everything", produce one set per repo under its own `rettzy-docs/<repo-name>/` folder, plus a short top-level `rettzy-docs/AGENTS.md` covering rules that apply across all repos (tenant/customWorkflow pattern, cross-repo change order, shared conventions).

Audit the relevant repo(s) and create/update, per scope:
- `AGENTS.md` — non-negotiable operating rules for future AI agents (safety boundaries, approval requirements, existing-code-first mandate, canonical patterns, session protocol). Keep concise and operational, NOT encyclopedic.
- `PROJECT_CONTEXT.md` — the detailed architecture manual: stack, structure, entry points, data flows, domain modules, auth, integrations, workers, canonical "how to add X" patterns, known traps, uncertainties.
- `plan.md` — strategic blueprint (objective, scope, approach, phases, risks) — not a diary.
- `progress.md` — exact current execution state, enough to safely resume.
- `docs/AI_SESSION_LOG.md` — only if session-history tracking is already established or explicitly requested.

If `CLAUDE.md` or other docs already exist, use them as supporting context, but **the current source code is the primary source of truth** — reconcile docs to match actual implementation, not the reverse.

Do NOT modify application source code during this task.

Audit method:
1. Structural scan — identify apps/packages/services, and the overall topology (monorepo? backend+frontend? microservices?). Don't assume.
2. Skip non-meaningful bulk (node_modules, build output, lockfile internals) unless a specific issue needs them.
3. Deep-inspect architecturally significant areas: entry points, routes, controllers, services, models, middleware, auth, DB/migrations, frontend routing/state, integrations, jobs/queues, webhooks.
4. For repetitive patterns (e.g. many similar CRUD controllers), inspect enough examples to confirm the convention rather than reading all of them — record the canonical implementation.
5. Trace key business flows end-to-end (auth, order creation, payment, permission checks, etc. as applicable).

Label every claim `VERIFIED` (confirmed in code), `INFERRED` (strongly supported), or `UNCERTAIN` (insufficient/conflicting evidence). Never present inference as fact. If source code disagrees with existing docs, source code wins — note the discrepancy.

Safety: never perform without explicit approval — dependency changes, migrations, seeders, destructive SQL, auth/permission redesign, payment logic changes, git history changes, commits/pushes, deploys. This audit only reads and documents.

Required final response:
## Files Created or Updated
## Repository Coverage (discovered / analyzed / representative-pattern / partial / unanalyzed)
## Key Project Knowledge Captured
## Critical Rules Added to AGENTS.md
## Plan State / Progress State
## Documentation Synchronization (mutually consistent? contradicts current repo anywhere?)
## Verification Performed
## Uncertainties / Approval Required

Stop after documentation is built and verified — do not proceed into feature implementation.
