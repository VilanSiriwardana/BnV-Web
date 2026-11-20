# B&V Birthday Love Site — Dance Clip Production Guide (AI route, stylised 3D look)

| Field                  | Value                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version                | 1.1 (imported 2026-11-20; milestones renumbered to Phase 11)                                                                                               |
| Created                | 2026-11-19                                                                                                                                                 |
| Milestone              | **M38** (clip gate) in [Phase 11 — Dance reel](phases/Phase-11-Dance-Reel.md); spec: [Love-Site-Romance-Additions.md](Love-Site-Romance-Additions.md) §9.3 |
| Route chosen           | **B: AI-generated animated couple (stylised 3D-animated look)**                                                                                            |
| Decisions (2026-11-19) | **Exact likenesses, with her consent** (§14). **Test Seedance 2.5 and Kling 3.0 and pick the better** (§15)                                                |
| Audience               | You (the person producing the clip) and Claude Code (post-processing scripts and the player)                                                               |
| Location               | `docs/references/love-site/Dance-Clip-Production-Guide.md`                                                                                                 |

> **What I can and cannot do.** I cannot generate images or video in this chat. This guide gives you the plan, the exact prompts, the selection rules and the processing steps. You run the generation in a web tool or API; Claude Code writes the processing scripts and the player on your machine. Tool details below come from research on 2026-11-19 and change quickly, so check each tool's current page. Nothing here has been tested on your characters.

---

## 1. What you are producing

One short clip of a stylised couple, then converted to frames for the site's `DanceReel` player (Romance Additions §9.3.3).

| Item         | Spec                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Look         | Stylised 3D-animated film (soft shading, graceful, **not photorealistic**), lavender and gold light on a dark plum background  |
| People       | Exactly two. Her in a flowing **lavender gown**; him in a **dark suit with a gold detail** that is lighter than the background |
| Framing      | **Locked camera**, full bodies head to toe, feet visible, generous margin on all sides (the dip needs width)                   |
| Aspect       | **3:4** (this guide updates the reel sizes to desktop 720 × 960 and mobile 480 × 640)                                          |
| Length       | **8–10 seconds** of final dance (trim any idle approach or hold)                                                               |
| Quality      | At least 720p, 24 fps source                                                                                                   |
| Choreography | Approach, one hand joined, **one spin under his raised hand**, close hold, **side dip** held at the bottom                     |
| Background   | Plain, solid, very dark plum (no props, no floor pattern, no other people)                                                     |

---

## 2. Decisions to make first

### 2.1 Likeness: decided

**Exact likenesses, with her consent.** The earlier recommendation (characters inspired by you) is superseded. Read **§14** before you upload any photo: it lists what her consent should cover, which photos to collect, the revised character-sheet step, and the extra safeguards that exact faces need.

### 2.2 Which tool? Decided: test both

Two candidates came up in research. **You will test the same keyframes in both and pick the better result** using the protocol in **§15**. Do not decide from marketing pages.

| Tool                                            | What it offers (as reported)                                                                                                                                           | Watch out for                                                                                                                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Seedance 2.5** (ByteDance, via several hosts) | First-and-last-frame control; up to 30 reference images; clips of 4–30 s; 480p/720p, with some hosts reporting 1080p; can return a clip's last frame to chain the next | One review reports that in first-and-last-frame mode the **first frame is held tightly but the last frame can drift**; extension is prompt-guided and not frame-exact; minimum clip length 4 s |
| **Kling 3.0**                                   | A photo becomes the first frame; 3–15 s clips; multi-shot and element references reported                                                                              | Check whether it offers an end-frame control on your host; verify resolution limits                                                                                                            |

**Rough cost (order of magnitude only):** one reported Seedance 2.5 first-and-last-frame job at 1080p took about 3 minutes and billed about $2.40. At 25–30 generations in total, plan on tens of dollars, less at 720p. Prices vary by host and change often.

### 2.3 Terms and rights (check before you spend anything)

- Commercial or personal-use terms of the tool and of the host you use.
- Whether outputs may be used on a public website.
- Where your uploaded images are stored and whether they are used for training.
- If you later reuse this as a "Love Websites" demo, a personal-use licence may not be enough.

---

## 3. The workflow at a glance

