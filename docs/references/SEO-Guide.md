B&V SEO Reference Guide - Practical Development Guide
B&V SEO Reference Guide
Practical SEO, Meta SEO, Content, Image, and Monitoring Reference for

## Development

Version 1.0 - Prepared for the B&V modern romantic lifestyle ecommerce web app
Strategic SEO DirectionB&V should not be optimized as only a couple store.
SEO must support fashion, jewelry, gifts, couples,
custom products, and love website experiences while
preserving the romantic lifestyle brand story.
Prepared as a self-contained development reference: use it while designing routes, writing product/category content,
implementing Next.js metadata, optimizing images, publishing blogs, and monitoring SEO after launch.

B&V SEO Reference Guide - Practical Development Guide
Table of Contents

- How to Use This Reference
- SEO Strategy Overview for B&V
  Phase 1 - SEO Foundation, Research, and Architecture
- Brand and Audience SEO Positioning
- Keyword Research and Keyword Mapping
- Competitor and SERP Research
- SEO-Friendly Site Architecture and URLs
- Technical SEO Foundation
  Phase 2 - On-Page SEO, Meta SEO, Content, and Media Implementation
- Metadata and Meta SEO
- Category, Collection, Product, and Blog Page SEO
- Structured Data and Rich Result Readiness
- Image SEO and Media Optimization
- Content Creation and Blog Strategy
- Internal Linking, UX, and Conversion SEO
  Phase 3 - Monitoring, Auditing, Optimization, and Growth
- SEO Tools and Measurement Setup
- Monitoring Workflow and Monthly SEO Routine
- Technical Audits and QA Checklists
- Growth Strategy: Social Search, Brand Demand, and Authority
  Appendices - Templates, Examples, and References

B&V SEO Reference Guide - Practical Development Guide

- How to Use This Reference
  This document is designed as a practical SEO guide for real development work. It is written for a custom Next.js
  ecommerce platform, but the principles are applicable to most modern ecommerce websites.
  Use it in three ways:
  As a planning guide before building pages, routes, product categories, and content collections.
  As an implementation checklist while coding metadata, sitemap, robots rules, structured data, and image
  optimization.
  As a monitoring playbook after launch, using Google Search Console, GA4, Ubersuggest, Lighthouse, and
  PageSpeed Insights.
  The SEO approach is customized for B&V: a modern romantic lifestyle ecommerce brand serving solo fashion
  customers, gift buyers, couples, jewelry shoppers, and custom-order customers. The main commercial pillars are
  Women, Men, Jewelry, Gifts, Couples, and Custom.
- SEO Strategy Overview for B&V
  SEO should not be treated as a last-minute task. For B&V, SEO must be built into the product architecture, content
  model, metadata system, image strategy, and analytics setup from the first development phase.
  The core SEO goal: make B&V discoverable for people searching for fashion, jewelry, gifts, couple products, custom
  pieces, and romantic digital experiences - then convert that traffic through premium design, emotional trust, product
  clarity, and strong calls to action.
  SEO PillarPurposeB&V Example
  Technical SEOMake the app crawlable, indexable, fast,
  and stable.
  Sitemap, robots, canonical URLs, Core
  Web Vitals, schema, clean routing.
  Keyword SEOMatch pages to real search intent.Women fashion, promise rings,
  anniversary gifts, couple hoodies, custom
  gift boxes.
  Meta SEOControl search previews and social
  previews.
  Unique titles, descriptions, Open Graph
  images, canonical URLs, robots rules.
  Content SEOCapture informational and styling
  searches.
  Gift guides, outfit ideas, jewelry guides,
  love website explainers.
  Product SEOMake product pages rank and convert.Detailed descriptions, FAQs, schema,
  high-quality images, related products.
  Monitoring SEOMeasure, fix, and improve continuously.Search Console, GA4, Ubersuggest,
  Lighthouse, PageSpeed Insights.
  SEO mindset for B&V: do not chase only high-volume keywords. Build a library of useful commercial and emotional
  pages that answer what customers actually search before they buy.

B&V SEO Reference Guide - Practical Development Guide
Phase 1 - SEO Foundation, Research, and Architecture
Phase 1 creates the search foundation before development goes too far. The goal is to decide what the site should rank
for, what pages must exist, how URLs should be structured, and how technical SEO will be implemented.

