# Design Skills Setup for Claude Code — Final Reference Document

**Emil Kowalski Skills · Impeccable · Taste Skill**

Final Knowledge and Reference Document · Version 1.0 · 29 October 2026 · Status: Working Reference

Prepared from: research, project discussion, files, and verified sources.

## Document Control

| Field                   | Value                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Document purpose        | Install, configure, and use three design Agent Skills in Claude Code, with a self-setup section Claude Code can execute |
| Scope                   | Everything discussed in this chat about the three skills (assumed: whole conversation)                                  |
| Current status          | Working Reference. Nothing installed yet (PLANNED)                                                                      |
| Intended audience       | Rettzy developer; Claude Code acting as setup agent                                                                     |
| Source period covered   | 29 October 2026 research session                                                                                        |
| Version                 | 1.0                                                                                                                     |
| Last updated            | 29 October 2026                                                                                                         |
| Primary source of truth | Official GitHub READMEs and impeccable.style docs                                                                       |

## How to Use This File in Claude Code

1. Save this Markdown file in your project, for example as `docs/plans/DESIGN_SKILLS_SETUP.md`.
2. Open Claude Code in that project folder.
3. Paste this prompt: `Read docs/plans/DESIGN_SKILLS_SETUP.md and execute Section 19 (AI Agent Handoff Context) step by step. Stop and ask me before any step marked APPROVAL.`
4. Claude Code will check prerequisites, run the terminal installs, and then tell you which slash commands you must type yourself (plugin commands and `/impeccable init` are interactive and run inside the Claude Code chat, not in a shell).

Important: Claude Code cannot type its own `/plugin` commands or restart itself. Those steps are marked **USER ACTION**.

## 1. Executive Summary

**Objective.** Add three community design Agent Skills to Claude Code so that AI-generated user interfaces stop looking generic ("AI slop"), for both new and existing Rettzy projects.

**Key findings.** All three are Agent Skills that run in Claude Code (the terminal/desktop coding agent), not in the claude.ai chat. Each installs with one command. They overlap: Impeccable and Emil both handle animation; Impeccable and Taste Skill both produce full designs. Taste Skill is expensive per run (30–45 minutes and a few hundred thousand tokens).

**Final direction (AGREED as recommendation).**

- **Impeccable** is the primary design workflow (context, build, critique, polish, audit).
- **Emil Kowalski skills** handle motion, interaction polish, and stress-testing the UI.
- **Taste Skill** is reserved for new landing/marketing pages and high-impact redesigns.

**Status.** PLANNED. Nothing has been installed or tested yet.

**Main limitation.** Overlapping skills can conflict unless each one is called by name and their roles are written into `AGENTS.md`.

**Next action.** Run the self-setup in Section 19.

## 2. Background and Original Requirement

The developer works on Rettzy projects using a Claude Code workflow built on `AGENTS.md`, `plan.md`, `progress.md`, a session log, and `docs/plans/*.md` reference documents, plus custom slash commands (`/plan`, `/blueprint`, `/implement`, `/fix`, and others).

The requirement was: (1) how to install the Emil Kowalski design skills, Impeccable, and Taste Skill into Claude so they can be used; (2) how to use them on new projects; (3) how to use them on existing projects. The follow-up requirement was a reference file Claude Code can read to set the skills up by itself.

The existing workflow has strong rules for preserving architecture, CSS conventions, and jQuery patterns. Design skills that push for bold new visual directions can conflict with those rules unless constrained.

## 3. Scope

**In scope**

- Installation of all three skill packages in Claude Code.
- Prerequisites and verification of the install.
- Usage workflow for new and existing projects.
- Integration with the existing `AGENTS.md` workflow.

**Out of scope**

- Installing into claude.ai web chat (UNCERTAIN whether supported; not pursued).
- Codex, Cursor, or other agents (supported by the tools, not needed here).
- Taste Skill "classic" variants and image-generation skills (moved to separate repositories).
- Impeccable image-generation (mockup-first) setup, which needs extra configuration.

