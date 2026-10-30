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
typography:
  display:
    fontFamily: 'Playfair Display, Georgia, serif'
    fontSize: '2.5rem'
    fontWeight: 600
    lineHeight: 1.1
  headline:
    fontFamily: 'Playfair Display, Georgia, serif'
    fontSize: '2.125rem'
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: 'Playfair Display, Georgia, serif'
    fontSize: '1.375rem'
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
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

Premium comes from restraint: few colours on any screen, generous space, one serif voice for headings, quiet Inter for everything functional, and gentle motion that reveals rather than performs. Dark mode, "Midnight Lavender Luxury", keeps the same identity on deep plum surfaces.

It must not feel like Amazon, Daraz, a stock Shopify template, a wedding invitation, a Valentine promotion, a basic gift shop or a childish couple brand.

**Key Characteristics:**

- Warm ivory base with lavender, blush and gold as rationed accents.
- Playfair Display headings over Inter UI text.
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

**The Rationed Gold Rule.** Champagne Gold appears in at most one action or tag cluster per screen. Its rarity is what makes it premium.

**The Charcoal-On-Colour Rule.** Text on lavender, rose or gold fills is always Soft Charcoal; lavender or gold text on light surfaces uses the `-text` tokens.

**The Semantic Token Rule.** Use semantic tokens (`bg-primary`, `text-gold-text`), never literal hex or Tailwind palette colours.

## Typography

**Display Font:** Playfair Display (with Georgia, serif)
**Body Font:** Inter (with ui-sans-serif, system-ui)

**Character:** An editorial high-contrast serif for emotion and story, paired with a neutral, legible sans for everything the shopper acts on.

### Hierarchy

- **Display** (600, 2.5rem mobile, steps up at `md`, 1.1): hero headlines only.
- **Headline** (600, 2.125rem → h2 1.75rem, 1.15–1.2): section titles (`h1`, `h2`).
- **Title** (600, 1.375rem → h4 1.125rem, 1.25–1.35): card and block titles.
- **Body** (400, 1rem / body-lg 1.125rem, 1.6): copy; keep lines to about 65–75ch.
- **Label** (600, 0.875rem, 1.5): buttons, navigation, form labels.
- **Caption** (500, 0.75rem, 1.4): badges, meta, fine print.

### Named Rules

**The Two Voices Rule.** Playfair for `h1`–`h3` and editorial moments; Inter for prices, buttons, forms, navigation and data. Never set UI controls in the serif.

## Layout

Mobile-first. The type scale is defined at mobile sizes and components step up at the `md` breakpoint (Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280). Spacing follows the Tailwind 4px scale with generous section padding. Homepage order and section roles are fixed by Brand-Identity §23: a cinematic hero, then editorial category, product and story blocks. Layouts must not overlap or overflow at any width.

## Elevation & Depth

Soft and warm. Shadows are tinted with charcoal at low alpha in light mode and black at higher alpha in dark mode, so depth reads as ambient light, not hard edges. Tonal layering (ivory → blush → white) does most of the work; shadows confirm it.

### Shadow Vocabulary

- **sm** (`0 1px 2px rgb(var(--shadow-color) / var(--shadow-a-sm))`): cards and inputs at rest, luxury button.
- **md** (`0 4px 16px …/ var(--shadow-a-md)`): hover lift, dropdowns, sticky header.
- **lg** (`0 12px 40px …/ var(--shadow-a-lg)`): sheets, drawers and dialogs.

### Named Rules

**The Soft Lift Rule.** Elevation rises one step on hover, never more, and never on static content.

## Shapes

Gently rounded throughout: small (6px) for inputs and badges, medium (10px) for buttons and cards, large (16px) for feature panels and imagery frames. Buttons are never pills. Borders are 1px warm taupe. Icons are Lucide, thin outline, consistent stroke.

## Components

### Buttons

- **Shape:** medium radius (10px); heights 32 / 40 / 48px (`sm`, default, `lg`).
- **Primary:** Signature Lavender fill, Soft Charcoal Inter Semibold label; hover to Lavender Glow.
- **Secondary / Outline / Ghost:** transparent or ivory with a taupe border; hover fills Linen.
- **Luxury:** Champagne Gold with a small shadow, used rarely. **WhatsApp:** Sage fill for the confirmation action.
- **Hover / Focus:** colour transition at 150ms with `ease-standard`; 3px focus ring in Deep Lavender with a 2px offset.

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

- Sticky site header with Inter labels; mobile navigation in a sheet (`mobile-nav`). The storefront header, footer and cart drawer are hidden under `/admin` (`storefront-chrome`).

### Motion (signature)

- `Reveal` and `Stagger` (`src/components/motion/`): fade plus a 16px rise over 400ms with `ease-standard`, once in view; 60ms stagger between items. Under reduced motion they keep only the opacity fade.
- Durations: fast 150ms (hover, focus), base 250ms (drawers, dropdowns, accordions), slow 400ms (reveals, hero). Exit uses `ease-exit`. Image and product hover scale at most 1.03.

## Do's and Don'ts

### Do:

- **Do** use semantic tokens from `app/globals.css` and the constants in `src/config/motion.ts`.
- **Do** keep text on lavender, rose and gold fills Soft Charcoal, and use `primary-text` / `gold-text` for coloured text.
- **Do** reuse `Reveal`, `Stagger` and the `src/components/ui` primitives before writing new ones.
- **Do** design every screen for mobile first and check both light and dark themes.
- **Do** respect `prefers-reduced-motion`: remove movement, keep short fades.

### Don't:

- **Don't** use pill buttons, bouncy springs, excessive parallax or many simultaneous animations.
- **Don't** scale on hover beyond 1.03.
- **Don't** spend gold on more than one cluster per screen.
- **Don't** use heavy filled or cartoon icons.
- **Don't** make it look like Amazon, Daraz, a Shopify template, a wedding invitation or a Valentine promotion.
