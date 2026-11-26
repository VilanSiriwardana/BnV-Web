# B&V Birthday Love Site — Experience & Interaction Guidebook

| Field                            | Value                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version                          | 2.0 (as-built reference)                                                                                                                                         |
| Status                           | **Built.** Audited against the code on 2026-11-19. Release items still pending (§0.5)                                                                            |
| Created / Updated                | 2026-11-12 / 2026-11-19                                                                                                                                          |
| Audience                         | Claude Code (builder), the developer (reviewer), and anyone reusing this as a reference for future "Love Website" builds                                         |
| Location                         | `docs/references/love-site/Love-Site-Experience-Guidebook.md`                                                                                                    |
| Build order and repo corrections | [Love-Site-Implementation-Phases.md](Love-Site-Implementation-Phases.md). Its §2 overrides this file where they differ                                           |
| Companion document               | [Love-Site-Tech-Stack-and-Tools.md](Love-Site-Tech-Stack-and-Tools.md) (packages, architecture, performance, governance)                                         |
| Decisions                        | ADR-0029 + amendment (all-night theme, blueprint 038), blueprints 039–043 (Phase 7: gate, hero glow, spiral timeline, parchment letter, dance), ADR-0030 (music) |
| Brand source                     | `Brand-Identity.md` v1.6 (tokens, fonts, motion rules)                                                                                                           |

**How to read this document.** Each section keeps its original **intent** (what it should feel like) and then states what was **built** ("As built"), with values taken from the code. Specs that were planned in v1.0 but deliberately dropped are kept as short **Removed** notes so the history is not lost. Code paths are relative to `src/features/love/` unless stated.

---

## 0. As-built summary (audit 2026-11-19)

**Verdict:** the experience is built end to end and follows the plan in almost every mechanic (heart particle system, event timings, tiers, heart path, sticky stages, hero intro, memories, gallery, wish, finale, audio, fallbacks). Several parts were **redesigned and are better than planned** (gate, timeline, letter, the all-night palette, the new Dance section). There are a handful of small gaps, and **no release item is done** yet (real photos, music licence, deploy, device QA).

### 0.1 Status by section

| #   | Section   | Status                                  | Key files                                                                                 | One-line note                                                                                                                   |
| --- | --------- | --------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Gate      | Built, redesigned (better)              | `sections/gate.tsx`                                                                       | The glowing heart **is** the button; "Tap this" with a hand-drawn gold arrow; premium gold frame                                |
| 1   | Hero      | Built as planned (+ tuning)             | `sections/hero.tsx`, `engine/hero-intro.ts`                                               | All §6 timings match; glow 0.4, beat damped, float-up after the weave                                                           |
| 2   | Bloom     | Built as planned                        | `sections/bloom.tsx`, `canvas/petals.tsx`                                                 | Burst releases petals; camera dolly; line triggers a little earlier than spec                                                   |
| 3   | Memories  | Built as planned                        | `sections/memories.tsx`, `canvas/memory-orbs.tsx`, `ui/memory-dialog.tsx`                 | Orb formula, rail, hover, twins, focus ring, completion moment all present                                                      |
| 4   | Timeline  | Built, redesigned (better)              | `sections/timeline.tsx`, `engine/timeline-progress.ts`                                    | Golden **spiral** thread (serpentine on mobile); arrow fires after the last node                                                |
| 5   | Starlight | Built, replaces Dawn                    | `sections/starlight.tsx`                                                                  | All-night decision: aurora + stars instead of a sunrise and skin swap                                                           |
| 6   | Gallery   | Replaced by the Gallery Walk (Phase 12) | `sections/gallery.tsx`, `canvas/gallery-*.tsx`, `engine/gallery-*.ts`, `ui/gallery-*.tsx` | Scroll-driven 3D corridor (550vh sticky stage), click-to-inspect with gold note; masonry + lightbox remain the Calm/static path |
| 6b  | Dance     | **New** (beyond plan)                   | `sections/dance.tsx`, `canvas/dance-*.ts(x)`, `engine/dance-state.ts`                     | Particle silhouette couple, 12 key poses, ends in a romantic dip                                                                |
| 7   | Wish      | Built as planned                        | `sections/wish.tsx`, `hooks/use-hold.ts`, `canvas/wish-star.tsx`, `canvas/confetti.tsx`   | 2.4 s hold, confetti by tier, local-only wish field, tap-once alternative                                                       |
| 8   | Letter    | Built, redesigned (better)              | `sections/letter.tsx`, `sections/letter-ornaments.tsx`                                    | Parchment scroll with rods that unroll; opens by hold **or** by scrolling past the seal                                         |
| 9   | Finale    | Built as planned                        | `sections/finale.tsx`, `love-experience.tsx` (`replay`)                                   | Finale burst once per pass; Replay resets cleanly                                                                               |
| –   | Global    | Built                                   | `engine/*`, `canvas/*`, `ui/*`, `app/globals.css` `[data-love-root]`                      | Theme, director, tiers, audio, chrome, calm/static fallback, debug panel                                                        |

### 0.2 Better than planned

- **Gate:** the heart button doubles as the seed of the 3D entrance; hand-drawn "Tap this" arrow; double gold frame, grain and breathing halo.
- **Timeline:** a spiral golden thread instead of an S-curve; the heart rides its tip; the arrow strike lands as the story reaches the birthdate.
- **Letter:** aged parchment with gold stripes, curls, ribbon, drop cap and heart dividers; a three-layer parallax backdrop of gold hearts; two rods part and the parchment unrolls; also opens just by scrolling.
- **All-night palette with warming:** instead of turning to day, the heart gains gold section by section (`heart.gold` 0 → 0.6), and the background deepens and lightens through `--depth` stops across the whole page.
- **Starlight:** a lavender and gold aurora with 40 twinkling stars.
- **Dance section:** a couple drawn in the heart's particle style, flowing through 12 poses without scattering (2-bone IK keeps hands joined).
- **Ambient hearts:** 12 independent hearts twinkle around the frame once the petals are gone.
- **Engine robustness:** director queue cap (2), `toBaseline` glow easing, `settle()` on every scroll-back; debug panel shows draw calls, triangles and textures; 15 unit-test files (heart path, geometry, director core, tiers, timeline progress, dance state, `useHold`, audio bands, session, config and more).

### 0.3 Changed by decision (not gaps)

