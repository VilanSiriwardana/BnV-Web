# B&V Phase 1 Step-by-Step Development Guidance

| Field               | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| Version             | 1.0 (July 2026)                                              |
| Status              | Approved intent; partly superseded by the current repository |
| Converted / updated | 2026-10-28                                                   |
| Based on            | BV_Phase_1_Step_by_Step_Guidance_Document.pdf                |

> **Reference-library note.** Written before the repository existed. Already true in the repo (VERIFIED from governance docs): Next.js 16.2.10 App Router with `app/` at the root, Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`), Prisma 7.8.0 with `prisma.config.ts` and split models, Docker Compose with PostgreSQL and pgAdmin, and Husky with lint-staged. Not yet true: the `src/app` layout shown in 3.2, the `typecheck`/`test` scripts in 4.2, and the Jenkins pipeline in Section 19 (hosting is undecided, see D-01). Read with [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md).

```text
                                    B&V
Phase 1 Step-by-Step Development
                                  Guidance
```

#### Full context development blueprint for the Launch / MVP website

### Style for you. Gifts for them. Moments for two.

Prepared for Phase 1 production development - July 2026

## Document Control

| Item             | Decision                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project          | B&V modern romantic lifestyle ecommerce web app                                                                                                               |
| Phase            | Phase 1 - Launch / MVP Website                                                                                                                                |
| Primary goal     | Build a polished, trusted, premium, mobile-first ecommerce and brand-trust website that validates the B&V direction before advanced growth features.          |
| Brand promise    | Style for you. Gifts for them. Moments for two.                                                                                                               |
| Design direction | Lavender Luxury Romance in light mode; Midnight Lavender Luxury in dark mode.                                                                                 |
| Core stack       | Next.js App Router, TypeScript, Tailwind CSS, Global CSS, Framer Motion, Prisma, PostgreSQL, Zod, Auth.js, Sanity, Cloudinary, PayHere, KOKO, Docker Compose. |
| Document output  | Step-by-step guidance, implementation sequencing, module breakdown, QA gates, and sprint plan.                                                                |

## Table of Contents

1. Full Phase 1 Context
2. Phase 1 Product Scope
3. Architecture and Repository Foundation
4. Dockerized Local Development
5. Global Tailwind and Theme System
6. Reusable Component System
7. PostgreSQL and Prisma Implementation Plan
8. Authentication, Sessions, and Roles
9. Image, File, and Media Handling
10. Public Storefront Build Steps
11. Cart, Checkout, and Inquiry Flow
12. Custom Orders and Contact Flows
13. Visual Portfolio and Collaboration Hub
14. Admin Dashboard MVP
15. SEO and Metadata Implementation
16. Language Handling
17. Responsiveness, Accessibility, and Performance
18. Testing and QA Gates
19. Jenkins and Docker Deployment Design
20. Sprint-by-Sprint Execution Plan
21. Phase 2 Parking Lot
22. Final Acceptance Checklist

## 1. Full Phase 1 Context

B&V is being developed as a modern romantic lifestyle ecommerce web app, not only as a couple store. Phase 1 must validate the brand direction, visual identity, product discovery experience, order/inquiry flow, and admin management workflow before advanced personalization or platform expansion. The current working public name is B&V. The name and logo can evolve later, therefore the implementation must centralize brand labels, logo assets, colors, metadata, social links, and theme values in configuration files instead of hard- coding them throughout components.

#### Phase 1 principle

Build a beautiful, reliable, SEO-ready, reusable MVP that can sell or collect inquiries for Women, Men, Jewelry, Gifts, Couples, Custom Orders, Love Websites, and the Visual Portfolio / Collaboration Hub without overbuilding Phase 2 features.

### 1.1 Strategic Positioning

| Area             | Phase 1 Direction                                                                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand category   | Modern Romantic Lifestyle Ecommerce Brand                                                                                                                                         |
| Audience         | Individuals, couples, gift buyers, women fashion customers, men fashion customers, jewelry customers, custom order customers, love website customers, and collaboration visitors. |
| Commerce pillars | Women, Men, Jewelry, Gifts, Couples, Custom, Love Websites, Visual Portfolio.                                                                                                     |
| Tone             | Premium, romantic, calm, editorial, cinematic, warm, emotionally genuine.                                                                                                         |
| Differentiator   | Couple-led storytelling and visual identity, but not a couple-only shopping experience.                                                                                           |

### 1.2 Phase 1 Must Answer

- What is B&V and why should a visitor trust it?
- Can I shop for myself, not only as a couple?
- What can I buy: fashion, jewelry, gifts, couples, custom products, and love websites?
- Can I browse products, see details, select options, and submit an order or inquiry?
- Can the team manage products, categories, collections, images, orders, custom requests, and messages from an admin dashboard?
- Does the site look premium and consistent across mobile, tablet, desktop, light mode, and dark mode?
- Is the site SEO-ready from launch instead of being fixed later?

## 2. Phase 1 Product Scope

Phase 1 should launch only the features needed to make the website trustworthy, browsable, order-ready, inquiry-ready, admin-manageable, SEO-friendly, and visually aligned with the approved brand identity.

### 2.1 Included in Phase 1

| Module            | Included Phase 1 Scope                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation        | Next.js app, TypeScript, App Router, global CSS, Tailwind config, Docker Compose, Prisma, PostgreSQL, environment structure, linting, formatting.                             |
| Design System     | Light/dark theme tokens, typography, buttons, forms, cards, product cards, category cards, drawers, modals, accordions, layout primitives.                                    |
| Public Storefront | Homepage, shop/category pages, collection pages, product detail pages, cart, checkout/inquiry, custom orders, love websites landing, visual portfolio hub, contact, policies. |
| Commerce Core     | Products, variants, images, categories, collections, carts, cart items, orders, order item snapshots, payment attempt records.                                                |
| Auth              | Admin login and customer-ready identity foundation. Google sign- in can be prepared early if customer accounts are needed from launch.                                        |
| Admin Dashboard   | Dashboard, product CRUD, image upload, category/collection management, order inquiries, custom requests, contact messages, newsletter subscribers.                            |
| Media             | Cloudinary upload and metadata storage; no binary files in PostgreSQL.                                                                                                        |
| SEO               | Metadata utilities, canonical URLs, robots, sitemap, JSON-LD, image alt text, page title/description patterns.                                                                |
| Deployment        | Docker production image, Jenkins pipeline design, migration deploy flow, health checks, rollback preparation.                                                                 |

### 2.2 Excluded or Parked for Phase 2

- Full customer dashboard with saved addresses and order tracking.
- Wishlist, reviews, customer memories, coupons, advanced campaigns, and gift finder.
- Real gift box builder with saved build sessions and item combinations.
- Payment webhook automation, refunds, shipment tracking, and advanced order lifecycle.
- Sanity-backed journal/blog workflows beyond basic SEO content structure.
- Advanced language SEO with localized URL trees and hreflang.
- AI stylist, subscriptions, inventory ledger, ambassador program, mobile app APIs, and offline showroom features.

## 3. Architecture and Repository Foundation

The first development task is not the homepage. The first task is creating a production-ready foundation that can support reusable development, global styling, database access, admin management, SEO, Docker, and deployment automation.

### 3.1 Create the Next.js Project

1. Create a new GitHub repository for the production app.
2. Initialize a Next.js App Router project with TypeScript and Tailwind CSS.
3. Enable ESLint and configure Prettier before writing feature code.
4. Add Husky and lint-staged so committed code is formatted and checked automatically.
5. Add the base packages: Prisma, Zod, Auth.js, Framer Motion, Lucide React, next-themes, Cloudinary SDK, clsx, tailwind-merge, and any form library selected for the project.
6. Create a strict .env.example file and never commit real secrets.

### 3.2 Recommended Folder Structure

```text
src/
 app/
  (public)/
  (auth)/
  admin/
  api/
 components/
  ui/
  layout/
  commerce/
  home/
  product/
  admin/
  forms/
 config/
  brand.ts
  navigation.ts
  routes.ts
  seo.ts
  theme.ts
 features/
  auth/
  cart/
  checkout/
  products/
  collections/
  custom-orders/
  portfolio/
  admin/
 lib/
  prisma/
  auth/
  cloudinary/
  seo/
  validations/
  utils/
 styles/
  globals.css
 i18n/
  config.ts
  dictionaries/
 types/
 data/
  seed/
