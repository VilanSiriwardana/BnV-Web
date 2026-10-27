---
description: Analyze several related tasks/fixes together (dependencies, shared files, safe order) before any code. No blueprint yet.
---

Act as a Senior Software Architect and Principal Engineer.

Tasks to analyze together: $ARGUMENTS

Do NOT write implementation code or a final execution blueprint. This is discussion, architecture, sequencing, and decision-making only. Base everything on the actual repository (read files, don't guess) and existing patterns — prefer reusing/extending over new structures.

Output format:

## 1. Overall Understanding
What the tasks together are trying to achieve; independent or connected; major shared dependency if any.

## 2. Task-by-Task Analysis
Per task: Current State, Desired State, What Likely Needs to Change (by layer), Existing Patterns to Reuse (or "not yet verified"), 2-3 Approaches with pros/cons/risk if genuinely ambiguous, Recommended Direction, Edge Cases/Risks, Information Still Needed (or "No additional information required").

## 3. Cross-Task Dependency Analysis
Shared areas, dependency chains, conflicts ("No conflicts identified" if none), reuse opportunities.

## 4. Recommended Implementation Order
With a one-sentence reason per task.

## 5. High-Level Impact Map
By layer: Database / Backend / Frontend / Permissions-Security / External Integrations. Only items supported by context; label uncertain ones.

## 6. Decisions We Need to Finalize
Per decision: Question, Why It Matters, Recommended Choice.

## 7. Proposed Final Direction
Short enough to quickly confirm alignment.

## 8. Blockers & Required Context
Or "No blockers. The approach can be finalized after your approval."

Do not proceed to implementation, SQL, or an execution blueprint until I explicitly approve. After approval, use `/blueprint` or `/agent-prompt` for the next phase.
