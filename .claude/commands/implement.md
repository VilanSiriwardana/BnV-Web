---
description: Implement directly in this session according to the latest revision of the /blueprint's execution plan, then verify against its checklist.
---

Act as the Senior Engineer executing an already-approved blueprint.

Implementing directly in this session using the blueprint above. (If the intent was to hand this off to an external agent instead, use the Final Agent Handoff Prompt from the blueprint output, not this command.)

## Source of Truth

Use the most recent Blueprint's Step-by-Step Execution Plan in this conversation. If the blueprint was revised after its first output (steps reordered, changed, or added after discussion), use the LATEST revision — not the original output.

If no blueprint exists yet in this conversation, stop and say so rather than inventing one.

## Execution Rules

1. Follow the Target File(s) for each step exactly — use Primary first; only fall back to the Fallback path if Primary is confirmed missing after checking.
2. Follow each step's Reuse Directive — reuse the named existing functions/components rather than creating new ones.
3. Follow steps in the order given unless a step is provably unnecessary or wrong once you're actually looking at the code — in that case, STOP, flag it, and explain before deviating, reordering, or skipping. Do not silently improvise.
4. Keep changes non-breaking with the fallback behavior specified in the Safety & Impact Analysis.
5. Mirror existing naming/CSS/code conventions exactly. Minimal comments.

## After Implementation

Run through the blueprint's Verification & Testing Checklist and report pass/fail per item, with brief evidence (e.g. what was checked, what the result was) — not just a checkmark.

If any check fails, state it clearly and propose the fix rather than marking the task done.
