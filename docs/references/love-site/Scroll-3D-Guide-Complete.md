# Complete Guide: Building Premium Scroll-Animated 3D Websites with Claude Code

A practical guide to every tool and skill from your research list, how to combine them, what I recommend and why, and step-by-step approaches for product/service sites and wedding sites.

**How much to trust this guide.** Facts about Claude Design, GSAP, Lenis, Motion, Spline and React Bits come from official pages I read. Higgsfield and 21st.dev pricing comes partly from secondary sources, and Spline's exact plan prices were not verified. Items marked **(verify)** should be checked on the vendor's page before you pay for anything.

---

## 1. The big picture: five layers

Every premium scroll-3D site is the same five layers stacked together. Knowing which layer a tool belongs to stops you from using three tools for one job.

1. **Direction** (what it should look and feel like): your references, a written design brief, and Claude Design for visual exploration.
2. **Assets** (the 3D and media): Spline scenes, plus generated images or video (Higgsfield).
3. **Page code** (the actual website): written by Claude Code in HTML/CSS/JS or React/Next.js.
4. **Scroll engine** (how scrolling drives the experience): Lenis smooths the scroll, GSAP ScrollTrigger ties animations to scroll position.
5. **Component motion** (small effects): Motion, React Bits, 21st.dev.

Then a sixth step outside the stack: **testing and deployment** (Vercel or Netlify).

---

## 2. Every tool: what it is, when to use it, when to skip it

### Claude Code (your builder)

- **What:** An agent that reads and edits files in your project folder and runs commands. It does the typing; you make the decisions.
- **Use it for:** Building the site section by section, fixing bugs, wiring libraries together.
- **Skip it for:** Choosing the look. It will default to generic taste unless you give it a brief and references.
- **Verdict:** Core. Everything else plugs into it.

### Claude Design (your visual exploration tool)

- **What:** Describe a visual and Claude builds a first version you refine by chat, comments, direct edits or sliders. It is now built into normal Claude conversations, including Claude Code and the Artifacts tab, and is listed as included in every plan including Free.
- **Important date:** the standalone site (claude.ai/design) closes on **14 December 2026**. If you have projects or design systems there, move them first.
- **Strengths:** Fast look-and-feel exploration, interactive prototypes, design-system support, exports to HTML, PDF and PPTX, handoff to Claude Code, and sending to tools like Vercel and Netlify. Anthropic also lists 3D and shader prototypes among its uses.
- **Limits:** Usage counts against your normal Claude limits. No version history yet. Multi-person editing is unreliable. Early reviews said output wasn't production-ready (spacing, typography), so treat it as a prototype, not the final build.
- **Verdict:** Use it for the direction layer and client approval. Don't rely on it for final production code.

### Spline (your 3D hero)

- **What:** A browser-based 3D design tool. You model, add materials, set up hover/scroll events, then export a scene to the web (and to iOS/Android). It also has an official MCP connector so an agent such as Claude can read and write scenes.
- **Use it for:** A product object, an abstract shape, a ring, a floating monogram. One strong 3D scene beats many weak ones.
- **Skip it for:** Film-quality renders or heavy simulation (Blender is better) and scenes you need to control at code level (Three.js is better).
- **Watch-outs:** Detailed scenes can strain low-powered phones. Third-party sources say the free plan adds a watermark to web exports, but plan prices conflict across sources **(verify at spline.design/pricing)**.
- **Verdict:** Best way to get 3D onto a page without being a 3D programmer.

### GSAP + ScrollTrigger (your scroll choreography)

- **What:** GSAP is a professional JavaScript animation library. ScrollTrigger is its scroll plugin: it can start animations when elements enter view, **scrub** an animation to the scrollbar, **pin** a section while scrolling continues, and snap to points.
- **Cost:** GSAP and all its plugins are now free, including for commercial use. Older articles that mention paid membership are outdated.
- **Use it for:** Pinned sections, scroll-driven timelines, text and card reveals, a 3D object that rotates as you scroll.
- **Rules that prevent most bugs (from the official docs):** don't animate the pinned element itself (animate things inside it), create triggers in the order they appear on the page, avoid CSS `content-visibility: auto` on animated sections, and in React clean up properly (use the official React helper).
- **Verdict:** The best fit for premium scroll-driven sites. Has official AI skills for Claude Code.

### Lenis (your smooth scroll)

