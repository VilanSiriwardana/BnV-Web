# Phase 11 — Dance Reel

| Field         | Value                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version       | 1.0                                                                                                                                                 |
| Status        | Planned. **Run `/plan` for this phase before building**; clip production (M38) starts now, in parallel with Phases 8–10                             |
| Milestones    | M38 (clip gate, owner task), M39 (DanceReel player), M40 (final clip and removal of the particle dancers)                                           |
| Prerequisites | M38 passed (a clip that meets the quality bar); Phase 10 exit checklist complete; Phase 8 look and button system merged                             |
| Previous      | [Phase 10](Phase-10-Afterglow-Room-and-QA.md)                                                                                                       |
| Spec          | [Love-Site-Romance-Additions.md](../Love-Site-Romance-Additions.md) §9.3 (U3) · [Dance-Clip-Production-Guide.md](../Dance-Clip-Production-Guide.md) |
| Guidebooks    | [Experience](../Love-Site-Experience-Guidebook.md) §11b (Dance) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)                                |

Paths below are relative to `src/features/love/` unless they start with `app/`, `src/`, `public/`, `scripts/` or `docs/`.

> **Status note (2026-11-27):** the first clip is built as a separate `#dance-reel` section after the particle Dance, which is kept (blueprint 080, ADR-0034 amendment). Step 12's removal does not apply while both stay.

---

## 1. Context

The particle-silhouette couple cannot reach the quality wanted, especially in the contact moments and the dip (spec §9.0, screenshots 2–5). The Dance becomes a **pre-made couple clip played by scroll like a record**: an AI-generated, stylised 3D couple with your exact likenesses (with her consent), exported as frames and drawn to a 2D canvas. The section, its copy (`danceTitle`, `danceLine`), the 250 vh stage and the heart pulse on the dip stay.

This is the last phase because the clip has the longest lead time and the player depends on its frames, beats and look. The player is source-agnostic: if AI generation fails the quality bar, filmed footage (spec §9.3.1 route A) uses the same pipeline.

---

## 2. What you will see at the end

- In the dark, a couple hold hands, he lifts the joined hand, she spins once under his arm, they come close, and he guides her into a gentle side dip held for a moment. Smooth forwards and backwards at any scroll speed.
- The heading top-left (top-centre on mobile); the small heart top-right; a soft spotlight pool on the floor; a very slow zoom on desktop.
- Heart events fire on the real beats: `pulse` when hands join, a soft `shine` on the spin, `pulse` + tap hearts at the bottom of the dip.
- On a slow connection, posters show until frames arrive; never an empty stage.

---

## 3. Read first

| What                                        | Where                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| Dance spec, player, budgets, acceptance     | Spec §9.3, §9.3.1–§9.3.3, §11, §13                                         |
| Clip production, score sheet, test protocol | [Dance-Clip-Production-Guide.md](../Dance-Clip-Production-Guide.md) §3–§16 |
| Current section and builder                 | `sections/dance.tsx`, `engine/story.ts` (`buildDance`, lines 432–481)      |
| Heart pose and tiers                        | `engine/heart-path.ts` (`HEART_PATH.dance`), `engine/tiers.ts`             |
| Removal blast radius (verified)             | Spec §9.3 "Removal blast radius"                                           |
| Existing image script                       | `scripts/prepare-love-images.mjs` (sharp)                                  |
| Decision record                             | ADR-0034 (drafted in Phase 8)                                              |

---

## 4. Tech and tools used in this phase

| Tool                                                | Role                                                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Owner's video tools (Seedance 2.5, Kling 3.0)       | Clip generation (M38, outside the repo)                                                             |
| System `ffmpeg` (dev-time only)                     | Normalise, join, retime, extract frames                                                             |
| `sharp` (already used by Next and the image script) | WebP conversion with alpha, posters                                                                 |
| 2D canvas, `fetch`, `createImageBitmap`             | Drawing and decoding frames                                                                         |
| GSAP + ScrollTrigger                                | Scroll progress, beats, slow zone, zoom                                                             |
| Vitest 3                                            | `dance-reel-math` tests                                                                             |
| Skills                                              | `gsap-scrolltrigger`, `gsap-performance`, Emil `animation-performance`, `break-ui`, `mobile-native` |

