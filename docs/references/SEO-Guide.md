# B&V SEO Reference Guide

| Field               | Value                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Version             | 3.0                                                                                                   |
| Status              | Approved intent                                                                                       |
| Converted / updated | 2026-10-28                                                                                            |
| Based on            | BV_SEO_Reference_Guide_v3_0.pdf — supersedes the v1.0 text previously in docs/references/SEO-Guide.md |

> **Reference-library note.** Route names in Section 8 use `/portfolio` and `/collaborate`. The Phase 1 guide uses `/visual-portfolio`. The proposed resolution (D-07) adopts this guide's routes. The `buildMetadata` example is illustrative: verify `Metadata` fields against the local Next.js 16 docs in `node_modules/next/dist/docs/` before implementing.

### Complete Next.js Ecommerce SEO Architecture, Implementation, Content, Performance, Monitoring, Authority, and AI Search Reference

**Version 3.0 - Complete Reanalysis and Rewrite**

This edition was rebuilt after rechecking the original B&V SEO guide, the updated audit-adaptation discussion, the June 2026 Bilesma Natural SEO audit, the B&V business strategy, design system, technology stack, phase roadmap, database plan, and the previous Version 2.0 document.

| Reference Item   | Locked Direction                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Brand category   | Modern romantic lifestyle ecommerce brand                                                            |
| Brand promise    | Style for you. Gifts for them. Moments for two.                                                      |
| Primary market   | Sri Lanka first; future international and multilingual readiness                                     |
| Commercial scope | Women, Men, Jewelry, Gifts, Couples, Custom, Love Websites, Portfolio and Collaborations             |
| Approved stack   | Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Sanity, Cloudinary, Vercel/Railway |
| Core rule        | SEO is part of product architecture, content architecture, release QA, and growth operations         |

## Table of Contents

1. How to Use This Reference
2. Strategic SEO Direction and Objectives
3. Audit-Informed Coverage Matrix
4. SEO Governance, Ownership, Documentation, and Release Gates

PHASE 1 - RESEARCH, ARCHITECTURE, TECHNICAL FOUNDATION, AND LAUNCH READINESS 5. Audience, Search Journeys, and Search Intent 6. Keyword Research, Clustering, Mapping, and Cannibalization Control 7. Competitor, SERP, Market, and Content-Gap Research 8. Information Architecture, Navigation, Taxonomy, and URL Standards 9. Next.js Rendering, Metadata Architecture, and Content Delivery 10. Crawlability, Indexation, Robots, Sitemaps, Canonicals, Status Codes, and Redirects 11. Ecommerce Facets, Filters, Search, Pagination, Variants, and Duplicate Control 12. Core Web Vitals, Performance Budgets, Mobile UX, Accessibility, and Security 13. International, Multilingual, and Sri Lanka Market Readiness PHASE 2 - ON-PAGE, ECOMMERCE, META, CONTENT, MEDIA, SCHEMA, AND CONVERSION SEO 14. Meta SEO and Social Preview Architecture 15. Page-Type SEO: Homepage, Category, Collection, Product, Service, Portfolio, and Policy Pages 16. Product and Ecommerce SEO: Variants, Offers, Availability, Reviews, Shipping, Returns, and Merchant Feeds 17. Structured Data and Rich Result Architecture 18. Image, Video, Cloudinary, Google Images/Lens, and Portfolio Media SEO 19. Journal, Topic Clusters, Editorial Workflow, E-E-A-T, and Content Quality 20. Internal Linking, Breadcrumbs, Navigation, Related Content, and Conversion SEO 21. Local SEO, Contact Trust, Google Business Profile, and Offline Expansion 22. Social SEO, Brand Search Demand, Referral Traffic, Campaign Landing Pages, and Creator SEO PHASE 3 - ANALYTICS, AUDITS, AUTHORITY, AI SEARCH, AND CONTINUOUS GROWTH 23. GA4, Search Console, Ecommerce Events, Attribution, and KPI Architecture 24. Monitoring, Technical Crawls, Log Analysis, QA, and Incident Response 25. Content Refresh, Pruning, Consolidation, Seasonal SEO, and Experimentation 26. Backlinks, Digital PR, Partnerships, Mentions, Reputation, and Authority 27. AI Search Visibility, Entity SEO, Answer Engine Optimization, and Knowledge Consistency 28. Phase-Based B&V Implementation Plan 29. Final Definition of Done APPENDICES - Templates, Code Patterns, Checklists, Field Models, Dashboards, and Sources

## 1. How to Use This Reference

This is not a general SEO article. It is a working development reference for planning routes, designing data models, configuring Sanity, building Next.js templates, producing content, validating releases, and operating

| Use Stage          | How to Apply the Guide                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Before coding      | Validate target audiences, page purpose, keyword intent, taxonomy, route design, and data requirements.                       |
| During development | Implement rendering, metadata, schema, sitemap, robots, canonicals, image delivery, redirects, analytics, and accessibility.  |
| Before release     | Run page-template, mobile, performance, structured-data, indexation, and analytics acceptance checks.                         |
| After launch       | Monitor Search Console, GA4, Core Web Vitals, errors, content performance, backlinks, brand demand, and AI visibility.        |
| During expansion   | Revisit international SEO, language routing, location SEO, creator pages, portfolio case studies, and new product taxonomies. |

## 2. Strategic SEO Direction and Objectives

**Core Decision**

B&V must not be optimized only as a couple store. Search architecture must support solo women and men fashion customers, jewelry buyers, gift shoppers, couples, custom-order customers, love-website customers, portfolio visitors, and brand collaboration clients.

| SEO Objective     | Practical Meaning                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Discoverability   | Create indexable pages matching real commercial, informational, local, visual, and service searches.           |
| Qualified traffic | Attract visitors with the correct intent, not only high search volume.                                         |
| Revenue and leads | Connect SEO to product views, add-to-cart, checkout, purchases, custom inquiries, and collaboration inquiries. |
| Brand demand      | Use social, creators, PR, and memorable campaigns to increase branded searches and direct traffic.             |
| Trust             | Show accurate product, delivery, payment, policy, contact, review, and business information.                   |
| Performance       | Protect mobile experience and conversion through server-first rendering and optimized media.                   |
| Authority         | Earn reputable links, mentions, reviews, partnerships, and citations.                                          |
| AI visibility     | Make B&V factual, structured, consistent, answerable, and independently verifiable.                            |