```text
1. Character sheets (her, him)             → fixes faces, hair, outfits, style
2. Couple reference (both, one image)      → fixes relative height and palette
3. Five KEYFRAMES (stills of the key poses)→ you choreograph the dance as images
4. Three video SEGMENTS between keyframes  → the model only animates the in-betweens
5. Pick the best take of each segment      → using the score sheet (§7)
6. Chain: real last frame → next first frame
7. Assemble, retime, interpolate, grade
8. Remove the background (alpha)
9. Export frames + posters + manifest      → Claude Code script
```

**Why keyframes first:** the research shows that "make them dance" prompts leave too much to chance, and that spins, hands and the dip are where models fail. If the dip is an **image you have already approved**, the model only has to move between known poses.

---

## 4. Step 1: Character sheets and couple reference

> **Exact likenesses:** use the photo-based character-sheet step in §14.3 instead of the text-only prompts below. The text prompts remain useful as the style block and as a fallback.

Use an image model that keeps identity consistent across edits (the guides mention several, for example Google's Nano Banana and ByteDance's Seedream; check what is current for you). Generate each character separately, then together.

**Style block (reuse in every prompt):**

```text
Stylised 3D-animated feature-film look, soft studio shading, smooth clean fabrics, graceful proportions (tall and slim), gentle expressive faces, not photorealistic. Solid very dark plum background (approximately #17121D), soft floor shadow only, no other objects.
```

**Her (character sheet):**

```text
Full-body character sheet of a young woman, neutral standing pose, both hands open and visible, feet visible. Wearing a flowing floor-length lavender gown with a softly flared skirt, thin gold trim at the waist. [her hair: length, style, colour]. [skin tone, age range]. Three views: front, side, back. {Style block}
```

**Him:**

```text
Full-body character sheet of a young man, neutral standing pose, both hands open and visible, feet visible. Wearing a charcoal-plum dark suit with a lighter shirt and a small gold detail (tie pin or pocket square), polished shoes. [his hair: length, style, colour]. [skin tone, age range]. Three views: front, side, back. {Style block}
```

**Couple reference (attach both sheets):**

```text
Both characters standing side by side facing the camera, full body, feet visible, same scale as their sheets (he is taller than her by about a head). Relaxed, smiling softly. 3:4 composition with generous space on all sides. {Style block}
```

**Check:** both outfits are clearly different in colour and value from the background; hands have five fingers; faces are friendly and distinct from each other. **Save the approved images; they are the reference for everything else.**

---

## 5. Step 2: The five keyframes

All five must share the **same camera, scale, floor line and lighting**, in **3:4** with at least 12 % margin on every side and headroom above the highest head. Attach the couple reference to each prompt.

| #      | Pose                                                                                       | Prompt (add the style block and "same characters, outfits and framing as the reference")                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **K1** | Standing apart, about 1.5 m between them, facing each other; he offers his open right hand | "He gently extends his open hand toward her; she is about to take it; both smiling softly; feet planted."                                                                                                                                                              |
| **K2** | Hands joined                                                                               | "His left hand holds her right hand at chest height between them, fingers gently interlaced; her other hand lightly holds her skirt; they look at each other."                                                                                                         |
| **K3** | Start of the spin                                                                          | "He raises the joined hands above her head; she begins a turn under his arm, her skirt starting to flare; her face still turned toward him."                                                                                                                           |
| **K4** | Close hold                                                                                 | "A close romantic dance hold: his right hand on her back, her left hand on his shoulder, joined hands extended to the side; faces close; calm and tender."                                                                                                             |
| **K5** | **The dip**                                                                                | "He steps wide to his side and bends his front knee; his right arm supports her back; she leans back gracefully with her free arm extended and her head tilted back, trusting him; his eyes are on her; hands, arms and bodies clearly separate with no merged limbs." |

**Reject a keyframe if:** hands or feet are wrong, bodies merge, faces differ from the sheets, the framing or scale differs from the others, or the pose is awkward. Regenerate until all five look like one photo shoot.

_K3 is optional._ It helps steer the spin, but if the stills come out badly, drop it and let segment 2 run from K2 to K4.

---

## 6. Step 3: Video segments

Generate **three short clips** and chain them. Never ask for the whole dance in one prompt.

