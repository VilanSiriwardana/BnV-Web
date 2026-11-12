# Building Premium Scroll-Animated 3D Websites with Claude Code

The videos describe three overlapping approaches: Claude plus Spline, Claude Code plus a prompt library, and Claude Code plus GSAP, Lenis and React Bits. They also list skills (impeccable, frontend-design, motion.dev, Higgsfield MCP, Remotion). Not every tool name has been verified, so check each one's official page before relying on it. The core stack below is standard and well established.

## 1. Skills to learn

**Must-have (about 80% of the result)**

1. **Design basics:** typography pairing, color palette, spacing, visual hierarchy, and mobile-first layout. This is what separates "premium" from "slop".
2. **HTML, CSS and JavaScript fundamentals.** You don't need to write everything, but you must be able to read and debug what Claude writes.
3. **Prompting and art direction.** Describe mood, references, motion style, and what to avoid.
4. **Scroll animation concepts:** scroll-triggered reveals, parallax, pinned sections, and scrubbed timelines.
5. **Git and GitHub, plus deployment** (Vercel, Netlify, or Cloudflare Pages).
6. **Performance basics:** image and video compression, lazy loading, and testing on a mid-range phone.

**Level 2 (this is what makes it 3D)**

7. **Spline:** a no-code 3D design tool. It's the fastest way to get interactive 3D onto a page.
8. **Three.js or React Three Fiber:** code-based 3D for more control.
9. **GSAP with ScrollTrigger:** timelines and scroll choreography.
10. **Lenis:** smooth scrolling.
11. **Basic React or Next.js:** most modern component libraries assume it.

**Level 3 (differentiators)**

12. AI image and video generation (the Higgsfield MCP from the video, or similar) for hero visuals and background loops.
13. Blender basics, for custom 3D models later.
14. Remotion, if you want to produce videos or social promos too.
15. SEO basics, analytics, and contact forms.

## 2. Tools and what each is for

| Tool                                   | Job                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| **Claude (chat)**                      | Plan site structure, write copy, brainstorm animation ideas                         |
| **Claude Code**                        | Writes and edits the actual website code in your project folder                     |
| **Claude Design**                      | Visual design and mockups (from the video; check current availability and features) |
| **Spline**                             | Build interactive 3D scenes and embed them                                          |
| **GSAP + ScrollTrigger**               | Scroll timelines and pinned or scrubbed animation                                   |
| **Lenis**                              | Buttery smooth scroll                                                               |
| **Motion (motion.dev)**                | Fades, reveals, and component animation in React                                    |
| **React Bits / 21st.dev**              | Copy-paste animated components and backgrounds                                      |
| **Higgsfield or other AI media tools** | Images and video for hero sections                                                  |
| **Vercel / Netlify**                   | Free hosting                                                                        |
| **Figma (optional)**                   | Manual design if you want precise control                                           |

The last video's advice applies here: **start with plain CSS scroll animations and stop as soon as that's enough.** Add GSAP only when you need a real timeline.

## 3. Design outside Claude, or inside it?

**Recommendation: a hybrid.** Let Claude handle most of the design, but you make the creative decisions.

- **Inside Claude:** site structure, copy, color and font suggestions, a written design brief, and the code for layouts and animations.
- **Outside Claude:** collecting visual references (Awwwards, Dribbble, Pinterest, Behance), building 3D scenes in Spline, and generating hero images and videos.
- **Optional Figma step:** useful for clients who need to approve a design before you build. For fast projects, skip it and iterate directly in code.

AI left to its own taste produces generic results. Your references and a clear brief are what give the site its distinct look.

## 4. Step-by-step workflow

### Phase A: Setup (one time)

1. Install **Node.js**, **Git**, and **VS Code**.
2. Install **Claude Code** by following Anthropic's current docs at docs.claude.com (the install command changes over time).
3. Create a **GitHub** account and a **Vercel** or **Netlify** account.
4. Create a **Spline** account (a free tier is available).

### Phase B: Plan each project

5. **Collect 3 to 5 reference sites** you love, with notes on what you like (the scroll feel, the typography, the 3D object).
6. **Ask Claude (chat) to act as a web architect:** pages, sections, user flow, and the single goal of the site (buy, book, RSVP).
7. **Ask for a design brief:** palette (hex codes), 2 fonts, motion principles (speed, easing), and mood words. Save it as `DESIGN_BRIEF.md`.
8. **Generate the copy:** headlines, section text, and calls to action, matching the tone you want.