## 3. Audit-Informed Coverage Matrix

The following matrix converts the real ecommerce audit findings into permanent B&V prevention standards.

| Audit Area     | Risk Observed in Mature Ecommerce Sites                            | B&V Prevention Standard                                                          |
| -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Technical SEO  | Crawl and sitemap issues remain unnoticed                          | Automated sitemap/robots tests, GSC verification, route-level index decisions    |
| On-page SEO    | Thin or duplicate titles and descriptions                          | Required CMS SEO fields, fallbacks, uniqueness reporting, preview tools          |
| Content        | Sparse blog and shallow product/category copy                      | Topic clusters, editorial calendar, deep commercial page templates               |
| Schema         | Product schema absent or invalid                                   | Server-rendered JSON-LD using live catalog data, automated validation            |
| Page speed     | Sliders, scripts, placeholders, and oversized images harm mobile   | Performance budget, one critical hero, Cloudinary, next/image, minimal hydration |
| Mobile UX      | Responsive layout exists but interaction and stability remain weak | Real-device testing, touch targets, stable layout, responsive filters and media  |
| Local SEO      | Address exists but profile/schema/NAP signals are incomplete       | Accurate contact/service area; GBP and LocalBusiness only when eligible          |
| Backlinks      | Brand has products but weak authority                              | PR, creators, suppliers, campaigns, guides, events, and linkable assets          |
| Social signals | Social profiles exist but links and campaigns are disconnected     | Campaign landing pages, UTM standards, OG previews, deep-link strategy           |
| Competitors    | Large brands dominate category and informational queries           | SERP-type research, niche long-tail entry, differentiated editorial assets       |
| AI visibility  | Brand facts are vague, inconsistent, or hard to cite               | Entity facts, structured FAQs, authoritative guides, consistent profiles         |
| Measurement    | Traffic is reported without clear commercial outcomes              | SEO revenue, lead, funnel, content-assist, and technical health dashboards       |

## 4. SEO Governance, Ownership, Documentation, and Release Gates

| Role             | Required Responsibility                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Business/Product | Page purpose, audience, product truth, commercial priority, offers, policies, and conversion goal     |
| SEO/Content      | Keyword map, SERP research, briefs, metadata, internal links, content quality, monitoring             |
| Frontend         | Server rendering, metadata, JSON-LD, links, image delivery, accessibility, Core Web Vitals            |
| Backend/Data     | Stable slugs, offer/stock truth, product snapshots, redirects, feeds, APIs, integrity                 |
| Sanity/CMS       | SEO field model, validation, preview, workflow, scheduled publishing, editorial ownership             |
| QA               | Index directives, metadata, schema, redirects, status codes, mobile, analytics, links, browser checks |
| DevOps           | Environment domains, deployment checks, headers, caching, uptime, rollback, observability             |

### 4.1 Required SEO Artifacts

- Master keyword and page map.
- Route and taxonomy register.
- Redirect register.
- Indexation rules register.
- Schema mapping by page type.
- Content calendar and brief library.
- Analytics event specification.
- SEO release checklist.
- Monthly issue log and optimization backlog.

**Release Gate**

No public page is complete because the visual design is finished. It is complete only after content, metadata, schema, indexability, internal links, media, accessibility, mobile behavior, performance, and analytics are verified.

## PHASE 1 - RESEARCH, ARCHITECTURE, TECHNICAL FOUNDATION, AND LAUNCH READINESS

## 5. Audience, Search Journeys, and Search Intent

| Audience             | Search Journey                                                  | Needed B&V Pages                                      |
| -------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| Women shoppers       | Inspiration -> category -> collection -> product -> purchase    | Women, style edits, product pages, size/care guides   |
| Men shoppers         | Essentials/style search -> product comparison -> purchase       | Men, essentials, product pages, fit guides            |
| Jewelry buyers       | Occasion/material/personalization research -> product           | Jewelry, promise rings, engraving, care, gift pages   |
| Gift buyers          | Recipient/occasion/budget problem -> recommendation -> purchase | Gift hub, occasion pages, guides, gift finder         |
| Couples              | Matching/coordinated idea -> collection -> product              | Couples hub, date-night edits, jewelry, custom pieces |
| Custom customers     | Research process/cost/timing -> examples -> inquiry             | Custom hub, process, FAQ, portfolio, inquiry          |
| Love website clients | Understand service -> compare examples -> inquiry               | Love Websites, templates/examples, process, FAQ       |
| Brands/events        | Find models/creators -> inspect work -> contact                 | Portfolio, case studies, collaboration page           |

### Intent Classification

| Intent                   | Page Response                                              |
| ------------------------ | ---------------------------------------------------------- |
| Navigational             | Clear brand/entity pages and sitelink-friendly navigation  |
| Commercial investigation | Comparison, collections, detailed category pages, guides   |
| Transactional            | Product/service pages with availability, price, trust, CTA |
| Informational            | Journal guides, FAQs, care, styling, sizing, gifting       |
| Local                    | Contact, service area, location pages when real            |
| Visual                   | Optimized product, campaign, lookbook, and portfolio media |

## 6. Keyword Research, Clustering, Mapping, and Cannibalization Control

### 6.1 Research Inputs

- Ubersuggest keyword ideas, difficulty, competitors, and backlinks.
- Google Trends for seasonality and regional interest.
- Manual Google SERPs, autocomplete, related searches, image/video results, and shopping results.
- Search Console queries after launch.
- On-site search terms and zero-result searches.
- Customer messages, WhatsApp inquiries, comments, reviews, and support questions.
- Social captions, creator comments, and recurring audience language.

### 6.2 Keyword Map Fields

