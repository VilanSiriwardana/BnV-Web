# Phase 1 — Foundations, Approvals and Static Skeleton

| Field         | Value                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Version       | 1.0                                                                                                     |
| Status        | Proposed. Ready to start once the overview plan is approved                                             |
| Milestones    | M0 (approvals and prep), M1 (static route scaffold)                                                     |
| Prerequisites | Owner approval of [../Love-Site-Implementation-Phases.md](../Love-Site-Implementation-Phases.md)        |
| Next phase    | [Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md](Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md)    |
| Guidebooks    | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md) |

---

## 1. Context

Nothing exists yet. This phase lays every foundation that does not need a new package: the approvals and decision records, version research, the private route, the page's own night/day colour system, the content config, and a static page with all ten sections. After this phase the page already reads well with **no motion at all**, which is also the start of the static fallback required in Phase 6.

Why first: the build must not install anything before approval (root `AGENTS.md`; Tech Stack §0.4). Everything here is reversible and safe for the shop.

---

## 2. What you will see at the end

Open `http://localhost:3002/love/<slug>` (`npm run dev`):

- **No shop chrome:** no announcement bar, no header, no footer, no cart drawer, no cookie banner. DevTools Network shows no analytics requests.
- A dark **Midnight Aubergine** page with ten stacked sections, top to bottom: Gate (seed placeholder, "A little something for you, {name}.", a "Tap to begin" button that does nothing yet), Hero ("Happy Birthday, {name}" in Cinzel), Bloom, Memories (a simple card list), Timeline (five cards), Dawn (a short gap), then the page switches to **Warm Ivory** for Gallery, Wish, Letter and Finale.
- Fonts: Cinzel headings, Cormorant Garamond body, Inter for labels and buttons.
- Tab key: the first focus is "Skip to the letter"; pressing Enter jumps to the letter.
- `http://localhost:3002/love/wrong-slug` shows the site's 404 page.
- The home page and `/admin` still look exactly as before.

---

## 3. Read first

| What                               | Where                                                                                                                         | Why                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Overview and repo corrections      | [../Love-Site-Implementation-Phases.md](../Love-Site-Implementation-Phases.md) §2 (R1–R8), §4, §10                            | The corrections override the guidebooks                      |
| Content config type                | Experience §3.9                                                                                                               | `LoveSiteConfig` shape                                       |
| Scroll map (ids, heights)          | Experience §4.1                                                                                                               | Section ids and stub heights                                 |
| Typography and layout              | Experience §3.2                                                                                                               | Fonts, column widths, buttons                                |
| Theme token roles                  | Experience §3.1                                                                                                               | Night/day pairs (but copy values from `globals.css`)         |
| Dependency list and version policy | Tech Stack §4.1–4.3                                                                                                           | For `npm view` and the ADR                                   |
| Route, metadata, server vs client  | Tech Stack §5.1                                                                                                               | Server page plus one client root                             |
| Governance                         | Tech Stack §12; `docs/governance/AGENTS.md`                                                                                   | ADRs and docs to update                                      |
| Root layout                        | `app/layout.tsx`                                                                                                              | Shows what renders on every page                             |
| Chrome switch                      | `src/components/layout/storefront-chrome.tsx`                                                                                 | Currently hides chrome only on `/admin`                      |
| Tokens                             | `app/globals.css` (`:root` block and the dark block)                                                                          | Source of alias values                                       |
| Image rules                        | `docs/references/Visual-Asset-Inventory.md`                                                                                   | Naming and storage                                           |
| Next.js docs                       | `node_modules/next/dist/docs/` — dynamic routes / params, `generateMetadata` and the `robots` field, `notFound`, `next/image` | Next 16 has breaking changes; read before writing route code |

---

## 4. Tech used in this phase

| Tool / API                       | Role here                                                                        | Rules                                                                                                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js 16 App Router            | `app/love/[slug]/page.tsx` as a **Server Component**                             | Read local Next docs first. In Next 15+ `params` is a Promise; confirm the exact signature in the local docs                                                      |
| `notFound()` (`next/navigation`) | Unknown slug → 404                                                               | Call in the server page                                                                                                                                           |
| Metadata API                     | `robots: { index: false, follow: false }`, neutral title, no names in Open Graph | No sitemap entry, nothing in `robots.ts`                                                                                                                          |
| TypeScript                       | `LoveSiteConfig` types                                                           | Strict types, no `any`                                                                                                                                            |
| Tailwind v4 + CSS variables      | `[data-love-root]` alias block                                                   | Tokens only; no hex in components                                                                                                                                 |
| `npm view` (read-only)           | Version research                                                                 | Do **not** run `npm install` in this phase                                                                                                                        |
| `sharp` (script only)            | Image resizing                                                                   | Installed as a dependency of `next` (`npm ls sharp` → 0.34.5). Ask before importing a transitive package; either approve that or add it as a pinned devDependency |