**Assumptions**

- INFERRED: Rettzy repos include server-rendered pages with jQuery and DataTables, per the workflow prompts referencing those patterns. Exact frontend stack must be confirmed per repo.
- The developer has Claude Code installed and working.

## 4. Current Verified State

| Item                                                          | State                       |
| ------------------------------------------------------------- | --------------------------- |
| Claude Code workflow (`.claude/blueprints/`, custom commands) | VERIFIED from project files |
| Emil Kowalski skills installed                                | Not installed (PLANNED)     |
| Impeccable installed                                          | Not installed (PLANNED)     |
| Taste Skill installed                                         | Not installed (PLANNED)     |
| Node.js version on machine                                    | UNCERTAIN — must check      |
| Chrome/Edge/Chromium installed                                | UNCERTAIN — must check      |
| PRODUCT.md / DESIGN.md in any repo                            | Not created                 |

## 5. Research and Investigation Findings

### 5.1 Emil Kowalski Skills (emilkowalski/skills)

- VERIFIED: Installed with `npx skills@latest add emilkowalski/skills`. MIT licensed. Source: GitHub README.
- VERIFIED: It is a pack of separate skills. The main one, `emil-design-eng`, is mostly about animation with some general design advice.
- VERIFIED: Other skills include `animate`, `animate-expo`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-performance`, `animation-vocabulary`, `apple-design`, `write-swift`, `pick-ui-library`, `prototype`, `mobile-native`, `break-ui`, and `ask-sonner`.
- VERIFIED: The purpose is to catch small mistakes agents make, for example using an ease-in curve for an enter animation where ease-out is correct.
- Why it matters: these are narrow review and polish tools, not page builders. They are safe to use on existing projects.
- INFERRED: `pick-ui-library`, `ask-sonner`, and `animate-expo` assume React or React Native. Skip them for jQuery screens.

### 5.2 Impeccable (pbakaus/impeccable)

- VERIFIED: Requires Node.js 18.19 or later. Supports Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, and others.
- VERIFIED: Installed with `npx impeccable install` from the project folder. The installer asks which tool and whether to install for this project or all projects. Reload Claude Code afterwards.
- VERIFIED: Team option: add as a Git submodule at `vendor/impeccable` and run `npx impeccable link --source=vendor/impeccable --providers=claude`.
- VERIFIED: `/impeccable init` reads the project, asks questions, and saves context to `PRODUCT.md`.
- VERIFIED: `/impeccable document` records an existing design system (colors, typography, component rules) in `DESIGN.md`.
- VERIFIED: Commands are grouped as Create (`impeccable`, `shape`), Evaluate (`audit`, `critique`), Refine (`animate`, `bolder`, `colorize`, `delight`, `layout`, `overdrive`, `quieter`, `typeset`), Simplify (`adapt`, `clarify`, `distill`), Harden (`harden`, `onboard`, `optimize`, `polish`), and System (`document`, `extract`, `generate`, `init`, `live`).
- VERIFIED: Two new-design modes: mockup-first (needs image generation) and build-directly in code.
- VERIFIED: Optional automatic design-check hook; must be separately allowed in Claude Code.
- VERIFIED: Update with `npx impeccable update`.
- Source: impeccable.style "Install & first steps".

### 5.3 Taste Skill (Leonxlnx/taste-skill)

- VERIFIED: The repo now holds one skill, `design-taste-frontend`. Older variants moved to `Leonxlnx/taste-skill-classics` and `Leonxlnx/imagegen-skills`.
- VERIFIED: Install options: Claude Code plugin (`/plugin marketplace add Leonxlnx/taste-skill` then `/plugin install taste-skill@taste-skill`), or `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`, or `./install.sh` from a clone (symlinks).
- VERIFIED: Plugin install namespaces the skill as `taste-skill:` so it does not collide with other skills. Update with `/plugin update`.
- VERIFIED: Requires Node 22+ and an installed Chrome, Edge, or Chromium. No API keys. Internet is needed to find pictures.
- VERIFIED: A build has six steps: read brief, pick one of three dealt design directions, define the idea, build with real open-licensed images, check in a real browser at three widths, then fix the top three problems for up to three rounds.
- VERIFIED: A build takes about 30–45 minutes and a few hundred thousand tokens.
- VERIFIED: Handles dashboards, admin views, and settings screens since v2.1, and audits an existing page in a browser before changing it.
- VERIFIED: Images come from Wikimedia Commons, Openverse, the Met and similar, with credits placed on the page.

### 5.4 Compatibility and Overlap

| Capability             | Emil           | Impeccable                | Taste                 |
| ---------------------- | -------------- | ------------------------- | --------------------- |
| Full page build        | No             | Yes                       | Yes                   |
| Existing-design polish | Animation only | Yes                       | Via audit-then-change |
| Animation              | Deep           | `animate` command         | Part of build         |
| Project context files  | No             | PRODUCT.md, DESIGN.md     | No                    |
| Browser self-check     | No             | Optional hook / live mode | Yes, required         |
| Cost per run           | Low            | Low–medium                | High                  |

## 6. Options Considered

**Option A: Install all three, assign roles (SELECTED).** Each tool used for what it does best. Disadvantage: needs discipline to call the right one. Mitigated by role rules in `AGENTS.md`.

**Option B: Impeccable only (DEFERRED).** Simplest, lowest cost. Loses Emil's deep motion review and Taste's bold art direction.

**Option C: Taste Skill as the main builder (REJECTED).** Too expensive for routine work and too likely to override existing Rettzy design conventions.

**Option D: Install into claude.ai chat Skills (REJECTED for now).** Taste needs a local browser and Node; Impeccable is designed around a code repo. UNCERTAIN support; Claude Code is the reliable path.

## 7. Final Decision and Recommended Approach

Install all three at **user level** (all projects) in Claude Code. Assign roles:

| Job                                                          | Tool                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| Save project context                                         | Impeccable `init`                                         |
| Record existing design system                                | Impeccable `document`                                     |
| Build a new app page or screen                               | Impeccable                                                |
| Build a new landing/marketing page with strong art direction | Taste Skill                                               |
| Diagnose an existing page                                    | Impeccable `critique`, then `audit`                       |
| Refine an existing page                                      | Impeccable `polish`, `typeset`, `layout`, `quieter`       |
| Animation build or review                                    | Emil `animate`, `review-animations`, `improve-animations` |
| Stress-test with bad data                                    | Emil `break-ui`                                           |
| Mobile feel                                                  | Emil `mobile-native`                                      |
| Frame-rate problems                                          | Emil `animation-performance`                              |

**Prerequisites:** Node 22+ and Chrome/Edge/Chromium.

**Reconsider if:** a skill's install command changes, Claude picks the wrong skill repeatedly, or Taste Skill cost becomes unacceptable.

## 8. Target Workflow

### 8.1 New Project

```text
Scaffold app
  -> /impeccable init            (creates PRODUCT.md)
  -> build pages:
       app screens   -> /impeccable design ...
       landing page  -> taste-skill (design-taste-frontend)
  -> /impeccable critique  -> /impeccable polish
  -> Emil: review-animations, break-ui, mobile-native
  -> /impeccable audit (before shipping)
