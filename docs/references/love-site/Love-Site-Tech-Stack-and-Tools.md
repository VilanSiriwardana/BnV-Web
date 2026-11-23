# B&V Birthday Love Site — Tech Stack & Tools Guidebook

| Field                            | Value                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version                          | 1.0                                                                                                                                                              |
| Status                           | **Adopted and built (v1.1).** As-built state and gaps: [Experience Guidebook §0](Love-Site-Experience-Guidebook.md) (audited 2026-11-19)                         |
| Created                          | 2026-11-12                                                                                                                                                       |
| Audience                         | Claude Code (builder) and the developer (reviewer)                                                                                                               |
| Location                         | `docs/references/love-site/Love-Site-Tech-Stack-and-Tools.md` (moved 2026-11-12)                                                                                 |
| Build order and repo corrections | [Love-Site-Implementation-Phases.md](Love-Site-Implementation-Phases.md). Its §2 overrides this file where they differ (shop chrome, file naming, token aliases) |
| Companion document               | `Love-Site-Experience-Guidebook.md` (every section, interaction and milestone)                                                                                   |
| Based on                         | Decisions made in chat; `Brand-Identity.md` v1.6; `Design_Skills_Setup.md` v2.0; `AGENTS.md`; the two scroll-3D guides; web research done 2026-11-12             |

> **As-built notes (2026-11-19):** the site is all-night (ADR-0029 amendment): no `--dawn`, no day tokens, no Pearl skin or `MeshPhysicalMaterial`, no `skinSwap`; `heart.skin` is replaced by `heart.gold` and `sealRim`. Bloom intensity is fixed per tier (0.7 / 0.4 / off) rather than driven by glow. Files are kebab-case (see §6). A Dance section (`canvas/dance-*`) was added in Phase 7.

**Confidence labels** (same convention as `AGENTS.md`): `VERIFIED` = confirmed in a named document or a source read during research. `INFERRED` = strongly implied, not directly confirmed. `UNCERTAIN` = must be checked before use.

---

## 0. How Claude Code should use this document

1. Read this file, then the companion Experience Guidebook, then `AGENTS.md`, `Brand-Identity.md` and `Design_Skills_Setup.md`.
2. Follow the repo's own workflow (`/plan` → `/blueprint` → `/implement`, `plan.md`, `progress.md`, `AI_SESSION_LOG.md`). Do not invent a parallel workflow.
3. Build **one milestone at a time** (companion doc §15). Never ask for or attempt the whole site in one pass.
4. **Do not install any package until the owner approves the list in §4 and the ADR in §12 exists.** `AGENTS.md` forbids package updates without an explicit task, and `Design_Skills_Setup.md` §7 forbids adding animation or UI dependencies without approval.
5. Before changing Next.js code, read the local docs in `node_modules/next/dist/docs/` (an existing repo rule).
6. Where this document says `UNCERTAIN`, verify against the installed package's README or types before writing code.

---

## 1. What we are building (decisions already made)

| Decision     | Value                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product      | A private, scroll-driven, heavily animated 3D birthday love website for one person                                                                          |
| Hero         | Two soft ribbons of light, **lavender** and **champagne gold**, drift in from left and right, spiral, meet in the centre and weave into a glowing **heart** |
| The heart    | One **persistent character** that travels through every section: glow-up, shine, arrow strike, burst into small hearts, reform into the full heart          |
| 3D approach  | **Code-based Three.js through React Three Fiber (R3F)**. No Spline, no Blender, no GLB models                                                               |
| Sections     | Gate → Hero → Bloom → Floating Memories → Pinned Timeline → Dawn → Gallery → Wish → Love Letter → Finale                                                    |
| Interactions | Pinned story timeline, photo gallery reveal, surprise moments (wish, confetti, letter unlock), music toggle with sound-reactive visuals                     |
| Colour mood  | Night → dawn as the user scrolls, using **only** brand tokens (Midnight Aubergine → Warm Ivory)                                                             |
| Images       | Prototype images already in the BnV repo assets, replaced with real photos before sharing                                                                   |
| Dropped      | The partner-dance idea (revisit later only if wanted)                                                                                                       |

---

## 2. Constraints that come from the repo (do not violate)

| Source                      | Constraint                                                                                                                                                                                    | Confidence                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `AGENTS.md`                 | Next.js `16.2.10` App Router, React `19.2.4`, TypeScript, Tailwind v4 via `@tailwindcss/postcss`, npm                                                                                         | VERIFIED                                  |
| `AGENTS.md`                 | Prefer Server Components; use Client Components only for state, effects, browser APIs, interactivity                                                                                          | VERIFIED                                  |
| `AGENTS.md`                 | Route folders and non-component files are kebab-case; components PascalCase; do not invent routes, tokens or business rules without a decision                                                | VERIFIED                                  |
| `AGENTS.md`                 | Record architectural choices in `DECISIONS.md` / `docs/decisions/`                                                                                                                            | VERIFIED                                  |
| `Design_Skills_Setup.md`    | Existing project stack includes `framer-motion`, `tw-animate-css`, shadcn/radix in `src/components/ui`, tokens in `app/globals.css`                                                           | VERIFIED (per that runbook)               |
| `Design_Skills_Setup.md`    | Use theme tokens and existing components; add no UI/animation dependency without approval; every animation respects `prefers-reduced-motion`; run `critique` before changing an existing page | VERIFIED                                  |
| `Brand-Identity.md`         | Semantic tokens only (no literal colour names in components); light = hero brand, dark = Midnight Lavender Luxury; no neon purple glows; no bouncy or chaotic motion; max hover scale 1.03    | VERIFIED                                  |
| `Brand-Identity.md`         | Fonts per v1.4: Cinzel (display), Cormorant Garamond (copy), Inter (UI), Noto Serif Sinhala fallback. Some older sections still say Playfair Display; v1.4 wins                               | VERIFIED (confirm in §19/§33 of the file) |
| `Brand-Identity.md`         | Motion tokens: fast 150 ms, base 250 ms, slow 400 ms; `ease-standard` `cubic-bezier(0.2,0,0,1)`; `ease-exit` `cubic-bezier(0.4,0,1,1)`; reduced motion keeps only short opacity fades         | VERIFIED                                  |
| `Visual-Asset-Inventory.md` | Existing images are **AI-generated prototype assets**: rename to `<area>-<subject>-<variant>.webp`, store prototypes in `public/images/prototype/`, convert to WebP/AVIF, write alt text      | VERIFIED                                  |

