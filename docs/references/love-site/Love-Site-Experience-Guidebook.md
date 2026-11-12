# B&V Birthday Love Site — Experience & Interaction Guidebook

| Field                            | Value                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Version                          | 1.0                                                                                                                                                                      |
| Status                           | Proposed (build starts after approvals listed in the Tech Stack document §12)                                                                                            |
| Created                          | 2026-11-12                                                                                                                                                               |
| Audience                         | Claude Code (builder) and the developer (reviewer)                                                                                                                       |
| Location                         | `docs/references/love-site/Love-Site-Experience-Guidebook.md` (moved 2026-11-12)                                                                                         |
| Build order and repo corrections | [Love-Site-Implementation-Phases.md](Love-Site-Implementation-Phases.md). Its §2 overrides this file where they differ; its six phases group the milestones in §15 below |
| Companion document               | `Love-Site-Tech-Stack-and-Tools.md` (packages, versions, architecture, performance, governance)                                                                          |
| Brand source                     | `Brand-Identity.md` v1.6 (tokens, fonts, motion rules)                                                                                                                   |

This document describes **what the site does, section by section, and how to build each part**: layout, scroll mechanics, the heart's behaviour, every interaction, reduced-motion and mobile behaviour, tools, and acceptance tests. Copy lines shown are placeholders to be rewritten by the owner.

---

## 1. Concept and emotional arc

**One sentence:** two lights find each other, become a heart, and that heart travels with her through the story of you two, until it lands on a letter.

**Emotional arc** (this drives pacing, colour and music):

| Phase        | Feeling                                 | Sections        |
| ------------ | --------------------------------------- | --------------- |
| Anticipation | Hush, curiosity                         | Gate, Hero      |
| Wonder       | Awe, play                               | Bloom, Memories |
| Tenderness   | Warmth, recognition                     | Timeline        |
| Release      | Relief, lightness (night turns to dawn) | Dawn            |
| Joy          | Celebration                             | Gallery, Wish   |
| Intimacy     | Quiet, personal                         | Letter          |
| Resolution   | Love, a smile                           | Finale          |

**Brand fit:** calm, cinematic, premium, soft luxury. Lavender is the signature, champagne gold is the luxury accent, dusty rose is a touch of romance. Never neon, never Valentine-red, never bouncy or chaotic. Heavy animation here means **long, slow, well-timed moves**, not lots of effects at once.

**The design principle for the whole site:** the path is scrubbed, the moments are triggered. Continuous things (heart position, camera, theme, thread drawing) follow the scroll. Dramatic things (burst, arrow strike, wish) are timed events that play at a fixed speed once triggered.

---

## 2. Rules for Claude Code (read before every milestone)

1. Colours come from tokens only. No hex values in components. (Hex values in this document are for reference.)
2. Every animation has a reduced-motion variant (Tech Stack §9.1).
3. GSAP owns scroll-linked and 3D-state animation. Motion owns small component transitions. **Never both on the same element.**
4. Per-frame values live in the mutable `heart` object and refs. **No `setState` per frame.**
5. Every dramatic event goes through `HeartDirector`, one at a time, with the baseline invariant (Tech Stack §7.4).
6. Every clickable 3D object has a focusable DOM twin.
7. Use `useGSAP()` with a `scope` and `gsap.matchMedia()`; everything must clean up on unmount.
8. One big event per section. If a second effect is proposed, ask first.
9. No new dependencies beyond the approved list. No literal colour names in class names.
10. Before Next.js-specific code, read `node_modules/next/dist/docs/`. Commit per milestone and update `progress.md`, `AI_SESSION_LOG.md`.
11. Mark anything unverified as `UNCERTAIN` in code comments and in the session log.

---

## 3. Global systems

### 3.1 Theme timeline (night → dawn)

The page owns its theme. The route root `[data-love-root]` defines two small sets of alias tokens (night = the dark token values, day = the light token values) and one animated number, `--dawn` (0 = night, 1 = day). All semantic tokens inside the root are derived from those with `color-mix`.

**Reference values (from Brand-Identity v1.6 §32.1 and §41.6):**

| Role             | Night (dark tokens)          | Day (light tokens)       |
| ---------------- | ---------------------------- | ------------------------ |
| background       | Midnight Aubergine `#17121D` | Warm Ivory `#FAF7F2`     |
| surface          | Deep Plum `#241B2E`          | Soft Blush `#F3D8D6`     |
| surface-elevated | Velvet Plum `#2F243A`        | white `#FFFFFF`          |
| foreground       | Moon Ivory `#F7F1EA`         | Soft Charcoal `#1C1B1A`  |
| border           | Smoky Taupe Plum `#4A3A50`   | Warm Taupe `#D8C8BD`     |
| muted-foreground | Lavender Taupe `#B8AABD`     | `#5E524C`                |
| primary (both)   | Signature Lavender `#C8B6E2` | same                     |
| gold             | Candlelight Gold `#D2B16F`   | Champagne Gold `#C6A15B` |
| secondary (rose) | Muted Rose `#B9828A`         | Dusty Rose `#C98F94`     |

**Implementation sketch (alias tokens live in a clearly marked block in `app/globals.css`, with a comment "mirrors Brand §32.1 and §41.6; update together"):**

```css
[data-love-root] {
  --dawn: 0; /* animated 0 → 1 by GSAP */
  --night-bg: #17121d;
  --day-bg: #faf7f2;
  --night-surface: #241b2e;
  --day-surface: #f3d8d6;
  --night-fg: #f7f1ea;
  --day-fg: #1c1b1a;
  /* derived roles used by the experience */
  --background: color-mix(
    in oklab,
    var(--day-bg) calc(var(--dawn) * 100%),
    var(--night-bg)
  );
  --surface: color-mix(
    in oklab,
    var(--day-surface) calc(var(--dawn) * 100%),
    var(--night-surface)
  );
  --foreground: color-mix(
    in oklab,
    var(--day-fg) calc(var(--dawn) * 100%),
    var(--night-fg)
  );
}
```

Animating one number (`--dawn`) is cheaper and more robust than tweening many colour variables. Before the Dawn section, a second small number (`--depth`, 0 → 1) deepens Midnight Aubergine toward Deep Plum then Velvet Plum for a subtle sense of descending into the night.

**Stops by section:**

| Section           | `--dawn`              | Background feel                      | Text colour   | Notes                             |
| ----------------- | --------------------- | ------------------------------------ | ------------- | --------------------------------- |
| Gate, Hero, Bloom | 0                     | Midnight Aubergine                   | Moon Ivory    | The darkest, calmest part         |
| Memories          | 0 (`--depth` 0 → 0.5) | Aubergine → Deep Plum                | Moon Ivory    | Orbs glow against the dark        |
| Timeline          | 0 (`--depth` 0.5 → 1) | Deep Plum → Velvet Plum              | Moon Ivory    | Warmest night                     |
| **Dawn**          | **0 → 1**             | Plum → lavender dusk → Blush → Ivory | flips mid-way | **Text-free window** (see §10)    |
| Gallery           | 1                     | Warm Ivory with Blush surfaces       | Soft Charcoal | Light mode, the brand's hero look |
| Wish              | 1                     | Soft Blush                           | Soft Charcoal | Confetti reads well on Blush      |
| Letter            | 1                     | Warm Ivory, white paper              | Soft Charcoal | Quiet and intimate                |
| Finale            | 1                     | Ivory with a soft Blush glow         | Soft Charcoal | Gold halo around the heart        |

