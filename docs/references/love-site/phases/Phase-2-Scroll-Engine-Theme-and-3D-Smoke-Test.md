# Phase 2 — Scroll Engine, Theme and 3D Smoke Test

| Field           | Value                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Version         | 1.0                                                                                                     |
| Status          | Proposed                                                                                                |
| Milestones      | M2 (scroll engine and theme), M3 (canvas smoke test and tiers)                                          |
| Prerequisites   | Phase 1 exit checklist complete; ADR-0027 approved (dependency list and versions)                       |
| Previous / next | [Phase 1](Phase-1-Foundations-and-Static-Skeleton.md) · [Phase 3](Phase-3-The-Heart.md)                 |
| Guidebooks      | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md) |

---

## 1. Context

The static page from Phase 1 now gets its invisible machinery: smooth scroll, the scroll-driven night → dawn colour shift, sticky "stages" for the long sections, Calm mode, and a 3D canvas proven to work in this exact repo (Next 16.2.10, React 19.2.4). No heart yet. This phase de-risks the biggest technical unknown (R3F on React 19.2) before any creative work depends on it.

---

## 2. What you will see at the end

- Wheel scrolling glides (Lenis). Touch scrolling on a phone stays native.
- Scrolling through Dawn slowly turns the whole page from Midnight Aubergine through a lavender dusk and blush into Warm Ivory; scrolling back reverses it. Memories and Timeline deepen slightly into plum.
- Hero, Memories, Timeline, Wish and Letter each hold the screen ("sticky stage") for their scroll length while a progress value moves underneath.
- A thin progress rail on the right (desktop) or a top bar (phone) fills as you scroll.
- A small "Calm mode" button bottom-left switches instantly to native scroll and the static Phase 1 design; switching back restores smooth scroll. OS "reduce motion" does the same.
- Behind the page, a fixed 3D canvas shows a simple test object (for example a slowly rotating lavender sphere) with a soft bloom glow.
- With `?debug` in dev: a panel with FPS/draw calls, a tier switcher (`high`/`mid`/`low`/`static`), a Calm toggle and section-jump buttons.

---

## 3. Read first

| What                            | Where                                                                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install policy and command      | Tech Stack §4.2                                                                                                                                    |
| Lenis rules                     | Tech Stack §5.5, §4.3 (README facts)                                                                                                               |
| GSAP rules                      | Tech Stack §5.6                                                                                                                                    |
| One clock                       | Tech Stack §7.1                                                                                                                                    |
| Layers and pointer events       | Tech Stack §7.2                                                                                                                                    |
| Tiers and performance           | Tech Stack §8.2–8.3                                                                                                                                |
| R3F usage rules                 | Tech Stack §5.2, §5.3, §5.4                                                                                                                        |
| Reduced motion matrix           | Tech Stack §9.1                                                                                                                                    |
| Theme timeline and stops        | Experience §3.1                                                                                                                                    |
| Scroll map and pinning approach | Experience §4.1                                                                                                                                    |
| Story builder pattern           | Experience §4.3                                                                                                                                    |
| Debug panel                     | Experience §18                                                                                                                                     |
| Installed package docs          | `node_modules/lenis/README.md` and `.d.ts`; `node_modules/@react-three/fiber` types (`Canvas` props, `advance`); `node_modules/@gsap/react` README |
| Next.js                         | `node_modules/next/dist/docs/` — `next/dynamic` with `ssr: false` in Client Components, `transpilePackages`                                        |
| Repo                            | `src/features/love/love-experience.tsx`, `app/globals.css` (`[data-love-root]` block), `next.config.ts`                                            |

---

## 4. Tech used in this phase

| Tool                                             | Role                                            | Rules                                                                                                   |
| ------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `lenis` + `lenis/react`                          | Smooth wheel scroll, `scrollTo`, `stop`/`start` | Its own RAF off; driven by the GSAP ticker. Not mounted when Calm/reduced motion is on. `syncTouch` off |
| `gsap` + `ScrollTrigger`                         | Scrubbed theme, stage progress                  | Register plugins once on the client. `ignoreMobileResize: true`                                         |
| `@gsap/react` `useGSAP`                          | Scoped setup and automatic cleanup              | Always pass `scope`; dependencies `[calm, tier]`                                                        |
| `gsap.matchMedia()`                              | Breakpoints and motion preference branches      | Each branch cleans up on change                                                                         |
| `three`, `@react-three/fiber` v9 (≥ 9.5.0)       | The single canvas                               | One `<Canvas>` only; per-frame work in `useFrame`; no `setState` per frame                              |
| `@react-three/drei`                              | `PerformanceMonitor`, `Stats` (debug only)      | Import only what you use                                                                                |
| `@react-three/postprocessing` + `postprocessing` | One `Bloom` pass                                | `multisampling={0}`; off on `low`                                                                       |
| `next/dynamic`                                   | Load the canvas client-only                     | `ssr: false` from a Client Component                                                                    |

