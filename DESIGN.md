---
name: B&V
description: Cinematic Lavender Luxury — a modern romantic lifestyle storefront.
colors:
  warm-ivory: '#faf7f2'
  soft-charcoal: '#1c1b1a'
  soft-blush: '#f3d8d6'
  pure-surface: '#ffffff'
  signature-lavender: '#c8b6e2'
  lavender-glow: '#d8c9f0'
  deep-lavender-text: '#6a5296'
  dusty-rose: '#c98f94'
  champagne-gold: '#c6a15b'
  antique-gold-text: '#7a5c22'
  linen-hover: '#f5eee8'
  warm-taupe: '#d8c8bd'
  taupe-input: '#8f7d71'
  oat-muted: '#efe7e0'
  cocoa-muted-text: '#5e524c'
  garnet: '#983a46'
  sage: '#45614a'
  midnight-plum: '#17121d'
  midnight-surface: '#241b2e'
  midnight-elevated: '#2f243a'
  midnight-border: '#4a3a50'
  moonlit-ivory: '#f7f1ea'
  lavender-soft: '#f1ebf9'
  chrome-from: '#6a5296'
  chrome-to: '#17121d'
typography:
  display:
    fontFamily: 'Cinzel, Noto Serif Sinhala, Georgia, serif'
    fontSize: 'clamp(2.5rem, 7vw, 5rem)'
    fontWeight: 600
    lineHeight: 1.1
  headline:
    fontFamily: 'Cinzel, Noto Serif Sinhala, Georgia, serif'
    fontSize: 'clamp(2rem, 4.5vw, 3.25rem)'
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: 'Cinzel, Noto Serif Sinhala, Georgia, serif'
    fontSize: '1.375rem'
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: 'Cormorant Garamond, Noto Serif Sinhala, Georgia, serif'
    fontSize: '1.25rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: '6px'
  md: '10px'
  lg: '16px'
components:
  button-primary:
    backgroundColor: '{colors.signature-lavender}'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.md}'
    padding: '8px 20px'
    height: '40px'
  button-primary-hover:
    backgroundColor: '{colors.lavender-glow}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.md}'
    padding: '8px 20px'
    height: '40px'
  button-secondary-hover:
    backgroundColor: '{colors.linen-hover}'
  button-luxury:
    backgroundColor: '{colors.champagne-gold}'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.md}'
    padding: '8px 20px'
    height: '40px'
  button-whatsapp:
    backgroundColor: '{colors.sage}'
    textColor: '{colors.pure-surface}'
    rounded: '{rounded.md}'
    padding: '8px 20px'
    height: '40px'
  card:
    backgroundColor: '{colors.pure-surface}'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.md}'
    padding: '24px'
  input:
    backgroundColor: 'transparent'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.sm}'
    padding: '4px 12px'
    height: '44px'
  badge-rose:
    backgroundColor: '{colors.dusty-rose}'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.sm}'
    padding: '2px 8px'
  badge-gold:
    backgroundColor: '{colors.champagne-gold}'
    textColor: '{colors.soft-charcoal}'
    rounded: '{rounded.sm}'
    padding: '2px 8px'
---

# Design System: B&V

Authority: [docs/references/Brand-Identity.md](docs/references/Brand-Identity.md) v1.3. Where this file and Brand-Identity disagree, Brand-Identity wins. Tokens live in `app/globals.css`; motion constants in `src/config/motion.ts`.

## Overview

**Creative North Star: "Cinematic Lavender Luxury"**

A fashion-editorial storefront that feels like a soft mood board brought to life: warm ivory light, lavender identity moments, blush sections and rare champagne-gold details. It is an experience, not a catalog — large cinematic heroes, editorial collection blocks and emotional storytelling, set in spacious, mobile-first layouts.

Premium comes from restraint: few colours on any screen, generous space, engraved Cinzel capitals for headings, literary Cormorant Garamond for copy, quiet Inter for everything functional, and gentle motion that reveals rather than performs. Dark mode, "Midnight Lavender Luxury", keeps the same identity on deep plum surfaces.

It must not feel like Amazon, Daraz, a stock Shopify template, a wedding invitation, a Valentine promotion, a basic gift shop or a childish couple brand.

**Key Characteristics:**

- Warm ivory base with lavender, blush and gold as rationed accents.
- Cinzel headings, Cormorant Garamond copy, Inter for UI.
- Medium-radius soft shapes; never pills, never sharp.
- Quiet, warm-tinted shadows; depth stays soft.
- Slow, eased reveals; nothing bounces.

