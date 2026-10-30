# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Sri Lankan solo shoppers and gift buyers, mostly on mobile, buying fashion, jewelry, accessories or a personalised gift for themselves or someone special. They must never feel they need to be in a couple to buy.
- **Secondary:** couples marking a milestone (couple collections, custom pieces, love websites), and brands, restaurants and event organisers looking to book B&V as models and creative collaborators.
- **Internal:** the B&V admin team managing orders, catalog, inquiries and custom requests in `/admin`.

## Product Purpose

B&V is a modern romantic lifestyle ecommerce brand: women's and men's fashion, jewelry and accessories, gifts and personalised products, couple collections, custom orders, love websites, and a Visual Portfolio & Collaboration Hub. Success is a shopper who finds something meaningful, orders with confidence, and confirms over WhatsApp, and a collaborator who sends a qualified inquiry.

## Positioning

A romantic lifestyle brand fronted by a real couple, Buwi and Vila, who model their own pieces. Brand promise: **Style for you. Gifts for them. Moments for two.** The couple story is the emotional engine and differentiator, never a restriction on who can buy. The portfolio presents B&V as models and collaborators, not photographers.

## Operating Context

- Sri Lanka delivery only at launch; prices in LKR.
- Checkout creates an inquiry order. Payment methods are cash on delivery and bank transfer, confirmed manually over WhatsApp or phone before dispatch (D-17, D-20). PayHere/KOKO come later. No order tracking in Phase 1; updates go by WhatsApp or email.
- Love websites, consultations and custom pieces are request forms with manual admin follow-up; no calendar or online payment.
- Content is driven by TikTok and social: styling, gifting, behind-the-scenes, shoots and campaigns.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), React 19, Tailwind 4, shadcn/radix, framer-motion, Prisma + PostgreSQL, Auth.js admin, Cloudinary images.
- Routes: home, `/shop`, pillar and sub-category pages, collections, product pages, cart, checkout, custom, love websites, portfolio, collaborate, contact, policies, and the admin panel.
- Light theme plus a dark "Midnight Lavender Luxury" theme (`next-themes`).
- Undecided: final brand name and logo, production domain, COD courier and bank details.

## Brand Commitments

- Authority: [docs/references/Brand-Identity.md](docs/references/Brand-Identity.md) (v1.3). It owns colour, typography, logo, UI, motion and dark-mode rules; tokens live in `app/globals.css`.
- Voice: emotional, personal, premium and story-driven, and solo-inclusive.

## Evidence on Hand

- All current images are AI-generated prototype placeholders ([docs/references/Visual-Asset-Inventory.md](docs/references/Visual-Asset-Inventory.md)), in `public/images/prototype/`. Real photography must replace them before launch, especially in the portfolio and Our Story.
- No real reviews, ratings, customer counts or testimonials exist. Never fabricate them (D-10).

## Product Principles

1. Solo-first, couple-led: every surface works for one person buying; the couple story adds warmth, not a gate.
2. Premium through restraint and detail, not decoration.
3. Trust before transaction: clear LKR prices, real payment methods, an honest WhatsApp confirmation flow.
4. Mobile is the main stage.
5. Truthful content only: no invented proof or claims.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast (Brand-Identity §16.1 tokens), full keyboard access, visible focus, and `prefers-reduced-motion` respected by every animation.