| Field              | Required Detail                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| Primary query      | One dominant intent                                                      |
| Secondary concepts | Close synonyms/entities, not unrelated keyword stuffing                  |
| Page type          | Home, category, collection, product, article, service, portfolio, policy |
| Funnel stage       | Awareness, consideration, conversion, retention                          |
| Audience           | Women, men, gift buyer, couple, custom, collaborator                     |
| Market/language    | Sri Lanka English initially; future Sinhala/Tamil/international          |
| SERP type          | Category, product, guide, local, image, video, marketplace               |
| Owner/status       | Planned, writing, development, published, refresh                        |
| Success measure    | Impressions, clicks, revenue, leads, rankings, assists                   |

### 6.3 Cannibalization Rules

- One primary intent per indexable page.
- Merge pages that provide the same purpose and audience response.
- Differentiate category, collection, product, and guide intent clearly.
- Do not create a new seasonal page each year if one evergreen URL can be updated.
- Use Search Console page-query reports to detect multiple pages competing for the same query.

## 7. Competitor, SERP, Market, and Content-Gap Research

| Research Area    | Questions                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| SERP composition | Are winners categories, products, marketplaces, guides, social posts, videos, or local results? |
| Rich features    | Are products, prices, ratings, images, videos, FAQs, snippets, or local packs shown?            |
| Commercial depth | What filters, subcategories, content blocks, reviews, and trust sections exist?                 |
| Content quality  | What questions and topics are covered or missing?                                               |
| Visual quality   | What image style, filename, context, and portfolio depth appear?                                |
| Authority        | Which publications, creators, directories, or partners link to competitors?                     |
| Brand demand     | Do competitors have strong branded searches, reviews, and consistent profiles?                  |

### Opportunity Prioritization

| Score Factor          | Meaning                                                           |
| --------------------- | ----------------------------------------------------------------- |
| Business value        | Revenue, lead, margin, strategic importance                       |
| Search opportunity    | Demand, trend, gap, attainable difficulty                         |
| Page readiness        | Products, content, media, trust, inventory available              |
| Competitive advantage | Original story, custom capability, visual assets, local relevance |
| Effort                | Development, content, photography, outreach required              |

## 8. Information Architecture, Navigation, Taxonomy, and URL Standards

| Page Type     | Recommended Route   | Primary Role                         |
| ------------- | ------------------- | ------------------------------------ |
| Home          | /                   | Brand entity, broad discovery, trust |
| Shop          | /shop               | All-product discovery                |
| Women         | /women              | Women commercial pillar              |
| Men           | /men                | Men commercial pillar                |
| Jewelry       | /jewelry            | Jewelry commercial pillar            |
| Gifts         | /gifts              | Gift-by-occasion/recipient hub       |
| Couples       | /couples            | Signature couple pillar              |
| Custom        | /custom             | Custom product/service hub           |
| Love Websites | /love-websites      | Digital service hub                  |
| Portfolio     | /portfolio          | Visual work discovery                |
| Collaborate   | /collaborate        | Lead generation                      |
| Journal       | /journal            | Editorial authority                  |
| Products      | /products/[slug]    | Stable product canonical             |
| Collections   | /collections/[slug] | Focused commercial landing           |
| Article       | /journal/[slug]     | Informational authority              |

### 8.1 Taxonomy Rules

- Separate navigational categories from filter attributes.
- Use categories for durable shopper destinations; use attributes for filtering.
- Do not create indexable pages for every color, size, price, and sort combination.
- Create curated SEO landing pages only for validated combinations such as promise rings or anniversary gifts.
- Keep slugs stable and independent from internal database identifiers.

### 8.2 URL Rules

- Lowercase ASCII slugs with hyphens.
- Short, human-readable, canonical paths.
- No session IDs, database IDs, or unnecessary parameters.
- Permanent changes require 301 redirects.
- Removed pages return true 404/410 unless a relevant replacement exists.

## 9. Next.js Rendering, Metadata Architecture, and Content Delivery

| Concern        | B&V Standard                                                       |
| -------------- | ------------------------------------------------------------------ |
| Public pages   | Server Components with static generation/ISR where suitable        |
| Personal pages | Dynamic rendering; noindex utility/account/checkout pages          |
| Metadata       | Root defaults plus generateMetadata for dynamic pages              |
| CMS content    | Sanity preview for editors; published content rendered server-side |
| Catalog data   | Prisma/PostgreSQL as transactional truth                           |
| Media          | Cloudinary URLs and transformations rendered through next/image    |
| Revalidation   | Trigger on product/category/article changes                        |
| Error states   | notFound(), correct status codes, no soft 404s                     |

```text
// src/lib/seo/buildMetadata.ts
import type { Metadata } from "next";
type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  noIndex?: boolean;
};
export function buildMetadata(input: SeoInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: {
      index: !input.noIndex,
      follow: !input.noIndex,
    },
    openGraph: {
      type: "website",
      siteName: "B&V",
      url: input.path,
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: input.image ? [input.image.url] : undefined,
    },
  };
}
```

## 10. Crawlability, Indexation, Robots, Sitemaps, Canonicals, Status Codes, and Redirects

### 10.1 robots.txt vs noindex

**Important Difference**

robots.txt controls crawling, while noindex controls whether an accessible page may be indexed. Do not block a URL in robots.txt when Google must crawl it to see a noindex directive.

| URL Type                    | Robots/Index Decision                                   |
| --------------------------- | ------------------------------------------------------- |
| Published commerce/content  | Index, follow; include in sitemap                       |
| Cart/checkout/account/login | Noindex; exclude from sitemap                           |
| Admin/API/private callbacks | Protect/authenticate; disallow sensitive paths          |
| Preview/staging             | Noindex plus environment protection                     |
| Internal search             | Noindex; crawl policy based on resource use             |
| Filters/sorts               | Usually noindex or canonicalized; not in sitemap        |
| UTM URLs                    | Canonical to clean page                                 |
| Expired campaign            | Update evergreen page, redirect, or 410 depending value |

### 10.2 Sitemap Architecture

