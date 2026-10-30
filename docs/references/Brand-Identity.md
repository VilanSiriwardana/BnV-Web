# B&V Brand Identity & Design System Reference

| Field               | Value                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Version             | 1.5                                                                                                                |
| Status              | Approved (content changes in v1.2 are alignment edits; see change log)                                             |
| Converted / updated | 2026-10-29                                                                                                         |
| Based on            | Brand_Identity___Design_System_Reference_v1_1.pdf plus Business Strategy v1.2 and Phase Development Reference v1.1 |

> **Reference-library note.** Replaces the previous docs/references/Brand-Identity.md, which held the pre-pivot couple-only text with broken Markdown headings.

## Project Status

This document defines the design direction, visual identity rules, color system, typography system, logo rules, naming rules, UI style, imagery direction, and Tailwind implementation approach for B&V, a modern romantic lifestyle ecommerce brand.

**Change log**

- **v1.0** — Original design reference for a couple lifestyle brand.
- **v1.1** — Added Section 41, Dark Mode Theme Design Decisions (Midnight Lavender Luxury).
- **v1.2 (2026-10-28)** — Aligned positioning, audience, categories, homepage direction, naming status, and locked decisions with Business Strategy v1.2 and the Phase Development Reference v1.1. Repaired the corrupted Section 36. Added Section 42, Visual Portfolio imagery rules, and Section 43, Tailwind v4 implementation note. The color, typography, logo, UI, motion, and dark-mode rules are unchanged.
- **v1.3 (2026-10-29)** — Gate B spec sync. Repaired the collapsed tables in Sections 13, 15, 19, 32.1 and 34. Updated the technology list in Section 7 (Sanity deferred, Vercel hosting, Motion). Added computed contrast results (Section 16.1), contrast-safe `primary-text` and `gold-text` tokens, a lighter `muted`, a darker `muted-foreground`, an `input` border token, accessible `secondary-foreground`, `destructive` and `success` values, and the shadcn token mapping (Section 32.1). The brand gold token is renamed `gold`; shadcn `accent` is now the neutral hover surface. Added type, spacing, radius, shadow, motion and container scales (Sections 19.1, 25.1, 34, 35). Buttons use the medium radius, not a pill. Made the sample copy solo-inclusive.
- **v1.5 (2026-10-30)** — Homepage redesign (ADR-0024): new Section 23 order, fluid display and heading sizes, body 20px. Portfolio leaves the featured categories.
- **v1.4 (2026-10-30)** — Fonts changed: Cinzel display, Cormorant Garamond copy, Inter UI, Noto Serif Sinhala fallback (ADR-0023). Updated Sections 18 (note), 19, 23, 33, 39 and 41.

Use this document before:

- final brand naming and logo work
- Figma design-system updates
- Tailwind v4 theme setup in `app/globals.css`
- building the reusable component library
- creating imagery, packaging, and social templates

## 1. Brand Vision

B&V is not a normal ecommerce website. It is a **modern romantic lifestyle ecommerce brand** focused on:

- women's fashion
- men's fashion
- jewelry and accessories
- gifts and personalized products
- couple collections
- custom orders
- love websites and digital romantic experiences
- the Visual Portfolio & Collaboration Hub (B&V as models and creative collaborators)
- future lifestyle collections

The brand should feel emotional, personal, premium, and story-driven. The couple story of Buwi and Vila is the emotional engine and the main differentiator. It must never make a solo shopper feel they need to be in a couple to buy.

## 2. Brand Positioning

### Current Positioning Statement

A modern romantic lifestyle brand creating fashion, jewelry, gifts, custom pieces, meaningful digital experiences, and romantic visual content for individuals, couples, brands, and people celebrating beautiful moments.

### Brand Promise

Style for you. Gifts for them. Moments for two.

### Brand Category

**Modern Romantic Lifestyle Ecommerce Brand.**

Not only a clothing store, jewelry shop, gift shop, event website service, wedding brand, or photography business. B&V combines these into one emotional lifestyle universe. In the Visual Portfolio, Buwi and Vila appear as models and lifestyle creators, never as photographers.

## 3. Brand Personality

The brand should feel modern, romantic, premium, soft-luxury, cinematic, elegant, warm, authentic, minimal, editorial, lifestyle-focused, Pinterest-inspired, Korean-inspired, fashion-forward, and emotionally memorable.

The brand should avoid feeling childish, cheap, loud, overly red or Valentine-themed, wedding-only, overly feminine, overly corporate, dark and cold, generic, cartoonish, template-like, or celebrity-like.

## 4. Emotional Experience

When people visit the website, open a package, see the logo, or view social content, the desired feeling is: _“Beautiful, calm, premium, romantic, and genuine.”_

People should feel loved, inspired, emotionally connected, calm, stylish, confident, and gift-ready, whether they are shopping for themselves, for someone special, or as a couple. The site should never feel like a noisy shopping experience.

## 5. Target Audience

Approximate age range: 18–40. Primary market: Sri Lanka first, with future international readiness.

| Segment                     | What they want                                                   |
| --------------------------- | ---------------------------------------------------------------- |
| Women fashion customers     | Soft, trendy, premium everyday pieces                            |
| Men fashion customers       | Clean, minimal, confident outfits                                |
| Jewelry customers           | Rings, necklaces, earrings, bracelets, self-love and gift pieces |
| Gift buyers                 | Meaningful gifts without confusion                               |
| Couples                     | Matching or coordinated pieces, couple jewelry, memory products  |
| Custom order customers      | Something personal and unique                                    |
| Love website customers      | Romantic digital experiences for events and milestones           |
| Brands and event organizers | Models and creators for campaigns, shoots, and events            |

The design must appeal equally to women and men. It can be soft and romantic, but must not become so feminine that male customers feel excluded.

## 6. Business Categories Supported by the Design

The design system must support all of these without feeling inconsistent.

### 6.1 Women's Fashion

Dresses, tops and blouses, co-ords, skirts, pants, loungewear, knitwear, date-night outfits, soft and minimal-luxury pieces, accessories.

### 6.2 Men's Fashion

T-shirts, shirts, polos, knitwear, oversized fits, minimal essentials, hoodies and jackets, tailored pieces, accessories.

### 6.3 Jewelry & Accessories

Rings, promise rings, earrings, necklaces, pendants, bracelets, anklets, engraved and initial jewelry, birthstone jewelry, lockets, couple jewelry, jewelry boxes.

### 6.4 Gifts & Personalized Products

Gift boxes, jewelry gift boxes, self-care gifts, candles, mugs, frames, scrapbooks, love-letter bottles, care packages, date-night kits.

### 6.5 Couple Collections

Matching and coordinated outfits, couple hoodies and tees, date-night sets, couple jewelry, couple boxes, limited couple drops.

### 6.6 Custom Orders

Custom fashion, custom jewelry, custom gift boxes, embroidery, printed pieces, engraving, personalized notes.

### 6.7 Love Websites