## Colors

A warm, powdery palette: ivory and charcoal carry the page, lavender carries the brand, rose and gold are spice.

### Primary

- **Signature Lavender** (`signature-lavender`): primary buttons, brand moments, selection. Fill only; never small text on ivory.
- **Lavender Glow** (`lavender-glow`): primary hover.
- **Deep Lavender Text** (`deep-lavender-text`): links and lavender text on light surfaces (contrast-safe), and the focus ring.

### Secondary

- **Dusty Rose** (`dusty-rose`): romantic labels and badges, couple and gift accents.

### Tertiary

- **Champagne Gold** (`champagne-gold`): luxury buttons and limited/premium tags only.
- **Antique Gold Text** (`antique-gold-text`): gold-toned text on light surfaces.

### Neutral

- **Warm Ivory** (`warm-ivory`): page background.
- **Soft Charcoal** (`soft-charcoal`): text, and foreground on every lavender, rose and gold fill.
- **Soft Blush** (`soft-blush`): section bands and soft surfaces.
- **Pure Surface** (`pure-surface`): cards, popovers, elevated panels.
- **Linen** (`linen-hover`): neutral hover surface (shadcn `accent`).
- **Warm Taupe** (`warm-taupe`): borders and dividers. **Taupe Input** (`taupe-input`): input and secondary-button borders.
- **Oat** (`oat-muted`) and **Cocoa** (`cocoa-muted-text`): muted surfaces and secondary text.
- **Garnet** (`garnet`) for errors; **Sage** (`sage`) for success and the WhatsApp action.
- Dark mode: **Midnight Plum** background, **Midnight Surface** / **Midnight Elevated** panels, **Midnight Border**, **Moonlit Ivory** text; lavender stays the brand colour.

### Named Rules

**The Rationed Gold Rule.** Champagne Gold stays under 3% of any screen: the small heart beside section headings and eyebrows, Limited Drop badges, step numbers, the calendar today dot, the ornament divider (`Divider`, one or two per page) and one luxury action per screen. Never as a fill for large areas.

**The Rose-As-Spice Rule.** Dusty Rose appears only on badges (`Badge variant="rose"`) and hover accents, never as a surface.

**The Charcoal-On-Colour Rule.** Text on lavender, rose or gold fills is always Soft Charcoal; lavender or gold text on light surfaces uses the `-text` tokens.

**The Semantic Token Rule.** Use semantic tokens (`bg-primary`, `text-gold-text`), never literal hex or Tailwind palette colours.

## Typography

**Display Font:** Cinzel (with Noto Serif Sinhala, Georgia)
**Body Font:** Cormorant Garamond (with Noto Serif Sinhala, Georgia)
**UI Font:** Inter (with Noto Serif Sinhala, ui-sans-serif)

**Character:** Cinzel's engraved Roman capitals give headings a monumental, couture-label presence; Cormorant Garamond carries story copy with literary warmth; Inter keeps every control, price and form crisp. Cormorant runs small, so body copy sits at 1.125rem.

### Hierarchy

- **Display** (Cinzel 600, 2.25rem mobile, steps up at `md`, 1.1): hero headlines only.
- **Headline** (Cinzel 600, 1.875rem → h2 1.5rem, 1.15–1.2): section titles (`h1`, `h2`).
- **Title** (Cinzel 600 for h3 1.25rem; h4 1.125rem, 1.25–1.35): card and block titles.
- **Body** (Cormorant 400, 1.125rem / body-lg 1.25rem, 1.6): copy; keep lines to about 65–75ch.
- **Label** (Inter 600, 0.875rem, 1.5): buttons, navigation, form labels.
- **Caption** (Inter 500, 0.75rem, 1.4): badges, meta, fine print.

### Named Rules

**The Story-and-Interface Rule.** Cinzel and Cormorant Garamond tell the story (headings, editorial copy, quotes); Inter runs the interface (buttons, inputs, badges, navigation, prices, admin). Headings get slight positive tracking; never set Cinzel in long passages.

## Layout

Mobile-first. The type scale is defined at mobile sizes and components step up at the `md` breakpoint (Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280). Spacing follows the Tailwind 4px scale with generous section padding. Homepage order and section roles are fixed by Brand-Identity §23: a cinematic hero, then editorial category, product and story blocks. Layouts must not overlap or overflow at any width.

## Elevation & Depth

Soft and warm. Shadows are tinted with charcoal at low alpha in light mode and black at higher alpha in dark mode, so depth reads as ambient light, not hard edges. Tonal layering (ivory → blush → white) does most of the work; shadows confirm it.