---

## 5. Step-by-step build

### Step 1 — Version research (M0)

- **Goal:** pick exact, compatible, at least 14-day-old versions.
- **Do:** run the read-only commands in Tech Stack §4.2, plus `npm view <pkg> time --json` to see release dates. Check:
  - `@react-three/fiber` ≥ **9.5.0** and its `peerDependencies` accept React 19.2.x.
  - The `@react-three/drei` and `@react-three/postprocessing` majors whose peers accept R3F v9.
  - `postprocessing` version that satisfies `@react-three/postprocessing`'s peer.
  - `three` and `@types/three` with matching minors, inside drei's and R3F's peer range.
  - `gsap` ≥ 3.13 (free plugins), `@gsap/react`, `lenis`.
- **Output:** a version table (package, chosen version, publish date, peer ranges) pasted into the ADR draft.
- **You should see:** no changes to `package.json` or the lockfile.

### Step 2 — Draft the ADRs (M0)

- **Goal:** record the decisions before any code depends on them.
- **Do:** re-check the last ADR number in `docs/decisions/DECISIONS.md` (ADR-0026 at the time of writing), then append, using the file's existing "Decision Format":
  - **ADR-0027** Adopt three + R3F + drei + postprocessing, GSAP + ScrollTrigger + `@gsap/react`, and Lenis for the Love Site only (version table, bundle isolation to `/love`).
  - **ADR-0028** Love Site route `/love/[slug]`, `StorefrontChrome` exclusion for `/love`, `noindex`, unguessable slug, no analytics.
  - **ADR-0029** Motion exceptions (3D events of 1–2 s; signature letter opening) and the quality-tier system (`high`/`mid`/`low`/`static`).
  - **ADR-0030** Audio policy (start only on user gesture, rights-cleared music with credit, synthetic beat fallback, pause when hidden).
- Mark them **Proposed** until the owner approves.

### Step 3 — Get approvals (M0)

Ask the owner to tick each item in overview §4.2: dependency list, route and chrome exception, motion exception, GSAP skills install, and the music (can stay open). Record the answers in the ADRs and the session log.

### Step 4 — Prototype images and the image script (M0)

- **Goal:** placeholder photos in the right sizes, ready for Phases 3–5.
- **Do:**
  1. Choose 8 memory, 5 timeline and 9–12 gallery images from the existing prototype assets (`public/images/prototype/` and the asset inventory). Prefer romantic/couple scenes; note that they are AI-generated placeholders.
  2. Create a source folder for originals (e.g. `scripts/love-source/`, not served; confirm it is git-ignored or agreed to commit).
  3. Write `scripts/prepare-love-images.mjs` that, for each source, writes to `public/images/prototype/`:
     - `love-memory-NN-orb.webp` — 512×512 centre crop (orb textures).
     - `love-memory-NN.webp` — 1600 px wide (dialog).
     - `love-gallery-NN.webp` — 1200 px wide.
     - `love-timeline-NN.webp` — 1200 px wide.
     - A tiny blur placeholder (e.g. 16 px wide, base64) printed as JSON for the config.
  4. Quality around 80, `fit: 'cover'` for orbs, `withoutEnlargement: true`.
- **You should see:** the new `love-*.webp` files in `public/images/prototype/` and a JSON of width/height/blur values.

### Step 5 — Hide the shop chrome on `/love` (M1, correction R1)

- **File:** `src/components/layout/storefront-chrome.tsx`.
- **Change:** return `null` when `pathname` starts with `/admin` **or** equals `/love` / starts with `/love/`. Use an exact segment check so `/love-websites` (the public product page) **keeps** its chrome.
- Update the component comment to mention `/love`.
- **You should see:** `/love/x` without header/footer; `/love-websites` unchanged; `/admin` unchanged.
- **Also check (R8):** read `src/components/motion/spotlight-provider.tsx`. If it adds global pointer listeners or effects that would show on the love page, note it for Phase 2 (where the canvas takes the pointer) and propose excluding `/love` in the same way.

