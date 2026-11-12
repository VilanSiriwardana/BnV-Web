# Phase 6 — Fallbacks, QA, Real Content and Launch

| Field         | Value                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Version       | 1.0                                                                                                     |
| Status        | Proposed                                                                                                |
| Milestones    | M14 (fallbacks and accessibility), M15 (performance and QA), M16 (content and launch)                   |
| Prerequisites | Phase 5 exit checklist complete; owner content (overview §13) collected                                 |
| Previous      | [Phase 5](Phase-5-Day-Story-Dawn-to-Finale.md)                                                          |
| Guidebooks    | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md) |

---

## 1. Context

The experience is complete. This phase makes sure it works for every device and every person, replaces placeholders with the real story, and ships a private link. Because each earlier phase already built its reduced-motion version, M14 here is an audit and completion pass, not a rewrite.

---

## 2. What you will see at the end

- On a real iPhone and a mid-range Android phone: the gate loads quickly, the weave is smooth, Memories and the arrow strike don't stutter, the phone doesn't overheat.
- With Calm mode, OS reduced motion, or WebGL disabled: a beautiful, calm, fully readable version of every section — a CSS heart, card grids, an open letter — with native scrolling.
- Keyboard only: every interaction (gate, heart, orbs, nodes, lightbox, wish, seal, replay, music, calm) works with a visible focus ring.
- Real photos, her name, your letter and your music.
- A live private link on Vercel that search engines won't index and that shows no names in link previews.

---

## 3. Read first

| What                                    | Where                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------- |
| Static fallback                         | Tech Stack §7.5                                                        |
| Reduced-motion matrix                   | Tech Stack §9.1                                                        |
| Accessibility rules                     | Tech Stack §9.2                                                        |
| Privacy                                 | Tech Stack §9.3                                                        |
| Budgets, tiers, measuring               | Tech Stack §8.1–8.4                                                    |
| Cross-cutting tests                     | Experience §16.1                                                       |
| Device matrix and performance procedure | Experience §16.2–16.3                                                  |
| Release checklist                       | Experience §16.4                                                       |
| Content checklist                       | Experience §17; overview §13                                           |
| Hosting                                 | `docs/references/Hosting_Deployment.md`; ADR-0011 (Vercel)             |
| Brand                                   | `docs/references/Brand-Identity.md` (add a note on the two exceptions) |
| Image pipeline                          | `scripts/prepare-love-images.mjs` (Phase 1)                            |

---

## 4. Tech and tools used in this phase

| Tool                                                                             | Role                                                                                                |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Chrome DevTools (Performance, Rendering emulation, Network throttling, Coverage) | Profiling, reduced motion, slow 4G, unused JS                                                       |
| Lighthouse (mobile)                                                              | LCP, CLS, INP, accessibility                                                                        |
| `next build` output                                                              | Route and chunk sizes                                                                               |
| Screen readers (VoiceOver on iPhone/macOS, NVDA or Narrator on Windows)          | Quick pass                                                                                          |
| Real devices                                                                     | One iPhone (Safari), one mid-range Android (Chrome)                                                 |
| Vercel                                                                           | Preview and production deploys                                                                      |
| Skills                                                                           | `/impeccable audit`, Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native` |

---

## 5. Step-by-step

### Part A — Fallbacks and accessibility (M14)

**Step 1 — Static path audit.** For each section, switch to Calm, OS reduced motion and `static` tier (and disable WebGL in Chrome via `chrome://flags` or a forced `static` tier). Check against Tech Stack §9.1:

| Section  | Static expectation                             |
| -------- | ---------------------------------------------- |
| Gate     | Static seed; fade only                         |
| Hero     | Static heart (CSS/SVG) with title; no parallax |
| Bloom    | Still petal layer or none; heart formed        |
| Memories | Card grid + dialog                             |
| Timeline | Vertical card list + static thread             |
| Dawn     | Cross-fade                                     |
| Gallery  | Fades only                                     |
| Wish     | Single click completes; glow and message       |
| Letter   | Open, text visible                             |
| Finale   | Static heart; Replay jumps to top              |