```

### 8.2 Existing Project

```text
/impeccable init               (PRODUCT.md)
  -> /impeccable document       (DESIGN.md: lock current system)
  -> review DESIGN.md by hand
  -> /impeccable critique <page>  (read only, decide what to fix)
  -> /impeccable polish <page> "keep existing colors, components, jQuery patterns"
  -> Emil: improve-animations (audit), break-ui
  -> /impeccable audit <page>
```

Fit with the existing Rettzy command flow: use `critique` or `find-animation-opportunities` output as input to `/plan`, then `/blueprint` and `/implement` as usual. Use skills directly only for small, isolated polish.

## 9. Detailed Functional Requirements

| ID    | Requirement                                                                                        | Status  |
| ----- | -------------------------------------------------------------------------------------------------- | ------- |
| FR-01 | Emil skills available in every project                                                             | PLANNED |
| FR-02 | Impeccable available in every project                                                              | PLANNED |
| FR-03 | Taste Skill available as `taste-skill:` plugin                                                     | PLANNED |
| FR-04 | Each Rettzy repo has PRODUCT.md (and DESIGN.md if styled)                                          | PLANNED |
| FR-05 | AGENTS.md contains the skill role table and constraints                                            | PLANNED |
| FR-06 | Existing-project skill runs must not change colors, fonts, or component structure without approval | PLANNED |

## 10. Technical Design and File Impact

| File                                                      | Purpose                                            | Status                               |
| --------------------------------------------------------- | -------------------------------------------------- | ------------------------------------ |
| `PRODUCT.md` (repo root, created by Impeccable)           | Audience and goals                                 | PLANNED                              |
| `DESIGN.md` (repo root, created by Impeccable)            | Design system record                               | PLANNED                              |
| `AGENTS.md`                                               | Add "Design Skills" section and reference map line | PLANNED                              |
| `docs/plans/DESIGN_SKILLS_SETUP.md`                       | This document                                      | PLANNED                              |
| User skills directory (`~/.claude/skills/` or plugin dir) | Installed skills                                   | INFERRED location; installers decide |

No application source code changes are required for setup.

## 11. Security, Privacy, and Permissions

- `npx` runs third-party code from npm and GitHub. All three are public, MIT-licensed (Emil, Taste) projects. Review before running in sensitive environments.
- Taste Skill fetches images from the internet and places them in your pages. Replace with licensed client assets before production; check attribution requirements (CC BY / CC BY-SA require credit).
- Impeccable's optional hook runs automatically on UI edits. Only enable it if you accept that.
- Under the Rettzy `AGENTS.md` rules, installing dependencies requires approval. Global skill installs are steps the user approves explicitly.

## 12. Configuration and Environment

| Requirement               | Needed by                                      | Check command                                                       |
| ------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| Node.js 22+               | Taste (Impeccable needs 18.19+)                | `node -v`                                                           |
| npx                       | All                                            | `npx -v`                                                            |
| Chrome, Edge, or Chromium | Taste                                          | `google-chrome --version` / `msedge --version` / check Applications |
| Git                       | Taste clone or Impeccable submodule (optional) | `git --version`                                                     |
| Network access            | Install, Taste image search                    | —                                                                   |

No API keys are required. Optional: an image-generation key for Impeccable mockup-first mode (placeholder only, e.g. `OPENAI_API_KEY=<secure-token>`).

## 13. Implementation Status

| Area                  | Status      | Remaining Work        |
| --------------------- | ----------- | --------------------- |
| Research              | Implemented | None                  |
| Prerequisite check    | Planned     | Run Section 19 Step 1 |
| Emil install          | Planned     | Step 2                |
| Impeccable install    | Planned     | Step 3                |
| Taste install         | Planned     | Step 4 (user action)  |
| Project context files | Planned     | Step 6 per repo       |
| AGENTS.md update      | Planned     | Step 7                |

## 14. Testing and Verification

**Tests already performed:** none. Only documentation was researched.

**Tests still required**

- After restart, ask Claude Code "list your available skills"; confirm Emil skills, `impeccable`, and `taste-skill:design-taste-frontend` appear.
- Run `/impeccable` with no arguments; it should respond with its menu or ask for a task.
- Run `/impeccable critique` on one existing page; confirm it reports findings without editing files.
- Ask Emil `review-animations` on a component with a transition; confirm it reviews.
- Optional: one Taste Skill run on a throwaway page to confirm the browser check works.

**Acceptance criteria:** all three appear in the skill list, each responds when called by name, and PRODUCT.md exists in at least one repo.

## 15. Errors, Failed Attempts, and Lessons Learned

No setup attempts yet. Known pitfalls from documentation:

| Issue                         | Cause                                      | Resolution                                                    |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| Impeccable not appearing      | Not reloaded, or wrong tool/scope chosen   | Restart Claude Code; rerun installer and check tool and scope |
| Taste Skill scripts fail      | Node below 22 or no Chromium-based browser | Upgrade Node; install Chrome/Edge                             |
| Old Taste skill names missing | Moved to `taste-skill-classics`            | Install from the new repo with the same name                  |
| Hook does not run             | Hook not trusted in Claude Code            | Allow it per Impeccable hooks docs                            |

## 16. Risks and Limitations

| Risk                                        | Likelihood       | Impact | Mitigation                                                                           |
| ------------------------------------------- | ---------------- | ------ | ------------------------------------------------------------------------------------ |
| Wrong skill chosen (overlapping animate)    | Medium           | Low    | Call skills by name; role table in AGENTS.md                                         |
| Redesign of existing UI against conventions | Medium           | High   | Run `document` first; add "keep existing" constraints; use `critique` before changes |
| High token cost from Taste                  | High if overused | Medium | Reserve for landing pages                                                            |
| React-oriented advice in jQuery repos       | Medium           | Low    | Skip React-only Emil skills there                                                    |
| Upstream install commands change            | Low–Medium       | Low    | Check READMEs before reinstall                                                       |

## 17. Open Questions and Blockers

**Blocking:** none.

**Non-blocking**

- Node and browser versions on the developer's machine (checked in setup).
- Whether to commit PRODUCT.md and DESIGN.md (recommended: yes, as permanent project knowledge).
- Whether to enable Impeccable's automatic hook.

**Required decisions:** Impeccable scope (recommended: all projects); new-design default mode (recommended: build directly in code).

## 18. Recommended Next Steps

**Immediate**

1. Run the Section 19 setup in Claude Code.
2. Restart Claude Code and run the verification tests.
3. Run `/impeccable init` and `/impeccable document` in one Rettzy repo.
4. Add the Design Skills section to that repo's AGENTS.md.

**Optional later**

- Enable Impeccable's automatic design hook.
- Pin Impeccable as a Git submodule for team consistency.
- Set up image generation for Impeccable mockup-first mode.

## 19. AI Agent Handoff Context

**This section is written for Claude Code. Execute it in order.**

### Objective

Install and verify three design skill packages in Claude Code at user level, then prepare the current repository to use them.

### Hard Constraints

- Do not modify application source code.
- Steps marked **APPROVAL** must be confirmed by the user before running.
- Steps marked **USER ACTION** are slash commands or restarts you cannot perform; print them clearly and wait.
- Do not invent commands. Use only those below.
- If a command fails, report the exact error and stop; do not try alternative install sources.

### Step 1 — Check prerequisites (no approval needed)

```bash
node -v
npx -v
git --version
```

Also check for Chrome, Edge, or Chromium using the OS-appropriate method. Report results. If Node is below 22, stop and tell the user to upgrade Node (Impeccable alone works on 18.19+, but Taste Skill needs 22+).

### Step 2 — Install Emil Kowalski skills (APPROVAL)

```bash
npx skills@latest add emilkowalski/skills
```

If prompted for scope or agent, choose global/user level and Claude Code.

### Step 3 — Install Impeccable (APPROVAL)

```bash
npx impeccable install
```

The installer is interactive. Tell the user to choose **Claude Code** and **all projects**. If you cannot answer interactive prompts, ask the user to run this command in their own terminal.

### Step 4 — Install Taste Skill (USER ACTION)

Tell the user to type these inside the Claude Code chat:

```text
/plugin marketplace add Leonxlnx/taste-skill
/plugin install taste-skill@taste-skill
```

Fallback if plugins are unavailable (APPROVAL, run in shell):

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

### Step 5 — Restart (USER ACTION)

Tell the user to exit and restart Claude Code, then ask you to "continue Section 19 from Step 6".

### Step 6 — Verify and prepare this repo

1. List available skills. Confirm Emil skills, `impeccable`, and `taste-skill:design-taste-frontend` (or `design-taste-frontend`). Report anything missing.
2. Tell the user to run `/impeccable init` (USER ACTION, interactive) and answer its audience questions.
3. If the repo already has a styled UI, tell the user to run `/impeccable document` (USER ACTION). Remind them to review DESIGN.md.

### Step 7 — Update AGENTS.md (APPROVAL)

If `AGENTS.md` exists, propose adding this section (and a changelog line). Show the diff before writing.

```markdown
## Design Skills