**Contrast rule:** at every _resting_ scroll position text must meet 4.5:1. The mid-tone lavender dusk exists only inside the Dawn gap, where no text is shown.

**Canvas colours:** read once from computed tokens (`getComputedStyle`) into `THREE.Color` uniforms. Update the uniforms from `--dawn` each frame (cheap) so the clear colour and glow tint track the page.

### 3.2 Typography and layout

- **Display / section titles:** Cinzel (use the fluid display and heading sizes from Brand §19.1). Hero title in Moon Ivory with a small gold detail.
- **Copy:** Cormorant Garamond at the brand body size (20 px per v1.5). Letter body and captions use it; the letter sign-off may use italic.
- **UI (buttons, labels, dates, hints):** Inter.
- **Dates:** Inter, small caps feel, muted-foreground.
- **Text columns:** ≤ 60 characters wide; generous spacing from the spacing scale (Brand §34); containers from the container scale (§35).
- **Buttons:** primary = Signature Lavender background with dark text; secondary = transparent with border. Use the existing button component and the **medium radius**, not a pill.
- **Cards and photo frames:** bordered cards (Brand v1.6), tokens only.
- **Gold in text** uses `gold-text`, never `gold` directly, for contrast.
- **Over-image text** always gets a gradient scrim.

### 3.3 The heart: two skins

| Skin      | Used                                   | Rendering                                                                                                                                                                    | Look                                                                                                 |
| --------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Aura**  | Night (Gate → Timeline, start of Dawn) | Thousands of additive particles + soft bloom                                                                                                                                 | Lavender core, lilac glow, thin champagne-gold edge, a few dusty-rose sparks. Soft, never neon       |
| **Pearl** | Day (end of Dawn → Finale)             | Normal-blended fine particles + an extruded heart mesh (`ExtrudeGeometry` from a heart `Shape`, small bevel) with a `MeshPhysicalMaterial` (soft clearcoat/sheen) + gold rim | Pearl satin lavender-ivory, soft gold rim, a gentle contact shadow (blurred plane, not real shadows) |

`heart.skin` cross-fades 0 → 1 during the Dawn gap. Glow does not read on light backgrounds, which is why Pearl exists. **No red.** The heart's colours are lavender, lilac, gold and rose.

**Colour distribution of particles** (per-particle random `aRand.z`): about 55 % Signature Lavender, 15 % Soft Lilac Glow, 22 % gold, 8 % rose. Ribbon colours are tied to side (left lavender, right gold); after weaving, a left-to-right gradient remains (lavender left, gold right, softly blended in the middle) to keep the "two lights become one" story visible.

### 3.4 Heart particle system (spec)

**One `THREE.Points`**, one `ShaderMaterial`, positions computed on the GPU from three target sets.

| Attribute         | Meaning                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `aRibbon` (vec3)  | Position on the incoming ribbon (a helix)                            |
| `aHeart` (vec3)   | Target position on the heart (outline band plus interior fill)       |
| `aScatter` (vec3) | Burst target (random point in a sphere, radius about 3 × heart size) |
| `aRand` (vec4)    | x: stagger seed, y: size, z: colour mix, w: phase                    |

| Uniform                                                | Driven by                         |
| ------------------------------------------------------ | --------------------------------- |
| `uForm`                                                | `heart.form` (ribbons → heart)    |
| `uBurst`                                               | `heart.burst` (whole → scattered) |
| `uTime`, `uPR`                                         | clock, device pixel ratio         |
| `uBeat`                                                | `heart.beat` (audio)              |
| `uShine`                                               | `heart.shine`                     |
| `uSkin`                                                | `heart.skin`                      |
| `uColorLav`, `uColorLilac`, `uColorGold`, `uColorRose` | token colours                     |

**Counts:** allocate 18,000 once; draw 18,000 / 8,000 / 3,000 by tier using `setDrawRange` (Tech Stack §8.2).

**Heart shape generator (use the standard parametric heart):**

```ts
// t in [0, 2π). Returns a point of the heart outline, normalised to about [-1, 1].
export function heartPoint(t: number): [number, number] {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return [x / 17, y / 17];
}
// Distribution: ~70 % on a soft band around the outline (small random offset),
// ~30 % interior fill using radius = sqrt(random) toward the centre.
// z thickness: (random - 0.5) * 0.45 * (1 - radius) so the heart is rounded, not flat.
```

**Ribbon generator:** two ribbons (left and right). For parameter `s` in [0, 1]: centre line moves from far off-screen toward the centre (`x = side * (1 - s) * W`); helix radius shrinks as it approaches (`r = r0 * (1 - s)^0.6 + r1`); angle `θ = turns * 2π * s`; `y = r sin θ`, `z = r cos θ`. In the shader, `uTime` rotates the helix phase and flows particles forward so the ribbons feel alive. **Mapping to the heart:** the left ribbon traces the **left half** of the heart outline and the right ribbon the **right half**, with the ribbon parameter `s` mapped to the position along the half-outline, so the ribbons literally draw the heart as they converge.

**Vertex shader sketch (to be implemented and tuned by Claude Code):**

```glsl
attribute vec3 aRibbon; attribute vec3 aHeart; attribute vec3 aScatter; attribute vec4 aRand;
uniform float uForm, uBurst, uTime, uPR, uBeat, uShine;
void main() {
  float f = smoothstep(0.0, 1.0, clamp((uForm  - aRand.x * 0.35) / 0.65, 0.0, 1.0)); // staggered weave
  float b = smoothstep(0.0, 1.0, clamp((uBurst - aRand.x * 0.30) / 0.70, 0.0, 1.0)); // staggered burst
  vec3 p = mix(aRibbon, aHeart, f);
  p = mix(p, aScatter, b);
  p += 0.02 * vec3(sin(uTime * 0.7 + aRand.w * 6.28), cos(uTime * 0.6 + aRand.w * 4.0), 0.0); // idle drift
  p *= 1.0 + uBeat * 0.04;                                                                     // audio pulse
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aRand.y * uPR * (28.0 / -mv.z) * (1.0 + uBeat * 0.3);
  gl_Position = projectionMatrix * mv;
}
```

The fragment shader draws a soft round sprite (radial falloff), picks the colour from `aRand.z`, adds the shine band (a moving diagonal highlight keyed to `uShine`), and fades alpha with distance from the sprite centre. Aura uses additive blending; Pearl uses normal blending.

### 3.5 Heart event catalogue

All events are run by `HeartDirector`. Durations are for desktop; they do not depend on scroll speed.