### Step 6 — Content config (M1)

- **Files:** `src/features/love/config/types.ts`, `src/features/love/config/sites/<slug>.ts`, `src/features/love/config/index.ts` (a `getLoveSite(slug)` lookup returning the config or `undefined`).
- **Shape:** `LoveSiteConfig` exactly as Experience §3.9 (`PhotoRef`, `copy`, `memories` 6–8, `timeline` exactly 5 with one `featured`, `gallery` 9–12, `letter`, `music`).
- **Slug:** long and random (e.g. 24+ characters). Do not use her name.
- **Fill with:** placeholder copy from the Experience guide and the processed prototype images (width, height, blur from Step 4).
- **Optional Vitest:** a test that each site config has 5 timeline items with exactly one `featured`, 6–8 memories and 9–12 gallery photos.

### Step 7 — The private route (M1)

- **File:** `app/love/[slug]/page.tsx` (Server Component). Optional `app/love/layout.tsx` only if shared metadata is useful; it is not needed to hide the chrome.
- **Do:** read `params` (per local Next docs), call `getLoveSite(slug)`, `notFound()` if missing, export metadata with `robots: { index: false, follow: false }` and a neutral title (e.g. "A little something"). Render `<LoveExperience site={config} />` with plain serialisable props.
- **Do not** add the route to `src/config/routes.ts` navigation, `app/sitemap.ts` or `app/robots.ts`.
- **You should see:** the page loads for the real slug, 404s for anything else, and the HTML `<head>` contains `noindex`.

### Step 8 — Night/day alias tokens (M1, correction R3)

- **File:** `app/globals.css`, a new clearly commented block: "Love Site — mirrors the `:root` and dark token blocks above and Brand §32.1/§41.6; update together".
- **Define on `[data-love-root]`:**
  - `--dawn: 0;` and `--depth: 0;` (animated later).
  - Night/day pairs copied **from `globals.css`** for: background, surface, surface-elevated, foreground, border, muted-foreground, primary, gold, gold-text, secondary, ring (and any other token the sections use).
  - The derived semantic tokens with `color-mix(in oklab, var(--day-x) calc(var(--dawn) * 100%), var(--night-x))` (pattern in Experience §3.1).
  - `--depth` mixes night background toward Deep Plum / Velvet Plum (the dark `--surface` and `--surface-elevated` values) as described in Experience §3.1.
- **Static stand-in for Phase 1:** each section sets its own `--dawn` (0 for Gate→Dawn start, 1 for Gallery→Finale) via a data attribute, so the page shows night and day before GSAP exists. Phase 2 replaces this with one scrubbed value on the root.
- The root element paints its own background (`bg-background`, `min-h-svh`) so the global `<body>` colour never shows (R3/R4).
- **You should see:** dark sections in Moon Ivory text, light sections in Soft Charcoal text, gold text readable in both.

### Step 9 — Client root and section stubs (M1)

- **Files:**
  - `src/features/love/love-experience.tsx` (`'use client'`; receives `site`; renders `<div data-love-root>` with `<main>` and the sections). No state yet, except as needed later.
  - `src/features/love/sections/gate.tsx`, `hero.tsx`, `bloom.tsx`, `memories.tsx`, `timeline.tsx`, `dawn.tsx`, `gallery.tsx`, `wish.tsx`, `letter.tsx`, `finale.tsx`.
- **Each stub:** `<section id="…" aria-labelledby="…">` with the id from Experience §4.1, a proper heading, placeholder copy from the config, and the **static design** that will later become the reduced-motion version:
  - Gate: seed (CSS radial gradient), line, disabled-looking button (no behaviour yet).
  - Hero: headline and subhead.
  - Bloom: one line.
  - Memories: a two-column grid of memory cards (photo, date, title, caption) using `next/image`.
  - Timeline: a vertical list of five cards with a static gold line beside them.
  - Dawn: short spacer and the closing line.
  - Gallery: a 2/3-column grid of photos.
  - Wish: heading and a "Make a wish" button (no behaviour).
  - Letter: heading and the letter text, already open.
  - Finale: heading, message and a "Replay our story" button that scrolls to top.
- **Accessibility from the start:** one `<h1>` (hero), `<h2>` per section, a skip link "Skip to the letter" as the first focusable element, landmarks, alt text from the config.
- **Typography:** Experience §3.2; existing `Button` from `src/components/ui/button.tsx`; text columns ≤ 60 characters.
- **Heights:** stubs use natural height in Phase 1; the scroll-map heights arrive with the sticky stages in Phase 2.