- **Build missing pieces:** a CSS/SVG heart component (`ui/static-heart.tsx`) whose state changes by 200–300 ms opacity fades; confirm the canvas and Lenis are **not mounted** in static mode (check the Network tab: no 3D chunk).

**Step 2 — Keyboard pass.** Tab through the whole page. Each interactive thing reachable in a logical order with a visible `--ring` focus ring: skip link, gate button, heart twin, orb twins, timeline nodes, gallery tiles, lightbox controls, wish button, "Or tap once", seal, passphrase, replay, music toggle, calm toggle. Escape closes dialogs.

**Step 3 — Screen-reader pass.** One clean hero sentence (SplitText not read letter by letter); headings in order (`h1` hero, `h2` sections); dialogs announced with titles; wish completion and letter opening announced; decorative canvas `aria-hidden`; progress heart `aria-hidden`.

**Step 4 — Contrast and safety.** Check ≥ 4.5:1 at every resting position (Experience §3.1 table), on letter paper and on gallery caption scrims. Nothing flashes more than three times per second (bloom spikes, arrow hit). Touch targets ≥ 44 px, hold targets ≥ 88 px. Every hover effect has a focus/tap equivalent.

**Step 5 — Sinhala check** (if used): Noto Serif Sinhala fallback renders; line breaks are acceptable.

### Part B — Performance and QA (M15)

**Step 6 — Measure budgets** (Tech Stack §8.1):

| Metric                         | Target                                      | How to measure                                                           |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------ |
| Route JS before gate dismissal | ≤ 120 KB gzip                               | `next build` route output + DevTools Network (gzip column) on first load |
| 3D chunk                       | ≤ 450 KB gzip                               | Network tab when the gate loads the canvas chunk                         |
| Frame time                     | ≤ 16.6 ms typical, never sustained < 40 fps | DevTools Performance with 4× CPU; real phones via remote debugging       |
| Draw calls                     | < 60                                        | `renderer.info.render.calls` in the debug panel                          |
| Texture memory                 | < 64 MB                                     | `renderer.info.memory` + estimate (textures × size)                      |
| LCP (gate)                     | < 2.5 s on a mid-range phone, 4G            | Lighthouse mobile                                                        |
| CLS                            | ≈ 0                                         | Lighthouse                                                               |
| INP                            | < 200 ms                                    | Lighthouse / DevTools interactions                                       |
| Above-the-fold images          | < 300 KB                                    | Network tab                                                              |

**Step 7 — Tune tiers.** Force each tier; confirm `PerformanceMonitor` steps down under 4× CPU and doesn't flap. Adjust particle counts, DPR caps and bloom per tier if budgets fail. Confirm the canvas pauses when the tab is hidden.

**Step 8 — Cross-cutting tests** (Experience §16.1): fast scroll ×10, resize/rotate, tab hidden/returned, dialog + scroll, reduced motion/Calm, no audio file, no WebGL, keyboard only, screen reader, contrast, touch targets, flashing. Record pass/fail in the session log.

**Step 9 — Device matrix** (Experience §16.2): desktop Chrome, Safari, Firefox; iPhone Safari; mid-range Android Chrome; DevTools 4× CPU + Slow 4G. On phones, specifically test the first load, the weave, the arrow strike, Memories and the wish.