| Segment | From → to                       | Length                   | What happens                                                                     |
| ------- | ------------------------------- | ------------------------ | -------------------------------------------------------------------------------- |
| **S1**  | K1 → K2                         | 4 s (the common minimum) | He offers his hand, she takes it, a small nod                                    |
| **S2**  | K2 → K4 (via K3 if you made it) | 4–5 s                    | He raises the joined hand and she spins **once**, then returns to the close hold |
| **S3**  | K4 → K5                         | 4 s                      | He steps to his side and guides her into the dip; a slight settle at the bottom  |

**Settings (adapt to the tool):** aspect 3:4; 720p or higher; **audio off** (saves cost, and you will add your own music); fixed seed only if the tool honours it (determinism is not guaranteed); several takes per segment.

**Prompt template (Seedance-style syntax; other tools use similar reference notation, so adapt):**

```text
@Image 1 is the first frame.
@Image 2 is the last frame.
Do not change the first-frame composition defined by @Image 1 or the last-frame composition defined by @Image 2.
Reference characters: @Image 3 (couple reference).

Two people, exactly two, head to toe in frame for the entire clip. Locked-off camera, no cuts, no zoom. Solid dark plum background, soft lavender and gold rim light. Style: stylised 3D-animated film, not photorealistic.
Same faces, hair, and outfits in every frame: her lavender gown, his charcoal-plum suit with a gold detail.

Action: [segment action, below]. Slow, graceful, continuous motion at a waltz tempo.

Constraints: no third person, no extra or missing fingers, hands stay correctly joined, no limbs passing through bodies, feet planted without sliding, faces do not change, no text, no logos.
```

**Segment actions:**

- **S1:** "He extends his open hand; she places her right hand in his; they hold gently; both give a small nod and smile."
- **S2:** "He lifts the joined hands; she performs ONE slow full turn under his raised arm, her skirt flaring and settling; she returns to face him and they step into a close dance hold."
- **S3:** "From the close hold he steps wide to his side and lowers her into a gentle supported dip: his arm under her back, her free arm extended, head tilted back; hold the bottom of the dip softly for a moment, with a very slight breathing motion."

### 6.1 Chaining rule (important)

When you pick the best take of S1, **use that take's actual last frame** (many hosts can return it, or export it from the video) as the **first frame of S2**, with your approved K4 as the S2 target. Repeat for S3. This keeps the joins matched even if a take's end drifted from the keyframe. If the actual last frame is poor, choose another take rather than forcing it.

### 6.2 How many takes

Plan **6–10 takes per segment**. S2 (the spin) is the riskiest and may need more, or a second route (shorter spin, a different tool). Keep every promising take until the whole chain is assembled.

---

## 7. Selection: the score sheet

Score each take 0 (fail), 1 (acceptable), 2 (good). **Reject any take with a 0 in a starred row.**

| Criterion                                                       | S1  | S2  | S3  |
| --------------------------------------------------------------- | --- | --- | --- |
| \* Faces and outfits stay the same throughout                   |     |     |     |
| \* Hands correct and joined where they should be (five fingers) |     |     |     |
| \* No limbs or bodies passing through each other                |     |     |     |
| Feet planted, no sliding                                        |     |     |     |
| Spin completes without limb distortion or the skirt "melting"   | n/a |     | n/a |
| Dip looks supported and safe; her head and arm are natural      | n/a | n/a |     |
| Motion is smooth and slow, not jerky or rubbery                 |     |     |     |
| Start frame matches the previous end frame                      | n/a |     |     |
| A still frame from the best moment looks romantic               |     |     |     |

Take a **still of the dip** and look at it alone at full size. If it looks awkward, the whole clip fails, however good the rest is.

---

## 8. Troubleshooting (from what the guides report)