### Step 10 — Review the static page

- Run `/impeccable critique` on `/love/<slug>`, then `polish` the static layout. Run `break-ui` with long names, a long letter and Sinhala text.
- Check contrast in night and day sections (DevTools or the impeccable audit).

---

## 6. Contracts introduced

| Contract                     | Location                            | Notes                                                                                          |
| ---------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `LoveSiteConfig`, `PhotoRef` | `src/features/love/config/types.ts` | Exactly Experience §3.9; later phases only read it                                             |
| `getLoveSite(slug)`          | `src/features/love/config/index.ts` | Returns config or `undefined`                                                                  |
| `[data-love-root]` tokens    | `app/globals.css`                   | `--dawn`, `--depth`, alias pairs, derived roles                                                |
| Section ids                  | each section                        | `gate`, `hero`, `bloom`, `memories`, `timeline`, `dawn`, `gallery`, `wish`, `letter`, `finale` |
| Static design per section    | each section                        | Becomes the Calm / reduced-motion / no-WebGL path                                              |

---

## 7. Testing and verification

| Check                   | How                                                                  |
| ----------------------- | -------------------------------------------------------------------- |
| Lint, types, build      | `npm run lint`, `npm run typecheck`, `npm run build`                 |
| Unit tests              | `npm run test` (config validation test, if written)                  |
| Route                   | Real slug renders; wrong slug 404s                                   |
| No chrome, no analytics | Visual check; DevTools Network shows no analytics or consent scripts |
| `noindex`               | View source; check `robots.ts` and `sitemap.ts` unchanged            |
| Shop unaffected         | Home, `/love-websites`, `/admin/login` look as before                |
| Keyboard                | Skip link first; logical tab order                                   |
| Phone width             | DevTools 375 px: readable, no horizontal scroll                      |

---

## 8. Skills to run

| Skill                                        | When                                             |
| -------------------------------------------- | ------------------------------------------------ |
| `/impeccable critique` → `polish`, `typeset` | After Step 9                                     |
| `break-ui`                                   | After Step 9 (long text, Sinhala, missing photo) |

---

## 9. Exit checklist

- [ ] Versions chosen and recorded; no packages installed.
- [ ] ADR-0027 to ADR-0030 drafted; approvals recorded (music may be open).
- [ ] Prototype images and the image script exist.
- [ ] `/love` hides the shop chrome; `/love-websites` and `/admin` unchanged.
- [ ] Route renders for the slug, 404s otherwise, has `noindex`.
- [ ] Alias token block in place; night and day sections both readable.
- [ ] All ten sections stubbed with ids, headings and static designs.
- [ ] Lint, typecheck, build pass; no console errors or hydration warnings.

---

## 10. Risks and fallbacks

| Risk                                                                    | Fallback                                                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| The chrome check catches `/love-websites`                               | Use a segment check (`=== '/love'` or `startsWith('/love/')`)                                                            |
| `color-mix` with `calc()` percentages not supported in an older browser | Acceptable for current browsers; for safety give each derived token a plain night value first, then the `color-mix` line |
| `sharp` import fails in the script                                      | Add `sharp` as a pinned devDependency after asking                                                                       |
| No R3F version accepts React 19.2.4                                     | Stop; record in the ADR; discuss before Phase 2                                                                          |

---

## 11. Docs and governance updates

- `docs/decisions/DECISIONS.md`: ADR-0027 to ADR-0030 (Proposed → Accepted once approved).
- `docs/governance/PLAN.md`: add the Love Site as the current side track and Phase 1 status.
- `progress.md` (root, ephemeral) during work; `docs/AI_SESSION_LOG.md` at the end; `docs/governance/PROGRESS.md` when the phase completes.

---

## 12. Commit plan

1. `docs(love): add ADR-0027 to ADR-0030 for the Love Site`
2. `chore(love): add prototype images and prepare-love-images script`
3. `feat(love): hide storefront chrome on /love`
4. `feat(love): add love site config types and site data`
5. `feat(love): add private /love/[slug] route with noindex`
6. `feat(love): add night/day alias tokens and static section stubs`

---

## 13. Handoff to Phase 2

Phase 2 needs: approved and pinned versions, a working static page with all section ids, the alias token block with `--dawn` and `--depth`, and the static design of every section (reused as the Calm path).