Our Story sites, proposal pages, anniversary countdowns, digital scrapbooks, wedding RSVP sites, birthday surprise sites, memory timelines, guestbook pages.

### 6.8 Visual Portfolio & Collaboration Hub

Shoot collections grouped by project, filterable by Couple, Buwi, or Vila; collaboration inquiries; creative consultation requests; event invitations.

## 7. Technology Context

The platform direction is a custom ecommerce web application, planned around a modern stack including:

- Next.js
- TypeScript
- Tailwind CSS v4
- Motion (the `framer-motion` package)
- Prisma
- PostgreSQL
- Zod
- Auth.js (admin only in Phase 1)
- Cloudinary
- Vercel with managed PostgreSQL (ADR-0011)
- PayHere and KOKO (Phase 2, D-17)
- Sanity (Phase 2, D-16)

Local development uses a native PostgreSQL 16 install (ADR-0010).

The engineering philosophy is SEO-first, performance-first, mobile-first, content-driven commerce with premium user experience and future AI readiness. This design document should therefore support:

- reusable Tailwind tokens
- global theme implementation
- design system consistency
- future scalability
- performance-friendly UI
- SEO-friendly content structure
- mobile-first visual design

## 8. Brand Name Status

**B&V** is the working public brand name, derived from Buwi & Vila, and is used in the prototype, documents, and code. The final name and logo may still change. The codebase must keep the brand name, logo paths, tagline, social links, and contact channels in central configuration so a rename does not require editing components.

## 9. Naming Rules

When choosing the final name, it should follow these rules.

### 9.1 The Name Should Be

- premium
- memorable
- romantic
- modern
- elegant
- easy to pronounce
- easy to spell
- logo-friendly
- social-media friendly
- emotionally meaningful
- flexible for future expansion
- suitable for fashion, gifts, jewelry, and digital experiences

### 9.2 The Name Should Avoid

- generic ecommerce words
- childish couple words
- overly obvious romance words
- wedding-only naming
- Valentine-only naming
- overly long names
- confusing spellings
- hard-to-pronounce invented words
- names that sound cheap
- names that sound like a local gift shop only

Avoid names like:

- Love Store
- Couple Shop
- Gift House
- Romantic Gifts
- Matching Clothes
- Fashion Hub
- Couple Closet
- Valentine World

These sound too generic or too narrow.

### 9.3 Preferred Naming Styles

The best naming styles for this brand are:

- elegant one-word names
- premium two-word names
- soft luxury names
- editorial fashion names
- romantic but mature names
- names that can form a beautiful monogram
- names with boutique/lifestyle energy
- names with subtle couple meaning

### 9.4 Monogram Preference

Names that create beautiful initials are preferred. Good monogram possibilities:

- B&V
- BV
- AV
- EV
- LV
- MV
- SV
- V
- A

The monogram should work on:

- website favicon
- packaging stickers
- clothing tags
- jewelry boxes
- product labels
- app icon
- social media profile image

### 9.5 Naming Evaluation Criteria

Every shortlisted name should be scored based on:

| Criteria Meaning                                               |
| -------------------------------------------------------------- |
| Memorability Is it easy to remember?                           |
| Premium Feel Does it sound elegant and valuable?               |
| Romance Does it emotionally fit the couple/love direction?     |
| Scalability Can it grow beyond one product category?           |
| Pronunciation Can people say it easily?                        |
| Logo Potential Can it become a beautiful wordmark or monogram? |
| Social Potential Would it look good on Instagram/TikTok?       |
| Domain Potential Is a good domain likely possible?             |
| International Feel Can it work outside Sri Lanka too?          |

## 10. Logo Status

The final logo is not yet designed. The current direction is locked only at the concept level.

## 11. Logo Direction Rules

The logo should be:

- elegant
- minimal
- premium
- romantic
- timeless
- fashion-oriented
- readable
- scalable
- suitable for web, packaging, clothing tags, and social media

### 11.1 Primary Logo Direction

The primary logo should likely be a refined wordmark. It should use an elegant serif mood inspired by the selected display font direction. The wordmark should feel suitable for:

- ecommerce website header
- luxury packaging
- jewelry box
- clothing label
- gift card
- social media
- business card
- invoice/receipt branding

### 11.2 Secondary Logo Direction

The secondary logo should be a monogram based on the final brand initials. If the final name supports it, a B&V or BV mark may be used. The monogram should work for:

- favicon
- product tag
- package seal
- sticker
- mobile app icon
- loading screen
- watermark
- jewelry/gift mark

### 11.3 Logo Should Avoid

- cartoon couple icons
- large obvious hearts
- generic ring icons
- wedding crest styles
- overly decorative script fonts
- complex illustrations
- clipart-style couple symbols
- logo marks that only fit wedding businesses
- overly feminine symbols
- childish romance icons

### 11.4 Subtle Logo Elements Allowed

Small subtle elements can be explored later, such as:

- refined ampersand
- tiny heart detail
- soft floral detail
- lavender-inspired mark
- elegant letter connection
- minimal sparkle/star
- delicate line flourish

These should be used carefully and not dominate the logo.

## 12. Color Direction

The final color direction is: Lavender Luxury Romance This palette keeps the softness and romance of blush and ivory, but makes lavender the signature identity color. The goal is to create a brand that feels:

- romantic but not cliché
- premium but not cold
- soft but not childish
- modern but not trendy-only
- elegant enough for jewelry
- warm enough for gifts
- fashionable enough for clothing
- emotional enough for couple experiences

## 13. Final Color Palette v1.0

| Role                 | Color Name         | Hex     |
| -------------------- | ------------------ | ------- |
| Primary Background   | Warm Ivory         | #FAF7F2 |
| Secondary Background | Soft Blush         | #F3D8D6 |
| Primary Brand Color  | Signature Lavender | #C8B6E2 |
| Romantic Accent      | Dusty Rose         | #C98F94 |
| Luxury Accent        | Champagne Gold     | #C6A15B |
| Primary Text         | Soft Charcoal      | #1C1B1A |
| Border / Divider     | Warm Taupe         | #D8C8BD |

These are brand colors. Text and UI use the semantic tokens in Section 32.1, which add contrast-safe variants where a brand color is too light for text.

## 14. Color Roles

### 14.1 Warm Ivory — #FAF7F2

Role: Primary Background Used for:

- page backgrounds
- main layout base
- product sections
- editorial layouts
- checkout background
- content sections

Feeling:

- soft
- calm
- premium
- clean
- warm
- elegant

Warm Ivory should be the dominant website background. It prevents the website from feeling too white, cold, or generic.

### 14.2 Soft Blush — #F3D8D6

Role: Secondary Background Used for:

- romantic content blocks
- featured sections
- gift sections
- soft cards
- testimonial backgrounds
- story sections
- newsletter areas

Feeling:

- romantic
- warm
- gentle
- emotional
- soft

Soft Blush should support the visual emotion but should not overpower the Signature Lavender.

### 14.3 Signature Lavender — #C8B6E2