- Brand and Audience SEO Positioning
  Before keyword research, define the brand SEO position. B&V should not be positioned only as a couple store because
  the strategy includes solo customers, ladies fashion, gents fashion, jewelry, gifts, personalized products, couple
  collections, and love website experiences.
  Audience SegmentLikely Search IntentPage/Content Response
  Solo women fashion customersLooking for outfits, co-ords, dresses, soft
  aesthetic fashion.
  Women category, fashion edits, outfit
  styling blogs, product pages.
  Solo men fashion customersLooking for essentials, oversized tees,
  date-night fits, minimal outfits.
  Men category, essentials collections,
  styling blogs.
  Jewelry customersLooking for rings, necklaces, promise
  rings, personalized jewelry.
  Jewelry category, subcollections, product
  schema, gift-ready copy.
  Gift buyersLooking for birthdays, anniversaries,
  romantic gifts, gift boxes.
  Gifts category, occasion landing pages,
  gift guides.
  Couple customersLooking for matching outfits, couple rings,
  couple gift boxes.
  Couples category, couple collections,
  couple content.
  Custom-order customersLooking for personalized gifts, custom
  jewelry, embroidery, love websites.
  Custom category, inquiry pages,
  explainers, portfolio examples.

## Action Steps

Write a one-line SEO positioning statement: "B&V is a romantic lifestyle ecommerce brand for fashion, jewelry,
gifts, couples, and custom moments."
List every audience group and map it to search intent.
Avoid naming pages too narrowly. For example, use Gifts instead of only Couple Gifts.
Keep couple-led storytelling as a differentiator, not as the only category logic.

- Keyword Research and Keyword Mapping
  Keyword research connects what people search to the pages we build. The goal is not to collect random keywords. The
  goal is to decide which page should target which intent.
  Use tools such as Ubersuggest, Google Trends, Google Search Console after launch, and manual Google SERP
  checks. Validate each keyword by search volume, difficulty, commercial intent, seasonality, and page type needed.

## Keyword Types

Keyword TypeMeaningB&V ExampleBest Page Type
Commercial category keywordUser is shopping by category.women dresses Sri Lanka,
jewelry gifts Sri Lanka
Category page
Long-tail collection keywordUser wants a specific
style/product group.
promise rings Sri Lanka, date
night outfits Sri Lanka
Collection page
Product keywordUser is close to purchase.lavender initial necklace,
couple promise ring
Product page
Informational keywordUser is researching before
buying.
how to choose a promise ring,
anniversary gift ideas
Blog/journal article
Occasion keywordUser is shopping for an event.birthday gift box for girlfriend,
anniversary gifts for him
Landing page or guide
Brand keywordUser already knows the
brand.
B&V jewelry, B&V gift boxHomepage/category/product
pages
Initial B&V Keyword Clusters to Validate
ClusterSeed Keywords
Women Fashionwomen dresses Sri Lanka; co ord sets Sri Lanka; date night
outfits Sri Lanka; soft aesthetic outfits; clean girl outfits Sri
Lanka; loungewear Sri Lanka
Men Fashionmen oversized t shirts Sri Lanka; men casual shirts Sri Lanka;
men date night outfit; mens hoodies Sri Lanka; minimal outfits

B&V SEO Reference Guide - Practical Development Guide
for men
Jewelrypromise rings Sri Lanka; couple rings Sri Lanka; initial necklace
Sri Lanka; engraved jewelry Sri Lanka; jewelry gifts Sri Lanka;
personalized necklace Sri Lanka
Giftsanniversary gifts Sri Lanka; birthday gift boxes Sri Lanka;
personalized gifts Sri Lanka; romantic gifts Sri Lanka; couple
gift box Sri Lanka; self-care gift box
Couplesmatching outfits Sri Lanka; couple hoodies Sri Lanka; couple t
shirts Sri Lanka; couple jewelry Sri Lanka; date night couple
outfits
Customcustom gift boxes Sri Lanka; custom jewelry Sri Lanka;
personalized fashion Sri Lanka; embroidery gifts Sri Lanka;
custom love website
Love Websitesanniversary website Sri Lanka; wedding RSVP website Sri
Lanka; proposal website; digital love letter; memory website for
couples

## Keyword Mapping Rules

Each indexable page should have one primary keyword intent and a small set of related secondary terms.
Do not make multiple pages compete for the same primary keyword unless they serve clearly different intents.
Use broad commercial keywords for category pages, long-tail keywords for collections, and specific product names
for product pages.
Do not over-optimize page copy. Write naturally and clearly.
Update keyword mapping every month based on Search Console queries after launch.

- Competitor and SERP Research
  Competitor research helps identify the type of content Google already rewards. For each target keyword, search
  manually and inspect the top results. Do not copy competitors; understand user expectations.
  What to Study in Search Results
  Are top-ranking pages category pages, product pages, blogs, marketplaces, or brand pages?
  Do results show product rich snippets, images, FAQs, local businesses, or videos?
  What page titles and meta descriptions are competitors using?
  What subcategories appear in their navigation?
  What content blocks are present above and below the product grid?
  What questions appear in People Also Ask or related searches?

## Action Steps

