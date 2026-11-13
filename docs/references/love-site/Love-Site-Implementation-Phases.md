# B&V Birthday Love Site — Implementation Phases

| Field              | Value                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version            | 1.1                                                                                                                                                                                                                       |
| Status             | **Proposed.** Phase 1 starts once the owner approves this plan and the Phase 1 approvals below                                                                                                                            |
| Created            | 2026-11-12                                                                                                                                                                                                                |
| Audience           | Claude Code (builder) and the developer (reviewer)                                                                                                                                                                        |
| Location           | `docs/references/love-site/Love-Site-Implementation-Phases.md`                                                                                                                                                            |
| Builds on          | [Love-Site-Experience-Guidebook.md](Love-Site-Experience-Guidebook.md) (what each section does), [Love-Site-Tech-Stack-and-Tools.md](Love-Site-Tech-Stack-and-Tools.md) (packages, architecture, performance, governance) |
| Background reading | [Scroll-3D-Guide-Overview.md](Scroll-3D-Guide-Overview.md), [Scroll-3D-Guide-Complete.md](Scroll-3D-Guide-Complete.md) (general scroll-3D research; the two Love Site docs supersede them where they differ)              |

This plan groups the guidebooks' 17 milestones (M0–M16) into **six phases**. Each phase ends with a working, committed build that can be shown in a browser. The guidebooks stay the source of truth for _what_ to build; this file says _in what order_, _what "done" means_, and _what the real repository changes about the guidebooks_.

Confidence labels follow the repo convention: `VERIFIED` (checked in the repo or a named doc), `INFERRED`, `UNCERTAIN` (check before relying on it).

---

## 1. Decisions already made

| Decision       | Value                                                                               | Source            |
| -------------- | ----------------------------------------------------------------------------------- | ----------------- |
| Where it lives | A separate private page inside **BnV-Web** (`/love/[slug]`), not a separate app     | Owner, 2026-11-12 |
| Phases         | At most six; this document                                                          | Owner, 2026-11-12 |
| Docs location  | `docs/references/love-site/`                                                        | Owner, 2026-11-12 |
| 3D approach    | Three.js through React Three Fiber; no Spline, Blender or GLB models                | Tech Stack §1     |
| Sections       | Gate → Hero → Bloom → Memories → Timeline → Dawn → Gallery → Wish → Letter → Finale | Experience §4.1   |
| Core rule      | "The path is scrubbed, the moments are triggered"                                   | Experience §1     |

---

## 2. Repository facts that correct the guidebooks (read before Phase 1)

These were checked in the code on 2026-11-12. Where a guidebook disagrees, **this section wins**.

| #   | Guidebook assumption                                                               | What the repo actually does                                                                                                                                                                                                                                                                                        | What to do instead                                                                                                                                                                                                                                                                                                                                                       | Confidence                                        |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| R1  | `app/love/layout.tsx` can be a "bare layout without shop chrome" (Tech Stack §5.1) | `app/layout.tsx` always renders the announcement bar, header, footer, cart drawer, `CookieConsent` and `Analytics`, wrapped in `StorefrontChrome`. That component hides them **only for `/admin`** (`src/components/layout/storefront-chrome.tsx`). A nested layout cannot remove what the root layout renders     | Extend `StorefrontChrome` to return `null` for `/love` as well. This also removes analytics and the cookie banner from the page, which the privacy rule requires (Tech Stack §9.3). `app/love/layout.tsx` is then optional (route metadata only)                                                                                                                         | VERIFIED                                          |
| R2  | Component files are PascalCase (`LoveExperience.tsx`, Tech Stack §6)               | The repo uses **kebab-case file names exporting PascalCase components** (`storefront-chrome.tsx` → `StorefrontChrome`, `clip-reveal.tsx`). Handbook: "Components: PascalCase. Route folders and non-component files: kebab-case"                                                                                   | Use kebab-case file names everywhere; keep PascalCase component names. Mapping in §9                                                                                                                                                                                                                                                                                     | VERIFIED                                          |
| R3  | The `[data-love-root]` alias block needs only bg, surface and fg (Experience §3.1) | `app/globals.css` defines light values in `:root` and dark values in a second block toggled by `next-themes`. `--gold-text` differs between them (light `#7a5c22`, dark `#d2b16f`) and is missing from the guidebook table; so are `--ring`, `--border`, `--muted-foreground`, `--secondary`, `--surface-elevated` | The alias block must define **night and day pairs for every token the page uses**, including `gold-text`, `ring`, `border`, `muted-foreground`, `secondary`, `surface-elevated`. Copy values from `globals.css` (not from the guidebook table). The love root must also paint its own full-viewport background so the global theme's `<body>` colour never shows through | VERIFIED                                          |
| R4  | The page follows the global theme toggle unless told otherwise                     | `ThemeProvider` (next-themes) still wraps the page and sets a class on `<html>`                                                                                                                                                                                                                                    | Variables set on `[data-love-root]` override inherited ones for everything inside it, so the page is unaffected. Do **not** call `setTheme` from the love page                                                                                                                                                                                                           | VERIFIED (mechanism) / INFERRED (no side effects) |
| R5  | Hide the page from search                                                          | `app/robots.ts` lists disallowed paths publicly                                                                                                                                                                                                                                                                    | Do **not** add `/love` to `robots.ts` (that would advertise it). Use `robots: { index: false, follow: false }` in page metadata. Check `app/sitemap.ts` never lists love slugs                                                                                                                                                                                           | VERIFIED                                          |
| R6  | "Use the next free ADR number"                                                     | `docs/decisions/DECISIONS.md` ends at **ADR-0026**                                                                                                                                                                                                                                                                 | Next free numbers at the time of writing: **ADR-0027 to ADR-0030**. Re-check before writing                                                                                                                                                                                                                                                                              | VERIFIED 2026-11-12                               |
| R7  | Deploy to Vercel                                                                   | The main shop deploy is still pending (PLAN.md 1I, domain TBD). `next.config.ts` sends `X-Frame-Options: DENY` and a `Permissions-Policy` that blocks camera, microphone and geolocation                                                                                                                           | Launch via this repo's Vercel deployment URL (preview or production) even if the shop isn't public yet. Audio uses an `<audio>` element, not the microphone, so the Permissions-Policy is fine                                                                                                                                                                           | VERIFIED (config) / UNCERTAIN (deploy timing)     |
| R8  | A global `SpotlightProvider` exists                                                | `SpotlightProvider` is rendered outside `StorefrontChrome`, so it stays mounted on `/love`                                                                                                                                                                                                                         | In Phase 1, check what it does on this page; if it adds pointer effects or listeners that conflict, exclude `/love` the same way as R1                                                                                                                                                                                                                                   | UNCERTAIN                                         |