Role: Primary Brand Color Used for:

- brand identity
- hero accents
- primary buttons where accessible
- important highlights
- active states
- packaging accents
- logo exploration
- social templates
- icon highlights
- section gradients
- feature cards
- focus rings

Feeling:

- unique
- calm
- romantic
- premium
- modern
- Korean-inspired
- Pinterest-friendly
- feminine but balanced

This is the color people should begin to associate with the brand.

### 14.4 Dusty Rose — #C98F94

Role: Romantic Accent Used for:

- small badges
- hover accents
- campaign details
- icons
- labels
- love/gift related highlights
- product tags
- emotional microcopy areas

Feeling:

- warm
- romantic
- mature
- soft
- affectionate

Dusty Rose adds emotional warmth and prevents the palette from becoming too cool or lavender-only.

### 14.5 Champagne Gold — #C6A15B

Role: Luxury Accent Used for:

- premium labels
- jewelry details
- limited collection badges
- special dividers
- packaging foil inspiration
- luxury icons
- subtle highlights

Feeling:

- premium
- elegant
- jewelry-friendly
- celebratory
- gift-worthy

Champagne Gold should be used sparingly. It is a luxury detail, not a main interface color.

### 14.6 Soft Charcoal — #1C1B1A

Role: Primary Text Used for:

- main text
- headings where needed
- navigation
- product names
- prices
- form labels
- footer text
- checkout content

Feeling:

- readable
- elegant
- strong
- premium
- less harsh than black

Soft Charcoal is preferred over pure black because pure black may feel too harsh against the soft romantic palette.

### 14.7 Warm Taupe — #D8C8BD

Role: Border / Divider Used for:

- borders
- dividers
- form fields
- card outlines
- muted UI elements
- subtle separators
- disabled states

Feeling:

- warm
- structured
- soft
- premium
- non-intrusive

Warm Taupe gives structure without introducing cold grey tones.

## 15. Color Balance Rule

The palette should approximately follow this visual balance:

| Usage | Purpose                                |
| ----- | -------------------------------------- |
| 60%   | Warm Ivory and light backgrounds       |
| 20%   | Soft Blush and soft surfaces           |
| 10%   | Signature Lavender brand moments       |
| 5%    | Dusty Rose romantic accents            |
| 3%    | Champagne Gold luxury details          |
| 2%    | Strong contrast and structural details |

This prevents the website from becoming too purple, too pink, or too decorative. The overall interface should remain light, breathable, and premium.

## 16. Accessibility Note

Signature Lavender is the main brand color, but it may not always provide enough contrast for all text/ button combinations. Therefore:

- do not force exact Signature Lavender for every CTA
- use darker accessible lavender variations when needed
- use Soft Charcoal text on light lavender backgrounds
- use white or ivory text only when contrast is verified
- separate brand colors from UI state colors

Brand identity and UI accessibility should work together.

### 16.1 Computed Contrast (v1.3)

WCAG 2.x contrast ratios, computed from the token values in Section 32.1 (2026-10-29). Body text needs at least 4.5:1; large text, input borders and focus rings need at least 3:1. Every pair below passes.

| Theme | Pair (foreground / background)       | Ratio | Minimum |
| ----- | ------------------------------------ | ----- | ------- |
| Light | foreground / background              | 16.09 | 4.5     |
| Light | foreground / surface                 | 12.78 | 4.5     |
| Light | primary-foreground / primary         | 9.21  | 4.5     |
| Light | primary-foreground / primary-hover   | 11.08 | 4.5     |
| Light | primary-text / background            | 6.03  | 4.5     |
| Light | primary-text / surface               | 4.79  | 4.5     |
| Light | secondary-foreground / secondary     | 6.42  | 4.5     |
| Light | gold-foreground / gold               | 7.08  | 4.5     |
| Light | gold-text / background               | 5.81  | 4.5     |
| Light | gold-text / surface                  | 4.61  | 4.5     |
| Light | accent-foreground / accent           | 14.97 | 4.5     |
| Light | muted-foreground / background        | 7.05  | 4.5     |
| Light | muted-foreground / surface           | 5.60  | 4.5     |
| Light | muted-foreground / muted             | 6.16  | 4.5     |
| Light | destructive-foreground / destructive | 6.93  | 4.5     |
| Light | destructive / background             | 6.49  | 4.5     |
| Light | success-foreground / success         | 6.86  | 4.5     |
| Light | success / surface                    | 5.10  | 4.5     |
| Light | input / background                   | 3.68  | 3       |
| Light | input / card                         | 3.93  | 3       |
| Light | ring / background                    | 6.03  | 3       |
| Dark  | foreground / background              | 16.42 | 4.5     |
| Dark  | foreground / surface-elevated        | 13.06 | 4.5     |
| Dark  | primary-foreground / primary         | 9.86  | 4.5     |
| Dark  | primary-text / background            | 9.86  | 4.5     |
| Dark  | primary-text / surface               | 8.85  | 4.5     |
| Dark  | secondary-foreground / secondary     | 5.81  | 4.5     |
| Dark  | gold-foreground / gold               | 8.99  | 4.5     |
| Dark  | gold-text / surface                  | 8.07  | 4.5     |
| Dark  | accent-foreground / accent           | 13.06 | 4.5     |
| Dark  | muted-foreground / muted             | 6.98  | 4.5     |
| Dark  | muted-foreground / surface           | 7.49  | 4.5     |
| Dark  | destructive-foreground / destructive | 5.88  | 4.5     |
| Dark  | success-foreground / success         | 8.61  | 4.5     |
| Dark  | input / muted                        | 3.54  | 3       |
| Dark  | ring / background                    | 9.86  | 3       |

