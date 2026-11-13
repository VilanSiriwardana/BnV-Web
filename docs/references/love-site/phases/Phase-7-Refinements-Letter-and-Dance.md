# Phase 7 — Refinements, Premium Letter and the Dance

| Field      | Value                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | In progress (started 2026-11-13)                                                                                                       |
| Milestones | M17 (hero + gate polish), M18 (timeline spiral + arrow), M19 (letter), M20 (ambient hearts), M21 (dance)                               |
| Blueprint  | `.claude/blueprints/039-love-site-phase-7-refinements-letter-dance.md`                                                                 |
| Guidebook  | [Experience Guidebook §19](../Love-Site-Experience-Guidebook.md#19-phase-7-refinements) overrides §5, §6, §9 and §13 where they differ |

## 1. Context

Owner review after Phase 6 asked for: a calmer hero glow, a heart that rises with the title, a premium gate, a spiral timeline that reads on mobile with the arrow strike after the birthdate, a premium love letter that unrolls like an ancient scroll (and opens by scrolling), ambient heart clusters, and a new 3D dancing-duo section. No new dependencies.

## 2. Decisions

| #   | Decision                                                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------- |
| D1  | Letter text is drafted by Claude in the site config; the owner edits it                                                       |
| D2  | Dancing duo = particle silhouette couple (10 key poses sampled into 32 frames), like the heart (revised from low-poly meshes) |
| D3  | Scroll auto-open of the letter only when there is **no** passphrase                                                           |
| D4  | Dance section sits **after Gallery**, before Wish                                                                             |
| D5  | Improvement analysis saved as `Love-Site-Improvement-Report.md`                                                               |

## 3. Read first

`engine/hero-intro.ts`, `engine/heart-path.ts`, `engine/heart-director.ts`, `engine/story.ts` (`buildTimeline`, `buildLetter`), `engine/timeline-progress.ts`, `sections/{gate,timeline,letter}.tsx`, `canvas/{mini-hearts,love-canvas}.tsx`.

## 4. Step-by-step

### Part A — Hero and gate (M17)

1. **Glow lock.** The hero resting glow equals the intro glow (0.6). The 6 s `shine` is removed from the intro so nothing crosses the bloom threshold afterwards. _You should see:_ no brightening once the intro settles.
2. **Float-up.** The intro move ends slightly low; from 3.4 s (title start) the heart rises to its hero pose over ~2.6 s, `sine.inOut`.
3. **Gate.** The pill button becomes a glowing heart `<button>` (it is the 3D seed). Script text "Tap this" with a hand-drawn gold arrow pointing at it; double gold frame and canvas grain. Loading ring stays around the heart.

### Part B — Timeline (M18)

4. Mobile: extra space under the title so nodes and cards never overlap it.
5. The thread is a spiral (wide on desktop, tall winding on mobile); nodes sit on the spiral at the existing node fractions.
6. The arrow strike fires once the heart leaves the last node (birthdate), on desktop and mobile; it rearms only after scrolling back before that node.

### Part C — Letter (M19)

7. Parchment card: grain, gold double stripes, corner curls, ribbon band, small hearts, drop cap.
8. Section background: canvas grain plus three depth layers of tiny gold hearts (parallax), behind the letter UI.
9. Opening: seal breaks, rods part, parchment unrolls (~1.6 s), paragraphs fade in. If the visitor keeps scrolling (≈55 % of the stage) without opening, it opens by itself — only when there is no passphrase. Calm / reduced: shown open.

### Part D — Ambient hearts (M20)

10. Every 4–9 s (random) a cluster of 3–6 small hearts pops at a random off-centre point, only when no petals are on screen, the tab is visible, motion is allowed and the tier is not `low`.

### Part E — Dance (M21)

11. New section after Gallery: a particle silhouette couple built like the heart (blueprint 041; replaced the first low-poly mesh version after owner review). Eight side-view poses (walk-in, hands join, hand on waist, under-arm turn ×2, embrace, lean, dip) blended on the GPU; static / low tier show the dip pose as SVG. Copy appreciates the dance partner.

## 5. Exit checklist

- [ ] lint, type-check, `vitest`, build pass
- [ ] Hero glow flat after intro; heart rises with the title
- [ ] Timeline readable at 390 px; arrow after birthdate, no double fire
- [ ] Letter opens by hold, Enter and scroll (no passphrase); calm shows it open
- [ ] Clusters only when petals are absent; dance plays and falls back on low/static
- [ ] ≥ 40 fps on mid tier

## 6. Docs

Guidebook §19, Implementation Phases §3/§10, `phases/README.md`, `AI_SESSION_LOG.md`, improvement report.

## Blueprint 042 follow-ups

- Formed-heart alpha is reduced to 60% and the hero beat is damped.
- Letter stage is 300 vh; auto-open is at 35% of its pin range, with one scroll correction after a fling.
- Mobile thread spans 12?88% of the width, and date labels flip on the right.
- Ambient hearts are 12 independent edge twinkles with separate lifetimes.
- Dance uses 10 key poses, 32 sampled frames, a raised leg in the dip and a float position texture.
