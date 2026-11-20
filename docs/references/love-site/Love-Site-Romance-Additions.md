# B&V Birthday Love Site — Phase 8: Romance Additions

| Field                  | Value                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version                | 1.2 (approved for build as Phases 8–11; verified against the code 2026-11-20)                                                                                                                                                                                                                                                                                     |
| Created                | 2026-11-19 (imported and verified 2026-11-20)                                                                                                                                                                                                                                                                                                                     |
| Audience               | Claude Code (builder) and the developer (reviewer)                                                                                                                                                                                                                                                                                                                |
| Location               | `docs/references/love-site/Love-Site-Romance-Additions.md` (master spec; build from the phase guides)                                                                                                                                                                                                                                                             |
| Builds on              | `Love-Site-Experience-Guidebook.md` v2.0 (as-built) and `Love-Site-Tech-Stack-and-Tools.md` v1.1                                                                                                                                                                                                                                                                  |
| Milestones             | M22–M40 across [Phase 8](phases/Phase-8-Look-Polish-and-Foundations.md), [Phase 9](phases/Phase-9-Interactive-Heart-Moments.md), [Phase 10](phases/Phase-10-Afterglow-Room-and-QA.md) and [Phase 11](phases/Phase-11-Dance-Reel.md) (see §0). The original M22–M31 and MU1–MU6 tables (§5, §10) are superseded                                                    |
| Decisions already made | Add all four new sections and all four personal touches; the page **opens anytime** (no midnight lock, no countdown gate). Part B: improve the Bloom line, replace the dance with a real or animated couple, redo the Wish UI, extend the Letter border, restyle the Finale buttons, and darken and refine the overall look                                       |
| Dance route            | **Decided: B, AI-generated animated couple in a stylised 3D look.** Production steps are in [Dance-Clip-Production-Guide.md](Dance-Clip-Production-Guide.md). **Likeness decided: exact likenesses, with her consent.** **Tool decided by test:** run Seedance 2.5 and Kling 3.0 on the same keyframes and pick the better (`Dance-Clip-Production-Guide.md` §15) |

> **Verification note (2026-11-20).** This spec was first written from the v2.0 guidebooks, not from the code. Every file path, function and value it marked `INFERRED` has now been checked against the source and corrected below. Paths are relative to `src/features/love/`. Items still marked `UNCERTAIN` need a check in the installed package or on a real device before use. The source code still wins over this document. Overlap with the [Improvement Report](Love-Site-Improvement-Report.md) (P1–P7, G1–G6): P3 (mount 3D only near its section) and P5 (disable far ScrollTriggers) are folded into Phases 9–11. Part B (§9–§13) was written from eight screenshots plus the guidebook.

---

## 0. Delivery map (phases and milestones)

Build from the phase guides; this spec holds the full detail they reference. Feature IDs (F1–F9, U1–U6) stay the same.

| Phase | Guide                                                                         | Milestone | Spec item                                                                   |
| ----- | ----------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------- |
| 8     | [Look, polish and foundations](phases/Phase-8-Look-Polish-and-Foundations.md) | M22       | Shared systems: ADRs, config (§3.1), `persist.ts` (§3.3), `chime.ts` (§3.4) |
| 8     |                                                                               | M23       | U1 Look (§9.1)                                                              |
| 8     |                                                                               | M24       | U2 Bloom line (§9.2)                                                        |
| 8     |                                                                               | M25       | U6 Finale and buttons (§9.6)                                                |
| 8     |                                                                               | M26       | U4 Wish UI (§9.4)                                                           |
| 8     |                                                                               | M27       | U5 Letter frame (§9.5)                                                      |
| 9     | [Interactive heart moments](phases/Phase-9-Interactive-Heart-Moments.md)      | M28       | F5 blow-detector spike (old M22 spike)                                      |
| 9     |                                                                               | M29       | F1 Finale spell                                                             |
| 9     |                                                                               | M30       | F2 Voice note                                                               |
| 9     |                                                                               | M31       | F3 Our sky                                                                  |
| 9     |                                                                               | M32       | F4 Reasons ring                                                             |
| 9     |                                                                               | M33       | F5 Candle wish                                                              |
| 10    | [Afterglow room and QA](phases/Phase-10-Afterglow-Room-and-QA.md)             | M34       | F6 Afterglow                                                                |
| 10    |                                                                               | M35       | F7 Gifts and plan                                                           |
| 10    |                                                                               | M36       | F8 Open when… and F9 Hidden hearts                                          |
| 10    |                                                                               | M37       | QA (§6, §11 except Dance)                                                   |
| 11    | [Dance reel](phases/Phase-11-Dance-Reel.md)                                   | M38       | U3 clip gate (old MU3a, owner task, **starts now in parallel**)             |
| 11    |                                                                               | M39       | U3 player (old MU3b)                                                        |
| 11    |                                                                               | M40       | U3 final clip and removal of the particle dancers (old MU3c)                |

---

## 1. What is being added

| #   | Feature                                    | Type                                 | Where                  | Effort      |
| --- | ------------------------------------------ | ------------------------------------ | ---------------------- | ----------- |
| F1  | **Heart spells her name and "I love you"** | Personal touch                       | Finale                 | Medium      |
| F2  | **Your voice note**                        | Personal touch                       | Letter                 | Low–medium  |
| F3  | **Our sky: join the stars into a heart**   | New interaction (upgrades Starlight) | Starlight              | Medium      |
| F4  | **Reasons ring** (12 reasons she can spin) | New section                          | After Dance            | Medium      |
| F5  | **Candle wish** (blow on the microphone)   | Personal touch (variant of Wish)     | Wish                   | Medium–high |
| F6  | **Afterglow room** (container)             | New section                          | After Finale           | Low         |
| F7  | **Surprise gifts + real-world plan**       | New section                          | Afterglow              | Medium      |
| F8  | **Open when… sealed notes**                | New section                          | Afterglow              | Low–medium  |
| F9  | **Hidden hearts + secret room**            | Personal touch                       | Everywhere + Afterglow | Medium      |

**Not in scope (offered earlier, not chosen):** midnight unlock or countdown, daily notes, wallpaper keepsake, WhatsApp reply button, touch sparkle trail, scratch-to-reveal photo, favourite-flower petals, dynamic music mix. Each can be added later as a small separate task. One tiny shared helper (procedural chimes, §3.4) is included because F3 and F4 need audible feedback.

**No new npm packages are needed.** Everything uses the approved stack plus native browser APIs (Web Audio, `getUserMedia`, Blob, `localStorage`). If Claude Code believes it needs a package, it stops and asks.

### 1.1 Part B: updates to existing sections (§9–§13)

| #   | Update                            | Existing section | Summary                                                                        |
| --- | --------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| U1  | Look: darker, premium, less glare | All              | Darker base, dithered gradients, calmer glow, no pure-white hearts, no banding |
| U2  | Bloom line                        | Bloom            | Left-third statement that bursts in word by word; "opens" opens                |
| U3  | Dance reel                        | Dance            | Replace the particle couple with a real or animated couple, played by scroll   |
| U4  | Wish UI                           | Wish             | A framed medallion, clearer instruction, bigger target, calmer look            |
| U5  | Letter frame                      | Letter           | Border, curls and backdrop that run the full length of the letter              |
| U6  | Finale and buttons                | Finale           | New layout and a consistent premium button system                              |

---

## 2. New journey map

| #      | Section                     | `id`        | Change                                                                      |
| ------ | --------------------------- | ----------- | --------------------------------------------------------------------------- |
| 0      | Gate                        | `gate`      | unchanged                                                                   |
| 1      | Hero                        | `hero`      | unchanged                                                                   |
| 2      | Bloom                       | `bloom`     | unchanged                                                                   |
| 3      | Memories                    | `memories`  | unchanged                                                                   |
| 4      | Timeline                    | `timeline`  | unchanged                                                                   |
| 5      | **Our sky** (was Starlight) | `starlight` | **F3**: becomes interactive; stage 100 vh → 220 vh                          |
| 6      | Gallery                     | `gallery`   | unchanged                                                                   |
| 6b     | Dance                       | `dance`     | **U3**: re-implemented as a pre-rendered couple played by scroll (see §9.3) |
| **6c** | **Reasons**                 | `reasons`   | **F4: new**, 250 vh sticky stage                                            |
| 7      | Wish                        | `wish`      | **F5**: candle variant with the existing star as fallback                   |
| 8      | Letter                      | `letter`    | **F2**: voice note after the text reveals                                   |
| 9      | Finale                      | `finale`    | **F1**: `finaleSpell` replaces `finaleBurst`                                |
| **10** | **Afterglow**               | `afterglow` | **F6–F8: new**, natural flow, quiet room                                    |
| –      | Hidden hearts               | –           | **F9**: five tiny hearts across sections; reward in Afterglow               |

The emotional flow stays: pictures (Gallery) → movement (Dance) → **words of love (Reasons)** → celebration (Wish) → intimacy (Letter) → resolution (Finale) → **a quiet room for those who linger (Afterglow)**.

**Runtime estimate:** the main journey grows from about 4–5 minutes to about 7–8 minutes (Our sky about 40 s, Reasons about 40 s, candle about 10 s, voice 30–60 s if played, finale about +8 s). Afterglow is optional lingering time. **Do not lengthen the main path further.**

### 2.1 Heart path additions (`engine/heart-path.ts`, verified)

`HEART_PATH` is `Record<SectionId, { desktop: {x, y, scale}; mobile: {x, y, scale}; gold; glow }>`, keyed by `SECTION_IDS` (`engine/heart-path.ts:5–29`). New ids (`reasons`, `afterglow`) must be added to `SECTION_IDS` **and** `HEART_PATH`; the debug panel's `?s=` list should import `SECTION_IDS` instead of its own copy (`dev/heart-debug-panel.tsx:15`).

| Section            | Desktop                                             | Mobile              | Gold | Glow | Note                                            |
| ------------------ | --------------------------------------------------- | ------------------- | ---- | ---- | ----------------------------------------------- |
| Our sky (waiting)  | (0, −0.75) s0.20                                    | (0, −0.80) s0.18    | 0.4  | 0.5  | Stays low while she connects stars              |
| Our sky (complete) | (0, 0.05) s0.60                                     | (0, 0.05) s0.50     | 0.45 | 0.7  | Triggered move into the finished constellation  |
| Reasons            | (0, 0.50) s0.20                                     | (0, 0.58) s0.18     | 0.45 | 0.5  | Heart sits above the ring; cards never cover it |
| Wish (candle)      | y −0.45 s0.35, rises to about y −0.15 while blowing | same                | 0.5  | 0.5  | Full rise only on `wishMerge`                   |
| Afterglow          | (0.86, −0.78) s0.20                                 | (0.80, −0.85) s0.16 | 0.6  | 0.4  | Quiet corner companion, like Gallery            |

`--depth` stops (`engine/theme-timeline.ts`, verified: `STEPS` at lines 5–11 are `#memories` 0→0.5, `#timeline` 0.5→1, `#gallery` 1→0.5, `#wish` 0.5→1, `#finale` 1→0.5, each scrubbed `top bottom` → `bottom bottom`): keep neighbours interpolating smoothly. Suggested: Gallery 1 → 0.5, Dance 0.5, **Reasons 0.5 → 0.8**, Wish 0.8 → 1, Letter 1, Finale 1 → 0.5, **Afterglow 0.5 → 0.7**. Starlight stays at 1.