| Event               | Trigger                                                   | Duration               | What changes                                                                                                                                            | Easing                       | Reduced motion                   |
| ------------------- | --------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------- |
| `ribbonWeave`       | Gate dismissed                                            | 3.2 s                  | `form` 0 → 1 (ribbons enter, spiral, weave into the heart)                                                                                              | `power2.inOut`               | Heart shown instantly            |
| `pulse` (heartbeat) | Heart tap; node reached; gate seed                        | about 0.7 s            | Scale ×1.06 (120 ms) → back (100 ms) → ×1.04 (100 ms) → back (180 ms): a "lub-dub"                                                                      | `power2.out` / `power1.in`   | One 200 ms glow flash            |
| `glowUp`            | Section entry; node reached                               | 0.9 s up, 1.4 s settle | `glow` +0.5 then back to baseline; bloom intensity follows                                                                                              | `power2.out`, `power2.inOut` | 250 ms fade only                 |
| `shine`             | Hero (once), skin swap, gallery reveals (throttled ≥ 4 s) | 1.1 s                  | Highlight band sweeps across; 3–5 tiny star glints, 0.4 s each                                                                                          | `power1.inOut`               | Skipped                          |
| `burst`             | Bloom, arrow strike, wish, finale                         | 1.1 s                  | `burst` 0 → 1; heart dissolves to scatter; small hearts emerge; glow dips to 0.3                                                                        | `power3.out`                 | Skipped (use `pulse`)            |
| `reform`            | After `burst`                                             | 1.6 s                  | `burst` 1 → 0; particles and small hearts converge; heart returns **slightly brighter** (glow +0.25 overshoot, settles over 0.8 s); ends with a `pulse` | `power2.inOut`               | Skipped                          |
| `burstReform`       | Composite                                                 | about 3.2 s            | `burst` + 0.5 s hold + `reform`                                                                                                                         | as above                     | `pulse`                          |
| `arrowStrike`       | Timeline midpoint (§9)                                    | about 5.2 s            | See below                                                                                                                                               | see below                    | Glow flash + `pulse` only        |
| `skinSwap`          | Dawn                                                      | 1.2 s                  | `skin` 0 → 1                                                                                                                                            | `power2.inOut`               | 300 ms cross-fade                |
| `wishMerge`         | Wish completes                                            | about 4 s              | See §12                                                                                                                                                 | –                            | Soft glow + message              |
| `dockToSeal`        | Letter section                                            | 0.9 s                  | Heart moves to the seal position and scales to seal size, Pearl + gold                                                                                  | `power3.inOut`               | Instant                          |
| `sealBreak`         | Seal held                                                 | 3 s drift              | About 12 small hearts flutter upward                                                                                                                    | `sine.inOut`                 | Quiet fade-in of the letter only |
| `finaleBurst`       | Finale                                                    | about 3.2 s            | Larger `burstReform`, small confetti, final glow                                                                                                        | as above                     | `pulse`                          |

**`arrowStrike` timeline (about 5.2 s total):**

| Time      | What happens                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.00–0.20 | Anticipation: glow dips, scale 1 → 0.97                                                                                                                                                                                                                            |
| 0.20–1.10 | A thin **gold arrow** flies from off-screen top-left along a gentle arc to the heart, with a faint gold trail (about 12 fading sparks). `power2.in`                                                                                                                |
| 1.10      | **Hit:** heart recoils (scale 0.92 in 80 ms, to 1.06 in 220 ms, settle 300 ms); a soft **shockwave ring** expands (0 → 1 over 0.8 s, fading); bloom spikes to about 2× for 120 ms then eases back; a tiny camera shake (about 0.015 world units, 250 ms, decaying) |
| 1.15–1.45 | The arrow dissolves into about 40 gold sparks that drift outward                                                                                                                                                                                                   |
| 1.40–4.60 | `burstReform` (burst, hold, reform)                                                                                                                                                                                                                                |
| 4.60+     | Baseline glow stays **+0.15 higher** for the rest of the timeline ("stronger")                                                                                                                                                                                     |

### 3.6 Supporting 3D elements

| Element            | Technique                                                                                                                                    | Counts (high / mid / low) | Notes                                                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Small hearts**   | `InstancedMesh`, low-poly extruded heart; per-instance direction, speed, spin, scale (0.04–0.1), colour (lavender, rose, gold, ivory, pearl) | 40 / 28 / 18              | Position = heart centre + direction × radius × `easeOutCubic(burst)`; scale multiplier `smoothstep(0, 0.15, burst)` so they vanish into the heart at the end of `reform`. A small "tap pool" (8) is used for taps independent of `burst` |
| **Petals**         | `InstancedMesh`, gently curved plane; shader-driven fall and sway (no CPU updates)                                                           | 120 / 70 / 40             | Colours Blush, lavender, ivory (tokens). Spawn during Bloom, persist through Memories, fade out in Dawn                                                                                                                                  |
| **Confetti**       | `InstancedMesh` quads; shader physics: `p = p0 + v t + ½ g t²`, drag, flutter rotation; launch time uniform                                  | 300 / 160 / 80            | Lavender, rose, gold, ivory; life about 4 s                                                                                                                                                                                              |
| **Arrow**          | Group: thin gold cylinder shaft, small cone head, two fletching planes; emissive gold                                                        | 1                         | Only mounted while the strike plays                                                                                                                                                                                                      |
| **Shockwave ring** | `RingGeometry` plane facing the camera; radial-fade shader                                                                                   | 1                         | Additive in Aura; soft gold normal-blend in Pearl                                                                                                                                                                                        |
| **Sparks**         | One small `Points` pool shared by arrow trail, arrow dissolve, glints                                                                        | 60                        |                                                                                                                                                                                                                                          |
| **Memory orbs**    | Glass shell (cheap fresnel `ShaderMaterial`, no transmission) + photo disc inside (`Billboard`), 512 px WebP texture                         | 8 / 8 / 6                 | Hover uniform brightens shell and saturates photo                                                                                                                                                                                        |
| **Wish star**      | Four-point star (shader quad or small extrusion) + halo sprite; hold-progress uniform                                                        | 1                         |                                                                                                                                                                                                                                          |

### 3.7 Audio engine and sound-reactive mapping

- Created on the **gate tap** (user gesture). Graph: `audio` element → source node → gain node → analyser (`fftSize` 512) → destination. Fade in 0 → 0.6 over 2 s. Loop. Pause on tab hidden.
- If the file fails to load, run the **synthetic 72 bpm "lub-dub"** as the beat source so visuals still work.

```ts
function band(data: Uint8Array, from: number, to: number) {
  let sum = 0;
  for (let i = from; i <= to; i++) sum += data[i];
  return sum / ((to - from + 1) * 255);
}
// each frame:
analyser.getByteFrequencyData(data);
const bass = band(data, 0, 2),
  mid = band(data, 3, 12),
  treble = band(data, 13, 60);
smooth.bass = Math.max(bass, smooth.bass * 0.9); // fast attack, slow decay
heart.beat = Math.pow(smooth.bass, 1.5);
```

Bin edges depend on the device sample rate (about 86 Hz per bin at 44.1 kHz with `fftSize` 512), so tune the ranges by eye with the real track.

| Band   | Drives                                                  | Cap                                |
| ------ | ------------------------------------------------------- | ---------------------------------- |
| Bass   | Heart scale (≤ 4–6 %) and glow (+0.12) via `heart.beat` | Never exceed 6 % scale oscillation |
| Mid    | Petal drift speed (× up to 1.3), orb emissive (± 5 %)   |                                    |
| Treble | Spark/glint probability                                 |                                    |

Reduced motion: audio plays if the user chose it, but only glow changes (± 0.05); no scale pulsing.

### 3.8 Global chrome (always on top after the gate)

| Control            | Spec                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Music toggle**   | Top-right, 44 × 44 px, Lucide `Volume2` / `VolumeX`, `aria-pressed`, always visible. Motion for hover/press                                                   |
| **Progress heart** | Desktop: a 2 px vertical rail on the right edge with a tiny heart marker that fills with scroll. Mobile: a 2 px bar along the top. Decorative (`aria-hidden`) |
| **Calm mode**      | Small text button, bottom-left ("Calm mode"). Switches to the static, reduced-motion experience instantly                                                     |
| **Skip link**      | First focusable element: "Skip to the letter"                                                                                                                 |