- Generate canonical URLs only.
- Split sitemaps by type when scale requires: products, collections, categories, journal, services, portfolio.
- Use lastModified only when meaningful content changes.
- Exclude redirects, noindex pages, error pages, parameter URLs, carts, accounts, and unpublished content.
- Submit sitemap index to Search Console and monitor discovery/indexing differences.

### 10.3 Status and Redirect Rules

| Situation                               | Correct Response                             |
| --------------------------------------- | -------------------------------------------- |
| Permanent move                          | 301                                          |
| Temporary campaign redirect             | 302/307 when genuinely temporary             |
| Missing page                            | 404                                          |
| Permanently removed without replacement | 410                                          |
| Unavailable due to legal reason         | 451 if applicable                            |
| Server failure                          | 5xx; never return 200 with an error screen   |
| Out-of-stock but returning              | 200 with useful page and availability status |

## 11. Ecommerce Facets, Filters, Search, Pagination, Variants, and Duplicate Control

| Feature                  | SEO Rule                                                                   |
| ------------------------ | -------------------------------------------------------------------------- |
| Color/size filters       | User-facing filters; not automatically indexable                           |
| Price/sort               | Noindex/canonical to base category                                         |
| Curated facet page       | Unique URL/content only after keyword validation                           |
| Pagination               | Crawlable links, self-canonical pages, unique product sets                 |
| Infinite scroll          | Provide paginated crawlable URLs beneath the experience                    |
| On-site search           | Noindex; record queries for merchandising/content opportunities            |
| Product variants         | Usually one canonical product page; include selectable offers/variants     |
| Variant-specific landing | Only when variant has independent demand, content, availability, and value |
| Duplicate product copy   | Require unique value and specs; avoid supplier boilerplate                 |

### Variant Decision Example

**Default**

A lavender and ivory color option should normally remain on one product URL. Create separate indexable pages only when the variant represents a meaningfully distinct searched product and can support unique content and stock.

## 12. Core Web Vitals, Performance Budgets, Mobile UX, Accessibility, and Security

| Metric/Area   | Target Direction                 | Implementation                                                               |
| ------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| LCP           | Fast hero/product main image     | One critical image, proper sizes, Cloudinary, preload only true LCP          |
| INP           | Responsive filters, menus, cart  | Minimal client JS, selective hydration, efficient handlers                   |
| CLS           | Stable banners, fonts, galleries | Explicit dimensions, reserved space, next/font                               |
| TTFB          | Fast server response             | Caching, ISR, optimized database/CMS queries                                 |
| Mobile        | Primary test environment         | Touch-friendly controls, bottom sheets, responsive filters, compressed media |
| Accessibility | Semantic and operable UI         | Heading order, labels, keyboard, contrast, focus, alt text                   |
| Security      | Trust and crawl stability        | HTTPS, secure headers, protected admin, no leaked preview/private content    |

### 12.1 Performance Budget

- No plugin-style heavy multi-slide homepage carousel.
- No autoplay background video on mobile first viewport.
- Limit third-party tags and load non-essential scripts after consent/interaction.
- Use responsive image breakpoints and quality rules by context.
- Lazy-load below-fold galleries and video.
- Track field Core Web Vitals, not only lab scores.

### 12.2 Accessibility and SEO

- One logical H1 and nested headings.
- Descriptive link text and button labels.
- Visible focus states in light and dark themes.
- Color contrast verified; brand lavender must not override readability.
- Product options, filters, menus, dialogs, and carousels keyboard accessible.
- Captions/transcripts for important videos where appropriate.

## 13. International, Multilingual, and Sri Lanka Market Readiness

| Stage                   | Decision                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Initial launch          | English-first, Sri Lanka targeting, LKR, LK delivery and policies                                     |
| Language switch         | Do not translate only interface labels; translated indexable pages need complete content and metadata |
| URL strategy            | Use stable locale paths such as /en, /si, /ta when multilingual SEO launches                          |
| hreflang                | Add reciprocal language/region annotations only for equivalent pages                                  |
| Currency/market         | Avoid generating duplicate indexable currency URLs without market value                               |
| International expansion | Create market-specific shipping, currency, policy, product availability, and content                  |

**Multilingual Rule**

A language toggle alone is not multilingual SEO. Every indexed locale requires translated titles, descriptions, headings, content, alt text, structured data, canonicals, and hreflang relationships.

## PHASE 2 - ON-PAGE, ECOMMERCE, META, CONTENT, MEDIA, SCHEMA, AND CONVERSION SEO

## 14. Meta SEO and Social Preview Architecture

| Element            | B&V Rule                                                             |
| ------------------ | -------------------------------------------------------------------- |
| Title              | Unique, intent-led, readable; brand through title template           |
| Meta description   | Persuasive summary; not keyword stuffing; unique where important     |
| Canonical          | Absolute preferred URL matching index strategy                       |
| Robots meta        | Intentional index/follow controls                                    |
| Open Graph         | Title, description, image, URL, type, siteName, locale               |
| Twitter/X          | Large image card for shareable pages                                 |
| Icons              | Consistent favicon, Apple icon, social identity                      |
| Verification       | Search Console and approved platform verification tags               |
| Special directives | Use max-image-preview, nosnippet, noarchive only with a clear reason |

### 14.1 Metadata Length and Quality

- Do not enforce character counts as rigid ranking rules; preview truncation and prioritize clarity.
- Place distinctive value early.
- Avoid repeating the same description across products.
- Do not insert unsupported claims, fake urgency, or unavailable offers.
- Google may rewrite snippets; improve page clarity rather than forcing exact text.

### 14.2 Examples

| Page                | Example                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Home title          | B&V \| Romantic Fashion, Jewelry and Meaningful Gifts                                                                    |
| Women title         | Women's Fashion in Sri Lanka \| B&V                                                                                      |
| Jewelry description | Explore gift-ready rings, necklaces and bracelets for everyday style, birthdays, anniversaries and personalized moments. |
| Product title       | Lavender Initial Necklace \| B&V                                                                                         |
| Portfolio title     | B&V Visual Portfolio \| Lifestyle Models and Creators                                                                    |