---

## 5. Step-by-step build

### Step 1 — Install and record (M2)

- Run the approved command (Tech Stack §4.2) with **exact** versions (`--save-exact`), including `-D @types/three`.
- Install the GSAP skills if approved (read the repo README first; Tech Stack §10).
- Run `npm run lint`, `typecheck`, `build`. Record resolved versions in ADR-0027 and `docs/references/Technology-Stack.md`.
- **You should see:** `package.json` with pinned versions; a clean build; the shop bundle unchanged (nothing imports the new packages yet).

### Step 2 — Motion preferences (M2)

- **File:** `src/features/love/engine/motion-prefs.ts` plus a small React context/provider used by `love-experience.tsx`.
- **Inputs:** `matchMedia('(prefers-reduced-motion: reduce)')` (listen for changes), `navigator.connection?.saveData` (if present), and the manual Calm flag (kept in React state; optionally remembered in `sessionStorage` wrapped in try/catch).
- **Output:** `{ calm: boolean, reason: 'user' | 'os' | 'save-data' | null }`. `calm` = any of the three.
- **You should see:** toggling OS reduced motion (DevTools → Rendering → Emulate) flips the value live.

### Step 3 — Scroll engine: one clock (M2)

- **File:** `src/features/love/engine/scroll-engine.tsx` (`'use client'`).
- **Wiring (Tech Stack §4.3 and §7.1):**
  1. `gsap.registerPlugin(ScrollTrigger)` once.
  2. Mount `ReactLenis` at the experience root with its automatic RAF **disabled** (option name per the installed `.d.ts`; Tech Stack §14 marks it UNCERTAIN).
  3. Get the Lenis instance (ref or `useLenis`); `lenis.on('scroll', ScrollTrigger.update)`.
  4. `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`; remove the ticker callback on unmount.
  5. Import `lenis/dist/lenis.css` (check the actual path in the package).
  6. `ScrollTrigger.config({ ignoreMobileResize: true })`.
- **Calm:** when `calm` is true, do not render `ReactLenis` at all; ScrollTrigger runs on native scroll.
- **Expose:** a small `useLoveScroll()` helper returning `scrollTo(target, opts)`, `stop()`, `start()` that falls back to `window.scrollTo` / no-ops in Calm mode. Later phases use only this helper.
- **You should see:** smooth wheel scrolling; no double-speed or jitter; native scroll in Calm mode.

### Step 4 — Sticky stages and scroll lengths (M2)

- **Pattern (Experience §4.1):** a tall outer `<section>` with the scroll-map height, and an inner stage `position: sticky; top: 0; height: 100svh; overflow: hidden`.
- **Heights:** Hero 200vh, Bloom 150vh, Memories 400vh, Timeline 400vh, Dawn 100vh, Gallery natural (~300vh), Wish 200vh, Letter 200vh, Finale 100vh. Mobile ≈ 85 % via a CSS variable or media query.
- Implement as one reusable component, e.g. `src/features/love/ui/sticky-stage.tsx` (`height`, `children`, `data-stage` id).
- **Calm:** stages render at natural height without `sticky` (the Phase 1 static designs).
- Do **not** use `pin: true` unless sticky proves unsuitable (Tech Stack §5.6).
- **You should see:** each long section holds the screen while you scroll through it.

### Step 5 — Theme timeline (M2)

- **File:** `src/features/love/engine/theme-timeline.ts`, called from the story builder.
- **Do:**
  - Remove the Phase 1 per-section `--dawn` stand-in; the root owns one `--dawn` value.
  - One scrubbed tween on `[data-love-root]` for `--dawn` 0 → 1 with `trigger: '#dawn', start: 'top 80%', end: 'bottom 20%', scrub: true` (Experience §10).
  - One scrubbed tween for `--depth` 0 → 0.5 across Memories and 0.5 → 1 across Timeline (Experience §3.1 table).
  - Use `gsap.to(root, { '--dawn': 1, ease: 'none' })` (GSAP tweens CSS variables directly).