prisma/
 schema.prisma
 migrations/
docker/
 nginx/
 postgres/
```

### 3.3 Central Configuration Files

| File                     | Purpose                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| src/config/brand.ts      | Brand name, logo paths, tagline, social links, contact channels, currency, default country. |
| src/config/navigation.ts | Header, mobile drawer, footer, mega menu, account, admin navigation.                        |
| src/config/routes.ts     | Single source of truth for route paths and route labels.                                    |
| src/config/seo.ts        | Default title template, metadata defaults, canonical base URL, social preview defaults.     |
| src/config/theme.ts      | Semantic theme labels and design token documentation for developers.                        |

## 4. Dockerized Local Development

Docker Compose must be introduced before database and admin work so that the project can run consistently on any machine with one command. Local development should not depend on manually installed PostgreSQL versions or hidden local configuration.

### 4.1 Minimum Docker Services

| Service  | Purpose                                                                                       |
| -------- | --------------------------------------------------------------------------------------------- |
| app      | Next.js application in development mode or production mode depending on compose file.         |
| postgres | PostgreSQL database used by Prisma migrations and local data.                                 |
| pgadmin  | Optional visual database tool for inspecting tables and seed data.                            |
| redis    | Optional Phase 2/3 service; keep out until needed unless deployment architecture requires it. |
| nginx    | Optional local production-style reverse proxy. Useful before deployment testing.              |

### 4.2 Required Local Commands

```text

# First run
cp .env.example .env
docker compose up --build