**Two deliberate exceptions this site needs (record both in the ADR):**

1. **3D events are longer than 400 ms.** The brand's 400 ms "slow" token is for UI. Cinematic heart events (burst, reform, arrow strike) run 1–2 s. UI elements (cards, dialogs, buttons) still obey the brand tokens.
2. **This route does not show the shop chrome** (navbar, announcement bar, footer) and does not follow the global theme toggle, because the page owns its own scroll-driven theme. Brand v1.6 says the announcement bar appears on every page; this private page is the single exception.

---

## 3. Stack at a glance

| Layer               | Tool                                                | Role in this project                                                          | Status                                              |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| Framework           | Next.js 16 (App Router), React 19.2, TypeScript     | Route, layout, metadata, image optimisation                                   | Already in repo                                     |
| Styling             | Tailwind CSS v4 + brand tokens in `app/globals.css` | All colours, type, spacing; scroll-driven theme variables                     | Already in repo                                     |
| 3D engine           | **three**                                           | Rendering                                                                     | **New**                                             |
| 3D in React         | **@react-three/fiber** (R3F v9)                     | Scene graph as components, render loop, pointer events                        | **New**                                             |
| 3D helpers          | **@react-three/drei**                               | `useTexture`, `useProgress`, `PerformanceMonitor`, `Billboard`, `Html` (rare) | **New**                                             |
| Glow                | **@react-three/postprocessing** + `postprocessing`  | Soft bloom on the heart                                                       | **New**                                             |
| Smooth scroll       | **lenis** (+ `lenis/react`)                         | Inertia scrolling, programmatic scroll, stop/start                            | **New**                                             |
| Scroll choreography | **gsap** + `ScrollTrigger` (+ `@gsap/react`)        | Pinned sections, scrubbed paths, timed heart events, theme shift              | **New**                                             |
| UI motion           | **framer-motion** (Motion)                          | Memory card, dialogs, gate, music toggle. Never on elements GSAP controls     | Already in repo                                     |
| Dialogs             | shadcn/Radix `Dialog`                               | Memory card, lightbox (focus trap, Esc, ARIA for free)                        | Already in repo (INFERRED path `src/components/ui`) |
| Audio               | **Web Audio API** (native)                          | Music + `AnalyserNode` for sound-reactive visuals                             | Native, no package                                  |
| Images              | `next/image`, `sharp` (script only)                 | Responsive WebP, blur placeholders                                            | `next/image` in repo; `sharp` already used by Next  |
| Hosting             | Vercel (per Brand §7)                               | Deployment, preview links                                                     | Planned                                             |

Not used, on purpose: Spline, React Bits, 21st.dev, Higgsfield, Blender, Zustand, `maath`, `detect-gpu`, any physics engine. Each adds weight or a second way of doing something we already cover.

---

## 4. Packages, versions and install policy

### 4.1 Proposed dependency list (needs approval)