- **What:** A free, open-source, very small library that smooths mouse-wheel and touch scrolling so the page glides.
- **Use it:** To get the "expensive" buttery feel, and to keep scroll-linked animations in sync with 3D/WebGL.
- **Must-do:** Connect it to GSAP the way Lenis's README describes: update ScrollTrigger on each Lenis scroll event, run Lenis from GSAP's ticker, and turn off GSAP lag smoothing. Include Lenis's recommended CSS. Use the current `lenis` npm package, not the deprecated older one.
- **Watch-outs:** Users have reported glitches on iPad trackpads and low-end laptops. The vendors disagree on accessibility claims, so always provide a reduced-motion path.
- **Verdict:** Recommended, but keep it tunable and switch-off-able.

### Motion (motion.dev, formerly Framer Motion)

- **What:** A free, open-source animation library for JavaScript, React and Vue. It uses browser-native animation where possible and has a very small core.
- **Use it for:** Small component animations: fades, hover and press effects, layout transitions, exit animations in React.
- **Free vs paid:** Core is free. Motion+ adds premium components, examples and visual editing. A free, MIT-licensed `/motion` skill for AI agents installs with one command.
- **Verdict:** Optional. Don't run it on the same elements as GSAP. Pick one engine per element.

### React Bits (copy-in animated components)

- **What:** A library of 130+ animated React components (text effects, backgrounds, interactive cards) that install as source code you own, in JS or TS, with CSS or Tailwind.
- **Licence:** MIT + Commons Clause, described as free for personal and commercial use. Using it inside client sites is fine per its README; reselling the components as your own product is not.
- **Verdict:** Great for "statement" effects such as animated headings and backgrounds. Some components use WebGL, so check weight on mobile. The site also has a Pro section **(verify what is paid)**.

### 21st.dev (component marketplace + Magic MCP)

- **What:** A community marketplace of React/Tailwind (shadcn-style) components with a CLI install, plus a "Magic" MCP server that generates components from prompts.
- **Cost:** Installing needs an API key; free accounts get a limited number of installs per day; Magic is reported as a paid feature **(verify)**.
- **Verdict:** Optional. Useful for interface pieces (forms, navs, pricing tables), less useful for scroll-3D choreography. Not suited to non-Tailwind projects.

### Higgsfield (AI image and video generation)

- **What:** A paid creative suite that bundles its own tools with many external image and video models. There is an official MCP connector so Claude can generate media into your account.
- **Cost:** The MCP route needs a paid plan and uses credits; pricing differs between sources **(verify on higgsfield.ai/pricing)**. Tell the agent to state the credit cost and wait for your approval before each generation.
- **Safety:** Use only the official connector. Several community MCP servers exist and are unofficial.
- **Verdict:** Add per project when you need hero images, background loops or product shots. Not required for a first build.

### Optional extras

- **Three.js / React Three Fiber:** code-based 3D for full control. Choose it over Spline when you need custom shaders, exact performance control or no Spline plan dependency.
- **Blender:** custom 3D models when stock or generated models won't do.
- **Figma:** only if a client insists on approving static designs first.
- **Not relevant:** the Meshy "spline" glossary page is about the mathematical curve, not the Spline tool.

---

## 3. Skills to learn, in priority order

**Tier 1: do these first (about 80% of results)**

1. **Design basics.** Type pairing (2 fonts), a restrained palette, spacing, hierarchy, mobile-first layout. This separates premium from generic.
2. **Art direction and briefing.** Describe mood, references, motion speed and what to avoid. This is the skill that makes AI output look designed.
3. **Reading HTML/CSS/JS.** You don't have to write it, but you must spot what's broken.
4. **Scroll animation concepts.** Reveal, parallax, pin, scrub, snap.
5. **Git, GitHub and deployment** (Vercel or Netlify).
6. **Performance and phone testing.** Image/video compression, lazy loading, real-device checks.

**Tier 2: what makes it 3D and cinematic** 7. **GSAP + ScrollTrigger.** 8. **Lenis integration.** 9. **Spline basics** (primitives, materials, events, export). 10. **React or Next.js basics.**

**Tier 3: differentiators** 11. Prompting AI media tools (images, video loops). 12. Three.js / React Three Fiber. 13. Blender basics. 14. SEO, analytics and forms (contact, RSVP).

---

## 4. How the tools combine, and the rules that keep it clean