## 15. Page-Type SEO: Homepage, Category, Collection, Product, Service, Portfolio, and Policy Pages

| Page Type      | Required Content                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Homepage       | Brand definition, H1, category links, offers, trust, story, journal/portfolio discovery        |
| Category       | H1, concise intro, subcategories, product grid, editorial support, FAQs, guides                |
| Collection     | Focused intent, unique intro, product list, styling/gift context, FAQs                         |
| Product        | Unique story, specs, options, sizing, care, gifting, delivery, returns, FAQs, related products |
| Custom service | Process, examples, required information, timelines, pricing guidance where possible, inquiry   |
| Love Websites  | Use cases, features, examples, process, FAQ, inquiry                                           |
| Portfolio      | Context around visuals, roles, campaign type, location when relevant, CTA                      |
| Collaboration  | Who B&V works with, services, process, portfolio proof, inquiry form                           |
| Our Story      | Concrete entity facts, people, mission, brand promise, contact/social consistency              |
| Policy         | Clear, current, accessible payment, shipping, return, privacy, and terms information           |

## 16. Product and Ecommerce SEO: Variants, Offers, Availability, Reviews, Shipping, Returns, and Merchant Feeds

### 16.1 Product Content Model

| Field             | SEO Purpose                                                    |
| ----------------- | -------------------------------------------------------------- |
| Product name      | Primary product identity                                       |
| Slug              | Stable canonical URL                                           |
| Short description | Above-fold clarity and metadata fallback                       |
| Long description  | Unique benefits, use, style, story                             |
| Specifications    | Material, dimensions, fit, color, care                         |
| Variant data      | SKU, price, stock, selected attributes                         |
| Images            | Primary, gallery, dimensions, alt text, Cloudinary ID          |
| Gift fields       | Packaging, occasion, message, recipient suitability            |
| Delivery/returns  | Trust and conversion                                           |
| SEO fields        | Title, description, canonical override, OG image, index status |

### 16.2 Availability and Lifecycle

| State                            | Recommended SEO Treatment                                             |
| -------------------------------- | --------------------------------------------------------------------- |
| In stock                         | Index; accurate Offer availability                                    |
| Preorder                         | Index; clearly state date/conditions; use PreOrder availability       |
| Temporarily out of stock         | Keep useful page indexed if returning                                 |
| Discontinued with equivalent     | 301 to best replacement when intent is preserved                      |
| Discontinued without replacement | Keep temporarily for alternatives or return 410 when no value remains |
| Seasonal                         | Use evergreen URL and refresh rather than creating yearly duplicates  |

### 16.3 Reviews

- Publish only authentic reviews.
- Show review date, rating, text, and relevant product context.
- Moderate spam without deleting legitimate criticism.
- Add AggregateRating/review schema only after real visible reviews exist.
- Use customer photos/memories with permission and descriptive context.

### 16.4 Product Feeds and Shopping Ecosystem

- Design product data so a future Google Merchant Center/free listings feed can include ID, title, description, link, image link, availability, price, brand, condition, GTIN/MPN where applicable, shipping, and return policy.
- Keep feed values consistent with landing pages.
- Use variant IDs and item_group_id consistently.
- Monitor disapprovals, price mismatch, unavailable landing pages, and image problems.
- Do not depend on Merchant Center as a replacement for organic product-page SEO.

## 17. Structured Data and Rich Result Architecture

| Schema                 | Use                                                           |
| ---------------------- | ------------------------------------------------------------- |
| Organization           | Global brand identity, logo, sameAs, contact                  |
| WebSite                | Site entity and optional valid search action                  |
| BreadcrumbList         | Hierarchy on all deep pages                                   |
| Product                | Product identity, images, brand, SKU                          |
| Offer/AggregateOffer   | Price, currency, availability, condition, URL                 |
| Review/AggregateRating | Only authentic visible reviews                                |
| ItemList               | Visible ordered product lists when useful                     |
| CollectionPage         | Category/collection semantic context                          |
| Article/BlogPosting    | Journal content with author and dates                         |
| FAQPage                | Visible Q&A only; no guaranteed rich result                   |
| VideoObject            | Important indexed videos                                      |
| LocalBusiness          | Only when real public location is eligible                    |
| Service                | Custom, love website, collaboration service where appropriate |

### 17.1 Schema Validation Rules

- Schema must match visible content and source-of-truth data.
- Do not add hidden, fake, stale, or unavailable information.
- Validate in Google Rich Results Test and Schema.org validator.
- Add automated tests for required product offer fields.
- Track Search Console enhancement errors after release.
- Use one coherent graph rather than contradictory duplicate markup.