### 4.1 Rules for this phase (smooth, fast, mobile)

- **One clock:** the eased progress and the frame draw run in `gsap.ticker`; no `setState` per frame; reuse buffers.
- **Memory:** decode only inside a sliding window and call `bitmap.close()` on eviction; check the Memory panel.
- **Network:** start loading after the gate tap; first frame, then every 8th, then by proximity; 3–4 concurrent fetches.
- **Canvas:** DPR capped at 1.5; one 2D canvas; draw only when the frame or blend changes.
- **Tiers:** `high`/`mid` desktop set; `low` mobile set; `static` and reduced motion use the two posters crossfaded by scroll.
- **Mobile:** mobile set at about 88 % width; no zoom; heart stays in its corner.
- **Brand:** tokens only; no new npm dependency (`ffmpeg` is an external dev tool, not a package).

---

## 5. Step-by-step

### Part A — Clip gate (M38, owner task, starts now)

**Step 1 — Consent and photos.** Record her consent (production guide §14.1); collect the photos (§14.2).

**Step 2 — Character sheets, couple reference and five keyframes** (§4, §5, §14.3). Run the blind likeness check.

**Step 3 — Tool test.** T1 (the spin) on both Seedance 2.5 and Kling 3.0, five takes each, logged and scored (§7, §15). Apply the decision rule (§15.4), then T2 and T3 on the winner. If neither passes, follow §15.5.

**Step 4 — Assemble.** Chain S1–S3 with the real last frames (§6.1), trim to 8–10 s, interpolate if steppy, grade, remove the background (§9).
_Done when:_ the clip meets the quality bar (spec §9.3.1, production guide §11). Record the tool decision note for ADR-0034 (§15.6).

### Part B — DanceReel player (M39), confirm details in `/plan` first

**Step 5 — `scripts/prepare-dance-reel.mjs`.** From the final clip: extract at the stored rate with `ffmpeg`, convert with `sharp` to WebP with alpha (quality about 70–78) at desktop 720 × 960 and mobile 480 × 640, write `posters/start.webp`, `posters/dip.webp` and `manifest.json` (spec §9.3.3 shape) into `public/dance-reel/`. Include a `--placeholder` mode that generates a synthetic numbered sequence so the player can be built before the clip exists.

**Step 6 — `engine/dance-reel-math.ts` (+ test).** Pure helpers: frame index and blend fraction from progress; damping (rate about 8); slow zone over the last 10 %; window selection (±16 desktop, ±12 mobile); load order (first, every 8th, then by distance). Test edges: progress 0 and 1, reverse direction, frame count 1, wrap-free windows.

**Step 7 — `engine/dance-reel-loader.ts`.** Reads the manifest, picks the set by tier, fetches with a small concurrency pool, keeps blobs, decodes with `createImageBitmap` inside the window, closes evicted bitmaps, exposes `beats`, and falls back to posters on failure. Starts after the gate (when `audio.start` has run or the gate is dismissed).

**Step 8 — `sections/dance-reel.tsx` and layout** (`sections/dance.tsx`). One 2D canvas (`role="img"`, `aria-label` describing the dance) centred in the lower 70 %; draw frame `i` and blend `i+1` by the fraction. Heading and line top-left (top-centre on mobile); a dim elliptical spotlight pool on the floor; a scrubbed zoom 1 → 1.06 on desktop only; a few existing sparks near the couple.

**Step 9 — Heart pose and story** (`engine/heart-path.ts`, `engine/story.ts`). `HEART_PATH.dance` → desktop (0.72, 0.5) s0.16, mobile (0.78, 0.70) s0.14. In `buildDance`, drive the reel progress from the existing `top top` → `bottom bottom` trigger and fire `pulse` (join), `shine` (spin start) and `pulse` + `spawnTapHearts(6)` (dip) from `manifest.beats` instead of hard-coded numbers.

**Step 10 — Tiers and coexistence** (`engine/tiers.ts`, `canvas/love-canvas.tsx`). Add reel set selection per tier. Keep `DanceDuo` behind a flag (off when the reel is active) until QA passes, so you can switch back instantly.
_You should see:_ smooth scrubbing on a mid-range phone with the placeholder; posters on a blocked network.

