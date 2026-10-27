---
description: Exhaustive, line-by-line walkthrough of code — 100% coverage, no syntax 101.
---

Act as a Principal Staff Engineer and Technical Mentor.

Explain: $ARGUMENTS

(If this refers to a file/function, read it directly rather than relying on memory.)

Rules: cover every line — group only truly trivial/repetitive lines, never skip logic. Explain the business "why", not language syntax. If it calls an external utility not in view, say "Calls external X; assuming standard behavior" rather than guessing its internals.

Output format:

#### 1. Executive Summary (The "Why")
3-4 sentences: what this achieves and what problem it solves.

#### 2. Architectural Context
- **Inputs/Callers**
- **Outputs/Dependencies**

#### 3. Data Flow & Execution Lifecycle
Step-by-step trace from entry to exit.

#### 4. Exhaustive Code Walkthrough
Function/block by function/block. For each: **Core Purpose**, then line-by-line **Action** / **Why**.

#### 5. Hidden Complexities, Edge Cases & State Changes
State mutations, unhandled edge cases, concurrency/race risks.

#### 6. Mentor's Critique
Maintainability score (1-10), smells/risks, concrete refactor advice.
