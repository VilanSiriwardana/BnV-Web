# B&V Love Site: Phase 12, The Gallery Walk (3D Corridor)

| Field                   | Value                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Document type           | Final Knowledge and Reference Document, and build guide                                                                        |
| Version                 | 1.0 (planning)                                                                                                                 |
| Date                    | 2026-11-23                                                                                                                     |
| Status                  | **Working reference. Nothing in this document is implemented yet.**                                                            |
| Intended audience       | Claude Code (planner and builder), the developer (reviewer)                                                                    |
| Suggested location      | `docs/references/love-site/phases/Phase-12-Gallery-Walk.md`                                                                    |
| Scope                   | Replace the Gallery section (section 6) with a scroll-driven, left-curving 3D corridor of framed photos, with click-to-inspect |
| Prepared from           | Project discussion on 2026-11-23, the Love Site guidebook (v2.0 as-built), the Tech Stack and Implementation Phases documents  |
| Primary source of truth | The current code in the repo. Where this document and the code disagree, the code wins and the conflict must be reported       |

**Label legend.** AGREED = chosen by the owner in discussion. PLANNED = agreed but not built. VERIFIED = confirmed in the project documents provided. INFERRED = likely but not confirmed in code. UNCERTAIN = must be checked. REJECTED = considered and not chosen.

---

## 1. Executive summary

**Objective.** The owner wants the Gallery to feel like a premium 3D experience, not a photo grid. The visitor walks into the screen along a **left-curving hallway** with framed photos on both walls. The walls drift past as the visitor scrolls. Tapping a photo turns the camera to it. A button returns the visitor to the walk at the exact spot they left.

**Direction (all AGREED).**

- Look: warm and classic. Aubergine and ivory walls, dark wood wainscot, gilded frames, brass wall lights, polished wood floor. The two reference photos were a classic hotel corridor (chosen) and a modern white-frame corridor (not chosen).
- 12 clickable photo frames, no fixed order, no title captions. Each opened photo shows a tiny gold note with floating hearts.
- A few non-clickable decor pieces (old map, mirror) so it feels like a real house.
- One large spotlit end frame holding a special portrait of her, which leads on to the next section.
- Inspect mode has Back, Esc, tap outside, and previous/next (swipe on phones).
- First-version extras: a heart companion ahead of the camera, light motes, floor reflection, and a doorway entry transition.
- Textures: CC0 maps (wood floor, wainscot, wallpaper, gold frame) with procedural fallbacks.
- Mobile gets the **full** 3D walk. This makes performance budgets the main constraint.

**Stack (PLANNED).** Everything already in the project: React Three Fiber, Three.js, drei, GSAP and ScrollTrigger, Lenis, Radix. No new packages are expected. Corridor geometry is procedural, which matches the existing decision of no Blender and no GLB models.

**Main risks.** Two systems wanting to move the camera at once, click events lost behind DOM layers, phone GPU load, and long pinned scrolls feeling like scroll-jacking. Section 14 covers each.

**Next major action.** Claude Code produces a plan (not code) using the prompt in the companion file, then the owner approves, then milestones M41 onward are built one at a time.

---

## 2. Background and original requirement

The Love Site is a private, `noindex` birthday experience at `app/love/[slug]/page.tsx`. It is built end to end (Phases 1 to 7 audited as-built on 2026-11-19) and Phases 8 to 11 are specified in `Love-Site-Romance-Additions.md`. The owner's original request for this phase:

- Present the gallery in a more premium, refined way, not just a gallery.
- A 3D experience of walking along a left-curving pathway with images on both walls.
- The visitor walks into the screen and the wall of images goes past.
- When a clickable image is clicked, the camera turns to it.
- A button returns to the walk. The visitor browses the images by walking the path.

The existing gallery (VERIFIED) is a CSS masonry of 12 bordered tiles with a Radix lightbox. It works well but is a flat grid. The Improvement Report proposed a pinned horizontal filmstrip (item G6). This phase supersedes G6.

---

## 3. Scope

**In scope**

