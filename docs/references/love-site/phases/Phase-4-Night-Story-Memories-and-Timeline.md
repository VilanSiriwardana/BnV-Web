# Phase 4 — The Night Story: Memories and Timeline

| Field           | Value                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Version         | 1.0                                                                                                      |
| Status          | Proposed                                                                                                 |
| Milestones      | M7 (Floating Memories), M8 (Pinned Timeline and arrow strike)                                            |
| Prerequisites   | Phase 3 exit checklist complete; prototype images processed (orb 512 px, card 1600 px, timeline 1200 px) |
| Previous / next | [Phase 3](Phase-3-The-Heart.md) · [Phase 5](Phase-5-Day-Story-Dawn-to-Finale.md)                         |
| Guidebooks      | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)  |

---

## 1. Context

The heart now exists and moves. This phase builds the two longest, most interactive night sections: a corridor of glowing photo orbs she flies through and touches, and a golden thread that tells the story of you two, with the "arrow strike" at the featured moment. Both are 400vh sticky stages. This is also where the pointer-routing question (DOM over canvas) is settled for good.

---

## 2. What you will see at the end

**Memories**

- "Touch a memory." appears; the page stays on a sticky stage while the camera flies forward through eight glowing glass orbs, each holding a faded photo. Petals keep drifting. The heart rides low in the frame, (0, −0.55).
- Hovering an orb (desktop): it lifts toward you, its shell brightens, the photo turns from faded to full colour, and the heart leans toward it.
- Clicking or tapping: the heart beats, 4 small hearts pop, and a dialog grows from the orb's position with the photo, date, title and caption. Esc or the close button closes it; focus returns.
- A counter "2 of 8 opened". After all eight: a glow and "That's all of them. For now."
- Tabbing: each memory has a focus target; a ring appears around the orb on screen.

**Timeline**

- A gold thread draws itself across the screen (S-curve on desktop, vertical near the left edge on phone) as she scrolls. The heart rides the thread's tip.
- Five dated nodes light up in order; each brings in a card (photo, date, title, text); earlier cards dim.
- At the third ("featured") node: a thin gold arrow arcs in, hits the heart, a shockwave ring expands, the camera shakes slightly, the arrow dissolves into gold sparks, the heart bursts and reforms, and afterwards it stays a little brighter.
- Clicking a node scrolls smoothly to it.

---

## 3. Read first

