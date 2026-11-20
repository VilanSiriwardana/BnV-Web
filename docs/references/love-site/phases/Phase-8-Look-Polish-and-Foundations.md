# Phase 8 — Look, Polish and Foundations

| Field         | Value                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Version       | 1.0                                                                                                                                |
| Status        | Proposed (2026-11-20)                                                                                                              |
| Milestones    | M22 (foundations), M23 (U1 look), M24 (U2 Bloom line), M25 (U6 buttons and Finale), M26 (U4 Wish medallion), M27 (U5 Letter frame) |
| Prerequisites | Phase 7 built (Experience Guidebook v2.0 as-built); lint, typecheck, test and build green                                          |
| Previous      | [Phase 7](Phase-7-Refinements-Letter-and-Dance.md) · Next: [Phase 9](Phase-9-Interactive-Heart-Moments.md)                         |
| Spec          | [Love-Site-Romance-Additions.md](../Love-Site-Romance-Additions.md) §0, §3, §9.0–§9.2, §9.4–§9.6                                   |
| Guidebooks    | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)                            |

Paths below are relative to `src/features/love/` unless they start with `app/`, `src/`, `docs/` or `next.config`.

---

## 1. Context

The site is built end to end, but the screenshots (spec §9.0) show glare, banding, blown-out white hearts, a small Bloom caption, default-looking buttons, a Letter frame that stops early, and a Wish target that is hard to hold. This phase fixes the look of what exists **and** lays the shared foundations (config, device-only persistence, chimes, ADRs) that Phases 9–11 need. It adds no new section.

**Parallel track:** the owner starts producing the dance clip now ([Dance-Clip-Production-Guide.md](../Dance-Clip-Production-Guide.md) §16). It has the longest lead time and is built in [Phase 11](Phase-11-Dance-Reel.md).

---

## 2. What you will see at the end

- A darker, candle-lit page: no grey or pink wash, no banding at 100 % zoom, no pure-white or pale-yellow hearts; the small Dance and Letter hearts stay lavender and gold instead of clipping to white.
- Bloom: "Every moment / with you / opens like this." flies out of the burst into the left third (lower third on mobile); "opens" opens; a gold underline draws.
- Finale: the heart high, the heading under it, one premium "Replay our story" button and quiet links; no big "Music off" button.
- Wish: a framed medallion; the whole medallion is the hold target; one clear instruction.
- Letter: the gold frame and curls run the full length of the letter; no backdrop seam; a gold scrollbar.
- Nothing new is visible from M22, but the config accepts the new fields and tests cover them.

---

## 3. Read first

| What                                   | Where                                                                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Delivery map, verified code facts      | Spec §0, §2.1, §3.2, §3.4                                                                                                                          |
| Config additions, persistence, chimes  | Spec §3.1, §3.3, §3.4, §3.6                                                                                                                        |
| Screenshot audit and look values       | Spec §9.0, §9.1                                                                                                                                    |
| Bloom line                             | Spec §9.2                                                                                                                                          |
| Wish, Letter, Finale and button system | Spec §9.4, §9.5, §9.6                                                                                                                              |
| Heart path, director, story builders   | `engine/heart-path.ts`, `engine/heart-director.ts`, `engine/heart-director-core.ts`, `engine/story.ts`                                             |
| Heart rendering                        | `canvas/heart-shaders.ts`, `canvas/heart.tsx`, `canvas/heart-geometry.ts`, `canvas/love-canvas.tsx`, `canvas/mini-hearts.tsx`, `canvas/petals.tsx` |
| Tokens and love CSS                    | `app/globals.css` (`[data-love-root]` block, `.love-gate`, `.love-grain`, `.love-parchment`)                                                       |
| SplitText pattern already in use       | `engine/hero-intro.ts:87`                                                                                                                          |
| Hold gesture                           | `hooks/use-hold.ts` (`useHold`)                                                                                                                    |
| Buttons                                | `src/components/ui/button.tsx` (`cva` variants)                                                                                                    |
| Next.js config docs                    | `node_modules/next/dist/docs/` (repo rule before touching `next.config.ts`)                                                                        |
| ADR format                             | `docs/decisions/DECISIONS.md` (next free number: ADR-0031)                                                                                         |

---

## 4. Tech and tools used in this phase