### 3.9 Content configuration and assets

All copy, dates and photos live in one typed file per site, so this becomes a reusable "Love Website" template.

```ts
export type PhotoRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blur?: string;
};

export type LoveSiteConfig = {
  slug: string; // long and unguessable
  recipient: { name: string };
  sender: { name: string };
  birthday: string; // ISO date
  copy: {
    heroSub: string;
    bloomLine: string;
    memoriesHint: string;
    timelineTitle: string;
    dawnQuote: string;
    galleryTitle: string;
    wishPrompt: string;
    wishDone: string;
    letterTitle: string;
    finaleMessage: string;
  };
  memories: {
    id: string;
    title: string;
    date: string;
    caption: string;
    photo: PhotoRef;
  }[]; // 6–8 (orbs)
  timeline: {
    id: string;
    date: string;
    title: string;
    text: string;
    photo?: PhotoRef;
    featured?: boolean;
  }[]; // exactly 5; one featured
  gallery: PhotoRef[]; // 9–12
  letter: { paragraphs: string[]; signoff: string; passphrase?: string };
  music: { src: string; credit: string };
};
```

**Assets:** images from the BnV assets, renamed `love-memory-01.webp`, `love-gallery-03.webp` and so on, in `public/images/prototype/`; produce 512 px orb squares, 1600 px card images, 1200 px gallery images and blur placeholders with `scripts/prepare-love-images.mjs`. Alt text on every photo. Prototype AI images are placeholders only.

---

## 4. Scroll map and heart path

### 4.1 Scroll map (desktop; mobile uses about 85 % of these lengths)

| #   | Section  | `id`       | Scroll length             | Mechanism                                      | Theme (`--dawn`) | Main tools                 |
| --- | -------- | ---------- | ------------------------- | ---------------------------------------------- | ---------------- | -------------------------- |
| 0   | Gate     | `gate`     | Fixed overlay (no scroll) | Lenis stopped until tap                        | 0                | Motion, drei `useProgress` |
| 1   | Hero     | `hero`     | 200 vh                    | Time-based intro + sticky stage                | 0                | GSAP, SplitText, R3F       |
| 2   | Bloom    | `bloom`    | 150 vh                    | Scrubbed path + triggered burst                | 0                | GSAP, R3F                  |
| 3   | Memories | `memories` | 400 vh                    | Sticky stage; camera rail scrubbed             | 0                | GSAP, R3F, Radix Dialog    |
| 4   | Timeline | `timeline` | 400 vh                    | Sticky stage; thread scrubbed; triggered arrow | 0                | GSAP, SVG, R3F             |
| 5   | Dawn     | `dawn`     | 100 vh                    | Scrubbed theme, triggered skin swap            | 0 → 1            | GSAP, CSS `color-mix`      |
| 6   | Gallery  | `gallery`  | about 300 vh              | Natural scroll; batched reveals                | 1                | GSAP batch, `next/image`   |
| 7   | Wish     | `wish`     | 200 vh                    | Sticky stage; press-and-hold                   | 1                | R3F, hold hook             |
| 8   | Letter   | `letter`   | 200 vh                    | Sticky stage; hold to unlock                   | 1                | GSAP, DOM/SVG              |
| 9   | Finale   | `finale`   | 100 vh                    | Triggered finale                               | 1                | GSAP, R3F, Lenis           |

Total about 2,050 vh: roughly 3–4 minutes of calm exploring.

**Pinning approach:** for sticky scenes use a tall container with an inner `position: sticky; top: 0; height: 100svh` stage and a scrubbed `ScrollTrigger` on the container. This avoids pin-spacer layout quirks in React/Next. Use `pin: true` only if sticky proves unsuitable.

### 4.2 Heart path (screen coordinates NDC: x −1 left … +1 right; y −1 bottom … +1 top)

| Section  | Desktop position → scale                                     | Mobile (portrait)                              | Skin         | Baseline glow           |
| -------- | ------------------------------------------------------------ | ---------------------------------------------- | ------------ | ----------------------- |
| Hero     | (0, 0.05), scale 1.0                                         | (0, 0.25), scale 0.9                           | Aura         | 0.6 → 0.8               |
| Bloom    | (0, 0.05) → (0.55, 0.10), scale 1.0 → 0.55                   | → (0, 0.6), scale 0.3                          | Aura         | 0.7                     |
| Memories | (0, −0.55), scale 0.38 (rides the camera rail)               | (0, 0.62), scale 0.28                          | Aura         | 0.55                    |
| Timeline | Follows the thread tip, scale 0.30                           | Follows the thread tip (left edge), scale 0.26 | Aura         | 0.6 (+0.15 after arrow) |
| Dawn     | (0, −0.55) → (0, 0.15), scale 0.30 → 0.60                    | (0, 0.5), scale 0.5                            | Aura → Pearl | 0.5                     |
| Gallery  | (0.86, −0.78), scale 0.20 (quiet corner companion)           | (0.8, −0.85), scale 0.16                       | Pearl        | 0.35                    |
| Wish     | (0, −0.6) → (0, 0.0) as she holds, scale 0.35 → 0.5          | same, centred                                  | Pearl        | 0.5                     |
| Letter   | Docks onto the seal (position measured from the DOM element) | same                                           | Pearl + gold | 0.4                     |
| Finale   | (0, 0.05), scale 1.3                                         | (0, 0.15), scale 1.0                           | Pearl        | 0.7                     |

**Mobile rule:** when body text is on screen, the heart lives in the top 30 % or the bottom-right corner. **It never sits behind body text.** All positions are stored as NDC and converted to world units with the live viewport, so rotation and resizing stay correct.

### 4.3 Story builder pattern (how scroll timelines are written)

```ts
// src/features/love/engine/story.ts  (pattern; Claude Code to complete)
export function buildStory(
  root: HTMLElement,
  ctx: { calm: boolean; tier: Tier },
) {
  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 767px)',
    },
    (c) => {
      const { motion, mobile } = c.conditions as {
        motion: boolean;
        mobile: boolean;
      };
      if (!motion || ctx.calm) {
        applyStaticStory(root);
        return;
      }

      // 1. Scrubbed path (continuous, reversible)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#bloom',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
        .to(
          heart.ndc,
          { x: mobile ? 0 : 0.55, y: mobile ? 0.6 : 0.1, ease: 'none' },
          0,
        )
        .to(heart, { scale: mobile ? 0.3 : 0.55, ease: 'none' }, 0);

      // 2. Triggered moment (fixed duration, independent of scroll speed)
      ScrollTrigger.create({
        trigger: '#bloom',
        start: 'top 60%',
        onEnter: () => director.play('burstReform'),
        onEnterBack: () => director.settle(), // forces the baseline for this section
      });
    },
  );
  return () => mm.revert();
}
// In the client root: useGSAP(() => buildStory(rootRef.current!, { calm, tier }), { scope: rootRef, dependencies: [calm, tier] });
```

---

## 5. Section 0 — Gate ("Tap to begin")

**Purpose:** a hush before the show. Also the user gesture that unlocks audio and the loading screen for the 3D chunk.

**Layout (DOM):** full-viewport Midnight Aubergine. Centre: a small lavender **seed** (layered radial gradients) pulsing like a heartbeat (CSS keyframes, about 72 bpm). Below it a short line (Cormorant Garamond italic): "A little something for you, {name}." Then a primary button "Tap to begin" (disabled until ready). A thin progress ring around the seed while loading.