### What we reuse (don't re-create)

| Need                                                          | Existing piece                                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Fonts (Cinzel, Cormorant Garamond, Inter, Noto Serif Sinhala) | Already loaded in `app/layout.tsx` as CSS variables                                                |
| Motion tokens for Motion/framer-motion UI bits                | `src/config/motion.ts` (`duration`, `ease`, `revealOffset`, `hoverScale`)                          |
| Simple DOM reveals for the static/Calm path                   | `src/components/motion/` (`reveal`, `stagger`, `clip-reveal`)                                      |
| Dialog, Button and other primitives                           | `src/components/ui/`                                                                               |
| Image optimisation                                            | `next/image`; `next.config.ts` already serves AVIF/WebP                                            |
| Prototype image folder and naming                             | `public/images/prototype/` (rules in [../Visual-Asset-Inventory.md](../Visual-Asset-Inventory.md)) |
| Feature folder pattern                                        | `src/features/<feature>/`                                                                          |
| Scripts                                                       | `npm run dev` (port 3002), `lint`, `typecheck`, `build`, `test` (Vitest)                           |

---

## 3. Phase overview

**Detailed, step-by-step guide per phase:** [phases/README.md](phases/README.md) — [Phase 1](phases/Phase-1-Foundations-and-Static-Skeleton.md) · [Phase 2](phases/Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md) · [Phase 3](phases/Phase-3-The-Heart.md) · [Phase 4](phases/Phase-4-Night-Story-Memories-and-Timeline.md) · [Phase 5](phases/Phase-5-Day-Story-Dawn-to-Finale.md) · [Phase 6](phases/Phase-6-Fallbacks-QA-Content-and-Launch.md). This file stays the summary; the phase guides hold the build steps.

| Phase | Name                                               | Milestones        | Main result                                                                                                                         |
| ----- | -------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **1** | Foundations, approvals and static skeleton         | M0, M1            | A private, bare, noindex page with all ten sections as static content and the night/day token system                                |
| **2** | Scroll engine, theme and 3D smoke test             | M2, M3            | Smooth scroll, sticky stages, the night → dawn colour shift, Calm mode, a working 3D canvas with quality tiers and a debug panel    |
| **3** | The Heart: gate, hero, director, audio, bloom      | M4, M5, M6, M10   | The signature moment: ribbons weave into a heart, every heart event works, the heart travels the page, music starts on the gate tap |
| **4** | The night story: Memories and Timeline             | M7, M8            | Photo orbs with dialogs; the golden thread timeline with the arrow strike                                                           |
| **5** | The day story: Dawn, Gallery, Wish, Letter, Finale | M9, M11, M12, M13 | Night turns to day, the gallery and lightbox, the wish, the letter and seal, the finale and Replay                                  |
| **6** | Fallbacks, QA, real content and launch             | M14, M15, M16     | Fully usable without WebGL or motion, performance budgets met on real phones, real photos/letter/music, deployed                    |

**Dependency chain:** 1 → 2 → 3 → (4 and 5 in order) → 6. Phase 3 must finish before 4 or 5 because every later section drives the heart through the director. Audio (M10) moves into Phase 3 because the gate tap unlocks it and the beat feeds the heart.

**Cross-cutting rules for every phase**