# Database setup
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Daily development
docker compose up
npm run lint
npm run typecheck
npm run test
```

### 4.3 Docker Acceptance Criteria

- A new developer can clone the repo, copy .env.example, run Docker Compose, migrate the database, seed data, and open the app.
- PostgreSQL data persists through container restarts using a named volume.
- Prisma connects using DATABASE_URL from environment variables only.
- No secrets are committed to Git.
- The same Dockerfile can be used by Jenkins to build production images.

## 5. Global Tailwind and Theme System

The design system must be globalized from the first sprint. Components should never depend on raw hex codes. They should use semantic tokens such as background, foreground, surface, primary, accent, border, muted, and destructive. This keeps light mode, dark mode, future redesigns, and reusable components manageable.

### 5.1 Light Theme Tokens

| Semantic Role | Brand Color        | Hex     | Usage                                                     |
| ------------- | ------------------ | ------- | --------------------------------------------------------- |
| background    | Warm Ivory         | #FAF7F2 | Page backgrounds, editorial layouts, checkout base.       |
| surface       | Soft Blush         | #F3D8D6 | Story sections, soft cards, gift blocks, testimonials.    |
| primary       | Signature Lavender | #C8B6E2 | Primary CTAs, active states, focus rings, hero accents.   |
| primary-hover | Soft Lilac Glow    | #D8C9F0 | Button hover, active highlights, soft glows.              |
| secondary     | Dusty Rose         | #C98F94 | Romantic badges, icons, emotional accents.                |
| accent        | Champagne Gold     | #C6A15B | Premium labels, jewelry details, limited drops, dividers. |
| foreground    | Soft Charcoal      | #1C1B1A | Main text, headings, prices, labels.                      |
| border        | Warm Taupe         | #D8C8BD | Borders, forms, card outlines, dividers.                  |

### 5.2 Dark Theme Tokens

| Semantic Role    | Brand Color        | Hex     | Usage                                   |
| ---------------- | ------------------ | ------- | --------------------------------------- |
| background       | Midnight Aubergine | #17121D | Main dark page background.              |
| surface          | Deep Plum          | #241B2E | Cards, sections, navbars, drawers.      |
| surface-elevated | Velvet Plum        | #2F243A | Modals, dropdowns, elevated cards.      |
| primary          | Signature Lavender | #C8B6E2 | CTAs, active states, highlights.        |
| primary-hover    | Soft Lilac Glow    | #D8C9F0 | Hover and active emphasis.              |
| secondary        | Muted Rose         | #B9828A | Romantic micro accents.                 |
| accent           | Candlelight Gold   | #D2B16F | Jewelry highlights and premium details. |
| foreground       | Moon Ivory         | #F7F1EA | Readable dark mode text.                |
| border           | Smoky Taupe Plum   | #4A3A50 | Dark mode borders and dividers.         |

### 5.3 Theme Implementation Steps

7. Configure next/font for Playfair Display and Inter in the root layout.
8. Define CSS variables in globals.css for :root and .dark.
9. Map Tailwind colors to CSS variables in tailwind.config.ts.
10. Use next-themes or an equivalent provider for class-based light/dark switching.
11. Create a ThemeToggle component and include it in header, mobile drawer, and admin shell if useful.
12. Write a developer rule: raw hex values are allowed only in theme files, not in page components.
13. Create a small internal /style-guide page during development to preview buttons, inputs, cards, typography, product cards, modals, and both themes.

## 6. Reusable Component System

Component-first development is the key to keeping the app clean. Page files should compose features from reusable components. They should not contain repeated card markup, button styling, form field layout, image aspect-ratio rules, or navigation logic.

### 6.1 UI Primitive Components

- Button, IconButton, LinkButton
- Input, Textarea, Select, Checkbox, Radio, Switch
- FormField, FieldError, FormSection
- Badge, StatusBadge, PriceBadge
- Card, ProductCard, CategoryCard, CollectionCard, FeatureCard
- Modal, Drawer, AlertDialog, Sheet
- Accordion, Tabs, Breadcrumbs, Pagination
- Toast, EmptyState, LoadingState, Skeleton
- Container, Section, SectionHeader, Heading, Eyebrow
- ThemeToggle, LanguageSwitch, CurrencyLabel

### 6.2 Layout Components

| Component       | Responsibility                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------- |
| SiteShell       | Wraps public pages with header, footer, theme provider, metadata defaults, and analytics hooks. |
| Header          | Desktop navigation, logo, search, cart, wishlist/account icon placeholders, theme toggle.       |
| MobileNavDrawer | Mobile menu with expandable sections and clear category links.                                  |
| MegaMenu        | Shop, Women, Men, Jewelry, Gifts, Couples, Custom, Love Websites links.                         |
| Footer          | Expandable mobile sections, categorized links, newsletter, social links, legal links.           |
| AdminShell      | Protected admin layout with sidebar, topbar, breadcrumbs, and action area.                      |
| PageHero        | Reusable editorial hero with image, headline, subtitle, CTA group.                              |

### 6.3 Commerce Components

- ProductGrid and ProductCard
- ProductGallery and ProductImageZoom placeholder
- VariantSelector for size/color/material/option selection
- QuantitySelector
- AddToCartButton
- CartDrawer and CartLineItem
- OrderSummary
- CheckoutForm
- CustomRequestForm
- ProductRecommendationsSection
- TrustBar and PolicySnippet

## 7. PostgreSQL and Prisma Implementation Plan

The database must be implemented in staged migrations. The long-term schema can be planned now, but Phase 1 should implement only the core tables needed for catalog, cart, order/inquiry, custom requests, contact, and newsletter functionality. Because login, Google sign-in, and sessions are part of the requested Phase 1 build, Auth.js persistence tables should be brought forward even if they were originally listed in Phase 2.

### 7.1 Phase 1 Tables

| Module              | Tables                                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| Identity            | users, accounts, sessions, verification_tokens                             |
| Catalog             | categories, products, product_variants, product_images, product_categories |
| Merchandising       | collections, collection_products                                           |
| Cart                | carts, cart_items                                                          |
| Orders              | orders, order_items                                                        |
| Payments            | payments                                                                   |
| Custom Orders       | custom_requests, custom_request_files                                      |
| Support / Marketing | contact_messages, newsletter_subscribers                                   |

### 7.2 Global Database Rules

- Use UUID primary keys for public-safe identifiers.
- Use Decimal/numeric values for money and prices. Do not use floating-point values for prices.
- Use explicit currency_code with default LKR.
- Use created_at and updated_at consistently.
- Use status strings first; convert to enums only after the status lifecycle becomes stable.
- Use JSON only for flexible option snapshots, submitted personalization, gateway payloads, and preserving form submissions.
- Do not store image binaries in PostgreSQL; store Cloudinary public IDs, secure URLs, alt text, dimensions, and ownership relationships.
- Order items must preserve product title, SKU, price, selected options, image URL, and personalization snapshot at the time of order creation.

### 7.3 Migration Sequence

14. Create shared Prisma base configuration and database connection utility.
15. Create identity models: User, Account, Session, VerificationToken if Auth.js persistence is used.
16. Create catalog models: Category, Product, ProductVariant, ProductImage, ProductCategory.
17. Create merchandising models: Collection, CollectionProduct.
18. Create cart models: Cart, CartItem.
19. Create order models: Order, OrderItem, Payment.
20. Create inquiry models: CustomRequest, CustomRequestFile, ContactMessage, NewsletterSubscriber.
21. Generate Prisma client and run initial migration.
22. Create seed scripts for categories, collections, sample products, product variants, images, and admin user.
23. Run Prisma Studio and verify relations before building UI forms.

## 8. Authentication, Sessions, and Roles

Authentication should be implemented before the admin dashboard. The public store can browse without login, but admin operations must be protected. Customer login can be minimal in Phase 1 or enabled early if Google sign-in is a launch requirement.

### 8.1 Role Model

| Role        | Purpose                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| CUSTOMER    | Default website user. Can browse, use cart, submit order/inquiry, and later access account.            |
| ADMIN       | Can manage products, images, categories, collections, orders, custom requests, and messages.           |
| SUPER_ADMIN | Can manage admins, global settings, advanced destructive operations, and deployment-sensitive actions. |
| EDITOR      | Optional content/media role for product content, portfolio, and CMS-related content.                   |

### 8.2 Auth Build Steps

24. Install and configure Auth.js for Next.js App Router.
25. Add Prisma adapter if using database-backed accounts and sessions.
26. Add credentials login for admin users or secure email-based login.
27. Configure Google OAuth if customer Google sign-in is part of Phase 1.
28. Create middleware or server-side guards for /admin and /account routes.
29. Create role-checking utilities: requireAdmin, requireSuperAdmin, getCurrentUser.
30. Create auth pages: login, register if needed, error page, logout action.
31. Test session persistence in Docker, local browser refresh, and protected route redirects.

## 9. Image, File, and Media Handling

Cloudinary should be the media source for product images, banners, custom request reference files, portfolio visuals, and future editorial media. PostgreSQL should store Cloudinary metadata and relationships, not binary files.

### 9.1 Upload Rules

- Validate file type and size server-side before upload.
- Upload admin product images to structured Cloudinary folders such as bv/products/{productId}.
- Upload custom request reference files to bv/custom-requests/{requestId}.
- Require useful alt text for product and marketing images.
- Store public_id, secure_url, width, height, format, alt_text, sort_order, is_primary, and entity relation.
- Use optimized image delivery through Next/Image or Cloudinary transformations.
- Do not build important text into images only. SEO-relevant copy must exist as HTML text.

### 9.2 Admin Media Flow

32. Admin opens product form.
33. Admin chooses image files and enters alt text.
34. Server validates and uploads files to Cloudinary.
35. Server stores metadata in product_images.
36. Admin sets primary image and sort order.
37. Public product page renders image gallery from product_images ordered by sort_order.
38. SEO metadata uses primary product image as Open Graph/Product schema image.

## 10. Public Storefront Build Steps

Build public pages after the design system, database models, and sample seed data are ready. The prototype should guide composition and visual direction, but production code must be rebuilt with reusable components and real data models.

### 10.1 Public Routes

| Route               | Purpose                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| /                   | Homepage with brand positioning, hero, featured collections, products, custom/love website/portfolio teasers, testimonials, newsletter. |
| /shop               | All-product discovery landing page.                                                                                                     |
| /women              | Women category landing and product grid.                                                                                                |
| /men                | Men category landing and product grid.                                                                                                  |
| /jewelry            | Jewelry category landing and product grid.                                                                                              |
| /gifts              | Gift-focused landing page and collections.                                                                                              |
| /couples            | Couple capsule and signature couple collections.                                                                                        |
| /custom             | Custom order landing and inquiry flow.                                                                                                  |
| /love-websites      | Love website service landing and inquiry CTA.                                                                                           |
| /visual-portfolio   | B&V visual portfolio and collaboration hub.                                                                                             |
| /our-story          | Brand trust, story, and emotional positioning.                                                                                          |
| /contact            | Contact form and contact channel cards.                                                                                                 |
| /products/[slug]    | Product detail page.                                                                                                                    |
| /collections/[slug] | Curated product collection page.                                                                                                        |
| /cart               | Cart page.                                                                                                                              |
| /checkout           | Order/inquiry checkout page.                                                                                                            |

### 10.2 Homepage Build Order

39. Build Header, MobileNavDrawer, MegaMenu, and Footer first.
40. Build HomepageHero using a reusable PageHero component and real CTA buttons.
41. Build FeaturedCategories using CategoryCard components for Women, Men, Jewelry, Gifts, Couples, Custom.
42. Build FeaturedCollections using CollectionCard and collection seed data.
43. Build NewArrivals or FeaturedProducts using ProductGrid and ProductCard.
44. Build JewelryHighlight and GiftBox/Custom sections as reusable marketing cards.
45. Build LoveWebsites teaser to validate the digital experience direction without building the full platform.
46. Build VisualPortfolio teaser linking to the collaboration hub.
47. Build TrustBar with shipping, quality, secure checkout/inquiry, and gift-ready messaging.
48. Build Testimonials/LoveNotes section with static content first, database-backed later.
49. Build Newsletter signup with newsletter_subscribers table and duplicate-email handling.
50. Run responsive QA across 360, 768, 1024, 1280, and 1536 px widths.

### 10.3 Product Detail Page Requirements

- Product image gallery with primary image, thumbnails, alt text, and responsive ratios.
- Product title, price, sale price if applicable, SKU/variant information.
- Short emotional description above the fold.
- Variant selectors for size, color, material, or personalization options.
- Quantity selector and add-to-cart action.
- Gift readiness information: packaging, message card, occasion suitability.
- Delivery, returns, and payment/inquiry confidence information.
- Accordion sections for description, material/care, size guide, gift packaging, delivery, FAQ.
- Related products or complete-the-look section.
- Product JSON-LD with price, currency, availability, images, brand, and SKU.

## 11. Cart, Checkout, and Inquiry Flow

Phase 1 should prefer a stable inquiry-friendly ecommerce flow rather than trying to fully automate payment and fulfillment too early. The flow must still preserve order snapshots so catalog changes do not corrupt historical orders.

### 11.1 Cart Flow

51. User opens product page and selects variant/options.
52. User clicks Add to Cart.
53. Server action validates product status, variant availability, quantity, and selected options.
54. If no active cart exists, create one for user_id or anonymous session_id.
55. Create or update cart_items with selected option snapshot.
56. Open CartDrawer showing cart items, subtotal, and checkout CTA.
57. Allow quantity update, remove item, and continue shopping.
58. Persist cart in database and optionally mirror cart count in client state for UI speed.

### 11.2 Checkout / Inquiry Flow

59. User proceeds to checkout.
60. Checkout form collects name, email, phone, delivery address, notes, and preferred contact method.
61. Server validates form using Zod.
62. Server recalculates cart totals from database, not client values.
63. Create orders record with status inquiry_received or pending_confirmation.
64. Create order_items snapshots with product title, variant title, SKU, unit price, quantity, selected options, personalization, and image URL.
65. Create payments record with payment_status pending/manual/not_required depending on chosen flow.
66. Mark cart as converted.
67. Show success page with order number and next-step explanation.
68. Notify admin by email or dashboard notification placeholder.

### 11.3 Suggested Phase 1 Statuses

| Entity          | Statuses                                                                |
| --------------- | ----------------------------------------------------------------------- |
| Cart            | active, converted, abandoned                                            |
| Order           | inquiry_received, pending_confirmation, confirmed, preparing, cancelled |
| Payment         | not_required, pending, paid, failed, refunded                           |
| Custom Request  | new, reviewing, quoted, accepted, rejected, completed                   |
| Contact Message | new, read, replied, archived                                            |
| Product         | draft, active, archived                                                 |

## 12. Custom Orders and Contact Flows

Custom orders are an important Phase 1 differentiator because they support custom fashion, jewelry, gift boxes, embroidery, engraving, personalized notes, and love website inquiries. The implementation should collect structured information without making the flow too long.

### 12.1 Custom Order Form Fields

| Field Group         | Fields                                                                                |
| ------------------- | ------------------------------------------------------------------------------------- |
| Customer            | Name, email, phone, preferred contact method.                                         |
| Request Type        | Custom fashion, custom jewelry, gift box, embroidery, engraving, love website, other. |
| Occasion            | Birthday, anniversary, engagement, wedding, self-love, date night, other.             |
| Budget and timeline | Approximate budget, needed date, urgency.                                             |
| Details             | Description, size/color/material preferences, message text, personalization details.  |
| Reference files     | Images or documents uploaded through Cloudinary and linked to custom_request_files.   |

### 12.2 Contact and Newsletter

- Contact form should validate name, email/phone, subject, message, and optional category.
- Contact messages should appear in admin with new/read/replied/archive statuses.
- Newsletter signup should prevent duplicate active subscriptions using normalized lowercase email.
- Newsletter success message should feel brand-aligned: warm, premium, and not generic.
- Do not expose raw database errors in public forms.

## 13. Visual Portfolio and Collaboration Hub

The Visual Portfolio and Collaboration Hub should position B&V as models, lifestyle creators, and approachable creative collaborators, not as photographers. In Phase 1, it can be a polished landing page and inquiry system rather than a full booking platform.

### 13.1 Page Sections

69. Hero section: premium romantic lifestyle visuals and collaboration positioning.
70. About the collaboration style: models, lifestyle creators, brand campaigns, event invitations, product shoots, restaurant/cafe features, fashion and jewelry campaigns.
71. Portfolio grid: selected visual categories such as fashion, jewelry, gifting, couple lifestyle, events, and brand shoots.
72. Collaboration types: campaign modeling, product features, event invitations, social content, launch shoots, lifestyle concepts.
73. Inquiry form: brand name, contact person, email, phone, collaboration type, date, location, budget range, description, reference links.
74. Trust and tone: humble, professional, creative, approachable, not celebrity-like or photography-service-like.

### 13.2 Implementation Approach

- Use static portfolio sections in Phase 1 if CMS is not ready.
- Store collaboration inquiries either in contact_messages with category collaboration or introduce collaboration_requests if needed.
- Use Cloudinary for portfolio visuals.
- Avoid language that implies B&V is selling photography services.
- Add internal links from homepage, footer, and About/Our Story page.

## 14. Admin Dashboard MVP

Admin should be functional and practical. It does not need to look like the public storefront, but it should still use the brand tokens and a clean layout. The admin dashboard must allow the team to operate the Phase 1 store without direct database editing.

### 14.1 Admin Routes

| Route                   | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| /admin                  | Dashboard overview with stats and recent activity.            |
| /admin/products         | Product list, filters, status, edit/delete/archive actions.   |
| /admin/products/new     | Create product with variants, images, categories, SEO fields. |
| /admin/categories       | Manage navigation/filter categories.                          |
| /admin/collections      | Manage curated collections and product ordering.              |
| /admin/orders           | View and manage order inquiries.                              |
| /admin/custom-requests  | View and update custom requests.                              |
| /admin/contact-messages | Read and manage contact messages.                             |
| /admin/newsletter       | Newsletter subscriber list and export.                        |
| /admin/media            | Optional media browser for uploaded images.                   |
| /admin/settings         | Basic brand/site settings placeholder.                        |

### 14.2 Admin Product CRUD Steps

75. Create product list page with status filter, search, category filter, and pagination.
76. Create product form schema with Zod validation.
77. Support product core fields: title, slug, description, short description, status, price range, product type, SEO title, SEO description.
78. Support variants: SKU, price, sale price, stock quantity or availability status, option values.
79. Support category assignment and collection assignment.
80. Support image upload, alt text, primary image, and sort order.
81. Save product and variants in a transaction where possible.
82. Preview product page from admin after save.
83. Add soft archive instead of hard delete for products that may be linked to past orders.

### 14.3 Admin Dashboard Cards

- Total products and active products.
- Draft products.
- New orders/inquiries.
- New custom requests.
- Unread contact messages.
- Newsletter subscribers.
- Low-stock or unavailable variants.
- Recent orders and recent custom requests.

## 15. SEO and Metadata Implementation

SEO is part of Phase 1 development, not a final polish task. Every public page template should have metadata, canonical URLs, Open Graph preview, clear H1, image alt text, and structured data where relevant.

### 15.1 SEO Files to Build Early

```text
src/config/seo.ts
src/lib/seo/metadata.ts
src/lib/seo/jsonld.ts
src/lib/seo/canonical.ts
src/app/sitemap.ts
src/app/robots.ts
```

### 15.2 Metadata Rules

- Every public page has a unique title and useful meta description.
- Title template should support both brand and page intent, for example: Lavender Initial Necklace | B&V.
- Canonical URLs must point to the preferred public URL and ignore tracking parameters.
- Open Graph and Twitter preview images must be set for homepage, categories, collections, and products.
- Cart, checkout, account, login, admin, payment callbacks, and internal utility pages should be noindex or protected.
- Product pages require Product/Offer JSON-LD when data is available.
- Category and collection pages should include CollectionPage and BreadcrumbList JSON-LD where useful.
- Do not add fake review schema. Add review/rating schema only after real reviews exist.

### 15.3 SEO-Friendly URL Structure

| Page Type        | Route Pattern                                     |
| ---------------- | ------------------------------------------------- |
| Homepage         | /                                                 |
| Shop             | /shop                                             |
| Core Category    | /women, /men, /jewelry, /gifts, /couples, /custom |
| Love Websites    | /love-websites                                    |
| Visual Portfolio | /visual-portfolio                                 |
| Product          | /products/[slug]                                  |
| Collection       | /collections/[slug]                               |
| Journal later    | /journal/[slug]                                   |
| Policy           | /policies/[slug]                                  |

### 15.4 Pre-Launch SEO QA

- Sitemap includes canonical public pages only.
- robots.txt blocks private/admin/checkout utility routes where appropriate.
- Each page has one H1.
- Meaningful images have alt text.
- Product pages have JSON-LD and valid price/currency/availability data.
- Breadcrumbs work and schema validates.
- No duplicate metadata or conflicting head tags.
- Lighthouse and PageSpeed scores are checked.
- Meta SEO Inspector verifies title, description, canonical, robots, Open Graph, Twitter, H1, and schema.
- Search Console and GA4 are prepared for launch.

## 16. Language Handling

Language support should be architected now, but full multilingual SEO can wait. In Phase 1, create dictionary-based UI labels and keep products/content in English or the initial launch language until proper translation quality is ready.

### 16.1 Initial i18n Structure

```text
src/i18n/
 config.ts
 dictionaries/
  en.json
  si.json
  ta.json