Installed: Impeccable, Emil Kowalski skills, Taste Skill (taste-skill:).
Context files: PRODUCT.md (audience), DESIGN.md (design system). Load only for UI tasks.

Roles (call skills by name; do not let them overlap):

- Project context / design system: Impeccable init, document
- New app screens: Impeccable
- New landing/marketing page: Taste Skill (expensive; ask first)
- Diagnose existing page: Impeccable critique, then audit
- Refine existing page: Impeccable polish/typeset/layout/quieter
- Animation: Emil animate, review-animations, improve-animations
- Stress test: Emil break-ui; mobile feel: Emil mobile-native

Rules for existing pages:

- Follow DESIGN.md. Do not change colors, fonts, component structure,
  or jQuery/DataTables patterns without approval.
- Run critique before any change command. Never run bolder, overdrive,
  or a Taste Skill rebuild on an existing page without approval.
- Skip React-only Emil skills (pick-ui-library, ask-sonner, animate-expo)
  in non-React repos.
```

Also add to the Domain Reference Map: `Frontend/UI design work -> PRODUCT.md, DESIGN.md, docs/plans/DESIGN_SKILLS_SETUP.md`.

### Step 8 — Report

Summarize: prerequisites found, what installed, what failed, files created or changed, and remaining user actions.

### Do Not Assume

- The repo's frontend stack. Read it before advising.
- That install paths are fixed. Installers decide locations.
- That Taste Skill images are licensed for client production use without checking.

## 20. Glossary

- **Agent Skill:** a folder with a SKILL.md and supporting files that Claude loads when a task matches it.
- **Claude Code:** Anthropic's agentic coding tool, run from a terminal, desktop app, or IDE.
- **AI slop:** generic, templated-looking AI-generated design.
- **PRODUCT.md / DESIGN.md:** Impeccable's project context and design-system files.
- **Plugin marketplace:** Claude Code's mechanism for installing packaged skills via `/plugin`.
- **npx:** Node tool that runs a package without a permanent install.

## 21. References

**Official documentation and primary sources**

- emilkowalski/skills, GitHub README — install command and skill list. Fully read.
- Impeccable "Install & first steps", impeccable.style — install, init, document, workflows. Fully read.
- Leonxlnx/taste-skill, GitHub README — install options, requirements, cost, moved skills. Fully read.

**Supplied but not read (repos were sufficient):** emilkowal.ski, emilkowal.ski/skill, ui-skills.com Emil page, impeccable.style home, github.com/pbakaus/impeccable, tasteskill.dev, agenticskills.io Taste page.

**Articles and community (not read):** dev.to "Mastering Impeccable" article; Reddit r/claudeskills Taste Skill post.

**Project files:** AGENTS_MD_REFERENCE_GUIDE.md, audit-repo.md, plan.md, blueprint.md, implement.md, project-custom-instructions.md.