1. Every phase delivers the **reduced-motion / Calm / static variant** of what it builds (Tech Stack §9.1). Phase 6 audits and completes that work; it does not start it.
2. Per-frame values live in the mutable `heart` object and refs; **no `setState` per frame**.
3. GSAP owns scroll-linked and 3D-state motion; framer-motion owns small component transitions; **never both on one element**.
4. Colours come from tokens only; no hex values in components.
5. No new dependency beyond the approved list (Tech Stack §4.1). If one seems needed, stop and ask.
6. Read `node_modules/next/dist/docs/` before Next-specific code (root `AGENTS.md`).
7. Work in the repo's flow: `/plan` → `/blueprint` → `/implement` per milestone, small commits.
8. **Phase exit gate (all phases):** `npm run lint`, `npm run typecheck` and `npm run build` pass; the page is checked in a browser at desktop and phone width; `progress.md` and `docs/AI_SESSION_LOG.md` are updated; the work is committed. Never start the next phase on a failing build.

---

## 4. Phase 1 — Foundations, approvals and static skeleton (M0 + M1)

**Goal:** everything needed to start safely, and a page that already reads well with no motion at all.

### 4.1 Prerequisites

- This plan approved by the owner.
- Owner provides (or confirms placeholders for): her name, your name, the birthday date.

### 4.2 Approvals to obtain (Tech Stack §12)

- [ ] Dependency list (Tech Stack §4.1) with exact versions chosen in this phase.
- [ ] Route `/love/[slug]` and the "no shop chrome on `/love`" exception (R1).
- [ ] The motion exception: 3D events run 1–2 s, beyond the 400 ms UI token.
- [ ] GSAP official skills installation (`greensock/gsap-skills`), after reading its README.
- [ ] Music track and its licence (may stay open until Phase 6; the synthetic beat covers it).

### 4.3 Tasks

**M0 — Prep (no installs)**

1. Run the read-only `npm view` checks in Tech Stack §4.2. Choose versions at least 14 days old. Confirm R3F ≥ 9.5.0 and the drei/postprocessing majors that pair with R3F v9.
2. Draft ADRs in `docs/decisions/DECISIONS.md` (re-check numbering first, R6):
   - ADR-0027: Adopt Three.js via R3F, GSAP + ScrollTrigger and Lenis for the Love Site (with versions).
   - ADR-0028: Love Site route, chrome exception (R1) and `noindex` policy.
   - ADR-0029: Motion exceptions for 3D events, and the quality-tier system.
   - ADR-0030: Audio policy (gesture start, rights-cleared music, synthetic fallback).
3. Pick prototype images from the existing assets, copy them to `public/images/prototype/` as `love-memory-01.webp`, `love-gallery-01.webp` and so on (naming per Visual-Asset-Inventory).
4. Write `scripts/prepare-love-images.mjs` (uses `sharp`, which Next already depends on; confirm it resolves without a new install, otherwise ask). Outputs: 512×512 orb squares, 1600 px card images, 1200 px gallery images, blur placeholders.

**M1 — Static route scaffold**

5. Extend `StorefrontChrome` to hide on `/love` (R1). Check `SpotlightProvider` behaviour (R8).
6. Create `app/love/[slug]/page.tsx` as a **Server Component**: look up the config by slug, call `notFound()` for unknown slugs, set `robots: noindex, nofollow`, and a neutral title with no names in Open Graph tags.
7. Create the typed config: `src/features/love/config/types.ts` (`LoveSiteConfig`, Experience §3.9) and one site file under `src/features/love/config/sites/`. Use a long, unguessable slug.
8. Add the `[data-love-root]` alias token block to `app/globals.css` in a clearly marked section ("mirrors Brand §32.1 and §41.6 and the token blocks above; update together"), covering every token in R3, plus `--dawn: 0` and `--depth: 0`.
9. Create `love-experience.tsx` (client root, still static) and one stub component per section in `src/features/love/sections/` with correct `id`s (Experience §4.1), heading order, landmarks, a skip link ("Skip to the letter") and placeholder copy from the config.
10. Static layout of each section follows Experience §3.2 (Cinzel titles, Cormorant body at 20 px, Inter UI, text columns ≤ 60 characters, existing Button with medium radius).

### 4.4 Deliverables

Approved ADR drafts; chosen versions; prototype images and the image script; `/love/<slug>` renders all ten sections stacked, readable in both night and day token sets, with no shop chrome, no analytics and `noindex`.

### 4.5 Exit criteria

- [ ] Unknown slug → 404. Known slug → page renders with no console errors and no hydration warnings.
- [ ] No header, footer, announcement bar, cookie banner or analytics request on `/love` (check DevTools Network).
- [ ] Page source has `noindex`; `robots.ts` and the sitemap do not mention `/love`.
- [ ] Headings are in order; the skip link works; contrast passes in the night and day sections.
- [ ] Shop pages are unchanged (spot-check home and `/admin`).
- [ ] All approvals in §4.2 except the music are ticked.

### 4.6 Skills

`/impeccable` (shape and critique the static sections against the brand); `break-ui` on the config-driven text (long names, Sinhala).

---

## 5. Phase 2 — Scroll engine, theme and 3D smoke test (M2 + M3)

**Goal:** the invisible machinery that everything else rides on, proven in this repo before any heart work.

### 5.1 Prerequisites