- **One scroll engine:** Lenis (smoothing) + GSAP ScrollTrigger (choreography), wired together as documented.
- **One animation engine per element:** GSAP for scroll-driven sequences; Motion or React Bits for small component effects on different elements. Never both on the same element.
- **One hero 3D scene** (Spline or Three.js), plus at most one more showcase scene. Lazy-load below-the-fold scenes.
- **Claude Design is for direction, Claude Code is for production.** Use Design to decide and get approval, then hand off.
- **Pin library versions.** Don't use "latest" in CDN links; many tutorials use old or unpinned versions.
- **Always provide a reduced-motion and low-power fallback.**

---

## 5. What I recommend, and why

**Recommended stack (flagship product/service sites):** Claude Code + Next.js (or plain HTML for simple pages) + GSAP/ScrollTrigger + Lenis + Spline hero. Claude Design for exploration. Add React Bits only for one or two signature effects. Add Higgsfield only when a project needs custom media.

**Why:**

- It has the best documentation and the least integration guesswork: official GSAP skills for Claude Code, and an official Lenis-to-GSAP wiring recipe.
- It keeps costs low: GSAP, Lenis, Motion and React Bits are free; the paid items (Spline plans, Higgsfield) are added only when needed.
- It matches your business: premium, bespoke scroll-3D is exactly what GSAP + Spline do best.
- It limits risk: one scroll engine, one animation engine per element, one hero scene.

**Recommended approach for wedding sites:** Build one reusable template, then re-skin it per couple. Use a lighter stack: Lenis + a few GSAP reveals, one small 3D or animated element (monogram, petals, rings), and a form service for RSVP. Reserve heavy 3D for the hero only, because most guests open links on phones.

**When to choose differently:**

- Need very fast, low-code delivery: Framer or Webflow (Lenis has a Framer component; Motion and GSAP have Webflow-friendly routes).
- Need custom shaders or tighter performance control: Three.js instead of Spline.
- Client wants static approval first: add a Figma step.

---

## 6. Step-by-step approaches

### Approach A: Code-first flagship site (recommended)

**Phase 1: One-time setup**

1. Install Node.js, Git and VS Code. Install Claude Code from Anthropic's current docs.
2. Create GitHub and Vercel (or Netlify) accounts.
3. Install the official GSAP skills for your agent (read the repository first) and Motion's free skill if you plan to use Motion.
4. Create a Spline account.

**Phase 2: Direction (1 to 2 hours)** 5. Collect 3 to 5 reference sites and write one line on what you like about each. 6. In Claude chat, ask for a site architecture: pages, sections, the single goal (buy, book, enquire). 7. Ask for a design brief: palette (hex codes), two fonts, motion speed and easing, mood words, and a "never do" list. Save it as `DESIGN_BRIEF.md`. 8. Optional: explore the look in Claude Design and get the client to react to it.

**Phase 3: Assets** 9. Build the Spline hero scene (hover or scroll events). Export the code embed. Keep the scene light. 10. If needed, generate images or short video loops (Higgsfield), then compress them (WebP for images, short MP4/WebM for video).

**Phase 4: Build with Claude Code** 11. Create the project and add a `CLAUDE.md` containing the stack, the design brief and rules: mobile-first, reduced-motion support, lazy-load 3D and video, pin library versions. 12. Build section by section, not all at once: - Project shell with Lenis smooth scroll and GSAP ScrollTrigger wired together. - Hero with the Spline scene and a text entrance. - One pinned, scrubbed section where the 3D object responds to scroll. - Features section with a staggered reveal. - Proof, pricing or CTA, and footer. 13. After each section, run the dev server, look at it, and give specific feedback ("headline too small on mobile", "easing too abrupt"). 14. Commit to Git after each working section so you can roll back.

**Phase 5: Polish and launch** 15. Test on a real mid-range phone and a slow connection. 16. Run Lighthouse; compress anything heavy; set a simpler fallback for low-end devices. 17. Add metadata, favicon, share image and the contact/RSVP form. 18. Deploy to Vercel or Netlify; connect the client's domain.

### Approach B: Design-first (best when a client must approve a look)

1. In Claude Design, create the hero and two key sections from your brief and references.
2. Iterate with comments and sliders until the client approves. Export to HTML or PDF for sharing.
3. Hand off to Claude Code (or export the design) and rebuild it as production code with GSAP and Lenis.
4. Replace placeholder visuals with the real Spline scene.
5. Continue from Approach A, Phase 4.