- A new 3D corridor scene inside the existing single `<Canvas>`.
- A scroll-scrubbed camera along a curve, pinned for the walk.
- Frame, decor, lighting and texture work for the warm classic look.
- The walk and inspect state machine, with Back, Esc, tap outside, and previous/next.
- A gold note with floating hearts per opened photo (optional text).
- A heart companion, light motes, floor reflection, doorway entry.
- Quality-tier behaviour, a mobile performance budget, and fallbacks.
- Config additions, DOM twin buttons, tests, docs and ADRs.

**Out of scope**

- Photo content, final notes and the real end portrait (owner supplies them later; prototype images are used until then).
- Changes to Wish, Letter, Finale, or the Dance reel beyond the handoff point.
- New npm packages (unless the plan proves one is needed and the owner approves).
- Blender or GLB models.
- Any server, upload or analytics change.

**Assumptions**

- The all-night theme (ADR-0029 amendment) stays. The corridor is a warm interior lit by brass lights and sits inside the night palette. INFERRED: it should still use brand tokens (aubergine, ivory, gold) and not introduce a new palette.
- The gallery keeps its 9 to 12 photo config. The end portrait is one extra image.
- The Dance section currently follows Gallery. Phase 11 replaces particle dancers with a frame reel. The handoff must work with whichever is live. UNCERTAIN: check which state the repo is in.

---

## 4. Current verified state

All items are VERIFIED from the project documents, not from reading code. Claude Code must re-verify against the repo.

| Area          | Current state                                                                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js App Router, React 19.2.x, route `app/love/[slug]/page.tsx` (Server Component, `noindex`)                                                                                                                        |
| 3D            | One fixed `<Canvas>` (R3F v9), `canvas/love-canvas.tsx`, one `EffectComposer` with one `Bloom`, no real-time shadows                                                                                                    |
| Clock         | GSAP ticker drives Lenis, then ScrollTrigger, then tweens, then R3F render                                                                                                                                              |
| Heart state   | A plain mutable object, written by GSAP, read in `useFrame`. Never React state per frame                                                                                                                                |
| Tiers         | `high`, `mid`, `low`, `static` (`engine/tiers.ts`). `PerformanceMonitor` steps down at runtime. Buffers allocated once at the high size                                                                                 |
| Gallery today | `sections/gallery.tsx`, `buildGallery` in `engine/story.ts`, `ui/lightbox.tsx`, `sections/love-photo.tsx`. Masonry, batched clip-path reveal, parallax on the first six tiles, Radix lightbox with swipe and thumbnails |
| Config        | `config/types.ts`, `gallery: PhotoRef[]` (9 to 12). 12 prototype gallery images exist as `love-gallery-NN.webp`                                                                                                         |
| Images        | `scripts/prepare-love-images.mjs` (sharp) makes 1200 px gallery images and 16 px blur placeholders                                                                                                                      |
| Fallback      | `static` tier, Calm mode and reduced motion render the page without the canvas, with native scroll                                                                                                                      |
| Files         | kebab-case file names exporting PascalCase components                                                                                                                                                                   |
| Governance    | `/plan` then `/blueprint` then `/implement`; ADRs in `docs/decisions/DECISIONS.md`; session log in `docs/AI_SESSION_LOG.md`                                                                                             |

**Known corrections already recorded (R1 to R8).** `StorefrontChrome` hides shop chrome on `/love`. Files are kebab-case. Use the next free ADR number, re-checking first (R6 said ADR-0027 to ADR-0030 at the time of writing; later phases may have used more).

**Known gaps in the current gallery** (guidebook): no fade in calm mode, and parallax always on tiles 1 to 6. These fallbacks remain in use as the static path, so fix them when touching that code.

---

## 5. Options considered