Phase 1 exit criteria met; dependency approval given.

### 5.2 Tasks

**M2 — Scroll engine and theme**

1. Install the approved packages with `npm install --save-exact ...` (Tech Stack §4.2). Install the GSAP skills if approved. Record the resolved versions in ADR-0027 and `docs/references/Technology-Stack.md`.
2. `engine/scroll-engine.tsx`: Lenis via `lenis/react` with its own RAF **off**; `gsap.ticker` drives `lenis.raf(time * 1000)`; `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.lagSmoothing(0)`; import `lenis/dist/lenis.css` (verify export names against the installed `.d.ts`; Tech Stack §14).
3. `ScrollTrigger.config({ ignoreMobileResize: true })`; full-height stages use `svh`/`lvh`.
4. `engine/motion-prefs.ts`: `prefers-reduced-motion`, Save-Data and the manual **Calm mode** flag. When any is on, **Lenis is not mounted** and native scroll is used.
5. Sticky stage pattern for Hero, Memories, Timeline, Wish and Letter: a tall container plus an inner `position: sticky; top: 0; height: 100svh` stage (Experience §4.1). Section heights from the scroll map (mobile ≈ 85 %).
6. `engine/theme-timeline.ts`: one scrubbed tween of `--dawn` across the Dawn section and `--depth` across Memories/Timeline. The page now visibly goes from night to day.
7. `engine/story.ts` skeleton with the `buildStory()` pattern (Experience §4.3): `useGSAP` with `scope`, `gsap.matchMedia()` for motion and mobile, `applyStaticStory()` for Calm mode.
8. Chrome: `ui/progress-heart.tsx` (right rail on desktop, top bar on mobile) and `ui/calm-mode-toggle.tsx`.

**M3 — Canvas smoke test and tiers**

9. `canvas/love-canvas.tsx` loaded through `next/dynamic(..., { ssr: false })` from the client root; one fixed `<Canvas>` behind the page (`height: 100lvh`, `touch-action: pan-y`), `antialias: false`. Start with a bare canvas and a single test mesh.
10. Add `transpilePackages: ['three']` to `next.config.ts` **only if** the build needs it (Tech Stack §14).
11. `engine/tiers.ts`: heuristic first guess, then drei `PerformanceMonitor` step-down; `high`/`mid`/`low`/`static` (Tech Stack §8.2). One `EffectComposer` with a single `Bloom` pass (off on `low`).
12. `engine/heart-state.ts`: the mutable `heart` object (Tech Stack §7.3), even though nothing animates it yet.
13. `dev/heart-debug-panel.tsx`: dev-only (`NODE_ENV !== 'production'` and `?debug`), with tier switcher, Calm toggle, section jump, live `heart` read-out and drei `Stats`.
14. Layer stack and pointer events per Tech Stack §7.2 (canvas z 0, sections z 10 with `pointer-events: none` by default, chrome z 20, dialogs z 30, gate z 40).

### 5.3 Exit criteria

- [ ] Smooth wheel scroll on desktop; native touch scroll on phones; no double-scroll or jitter.
- [ ] The theme moves night → dawn → day and back when scrolling in reverse.
- [ ] Calm mode and OS reduced motion switch to native scroll with no pinning, instantly and reversibly.
- [ ] The canvas mounts with the installed R3F on React 19.2.4 / Next 16.2.10 with **no hydration warnings and no runtime errors** in Chrome, Safari and Firefox. If it fails, stop and record the issue; do not build on it (Tech Stack §13).
- [ ] Tier switching from the debug panel changes DPR and bloom without a reload.
- [ ] Resizing and rotating cause no jumps in the sticky stages.
- [ ] Shop build size unaffected: the 3D chunk only loads on `/love` (check the build output).

### 5.4 Skills

GSAP skills (ScrollTrigger and React patterns); Emil `animation-performance` if anything stutters; `mobile-native` for `svh`/address-bar checks.

---

## 6. Phase 3 — The Heart: gate, hero, director, audio, bloom (M4 + M5 + M6 + M10)

**Goal:** the signature experience. If time runs out after this phase, the site already has its emotional core.

### 6.1 Prerequisites

Phase 2 exit criteria met, especially the canvas smoke test.

### 6.2 Tasks

**Gate (Experience §5)**

1. `sections/gate.tsx`: Midnight Aubergine overlay, CSS-pulsing seed (~72 bpm), the "A little something for you, {name}." line, a "Tap to begin" button, and a loading ring from drei `useProgress`. States `loading → ready → entering`; 6 s timeout falls back to the lowest tier. Lenis is stopped until the tap.

Current gate presentation uses a romantic editorial welcome addressed to the configured recipient, layered night colours, a decorative frame, and a larger seed. The loading timeout and tap handoff remain the same. The development ngrok hostname is listed in `next.config.ts` under `allowedDevOrigins`; update it when the tunnel hostname changes and restart `next dev`.

**Audio (M10, Experience §3.7)**

