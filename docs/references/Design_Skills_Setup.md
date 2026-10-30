# Design Skills Setup for Claude Code — Runbook and Reference

**Emil Kowalski Skills · Impeccable · Taste Skill**

Version 2.0 · 30 October 2026 · Status: Installed and verified on BnV-Web (Windows 11, Claude Code VS Code extension)

## Document Control

| Field                   | Value                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Purpose                 | Install, configure and use three design Agent Skills in Claude Code, in any project, using proven commands |
| Audience                | Developer; Claude Code acting as setup agent                                                               |
| Current status          | Installed on this machine (see §4). Per-project steps (§6) repeat for each new repo                        |
| Version history         | 1.0 (29 Oct 2026) research plan · 2.0 (30 Oct 2026) rewritten from the real install                        |
| Primary source of truth | This runbook (§5–§6), then upstream READMEs and impeccable.style docs                                      |
| Related                 | ADR-0022 in `docs/decisions/DECISIONS.md`; Design Skills section in `docs/governance/AGENTS.md`            |

## How to Use This File in Another Project

1. Copy this file into the project, for example `docs/references/Design_Skills_Setup.md`.
2. Open Claude Code in that project folder.
3. Paste: `Read docs/references/Design_Skills_Setup.md and run §5 and §6 step by step. Ask me before any step marked APPROVAL, and print USER ACTION steps for me to do.`
4. Skip any step whose check in §5.0 shows it is already done (Emil and Taste are installed per user, so they only need installing once per machine).

Claude Code cannot type its own `/` commands, answer interactive installers, or restart itself. Those steps are marked **USER ACTION**.

## 1. Summary

- **Impeccable** — main design workflow: project context, build, critique, polish, audit. Ships an automatic design-check hook.
- **Emil Kowalski skills** — 16 skills for motion, interaction polish and stress testing.
- **Taste Skill** (`design-taste-frontend`) — art direction for landing and marketing pages. Slow and costly (30–45 min, a few hundred thousand tokens per build), so use on request only.

All three are Agent Skills for Claude Code (terminal, desktop or IDE extension), not claude.ai chat. They overlap, so call them by name and write their roles into the project's `AGENTS.md` (§7).

## 2. Prerequisites

| Requirement              | Needed by                   | Check                                                                                                                                                                                                                    | BnV machine    |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Node.js 22+              | Taste (Impeccable 18.19+)   | `node -v`                                                                                                                                                                                                                | v24.18.0       |
| npx                      | All                         | `npx -v`                                                                                                                                                                                                                 | 11.16.0        |
| Git                      | `skills` CLI clones repos   | `git --version`                                                                                                                                                                                                          | 2.51.0         |
| Chrome, Edge or Chromium | Taste (browser self-check)  | Windows: `Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"` and `Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`; macOS/Linux: `google-chrome --version` / `msedge --version` | Both installed |
| Network access           | Install, Taste image search | —                                                                                                                                                                                                                        | Yes            |

No API keys are needed.

## 3. Where Things Install

| Package    | Scope used          | Location                                                                                                                  | Name(s) in Claude Code                   |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Emil       | User (all projects) | `~/.claude/skills/<skill>` (source copy in `~/.agents/skills/`)                                                           | `animate`, `review-animations`, … (16)   |
| Taste      | User (all projects) | `~/.claude/skills/design-taste-frontend` (source in `~/.agents/skills/`)                                                  | `design-taste-frontend` (not namespaced) |
| Impeccable | Project             | `<repo>/.claude/skills/impeccable`, `<repo>/.claude/agents/impeccable-*.md`, hook in `<repo>/.claude/settings.local.json` | `impeccable` (`/impeccable <command>`)   |

Emil skills installed: `animate`, `animate-expo`, `animation-performance`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `break-ui`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `pick-ui-library`, `prototype`, `remove-animations`, `review-animations`, `write-swift`.

Impeccable agents installed: `impeccable-asset-producer`, `impeccable-documenter`, `impeccable-finish-reviewer`, `impeccable-manual-edit-applier`.

## 4. Install Log (BnV-Web, 30 October 2026)

| Step                      | Result                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Prerequisites             | All met (§2)                                                                                          |
| Emil skills               | Installed, 16 skills, all rated Safe / 0 alerts / Low risk by the `skills` CLI                        |
| Impeccable 4.8.0          | Installed at **project** level into `.claude` and `.github` (Copilot), engine v0.1.18, design hook on |
| Taste Skill via `/plugin` | **Failed**: `/plugin isn't available in this environment` (VS Code extension)                         |
| Taste Skill via `skills`  | Installed. Scan: Gen Safe, Socket 1 alert, Snyk Medium risk (it fetches images and drives a browser)  |
| Reload window             | `impeccable`, Emil skills and `design-taste-frontend` all listed as available skills                  |
| Governance                | Design Skills section in `docs/governance/AGENTS.md`, ADR-0022, session log entry                     |