| Tool                                      | Role                                                                                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GSAP 3.15 + SplitText + `@gsap/react`     | Bloom word timeline, letter hint, button-free motion                                                                                                                                |
| `@react-three/postprocessing` 3.2.2       | Bloom values; `ToneMapping` and `Vignette` (`UNCERTAIN`: verify export names and props in `node_modules/@react-three/postprocessing` before use)                                    |
| GLSL in `canvas/heart-shaders.ts`         | Output clamp, scale-aware alpha, point-size clamp                                                                                                                                   |
| Tailwind v4 + tokens in `app/globals.css` | Aurora, grain, scrims, parchment, button variants                                                                                                                                   |
| `localStorage` (native)                   | `engine/persist.ts`                                                                                                                                                                 |
| Web Audio (native)                        | `engine/chime.ts`                                                                                                                                                                   |
| Vitest 3 (`npm test`)                     | `persist`, `chime` note picking, config rules                                                                                                                                       |
| Skills                                    | `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins` (SplitText), `/impeccable` `critique` → `polish`, Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native` |

### 4.1 Rules for this phase (smooth, fast, mobile)

- **One clock:** per-frame work runs in `gsap.ticker` or `useFrame` and writes refs, uniforms or CSS variables. No `setState` per frame; no allocations in hot loops.
- **Cheap properties:** animate transform, opacity, uniforms and `stroke-dashoffset` only. No `backdrop-filter`. `filter: blur` only briefly on a few elements, cleared after. `will-change` only while moving.
- **GSAP hygiene:** `useGSAP` with a scope; `gsap.matchMedia` for mobile and reduced motion; `ScrollTrigger.refresh()` after layout changes.
- **Director rules:** every heart event goes through the director (queue cap 2, `settle()` on scroll-back, a reduced-motion case, listed in `HEART_EVENTS`).
- **Mobile:** sizes in `svh`/`lvh`; touch targets ≥ 44 px; hold targets ≥ 88 px; `touch-action` scoped tightly; test at 375 px and on a real phone.
- **Tiers and fallbacks:** respect `TIERS`; every change works on the `static` tier and in Calm mode (`useQuiet()`).
- **Brand:** tokens only (no hex in components); no new dependency; no analytics.

---

## 5. Step-by-step

### Part A — Foundations (M22)

**Step 1 — ADRs.** Append to `docs/decisions/DECISIONS.md` in the existing `## ADR-00NN - Title` format:

| ADR      | Title                                              | Status at end of phase               |
| -------- | -------------------------------------------------- | ------------------------------------ |
| ADR-0031 | Love Site section order: Reasons and Afterglow     | Accepted                             |
| ADR-0032 | Love Site device-only persistence (`localStorage`) | Accepted                             |
| ADR-0033 | Love Site microphone use and privacy promises      | Proposed (accepted in Phase 9, M28)  |
| ADR-0034 | Love Site dance as a pre-rendered frame sequence   | Proposed (accepted in Phase 11, M40) |

**Step 2 — Config types.** In `config/types.ts` add the optional fields from spec §3.1: copy keys (`reasonsTitle`, `reasonsHint`, `skyHint`, `skyDone`, `blowHint`, `afterglowTitle`, `afterglowIntro`, `bloomLines?`, `bloomEmphasis?`), `reasons?`, `wish?`, `letter.voice?`, `finale?`, `afterglow?`, `hidden?`. Make the new copy keys optional too, so the existing site file still type-checks. Add sample values to `config/sites/p4cw7rctk4bacw4gvsz4qer46afg.ts` only where the owner has provided content; leave the rest absent.
_You should see:_ `npm run typecheck` passes; the page looks unchanged.

**Step 3 — Config rules.** Extend `config/config.test.ts`: if present, `reasons.length === 12`; `afterglow.gifts.items.length === 3`; at most one gift has `plan` unless `mode === 'open-all'`; every `letter.voice` has a non-empty `transcript`; `openWhen.length` is 3–5.

**Step 4 — `engine/persist.ts` (+ `persist.test.ts`).** `readFlag/writeFlag` and `readSet/writeSet` style helpers over `localStorage` with the prefix `love:<slug>:`; every access in `try/catch`; return defaults when storage is missing or throws. Test with an in-memory store and a store whose methods throw. Replay (`resetSession`) never clears it.

**Step 5 — `engine/chime.ts`.** A soft bell from two `OscillatorNode`s (sine plus a quiet octave), fast attack, about 1.2 s exponential decay, peak gain about 0.12, pentatonic notes. Reuse the music `AudioContext`: add a small getter to `engine/audio-engine.ts` (the context is private today). It is silent before the gate tap and when `audio.isMuted()`. Keep the note-picking function pure and test it.