| Problem                                           | Likely cause                           | Fix                                                                                                                                                           |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Faces drift after the spin                        | Fast or repeated spins; small faces    | One spin per clip; slower spin; keyframes with larger, sharper faces; add the character sheets as references                                                  |
| Blurry hands or extra fingers                     | Hands hidden or tiny in references     | Keyframes with both hands clearly visible; ask for hands to stay joined                                                                                       |
| Feet slide over the floor                         | Cropped feet or a camera that moves    | Feet in frame; "locked-off camera"; "feet planted"                                                                                                            |
| The last frame does not match K4 or K5            | The model treats the end frame loosely | Check each take; choose a better take; use the chaining rule; fix small mismatches with the next segment's first frame                                        |
| The wrong person leads, or a third person appears | Ambiguous prompt                       | "Exactly two people"; name the roles; crop references to the two characters                                                                                   |
| Bodies merge in the dip                           | Hard contact pose                      | Make K5 clearer (separate silhouettes); reduce the dip depth; try a different take or tool; consider filming (Romance Additions §9.3.1) for that segment only |
| Spin looks rubbery                                | Too many frames asked of the model     | Shorten S2; slow the spin; try the other tool                                                                                                                 |

---

## 9. Step 4: Assemble and process (done on your machine; Claude Code writes the script)

Commands are **patterns, not verified recipes**; check each on your machine and installed versions.

1. **Normalise each chosen take:** same size, 24 fps, high quality.

```bash
ffmpeg -i take_s1.mp4 -vf "fps=24,scale=-2:1280" -c:v libx264 -crf 14 -pix_fmt yuv420p s1_norm.mp4
```

2. **Join the segments** (drop the duplicated boundary frame so the join does not stutter), then check the whole clip plays continuously.

```bash
printf "file 's1_norm.mp4'\nfile 's2_norm.mp4'\nfile 's3_norm.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -crf 14 -pix_fmt yuv420p dance_full.mp4
```

