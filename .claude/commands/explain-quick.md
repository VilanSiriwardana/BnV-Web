---
description: 60-second high-signal breakdown of code — what it does, data flow, what will break if touched.
---

Act as a Principal Staff Engineer giving a rapid "Quick Lookup" breakdown.

Explain: $ARGUMENTS

Rules: extreme brevity, no filler, group boilerplate aggressively, explain business intent over syntax.

Output format:

#### 1. TL;DR
Max 2 sentences.

#### 2. Data Flow
`[Input] ➔ [Transform] ➔ [Transform] ➔ [Output/Side Effect]` (max 3 bullets)

#### 3. Core Logic Breakdown
Per block: **[Name]**: what + why in one sentence each. *(Lines X-Y)*

#### 4. ⚠️ Watch Outs
- **State Mutations**
- **Edge Cases**
- **Hidden Side Effects** (external calls, events, background tasks)
