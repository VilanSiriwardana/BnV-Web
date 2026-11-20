# Phase 9 — Interactive Heart Moments

| Field         | Value                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Version       | 1.0                                                                                                                                     |
| Status        | Proposed (2026-11-20)                                                                                                                   |
| Milestones    | M28 (blow-detector spike), M29 (F1 Finale spell), M30 (F2 voice note), M31 (F3 Our sky), M32 (F4 Reasons ring), M33 (F5 candle wish)    |
| Prerequisites | Phase 8 exit checklist complete (config fields, `persist.ts`, `chime.ts`, audio-context getter, Wish medallion slot, Finale heart pose) |
| Previous      | [Phase 8](Phase-8-Look-Polish-and-Foundations.md) · Next: [Phase 10](Phase-10-Afterglow-Room-and-QA.md)                                 |
| Spec          | [Love-Site-Romance-Additions.md](../Love-Site-Romance-Additions.md) §2, §3, §4 (F1–F5), §6                                              |
| Guidebooks    | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)                                 |

Paths below are relative to `src/features/love/` unless they start with `app/`, `src/` or `docs/`.

---

## 1. Context

This phase turns the main path from watching into touching. Her name and "I love you" are written by the heart; your voice is in the letter; she connects the stars into a heart; she spins a ring of twelve reasons; she blows out a candle. All of it reuses the existing heart, director, audio engine and story builders. The one feature that depends on device behaviour (blow detection) is tested on real phones **first**.

---

## 2. What you will see at the end

- **Our sky (Starlight):** eight memory stars on a heart outline; drag (or tap) from star to star; the 3D heart rises into the finished constellation.
- **Reasons (new section after Dance):** a ring of twelve cards that turns with scroll and with a swipe, settling on a card; soft chime per card.
- **Wish:** a candle in the medallion; "Use my microphone to blow"; the flame bends with her breath and goes out; a star rises into the heart. Hold and tap always work.
- **Letter:** "Hear it in my voice" under the sign-off; the music ducks and the seal-heart pulses with your voice; a transcript.
- **Finale:** the heart dissolves into her name, then "I love you", then returns.

---

## 3. Read first

| What                                  | Where                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Journey map and heart path additions  | Spec §2, §2.1                                                                                                                         |
| New heart state and events (verified) | Spec §3.2; `engine/heart-state.ts`, `engine/heart-director-core.ts:3`, `engine/heart-director.ts:75` (`build`), `:213` (`toBaseline`) |
| Audio (verified)                      | Spec §3.4; `engine/audio-engine.ts`, `engine/audio-bands.ts`, `ui/music-toggle.tsx`                                                   |
| Privacy and accessibility             | Spec §3.6, §3.7                                                                                                                       |
| Tier additions                        | Spec §3.8; `engine/tiers.ts`                                                                                                          |
| Feature specs                         | Spec F1–F5                                                                                                                            |
| QA                                    | Spec §6                                                                                                                               |
| Story builders and baselines          | `engine/story.ts` (`baselineOn` line 37, `sections` array line 611, `buildStarlight`, `buildWish`, `buildFinale`)                     |
| Heart geometry and shaders            | `canvas/heart-geometry.ts` (`heartPoint`, `mulberry32`, `buildHeartAttributes`), `canvas/heart-shaders.ts`, `canvas/heart.tsx`        |
| Existing patterns to mirror           | `hooks/use-hold.ts`, `ui/memory-dialog.tsx`, `engine/timeline-progress.ts` (pure helper + test), `canvas/wish-star.tsx`               |

---

## 4. Tech and tools used in this phase

