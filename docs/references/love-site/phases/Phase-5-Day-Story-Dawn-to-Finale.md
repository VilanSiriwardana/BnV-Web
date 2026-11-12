# Phase 5 — The Day Story: Dawn, Gallery, Wish, Letter, Finale

| Field           | Value                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Version         | 1.0                                                                                                             |
| Status          | Proposed                                                                                                        |
| Milestones      | M9 (Dawn and Gallery), M11 (Wish), M12 (Letter), M13 (Finale and Replay)                                        |
| Prerequisites   | Phase 4 exit checklist complete                                                                                 |
| Previous / next | [Phase 4](Phase-4-Night-Story-Memories-and-Timeline.md) · [Phase 6](Phase-6-Fallbacks-QA-Content-and-Launch.md) |
| Guidebooks      | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)         |

---

## 1. Context

Night turns to day and the story lands. This phase adds the heart's second skin (Pearl, because glow doesn't read on light backgrounds), a calm daylight gallery, the interactive wish, the letter where the heart becomes the wax seal, and the finale with Replay. After this phase the full experience exists end to end; Phase 6 hardens and fills it with real content.

---

## 2. What you will see at the end

1. **Dawn:** an almost empty screen; a sunrise gradient rises from the bottom; the page colours move from plum through lavender dusk and blush to ivory; the glowing heart rises, grows and turns into a satin **pearl heart** with a gold rim; one shine; then the line "And somehow, it keeps getting lighter."
2. **Gallery:** "Us, in daylight" over a masonry grid of photos that reveal with a soft clip and fade as they enter; the small pearl heart sits in the bottom-right corner and glints occasionally. Clicking a photo opens a large lightbox (arrows, swipe, Esc).
3. **Wish:** blush background, "Make a wish, {name}.", a small star with a ring. Press and hold: the ring fills, the star brightens and grows, the heart rises to meet it. Let go early and everything eases back. Hold to the end: a flash, heart and star burst into small hearts and **confetti**, the heart reforms, "May every wish come true." appears, and a "Make another wish" link.
4. **Letter:** "A letter for you." and a floating envelope; the heart flies onto it and **becomes the wax seal**. Hold the seal: it splits, little hearts flutter up, the flap opens, the letter rises and the paragraphs appear one by one.
5. **Finale:** "Happy birthday, {name}." with a large pearl heart in a gold halo, beating with the music; one celebratory burst with a little confetti. "Replay our story" glides back to the top and the ribbons weave again.

---

## 3. Read first

