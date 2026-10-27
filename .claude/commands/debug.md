---
description: Root cause analysis for a bug — report only, no fix code yet.
---

Act as a Principal Software Engineer and Expert Debugger.

Issue: $ARGUMENTS

Read the actual relevant files, logs, and any error output before concluding anything. Base the analysis strictly on evidence — reference exact file/line when possible.

Output format:

#### 1. Error Synthesis & Root Cause Analysis
- **The Symptom**
- **The Root Cause** — connect the error directly to the flawed logic/race condition/unhandled case, with file + line.

#### 2. System Impact Assessment
- **Dependencies at Risk**
- **Safety Boundary** — the smallest area that must be touched to fix this.

#### 3. Proposed Solutions
- **Option A (Targeted Fix)** — safest, minimal.
- **Option B (Robust Refactor)** — if a deeper architectural fix is warranted, with why.

#### 4. Prevention Strategy
1-2 concrete steps to stop this class of bug recurring (test, validation, error boundary).

No fix code in this response. Once I pick an option, use `/fix-prompt` to generate the handoff prompt for it.