Choose 5-10 priority keywords for each B&V pillar: Women, Men, Jewelry, Gifts, Couples, Custom.
Record the top 5 competing URLs for each keyword.
Classify the winning page type: category, product, blog, marketplace, or guide.
Decide whether B&V needs a category page, collection page, product page, or blog article to compete.
Add findings to an SEO keyword map spreadsheet.

- SEO-Friendly Site Architecture and URLs
  Good site architecture helps users and crawlers understand the store. It also prevents duplicated, messy ecommerce
  URLs.
  Recommended B&V Public Routes
  Page TypeRouteSEO Role
  Homepage/Brand trust, broad positioning, internal
  links to core pillars.
  Shop Landing/shopAll product discovery and category
  navigation.
  Women/womenMain commercial category for women
  fashion.
  Men/menMain commercial category for men
  fashion.
  Jewelry/jewelryPremium value category for rings,
  necklaces, bracelets, gifts.

B&V SEO Reference Guide - Practical Development Guide
Gifts/giftsOccasion-driven shopping and gift
guides.
Couples/couplesSignature differentiation: matching outfits,
couple jewelry, boxes.
Custom/customCustom orders, personalization, inquiry
conversions.
Love Websites/love-websitesUnique service SEO for digital romantic
experiences.
Our Story/our-storyBrand trust and emotional credibility.
Journal/journalBlogs, guides, styling, gift and jewelry
education.
Product/products/[slug]Stable product URLs for product SEO
and schema.
Collection/collections/[slug]Long-tail landing pages.
URL Best Practices
Use short, readable, lowercase URLs: /jewelry/promise-rings is clear; /cat?id=27 is not.
Prefer stable product URLs such as /products/lavender-initial-necklace because a product may appear in multiple
categories.
Avoid changing URLs after launch unless necessary. If a URL changes, add a 301 redirect.
Avoid indexing every filter and sort combination. Filter URLs can create thousands of duplicate pages.
Use canonical URLs for UTM parameters and duplicate product/category variations.

- Technical SEO Foundation
  Technical SEO ensures search engines can crawl, render, index, and understand the site. In a Next.js App Router
  project, this must be designed at the framework level.

## Technical Foundation Checklist

AreaBest PracticeB&V Development Decision
RenderingUse SEO-friendly rendering for public
pages.
Use static generation or ISR for
homepage, categories, products,
collections, and blogs where possible.
SitemapProvide a sitemap with canonical public
URLs.
Implement app/sitemap.ts and include
products, categories, collections, blogs.
RobotsControl crawler access carefully.Allow public pages; block admin and
internal utility paths; noindex private
pages.
CanonicalAvoid duplicate URL confusion.Canonical product URLs to
/products/[slug]; strip UTM parameters.
PerformanceOptimize loading, interactivity, and layout
stability.
Use next/image, next/font, optimized
Cloudinary assets, minimal JavaScript.
Mobile-firstDesign for mobile usability.Responsive navigation, readable product
pages, fast image loading.
AccessibilityMake content readable to users and
crawlers.
Semantic headings, alt text, button
labels, crawlable text.
SecurityServe the site via HTTPS.Required for trust, payments, analytics,
and modern browser behavior.
Pages to Keep Out of Search
Page/RouteIndexing RuleReason
/cartnoindex, nofollowPrivate, temporary, not useful in search.
/checkoutnoindex, nofollowPrivate checkout flow.
/account, /login, /registernoindex, nofollowAccount-specific pages.
/adminnoindex, nofollow and protectedInternal system area.
Payment callback/success/failure pagesnoindex, nofollowTransactional utility pages.
Internal search resultsUsually noindex, followCan create thin or duplicate pages.
Filter/sort URLsCanonical or noindex depending strategyCan create duplicate ecommerce URLs.

B&V SEO Reference Guide - Practical Development Guide
Phase 2 - On-Page SEO, Meta SEO, Content, and Media

## Implementation

Phase 2 is where SEO becomes visible in the code and content. This phase covers metadata, page templates,
product/category copy, blog strategy, structured data, image SEO, internal linking, and conversion-focused UX.

- Metadata and Meta SEO
  Meta SEO controls how pages describe themselves to search engines, social platforms, browser previews, and
  crawlers. It includes title tags, meta descriptions, canonical URLs, robots meta, Open Graph tags, Twitter/X cards,
  verification tags, and theme/browser metadata.
  In Next.js App Router, metadata should be implemented using the Metadata API, static metadata objects, dynamic
  generateMetadata, and metadata file conventions. Avoid manually duplicating head tags across components.

## Global Metadata Rules

Metadata ItemB&V Rule
metadataBaseSet the production domain once so canonical and Open Graph
URLs are absolute.
title.defaultB&V - Fashion, Jewelry, Gifts & Romantic Lifestyle Pieces
title.template%s | B&V
descriptionUse a broad brand description covering fashion, jewelry, gifts,
couples, and custom moments.
robots defaultindex, follow for public pages. Override private pages with
noindex.
openGraph.siteNameB&V
twitter.cardsummary_large_image
iconsSet favicon, shortcut icon, and apple icon.
themeColorUse brand-friendly light/dark colors consistent with the design
system.