## 5. Machine Setup (once per machine)

### 5.0 Check what is already there (no approval)

```bash
node -v
npx -v
git --version
ls ~/.claude/skills        # Windows PowerShell: Get-ChildItem $HOME\.claude\skills -Name
```

If `animate`, `review-animations` … and `design-taste-frontend` are listed, skip 5.1 and 5.2.

### 5.1 Emil Kowalski skills (APPROVAL)

Claude Code can run this itself. The flags make it non-interactive: global, Claude Code only, auto-confirm.

```bash
npx -y skills@latest add emilkowalski/skills -g -a claude-code -y
```

### 5.2 Taste Skill (APPROVAL)

Use the `skills` CLI. It works in every Claude Code surface, including the VS Code extension where `/plugin` does not exist.

```bash
npx -y skills@latest add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -g -a claude-code -y
```

Alternative, only in the Claude Code **terminal CLI** (USER ACTION): `/plugin marketplace add Leonxlnx/taste-skill` then `/plugin install taste-skill@taste-skill`. This namespaces it as `taste-skill:design-taste-frontend`.

## 6. Project Setup (once per repo)

### 6.1 Impeccable (USER ACTION — interactive installer)

Run in your own terminal from the repo root:

```bash
npx impeccable install
```

Answers:

| Prompt                   | Answer                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `Ok to proceed? (y)`     | `y`                                                                                                                            |
| Install target           | `1` (detected harnesses). Use `2` (Customize) to choose only Claude Code if you do not want a `.github` Copilot copy           |
| Install location         | `project` (default) or type the word `global` for all projects. **Do not type `~`** — it is rejected and falls back to project |
| Install the design hook? | `y`                                                                                                                            |

Notes:

- The hook is written to `.claude/settings.local.json`, which is usually git-ignored, so it runs only on your machine. Turn it on/off with `/impeccable hooks on|off`.
- Project-level install puts Impeccable in the repo, so committing `.claude/skills/impeccable` shares it with anyone who clones it.
- Update later with `npx impeccable update`.

### 6.2 Reload (USER ACTION)

Restart Claude Code. In VS Code: Command Palette → **Developer: Reload Window**. Then confirm `impeccable` shows in the skill list.

### 6.3 Project context (USER ACTION)

```text
/impeccable init        -> creates PRODUCT.md (answers audience and goal questions)
/impeccable document    -> creates DESIGN.md from the existing styles (skip in an empty project)
```

Review `DESIGN.md` by hand. If the project has a brand document (BnV: `docs/references/Brand-Identity.md`), that document wins on any conflict. Commit both files.

### 6.4 Write roles into AGENTS.md (APPROVAL)

Add §7 to the project's engineering handbook (BnV: `docs/governance/AGENTS.md`, after Frontend Standards), adapt the stack line, add a changelog line, and record an ADR.

## 7. Roles and Rules (paste into AGENTS.md)

```markdown
## Design Skills

Installed: Impeccable (project, `.claude/skills/impeccable`, with design hook), Emil Kowalski skills and Taste Skill (`design-taste-frontend`) at user level. Context files: `PRODUCT.md` and `DESIGN.md` at the repo root; load them only for UI tasks. The brand document wins where `DESIGN.md` disagrees.

| Job                             | Skill                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Project context / design system | Impeccable `init`, `document`                                                  |
| New app screen or section       | Impeccable                                                                     |
| New landing or marketing page   | Taste Skill (expensive; ask first)                                             |
| Diagnose an existing page       | Impeccable `critique`, then `audit`                                            |
| Refine an existing page         | Impeccable `polish`, `typeset`, `layout`, `quieter`                            |
| Build motion                    | Emil `animate`                                                                 |
| Review or audit motion          | Emil `review-animations`, `improve-animations`, `find-animation-opportunities` |
| Janky motion                    | Emil `animation-performance`                                                   |
| Stress test                     | Emil `break-ui`                                                                |
| Mobile web feel                 | Emil `mobile-native`                                                           |

Rules:

- Use the project's theme tokens and existing UI components and animation libraries. Add no UI or animation dependency without approval.
- Run `critique` before any change command on an existing page. Never run `bolder`, `overdrive` or a Taste rebuild on an existing page without approval.
- Every animation respects `prefers-reduced-motion`.
- Taste Skill images are placeholders; replace them with licensed brand assets before shipping.
- Skip `animate-expo` and `write-swift` (native only). In non-React repos also skip `pick-ui-library` and `ask-sonner`.
```

BnV-specific version (Next.js 16, React 19, Tailwind 4, shadcn/radix in `src/components/ui`, `framer-motion`, `tw-animate-css`, tokens in `app/globals.css`) is in `docs/governance/AGENTS.md`.

## 8. Daily Workflow

### New page or screen