- **Calm:** `--dawn` jumps per section (set by a cheap `ScrollTrigger` `onToggle` or by static section attributes), with a short opacity cross-fade.
- **You should see:** the colour shift in Dawn, both directions; no text sitting on the mid-tone dusk (text appears only after 75 % in Dawn).

### Step 6 — Story builder skeleton (M2)

- **File:** `src/features/love/engine/story.ts`, following Experience §4.3.
- `buildStory(root, ctx)` creates `gsap.matchMedia()` with `{ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 767px)' }`. In the motion branch it calls one function per section (`buildHero`, `buildBloom`, … stubs for now) plus `buildTheme`. In Calm it calls `applyStaticStory(root)`.
- Called from `love-experience.tsx` via `useGSAP(() => buildStory(...), { scope: rootRef, dependencies: [calm, tier] })`.
- After fonts and images settle: `document.fonts.ready.then(() => ScrollTrigger.refresh())`.
- **You should see:** no duplicate triggers after Fast Refresh (check `ScrollTrigger.getAll().length` in the console stays constant).

### Step 7 — Progress heart and Calm toggle (M2)

- **Files:** `src/features/love/ui/progress-heart.tsx`, `src/features/love/ui/calm-mode-toggle.tsx`.
- Progress: desktop 2 px rail on the right with a tiny heart marker; mobile 2 px bar on top; `aria-hidden`; driven by one ScrollTrigger on the root writing a CSS variable (no React state per frame).
- Calm toggle: text button bottom-left ("Calm mode"), `aria-pressed`, ≥ 44 px target; uses framer-motion only for its press/hover.
- **You should see:** both visible above the page (z 20).

### Step 8 — Canvas smoke test (M3)

- **Files:** `src/features/love/canvas/love-canvas.tsx`; loaded in `love-experience.tsx` with `dynamic(() => import('./canvas/love-canvas'), { ssr: false })`.
- **Canvas:** fixed, full screen (`height: 100lvh`), z 0, `touch-action: pan-y`, `gl={{ antialias: false, powerPreference: 'high-performance' }}`, `dpr` from the tier, default `frameloop="always"`.
- **Content:** one test mesh (sphere, lavender from tokens) rotating in `useFrame` using a ref.
- **Token colours:** read `getComputedStyle(root)` once into `THREE.Color` (Tech Stack §5.8); helper `src/features/love/canvas/token-colors.ts`.
- If the build complains about `three`, add `transpilePackages: ['three']` in `next.config.ts` (Tech Stack §14); otherwise leave config unchanged.
- **Calm / no WebGL:** the canvas is not mounted.
- **You should see:** the sphere behind the sections, no hydration warnings, no errors in Chrome, Safari, Firefox.

### Step 9 — Tiers and bloom (M3)

- **File:** `src/features/love/engine/tiers.ts` (+ tier context).
- **Initial guess:** touch device, `navigator.hardwareConcurrency`, `navigator.deviceMemory` (≤ 4 → `low`), screen size, Save-Data. No WebGL → `static`.
- **Runtime:** drei `PerformanceMonitor` inside the canvas; `onDecline` steps down one tier; step up only after several stable seconds (Tech Stack §8.2).
- **Tier table** (Tech Stack §8.2): particles 18 000/8 000/3 000, DPR cap 1.75/1.5/1.0, bloom on/reduced/off, orbs, confetti, mini hearts. Export as a typed constant.
- **Bloom:** one `EffectComposer` (`multisampling={0}`) with `Bloom` (`mipmapBlur`, conservative `luminanceThreshold`, intensity capped). Off on `low`.
- **You should see:** switching tiers in the debug panel changes sharpness (DPR) and glow without reload.

### Step 10 — Heart state stub and layers (M3)

- **File:** `src/features/love/engine/heart-state.ts` with the `heart` object exactly as Tech Stack §7.3. Nothing writes to it yet.
- **Layers (Tech Stack §7.2):** canvas z 0 (pointer auto); `<main>` sections z 10 with `pointer-events: none` and interactive children `pointer-events: auto`; chrome z 20; dialogs z 30; gate z 40.
- **You should see:** buttons and links in sections still clickable; empty areas pass clicks to the canvas (test with an `onClick` log on the test mesh).

### Step 11 — Debug panel (M3)

- **File:** `src/features/love/dev/heart-debug-panel.tsx`, mounted only when `process.env.NODE_ENV !== 'production'` and `?debug` is in the URL (Experience §18), loaded dynamically so it never enters the production bundle.
- **Now:** tier switcher, Calm toggle, section jump (`useLoveScroll().scrollTo('#id')`, plus `?s=timeline` on load), live `heart` values (read on an interval, not per frame), drei `Stats`.
- Event buttons are added in Phase 3.