Call `baselineOn(el, 'reasons')` and `baselineOn(el, 'afterglow')` at the top of the new builders (`baselineOn` lives in `engine/story.ts:37`, not in the director) and register the builders in the `sections` array (`engine/story.ts:611`). `director.settle()` → `toBaseline()` then reads `HEART_PATH[section]`.

---

## 3. Shared systems

### 3.1 Config additions (`config/types.ts`, `config/sites/<slug>.ts`)

```ts
// Additions to LoveSiteConfig (config/types.ts). Optional fields degrade gracefully (the feature is simply hidden).
// Verified: there is no `wish` or `finale` object today (their text lives in `copy`); `letter` is
// { salutation?, paragraphs, signoff?, passphrase? }; the music credit is `music.credit`.
copy: {
  /* existing fields … */
  reasonsTitle: string;        // e.g. "Reasons"
  reasonsHint: string;         // e.g. "Spin it. Every one is true."
  skyHint: string;             // e.g. "Connect the stars."
  skyDone: string;             // shown when the heart appears
  blowHint: string;            // e.g. "Blow out the candle"
  afterglowTitle: string;
  afterglowIntro: string;
};
reasons: string[];             // exactly 12, each at most about 90 characters
wish?: { mode?: 'candle' | 'star' };           // default 'candle', auto-falls back to 'star'
letter: {
  /* existing fields … */
  voice?: { src: string; transcript: string; label?: string };   // transcript is REQUIRED if voice is set
};
finale: { spell?: { line1?: string; line2?: string } };          // defaults: recipient.name, "I love you"
afterglow?: {
  gifts?: {
    mode: 'pick-one' | 'open-all';
    items: {                                                       // exactly 3
      id: string; label: string; title: string; text: string;
      plan?: { startsAt: string; durationMin: number; place: string; mapsQuery?: string; note?: string };
    }[];
  };
  openWhen?: { id: string; label: string; paragraphs: string[]; unlockAt?: string }[];   // 3–5
  secret?: { title: string; paragraphs: string[]; photo?: PhotoRef };
};
hidden?: { hint: string };     // five hidden hearts are fixed in code (see F9)
```

Extend `config/config.test.ts` (it already checks "exactly 5 timeline items, one featured", memories 6–8 and gallery 9–12): reasons length is 12; gifts has exactly 3 items; at most one gift has a `plan` unless `mode` is `open-all`; every `voice` has a transcript; `openWhen` length is 3–5.

### 3.2 New heart state and director events (`engine/heart-state.ts`, `engine/heart-director-core.ts`, `engine/heart-director.ts`, verified)

Verified: `heart` is a plain mutable object (`engine/heart-state.ts:3–27`). `HEART_EVENTS` is a `const` array in `engine/heart-director-core.ts:3` (it includes `finaleBurst`); each event is a `case` in `build()` (`engine/heart-director.ts:75`), with a separate reduced-motion switch (lines 76–97); `toBaseline()` (line 213) must also reset every new field below. The debug panel renders one button per `HEART_EVENTS` entry automatically.

| Addition                                    | Purpose                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| `heart.spell` (0–1), `heart.spellB` (0–1)   | Heart → text blend, and text A → text B blend (F1)                     |
| Event `finaleSpell`                         | Replaces `finaleBurst` (F1)                                            |
| Event `skyHeartIn`                          | Heart moves into the finished constellation (F3), 1.2 s `power3.inOut` |
| Event `candleOut`                           | Flame snuffs, smoke and star rise, then hands off to `wishMerge` (F5)  |
| Event `reasonFront`                         | Small `pulse`, throttled to at least 0.8 s (F4)                        |
| Event `giftOpen`, `noteOpen`, `hiddenFound` | Small `glowUp` + tap hearts (F7–F9)                                    |

All go through the director with the existing rules: one at a time, queue cap 2, `settle()` on scroll-back, reduced-motion variants. Add each to `HEART_EVENTS` so the debug panel can trigger it.

### 3.3 Persistence (new module, `engine/persist.ts`)

`session.ts` stays in-memory. Add a tiny wrapper over `localStorage` for things that should survive a refresh on **her device only**: hidden hearts found, gifts opened, notes opened, sky completed. Rules: every read and write in `try/catch`; render correctly when storage is empty or blocked; key prefix `love:<slug>:`; nothing is sent anywhere; **Replay does not clear it** (finding hearts and opening gifts is progress she keeps).

### 3.4 Audio additions (`engine/audio-engine.ts`, new `engine/chime.ts`)

Verified: the music graph is `MediaElementSource → Gain → Analyser (fftSize 512) → destination`, created in `audio.start(src)` inside the gate tap; `heart.beat = bass ** 1.5` on `gsap.ticker`, with `lubDub` (`engine/audio-bands.ts:18`) as the synthetic fallback. The public object is `audio = { start, mute, unmute, bands, isMuted, hasTrack, subscribe }`; the `AudioContext` is private, so add a getter for the voice channel and chimes. The toggle hook is `useMusicToggle()` (`ui/music-toggle.tsx:14`).

- **Voice channel (F2):** a second `HTMLAudioElement` → source → gain → analyser → destination, separate from the music graph. While voice plays, the music gain ducks to about 0.18 over 400 ms and recovers over 800 ms when voice pauses, ends, or the section is left. A pure helper `engine/audio-duck.ts` computes target gains so it can be unit tested.
- **Heart follows the voice:** while voice plays, `heart.beat` is fed from the voice analyser (same bass-band logic, clamped); it returns to the music or the synthetic beat afterwards.
- **Procedural chimes (`chime.ts`):** a soft bell from two `OscillatorNode`s (sine + a quiet octave above) with a fast attack and about 1.2 s exponential decay, notes from a pentatonic scale (so any sequence sounds pleasant), peak gain about 0.12. No audio files, no licensing. It obeys the music toggle (muted means silent) and never plays before the gate tap.

### 3.5 New chrome

- **Found-hearts chip** (F9): small "3 of 5" chip left of the music toggle, visible for 3 s after each find (or while focused), `aria-live="polite"`. Hidden in quiet mode only if there are no hidden hearts to find (they still work in quiet mode).
- No other chrome changes. The existing skip link ("Skip to the letter") stays; no second skip link is needed for Afterglow.

### 3.6 Privacy and permissions

| Item                  | Behaviour                                                                                                                                                                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Microphone (F5)       | Requested only after she taps "Use my microphone". Audio is analysed in memory for loudness and spectrum, **never recorded, stored or sent**. Tracks are stopped immediately when the candle goes out, on section leave, on tab hidden, and on unmount. A visible "Listening…" indicator is shown while active |
| `localStorage` (§3.3) | Device-only, try/catch, `love:<slug>:` prefix, no personal text stored                                                                                                                                                                                                                                         |
| Calendar file (F7)    | Generated in the browser from config; no network                                                                                                                                                                                                                                                               |
| Maps link (F7)        | A normal outbound link, opened only when she clicks it                                                                                                                                                                                                                                                         |
| Config content        | Everything in the config (gift plans, notes, the secret) is visible to anyone who has the URL. Use an unguessable slug and **do not put a home address or anything sensitive in the plan**                                                                                                                     |

### 3.7 Accessibility rules for everything below

- Every interactive 3D or custom element has a focusable DOM equivalent (existing "twin" rule).
- Every hold gesture has a single-click alternative in Calm mode and a visible "tap once" option.
- Dialogs use the existing Radix `Dialog`, `lenis.stop()` while open, focus restored on close.
- Anything announced (stars connected, hearts found, gift opened) uses `aria-live="polite"`.
- Voice has a visible transcript. Hidden hearts exist in DOM order as real buttons.
- Minimum touch target 44 px; hold targets 88 px or larger.
- Quiet mode (`useQuiet()`): no canvas motion; every feature still works with simple fades (details per feature).

### 3.8 Tier additions (`engine/tiers.ts`, verified: fields `particles`, `dpr`, `bloom`, `orbs`, `confetti`, `miniHearts`, `petals`, `danceParticles`)

| Tier     | Spell particles              | Candle cake particles  | Reasons ring                     | Sky                       |
| -------- | ---------------------------- | ---------------------- | -------------------------------- | ------------------------- |
| `high`   | uses the 18k heart particles | 1,500                  | 3D cards                         | SVG                       |
| `mid`    | 8k                           | 800                    | 3D cards                         | SVG                       |
| `low`    | 3k, heavier glyph weight     | 0 (flat candle sprite) | 3D cards, fewer shadows, no blur | SVG                       |
| `static` | DOM text crossfade           | DOM/SVG candle         | flat list                        | SVG (works without WebGL) |

**Dance (U3):** the particle-dance counts (14k / 7k / 0) are removed. `high` and `mid` use the desktop frame set, `low` the mobile frame set, and `static` or reduced motion use the two posters.

---

## 4. Feature specifications

### F1 — The heart spells her name and "I love you" (Finale)

**Intent:** the climax. The glowing heart that has followed her through the whole story dissolves into light and writes her name, then "I love you", then comes back as a heart.

**Experience (replaces `finaleBurst`, about 11 s, plays once per pass at `top 60%`, guarded by `session.finalePlayed`):**

| Time      | What happens                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------ |
| 0.0–0.3 s | Glow swells (flash)                                                                                    |
| 0.3–1.9 s | Heart dissolves; particles flow to **"{name}"** (`spell` 0 → 1, staggered per particle like the burst) |
| 1.9–4.1 s | Hold on the name (gentle shimmer)                                                                      |
| 4.1–5.5 s | Particles flow to **"I love you"** (`spellB` 0 → 1)                                                    |
| 5.5–8.1 s | Hold; a little confetti (50 %) at the start of the hold                                                |
| 8.1–9.7 s | Reform to the heart (`spell` → 0), glow overshoot +0.25, settle                                        |
| 9.7 s     | `pulse`; the DOM heading and message come to full opacity                                              |

**How it works (reuses the existing particle system):**

- Add two attributes to the heart geometry, `aTextA` and `aTextB` (vec3 each, 18,000 × 12 B × 2 ≈ 430 KB). The vertex shader becomes `p = mix(formedPosition, mix(aTextA, aTextB, uSpellB), smoothstep(staggered uSpell))`, applied **before** the burst blend so the existing burst still works.
- Sample text points once, after fonts are ready (`document.fonts.load` then `document.fonts.ready`), in an idle callback (target under 5 ms): draw the phrase on an offscreen 2D canvas in Cinzel, read pixels, keep pixels with alpha above 128 on a 2 px grid, pick `count` random samples with a **seeded RNG** (deterministic), convert to world units, centre, add small z jitter. If there are fewer samples than particles, reuse samples with a tiny offset.

```ts
// canvas/text-points.ts (pattern; pure aside from the canvas, so test with a fake pixel buffer)
export function textToPoints(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  count: number,
  worldWidth: number,
  seed: number,
): Float32Array {
  /* collect alpha>128 on a grid, seeded pick, map to [-worldWidth/2, worldWidth/2], centre */
}
```

