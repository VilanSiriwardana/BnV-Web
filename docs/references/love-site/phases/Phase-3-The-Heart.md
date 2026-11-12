# Phase 3 — The Heart: Gate, Hero, Director, Audio, Bloom

| Field           | Value                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Version         | 1.0                                                                                                                   |
| Status          | Proposed                                                                                                              |
| Milestones      | M4 (heart and hero), M5 (heart director and events), M6 (heart path and Bloom), M10 (audio)                           |
| Prerequisites   | Phase 2 exit checklist complete, especially the canvas smoke test                                                     |
| Previous / next | [Phase 2](Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md) · [Phase 4](Phase-4-Night-Story-Memories-and-Timeline.md) |
| Guidebooks      | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)               |

---

## 1. Context

This is the emotional core and the hardest technical work. By the end, the site has its signature moment: two ribbons of light weave into a heart, the heart reacts to music and taps, it travels down the page, and it bursts into petals in Bloom. Every later section drives the heart through the **Heart Director** built here, so this phase must be solid before moving on. If time runs out, Phases 1–3 plus static versions of the rest is a shippable gift (overview §11).

Audio (M10) is in this phase because the gate tap unlocks it and the beat drives the heart.

---

## 2. What you will see at the end

1. **Gate:** a dark screen, a small lavender seed pulsing at ~72 bpm with a thin loading ring. "A little something for you, {name}." The "Tap to begin" button enables when loading finishes.
2. **Tap:** soft music fades in (or a gentle synthetic lub-dub if no file); the gate fades out over 600 ms.
3. **Hero intro (no scrolling needed):** a lavender ribbon spirals in from the left and a gold ribbon from the right (0–2.2 s); they weave and trace a heart (2.2–3.2 s); the heart beats once; the title "Happy Birthday, {name}" reveals letter by letter; the subhead fades up; a tiny bobbing heart invites scrolling; at 6 s a highlight sweeps across the heart.
4. **Idle:** the heart breathes slowly and pulses with the music bass; on desktop it tilts toward the mouse; clicking it makes it beat and releases a few small hearts.
5. **Scroll into Bloom:** the heart drifts to the right and shrinks; the camera dollies in; the heart bursts into small hearts and petals, then reforms smaller; petals keep drifting.
6. **Music toggle** (top-right) mutes and unmutes.
7. **`?debug`:** buttons for `pulse`, `glowUp`, `shine`, `burst`, `reform`, `burstReform`; live values; mashing them never leaves the heart broken.

---

## 3. Read first