| What                                                                     | Where                                                                                                                                                                     |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dawn                                                                     | Experience §10                                                                                                                                                            |
| Gallery                                                                  | Experience §11                                                                                                                                                            |
| Wish (incl. `useHold` sketch)                                            | Experience §12                                                                                                                                                            |
| Letter                                                                   | Experience §13                                                                                                                                                            |
| Finale and Replay                                                        | Experience §14                                                                                                                                                            |
| Pearl skin                                                               | Experience §3.3                                                                                                                                                           |
| Events `skinSwap`, `wishMerge`, `dockToSeal`, `sealBreak`, `finaleBurst` | Experience §3.5                                                                                                                                                           |
| Confetti, wish star, ring                                                | Experience §3.6                                                                                                                                                           |
| Theme stops (`--dawn` 1 sections)                                        | Experience §3.1                                                                                                                                                           |
| Accessibility (holds, announcements)                                     | Tech Stack §9.1–9.2                                                                                                                                                       |
| Privacy (wish text, passphrase)                                          | Tech Stack §9.3                                                                                                                                                           |
| Repo                                                                     | `src/components/ui/dialog.tsx`, `src/config/motion.ts` (`hoverScale` 1.03), `src/components/motion/clip-reveal.tsx` (reference for the clip style; GSAP owns this reveal) |
| Phase 4 contracts                                                        | [Phase 4 §7](Phase-4-Night-Story-Memories-and-Timeline.md#7-contracts-introduced)                                                                                         |

---

## 4. Tech used in this phase

| Tool                                                                              | Role                              | Rules                                                                                     |
| --------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| `ExtrudeGeometry` + `MeshPhysicalMaterial` (clearcoat/sheen, **no transmission**) | Pearl heart mesh                  | Gold rim via a second thin mesh or fresnel term; fake contact shadow with a blurred plane |
| Heart particle shader (`uSkin`)                                                   | Cross-fade Aura → Pearl particles | Pearl uses normal blending                                                                |
| `ScrollTrigger.batch`                                                             | Gallery reveals                   | `once: true`; ≤ 6 parallax tiles at a time on desktop                                     |
| Radix Dialog + framer-motion drag                                                 | Lightbox                          | Arrow keys, swipe, Esc, focus restore, `lenis.stop()`                                     |
| `useHold` hook                                                                    | Wish and seal                     | Pointer capture, cleanup, no key repeat                                                   |
| `InstancedMesh` with shader physics                                               | Confetti                          | `p = p0 + v t + ½ g t²` with drag and flutter                                             |
| GSAP only                                                                         | Letter sequence                   | No framer-motion on letter elements                                                       |
| CSS 3D (`rotateX`)                                                                | Envelope flap                     | Origin at the top                                                                         |
| `aria-live="polite"`                                                              | Wish and letter announcements     |                                                                                           |

---

## 5. Step-by-step build

### Step 1 — Dawn section (M9)

- **File:** `sections/dawn.tsx`; `buildDawn` in `story.ts`.
- 100vh; **no text between 20 % and 75 %** of the section. Sunrise gradient from the bottom using gold → blush tokens, opacity tied to `--dawn`.
- **Scrubbed:** `--dawn` 0 → 1 (Phase 2 tween); heart (0, −0.55) → (0, 0.15), scale 0.30 → 0.60 (mobile (0, 0.5), 0.5); petals fade out and stop spawning.
- **Triggered:** at ~35 % → `director.play('skinSwap')`; at ~50 % → `shine`.
- At 75 % the single line fades in (Cormorant italic, Soft Charcoal on Ivory).

### Step 2 — Pearl skin and `skinSwap` (M9)

- **File:** `canvas/heart-pearl.tsx` (mounted alongside the particles).
- Mesh: `ExtrudeGeometry` from a heart `Shape` (same `heartPoint`), small bevel, centred and scaled to the particle heart.
- Material: `MeshPhysicalMaterial` with soft clearcoat and sheen, lavender-ivory colour from tokens; gold rim (second slightly larger mesh with a fresnel gold shader, or an emissive edge).
- Contact shadow: a blurred radial gradient plane under the heart (not real shadows).
- `skinSwap` (1.2 s, `power2.inOut`): `heart.skin` 0 → 1. Particles use `uSkin` to switch from additive to normal-blended fine sparkles (run two materials or fade alpha); the mesh fades in. Bloom intensity lowers.
- Canvas colour uniforms keep following `--dawn` (Phase 2 helper).
- **You should see:** no flash or pop; the heart clearly visible on Ivory.

### Step 3 — Gallery grid and reveal (M9)

- **File:** `sections/gallery.tsx`; `buildGallery` in `story.ts`.
- 9–12 photos from config; masonry-style (CSS columns or grid with row spans), 2 columns mobile, 3 desktop; bordered frames on Blush surfaces; token radius.
- `next/image` with `sizes`, blur placeholders, `priority` for the first row only; widths/heights from config to prevent layout shift.
- **Reveal:** `ScrollTrigger.batch('.love-tile', { start: 'top 88%', once: true, onEnter: batch => gsap.fromTo(batch, { y: 24, opacity: 0, clipPath: 'inset(12% 8% 12% 8% round var(--radius))' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round var(--radius))', duration: 0.8, ease: 'power3.out', stagger: 0.08 }) })`.
- **Parallax (desktop only):** ±6 % image translate on at most six visible tiles.
- **Hover:** image scale ≤ 1.03 (250 ms); captions on hover/focus with a scrim.
- **Heart:** corner companion (0.86, −0.78), scale 0.20 (mobile (0.8, −0.85), 0.16); `shine` on each batch, throttled to once per 4 s.

### Step 4 — Lightbox (M9)

- **File:** `ui/lightbox.tsx`, built on `src/components/ui/dialog.tsx`.
- Large photo, caption, previous/next buttons; arrow keys; swipe via framer-motion `drag="x"` with a threshold; Esc closes; focus returns to the tile; `useLoveScroll().stop()` while open.

### Step 5 — `useHold` hook (M11)

- **File:** `src/features/love/hooks/use-hold.ts`, starting from the Experience §12 sketch and hardened:
  - `setPointerCapture` on pointer down; release on up/cancel; ignore secondary buttons.
  - Space/Enter keydown starts (ignore `e.repeat`), keyup releases.
  - Cleanup cancels the RAF on unmount.
  - On early release, ease progress back to 0 over 0.6 s with GSAP and report it through `onProgress`.
  - `completeOnClick` option for Calm/reduced motion and the "Or tap once" link.
- **Vitest:** progress and completion with fake timers; repeat keydown ignored; release resets.

### Step 6 — Wish star and hold (M11)

- **Files:** `sections/wish.tsx`, `canvas/wish-star.tsx`.
- Star: a four-point star (shader quad or small extrusion) with a halo sprite and a `uHold` uniform; an SVG progress ring around the DOM button that sits over the star.
- The hold target is a real `<button>` (≥ 88 px, `touch-action: none` on it only) with "Press and hold" and an "Or tap once" link.
- While holding (2.4 s): star scale 1 → 1.6, halo 0.2 → 1.0, heart y −0.6 → −0.05, scale 0.35 → 0.5, shimmer.

### Step 7 — Confetti and `wishMerge` (M11)

- **File:** `canvas/confetti.tsx`: instanced quads (300/160/80 per tier), launch time uniform, colours lavender/rose/gold/ivory, life ≈ 4 s, all motion in the vertex shader.
- **`wishMerge`** (≈ 4 s):

| Time | Action                                                                                  |
| ---- | --------------------------------------------------------------------------------------- |
| 0.0  | Heart and star align; soft flash (glow 1.0, gentle bloom)                               |
| 0.3  | `burst`: heart and star dissolve into small hearts; confetti launches in an upward cone |
| 1.6  | `reform`: heart returns slightly brighter                                               |
| 2.0  | "May every wish come true." fades in (`aria-live="polite"`)                             |
| 4.0  | Calm; "Make another wish" link                                                          |

- Completing again does not stack: the director ignores `wishMerge` while busy; "Make another wish" resets the state.
- Optional `navigator.vibrate(10)` on completion (Android), ignore errors.
- **Optional wish field:** collapsed link "Write your wish (stays on this device, never sent)" expands a textarea. Not stored, not sent.

### Step 8 — Envelope and `dockToSeal` (M12)

- **File:** `sections/letter.tsx`; envelope in SVG/CSS (body, flap, seal 72–96 px; ~80 % width on mobile), floating gently (GSAP yoyo, paused in Calm).
- **`dockToSeal`** (0.9 s, `power3.inOut`): measure the seal with `getBoundingClientRect` → NDC → `heart.ndc`; scale to seal size; Pearl + gold. Re-measure on resize and on scroll within the sticky stage so it stays exact.
- Hint "Hold the seal to open."

### Step 9 — Unlock sequence (M12)

- Hold 1.2 s on the seal (`useHold`), or the passphrase if configured (small input + "Open"; wrong entry → "Not quite, try again", no shake, no lockout; client-side soft lock only).
- **Sequence (GSAP only):**

| Time      | Action                                                                                   |
| --------- | ---------------------------------------------------------------------------------------- |
| 0.0–0.3 s | Seal splits into two halves; `sealBreak` releases ~12 mini hearts fluttering up for ~3 s |
| 0.2–0.9 s | Flap opens (`rotateX`, origin top)                                                       |
| 0.7–1.4 s | Letter card rises and grows to reading size                                              |
| 1.4 s on  | Paragraphs reveal one by one (fade + 16 px, 500 ms, 400 ms stagger)                      |

- Letter card: `surface-elevated` paper, Cormorant 20 px, italic sign-off; long text scrolls inside with `data-lenis-prevent`.
- Unlocking twice does nothing; the letter stays open.

### Step 10 — Finale and Replay (M13)

- **File:** `sections/finale.tsx`; `buildFinale` in `story.ts`.
- Heart (0, 0.05), scale 1.3 (mobile (0, 0.15), 1.0), Pearl with a soft gold halo, beating with music (synthetic if muted).
- On enter: `director.play('finaleBurst')` once per pass (larger `burstReform` + a little confetti + final glow).
- Buttons: primary "Replay our story", secondary "Music on/off" (mirrors the toggle). Stacked full width ≥ 48 px on mobile.
- **Replay:** `scrollTo(0, { duration: 2.6 })`; reset session flags (wish done, memories counter, finale played; the letter stays unlocked); re-arm the hero so `onEnterBack` replays `ribbonWeave`; music continues.

---

## 6. Reduced-motion and Calm versions

| Section | Version                                                                  |
| ------- | ------------------------------------------------------------------------ |
| Dawn    | Straight cross-fade between dark and light; 300 ms skin swap             |
| Gallery | Simple fades; no clip-path, no parallax                                  |
| Wish    | One click completes; soft glow and the message; no confetti; heart stays |
| Letter  | Already open, text visible; seal is a small static heart                 |
| Finale  | Static heart; no burst; Replay jumps to the top                          |

---

## 7. Contracts introduced

| Contract                                                                          | Location                   |
| --------------------------------------------------------------------------------- | -------------------------- |
| `useHold({ duration, onProgress, onComplete, completeOnClick })`                  | `hooks/use-hold.ts`        |
| Director events `skinSwap`, `wishMerge`, `dockToSeal`, `sealBreak`, `finaleBurst` | `engine/heart-director.ts` |
| Confetti API (`launch(origin, count)`)                                            | `canvas/confetti.tsx`      |
| `Lightbox` props (photos, index, onClose)                                         | `ui/lightbox.tsx`          |
| `resetSession()` for Replay                                                       | `engine/session.ts`        |

---

## 8. Testing and verification

| Check         | How                                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Build health  | `npm run lint`, `typecheck`, `build`, `test`                                                                            |
| Dawn contrast | Pause at every resting position; text only on Ivory/Blush or Midnight; ≥ 4.5:1                                          |
| Skin swap     | No pop; heart visible on Ivory at all tiers                                                                             |
| Gallery       | No layout shift (Lighthouse CLS ≈ 0); lazy loading below the first row                                                  |
| Lightbox      | Keyboard only; swipe on a phone; focus restore                                                                          |
| Wish          | Early release leaves nothing behind; double completion doesn't stack; announced by a screen reader                      |
| Letter        | Heart docks exactly on the seal at 375/768/1440 px and after resize; long letter scrolls inside; passphrase wrong/right |
| Finale        | Burst once per pass; Replay returns to a clean, working Hero                                                            |
| Stress        | Fast scroll top → bottom → top ten times; heart always formed                                                           |
| Unit tests    | `useHold`, session reset                                                                                                |

---

## 9. Skills to run

`/impeccable critique` → `polish`; `typeset` on the letter; Emil `review-animations`; `break-ui` (very long letter, passphrase on/off, 9 vs 12 photos, long wish text).

---

## 10. Exit checklist

- [ ] Dawn text-free window; colour shift; Pearl skin swap without a pop.
- [ ] Gallery grid, batched reveal, parallax limits, corner heart, throttled shine.
- [ ] Lightbox fully keyboard and touch operable.
- [ ] `useHold` hardened and tested.
- [ ] Wish hold, confetti, `wishMerge`, announcement, single-click alternative, local-only wish field.
- [ ] Envelope, `dockToSeal`, hold/passphrase unlock, paragraph reveal, inner scroll.
- [ ] Finale burst once per pass; Replay resets cleanly.
- [ ] Reduced-motion versions of all five sections.

---

## 11. Risks and fallbacks

| Risk                                       | Response                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| `MeshPhysicalMaterial` too heavy on phones | Use `MeshStandardMaterial` with a fresnel rim on `low`/`mid`             |
| Clip-path reveal janks                     | Drop clip-path on `low`; keep the fade                                   |
| Seal position drifts                       | Re-measure on resize and stage progress; damp the NDC                    |
| Confetti overload                          | Tier counts; one launch at a time                                        |
| Replay leaves stale state                  | `resetSession()` plus `director.settle()` plus `ScrollTrigger.refresh()` |

---

## 12. Docs and governance updates

`progress.md`, `AI_SESSION_LOG.md`, `PROGRESS.md` entry; a short note in ADR-0029 on the letter opening exception (signature moment longer than 400 ms).

---

## 13. Commit plan

1. `feat(love): add dawn section and theme crossover`
2. `feat(love): add pearl heart skin and skin swap`
3. `feat(love): add gallery grid with batched reveal`
4. `feat(love): add gallery lightbox`
5. `feat(love): add useHold hook`
6. `feat(love): add wish star, confetti and wish merge`
7. `feat(love): add envelope, seal docking and letter unlock`
8. `feat(love): add finale and replay`

---

## 14. Handoff to Phase 6

Phase 6 needs: the full experience end to end, all reduced-motion variants in place (to audit and finish), the debug panel, and the content config ready for real photos and text.