_Why:_ it moves expensive disagreement to the cheap prototype stage. _Caveat:_ prototypes are not production code, so expect to rebuild motion.

### Approach C: Fast wedding-template workflow

1. Define the template sections: hero (names, date), our story, timeline, venue and map, gallery, RSVP, gift/registry info.
2. Build it once with Approach A, using a light stack (Lenis, a few GSAP reveals, one small hero effect).
3. Move all couple-specific content (names, dates, text, photos, palette, fonts) into one clearly separated content file so a re-skin takes hours, not days.
4. For each couple: swap content and palette, adjust the hero element (monogram, petals, rings), test on phones, deploy.
5. RSVP: use a form service or simple backend, and protect guest data. Add optional password protection and a music toggle that is off by default.

### Approach D: Adding AI media (Higgsfield)

1. Subscribe only when a project needs custom hero media.
2. Connect the official connector; set Claude to ask before spending credits.
3. Generate a small batch, pick the best, compress, and drop it into the build.
4. Budget credits per project; costly video models use credits quickly.

---

## 7. Working well with Claude Code

- **Give it memory.** Keep a `CLAUDE.md` with stack, rules and the brief. Update it as decisions change.
- **Small prompts, big results.** One section per prompt; describe the feeling, the scroll behaviour and the mobile behaviour.
- **Show, don't just tell.** Paste screenshots and reference links; say what to keep and what to change.
- **Ask it to explain.** After each section, ask for a plain-language summary of what it wired, so you learn the pieces.
- **Use the official skills.** They exist so the agent stops guessing library syntax.
- **Review what you install.** Only install skills or scripts from official repositories, and skim them first. Never install "comment for the link" bundles from social posts.

---

## 8. Performance and accessibility checklist

- Only one or two 3D scenes per page; lazy-load anything below the fold.
- Compress images and video; set sensible poster images.
- Test on a real mid-range phone and a slow connection.
- Honour reduced-motion settings; offer a no-motion fallback.
- Give Lenis a switch-off path and test trackpad and touch.
- Keep text readable over moving backgrounds; check contrast.
- Avoid animating layout-heavy properties; stick to transforms and opacity.
- Remove debug markers before launch.

---

## 9. Costs and licensing at a glance

| Tool                        | Cost picture                                          | Note                                                               |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| Claude Code / Claude Design | Included in Claude plans; shared usage limits         | Design standalone site closes 14 Dec 2026                          |
| GSAP + ScrollTrigger        | Free, commercial use OK                               | Older "members-only" claims are outdated                           |
| Lenis                       | Free, MIT                                             | Use the current `lenis` package                                    |
| Motion                      | Free core; Motion+ optional                           | Pin versions                                                       |
| React Bits                  | Free, MIT + Commons Clause                            | Don't resell components as a product; check Pro section            |
| 21st.dev                    | API key; limited free installs; Magic reportedly paid | Verify                                                             |
| Spline                      | Free tier plus paid plans                             | Prices conflict across sources; verify watermark and export limits |
| Higgsfield                  | Paid plan needed for MCP                              | Credit-based; verify pricing                                       |

---

## 10. Common mistakes

- Asking Claude for the whole site in one prompt.
- Stacking GSAP and Motion on the same elements.
- Heavy 3D or video on every page.
- Skipping the design brief and getting the generic AI look.
- Using old tutorials with outdated or unpinned library versions.
- Forgetting mobile and reduced-motion testing.
- Installing unofficial MCP servers or unverified skill bundles.
- Paying for tools before a project needs them.

---

## 11. A 30-day plan

- **Week 1:** Set up tools. Learn design basics and briefing. Build a simple page with plain CSS reveals.
- **Week 2:** Learn ScrollTrigger. Add Lenis. Rebuild one reference site's scroll feel.
- **Week 3:** Learn Spline. Build one hero scene, embed it, and test it on a phone.
- **Week 4:** Build and deploy two demos: one product site and one wedding template. Add them to a portfolio.

---

## 12. Still to verify before you commit money

- Spline's current plan prices, watermark rules and export limits (spline.design/pricing).
- Higgsfield's current official pricing and MCP terms.
- What is paid in React Bits Pro, Motion+ and 21st.dev.
- Real-device performance of your own Spline + GSAP + Lenis combination.