| Planned (v1.0)                                 | Built                                                        | Decision                          |
| ---------------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| Night → dawn theme (`--dawn`, day tokens)      | Night only; `--depth` stops through the whole page           | ADR-0029 amendment, blueprint 038 |
| Pearl skin + `skinSwap`                        | Aura skin only, with `heart.gold` warming                    | Same                              |
| Dawn section, `dawnQuote`                      | Starlight section, `starlightLine`                           | Same                              |
| Gallery, Wish, Letter, Finale on Ivory / Blush | Same sections on night tokens with more lavender and gold    | Same                              |
| Button "Tap to begin" under a seed             | Heart is the button; "Tap this" arrow                        | Blueprints 039, 043               |
| S-curve thread; arrow at the featured node     | Spiral thread; arrow when the heart leaves the last node     | Blueprints 039, 042               |
| Envelope with flap; hold the seal              | Parchment scroll with rods; hold **or** scroll past the seal | Blueprints 039, 043               |
| Hero glow 0.6 → 0.8, shine at 6 s              | Glow 0.4, no end-of-intro shine, beat damped to 40 %         | Blueprints 042, 043               |
| Partner dance dropped                          | Dance section added (particle silhouettes)                   | Blueprints 039, 041               |

### 0.4 Known gaps (small, optional to fix)

| Gap                                                                                                                              | Spec            | Where                                         |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------- |
| Bloom intensity is fixed per tier; does not follow `heart.glow` and does not spike on the arrow hit (only the heart glow spikes) | §3.5, Tech §5.4 | `canvas/love-canvas.tsx`                      |
| Treble band is computed but drives nothing; `shine` has no star glints                                                           | §3.5, §3.7      | `engine/audio-engine.ts`, `canvas/sparks.tsx` |
| No idle ribbon-dust orbiting the hero heart                                                                                      | §6              | `canvas/heart.tsx`                            |
| No pointer push on petals (was optional)                                                                                         | §7              | `canvas/petals.tsx`                           |
| `sealBreak` releases 2 × 8 tap hearts for about 1.3 s (spec about 12 for about 3 s)                                              | §3.5, §13       | `engine/heart-director.ts`                    |
| ~~Gallery tiles get no fade in calm~~ Fixed in Phase 12: 0.4 s opacity fade in Calm (none under OS reduced motion)               | §11             | `engine/story.ts` (`applyStaticStory`)        |
| ~~Gallery parallax always on~~ Removed in Phase 12 (the masonry only shows on the quiet path, without parallax)                  | §11             | `engine/story.ts` (`buildGallery`)            |
| "Make another wish" appears at 2 s with the message (spec 4 s)                                                                   | §12             | `sections/wish.tsx`                           |
| Bloom line triggers at `top 70%` and is centred (spec about 30 %, left on desktop)                                               | §7              | `engine/story.ts`, `sections/bloom.tsx`       |
| Gate readiness from canvas `onCreated`, ring shows a fixed 35 % (spec drei `useProgress`)                                        | §5              | `sections/gate.tsx`                           |
| ~~Petals are not dimmed behind the Bloom text column~~ Closed in Phase 8 (M24): shader dims petals in the text zone              | §7              | `canvas/petals.tsx`                           |
| `config.test.ts` does not check "exactly 5 timeline items, one featured"                                                         | §3.9            | `config/config.test.ts`                       |

### 0.5 Release pending (from `docs/AI_SESSION_LOG.md`)

- [ ] Real photos replace all 33 prototype images (`public/images/prototype/love-*.webp`).
- [ ] Music licence and credit (`/audio/wedding-background.mp3`, 7.4 MB; `credit` is empty; ADR-0030 still Proposed).
- [ ] Production build (blocked in recent sessions by the Google Fonts fetch), Vercel preview and production deploy.
- [ ] Browser and real-device QA (every Phase 5–7 entry marks browser behaviour as not verified): fast-scroll ×10, 375 px layouts, lightbox keys and swipe, seal docking, Replay, contrast, fps.
- [ ] Phase-7 exit checklist; `docs/governance/PROGRESS.md` Love Site entry.
- [ ] Improvement Report items (P1–P7, G1–G6) are proposals only.

---

## 1. Concept and emotional arc

**One sentence:** two lights find each other, become a heart, and that heart travels with her through the story of you two, until it becomes the seal on a letter.

| Phase        | Feeling                     | Sections             |
| ------------ | --------------------------- | -------------------- |
| Anticipation | Hush, curiosity             | Gate, Hero           |
| Wonder       | Awe, play                   | Bloom, Memories      |
| Tenderness   | Warmth, recognition         | Timeline             |
| Release      | Breath, a sky full of stars | Starlight            |
| Joy          | Celebration                 | Gallery, Dance, Wish |
| Intimacy     | Quiet, personal             | Letter               |
| Resolution   | Love, a smile               | Finale               |

**Brand fit:** calm, cinematic, premium, soft luxury. Lavender is the signature, champagne gold the luxury accent, dusty rose a touch of romance. Never neon, never Valentine-red, never bouncy. Heavy animation means **long, slow, well-timed moves**.

**Design principle:** the path is scrubbed, the moments are triggered. Continuous things (heart position, camera, `--depth`, thread drawing) follow the scroll; dramatic things (burst, arrow strike, wish) are timed events that play at a fixed speed.

---

## 2. Rules for Claude Code (unchanged; all followed in the build)

1. Colours from tokens only; no hex in components.
2. Every animation has a reduced-motion variant.
3. GSAP owns scroll-linked and 3D-state animation; Motion owns small component transitions. Never both on one element.
4. Per-frame values live in the mutable `heart` object and refs. No `setState` per frame.
5. Every dramatic event goes through the Heart Director, one at a time, with the baseline invariant.
6. Every clickable 3D object has a focusable DOM twin.
7. `useGSAP()` with a `scope` and `gsap.matchMedia()`; everything cleans up on unmount.
8. One big event per section.
9. No new dependencies beyond the approved list.
10. Read `node_modules/next/dist/docs/` before Next.js-specific code; update `progress.md` and `AI_SESSION_LOG.md`.
11. Mark unverified things `UNCERTAIN`.

---

## 3. Global systems

### 3.1 Theme: all night, with depth

**Intent:** the page owns its theme and never shows the shop chrome or the global toggle.

**As built** (`app/globals.css` `[data-love-root]`, `engine/theme-timeline.ts`):

- The root defines `--night-*` alias tokens that mirror the brand dark values (bg `#17121d`, surface `#241b2e`, surface-elevated `#2f243a`, fg `#f7f1ea`, border `#4a3a50`, muted-fg `#b8aabd`, primary `#c8b6e2`, gold `#d2b16f`, secondary `#b9828a`), plus `gold-text`, `ring`, `input`, `muted`, `accent` and `primary-*` variants (Phases R3). Semantic roles are derived with `color-mix`.
- One animated number, `--depth` (0–1), mixes `--night-surface-elevated` into `--night-background`. GSAP scrubs it from `top bottom` to `bottom bottom` of each trigger:

| Trigger      | `--depth` | Feel               |
| ------------ | --------- | ------------------ |
| Gate → Bloom | 0         | Midnight Aubergine |
| `#memories`  | 0 → 0.5   | Deepening          |
| `#timeline`  | 0.5 → 1   | Warmest night      |
| `#gallery`   | 1 → 0.5   | Opens up a little  |
| `#wish`      | 0.5 → 1   | Warm again         |
| `#finale`    | 1 → 0.5   | Settles            |

