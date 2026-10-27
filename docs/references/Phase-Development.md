# B&V Phase Development Reference

| Field               | Value                                     |
| ------------------- | ----------------------------------------- |
| Version             | 1.1                                       |
| Status              | Approved intent; see reconciliation notes |
| Converted / updated | 2026-10-28                                |
| Based on            | BV_Phase_Development_Reference_v1_1.pdf   |

> **Reference-library note.** This is the business and product roadmap for Phases 1–4. Where it conflicts with the Phase 1 Step-by-Step Guidance (navigation, portfolio routes, consultation booking scope, auth timing), see [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md). The Technology Stack table here predates the verified repository versions in [Technology-Stack.md](Technology-Stack.md).

#### Phase 1 onward - Product, Design, UX, and Development Roadmap Updated with Phase 1 Visual Portfolio & Collaboration Hub

| Warm Ivory #FAF7F2 | Soft Blush #F3D8D6 | Signature Lavender #C8B6E2 | Dusty Rose #C98F94 | Champagne Gold #C6A15B | Soft Charcoal #1C1B1A | Warm Taupe #D8C8BD |
| ------------------ | ------------------ | -------------------------- | ------------------ | ---------------------- | --------------------- | ------------------ |

#### Working brand direction

Modern Romantic Lifestyle Ecommerce Brand - a premium fashion, jewelry, gifting, custom products, love websites, visual portfolio, and collaboration-led brand universe.

#### Document purpose

A practical reference for Figma updates, implementation planning, and future phase decisions. This version adds the corrected Phase 1 Visual Portfolio & Collaboration Hub, positioning B&V as models, lifestyle creators, and approachable creative collaborators - not photographers.

## Contents

1. Project Identity and Strategic Direction
2. Visual Identity and Technology Reference
3. Full Phase Plan Overview
4. Phase 1 - Launch / MVP Website
5. Phase 1 Visual Portfolio & Collaboration Hub
6. Phase 2 - Growth and Personalization
7. Phase 3 - Platform Expansion
8. Phase 4 - Brand Expansion
9. Recommended Build Order
10. Phase Gate Checklist
11. Current Decision Summary and Working Rules
12. Source References

## 1. Project Identity and Strategic Direction

### Working Brand Name

B&V is the working public brand name to use in the current prototype and development documents unless a future naming decision replaces it. The design direction supports an elegant B&V / BV-style monogram that can work on the website header, packaging, jewelry boxes, clothing labels, product tags, favicon, app icon, and social media profile image.

### Updated Brand Category

B&V is positioned as a modern romantic lifestyle ecommerce brand. The brand should not feel limited to couples only. It should serve solo women fashion customers, solo men fashion customers, jewelry customers, gift buyers, couple customers, custom order customers, love website customers, visual portfolio visitors, and future brand collaboration clients.

### Updated Positioning Statement

#### Positioning statement

A modern romantic lifestyle brand creating fashion, jewelry, gifts, custom pieces, meaningful digital experiences, and romantic visual content for individuals, couples, brands, and people celebrating beautiful moments.

### Brand Promise

#### Style for you. Gifts for them. Moments for two.

This tagline covers solo fashion, gift buying, couple moments, and emotional brand storytelling without making the customer feel they must be in a relationship to shop from the brand.

| Customer Segment             | What They Want                                                   | How B&V Serves Them                                                                  |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Women fashion customer       | Beautiful, soft, trendy, premium everyday pieces                 | Women collections, co-ords, dresses, tops, loungewear, accessories                   |
| Men fashion customer         | Clean, minimal, confident outfits                                | Men essentials, oversized fits, shirts, tees, pants, hoodies, accessories            |
| Jewelry customer             | Rings, earrings, bracelets, necklaces, gifts, self- love pieces  | Jewelry collections, personalization, gift-ready packaging                           |
| Gift buyer                   | Meaningful gifts without confusion                               | Gift boxes, occasion pages, gift finder, custom notes                                |
| Couple customer              | Matching pieces, couple jewelry, memory products                 | Couple collections, couple boxes, date-night edits                                   |
| Custom order customer        | Something personal and unique                                    | Custom fashion, custom jewelry, custom gift boxes, embroidery, love websites         |
| Brand / collaboration client | Models and lifestyle creators for campaigns, events, and content | Visual Portfolio, collaboration inquiry, consultation booking, event invitation flow |

## 2. Visual Identity and Technology Reference

### Light Theme - Lavender Luxury Romance

Light mode is the primary brand expression. It should feel warm, breathable, romantic, editorial, product-focused, model-focused, and premium.