3. **Trim to 8–10 s:** cut idle frames at the start and any long hold at the end (the player adds a slow zone for the dip).
4. **Smoothness:** if motion looks steppy, run frame interpolation (an open-source interpolator such as RIFE, or ffmpeg's `minterpolate` filter, which is lower quality). Compare before and after on the spin.
5. **Colour grade:** gentle lavender-and-gold look; lift the shadows toward plum; keep highlights at or below about 85 % (no pure white, consistent with the site's darker look, Romance Additions §9.1).
6. **Background to alpha (preferred):** run a video background-removal or matting tool (for example open-source options such as rembg or Robust Video Matting; check they still work and their licences). **Inspect hair and skirt edges against the dark plum and fix or re-run bad frames.**
   _Fallback if matting is poor:_ keep the plum background, grade it **slightly darker** than the page background, and let the player mask the edges with a radial gradient and a soft floor spotlight (no alpha).
7. **Pick the stored frame rate and count:** about 12–16 fps and **120–144 frames** for 8–10 s (the player blends neighbouring frames). Example: 9 s × 15 fps = 135 frames.
8. **Export frames** at **desktop 720 × 960** and **mobile 480 × 640**, WebP with alpha (quality about 70–78), named `0001.webp`, `0002.webp`, ... Also export two posters: `start.webp` (K1-like frame) and `dip.webp` (the best dip frame).
9. **Write the manifest** (see Romance Additions §9.3.3) with the frame counts, sizes and the **beats**: measure the frame index where hands join, the spin starts and ends, and the bottom of the dip, then divide by the frame count to get 0–1 values.

```bash
# pattern: extract at the stored rate, then convert
ffmpeg -i dance_final.mp4 -vf "fps=15,scale=720:960" frames/%04d.png
# then convert each PNG (with alpha if you matted) to WebP; Claude Code can script this with sharp
```

**Budgets to check at the end:** desktop set about 4–5 MB, mobile set about 2.5 MB. If larger, lower the quality, the frame count, or both.

---

## 10. Handing over to Claude Code

When you have the final folder, give Claude Code this brief:

> "Phase 11, M39/M40. Read `docs/references/love-site/phases/Phase-11-Dance-Reel.md` and Romance Additions §9.3. The dance frames are in `public/dance-reel/` (desktop and mobile sets, posters, manifest). Build `scripts/prepare-dance-reel` if conversion is still needed, then build the `DanceReel` player, the new Dance layout and heart pose, and the unit tests for the frame math. Keep the old particle dancers until I approve the reel."

Folder to deliver:

```text
public/dance-reel/
  manifest.json
  desktop/0001.webp … 0135.webp      (720 × 960)
  mobile/0001.webp  … 0135.webp      (480 × 640)
  posters/start.webp
  posters/dip.webp
```

---

## 11. Quality bar and exit

The clip is **accepted** only if all are true (same as Romance Additions §9.3.1): stable faces and outfits throughout; both hands visible and correct during the hold; no extra or missing fingers; no sliding feet; the spin completes without limb distortion; the dip never intersects bodies; a still of the bottom of the dip looks romantic.

**If it is not accepted after a few rounds:** do not keep spending. Switch the problem segment to **filming** (Romance Additions §9.3.1 route A) or try the other tool. The player does not care where the frames come from.

---

## 12. Time and effort (honest expectations)

I cannot predict how many rounds your characters will need. The guides describe AI dance clips as needing several takes and checks even for simple moves, and the dip and spin are the hardest parts. Treat the first session as an experiment: make the character sheets, the five keyframes and **one segment (S2, the spin)** first. If the spin passes the score sheet, the rest will follow. If it fails, you have learned that cheaply, before building anything on the site.

---

## 13. Privacy checklist

- [ ] Decided: exact likenesses (§2.1), with her consent recorded (§14.1)
- [ ] Checked each tool's terms for commercial use, likeness and training on uploads
- [ ] Deleted source uploads from the services where possible after you finish
- [ ] Kept the final frames and the approved reference images only in your private repository
- [ ] No third-party scripts added to the site for this feature (the frames are static files)

---

## 14. Exact-likeness workflow (decision recorded 2026-11-19)

**Decision:** the couple are **exact likenesses of you two, with her consent**, in the stylised 3D look. This replaces the "inspired by" path in §2.1 and changes Step 1 (§4).

### 14.1 Consent: what her "yes" should cover

Keep a simple record (a message is enough) that she agreed to:

- her photos being uploaded to a third-party AI image and video service;
- a stylised likeness of her appearing on a **private** website that anyone with the link can see;
- how long the source photos and generated files are kept, and that you will delete them from the services when you finish;
- her right to say "no, not that one" and have a clip dropped.

If this site is ever reused as a Love Websites demo, ask again; a gift is not a licence for portfolio use.

### 14.2 The photos to collect (for each of you)

| Photo                          | Needed | Notes                                                                          |
| ------------------------------ | ------ | ------------------------------------------------------------------------------ |
| Full body, facing the camera   | 2      | Feet and both hands visible, relaxed, plain background, even daylight          |
| Full body, three-quarter angle | 1–2    | Same outfit and hair as the others                                             |
| Face close-up, neutral         | 2      | Straight-on and slightly turned, no sunglasses, no hat, hair as it will appear |
| Face close-up, soft smile      | 1–2    | Teeth and eyes clear, no heavy filter or beauty mode                           |

Avoid: group photos, heavy filters, strong colour casts, motion blur, hands in pockets, anything hiding the jaw or hairline. Sharp, evenly lit, recent.

### 14.3 Step 1 revised: character sheets from photos

For each person, ask the identity-consistent image model to make a **stylised 3D character sheet from the photos**, not from a text description:

```text
Using the attached photos of this person, create a full-body character sheet in a stylised 3D-animated film look. Keep the face, hair, skin tone and body proportions clearly recognisable, but gently stylised and flattering, with smooth soft shading and clean fabrics. Neutral standing pose, both hands open and visible, feet visible. Three views: front, side, back. Outfit: [her: flowing floor-length lavender gown with thin gold trim at the waist] / [him: charcoal-plum dark suit, lighter shirt, small gold detail]. Solid very dark plum background (about #17121D), soft floor shadow only. Not a photograph.
```

**Likeness dial:** aim for **recognisable but clearly animated**. The more photographic the characters, the more the video model drifts and the more uncanny the result; the more stylised, the more stable. Do a blind check: show each sheet to someone who knows the person and ask who it is without telling them. If they say the name straight away, it is stylised enough to be stable and close enough to be loved.

Then make the **couple reference** and the five keyframes exactly as in §4–§5, always attaching the approved character sheets **and the best two face close-ups** as references.

### 14.4 Extra safeguards for real faces

- **One spin per clip**, the slowest spin that still reads as a spin.
- Give the model **more reference images** of each face (Seedance 2.5 is reported to accept many references; check your host's limit).
- Keep faces large and sharp in the keyframes (full body but with a generous size; avoid tiny, distant figures).
- Expect some services to **refuse or restrict uploads of real people** or to ask you to confirm you have the rights. If a service refuses, note it in the test log and use the other tool, or generate the keyframes first and upload only those stylised images (not the photos) to the video tool.
- Check every take for **face drift after the spin**; this is the most reported failure.

---

## 15. Tool test protocol: Seedance 2.5 vs Kling 3.0

**Goal:** choose the tool from evidence on **your** characters, with the least spend.

### 15.1 Controls (same for both tools)

| Item              | Setting                                                                                |
| ----------------- | -------------------------------------------------------------------------------------- |
| Inputs            | The same approved keyframes (K1–K5) and the same character references                  |
| Prompts           | The same prompt text per segment (adapt only the reference syntax)                     |
| Aspect and length | 3:4; 4–5 s per segment                                                                 |
| Resolution        | The highest resolution both offer at a fair price (720p is fine for the test)          |
| Audio             | Off                                                                                    |
| Host              | One host per tool for the whole test, so results are comparable                        |
| Spend cap         | Decide before you start (for example 10 generations per tool) and stop when you hit it |

### 15.2 Test cases (ordered by risk)

| Test   | Segment                  | Takes per tool | Why                                                    |
| ------ | ------------------------ | -------------- | ------------------------------------------------------ |
| **T1** | S2: the spin (K2 → K4)   | 5              | The riskiest move; most face drift and limb distortion |
| **T2** | S3: the dip (K4 → K5)    | 5              | The most romantic frame; contact between bodies        |
| **T3** | S1: offer hand (K1 → K2) | 3              | Easy; a tie-breaker and a check on likeness            |

Run T1 first for both tools. **Do not run T2 or T3 on a tool that fails T1 badly.**

### 15.3 Log every take

| Date | Tool and host | Segment | Take | Settings and seed | Cost | Time to render | Faces (0–2) | Hands (0–2) | No pass-through (0–2) | Feet | Motion | Join match | Likeness kept? | Notes |
| ---- | ------------- | ------- | ---- | ----------------- | ---- | -------------- | ----------- | ----------- | --------------------- | ---- | ------ | ---------- | -------------- | ----- |

Use the score sheet in §7 for the columns. Mark any take with a 0 in a starred row as **rejected**.

### 15.4 Decision rule

1. **Gate:** a tool must produce at least **2 of 5** takes on T1 that pass every starred criterion. If neither does, stop (see 15.5).
2. If both pass, prefer the tool with more passing takes on **T1 and T2 combined**.
3. If tied, prefer the higher average total score.
4. If still tied, prefer the lower **cost per passing take**.
5. Always apply the **likeness check**: a blind check that the faces are still recognisable in the chosen takes. A tool that keeps the faces recognisable wins over one that scores slightly better elsewhere.

### 15.5 If neither tool passes T1

- Shorten the spin to a half turn, or remove K3 and let S2 run K2 → K4.
- Rewrite the prompt with more explicit constraints and try 5 more takes on the better tool.
- Try a different tool from the research (for example the MiniMax Hailuo "dance from a reference video" mode, which copies choreography from a reference clip you record on your phone).
- **Or film the spin and dip yourselves** (Romance Additions §9.3.1 route A) and keep the AI only for the approach. The player does not care where frames come from.

### 15.6 Output of the test

A half-page note for the ADR: the tool chosen, the dates, the settings, the pass rates, the cost, the likeness check, and the rejected alternative with the reason. Add it to `docs/decisions/` with the Dance ADR.

---

## 16. Your first session (a concrete checklist)

1. Agree and record her consent (§14.1).
2. Collect the photos (§14.2) for both of you.
3. Make the two character sheets (§14.3) and run the blind likeness check.
4. Make the couple reference and the five keyframes (§4–§5); reject until all five look like one photo shoot.
5. Run **T1 only**, five takes on each tool (§15), logging each take.
6. Apply the decision rule (§15.4), then continue with T2 and T3 on the winner.

In parallel, Claude Code builds Phases 8–10 (look, interactive moments, Afterglow): they do not depend on the dance. Phase 11 starts when the clip passes the quality bar.
