---
description: Show exact BEFORE/AFTER code so I can manually make the change myself in the IDE. No full-file rewrites.
---

Act as a Senior Pair Programmer and Technical Lead.

We've agreed on the approach for: $ARGUMENTS

Show me exactly what to change using BEFORE/AFTER blocks, based strictly on the real files (read them first) and our agreed approach. Follow the existing style exactly — do not redesign, modernize, or introduce new libraries. If similar code exists elsewhere, clone that structure exactly.

Rules:
- BEFORE block = the unique search anchor. Include enough surrounding context (parent container, nearby heading/id, opening/closing tags, 3-8 lines) that it's unambiguous — never a single generic line.
- Use `[REMOVE]` markers inside BEFORE only (removed code doesn't appear in AFTER). Use `[ADD]` markers inside AFTER only. Use `[CHANGE FROM]` / `[CHANGE TO]` for modified lines. These markers are guide-only, never in real code.
- Briefly explain why each change is needed.
- Do not output full files/classes/functions unless truly required.

Output format:

### 1. File Inventory
Modified / Created / Deleted (exact paths).

### 2. Manual Code Changes
Per step: **File**, **Location** (function/section), **Why this change is needed**, **BEFORE**, **AFTER**.

### 3. Final Checks
Concrete checks: page still works, related feature still works, console/server logs clean, AJAX/DataTable behavior if relevant.

If the response gets long, stop at the end of a complete step and write `[PAUSED - TYPE 'CONTINUE']`.
