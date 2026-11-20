# Phase 10 — Afterglow Room and Story QA

| Field         | Value                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| Version       | 1.0                                                                                                         |
| Status        | Proposed (2026-11-20)                                                                                       |
| Milestones    | M34 (F6 Afterglow), M35 (F7 gifts and plan), M36 (F8 Open when… and F9 hidden hearts), M37 (QA)             |
| Prerequisites | Phase 9 exit checklist complete; owner content for gifts, notes and the secret (spec §7)                    |
| Previous      | [Phase 9](Phase-9-Interactive-Heart-Moments.md) · Next: [Phase 11](Phase-11-Dance-Reel.md)                  |
| Spec          | [Love-Site-Romance-Additions.md](../Love-Site-Romance-Additions.md) §2, §3.3, §3.5–§3.7, F6–F9, §6, §7, §11 |
| Guidebooks    | [Experience](../Love-Site-Experience-Guidebook.md) · [Tech Stack](../Love-Site-Tech-Stack-and-Tools.md)     |

Paths below are relative to `src/features/love/` unless they start with `app/`, `src/` or `docs/`.

---

## 1. Context

After the Finale, a quiet room for those who linger: three gifts (one of them a real plan), sealed "Open when…" notes, and a secret room unlocked by five hidden hearts found across the page. Afterglow is in natural flow (not pinned), so normal scrolling always works. The phase ends with QA of everything built in Phases 8–10; the Dance is checked in Phase 11.

---

## 2. What you will see at the end

- Under the Finale buttons, a quiet "There's a little more…" link that glides to Afterglow.
- Three softly floating gift boxes; holding one unties the ribbon and reveals a card; the plan card shows date, place, a live countdown, **Add to calendar** and **Open in Maps**.
- Three to five sealed scrolls ("Open when you miss me", …); holding a seal opens the note on parchment in a dialog.
- Five tiny hearts hidden in Hero, Memories, Timeline, Gallery and Letter; a "3 of 5" chip; finding all five unlocks the secret room.
- Progress (gifts, notes, hearts, sky) survives a refresh on her device and survives Replay.

---

## 3. Read first

| What                                   | Where                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Afterglow, gifts, notes, hidden hearts | Spec F6, F7, F8, F9                                                                                                                  |
| Persistence and privacy                | Spec §3.3, §3.6; `engine/persist.ts` (Phase 8)                                                                                       |
| Chrome and accessibility               | Spec §3.5, §3.7                                                                                                                      |
| QA tables                              | Spec §6, §11                                                                                                                         |
| Heart path and baselines               | `engine/heart-path.ts` (`SECTION_IDS`, `HEART_PATH`), `engine/story.ts` (`baselineOn`, `sections` array), `engine/theme-timeline.ts` |
| Dialog pattern                         | `ui/memory-dialog.tsx` (Radix from `'radix-ui'`, portal to `[data-love-root]`, `data-lenis-prevent`, `lenis.stop()`)                 |
| Hold gesture                           | `hooks/use-hold.ts` (`useHold`)                                                                                                      |
| Parchment and seal ornaments           | `sections/letter-ornaments.tsx` (`ParchmentFrame`, `TinyHeart`, `HeartDivider`), `.love-parchment` in `app/globals.css`              |
| Session and Replay                     | `engine/session.ts`, `love-experience.tsx` (Replay handler)                                                                          |
| Tap hearts                             | `spawnTapHearts` in `canvas/mini-hearts.tsx`                                                                                         |

---

## 4. Tech and tools used in this phase