2. `engine/audio-engine.ts`: created **on the gate tap**: `<audio>` → source → gain → analyser (`fftSize` 512) → destination; 2 s fade-in to 0.6; loop; pause on `visibilitychange`. Bass/mid/treble bands smoothed into `heart.beat` (≤ 6 % scale). **Synthetic 72 bpm lub-dub** if the file is missing or fails.
3. `ui/music-toggle.tsx`: top-right, 44 × 44 px, `aria-pressed`, framer-motion for hover/press only. Until the licensed track exists, use the synthetic beat.

**Heart and Hero (M4, Experience §3.3–3.4, §6)**

4. `canvas/heart.tsx` + `canvas/heart-shaders.ts`: one `THREE.Points`, 18 000 points allocated once with `setDrawRange` per tier; attributes `aRibbon`, `aHeart`, `aScatter`, `aRand`; uniforms per Experience §3.4. Heart generator (parametric heart, 70 % outline band, 30 % fill, rounded z). Ribbon generator (left lavender, right gold, each tracing its half of the outline). Aura skin (additive) only in this phase.
5. `sections/hero.tsx` + hero timeline in `story.ts`: the time-based intro (weave 0–3.2 s, pulse, SplitText headline at 3.4 s, subhead, scroll cue, first shine at 6 s), idle breathing, then the 200 vh sticky scroll (rotate ≤ 8°, headline lifts and fades). Verify SplitText's accessibility options so screen readers hear one sentence.
6. Pointer parallax (desktop, ≤ 6° yaw) and tap-to-pulse with 6 small hearts and a 1.2 s cooldown; DOM twin button "Make the heart beat".
7. Gate → hero hand-off: the seed's screen position becomes the ribbons' meeting point.

**Heart Director and events (M5, Experience §3.5)**