### Part C — Final clip (M40)

**Step 11 — Swap in.** Run the script on the final clip; measure the beats; tune the slow zone and the heart events; check budgets (desktop ≤ 4–5 MB, mobile ≤ 2.5 MB).

**Step 12 — Remove the particle dancers** once QA passes: `canvas/dance-duo.tsx`, `canvas/dance-geometry.ts`, `canvas/dance-shaders.ts`, `canvas/dance-silhouettes.ts`, `engine/dance-state.ts`, `engine/dance-state.test.ts`, `canvas/dance-geometry.test.ts`, the `DanceDuo` mount at `canvas/love-canvas.tsx:71`, the silhouette imports in `sections/dance.tsx`, the `dance` import in `engine/story.ts`, and `danceParticles` in `engine/tiers.ts`. Accept **ADR-0034** with the tool decision note.

### Open questions to settle in this phase's `/plan`

- Stored frame count and rate (about 120–144 at 12–16 fps) vs ghosting.
- Alpha matte vs the plum-background fallback with a radial mask (production guide §9 step 6).
- The exact beats and how long the dip's slow zone should feel.
- Whether the low tier gets the mobile set or posters only, based on measured memory.
- Load start: immediately after the gate, or when the Gallery is reached.

---

## 6. Testing record template (copy into the session log)

```text
Phase 11 — <milestone> — <date>
Build: lint ☐ typecheck ☐ test ☐ build ☐
Scrub: wheel ☐ trackpad ☐ touch ☐ forwards ☐ backwards ☐ fast ☐
Network: Slow 4G no blank frames ☐ blocked → posters ☐
Memory (Performance panel): desktop ___ MB  mobile ___ MB
Tiers: high ☐ mid ☐ low ☐ static/reduced (posters) ☐
Layout: heading and heart never overlap at 375 ☐ 1440 ☐
Quality bar: faces ☐ hands ☐ feet ☐ spin ☐ dip ☐ dip still romantic ☐
Real devices: iPhone ☐ Android ☐
```

---

## 7. Exit checklist

- [ ] Clip meets the quality bar; tool decision recorded
- [ ] `dance-reel-math` tests pass
- [ ] Spin and dip play smoothly forwards and backwards at any scroll speed on a mid-range phone
- [ ] No blank stage on a slow or failed connection; posters work
- [ ] Budgets met (weight and decoded memory)
- [ ] Heading and heart never overlap; slow zone feels intentional
- [ ] Old particle-dance code and tests removed; ADR-0034 accepted
- [ ] lint, typecheck, `vitest`, build pass

---

## 8. Risks and fallbacks

| Risk                                  | Fallback                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| AI clip fails the quality bar         | Film the problem segment (route A) or the whole dance; the player is unchanged |
| Frame weight too high on mobile       | Lower quality, fewer frames, or posters-only on low tier                       |
| Decoded memory crashes low-end phones | Smaller window; mobile set; close bitmaps aggressively                         |
| Matting leaves hair or skirt halos    | Plum-background fallback with a radial mask and floor spotlight                |
| Consent changes                       | Drop the clip; keep the posters or revert to the flagged `DanceDuo`            |

---

## 9. Docs and governance updates

- Experience Guidebook §11b (Dance) and the tier table to as-built; remove the particle-dance description.
- Spec §9.3: record the final manifest values and beats.
- ADR-0034 accepted; production guide §15.6 note added.
- `docs/governance/PROGRESS.md`, `progress.md` and `docs/AI_SESSION_LOG.md`.

---

## 10. Commit plan

1. `feat(love): dance reel prepare script with placeholder mode`
2. `feat(love): dance reel math and loader`
3. `feat(love): dance reel player, layout and heart pose`
4. `feat(love): final dance clip and beats`
5. `refactor(love): remove particle dancers`
6. `docs(love): dance as-built and ADR-0034`

---

## 11. After this phase

All Romance Additions are built. Run the release items that remain open in the Experience Guidebook §0.5 (real photos, music licence, deploy, device QA) before sharing the link.