| Role          | Name               | Hex     | Usage                                                    |
| ------------- | ------------------ | ------- | -------------------------------------------------------- |
| Background    | Warm Ivory         | #FAF7F2 | Page backgrounds, editorial layouts, checkout base       |
| Surface       | Soft Blush         | #F3D8D6 | Story sections, soft cards, gift sections, testimonials  |
| Primary       | Signature Lavender | #C8B6E2 | Primary CTAs, active states, focus rings, hero accents   |
| Primary Hover | Soft Lilac Glow    | #D8C9F0 | Button hover, active highlights, soft glows              |
| Secondary     | Dusty Rose         | #C98F94 | Romantic badges, icons, emotional accents                |
| Accent        | Champagne Gold     | #C6A15B | Premium labels, jewelry details, limited drops, dividers |
| Foreground    | Soft Charcoal      | #1C1B1A | Main text, headings, prices, labels                      |
| Border        | Warm Taupe         | #D8C8BD | Borders, forms, card outlines, dividers                  |

### Dark Theme - Midnight Lavender Luxury

Dark mode is the cinematic evening version of the same identity. It should feel like midnight lavender, candlelight, premium packaging, date-night atmosphere, and editorial fashion. It must not become gaming purple, neon romance, harsh black luxury, or a simple auto-inverted light theme.

| Role             | Name               | Hex     | Usage                               |
| ---------------- | ------------------ | ------- | ----------------------------------- |
| Background       | Midnight Aubergine | #17121D | Main dark page background           |
| Surface          | Deep Plum          | #241B2E | Cards, sections, navbars, drawers   |
| Surface Elevated | Velvet Plum        | #2F243A | Modals, dropdowns, elevated cards   |
| Primary          | Signature Lavender | #C8B6E2 | CTAs, active states, highlights     |
| Primary Hover    | Soft Lilac Glow    | #D8C9F0 | Hover and active emphasis           |
| Secondary        | Muted Rose         | #B9828A | Romantic micro accents              |
| Accent           | Candlelight Gold   | #D2B16F | Jewelry highlights, premium details |
| Foreground       | Moon Ivory         | #F7F1EA | Readable dark mode text             |
| Border           | Smoky Taupe Plum   | #4A3A50 | Dark mode borders and dividers      |
| Muted Foreground | Lavender Taupe     | #B8AABD | Secondary text                      |

### Typography

| Role      | Font             | Usage                                                                                 |
| --------- | ---------------- | ------------------------------------------------------------------------------------- |
| Display   | Playfair Display | Hero headings, collection titles, story sections, campaign headings, emotional quotes |
| UI / Body | Inter            | Navigation, buttons, forms, product cards, prices, cart, checkout, FAQ, policy pages  |

### Technology Stack

| Layer                | Approved Direction                                                    |
| -------------------- | --------------------------------------------------------------------- |
| Frontend + Backend   | Next.js App Router, Server Components, Route Handlers, Server Actions |
| Language             | TypeScript                                                            |
| Styling              | Tailwind CSS + Global CSS                                             |
| Animations           | Framer Motion                                                         |
| ORM / Database       | Prisma + PostgreSQL                                                   |
| Validation / Auth    | Zod + Auth.js                                                         |
| CMS / Media          | Sanity + Cloudinary                                                   |
| Payments             | PayHere + KOKO                                                        |
| Hosting              | Vercel initially, Railway later for scaling                           |
| Local Infrastructure | Docker Compose                                                        |

## 3. Full Phase Plan Overview

| Phase   | Updated Focus                                                                                                                                                                               | Main Outcome                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | Website launch, women and men starter fashion, jewelry basics, couple capsule, gifts/custom inquiries, love websites landing, Visual Portfolio & Collaboration Hub, TikTok/Instagram growth | A polished MVP ecommerce and brand trust site that validates B&V as a romantic lifestyle brand and collaboration-ready visual identity |
| Phase 2 | Customized products, stronger gift box system, love websites, influencer collaborations, wishlist, customer accounts                                                                        | Growth features, personalization, and customer retention                                                                               |
| Phase 3 | Own fashion collections, advanced jewelry line, AI stylist/gift finder, mobile app, subscription boxes, international shipping                                                              | Platform expansion and advanced personalization                                                                                        |
| Phase 4 | Physical studio/showroom, photoshoot packages, content production house, cafe/showroom concept, luxury brand line                                                                           | Brand ecosystem and offline/luxury expansion                                                                                           |

## 4. Phase 1 - Launch / MVP Website

### Phase 1 Purpose

Phase 1 is the first public version of B&V. The goal is not to build every advanced feature. The goal is to launch a beautiful, trusted, premium website that introduces the brand and allows customers to browse, inquire, order, connect, view the B&V visual identity, and start collaboration conversations.