```

- Centralize common UI labels: navigation, buttons, forms, validation messages, admin labels, status labels.
- Use a language switch component only if translations are ready enough to avoid a poor user experience.
- Do not index translated route versions until content has real translations and hreflang is correctly implemented.
- Store selected language in cookie or user preference later.
- Keep product descriptions in database/CMS with future language-ready fields if needed.

## 17. Responsiveness, Accessibility, and Performance

The app must be mobile-first. The visual prototype is desktop-rich, but production development must ensure every page works on small devices first, then scales upward.

### 17.1 Responsive Breakpoint QA

| Width   | What to Verify                                                                         |
| ------- | -------------------------------------------------------------------------------------- |
| 360px   | Mobile header, menu, hero stacking, product cards, cart drawer, forms, sticky buttons. |
| 768px   | Tablet grids, category sections, product detail layout, footer sections.               |
| 1024px  | Laptop navigation, product grid density, admin table layout.                           |
| 1280px  | Desktop spacing, hero proportions, mega menu, marketing sections.                      |
| 1536px+ | Max-width containers, image quality, no excessive stretching.                          |

### 17.2 Accessibility Rules

- Use semantic HTML: header, nav, main, section, footer, form, button.
- Buttons must be real buttons, links must be real links.
- Keyboard navigation must work for header, drawers, modals, forms, and admin actions.
- Focus states must be visible in both light and dark mode.
- Text contrast must be checked against both themes.
- Forms need labels, errors, helper text, and proper aria attributes where needed.
- Images need alt text when meaningful; decorative images can use empty alt.
- Motion should be subtle and should not block usability.

### 17.3 Performance Rules

- Use Server Components by default and Client Components only when interactivity is needed.
- Use Next/Image or Cloudinary optimized images.
- Avoid loading unnecessary animation libraries into static page sections.
- Paginate or lazy load large product grids.
- Cache safe read queries where appropriate.
- Avoid huge client-side global state for catalog data.
- Measure Core Web Vitals before launch.

## 18. Testing and QA Gates

Testing should be built into every sprint. The MVP should not rely on manual clicking alone. At minimum, combine linting, type checking, schema validation, unit tests for utilities, server action tests where practical, and manual QA checklists.

### 18.1 Automated Checks

- npm run lint
- npm run typecheck
- npm run test
- Prisma generate and migration validation
- Build check: npm run build
- Optional Playwright smoke tests for public routes, cart, checkout, and admin login.

### 18.2 Manual User Flow QA

| Flow               | Acceptance Criteria                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| Browse homepage    | Loads fast, correct brand tone, header/footer work, theme toggle works, mobile layout is clean. |
| Browse category    | Category page renders correct products, filters/sorting do not break, SEO metadata exists.      |
| View product       | Images, variants, price, description, accordions, add-to-cart, related products work.           |
| Cart               | Add, update quantity, remove, subtotal, cart drawer, cart page work.                            |
| Checkout           | Validation, order creation, order item snapshots, success page, admin visibility work.          |
| Custom request     | Form submission, file upload, admin visibility, statuses work.                                  |
| Admin product CRUD | Create/edit/archive product, upload images, assign categories/collections.                      |
| SEO                | Metadata, canonical, robots, sitemap, schema, alt text, Lighthouse pass.                        |

## 19. Jenkins and Docker Deployment Design

Deployment should be designed while the app is still small. The same Docker foundation used for local development should support CI/CD. Jenkins should build, test, package, and deploy the app without manual server edits.

### 19.1 Jenkins Pipeline Stages

84. Checkout repository from GitHub.
85. Install dependencies using npm ci.
86. Run lint.
87. Run typecheck.
88. Run tests.
89. Generate Prisma client.
90. Build Next.js app.
91. Build Docker image with version tag and latest tag.
92. Push image to container registry.
93. Deploy to server by pulling image and restarting containers.
94. Run prisma migrate deploy in production environment.
95. Run health check against deployed URL.
96. Notify success/failure.

### 19.2 Production Environment Requirements

- Separate production .env managed outside Git.
- Managed PostgreSQL or secured Docker PostgreSQL with backup strategy.
- Cloudinary production folder separation.
- Auth secrets and OAuth callback URLs configured for production domain.
- HTTPS enabled through hosting provider, reverse proxy, or certificate management.
- Database migration strategy and rollback plan.
- Health endpoint for deployment verification.
- Error logging and basic monitoring.

## 20. Sprint-by-Sprint Execution Plan

This is the recommended execution order. Do not jump into final page polish before foundation, components, data model, and admin workflows are stable.

### Sprint 0 - Project Foundation

- Create GitHub repository and branch strategy.
- Initialize Next.js App Router + TypeScript + Tailwind.
- Configure ESLint, Prettier, Husky, lint-staged.
- Create folder structure and config files.
- Add Docker Compose with app and PostgreSQL.
- Create .env.example and developer setup guide.

### Sprint 1 - Global Design System

- Add fonts, global CSS variables, Tailwind token mapping.
- Implement light/dark theme provider and toggle.
- Create UI primitives: buttons, inputs, cards, modals, drawers, headings, containers.
- Create public layout components: header, mega menu, mobile drawer, footer.
- Create development style guide page.

### Sprint 2 - Database and Seed Data

- Create Prisma schema for Phase 1 tables.
- Bring Auth.js tables into Phase 1 if login/Google sign-in is required.
- Run migrations.
- Seed categories, collections, products, variants, product images, and admin user.
- Verify relations with Prisma Studio.

### Sprint 3 - Public Homepage

- Build hero, featured categories, featured collections, product sections.
- Build gift/custom/love website/visual portfolio teasers.
- Build trust bar, testimonials, newsletter.
- Connect sections to database where useful.
- Run responsive/theme QA.

### Sprint 4 - Catalog and Product Pages

- Build shop, category, collection pages.
- Build product grid, product card, filters/sorting basics.
- Build product detail page, gallery, variants, accordions, related products.
- Add product metadata and JSON-LD.

### Sprint 5 - Cart and Checkout Inquiry

- Build add-to-cart server action.
- Build cart drawer and cart page.
- Build checkout form and order creation.
- Create order item snapshots.
- Build success page and admin order visibility.

### Sprint 6 - Custom Orders, Contact, Portfolio

- Build custom order page and form.
- Build file upload flow for references.
- Build contact page and contact message storage.
- Build Visual Portfolio / Collaboration Hub landing and inquiry flow.
- Connect newsletter and contact management to admin.

### Sprint 7 - Admin Dashboard MVP

- Build protected admin shell.
- Build dashboard cards.
- Build product CRUD and image upload.
- Build category and collection management.
- Build order, custom request, contact message, and newsletter views.

### Sprint 8 - SEO, QA, and Deployment

- Implement sitemap, robots, metadata utilities, canonical URLs.
- Run Lighthouse, PageSpeed, Meta SEO Inspector, accessibility QA.
- Create production Dockerfile and Jenkinsfile.
- Set up deployment environment variables.
- Run deployment rehearsal and health check.

## 21. Phase 2 Parking Lot

The following ideas are important, but should not block Phase 1 launch unless a business decision changes the MVP scope.

| Feature                       | Reason to Wait                                                          |
| ----------------------------- | ----------------------------------------------------------------------- |
| Wishlist                      | Requires stronger customer account UX and retention flows.              |
| Saved addresses               | Useful after customer accounts are established.                         |
| Order tracking dashboard      | Better after order lifecycle and shipment statuses mature.              |
| Reviews and customer memories | Should wait until real customers and moderation rules exist.            |
| Gift box builder              | Needs a more complex product/box combination model and UX testing.      |
| Payment webhooks/refunds      | Should follow stable payment provider integration and test credentials. |
| Coupons/campaigns             | Useful for growth but not required for launch validation.               |
| Journal/Sanity content engine | Can follow after core commerce pages and SEO structure are stable.      |
| AI gift finder/stylist        | Should wait until catalog and analytics data are mature.                |

## 22. Final Acceptance Checklist

### 22.1 Development Foundation

- Project runs locally through Docker Compose.
- ESLint, Prettier, typecheck, build, and tests pass.
- Folder structure is clean and feature-based.
- Environment variables are documented.
- Prisma migrations and seed scripts work from scratch.

### 22.2 Design System

- All colors use semantic Tailwind tokens.
- Light and dark themes are visually intentional.
- Typography uses Playfair Display and Inter correctly.
- Reusable components are used instead of repeated page markup.
- Header, footer, drawer, buttons, forms, cards, and product cards work across breakpoints.

### 22.3 Storefront

- Homepage communicates the modern romantic lifestyle brand clearly.
- Women, Men, Jewelry, Gifts, Couples, Custom, Love Websites, and Visual Portfolio are visible and accessible.
- Product listing and product detail pages are connected to database data.
- Cart and checkout/inquiry flow create correct records and snapshots.
- Custom requests and contact messages are captured and visible to admin.

### 22.4 Admin

- Admin is protected by authentication and roles.
- Admin can create/edit/archive products.
- Admin can upload product images and manage alt text.
- Admin can manage categories and collections.
- Admin can view orders, custom requests, contact messages, and newsletter subscribers.

### 22.5 SEO, Performance, and Deployment

- Sitemap and robots are implemented.
- Each public page has metadata, canonical URL, Open Graph data, and clear H1.
- Product pages include valid product schema.
- Cart, checkout, account, admin, and utility pages are noindex/protected.
- Lighthouse, accessibility, mobile, and dark mode QA are complete.
- Jenkins pipeline builds, tests, packages, deploys, migrates, and health-checks the app.

## Source Context Used

| Source Document                                                                                                                                                                                                                                                                                                                       | How It Was Used                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| B&V Phase Development Reference                                                                                                                                                                                                                                                                                                       | Phase 1 scope, brand direction, visual identity, recommended build order, phase gate thinking, working rules.           |
| B&V PostgreSQL Database Design Reference v1.0                                                                                                                                                                                                                                                                                         | Phase 1 tables, PostgreSQL/Prisma decisions, data type rules, order snapshot principles, media storage decisions.       |
| B&V SEO Reference Guide                                                                                                                                                                                                                                                                                                               | SEO-first implementation, route architecture, metadata, sitemap, robots, structured data, image SEO, pre-launch SEO QA. |
| Brand Identity & Design System Reference v1.1                                                                                                                                                                                                                                                                                         | Lavender Luxury Romance, Midnight Lavender Luxury, typography, Tailwind token strategy, reusable UI direction.          |
| Technology Stack & Tools Reference v1.0                                                                                                                                                                                                                                                                                               | Approved stack, tooling, Docker Compose, development tools, analytics and SEO toolchain, future expansion direction.    |
| Prototype visuals and launch/banner references                                                                                                                                                                                                                                                                                        | Visual tone, composition direction, homepage section strategy, product/card styling, light/dark mood alignment.         |
| Final working rule For every new idea, page, feature, or design decision, ask whether it helps B&V become a premium romantic lifestyle ecommerce brand, supports Phase 1 launch, can be implemented cleanly with reusable Next.js components, follows the lavender-led visual identity, and can scale into Phase 2 without rewriting. |                                                                                                                         |