- Calm mode uses static per-section `data-depth` stops with a 300 ms transition (`sections/love-section.tsx`).
- Extras: aurora tokens `--love-aurora-lav` (35 %) and `--love-aurora-gold` (30 %), gate and parchment styles, `.love-grain` SVG noise, `color-scheme: dark`.
- Canvas colours are read once from the `--night-*` tokens (`canvas/token-colors.ts`); the canvas is transparent over the root background.

**Removed (all-night, ADR-0029 amendment):** `--dawn`, all `--day-*` tokens, the night → day table, and the Ivory/Blush looks for Gallery → Finale.

### 3.2 Typography and layout (as planned)

Cinzel for display and section titles, Cormorant Garamond for copy (letter body 1.15–1.25 rem), Inter for UI. Text columns ≤ 60 characters; existing button component with medium radius; bordered cards; gold text uses `gold-text`; over-image text gets a scrim.

### 3.3 The heart: Aura skin with gold warming

**As built:** one skin, **Aura** (additive particles + soft bloom) in every section. Colour split per particle is 55 % lavender, 15 % lilac (`--night-primary-hover`), 22 % gold, 8 % rose. After weaving, a left-to-right lavender → gold gradient remains (`smoothstep(0.25, 0.75)`, mixed 0.35–0.70 by form) so "two lights become one" stays visible.

**Gold warming** replaces the planned Pearl skin. `heart.gold` follows `HEART_PATH.gold` per section and is mixed into the shader as `uGold × 0.35`:

| Hero | Bloom | Memories | Timeline | Starlight | Gallery | Dance | Wish | Letter | Finale |
| ---- | ----- | -------- | -------- | --------- | ------- | ----- | ---- | ------ | ------ |
| 0    | 0     | 0.1      | 0.2      | 0.4       | 0.4     | 0.45  | 0.5  | 0.6    | 0.6    |

On the letter seal the colour target is `max(gold, sealRim)`.

**Removed:** Pearl skin (extruded mesh, `MeshPhysicalMaterial`, contact shadow), `uSkin`, `heart.skin`.

### 3.4 Heart particle system (`canvas/heart.tsx`, `canvas/heart-shaders.ts`, `canvas/heart-geometry.ts`)

Built as specified: one `THREE.Points` with one `ShaderMaterial`; attributes `aRibbon`, `aHeart`, `aScatter`, `aRand` (vec4); 18,000 allocated once, drawn 18,000 / 8,000 / 3,000 by tier via `setDrawRange`. Staggered weave `(uForm − aRand.x·0.35)/0.65`, staggered burst `(uBurst − aRand.x·0.30)/0.70`, idle drift 0.02, beat pulse 0.04 (size ×0.3), point size `28/−mv.z`.

Heart shape uses the standard parametric heart:

```ts
export function heartPoint(t: number): [number, number] {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return [x / 17, y / 17];
}
```

Distribution 70 % outline band (±4 % offset) / 30 % interior (`sqrt` radius); scatter radius 3. The left ribbon traces t ∈ [π, 2π] (left half), the right ribbon the right half, with ribbon `s` mapped along each half, so the ribbons literally draw the heart. Sides alternate even/odd so any draw-range prefix includes both ribbons.

**As-built details beyond the sketch:** ribbon W = 7, r0 = 1.1, r1 = 0.06, 3.5 turns, 0.4 rad jitter, centreline blending toward the heart point by `s`; ribbon spin `uTime·0.8·(1 − f)`. Extra uniforms `uBeatScale` (0.4 on the hero, 1 elsewhere), `uGlow`, `uGold`. Fragment: formed alpha ×0.6, overall ×0.55, output clamped to 0.9; shine is a diagonal band from −1.4 to 1.4, width 0.18.

### 3.5 Heart event catalogue (`engine/heart-director.ts`, `engine/heart-director-core.ts`)

All events go through the director: one at a time, queue capped at 2 (repeats ignored), `settle()` forces the section baseline, and `toBaseline` eases glow back over 1.2 s `sine.inOut`. `HEART_EVENTS` drives the debug panel.

| Event         | Trigger                              | Spec                                             | As built                                                                           | Reduced motion       |
| ------------- | ------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------- |
| `ribbonWeave` | Gate dismissed                       | 3.2 s `power2.inOut`                             | Same; from the gate seed's NDC                                                     | `form = 1` instantly |
| `pulse`       | Heart tap, node reached, reform end  | lub-dub, about 0.7 s                             | +6 % / 120 ms, back / 100 ms, +4 % / 100 ms, back / 180 ms (additive `flinch`)     | 200 ms glow flash    |
| `glowUp`      | Section entry, node, Starlight 35 %  | +0.5 / 0.9 s, settle 1.4 s                       | Same                                                                               | 250 ms flash         |
| `shine`       | Starlight 50 %, gallery batches      | 1.1 s, throttled ≥ 4 s                           | 1.1 s, throttle 4,000 ms, dropped if another event is playing. **No star glints**  | Skipped              |
| `burst`       | Bloom, arrow, wish, finale           | 1.1 s `power3.out`, glow 0.3                     | Same; optional `petalRelease` 0 → 1 over 2 s                                       | Skipped              |
| `reform`      | After burst                          | 1.6 s, +0.25 glow, 0.8 s settle, ends with pulse | Same; the pulse starts with the settle                                             | Skipped              |
| `burstReform` | Bloom                                | about 3.2 s                                      | about 4.0 s (1.1 + 0.5 hold + 1.6 + 0.8)                                           | `pulse`              |
| `arrowStrike` | Timeline, heart leaves the last node | about 5.2 s                                      | about 5.4 s (see below); `interrupt()` jumps the queue; +0.15 glow boost after     | Flash + pulse        |
| `wishMerge`   | Wish completes                       | about 4 s                                        | 0.3 s flash → confetti + burst → 0.2 s hold → reform (about 4 s)                   | Flash, no confetti   |
| `dockToSeal`  | Letter section                       | 0.9 s `power3.inOut`                             | Same; sets `sealRim = 1`; position followed every tick in `buildLetter`            | Instant              |
| `sealBreak`   | Letter opens                         | about 12 hearts, 3 s drift                       | Flash + `spawnTapHearts(8)` at 0 s and 0.3 s (about 1.3 s)                         | Letter fades in only |
| `finaleBurst` | Finale `top 60%`, once per pass      | about 3.2 s                                      | 0.3 s glow → burst + 50 % confetti → 0.5 s → reform; scale 1.3 comes from the path | `pulse`              |