### Phase 1 Must Answer

- What is B&V?
- What can I buy?
- Can I shop for myself?
- Can I buy for someone special?
- Can couples shop here?
- Can I request a custom order?
- Can I view B&V’s visual/modeling work?
- Can a brand, restaurant, event organizer, or creative team collaborate with B&V?
- Can I trust this brand?
- How do I contact B&V?

### Phase 1 Business Focus

- Women starter fashion
- Men starter fashion
- Jewelry basics
- Gift boxes and gift-ready products
- Couple capsule collection
- Custom order inquiries
- Love website service landing page
- Visual Portfolio & Collaboration Hub
- Collaboration inquiries and creative consultation booking
- Event invitation inquiry flow
- TikTok / Instagram growth
- Brand storytelling
- Premium packaging direction

### Phase 1 Navigation

| Navigation Area                       | Items                                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Main navigation                       | Shop / Women / Men / Jewelry / Gifts / Portfolio / Custom / Our Story                                                                    |
| Alternative if navbar becomes crowded | Shop / Women / Men / Jewelry / Gifts / Couples / Custom / Our Story, with Portfolio in footer and CTA cards                              |
| Utility navigation                    | Search / Language Switch / Theme Switch / Wishlist placeholder / Cart                                                                    |
| Footer support links                  | Love Websites / Visual Portfolio / Collaborate With Us / Contact / FAQ / Track Order later / Privacy Policy / Terms / Returns / Shipping |

### Phase 1 Pages

| Priority         | Pages                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Must-have        | Home, Shop, Collection, Product Detail, Cart Drawer, Checkout / Order Inquiry, Custom Orders, Visual Portfolio & Collaboration Hub, Our Story, Contact, Policy Pages |
| Should-have      | Cart Page, Love Websites Landing, FAQ                                                                                                                                |
| Policy templates | Privacy Policy, Terms & Conditions, Returns & Exchanges, Shipping / Delivery Policy                                                                                  |

### Phase 1 Homepage Structure

1. Announcement Bar
2. Navbar
3. Hero
4. Featured Categories
5. New Arrivals / Limited Drop
6. Fashion Edit
7. Jewelry Highlight
8. Couple Collection
9. Build Your Gift Box / Couple Box
10. Custom Orders
11. Love Websites
12. Visual Portfolio preview
13. Social Gallery
14. Testimonials / Memories
15. Newsletter
16. Footer

### Homepage Hero Direction

| Element       | Recommended Content                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero headline | Style for you. Gifts for them. Moments for two.                                                                                                                                    |
| Hero subtitle | Discover romantic fashion, premium jewelry, meaningful gifts, custom pieces, digital love experiences, and visual stories - made for yourself, someone special, or the two of you. |
| Primary CTAs  | Shop New In / Discover Jewelry / Find a Gift                                                                                                                                       |
| Secondary CTA | Start Custom Order                                                                                                                                                                 |
| Portfolio CTA | View Visual Portfolio                                                                                                                                                              |
| Hero imagery  | Women fashion, men fashion, jewelry closeups, gift packaging, couple lifestyle moment, custom/love website preview, and B&V model/campaign visuals                                 |

### Featured Categories

| Category  | Subtitle                                                    | CTA            |
| --------- | ----------------------------------------------------------- | -------------- |
| Women     | Soft everyday pieces, styled beautifully.                   | Shop Women     |
| Men       | Clean essentials with quiet confidence.                     | Shop Men       |
| Jewelry   | Gift-ready pieces with meaning.                             | Shop Jewelry   |
| Gifts     | Thoughtful boxes for every occasion.                        | Shop Gifts     |
| Couples   | Matching moments, made subtle.                              | Shop Couples   |
| Custom    | Personal pieces, made just for you.                         | Start Custom   |
| Portfolio | Modeling, campaigns, collaborations, and cinematic stories. | View Portfolio |

### Shop Page Structure

| Area             | Required Direction                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs             | All / Women / Men / Jewelry / Gifts / Couples / Custom                                                                                                                                                                                      |
| Filters          | Category, Audience, Product Type, Occasion, Price, Material, Color, Availability, Sort                                                                                                                                                      |
| Product examples | Soft Ribbed Top, Lavender Co-ord Set, Minimal Oversized Tee, Men's Clean Hoodie, Heart Coordinates Necklace, Signature Bracelet, Self- Love Gift Box, Couple Hoodie Set, Custom Engraved Pendant, Love Notes Candle, Gift-Ready Jewelry Box |

### Product Detail Page Structure