| Option                                                       | How it works                                               | Advantages                                                                                 | Drawbacks                                                                                                                                | Status                            |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| A. Procedural R3F corridor inside the existing canvas        | Corridor, frames and lights generated from a curve in code | Matches the stack and the no-GLB rule. Full control of scroll, camera, tiers. No new tools | More tuning work. Textures need care to look premium                                                                                     | **SELECTED (AGREED)**             |
| B. Blender-modelled corridor exported as GLB, lighting baked | Artist-made scene loaded in R3F                            | Highest visual polish, baked light is cheap at runtime                                     | Contradicts the "No Spline, no Blender, no GLB" decision. Needs an ADR, a pipeline, and file size review. Hard to edit for curve changes | DEFERRED (possible later upgrade) |
| C. Spline scene                                              | Hosted 3D scene                                            | Quick to make                                                                              | Weak control of a scroll-bound camera, extra runtime, conflicts with "no Spline"                                                         | REJECTED                          |
| D. Pinned horizontal filmstrip (Improvement Report G6)       | 2D horizontal scroll                                       | Cheap, safe on phones                                                                      | Not the experience requested                                                                                                             | REJECTED (superseded)             |
| E. Second `<Canvas>` for the gallery                         | Separate 3D context                                        | Isolation from the heart scene                                                             | Breaks the "one canvas only" rule and doubles GPU cost on phones                                                                         | REJECTED                          |

---

## 6. Final decision and recommended approach

Build **Option A**: a gallery scene group inside the existing canvas, switched on by scroll range, with a camera-mode arbiter so only one system moves the camera. All motion stays on the single GSAP ticker.

Reconsider only if (a) the prototype cannot hold 40 fps on a mid-range Android phone after tier step-downs, or (b) the procedural look cannot reach an acceptable quality with CC0 textures. In either case the fallback to Option B needs a new ADR.

---

## 7. Target architecture

```text
 scroll (Lenis) -> ScrollTrigger (pinned #gallery, scrub 0..1) -> galleryWalk.progress (plain object)
 galleryWalk.mode: 'walk' | 'inspect' | 'transition'
 cameraMode: 'story' | 'gallery'   (one owner at a time)

 <LoveCanvas>
   existing heart scene (hidden or dimmed while cameraMode === 'gallery')
   <GalleryWalk>   (mounted only near the section; lazy textures)
      corridor (floor, walls, ceiling, wainscot, skirting, cove)
      frames x12 + decor x3..5 + end frame
      lights (emissive meshes + 2..3 real lights near camera)
      motes (Points), floor reflection, hearts companion
      camera rig: reads progress -> curve point + tangent; or inspect target
 </LoveCanvas>

 DOM layer: pin wrapper, progress hint, skip link, frame twin buttons,
            Back / Prev / Next controls, gold note
```

**Walk path.** A `CatmullRomCurve3` that sweeps left. The camera position is `curve.getPointAt(t)`. It looks at `curve.getPointAt(t + lookAhead)`. Eye height about 1.6 m. FOV about 55 degrees. A small sway and a slight FOV change give the feeling of walking. The camera only reads an eased progress value and never jumps.

**Corridor geometry.** Generated from the same curve: left and right wall ribbons offset along the curve normals, a floor ribbon, a ceiling ribbon with a gold cove strip, a wainscot band and skirting board. Merge into a few meshes. Starting dimensions: about 25 m long, about 2.4 m wide, about 3 m high. These are starting values to tune, not fixed.

**Frames.** 12 photo frames placed at set parameters along the curve, alternating left and right, rotated to face the walkway. Mixed portrait and landscape sizes, spread so neither wall clusters one orientation. Each frame is a gilded border (instanced or shared geometry) plus a photo plane. Aspect ratio comes from config so layout never shifts.

**Decor.** Three to five non-clickable pieces (an old map, a mirror, optionally an empty frame) between photo frames. They are never focusable and never open inspect.

**End frame.** One large frame with a spotlight at the end of the curve, holding the special portrait. Reaching it triggers the handoff to the next section. Clicking it opens inspect like any other frame (INFERRED, confirm in the plan).