```text
// Product JSON-LD should be created from live product/variant data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${siteUrl}/products/${product.slug}#product`,
  name: product.name,
  description: product.shortDescription,
  image: product.images.map((image) => image.url),
  sku: variant.sku,
  brand: { "@type": "Brand", name: "B&V" },
  offers: {
    "@type": "Offer",
    url: `${siteUrl}/products/${product.slug}`,
    priceCurrency: product.currencyCode,
    price: variant.price.toFixed(2),
    availability: variant.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
  },
};
```

## 18. Image, Video, Cloudinary, Google Images/Lens, and Portfolio Media SEO

| Area               | Standard                                                                         |
| ------------------ | -------------------------------------------------------------------------------- |
| Filename/public ID | Readable context where practical                                                 |
| Alt text           | Describe purpose/content, not decorative keywords                                |
| Width/height       | Known dimensions or aspect ratio to prevent CLS                                  |
| Responsive sizes   | Correct sizes attribute and Cloudinary breakpoints                               |
| Format             | AVIF/WebP where supported                                                        |
| Compression        | Context-based quality; do not sacrifice jewelry/product detail                   |
| LCP media          | Priority/preload only when truly above-fold critical                             |
| Gallery            | Lazy-load below fold                                                             |
| Decorative imagery | Empty alt text                                                                   |
| Dark theme         | Prefer one optimized source with overlay over duplicated image inventories       |
| Video              | Poster, compression, captions/transcript where useful, no mobile autoplay burden |
| Image sitemap      | Consider when image discovery becomes strategically important                    |

### 18.1 Google Images and Lens Readiness

- Use high-quality product images with clear subject and contextual lifestyle images.
- Place useful text near images and maintain descriptive product data.
- Allow large image previews unless there is a specific reason not to.
- Keep image URLs stable.
- Use multiple angles, detail shots, packaging, and scale/context images.
- Ensure important images are in rendered HTML and not hidden only inside client-only galleries.

## 19. Journal, Topic Clusters, Editorial Workflow, E-E-A-T, and Content Quality

| Pillar                  | Commercial Connection                     |
| ----------------------- | ----------------------------------------- |
| Gift guides             | Gifts, occasion collections, custom boxes |
| Jewelry education       | Jewelry products, promise rings, care     |
| Women styling           | Women categories and collections          |
| Men styling             | Men categories and collections            |
| Couple style            | Couples collections                       |
| Custom education        | Custom inquiry pages                      |
| Love website education  | Love Websites service                     |
| Portfolio/collaboration | Portfolio and Collaborate pages           |
| Brand/process stories   | Our Story, trust, product launches        |

### 19.1 E-E-A-T and Editorial Quality

- Show first-hand product knowledge, original photography, process details, and real examples.
- Use named authors where appropriate and maintain author/profile consistency.
- State publish and meaningful update dates.
- Reference reliable sources when making factual claims.
- Do not publish health, legal, or financial claims outside qualified expertise.
- Do not mass-produce generic AI content.
- Make every article substantially useful beyond what is already available in search.

### 19.2 Editorial Workflow

1. Research intent and SERP type.
2. Create brief: audience, questions, sections, examples, products, links, CTA.
3. Write original content in B&V voice.
4. Review factual accuracy, brand fit, accessibility, and legal risk.
5. Prepare metadata, social image, structured data, and internal links.
6. Publish, inspect rendered page, request indexing for high-priority content.
7. Monitor and update based on Search Console and commercial results.

## 20. Internal Linking, Breadcrumbs, Navigation, Related Content, and Conversion SEO

| Source     | Link Targets                                                     |
| ---------- | ---------------------------------------------------------------- |
| Homepage   | All pillars, priority campaigns, Journal, Portfolio, trust pages |
| Category   | Subcategories, collections, guides, sibling categories           |
| Collection | Products, parent category, related collections, guides           |
| Product    | Parent category, care/size/gift guide, related products          |
| Journal    | Relevant products, categories, services, related articles        |
| Portfolio  | Collaboration page, related case studies, services               |
| Footer     | Core categories, services, support, policies, contact            |

- Keep important pages within a reasonable click depth.
- Use descriptive anchor text.
- Prevent orphan pages.
- Ensure JS interactions do not replace real crawlable links.
- Use breadcrumbs for users and BreadcrumbList schema.
- Link informational content to commercial pages naturally and visibly.

## 21. Local SEO, Contact Trust, Google Business Profile, and Offline Expansion

| Stage                     | Action                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Online-only launch        | Accurate business name, email, phone/WhatsApp, service area, delivery area, support hours                  |
| Eligible business profile | Create and verify Google Business Profile with correct category, hours, photos, website, products/services |
| NAP consistency           | Match name/address/phone across site and trusted profiles                                                  |
| Reviews                   | Request authentic reviews and respond professionally                                                       |
| Physical showroom         | Create unique location page, LocalBusiness schema, directions, appointments, photos                        |
| Multiple locations        | One useful page per real location; no doorway pages                                                        |

**Local Integrity Rule**

Do not publish a fake address or LocalBusiness markup merely to rank locally.

## 22. Social SEO, Brand Search Demand, Referral Traffic, Campaign Landing Pages, and Creator SEO

- Every significant social campaign should have a matching permanent landing page.
- Every drop should use an indexable collection page when it has lasting search value.
- Use standardized UTM source, medium, campaign, content, and creator parameters.
- Create platform-ready Open Graph images.
- Encourage partners to deep-link to the relevant B&V page.
- Repurpose strong social questions into guides, FAQs, and landing-page content.
- Track branded query growth after campaigns.
- Build creator profile/campaign pages only when they have unique content and lasting value.

## PHASE 3 - ANALYTICS, AUDITS, AUTHORITY, AI SEARCH, AND CONTINUOUS GROWTH

## 23. GA4, Search Console, Ecommerce Events, Attribution, and KPI Architecture

### 23.1 GA4 Events

| Event                           | Use                                       |
| ------------------------------- | ----------------------------------------- |
| view_item_list                  | Category/collection impression            |
| select_item                     | Product selection                         |
| view_item                       | Product detail view                       |
| add_to_wishlist                 | Wishlist                                  |
| add_to_cart                     | Cart action                               |
| view_cart                       | Cart viewed                               |
| begin_checkout                  | Checkout start                            |
| add_shipping_info               | Shipping step                             |
| add_payment_info                | Payment selection                         |
| purchase                        | Confirmed purchase                        |
| generate_lead                   | Custom/love website/collaboration inquiry |
| search                          | On-site search                            |
| view_promotion/select_promotion | Campaign banner and promotion tracking    |

### 23.2 KPI Dashboard

| Dimension   | KPIs                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| Visibility  | Impressions, clicks, CTR, average position, query coverage                 |
| Indexation  | Submitted vs indexed, excluded reasons, sitemap status                     |
| Content     | Non-brand clicks, topic-cluster growth, article-assisted conversions       |
| Commerce    | Organic revenue, CVR, add-to-cart, checkout, AOV, product/category revenue |
| Leads       | Custom, love website, collaboration leads from organic                     |
| Brand       | Branded impressions/clicks, direct traffic, social/referral assists        |
| Performance | Field LCP, INP, CLS by template/device                                     |
| Schema      | Valid items, warnings, errors, rich result impressions                     |
| Authority   | Referring domains, mentions, link-assisted traffic                         |
| Local       | Profile actions and local queries when applicable                          |

## 24. Monitoring, Technical Crawls, Log Analysis, QA, and Incident Response

| Cadence             | Tasks                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Every deployment    | Metadata/schema smoke tests, robots/sitemap diff, broken-link check, analytics, Core Web Vitals guard |
| Weekly after launch | Indexing errors, 404s, server issues, top page/query movement, conversion anomalies                   |
| Monthly             | Full crawl, keyword map update, content opportunities, internal links, product lifecycle review       |
| Quarterly           | Competitor, backlink, content quality, schema, performance, local, and AI visibility audit            |
| Campaign launch     | Landing page, feed/offer, UTM, OG preview, inventory, speed, schema, conversion                       |
| Major migration     | Redirect mapping, pre/post crawl, sitemap diff, log monitoring, GSC inspection                        |

### 24.1 Server Log Analysis

- Use logs later to understand how Googlebot reaches important and wasteful URLs.
- Identify repeated crawling of filters, parameters, redirects, 404s, and slow pages.
- Verify new sections are crawled.
- Do not use logs as the only source; combine with Search Console and crawls.

### 24.2 Incident Severity

| Severity | Examples                                                                                     | Response               |
| -------- | -------------------------------------------------------------------------------------------- | ---------------------- |
| Critical | Global noindex, robots block, wrong canonical domain, site outage                            | Immediate rollback/fix |
| High     | Product schema broken sitewide, major section omitted from sitemap, severe mobile regression | Same sprint            |
| Medium   | Duplicate metadata, orphan pages, weak page copy                                             | Planned sprint         |
| Low      | Minor alt improvements, small link opportunities                                             | Backlog                |

## 25. Content Refresh, Pruning, Consolidation, Seasonal SEO, and Experimentation

- Refresh pages when products, prices, policies, screenshots, or search intent change.
- Consolidate overlapping articles and redirect weaker duplicates.
- Prune/noindex thin pages that provide no user or strategic value.
- Keep evergreen seasonal URLs and update annually.
- Use Search Console to identify high-impression low-CTR pages for metadata/content improvement.
- Use tests carefully; do not change URL, title, content, and layout simultaneously when learning matters.
- Record every major SEO change and expected outcome.

## 26. Backlinks, Digital PR, Partnerships, Mentions, Reputation, and Authority

| Authority Asset    | B&V Opportunity                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| Original guides    | Gift reports, size guides, jewelry care, occasion calendars              |
| Campaigns          | Restaurant, fashion, jewelry, event, and creator collaborations          |
| Visual assets      | Original editorial lookbooks and portfolio case studies                  |
| Community          | Charity, local event, university/fashion community participation         |
| Suppliers/partners | Authorized stockist, packaging, payment, delivery, creator pages         |
| Press              | Brand launch, unique love websites, custom experiences, social campaigns |

- Prioritize relevance and editorial quality over link count.
- Avoid paid link networks, spam directories, and manipulative anchors.
- Track brand mentions even when unlinked and request links when appropriate.
- Monitor reputation, review quality, and misinformation.

## 27. AI Search Visibility, Entity SEO, Answer Engine Optimization, and Knowledge Consistency

| Requirement            | B&V Implementation                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Entity clarity         | Consistent brand name, description, logo, founders/people where public, URL, profiles |
| Answerable content     | Clear definitions, process, prices/ranges where possible, delivery, policies, FAQs    |
| Independent validation | Press, creator, partner, customer, and directory references                           |
| Structured data        | Organization, products, articles, services, breadcrumbs                               |
| Original expertise     | First-hand guides, original visuals, custom process, campaign cases                   |
| Freshness              | Accurate products, availability, policies, dates, contact information                 |
| Citation readiness     | Concise factual passages and well-structured pages                                    |

**AI Search Principle**

B&V should preserve its romantic editorial voice while ensuring that important facts are explicit, structured, current, and independently verifiable.

## 28. Phase-Based B&V Implementation Plan

| Phase              | Must-Have SEO Work                                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 - MVP      | Keyword/page map; route architecture; metadata; sitemap; robots; canonicals; redirects; schema; image pipeline; performance budget; GA4/GSC; launch QA; contact and policy trust |
| Phase 2 - Growth   | Journal; occasion pages; deeper categories; FAQs; reviews; gift finder content; creator/campaign landing pages; Merchant feed readiness; local profile when eligible             |
| Phase 3 - Platform | International/hreflang; AI visibility; ambassador links; semantic search data; advanced dashboards; log analysis; subscriptions and new schema                                   |
| Phase 4 - Physical | Location pages; Google Business Profiles; LocalBusiness; showroom/appointment SEO; event/studio authority; local citations                                                       |

## 29. Final Definition of Done

- [ ] Clear audience and search intent.
- [ ] Correct page type and stable URL.
- [ ] Unique title, description, canonical, H1, and social preview.
- [ ] Intentional index/noindex, sitemap, and crawl decision.
- [ ] Valid structured data matching visible live data.
- [ ] Optimized accessible images/video with stable layout.
- [ ] Useful original content and trust information.
- [ ] Internal links and breadcrumbs.
- [ ] Mobile, accessibility, browser, performance, status-code, and redirect QA.
- [ ] GA4 and Search Console readiness.
- [ ] Commercial goal and KPI identified.

## APPENDIX A - Developer Launch Checklist

- [ ] Production domain and HTTPS correct
- [ ] metadataBase uses production domain
- [ ] Staging and previews protected/noindexed
- [ ] robots.txt reviewed
- [ ] sitemap.xml reviewed and submitted
- [ ] All public templates have title, description, canonical, H1
- [ ] All private/utility templates excluded/noindexed
- [ ] Filters, sorts, parameters, pagination documented
- [ ] Product/Offer/Breadcrumb/Organization/WebSite schema valid
- [ ] Article/FAQ/Video/Service/LocalBusiness schema used only where valid
- [ ] Cloudinary transformations and next/image sizes verified
- [ ] LCP image verified; no heavy mobile hero video
- [ ] 404/410/301 behavior tested
- [ ] Internal links and breadcrumbs tested
- [ ] GA4 ecommerce and lead events tested once
- [ ] GSC ownership and URL inspection completed
- [ ] Rich Results Test and Meta SEO Inspector completed
- [ ] Mobile Chrome, Safari, Android WebView tests completed
- [ ] Accessibility/contrast/keyboard checks completed
- [ ] Policies, contact, delivery, payments, returns published

## APPENDIX B - Sanity/Catalog SEO Field Model

| Content Type | Required Fields                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product      | slug, name, short/long description, SEO title/description, social image, index status, canonical override, images+alt, SKU, price, currency, stock, lifecycle |
| Category     | slug, H1, intro, SEO title/description, social image, body blocks, FAQs, index status                                                                         |
| Collection   | slug, H1, description, target intent, products, editorial block, FAQs, social image                                                                           |
| Article      | slug, title, excerpt, body, author, publish/update dates, SEO fields, social image, related products/pages                                                    |
| Service      | slug, H1, summary, process, examples, FAQs, inquiry CTA, SEO fields                                                                                           |
| Portfolio    | slug, title, campaign type, role, date/location, text context, media+alt, CTA, SEO fields                                                                     |

## APPENDIX C - Page Brief Template

| Field                              | Entry |
| ---------------------------------- | ----- |
| URL/working title                  |       |
| Audience and search intent         |       |
| Primary/secondary queries          |       |
| SERP type and competitors          |       |
| Page type                          |       |
| H1 and required sections           |       |
| Products/services/content required |       |
| Trust and conversion elements      |       |
| Internal links                     |       |
| Schema                             |       |
| Metadata/social image              |       |
| Index/canonical/sitemap decision   |       |
| Analytics events/KPI               |       |
| Owner/status/review date           |       |

## APPENDIX D - Next.js File Architecture

```text
src/
  app/
    layout.tsx
    sitemap.ts
    robots.ts
    manifest.ts
    opengraph-image.tsx
    products/[slug]/page.tsx
    collections/[slug]/page.tsx
    journal/[slug]/page.tsx
  components/seo/
    JsonLd.tsx
    Breadcrumbs.tsx
  lib/seo/
    buildMetadata.ts
    canonicals.ts
    robots.ts
    schema/
      organization.ts
      website.ts
      product.ts
      breadcrumb.ts
      article.ts
      service.ts
  lib/analytics/
    events.ts
  lib/cloudinary/
    image.ts
  config/
    redirects.ts