- Product gallery
- Product title and price
- Badges
- Options
- Quantity selector
- Add to Cart
- WhatsApp Inquiry
- Product story
- Details accordion
- Delivery / returns accordion
- Gift packaging note
- Related products

| Product Type | Option Examples                                                     |
| ------------ | ------------------------------------------------------------------- |
| Fashion      | Size, color, fit, quantity                                          |
| Jewelry      | Material, chain length, engraving, gift packaging                   |
| Gift Box     | Box type, add note, packaging, occasion                             |
| Custom       | Personalization text, upload reference, required date, budget range |

### Cart and Checkout

| Flow                     | Phase 1 Scope                                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart Drawer              | Item list, selected options, quantity controls, remove item, subtotal, gift note teaser, checkout button, WhatsApp order button, continue shopping, empty state |
| Cart Page                | Full cart review, quantity updates, order summary, delivery note, gift note, coupon placeholder later, checkout CTA, recommended products                       |
| Checkout / Order Inquiry | Name, phone, email optional, delivery address, city, order note, payment method, WhatsApp confirmation option                                                   |
| Payments                 | Start with inquiry-friendly flow; later integrate PayHere and KOKO                                                                                              |

### Custom Orders Page

| Area        | Direction                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose     | Capture personalization demand early                                                                                                                                |
| Examples    | Custom fashion, custom jewelry, custom gift boxes, embroidery, printed pieces, engraving, personalized notes, love websites                                         |
| Form fields | Product type, occasion, customization type, personalization text, preferred color/material, budget range, required date, reference upload, contact details, message |
| Primary CTA | Start Custom Order                                                                                                                                                  |

### Love Websites Landing Page

| Area     | Direction                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose  | Introduce romantic digital experiences without building the full builder yet                                                                         |
| Types    | Our Story Website, Proposal Page, Anniversary Countdown, Wedding RSVP, Birthday Surprise Website, Digital Scrapbook, Memory Timeline, Guestbook Page |
| Sections | Hero, website types, template/mockup previews, how it works, starting price/inquiry CTA, portfolio placeholder, inquiry form                         |

## 5. Phase 1 Visual Portfolio & Collaboration Hub

#### Core correction

This section must not present B&V as photographers. B&V are models, lifestyle creators, visual personalities, and approachable creative collaborators. The page showcases B&V together and individually while allowing brands, restaurants, event organizers, and creative teams to start collaborations.

### Purpose and Positioning

- Showcase B&V’s couple and individual modeling work.
- Group photos and videos by shoot/project rather than random isolated media.
- Build trust by showing style, chemistry, versatility, professionalism, and campaign potential.
- Create a humble path for collaboration inquiries, creative consultations, and event invitations.
- Support the broader B&V ecosystem: Ambassador Program, Content Production, Photoshoot Packages, Our Story, Contact, and Brand Ecosystem pages.

### Recommended Page Name and Hero

| Element             | Recommendation                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page name           | Visual Portfolio                                                                                                                                                          |
| Optional descriptor | Modeling, campaigns, collaborations, and cinematic stories                                                                                                                |
| Hero heading        | Our Visual Portfolio                                                                                                                                                      |
| Hero subtitle       | A collection of couple and individual shoots across fashion, jewelry, promotions, bridal, restaurants, birthdays, lifestyle, and cinematic stories.                       |
| Hero CTAs           | View Couple Shoots / Explore Individual Work / Work With Us                                                                                                               |
| Hero visuals        | Collage of one couple shoot, one Buwi solo fashion/jewelry image, one Vila solo fashion/lifestyle image, one product/jewelry campaign image, and one video/reel thumbnail |

### Filtering and Browsing System

| Filter Layer     | Options                                                                                                                            | Purpose                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Who is featured? | All / Couple / Buwi / Vila                                                                                                         | Separates couple work from individual modeling work      |
| Shoot category   | All / Fashion / Jewelry / Promotional / Bridal / Restaurant / Birthday / Cinematic / Lifestyle / Product / Event / Custom Concepts | Helps brands and visitors find relevant examples         |
| Media type       | All Media / Photos / Videos                                                                                                        | Allows smooth browsing of photo-heavy or reel/video work |

### Shoot Card Model

Each card represents one shoot/project. A shoot can contain multiple images and videos.

| Shoot Card Field  | Description                                  |
| ----------------- | -------------------------------------------- |
| Cover image       | Primary image that represents the shoot      |
| Shoot title       | Example: Cinematic Cafe Romance              |
| Featured type     | Couple, Buwi, or Vila                        |
| Category tags     | Example: Restaurant / Cinematic / Lifestyle  |
| Media count       | Example: 18 photos · 2 videos                |
| Short description | One sentence describing the concept and mood |
| CTA               | View Shoot                                   |