**`arrowStrike` as built:** dip (glow −0.15, scale −3 %, 0.2 s) → arrow flies 0.2–1.1 s on an arc from top-left (`power1.in`), trailing a spark every 0.05 s → **hit at 1.1 s**: −8 % in 80 ms → +6 % in 220 ms → settle 300 ms; shock ring 0.8 s; heart glow ×2 for 40 ms, back in 80 ms; camera shake 0.015 decaying over 250 ms → arrow dissolves into 40 sparks, hidden at 1.45 s → `burst` at 1.4 s, 0.5 s hold, `reform` → baseline +0.15 for the rest of the timeline.

**Removed:** `skinSwap`.

### 3.6 Supporting 3D elements

| Element          | As built                                                                                                                                                                                                                           | Counts (high / mid / low) |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Small hearts     | `InstancedMesh`, extruded heart; scale 0.04–0.10; lavender, rose, gold, ivory, lilac; `easeOutCubic` spread, `smoothstep(0, 0.15)` fade; tap pool of 8 (`canvas/mini-hearts.tsx`)                                                  | 40 / 28 / 18              |
| Petals           | `InstancedMesh` curved planes, GPU fall and sway; rose / lavender / gold; mid band speeds drift up to ×1.3; visible while `petalRelease > 0`, fade over the first half of Starlight                                                | 120 / 70 / 40             |
| Confetti         | `InstancedMesh` 0.06 × 0.03 quads, shader physics, 4 s life, ±35° cone, ≥ 1.5 s between launches; primary, secondary, gold, foreground                                                                                             | 300 / 160 / 80            |
| Arrow            | Cylinder + cone + 2 fletching planes, gold ×2.5 (`toneMapped: false`); mounted only while `heart.arrow > 0` (`canvas/arrow.tsx`)                                                                                                   | 1                         |
| Shock ring       | `RingGeometry(0.85, 1, 64)`, additive (`canvas/shock-ring.tsx`)                                                                                                                                                                    | 1                         |
| Sparks           | One additive `Points` pool for arrow trail and dissolve (`canvas/sparks.tsx`)                                                                                                                                                      | 60                        |
| Memory orbs      | Fresnel shell (additive, no transmission) + `Billboard` photo plane; `uHover`, `uSaturation`; emissive `1 + beat·0.05`                                                                                                             | 8 / 8 / 6                 |
| Wish star        | Shader quad, normal blending; scale `1.3·(1 + 0.6·hold)`, halo `mix(0.2, 1.0, hold)` (`canvas/wish-star.tsx`)                                                                                                                      | 1                         |
| Ambient hearts   | **New.** 12 gold, lavender and rose hearts, 1.8–3.2 s lives, 0.5–4 s respawn gaps, ±12 % size pulse; only when petals are gone, the tab is visible, motion is allowed, tier mid/high (`AmbientHearts` in `canvas/mini-hearts.tsx`) | 12                        |
| Dance duo        | **New.** See §11b                                                                                                                                                                                                                  | 14k / 7k / 0              |
| Heart tap target | Transparent circle (r 0.95) on the heart for clicks                                                                                                                                                                                | 1                         |
| Bloom pass       | `NightBloom`, threshold 0.6, fixed intensity 0.7 (high) / 0.4 (mid), off on low                                                                                                                                                    | –                         |

### 3.7 Audio engine (`engine/audio-engine.ts`, `engine/audio-bands.ts`)

As planned: created on the gate tap (synchronously inside the gesture); `audio → source → gain → analyser (fftSize 512) → destination`; fade 0 → 0.6 over 2 s; loop; pause and suspend on tab hidden. Bands: bass 0–2, mid 3–12, treble 13–60; bass fast attack, decay 0.9; `heart.beat = bass^1.5`, clamped to 1. If the file fails, a synthetic **72 bpm lub-dub** drives the beat.

As built extras: synthetic beat also runs while muted (×0.8); mid decay 0.94, treble 0.85; unmute fades in over 0.6 s; hero beat damped to 40 % (`uBeatScale`). Mid drives petal drift. **Gap:** treble drives nothing; orb emissive uses `heart.beat` (bass), not mid.

### 3.8 Global chrome (all built)

| Control        | As built                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Music toggle   | Fixed top-right, 44 px, `Volume2` / `VolumeX`, `aria-pressed`, `aria-label="Music"`, tap scale 0.94; shown after the gate (`ui/music-toggle.tsx`) |
| Progress heart | Desktop: 2 px rail at the right with a heart marker; mobile: 2 px bar on top; `aria-hidden`; driven by `--progress` (`ui/progress-heart.tsx`)     |
| Calm mode      | Bottom-left text button, `aria-pressed`, ≥ 44 px (`ui/calm-mode-toggle.tsx`)                                                                      |
| Skip link      | "Skip to the letter" (`#letter`), first focusable element, `sr-only` until focused (`love-experience.tsx`)                                        |

### 3.9 Content configuration (`config/types.ts`, `config/sites/<slug>.ts`)

One typed file per site, so the build is a reusable "Love Website" template.

```ts
export type PhotoRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blur?: string;
};

export type LoveSiteConfig = {
  slug: string; // long, unguessable (current: 28 chars)
  recipient: { name: string };
  sender: { name: string };
  birthday: string; // ISO date
  copy: {
    heroSub: string;
    bloomLine: string;
    memoriesHint: string;
    timelineTitle: string;
    starlightLine: string; // was dawnQuote
    galleryTitle: string;
    danceTitle: string;
    danceLine: string; // new (Dance)
    wishPrompt: string;
    wishDone: string;
    letterTitle: string;
    finaleMessage: string;
  };
  memories: {
    id: string;
    title: string;
    date: string;
    caption: string;
    photo: PhotoRef;
    orb?: string;
  }[]; // 6–8
  timeline: {
    id: string;
    date: string;
    title: string;
    text: string;
    photo?: PhotoRef;
    featured?: boolean;
  }[]; // 5
  gallery: PhotoRef[]; // 9–12
  letter: {
    salutation?: string;
    paragraphs: string[];
    signoff: string;
    passphrase?: string;
  };
  music: { src: string; credit: string };
};
```

Assets: `scripts/prepare-love-images.mjs` (sharp) produces 512 × 512 orb squares, 1600 px memory images, 1200 px timeline and gallery images, and 16 px blur placeholders (WebP q80). Current site file: 8 memories, 5 timeline items, 12 gallery photos — **all AI prototype placeholders** (33 files in `public/images/prototype/`).

### 3.10 Tiers (`engine/tiers.ts`, `engine/tier-provider.tsx`)