**Step 6 — Debug panel.** In `dev/heart-debug-panel.tsx` replace the local `SECTIONS` list (line 15) with `SECTION_IDS` from `engine/heart-path.ts`, so new sections appear in `?s=` automatically.

### Part B — U1 Look: darker, premium, less glare (M23)

Take **before** screenshots of Gate, Bloom, Dance, Letter and Finale at 1440 px and 375 px first. Then change values in small commits (spec §9.1 table):

**Step 7 — Background and banding** (`app/globals.css`). `--love-aurora-lav` 35 % → about 14 %, `--love-aurora-gold` 30 % → about 10 %, smaller radii. In `.love-gate` remove the warm brown-pink lower-left radial and reduce `.love-gate-halo` to about 60 % opacity. Raise `.love-grain` so it covers the large gradients (dithering) and add intermediate stops to the big radials.
_You should see:_ no visible rings in the gate background at 100 % zoom on a laptop and a phone.

**Step 8 — Depth cap.** In `engine/theme-timeline.ts` and the `--depth` mix in `app/globals.css`, cap the lightest stop at Deep Plum. Warmth comes from `heart.gold`, not a lighter background.

**Step 9 — Bloom pass** (`canvas/love-canvas.tsx`, `NightBloom`). `luminanceThreshold` 0.6 → about 0.8; intensity 0.7/0.4 → about 0.45 (high) / 0.28 (mid). Add `ToneMapping` (filmic) and `Vignette` (offset about 0.3, darkness about 0.5) inside the existing `EffectComposer` (`UNCERTAIN`: confirm names and props; confirm renderer tone mapping is not applied twice). Low tier stays without a composer.

**Step 10 — Heart output** (`canvas/heart-shaders.ts`, `canvas/heart.tsx`).

- Output clamp `vec3(0.9)` → about `0.72`; overall alpha ×0.55 → about ×0.45.
- New uniform `uScaleFade`: alpha × `mix(0.25, 1.0, smoothstep(0.2, 1.0, scale))`, written from `heart.scale` in `useFrame`.
- In `heart.tsx`, extend the existing `setDrawRange` so the drawn count is `TIERS[tier].particles × clamp(scale, 0.25, 1)` (update only when the integer changes).
- Clamp `gl_PointSize` to about `6.5 * uPR`; shrink to about 55 % at full `uBurst`; scattered alpha × 0.7.
- `SCATTER_RADIUS` 3 → about 2.2 in `canvas/heart-geometry.ts` (re-run `heart-geometry.test.ts`).
  _You should see:_ the small Dance and Letter heart is lavender and gold, not white; the Bloom fog is finer and thinner.

**Step 11 — Small hearts** (`canvas/mini-hearts.tsx`). Mini hearts: emissive from the instance colour instead of `#fff`. Ambient hearts: `emissiveIntensity` 1.6 → about 0.6, `toneMapped` on, 8 instances on high. Colours stay token-based and never above about 80 % luminance.

**Step 12 — Finale halo** (`sections/finale.tsx`). Narrower, dimmer lavender-to-gold radial that falls to the background before its edge (finished in Part D).

**Step 13 — Dev badge** (`next.config.ts`). Read `node_modules/next/dist/docs/` for the current dev-indicator option, then turn it off so it no longer covers Calm mode in screenshots.

Take **after** screenshots and compare (colour picker or luminance sample, not by eye only).

**Reduced motion:** values only; no behaviour change.

### Part C — U2 Bloom line (M24)

**Step 14 — Markup** (`sections/bloom.tsx`). Replace the single `p[data-bloom-line]` with a left-aligned column: gold rule + tiny heart, three lines (`copy.bloomLines`, or `copy.bloomLine` split into three balanced lines), line 3 in Cinzel with gold-to-lavender gradient text (tokens only), an underline SVG with a small heart, and a left-to-right scrim. Desktop: `left: 6vw`, width about `33vw` (min 18 rem, max 30 rem), centred at about 45 % height. Mobile: lower third, 85 % width.

**Step 15 — Timeline** (`engine/story.ts`, `buildBloom`). Replace the `top 70%` fade (lines 125–137) with a paused word timeline started from the burst trigger that already plays `burstReform` (`top 60%`):