### Example Shoot Collections

| Shoot                         | Featured | Categories                            | Media Example        |
| ----------------------------- | -------- | ------------------------------------- | -------------------- |
| Cinematic Cafe Romance        | Couple   | Restaurant / Cinematic / Lifestyle    | 18 photos · 2 videos |
| Golden Hour Jewelry Story     | Buwi     | Jewelry / Promotional / Cinematic     | 16 photos · 2 videos |
| Minimal Men’s Fashion Edit    | Vila     | Men’s Fashion / Editorial / Lifestyle | 14 photos · 1 video  |
| Bridal Soft Romance           | Buwi     | Bridal / Occasion                     | 20 photos · 2 videos |
| Restaurant Lifestyle Campaign | Couple   | Restaurant / Promotional              | 20 photos · 3 videos |
| Birthday Memory Shoot         | Couple   | Birthday / Lifestyle                  | 12 photos · 1 video  |
| Product & Gift Box Campaign   | Couple   | Product / Promotional / Gifts         | 18 photos · 2 videos |
| Midnight Editorial Portraits  | Vila     | Cinematic / Fashion                   | 15 photos · 1 video  |
| Lavender Fashion Story        | Buwi     | Fashion / Lifestyle                   | 16 photos · 1 video  |
| Couple Jewelry Campaign       | Couple   | Jewelry / Promotional                 | 18 photos · 2 videos |

### Shoot Detail View

- Shoot title
- Featured person/type: Couple, Buwi, or Vila
- Category tags
- Short description
- Media count
- Featured hero image
- Media tabs: All / Photos / Videos
- Editorial masonry photo gallery
- Video thumbnails with play icon, duration, and label
- Related shoots
- Collaboration CTA

### Media Experience

| Media Type | Required UX                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Photos     | Premium editorial masonry layout; mixed portrait, landscape, and detail shots; hover overlay with View label; lightbox with next/previous navigation                                 |
| Videos     | Video cards with play icon, duration, and label such as Campaign Reel, Behind the Scenes, Product Promo, Cinematic Clip, Outfit Reel, or Couple Reel; click opens video modal/player |
| Dark mode  | All images with text over them must have a dark overlay or gradient. Do not make images too dim, but never allow unreadable text.                                                    |

### Individual Model Profile Cards

| Profile      | Positioning                                                                          | CTA                |
| ------------ | ------------------------------------------------------------------------------------ | ------------------ |
| Buwi         | Women’s fashion · jewelry · bridal · lifestyle · beauty · gifting                    | View Buwi’s Shoots |
| Vila         | Men’s fashion · formalwear · lifestyle · accessories · cinematic concepts            | View Vila’s Shoots |
| B&V Together | Couple campaigns · restaurants · fashion · jewelry · storytelling · cinematic shoots | View Couple Shoots |

### Collaboration Positioning

#### Tone rule

Avoid “Hire Us” or celebrity-style language. Use “Work With Us”, “Collaborate With B&V”, “Start a Collaboration”, “Let’s Create Something Beautiful Together”, “Book a Creative Consultation”, and “Invite B&V to Your Event”.

### Collaboration Opportunity Cards

| Opportunity                      | Examples                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| Fashion Campaigns                | Women’s fashion, men’s fashion, seasonal launches, lookbooks, editorial collections   |
| Jewelry Campaigns                | Lifestyle jewelry, luxury jewelry, gift collections, new launches, close-up campaigns |
| Product Promotions               | Gift boxes, accessories, beauty, home decor, food, beverages, lifestyle products      |
| Restaurant & Cafe Collaborations | Restaurant launches, menu promotions, lifestyle campaigns, food content with models   |
| Hotel & Travel Campaigns         | Staycations, resorts, destination campaigns, travel experiences                       |
| Bridal & Wedding Content         | Bridal fashion, engagement concepts, pre-shoots, wedding promotions                   |
| Birthday & Celebration Campaigns | Birthday shoots, party venues, gift campaigns, celebration content                    |
| Events & Launches                | Store openings, product launches, fashion shows, creator events, pop-ups              |
| Cinematic & Lifestyle Content    | Storytelling reels, editorial videos, romantic concepts, brand storytelling           |
| Custom Creative Collaborations   | Unique creative ideas, campaign concepts, experimental visuals                        |

### Collaboration Process Timeline