- **Fit rules:** scale the font so the phrase fits `worldWidth` (about 2.6 units at the finale heart's scale; the finale heart pose changes in U6, §9.6); long names shrink to fit; support the Sinhala fallback font stack if the name uses it.
- **Layout rule:** the DOM heading "Happy birthday, {name}." and `finaleMessage` sit **below** the heart zone and fade to 25 % while the text is spelling, then return to full.
- **Low tier:** 3k particles with a bold glyph weight so the words stay readable. **Static / calm:** DOM crossfade "{name}" → "I love you" in gold text, with a small heart icon; no particles.
- **Accessibility:** one `sr-only` line announces "The heart spells {name}, then I love you." once. The DOM heading already carries the real text.

**Files** (existing paths verified; the rest are new): `canvas/text-points.ts` (+ test), `canvas/heart-geometry.ts` (new attributes), `canvas/heart-shaders.ts` (uniforms `uSpell`, `uSpellB`), `canvas/heart.tsx`, `engine/heart-state.ts`, `engine/heart-director.ts` (`finaleSpell`), `sections/finale.tsx`, config (`finale.spell`).

**Acceptance:** words are legible at 375 px and 1440 px on high/mid/low; the heart always returns to exactly formed (`burst = spell = spellB = 0`); fast scroll-away and back leaves no half-written word; replay works; reduced motion shows the DOM crossfade; no flash above three per second.

---

### F2 — Your voice note in the letter

**Intent:** the most personal thing on the site is the sound of you.

**Experience:** after the letter text has revealed, a quiet button appears under the sign-off: **"Hear it in my voice"** with a thin gold progress ring. Tapping plays your recording. The music ducks, the docked heart (the seal) pulses softly with your voice, and a **"Read what I say"** disclosure shows the transcript. When it ends, the music returns and the button becomes "Hear it again".

**Rules:** never autoplay; always requires her tap (also required by iOS); available in Calm mode (it is audio, not motion); pause and fade if she scrolls out of the Letter or the tab is hidden (position is remembered); `preload="none"` until the letter opens, then `metadata`; if the file is missing or errors, hide the button silently (the letter still works).

**Recording guidance (for you):** a quiet room, your phone's voice memo app, 30–60 seconds, speak slowly and naturally, one take is fine. Export as MP3 or AAC, mono, 64–96 kbps (about 0.5–0.7 MB per minute). Save as `public/audio/love-letter-voice.mp3` and write the transcript word for word.

**Optional cheap add (not required):** your handwritten signature as an SVG that draws itself with the same stroke-dash technique used for the timeline thread.

**Files** (existing paths verified; the rest are new): `engine/audio-engine.ts` (voice channel), `engine/audio-duck.ts` (+ test), `sections/letter-voice.tsx`, `sections/letter.tsx`, `config/types.ts` (`letter.voice`).

**Acceptance:** music ducks and recovers smoothly with no clicks; transcript always reachable by keyboard; muted music does not prevent voice from playing when she taps play; leaving the section pauses voice and restores music; missing file hides the control; heart beat follows voice only while voice plays.

---

### F3 — Our sky: join the stars into a heart (upgrades Starlight)

**Intent:** her memories become stars, and she draws the heart that was always there.

**Experience:**

1. Starlight keeps its opening breath: aurora, 40 twinkling background stars, and the line `starlightLine` (first 35 % of the stage).
2. Eight brighter **memory stars** fade in, placed on the outline of a large heart in the middle of the stage (positions from the same parametric heart as the particle heart, sampled at evenly spaced parameters). Only the **next** star in order twinkles softly, so she can never get lost.
3. She **drags** from the lit star to the next: a gold line follows her finger and, when she releases on the right star, **locks in** (stroke draw 0.4 s). The star glows, a small label shows the memory's title and date, a chime plays, and the heart gets a small `pulse`. Tapping stars in order also works.
4. After the eighth star she closes the shape back to the first. The heart outline brightens, the **3D heart rises into the middle of the constellation** (`skyHeartIn`), `glowUp` + `shine`, and `skyDone` fades in. This completion is the section's one big moment.
5. **If she scrolls past without finishing,** the remaining links draw themselves gently as she leaves forward, so nobody misses the payoff. A **"Connect for me"** button also finishes it (for Calm mode and keyboard users).

**Heart:** waits low at (0, −0.75) while she plays; moves into the centre on completion; then follows the normal path to Gallery.

**Mechanics (SVG overlay, viewBox 0 0 100 100):** stars are `<button>` elements; lines are `<path>` strokes animated with stroke-dash; pointer handling on the SVG with pointer capture, a hit radius of at least 44 px, and `touch-action: none` on the interactive area only.

```ts
// engine/sky-layout.ts (pure; test it)
import { heartPoint } from '../canvas/heart-geometry'; // verified: heartPoint(t: number): [number, number], line 4
export function skyStarLayout(n: number): { x: number; y: number }[] {
  // n evenly spaced parameters around the heart outline, starting near the top-centre dip,
  // mapped to the 0–100 SVG box with margin; same ordering as the connect sequence.
}
```

**Labels:** outside the shape and away from lines on desktop; on mobile, show only the latest star's label in a caption area below the stage.

**Calm / static:** completed constellation shown, with the memory list beneath; interaction still allowed (it needs no motion) with opacity-only transitions; "Connect for me" available.

**A11y:** stars in DOM order with `aria-label="Star 3 of 8: {title}. Connect."`; the expected next star has `aria-describedby` pointing at the hint; `aria-live` announces "Connected {title}, 3 of 8" and finally "The stars form a heart."

**Files** (existing paths verified; the rest are new): `sections/starlight.tsx` (rewrite into stage + interaction), `ui/sky-constellation.tsx`, `engine/sky-layout.ts` (+ test), `engine/story.ts` (`buildStarlight` update: stage 220 vh, remove the old rise-only path), `engine/heart-path.ts`, `engine/persist.ts` (sky completed), `engine/chime.ts`.

**Acceptance:** a drag that ends on the wrong star never breaks anything (the line gently fades); all eight stars reachable by touch, mouse and keyboard; completion fires exactly once per pass and the heart ends formed; auto-complete on forward leave works; no overlap between labels and lines at 375 px; chimes respect mute.

---

### F4 — Reasons ring

**Intent:** twelve short, true sentences, one for each reason, in her hands.

**Experience (250 vh sticky stage; mobile × 0.85):**

- Title (`reasonsTitle`) and hint (`reasonsHint`) fade in. The heart rests **above** the ring.
- Twelve **cards** stand on a ring (cylinder layout, 30° apart, `rotateY(i·30°) translateZ(R)`). The card at the front is full strength; the others fall back (opacity and scale only, no blur).
- The ring turns **with scroll** (one full turn over the stage), and she can also **drag or swipe it**. Release carries momentum that decays and gently **snaps** so a card always settles at the front.
- When a new card reaches the front: a soft chime and a small `reasonFront` pulse (throttled).
- **Tapping the front card** gives three tiny hearts from the heart.

**Card design:** solid translucent surface (token), thin gold border at 30 %, number in Inter ("07"), reason in Cormorant Garamond 20 px. **No `backdrop-filter`** (too expensive on phones). `will-change: transform` only while the ring is moving.

**Interaction rules:**

- Mobile: `touch-action: pan-y` on the ring so vertical scrolling still works; capture horizontal drags only after an 8 px horizontal threshold.
- Keyboard: ring is a `role="group"` with `aria-roledescription="carousel"`; Left/Right arrows move one card; visible Previous/Next buttons (44 px); `aria-live="polite"` announces the front card.
- Music reaction: a small CSS variable `--love-beat` (updated from the audio analyser at most about 30 times per second **only while the ring is in view**) lifts the card border glow slightly.

```ts
// engine/ring-physics.ts (pure; test it)
export type Ring = { angle: number; vel: number }; // radians
export function stepRing(
  s: Ring,
  dtSec: number,
  step: number /* 2π/N */,
  dragging: boolean,
): Ring {
  // while dragging: angle is set by the pointer; on release: vel decays (e.g. ×0.92 per 16 ms),
  // then a spring pulls angle to the nearest multiple of `step`. Return the new state.
}
export const frontIndex = (angle: number, step: number, n: number) =>
  ((Math.round(-angle / step) % n) + n) % n;
```

**Quiet / static:** a plain two-column (one on mobile) list of the twelve cards, no ring, no drag, no chime.

**Files** (existing paths verified; the rest are new): `sections/reasons.tsx`, `ui/reasons-ring.tsx`, `engine/ring-physics.ts` (+ test), `engine/story.ts` (`buildReasons`), `engine/heart-path.ts`, `engine/theme-timeline.ts`.

**Acceptance:** all twelve reasons readable (contrast 4.5:1, no clipped text at 375 px); drag, scroll and arrow keys never fight; the ring always settles on a card; no frame drops on a mid-range phone (§6); vertical page scroll still works over the ring on touch.

---

### F5 — Candle wish (blow on the microphone)

**Intent:** this is a birthday. She makes a wish, blows out a candle and the wish rises as a star.

**Experience (replaces the wish star visual when a microphone is available):**

1. A small **cake** floats in the centre, built from the same soft particle style as the heart (two stacked discs, lavender and gold, rose trim) with a single tall gold candle and a flickering **flame**. The wish prompt stays: "Make a wish, {name}."
2. A button **"Use my microphone to blow"** with one honest line: "I'll listen for your breath. Nothing is recorded or sent."
3. After she accepts, a visible "Listening…" indicator appears. As she blows, the flame **bends and shrinks** in proportion to her breath. Blow progress accumulates (and decays if she stops), like the old hold progress.
4. When it reaches 1: the flame goes out, a thin wisp of smoke rises, a **gold star ignites** at the top of the smoke and rises to the heart. Then the existing `wishMerge` runs (flash, confetti, burst, reform) and the `wishDone` message appears. The microphone is stopped **before** the star rises.
5. **Always available alternatives:** "Hold the candle" (the existing 2.4 s hold) and "Or tap once". If permission is denied, the mic is unsupported, or the page is in Calm mode, the mic option is hidden or explained kindly ("No problem, just hold the candle"), and the experience continues unchanged.

**Blow detection (the risky part, so spike it on real phones first, milestone M22):**

- Request audio with `echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false` (suppression would remove the breath noise). Connect the stream to an `AnalyserNode` **but not to the destination** (no feedback).
- Each frame compute: RMS from the time-domain buffer, the share of spectral energy below about 500 Hz, and **spectral flatness** (breath is noisy and flat; speech has harmonic peaks).
- A blow counts only when loud relative to an adaptive baseline **and** low-heavy **and** flat. Normal speech at a normal volume must not extinguish the candle.

```ts
// engine/blow-detector.ts (pure; test with synthetic noise, silence, a pure tone and a harmonic stack)
export type BlowState = { baseline: number; blow: number };
export function updateBlow(
  s: BlowState,
  rms: number,
  lowRatio: number,
  flatness: number,
  dtMs: number,
): BlowState {
  const loud = rms > Math.max(0.05, s.baseline * 3);
  const breathy = lowRatio > 0.5 && flatness > 0.25; // thresholds UNCERTAIN: tune on devices
  const intensity = loud && breathy ? Math.min(1, (rms - s.baseline) * 6) : 0;
  const blow = Math.min(
    1,
    Math.max(
      0,
      s.blow + (intensity > 0 ? (intensity * dtMs) / 600 : -dtMs / 900),
    ),
  );
  const baseline =
    intensity === 0 ? s.baseline * 0.98 + rms * 0.02 : s.baseline; // adapt only while quiet
  return { baseline, blow };
}
```

- Add the live values (`rms`, `lowRatio`, `flatness`, `blow`) to the debug panel so the thresholds can be tuned on real phones.
- Calibrate the baseline for about 400 ms after "Listening…" starts.

**Stopping the microphone (hard rule):** call `track.stop()` on every exit path: success, section leave, tab hidden, unmount, error, and Calm mode switching on.

**Visuals:** flame is a soft teardrop quad with noise flicker (uniform `uBlow` bends and shrinks it); cake particles by tier (§3.8); the heart stays below and rises only partly during blowing (to about y −0.15), then fully on `wishMerge`.

**Quiet / static:** a flat candle SVG; one click blows it out; no mic request; the star rises with a simple fade; no confetti (existing behaviour).

**Files** (existing paths verified; the rest are new): `canvas/wish-candle.tsx`, `canvas/candle-shaders.ts`, `engine/blow-detector.ts` (+ test), `hooks/use-blow.ts`, `sections/wish.tsx` (mode switch, copy), `engine/heart-director.ts` (`candleOut`), `config/types.ts` (`wish.mode`, `copy.blowHint`), `dev/heart-debug-panel.tsx` (live blow readout).

**Acceptance:** the mic is never requested before she taps the button; the indicator is visible whenever the mic is live; the mic is stopped on all exit paths (verify with the browser's recording indicator going off); talking and background music do not extinguish the candle, but a real breath does, on at least one iPhone and one mid-range Android; fallbacks (hold, tap) always work; no stacked animations on repeat completion (`session.wishDone` guard remains).

---

### F6 — Afterglow (the quiet room)

**Intent:** after the finale, a calm place for those who linger. It holds F7, F8 and the secret room (F9).

**Layout (natural flow, no sticky stage, about 100 vh per block):**

1. `afterglowTitle` + `afterglowIntro` (a short, warm line).
2. **Gifts and plan** (F7).
3. **Open when…** (F8).
4. **Secret room** (F9): locked until all five hidden hearts are found.
5. A final small sign-off and a repeat of **"Replay our story"**.

**Entry:** the finale gets one quiet link under its buttons: "There's a little more…" (smooth scroll with Lenis). Afterglow is **not** pinned, so normal scrolling always works.

**Look:** same night tokens; the Starlight aurora at lower intensity; stars sparse. Heart as a corner companion (§2.1). Existing `LoveSection` wrapper; `data-depth` stops per §2.1.

**Quiet:** identical layout, instant reveals.

**Files** (existing paths verified; the rest are new): `sections/afterglow.tsx`, `engine/story.ts` (`buildAfterglow`: progress, baseline, reveal batches), `engine/heart-path.ts`, `engine/theme-timeline.ts`, `sections/finale.tsx` (link).

**Acceptance:** reachable by scrolling, by the finale link and (new) by `?s=afterglow` in the debug panel; heart baseline correct; Replay still works from here.

---

### F7 — Surprise gifts + real-world plan

**Intent:** the page ends by pointing at real life: three gifts, and one of them is an actual plan.

**Experience:**

- Three softly floating **gift boxes** (illustrated SVG with gold ribbons, gentle CSS float; token colours: lavender, rose, gold).
- She **holds** a box for 0.8 s (`useHold`) to untie it: the ribbon loosens, the lid lifts, warm light spills out, a card rises with the gift's `title` and `text`. Heart: `giftOpen` (small `glowUp` + tap hearts).
- `mode: 'pick-one'`: opening one gently seals the others ("Maybe next time…") but they remain visible; `mode: 'open-all'`: she may open all three. **You decide in config** (pick-one makes the choice feel like a game; open-all avoids her missing the real plan).
- The **plan card** (when a gift has `plan`): date and time, place, an optional note ("Wear the lavender dress"), a live countdown (days, hours, minutes) to `startsAt`, and two buttons: **Add to calendar** (downloads an `.ics` built in the browser) and **Open in Maps** (outbound link built from `mapsQuery`). On reveal: `shine`.
- Opened state persists on her device (§3.3) so a refresh doesn't hide the plan.

```ts
// engine/ics.ts (pure; test line endings, escaping, UTC conversion)
export function buildIcs(p: {
  title: string;
  startsAt: string;
  durationMin: number;
  location?: string;
  description?: string;
}): string {
  // BEGIN:VCALENDAR … VERSION:2.0 … BEGIN:VEVENT … UID, DTSTAMP, DTSTART (UTC, YYYYMMDDTHHMMSSZ), DTEND, SUMMARY, LOCATION, DESCRIPTION … END:VEVENT … END:VCALENDAR
  // lines joined with \r\n; escape , ; \ and newlines in text values
}
// Download via a Blob and an <a download> click; revoke the object URL afterwards.
```

**Quiet / static:** three "Open gift 1 / 2 / 3" buttons (single click), instant reveal.

**A11y:** each box is a button, "Gift 1 of 3, sealed. Hold or press Enter to open."; Enter opens immediately (no hold needed for keyboard); the reveal is announced politely.

**Content caution:** the plan text lives in the config (visible to anyone with the URL). Use a general place name; no home address.

**Files** (existing paths verified; the rest are new): `sections/afterglow-gifts.tsx`, `ui/gift-box.tsx`, `engine/ics.ts` (+ test), `engine/persist.ts`, config.

**Acceptance:** early release leaves no half-open box; plan countdown stays correct across time zones (store `startsAt` with an offset, display in her local time); `.ics` imports into Google, Apple and Outlook calendars; opened state survives refresh; works with blocked `localStorage`.

---

### F8 — Open when… sealed notes

**Intent:** small letters for moments she can't predict, kept ready for her.

**Experience:** 3–5 small **sealed scrolls** (reuse the letter's parchment and seal-heart ornaments), each labelled "Open when you miss me", "Open when you can't sleep", and so on. She **holds** a seal for 0.9 s (or clicks in Calm mode). The seal splits, small hearts rise (`noteOpen`), and a dialog opens with the note on parchment (Radix `Dialog`, Esc to close, `lenis.stop()` while open). Opened seals turn gold. A quiet counter shows "2 of 4 opened".

**Optional per-note `unlockAt`:** a note shows a small lock and "Opens on 3 Dec" until that date by her device clock. The default is none (everything opens now, matching "open anytime"). This is a soft lock only, since her device clock can be changed.

**Quiet / static:** a list of buttons; the dialog opens instantly.

**Files** (existing paths verified; the rest are new): `sections/afterglow-notes.tsx`, `ui/note-dialog.tsx` (reuse the memory dialog pattern), `sections/letter-ornaments.tsx` (reuse), `engine/persist.ts`.

**Acceptance:** every note reachable by keyboard; dialog traps focus and restores it; no scrolling behind the dialog; long notes scroll inside (`data-lenis-prevent`); opened state persists.

---

### F9 — Hidden hearts + secret room

**Intent:** a little treasure hunt that rewards looking closely and revisiting.

**The five hearts (default placements, adjustable in a single constants file):**

| #   | Section  | Where                                                           |
| --- | -------- | --------------------------------------------------------------- |
| 1   | Hero     | Beside the last letter of the title, tiny and low-contrast gold |
| 2   | Memories | Reflected inside the third orb's shell (also a DOM twin button) |
| 3   | Timeline | At the very end of the thread's tail                            |
| 4   | Gallery  | In the corner of one photo tile                                 |
| 5   | Letter   | Within the parchment ornament next to the sign-off              |

**Behaviour:** each is a real `<button>` (`aria-label="A tiny hidden heart"`), about 24–28 px visible with a 44 px hit area, twinkling once every few seconds. Tapping it: `hiddenFound` (small burst, chime), the found-hearts chip updates (§3.5), and it stays dimly lit afterwards. State persists (§3.3).

**Reward:** when all five are found: `glowUp`, a chime sequence, and the **secret room** card in Afterglow unlocks. Until then it shows "A secret room… {n} of 5 hidden hearts found" and a **hint** button (`hidden.hint`) that names the sections but not the exact spots. The secret room opens in a dialog with `secret.title`, `secret.paragraphs` and an optional photo: your private note, the thing you never say out loud.

**Quiet:** hearts still work (they need no motion); twinkle is replaced by a static soft glow.

**Files** (existing paths verified; the rest are new): `engine/hidden-hearts.ts` (state + persistence + test with a throwing `localStorage`), `ui/hidden-heart.tsx`, `ui/found-chip.tsx`, `sections/afterglow-secret.tsx`, plus a one-line mount in each of the five sections.

**Acceptance:** all five can be found and activated by mouse, touch and keyboard; chip announces each find; refresh keeps progress; Replay keeps progress; the secret room cannot be opened early; no console errors when storage is blocked.

---

## 5. Milestones (superseded)

> **Superseded 2026-11-20** by the delivery map in §0 and the phase guides. Kept for history.

Use `/plan` → `/blueprint` → `/implement`, then the skills named in the Tech Stack §10 (`critique`, `polish`, Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native`). Commit per milestone, update `progress.md` and `AI_SESSION_LOG.md`. **Do not start a milestone with a failing build or an unclean heart state.**

| M       | Goal                        | Prompt to give Claude Code (adapt to the repo flow)                                                                                                                                                                                                                                                                                                                                     | Done when                                                                                                             |
| ------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **M22** | Prep and the risky spike    | "Read Phase 8. Draft ADRs for: microphone use, `localStorage` persistence, and the new section order. Extend config types, the sample site and `config.test.ts` (§3.1). Add `persist.ts` and `chime.ts`. Build a dev-only page or debug-panel tool that runs the blow detector from the microphone and shows `rms`, `lowRatio`, `flatness`, `blow` live. **Do not build visuals yet.**" | ADRs drafted; config validated by tests; blow readout tested on at least one iPhone and one Android; thresholds noted |
| **M23** | F1 Finale spell             | "Implement `text-points`, the `aTextA/aTextB` attributes, the `uSpell/uSpellB` uniforms, the `finaleSpell` director event, the DOM layout rule and the quiet fallback."                                                                                                                                                                                                                 | Words legible on all tiers at 375 and 1440 px; heart ends exactly formed after any interruption                       |
| **M24** | F2 Voice note               | "Implement the voice channel, ducking helper, `letter-voice` UI with transcript, and the failure handling."                                                                                                                                                                                                                                                                             | Ducking is smooth; transcript reachable; missing file handled                                                         |
| **M25** | F3 Our sky                  | "Upgrade Starlight into the interactive constellation: layout helper, SVG interaction, labels, completion event, auto-complete on forward leave, Connect-for-me, and the heart path change."                                                                                                                                                                                            | All stars reachable by touch, mouse and keyboard; completion once per pass                                            |
| **M26** | F4 Reasons ring             | "Implement the Reasons section: ring physics helper, cards, drag and scroll, keyboard and buttons, front-card chime and pulse, and the quiet list."                                                                                                                                                                                                                                     | Smooth on a mid-range phone; vertical scroll works over the ring on touch                                             |
| **M27** | F5 Candle wish              | "Implement the candle, flame shader, cake particles by tier, `useBlow`, the permission UX, `candleOut`, the fallbacks, and the stop-the-mic rule on every exit path."                                                                                                                                                                                                                   | Mic stopped on all exits; real breath works; speech does not; fallbacks work                                          |
| **M28** | F6 + F7 Afterglow and gifts | "Create the Afterglow container, the finale link, heart path and depth stops. Implement the gift boxes, reveal, plan card, countdown and `.ics` download."                                                                                                                                                                                                                              | `.ics` imports in three calendars; opened state persists                                                              |
| **M29** | F8 Open when…               | "Implement the sealed notes with hold-to-open, the note dialog, counter and optional `unlockAt`."                                                                                                                                                                                                                                                                                       | Keyboard, focus and scroll-lock behaviour correct                                                                     |
| **M30** | F9 Hidden hearts            | "Implement the hidden hearts state, the five placements, the found chip, the hint, and the secret room."                                                                                                                                                                                                                                                                                | All five findable by all inputs; persistence survives refresh and Replay                                              |
| **M31** | Phase 8 QA                  | "Run the QA additions (§6) on real devices, tune tiers, run `/impeccable audit` and the Emil reviews, update the guidebook to v2.1 (as-built), and the release checklist."                                                                                                                                                                                                              | §6 passes; budgets met; documents updated                                                                             |

**Order rationale:** M22 de-risks the one feature that depends on device behaviour (the blow detector). M23–M27 are the experience upgrades in story order. M28–M30 build the Afterglow room last because it depends on the shared systems.

---

## 6. QA additions

| Test                                    | Pass condition                                                                                                                                                                                                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fast scroll stress ×10** (whole page) | Heart always ends formed (`burst = spell = spellB = 0`); no stuck candle, ring or constellation state; no console errors                                                                                                                                                |
| **Microphone**                          | Permission prompt appears only after the button; "Listening…" visible; the recording indicator disappears after the wish, on scroll-away, on tab switch and on Calm mode; denial and unsupported browsers fall back cleanly; tested on iPhone Safari and Android Chrome |
| **False positives**                     | Speaking, music from speakers and room noise do not blow out the candle; a real breath does, at arm's length and close                                                                                                                                                  |
| **Voice ducking**                       | No clicks; music restores after pause, end, scroll-away and tab hidden                                                                                                                                                                                                  |
| **Storage blocked**                     | With `localStorage` disabled, every feature still works for the session                                                                                                                                                                                                 |
| **Ring on touch**                       | Horizontal drag spins; vertical drag scrolls the page; no accidental text selection                                                                                                                                                                                     |
| **Sky on touch**                        | A finger drag across the screen never scrolls the page while she is drawing a line inside the stage                                                                                                                                                                     |
| **Gifts and calendar**                  | `.ics` opens correctly in Google, Apple and Outlook calendars; the countdown is right in a different time zone                                                                                                                                                          |
| **Hidden hearts**                       | Found by keyboard; chip announced; progress survives refresh and Replay                                                                                                                                                                                                 |
| **Reduced motion / Calm**               | Matrix: Spell becomes a DOM crossfade; Sky shows the completed constellation (still interactive); Ring becomes a list; Candle becomes a one-click candle; Gifts and notes open instantly                                                                                |
| **Performance**                         | Budgets in Tech Stack §8.1 still met; ring and spell hold ≥ 40 fps on a mid-range phone (this is the first thing to measure; **unverified today**)                                                                                                                      |
| **Contrast and targets**                | 4.5:1 for all new text; 44 px targets; 88 px+ hold targets                                                                                                                                                                                                              |

---

## 7. Content you need to provide

| Item                                           | Detail                                                                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **12 reasons**                                 | Short, true, specific to her (at most about 90 characters each). The more specific, the more romantic |
| **Voice recording**                            | 30–60 s in your own voice, plus the exact transcript                                                  |
| **Gift three items**                           | Titles and text; which one is the **real plan**                                                       |
| **Plan details**                               | Date and time (with time zone), a general place name, an optional note (e.g. what to wear)            |
| **3–5 "Open when…" notes**                     | A label and 1–3 short paragraphs each                                                                 |
| **Secret note**                                | Title and paragraphs; an optional photo                                                               |
| **Sky copy**                                   | `skyHint`, `skyDone` (a sentence)                                                                     |
| **Copy for Reasons, Afterglow and the candle** | `reasonsTitle`, `reasonsHint`, `blowHint`, `afterglowTitle`, `afterglowIntro`                         |
| **Hidden-heart hint**                          | One line that nudges without spoiling                                                                 |
| **Real photos**                                | Still required before sharing (Phase 7 release items remain open)                                     |

---

## 8. Risks and decisions needed

| Risk / decision                          | Impact                             | Mitigation                                                                                                                   |
| ---------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Blow detection varies by device**      | Candle feels broken                | M22 spike on real phones first; adaptive baseline; hold and tap fallbacks always present; live readout in the debug panel    |
| **Microphone trust**                     | She may refuse or feel uneasy      | Explicit button, plain-language privacy line, visible indicator, mic stops immediately, no recording or network              |
| **Runtime grows to about 7–8 min**       | Fatigue before the letter          | Keep new moments short; Afterglow is optional; no extra sections on the main path                                            |
| **Text legibility of particles**         | Name or "I love you" unreadable    | Fit-to-width, bold glyphs on low tier, DOM fallback; test with her real name length and any Sinhala text                     |
| **Ring performance on phones**           | Jank                               | No `backdrop-filter`, `will-change` only while moving, opacity and scale only for back cards, measure early                  |
| **Interaction clashes with page scroll** | Frustration on touch               | `touch-action: pan-y` on the ring; `touch-action: none` only inside the sky's active area; thresholds before capturing drags |
| **Plan details visible in the config**   | Privacy                            | Unguessable slug; general place names only; never a home address                                                             |
| **Time-zone mistakes in the plan**       | Wrong date shown                   | Store `startsAt` with an explicit offset; display in the device's local time; test in another zone                           |
| **`localStorage` blocked or cleared**    | Progress lost                      | Always optional; works session-only                                                                                          |
| **Spec drift from the code**             | Wrong assumptions in this document | Verified 2026-11-20; re-check any `UNCERTAIN` item and correct this file if the code has moved on                            |

**Decisions to record:** ADR for the microphone and its privacy promises; ADR for device-only persistence; blueprint numbers for the new sections (use the next free numbers, do not guess); a short note in `Brand-Identity.md` for any new motion that exceeds the 400 ms UI token (spell, candle, gift reveal).

---

## 9. Part B — Updates to existing sections (from your 2026-11-19 screenshots)

> **Note on existing sections.** Part A (F1–F9) adds new things. **Part B changes what is already built.** Each item below says which existing section it replaces or modifies, what to remove, and what must keep working. Part B was written from your eight screenshots plus the as-built v2.0 guidebook; I have not seen the code or the Wish section. Where I rely on the guidebook instead of an image, it is marked.

### 9.0 What the screenshots show (audit)

| #   | Screenshot  | What I see                                                                                                                                                                                                                                                                                                | Likely cause (checked against the code 2026-11-20)                                                                                                             | Fixed by |
| --- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Bloom       | A dense grey-lavender particle fog fills about 65 % of the screen with soft blurry blobs; the line "Every moment with you opens like this." is small, centred near the top and low in contrast over the fog; the left third is empty. The Next.js dev badge covers the **Calm mode** button (bottom-left) | Scatter radius 3 plus the camera dolly to z 4.2 enlarges the points (size grows as 1/distance) and additive blending piles them up                             | U1, U2   |
| 2–4 | Dance       | The title "My favourite dance partner" collides with a **blown-out white** 3D heart; small hearts look like flat white or pale-yellow neon stickers; the figures are blocky (rectangular torso, no neck, stiff arms)                                                                                      | Heart parked at the title's position; a tiny-scale heart with 18,000 particles stacked on each other saturates to white; ambient hearts use near-white colours | U1, U3   |
| 5   | Dance (dip) | The dip pose breaks: the two bodies become overlapping slabs and are unreadable                                                                                                                                                                                                                           | Generated skeleton poses and 2-bone IK cannot produce believable partner contact                                                                               | U3       |
| 6   | Letter      | The gold border and corner curls stop about a third of the way down while the text continues; the backdrop has a **hard horizontal edge** (lighter grey-violet above, darker plum below); the scrollbar is a default lavender bar; text touches the top rod; floating hearts are pure white and pink      | The ornament frame is sized to the first screenful and sits outside the scrolling content; the backdrop wash layer does not cover the full stage               | U5, U1   |
| 7   | Finale      | A large pale-grey halo disc looks washed out; the heading sits on top of the heart; "Replay our story" and "Music off" look like default form buttons; bright white and yellow hearts float around                                                                                                        | Halo too wide and bright; default button variants; ambient hearts too bright                                                                                   | U1, U6   |
| 8   | Gate        | The composition is good, but the background has warm brown-pink blotches and lighter patches, with **visible gradient banding** (the "sloppy pixels" you noticed); the dev badge is bottom-left                                                                                                           | Large low-contrast radial gradients in 8-bit colour with no dithering; aurora layers too strong                                                                | U1       |

### 9.1 U1 — Look: darker, premium, less glare (global; modifies every section)

**Intent:** keep the lavender and gold glow, but make it feel like candlelight in a dark room rather than a bright screen. Fewer, finer, richer highlights; a darker base; no banding.

**Principles**

1. **Darkest surface wins.** The page base stays Midnight Aubergine. The lightest background anywhere on the page should be no lighter than Deep Plum. Nothing should read as a grey or pink wash.
2. **Highlights are rare and small.** Only the heart's core, the flame and a few glints are allowed to be near-white. Everything else tops out at about 80 % brightness.
3. **No pure white, no pale yellow.** Every glowing element takes its colour from the tokens (lavender, lilac, gold, rose) and is slightly dimmed.
4. **Dither every large gradient** so it can't band.

**Starting values to tune by eye (all are `UNCERTAIN` until you see them on real screens)**

| Area                            | Current (verified in code)                          | Target                                                                                                                                                                                                                                  | Where (verified)                                                 |
| ------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Aurora layers                   | lavender 35 %, gold 30 %                            | lavender about 14 %, gold about 10 %; smaller radii                                                                                                                                                                                     | `app/globals.css` (`--love-aurora-*`, gate and starlight styles) |
| Largest background gradient     | wide, low-contrast radials                          | add 4 % noise overlay (the existing `.love-grain`, raised to cover gradients) plus extra gradient stops to stop banding                                                                                                                 | `app/globals.css`, `sections/gate.tsx`                           |
| Gate halo and warm blotches     | breathing halo scale 1 → 1.04, warm lower-left glow | remove the warm brown-pink blotch; halo opacity about 60 % of today                                                                                                                                                                     | `sections/gate.tsx`                                              |
| `--depth` stops                 | up to Velvet Plum and lighter overlays              | cap the lightest stop at Deep Plum; keep the warming through `heart.gold`, not through a lighter background                                                                                                                             | `engine/theme-timeline.ts`                                       |
| Bloom threshold                 | 0.6                                                 | about 0.8                                                                                                                                                                                                                               | `canvas/love-canvas.tsx` (`NightBloom`)                          |
| Bloom intensity                 | 0.7 high / 0.4 mid                                  | about 0.45 high / 0.28 mid                                                                                                                                                                                                              | same                                                             |
| Tone mapping                    | none                                                | add a filmic tone-mapping effect so overlapping highlights roll off instead of clipping to white (`UNCERTAIN`: check the effect name and props in the installed `@react-three/postprocessing`)                                          | same                                                             |
| Vignette                        | none                                                | subtle edge darkening (offset about 0.3, darkness about 0.5)                                                                                                                                                                            | same                                                             |
| Heart output clamp              | 0.9                                                 | about 0.72                                                                                                                                                                                                                              | `canvas/heart-shaders.ts`                                        |
| Formed-heart alpha              | ×0.6 and ×0.55                                      | about ×0.45 overall                                                                                                                                                                                                                     | same                                                             |
| **Small-heart over-saturation** | none                                                | when `heart.scale` is small, the same 18,000 particles overlap and clip to white. **Scale alpha and drawn count with scale**, for example alpha × `mix(0.25, 1, smoothstep(0.2, 1.0, scale))` and `drawRange` × `clamp(scale, 0.25, 1)` | `canvas/heart.tsx`, `canvas/heart-shaders.ts`                    |
| Scattered particles (Bloom fog) | scatter radius 3; size grows near the camera        | clamp `gl_PointSize` to about 6–7 px × DPR; shrink size to about 55 % at full burst; scatter radius about 2.2; scattered alpha × 0.7                                                                                                    | `canvas/heart-shaders.ts`                                        |
| Ambient and mini hearts         | near-white and pale-yellow, large glow              | colours from tokens, never above about 80 % luminance, glow radius about 60 %, alpha 0.55–0.75, high tier 8 instead of 12                                                                                                               | `canvas/mini-hearts.tsx`                                         |
| Petals                          | fine (they look good)                               | unchanged, but dimmed over the Bloom text zone (see U2)                                                                                                                                                                                 | `canvas/petals.tsx`                                              |
| Finale halo                     | wide pale disc                                      | narrower, lower opacity, lavender-to-gold radial that falls to the background colour well before the edge                                                                                                                               | `sections/finale.tsx`                                            |
| Dev badge                       | covers Calm mode in dev                             | production does not show it. For screenshots set the Next.js dev indicator off (read `node_modules/next/dist/docs/` for the current option)                                                                                             | `next.config`                                                    |

**Acceptance:** side-by-side screenshots of Gate, Bloom, Dance, Letter and Finale (before and after) show a darker base, no blown-out hearts, no visible banding at 100 % zoom on a laptop and a phone, and the lavender and gold character is still clearly there. Check with the colour picker or a quick luminance sample rather than by eye alone.

**Do not** add a new dependency or change brand tokens; U1 only changes values, uniforms and overlays.

---

### 9.2 U2 — Bloom line ("Every moment with you opens like this.")

**Replaces:** the centred, small italic line in `sections/bloom.tsx` and its `top 70%` fade in `buildBloom`. **Keeps:** the burst, petals, camera dolly and heart path.

**Intent:** a statement, not a caption. It occupies the **left third** of the screen, arrives out of the burst, and the word "opens" literally opens.

**Layout (desktop):** a left-aligned column at 6 vw from the edge, width about 33 vw (minimum 18 rem, maximum 30 rem), vertically centred at about 45 % of the viewport. The heart is already moving to the right (0.55, 0.10), so the left third is free.

| Part                       | Style                                                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Small gold rule            | 48 px hairline plus a tiny heart, above the text                                                                                                         |
| Line 1: "Every moment"     | Cormorant Garamond italic, `clamp(1.8rem, 3.2vw, 3rem)`, foreground at 90 %                                                                              |
| Line 2: "with you"         | same style                                                                                                                                               |
| Line 3: "opens like this." | Cinzel, `clamp(2.2rem, 4vw, 3.8rem)`, gold-to-lavender gradient text (`background-clip: text`, tokens only), slight tracking                             |
| Underline                  | gold hairline under line 3 with a small heart at its end                                                                                                 |
| Scrim                      | a soft left-to-right gradient behind the column (about 70 % of the background colour fading to 0 by 45 % of the width) so petals never reduce legibility |

**Animation (a part of the Bloom burst event, so it adds no second big event):**

| Time after burst starts | What happens                                                                                                                                                                                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.35 s                  | The three lines' **words** emerge from the burst origin (the heart's screen position) and travel to their places along soft arcs. Each word: scale 0.6 → 1, opacity 0 → 1, a small rotation (±8°) and a short blur 6 px → 0 on those few words only. Stagger 0.14 s, `power3.out`, about 1.1 s each |
| about 1.9 s             | All words have landed; a faint gold glow pulses once on each as it settles                                                                                                                                                                                                                          |
| 2.0 s                   | **"opens"** opens: letter-spacing −0.05em → +0.02em over 0.9 s, then a gold shimmer sweep passes across line 3 (a masked highlight, one pass)                                                                                                                                                       |
| 2.4 s                   | The underline draws from left to right (0.9 s), its heart gives one tiny pulse                                                                                                                                                                                                                      |
| Leaving                 | As Bloom ends the column drifts left about 24 px and fades, scrubbed with scroll                                                                                                                                                                                                                    |

If she scrolls back above `top 80%` the text resets and plays again.

**Petal clearance:** also dim petals that are in the text zone (screen x below about −0.2) to about 40 % alpha in the petal shader. This closes the known gap "petals are not dimmed behind the Bloom text".

**Mobile:** the column becomes the lower third, full width (85 %), left-aligned, three stacked lines at smaller sizes; the heart stays at the top; words emerge from the top.

**Reduced motion / quiet:** 300 ms fade only; no travel, no blur, no shimmer.

**Config:** optional `copy.bloomLines?: [string, string, string]`; if absent, split `copy.bloomLine` by words into three balanced lines. Optional `copy.bloomEmphasis` (default "opens") names the word that opens.

**Build:** `SplitText` (words, `aria: 'auto'`) inside `useGSAP`; compute each word's start offset from the heart's NDC at trigger time (convert with the existing NDC helper); animate with GSAP transforms (not layout properties); limit `filter: blur` to the few words and remove it after landing; mark `will-change` only while animating.

**Acceptance:** the line is fully readable over the densest petal moment; the heart and the text never overlap; fast scroll through Bloom leaves the text either fully hidden or fully shown (never half-animated); a screen reader reads one clean sentence; works at 375 px.

---

### 9.3 U3 — Dance: a real or animated couple (replaces the particle dancers)

**Replaces:** the particle-silhouette couple (`canvas/dance-duo.tsx`, `dance-geometry.ts`, `dance-silhouettes.ts`, `dance-shaders.ts`, `engine/dance-state.ts` and their tests) **once the reel below is verified**. **Keeps:** the section, its copy (`danceTitle`, `danceLine`), the 250 vh sticky stage, and the heart pulse on the dip.

**Why a different approach:** the screenshots show that generated skeleton poses cannot reach the quality you want, especially in the contact moments (hands, waist, dip). Realistic partner motion is a content problem, not a rendering problem. So the section becomes a **pre-made couple clip that the scroll plays like a record**.

**What she sees:** a couple in the dark: the two hold hands, he lifts the joined hand and she **spins once under his arm**, they come close, and he guides her into a **gentle side dip**, supporting her back, held for a moment at the bottom. Smooth, with soft lavender and gold light.

> **Assumption to confirm:** I read "a dip to the side of the boy" as the boy guiding her into a side dip, leaning her over his supporting arm to his side. Tell me if you meant something different.

**Choreography beats (normalised scroll progress; tune once the footage exists):**

| Progress  | Beat                                                                                                                                                       | Heart event                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 0.00–0.15 | He approaches and offers a hand                                                                                                                            | –                                    |
| 0.15–0.30 | One hand joined, a small bow or nod                                                                                                                        | `pulse`                              |
| 0.30–0.62 | He raises the joined hand; **she spins once** (gown and hair sway)                                                                                         | soft `shine`                         |
| 0.62–0.78 | She returns, they come close, a slow sway                                                                                                                  | –                                    |
| 0.78–1.00 | **Side dip**: he steps to the side, supports her back, she leans back with her free arm extended. The last 10 % of scroll is slowed so the dip is savoured | `pulse` + 6 tap hearts at the bottom |

#### 9.3.1 Source options (the player works with any of them)

| Route                               | What it is                                                                                                                                       | Strengths                                                  | Risks                                                                                                                          | Effort                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **A. Film the two of you**          | Real footage of real dancers (you two, or two dancers), on a dark backdrop, graded lavender and gold                                             | The most real and the most personal; no uncanny valley     | Needs rehearsal, lighting, and a clean background removal; the dip must be safe                                                | Medium                       |
| **B. AI-generated animated couple** | An image-to-video model creates the clip from reference images, in a stylised "animated film" look                                               | Fastest path to smooth motion; no rigging; you can iterate | Faces drift after spins, hands blur, feet slide, contact errors; you need several takes; terms and consent for uploading faces | Low–medium, but many retries |
| **C. 3D render**                    | Stylised 3D characters animated with purchased partner mocap (a couple's waltz with separate male and female roles), then **rendered to frames** | Total control of camera and light; clean alpha             | Retargeting differs per body, so the hands can miss; the dip segment needs authoring; needs Blender skills                     | High                         |

**What the research found about B** (so expectations are realistic): current video models can take two reference photos and make two people spin hand in hand, and some accept the first frame from a photo. The same guides warn about face drift after fast spins, blurred hands, feet sliding on the floor, and that no generator guarantees identical faces in every frame, so you must check the result. Their advice is to generate **one spin per clip**, use full-body references with the hands visible, and ask explicitly for the moves (spin, dip) instead of just "dance". Multi-person identity during hand contact is also an open research problem. I have not tested any of these tools on your two characters.

**What the research found about C:** purchased couple-dance packs exist (professionally captured, separate male and female roles) but their listings warn that the animation depends heavily on the source skeleton proportions and that other bodies cause hand mismatches.

**Recommendation:** start with **B in a 3D-animated style** to get a smooth result quickly (the "not photorealistic" look hides most of the uncanny errors), judged against a strict quality bar (below). If it fails the bar after a few rounds, switch to **A** (film yourselves). Choose **C** only if you have a 3D artist. Because the player is source-agnostic, switching costs only new frames.

**Quality bar (all must be true or the clip is rejected):** stable faces and outfits for the whole clip; both hands visible and correct during the hold; no extra or missing fingers; no sliding feet; the spin completes without limb distortion; the dip never intersects bodies; a still of the bottom of the dip looks romantic, not awkward.

#### 9.3.2 Making the clip

**Segmenting (route B):** do not ask for the whole dance at once. Make three clips and chain them: the **last frame of each clip becomes the first frame of the next**.

1. Clip 1: approach, hands join, small bow.
2. Clip 2: one spin under the raised hand, return to closed position.
3. Clip 3: close hold, then the side dip and hold.

**Prompt skeleton (adapt to the tool; keep it concrete):**

```text
Two people, exactly two, head to toe in frame for the entire clip, about two thirds of the frame height, space above their heads.
Locked-off camera, no cuts. Dark plum background, soft rim light in lavender and gold, graceful and slow.
Style: stylised 3D-animated film, not photorealistic.
Same faces, hair, and outfits in every frame (reference images attached): her lavender gown, his dark suit with a gold detail.
Beats: [per clip]
- Clip 2 example: he lifts her right hand; she performs ONE slow spin under his arm; gown sways; both hands stay correctly joined; she returns to face him.
Constraints: no third person, no extra limbs or fingers, no face on clothing, feet planted on the floor, no sliding.
```

**Film route (A) shot list:** plain dark backdrop (or green screen), about 3 × 3 m clear floor; soft front light plus two rim lights (warm gold and lavender if you have them); phone on a tripod at chest height, locked exposure and focus, 4K, 30 or 60 fps, both full bodies with feet visible; her in a flowing lavender gown, him in a dark suit with a lighter shirt so he separates from the backdrop; slow music at about 70–90 bpm in earbuds or a speaker (the audio is discarded); rehearse the dip with proper support; 5–8 takes.

**Render route (C):** render frames at the sizes below with alpha. Check the pack's licence for web use of rendered output before you buy.

**Preparing the frames (all offline, on your machine):**

- Retime to a steady 24 fps if needed (frame interpolation helps AI clips).
- Grade to lavender and gold; remove the background to **alpha** (a green-screen key for route A, any background-removal tool you trust for the others).
- Export two sets in **3:4**: **desktop 720 × 960** and **mobile 480 × 640**, as WebP with alpha, quality about 70–78. (3:4 gives the dip enough width; this replaces the earlier 2:3 sizes.)
- Store about 120–144 frames (about 15–18 fps over an 8 s dance); the player blends neighbours. Move to 24 fps (about 192 frames) only if ghosting is visible and the budget allows.
- Also export two stills: **start** and **dip** (for fallbacks).
- A small script (`scripts/prepare-dance-reel.mjs` or shell, using `ffmpeg` and `cwebp`, written by Claude Code and run by you) outputs `public/dance-reel/desktop/0001.webp…`, `public/dance-reel/mobile/0001.webp…`, `posters/start.webp`, `posters/dip.webp` and `manifest.json`.

**Why frames on a canvas and not a `<video>`:** scrubbing a video element is unreliable because seeking is asynchronous and depends on keyframes; mobile Safari adds playback restrictions. Drawing already-decoded frames to a canvas is synchronous and cheap. Typical WebP frames run about 15–40 KB, so 90 frames at 25 KB average is about 2.25 MB, and the load order matters.

**Budgets (starting values):** desktop set at most about 4–5 MB, mobile set at most about 2.5 MB, loaded in the background after the gate (first frame and a coarse stride first, then the rest sorted by distance from the current scroll position).

#### 9.3.3 The player (`DanceReel`)

```jsonc
// public/dance-reel/manifest.json
{
  "version": 1,
  "alpha": true,
  "sets": {
    "desktop": { "dir": "desktop", "frames": 132, "width": 720, "height": 960 },
    "mobile": { "dir": "mobile", "frames": 132, "width": 480, "height": 640 },
  },
  "beats": { "join": 0.18, "spinStart": 0.34, "spinEnd": 0.62, "dip": 0.92 },
  "posters": { "start": "posters/start.webp", "dip": "posters/dip.webp" },
}
```

| Concern       | Behaviour                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drawing       | One 2D `<canvas>`, DPR capped at about 1.5; draw frame `i` and, for smoothness, blend frame `i+1` with alpha equal to the fraction                                                                                  |
| Smoothing     | The scroll target is eased with a damp function (about rate 8) so chunky wheel input still advances frames smoothly; a slow zone over the last 10 % for the dip                                                     |
| Loading       | Fetch the first frame immediately; then every 8th frame; then fill in by proximity to the current progress; 3–4 concurrent fetches; frames cached as blobs                                                          |
| Decoding      | `createImageBitmap` ahead of need inside a **sliding window**: about ±16 frames desktop, ±12 mobile (keeps decoded memory around 90 MB desktop and 30 MB mobile at the 3:4 sizes); close bitmaps leaving the window |
| Tier          | `high`/`mid` use the desktop set, `low` the mobile set, `static` and reduced motion use only the two posters crossfaded by scroll                                                                                   |
| Failure       | If frames fail to load, show the posters; never leave an empty stage                                                                                                                                                |
| Events        | The loader exposes the `beats` so `buildDance` fires heart events from the manifest, not from hard-coded numbers                                                                                                    |
| Accessibility | The canvas is `role="img"` with an `aria-label` describing the dance; the section text carries the meaning                                                                                                          |

**Layout fix (from the screenshots):** the heading must never touch the 3D heart. Heading and subline are left-aligned in the top-left (desktop) or top-centre (mobile); the heart's Dance pose moves to the top-right (about (0.72, 0.5) scale 0.16, mobile about (0.78, 0.70) scale 0.14); the reel sits centred in the lower 70 %. Give the couple a soft **spotlight pool** on the floor (a dim elliptical gradient) so they feel grounded.

**Cinematic touch:** a very slow zoom of the canvas (scale 1 → 1.06) across the stage, scrubbed; a few of the existing sparks rising near the couple; nothing else.

**Mobile:** the reel is the mobile set at about 88 % width; no zoom; the heart stays in its corner.

**Removal blast radius (verified):** `canvas/dance-duo.tsx` (mounted at `canvas/love-canvas.tsx:71`), `canvas/dance-geometry.ts` (also imported by `sections/dance.tsx:3`), `canvas/dance-silhouettes.ts` (imported by `sections/dance.tsx:4–9`), `canvas/dance-shaders.ts`, `engine/dance-state.ts` (imported by `engine/story.ts:8`), `engine/dance-state.test.ts`, `canvas/dance-geometry.test.ts`, and `danceParticles` in `engine/tiers.ts`.

**Files:** new `sections/dance-reel.tsx`, `engine/dance-reel-loader.ts`, `engine/dance-reel-math.ts` (frame index, blend fraction, damping, window selection, slow zone; **unit tested**), `scripts/prepare-dance-reel.*`, `public/dance-reel/…`; update `engine/story.ts` (`buildDance`), `engine/heart-path.ts` (new Dance pose), `engine/tiers.ts` (remove the dance particle counts; add reel set selection), `sections/dance.tsx`. Remove the old `canvas/dance-*` files, `engine/dance-state.ts` and their tests **after** the reel passes QA, and update the guidebook.

**Acceptance:** the spin and the dip play smoothly forward and backward at any scroll speed; no visible stutter on a mid-range phone; frames never leave a blank stage even on a slow connection; the quality bar above is met; the heading and the heart never overlap; the dip's slow zone feels intentional.

**Rights and consent:** exact likenesses were chosen, with her consent. Keep a record of what she agreed to (her photos going to a third-party AI service, her stylised likeness on a private site, retention and deletion) and see `Dance-Clip-Production-Guide.md` §14. If the site is reused as a demo, ask again. Check each service's terms for commercial use. Stock footage must be licensed for web use. Purchased mocap or render assets must allow rendered output on the web.

---

### 9.4 U4 — Wish UI

> **Note:** I have not seen the Wish section on screen. This is based on the as-built description (heading, star, SVG ring, "Press and hold", "Or tap once", wish textarea). Send a screenshot and I will refine it. The shell below also hosts the **candle** (F5), which replaces the star inside it.

**Replaces:** the layout and styling of `sections/wish.tsx`. **Keeps:** `useHold`, `wishMerge`, `session.wishDone`, the local-only textarea, and the quiet-mode single click.

**Intent:** the same premium look as the gate: a framed, calm, ceremonial moment.

**Layout (top to bottom, centred, generous spacing):**

| Element              | Style                                                                                                                                                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kicker               | "Make a wish", Inter, small caps, wide tracking, gold-text                                                                                                                                                                                                                                             |
| Heading              | "{name}, close your eyes…" (`copy.wishPrompt`), Cinzel, `clamp(2rem, 4.4vw, 3.2rem)`, foreground                                                                                                                                                                                                       |
| **Medallion**        | A circle about `min(70vw, 20rem)` with the gate's **double gold hairline frame**, a soft plum inner fill, and the star (or the candle) in the centre. The progress ring is thicker (3 px), a lavender-to-gold gradient, with fine tick marks like a watch dial. Idle: three tiny sparkles orbit slowly |
| Hint pill            | A small rounded pill (plum fill, gold hairline): finger icon + "Press and hold" (Inter 0.9 rem). While holding it changes to "Keep holding…"                                                                                                                                                           |
| Alternative          | A text link, "Or tap once", with a proper focus ring                                                                                                                                                                                                                                                   |
| Wish card (optional) | "Write your wish" opens a small **parchment card** matching the letter style (Cormorant text, gold quill icon, "Stays on this device"); collapsed by default so it never crowds the stage                                                                                                              |
| After the wish       | Cinzel gold "May every wish come true." and a ghost button "Make another wish"                                                                                                                                                                                                                         |

**Interaction improvement:** the **whole medallion is the hold target** (a large, forgiving area, at least 88 px and in practice about 300 px), instead of a small 96 px button. It remains a real `<button>`.

**Brightness:** star halo caps at about 70 % (see U1); confetti colours from tokens.

**States:** idle → holding → complete → resting (each visually distinct; the heart rises as before).

**Quiet mode:** medallion without the ring animation; "Tap the star" (or "Tap the candle") is the only instruction; one click completes.

**Mobile:** single column; medallion scales to 70 vw; the wish card opens as a bottom sheet.

**Acceptance:** one clear instruction visible at all times; a thumb can hold the target without precision; no text overlaps the medallion; focus ring visible; announcements unchanged (`aria-live` for completion).

---

### 9.5 U5 — Letter: border and backdrop that run the full length

**Replaces:** the ornament, frame and backdrop structure in `sections/letter.tsx` and `sections/letter-ornaments.tsx`. **Keeps:** the parchment look, rods, unroll, hold-or-scroll opening, drop cap, heart dividers, passphrase, `data-lenis-prevent`.

**Problems seen (screenshot 6):** the gold border and corner curls end after the first screenful while the letter continues; the backdrop has a hard light/dark split; the scrollbar is a default lavender bar; the first line touches the top rod.

**Root cause (verified):** `ParchmentFrame` (`sections/letter-ornaments.tsx:105`) is absolutely positioned inside the scrolling `article[data-letter-card][data-lenis-prevent]` (`sections/letter.tsx:202–211`), so it sizes to the visible box, not to the content.

**Structure (fix):**

```text
.parchment            ← the visible window between the two rods (clips; height ≈ min(78svh, 40rem))
  .scroll             ← overflow: auto; data-lenis-prevent; the thing that scrolls
    .sheet            ← position: relative; grows with the text (min-height: 100%)
      .frame          ← absolute; inset: 12px; double gold border; spans the WHOLE sheet
      .corners        ← four SVG curls: top two at the sheet's top, bottom two at the sheet's bottom
      …content…       ← salutation, drop cap, paragraphs, heart dividers, sign-off, closing ornament
```

The key change: the frame and curls live **inside the scrolling `.sheet`**, so they stretch to the true end of the letter. The side stripes run the full height, and the bottom curls only appear when she reaches the end.

**Details**

- Padding at the top of the sheet so text never touches the rod (about 2 rem), and at the bottom for the sign-off and a closing heart ornament.
- **Soft fades** (parchment-coloured gradients, about 24 px) at the top and bottom of the window, so the cut-off text looks intentional.
- **Scrollbar:** thin, gold on transparent (`scrollbar-width: thin; scrollbar-color`, plus the WebKit scrollbar pseudo-elements for Safari). Not the default lavender.
- **Scroll hint:** a small gold chevron under the first lines that bobs gently and disappears after the first scroll inside the letter.
- **Backdrop:** the wash and the three depth layers of gold hearts must cover the **entire stage** (`inset: 0`, full height) with a gradient mask instead of a hard edge, so there is no two-tone split.
- **Brightness:** floating hearts take token colours at about 60 % opacity (U1).

**Quiet mode:** the open letter uses the same structure with no unroll.

**Acceptance:** the border and ornaments are visible all the way to the sign-off at 375 px and 1440 px; no horizontal seam anywhere in the backdrop; the end of the letter shows the bottom curls; the scrollbar matches the theme; works with 3 paragraphs and with 12.

---

### 9.6 U6 — Finale and the button system

**Replaces:** the layout and button styling in `sections/finale.tsx` (and any other default-looking buttons, see below). **Keeps:** the burst or spell moment (F1), Replay logic, `finalePlayed` guard.

**Problems seen (screenshot 7):** the heading sits on top of the heart; the halo is a flat pale disc; "Replay our story" and "Music off" look like generic form buttons, and the two together feel arbitrary.

**New layout (desktop and mobile):**

| Zone        | Content                                                                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Top         | The heart, moved higher: about (0, 0.25) scale 1.1 desktop, (0, 0.30) scale 0.9 mobile. **This is also where F1 writes the name and "I love you"**, so the area stays clear of text |
| Middle      | Heading "Happy birthday, {name}." (Cinzel), message (Cormorant italic), then a thin gold hairline with a small heart in the middle                                                  |
| Bottom      | Primary action, then quiet secondary links (below)                                                                                                                                  |
| Behind text | A soft scrim so the glow never lowers contrast                                                                                                                                      |

**Button system ("love buttons"), used site-wide** (add variants to the `cva` map in `src/components/ui/button.tsx`, verified; it already has `default`, `secondary`, `outline`, `ghost`, `link`, `luxury`, `gold`, …):

| Variant        | Use                                                | Style                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `love-primary` | "Replay our story", wish and gift confirmations    | Dark plum fill; **1 px gold gradient border**; Cinzel small caps, letter-spacing about 0.18em, gold-text colour; leading icon (for example a circular arrow) 16 px; hover: border brightens and a **soft** gold glow (about 6 px, low alpha); focus ring in `--ring`; pressed scale 0.98; medium radius (not a pill); height 48 px on mobile, full width |
| `love-ghost`   | Secondary actions ("Make another wish")            | Transparent, hairline lavender border, Inter, lavender text                                                                                                                                                                                                                                                                                              |
| `love-link`    | Tertiary ("There's a little more…", "Or tap once") | Text with an animated gold underline and a small chevron                                                                                                                                                                                                                                                                                                 |

**Finale specifics**

- **Remove the large "Music off" button.** The music toggle already exists at the top right. If a control is wanted here, use a quiet `love-link` such as "♪ Music on / off" (same `useMusicToggle`, `aria-pressed`).
- "Replay our story" is the only prominent button.
- Below it, a `love-link` "There's a little more…" leads to Afterglow (F6).
- Spacing: 24 px between the hairline and the primary, 16 px between the primary and the links.
- The halo: narrower, dimmer, lavender-to-gold, falling to the background colour before its edge (U1).
- If the credit line exists, show "Music: {credit}" in small muted Inter at the very bottom.

**Quiet mode:** identical layout; no burst.

**Acceptance:** no text overlaps the heart at 375 px or 1440 px; buttons share one consistent style and spacing; contrast of button text is at least 4.5:1; the replay still resets cleanly; keyboard order is Replay, then the links.

---

## 10. Added milestones for Part B (superseded)

> **Superseded 2026-11-20** by §0: MU1 → M23, MU2 → M24, MU6 → M25, MU4 → M26, MU5 → M27, MU3a/b/c → M38/M39/M40. Kept for history.

Run **MU1 first** (it changes every screenshot and affects all later QA). MU2, MU4, MU5 and MU6 are independent of each other. **Start producing the dance footage now (MU3a)**, because it has the longest lead time.

| M        | Goal                  | Prompt to give Claude Code (adapt to the repo flow)                                                                                                                                                                                                                                                                                                                                                        | Done when                                         |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **MU1**  | U1 Look               | "Read Phase 8 §9.0–9.1. Apply the brightness, banding and glare changes in the table in small commits: gradients and dithering, bloom threshold and intensity, tone mapping and vignette (verify the effect names), heart alpha with scale, scattered-particle size clamp, token-coloured dimmer ambient hearts, finale halo. Take before and after screenshots of Gate, Bloom, Dance, Letter and Finale." | Acceptance in §9.1                                |
| **MU2**  | U2 Bloom line         | "Implement §9.2: left-third column, word-by-word emergence from the burst, the opening 'opens', the underline, the scrim, petal dimming, mobile layout and reduced motion."                                                                                                                                                                                                                                | Acceptance in §9.2                                |
| **MU3a** | Dance source and clip | "Not a coding task. Follow `Dance-Clip-Production-Guide.md`: character sheets, five keyframes, then one test segment (the spin, S2) judged with the score sheet. Report whether the spin passes before producing the rest."                                                                                                                                                                                | A clip that passes the quality bar                |
| **MU3b** | Dance reel player     | "Build `DanceReel` per §9.3.3 against a placeholder clip: manifest, loader, sliding-window decoding, math helpers with unit tests, posters fallback, new layout and heart pose. Keep the old dancers until the reel passes QA."                                                                                                                                                                            | Smooth scrub on a mid-range phone; fallbacks work |
| **MU3c** | Dance final           | "Swap in the final frames and beats, tune the slow zone and the heart events, remove the old particle dance code, update the guidebook and tier table."                                                                                                                                                                                                                                                    | Acceptance in §9.3                                |
| **MU4**  | U4 Wish UI            | "Implement §9.4: the medallion, ring, hint pill, wish card, whole-medallion hold target, states and quiet mode. Leave a slot for the candle (F5)."                                                                                                                                                                                                                                                         | Acceptance in §9.4                                |
| **MU5**  | U5 Letter frame       | "Restructure the letter per §9.5 so the frame, curls and stripes live inside the scrolling sheet, add fades, a gold scrollbar, a scroll hint, full-stage backdrop and top padding."                                                                                                                                                                                                                        | Acceptance in §9.5                                |
| **MU6**  | U6 Finale and buttons | "Add the `love-primary`, `love-ghost` and `love-link` button variants, rebuild the finale layout, remove the duplicate music button, and update any other default-looking buttons."                                                                                                                                                                                                                        | Acceptance in §9.6                                |

---

## 11. QA additions for Part B

| Test                             | Pass condition                                                                                                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Before and after screenshots** | Gate, Bloom, Dance, Letter, Finale: darker base, no blown-out hearts, no banding at 100 %, lavender and gold character intact                                                                 |
| **Phone screens**                | Check on a real phone (OLED and LCD if possible): banding and glare are the first things to show up there                                                                                     |
| **Bloom text**                   | Readable over the densest petals at 375 and 1440 px; fast scroll never leaves it half-animated                                                                                                |
| **Dance reel**                   | Smooth forward and backward at wheel, trackpad and touch speeds; no blank frames on throttled Slow 4G; posters appear if frames fail; memory stays within the budget in the Performance panel |
| **Dance quality**                | The quality bar in §9.3.1 on the final clip; a still of the dip looks romantic                                                                                                                |
| **Wish**                         | A thumb can hold the medallion; no overlap; quiet mode works with one click                                                                                                                   |
| **Letter**                       | Frame, stripes and curls reach the end; no seam in the backdrop; works for 3 and 12 paragraphs                                                                                                |
| **Buttons**                      | One consistent style; focus ring visible; contrast at least 4.5:1; keyboard order correct                                                                                                     |

---

## 12. Content and assets for Part B

| Item                               | Detail                                                                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Dance source decision**          | Route A (film), B (AI, stylised) or C (3D render); and whether the characters are exact likenesses or inspired by you                   |
| **Reference photos (route B)**     | Full-body photos of each person, hands visible, feet in frame, plain background; her lavender gown and his dark suit with a gold detail |
| **Footage (route A)**              | 5–8 takes of the choreography with the shot list in §9.3.2                                                                              |
| **Final frames**                   | Desktop and mobile sets, two posters, `manifest.json` (produced by the script)                                                          |
| **Bloom lines**                    | Confirm or rewrite the three lines and the word that opens                                                                              |
| **Wish copy**                      | Kicker, heading, hint, completion message                                                                                               |
| **Screenshot of the Wish section** | So U4 can be refined against the real UI                                                                                                |

---

## 13. Risks and decisions for Part B

| Risk / decision                         | Impact                                           | Mitigation                                                                                              |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Dance quality depends on the source** | A bad clip is worse than the current silhouettes | Strict quality bar; chain short clips; fall back to filming; keep the old dancers until the reel passes |
| **Likeness and consent (AI route)**     | Uploading her face to a third-party service      | Decide consciously; prefer characters inspired by you; check the service's terms                        |
| **Frame weight**                        | Slow load on mobile                              | Two sets, stride loading, budgets, low tier uses the small set                                          |
| **Decoded-frame memory**                | Crashes on low-memory phones                     | Sliding window and closing bitmaps; verify in the Performance panel                                     |
| **Over-darkening**                      | Loses the glow you like                          | Change values in small steps; compare screenshots; keep gold and lavender highlights                    |
| **Dip safety (route A)**                | Injury                                           | Rehearse with proper support; keep it gentle                                                            |
| **Spec drift**                          | Wrong assumptions                                | Verified 2026-11-20; re-check `UNCERTAIN` items before use                                              |

**Decisions to record:** a short ADR for "dance as a pre-rendered frame sequence" (and the retirement of the particle dancers); a Brand note for the new button variants; update the guidebook (Dance, Wish, Letter, Finale, Bloom) and the tier table to as-built after each milestone.