| Tier     | Particles | DPR  | Bloom   | Orbs | Confetti | Mini hearts | Petals | Dance |
| -------- | --------- | ---- | ------- | ---- | -------- | ----------- | ------ | ----- |
| `high`   | 18k       | 1.75 | on      | 8    | 300      | 40          | 120    | 14k   |
| `mid`    | 8k        | 1.5  | reduced | 8    | 160      | 28          | 70     | 7k    |
| `low`    | 3k        | 1.0  | off     | 6    | 80       | 18          | 40     | 0     |
| `static` | no canvas | –    | –       | DOM  | –        | –           | –      | SVG   |

`guessTier` uses touch, cores, memory and screen size; no WebGL → `static`; Save-Data → `low`; server render is `static`. drei `PerformanceMonitor` (`flipflops = 3`) steps down at runtime but never into `static`. The gate's 6 s timeout drops high/mid to low.

### 3.11 Calm mode and static fallback

`useQuiet() = calm || tier === 'static'` (`engine/use-quiet.ts`). Calm mode includes the OS reduced-motion setting (`engine/motion-prefs.ts`). When quiet: the canvas is not mounted, `data-love-motion` is removed (sticky stages fall back to natural height), Lenis is not used, `applyStaticStory` builds only progress, and each section renders its static variant (`ui/static-heart.tsx`, card grids, SVG dance still, open letter).

---

## 4. Scroll map and heart path

### 4.1 Scroll map (desktop; mobile stages ×0.85)

| #   | Section   | `id`        | Stage                       | Mechanism                                              | Main tools                     |
| --- | --------- | ----------- | --------------------------- | ------------------------------------------------------ | ------------------------------ |
| 0   | Gate      | `gate`      | Fixed overlay               | `lenis.stop()` + `html { overflow: hidden }` until tap | Motion, CSS                    |
| 1   | Hero      | `hero`      | 200 vh                      | Time-based intro + sticky stage                        | GSAP, SplitText, R3F           |
| 2   | Bloom     | `bloom`     | 150 vh                      | Scrubbed path + triggered burst                        | GSAP, R3F                      |
| 3   | Memories  | `memories`  | 400 vh                      | Sticky stage; camera rail scrubbed                     | GSAP, R3F, Radix Dialog        |
| 4   | Timeline  | `timeline`  | 400 vh                      | Sticky stage; spiral thread; triggered arrow           | GSAP, SVG, R3F                 |
| 5   | Starlight | `starlight` | 100 vh                      | Scrubbed heart rise; triggered glowUp and shine        | GSAP, CSS                      |
| 6   | Gallery   | `gallery`   | 550vh sticky stage          | Corridor walk + inspect (ADR-0035)                     | R3F, GSAP, `next/image` (Calm) |
| 6b  | Dance     | `dance`     | 250 vh                      | Sticky stage; scrubbed poses                           | GSAP, R3F DataTexture          |
| 7   | Wish      | `wish`      | 200 vh                      | Sticky stage; press-and-hold                           | R3F, `useHold`                 |
| 8   | Letter    | `letter`    | 200 vh                      | Sticky stage; hold or scroll to open                   | GSAP, DOM/SVG                  |
| 9   | Finale    | `finale`    | Natural flow (about 100 vh) | Triggered finale                                       | GSAP, R3F, Lenis               |

Sticky scenes use a tall container with an inner `position: sticky` stage (`ui/sticky-stage.tsx`, `[data-stage-inner]`); `pin: true` is never used.

### 4.2 Heart path (`engine/heart-path.ts`; NDC x −1 … +1, y −1 … +1)

| Section   | Desktop                                                         | Mobile             | Glow                    |
| --------- | --------------------------------------------------------------- | ------------------ | ----------------------- |
| Hero      | (0, 0.05) s1.0 (weave ends `HERO_RISE` = 0.14 lower, floats up) | (0, 0.25) s0.9     | 0.4                     |
| Bloom     | → (0.55, 0.10) s0.55                                            | (0, 0.6) s0.3      | 0.7                     |
| Memories  | (0, −0.55) s0.38, rides the rail                                | (0, 0.62) s0.28    | 0.55                    |
| Timeline  | Thread tip, s0.30                                               | Thread tip, s0.26  | 0.6 (+0.15 after arrow) |
| Starlight | (0, −0.55) s0.3 → (0, 0.15) s0.6                                | (0, 0.5) s0.5      | 0.5                     |
| Gallery   | (0.86, −0.78) s0.20                                             | (0.8, −0.85) s0.16 | 0.35                    |
| Dance     | (0, 0.55) s0.18                                                 | (0, 0.62) s0.16    | 0.45                    |
| Wish      | y −0.45 s0.35 → y −0.05 s0.5 while holding                      | same               | 0.5                     |
| Letter    | Docks onto the seal (measured every tick)                       | same               | 0.4                     |
| Finale    | (0, 0.05) s1.3                                                  | (0, 0.15) s1.0     | 0.7                     |

Positions are converted to world units with the live viewport at the heart's depth (`canvas/heart.tsx`), so resizing and rotation stay correct. **Mobile rule:** the heart never sits behind body text.

### 4.3 Story builder (`engine/story.ts`)

`buildStory(root, { quiet, tier })` uses `gsap.matchMedia` with `motion` and `mobile` conditions; when motion is off or quiet it calls `applyStaticStory`. Otherwise it runs `buildTheme`, `buildProgress` and one builder per section (`buildHero`, `buildBloom`, `buildMemories`, `buildTimeline`, `buildStarlight`, `buildGallery`, `buildDance`, `buildWish`, `buildLetter`, `buildFinale`). `baselineOn()` sets the director baseline per section (`top center` → `bottom center`). It is called from `useGSAP` in `love-experience.tsx` with dependencies `[quiet, tier]`.

---

## 5. Section 0 — Gate

**Intent:** a hush before the show; the user gesture that unlocks audio; the loading screen for the 3D chunk.

**As built** (`sections/gate.tsx`, Blueprint 072 "Two Lights"):

- A modal (`aria-modal`, `data-lenis-prevent`) full-viewport night composition: canvas grain, the 14 ambient rising hearts, and four 1 px gold hairlines that draw in clockwise (0.6–2.1 s).
- Text: small caps `copy.gateEyebrow` (default "Made for you"), "For {name}" (blur-rise, shimmer), then "A story waiting to unfold." (placeholder; the owner should replace it with a personal line).
- Two lights, lavender (`--primary`) and gold (`--gold`), sit apart at viewport centre. Their spacing is one CSS variable, `--sep`, on the gate root. GSAP drifts it 1 → 0.62 while loading and → 0.5 when ready, plus one idle nudge after 4 s.
- The control is one transparent full-screen `<button>` (`aria-label` "Begin"/"Getting ready", `aria-disabled` while loading, `autoFocus`). **Press and hold** (`useHold`, 1.4 s) pulls the lights together; `useHold` progress writes `--sep` directly, and early release eases back. The focus ring shows on the merge core. Hint `copy.gateHint` (default "Press and hold") and an "Or tap once" link fade in at 4 s and hide on first press.
- Audio starts on the first press (synchronously in the gesture), so the music fades in during the hold. On merge: core flash, `playChime(0)`, then the unchanged entry: seed NDC from the merge core → 600 ms fade → Lenis scroll reset to top (`immediate`, `force`) → `lenis.start()` → `onEnter` (ribbon weave). 650 ms later Lenis `resize()` and `ScrollTrigger.refresh()` re-measure.
- Loading: "Getting ready…" for screen readers; after **6 s** it continues anyway and drops high/mid to the low tier.
- Removed: double frame, "Tap this" and arrow, loading ring, heart button and breathing halo.
- Quiet / reduced motion: static lights (`--sep` 0.2), no CSS animations, a single tap enters.