```

## APPENDIX E - SEO Toolchain

| Tool                  | Use                                                             |
| --------------------- | --------------------------------------------------------------- |
| Google Search Console | Indexing, queries, enhancements, sitemaps, Core Web Vitals      |
| Google Analytics 4    | Acquisition, ecommerce funnel, revenue, lead tracking           |
| Ubersuggest           | Keywords, competitors, backlinks, content planning              |
| Google Trends         | Seasonality and regional demand                                 |
| PageSpeed Insights    | Field and lab performance                                       |
| Lighthouse            | Development performance, accessibility, SEO checks              |
| Rich Results Test     | Google-supported structured data                                |
| Schema.org Validator  | General structured data                                         |
| Meta SEO Inspector    | Rendered metadata, headings, schema, links                      |
| Browser DevTools      | Network, rendering, performance, accessibility                  |
| Crawler later         | Site-wide metadata, links, status codes, canonicals, directives |

## APPENDIX F - Reanalysis Coverage Confirmation

| Previously Discussed Topic                        | Included in v3.0 |
| ------------------------------------------------- | ---------------- |
| Keyword research and mapping                      | Yes              |
| Meta tags and special tags                        | Yes              |
| Open Graph/Twitter/social previews                | Yes              |
| Blogs and content strategy                        | Yes              |
| Image optimization                                | Yes              |
| SEO monitoring tools                              | Yes              |
| Bilesma audit lessons                             | Yes              |
| Product schema and ecommerce structured data      | Yes              |
| Core Web Vitals/mobile/page speed                 | Yes              |
| Product and category content depth                | Yes              |
| Local SEO/Google Business Profile                 | Yes              |
| Social, TikTok, Instagram, referral traffic       | Yes              |
| Backlinks and digital PR                          | Yes              |
| Competitor analysis                               | Yes              |
| AI search visibility                              | Yes              |
| Audit-mode development workflow                   | Yes              |
| Next.js/Sanity/Cloudinary/Prisma implementation   | Yes              |
| Filters, pagination, variants, redirects, 404/410 | Yes              |
| International/multilingual/hreflang readiness     | Yes              |
| Merchant feed/shopping readiness                  | Yes              |
| GA4 ecommerce events and KPIs                     | Yes              |
| Portfolio and collaboration SEO                   | Yes              |

## APPENDIX G - Source Alignment

This guide consolidates and reconciles the original B&V SEO document, all subsequent SEO and Meta SEO discussions, the uploaded audit-adaptation markdown, the full Bilesma Natural SEO audit, and B&V's business, technology, design, phase, and database references. WordPress-specific audit recommendations were translated into equivalent Next.js, Sanity, Cloudinary, Prisma, PostgreSQL, Vercel, analytics, and content operations.

- B&V SEO Reference Guide v1.0 and v2.0
- FULL SEO AUDIT REPORT - Bilesma Natural, June 2026
- Uploaded audit adaptation discussion markdown
- Buwi & Vila Technology Stack & Tools Reference v1.0
- Couple Brand Business Ideas and Website Strategy v1.1
- B&V Phase Development Reference v1.1
- B&V PostgreSQL Database Design Reference v1.0
- Official Google Search, Schema.org, Next.js, GA4, Search Console, Lighthouse, and PageSpeed documentation

**Final Working Rule**

Every new B&V page, product, collection, article, campaign, service, language, location, or platform feature must be assessed for intent, crawlability, indexability, metadata, structured data, media, performance, accessibility, internal links, analytics, trust, conversion, and lifecycle before release.