```text
/impeccable <describe the screen>         (landing page: design-taste-frontend instead, ask first)
  -> /impeccable critique  -> /impeccable polish
  -> Emil: animate (motion), review-animations, break-ui, mobile-native
  -> /impeccable audit (before shipping)
```

### Existing page

```text
/impeccable critique <page>    (read only; decide what to fix)
  -> /impeccable polish <page> "keep existing colors, fonts and components"
  -> Emil: improve-animations (audit), break-ui
  -> /impeccable audit <page>
```

With the `/plan` → `/blueprint` → `/implement` flow: feed `critique`, `improve-animations` or `find-animation-opportunities` output into `/plan`. Use skills directly only for small, isolated polish.

## 9. Skill Reference

**Impeccable commands:** Create (`impeccable`, `shape`) · Evaluate (`audit`, `critique`) · Refine (`animate`, `bolder`, `colorize`, `delight`, `layout`, `overdrive`, `quieter`, `typeset`) · Simplify (`adapt`, `clarify`, `distill`) · Harden (`harden`, `onboard`, `optimize`, `polish`) · System (`document`, `extract`, `generate`, `init`, `live`, `hooks`). New designs can be built directly in code (default) or mockup-first (needs an image-generation key).

**Taste Skill build loop:** read brief → pick one of three dealt directions → define the idea → build with open-licensed images (Wikimedia, Openverse, the Met; credits on page) → check in a real browser at three widths → fix the top three problems, up to three rounds. Also handles dashboards, admin and settings screens, and audits an existing page before changing it.

| Capability             | Emil           | Impeccable            | Taste                 |
| ---------------------- | -------------- | --------------------- | --------------------- |
| Full page build        | No             | Yes                   | Yes                   |
| Existing-design polish | Animation only | Yes                   | Via audit-then-change |
| Animation              | Deep           | `animate` command     | Part of build         |
| Project context files  | No             | PRODUCT.md, DESIGN.md | No                    |
| Browser self-check     | No             | Hook / live mode      | Yes, required         |
| Cost per run           | Low            | Low–medium            | High                  |

## 10. Troubleshooting

| Symptom                                        | Cause                                           | Fix                                                                                                                     |
| ---------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/plugin isn't available in this environment`  | VS Code extension has no plugin manager         | Use the `skills` CLI command in §5.2                                                                                    |
| `Unknown install location "~", using project.` | Impeccable only accepts `project` or `global`   | Rerun `npx impeccable install` and type `global`, or keep project                                                       |
| Impeccable also installed into `.github/`      | Installer detected GitHub Copilot in the repo   | Harmless; delete `.github/skills/impeccable` and `.github/agents/impeccable-*` if unused, or choose Customize next time |
| `/impeccable` not listed                       | Claude Code not reloaded                        | Reload window / restart                                                                                                 |
| Hook does not run for teammates                | Hook lives in git-ignored `settings.local.json` | Each developer runs `/impeccable hooks on`                                                                              |
| Taste scripts fail                             | Node below 22 or no Chromium-based browser      | Upgrade Node; install Chrome or Edge                                                                                    |
| Old Taste skill names missing                  | Moved to `Leonxlnx/taste-skill-classics`        | Install from that repo                                                                                                  |

## 11. Security and Risks

- `npx` runs third-party code. Review the scan summary the `skills` CLI prints; Taste scored Snyk Medium (network image fetch, browser automation). Details: https://skills.sh/Leonxlnx/taste-skill.
- Skills run with full agent permissions once loaded.
- The Impeccable hook runs automatically after UI edits.
- Taste images need attribution (CC BY / CC BY-SA) and should be replaced before production.
- Risk of redesigning existing UI against conventions: mitigated by `document` first, `critique` before changes, and the rules in §7.

## 12. Updating

```bash
npx -y skills@latest add emilkowalski/skills -g -a claude-code -y                                               # Emil (re-copies latest)
npx -y skills@latest add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -g -a claude-code -y  # Taste
npx impeccable update                                                                                             # Impeccable, from the repo root
```

Check the upstream READMEs before reinstalling in case commands change.

## 13. Glossary

- **Agent Skill:** a folder with a `SKILL.md` and supporting files that Claude loads when a task matches.
- **`skills` CLI:** `npx skills` — installs skills from GitHub repos into agent folders (`-g` global, `-a` agent, `-y` yes).
- **PRODUCT.md / DESIGN.md:** Impeccable's project context and design-system files.
- **AI slop:** generic, templated-looking AI-generated design.

## 14. References

- emilkowalski/skills — GitHub README
- pbakaus/impeccable and impeccable.style "Install & first steps"
- Leonxlnx/taste-skill — GitHub README
- BnV: ADR-0022 (`docs/decisions/DECISIONS.md`), `docs/governance/AGENTS.md` Design Skills section, `.claude/blueprints/016-design-skills-setup.md`