**Acceptance:** no scroll and no audio before the first press; missing audio does not block; LCP is the gate text; the weave starts from screen centre; the page starts at the top after entry.

---

## 6. Section 1 — Hero ("two lights become one heart")

**As built** (`sections/hero.tsx`, `engine/hero-intro.ts`, `buildHero`):

| Time      | Event                                                                                                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0–3.2 s | `ribbonWeave`: lavender ribbon from the left, gold from the right, from the gate seed into the heart                                                                                                        |
| 3.2 s     | First `pulse`                                                                                                                                                                                               |
| 3.4 s     | Title "Happy birthday, {name}" reveals (SplitText chars, 60 ms stagger, 0.5 s each, `aria: 'auto'`); heart floats up into place (2.6 s `sine.inOut`); idle breathing starts (±1.5 % scale, ±0.04 glow, 4 s) |
| 4.2 s     | Subhead fades up (400 ms)                                                                                                                                                                                   |
| 5.0 s     | Scroll cue fades in, bobs 4 px over 1.2 s; fades after 8 px of scroll                                                                                                                                       |
| After     | Resting glow 0.4, bloom 0.7 / 0.4; beat damped to 40 %. No end-of-intro shine                                                                                                                               |

- **Scroll:** over the first 40 % of the 200 vh stage the heart rolls −8° and the copy lifts 60 px and fades (scrub 0.6).
- **Pointer parallax** (`pointer: fine` only): up to 6°, following the cursor's x across the window.
- **Tap the heart:** `pulse` + 6 tap hearts, 1.2 s cooldown. DOM twin: sr-only button "Make the heart beat".
- **Replay** re-arms the weave.
- Reduced motion: heart fully formed, 0.3 s fades, no parallax.

**Gap:** idle ribbon-dust particles are not built.

---

## 7. Section 2 — Bloom

**Intent:** wonder. The heart opens into petals.

**As built** (`sections/bloom.tsx`, `buildBloom`, `canvas/petals.tsx`):

- Scrubbed (0.8): heart from the hero pose to (0.55, 0.10) s0.55 (mobile (0, 0.6) s0.3); camera z 6 → 4.2 → 6 (`sine.inOut`).
- Triggered at `top 60%`: `burstReform` with `petalRelease` (petals spawn over 2 s, then drift through Memories). `settle()` on scroll-back.
- The line (`copy.bloomLine`) rises 16 px over 0.4 s at `top 70%`, centred.
- Reduced motion: heart stays formed; no petals; no camera move.

**Gaps:** no petal pointer push (optional); petals are not dimmed behind the text.

---

## 8. Section 3 — Floating Memories

**Intent:** touch and discover; eight glowing orbs in a corridor she flies through.

**As built** (`sections/memories.tsx`, `canvas/memory-orbs.tsx`, `engine/memory-layout.ts`, `engine/memories-state.ts`, `ui/memory-dialog.tsx`):

- Orb `i`: `z = −6 − 4.5i`, `x = sin(1.3i)·2.4` (×0.6 on mobile), `y = cos(0.9i)·1.2`. Only orbs within 14 units update; hit radius 1.1.
- Scroll (400 vh): the first 12 % moves the heart to (0, −0.55) s0.38; the remaining 88 % moves the camera from z 6 to the last orb + 4. The heart rides along (depth follows the rail).
- Hover (mouse only): orb lifts +0.4 z, ×1.1, shell glows, photo saturates (damp rate 12, about 250 ms); heart leans ≤ 0.15 NDC; cursor pointer.
- Click / tap: `pulse` + 4 hearts, then the Radix dialog (photo, date, title, caption); Lenis stopped while open.
- Keyboard: sr-only twin buttons; focusing one scrolls to its orb (0.8 s) and draws a ring around its projected rectangle (min 44 px).
- Counter "n of N opened"; when all are opened, `glowUp` and "That's all of them. For now."
- A visible "Memories" heading. Calm: two-column card grid with the same dialog.

---

## 9. Section 4 — Pinned Timeline ("How we got here")

**Intent:** the story of you two along a golden thread, with the arrow strike at its heart.

**As built** (`sections/timeline.tsx`, `buildTimeline`, `engine/timeline-progress.ts`, `engine/svg-ndc.ts`):

- **Thread:** a golden **spiral** on desktop (1.75 turns, radius 1 → 0.18 of 44 × 38 in a 0–100 box); a wide left-to-right **serpentine** on mobile (1.25 waves, amplitude 38, y 4 → 58). Drawn with stroke-dash.
- Scroll (400 vh): 10 % intro, 80 % thread, 10 % outro. Five nodes at 10 / 30 / 50 / 70 / 90 % of the path.
- **Heart rides the tip:** `getPointAtLength` + cached CTM → NDC.
- **Node activation:** dot 0.6 → 1 over 0.25 s; card rises 24 px and fades in over 0.4 s; `glowUp` + `pulse` going forward. Earlier cards dim to 40 % on desktop, hide on mobile.
- Desktop cards alternate above and below the node (20 rem wide). Mobile: one card at the bottom (max 38 svh); the stage starts below the title (`top: clamp(8rem, 24svh, 11rem)`) so nothing overlaps it.
- **Arrow strike:** fires when the heart leaves the last node (the birthdate), at thread progress ≥ 0.94, on desktop and mobile. It rearms below 0.9 (and resets the glow boost).
- **Outro:** the desktop heart returns to the Memories pose and then rises through Starlight; on mobile it goes straight to the Starlight pose.
- Nodes are real buttons with `aria-current="step"`; click scrolls to the node over 1.2 s.
- Calm: a static vertical list with a soft glow on the featured card.

---

## 10. Section 5 — Starlight (replaces Dawn)

**Intent:** a breath between the story and the celebration.

**As built** (`sections/starlight.tsx`, `buildStarlight`):

- 100 vh at `depth` 1. A DOM lavender and gold aurora (drifting over 18 s) and 40 deterministic stars (a third gold, twinkle 3.2 s).
- Scrubbed from `top 80%` to `bottom 20%`: heart rises from the Memories pose (0, −0.55) s0.3 to (0, 0.15) s0.6 (mobile (0, 0.5) s0.5); petals fade out over the first half.
- Triggered: `glowUp` at 35 % (rearms below 30 %); `shine` at 50 % (rearms below 40 %).
- One line (`copy.starlightLine`, gold-text italic) fades in from 40 %.

