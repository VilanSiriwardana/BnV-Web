# Love Site — Improvement Report

| Field  | Value                                                                                      |
| ------ | ------------------------------------------------------------------------------------------ |
| Date   | 2026-11-13 (written during Phase 7)                                                        |
| Scope  | Performance, the gallery, and ideas for new birthday sections                              |
| Status | Proposals only. Nothing here is built. Each item needs owner approval and its own `/plan`. |

Confidence: **Checked** = read in the repo. **To measure** = needs a real device or Lighthouse run first.

---

## 1. Performance

| #   | Proposal                                                                                                                                                 | Why                                                                              | Effort | Confidence |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------ | ---------- |
| P1  | Pause the canvas (`frameloop="demand"` or `never` plus `advance()`) while the gate shows and while no 3D element is in view (gallery tiles, letter text) | The R3F loop renders every frame even when the heart is a small corner companion | M      | To measure |
| P2  | Drop the DPR cap to 1.25 on `mid` while bloom is on                                                                                                      | Bloom cost grows with pixel count; mid phones are the bottleneck                 | S      | To measure |
| P3  | Mount Memory orbs, Wish star, Confetti and the Dance duo only while their section is near (IntersectionObserver flag in the section, read by the canvas) | Fewer `useFrame` callbacks and less GPU memory early in the page                 | M      | Checked    |
| P4  | Merge the duo's 11 meshes into 2 skinned or merged geometries if the draw-call budget (< 60) gets tight                                                  | Phase 7 added 11 calls for the duo and 1 for ambient hearts                      | M      | To measure |
| P5  | Kill or `disable()` ScrollTriggers of sections far from the viewport (keep `refresh` cheap)                                                              | `story.ts` now registers about 30 triggers                                       | M      | To measure |
| P6  | Preload the music only after the gate tap, with `preload="none"` before                                                                                  | Saves bandwidth on the first paint (gate LCP)                                    | S      | To measure |
| P7  | Run `npm run build` with bundle analysis and confirm the 3D chunk stays ≤ 450 KB gzip (Tech Stack §8.1)                                                  | Not measured since Phase 6                                                       | S      | To measure |

## 2. Gallery

| #   | Proposal                                                                                                             | Why                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| G1  | Give tiles a fixed `aspect-ratio` from config `width/height`, so the masonry never reflows as images decode          | Removes layout shift and late `ScrollTrigger.refresh()` calls                     |
| G2  | `priority` only on the first visible tile; others `loading="lazy"` with `fetchPriority="low"`                        | Today the first three tiles are `priority`, but the gallery is far below the fold |
| G3  | Tighter `sizes` (`(min-width: 1024px) 22rem, (min-width: 768px) 30vw, 46vw`)                                         | Smaller downloads; AVIF/WebP already enabled in `next.config.ts`                  |
| G4  | Lightbox: preload only the next and previous photo; render only three slides                                         | Large photos stay out of memory                                                   |
| G5  | Replace the per-tile clip-path reveal with one batched opacity/translate reveal on `low` (already) and on `mid`      | Clip-path animation repaints on mid phones                                        |
| G6  | Optional "story mode": a horizontal pinned filmstrip on desktop with captions, falling back to the masonry on mobile | More cinematic, fewer images on screen at once                                    |

## 3. New birthday sections (ideas)

| Idea                  | What it is                                                                                                 | Notes                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Days together counter | A gold odometer that counts up days, hours and heartbeats together, scrubbed by scroll                     | Pure DOM; needs the start date in config                      |
| Blow out the candles  | A 3D cake with candles; hold a button (or blow into the microphone, opt-in) to put them out, then confetti | Mic needs permission; button is the default and the a11y twin |
| Reasons I love you    | A deck of cards that flip one by one; tap to shuffle                                                       | Motion only; text in config                                   |
| Voice note            | A short recorded message with a waveform drawn by the existing audio analyser                              | Rights-free by nature; reuse `audio-engine.ts` bands          |
| Photo constellation   | Memories become stars that connect into the shape of a heart as you scroll                                 | Reuses the point shader and `memory-layout.ts`                |
| Wishes from friends   | A few short messages from friends, collected offline and placed in the config                              | No forms, no data collection (privacy rule)                   |
| Year in songs         | Five songs of the year with tiny clips and the heart beating to each                                       | Clips must be rights-cleared                                  |

## 4. Recommended next steps

1. Measure first (P7, Lighthouse, one real Android and one iPhone) before any performance work.
2. Do G1 to G3 (small, safe, visible).
3. Pick one new section (the candles or the days counter fit the birthday theme best) and plan it as Phase 8.