### Shadow Vocabulary

- **sm** (`0 1px 2px rgb(var(--shadow-color) / var(--shadow-a-sm))`): cards and inputs at rest, luxury button.
- **md** (`0 4px 16px …/ var(--shadow-a-md)`): hover lift, dropdowns, sticky header.
- **lg** (`0 12px 40px …/ var(--shadow-a-lg)`): sheets, drawers and dialogs.

### Effects

- **Glass** (`glass`): header, drawers, dialogs, popovers, dropdowns and toasts. Translucent popover surface with blur and a lavender border.
- **Gradient border on hover** (`border-gradient-hover`): 1px lavender to gold, mask technique, for featured cards (`variant="gradient-border"`).
- **Image treatment:** `ImageFrame` zooms to 1.04 over 700ms; `overlay` adds a plum gradient for text on images.
- **Skeleton:** lavender tint with a soft shimmer (`skeleton-shimmer`).
- All effects are removed under `prefers-reduced-motion`.

- **glow** (`0 12px 40px -12px rgb(var(--primary-rgb) / var(--glow-a))`): hover on interactive cards, primary/gradient buttons, open dropdowns, dropzone drag-over and the slider thumb. Never a black shadow.

### Gradients

Lavender must lead every screen, so the brand never depends on photography for colour. Tokens: `bg-gradient-brand` (lavender → surface), `bg-gradient-card` (white → `primary-soft`), `bg-chrome` (deep lavender → midnight plum), `border-gradient` (lavender/gold/rose hairline).

**The Gradient Placement Rule.** Gradients are allowed on the footer chrome, the header hairline, the CTA band, at most one `gradient` button per screen, slider ranges and `Card variant="gradient"`. Never behind body copy or long text, and never on product imagery.

### Named Rules

**The Soft Lift Rule.** Elevation rises one step on hover, never more, and never on static content.

## Shapes

Gently rounded throughout: small (6px) for inputs and badges, medium (10px) for buttons and cards, large (16px) for feature panels and imagery frames. Buttons are never pills. Borders are 1px warm taupe. Icons are Lucide, thin outline, consistent stroke.

## Components

### Buttons

- **Shape:** medium radius (10px); heights 32 / 40 / 48px (`sm`, default, `lg`).
- **Primary:** Signature Lavender fill, Soft Charcoal Inter Semibold label (UI primitives pin `font-sans`); hover to Lavender Glow.
- **Secondary / Outline / Ghost:** transparent or ivory with a taupe border; hover fills Linen.
- **Luxury:** Champagne Gold with a small shadow, used rarely. **WhatsApp:** Sage fill for the confirmation action.
- **Hover / Focus:** colour transition at 150ms with `ease-standard`; 1px lift on hover, 0.98 press scale; primary and gradient buttons add a shimmer sweep (`shimmer`) and a cursor-follow lavender spotlight (`spotlight` + `data-spotlight`, fed by `SpotlightProvider`, off on touch and reduced motion). `loading` shows a spinner. Cursor is `pointer`, `not-allowed` when disabled. Focus uses the double ring `focus-ring` (2px background gap, then 3px Deep Lavender) so it shows on any surface.

### Cards / Containers

- **Corner Style:** medium (10px).
- **Background:** Pure Surface (Midnight Elevated in dark).
- **Shadow Strategy:** sm at rest; soft lift on hover for interactive cards.
- **Border:** 1px Warm Taupe. **Internal Padding:** 24px.

### Inputs / Fields

- **Style:** 44px tall, small radius (6px), Taupe Input border, transparent fill (Oat in dark), small shadow.
- **Focus:** border shifts to the ring colour with a 3px soft lavender ring.
- **Error / Disabled:** Garnet border and ring with an inline message (`field-error`); disabled at 50% opacity.

### Chips / Badges

- **Style:** small radius, caption type. Lavender for brand labels, Dusty Rose for romantic labels (Couple Favorite, Gift Ready), Champagne Gold for premium (Limited Drop, Premium Box), outline for neutral.

### Navigation

- Sticky site header in lavender-tinted glass (`bg-primary-soft/70` + blur) with a `bg-gradient-brand` hairline; footer is a `bg-chrome` band with `chrome-foreground` text in both themes. Inter labels; mobile navigation in a sheet (`mobile-nav`). The storefront header, footer and cart drawer are hidden under `/admin` (`storefront-chrome`).

