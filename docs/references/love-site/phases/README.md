# Love Site — Phase Guides

Detailed build guides, one per phase. Each covers: context, what you will see at the end, what to read first (guidebook sections and repo files), the tech used, numbered build steps with "you should see" checks and reduced-motion versions, contracts, testing, skills, exit checklist, risks, doc updates, a commit plan and the handoff to the next phase.

Summary and repo corrections: [../Love-Site-Implementation-Phases.md](../Love-Site-Implementation-Phases.md) (its §2 overrides the guidebooks).

| Phase | Guide                                                                                                | Milestones        | Result                                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1     | [Phase-1-Foundations-and-Static-Skeleton.md](Phase-1-Foundations-and-Static-Skeleton.md)             | M0, M1            | Approvals, ADRs, images, private bare route, tokens, static sections                                                              |
| 2     | [Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md](Phase-2-Scroll-Engine-Theme-and-3D-Smoke-Test.md) | M2, M3            | Lenis + GSAP one clock, sticky stages, night → dawn theme, Calm mode, canvas, tiers, debug panel                                  |
| 3     | [Phase-3-The-Heart.md](Phase-3-The-Heart.md)                                                         | M4, M5, M6, M10   | Gate, particle heart, hero weave, Heart Director, audio, heart path, Bloom                                                        |
| 4     | [Phase-4-Night-Story-Memories-and-Timeline.md](Phase-4-Night-Story-Memories-and-Timeline.md)         | M7, M8            | Memory orbs and dialog, golden thread timeline, arrow strike                                                                      |
| 5     | [Phase-5-Day-Story-Dawn-to-Finale.md](Phase-5-Day-Story-Dawn-to-Finale.md)                           | M9, M11, M12, M13 | Dawn and Pearl skin, gallery and lightbox, wish, letter, finale and Replay                                                        |
| 6     | [Phase-6-Fallbacks-QA-Content-and-Launch.md](Phase-6-Fallbacks-QA-Content-and-Launch.md)             | M14, M15, M16     | Static path, accessibility, performance, real content, deploy                                                                     |
| 7     | [Phase-7-Refinements-Letter-and-Dance.md](Phase-7-Refinements-Letter-and-Dance.md)                   | M17–M21           | Hero glow/float, heart gate, spiral timeline, parchment letter, ambient hearts, dancing duo                                       |
| 8     | [Phase-8-Look-Polish-and-Foundations.md](Phase-8-Look-Polish-and-Foundations.md)                     | M22–M27           | ADRs, config, persistence, chimes; darker look, Bloom line, button system and Finale, Wish medallion, full-length Letter frame    |
| 9     | [Phase-9-Interactive-Heart-Moments.md](Phase-9-Interactive-Heart-Moments.md)                         | M28–M33           | Blow-detector spike, heart spells her name, voice note, Our sky, Reasons ring, candle wish                                        |
| 10    | [Phase-10-Afterglow-Room-and-QA.md](Phase-10-Afterglow-Room-and-QA.md)                               | M34–M37           | Afterglow room, gifts and plan, Open when… notes, hidden hearts and secret room, QA of Phases 8–10                                |
| 11    | [Phase-11-Dance-Reel.md](Phase-11-Dance-Reel.md)                                                     | M38–M40           | AI dance clip (owner, starts now in parallel), scroll-played frame reel, removal of the particle dancers; `/plan` before building |

Phases 8–11 implement [Love-Site-Romance-Additions.md](../Love-Site-Romance-Additions.md) (master spec, §0 delivery map) and [Dance-Clip-Production-Guide.md](../Dance-Clip-Production-Guide.md).

**How to use with Claude Code:** start each phase with "Read `docs/references/love-site/phases/Phase-N-….md` and its Read-first list, then `/plan` this phase." Build one step (or one commit slice) at a time, check the "you should see" line in the browser, and tick the exit checklist before moving on.