| Package                       | Type       | Why it is needed                                     | Notes                                                                                                          |
| ----------------------------- | ---------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `three`                       | dependency | 3D engine                                            | Pin exact. Add `three` to `transpilePackages` if the Next build complains (R3F's Next.js guide lists it)       |
| `@types/three`                | dev        | Types                                                | Match the `three` minor                                                                                        |
| `@react-three/fiber`          | dependency | React renderer for three                             | **Must be v9 for React 19** (v8 pairs with React 18). Needs a version that supports React **19.2.x**, see §4.3 |
| `@react-three/drei`           | dependency | Helpers                                              | Use the major that pairs with R3F v9 (UNCERTAIN: confirm with `npm view`)                                      |
| `@react-three/postprocessing` | dependency | Bloom                                                | Use the major that pairs with R3F v9 (UNCERTAIN)                                                               |
| `postprocessing`              | dependency | Peer of the above                                    | Version per peer dependency                                                                                    |
| `gsap`                        | dependency | Timelines, ScrollTrigger, SplitText                  | Free for commercial use since GSAP 3.13; ships all former Club plugins in the one `gsap` package               |
| `@gsap/react`                 | dependency | `useGSAP()` hook: scoped setup and automatic cleanup | Official; strongly recommended in React/Next                                                                   |
| `lenis`                       | dependency | Smooth scroll; `lenis/react` for React               | Package name is `lenis` (not the old `@studio-freight/lenis`)                                                  |

Nothing else. If Claude Code believes it needs another package, it stops and asks.

### 4.2 Version policy (supply-chain hygiene)

1. **Inspect first, install later.** Run these (read-only) and paste results into the ADR:

```bash
npm view three version time.modified
npm view @react-three/fiber version peerDependencies
npm view @react-three/drei version peerDependencies
npm view @react-three/postprocessing version peerDependencies
npm view postprocessing version
npm view gsap version
npm view @gsap/react version peerDependencies
npm view lenis version peerDependencies
```

2. **Prefer versions that are at least 14 days old.** Check `npm view <pkg> time` and skip anything published in the last two weeks.
3. **Pin exact versions** (no `^`, no `latest`). Example, after approval:

```bash
npm install --save-exact three@<x.y.z> @react-three/fiber@<x.y.z> @react-three/drei@<x.y.z> \
  @react-three/postprocessing@<x.y.z> postprocessing@<x.y.z> gsap@<x.y.z> @gsap/react@<x.y.z> lenis@<x.y.z>
npm install --save-exact -D @types/three@<x.y.z>
```

4. After install, run the project's existing lint, type-check and build commands (find them in `package.json`; do not invent them).
5. Record the resolved versions in the ADR and in `Technology-Stack.md`.

### 4.3 Compatibility facts found during research

| Fact                                                                                                                                                                                                                                                                                  | Confidence                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| R3F is a React renderer and must pair with the matching React major: v8 with React 18, **v9 with React 19**                                                                                                                                                                           | VERIFIED (R3F docs)                                      |
| When React moved to 19.2.x its internal reconciler changed in a way that was not backwards compatible with 19.1.x. R3F **v9.5.0** (released 30 Dec 2025) was the release that dealt with this. Because this repo is on React **19.2.4**, use R3F **≥ 9.5.0** and re-check on install  | VERIFIED (R3F release notes); exact fix details INFERRED |
| Early R3F v9 releases had reported issues with Next.js 15 (runtime errors in some Chromium builds). Test a bare `<Canvas />` in this repo **first** (Milestone M3) before building on it                                                                                              | VERIFIED as reported issues; current status UNCERTAIN    |
| R3F's Next.js guide says to add `three` to `transpilePackages` in `next.config`                                                                                                                                                                                                       | VERIFIED                                                 |
| GSAP 3.13+ is fully free including ScrollTrigger, SplitText, MorphSVG; the `gsap` package includes them. Current releases seen in research are at least 3.15.x                                                                                                                        | VERIFIED                                                 |
| GSAP publishes official AI skills (`greensock/gsap-skills`) covering ScrollTrigger, plugins, React and performance                                                                                                                                                                    | VERIFIED                                                 |
| Lenis: install with `npm i lenis`; import `lenis/dist/lenis.css`; for GSAP, call `lenis.on('scroll', ScrollTrigger.update)`, add `lenis.raf(time * 1000)` to `gsap.ticker`, and call `gsap.ticker.lagSmoothing(0)`; React adapter is `lenis/react` with `<ReactLenis>` and `useLenis` | VERIFIED (Lenis README)                                  |
| Lenis has no support for CSS scroll-snap (use its separate `lenis/snap` package if snapping is ever needed). We will not use snapping                                                                                                                                                 | VERIFIED                                                 |

---

## 5. Tool-by-tool guide

Each tool: what it does here, how to use it, rules, and traps.

### 5.1 Next.js (App Router)

- **Route:** `app/love/[slug]/page.tsx` (INFERRED name; confirm in the ADR). The `slug` is long and unguessable. Content comes from a typed config file keyed by slug, so the same code can later serve other couples (the "Love Websites" product).
- **Server vs client:** the page file stays a **Server Component** (metadata, config lookup, passing plain props). One thin Client Component, `LoveExperience`, owns everything interactive.
- **3D must not render on the server.** Load the canvas lazily from a Client Component:

```tsx
'use client';
import dynamic from 'next/dynamic';
const LoveCanvas = dynamic(() => import('./canvas/LoveCanvas'), { ssr: false });
```

- **Metadata:** `robots: { index: false, follow: false }`, no sitemap entry, no personal names in Open Graph tags.
- **Layout:** a route-group layout without the shop navbar, announcement bar and theme toggle (see §2 exceptions).
- **Images:** `next/image` for all DOM photos; give `sizes`, use blur placeholders, `priority` only for the first image above the fold.

### 5.2 Three.js via React Three Fiber

R3F gives the full Three.js API as React components; there is no performance penalty versus plain Three.js.

- **One `<Canvas>` only**, fixed behind the page. Never create a second canvas.
- **Per-frame work lives in `useFrame`**, writing to refs and uniforms. **Never call `setState` per frame.**
- **Heart state is a plain mutable object** (§7.3), not React state. GSAP writes to it; `useFrame` reads from it.
- **Particles are GPU-driven:** one `THREE.Points` with a custom `ShaderMaterial`; positions blend between three target sets (ribbon, heart, scatter) using uniforms. This is what makes burst and reform cheap.
- **Mini hearts, petals, confetti** are `InstancedMesh` (one draw call each).
- **Dispose** geometries, materials and textures you create manually (R3F disposes declaratively created ones).
- **Avoid:** `MeshPhysicalMaterial` with `transmission` (expensive double render), real-time shadows, many lights, `Environment` HDRIs larger than needed, SSAO, depth of field.

### 5.3 drei

Use only what we need: `useTexture` (orb photos), `useProgress` (gate loading ring), `PerformanceMonitor` (runtime quality step-down), `Billboard` (photo discs that face the camera). Avoid `Html` for anything heavy; DOM content is simply the page itself.

### 5.4 postprocessing (bloom)

- One `EffectComposer` with one `Bloom` pass (`mipmapBlur`, conservative `luminanceThreshold`, `intensity` driven by the heart's glow).
- `multisampling={0}` and `antialias: false` on the renderer (points and soft glows do not need MSAA).
- **Turned off on the `low` and `static` tiers** (replace with a soft additive glow sprite behind the heart).
- Brand rule: glows are soft lavender with a warm gold edge; **no neon**. Cap bloom intensity so the heart never clips to pure white.

### 5.5 Lenis (smooth scroll)

- Mounted once at the route root through `lenis/react`, with **its own RAF disabled** so GSAP's ticker drives it (one clock, §7.1).
- Used for: smooth wheel scrolling, `scrollTo` (timeline node click, Replay), `stop()` / `start()` (gate, dialogs).
- **Not mounted at all** when reduced motion is on; native scrolling is used instead.
- Add `data-lenis-prevent` to any inner scroll area (long letter card, lightbox caption) so wheel/touch scroll inside it works.
- `syncTouch` stays off: native touch scroll is more reliable on phones; the pinned sections still work.

### 5.6 GSAP + ScrollTrigger (+ `@gsap/react`)

**The core rule of this project: the path is scrubbed, the moments are triggered.**

| Kind                                                  | Mechanism                                                                                                                                                | Examples                                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Continuous, reversible, tied to scroll position       | `ScrollTrigger` with `scrub` (use a small number like `0.6`–`1` for smoothing)                                                                           | heart position along the page, camera fly-through, thread drawing, theme colour shift |
| Dramatic, fixed duration, independent of scroll speed | Timeline created paused; `ScrollTrigger` `onEnter` / `onEnterBack` calls `play()`                                                                        | glow-up, shine, arrow strike, burst, reform, wish merge                               |
| Pinned scenes                                         | Prefer a tall container with an inner CSS `position: sticky` stage and a scrubbed `ScrollTrigger` on the container; use `pin: true` only if sticky fails | Hero, Memories, Timeline, Wish, Letter                                                |

- Use **`useGSAP()`** from `@gsap/react` with a `scope` ref. It reverts tweens and ScrollTriggers on unmount, which prevents the most common Next.js/React bug (duplicate triggers after Fast Refresh or route changes).
- Use **`gsap.matchMedia()`** for breakpoints and for `prefers-reduced-motion`, so each branch cleans up automatically.
- Call `ScrollTrigger.refresh()` after images/fonts settle, and after any layout-changing state (accordion, dialog close).
- Set `ScrollTrigger.config({ ignoreMobileResize: true })` and size full-height elements with `svh`/`lvh`, so the mobile browser address bar doesn't cause jumps.
- **SplitText** (free) for the hero headline reveal. Verify its current accessibility options (aria handling) in the installed version (UNCERTAIN) so screen readers still read one clean sentence.
- **Never animate the same element with GSAP and Motion.** GSAP owns anything scroll-linked and the 3D state; Motion owns small component transitions.

### 5.7 Motion (`framer-motion`, already installed)

Only for: the memory card/dialog open-close, gate fade-out, music toggle, small hover effects on DOM buttons. Durations and easing come from the brand tokens (150/250/400 ms; `ease-standard`).

### 5.8 Tailwind v4 and design tokens

- All colours come from the semantic tokens in `app/globals.css` (`--background`, `--foreground`, `--surface`, `--surface-elevated`, `--primary`, `--primary-text`, `--secondary`, `--gold`, `--gold-text`, `--border`, `--muted`, `--ring`, …). Components use roles such as `bg-background` and `text-foreground`, never hex values.
- **Scroll-driven theme:** the experience root element overrides the same token names; GSAP tweens them between the light and dark values defined in the brand file (see companion doc §3.1). No new hex values are invented. The one derived colour (a lavender-to-plum mix for the "dusk" stop) is computed at runtime with `color-mix` from existing tokens.
- **Canvas colours** (shader uniforms) are read once from the computed token values (`getComputedStyle`) and converted to `THREE.Color`, so the 3D scene stays in sync with the tokens.

### 5.9 Web Audio API

- Created **only after the gate tap** (browsers block audio before a user gesture).
- Graph: `HTMLAudioElement` → `MediaElementAudioSourceNode` → `GainNode` → `AnalyserNode` → destination.
- Analyser data is reduced to three smoothed numbers (bass, mid, treble) and written into the heart state every frame. Mapping is in the companion doc §3.7.
- Pause on `visibilitychange` (tab hidden). A visible music toggle (mute/unmute) is always on screen after the gate.
- The audio file must be **rights-cleared** (own recording, licensed, or royalty-free with credit). Do not ship a copyrighted track.
- If the file is missing or fails to load, fall back to a synthetic 72 bpm heartbeat so the heart still beats.

### 5.10 Dialogs (shadcn/Radix `Dialog`)

Use the existing component for memory cards and the gallery lightbox: focus trap, Esc to close, `aria-modal`, return focus on close. While a dialog is open: `lenis.stop()`, and put `data-lenis-prevent` on scrollable dialog content. On close: `lenis.start()` and `ScrollTrigger.refresh()` only if layout changed.

### 5.11 Image pipeline

- Source: the prototype images already in the BnV assets. Copy to `public/images/prototype/`, rename `love-memory-01.webp` style, convert to WebP.
- Sizes to produce: **512×512** square crop for 3D orb textures; **1600 px wide** for the memory card and lightbox; **1200 px wide** for gallery tiles; tiny blur placeholders.
- A small Node script (`scripts/prepare-love-images.mjs`, using `sharp`) does the resizing. It is a dev tool, not shipped to the browser.
- Prototype images are AI-generated placeholders. Replace them with real photos before the link is shared. Never publish AI images as real portfolio work (brand §42).

---

## 6. Folder structure

As built (kebab-case per Implementation-Phases §2):

```text
app/love/[slug]/page.tsx        # Server Component, noindex
src/features/love/
  love-experience.tsx           # client root
  config/    types.ts, index.ts, sites/<slug>.ts
  engine/    scroll-engine.tsx, story.ts, heart-state.ts, heart-director.ts, heart-director-core.ts,
             heart-path.ts, hero-intro.ts, theme-timeline.ts, tiers.ts, tier-provider.tsx, motion-prefs.ts,
             motion-prefs-provider.tsx, use-quiet.ts, audio-engine.ts, audio-bands.ts, session.ts,
             memory-layout.ts, memories-state.ts, timeline-progress.ts, svg-ndc.ts, confetti-state.ts,
             dance-state.ts, render-stats.ts
  canvas/    love-canvas.tsx, heart.tsx, heart-shaders.ts, heart-geometry.ts, mini-hearts.tsx, petals.tsx,
             confetti.tsx, arrow.tsx, shock-ring.tsx, sparks.tsx, memory-orbs.tsx, orb-shaders.ts, wish-star.tsx,
             projection.ts, token-colors.ts, dance-duo.tsx, dance-geometry.ts, dance-shaders.ts, dance-silhouettes.ts
  sections/  gate, hero, bloom, memories, timeline, starlight, gallery, dance, wish, letter,
             letter-ornaments, finale, love-section, love-photo (.tsx)
  ui/        music-toggle, progress-heart, calm-mode-toggle, memory-dialog, lightbox, static-heart, sticky-stage
  hooks/     use-hold.ts
  dev/       heart-debug-panel.tsx
```

Original proposal (v1.0, superseded):

```text
app/
  love/
    layout.tsx                 # bare layout, no shop chrome, route-level metadata
    [slug]/
      page.tsx                 # Server Component: loads config, renders <LoveExperience/>
src/
  features/love/
    LoveExperience.tsx         # 'use client' root: tier, motion prefs, gate, providers
    config/
      types.ts                 # LoveSiteConfig and friends
      sites/<slug>.ts          # the actual content for this birthday
    engine/
      ScrollEngine.tsx         # Lenis + GSAP ticker + ScrollTrigger wiring
      heart-state.ts           # mutable singleton read by the canvas, written by GSAP
      HeartDirector.ts         # event catalogue + invariants (§7.4 of this doc)
      story.ts                 # builds all scroll timelines (one function per section)
      tiers.ts                 # quality tiers + runtime step-down
      motion-prefs.ts          # reduced motion / save-data / manual "calm mode"
      audio-engine.ts          # Web Audio setup, analyser bands, synthetic fallback
      theme-timeline.ts        # scroll-driven token interpolation
    canvas/
      LoveCanvas.tsx           # the single <Canvas>, camera rig, composer
      Heart.tsx                # particle heart (+ pearl skin)
      heart.shaders.ts         # GLSL strings
      MiniHearts.tsx           # instanced small hearts
      Petals.tsx               # instanced petals
      Confetti.tsx             # instanced confetti
      Arrow.tsx                # the arrow + shockwave ring
      MemoryOrbs.tsx           # photo orbs
      WishStar.tsx
    sections/
      Gate.tsx  Hero.tsx  Bloom.tsx  Memories.tsx  Timeline.tsx
      Dawn.tsx  Gallery.tsx  Wish.tsx  Letter.tsx  Finale.tsx
    ui/
      MusicToggle.tsx  ProgressHeart.tsx  CalmModeToggle.tsx  MemoryDialog.tsx  Lightbox.tsx
    dev/
      HeartDebugPanel.tsx      # dev only, not shipped (companion doc §18)
public/
  images/prototype/            # love-*.webp
  audio/                       # music file (rights-cleared)
scripts/
  prepare-love-images.mjs
```

---

## 7. Architecture

### 7.1 One clock

All motion runs off **GSAP's ticker**, in a fixed order each frame: Lenis updates scroll → ScrollTrigger updates → GSAP tweens run → R3F renders. This prevents the scroll position and the 3D frame from disagreeing (the usual cause of jitter).

```text
 gsap.ticker (one RAF)
   ├─ lenis.raf(time * 1000)         → updates scroll position
   ├─ ScrollTrigger.update           → (called from lenis 'scroll' event)
   ├─ GSAP tweens                    → write to `heart` state + CSS variables
   └─ R3F advance(time)              → useFrame reads `heart`, renders
```

Start with R3F's default loop (`frameloop="always"`). Once everything works, switch to `frameloop="never"` and call R3F's `advance()` from the GSAP ticker as a measured optimisation (UNCERTAIN: confirm the `advance` signature in the installed R3F).

### 7.2 Layers

| z-index | Layer                                                          | Pointer events                                                 |
| ------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| 0       | `<LoveCanvas/>` fixed, `height: 100lvh`, `touch-action: pan-y` | **auto** (receives orb, star and heart clicks)                 |
| 10      | Section DOM (`<main>`)                                         | **none** by default; text blocks, buttons and cards set `auto` |
| 20      | Chrome (music toggle, progress heart, calm-mode toggle)        | auto                                                           |
| 30      | Dialogs (Radix portal)                                         | auto                                                           |
| 40      | Gate overlay                                                   | auto until dismissed                                           |

Because section containers let pointer events pass through, clicks reach the canvas wherever there is no real DOM element on top. **Fallback if this misbehaves in testing:** point R3F's `eventSource` at the page root with `eventPrefix="client"` and guard 3D handlers against clicks that landed on real UI (check `e.nativeEvent.target.closest('[data-ui]')`). Decide in Milestone M7.

**Accessibility twin rule:** every clickable 3D thing (orb, wish star, seal, heart) has a real, focusable DOM `<button>` doing the same job. 3D is never the only way to reach content.

### 7.3 Heart state (the single source of truth)

```ts
// src/features/love/engine/heart-state.ts
export const heart = {
  ndc: { x: 0, y: 0 }, // where the heart should be on screen, -1..1 (responsive)
  depth: 0, // world-units toward/away from the camera
  scale: 1,
  form: 0, // 0 = ribbons, 1 = heart
  burst: 0, // 0 = whole, 1 = fully scattered into small hearts
  glow: 0.6, // base glow; also drives bloom intensity
  shine: 0, // 0..1 highlight sweep progress
  skin: 0, // 0 = aura (night), 1 = pearl (day); cross-faded
  beat: 0, // audio pulse, written by the audio engine
  flinch: 0, // arrow-hit recoil
  ring: 0, // shockwave ring progress
  yaw: 0, // pointer parallax rotation
};
export type HeartState = typeof heart;
```

Rules: GSAP and the audio engine **write**; the canvas **reads** and smooths with `THREE.MathUtils.damp`. The heart stores a **screen position (NDC)**, not a world position, and converts to world units using the current viewport, so it stays correct on every screen size and during rotation.

### 7.4 Heart Director (events with invariants)

All dramatic moments go through one module, `HeartDirector`, so they can't fight each other.

- Events: `glowUp`, `shine`, `pulse`, `burst`, `reform`, `arrowStrike`, `wishMerge`, `dockToSeal`, `skinSwap`, `finaleBurst`.
- **One event at a time.** A second event arriving while one runs is either queued (if it matters) or dropped (if it is decorative such as a throttled shine).
- **Stable-state invariant:** whenever an event finishes, is interrupted, or the user scrolls away, the director forces the heart to the **baseline for the current section** (`burst = 0`, `form = 1`, no ring, no arrow, mini hearts hidden). Fast scrolling up and down must never leave the heart half-burst.
- Every event has a reduced-motion variant (a short fade/pulse instead of movement).

### 7.5 Static and low-power fallback

When WebGL is unavailable, reduced motion is on, or the tier is `static`, the page renders without the canvas: a CSS/SVG heart that changes state with short opacity fades, DOM orbs as a simple card grid, no pinning, native scroll. Every section still works and reads well. The fallback must be built as a real path, not an afterthought.

---

## 8. Performance system

### 8.1 Budgets

| Metric                                                     | Target                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Route JS before the gate is dismissed                      | ≤ 120 KB gzipped (the 3D chunk loads lazily while the gate shows)                            |
| 3D chunk (three, R3F, drei bits, postprocessing, our code) | ≤ 450 KB gzipped                                                                             |
| Frame time on a mid-range phone                            | ≤ 16.6 ms typical; never sustained below 40 fps                                              |
| Draw calls                                                 | < 60                                                                                         |
| Texture memory                                             | < 64 MB; the Phase 12 gallery walk may use up to 150 MB on mobile (ADR-0036, owner decision) |
| Largest Contentful Paint (gate screen)                     | < 2.5 s on a mid-range phone, 4G                                                             |
| Cumulative Layout Shift                                    | ~0                                                                                           |
| Interaction to Next Paint                                  | < 200 ms                                                                                     |
| Total image weight above the fold                          | < 300 KB                                                                                     |

These are targets to measure against with Lighthouse and real devices, not guarantees.

### 8.2 Quality tiers

| Tier     | When                                                    | Particles | DPR cap | Bloom             | Orbs          | Confetti     | Mini hearts |
| -------- | ------------------------------------------------------- | --------- | ------- | ----------------- | ------------- | ------------ | ----------- |
| `high`   | Desktop or strong phone; sustained ≥ 55 fps             | 18,000    | 1.75    | On (mipmap blur)  | 8 glass-style | 300          | 40          |
| `mid`    | Typical modern phone; 40–55 fps                         | 8,000     | 1.5     | On, reduced       | 8 simple      | 160          | 28          |
| `low`    | < 40 fps after warm-up, ≤ 4 GB device memory, save-data | 3,000     | 1.0     | Off (glow sprite) | 6 simple      | 80           | 18          |
| `static` | No WebGL, reduced motion, or user picks calm mode       | 0         | –       | –                 | DOM cards     | CSS sparkles | –           |

- Allocate GPU buffers **once at the `high` size** and change the tier by setting `geometry.setDrawRange(0, n)`. Stepping down at runtime is then free (no rebuild).
- `PerformanceMonitor` (drei) steps the tier down when FPS drops. Allow stepping back up only after several stable seconds, to avoid flapping.
- Start with a heuristic guess (touch device, core count, memory, screen size), then correct it from measured FPS during the first seconds behind the gate.

### 8.3 Techniques (apply by default)

- Lazy-load the 3D chunk and textures **while the gate is shown**; the gate button enables when loading finishes (or after a timeout).
- Textures: 512 px orb textures, WebP source; no textures larger than needed.
- One bloom pass; no other post effects.
- Pause the canvas loop when the tab is hidden; pause audio too.
- Avoid per-frame allocations in `useFrame` (reuse vectors and colours).
- Update CSS variables for the theme from one GSAP tween, not from many.
- Parallax only on desktop, ≤ 6 % travel (brand: avoid excessive parallax).
- Keep the number of simultaneously active ScrollTriggers modest; use `ScrollTrigger.batch` for the gallery.

### 8.4 Measuring

Chrome DevTools Performance panel (4× CPU slowdown), Lighthouse, `r3f-perf`-style stats only in dev (use drei's `Stats` in the debug panel), and **at least one real mid-range Android phone and one iPhone** before sign-off.

---

## 9. Accessibility, reduced motion, privacy

### 9.1 Reduced motion matrix

| Feature                        | Reduced motion behaviour                                       |
| ------------------------------ | -------------------------------------------------------------- |
| Smooth scroll                  | Lenis not mounted; native scroll                               |
| Pinned sections                | No pinning; sections stack normally                            |
| Heart                          | Static heart; state changes by 200–300 ms opacity fades only   |
| Burst / arrow / confetti       | Replaced by a soft glow flash or a quiet fade-in of the result |
| Hero ribbons                   | Final heart shown immediately                                  |
| Letter                         | Opens instantly; text fully visible                            |
| Hold interactions (wish, seal) | A single click/Enter completes them                            |
| Parallax, camera fly-through   | Removed                                                        |

Sources: the OS setting `prefers-reduced-motion`, plus an in-page **Calm mode** toggle that anyone can switch on.

### 9.2 General accessibility rules

- Proper heading order, landmarks, and a **skip link**. All interactive elements are keyboard reachable with a visible focus ring (`--ring`).
- Contrast ≥ 4.5:1 for all text **at every resting scroll position**. The mid-tone background during the theme crossover is only ever shown in a text-free gap (companion doc §3.1).
- Text over images always has a gradient scrim.
- Touch targets ≥ 44 px. Never rely on hover; every hover effect has a tap or focus equivalent.
- Audio never plays before the gate tap; the music toggle is always visible; `aria-pressed` state is set.
- Avoid flashing: no element flashes more than three times per second; bloom spikes are gentle.
- Sinhala: if any content is in Sinhala, use the brand's Noto Serif Sinhala fallback and test line breaks.

### 9.3 Privacy

- No analytics, no third-party scripts, no data collection by default.
- The optional "type your wish" field **never leaves the device**; it is not stored.
- An optional passphrase on the letter is a **soft lock** (client-side, not security). State this honestly; do not treat it as protection.
- `noindex`, an unguessable slug, and no names in link previews.

---

## 10. Claude Code skills and how to use them

Per `Design_Skills_Setup.md` v2.0 (installed on this machine). Use them by name and in this order.

| Skill                                                                          | Use it for                                                                   | When                                                                   |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/impeccable` (design workflow)                                                | Build/shape screens, then `critique`, `polish`, `typeset`, `layout`, `audit` | Each section: build → critique → polish; full `audit` before shipping  |
| Emil `animate`                                                                 | Build motion for DOM elements                                                | After a section's layout is right                                      |
| Emil `review-animations`, `improve-animations`, `find-animation-opportunities` | Review and refine motion quality                                             | After each interactive section                                         |
| Emil `animation-performance`                                                   | Diagnose janky motion                                                        | Whenever frames drop                                                   |
| Emil `break-ui`                                                                | Stress-test edge cases (resize, fast scroll, long text, keyboard)            | End of each milestone                                                  |
| Emil `mobile-native`                                                           | Mobile web feel (touch, safe areas, address bar)                             | Mobile pass in M14                                                     |
| GSAP official skills (`greensock/gsap-skills`)                                 | Correct ScrollTrigger, React and performance usage                           | Install once, before M2 (see below)                                    |
| Taste skill (`design-taste-frontend`)                                          | Full landing-page art direction                                              | **Do not use** here: slow, costly, and it would fight the brand tokens |

**GSAP skills — installed (VERIFIED 2026-11-20).** The official GSAP skills are present at `.claude/skills/gsap-*`: `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-react`, `gsap-plugins`, `gsap-performance`, `gsap-utils`, `gsap-frameworks`. Invoke them by name for ScrollTrigger, React (`useGSAP`) and performance work; no reinstall is needed. (For history: they were added via the `skills` CLI pattern, not the VS Code `/plugin` command, which does not exist in that extension.)

**Skills that do not apply:** `animate-expo` and `write-swift` (native only).

**Rules carried over from the runbook:** run `critique` before changing an existing page; no `bolder`/`overdrive` without approval; every animation respects reduced motion; Taste images and AI placeholders must be replaced before shipping.

---

## 11. Build workflow (per milestone)

1. `/plan` the milestone from the companion doc §15 (scope, files, acceptance criteria).
2. `/blueprint`, then `/implement` in small commits.
3. Look at it in a real browser (desktop and a phone-size viewport); use the debug panel to trigger heart events.
4. Run the relevant skills (§10): `critique` → `polish` → Emil review → `break-ui`.
5. Update `progress.md`, append `AI_SESSION_LOG.md`, and when a plan milestone completes add a `PROGRESS.md` entry.
6. Commit. Never move to the next milestone with a failing build or an uncleaned heart state.

---

## 12. Governance: approvals, ADRs and doc updates

**Approvals needed before M0 completes**

- [ ] Dependency list in §4.1, with exact versions chosen via §4.2
- [ ] Route name and bare-layout exception (§2)
- [ ] 3D event duration exception to the 400 ms token (§2)
- [ ] GSAP skills installation (§10)
- [ ] The music file and its licence

**ADRs to write** (use the next free numbers in `docs/decisions/`; do not guess them):

1. Adopt Three.js via R3F, GSAP + ScrollTrigger and Lenis for the Love Site (with resolved versions)
2. Love Site route, bare layout and `noindex` policy
3. Motion exceptions for 3D events, and the quality-tier system
4. Audio policy (user-gesture start, rights-cleared music, synthetic fallback)

**Documents to update:** `Technology-Stack.md` (new packages), `Brand-Identity.md` (a short note on the two exceptions), `PLAN.md` (new milestones), `AGENTS.md` changelog (any stable rule discovered), `AI_SESSION_LOG.md` (each session).

---

## 13. Risks and mitigations

| Risk                                           | Impact                                               | Mitigation                                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| R3F / React 19.2 / Next 16 incompatibility     | Canvas fails to mount                                | Use R3F ≥ 9.5.0; smoke-test a bare Canvas in M3 before anything else; fall back to the static path if it cannot be fixed |
| Pointer events blocked by DOM layers           | Orbs/star/seal unclickable                           | Pass-through layers (§7.2); DOM twins; fallback `eventSource` approach; decide in M7                                     |
| iOS Safari: audio and viewport quirks          | No sound, jumping layout                             | Audio only after tap; `lvh` canvas; `ignoreMobileResize`; test on a real iPhone                                          |
| GPU/thermal load on phones                     | Dropped frames, hot device                           | Tiers, `drawRange` step-down, DPR cap, bloom off on low                                                                  |
| Heart unreadable over text                     | Poor legibility                                      | Heart avoids text columns on mobile (top third); scrims; contrast checks                                                 |
| Mid-tone background during the theme crossover | Low contrast                                         | Crossover only in a text-free "dawn" gap                                                                                 |
| Scroll-jacking fatigue                         | User frustration                                     | Pin only 4 sections; always allow normal scrolling; no forced auto-scroll except Replay                                  |
| Event overlap corrupts heart state             | Broken visuals                                       | `HeartDirector` with one-at-a-time and baseline invariants; stress-test fast scrolling                                   |
| Radix Dialog scroll-lock vs Lenis              | Page scrolls behind dialog or can't scroll inside it | `lenis.stop()` on open, `data-lenis-prevent` on scrollable content                                                       |
| ScrollTrigger duplicates after Fast Refresh    | Doubled animations                                   | `useGSAP` with `scope`; `matchMedia` cleanup                                                                             |
| Asset rights (music, AI images)                | Takedown or brand risk                               | Rights-cleared music with credit; prototype images replaced by real photos; no AI images in the portfolio                |
| Over-animation                                 | Feels chaotic, off-brand                             | One big event per section; brand motion rules; Emil `review-animations`                                                  |

---

## 14. Open items (UNCERTAIN until checked)

| Item                                                                          | How to resolve                        |
| ----------------------------------------------------------------------------- | ------------------------------------- |
| Exact current versions and peer ranges of three / drei / postprocessing / R3F | §4.2 `npm view` commands              |
| `lenis/react` export names and `ReactLenis` options (`autoRaf`, ref type)     | Read the installed README and `.d.ts` |
| R3F `advance()` usage with `frameloop="never"`                                | R3F docs for the installed version    |
| SplitText accessibility options                                               | GSAP docs for the installed version   |
| GSAP skills install command                                                   | `greensock/gsap-skills` README        |
| Whether `transpilePackages: ['three']` is still required                      | Try a clean build without it          |
| Final route name and slug format                                              | ADR decision                          |
| Music track and licence                                                       | Owner                                 |

---

## 15. Sources reviewed during research (2026-11-12)

- R3F installation docs (React 18 ↔ v8, React 19 ↔ v9; Next.js `transpilePackages`): `r3f.docs.pmnd.rs`
- R3F v9.5.0 release notes (React 19.2 reconciler change): `github.com/pmndrs/react-three-fiber/releases/tag/v9.5.0`
- R3F v9 migration guide: `r3f.docs.pmnd.rs/tutorials/v9-migration-guide`
- Lenis README (installation, CSS, GSAP integration, `lenis/react`, snap limitation): `github.com/darkroomengineering/lenis`
- GSAP README (free for commercial use, ScrollTrigger, `@gsap/react`): `github.com/greensock/GSAP`
- GSAP official AI skills: `github.com/greensock/gsap-skills`