### Mockup system (PageImages contract, ADR-0025)

- **Heading accent:** a Cinzel heading may end with a phrase in lavender Cormorant Garamond italic (`HeadingAccent`), for example "Style for you, gifts for them. _Moments for two._" One accent per heading.
- **Gold heart:** a small filled gold heart follows section titles (`SectionHeading heart`) and hero eyebrows (`Eyebrow heart`).
- **Split hero (default):** text and two CTAs (solid primary, outlined secondary) on a cream or plum surface; the image fills the right half and fades in from the left edge; on mobile the image sits above the text.
- **Bordered cards:** product, category and feature cards are white (`bg-card`) with a 1px taupe border and `shadow-sm`, lifting to `shadow-md` on hover. Category cards: image, Cinzel title, Cormorant subtitle, "Shop now →".
- **Primitives:** `IconRow` (round lavender icon chips), `Steps` (icon chip, gold number, dashed connector), `FeatureCard`, `CtaBand` (lavender closing band).
- **Chrome:** lavender (`bg-primary/60`) announcement bar with gold heart separators on every storefront page; footer with newsletter and a trust box of confirmed facts only. Social and contact items render only when set in `src/config/brand.ts`.
- **No wishlist hearts** on cards or in the header.

### Homepage signatures

- **Hero heights:** primary heroes are `100svh` minus header (`--header-h`) and announcement bar; secondary heroes `80svh`. Never `100vh`. Anchored sections get `scroll-margin-top` equal to the header. The split hero's image bleeds to the viewport's right edge and uses each image's `objectPosition` (default `right center`) so the subject is never cropped.
- **Cinematic hero:** full height, image as background with a bottom plum scrim (`scrim` token), white copy bottom-left, one primary button and a white text link. Image settles from scale 1.06 over 1.4s; headline words rise in sequence via CSS so the h1 paints immediately.
- **Trust strip:** three thin-icon items on Soft Blush directly under the hero.
- **Collections rail:** tabs (44px targets, arrow-key navigation) switch a scroll-snap rail on mobile and a 4-up grid on desktop, crossfading at 250ms.
- **Made-for-you bento:** one large and two small image tiles with scrims; tiles unmask from a soft inset clip as they enter view.
- **Header:** condenses from 64px to 56px with a medium shadow once the page scrolls.

### Motion (signature)

- `Reveal` and `Stagger` (`src/components/motion/`): fade plus a 16px rise over 400ms with `ease-standard`, once in view; 60ms stagger between items. Under reduced motion they keep only the opacity fade.
- Durations: fast 150ms (hover, focus), base 250ms (drawers, dropdowns, accordions), slow 400ms (reveals, hero). Exit uses `ease-exit`. Image and product hover scale at most 1.03.

## Do's and Don'ts

### Do:

- **Do** use semantic tokens from `app/globals.css` and the constants in `src/config/motion.ts`.
- **Do** keep text on lavender, rose and gold fills Soft Charcoal, and use `primary-text` / `gold-text` for coloured text.
- **Do** reuse `Reveal`, `Stagger` and the `src/components/ui` primitives before writing new ones.
- **Do** use the shared primitives: `Combobox` (single, multi, searchable), `CountrySelect`, `CurrencySelect`, `DatePicker`, `DateRangePicker`, `TimePicker`, `TagsInput`, `FileDropzone`, `DataTable` (TanStack Table v9: sorting, selection, pagination, skeleton, empty state), `Card` variants, `ImageFrame`, `Slider`, `Carousel` (drag, snap, thumbnails), `Lightbox`, `Popover`, `Tooltip`, `Dialog`, `Drawer`, `Tabs`, `Accordion`, `Checkbox`, `Switch`, `Skeleton`, `toast` (sonner). Card family in `src/components/cards/`: `ProductCard`, `FeatureCard`, `CollectionCard`, `TestimonialCard`, `StatCard`, each `variant`: `solid`, `glass`, `gradient-border`. Shared classes live in `src/components/ui/styles.ts`.
- **Do** design every screen for mobile first and check both light and dark themes.
- **Do** respect `prefers-reduced-motion`: remove movement, keep short fades.

### Don't:

- **Don't** use pill buttons, bouncy springs, excessive parallax or many simultaneous animations.
- **Don't** scale on hover beyond 1.03.
- **Don't** spend gold on more than one cluster per screen.
- **Don't** use heavy filled or cartoon icons.
- **Don't** make it look like Amazon, Daraz, a Shopify template, a wedding invitation or a Valentine promotion.