- `SplitText.create(column, { type: 'words', aria: 'auto' })`, mirroring `engine/hero-intro.ts:87`.
- Each word starts at the heart's screen position (`heart.ndc` → px with the inverse of `pxToNdc` in `engine/svg-ndc.ts`) and travels on a soft arc: scale 0.6 → 1, opacity 0 → 1, rotation ±8°, blur 6 px → 0 (only these words; clear `filter` on complete). Stagger 0.14 s, `power3.out`, about 1.1 s each.
- At about 2.0 s: the emphasis word (`copy.bloomEmphasis`, default "opens") letter-spacing −0.05em → +0.02em, then one masked shimmer pass.
- At about 2.4 s: the underline draws (`stroke-dashoffset`).
- Leaving: column drifts −24 px and fades, scrubbed.
- Scrolling back above `top 80%`: revert to hidden. Cleanup calls `split.revert()`.
  _You should see:_ fast scrolling through Bloom leaves the text fully hidden or fully shown, never half-animated.

**Step 16 — Petal clearance** (`canvas/petals.tsx`). In the petal shader, dim petals with screen x below about −0.2 to about 40 % alpha (desktop only; on mobile dim the lower third). This closes the guidebook gap "petals are not dimmed behind the Bloom text".

**Reduced motion / Calm:** a 300 ms fade only; no travel, blur or shimmer.

### Part D — U6 Button system and Finale (M25)

**Step 17 — Variants** (`src/components/ui/button.tsx`). Add `love-primary`, `love-ghost` and `love-link` to the existing `cva` variant map (spec §9.6 table). Tokens only; focus ring `--ring`; pressed scale 0.98; hover glow about 6 px low-alpha gold; `love-primary` 48 px tall and full width on mobile.

**Step 18 — Finale layout** (`sections/finale.tsx`, `engine/heart-path.ts`). `HEART_PATH.finale` → desktop (0, 0.25) s1.1, mobile (0, 0.30) s0.9. Heading and message sit below the heart zone with a scrim and a gold hairline with a centred heart. "Replay our story" uses `love-primary` with a circular-arrow icon. Remove the `secondary` "Music on/off" button (the top-right `MusicToggle` remains); optionally a `love-link` "♪ Music on / off" using `useMusicToggle()`. Leave a slot for the Phase 10 `love-link` "There's a little more…". Keep the `Music: {credit}` line.
_You should see:_ no text over the heart at 375 px and 1440 px.

**Step 19 — Other buttons.** Restyle default-looking buttons on the love route (letter passphrase "Open", wish actions) with the new variants. Do not change shop pages.

### Part E — U4 Wish medallion (M26)

**Step 20 — Layout** (`sections/wish.tsx`). Kicker ("Make a wish", Inter small caps, gold-text), heading (`copy.wishPrompt` + name, Cinzel), medallion `min(70vw, 20rem)` with the gate's double gold hairline frame and plum fill, hint pill, "Or tap once" as `love-link`, completion text and "Make another wish" as `love-ghost`.

**Step 21 — Bigger target.** The whole medallion becomes the `<button>` that receives `useHold` handlers (`HOLD_MS` 2400 unchanged); the 3 px lavender-to-gold ring with tick marks keeps the imperative `strokeDashoffset` update in `onProgress`. Hint pill text: "Press and hold" → "Keep holding…" while held. Keep `session.wishDone`, `director.interrupt('wishMerge')` and `completeOnClick: quiet` exactly as they are.

**Step 22 — Wish card and slot.** The textarea moves into a collapsed parchment card (Cormorant, "Stays on this device"); on mobile it opens as a bottom sheet. Render the star area through a `children`/slot so Phase 9 can drop in the candle. Cap the star halo in `canvas/wish-star.tsx` at about 70 %.
_You should see:_ a thumb can hold anywhere on the medallion; one instruction is always visible.

**Calm:** medallion without ring motion; "Tap the star"; one click completes.

### Part F — U5 Letter frame (M27)

**Step 23 — Sheet structure** (`sections/letter.tsx`, `sections/letter-ornaments.tsx`). Inside the scrolling `article[data-letter-card][data-lenis-prevent]`, wrap the content in a `div` with `relative min-h-full` (the sheet) and move `ParchmentFrame` (frame, side stripes, four curls) **inside** it, so it spans the whole letter. Add about 2 rem top padding and bottom space for the sign-off and a closing heart.