**States:** `loading` → `ready` → `entering`.

- `loading`: lazily import the 3D chunk and textures; progress from drei `useProgress`; enable the button when done, or after a 6 s timeout (then continue with whatever loaded and the lowest tier).
- `ready`: gentle pulse; button enabled.
- `entering` (on tap, in this order): (1) create/resume `AudioContext`, start music fade-in; (2) fade the gate out over 600 ms (Motion); (3) the seed's screen position becomes the ribbons' meeting point; (4) `lenis.start()`; (5) trigger `ribbonWeave` (Hero).

**Heart:** none yet (the seed is DOM). Continuity: ribbons emerge from the seed's position.

**Reduced motion:** static seed, no pulse; fade only.

**Mobile:** button at least 48 px tall, placed in the lower third for thumb reach.

**Accessibility:** focus lands on the button; `aria-busy` while loading; the line is real text.

**Build:** a Client Component with Motion for the fade; the 3D chunk is mounted underneath via `next/dynamic` once the gate mounts.

**Acceptance:** no scrolling before the tap; no audio before the tap; button enables when assets are ready; if the audio file is missing the experience still starts; LCP is the gate text/seed.

---

## 6. Section 1 — Hero ("two lights become one heart")

**Purpose:** the signature moment.

**Layout (DOM):** headline "Happy Birthday, {name}" in Cinzel (Moon Ivory, small gold detail), a one-line subhead ("Some lights find each other."), and a quiet scroll cue (a tiny heart that bobs 4 px) that appears after the intro and fades after the first scroll.

**Time-based intro (starts after the gate tap; does not need scrolling):**

| Time      | Event                                                                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0–2.2 s | Lavender ribbon enters from the left, gold ribbon from the right, both spiralling toward the centre. Faint trailing sparkle                                |
| 2.2–3.2 s | The ribbons weave and trace the heart outline; the heart fills with soft particles                                                                         |
| 3.2 s     | First `pulse`                                                                                                                                              |
| 3.4 s     | Headline reveals (SplitText, characters fade up with about 60 ms stagger over about 1 s; verify aria handling so a screen reader reads one clean sentence) |
| 4.2 s     | Subhead fades up (400 ms)                                                                                                                                  |
| 5.0 s     | Scroll cue fades in                                                                                                                                        |
| 6.0 s     | First `shine`                                                                                                                                              |
| After     | **Idle:** breathing (scale ±1.5 % over 4 s, glow ±0.04), a few ribbon-dust particles orbit                                                                 |

**Scroll (200 vh sticky stage):** over the first 40 % of the stage the heart rotates slightly (≤ 8°) and the headline lifts and fades; the heart then hands over to Bloom.

**Interactions:**

- **Pointer parallax (desktop):** the heart yaws up to 6° toward the pointer (smoothed).
- **Tap/click the heart:** `pulse` plus 6 small hearts from the tap pool. Cooldown 1.2 s.
- Keyboard: the heart's DOM twin is a button labelled "Make the heart beat".

**Reduced motion:** the heart is shown fully formed with a 300 ms fade; headline appears with a fade; no parallax.

**Mobile:** heart in the upper half; headline below; scale 0.9; ribbons enter from the left/right edges.

**Tools and how:** `story.ts` hero timeline (GSAP, paused, played on gate dismissal), `Heart.tsx` with `form` driven by `heart.form`, SplitText for the title, Motion not involved.

**Performance:** first frames are the most expensive. Delay the 3D chunk's heaviest allocations until the gate is shown, not after the tap.

**Acceptance:** weave completes in about 3.2 s on a mid-range phone without dropped frames; headline readable at all times; tap cooldown works; reduced-motion shows a clean static hero.

---

## 7. Section 2 — Bloom

**Purpose:** wonder. The heart opens into petals and the camera flies through them.

**Layout (DOM):** one line on the left (desktop) or lower third (mobile): "Every moment with you opens like this." Fades up 16 px over 400 ms when it enters at about 30 %.

**Scroll (150 vh):**

- **Scrubbed:** heart moves from centre to the right (scale 1 → 0.55); camera dollies in (z 6 → 4.2) then back out.
- **Triggered at about 25 % (`top 60%`):** `burstReform` where the burst releases the **petals** (120 / 70 / 40). Petals spawn for about 2 s, then settle into a slow ambient drift that continues through Memories.

**Heart:** bursts into small hearts and petals, reforms smaller (0.55), floats right.

**Interactions:** none required. Optional delight: moving the pointer gently pushes nearby petals (a tiny uniform offset, desktop only).

**Reduced motion:** heart stays formed; petals appear as a still, sparse layer fading in; no camera move.

**Mobile:** heart to the top 30 %; fewer petals (tier counts).

**Build:** `Petals.tsx` (instanced, shader-driven), a `petalRelease` uniform tweened by the director, scrubbed camera z in `story.ts`.

**Acceptance:** burst and reform complete even if she scrolls through quickly; the heart ends exactly formed (`burst = 0`); text readable over petals (petals avoid the text column or are dimmed behind it).

---

## 8. Section 3 — Floating Memories

**Purpose:** touch and discover. Eight glowing orbs, each holding a photo, float in a long corridor she flies through.

**Layout (DOM):** a one-line hint at the start ("Touch a memory."), plus an unobtrusive counter ("2 of 8 opened") after the first open. Nothing else covers the canvas; the stage container is `pointer-events: none`.

**Scroll (400 vh sticky):** the camera moves along a rail through the orbs while she scrolls.

- Orb `i` position: `z = -6 - i * 4.5`, `x = sin(i * 1.3) * 2.4` (× 0.6 on mobile), `y = cos(i * 0.9) * 1.2`.
- Camera `z` scrubbed from 6 down to the last orb + 4.
- The heart keeps a fixed screen position (0, −0.55) so it appears to fly with her.
- Petal layer continues.

**Interactions:**