**Lighting.** Brass wall lights above frames as emissive meshes (not real lights). Two or three real lights near the camera. Warm fog. Light motes drifting in the air. A soft warm glow at the far end that pulls the eye forward. No real-time shadows, no `transmission` materials, no SSAO, no depth of field (these are on the project's avoid list).

**Floor reflection.** Faked: a dim, flipped, low-cost copy or a gradient, never a real mirror. First feature dropped on `mid` and `low`.

**Entry and exit.** Entry through a doorway with a soft bloom of light as the previous section hands over. Exit by walking into the end frame's glow and fading to the next section's look.

**Heart companion.** A small gold heart floating a short distance ahead of the camera along the curve. It uses the existing heart-state conventions and does not add a second system. It pulses when a photo is opened. Floating hearts for the note reuse the instanced mini-hearts approach.

**Inspect mode.** A state machine with `walk`, `transition`, `inspect`.

1. Click or Enter on a frame: save scroll position and `galleryWalk.progress`; stop Lenis; set mode to `transition`.
2. GSAP tweens camera position and quaternion to about 1.5 m in front of the frame, with a slightly narrower FOV. Other frames dim. The frame's lights brighten slightly.
3. When the tween ends, mode becomes `inspect`; the gold note and floating hearts appear.
4. Previous/next tween to the neighbouring frame (by the order in which the frames appear along the walk). Swipe does the same on touch.
5. Back, Esc or tap outside: tween back to the saved camera pose, restart Lenis, restore the exact scroll position, mode returns to `walk`.
6. Input during `transition` is ignored or queued (decide in the plan). Rapid clicks must never stack tweens.

**Camera arbitration.** A `cameraMode` flag (`story` or `gallery`). The existing heart camera rig reads it and does nothing while the gallery owns the camera. The gallery rig does nothing otherwise. This is the highest integration risk.

**Pointer routing.** The project already solved a similar problem for memory orbs (pass-through layers, with `eventSource` plus `eventPrefix="client"` as the fallback). Reuse the chosen approach and test it first.

---

## 8. Detailed functional requirements

| ID    | Requirement              | Behaviour and edge cases                                                                                                                                                                                                                                            | Status  |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| FR-01 | Pinned walk              | The `#gallery` section pins for about 500 to 600 vh of scroll. Progress 0 to 1 maps to the camera along the curve. Normal scrolling is never trapped: a visible "skip gallery" link and a progress hint are always present                                          | PLANNED |
| FR-02 | Left-curving corridor    | One smooth left sweep. The camera never clips a wall at any progress value or screen aspect ratio                                                                                                                                                                   | PLANNED |
| FR-03 | 12 photo frames          | Frames come from `config.gallery`. Order is whatever the config says. Mixed orientation. Each is clickable                                                                                                                                                          | PLANNED |
| FR-04 | Decor pieces             | 3 to 5, non-clickable, not in the tab order, hidden from screen readers or labelled as decoration                                                                                                                                                                   | PLANNED |
| FR-05 | End frame                | Spotlit portrait. Reaching it hands off to the next section. If the portrait is missing in config, fall back to a prototype image                                                                                                                                   | PLANNED |
| FR-06 | Hover and tap affordance | Soft gold glow on hover, pointer cursor, one-time hint ("tap a frame"). Touch devices get the hint without hover                                                                                                                                                    | PLANNED |
| FR-07 | Inspect                  | Camera turns to the frame. Other frames dim. Scroll locked, Lenis stopped. Saved progress restored on return                                                                                                                                                        | PLANNED |
| FR-08 | Controls                 | Back button, Esc, tap outside, Previous, Next, swipe. All keyboard operable                                                                                                                                                                                         | PLANNED |
| FR-09 | Gold note                | Optional `note` string per photo (one short line). Tiny gold text with floating hearts. If `note` is empty, show hearts only. No title captions                                                                                                                     | PLANNED |
| FR-10 | Heart companion          | A small gold heart ahead of the camera. Pulses on inspect. Drops out on low tiers (see section 11)                                                                                                                                                                  | PLANNED |
| FR-11 | Light motes              | Subtle drifting points near the camera. Drop out on `low`                                                                                                                                                                                                           | PLANNED |
| FR-12 | Floor reflection         | Faked. Drops out first on `mid`                                                                                                                                                                                                                                     | PLANNED |
| FR-13 | Doorway entry            | A soft light bloom and door frame at the start of the walk as the previous section hands over                                                                                                                                                                       | PLANNED |
| FR-14 | Fallback                 | `static` tier, Calm mode, reduced motion and no WebGL render the existing masonry with the Radix lightbox. Hearts or notes appear in the lightbox if the config has them                                                                                            | PLANNED |
| FR-15 | Accessibility            | Every frame has a DOM twin button with an accessible name. Tab moves through frames, Enter opens, arrows move between frames in inspect mode, Esc closes. Focus returns to the twin on close. A comfort control reduces sway and vignette separately from Calm mode | PLANNED |
| FR-16 | Cleanup                  | Dispose textures, geometries, materials and listeners when the section is left. Re-entering must work without leaks                                                                                                                                                 | PLANNED |
| FR-17 | Mobile                   | Full walk on phones within the budget in section 11. Native touch scroll drives the walk. Tap opens a frame                                                                                                                                                         | PLANNED |
| FR-18 | Fast scrolling           | Fast scrolls, direction changes and mid-tween scrolls never leave the camera, Lenis or state half-finished                                                                                                                                                          | PLANNED |

---

## 9. Technical design and file impact

Paths are relative to `src/features/love/` unless stated. Existing files are named in the project documents (VERIFIED as documented). New files are **proposed names** (PLANNED): Claude Code must follow the repo's actual conventions and may rename them in the plan.

| File                                           | Purpose                                                                       | Expected impact                                                                                                        | Status   |
| ---------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| `sections/gallery.tsx`                         | Gallery section wrapper, pin container, DOM twins, controls, fallback masonry | Modify. Keep the masonry as the static path                                                                            | existing |
| `engine/story.ts` (`buildGallery`)             | Gallery scroll timelines                                                      | Modify. Replace the batched reveal with the pinned walk for the motion path; keep the static application for calm mode | existing |
| `ui/lightbox.tsx`                              | Radix lightbox                                                                | Keep for fallback. Optionally show the gold note                                                                       | existing |
| `canvas/love-canvas.tsx`                       | The single canvas and camera rig                                              | Modify. Add `cameraMode` arbitration and mount `GalleryWalk`                                                           | existing |
| `engine/tiers.ts`                              | Quality tiers                                                                 | Modify. Add gallery feature flags per tier                                                                             | existing |
| `config/types.ts` and `config/sites/<slug>.ts` | Content config                                                                | Modify. Add `note?: string` to gallery items and an `endPortrait`                                                      | existing |
| `canvas/gallery-walk.tsx`                      | Scene root for the corridor                                                   | New                                                                                                                    | PLANNED  |
| `canvas/gallery-corridor.tsx`                  | Walls, floor, ceiling, wainscot                                               | New                                                                                                                    | PLANNED  |
| `canvas/gallery-frames.tsx`                    | Photo frames, decor, end frame                                                | New                                                                                                                    | PLANNED  |
| `canvas/gallery-lights.tsx`                    | Brass lights, motes, fog, reflection                                          | New                                                                                                                    | PLANNED  |
| `canvas/gallery-camera-rig.tsx`                | Walk and inspect camera                                                       | New                                                                                                                    | PLANNED  |
| `engine/gallery-path.ts`                       | Curve definition and placement maths                                          | New                                                                                                                    | PLANNED  |
| `engine/gallery-state.ts`                      | Plain mutable state (`progress`, `mode`, `activeIndex`)                       | New                                                                                                                    | PLANNED  |
| `engine/gallery-director.ts`                   | Walk and inspect transitions, input guarding                                  | New                                                                                                                    | PLANNED  |
| `ui/gallery-controls.tsx`                      | Back, Prev, Next, hint, skip link                                             | New                                                                                                                    | PLANNED  |
| `ui/gallery-note.tsx`                          | Gold note and hearts overlay                                                  | New                                                                                                                    | PLANNED  |
| `public/textures/gallery/`                     | CC0 maps (compressed, with credits)                                           | New                                                                                                                    | PLANNED  |
| `scripts/prepare-love-images.mjs`              | Image pipeline                                                                | Modify. Add the end portrait and a 1024 px mobile size                                                                 | existing |
| `dev/gallery-debug-panel.tsx`                  | Dev-only free camera, curve view, fps, progress scrubber                      | New, not shipped                                                                                                       | PLANNED  |

**Data model impact.** There is no database. Only the typed config changes: `note?: string` per photo and `endPortrait: PhotoRef`.

**API impact.** None.

**UI impact.** New pin container, progress hint, skip link, Back/Prev/Next, note overlay, and a comfort control. Responsive behaviour: controls must be thumb-reachable on a 375 px wide phone, and respect safe-area insets.

---

## 10. Security, privacy and permissions

- The page stays `noindex`, with no analytics and no names in metadata (existing rules).
- No new network calls. Textures are static files in `public/`.
- CC0 textures need no attribution, but record the source and licence in the repo anyway.
- Real photos are private content. Do not log image URLs or put them in Open Graph tags.
- No new permissions are needed.

---

## 11. Performance, tiers and budgets

Targets to measure on real devices (not guarantees):

- Desktop: 60 fps. Mid-range Android: 40 fps or better. iPhone: 50 fps or better.
- Under about 80 draw calls and about 150k triangles in the gallery scene.
- Texture memory under about 150 MB on mobile.
- DPR cap follows the existing tier table (1.75, 1.5, 1.0).

| Feature                  | `high`        | `mid`         | `low`              | `static`         |
| ------------------------ | ------------- | ------------- | ------------------ | ---------------- |
| Corridor, frames, camera | On            | On            | On                 | Masonry fallback |
| Real lights              | 3             | 2             | 1                  | –                |
| Bloom                    | On            | On, reduced   | Off (glow sprites) | –                |
| Floor reflection         | On            | Off           | Off                | –                |
| Light motes              | On            | Reduced       | Off                | –                |
| Heart companion          | On            | On            | Off                | –                |
| Photo texture size       | 1600 px       | 1024 px       | 1024 px            | DOM images       |
| Resident textures        | Camera plus 5 | Camera plus 4 | Camera plus 3      | –                |

Drop order when the frame rate falls: floor reflection, motes, heart companion, reduced bloom. The core walk must always remain. These values are **PROPOSED**, to be confirmed by measurement in the plan.

Techniques: merge corridor meshes, instance frame borders and wall lights, mipmapped compressed textures, load textures as the section approaches (priority to the first frames), blur placeholders until a texture is resident, dispose when leaving.

---

## 12. Implementation milestones

Phase 11 ended at M40 per the documents provided. **UNCERTAIN:** later work may have used more numbers. Re-check before numbering. Proposed: M41 to M46. Each milestone follows the repo workflow (`/plan`, then `/blueprint`, then `/implement`), small commits, and never starts on a failing build.

**M41. Foundations and approvals**

- Re-verify every item in section 4 against the code. Report differences.
- Draft two ADRs (next free numbers): gallery walk architecture and camera arbitration; CC0 texture policy.
- Choose texture sources and record licences. Choose and test the pointer-routing approach on a bare mesh in the real canvas.
- Add config fields (`note`, `endPortrait`) and update the image script.
- Exit: ADRs drafted, texture list approved, a clickable test mesh works in the live canvas, build passes.

**M42. Corridor prototype (no photos)**

- `gallery-path.ts`, corridor geometry, camera rig, pinned scroll progress, debug panel.
- Tune the curve so the camera never clips walls at several aspect ratios.
- Exit: smooth walk at all scroll speeds, desktop and a real phone, no clipping, `cameraMode` arbitration proven (heart rig inactive during the walk).

**M43. Frames, decor, lighting**

- 12 frames with prototype photos, decor, end frame, brass lights, fog, warm glow, doorway entry.
- Texture loading and disposal. Placeholder blur.
- Exit: the look matches the chosen reference, draw calls and texture memory within budget on the `mid` tier.

**M44. Inspect mode**

- State machine, camera tweens, dim others, gold note and hearts, Back/Esc/outside/Prev/Next/swipe, DOM twins.
- Exit: no stacked tweens under rapid input, scroll position restored exactly, keyboard-only use works, focus returns correctly.

**M45. Extras and tiers**

- Heart companion, motes, floor reflection. Wire all tier flags and the drop order. Comfort control.
- Exit: each extra can be dropped by tier without breaking the walk. `PerformanceMonitor` step-down verified.

**M46. Integration, fallback and QA**

- Handoff from the previous section and to the next. Static path (masonry plus lightbox with note) for `static`, Calm and reduced motion. Fix the known calm-mode fade gap.
- Fast-scroll stress test, 375 px layouts, real iPhone and mid-range Android, contrast on the note, keyboard and screen-reader pass.
- Update the docs and session log.
- Exit: all acceptance criteria below met, or the exceptions are written down.

---

## 13. Testing and verification

**Tests required (none have been run, because nothing is built):**

| Area        | Test                                                               | Expected                                             |
| ----------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| Camera      | Scroll from 0 to 1 at slow, medium and extreme speed, then reverse | Smooth, no jumps, no wall clipping                   |
| Arbitration | Enter and leave the section repeatedly                             | Heart rig and gallery rig never both move the camera |
| Inspect     | Click rapidly across frames, press Esc mid-tween                   | No stacked tweens, state ends consistent             |
| Restore     | Open a frame, close it                                             | Same scroll position and camera pose                 |
| Pointer     | Click frames on desktop and tap on iOS Safari                      | Opens reliably, no lost events                       |
| Tiers       | Force each tier                                                    | Features drop in the documented order                |
| Memory      | Enter and leave 10 times                                           | No growth in textures or geometries                  |
| Fallback    | WebGL off, reduced motion, Calm, `static`                          | Masonry and lightbox work fully                      |
| Keyboard    | Tab, Enter, arrows, Esc                                            | Fully operable, visible focus                        |
| Contrast    | Gold note on the dimmed scene                                      | Meets 4.5:1 or a scrim is added                      |
| Performance | Real iPhone and mid-range Android                                  | Within the section 11 targets                        |

**Acceptance criteria.** All requirements FR-01 to FR-18 pass, the build, lint and type-check pass, and no test above is reported as passed unless it was run.

---

## 14. Risks and limitations

| Risk                                                   | Likelihood    | Impact | Mitigation                                                                  |
| ------------------------------------------------------ | ------------- | ------ | --------------------------------------------------------------------------- |
| Two systems move the camera                            | High          | High   | `cameraMode` flag, tested in M42                                            |
| Clicks lost behind DOM layers                          | Medium        | High   | Reuse the orb solution, test in M41 first                                   |
| Phone GPU and thermal load (full 3D on mobile)         | High          | High   | Tiers, budgets, drop order, DPR cap, measured on real devices               |
| Scroll-jacking fatigue                                 | Medium        | Medium | 500 to 600 vh, visible progress, skip link, never trap scrolling            |
| Camera clips walls on sharp bends or odd aspect ratios | Medium        | Medium | Gentle curve, debug panel, multi-aspect tests                               |
| iOS Safari viewport resizing mid-scroll                | Medium        | Medium | `lvh` sizing, `ignoreMobileResize`, real iPhone test                        |
| Procedural look reads as flat                          | Medium        | Medium | CC0 textures, tuned lights, warm fog; Blender GLB kept as a deferred option |
| Motion discomfort                                      | Low to medium | Medium | Separate comfort control, reduced sway, vignette                            |
| Texture memory growth                                  | Medium        | Medium | Residency window and disposal                                               |
| Camera motion exceeds the 400 ms UI motion token       | Certain       | Low    | Record a motion exception in the ADR, as earlier 3D events did              |

---

## 15. Open questions

**Blocking.** None.

**Non-blocking, needed before launch.**

- The real 12 photos and the end portrait.
- Optional one-line notes per photo.
- Whether the end frame is clickable for inspect.
- Where the end frame hands off: depends on whether the Dance section or the Phase 11 reel is live.
- Exact texture picks (ambientCG or Poly Haven) and their size budget.
- Whether `note` text should also be shown in the fallback lightbox.

**Decisions Claude Code must raise in its plan.** Final milestone numbers, ADR numbers, pointer-routing choice, whether the end frame is clickable, and the final tier values.

---

## 16. Documents to update when done

`Technology-Stack.md` (only if a package is added), `Love-Site-Experience-Guidebook.md` (section 11 Gallery becomes the walk), `Love-Site-Implementation-Phases.md` (add Phase 12), `Love-Site-Improvement-Report.md` (mark G6 superseded), `PLAN.md`, `AGENTS.md` (any new stable rule), `docs/AI_SESSION_LOG.md` (each session), `docs/decisions/DECISIONS.md`.

---

## 17. AI agent handoff context

**Objective.** Replace the Love Site Gallery with a scroll-driven, left-curving 3D corridor with click-to-inspect, inside the existing single canvas.

**Agreed approach.** Option A (procedural R3F corridor), warm classic look, 12 photo frames, 3 to 5 decor pieces, large end portrait, gold note with hearts, previous/next, full 3D on mobile, CC0 textures, four first-version extras, masonry plus lightbox as the fallback.

**Hard constraints.**

- One `<Canvas>` only. Per-frame work in `useFrame`. No `setState` per frame.
- All motion on the GSAP ticker. Lenis stopped during inspect.
- No Blender, Spline or GLB. No new packages without approval.
- No real-time shadows, `transmission`, SSAO, or depth of field.
- Pin exact dependency versions if any are added. Prefer releases at least 14 days old.
- kebab-case file names, PascalCase components.
- Private, `noindex`, no analytics, no names in metadata.
- Follow `/plan`, `/blueprint`, `/implement`. Do not invent a parallel workflow.
- Never start the next milestone on a failing build.

**Patterns to reuse.** Mutable state object plus `useFrame`, tier system and `PerformanceMonitor`, DOM twin buttons, pointer-routing solution from the orbs, Radix dialog and Lenis stop/start, `gsap.matchMedia` with `motion` and `mobile` conditions, `applyStaticStory` for calm mode.

**High-risk areas.** Camera arbitration, click routing, phone performance, scroll restore after inspect, texture disposal.

**Do not assume.** Do not assume file names in section 9 exist or are right. Do not assume ADR or milestone numbers. Do not assume the Dance section state. Do not assume any test has been run. Do not claim anything works in a browser unless it was checked in one.

---

## 18. Glossary

- **Walk and inspect**: the two modes of the gallery (moving along the corridor, or looking at one photo).
- **DOM twin**: an invisible real button placed over a 3D object so keyboard and screen-reader users can use it.
- **Tier**: a quality level (`high`, `mid`, `low`, `static`) that turns features on or off by device power.
- **Mote**: a tiny drifting light particle.
- **CC0**: a licence that places a work in the public domain, with no attribution required.
- **Pin**: holding a section in place on screen while scroll continues to drive an animation.

---

## 19. References

**Project files and internal evidence.** `Love-Site-Experience-Guidebook.md` (v2.0, section 11 Gallery), `Love-Site-Tech-Stack-and-Tools.md` (sections 5, 7, 8, 13), `Love-Site-Implementation-Phases.md` (R1 to R8, phase list), `Love-Site-Improvement-Report.md` (G1 to G6), `Scroll-3D-Guide-Complete.md`. These were read from the project files; the repo code itself was not available in this session.

**Owner decisions.** Project discussion on 2026-11-23 (look, photo count, end frame, note style, extras, textures, mobile).

**Not yet researched.** Specific CC0 texture picks, and current R3F and drei API details for the installed versions. Claude Code must check these against the installed versions and official documentation.