1. Reach Out - Tell us about your idea.
2. Let’s Talk - Discuss the concept, style, location, goals, and mood.
3. Plan Together - Prepare the shoot direction, outfits, references, and schedule.
4. Create Beautiful Content - Collaborate on photos, videos, reels, campaign visuals, or event content.
5. Share the Final Story - Deliver content ready for the brand, campaign, launch, or memory.

### Collaboration Inquiry Form

| Field Group          | Fields                                                                                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contact              | Name / Brand Name, Email, Phone / WhatsApp                                                                                                                                                                                          |
| Project              | Project Type, Who do you need? Couple / Buwi / Vila / Not sure, Preferred Date, Location, Budget Range optional                                                                                                                     |
| Details              | Tell us about your idea, Reference upload optional                                                                                                                                                                                  |
| Project type options | Fashion Campaign, Jewelry Campaign, Product Promotion, Restaurant / Cafe, Hotel / Travel, Birthday, Bridal, Couple Campaign, Lifestyle Shoot, Editorial Shoot, Social Media Content, Brand Launch, Event Invitation, Custom Project |

### Creative Consultation Booking

| Booking Step           | Required Behavior                                                                                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Choose meeting type | Creative Consultation, Campaign Discussion, Product Promotion Planning, Fashion Shoot Planning, Jewelry Campaign Planning, Restaurant Collaboration, Hotel Collaboration, Brand Campaign, Custom Project, General Discussion |
| 2. Choose mode         | Online or in-person                                                                                                                                                                                                          |
| 3. Select date         | Date picker or available date cards                                                                                                                                                                                          |
| 4. Select time         | Time slot selector                                                                                                                                                                                                           |
| 5. Add project details | Short message, references, expected goals                                                                                                                                                                                    |
| 6. Confirm booking     | Confirmation screen and WhatsApp confirmation CTA                                                                                                                                                                            |

### Event Invitation Flow

| Area          | Direction                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Section title | Invite B&V to Your Event                                                                                                                                                       |
| Use cases     | Store Opening, Product Launch, Restaurant Opening, Fashion Show, Wedding Expo, Creator Event, Brand Event, Lifestyle Campaign, Charity Event, Private Event, Pop-Up Experience |
| Form fields   | Event Name, Organizer / Brand, Email, Phone / WhatsApp, Event Date, Location, Expected Audience, What would you like us to do?, Notes, Reference upload optional               |
| Role options  | Attend, Model, Create Content, Promotion, Social Media Coverage, Other                                                                                                         |
| CTA           | Send Event Invitation                                                                                                                                                          |

### Data Models for Phase 1 Portfolio

| Model                | Purpose                              | Important Fields                                                                                                          |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Shoot                | Represents one shoot/project         | id, title, slug, featuredType, people, categories, description, coverImage, location, date, tags, isFeatured              |
| ShootMedia           | Images/videos inside one shoot       | id, shootId, type, src, thumbnail, caption, duration, order                                                               |
| CollaborationInquiry | Brand/project inquiry from portfolio | name, brandName, email, phone, projectType, requiredPeople, preferredDate, location, budgetRange, message, referenceFiles |
| ConsultationBooking  | Creative consultation appointment    | meetingType, mode, date, time, contact, projectDetails, status                                                            |
| EventInvitation      | Event invitation request             | eventName, organizer, date, location, expectedAudience, requestedRole, notes, status                                      |

### Phase 1 Implementation Rule for Portfolio

- Start with static TypeScript/JSON shoot data and local/Cloudinary-hosted media placeholders.
- Do not build complex paid booking or availability logic in Phase 1; keep it as inquiry/appointment request flow.
- Keep the page public and easy to discover from nav/footer/Our Story/Contact.
- Use Sanity later if the number of shoots, videos, and collaborations grows.
- Use dark overlays on all image-with-text areas, especially in dark mode.

## 6. Phase 2 - Growth and Personalization

Phase 2 turns the launch store into a stronger ecommerce and personalization experience. The focus becomes customer accounts, wishlist, order tracking, gift finder, real gift box builder, content marketing, customer memories, stronger custom products, and love website service expansion.

### Phase 2 Pages / Modules

- Login
- Register
- Forgot Password
- My Account
- My Orders
- Order Detail
- Saved Addresses
- Wishlist
- Search Results
- Gift Finder
- Build Your Gift Box
- Blog / Love Notes
- Blog Detail
- Lookbook
- Customer Memories
- Order Tracking
- Payment Success
- Payment Failed
- Order Received

### Phase 2 Key Features