**Step 10 — Skill reviews.** `/impeccable audit`; Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native`. Fix findings or record why not.

### Part C — Content and launch (M16)

**Step 11 — Real photos.** Put originals in the source folder; run `scripts/prepare-love-images.mjs`; update the site config with new file names, widths, heights and blur values; write alt text for every photo. Remove the prototype `love-*` placeholders that are no longer used. No AI images ship.

**Step 12 — Real copy.** Her name, your name, birthday date; 8 memory titles/dates/captions; 5 timeline milestones with the featured "day you knew"; the letter paragraphs and sign-off (optional passphrase); wish and finale lines. Proofread; check Sinhala if used.

**Step 13 — Music.** Add the rights-cleared track to `public/audio/` (compressed, e.g. AAC/MP3 ~128 kbps), set `music.src` and `music.credit`; show the credit (e.g. in the finale). Tune analyser band ranges by eye with the real track (Experience §3.7). Mark ADR-0030 Accepted.

**Step 14 — Privacy and production checks.**

- `noindex` in the page HTML; `/love` absent from `robots.ts` and the sitemap.
- Slug long and unguessable; no names in title, description or Open Graph.
- No analytics or third-party scripts (Network tab on the production build).
- Debug panel absent in production (search the built output for the panel module; `?debug` does nothing).
- Remove ScrollTrigger `markers` and console logs.

**Step 15 — Deploy.**

1. `npm run lint`, `typecheck`, `test`, `build` all green.
2. Push the branch; create a **Vercel preview** deploy; test the preview URL on both phones and desktop.
3. Fix anything found; deploy to production (or keep the preview URL if the shop isn't public yet; confirm with the owner).
4. Final QA on the live link, phones first; run Lighthouse on the live URL.
5. Send the link.

---

## 6. Testing record template (copy into the session log)

| Test                                 | Device/browser | Result          | Notes |
| ------------------------------------ | -------------- | --------------- | ----- |
| Fast scroll ×10                      |                |                 |       |
| Resize/rotate                        |                |                 |       |
| Tab hidden                           |                |                 |       |
| Dialog + scroll                      |                |                 |       |
| Calm / reduced motion                |                |                 |       |
| No audio file                        |                |                 |       |
| No WebGL                             |                |                 |       |
| Keyboard only                        |                |                 |       |
| Screen reader                        |                |                 |       |
| Contrast                             |                |                 |       |
| Lighthouse (gate)                    |                | LCP / CLS / INP |       |
| Frame rate (weave, strike, memories) |                |                 |       |

---

## 7. Exit checklist (release, Experience §16.4)

- [ ] Every section usable without WebGL and without motion.
- [ ] Keyboard, screen-reader, contrast, touch-target and flashing checks pass.
- [ ] Budgets met on a mid-range phone; results recorded.
- [ ] Real photos everywhere; alt text written; no AI placeholders.
- [ ] Copy proofread (and Sinhala if used).
- [ ] Music licensed and credited.
- [ ] `noindex`, unguessable slug, no names in previews, no analytics or third-party scripts.
- [ ] Debug panel and markers absent in production.
- [ ] `/impeccable audit` clean; Emil reviews done.
- [ ] Deployed; final QA on the live link.

---

## 8. Risks and fallbacks

| Risk                         | Response                                                                   |
| ---------------------------- | -------------------------------------------------------------------------- |
| Budgets fail on Android      | Lower `mid` counts, cap DPR at 1.25, turn bloom off on `mid`               |
| iOS audio or viewport quirks | Audio created inside the tap; `lvh` canvas; `ignoreMobileResize`           |
| Real photos too heavy        | Re-run the script with lower quality; check sizes vs displayed size (≤ 2×) |
| Shop deploy not ready        | Use the Vercel preview URL (confirm with the owner)                        |
| Last-minute content changes  | All content lives in the config; no code changes needed                    |

---

## 9. Docs and governance updates

- `docs/decisions/DECISIONS.md`: ADR-0027 to ADR-0030 Accepted, with final notes.
- `docs/references/Technology-Stack.md`: final versions.
- `docs/references/Brand-Identity.md`: short note on the two Love Site exceptions (3D event durations, no shop chrome on `/love`).
- `docs/governance/PLAN.md` and `PROGRESS.md`: Love Site complete.
- `docs/AI_SESSION_LOG.md`: test results, Lighthouse numbers, device notes.
- [../Love-Site-Implementation-Phases.md](../Love-Site-Implementation-Phases.md): changelog line "launched".

---

## 10. Commit plan

1. `feat(love): complete static fallback and calm mode for all sections`
2. `fix(love): accessibility pass (focus, announcements, contrast)`
3. `perf(love): tune quality tiers and budgets`
4. `content(love): add real photos, copy and licensed music`
5. `chore(love): production checks and launch`

---

## 11. After launch

- Keep the slug private; if it leaks, change the slug in the config and redeploy.
- The config-driven structure is the starting point for the paid "Love Websites" product (D-09); record what would need to change (per-couple configs, admin entry, password option) as a Phase 3 product note, not now.