8. `engine/heart-director.ts`: event catalogue (`pulse`, `glowUp`, `shine`, `burst`, `reform`, `burstReform` now; the rest stubbed), **one event at a time** (queue or drop), and the **baseline invariant** (`settle()` forces the current section's baseline on finish, interrupt or scroll-away). Each event has a reduced-motion variant.
9. `canvas/mini-hearts.tsx`: `InstancedMesh` small hearts tied to `burst`, plus a tap pool of 8.
10. Debug panel buttons for every event and a live baseline read-out.

**Heart path and Bloom (M6, Experience §4.2, §7)**

11. NDC path system: the heart stores a screen position and converts with the live viewport; desktop and mobile positions per Experience §4.2; mobile rule "never behind body text".
12. `sections/bloom.tsx` + `canvas/petals.tsx`: scrubbed move to the right and camera dolly; `burstReform` at `top 60%` that releases petals (shader-driven fall and sway); `onEnterBack` → `settle()`.

### 6.3 Reduced-motion deliverables

Gate: static seed, fade only. Hero: fully formed heart with a 300 ms fade, no parallax. Events: glow flashes instead of movement. Bloom: heart stays formed, a still sparse petal layer. Audio: glow-only reaction (± 0.05).

### 6.4 Exit criteria

- [ ] No scroll and no audio before the gate tap; the button enables when assets load or after 6 s.
- [ ] The weave completes in about 3.2 s on a mid-range phone without visible dropped frames.
- [ ] Every event can be fired repeatedly from the debug panel and **never leaves the heart half-burst**.
- [ ] Fast-scroll stress (Experience §16.1) through Hero and Bloom: heart always ends with `burst = 0`.
- [ ] The heart sits where §4.2 says on desktop and phone, and never behind body text on mobile.
- [ ] Music mute works; removing the audio file still gives a beating heart.
- [ ] Tab hidden → audio and canvas pause; returning does not "catch up" with a burst.

### 6.5 Skills

GSAP skills; Emil `animate` and `review-animations` on the hero; `animation-performance` for the weave; `/impeccable critique` on the hero composition.

---

## 7. Phase 4 — The night story: Memories and Timeline (M7 + M8)

**Goal:** the two longest, most interactive night sections.

### 7.1 Prerequisites

Phase 3 complete (director, NDC path, tiers). Prototype images processed by the image script.

### 7.2 Tasks

**Memories (M7, Experience §8)**

1. `canvas/memory-orbs.tsx`: 8 orbs (6 on `low`) with a cheap fresnel glass shader (no transmission) and a photo disc inside (`Billboard` + `useTexture`, 512 px WebP). Positions from the Experience §8 formula; camera rail scrubbed across the 400 vh sticky stage; heart fixed at (0, −0.55).
2. Hover (desktop): lift, shell glow, photo desaturated → colour, heart leans toward the orb. Click/tap: `pulse` + 4 small hearts, then the dialog.
3. `ui/memory-dialog.tsx`: Radix Dialog from `src/components/ui`, framer-motion scale 0.92 → 1 from the orb's screen position (250 ms, `ease-standard`); `next/image` 1600 w; `lenis.stop()` while open, `lenis.start()` on close; focus returns to the orb's twin.
4. Keyboard twins: a visually hidden list of buttons, one per memory; focusing one draws a ring around the orb's projected screen rectangle and leans the heart.
5. Counter ("2 of 8 opened") and the optional completion `glowUp`.
6. **Decide pointer routing** (Tech Stack §7.2): pass-through layers by default; switch to the `eventSource` + `eventPrefix="client"` fallback if clicks are lost. Record the decision in ADR-0029 or the session log.

**Timeline and arrow (M8, Experience §9)**

7. `sections/timeline.tsx`: sticky stage, gold SVG thread (S-curve on desktop, vertical near the left edge on mobile), five nodes at 10/30/50/70/90 %, the active card beside its node, earlier cards dimmed to 40 %.
8. Thread drawing with `stroke-dashoffset`; heart rides the thread tip (`getPointAtLength` → `getScreenCTM` → NDC).
9. Node activation: dot ignites, card slides in, `glowUp` + small `pulse`. Nodes are real buttons with `aria-current`; click → `lenis.scrollTo` that node (1.2 s).
10. `canvas/arrow.tsx` + shockwave ring + shared 60-point spark pool; director event `arrowStrike` (timeline in Experience §3.5) on the featured node; re-arm only after scrolling back above 45 %; baseline glow +0.15 afterwards.

### 7.3 Reduced-motion deliverables

Memories: a two-column grid of memory cards opening the same dialog; heart as a static icon. Timeline: no pinning, a vertical list of five cards with a static thread, a soft glow on the featured card instead of the arrow.

### 7.4 Exit criteria

- [ ] Every orb opens with mouse, touch and keyboard; hover and focus feel equivalent; hit areas ≥ 44 px on mobile.
- [ ] The dialog traps and restores focus; the page never scrolls behind it.
- [ ] Eight orb textures stay inside the texture budget (< 64 MB total).
- [ ] Nodes activate in order and reverse cleanly; node click lands precisely.
- [ ] The arrow strike plays once per pass, completes even if she keeps scrolling, and leaves the heart formed and slightly brighter.
- [ ] The heart never overlaps card text.
- [ ] Fast-scroll stress through Memories and Timeline passes.

### 7.5 Skills

Emil `review-animations` and `improve-animations`; `break-ui` (long captions, missing photo, 6 vs 8 orbs); `animation-performance` with DevTools 4× CPU slowdown during the arrow strike.

---

## 8. Phase 5 — The day story: Dawn, Gallery, Wish, Letter, Finale (M9 + M11 + M12 + M13)

**Goal:** turn night into day and land the emotional ending.

### 8.1 Prerequisites

Phase 4 complete. Letter text and wish/finale lines can still be placeholders.

### 8.2 Tasks

**Dawn (M9, Experience §10)**

1. `sections/dawn.tsx`: 100 vh, **no text between 20 % and 75 %**, token-based sunrise gradient, one line at 75 %. `--dawn` 0 → 1 scrubbed; heart rises and grows; petals fade out.
2. Pearl skin: an extruded heart mesh (`ExtrudeGeometry` from a heart `Shape`, small bevel) with a soft clearcoat/sheen material and gold rim, plus normal-blended particles; `skinSwap` (1.2 s) at about 35 %, one `shine` at about 50 %. Canvas colour uniforms read from tokens and follow `--dawn`.

**Gallery (M9, Experience §11)**

3. `sections/gallery.tsx`: 9–12 photos, masonry-style (2 columns mobile, 3 desktop), bordered frames on Blush surfaces, `next/image` with `sizes` and blur placeholders, `priority` on the first row only.
4. `ScrollTrigger.batch` reveal (fade up 24 px + clip-path inset → 0, 0.8 s, 80 ms stagger, `once: true`); desktop parallax ±6 % on at most six tiles; heart as a corner companion with a throttled `shine` (≥ 4 s).
5. `ui/lightbox.tsx`: Radix Dialog; arrow keys and swipe (framer-motion drag); Esc; `lenis.stop()`; focus restored.

**Wish (M11, Experience §12)**

6. `hooks/use-hold.ts` (hardened: pointer capture, cleanup, no key repeat, eases back on early release).
7. `canvas/wish-star.tsx` + SVG progress ring; hold 2.4 s raises the heart to the star.
8. `canvas/confetti.tsx`: instanced, shader physics, tier counts.
9. Director event `wishMerge` (flash → burst + confetti → reform → message with `aria-live="polite"` → "Make another wish"). Optional local-only wish textarea (never stored or sent). Single-click alternative ("Or tap once"), automatic in Calm mode.

**Letter (M12, Experience §13)**

10. `sections/letter.tsx`: SVG/CSS envelope with a 72–96 px seal; **GSAP only** for the sequence.
11. `dockToSeal`: the heart moves to the seal's measured position (`getBoundingClientRect` → NDC), recomputed on resize.
12. Hold 1.2 s (same `useHold`) or the optional passphrase (soft lock, kind error message, no lockout) → `sealBreak` (≈ 12 small hearts) → flap opens → letter rises → paragraphs reveal. Long letters scroll inside the card with `data-lenis-prevent`.

**Finale and Replay (M13, Experience §14)**

13. `sections/finale.tsx`: heart large and centred (Pearl, gold halo, beating with the music); `finaleBurst` once per pass.
14. Replay: `lenis.scrollTo(0, { duration: 2.6 })`, reset session flags (wish, memories counter; the letter stays unlocked), re-arm the hero weave. Music continues.

### 8.3 Reduced-motion deliverables

Dawn: straight cross-fade, 300 ms skin swap. Gallery: simple fades, no clip-path or parallax. Wish: one click completes, soft glow and message, no confetti. Letter: already open, text visible. Finale: static heart, Replay jumps to the top.

### 8.4 Exit criteria

- [ ] At no resting scroll position is text on a mid-tone background; contrast ≥ 4.5:1 on Ivory, Blush and letter paper.
- [ ] The Pearl heart is clearly visible on Ivory; the skin swap has no flash or pop.
- [ ] No layout shift while gallery images load; the lightbox is fully keyboard-operable.
- [ ] An early wish release leaves no residue; completing twice does not stack animations; completion is announced.
- [ ] The heart docks exactly on the seal at every screen size and after resize.
- [ ] Replay returns to a clean, working Hero with nothing left half-finished.

### 8.5 Skills

`/impeccable` (`critique` → `polish`, `typeset` for the letter); Emil `review-animations`; `break-ui` (very long letter, no passphrase vs passphrase, 9 vs 12 gallery photos).

---

## 9. Phase 6 — Fallbacks, QA, real content and launch (M14 + M15 + M16)

**Goal:** make it robust for every device and person, fill it with the real story, and ship the private link.

### 9.1 Tasks

**M14 — Fallbacks and accessibility**

1. Complete the **static path** (Tech Stack §7.5) for the `static` tier, no WebGL and Calm mode: CSS/SVG heart with opacity state changes, DOM card grids, no pinning, native scroll. Every section usable and readable.
2. Full keyboard pass (orbs, nodes, lightbox, wish, seal, Replay, music, Calm toggle) with a visible `--ring` focus ring.
3. Screen-reader quick pass: one clean hero sentence, logical headings, dialogs announced, wish completion announced.
4. Contrast check at every resting stop (Experience §3.1 table); flashing ≤ 3 per second; touch targets ≥ 44 px (≥ 88 px for hold targets).

**M15 — Performance and QA**

5. Tune the tiers; check budgets (Tech Stack §8.1): route JS before the gate ≤ 120 KB gzip, 3D chunk ≤ 450 KB gzip, < 60 draw calls, < 64 MB textures, gate LCP < 2.5 s on 4G, CLS ≈ 0, INP < 200 ms.
6. Lighthouse (mobile) on the gate and after the gate; DevTools Performance recording across Memories and the arrow strike at 4× CPU slowdown.
7. Device matrix (Experience §16.2): desktop Chrome/Safari/Firefox, a real iPhone (Safari), a real mid-range Android (Chrome).
8. Run all cross-cutting tests in Experience §16.1 (fast scroll ×10, resize/rotate, tab hidden, dialog + scroll, no audio file, no WebGL, keyboard only).
9. `/impeccable audit`; Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native`.

**M16 — Content and launch**

10. Replace every prototype image with real photos (processed by the image script) and write alt text. Prototype AI images must not ship.
11. Final copy, the letter, timeline milestones (pick the featured "day you knew"), wish and finale lines; Sinhala checked if used.
12. Licensed music file with credit text; confirm ADR-0030.
13. Remove debug markers; confirm the debug panel cannot load in production.
14. Confirm `noindex`, the unguessable slug, no names in link previews, no analytics or third-party scripts.
15. Deploy a Vercel preview, run final QA on the live link (phones first), then production. Record the Lighthouse and device results in the session log.

### 9.2 Exit criteria (release checklist, Experience §16.4)

- [ ] Real photos everywhere; alt text written.
- [ ] Music licence confirmed; credit shown.
- [ ] `noindex` verified; no names in previews; slug unguessable.
- [ ] No analytics or third-party scripts on `/love`.
- [ ] Copy proofread (and Sinhala if used).
- [ ] Budgets met on a mid-range phone; results logged.
- [ ] `/impeccable audit` clean; Emil reviews done.
- [ ] ADRs accepted; `Technology-Stack.md`, `Brand-Identity.md` (note on the two exceptions), `PLAN.md`, `PROGRESS.md` and the session log updated.

---

## 10. File map (guidebook names → repo names)

Per R2, files are kebab-case. Folder tree from Tech Stack §6, adjusted:

| Guidebook name                                                                          | Repo file                                                                 | Phase                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------- |
| `app/love/layout.tsx`                                                                   | optional; metadata only (chrome is handled in `storefront-chrome.tsx`)    | 1                           |
| `app/love/[slug]/page.tsx`                                                              | same                                                                      | 1                           |
| `LoveExperience.tsx`                                                                    | `src/features/love/love-experience.tsx`                                   | 1                           |
| `config/types.ts`, `config/sites/<slug>.ts`                                             | same                                                                      | 1                           |
| `engine/ScrollEngine.tsx`                                                               | `engine/scroll-engine.tsx`                                                | 2                           |
| `engine/heart-state.ts`, `story.ts`, `tiers.ts`, `motion-prefs.ts`, `theme-timeline.ts` | same                                                                      | 2                           |
| `engine/HeartDirector.ts`                                                               | `engine/heart-director.ts`                                                | 3                           |
| `engine/audio-engine.ts`                                                                | same                                                                      | 3                           |
| `canvas/LoveCanvas.tsx`                                                                 | `canvas/love-canvas.tsx`                                                  | 2                           |
| `canvas/Heart.tsx`, `heart.shaders.ts`                                                  | `canvas/heart.tsx`, `canvas/heart-shaders.ts`                             | 3                           |
| `canvas/MiniHearts.tsx`, `Petals.tsx`                                                   | `canvas/mini-hearts.tsx`, `canvas/petals.tsx`                             | 3                           |
| `canvas/MemoryOrbs.tsx`, `Arrow.tsx`                                                    | `canvas/memory-orbs.tsx`, `canvas/arrow.tsx`                              | 4                           |
| `canvas/WishStar.tsx`, `Confetti.tsx`                                                   | `canvas/wish-star.tsx`, `canvas/confetti.tsx`                             | 5                           |
| `sections/Gate.tsx` … `Finale.tsx`                                                      | `sections/gate.tsx` … `sections/finale.tsx`                               | 1 (stubs), then their phase |
| `ui/MusicToggle.tsx`, `ProgressHeart.tsx`, `CalmModeToggle.tsx`                         | `ui/music-toggle.tsx`, `ui/progress-heart.tsx`, `ui/calm-mode-toggle.tsx` | 2–3                         |
| `ui/MemoryDialog.tsx`, `Lightbox.tsx`                                                   | `ui/memory-dialog.tsx`, `ui/lightbox.tsx`                                 | 4–5                         |
| `useHold`                                                                               | `src/features/love/hooks/use-hold.ts`                                     | 5                           |
| `dev/HeartDebugPanel.tsx`                                                               | `dev/heart-debug-panel.tsx`                                               | 2                           |
| `scripts/prepare-love-images.mjs`                                                       | same                                                                      | 1                           |

Shared files modified: `src/components/layout/storefront-chrome.tsx` (P1), `app/globals.css` (P1), `package.json` + lockfile (P2), `next.config.ts` (P2, only if needed), `docs/decisions/DECISIONS.md` (P1), `docs/references/Technology-Stack.md` (P2), `docs/references/Brand-Identity.md` (P6 note).

---

## 11. Deadline cut line (if the birthday is close)

If there is not enough time for all six phases, ship this **minimum version**:

1. Phases 1, 2 and 3 in full (gate, hero, heart, bloom, music).
2. Memories, Timeline, Gallery and Letter using their **reduced-motion/static designs** (card grid, card list, simple gallery with lightbox, letter already open or with the simple click-to-open). These are already required work, so nothing is wasted.
3. Dawn as the plain cross-fade; Wish as the single-click version; Finale with a static heart and Replay.
4. Phase 6 steps 10–15 (real content and launch) plus the keyboard and contrast checks.

The full 3D versions of the later sections can then be added after the birthday without rework.

---

## 12. Risks to watch per phase

| Phase | Top risk                                    | Early signal                       | Response                                                                              |
| ----- | ------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| 1     | Chrome exception breaks a shop page         | Header missing elsewhere           | The `/love` check must be an exact prefix match; spot-check shop pages                |
| 2     | R3F / React 19.2 / Next 16 incompatibility  | Canvas fails or hydration warnings | Stop; try R3F version per Tech Stack §4.3; fall back to the static path if unresolved |
| 3     | Heart state corrupted by overlapping events | Half-burst heart after fast scroll | Director invariant; stress test before moving on                                      |
| 4     | Clicks don't reach the canvas               | Orbs unclickable                   | Switch to the `eventSource` fallback (Tech Stack §7.2)                                |
| 5     | Text on mid-tone colours during Dawn        | Contrast failure                   | Keep the 20–75 % text-free window                                                     |
| 6     | Phone GPU and thermal load                  | < 40 fps on Android                | Tiers, `drawRange`, DPR cap, bloom off on `low`                                       |

Full risk table: Tech Stack §13.

---

## 13. Content needed from the owner (and by when)

| Item                                      | Needed by                           |
| ----------------------------------------- | ----------------------------------- |
| Her name, your name, birthday date        | Phase 1 (placeholders fine)         |
| Music track + licence (or own recording)  | Phase 6 (synthetic beat until then) |
| 8 memory photos with title, date, caption | Phase 6 (prototypes until then)     |
| 5 timeline milestones, one featured       | Phase 6                             |
| 9–12 gallery photos                       | Phase 6                             |
| The letter, sign-off, optional passphrase | Phase 6                             |
| Wish line and finale message              | Phase 6                             |
| Language (English only, or also Sinhala)  | Phase 1 (affects layout testing)    |

---

## 14. Changelog

| Date       | Version | Change                                                                  |
| ---------- | ------- | ----------------------------------------------------------------------- |
| 2026-11-12 | 1.0     | First version: six phases, repo corrections R1–R8, file map, cut line   |
| 2026-11-12 | 1.1     | Added detailed per-phase guides in `phases/`                            |
| 2026-11-13 | 1.2     | All-night theme: day mode, Pearl skin and Dawn removed; Starlight added |