| What                          | Where                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Memories spec                 | Experience §8                                                                                                                    |
| Timeline spec                 | Experience §9                                                                                                                    |
| Arrow strike timeline         | Experience §3.5 (`arrowStrike` table)                                                                                            |
| Orbs, arrow, ring, sparks     | Experience §3.6                                                                                                                  |
| Heart path for these sections | Experience §4.2                                                                                                                  |
| `--depth` stops               | Experience §3.1                                                                                                                  |
| Pointer routing and DOM twins | Tech Stack §7.2                                                                                                                  |
| Dialogs with Lenis            | Tech Stack §5.10                                                                                                                 |
| Performance techniques        | Tech Stack §8.3                                                                                                                  |
| Phase 3 contracts             | [Phase 3 §6](Phase-3-The-Heart.md#6-contracts-introduced)                                                                        |
| Repo                          | `src/components/ui/dialog.tsx` (Radix Dialog wrapper), `src/config/motion.ts`, `next/image` usage elsewhere in `src/components/` |
| Installed docs                | drei `Billboard`, `useTexture`; R3F events (`onPointerOver`, `eventSource`, `eventPrefix`)                                       |

---

## 4. Tech used in this phase

| Tool                                          | Role                                       | Rules                                                 |
| --------------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| Custom fresnel `ShaderMaterial`               | Glass orb shell                            | **No** `MeshPhysicalMaterial` transmission            |
| drei `Billboard` + `useTexture`               | Photo disc inside each orb                 | 512 px WebP textures; dispose on unmount              |
| GSAP ScrollTrigger (scrub)                    | Camera rail, thread drawing, node progress | One trigger per stage; flags instead of many triggers |
| SVG path + `stroke-dashoffset`                | The gold thread                            | `getTotalLength`, `getPointAtLength`, `getScreenCTM`  |
| Radix Dialog (`src/components/ui/dialog.tsx`) | Memory dialog                              | Focus trap, Esc, ARIA; `lenis.stop()` while open      |
| framer-motion                                 | Dialog open/close scale                    | Only on the dialog, never on GSAP elements            |
| R3F pointer events                            | Orb hover and click                        | Pass-through DOM layers; fallback `eventSource`       |
| `InstancedMesh` / `Points`                    | Spark pool (60)                            | Shared by arrow trail, dissolve, glints               |

---

## 5. Step-by-step build

### Step 1 — Memory orbs (M7)

- **File:** `canvas/memory-orbs.tsx`.
- **Layout (Experience §8):** orb `i` at `z = −6 − i × 4.5`, `x = sin(i × 1.3) × 2.4` (× 0.6 on mobile), `y = cos(i × 0.9) × 1.2`. Count from the tier (8/8/6).
- **Shell:** sphere with a fresnel shader (rim brighter than centre, lavender with a gold edge), additive or soft alpha; uniforms `uHover` (0..1) and `uEmissive` (audio `mid` ± 5 %).
- **Photo:** a `Billboard` disc inside, texture from `useTexture(site.memories[i].photo orb src)`, desaturated by default via a `uSaturation` uniform.
- **Only orbs within camera range update** each frame (simple z-distance check).
- **You should see:** eight orbs in a corridor when the camera is positioned manually.

### Step 2 — Camera rail and heart (M7)

- **In `story.ts` → `buildMemories`:** one scrubbed ScrollTrigger on `#memories` (the 400vh container): camera z from 6 to (last orb z + 4); heart NDC fixed at (0, −0.55), scale 0.38 (mobile (0, 0.62), 0.28); `--depth` 0 → 0.5 (from Phase 2).
- Camera z is a value in a shared `camera-rig` state read in `useFrame` (not React state).
- **You should see:** scrolling flies the camera forward through the orbs.

### Step 3 — Pointer routing decision (M7)

- Test the default: sections `pointer-events: none`, interactive DOM `auto`, canvas receives the rest.
- If orb hovers/clicks are lost on any browser or touch device, switch to R3F `eventSource={document.getElementById('love-root')}` with `eventPrefix="client"` and guard handlers with `e.nativeEvent.target.closest('[data-ui]')` (Tech Stack §7.2).
- **Record the decision** in ADR-0029 or the session log.

### Step 4 — Hover and click (M7)

- **Hover (desktop):** tween `uHover` 0 → 1 over 250 ms (`power2.out`), orb z +0.4, scale × 1.1, saturation → 1, heart NDC shifts ≤ 0.15 toward the orb, cursor `pointer`.
- **Click/tap:** `director.play('pulse')`, 4 mini hearts from the tap pool, then open the dialog with the orb's projected screen position.
- **Touch:** no hover; tap opens directly. Minimum projected hit size 44 px (use an invisible larger hit sphere).

### Step 5 — Memory dialog (M7)

- **File:** `ui/memory-dialog.tsx`, built on `src/components/ui/dialog.tsx`.
- **Open animation:** framer-motion scale 0.92 → 1 and opacity, `transform-origin` at the orb's screen position, 250 ms, `ease.standard` from `src/config/motion.ts`.
- **Content:** `next/image` (1600 w, `sizes`, blur placeholder), date (Inter, small), title (Cinzel), caption (Cormorant, 20 px). Scrollable content gets `data-lenis-prevent`.
- **Scroll lock:** `useLoveScroll().stop()` on open, `start()` on close (Tech Stack §5.10).
- **Focus:** returns to the orb's DOM twin on close.

### Step 6 — Keyboard twins and focus ring (M7)

- A visually hidden list of buttons (one per memory, in order) inside the stage.
- On focus: project the orb's bounding sphere to screen (`vector.project(camera)`) and position a DOM ring overlay around it; lean the heart toward it. Enter/Space opens the dialog.
- Optionally scroll the rail so the focused orb is in view (`scrollTo` to its progress).

### Step 7 — Counter and completion (M7)

- Track opened ids in a `Set` in a ref plus one React state update per open (not per frame). Show "n of 8 opened" after the first open.
- When all are opened: `director.play('glowUp')`; hint becomes "That's all of them. For now."
- Replay (Phase 5) resets this.

### Step 8 — Timeline layout and thread (M8)

- **File:** `sections/timeline.tsx`.
- Inside the 400vh sticky stage: an SVG with the gold thread path (gold token stroke). Desktop: gentle S-curve across the width at mid-height. Mobile (`matchMedia`): vertical path near the left edge.
- Five nodes at 10 %, 30 %, 50 %, 70 %, 90 % of the path length; real `<button>`s with date labels, in tab order, `aria-current` on the active one.
- Cards: photo thumbnail (`next/image`), date, title, text. Desktop alternates above/below; mobile sits in the lower 38 % of the screen.

### Step 9 — Scrubbed progress, thread drawing and heart on the tip (M8)

- **In `buildTimeline`:** one ScrollTrigger on `#timeline` with `scrub`. Map progress: 0–10 % intro, 10–90 % thread, 90–100 % outro.
- **Thread:** `stroke-dasharray = length`; `stroke-dashoffset = length × (1 − p)`.
- **Heart:** on update, `path.getPointAtLength(p × length)` → screen pixels via `getScreenCTM()` → NDC → `heart.ndc`. Scale 0.30 (mobile 0.26). In the outro it drifts off the thread.
- `--depth` 0.5 → 1 across the section.
- Recompute the path length on resize (`ScrollTrigger.refresh` callback).

### Step 10 — Node activation (M8)

- Keep a `lastActive` index; on update compute the active node from progress. When it changes forward: node dot ignites (scale 0.6 → 1, glow, 250 ms), the card slides in 24 px and fades (400 ms), earlier cards dim to 40 %, `director.play('glowUp')` + small `pulse`. Backward: reverse the card states (no events needed).
- Node click/Enter → `useLoveScroll().scrollTo(nodeScrollPosition, { duration: 1.2 })`.

### Step 11 — Arrow strike (M8)

- **Files:** `canvas/arrow.tsx` (group: thin gold cylinder shaft, cone head, two fletching planes, emissive gold), `canvas/shock-ring.tsx` (`RingGeometry` facing the camera, radial-fade shader), `canvas/sparks.tsx` (pool of 60 points).
- **Director event `arrowStrike`** (≈ 5.2 s; Experience §3.5):

| Time      | Action                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.00–0.20 | Glow dips; scale 1 → 0.97                                                                                                                              |
| 0.20–1.10 | Arrow flies from off-screen top-left on a gentle arc to the heart (`power2.in`) with ~12 trail sparks                                                  |
| 1.10      | Hit: recoil (0.92 in 80 ms → 1.06 in 220 ms → settle 300 ms); ring 0 → 1 over 0.8 s; bloom ~2× for 120 ms; camera shake ~0.015 units, 250 ms, decaying |
| 1.15–1.45 | Arrow dissolves into ~40 gold sparks                                                                                                                   |
| 1.40–4.60 | `burstReform`                                                                                                                                          |
| 4.60+     | Timeline baseline glow +0.15 for the rest of the section                                                                                               |

- The arrow group mounts only while the strike plays.
- **Trigger:** when the active node becomes the featured one. **Re-arm only after scrolling back above 45 %** to avoid jitter re-fires. If interrupted, `settle()` restores the (brighter) baseline.

---

## 6. Reduced-motion and Calm versions

| Section  | Version                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Memories | The Phase 1 two-column card grid; same `MemoryDialog` (fade only); heart as a static icon in the header                                                 |
| Timeline | No pinning; vertical list of five cards with the static thread beside them; heart small and static; featured card gets a soft glow instead of the arrow |

---

## 7. Contracts introduced

| Contract                                           | Location                   |
| -------------------------------------------------- | -------------------------- |
| `cameraRig` mutable state (z, shake)               | `engine/camera-rig.ts`     |
| `MemoryDialog` props (memory, originRect, onClose) | `ui/memory-dialog.tsx`     |
| `projectToScreen(object, camera)` helper           | `canvas/projection.ts`     |
| `svgPointToNdc(path, length)` helper               | `engine/svg-ndc.ts`        |
| Director `arrowStrike`                             | `engine/heart-director.ts` |
| Spark pool API (`emit(n, origin, opts)`)           | `canvas/sparks.tsx`        |

---

## 8. Testing and verification

| Check          | How                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Build health   | `npm run lint`, `typecheck`, `build`, `test`                                                             |
| Orbs reachable | Mouse, touch (DevTools device + real phone), keyboard only                                               |
| Dialog         | Focus trap, Esc, backdrop click, focus restore; page does not scroll behind; long caption scrolls inside |
| Textures       | DevTools memory or `renderer.info`: textures within the < 64 MB budget                                   |
| Nodes          | Activate in order and reverse cleanly; click lands precisely                                             |
| Arrow          | Plays once per pass; completes while scrolling; ends formed and brighter; no re-fire on small jitters    |
| Overlap        | Heart never covers card text at 375/768/1440 px                                                          |
| Stress         | Fast scroll through Memories and Timeline ten times                                                      |
| Performance    | DevTools 4× CPU during the camera rail and the strike; draw calls < 60                                   |
| Unit tests     | `svgPointToNdc`, orb layout formula, node-activation function                                            |

---

## 9. Skills to run

Emil `review-animations` and `improve-animations` (hover, dialog, strike); `break-ui` (long captions, missing photo, 6 vs 8 orbs, long timeline text); `animation-performance` during the strike; `/impeccable critique` on the timeline card layout.

---

## 10. Exit checklist

- [ ] Orbs render per tier with fresnel shell and photo; rail scrubs; heart fixed low.
- [ ] Pointer routing decided and recorded.
- [ ] Hover, click, keyboard twins and focus ring all work; touch targets ≥ 44 px.
- [ ] Dialog: animation, content, scroll lock, focus restore.
- [ ] Counter and completion moment.
- [ ] Thread draws; heart rides the tip; nodes activate and reverse; click-to-scroll.
- [ ] Arrow strike full sequence; once per pass; brighter baseline after.
- [ ] Reduced-motion versions of both sections.

---

## 11. Risks and fallbacks

| Risk                              | Response                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| Clicks don't reach orbs           | `eventSource` fallback (Step 3)                              |
| Texture memory too high on phones | 6 orbs on `low`; lower texture size; dispose on unmount      |
| Heart tip jitters                 | Damp `heart.ndc` in `useFrame`; recompute CTM on resize only |
| Strike re-fires                   | 45 % re-arm rule and director busy check                     |
| Dialog and Lenis conflict         | `stop()`/`start()` plus `data-lenis-prevent`                 |

---

## 12. Docs and governance updates

Pointer-routing decision (ADR-0029 or the session log), `progress.md`, `AI_SESSION_LOG.md`, `PROGRESS.md` entry.

---

## 13. Commit plan

1. `feat(love): add memory orbs with fresnel shell`
2. `feat(love): add memories camera rail`
3. `feat(love): add orb hover, click and keyboard twins`
4. `feat(love): add memory dialog with scroll lock`
5. `feat(love): add timeline thread, nodes and cards`
6. `feat(love): add heart-on-thread and node activation`
7. `feat(love): add arrow strike with ring and sparks`

---

## 14. Handoff to Phase 5

Phase 5 needs: the spark pool, the dialog pattern (reused by the lightbox), the projection helpers (reused by `dockToSeal`), the `--depth` end state at 1, and petals still active (to fade in Dawn).