| Feature             | Purpose                                                        | Core Scope                                                                              |
| ------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Customer Accounts   | Manage orders, wishlist, addresses, and future personalization | Auth.js, profile, order history, saved addresses                                        |
| Wishlist            | Support fashion, jewelry, and gifting decisions                | Save products, move to cart, share wishlist, empty state                                |
| Search Results      | Search products and future content                             | Product, category, blog/content results, no-results state                               |
| Gift Finder         | Help customers select meaningful gifts                         | Recipient, occasion, budget, style, personalization, delivery deadline, recommendations |
| Build Your Gift Box | Convert the Phase 1 teaser into a real flow                    | Choose box type, products, note, packaging, review, add to cart/inquire                 |
| Blog / Love Notes   | SEO, storytelling, gifting education, brand trust              | Gift ideas, style guides, jewelry styling, anniversary ideas, behind the brand          |
| Lookbook            | Make B&V feel like a fashion/lifestyle brand                   | Women styling, men styling, couple outfits, jewelry pairings, product links             |
| Customer Memories   | Build community and social proof                               | Customer photos, gift reactions, jewelry unboxings, couple stories, testimonials        |

### Phase 2 Development Scope

- Authentication with Auth.js
- Customer dashboard
- Wishlist storage
- Order history
- Search functionality
- Gift finder logic
- Gift box builder logic
- Blog CMS with Sanity
- Payment result pages
- Order tracking
- Customer memory submissions

## 7. Phase 3 - Platform Expansion

Phase 3 turns B&V into a fuller platform, not just a store. The focus becomes own fashion collections, advanced jewelry line, AI stylist/gift finder, mobile app readiness, subscription boxes, international shipping, advanced love website services, and deeper personalization.

### Phase 3 Pages / Modules

- Love Website Builder
- Love Website Template Gallery
- Public Love Website Pages
- AI Stylist / Recommendations
- AI Gift Finder
- Subscription Box
- Ambassador Program
- Community Memory Wall Upload
- Advanced Admin Dashboard
- Analytics Dashboard
- Mobile App API-Ready Flows

### Phase 3 Key Features

| Feature                  | Purpose                                                       | Core Scope                                                                                                                              |
| ------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Love Website Builder     | Allow customers to create romantic/event websites             | Our Story, proposal, anniversary, wedding RSVP, birthday, scrapbook, guestbook, memory timeline                                         |
| AI Stylist / Gift Finder | Recommend outfits, jewelry, gifts, couple pairings, and boxes | Audience, occasion, budget, style, relationship type, category, delivery urgency                                                        |
| Subscription Box         | Recurring revenue and customer retention                      | Self-care box, jewelry box, couple box, birthday reminder box, seasonal gift box, anniversary box                                       |
| Ambassador Program       | Creator-led growth                                            | Fashion creators, jewelry creators, lifestyle creators, couple creators, gift/unboxing creators                                         |
| Advanced Admin Dashboard | Manage the full platform                                      | Products, collections, orders, custom requests, gift boxes, love websites, customers, content, reviews, campaigns, discounts, analytics |
| Analytics Dashboard      | Track sales and marketing performance                         | Sales, orders, top products, conversion rate, traffic sources, abandoned carts, custom requests, campaign performance, wishlist saves   |

### Phase 3 Development Scope

- AI recommendation engine
- Semantic product search
- Advanced admin dashboard
- Analytics dashboard
- Subscription engine
- Love website builder
- Public generated pages
- International shipping support
- API-ready mobile flows
- Redis/background jobs if needed

## 8. Phase 4 - Brand Expansion

Phase 4 moves beyond ecommerce into a larger lifestyle brand ecosystem. This should only happen after the online business proves product-market fit, repeat customers, strong social following, reliable fulfillment, trusted brand identity, profitable categories, and a clear luxury direction.

| Expansion Direction         | Strategic Meaning                                                     |
| --------------------------- | --------------------------------------------------------------------- |
| Physical studio / showroom  | Build trust, product experience, fittings, premium brand presence     |
| Photoshoot packages         | Turn the romantic lifestyle brand into an experience service          |
| Content production house    | Use brand aesthetics and social production capability commercially    |
| Cafe / showroom concept     | Combine lifestyle, community, product discovery, and content creation |
| Luxury jewelry line         | Move into higher-margin premium pieces                                |
| Premium fashion collections | Develop own identifiable B&V fashion identity                         |
| International expansion     | Scale products, fulfillment, and brand reach                          |

## 9. Recommended Build Order

### Current Focus

We are currently in Phase 1 - Design + MVP Planning. Do not jump into Phase 2 or Phase 3 implementation until the Phase 1 prototype and development foundation are stable.