Pairs that failed in v1.2 and were changed: Signature Lavender as text on ivory (1.75:1), Champagne Gold as text on ivory (2.27:1), white on Dusty Rose (2.68:1), `#6F625B` muted text on blush (4.37:1), white on the old destructive `#C75D6A` (4.04:1), and Moon Ivory on dark Muted Rose (2.83:1). `border` (#D8C8BD, 1.52:1 on ivory) stays decorative; form fields use `input`.

## 17. Typography Direction

The typography system is locked as:

### Display Font

**Playfair Display**

### UI / Body Font

**Inter**

This pairing balances emotional luxury with modern ecommerce usability.

## 18. Typography Roles

> **v1.4 (2026-10-30):** Display font is now **Cinzel**, copy is **Cormorant Garamond**, Inter remains the UI font, and **Noto Serif Sinhala** is the Sinhala fallback in every stack (ADR-0023). Sections 18.1 and 20 describe the earlier Playfair choice; where they conflict, Section 19 and this note win.

### 18.1 Playfair Display

Used for emotional and brand-led text. Best for:

- hero headings
- collection titles
- campaign headlines
- story sections
- about page
- quotes
- editorial blocks
- premium landing pages

Feeling:

- luxury
- romance
- fashion magazine
- editorial
- elegant
- premium
- storytelling

### 18.2 Inter

Used for functional UI and readable content. Best for:

- navigation
- buttons
- product names
- product descriptions
- prices
- forms
- checkout
- account pages
- admin dashboard
- body copy
- blog content
- mobile UI

Feeling:

- modern
- clean
- readable
- professional
- ecommerce-friendly
- accessible

## 19. Typography Hierarchy

| Element          | Font                                 | Suggested Style       |
| ---------------- | ------------------------------------ | --------------------- |
| Logo / Wordmark  | Custom serif inspired by Cinzel mood | Custom                |
| Hero Heading     | Cinzel                               | 600–700               |
| Section Heading  | Cinzel                               | 600                   |
| Campaign Heading | Cinzel                               | 600 / optional italic |
| Story Quote      | Cormorant Garamond                   | Italic                |
| Product Name     | Inter                                | 500–600               |
| Body Text        | Cormorant Garamond                   | 400                   |
| Navigation       | Inter                                | 500                   |
| Button Text      | Inter                                | 600                   |
| Price Text       | Inter                                | 600–700               |
| Form Label       | Inter                                | 500                   |
| Small Text       | Inter                                | 400–500               |
| Admin UI         | Inter                                | 400–600               |

### 19.1 Type Scale (v1.3)

Sizes are mobile → desktop (from the `md` breakpoint). Use `rem` in code; px is shown for reading.

| Token   | Font      | Size (px) | Line height | Weight | Use                          |
| ------- | --------- | --------- | ----------- | ------ | ---------------------------- |
| display | Cinzel    | 40 → 80   | 1.1         | 600    | Hero headline                |
| h1      | Cinzel    | 32 → 52   | 1.15        | 600    | Page title (one per page)    |
| h2      | Cinzel    | 26 → 38   | 1.2         | 600    | Section heading              |
| h3      | Cinzel    | 22        | 1.25        | 600    | Sub-section, featured card   |
| h4      | Inter     | 18 → 20   | 1.35        | 600    | Card title, product name     |
| h5      | Inter     | 16        | 1.4         | 600    | Group label                  |
| h6      | Inter     | 14        | 1.4         | 600    | Eyebrow (uppercase, tracked) |
| body-lg | Cormorant | 22        | 1.6         | 400    | Intro paragraphs             |
| body    | Cormorant | 20        | 1.6         | 400    | Default text                 |
| small   | Inter     | 14        | 1.5         | 400    | Meta, helper text            |
| caption | Inter     | 12        | 1.4         | 500    | Badges, legal                |

Body text never goes below 16px on mobile. Prices use `body` or `h4` at weight 600 with tabular numbers.

## 20. Typography Rules

### 20.1 Use Only Two Core Fonts

The brand should mainly use:

- Playfair Display
- Inter

Avoid adding many decorative fonts.

### 20.2 Use Display Font Sparingly

Playfair Display should create emotional impact. Do not use it for:

- long product descriptions
- cart details
- checkout instructions
- form-heavy sections
- admin dashboard
- small mobile labels

### 20.3 Use Inter for Usability

Inter should handle all functional reading and UI interactions. This keeps the ecommerce experience clear and easy to use.

### 20.4 Avoid Handwritten Logo Fonts

Handwritten or script fonts may look romantic but often fail in:

- mobile headers
- packaging
- clothing labels
- favicons
- product tags

A subtle script accent can be explored for campaigns later, but not as the primary brand typography.

## 21. Visual Style Direction

The visual identity should be: Cinematic Lavender Luxury The website should feel like:

- premium ecommerce
- fashion editorial
- romantic lifestyle brand
- couple-led story world
- soft Pinterest mood board
- Korean boutique aesthetic

It should not feel like:

- Amazon
- Daraz
- random Shopify template
- wedding invitation website
- Valentine promotion page
- basic gift shop
- childish couple brand

## 22. Website Design Direction

The website should include:

- large cinematic hero section
- emotional brand storytelling
- soft lavender and ivory atmosphere
- product-focused sections
- editorial collection blocks
- couple lifestyle imagery
- limited drop highlights
- personalized gift flows
- custom order entry points
- social media integration
- premium packaging visuals
- clean mobile-first navigation

The website should be an experience, not just a product catalog.

## 23. Homepage Direction

Approved homepage order (v1.5, ADR-0024; supersedes the Phase Development Reference v1.1 list):

1. Announcement bar (trust message: payment, WhatsApp confirmation, delivery)
2. Navbar (condenses on scroll)
3. Hero — full height, copy over the image — "Style for you. Gifts for them. Moments for two."
4. Trust strip: cash on delivery or bank transfer, every order confirmed on WhatsApp, delivered across Sri Lanka
5. Featured categories: Women, Men, Jewelry, Gifts, Couples, Custom
6. New In, with Limited Drop pieces badged in gold
7. B&V story (editorial split; real shoot replaces the placeholder)
8. Collections rail with tabs: Fashion Edit, Jewelry Highlight, Couple Collection
9. Made-for-you bento: Custom Orders (large), Love Websites, Gift Boxes
10. Coming soon strip: Gift Box Builder, Visual Portfolio
11. Social gallery (hidden until real handles exist)
12. Testimonials / Memories (real content only)
13. Newsletter
14. Footer

Hero imagery should mix solo fashion, jewelry close-ups, gift packaging, and a couple moment. It must not depend on one couple photo.

Visual mood: Warm Ivory base, soft lavender identity moments, blush sections, Champagne Gold premium details, Cinzel headings, Cormorant Garamond copy, Inter UI text, spacious layout, gentle motion.

## 24. UI Component Style

### 24.1 Buttons

Primary buttons:

- use semantic primary
- currently Signature Lavender or an accessible lavender variant
- medium radius (`radius-md`, 10px), not a pill
- Inter Semibold
- soft hover transition
- clear focus state

Secondary buttons:

- ivory or transparent background
- taupe/lavender border
- charcoal or primary text
- gentle hover fill

Luxury buttons:

- champagne gold accent only for special premium sections
- use sparingly

### 24.2 Cards

Cards should use:

- soft ivory or blush surfaces
- warm taupe border
- subtle shadow
- rounded corners
- good spacing
- soft hover animation

### 24.3 Forms

Forms should use:

- Warm Ivory or white-like backgrounds
- Warm Taupe borders
- Soft Charcoal text
- Lavender focus ring
- Inter font
- clear labels
- gentle validation messages

### 24.4 Badges

Badges can use:

- Dusty Rose for romantic labels
- Champagne Gold for premium/limited tags
- Lavender for brand-related labels

Examples:

- Limited Drop
- Custom Made
- Couple Favorite
- Gift Ready
- New Arrival
- Premium Box

### 24.5 Icons

Use thin-line icons. Recommended icon style:

- Lucide React
- outline-based
- soft rounded
- minimal
- elegant
- consistent stroke width

Avoid heavy filled icons or cartoon icons.

## 25. Animation Style

Animations should be subtle and premium. Use Motion (the `framer-motion` package) for:

- gentle fade-ins
- soft slide-ups
- hero transitions
- product hover motion
- section reveal
- image hover scale
- modal transitions
- mobile menu transitions

Avoid:

- bouncy animations
- excessive parallax
- fast chaotic movement
- childish effects
- too many animated elements at once

Animation should make the brand feel cinematic and polished, not distracting.

### 25.1 Motion Scale (v1.3)

| Token         | Value                      | Use                               |
| ------------- | -------------------------- | --------------------------------- |
| duration-fast | 150ms                      | Hover, focus, small state changes |
| duration-base | 250ms                      | Drawers, dropdowns, accordions    |
| duration-slow | 400ms                      | Section reveals, hero transitions |
| ease-standard | cubic-bezier(0.2, 0, 0, 1) | Default easing                    |
| ease-exit     | cubic-bezier(0.4, 0, 1, 1) | Elements leaving the screen       |
| hover scale   | 1.03 maximum               | Product and image hover           |

When `prefers-reduced-motion: reduce` is set, remove movement (slides, scale, parallax) and keep only short opacity fades.

## 26. Imagery Direction

Photography should feel:

- soft
- warm
- romantic
- premium
- lifestyle-focused
- natural
- editorial
- couple-led

Use imagery such as:

- couple lifestyle photos
- cream café shots
- lavender flowers
- jewelry closeups
- gift packaging
- soft indoor lighting
- golden-hour outdoor shots
- fashion lookbook photos
- hands holding products
- behind-the-scenes content
- custom gift preparation
- order packing
- romantic flat-lays

Avoid:

- harsh flash photography
- overly saturated edits
- fake stock couple photos
- dark cold luxury visuals
- neon colors
- random backgrounds
- messy product images
- overly red Valentine scenes

## 27. Product Photography Rules

Product photos should use:

- clean warm backgrounds
- soft shadows
- consistent lighting
- cream or ivory surfaces
- lavender/rose styling elements
- subtle gold accessories
- premium composition
- lifestyle context when possible

Fashion photos should include:

- couple outfits
- mirror shots
- café shots
- streetwear moments
- date-night styling
- soft editorial poses
- natural expressions

Jewelry photos should include:

- macro closeups
- soft fabric backgrounds
- champagne/gold styling
- romantic hand shots
- gift-box presentation

Gift photos should include:

- package opening
- handwritten notes
- ribbons/stickers
- lavender tissue paper
- soft blush/ivory backgrounds

## 28. Packaging Direction

Packaging should feel giftable and content-worthy. Recommended packaging elements:

- Warm Ivory box or base
- Signature Lavender ribbon or tissue paper
- Champagne Gold foil/sticker details
- Soft Charcoal text
- Warm Taupe border/details
- Dusty Rose small romantic accent
- thank-you note
- custom message card
- romantic sticker
- premium wrapping texture

Packaging should be designed for social media sharing because unboxing content is a major part of the brand strategy.

## 29. Social Media Direction

Social content should visually match the website and packaging. Recommended content style:

- lavender tones
- ivory backgrounds
- soft blush details
- couple lifestyle
- behind-the-scenes
- order packing
- gift reveals
- outfit transitions
- cinematic date videos
- custom product creation
- emotional captions
- warm lighting
- romantic but not cheesy

The brand should become recognizable even before the logo appears.

## 30. Website Tone of Voice

The voice should be:

- warm
- romantic
- simple
- premium
- emotionally intelligent
- modern
- not too cheesy
- not too salesy

Examples of CTA wording:

- Shop the Drop
- Build Your Gift Box
- Work With Us
- Start a Collaboration
- Create a Custom Gift
- Explore Our Story
- Send a Love Note
- Make It Personal
- Discover the Collection
- Start Your Memory Page
- Gift Something Meaningful

Avoid:

- Buy Now!!!
- Hot Deals
- Cheap Prices
- Valentine Explosion Sale
- Best Couple Store
- Hurry Lovebirds
- Hire Us / Book the Celebrities (portfolio pages)

## 31. Tailwind Global Implementation Strategy

The Tailwind implementation should use semantic design tokens, not literal color names. This means the code should not depend on color names like:

- lavender
- blush
- gold
- rose

Instead, the code should use role-based names like:

- background
- foreground
- primary
- secondary
- accent
- surface
- border
- muted

This allows the whole theme to change later by changing token values in one place.

## 32. Semantic Color Token Strategy

### 32.1 Recommended Tokens

Complete token set for both themes (v1.3). Contrast results are in Section 16.1.

| Token                  | Light   | Dark    | Role                                                     |
| ---------------------- | ------- | ------- | -------------------------------------------------------- |
| background             | #FAF7F2 | #17121D | Main page/app background                                 |
| foreground             | #1C1B1A | #F7F1EA | Main text                                                |
| surface                | #F3D8D6 | #241B2E | Soft cards and sections                                  |
| surface-elevated       | #FFFFFF | #2F243A | Modals, dropdowns, elevated cards                        |
| primary                | #C8B6E2 | #C8B6E2 | Main brand/action fill                                   |
| primary-hover          | #D8C9F0 | #D8C9F0 | Primary button hover                                     |
| primary-foreground     | #1C1B1A | #17121D | Text on primary                                          |
| primary-text           | #6A5296 | #C8B6E2 | Lavender text and links on page backgrounds              |
| secondary              | #C98F94 | #B9828A | Romantic supporting accent (Dusty Rose / Muted Rose)     |
| secondary-foreground   | #1C1B1A | #17121D | Text on secondary (white and Moon Ivory failed contrast) |
| gold                   | #C6A15B | #D2B16F | Luxury accent fill (called `accent` before v1.3)         |
| gold-foreground        | #1C1B1A | #17121D | Text on gold                                             |
| gold-text              | #7A5C22 | #D2B16F | Gold text on page backgrounds                            |
| accent                 | #F5EEE8 | #2F243A | Neutral hover/selected surface (shadcn `accent`)         |
| accent-foreground      | #1C1B1A | #F7F1EA | Text on accent                                           |
| border                 | #D8C8BD | #4A3A50 | Decorative borders and dividers                          |
| input                  | #8F7D71 | #85738B | Form field borders (3:1)                                 |
| ring                   | #6A5296 | #C8B6E2 | Focus ring                                               |
| muted                  | #EFE7E0 | #2A2133 | Muted UI backgrounds (no longer equal to `border`)       |
| muted-foreground       | #5E524C | #B8AABD | Secondary text                                           |
| destructive            | #983A46 | #D07886 | Errors and destructive actions                           |
| destructive-foreground | #FFFFFF | #17121D | Text on destructive                                      |
| success                | #45614A | #9EB8A0 | Success states                                           |
| success-foreground     | #FFFFFF | #17121D | Text on success                                          |

Rules:

- Never use `primary` or `gold` as text colors on page backgrounds; use `primary-text` and `gold-text`.
- `accent` follows shadcn/ui: a neutral hover surface for menus, list rows and ghost buttons. The luxury gold is always `gold`.

#### shadcn/ui Mapping

shadcn components read these variable names. Map them to the B&V tokens above in `app/globals.css`.

| shadcn variable                         | B&V token                       |
| --------------------------------------- | ------------------------------- |
| `--background`, `--foreground`          | background, foreground          |
| `--card`, `--card-foreground`           | surface-elevated, foreground    |
| `--popover`, `--popover-foreground`     | surface-elevated, foreground    |
| `--primary`, `--primary-foreground`     | primary, primary-foreground     |
| `--secondary`, `--secondary-foreground` | secondary, secondary-foreground |
| `--muted`, `--muted-foreground`         | muted, muted-foreground         |
| `--accent`, `--accent-foreground`       | accent, accent-foreground       |
| `--destructive`                         | destructive                     |
| `--border`, `--input`, `--ring`         | border, input, ring             |

### 32.2 Example CSS Variables

```text
:root {
   --background: #FAF7F2;
   --foreground: #1C1B1A;
   --surface: #F3D8D6;
   --primary: #C8B6E2;
   --primary-foreground: #1C1B1A;
   --secondary: #C98F94;
   --secondary-foreground: #1C1B1A;
   --gold: #C6A15B;
   --gold-foreground: #1C1B1A;
   --accent: #F5EEE8;
   --accent-foreground: #1C1B1A;
   --border: #D8C8BD;
   --muted: #EFE7E0;
   --muted-foreground: #5E524C;
}
/* Abbreviated. The full set for both themes is in Section 41.6. */
```

### 32.3 Example Tailwind Theme Direction

```text
colors: {
   background: "var(--background)",
   foreground: "var(--foreground)",
   surface: "var(--surface)",
   primary: "var(--primary)",
   "primary-foreground": "var(--primary-foreground)",
   secondary: "var(--secondary)",
   "secondary-foreground": "var(--secondary-foreground)",
   accent: "var(--accent)",
   "accent-foreground": "var(--accent-foreground)",
   border: "var(--border)",
   muted: "var(--muted)",
   "muted-foreground": "var(--muted-foreground)",
}
```

### 32.4 Example Component Usage

```text
<section className="bg-background text-foreground">
   ...
</section>
<div className="bg-surface border border-border">
   ...
</div>
<button className="bg-primary text-primary-foreground">
   Shop Now
</button>
<span className="text-muted-foreground">
   Limited romantic collection
</span>
```

The component should not care whether the primary color is lavender, navy, blush, or sage. It should only know that it is using the primary design token.

## 33. Typography Token Strategy

Typography should also be tokenized.

### 33.1 Font Variables

Recommended conceptual direction:

```text
:root {
   --font-display: var(--font-cinzel), var(--font-sinhala), Georgia, serif;
   --font-sans: var(--font-inter), var(--font-sinhala), ui-sans-serif, sans-serif;
   --font-body: var(--font-cormorant-garamond), var(--font-sinhala), Georgia, serif;
}
```

### 33.2 Tailwind Usage

```text
<h1 className="font-display">
   Our Story
</h1>
<p className="font-sans">
   Crafted with love, for you and the people you love.
</p>
```

This allows the fonts to be changed later without rewriting the whole component system.

## 34. Border Radius & Spacing Direction

The UI should feel soft and modern. Recommended general direction:

| Token       | Value  | Usage                                     |
| ----------- | ------ | ----------------------------------------- |
| radius-sm   | 6px    | Inputs, badges, small controls            |
| radius-md   | 10px   | Cards and buttons (buttons are not pills) |
| radius-lg   | 16px   | Feature sections, image blocks, modals    |
| radius-full | 9999px | Pills, tags, avatars, icon buttons        |

Avoid completely sharp corners unless used intentionally for editorial contrast. Spacing should be generous and breathable. The design should not feel cramped.

**Spacing scale.** 4px base (Tailwind's default spacing unit): 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128px.

| Use                             | Mobile | Desktop |
| ------------------------------- | ------ | ------- |
| Page gutter                     | 16px   | 32px    |
| Gap between cards in a grid     | 16px   | 24px    |
| Padding inside cards            | 16px   | 24px    |
| Vertical space between sections | 64px   | 96px    |

**Container.** Content max-width is 1440px, centered, with the page gutter on each side. Long-form text is limited to about 70 characters per line.

## 35. Shadow Direction

Use soft shadows only. Recommended style:

- subtle card shadows
- warm shadow tones if possible
- avoid heavy dark shadows
- avoid harsh ecommerce-box shadows

The site should feel premium and airy.

| Token     | Light theme                      | Use                         |
| --------- | -------------------------------- | --------------------------- |
| shadow-sm | 0 1px 2px rgb(28 27 26 / 0.06)   | Inputs, small cards at rest |
| shadow-md | 0 4px 16px rgb(28 27 26 / 0.08)  | Cards on hover, dropdowns   |
| shadow-lg | 0 12px 40px rgb(28 27 26 / 0.12) | Modals, drawers             |

The shadow color is Soft Charcoal, not black. Shadows barely show in dark mode, so elevation there comes from `surface-elevated` and `border`; keep the same tokens with a black base at higher opacity (0.3, 0.4 and 0.5).

## 36. Dark Mode Status

Dark mode is part of the design system. It must be designed intentionally, not generated by inverting the light theme. Light mode remains the primary brand experience; dark mode is the cinematic evening version of the same Lavender Luxury Romance identity, named **Midnight Lavender Luxury**. Detailed dark-mode tokens, component rules, Figma setup, and CSS variables are in Section 41.

## 37. Figma Design Setup Direction

When setting up Figma, create:

### 37.1 Color Styles

Use semantic names:

- Background
- Foreground
- Surface
- Primary
- Primary Foreground
- Secondary
- Secondary Foreground
- Accent
- Accent Foreground
- Border
- Muted
- Muted Foreground

Do not only name colors as:

- Lavender
- Blush
- Gold

Literal color names can exist in the brand guide, but the reusable design system should use semantic roles.

### 37.2 Typography Styles

Create:

- Display / Hero
- Display / Section
- Display / Quote
- Sans / Body
- Sans / Small
- Sans / Button
- Sans / Product Name
- Sans / Price
- Sans / Form Label

### 37.3 Component Styles

Prepare:

- buttons
- cards
- inputs
- badges
- product cards
- collection cards
- navigation
- footer
- modals
- product gallery
- checkout steps
- admin dashboard cards

## 38. Design Decision Rules Going Forward

Before adding any new design element, ask: 1. Does it feel modern romantic premium? 2. Does it support the lavender luxury identity? 3. Does it work for fashion, gifts, jewelry, and digital experiences? 4. Does it feel scalable beyond the MVP? 5. Is it mobile-friendly? 6. Is it accessible? 7. Can it be implemented through reusable tokens? 8. Does it avoid generic ecommerce styling? 9. Does it support the emotional brand story? 10. Would it look good in social content and packaging? If the answer is no, the design should be reconsidered.

## 39. Final Locked Decisions So Far

| Category                       | Decision                                                                 |
| ------------------------------ | ------------------------------------------------------------------------ |
| Brand name                     | B&V (working name; may change; centralized in config)                    |
| Brand category                 | Modern Romantic Lifestyle Ecommerce Brand                                |
| Brand promise                  | Style for you. Gifts for them. Moments for two.                          |
| Monogram preference            | B&V / BV-style premium mark                                              |
| Logo                           | Not finalized; elegant wordmark + minimal monogram                       |
| Light theme                    | Lavender Luxury Romance                                                  |
| Dark theme                     | Midnight Lavender Luxury                                                 |
| Primary brand color            | Signature Lavender #C8B6E2                                               |
| Background                     | Warm Ivory #FAF7F2                                                       |
| Surface / secondary background | Soft Blush #F3D8D6                                                       |
| Romantic accent                | Dusty Rose #C98F94                                                       |
| Luxury accent                  | Champagne Gold #C6A15B (token `gold`; text uses `gold-text` #7A5C22)     |
| Text                           | Soft Charcoal #1C1B1A                                                    |
| Border                         | Warm Taupe #D8C8BD                                                       |
| Display font                   | Cinzel                                                                   |
| UI font                        | Inter (UI)                                                               |
| Body font                      | Cormorant Garamond (copy); Sinhala fallback Noto Serif Sinhala           |
| Icons                          | Lucide React, thin outline                                               |
| Motion                         | Motion (`framer-motion`), subtle; respect reduced motion (Section 25.1)  |
| Website direction              | Custom Next.js ecommerce brand experience                                |
| UI style                       | Soft, premium, cinematic, minimal, editorial                             |
| Tailwind strategy              | Semantic tokens via Tailwind v4 CSS-first theme, not literal color names |
| Figma strategy                 | Semantic variables with Light and Dark modes + reusable components       |
| MVP design priority            | Mobile-first, premium ecommerce, emotional storytelling                  |

## 40. Summary

The design direction is now clear. We are building a soft luxury, lavender-led, romantic lifestyle brand that can support women's and men's fashion, jewelry, gifts, couple collections, custom products, love websites, the Visual Portfolio, and future digital experiences. The final name and logo will be selected later, but they must follow the rules defined in this document. The confirmed visual foundation is:

- Lavender Luxury Romance color system
- Cinzel for display typography, Cormorant Garamond for copy
- Inter for clean ecommerce UI
- elegant wordmark + monogram logo direction
- premium, soft, cinematic visual style
- semantic Tailwind tokens for scalable theme implementation

This document is the current source of truth for brand and design decisions.

## 41. Dark Mode Theme Design Decisions

Dark mode is now included in the design system as a parallel theme. It must preserve the same soft luxury, romantic, lavender-led identity defined in the light mode, while creating a more cinematic evening experience.

#### Core Decision

Light mode remains the primary brand experience. Dark mode becomes the cinematic evening version of the same brand. It should feel like midnight lavender, candlelight, premium packaging, date-night atmosphere, and editorial fashion - not gaming purple, neon romance, or harsh black luxury.

#### Dark Theme Name

Midnight Lavender Luxury The dark theme should still feel modern, romantic, premium, cinematic, minimal, and emotionally warm. It should support ecommerce, fashion, jewelry, gifts, custom orders, and love website services without becoming visually heavy.

### 41.1 Dark Theme Usage Balance

| Usage | Color Role              | Design Meaning          | Rule                                    |
| ----- | ----------------------- | ----------------------- | --------------------------------------- |
| 55%   | Midnight Aubergine      | Primary dark atmosphere | Most page backgrounds                   |
| 25%   | Deep Plum / Velvet Plum | Layered UI surfaces     | Cards, drawers, sections, dropdowns     |
| 10%   | Signature Lavender      | Brand recognition       | Buttons, active states, highlights      |
| 5%    | Muted Rose              | Romantic warmth         | Badges, micro accents, emotional states |
| 3%    | Candlelight Gold        | Luxury detail           | Premium badges, jewelry highlights      |
| 2%    | Moon Ivory / details    | Readable contrast       | Text and important details              |

The dark interface should be mostly deep and calm, with lavender moments. Do not make the entire UI purple.

### 41.2 Final Dark Mode Color Tokens

| Semantic Token       | Dark Color Name    | Hex     | Purpose                                              |
| -------------------- | ------------------ | ------- | ---------------------------------------------------- |
| background           | Midnight Aubergine | #17121D | Main app/page background                             |
| foreground           | Moon Ivory         | #F7F1EA | Main readable text                                   |
| surface              | Deep Plum Surface  | #241B2E | Cards, sections, navbar, drawers                     |
| surface-elevated     | Velvet Plum        | #2F243A | Modals, dropdowns, elevated product cards            |
| primary              | Signature Lavender | #C8B6E2 | Main brand/action color                              |
| primary-hover        | Soft Lilac Glow    | #D8C9F0 | Button hover and active emphasis                     |
| primary-foreground   | Midnight Aubergine | #17121D | Text on lavender buttons                             |
| secondary            | Muted Rose         | #B9828A | Romantic supporting accent                           |
| secondary-foreground | Midnight Aubergine | #17121D | Text on secondary (v1.3; Moon Ivory failed contrast) |
| gold                 | Candlelight Gold   | #D2B16F | Luxury highlights and premium details                |
| gold-foreground      | Midnight Aubergine | #17121D | Text on gold accents                                 |
| border               | Smoky Taupe Plum   | #4A3A50 | Borders and dividers                                 |
| muted                | Deep Muted Plum    | #2A2133 | Muted UI backgrounds                                 |
| muted-foreground     | Lavender Taupe     | #B8AABD | Secondary text                                       |
| destructive          | Soft Wine Rose     | #D07886 | Errors and destructive actions                       |
| success              | Muted Sage         | #9EB8A0 | Success states                                       |

### 41.3 Why These Dark Mode Colors Work

#### Midnight Aubergine - #17121D

This replaces pure black. It keeps the interface deep and cinematic while preserving a romantic lavender undertone. Pure black is avoided because it can feel harsh, cheap, and tiring.

#### Deep Plum Surface - #241B2E

Used for cards, sections, navbar, drawers, and footer areas. It creates layering without introducing cold grey.

#### Signature Lavender - #C8B6E2

The primary brand color stays the same in both light and dark modes. This keeps the brand recognizable across themes.

#### Moon Ivory - #F7F1EA

Used instead of pure white. It keeps text warm, soft, and premium on dark backgrounds.

#### Candlelight Gold - #D2B16F

A slightly brighter gold is used in dark mode because dark backgrounds absorb warmth. It preserves the jewelry, packaging, and premium collection feeling.

#### Smoky Taupe Plum - #4A3A50

Borders must be visible but not harsh. This keeps the UI structured while staying inside the lavender luxury identity.

### 41.4 Component-Level Dark Mode Rules

#### Navbar

Use translucent Deep Plum Surface with blur, a soft border, Moon Ivory text, and Signature Lavender for active link underline or dot.

#### Hero Section

Use dark plum backgrounds, soft lavender gradient glow, warm imagery, Cinzel headings in Moon Ivory, and small Champagne/Candlelight Gold details. Avoid neon purple glows.

#### Product Cards

Use Velvet Plum or Deep Plum Surface, Smoky Taupe Plum borders, Moon Ivory text, lavender hover border, and warm product images. Product photos should not be forced dark.

#### Primary Buttons

Use Signature Lavender background with Midnight Aubergine text. Hover with Soft Lilac Glow.

#### Secondary Buttons

Use transparent background, Smoky Taupe Plum border, Moon Ivory text, and Velvet Plum hover fill.

#### Forms

Use Deep Muted Plum field backgrounds, Smoky Taupe Plum borders, Moon Ivory text, Lavender Taupe placeholders, and Signature Lavender focus rings.

#### Cart Drawer / Modals

Use a dark overlay, Deep Plum drawer background, Velvet Plum elevated panels, Smoky Taupe Plum borders, and lavender primary CTA.

#### Toasts

Use muted dark success/error backgrounds with soft readable foregrounds. Keep success and error states premium, not loud.

### 41.5 Theme Toggle Rules

The theme switcher should be small, elegant, and placed near the navbar utility icons such as search, cart, or account. Use Lucide React sun/moon icons. The toggle should switch instantly, save the user preference, and avoid a full page reload. MVP behavior: support Light and Dark. Later behavior: add System preference if needed.

### 41.6 Tailwind / CSS Variable Implementation

The codebase must continue using semantic tokens, not literal color names. Components should not know whether the current theme is light ivory or midnight plum. Components should only use roles such as background, foreground, surface, primary, border, and muted.

```text
:root {
  --background: #FAF7F2;
  --foreground: #1C1B1A;
  --surface: #F3D8D6;
  --surface-elevated: #FFFFFF;
  --primary: #C8B6E2;
  --primary-hover: #D8C9F0;
  --primary-foreground: #1C1B1A;
  --secondary: #C98F94;
  --primary-text: #6A5296;
  --secondary-foreground: #1C1B1A;
  --gold: #C6A15B;
  --gold-foreground: #1C1B1A;
  --gold-text: #7A5C22;
  --accent: #F5EEE8;
  --accent-foreground: #1C1B1A;
  --border: #D8C8BD;
  --input: #8F7D71;
  --ring: #6A5296;
  --muted: #EFE7E0;
  --muted-foreground: #5E524C;
  --destructive: #983A46;
  --destructive-foreground: #FFFFFF;
  --success: #45614A;
  --success-foreground: #FFFFFF;
}
.dark {
  --background: #17121D;
  --foreground: #F7F1EA;
  --surface: #241B2E;
  --surface-elevated: #2F243A;
  --primary: #C8B6E2;
  --primary-hover: #D8C9F0;
  --primary-foreground: #17121D;
  --secondary: #B9828A;
  --primary-text: #C8B6E2;
  --secondary-foreground: #17121D;
  --gold: #D2B16F;
  --gold-foreground: #17121D;
  --gold-text: #D2B16F;
  --accent: #2F243A;
  --accent-foreground: #F7F1EA;
  --border: #4A3A50;
  --input: #85738B;
  --ring: #C8B6E2;
  --muted: #2A2133;
  --muted-foreground: #B8AABD;
  --destructive: #D07886;
  --destructive-foreground: #17121D;
  --success: #9EB8A0;
  --success-foreground: #17121D;
}
/* shadcn aliases: --card and --popover = --surface-elevated; --card-foreground and --popover-foreground = --foreground (Section 32.1). */
```

### 41.7 Figma Dark Mode Setup

Create one Figma color variable collection named Theme Colors with two modes: Light and Dark. Variables should remain semantic: Background, Foreground, Surface, Surface Elevated, Primary, Primary Hover, Primary Foreground, Primary Text, Secondary, Secondary Foreground, Gold, Gold Foreground, Gold Text, Accent, Accent Foreground, Border, Input, Ring, Muted, Muted Foreground, Destructive, Destructive Foreground, Success, and Success Foreground. Do not create separate random dark colors per component. Every component should use the same semantic variables and switch modes automatically.

### 41.8 Final Dark Mode Decision Summary

| Category           | Decision                 | Notes                                        |
| ------------------ | ------------------------ | -------------------------------------------- |
| Dark Theme Name    | Midnight Lavender Luxury | Cinematic evening version of the brand       |
| Primary Experience | Light Mode               | Light mode remains the hero brand expression |
| Dark Experience    | Dark Mode                | Premium night/date-mode expression           |
| Primary Color      | #C8B6E2                  | Signature Lavender remains consistent        |
| Background         | #17121D                  | Midnight Aubergine, not pure black           |
| Surface            | #241B2E / #2F243A        | Deep plum layering                           |
| Text               | #F7F1EA                  | Moon Ivory, not pure white                   |
| Gold (`gold`)      | #D2B16F                  | Candlelight luxury detail                    |
| Implementation     | Semantic CSS variables   | One component system, two themes             |

## 42. Visual Portfolio Imagery Rules

- The portfolio presents Buwi and Vila as **models, lifestyle creators, and collaborators**. Never use wording or layouts that suggest a photography service.
- Every portfolio shoot must be **real B&V work**. AI-generated images may be used as prototype placeholders only and must never be published as portfolio work.
- Group media by shoot or project. Each shoot has a cover image, title, featured type (Couple, Buwi, or Vila), category tags, media count, short description, and a "View Shoot" call to action.
- Use an editorial masonry layout for photos. Show video cards with a play icon, a duration label, and a type label (Campaign Reel, Behind the Scenes, Product Promo, Cinematic Clip, Outfit Reel, Couple Reel).
- Any text placed over an image needs a gradient or overlay, especially in dark mode. Do not over-dim the photo, but text must always be readable.
- Use the tone rules in Section 30: "Work With Us", "Start a Collaboration", "Book a Creative Consultation", "Invite B&V to Your Event".

## 43. Tailwind v4 Implementation Note

The repository uses Tailwind CSS v4 through `@tailwindcss/postcss`, with theme variables in `app/globals.css` (ADR-0003). Tailwind v4 is configured in CSS, so the `tailwind.config.ts` `colors` example in Section 32.3 describes intent only.

Implement the tokens from Sections 32 and 41.6 as CSS variables on `:root` and `.dark`, then expose them to Tailwind through the v4 theme mechanism in `globals.css` so utilities such as `bg-background`, `text-foreground`, `bg-primary`, and `border-border` exist. Verify the exact v4 syntax against the installed version before implementation.

The contrast-safe lavender and gold text variants are recorded as `primary-text` and `gold-text` (Section 32.1), with computed ratios in Section 16.1. Expose the scales in Sections 19.1, 25.1, 34 and 35 as Tailwind v4 theme variables (font size, radius, shadow, spacing).