**Step 24 — Finish.** About 24 px parchment fades at the top and bottom of the window (sticky gradient pseudo-elements); a thin gold scrollbar (`scrollbar-width: thin; scrollbar-color` plus `::-webkit-scrollbar` rules in `.love-parchment`); a small gold chevron hint that hides after the first inner scroll; `LetterBackdrop` covers `inset-0` with a gradient mask (no two-tone seam); floating hearts at about 60 % opacity.
Keep the unroll clip-path timeline, passphrase, seal and `sealBreak` unchanged.
_You should see:_ bottom curls appear only at the true end of the letter; works with 3 and with 12 paragraphs.

**Calm:** same structure, no unroll.

---

## 6. Testing record template (copy into the session log)

```text
Phase 8 — <milestone> — <date>
Build: lint ☐ typecheck ☐ test ☐ build ☐
Viewports: 1440×900 ☐ 375×812 ☐
Tiers: high ☐ mid ☐ low ☐ static ☐   Calm ☐   OS reduced motion ☐
Perf (DevTools 4× CPU, mid tier): fps ___   long tasks ___
Fast scroll ×10: heart formed at rest ☐  console clean ☐
Before/after screenshots: Gate ☐ Bloom ☐ Dance ☐ Letter ☐ Finale ☐
Real devices: iPhone ☐  Android ☐
Notes:
```

---

## 7. Exit checklist

- [ ] ADR-0031 and ADR-0032 accepted; ADR-0033 and ADR-0034 drafted
- [ ] Config types, sample site and `config.test.ts` updated; `persist.test.ts` and chime tests pass
- [ ] Debug panel uses `SECTION_IDS`
- [ ] U1: darker base, no banding at 100 % on a laptop and a phone, no blown-out hearts (spec §9.1 acceptance)
- [ ] U2: Bloom line readable over the densest petals at 375 and 1440 px; never half-animated; one clean sentence for screen readers
- [ ] U6: one button style; contrast ≥ 4.5:1; keyboard order Replay → links; Replay still resets cleanly
- [ ] U4: medallion hold works with a thumb; quiet one-click works; no overlap
- [ ] U5: frame reaches the sign-off; no backdrop seam; gold scrollbar
- [ ] lint, typecheck, `vitest`, build pass; mid tier ≥ 40 fps at 4× CPU
- [ ] Real iPhone and Android pass

---

## 8. Risks and fallbacks

| Risk                                       | Fallback                                                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Over-darkening loses the glow              | Change one value per commit; compare screenshots; keep gold and lavender highlights                 |
| `ToneMapping`/`Vignette` props differ      | Use the installed type definitions; if tone mapping fights the renderer, keep the shader clamp only |
| Bloom words jank on phones                 | Drop the blur on mobile; reduce to line-level stagger; keep transforms only                         |
| SplitText breaks screen-reader text        | `aria: 'auto'`; check with VoiceOver/Narrator; revert split on cleanup                              |
| Letter restructure breaks the unroll       | Keep `data-letter-card` and the clip-path on the same element; only the inner sheet is new          |
| Medallion hold fights page scroll on touch | Keep `touch-none` only on the medallion; test vertical scroll around it                             |

---

## 9. Docs and governance updates

- Experience Guidebook: Bloom (§7), Wish, Letter, Finale sections and §0 known gaps (petals dimming closed) to as-built; tier table if values change.
- `docs/references/Brand-Identity.md`: a short note on the `love-*` button variants.
- `docs/decisions/DECISIONS.md`: ADR-0031–0034.
- Spec: correct any value that changed during tuning.
- `progress.md` and `docs/AI_SESSION_LOG.md` each session.

---

## 10. Commit plan

1. `docs(love): ADRs 0031–0034 for romance additions`
2. `feat(love): config fields, persist and chime foundations`
3. `style(love): darker aurora, dithered gradients, gate cleanup`
4. `fix(love): heart clamp, scale-aware alpha and point-size clamp`
5. `style(love): token-coloured mini and ambient hearts; bloom, tone mapping, vignette`
6. `feat(love): bloom line emerges from the burst`
7. `feat(ui): love button variants; finale layout`
8. `feat(love): wish medallion`
9. `fix(love): letter frame spans the full letter`

---

## 11. Handoff to Phase 9

Phase 9 relies on: the config fields (reasons, wish mode, voice, finale spell), `persist.ts`, `chime.ts`, the audio-context getter, the Wish medallion slot (for the candle) and the Finale heart pose (where the name is spelled). Confirm all are merged, then open [Phase 9](Phase-9-Interactive-Heart-Moments.md). Check that the dance clip production (Phase 11, M38) is under way.