**Removed:** `--dawn` crossover, sunrise gradient, `skinSwap`, the text-free 20–75 % window (no longer needed: there is no mid-tone background).

---

## 11. Section 6 — Gallery

**As built** (`sections/gallery.tsx`, `buildGallery`, `ui/lightbox.tsx`, `sections/love-photo.tsx`):

- Gold Cinzel title; CSS masonry (`columns-2 md:columns-3`) of 12 bordered tiles (`border-gold/30`, `rounded-lg`); natural scroll.
- Reveal: `ScrollTrigger.batch`, start `top 88%`, `once`, y 24 px, clip `inset(12% 8% 12% 8% round var(--radius-lg))` → `inset(0)`, 0.8 s `power3.out`, stagger 0.08. Each batch plays a `shine` (throttled to 4 s).
- Desktop parallax on the first six tiles (yPercent −6 → 6, scale 1.12).
- Hover scale 1.03 over 250 ms; caption (the photo's `alt`) on a scrim on hover and focus.
- Lightbox: Radix dialog with a carousel (drag to swipe, thumbnails, arrow keys), Lenis stopped while open, focus restored.
- `next/image` with `sizes` and blur placeholders; `priority` for the first three tiles.
- Heart: quiet companion at (0.86, −0.78) s0.2, gold-tinted.

**Gaps:** no fade in calm mode; parallax always on tiles 1–6; mobile tap targets rely on tile padding only.

---

## 11b. Section 6b — Dance ("You and me, dancing") — new

**Intent:** a tender, playful moment appreciating her as a dance partner.

**As built** (`sections/dance.tsx`, `canvas/dance-silhouettes.ts`, `canvas/dance-geometry.ts`, `canvas/dance-shaders.ts`, `canvas/dance-duo.tsx`, `engine/dance-state.ts`, `buildDance`):

- 250 vh sticky stage after Gallery. The couple is **one particle cloud built like the heart** (him lavender, her gold): 14,000 particles on high, 7,000 on mid. Mirrored on screen so she stands on the left, as in the reference stills (`private/dance-keyframes/`).
- **9 key poses after the reference stills** (blueprint 079): standing → hands join → close hold → hands rise → **twirl** under his arm → turn completes → close hold → he lifts the joined hands into the lunge → **dip** (hands released, his free arm out, her back arched away from him, her foot on the floor).
- **Live skeleton:** every frame the CPU blends two key poses (`interpolateSpec`) and builds 26 shapes with 2-bone IK (`solveLimb`, a fixed elbow side per arm so elbows never flip). The shapes are packed into a `vec4[78]` uniform and the vertex shader places each particle at its fixed (shape, u, v). No baked frames: limbs stay continuous and nothing heavy is built on mount. Hair and skirt sway in the shader.
- Scroll is damped (rate 8) in `DanceDuo`; `poseAt` holds each pose for 25 % of its step, eases once (smoothstep), and holds the dip over the last 12 %.
- The duo fades in over 0.6 s between `top 60%` and `bottom 40%`. The heart rests above at (0, 0.55) s0.18 and fires `DANCE_BEATS`: `pulse` at the close hold, `shine` at the twirl, `pulse` + 6 tap hearts at the dip (each re-arms 0.1 below itself).
- Copy: `danceTitle`, `danceLine`.
- Low / static / calm: the dip still `public/dance-reel/posters/dip.webp` (from `scripts/prepare-dance-reel.mjs`).
- Tests: `dance-state.test.ts` (`poseAt`, beats, damping), `dance-geometry.test.ts` (no elbow flip, continuous motion through the dance, floor, joined hands, packing round-trip, particle weights).

**Unverified:** ≥ 40 fps on mid tier.

---

## 12. Section 7 — Wish

**Intent:** a surprise: she makes a wish and the screen celebrates.

**As built** (`sections/wish.tsx`, `hooks/use-hold.ts`, `canvas/wish-star.tsx`, `canvas/confetti.tsx`, `engine/confetti-state.ts`):

- 200 vh stage. Heading `{wishPrompt}, {name}.`; the star in the centre with an SVG progress ring (r 46); hint "Press and hold" and an "Or tap once" link.
- **Hold 2.4 s** on a real `<button>` (96 px, `touch-none`). While holding the star grows ×1 → ×1.6 and its halo rises 0.2 → 1.0; the heart rises from y −0.45 s0.35 to y −0.05 s0.5.
- Release early: everything eases back over 0.6 s (`power2.out`).
- Complete → `wishMerge`: flash at 0–0.3 s, confetti + burst at 0.3 s, reform; at 2 s the `wishDone` message fades in (`aria-live="polite"`) with "Make another wish". `navigator.vibrate(10)` in a try/catch. `session.wishDone` guards against stacking.
- `useHold`: pointer capture, `onLostPointerCapture`, Space/Enter without repeat, context menu blocked, `completeOnClick` option.
- Local-only textarea "Write your wish (stays on this device, never sent)": no name, no form, uncontrolled.
- Quiet mode: a single click completes; hint becomes "Tap the star"; no confetti.

---

## 13. Section 8 — Love Letter

**Intent:** intimacy. The heart becomes the seal on a letter written for her.

**As built** (`sections/letter.tsx`, `sections/letter-ornaments.tsx`, `buildLetter`):

- **Look:** aged parchment with paper grain, gold double stripes, corner curls, a ribbon band, small gold heart dividers and a drop cap; Cinzel heading, Cormorant body (1.15–1.25 rem), optional `salutation`, italic sign-off.
- **Backdrop:** canvas-grain wash with three depth layers of tiny gold hearts (26 / 18 / 10) drifting at different speeds (scrubbed parallax), behind all letter UI.
- **Seal:** `dockToSeal` docks the 3D heart onto the seal (measured with `getBoundingClientRect` every tick, gold via `sealRim`). The rods have a radial mask hole so the heart shows through as the seal.
- **Open by hold** (1.2 s on the 96 px seal, `useHold`) **or by scrolling**: without a passphrase the letter opens when the seal's centre passes above the viewport centre (end of the 200 vh pin), with a forward-leave fallback; a fast fling scrolls back to the pin end. The hint "Hold the seal, or keep scrolling." hides the moment opening starts.
- **Opening:** `sealBreak` (flash + small hearts) → two scroll rods part and the parchment clip unrolls (1.6 s `power2.inOut`) → paragraphs fade in (0.6 s, stagger 0.35 s, y 12 px). GSAP only on these elements.
- Long text scrolls inside the card (`data-lenis-prevent`).
- **Passphrase** (optional, labelled "Our word"): a soft lock, trimmed and case-insensitive; wrong entry shows "Not quite, try again"; no shake, no lockout. With a passphrase the seal is a non-interactive 80 px element.
- Calm / reduced motion: letter shown open, no unroll.

**Removed:** envelope, flap `rotateX`, letter card rising out.

---

## 14. Section 9 — Finale

**As built** (`sections/finale.tsx`, `buildFinale`, `replay` in `love-experience.tsx`):

- Heading "Happy birthday, {name}." and `finaleMessage`, on a gold and lavender aurora halo.
- Heart at (0, 0.05) s1.3 (mobile (0, 0.15) s1.0), beating with the music or the synthetic beat.
- `finaleBurst` once per pass at `top 60%` (`session.finalePlayed`).
- Buttons: primary "Replay our story", secondary "Music on/off" (shares `useMusicToggle`, `aria-pressed`); stacked full-width on mobile (`size="lg"`). A "Music: {credit}" line appears once `credit` is filled.
- **Replay:** `resetSession` + `director.settle()` + `ScrollTrigger.refresh()` + `lenis.scrollTo(0, { duration: 2.6 })` (immediate in quiet mode); the wish resets, the letter stays open, the hero weave replays.
- Quiet: static SVG heart, no burst.

---

## 15. Build plan and status

| M / Phase             | Goal                                                                                                                      | Status                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| M0                    | Approvals and prep                                                                                                        | Done (versions, ADRs, image script)                                               |
| M1 (Phase 1)          | Route scaffold, tokens, static skeleton                                                                                   | Done                                                                              |
| M2–M3 (Phase 2)       | Scroll engine, theme, canvas smoke test, tiers                                                                            | Done                                                                              |
| M4–M6 (Phase 3)       | Heart, director, events, heart path, Bloom                                                                                | Done                                                                              |
| M7–M8 (Phase 4)       | Memories, Timeline, arrow                                                                                                 | Done (browser check open)                                                         |
| M9–M13 (Phase 5)      | Starlight (was Dawn), Gallery, Audio, Wish, Letter, Finale                                                                | Done (all-night amendment applied)                                                |
| M14 (Phase 6)         | Fallbacks and accessibility                                                                                               | Built (calm/static path); full keyboard and SR pass pending                       |
| M15 (Phase 6)         | Performance and QA                                                                                                        | **Pending** (no Lighthouse or real-device results)                                |
| M16 (Phase 6)         | Content and launch                                                                                                        | **Pending** (§0.5)                                                                |
| M17–M21 (Phase 7)     | Gate, hero glow, spiral timeline, parchment letter, ambient hearts, Dance                                                 | Done (exit checklist unticked)                                                    |
| M22–M40 (Phases 8–11) | Romance Additions: look, Bloom line, buttons, Wish, Letter; spell, voice, Our sky, Reasons, candle; Afterglow; Dance reel | **Planned** ([Love-Site-Romance-Additions.md](Love-Site-Romance-Additions.md) §0) |

Phase guides: [phases/](phases/README.md).

---

## 16. QA and acceptance

### 16.1 Cross-cutting tests (all still to be run in a browser)

| Test                  | Pass condition                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Fast scroll stress    | Top → bottom → top ten times: heart always ends fully formed, no stuck particles, no console errors |
| Resize / rotate       | Heart stays placed; no sticky jumps; no canvas flicker on address-bar changes                       |
| Tab hidden / returned | Audio pauses and resumes; no catch-up burst                                                         |
| Dialog + scroll       | Page never scrolls behind a dialog; inner areas scroll                                              |
| Calm / reduced motion | Every section readable and operable                                                                 |
| No audio file         | Synthetic beat works                                                                                |
| No WebGL              | Static fallback renders all content                                                                 |
| Keyboard only         | Orbs, nodes, lightbox, wish, seal, replay reachable with a visible focus ring                       |
| Screen reader         | One clean hero sentence; logical headings; dialogs and wish completion announced                    |
| Contrast              | ≥ 4.5:1 everywhere, including the parchment                                                         |
| Touch targets         | ≥ 44 px (≥ 88 px for hold targets; built at 96 px)                                                  |
| Flashing              | Nothing flashes more than three times per second                                                    |

### 16.2 Device matrix

Desktop Chrome, Safari, Firefox; iPhone Safari; a mid-range Android in Chrome; DevTools 4× CPU slowdown and Slow 4G. Focus on the first load, the weave, the arrow strike, Memories, the Dance and the wish.

### 16.3 Automated tests (built)

15 Vitest files: `canvas/` (`dance-geometry`, `heart-geometry`, `token-colors`), `config/config`, `engine/` (`audio-bands`, `dance-state`, `heart-director-core`, `heart-path`, `memory-layout`, `motion-prefs`, `session`, `svg-ndc`, `tiers`, `timeline-progress`), `hooks/use-hold`. No component, end-to-end or Lighthouse tests.

### 16.4 Release checklist

See §0.5. Also: `noindex` verified, no names in link previews, no analytics or third-party scripts, copy proofread, `/impeccable audit` and Emil reviews, ADRs and `PROGRESS.md` updated.

---

## 17. Content checklist (from the owner)

| Item                                                               | Current state                  |
| ------------------------------------------------------------------ | ------------------------------ |
| Names and birthday                                                 | In config                      |
| 8 memory photos with title, date, caption                          | Prototype images; text drafted |
| 5 timeline milestones (one featured)                               | Prototype images; text drafted |
| 9–12 gallery photos                                                | 12 prototype images            |
| The letter (salutation, paragraphs, sign-off, optional passphrase) | Draft text in config           |
| Wish, Starlight, Dance and finale lines                            | In config                      |
| Music (rights-cleared) and credit                                  | **Licence and credit pending** |
| Language, delivery                                                 | English; private link          |

---

## 18. Dev tooling: debug panel (`dev/heart-debug-panel.tsx`)

Loaded only when `NODE_ENV !== 'production'` and `?debug` is in the URL (dynamic import). Provides: buttons for every event in `HEART_EVENTS`, `settle` and "reset session"; live `heart` values every 250 ms and the current baseline; a `form` slider; tier switcher; calm toggle showing the reason; section jump (also `?s=<id>`, including `starlight` and `dance`); drei `Stats`; render stats (draw calls, triangles, textures, geometries) from `engine/render-stats.ts`.

---

## 19. Phase 7 refinements

Folded into the sections above (Gate §5, Hero §6, Timeline §9, Letter §13, ambient hearts §3.6, Dance §11b). Build guide: [phases/Phase-7-Refinements-Letter-and-Dance.md](phases/Phase-7-Refinements-Letter-and-Dance.md). Where that guide's older numbers differ (8 or 10 dance poses, letter auto-open at 55 %, 300 vh letter), this document and blueprint 043 win.