| What                                            | Where                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| Gate                                            | Experience §5                                                                         |
| Hero timings and interactions                   | Experience §6                                                                         |
| Bloom                                           | Experience §7                                                                         |
| Heart skins (Aura now; Pearl in Phase 5)        | Experience §3.3                                                                       |
| Particle system spec, generators, shader sketch | Experience §3.4                                                                       |
| Event catalogue and durations                   | Experience §3.5                                                                       |
| Mini hearts, petals                             | Experience §3.6                                                                       |
| Audio engine and mapping                        | Experience §3.7; Tech Stack §5.9                                                      |
| Heart path (NDC)                                | Experience §4.2                                                                       |
| Story builder pattern                           | Experience §4.3                                                                       |
| Heart state, director, one clock                | Tech Stack §7.1, §7.3, §7.4                                                           |
| R3F rules and things to avoid                   | Tech Stack §5.2                                                                       |
| Reduced motion matrix                           | Tech Stack §9.1                                                                       |
| Phase 2 contracts                               | [Phase 2 §6](Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md#6-contracts-introduced) |
| Installed docs                                  | GSAP SplitText (accessibility options), drei `useProgress`, R3F `useFrame`/`useThree` |
| Repo                                            | `src/config/motion.ts` (UI durations), `src/components/ui/button.tsx`                 |

---

## 4. Tech used in this phase

| Tool                              | Role                                                   | Rules                                                     |
| --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| `THREE.Points` + `ShaderMaterial` | The heart (one draw call)                              | Buffers allocated once at 18 000; `setDrawRange` per tier |
| GLSL vertex/fragment shaders      | Ribbon → heart → scatter blending, soft sprites, shine | Uniforms only; no per-frame CPU loops over particles      |
| `InstancedMesh`                   | Mini hearts, petals                                    | One draw call each; shader-driven motion for petals       |
| GSAP timelines                    | Hero intro, director events                            | Events are paused timelines played by the director        |
| ScrollTrigger                     | Scrubbed heart path, Bloom trigger                     | "Path scrubbed, moments triggered"                        |
| SplitText (GSAP)                  | Hero headline                                          | Verify aria handling so screen readers read one sentence  |
| Web Audio API                     | Music, analyser, synthetic beat                        | Created only after the gate tap                           |
| drei `useProgress`                | Gate loading ring                                      |                                                           |
| framer-motion                     | Gate fade-out, music toggle press                      | Never on GSAP-owned elements                              |
| `THREE.MathUtils.damp`            | Smoothing heart values in `useFrame`                   | Frame-rate independent                                    |

---

## 5. Step-by-step build

### Step 1 — Heart geometry generators (M4)

- **File:** `src/features/love/canvas/heart-geometry.ts` (pure functions, no React).
- **`heartPoint(t)`** exactly as Experience §3.4.
- **`buildHeartAttributes(count, seed)`** returns `Float32Array`s for:
  - `aHeart` (vec3): 70 % on a soft band around the outline (small random offset), 30 % interior fill (`radius = sqrt(random)`), z thickness `(random − 0.5) × 0.45 × (1 − radius)`.
  - `aRibbon` (vec3): left half of particles on the left ribbon, right half on the right. For parameter `s ∈ [0,1]`: `x = side × (1 − s) × W`, `r = r0 × (1 − s)^0.6 + r1`, `θ = turns × 2π × s`, `y = r sin θ`, `z = r cos θ`. Map `s` to the position along that half of the outline so the ribbons draw the heart as they converge.
  - `aScatter` (vec3): random point in a sphere of radius ≈ 3 × heart size.
  - `aRand` (vec4): x stagger seed, y size, z colour mix, w phase.
- Use a seeded random so the shape is stable across reloads.
- **Vitest:** `heartPoint` stays within about [−1, 1]; arrays have the right length; ribbon side matches outline half.

### Step 2 — The particle heart, Aura skin (M4)

- **Files:** `canvas/heart.tsx`, `canvas/heart-shaders.ts`.
- **Geometry:** `BufferGeometry` with the four attributes, created once (`useMemo`), `setDrawRange(0, TIERS[tier].particles)`.
- **Vertex shader:** start from the Experience §3.4 sketch (staggered `uForm` weave, staggered `uBurst`, idle drift, `uBeat` scale, size attenuation with `uPR`).
- **Fragment shader:** soft round sprite (radial falloff); colour from `aRand.z` with the distribution 55 % lavender, 15 % lilac glow, 22 % gold, 8 % rose; ribbon side colours (left lavender, right gold) remaining as a soft left-to-right gradient after the weave; shine band keyed to `uShine`.
- **Material:** `transparent`, `depthWrite: false`, `blending: AdditiveBlending` (Aura).
- **Uniforms** (Experience §3.4): `uForm`, `uBurst`, `uTime`, `uPR`, `uBeat`, `uShine`, `uSkin` (0 for now), colour uniforms from `readTokenColors`.
- **`useFrame`:** damp each uniform toward the `heart` values; set position/scale from `heart.ndc`, `heart.depth`, `heart.scale` (Step 9); no allocations per frame.
- **Brand:** soft lavender glow with a gold edge; cap bloom so the heart never clips to white; **no red, no neon**.
- **You should see:** in the debug panel, sliding `form` 0 → 1 turns two ribbons into a heart.

### Step 3 — Heart Director (M5)

- **File:** `src/features/love/engine/heart-director.ts`.
- **API:** `director.play(event, opts?)`, `director.settle()`, `director.setBaseline(sectionId)`, `director.isBusy()`.
- **Rules (Tech Stack §7.4):**
  - One event at a time. Important events queue; decorative ones (`shine`) are dropped while busy and throttled.
  - Each event is a GSAP timeline created paused that tweens `heart` fields.
  - **Baseline invariant:** on finish, interrupt or `settle()`, kill the running timeline and tween the heart to the current section's baseline (`burst 0`, `form 1`, `ring 0`, `flinch 0`, glow = baseline) over ~300 ms.
  - Every event has a reduced-motion variant (glow flash or short opacity change).
- **Baselines table:** one entry per section from Experience §4.2 (baseline glow, skin).
- **Events this phase** (Experience §3.5 durations and eases): `ribbonWeave` (3.2 s, `power2.inOut`), `pulse` (lub-dub ≈ 0.7 s), `glowUp` (0.9 s up, 1.4 s settle), `shine` (1.1 s, throttled ≥ 4 s), `burst` (1.1 s, `power3.out`), `reform` (1.6 s, ends brighter then settles, ends with `pulse`), `burstReform` (burst + 0.5 s hold + reform). Stub the rest (`arrowStrike`, `skinSwap`, `wishMerge`, `dockToSeal`, `sealBreak`, `finaleBurst`).
- **Debug panel:** add a button per event and the current baseline read-out.
- **Vitest:** queue/drop/settle logic with a fake timeline (pure state machine part).

### Step 4 — Mini hearts (M5)

- **File:** `canvas/mini-hearts.tsx`.
- `InstancedMesh` of a low-poly extruded heart (`ExtrudeGeometry` from a heart `Shape`, small bevel), count per tier (40/28/18) plus a tap pool of 8.
- Per instance: direction, speed, spin, scale 0.04–0.1, colour (lavender, rose, gold, ivory, pearl).
- Position = heart centre + direction × radius × `easeOutCubic(burst)`; scale × `smoothstep(0, 0.15, burst)` so they vanish into the heart at the end of `reform`. The tap pool uses its own progress value.
- Update instance matrices in `useFrame` only while `burst > 0` or the tap pool is active.

### Step 5 — Gate (M4)

- **File:** `sections/gate.tsx`.
- **States:** `loading` → `ready` → `entering`.
  - `loading`: the canvas chunk is imported while the gate shows; progress from drei `useProgress` drawn as a thin ring; enable after load or a 6 s timeout (then force `low` tier).
  - `ready`: seed pulses (CSS keyframes ~72 bpm); button enabled; `aria-busy` false.
  - `entering` (in order): (1) start audio (Step 7); (2) framer-motion fade-out 600 ms; (3) pass the seed's screen position (`getBoundingClientRect` → NDC) as the ribbons' meeting point; (4) `useLoveScroll().start()`; (5) `director.play('ribbonWeave')`.
- Lenis stays stopped until the tap. Focus starts on the button. Button ≥ 48 px, lower third on mobile.
- **Reduced motion:** static seed, fade only.
- **You should see:** no scrolling or sound before the tap.

### Step 6 — Hero (M4)

- **Files:** `sections/hero.tsx`; `buildHero` in `engine/story.ts`.
- **Intro timeline** (paused, played after the gate), times from Experience §6:

| Time    | Action                                             |
| ------- | -------------------------------------------------- |
| 0–3.2 s | `ribbonWeave` (`form` 0 → 1)                       |
| 3.2 s   | `pulse`                                            |
| 3.4 s   | SplitText characters fade up, ~60 ms stagger, ~1 s |
| 4.2 s   | Subhead fades up, 400 ms                           |
| 5.0 s   | Scroll cue fades in (bobs 4 px)                    |
| 6.0 s   | `shine`                                            |

- **Idle:** breathing (scale ±1.5 % over 4 s, glow ±0.04) as a looping tween on separate "idle" fields added in `useFrame`, so it doesn't fight director events.
- **Scroll (200vh stage):** over the first 40 %, the heart rotates ≤ 8° and the headline lifts and fades (scrubbed). The scroll cue fades after the first scroll.
- **Pointer parallax (desktop only):** `heart.yaw` toward the pointer, ≤ 6°, smoothed.
- **Tap the heart:** R3F `onClick` on the heart → `director.play('pulse')` + 6 mini hearts from the tap pool, cooldown 1.2 s. DOM twin: a visually hidden button "Make the heart beat".
- **Reduced motion:** heart shown fully formed with a 300 ms fade; headline fades in; no parallax.
- **Mobile:** heart at (0, 0.25), scale 0.9, headline below.

### Step 7 — Audio engine and music toggle (M10)

- **Files:** `engine/audio-engine.ts`, `ui/music-toggle.tsx`; audio file in `public/audio/` (placeholder or none).
- **Graph (Experience §3.7):** `HTMLAudioElement` (loop) → `MediaElementAudioSourceNode` → `GainNode` → `AnalyserNode` (`fftSize` 512) → destination. Gain fades 0 → 0.6 over 2 s.
- **Each frame** (from the GSAP ticker, not React): `getByteFrequencyData` into a reused `Uint8Array`; bass/mid/treble bands with the `band()` helper; fast-attack slow-decay smoothing; `heart.beat = smooth.bass ** 1.5`. Expose `mid` and `treble` for later (petals, sparks).
- **Synthetic fallback:** if the file is missing or errors, generate a 72 bpm lub-dub envelope in code (no audio needed) and write it to `heart.beat`.
- **Visibility:** pause on `visibilitychange` hidden; resume on visible.
- **Toggle:** top-right, 44 × 44, Lucide `Volume2`/`VolumeX`, `aria-pressed`, framer-motion press only. Muted → keep the synthetic beat for visuals.
- **Caps:** scale ≤ 6 %; reduced motion → glow only (± 0.05).
- **Vitest:** `band()` math and the smoothing function.

### Step 8 — NDC heart path system (M6)

- **File:** `src/features/love/engine/heart-path.ts` and logic in `heart.tsx`.
- `heart.ndc` (−1..1) converts to world units each frame from the live viewport (`useThree(s => s.viewport)` at the heart's depth): `x = ndc.x × viewport.width / 2`, `y = ndc.y × viewport.height / 2`.
- **Positions table** (Experience §4.2) as a typed constant per section with desktop and mobile variants.
- **Mobile rule:** while body text is on screen, the heart sits in the top 30 % or the bottom-right corner; never behind text.
- **Vitest:** NDC → world conversion and the table shape.

### Step 9 — Bloom and petals (M6)

- **Files:** `sections/bloom.tsx`, `canvas/petals.tsx`, `buildBloom` in `story.ts`.
- **Scrubbed** (`trigger '#bloom'`, `start 'top bottom'`, `end 'bottom top'`, `scrub 0.8`): heart NDC (0, 0.05) → (0.55, 0.10), scale 1 → 0.55 (mobile → (0, 0.6), 0.3); camera z 6 → 4.2 → back.
- **Triggered** at `top 60%`: `director.play('burstReform', { petals: true })`; `onEnterBack` → `director.settle()`.
- **Petals:** `InstancedMesh` of gently curved planes; counts 120/70/40; colours blush, lavender, ivory from tokens; shader-driven fall and sway with a `uPetalRelease` uniform (spawn over ~2 s, then slow ambient drift continuing through Memories, fading in Dawn later). Optional desktop pointer push.
- **DOM line:** "Every moment with you opens like this." fades up 16 px over 400 ms at ~30 % (GSAP, since it's scroll-linked).
- **Reduced motion:** heart stays formed; a still, sparse petal layer fades in; no camera move.
- **You should see:** burst and reform complete even when scrolling fast; the heart ends exactly formed.

---

## 6. Contracts introduced

| Contract                                                            | Location                   |
| ------------------------------------------------------------------- | -------------------------- |
| `buildHeartAttributes`, `heartPoint`                                | `canvas/heart-geometry.ts` |
| Heart shader uniforms                                               | `canvas/heart-shaders.ts`  |
| `director.play / settle / setBaseline / isBusy`, `HeartEvent` union | `engine/heart-director.ts` |
| Section baselines and heart positions                               | `engine/heart-path.ts`     |
| `audio.start / mute / unmute / bands`                               | `engine/audio-engine.ts`   |
| Tap pool API for mini hearts                                        | `canvas/mini-hearts.tsx`   |

---

## 7. Testing and verification

| Check              | How                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Build health       | `npm run lint`, `typecheck`, `build`, `test`                                                   |
| Gate               | No scroll and no audio before the tap; enables on load or after 6 s                            |
| Weave              | ≈ 3.2 s, smooth on a mid-range phone (or DevTools 4× CPU)                                      |
| Events             | Debug panel: fire every event repeatedly and in combinations; heart always returns to baseline |
| Fast-scroll stress | Experience §16.1 through Hero and Bloom, ten times                                             |
| Path               | Heart positions match Experience §4.2 at 375 px, 768 px, 1440 px; never behind text on mobile  |
| Audio              | Mute/unmute; remove the file → synthetic beat; hide tab → pause                                |
| Reduced motion     | Hero static, events become flashes, no parallax, petals still                                  |
| Performance        | DevTools Performance during the weave and the Bloom burst; no long tasks; draw calls < 60      |

---

## 8. Skills to run

GSAP skills; Emil `animate` and `review-animations` on the hero and Bloom; `animation-performance` on the weave and burst; `/impeccable critique` on the hero composition; `break-ui` on long names in the headline.

---

## 9. Exit checklist

- [ ] Gate works: loading ring, timeout, tap order, no early scroll or sound.
- [ ] Particle heart with Aura skin; ribbons weave into it in ≈ 3.2 s.
- [ ] Hero intro matches the timing table; idle breathing; parallax; tap-to-pulse with cooldown and DOM twin.
- [ ] Director: one event at a time, baseline invariant, all Phase 3 events, debug buttons.
- [ ] Mini hearts and petals working at every tier.
- [ ] Heart path follows Experience §4.2 on desktop and mobile.
- [ ] Bloom burst plays on pass and settles on scroll-back.
- [ ] Audio after tap, analyser drives the beat, synthetic fallback, mute, pause on hidden.
- [ ] Reduced-motion versions of gate, hero, events and Bloom.

---

## 10. Risks and fallbacks

| Risk                                   | Response                                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Weave drops frames on phones           | Lower particle count for `mid`; keep allocations behind the gate; check shader cost                |
| Idle breathing fights events           | Keep idle as separate additive fields, not on the same properties the director tweens              |
| SplitText breaks screen-reader reading | Use its aria option or keep a visually hidden full sentence and `aria-hidden` the split characters |
| iOS audio won't start                  | Create/resume the `AudioContext` synchronously inside the tap handler                              |
| Heart overlaps text on small phones    | Adjust mobile positions; it's a table, not code                                                    |

---

## 11. Docs and governance updates

ADR-0029 notes (event durations as built), ADR-0030 (audio behaviour as built), `progress.md`, `AI_SESSION_LOG.md`, `PROGRESS.md` entry.

---

## 12. Commit plan

1. `feat(love): add heart and ribbon geometry generators`
2. `feat(love): add particle heart with aura shader`
3. `feat(love): add heart director with baseline invariant`
4. `feat(love): add mini hearts`
5. `feat(love): add gate with loading and tap-to-begin`
6. `feat(love): add hero intro timeline, idle and tap-to-pulse`
7. `feat(love): add audio engine, music toggle and synthetic beat`
8. `feat(love): add NDC heart path`
9. `feat(love): add bloom section with petals`

---

## 13. Handoff to Phase 4

Phase 4 needs: a reliable director (with `arrowStrike` stub), mini hearts tap pool, the NDC path table, petals continuing into Memories, audio bands (`mid` for orb emissive), and the debug panel.