| Tool                                   | Role                                                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| GSAP + ScrollTrigger                   | Afterglow reveal batches, gift lid and ribbon timelines                                                                       |
| framer-motion                          | Note dialog open/close (as in the memory dialog); never on GSAP elements                                                      |
| Radix `Dialog` (`radix-ui`)            | Notes and secret room                                                                                                         |
| Blob + `<a download>`                  | `.ics` calendar file                                                                                                          |
| `localStorage` via `engine/persist.ts` | Opened gifts and notes, hidden hearts found                                                                                   |
| Vitest 3                               | `ics`, `hidden-hearts`, countdown helper                                                                                      |
| Skills                                 | `/impeccable` `critique` → `polish` → `audit`, Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native` |

### 4.1 Rules for this phase (smooth, fast, mobile)

- **One clock:** the countdown ticks at most once a second via `gsap.delayedCall` or an interval cleared on unmount; float animations are CSS transforms.
- **Cheap properties:** transforms and opacity for floating boxes, lids and seals; no `backdrop-filter`.
- **No pinning:** Afterglow uses natural flow and `ScrollTrigger.batch` for reveals (one trigger set, not one per item).
- **Hold targets ≥ 88 px**; every hold has Enter/click (keyboard) and a single click in Calm mode.
- **Dialogs:** `lenis.stop()` while open; `data-lenis-prevent` on scrollable content; focus restored on close.
- **Storage:** every read/write through `persist.ts`; features work with storage blocked.
- **Brand:** tokens only; no new dependency; no analytics; no home address in config.

---

## 5. Step-by-step

### Part A — F6 Afterglow (M34)

**Step 1 — Section wiring.** Add `'afterglow'` to `SECTION_IDS` after `'finale'`; `HEART_PATH.afterglow` desktop (0.86, −0.78) s0.20, mobile (0.80, −0.85) s0.16, gold 0.6, glow 0.4; `buildAfterglow` in `engine/story.ts` starting with `baselineOn(el, 'afterglow')` and registered in the `sections` array; a `--depth` step 0.5 → 0.7 in `engine/theme-timeline.ts`. Render `<Afterglow/>` after `<Finale/>` in `love-experience.tsx`.

**Step 2 — `sections/afterglow.tsx`.** `LoveSection id="afterglow" depth={0.5}` with no `stage`: title and intro, then the gifts, notes and secret blocks (about 100 vh each), then a small sign-off and a second "Replay our story" (`love-primary`, same Replay handler). The Starlight aurora at lower intensity; sparse stars.

**Step 3 — Finale link.** Fill the Phase 8 slot in `sections/finale.tsx` with a `love-link` "There's a little more…" that calls the Lenis `scrollTo('#afterglow')` (`useLoveScroll` from `engine/scroll-engine.tsx`, as in the debug panel).
_You should see:_ `?debug&s=afterglow` jumps there; Replay works from Afterglow; the heart sits in its corner.

**Calm:** same layout, instant reveals.

### Part B — F7 Gifts and plan (M35)

**Step 4 — `engine/ics.ts` (+ test).** `buildIcs({ title, startsAt, durationMin, location?, description? })`: `\r\n` line endings; escape `,` `;` `\` and newlines; UTC `YYYYMMDDTHHMMSSZ` from an offset `startsAt`; `UID` and `DTSTAMP`. A tiny `downloadIcs()` creates a Blob, clicks a temporary `<a download>` and revokes the URL.

**Step 5 — `ui/gift-box.tsx`.** Illustrated SVG box (lavender, rose, gold tokens, gold ribbon), gentle CSS float. `useHold({ duration: 800 })` unties: ribbon loosens, lid lifts, light spills, card rises with `title` and `text`; heart `giftOpen` (small `glowUp`) + `spawnTapHearts`. Early release eases back (existing `useHold` behaviour). A real `<button>`, "Gift 1 of 3, sealed. Hold or press Enter to open."; Enter opens immediately; reveal announced politely.

**Step 6 — `sections/afterglow-gifts.tsx`.** Three boxes; `mode: 'pick-one'` seals the others ("Maybe next time…") but keeps them visible; `'open-all'` allows all three. The plan card: date and time in her local time, place, optional note, live countdown (days, hours, minutes; pure helper with a test), **Add to calendar** (`love-primary`) and **Open in Maps** (`love-ghost`, outbound link from `mapsQuery`); `shine` on reveal. Opened state saved with `persist`.
**Calm/static:** three "Open gift 1 / 2 / 3" buttons; instant reveal.

### Part C — F8 Open when… and F9 Hidden hearts (M36)

**Step 7 — `sections/afterglow-notes.tsx` + `ui/note-dialog.tsx`.** 3–5 sealed scrolls reusing the parchment and seal ornaments; hold 0.9 s (`useHold`) or click in Calm; seal splits, small hearts rise (`noteOpen`), dialog opens with the note. The dialog mirrors `ui/memory-dialog.tsx`. Opened seals turn gold; "2 of 4 opened" counter; optional `unlockAt` soft lock ("Opens on 3 Dec") by device clock.

**Step 8 — `engine/hidden-hearts.ts` (+ test).** State of five ids, `found(id)`, `count()`, subscribe; backed by `persist`; test with a throwing `localStorage` (works for the session, no errors).

**Step 9 — `ui/hidden-heart.tsx` and `ui/found-chip.tsx`.** A real `<button aria-label="A tiny hidden heart">`, 24–28 px visible inside a 44 px hit area, twinkles every few seconds (static glow in Calm). Tap: `hiddenFound` (small burst + chime), stays dimly lit. The chip ("3 of 5", left of the music toggle) shows for 3 s after a find or while focused, `aria-live="polite"`. Placements in one constants file: Hero title, Memories (third orb's DOM twin), Timeline thread tail, a Gallery tile corner, Letter sign-off ornament — one-line mounts.

**Step 10 — `sections/afterglow-secret.tsx`.** Locked card "A secret room… {n} of 5 hidden hearts found" with a **hint** button (`hidden.hint`); when all five are found: `glowUp`, a chime sequence, and the card opens a dialog with `secret.title`, `secret.paragraphs` and an optional photo (`LovePhoto`).

Add `giftOpen`, `noteOpen` and `hiddenFound` to `HEART_EVENTS` with `build()` and reduced-motion cases.

### Part D — QA of Phases 8–10 (M37)

**Step 11 — Spec QA.** Run spec §6 and §11 (all rows except Dance) on desktop and on a real iPhone and Android: fast scroll ×10, microphone, false positives, voice ducking, storage blocked, ring and sky on touch, gifts and calendar (Google, Apple, Outlook; another time zone), hidden hearts, reduced motion and Calm matrix, performance, contrast and targets.

**Step 12 — Skills.** `/impeccable audit`; Emil `review-animations`, `animation-performance`, `break-ui` (long reasons, long names, 12-paragraph letter, empty optional config), `mobile-native`. Fix findings; tune tiers.

**Step 13 — Budgets.** Tech Stack §8.1 still met; consider Improvement Report P5 (disable far ScrollTriggers) if the trigger count grew noticeably.

---

## 6. Testing record template (copy into the session log)

```text
Phase 10 — <milestone> — <date>
Build: lint ☐ typecheck ☐ test ☐ build ☐
Viewports: 1440×900 ☐ 375×812 ☐   Tiers: high ☐ mid ☐ low ☐ static ☐   Calm ☐
Afterglow: link ☐ ?s=afterglow ☐ Replay from Afterglow ☐ heart corner ☐
Gifts: early release clean ☐ .ics Google ☐ Apple ☐ Outlook ☐ other time zone ☐ persists ☐
Notes: keyboard ☐ focus trap/restore ☐ no scroll behind ☐ long note scrolls ☐ persists ☐
Hidden hearts: mouse ☐ touch ☐ keyboard ☐ chip announced ☐ survives refresh ☐ survives Replay ☐ storage blocked ☐
Perf (4× CPU, mid): fps ___   Real devices: iPhone ☐ Android ☐
```

---

## 7. Exit checklist

- [ ] Afterglow reachable by scroll, the finale link and `?s=afterglow`; heart baseline correct; Replay works
- [ ] `ics`, `hidden-hearts` and countdown tests pass; `.ics` imports in three calendars
- [ ] Gifts, notes and hidden-heart progress survive refresh and Replay; everything works with storage blocked
- [ ] Secret room cannot open early
- [ ] Spec §6 and §11 (except Dance) pass on real devices
- [ ] `/impeccable audit` and Emil reviews done; findings fixed or logged
- [ ] lint, typecheck, `vitest`, build pass; budgets met

---

## 8. Risks and fallbacks

| Risk                               | Fallback                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Plan details visible in the config | Unguessable slug; general place name; never a home address                      |
| Time-zone mistakes                 | `startsAt` with an explicit offset; display in local time; test in another zone |
| `localStorage` blocked or cleared  | Session-only behaviour; no errors                                               |
| Runtime fatigue                    | Afterglow is optional; nothing added to the main path                           |
| Hidden hearts too hard to find     | The hint names the sections; adjust placements in the constants file            |

---

## 9. Docs and governance updates

- Experience Guidebook: new Afterglow section; hidden hearts; journey map; known gaps; version bump to v2.1 (as-built for Phases 8–10).
- Spec: correct anything that changed; tick §6 rows.
- `docs/governance/PROGRESS.md`: an entry for Love Site Phases 8–10.
- `progress.md` and `docs/AI_SESSION_LOG.md` each session.

---

## 10. Commit plan

1. `feat(love): afterglow section and finale link`
2. `feat(love): ics builder and gift boxes with plan card`
3. `feat(love): open-when sealed notes`
4. `feat(love): hidden hearts, found chip and secret room`
5. `fix(love): phase 8–10 QA fixes`
6. `docs(love): guidebook v2.1 as-built`

---

## 11. Handoff to Phase 11

The rest of the story is complete and verified. Phase 11 replaces the particle dancers with the dance reel. Start it only when the owner's clip has passed the quality bar ([Dance-Clip-Production-Guide.md](../Dance-Clip-Production-Guide.md) §11), then open [Phase 11](Phase-11-Dance-Reel.md) and run `/plan` for it.