### Phase C: Create assets

9. **Build the 3D hero object in Spline** (a product, a ring, an abstract shape). Add hover or scroll interactions and export the embed link or code.
10. **Generate images and video loops** with an AI tool, and compress them (WebP for images, short MP4 or WebM for video).
11. **Pick animated components** from React Bits or 21st.dev that match your brief.

### Phase D: Build with Claude Code

12. Create a project, for example a Next.js or Vite and React app, and open the folder in your terminal.
13. Start `claude` in that folder.
14. Create a **`CLAUDE.md`** file with your stack, rules, and the design brief. Claude Code reads it each session. Example rules:
    - Use Next.js, Tailwind, GSAP + ScrollTrigger, and Lenis.
    - Mobile-first, accessible, with `prefers-reduced-motion` support.
    - Lazy-load 3D and video, and keep the page light.
15. **Build section by section, not all at once.** For example:
    - "Set up the project with Lenis smooth scroll and GSAP ScrollTrigger."
    - "Build the hero with this Spline scene embedded. Text fades up on load."
    - "Add a pinned scroll section where the product rotates as the user scrolls."
    - "Add a features section with a staggered card reveal."
16. **Run the dev server** (`npm run dev`), look at it in the browser, and give Claude specific feedback: "the headline is too small on mobile", "the easing feels abrupt, make it slower."
17. **Commit to Git often** so you can roll back if an AI change breaks something.

### Phase E: Polish and launch

18. Test on a real phone, and on a slow connection if you can.
19. Check performance with Lighthouse in Chrome DevTools. Compress anything heavy, and offer a simpler fallback for low-end devices.
20. Add metadata, a favicon, share images, and a contact or RSVP form.
21. Push to GitHub and deploy to Vercel or Netlify.
22. Connect a custom domain for the client.

## 5. Wedding websites

- **Reusable template:** build one strong template (hero with names and date, our story, timeline, venue map, RSVP, gallery, gift or registry info) and re-skin it per couple.
- **What changes per client:** palette, fonts, photos, text, and the 3D or animated element (an animated monogram, floating petals, a rotating ring, a scroll-driven love-story timeline).
- **RSVP and data:** use a form service or a simple backend (Supabase, Formspree, or Google Sheets). Never leave guest data unprotected.
- **Optional extras:** password protection, a music toggle (off by default), a countdown, and multiple languages.
- **Delivery:** guests mostly open links on phones, so test mobile first.

## 6. Product and service websites

- **Structure:** hero with 3D product, key benefits, scroll-driven feature showcase, social proof, pricing or CTA, FAQ.
- **Strategy:** the animation should serve the message. Put the CTA early and again at the end.
- **Do the 3D carefully:** a heavy scene on every page hurts conversion. Use it in the hero and one showcase section.

## 7. Suggested learning order (about 8 weeks)

1. **Weeks 1–2:** HTML, CSS, JS basics and Claude Code setup. Build one simple landing page with CSS scroll reveals.
2. **Weeks 3–4:** Next.js or React basics, Tailwind, GSAP ScrollTrigger, and Lenis. Rebuild a reference site's scroll feel.
3. **Weeks 5–6:** Spline. Make a 3D hero and embed it in your site.
4. **Week 7:** AI media generation, performance optimization, and deployment.
5. **Week 8:** Build two portfolio demos, one product site and one wedding site, and deploy both.

## 8. Common mistakes to avoid

- Asking Claude for the whole site in one prompt. Build section by section.
- Too many animations. Premium sites use fewer, better-timed ones.
- Heavy 3D and video that make the site slow on phones.
- Ignoring `prefers-reduced-motion` and accessibility.
- No design brief, which leads to the generic AI look.
- Not reading what Claude writes. Learn enough to catch problems.
- Downloading unverified skills or scripts from comment-for-link offers. Install only from official sources (GitHub repos, official docs) and review them first.

## 9. Making money from it

Build 2 to 3 polished demo sites first. Package your offer (for example "Premium 3D wedding site, delivered in X days"), and show demos in a portfolio. Sell the outcome (more bookings, a memorable invitation) rather than the tech.

## Next steps

If you share your current coding level and whether you prefer Spline (no-code 3D) or code-based 3D, the exact first prompts and a `CLAUDE.md` file for your first project can be written, along with a starter template outline for the wedding site.