| Step | Workstream                       | Tasks                                                                                                                                                                                      |
| ---- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Finalize Figma Phase 1 Prototype | Update brand name to B&V, broaden strategy, add Women/Men/Jewelry/Gifts/Couples/Custom, add Visual Portfolio & Collaboration Hub, refine light/dark themes, finalize responsive components |
| 2    | Prepare Development Foundation   | Create Next.js project, set up TypeScript, Tailwind, global CSS variables, next-themes, fonts, reusable layout, linting/formatting                                                         |
| 3    | Build Design System in Code      | Button, Input, Select, Badge, Card, Product Card, Category Card, Shoot Card, Navbar, Footer, Theme Toggle, Language Switch, Cart Drawer, Accordion, Toast, Modal, Section Container        |
| 4    | Build Phase 1 Pages              | Home, Shop, Collection, Product Detail, Cart Drawer, Cart Page, Checkout/Inquiry, Custom Orders, Love Websites, Visual Portfolio, Our Story, Contact, FAQ, Policies                        |
| 5    | Add Data Layer                   | Start static with TypeScript/JSON, then connect Prisma/PostgreSQL/Sanity/Cloudinary as needed                                                                                              |
| 6    | Test and Polish                  | Desktop, mobile, tablet, light/dark, language switch UI, cart, forms, filters, portfolio gallery, video modal, accessibility, performance, SEO metadata                                    |

## 10. Phase Gate Checklist

Before moving from Phase 1 to Phase 2, B&V should have the following in place:

- Homepage complete
- Shop flow complete
- Product page complete
- Cart flow complete
- Checkout / inquiry flow complete
- Custom order flow complete
- Love websites landing complete
- Visual Portfolio & Collaboration Hub complete
- Portfolio filters and shoot detail view complete
- Photo lightbox and video modal prototype complete
- Collaboration inquiry flow complete
- Creative consultation booking flow complete
- Event invitation flow complete
- Our Story complete
- Contact / FAQ / policies complete
- Mobile responsive design complete
- Light and dark theme stable
- Dark image overlays applied where text sits on images
- Basic SEO setup complete
- Analytics connected
- Initial product/content/shoot structure ready
- Social media links ready

## 11. Current Decision Summary and Working Rules

| Category                    | Current Decision                                                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand Name                  | B&V                                                                                                                                                 |
| Brand Category              | Modern Romantic Lifestyle Ecommerce Brand                                                                                                           |
| Audience                    | Individuals, couples, gift buyers, women fashion customers, men fashion customers, jewelry customers, custom order customers, collaboration clients |
| Primary Commerce            | Women, Men, Jewelry, Gifts, Couples, Custom                                                                                                         |
| Phase 1 Portfolio Direction | Visual Portfolio & Collaboration Hub - B&V as models, lifestyle creators, and humble creative collaborators, not photographers                      |
| Brand Promise               | Style for you. Gifts for them. Moments for two.                                                                                                     |
| Design Direction            | Lavender Luxury Romance                                                                                                                             |
| Dark Theme                  | Midnight Lavender Luxury                                                                                                                            |
| Typography                  | Playfair Display + Inter                                                                                                                            |
| Technology                  | Next.js, TypeScript, Tailwind CSS, Framer Motion, Prisma, PostgreSQL, Sanity, Cloudinary, PayHere, KOKO                                             |
| Current Phase               | Phase 1 - Launch / MVP Website                                                                                                                      |
| Immediate Work              | Finalize updated Figma prototype with Visual Portfolio, then start production-ready frontend development                                            |

### Final Working Rule

- Does this help B&V become a premium romantic lifestyle ecommerce brand?
- Does it support Women, Men, Jewelry, Gifts, Couples, Custom Orders, Love Websites, or Visual Portfolio/Collaboration?
- Does it feel lavender-led, premium, cinematic, warm, and emotionally engaging?
- Can it be implemented cleanly in Next.js with reusable components?
- Is it useful for Phase 1, or should it wait for Phase 2 / Phase 3?

## 12. Source References

| Source                                                | Used For                                                                                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| BV_Phase_Development_Reference.pdf                    | Base phase roadmap, Phase 1 launch scope, visual identity tokens, technology stack, phase gates                            |
| Couple Brand Business Ideas And Website Strategy v1.2 | Strategic pivot to modern romantic lifestyle brand and updated Visual Portfolio & Collaboration Hub positioning            |
| Brand Identity & Design System Reference v1.1         | Visual identity, color systems, typography, dark mode, design system rules, B&V monogram direction                         |
| Technology Stack & Tools Reference v1.0               | Approved technology stack, engineering philosophy, tools, future expansion direction                                       |
| Figma prototype update discussions                    | Phase 1-4 prototype direction, light/dark theme layout intent, admin/demo access requirements, Visual Portfolio correction |

### End of Phase Development Reference
