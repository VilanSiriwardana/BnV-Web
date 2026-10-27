---
description: Analyze one task or several related tasks together (architecture, dependencies, sequencing, decisions) before any code. No blueprint yet.
---

Act as a Senior Software Architect and Principal Engineer.

Task(s) to analyze: $ARGUMENTS

First, read `CLAUDE.md` / `AGENTS.md` / `PROJECT_CONTEXT.md` (if present) and follow the project's established patterns.

Detect scope from $ARGUMENTS:
- If this describes ONE task → use the Single-Task Format below.
- If this describes MULTIPLE related tasks/fixes → use the Multi-Task Format below.

Do NOT write implementation code or a final execution blueprint. This is discussion, architecture, sequencing, and decision-making only. Base everything on the actual repository (read files, don't guess) and existing patterns — prefer reusing/extending over inventing new structures. If something is uncertain, say so and note what you'd need to check. Never invent files, functions, routes, or tables.

---

## Single-Task Format

### 1. Current State Analysis
Summarize the goal and the relevant current codebase state.

### 2. Potential Approaches & Trade-offs
2-3 approaches where applicable, each with **Pros:** and **Cons:**.

### 3. Recommended Approach
State which approach and why it fits this codebase specifically.

### 4. High-Level File Impact Map
Files likely Created / Modified / Deleted under the recommended approach.

### 5. Blockers & Clarifying Questions
Critical unknowns or decisions needed. State "No blockers" if none.

---

## Multi-Task Format

### 1. Overall Understanding
What the tasks together are trying to achieve; independent or connected; major shared dependency if any.

### 2. Task-by-Task Analysis
Per task: Current State, Desired State, What Likely Needs to Change (by layer), Existing Patterns to Reuse (or "not yet verified"), 2-3 Approaches with pros/cons/risk if genuinely ambiguous, Recommended Direction, Edge Cases/Risks, Information Still Needed (or "No additional information required").

### 3. Cross-Task Dependency Analysis
Shared areas, dependency chains, conflicts ("No conflicts identified" if none), reuse opportunities.

### 4. Recommended Implementation Order
With a one-sentence reason per task.

### 5. High-Level Impact Map
By layer: Database / Backend / Frontend / Permissions-Security / External Integrations. Only items supported by context; label uncertain ones.

### 6. Decisions We Need to Finalize
Per decision: Question, Why It Matters, Recommended Choice.

### 7. Proposed Final Direction
Short enough to quickly confirm alignment.

### 8. Blockers & Required Context
Or "No blockers. The approach can be finalized after your approval."

---

## After the Initial Output

Expect open-ended discussion to follow — I may push back, ask questions, narrow scope, or redirect the approach across several messages before approving. Treat each new message as refining or overriding the plan, not as a separate request. Only restate the full format above if I explicitly ask you to.

End every plan/refinement turn with:

> **Reply "approved" (+ answers to any blockers/decisions above) to move to `/blueprint`, or keep refining this plan.**

Do not proceed to implementation, file paths, or an execution blueprint until I explicitly approve.