| Tool                                  | Role                                                                                                                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R3F + custom `ShaderMaterial`         | Spell attributes, candle flame, cake particles                                                                                                                              |
| GSAP + ScrollTrigger + `@gsap/react`  | Stage scrubs, director events, ring scroll coupling                                                                                                                         |
| SVG + Pointer Events                  | Our sky constellation (pointer capture, stroke-dash lines)                                                                                                                  |
| CSS 3D transforms                     | Reasons ring                                                                                                                                                                |
| Web Audio, `getUserMedia`             | Voice channel, ducking, blow detection, chimes                                                                                                                              |
| Offscreen 2D canvas, `document.fonts` | Text sampling for the spell                                                                                                                                                 |
| Vitest 3                              | `blow-detector`, `text-points`, `audio-duck`, `sky-layout`, `ring-physics`                                                                                                  |
| Skills                                | `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`, `/impeccable` `critique` → `polish`, Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native` |

### 4.1 Rules for this phase (smooth, fast, mobile)

- **One clock:** ring angle, flame bend, spell blend and voice beat are written from `gsap.ticker`/`useFrame` into uniforms or CSS variables. No `setState` per frame.
- **Cheap properties:** transforms, opacity, uniforms, `stroke-dashoffset`. No `backdrop-filter` on cards. `will-change: transform` only while the ring moves.
- **Gestures:** the ring uses `touch-action: pan-y` and captures horizontal drags only after 8 px; the sky uses `touch-action: none` **only** inside its active area; all hit areas ≥ 44 px, hold targets ≥ 88 px.
- **Mount near use:** the candle and cake mount only when the Wish section is near (Improvement Report P3 pattern). Keep new ScrollTriggers few.
- **Director:** each new event (`finaleSpell`, `skyHeartIn`, `candleOut`, `reasonFront`) is in `HEART_EVENTS`, has a `build()` case and a reduced-motion case; `toBaseline()` resets every new heart field.
- **Tiers and fallbacks:** spec §3.8 per feature; `static` and Calm always complete the experience.
- **Privacy:** the microphone is analysed in memory only, never recorded or sent; tracks stop on every exit path.

---

## 5. Step-by-step

### Part A — Blow-detector spike (M28)

**Step 1 — `engine/blow-detector.ts` (+ test).** Pure `updateBlow(state, rms, lowRatio, flatness, dtMs)` per spec F5. Tests: silence (never blows), white noise at breath level (blows), a pure tone and a harmonic stack at speech level (never blow), decay when the input stops.

**Step 2 — Debug readout.** In `dev/heart-debug-panel.tsx`, a "Mic test" button that requests audio with `echoCancellation`, `noiseSuppression` and `autoGainControl` off, connects to an `AnalyserNode` **not** connected to the destination, calibrates the baseline for about 400 ms and shows `rms`, `lowRatio`, `flatness`, `blow` live. Stop the tracks on toggle-off and unmount.

**Step 3 — Device tuning.** Run it on a real iPhone (Safari) and a mid-range Android (Chrome): breath close and at arm's length vs talking, music from speakers and room noise. Record thresholds in the spec F5 and accept **ADR-0033**.
_You should see:_ a breath fills `blow` to 1; speech does not.

### Part B — F1 Finale spell (M29)

**Step 4 — `canvas/text-points.ts` (+ test).** `textToPoints(pixels, width, height, count, worldWidth, seed)` using `mulberry32` from `canvas/heart-geometry.ts`; alpha > 128 on a 2 px grid, seeded pick, centred, small z jitter, reuse samples with an offset when short. Test with a fake pixel buffer (deterministic output, correct bounds).

**Step 5 — Geometry and shader.** Add `aTextA`/`aTextB` (vec3) to the heart geometry, sized once at `TIERS.high.particles`. Fill them after `document.fonts.load` + `document.fonts.ready` in a `requestIdleCallback` (draw in Cinzel on an offscreen canvas, fit to about 2.6 world units, shrink long names, Sinhala fallback stack). Add `uSpell`, `uSpellB`; vertex position = `mix(formed, mix(aTextA, aTextB, uSpellB), smoothstep(staggered uSpell))` **before** the burst blend. Low tier: bolder glyph weight.

**Step 6 — State and event.** Add `heart.spell` and `heart.spellB` (`engine/heart-state.ts`). Add `finaleSpell` to `HEART_EVENTS` and a `build()` case with the spec F1 timing (about 11 s; confetti at 50 % via the existing `launchConfetti` in `engine/confetti-state.ts`); reduced-motion case = `flash()`. `toBaseline()` sets `spell = spellB = 0`. In `buildFinale` (`engine/story.ts`) play `finaleSpell` instead of `finaleBurst`, still guarded by `session.finalePlayed`. Keep `finaleBurst` in the list for the debug panel until the release QA, then remove it.

**Step 7 — DOM rule and fallback** (`sections/finale.tsx`). Heading and message fade to 25 % while spelling, then return. `static`/Calm: a DOM crossfade "{name}" → "I love you" in gold-text with a small heart. One `sr-only` line announces the spell once.
_You should see:_ the words are legible at 375 and 1440 px on high, mid and low; fast scroll-away and back never leaves a half-written word.

### Part C — F2 Voice note (M30)

**Step 8 — Voice channel** (`engine/audio-engine.ts`). A second `HTMLAudioElement` → source → gain → analyser → destination on the same context; `preload="none"` until the letter opens, then `metadata`. While voice plays, `heart.beat` reads the voice analyser (same bass logic, clamped).

**Step 9 — `engine/audio-duck.ts` (+ test).** Pure target-gain helper: duck to about 0.18 over 400 ms when voice starts; recover over 800 ms on pause, end or section leave. Apply with `linearRampToValueAtTime` (no clicks). Muted music never blocks voice.

**Step 10 — `sections/letter-voice.tsx`.** After the text reveals: "Hear it in my voice" (`love-ghost` with a thin gold progress ring), "Read what I say" disclosure with the transcript. Pause and fade on leaving the Letter (a ScrollTrigger `onLeave`/`onLeaveBack`) or tab hidden; remember position; "Hear it again" at the end; hide silently if the file errors. Available in Calm mode.

### Part D — F3 Our sky (M31)

**Step 11 — `engine/sky-layout.ts` (+ test).** `skyStarLayout(n)` from `heartPoint` (`canvas/heart-geometry.ts:4`): evenly spaced parameters starting near the top-centre dip, mapped to a 0–100 box with margin, in connect order.

**Step 12 — `ui/sky-constellation.tsx`.** SVG overlay (viewBox 0 0 100 100); stars are `<button>`s with ≥ 44 px hit areas and `aria-label="Star 3 of 8: {title}. Connect."`; only the next star twinkles; a gold line follows the pointer (pointer capture) and locks in with a 0.4 s stroke draw on release over the right star; a wrong release fades the line. Chime and `pulse` per link; `aria-live` announcements. `touch-action: none` on the active area only. Labels outside the shape on desktop; on mobile, the latest label in a caption under the stage. "Connect for me" button.

**Step 13 — Stage and story** (`sections/starlight.tsx`, `engine/story.ts`, `engine/heart-path.ts`). Stage `100vh` → `220vh`; keep the aurora, the 40 seeded stars and `starlightLine` (first 35 %). Heart waits at (0, −0.75) s0.20 (mobile (0, −0.80) s0.18) while she plays. Add `skyHeartIn` (1.2 s `power3.inOut`) + `glowUp` + `shine` on completion, once per pass; auto-complete the remaining links on forward leave. Save completion with `persist`.
**Calm/static:** the completed constellation with the memory list beneath; still tappable, opacity-only.

### Part E — F4 Reasons ring (M32)

**Step 14 — New section wiring.** Add `'reasons'` to `SECTION_IDS` after `'dance'`, a `HEART_PATH.reasons` entry ((0, 0.50) s0.20; mobile (0, 0.58) s0.18; gold 0.45; glow 0.5), a `buildReasons` in `engine/story.ts` that starts with `baselineOn(el, 'reasons')`, and a `--depth` step 0.5 → 0.8 in `engine/theme-timeline.ts` (shift Wish to 0.8 → 1). Render `<Reasons/>` after `<Dance/>` in `love-experience.tsx`. Stage `250vh` (CSS already scales stages × 0.85 on mobile).

**Step 15 — `engine/ring-physics.ts` (+ test).** `stepRing(state, dtSec, step, dragging)` and `frontIndex(angle, step, n)` per spec F4: momentum decays, then a spring snaps to the nearest card. Tests: always settles on a multiple of `step`; `frontIndex` wraps correctly for negative angles.

**Step 16 — `ui/reasons-ring.tsx`.** Twelve cards with `rotateY(i·30°) translateZ(R)`; the ring angle is written to a CSS variable from `gsap.ticker` (scroll target + drag + physics). Back cards: opacity and scale only. Card: solid token surface, gold border at 30 %, number in Inter, text in Cormorant 20 px. Keyboard: `role="group"`, `aria-roledescription="carousel"`, Left/Right, 44 px Previous/Next, `aria-live` front card. A chime and a throttled `reasonFront` (≥ 0.8 s) per new front card; tapping the front card calls `spawnTapHearts(3)` from `canvas/mini-hearts.tsx`. `--love-beat` updated at most about 30 times per second only while in view.
**Calm/static:** a plain list (two columns, one on mobile).
_You should see:_ on a phone, a horizontal swipe spins the ring and a vertical swipe scrolls the page.

### Part F — F5 Candle wish (M33)

**Step 17 — Candle visuals.** `canvas/wish-candle.tsx` + `canvas/candle-shaders.ts`: a flame quad with noise flicker and a `uBlow` uniform that bends and shrinks it; cake particles by tier (1,500 / 800 / 0 + flat sprite / DOM-SVG). Mount only near the Wish section. Heart rests at `WISH_REST` and rises only to about y −0.15 while blowing.

**Step 18 — `hooks/use-blow.ts`.** Wraps the M28 detector. Requests the microphone only after the "Use my microphone to blow" tap; shows "Listening…" while live; calls `track.stop()` on success, section leave, tab hidden, unmount, error and Calm switching on.

**Step 19 — Wish wiring** (`sections/wish.tsx`). The candle goes into the Phase 8 medallion slot when `wish.mode !== 'star'` and the mic is available; otherwise the star. New `candleOut` event (flame out, smoke, star rises) hands off to the existing `wishMerge`; the mic stops **before** the star rises. "Hold the candle" (existing `useHold`, 2400 ms) and "Or tap once" always work. Copy from `copy.blowHint`.
**Calm/static:** flat candle SVG, one click, no mic request, no confetti.

---

## 6. Testing record template (copy into the session log)

```text
Phase 9 — <milestone> — <date>
Build: lint ☐ typecheck ☐ test ☐ build ☐
Viewports: 1440×900 ☐ 375×812 ☐   Tiers: high ☐ mid ☐ low ☐ static ☐   Calm ☐
Perf (4× CPU, mid): ring fps ___  spell fps ___
Fast scroll ×10: burst = spell = spellB = 0 at rest ☐  no stuck ring/sky/candle ☐
Mic: prompt only after tap ☐ indicator ☐ stops on success/leave/tab/calm ☐ speech ignored ☐ breath works ☐
Voice: ducking smooth ☐ restores on pause/end/leave/tab ☐ missing file hidden ☐
Touch: ring swipe vs scroll ☐ sky drawing never scrolls ☐
Real devices: iPhone ☐ Android ☐
```

---

## 7. Exit checklist

- [ ] ADR-0033 accepted with device-tuned thresholds recorded
- [ ] `blow-detector`, `text-points`, `audio-duck`, `sky-layout`, `ring-physics` tests pass
- [ ] F1: legible on all tiers at 375 and 1440 px; heart ends exactly formed after any interruption
- [ ] F2: ducking smooth, transcript reachable by keyboard, missing file handled
- [ ] F3: all stars reachable by touch, mouse and keyboard; completion once per pass; auto-complete works
- [ ] F4: smooth on a mid-range phone; vertical scroll works over the ring on touch; always settles on a card
- [ ] F5: mic stopped on all exits; real breath works and speech does not on an iPhone and an Android; fallbacks work
- [ ] Spec §6 rows for these features pass; mid tier ≥ 40 fps at 4× CPU
- [ ] lint, typecheck, `vitest`, build pass

---

## 8. Risks and fallbacks

| Risk                                           | Fallback                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Blow detection unreliable on a device          | Hide the mic option on that platform; hold and tap remain; keep the debug readout for tuning |
| Spell text unreadable                          | Bolder glyphs, fewer particles, larger world width; DOM crossfade on low tier                |
| Text sampling stalls the main thread           | Sample in idle time, once, after fonts are ready; cache the arrays                           |
| Ring jank on phones                            | Fewer visible back cards, no shadows on low, CSS variable updates only while moving          |
| Sky drawing scrolls the page                   | Narrow the `touch-action: none` area; require the pointer to start on a star                 |
| Section order shift breaks depth or heart path | Update `SECTION_IDS`, `HEART_PATH` and theme `STEPS` together; run `heart-path.test.ts`      |

---

## 9. Docs and governance updates

- Experience Guidebook: Starlight (Our sky), new Reasons section, Wish (candle), Letter (voice), Finale (spell); tier table.
- Spec: record the blow thresholds and any timing changes.
- ADR-0033 accepted; Brand note for motion longer than 400 ms (spell, candle).
- `progress.md` and `docs/AI_SESSION_LOG.md` each session.

---

## 10. Commit plan

1. `feat(love): blow detector with debug readout`
2. `feat(love): text sampling and finale spell`
3. `feat(love): voice note with music ducking`
4. `feat(love): our sky constellation`
5. `feat(love): reasons section and ring`
6. `feat(love): candle wish with mic and fallbacks`

---

## 11. Handoff to Phase 10

Phase 10 builds Afterglow after the Finale and uses the Finale link slot (Phase 8), `persist.ts`, `chime.ts` and the director patterns from this phase. Confirm the main path from Gate to Finale passes the fast-scroll stress test, then open [Phase 10](Phase-10-Afterglow-Room-and-QA.md).