## Recommended Page Title Patterns

PageTitle Pattern
HomeB&V - Fashion, Jewelry, Gifts & Romantic Lifestyle Pieces
WomenWomen's Fashion | Dresses, Co-ords & Soft Aesthetic Outfits |

## B&V

MenMen's Fashion | Minimal Fits, Tees & Essentials | B&V
JewelryJewelry | Rings, Necklaces, Bracelets & Gift Pieces | B&V
GiftsMeaningful Gifts, Gift Boxes & Personalized Presents | B&V
CouplesCouple Collections | Matching Outfits, Couple Jewelry & Gift
Boxes | B&V
CustomCustom Gifts, Jewelry, Fashion & Love Websites | B&V
Product[Product Name] | B&V
Journal Article[Article Title] | B&V Journal

## Meta Description Examples

A meta description should be a concise pitch. It should summarize the page, include the main value, and encourage
clicks without keyword stuffing.
PageExample Meta Description
WomenDiscover soft, romantic women's fashion by B&V - dresses, co-
ords, tops, loungewear, and date-night pieces made for
beautiful everyday moments.
JewelryExplore B&V jewelry for self-love, gifting, anniversaries, and
everyday styling - rings, necklaces, bracelets, and personalized
pieces.
GiftsFind meaningful gifts, romantic gift boxes, personalized
presents, and gift-ready jewelry for birthdays, anniversaries,
and special moments.
CouplesShop couple collections by B&V - matching outfits, couple
jewelry, date-night edits, and meaningful gifts for two.
CustomCreate custom gifts, jewelry, fashion pieces, gift boxes, and

B&V SEO Reference Guide - Practical Development Guide
romantic love websites with B&V.

## Robots Meta Rules

Page TypeRobots Decision
Homepage, categories, collections, products, blogs, our storyindex, follow
Cart, checkout, account, login, register, payment callback pagesnoindex, nofollow
Internal search result pagesusually noindex, follow
Filter/sort URLscanonical to parent or noindex, follow depending strategy
Out-of-stock productkeep index if returning; noindex only if permanently
discontinued
Canonical URL Rules
SituationCanonical Decision
/womencanonical to /women
/women?sort=price-lowcanonical to /women
/products/lavender-necklace?utm_source=instagramcanonical to /products/lavender-necklace
Product in multiple categoriescanonical to stable /products/[slug]
Collection page built for SEOcanonical to itself
Paginated category pageshandle carefully; ensure products remain discoverable

## Next.js Metadata Utility Example