---

## 6. Contracts introduced

| Contract                                         | Location                   |
| ------------------------------------------------ | -------------------------- |
| `useMotionPrefs()` → `{ calm, reason, setCalm }` | `engine/motion-prefs.ts`   |
| `useLoveScroll()` → `scrollTo`, `stop`, `start`  | `engine/scroll-engine.tsx` |
| `buildStory(root, { calm, tier })` → cleanup     | `engine/story.ts`          |
| `Tier`, `TIERS` table, `useTier()`               | `engine/tiers.ts`          |
| `heart` mutable state                            | `engine/heart-state.ts`    |
| `readTokenColors(root)`                          | `canvas/token-colors.ts`   |
| `<StickyStage>`                                  | `ui/sticky-stage.tsx`      |

---

## 7. Testing and verification

| Check               | How                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Build health        | `npm run lint`, `typecheck`, `build`; inspect build output: three/R3F only in the `/love` route chunks |
| Smooth scroll       | Desktop wheel and trackpad (incl. iPad trackpad if available)                                          |
| Theme               | Scroll Dawn both ways; check contrast at rest in each section                                          |
| Calm/reduced motion | OS emulation and the toggle; both directions, no reload                                                |
| Resize/rotate       | DevTools device toolbar; no stage jumps                                                                |
| Fast Refresh        | Edit a file; `ScrollTrigger.getAll().length` unchanged                                                 |
| Canvas              | No hydration warnings; works in Chrome, Safari, Firefox                                                |
| Tiers               | Debug panel switches; DevTools 4× CPU slowdown triggers a step-down                                    |
| Unit tests          | Vitest for tier heuristic (pure function) and token colour parsing                                     |

---

## 8. Skills to run

GSAP skills (ScrollTrigger + React), Emil `animation-performance` if anything stutters, `mobile-native` for `svh`/`lvh` and address-bar behaviour.

---

## 9. Exit checklist

- [ ] Packages pinned and recorded; build green.
- [ ] One clock: Lenis driven by the GSAP ticker; lag smoothing off.
- [ ] Sticky stages at the scroll-map lengths; Calm falls back to natural height.
- [ ] `--dawn` and `--depth` scrub correctly both ways.
- [ ] Calm mode and OS reduced motion switch live to native scroll.
- [ ] Canvas mounts with R3F ≥ 9.5.0, no hydration warnings, three browsers.
- [ ] Tiers switch at runtime; bloom off on `low`.
- [ ] Debug panel works in dev and is absent from production.
- [ ] 3D chunk loads only on `/love`.

---

## 10. Risks and fallbacks

| Risk                                                   | Response                                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| R3F fails on React 19.2.4 / Next 16                    | Try the newest ≥ 14-day-old R3F 9.x; check its issues; if unresolved, ship the static path and pause 3D (Tech Stack §13) |
| Lenis option names differ from the docs                | Use the installed `.d.ts` as truth; record in the session log                                                            |
| Jitter between scroll and canvas                       | Confirm one clock; later consider `frameloop="never"` + `advance()` (Tech Stack §7.1)                                    |
| `SpotlightProvider` interferes with the canvas pointer | Exclude `/love` (R8)                                                                                                     |
| Mobile address bar jumps                               | `ignoreMobileResize`, `svh` for stages, `lvh` for the canvas                                                             |

---

## 11. Docs and governance updates

ADR-0027 (versions, Accepted), `Technology-Stack.md` (new packages), `progress.md`, `AI_SESSION_LOG.md`, `PROGRESS.md` entry when done.

---

## 12. Commit plan

1. `chore(love): install pinned three, r3f, drei, postprocessing, gsap, lenis`
2. `feat(love): add motion preferences and calm mode`
3. `feat(love): add lenis + gsap scroll engine on one clock`
4. `feat(love): add sticky stages and night-to-dawn theme timeline`
5. `feat(love): add progress heart`
6. `feat(love): add canvas smoke test, quality tiers and bloom`
7. `feat(love): add dev-only heart debug panel`

---

## 13. Handoff to Phase 3

Phase 3 needs: `useLoveScroll`, `useMotionPrefs`, `useTier`, `buildStory` with per-section stubs, the canvas with bloom and tiers, the `heart` object, token colours, layers, and the debug panel.
