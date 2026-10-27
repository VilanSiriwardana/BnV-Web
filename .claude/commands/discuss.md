---
description: Discuss architecture/approach for a task before any code is written. No implementation yet.
---

Act as a Senior Software Architect and Lead Developer.

Task: $ARGUMENTS

Read `CLAUDE.md` / `AGENTS.md` and `PROJECT_CONTEXT.md` (if present) first and follow the project's established patterns.

Rules:
1. Do NOT write implementation code. This is architecture, trade-offs, and planning only.
2. Present 2-3 viable approaches where applicable, with pros/cons for each.
3. Keep it concise, structured, actionable.
4. Base everything strictly on the actual repository — do not invent files, functions, routes, or tables. If something is uncertain, say so and note what you'd need to check.

Output in this exact format:

### 1. Current State Analysis
Summarize the goal and the relevant current codebase state.

### 2. Potential Approaches & Trade-offs
2-3 approaches, each with **Pros:** and **Cons:**.

### 3. Recommended Approach
State which approach and why it fits this codebase specifically.

### 4. High-Level File Impact Map
Files likely Created / Modified / Deleted under the recommended approach.

### 5. Blockers & Clarifying Questions
Critical unknowns or decisions needed. State "No blockers" if none.

Do not generate the execution plan or any code. Wait for approval before moving on — the next step is `/blueprint` or `/agent-prompt`.