// src/lib/seo/metadata.ts
export function buildMetadata({ title, description, path, image, noIndex = false }) {
return {
title,
description,
alternates: { canonical: path },
robots: { index: !noIndex, follow: !noIndex },
openGraph: {
title,
description,
url: path,
siteName: 'B&V',
images: image ? [{ url: image }] : [],

## },

twitter: {
card: 'summary_large_image',
title,
description,
images: image ? [image] : [],

## },

## }

## }

- Category, Collection, Product, and Blog Page SEO
  Every indexable page should have a clear purpose. Avoid empty ecommerce grids. Search engines and users need
  context, headings, internal links, and useful supporting content.

## Category Page Template

H1 with clear category intent, such as "Meaningful Gifts for Every Beautiful Moment".
Short intro paragraph that explains the category naturally.
Featured subcategories or collections.
Product grid with crawlable product names and prices.
Editorial block: styling tips, gift advice, or category story.
Internal links to related collections and guides.
FAQ section for common buyer questions.
Breadcrumbs and CollectionPage/Breadcrumb structured data.

B&V SEO Reference Guide - Practical Development Guide

## Product Page Template

SEO-friendly product name.
Short emotional description above the fold.
Detailed description with material, size, color, fit, care, and personalization details.
Gift readiness information: packaging, message card, occasion suitability.
Delivery, returns, and payment confidence information.
High-quality image gallery with descriptive alt text.
Related products, complete-the-look items, and gift pairing suggestions.
Product FAQ section.
Product structured data with price, availability, images, brand, and ratings later.
Product SEO Example
ItemExample
Product TitleLavender Initial Necklace | B&V
SEO DescriptionA soft romantic initial necklace made for everyday styling, self-
love gifting, and meaningful moments. Gift-ready packaging by

## B&V.

H1Lavender Initial Necklace
Alt TextLavender initial necklace in a warm ivory B&V jewelry box with
champagne gold detail
FAQ QuestionIs this necklace suitable as a birthday or anniversary gift?
Blog/Journal Page Template
H1 that matches the question or topic.
Short introduction that explains who the article is for.
Clear sections with H2/H3 headings.
Practical examples and product/category links where relevant.
Original brand voice: warm, useful, premium, not generic.
Article structured data where appropriate.
End with related products, gift guide links, or collection CTAs.

- Structured Data and Rich Result Readiness
  Structured data gives search engines explicit clues about the meaning of a page. For ecommerce, it is especially useful
  on product pages because product data can support richer search appearances such as price, availability, review
  ratings, and shipping details when eligible.
  Schema TypeUse OnPurpose
  OrganizationHomepage / global layoutExplain brand identity, logo, sameAs
  social links.
  WebSiteHomepage / global layoutSupport site-level identity and search
  features.
  BreadcrumbListCategories, collections, products, blog
  articles
  Clarify page hierarchy.
  ProductProduct pagesPrice, availability, images, brand, SKU,
  ratings later.
  OfferProduct pagesPrice, currency, availability, URL.
  CollectionPageCategory and collection pagesIndicate product collection pages.
  Article / BlogPostingJournal postsExplain article title, date, author, image.
  FAQPagePages with visible FAQ contentSupport question-answer clarity when
  valid.

## Structured Data Rules

Only mark up content that is visible or accurately represented on the page.
Keep product price, availability, and currency synced with the actual product data.
Validate structured data using Google Rich Results Test and Schema.org validators.
Do not fake reviews or ratings. Add review schema only after real reviews exist.
Use JSON-LD because it is clean and easy to manage in a Next.js app.

B&V SEO Reference Guide - Practical Development Guide

- Image SEO and Media Optimization
  B&V is a visual brand, so image SEO is commercially important. Product photos, jewelry closeups, gift boxes,
  packaging, couple lifestyle photos, and editorial fashion shots should help both SEO and conversion.
  Image SEO Best Practices
  AreaBest PracticeExample
  File nameUse descriptive lowercase names.lavender-initial-necklace-bv.jpg, not
  IMG_9231.jpg
  Alt textDescribe the image naturally and
  specifically.
  Couple wearing matching ivory hoodies
  from B&V during a cafe date
  CompressionCompress without damaging quality.Use Cloudinary transformations and
  responsive sizes.
  FormatUse modern formats where possible.WebP/AVIF where supported, JPEG for
  photo fallback.
  DimensionsSet width/height to avoid layout shift.Use next/image with known dimensions
  or fill behavior.
  Lazy loadingLazy load below-the-fold images.Do not lazy load the main LCP
  hero/product image.
  ContextPlace images near relevant text.Jewelry photos near jewelry description
  and gift details.
  SitemapEnsure image URLs are discoverable.Include key public images through page
  sitemaps and crawlable HTML.

## Alt Text Examples

Poor Alt TextBetter Alt Text
imageLavender initial necklace displayed in a warm ivory B&V gift box
dressSoft blush date-night dress styled with a pearl necklace
couple photoCouple wearing matching minimal beige hoodies from the B&V
couple collection
gift boxB&V personalized anniversary gift box with lavender tissue
paper and gold sticker

## Next.js Image Implementation Rules

Use next/image for product, category, hero, and blog images.
Use priority only for the main above-the-fold image that affects LCP.
Use sizes attributes so browsers choose correct responsive images.
Do not use huge uncompressed images directly from design exports.
Do not put important text inside images only. Use real HTML text for headings and copy.

- Content Creation and Blog Strategy
  B&V content should work like an editorial magazine plus a shopping assistant. Blogs should not exist only to add
  keywords. They should help customers choose outfits, gifts, jewelry, and custom experiences.

## Core Content Pillars

PillarContent IdeasCommercial Link
Gift GuidesBest anniversary gifts, birthday gifts for
her, meaningful gifts for him, self-love
gifts.
Gifts category, gift boxes, jewelry gifts.
Jewelry EducationHow to choose a promise ring, necklace
length guide, engraved jewelry ideas.
Jewelry category, product pages.
Women StylingDate-night outfits, co-ord styling, soft
aesthetic looks, office-to-date outfits.
Women category, fashion collections.
Men StylingMinimal men's outfits, oversized tee
styling, casual date-night fits.
Men category, essentials collections.
Couple ContentMatching outfit ideas, couple gift ideas,
date-night looks, anniversary ideas.
Couples category, couple collections.
Custom ProductsHow custom gift boxes are made,
embroidery ideas, personalized jewelry
examples.
Custom category, inquiry form.
Love WebsitesWhat is a digital love letter website, Love websites service page.

B&V SEO Reference Guide - Practical Development Guide
anniversary website ideas, wedding
RSVP guide.
Behind the ScenesOrder packing, gift box creation, jewelry
styling, brand building.
Trust, social sharing, email signup.

## Blog Publishing Workflow

Choose one keyword intent and one buyer stage for the article.
Check the SERP manually and list what users expect to see.
Write a clear outline with H2/H3 sections before drafting.
Add original B&V examples, product context, and brand voice.
Add internal links to category, collection, product, and related blog pages.
Add optimized images with descriptive filenames and alt text.
Add meta title, meta description, canonical URL, OG image, and Article schema.
Review with a content quality checklist before publishing.

## Starter Blog List

PriorityArticle TitlePrimary Intent
HighBest Anniversary Gift Ideas in Sri LankaGift buyer research
HighHow to Choose a Promise Ring That

## Feels Meaningful

Jewelry education
HighDate Night Outfit Ideas for CouplesFashion + couple intent
HighMeaningful Birthday Gift Box Ideas for

## Her

Gift purchase intent
MediumHow to Style One Co-ord Set Three

## Ways

Women fashion styling
MediumMinimal Outfit Ideas for MenMen fashion styling
MediumWhat Is a Digital Love Letter Website?Love website education
MediumPersonalized Jewelry Gift Ideas for

## Special Moments

Jewelry + gift intent
MediumMatching Outfits That Do Not Look Too

## Obvious

Couple collection intent
LowBehind the Scenes: How We Pack a B&V

## Gift Box

Brand trust/social content

- Internal Linking, UX, and Conversion SEO
  SEO traffic is useful only if users can move from discovery to purchase. Internal linking helps crawlers understand page
  relationships and helps customers discover products.

## Internal Linking Rules

Every category page should link to subcategories, collections, buying guides, and related categories.
Every blog article should link to at least one relevant category or collection and one related article.
Every product page should link to related products, complete-the-look items, gift pairings, and relevant guides.
Breadcrumbs should appear on category, collection, product, and article pages.
Use descriptive anchor text. Avoid repeated vague links such as "click here".
Conversion SEO Rules
Keep key product details visible: price, size, material, delivery, returns, customization options.
Use trust signals: secure payments, PayHere/KOKO, delivery info, contact details, reviews later.
Make CTAs clear but premium: "Shop the Drop", "Create a Custom Gift", "Discover the Collection".
Use content blocks to reduce uncertainty, especially for jewelry, gifts, sizing, and custom orders.
Use mobile-first layouts because social-driven visitors will often arrive from phones.

B&V SEO Reference Guide - Practical Development Guide
Phase 3 - Monitoring, Auditing, Optimization, and Growth
SEO does not end at launch. Phase 3 is about measuring results, fixing issues, improving content, expanding
keywords, and growing brand authority over time.

- SEO Tools and Measurement Setup
  Set up measurement before launch or immediately after deployment. Without measurement, SEO decisions become
  guesses.
  ToolPurposeB&V Use
  Google Search ConsoleIndexing, search queries, impressions,
  clicks, sitemap, crawl issues.
  Submit sitemap, monitor indexed pages,
  inspect URLs, find ranking queries.
  Google Analytics 4Traffic and conversion analytics.Track organic sessions, product views,
  add-to-cart, checkout, purchases.
  UbersuggestKeyword research, competitor research,
  site audit, rank tracking.
  Plan keywords, monitor rankings,
  discover content opportunities.
  Google TrendsSeasonal and market trend discovery.Plan Valentine, anniversary, wedding,
  birthday, Christmas content.
  LighthousePerformance, SEO, accessibility, best
  practices.
  Run before deployment and after major
  changes.
  PageSpeed InsightsCore Web Vitals and performance
  diagnostics.
  Monitor LCP, INP, CLS and mobile
  performance.
  Rich Results TestStructured data validation.Check Product, Breadcrumb, Article,
  FAQ schema.
  Meta SEO InspectorQuick metadata QA in browser.Check title, description, canonical, Open
  Graph, headings, schema.
  GA4 Ecommerce Events to Track
  EventWhen to FireWhy It Matters
  view_item_listCategory/collection product grid viewed.Measures category discovery.
  select_itemProduct selected from a list.Measures product interest from category
  pages.
  view_itemProduct page viewed.Measures product-level organic traffic.
  add_to_cartUser adds product to cart.Measures product conversion strength.
  begin_checkoutCheckout started.Measures purchase intent.
  purchaseOrder completed.Measures SEO revenue and ROI.
  generate_leadCustom order/love website inquiry
  submitted.
  Measures non-standard ecommerce
  conversions.
  sign_upNewsletter signup.Measures content/email growth.
- Monitoring Workflow and Monthly SEO Routine
  SEO needs a simple routine that can be repeated. Do not try to analyze everything every day. Track weekly health and
  monthly growth.
  Weekly SEO Checks
  Open Search Console and check indexing errors, sitemap status, and manual actions/security issues.
  Review top queries and pages from the last 7-28 days.
  Check if any important pages suddenly lost impressions or clicks.
  Run Lighthouse/PageSpeed checks for changed templates.
  Check whether newly published pages are indexed or discovered.
  Monthly SEO Routine
  Export Search Console queries and pages.
  Identify pages with high impressions but low click-through rate. Improve titles/descriptions.
  Identify pages ranking around positions 8-20. Improve content, internal links, headings, and FAQs.
  Find new keyword opportunities from actual Search Console queries.
  Refresh or expand one existing article or category page.
  Publish 2-4 new high-quality content pieces based on validated keyword intent.
  Check broken links, redirects, 404s, and canonical issues.

B&V SEO Reference Guide - Practical Development Guide
Review organic traffic conversion rate in GA4.
SEO KPI Dashboard
KPIWhy It Matters
Indexed pagesShows whether Google can discover and include pages.
Organic impressionsShows visibility growth before clicks arrive.
Organic clicksShows actual traffic from search.
Average CTRShows whether titles/descriptions are convincing.
Average positionShows ranking direction, but should be read by query/page.
Top organic landing pagesShows which pages attract traffic.
Organic add-to-cart rateConnects SEO traffic to product interest.
Organic conversion rateConnects SEO to sales.
Core Web Vitals statusShows performance health for real users.
Structured data errorsAffects rich result eligibility.

- Technical Audits and QA Checklists
  SEO QA should be part of development acceptance criteria. Every important template should pass metadata,
  crawlability, performance, accessibility, and schema checks before release.
  Pre-Launch SEO QA Checklist
  CheckRequired
  Each public page has one unique titleYes
  Each public page has a useful meta descriptionYes
  Canonical URLs are correctYes
  Robots meta rules are correctYes
  Open Graph and Twitter preview tags are presentYes
  Sitemap includes canonical public pages onlyYes
  Private pages are noindex or protectedYes
  Category/product/blog pages have one clear H1Yes
  Images have descriptive alt text where meaningfulYes
  Product pages include Product structured dataYes
  Breadcrumbs and BreadcrumbList schema are presentYes
  No duplicate or conflicting head tagsYes
  Mobile layout is usableYes
  Core Web Vitals are acceptableYes
  404 and redirect behavior is testedYes
  Meta SEO Inspector QA
  Open the page in Chrome.
  Run Meta SEO Inspector.
  Confirm title, description, canonical, robots, Open Graph tags, Twitter tags, H1, and schema.
  Fix missing, duplicate, or conflicting metadata.
  Repeat after deployment, because build-time and environment domain issues can change metadata output.
  Common SEO Mistakes to Avoid
  Building a beautiful page where important text exists only inside images.
  Using the same title and description across many product pages.
  Indexing cart, checkout, account, filter, and payment utility pages.
  Creating many low-value blog posts instead of fewer strong guides.
  Changing URLs without redirects.
  Adding Product review schema without real reviews.
  Using large uncompressed images that hurt LCP.
  Ignoring Search Console after launch.
- Growth Strategy: Social Search, Brand Demand, and Authority
  B&V should treat SEO and social as connected. TikTok, Instagram, Pinterest, and creator content can create brand
  searches, product searches, and backlinks. Search demand grows when people remember the brand and search for it
  later.

B&V SEO Reference Guide - Practical Development Guide
Social-to-SEO Strategy
Use consistent product names in social captions and product pages so people can search the same phrases.
Create content around searchable phrases: "anniversary gift box", "promise ring", "date night outfit", "custom love
website".
Turn high-performing TikToks/Reels into blog articles, landing pages, or collection pages.
Use Pinterest for fashion, jewelry, gift, and mood-board discovery with optimized titles/descriptions.
Encourage user-generated photos and stories, then use them in memory wall/testimonial sections with permission.
Authority and Trust Growth
Collaborate with fashion, jewelry, lifestyle, and couple creators, not only couple creators.
Build gift guide pages worth referencing by blogs and social pages.
Create high-quality brand story and behind-the-scenes content to build trust.
Add real reviews, customer photos, and product FAQs as the business grows.
Avoid spammy backlinks. Focus on genuine mentions, collaborations, directories, and partnerships.
90-Day SEO Growth Plan After Launch
PeriodFocusActions
Days 1-30Indexing and technical stabilitySubmit sitemap, inspect core pages, fix
metadata/canonical/schema errors, track
baseline keywords.
Days 31-60Content and category expansionPublish gift/jewelry/fashion guides,
improve category copy, add FAQs, build
internal links.
Days 61-90Optimization and authorityImprove pages with impressions but low
CTR, add collection pages, start
creator/PR outreach, refresh content.

B&V SEO Reference Guide - Practical Development Guide
Appendix A - Practical SEO Page Templates

## Homepage Template

Title: B&V - Fashion, Jewelry, Gifts & Romantic Lifestyle Pieces
H1: Style for you. Gifts for them. Moments for two.
Sections: hero, featured categories, new arrivals, fashion edit, jewelry highlight, couple collection, build a gift/couple
box, custom orders, love websites, social gallery, testimonials, newsletter.
Internal links: Women, Men, Jewelry, Gifts, Couples, Custom, Our Story, Journal.
Schema: Organization, WebSite, BreadcrumbList if needed.

## Category Template

Title: [Category] | Keyword-Rich Category Descriptor | B&V
H1: Human-friendly category name.
Above-grid text: 80-150 words of useful intro copy.
Below-grid text: styling/gift advice, related links, FAQs.
Schema: CollectionPage, BreadcrumbList.

## Product Template

Title: [Product Name] | B&V
H1: Product name.
Description: short emotional intro plus detailed specifications.
Conversion content: delivery, returns, packaging, custom options, care, sizing.
Schema: Product, Offer, BreadcrumbList.

## Blog Template

Title: [Useful Topic Title] | B&V Journal
H1: Match search intent clearly.
Content: practical guide with examples, visuals, and internal links.
CTA: related category, collection, product, gift finder, or custom inquiry.
Schema: Article or BlogPosting; FAQPage if visible FAQs are included.
Appendix B - Developer SEO Acceptance Criteria
Feature/Page TypeAcceptance Criteria
New public routeHas metadata, canonical, robots, H1, sitemap inclusion
decision, mobile QA.
New category pageHas intro copy, product grid, internal links, FAQ, schema,
optimized images.
New product pageHas dynamic metadata, Product schema, alt text, related
products, delivery/return info.
New blog articleHas keyword intent, article metadata, OG image, headings,
internal links, schema.
Image uploadHas descriptive filename, alt text field, optimized variants,
Cloudinary transformation strategy.
Filter/sort featureHas index/canonical/noindex strategy before release.
Checkout/account featureMarked noindex and excluded from sitemap.
DeploymentSitemap, robots, Search Console, GA4, and metadata QA
completed.

## Appendix C - Reference Sources

This guide combines the B&V strategy and design references with official SEO and framework documentation.
Recommended reference sources for ongoing use:
B&V / Couple Brand Business Ideas and Website Strategy v1.1 - brand positioning, audience, categories, content,
website sections.

B&V SEO Reference Guide - Practical Development Guide
B&V Technology Stack Reference v1.0 - SEO-first, performance-first, mobile-first Next.js stack and SEO toolchain.
B&V Brand Identity & Design System Reference v1.1 - Lavender Luxury Romance design direction, typography,
semantic tokens, image and packaging style.
Next.js Metadata and OG Images documentation - Metadata API, generateMetadata, static metadata, OG image
file conventions: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
Next.js generateMetadata documentation: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
Google Search Central - meta tags and attributes supported by Google:
https://developers.google.com/search/docs/crawling-indexing/special-tags
Google Search Central - robots meta tag and X-Robots-Tag: https://developers.google.com/search/docs/crawling-
indexing/robots-meta-tag
Google Search Central - robots.txt introduction:
https://developers.google.com/search/docs/crawling-indexing/robots/intro
Google Search Central - ecommerce URL structure:
https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
Google Search Central - product structured data:
https://developers.google.com/search/docs/appearance/structured-data/product
Google Search Central - image SEO best practices:
https://developers.google.com/search/docs/appearance/google-images
Google Search Central - Core Web Vitals and Search:
https://developers.google.com/search/docs/appearance/core-web-vitals
Google Search Central - meta descriptions/snippets:
https://developers.google.com/search/docs/appearance/snippet
Ubersuggest guide and dashboard - keyword research, competitor analysis, audits, tracking.
Meta SEO Inspector Chrome extension - browser-based metadata and structured data QA.
Yoast SEO learning resources - SEO fundamentals and on-page SEO concepts.
Coursera ecommerce SEO article - ecommerce SEO planning, keyword research, audits, and optimization process.
Appendix D - Quick One-Page SEO Checklist
Before BuildingDuring ImplementationAfter Launch
Define audience and keyword intent.
Map keywords to pages.
Plan URL structure.
Decide index/noindex rules.
Plan category and collection structure.
Use Next.js metadata API.
Add canonical URLs.
Add robots rules.
Add sitemap and robots.ts.
Optimize images with next/image.
Add Product/Breadcrumb schema.
Write useful category/product copy.
Add internal links and FAQs.
Submit sitemap to Search Console.
Check indexing and metadata.
Monitor GA4 ecommerce events.
Run Lighthouse/PageSpeed.
Improve low-CTR pages.
Publish content monthly.
Refresh pages based on Search Console
data.
Final implementation principle: SEO is not one feature. It is the combined quality of architecture, metadata, content,
performance, trust, images, structured data, links, and measurement.