| Input           | Behaviour                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover (desktop) | Orb lifts toward the camera (+0.4 z), scale ×1.1 (within the brand's 1.03 spirit for UI; this is a 3D lift), shell glows, photo desaturated → full colour (250 ms). The heart leans toward it (NDC shift ≤ 0.15). Cursor `pointer` |
| Click / tap     | Heart `pulse` + 4 small hearts. A dialog opens (below)                                                                                                                                                                             |
| Keyboard        | A visually hidden list of buttons (one per memory) in order; focusing one draws a visible ring around the orb's projected screen rectangle (DOM overlay) and the heart leans toward it; Enter opens it                             |

**Memory dialog (Radix `Dialog`, animated with Motion):** scales from the orb's screen position (0.92 → 1, opacity, 250 ms `ease-standard`). Contents: photo (`next/image`, 1600 w), date (Inter, small), title (Cinzel), caption (Cormorant, 20 px). Close with Esc, backdrop click or button; focus returns to the orb's twin. While open: `lenis.stop()`.

**Completion moment (optional, small):** when all eight have been opened, `glowUp` and the hint line becomes "That's all of them. For now."

**Reduced motion:** no camera rail; orbs become a simple two-column grid of memory cards (same dialog); the heart is a static icon in the section header.

**Mobile:** six orbs on the `low` tier; larger hit areas (minimum 44 px projected); tap only (no hover).

**Pointer routing:** section containers pass pointer events through to the canvas; confirm in this milestone (Tech Stack §7.2) and switch to the `eventSource` fallback if clicks are lost.

**Build:** `MemoryOrbs.tsx` (shell shader + `Billboard` photo discs, textures via `useTexture`), rail in `story.ts`, `MemoryDialog.tsx`, DOM twin list with the focus-ring overlay.

**Performance:** no transmission materials; 512 px textures; dispose textures on unmount; only orbs within camera range update.

**Acceptance:** every orb reachable by mouse, touch and keyboard; dialog traps focus and restores it; page does not scroll behind the dialog; hover and focus feel equivalent; 8 photos stay under the texture budget.

---

## 9. Section 4 — Pinned Timeline ("How we got here")

**Purpose:** the story of you two, told along a golden thread, with the arrow-strike moment at its heart.

**Layout (DOM):** a sticky stage. A **gold thread** (SVG path, stroke gold token) draws itself as she scrolls. Desktop: a gentle S-curve across the width at about mid-height. Mobile: a vertical thread near the left edge. Five **nodes** (small circles with date labels) sit along it at 10 %, 30 %, 50 %, 70 %, 90 %. The **active card** (photo thumbnail, date, title, short text) appears beside the active node: alternating above/below on desktop, in the lower 38 % of the screen on mobile. Earlier cards dim to 40 %.

**Scroll (400 vh):** 0–10 % intro, 10–90 % nodes, 90–100 % outro.

**Thread drawing:** stroke-dash technique (`stroke-dasharray` = path length; animate `stroke-dashoffset` with the scrubbed progress).

**Heart rides the thread tip:** each scroll update, take `path.getPointAtLength(progress * length)`, convert to screen pixels with `getScreenCTM()`, then to NDC and write to `heart.ndc`. In the outro it drifts off the thread.

**Node activation (when progress crosses the node's fraction):**

- Node dot ignites (scale 0.6 → 1, glow) over 250 ms; card slides in 24 px and fades (400 ms).
- Heart `glowUp` + small `pulse`.

**The arrow-strike moment:** the **featured** node (the third, "the day you knew") fires `arrowStrike` (§3.5). It is time-based: it plays fully even if she keeps scrolling, and `settle()` forces the baseline if it is interrupted. Guard against re-firing on tiny scroll jitters (only re-arm if she scrolls back above 45 %).

**Interactions:** click/tap a node or press Enter on it → `lenis.scrollTo(...)` to that node's progress (1.2 s). Nodes are real buttons in tab order, with `aria-current` on the active one.

**Reduced motion:** no pinning; a vertical list of five cards with the thread drawn statically beside them; the heart is a small static icon; no arrow strike (a soft glow flash on the featured card instead).

**Mobile:** vertical thread, one card at a time at the bottom, heart on the thread (it stays clear of text because the card sits in the lower area and the thread is at the left).

**Build:** `Timeline.tsx` (SVG + cards), progress mapping and node flags in `story.ts`, `Arrow.tsx` + ring + spark pool in the canvas, director events.

**Performance:** the arrow group mounts only during the strike; one shared spark pool; bloom spike is one uniform tween.

**Acceptance:** five nodes activate in order and reverse cleanly when scrolling back; arrow strike plays once per pass, leaves the heart exactly formed and slightly brighter; heart never overlaps card text; node click lands precisely.

---

## 10. Section 5 — Dawn

**Purpose:** relief. Night turns to morning, and the heart changes from glowing to pearl.

**Layout (DOM):** an almost empty 100 vh. **No text from 20 % to 75 % of the section** (this is where the mid-tone lavender dusk happens). A soft sunrise gradient rises from the bottom (gold → blush, token-based CSS gradient). At 75 % a single line appears centred (Cormorant italic, Soft Charcoal on Ivory): "And somehow, it keeps getting lighter."

**Scroll (100 vh):**

- **Scrubbed:** `--dawn` 0 → 1 (start `top 80%`, end `bottom 20%`); heart rises (0, −0.55) → (0, 0.15), scale 0.30 → 0.60; petals fade out and stop spawning.
- **Triggered at about 35 %:** `skinSwap` (1.2 s). At about 50 %: one `shine`.

**Interactions:** none needed; this is a breath.

**Reduced motion:** a straight cross-fade between dark and light backgrounds; the heart swaps skin with a 300 ms fade.

**Mobile:** same; heart centred high (0, 0.5).

**Build:** `Dawn.tsx`, `theme-timeline.ts` (animates `--dawn`; one tween), the Pearl skin mesh fading in via `uSkin`.

**Acceptance:** no moment with text on a mid-tone background; heart is clearly visible on Ivory (Pearl skin); skin swap has no flash or pop.

---

## 11. Section 6 — Gallery ("Us, in daylight")

**Purpose:** a calm, beautiful photo moment in the brand's hero light mode.

**Layout (DOM):** 9–12 photos in a masonry-style grid (2 columns mobile, 3 desktop) on Warm Ivory with Blush surfaces and bordered frames (token radius). A short title above in Cinzel. Captions only on hover/focus.

**Scroll:** natural scrolling (no pin), about 300 vh.

**Reveal:** `ScrollTrigger.batch` on the tiles: start `top 88%`, fade up 24 px with a soft **clip-path** reveal (`inset(12% 8% 12% 8% round <radius>)` → `inset(0)`), 0.8 s, `power3.out`, 80 ms stagger, `once: true`. Desktop only: image parallax of ±6 % on at most six tiles at a time.

**Heart:** quiet companion in the bottom-right corner (scale 0.2, Pearl). A small `shine` when a batch reveals, **throttled to once every 4 s**.

**Interactions:** hover (desktop): image scale ≤ 1.03 over 250 ms; tap/click or Enter opens a **lightbox** (Radix Dialog): large photo, arrow keys and swipe (Motion drag) to go next/previous, Esc to close, `lenis.stop()` while open, focus restored on close.

**Reduced motion:** tiles appear with a simple fade; no clip-path, no parallax.

**Mobile:** two columns, no parallax, larger tap targets.

**Build:** `Gallery.tsx`, `Lightbox.tsx`, `next/image` with `sizes`, blur placeholders, `priority` only for the first row; the rest lazy.

**Performance:** WebP at 1200 w; images never exceed their displayed size by more than 2×; lazy-loaded below the first row.

**Acceptance:** no layout shift while images load; lightbox is fully keyboard operable; overlay captions have a scrim and meet contrast.

---

## 12. Section 7 — Wish

**Purpose:** a surprise, interactive moment: she makes a wish and the whole screen celebrates.

**Layout (DOM):** Soft Blush background. Heading "Make a wish, {name}." A small wish **star** in the centre (3D), with a circular SVG progress ring around it and the hint "Press and hold". An optional collapsed link below: "Write your wish (stays on this device, never sent)", which expands a textarea; the text is never stored or transmitted.

**Mechanics (press and hold, 2.4 s):**

- While holding: progress 0 → 1; the star brightens and grows (1 → 1.6), its halo rises (0.2 → 1.0), the **heart rises** from the bottom toward the star (y −0.6 → −0.05) and shimmers.
- Release early: everything eases back over 0.6 s.
- **Complete (`wishMerge`, about 4 s):**

| Time | What happens                                                                                                                |
| ---- | --------------------------------------------------------------------------------------------------------------------------- |
| 0.0  | Heart and star align; a soft flash (glow to 1.0, gentle bloom)                                                              |
| 0.3  | `burst`: heart and star dissolve into small hearts; **confetti launches** (radial upward cone, lavender, rose, gold, ivory) |
| 1.6  | `reform`: the heart returns, slightly brighter                                                                              |
| 2.0  | The message fades in: "May every wish come true." (`aria-live="polite"`)                                                    |
| 4.0  | Calm; a quiet link "Make another wish"                                                                                      |

**Input handling:** one reusable `useHold` hook (pointer down/up/leave/cancel, and Space/Enter keydown/keyup without repeat).

```ts
// pattern for useHold (Claude Code to harden: cleanup, pointer capture, key repeat)
export function useHold({
  duration,
  onProgress,
  onComplete,
}: {
  duration: number;
  onProgress: (p: number) => void;
  onComplete: () => void;
}) {
  const raf = useRef(0);
  const start = useRef(0);
  const active = useRef(false);
  const tick = (t: number) => {
    if (!active.current) return;
    const p = Math.min(1, (t - start.current) / duration);
    onProgress(p);
    if (p >= 1) {
      active.current = false;
      onComplete();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };
  const begin = () => {
    active.current = true;
    start.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };
  const release = () => {
    active.current = false;
    cancelAnimationFrame(raf.current); /* ease progress back with GSAP */
  };
  return {
    onPointerDown: begin,
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) begin();
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') release();
    },
  };
}
```

**Accessibility:** the hold target is a real `<button>` (the star is its visual); announce progress and completion politely; provide an alternative: **a single click completes the wish** when Calm mode/reduced motion is on, or via a visible "Or tap once" link.

**Reduced motion:** a single click completes; no confetti (a soft glow and the message); heart stays.

**Mobile:** the hold target is at least 88 px; `touch-action: none` on the star only; optional `navigator.vibrate(10)` on completion (Android; ignore failures).

**Build:** `WishStar.tsx`, `Confetti.tsx`, `useHold`, director event `wishMerge`.

**Acceptance:** early release never leaves residue; completing twice in a row does not stack animations; confetti count respects the tier; message announced to screen readers.

---

## 13. Section 8 — Love Letter

**Purpose:** intimacy. The heart becomes the wax seal on a letter written for her.

**Layout (DOM):** Warm Ivory. Heading "A letter for you." A softly floating **envelope** (SVG/CSS; body, flap, a large seal about 72–96 px). Hint: "Hold the seal to open." If a passphrase is configured, a small input and an "Open" button appear instead (a soft lock, not security).

**Heart:** `dockToSeal`: the heart travels to the seal's measured screen position and shrinks to the seal's size (Pearl + gold), so the seal _is_ the heart.

**Unlock (hold 1.2 s on the seal, same `useHold` hook; or passphrase):**

| Time      | What happens                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0–0.3 s | Seal splits into two halves that part slightly; `sealBreak` releases about 12 small hearts that flutter upward for about 3 s          |
| 0.2–0.9 s | Flap opens (CSS 3D `rotateX`, origin at the top)                                                                                      |
| 0.7–1.4 s | Letter card rises out and grows to reading size                                                                                       |
| 1.4 s on  | Paragraphs reveal one by one (fade + 16 px, 500 ms, 400 ms stagger). Typewriter effect is **off** by default; offer "Skip" if enabled |

These opening durations exceed the 400 ms UI token on purpose: it is a signature moment (recorded exception).

**Letter card:** white paper (`surface-elevated`), Cormorant Garamond 20 px, italic sign-off. If the text is long, the card scrolls internally with `data-lenis-prevent` so wheel/touch scrolling works inside it.

**Reduced motion / Calm:** the letter appears already open with text visible; the seal is a small static heart; a single click unlocks.

**Mobile:** envelope fills about 80 % width; seal hold target ≥ 88 px.

**Passphrase UX:** wrong entry shows a kind inline message ("Not quite, try again"); no shaking, no lockout.

**Build:** `Letter.tsx` using **GSAP only** for the sequence (no Motion on these elements), seal position measured with `getBoundingClientRect()` and converted to NDC, director events `dockToSeal` and `sealBreak`.

**Acceptance:** heart docks precisely on the seal at any screen size and after resize; letter is readable and scrollable when long; unlocking twice does nothing odd; contrast passes on paper.

---

## 14. Section 9 — Finale

**Purpose:** resolution, then a graceful way to replay.

**Layout (DOM):** Warm Ivory with a soft Blush glow. Large heading "Happy birthday, {name}." and the final message (config `finaleMessage`). Buttons: primary "Replay our story", secondary "Music on/off" (mirrors the toggle).

**Heart:** returns large and centred (scale 1.3), Pearl with a soft gold halo, beating gently with the music (synthetic beat if muted or the file is missing). On entering: `finaleBurst` once (burst, a little confetti, reform), then ambient idle.

**Replay:** `lenis.scrollTo(0, { duration: 2.6 })`, reset session flags (wish done, memories opened counters; the letter stays unlocked), and re-arm the Hero intro (`onEnterBack` replays the weave). Music continues.

**Reduced motion:** static heart; no burst; button instantly scrolls to the top.

**Mobile:** heart scale 1.0 at (0, 0.15); buttons stacked, full width, ≥ 48 px.

**Acceptance:** finale burst plays once per pass; replay returns cleanly to a working Hero; nothing is left half-state after replay.

---

## 15. Build plan (milestones)

Build in this order. Each milestone ends with a working, committed build. Use `/plan` → `/blueprint` → `/implement`, then the skills named in Tech Stack §10. **Never start a milestone with a failing build.**

| M       | Goal                        | Prompt to give Claude Code (adapt to the repo flow)                                                                                                                                                                                                            | Done when                                                                                          |
| ------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **M0**  | Approvals and prep          | "Read both Love Site docs. Run the `npm view` checks in Tech Stack §4.2 and draft the ADRs in §12. Copy the chosen images into `public/images/prototype/` with the naming rule and write `scripts/prepare-love-images.mjs`. Do not install anything yet."      | ADRs drafted; versions chosen; owner approved                                                      |
| **M1**  | Route scaffold (static)     | "Create `app/love/layout.tsx` (bare, noindex) and `app/love/[slug]/page.tsx` loading a typed config. Add the `[data-love-root]` alias token block to `globals.css` and stub every section's DOM with placeholder copy and correct headings. No motion, no 3D." | Page renders all sections stacked, passes accessibility basics, no console errors                  |
| **M2**  | Scroll engine and theme     | "After approval install the packages. Build `ScrollEngine` (Lenis + GSAP ticker + ScrollTrigger), `motion-prefs`, sticky stages, `--dawn` theme timeline, `ProgressHeart`, Calm mode."                                                                         | Smooth scroll; theme crossover works; resize and Calm mode work; reduced motion uses native scroll |
| **M3**  | Canvas smoke test and tiers | "Add `LoveCanvas` via `next/dynamic` (ssr false), a bare `<Canvas/>` test, the tier system with `PerformanceMonitor`, single bloom pass, and the dev `HeartDebugPanel` skeleton (§18)."                                                                        | Canvas mounts in this repo with R3F ≥ 9.5.0; tier switching works; no hydration warnings           |
| **M4**  | Heart and Hero              | "Implement the particle heart (§3.4), ribbons, `ribbonWeave`, idle breathing, `pulse`, pointer parallax, tap-to-pulse, hero DOM animation, and the gate transition."                                                                                           | Hero intro matches §6 timings; reduced-motion hero works                                           |
| **M5**  | Heart Director and events   | "Implement `heart-state`, `HeartDirector` (one event at a time, baseline invariant), the events `glowUp`, `shine`, `burst`, `reform`, `burstReform`, and `MiniHearts`. Wire debug-panel buttons."                                                              | Every event can be triggered from the panel; fast repeated triggering never leaves a broken state  |
| **M6**  | Heart path and Bloom        | "Implement the NDC path system with responsive mapping and the Bloom section with `Petals`."                                                                                                                                                                   | Heart follows §4.2 on desktop and mobile; burst fires on pass and settles on scroll-back           |
| **M7**  | Memories                    | "Implement `MemoryOrbs`, the camera rail, hover/click, DOM twins with focus ring, `MemoryDialog`, completion moment. Decide pointer routing (§7.2 of Tech Stack)."                                                                                             | All orbs reachable by mouse, touch and keyboard; dialog traps focus; no scroll behind dialog       |
| **M8**  | Timeline and arrow          | "Implement the thread, nodes, cards, heart-on-thread, node click-to-scroll, and `arrowStrike` with ring and sparks."                                                                                                                                           | Nodes reverse cleanly; arrow plays once per pass; heart ends formed and brighter                   |
| **M9**  | Dawn and Gallery            | "Implement the Dawn gap (text-free window), `skinSwap` and the Pearl skin, the Gallery reveal and Lightbox."                                                                                                                                                   | No text on mid-tone backgrounds; heart visible on Ivory; lightbox fully keyboard-operable          |
| **M10** | Audio                       | "Implement `audio-engine` (gate unlock, fade, analyser bands, synthetic fallback), `MusicToggle`, and the reactive mappings in §3.7."                                                                                                                          | Sound plays only after tap; visuals react to the track; mute works; fallback beat works            |
| **M11** | Wish                        | "Implement `useHold`, `WishStar`, `Confetti`, `wishMerge`, the optional local-only wish field, and the single-click alternative."                                                                                                                              | Early release leaves no residue; repeated completion does not stack; announced to screen readers   |
| **M12** | Letter                      | "Implement the envelope, `dockToSeal`, hold-to-open, `sealBreak`, text reveal, optional passphrase."                                                                                                                                                           | Heart docks exactly on the seal at all sizes; long letters scroll inside the card                  |
| **M13** | Finale and Replay           | "Implement the Finale, `finaleBurst` and Replay (flags reset, hero re-armed)."                                                                                                                                                                                 | Replay returns to a clean Hero; nothing left half-state                                            |
| **M14** | Fallbacks and accessibility | "Build the static path for `static` tier and Calm mode for every section; full keyboard pass; screen-reader pass; contrast check at every resting stop."                                                                                                       | Everything usable without WebGL and without motion                                                 |
| **M15** | Performance and QA          | "Tune the tiers; run Lighthouse and the real-device matrix (§16); `/impeccable audit`; Emil `review-animations`, `animation-performance`, `break-ui`, `mobile-native`."                                                                                        | Budgets in Tech Stack §8.1 met on a mid-range phone                                                |
| **M16** | Content and launch          | "Swap in real photos, final copy and the licensed music; confirm `noindex`; deploy a Vercel preview, then production; final QA on the live link."                                                                                                              | Rights and content checklist (§17) all ticked                                                      |

---

## 16. QA and acceptance

### 16.1 Cross-cutting tests

| Test                         | Pass condition                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fast scroll stress**       | Scroll top → bottom → top ten times quickly: heart always ends fully formed (`burst = 0`, no ring/arrow), no stuck particles, no console errors |
| **Resize / rotate**          | Heart stays correctly placed; no pinned-section jumps; no canvas flicker on mobile address-bar changes                                          |
| **Tab hidden / returned**    | Audio pauses and resumes sensibly; animation does not "catch up" with a burst                                                                   |
| **Dialog + scroll**          | Page never scrolls behind a dialog; inner scroll areas scroll                                                                                   |
| **Reduced motion / Calm**    | Matrix in Tech Stack §9.1 passes; every section readable and operable                                                                           |
| **No audio file**            | Experience still works with the synthetic beat                                                                                                  |
| **No WebGL**                 | Static fallback renders all content                                                                                                             |
| **Keyboard only**            | Every interaction (orbs, nodes, lightbox, wish, seal, replay) is reachable and operable with a visible focus ring                               |
| **Screen reader quick pass** | One clean hero sentence; logical headings; dialogs announced; wish completion announced                                                         |
| **Contrast**                 | ≥ 4.5:1 at every resting scroll stop and on letter paper                                                                                        |
| **Touch targets**            | ≥ 44 px (≥ 88 px for hold targets)                                                                                                              |
| **Flashing**                 | Nothing flashes more than three times per second                                                                                                |

### 16.2 Device and browser matrix

Desktop Chrome, Safari, Firefox; iPhone Safari (current iOS); a **mid-range Android** phone in Chrome; plus Chrome DevTools with 4× CPU slowdown and "Slow 4G" throttling. Test the first load, the weave, the arrow strike, Memories and the wish on the phones specifically.

### 16.3 Performance procedure

1. Lighthouse (mobile) on the gate screen and after the gate.
2. Performance panel recording across Memories and the arrow strike; check frame time and long tasks.
3. Confirm tier selection and step-down behave (force a slow device).
4. Verify JS and image budgets (Tech Stack §8.1).

### 16.4 Release checklist

- [ ] Real photos replace all prototype images; alt text written
- [ ] Music licence confirmed and credit added
- [ ] `noindex` verified; no names in link previews; slug unguessable
- [ ] No analytics or third-party scripts
- [ ] Copy proofread (and Sinhala checked if used)
- [ ] Lighthouse and real-device results recorded in the session log
- [ ] `/impeccable audit` clean; Emil reviews done
- [ ] ADRs and docs updated; `PROGRESS.md` entry added

---

## 17. Content checklist (needed from the owner)

| Item                              | Detail                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------- |
| Her name, your name, her birthday | For headings, letter and finale                                                  |
| 8 photos for the Memories orbs    | With a title, date and short caption each                                        |
| 5 timeline milestones             | Date, title, 1–2 sentences, optional photo; pick the featured "day you knew" one |
| 9–12 gallery photos               | Real photos preferred; captions optional                                         |
| The letter                        | Paragraphs and sign-off; optional passphrase                                     |
| Wish line and finale message      | A sentence each                                                                  |
| Music                             | Rights-cleared track, or an instrumental you record; credit text                 |
| Language                          | English only, or also Sinhala                                                    |
| Delivery                          | Private link only, or also a short password                                      |

---

## 18. Dev tooling: the debug panel (dev only, not shipped)

Mount `HeartDebugPanel` only when `process.env.NODE_ENV !== 'production'` and `?debug` is in the URL. It provides:

- Buttons for every heart event (`pulse`, `glowUp`, `shine`, `burst`, `reform`, `burstReform`, `arrowStrike`, `skinSwap`, `wishMerge`, `finaleBurst`).
- Live read-out of the `heart` state values and the current section/baseline.
- Tier switcher and a Calm mode toggle.
- FPS and draw-call stats (drei `Stats`).
- A section jump (`?s=timeline` also works) using `lenis.scrollTo`.

This makes every moment testable in seconds instead of scrolling for a minute.
