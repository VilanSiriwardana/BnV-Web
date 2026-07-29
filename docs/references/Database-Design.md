B&V PostgreSQL Database Design Reference v1.0

## B&V

PostgreSQL Database Design Reference
Version 1.0 - Full Phase 1 to Phase 4 Schema Plan
Prepared for the B&V Modern Romantic Lifestyle Ecommerce Web App
ItemDecision
Brand directionModern Romantic Lifestyle Ecommerce Brand
Brand promiseStyle for you. Gifts for them. Moments for two.
DatabasePostgreSQL with Prisma ORM
Application stackNext.js, TypeScript, Tailwind CSS, Auth.js, Sanity, Cloudinary,
PayHere, KOKO
ScopeFull long-term database blueprint covering Phase 1, Phase 2,
Phase 3, and Phase 4
Implementation principlePlan all modules now, implement migrations phase by phase

B&V PostgreSQL Database Design Reference v1.0
Table of Contents
1.1. Purpose and Source Alignment

## 2.2. Database Design Philosophy

3.3. Phase-Based Schema Strategy

## 4.4. Global Data Type Standards

5.5. Naming and Constraint Rules

## 6.6. Relationship Overview

7.7. Migration Batches by Phase
8.8. Table Summary by Module

## 9.9. Detailed Table Reference

10.10. Status and Enum Reference

## 11.11. Indexing Strategy

12.12. JSONB Usage Rules

## 13.13. Prisma Implementation Notes

## 14.14. Seed Data Plan

15.15. Future Scaling and Operational Notes

## 16.16. Final Implementation Guidance

## 17.17. Source References

B&V PostgreSQL Database Design Reference v1.0

- Purpose and Source Alignment
  This document defines the full PostgreSQL database design reference for B&V. It consolidates the database
  decisions made for the ecommerce platform and maps every table to the four-phase development roadmap.
  The design is aligned to the attached B&V Phase Development Reference, which positions B&V as a modern
  romantic lifestyle ecommerce brand serving women fashion customers, men fashion customers, jewelry
  customers, gift buyers, couple customers, custom order customers, and love website customers. The same
  reference defines Phase 1 as launch/MVP, Phase 2 as growth and personalization, Phase 3 as platform expansion,
  and Phase 4 as brand/offline expansion.
  The goal of this schema is to be complete enough for long-term architecture, but practical enough that
  implementation can proceed in staged migrations rather than creating every future table at once.

## 2. Database Design Philosophy

Use PostgreSQL as the source of truth for transactional commerce data: products, variants, customers, carts,
orders, payments, custom requests, inventory, and subscriptions.
Use Sanity for rich editorial content where possible, while storing lightweight PostgreSQL references for
product linking, search, analytics, and admin dashboards.
Use Cloudinary for image/video storage. PostgreSQL stores media URLs, public IDs, alt text, and relationships,
not binary files.
Keep Phase 1 implementation simple, but design table relationships so Phase 2 to Phase 4 features do not
require destructive rewrites.
Preserve historical snapshots in orders, order items, gift box builds, custom requests, and payment records.
Avoid overusing jsonb for core searchable commerce data. Use jsonb only where the data is naturally flexible
or needs to preserve submitted snapshots.

## Core Rule

Live catalog data can change.
Order, payment, shipment, and custom request records must preserve the exact customer-facing state at the time of submission or
purchase.

- Phase-Based Schema Strategy
  PhaseMain business focusDatabase implementation intent
  Phase 1 - Launch / MVPWebsite launch, shop, products, collections,
  cart, checkout/order inquiry, custom order
  inquiries, love website landing, contact,
  newsletter
  Implement only the core ecommerce and inquiry
  tables needed to launch cleanly.
  Phase 2 - Growth and PersonalizationCustomer accounts, saved addresses, wishlist,
  order tracking, real gift box builder, blog
  references, customer memories, reviews,
  payment webhooks/refunds
  Add customer retention and operational tables
  after MVP foundations are stable.
  Phase 3 - Platform ExpansionLove website builder, AI stylist/gift finder,
  subscriptions, ambassador program, analytics
  dashboard, inventory ledger, international
  shipping
  Add platform-level tables when product-market
  fit and operational needs are proven.
  Phase 4 - Brand ExpansionShowroom, appointments, photoshoot
  packages, offline/POS sales, supplier
  purchasing, premium/luxury expansion
  Add offline business and supplier operations
  only after ecommerce proves itself.

## 4. Global Data Type Standards

Data requirementPostgreSQL typeDecision
Primary keysuuidUse id uuid primary key default

B&V PostgreSQL Database Design Reference v1.0
gen_random_uuid() for public-safe identifiers.
Money and pricesnumeric(12,2)Use exact decimal values for prices, totals,
discounts, refunds, commissions, and costs.
QuantitiesintegerUse for product quantities, stock counts,
reservations, and line quantities.
Currencychar(3)Default LKR. Keep currency explicit for future
international expansion.
Countrychar(2)Default LK. Supports future international
shipping.
Status fieldsvarchar(30-50)Use clear string statuses first; convert to
PostgreSQL enums later if stable.
TimestampstimestamptzUse timezone-aware timestamps for created_at,
updated_at, paid_at, shipped_at, etc.
Flexible snapshotsjsonbUse for selected options, personalization,
gateway payloads, page content blocks,
analytics metadata.
URLstextUse for Cloudinary URLs, public page links, and
external references.
Emailvarchar(255)Normalize lowercase at app level and index
lower(email).

- Naming and Constraint Rules
  Table names use snake_case plural nouns, for example products, product_variants, order_items.
  Primary key column is id unless the table is a pure join table, where a composite primary key may be used.
  Foreign key names use <entity>_id, for example product_id, user_id, order_id.
  Timestamp columns are created_at and updated_at. Event-only tables may only use created_at.
  Public-facing identifiers use dedicated fields such as order_number, sale_number, purchase_order_number,
  slug, or referral_code.
  Soft states use status columns instead of hard deletes for business-critical data.
  Join tables use composite primary keys when the pair must be unique, such as product_categories and
  collection_products.

## 6. Relationship Overview

users
-> accounts, sessions, customer_profiles, customer_addresses, carts, orders, wishlists,
custom_requests, reviews, memories, subscriptions, love website projects, appointments
products
-> variants, images, categories, collections, cart items, order items, wishlist items,
reviews, gift boxes, recommendations, lookbooks, campaigns
orders
-> order_items, payments, refunds, shipments, status_events, custom_requests,
gift_box_builds, love_website_projects, subscription_orders, ambassador_referrals
payments
-> payment_webhooks, refunds
custom_requests
-> custom_request_files, custom_quotes
gift_box_builds
-> gift_box_build_items
love_website_projects
-> love_website_pages, love_website_assets, guestbook_entries

B&V PostgreSQL Database Design Reference v1.0
inventory_locations
-> inventory_stock, inventory_movements
showroom_locations
-> showroom_appointments, offline_sales
supplier_profiles
-> purchase_orders -> purchase_order_items

- Migration Batches by Phase

## Phase 1

cart_items
carts
categories
collection_products
collections
contact_messages
custom_request_files
custom_requests
newsletter_subscribers
order_items
orders
payments
product_categories
product_images
product_variants
products
users

## Phase 2

accounts
blog_post_products
blog_post_refs
campaign_products
campaigns
checkout_sessions
coupon_redemptions
coupons
custom_quotes
customer_addresses
customer_memories
customer_memory_assets
customer_profiles
faq_items
gift_box_build_items
gift_box_builds
gift_box_template_items
gift_box_templates
gift_finder_answers
gift_finder_recommendations

B&V PostgreSQL Database Design Reference v1.0
gift_finder_sessions
lookbook_products
lookbook_refs
order_status_events
payment_webhooks
policy_pages
refunds
reviews
sessions
shipment_events
shipments
shipping_methods
static_pages
verification_tokens
wishlist_items
wishlists

## Phase 3

admin_activity_logs
ambassador_payouts
ambassador_referrals
ambassadors
analytics_events
authenticators
inventory_locations
inventory_movements
inventory_stock
language_labels
love_website_assets
love_website_guestbook_entries
love_website_pages
love_website_projects
love_website_templates
product_attributes
product_recommendations
recommendation_events
recommendation_profiles
search_queries
shipping_rates
shipping_zones
site_settings
subscription_orders
subscription_plans
subscriptions

## Phase 4

offline_sale_items
offline_sales
photoshoot_bookings
photoshoot_packages
purchase_order_items
purchase_orders
showroom_appointments

B&V PostgreSQL Database Design Reference v1.0
showroom_locations
supplier_profiles

- Table Summary by Module
  TablePhaseModulePurpose
  usersPhase 1Identity & AccessMain customer, staff, and admin
  identity. Supports guest-to-account
  conversion and future customer
  dashboard.
  accountsPhase 2Identity & AccessAuth.js/OAuth provider accounts
  linked to users.
  sessionsPhase 2Identity & AccessAuth session persistence for
  customer/admin accounts.
  verification_tokensPhase 2Identity & AccessEmail/passwordless verification
  token storage.
  authenticatorsPhase 3Identity & AccessFuture passkey/WebAuthn support.
  customer_profilesPhase 2CustomerExtended ecommerce customer
  profile separated from auth identity.
  customer_addressesPhase 2CustomerSaved addresses for checkout and
  account dashboard.
  categoriesPhase 1CatalogNavigation, collections, and filter
  taxonomy for Women, Men,

## Jewelry, Gifts, Couples, Custom,

audience, occasion, material, and
color.
productsPhase 1CatalogMain product record for fashion,
jewelry, gift boxes, couple
products, custom inquiry products,
and love website service products.
product_variantsPhase 1CatalogSellable SKU-level variant with
stock and options.
product_imagesPhase 1Catalog / MediaProduct gallery images and
Cloudinary references.
product_categoriesPhase 1CatalogMany-to-many relationship
between products and
categories/filter groups.
product_attributesPhase 3CatalogOptional structured product
attributes for advanced filtering and
AI/search features.
collectionsPhase 1MerchandisingCurated product groups such as

## New Arrivals, Limited Drop, Fashion

## Edit, Jewelry Highlight, Couple

## Collection.

collection_productsPhase 1MerchandisingJoin table ordering products inside
collections.
campaignsPhase 2Marketing / MerchandisingSeasonal campaigns, launch drops,
influencer edits, and promotional
events.
campaign_productsPhase 2Marketing / MerchandisingProducts featured in campaigns.
cartsPhase 1Cart & CheckoutGuest or logged-in customer cart.
cart_itemsPhase 1Cart & CheckoutCart line item with selected options,
personalization, and gift notes.
checkout_sessionsPhase 2Cart & CheckoutCheckout flow state before order
creation/payment redirect; helps
prevent duplicate order creation.
ordersPhase 1OrdersMain order/inquiry header.
Supports Phase 1 inquiry-friendly
flow and future paid ecommerce
orders.
order_itemsPhase 1OrdersHistorical order line snapshots. This
protects orders from later
product/catalog changes.
order_status_eventsPhase 2OrdersOrder timeline and status audit
history.
paymentsPhase 1PaymentsPayment attempts/results for
manual inquiry flow, PayHere, and

## KOKO.

payment_webhooksPhase 2PaymentsRaw gateway webhook logs for
PayHere/KOKO idempotency and
debugging.
refundsPhase 2PaymentsRefund records linked to orders
and payments.
shipping_methodsPhase 2ShippingDelivery methods such as standard
delivery, express delivery, pickup,

B&V PostgreSQL Database Design Reference v1.0
and international shipping.
shipping_zonesPhase 3ShippingShipping zones for local and
international shipping.
shipping_ratesPhase 3ShippingRates by shipping method and
zone.
shipmentsPhase 2ShippingActual shipment/package for an
order.
shipment_eventsPhase 2ShippingTracking timeline for shipments.
inventory_locationsPhase 3InventoryStock locations such as warehouse,
studio, showroom, home.
inventory_stockPhase 3InventoryCurrent stock per variant and
location.
inventory_movementsPhase 3InventoryStock movement ledger for
auditability.
custom_requestsPhase 1Custom OrdersCustom fashion, custom jewelry,
gift box, embroidery, engraving,
personalized notes, and love
website inquiry submissions.
custom_request_filesPhase 1Custom OrdersReference uploads for custom
requests.
custom_quotesPhase 2Custom OrdersAdmin quotes for custom requests.
gift_box_templatesPhase 2Gift Box BuilderReusable gift box templates such
as self-love box, jewelry gift box,
birthday box, couple box.
gift_box_template_itemsPhase 2Gift Box BuilderDefault/allowed products inside gift
box templates.
gift_box_buildsPhase 2Gift Box BuilderCustomer-created gift box
session/build.
gift_box_build_itemsPhase 2Gift Box BuilderSelected products inside a
customer gift box.
love_website_templatesPhase 3Love Website ServicesTemplate gallery for Our Story,
proposal, anniversary, wedding
RSVP, birthday, scrapbook,
guestbook pages.
love_website_projectsPhase 3Love Website ServicesCustomer-created love website
project.
love_website_pagesPhase 3Love Website ServicesPages inside a generated love
website.
love_website_assetsPhase 3Love Website ServicesImages, videos, audio, and files
used in love websites.
love_website_guestbook_entriesPhase 3Love Website ServicesPublic guestbook messages for
love website projects.
wishlistsPhase 2WishlistCustomer wishlist container.
wishlist_itemsPhase 2WishlistSaved products/variants.
reviewsPhase 2Reviews & MemoriesProduct reviews submitted by
customers.
customer_memoriesPhase 2Reviews & MemoriesSocial proof/customer stories:
styling photos, gift reactions,
unboxings, couple stories,
testimonials.
customer_memory_assetsPhase 2Reviews & MemoriesImages/videos attached to
customer memories.
blog_post_refsPhase 2Content ReferencesLightweight PostgreSQL references
to Sanity blog/Love Notes posts for
product linking, search, and
analytics.
blog_post_productsPhase 2Content ReferencesLinks blog posts to products.
lookbook_refsPhase 2Content ReferencesLookbook/editorial references,
usually backed by Sanity.
lookbook_productsPhase 2Content ReferencesLinks lookbooks to products.
faq_itemsPhase 2Content ReferencesFAQ content for ordering, delivery,
custom orders, payments, returns,
sizing, gift packaging, love
websites, jewelry care.
policy_pagesPhase 2Content ReferencesPrivacy, terms, returns/exchanges,
and shipping/delivery policies.
static_pagesPhase 2Content ReferencesGeneral content pages such as Our
Story, Love Websites landing, care
guide, packaging.
contact_messagesPhase 1Marketing / SupportContact form messages from
website visitors.
newsletter_subscribersPhase 1Marketing / SupportNewsletter/drop announcement
subscriptions.
couponsPhase 2Marketing / SupportDiscount codes and future
promotional offers.
coupon_redemptionsPhase 2Marketing / SupportCoupon usage history.
gift_finder_sessionsPhase 2Gift Finder / AIOne gift finder quiz attempt.
gift_finder_answersPhase 2Gift Finder / AIAnswers within a gift finder
session.

B&V PostgreSQL Database Design Reference v1.0
gift_finder_recommendationsPhase 2Gift Finder / AIProducts recommended by gift
finder.
recommendation_profilesPhase 3Gift Finder / AIUser personalization profile for AI
stylist/gift finder.
recommendation_eventsPhase 3Gift Finder / AIBehavior events for
recommendation learning.
product_recommendationsPhase 3Gift Finder / AIPrecomputed product
recommendations.
search_queriesPhase 3Gift Finder / AISearch analytics and query
improvement data.
subscription_plansPhase 3SubscriptionsRecurring box plans: jewelry box,
self-care box, couple box, seasonal
box.
subscriptionsPhase 3SubscriptionsCustomer recurring subscription.
subscription_ordersPhase 3SubscriptionsGenerated recurring order links.
ambassadorsPhase 3Ambassador ProgramCreator/ambassador profiles.
ambassador_referralsPhase 3Ambassador ProgramReferral order tracking.
ambassador_payoutsPhase 3Ambassador ProgramAmbassador payout records.
analytics_eventsPhase 3Analytics & AdminInternal analytics events for
advanced dashboard.
admin_activity_logsPhase 3Analytics & AdminAudit trail for admin actions.
site_settingsPhase 3Analytics & AdminKey-value site configuration.
language_labelsPhase 3Analytics & AdminOptional translatable UI labels for
language switch.
showroom_locationsPhase 4Offline / ShowroomPhysical showroom/studio
locations.
showroom_appointmentsPhase 4Offline / ShowroomShowroom, fitting, jewelry viewing,
and custom consultation
appointments.
photoshoot_packagesPhase 4Offline / ShowroomPhotoshoot service packages.
photoshoot_bookingsPhase 4Offline / ShowroomPhotoshoot bookings.
offline_salesPhase 4Offline / ShowroomShowroom/POS sale header.
offline_sale_itemsPhase 4Offline / ShowroomPOS sale line items with product
snapshots.
supplier_profilesPhase 4Supplier & PurchasingSuppliers/vendors for fashion,
jewelry, packaging, printing.
purchase_ordersPhase 4Supplier & PurchasingStock purchase order header.
purchase_order_itemsPhase 4Supplier & PurchasingPurchase order line items.

## 9. Detailed Table Reference

Each table below includes the recommended primary key, attributes, foreign keys, relationships, and performance
indexes. Index names can be adjusted during Prisma migration generation, but the indexed columns should be
preserved.

## Ambassador Program

ambassador_payouts
Phase: Phase 3 | Purpose: Ambassador payout records.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
ambassador_iduuidFK to ambassadors
amountnumeric(12,2)Payout amount
currency_codechar(3)Default LKR
statusvarchar(30)pending, processing, paid, failed
payment_referencevarchar(150)External reference
paid_attimestamptzPaid time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

ambassador_id -> ambassadors.id

## Important Indexes:

B&V PostgreSQL Database Design Reference v1.0

## ambassador_id

## status

paid_at DESC

## Relationships:

M-1 ambassadors
ambassador_referrals
Phase: Phase 3 | Purpose: Referral order tracking.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
ambassador_iduuidFK to ambassadors
user_iduuidOptional referred user
order_iduuidOptional referred order
referral_codevarchar(80)Used referral code
commission_amountnumeric(12,2)Commission amount
statusvarchar(30)pending, approved, paid, rejected
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

ambassador_id -> ambassadors.id
user_id -> users.id
order_id -> orders.id

## Important Indexes:

## ambassador_id

## user_id

## order_id

## status

## Relationships:

M-1 ambassadors/users/orders
ambassadors
Phase: Phase 3 | Purpose: Creator/ambassador profiles.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
namevarchar(150)Ambassador name
emailvarchar(255)Optional
phonevarchar(30)Optional
social_handlevarchar(150)Social handle
platformvarchar(50)instagram, tiktok, youtube
referral_codevarchar(80)Unique referral code
commission_ratenumeric(5,2)Commission percentage
statusvarchar(30)pending, active, paused, rejected
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

B&V PostgreSQL Database Design Reference v1.0
user_id -> users.id

## Important Indexes:

UNIQUE upper(referral_code)

## user_id

## status

## Relationships:

1-M ambassador_referrals
1-M ambassador_payouts

## Analytics & Admin

admin_activity_logs
Phase: Phase 3 | Purpose: Audit trail for admin actions.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
admin_user_iduuidFK to users
actionvarchar(100)created_product, changed_order_status,
processed_refund, etc.
entity_typevarchar(100)Affected entity/table
entity_iduuidAffected entity ID
old_valuesjsonbPrevious values
new_valuesjsonbNew values
ip_addressvarchar(80)Optional
created_attimestamptzAction time

## Foreign Keys:

admin_user_id -> users.id

## Important Indexes:

## admin_user_id

(entity_type, entity_id)

## action

created_at DESC

## Relationships:

M-1 users/admins
analytics_events
Phase: Phase 3 | Purpose: Internal analytics events for advanced dashboard.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
product_iduuidOptional FK to products
order_iduuidOptional FK to orders
event_typevarchar(100)product_view, add_to_cart, checkout_started,
order_created, etc.
session_idvarchar(150)Session identifier
metadatajsonbFlexible event context
created_attimestamptzEvent time

B&V PostgreSQL Database Design Reference v1.0

## Foreign Keys:

user_id -> users.id
product_id -> products.id
order_id -> orders.id

## Important Indexes:

## user_id

## product_id

## order_id

## event_type

created_at DESC
GIN metadata

## Relationships:

M-1 optional users/products/orders
language_labels
Phase: Phase 3 | Purpose: Optional translatable UI labels for language switch.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
label_keyvarchar(150)Label key
language_codevarchar(10)en, si, ta, etc.
label_valuetextTranslated value
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE(label_key, language_code)

## language_code

site_settings
Phase: Phase 3 | Purpose: Key-value site configuration.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
setting_keyvarchar(120)Unique setting key
setting_valuejsonbFlexible setting value
descriptiontextOptional description
is_publicbooleanWhether safe for public frontend
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE setting_key

## is_public

## Cart & Checkout

cart_items
Phase: Phase 1 | Purpose: Cart line item with selected options, personalization, and gift notes.

B&V PostgreSQL Database Design Reference v1.0
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
cart_iduuidFK to carts
product_iduuidFK to products
variant_iduuidOptional FK to product_variants
quantityintegerSelected quantity
unit_pricenumeric(12,2)Price snapshot when added
selected_optionsjsonbSize/color/material/packaging selections
personalizationjsonbEngraving/custom text/reference details
gift_notetextOptional gift note
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

cart_id -> carts.id
product_id -> products.id
variant_id -> product_variants.id

## Important Indexes:

## cart_id

## product_id

## variant_id

## Relationships:

M-1 carts
M-1 products
M-1 optional product_variants
carts
Phase: Phase 1 | Purpose: Guest or logged-in customer cart.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
guest_tokenvarchar(100)Anonymous cart token
statusvarchar(30)active, converted, abandoned
currency_codechar(3)Default LKR
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

(user_id, status)

## guest_token

(status, updated_at)

## Relationships:

M-1 optional users
1-M cart_items
1-1 optional checkout_sessions

B&V PostgreSQL Database Design Reference v1.0
1-1 optional orders
checkout_sessions
Phase: Phase 2 | Purpose: Checkout flow state before order creation/payment redirect; helps prevent duplicate
order creation.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
cart_iduuidFK to carts
user_iduuidOptional FK to users
statusvarchar(30)started, completed, expired, cancelled
customer_namevarchar(150)Snapshot
customer_phonevarchar(30)Snapshot
customer_emailvarchar(255)Snapshot
shipping_snapshotjsonbCheckout address snapshot
payment_methodvarchar(50)Selected method
expires_attimestamptzExpiry
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

cart_id -> carts.id
user_id -> users.id

## Important Indexes:

## cart_id

## user_id

## status

## expires_at

## Relationships:

M-1 carts
M-1 optional users
1-1 optional orders

## Catalog

categories
Phase: Phase 1 | Purpose: Navigation, collections, and filter taxonomy for Women, Men, Jewelry, Gifts, Couples,
Custom, audience, occasion, material, and color.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
parent_iduuidSelf FK for nested categories
namevarchar(120)Category display name
slugvarchar(150)Unique URL slug
category_typevarchar(50)main, audience, product_type, occasion,
material, color
descriptiontextOptional
image_urltextOptional category image
sort_orderintegerDisplay order
is_activebooleanVisibility flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

B&V PostgreSQL Database Design Reference v1.0

## Foreign Keys:

parent_id -> categories.id

## Important Indexes:

UNIQUE slug

## parent_id

(category_type, is_active)

## sort_order

## Relationships:

1-M categories via parent_id
M-M products via product_categories
product_categories
Phase: Phase 1 | Purpose: Many-to-many relationship between products and categories/filter groups.
Primary Key: (product_id, category_id)
ColumnData TypePurpose / Notes
product_iduuidFK to products
category_iduuidFK to categories

## Foreign Keys:

product_id -> products.id
category_id -> categories.id

## Important Indexes:

## product_id

## category_id

## Relationships:

M-M products/categories
product_variants
Phase: Phase 1 | Purpose: Sellable SKU-level variant with stock and options.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
product_iduuidFK to products
skuvarchar(100)Unique SKU
namevarchar(150)Variant label, e.g. Small / Lavender
pricenumeric(12,2)Variant price
compare_at_pricenumeric(12,2)Optional
stock_quantityintegerSimple MVP stock count
reserved_quantityintegerReserved quantity
optionsjsonbVariant option snapshot: size, color, material,
chain length, fit
weight_gramsintegerOptional shipping weight
is_activebooleanSellable flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

B&V PostgreSQL Database Design Reference v1.0
product_id -> products.id

## Important Indexes:

UNIQUE sku

## product_id

## is_active

## stock_quantity

GIN options

## Relationships:

M-1 products
1-M cart_items
1-M order_items
1-M inventory_stock
1-M inventory_movements
products
Phase: Phase 1 | Purpose: Main product record for fashion, jewelry, gift boxes, couple products, custom inquiry
products, and love website service products.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(200)Product display name
slugvarchar(220)Unique URL slug
short_descriptiontextShort card/detail summary
descriptiontextFull product description/story
product_typevarchar(50)fashion, jewelry, gift_box, couple, custom,
love_website
base_pricenumeric(12,2)Default/base price
compare_at_pricenumeric(12,2)Optional strike-through price
currency_codechar(3)Default LKR
statusvarchar(30)draft, active, archived
is_featuredbooleanFeatured/homepage flag
is_customizablebooleanCustomizable flag
is_gift_readybooleanGift-ready flag
seo_titlevarchar(255)Optional SEO title
seo_descriptiontextOptional SEO description
published_attimestamptzPublished timestamp
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug
(status, published_at)

## product_type

## is_featured

## base_price

GIN to_tsvector(name)

## Relationships:

1-M product_variants
1-M product_images
M-M categories
M-M collections

B&V PostgreSQL Database Design Reference v1.0
1-M cart_items
1-M order_items
1-M reviews
product_attributes
Phase: Phase 3 | Purpose: Optional structured product attributes for advanced filtering and AI/search features.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
product_iduuidFK to products
attribute_keyvarchar(100)fabric, stone, jewelry_type, style, fit
attribute_valuevarchar(255)Attribute value
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

product_id -> products.id

## Important Indexes:

## product_id

(attribute_key, attribute_value)

## Relationships:

M-1 products

## Catalog / Media

product_images
Phase: Phase 1 | Purpose: Product gallery images and Cloudinary references.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
product_iduuidFK to products
variant_iduuidOptional FK to product_variants
urltextCloudinary secure URL
cloudinary_public_idvarchar(255)Optional Cloudinary public ID
alt_textvarchar(255)Image alt text for accessibility/SEO
sort_orderintegerGallery order
is_primarybooleanPrimary image flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

product_id -> products.id
variant_id -> product_variants.id

## Important Indexes:

## product_id

## variant_id

(product_id, is_primary)
(product_id, sort_order)

B&V PostgreSQL Database Design Reference v1.0

## Relationships:

M-1 products
M-1 optional product_variants

## Content References

blog_post_products
Phase: Phase 2 | Purpose: Links blog posts to products.
Primary Key: (blog_post_ref_id, product_id)
ColumnData TypePurpose / Notes
blog_post_ref_iduuidFK to blog_post_refs
product_iduuidFK to products

## Foreign Keys:

blog_post_ref_id -> blog_post_refs.id
product_id -> products.id

## Important Indexes:

## product_id

## Relationships:

M-M blog posts/products
blog_post_refs
Phase: Phase 2 | Purpose: Lightweight PostgreSQL references to Sanity blog/Love Notes posts for product linking,
search, and analytics.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
sanity_document_idvarchar(150)Sanity document ID
slugvarchar(220)Unique slug
titlevarchar(255)Post title
excerpttextShort excerpt
cover_image_urltextCover image
published_attimestamptzPublished timestamp
is_featuredbooleanFeature flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE sanity_document_id
UNIQUE slug
published_at DESC

## is_featured

## Relationships:

M-M products through blog_post_products
faq_items
Phase: Phase 2 | Purpose: FAQ content for ordering, delivery, custom orders, payments, returns, sizing, gift
packaging, love websites, jewelry care.

B&V PostgreSQL Database Design Reference v1.0
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
categoryvarchar(80)FAQ category
questiontextQuestion
answertextAnswer
sort_orderintegerDisplay order
is_activebooleanVisibility flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

## category

(is_active, sort_order)
lookbook_products
Phase: Phase 2 | Purpose: Links lookbooks to products.
Primary Key: (lookbook_ref_id, product_id)
ColumnData TypePurpose / Notes
lookbook_ref_iduuidFK to lookbook_refs
product_iduuidFK to products
sort_orderintegerDisplay order

## Foreign Keys:

lookbook_ref_id -> lookbook_refs.id
product_id -> products.id

## Important Indexes:

## product_id

(lookbook_ref_id, sort_order)

## Relationships:

M-M lookbooks/products
lookbook_refs
Phase: Phase 2 | Purpose: Lookbook/editorial references, usually backed by Sanity.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
sanity_document_idvarchar(150)Optional Sanity document ID
slugvarchar(220)Unique slug
titlevarchar(255)Lookbook title
descriptiontextOptional
cover_image_urltextCover image
lookbook_typevarchar(50)women, men, couple, jewelry, gift
published_attimestamptzPublished timestamp
is_featuredbooleanFeature flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## lookbook_type

## is_featured

B&V PostgreSQL Database Design Reference v1.0

## Relationships:

M-M products through lookbook_products
policy_pages
Phase: Phase 2 | Purpose: Privacy, terms, returns/exchanges, and shipping/delivery policies.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
titlevarchar(200)Page title
slugvarchar(220)Unique slug
contenttextPolicy content
versionvarchar(30)Optional version
is_activebooleanActive flag
published_attimestamptzPublished time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## is_active

static_pages
Phase: Phase 2 | Purpose: General content pages such as Our Story, Love Websites landing, care guide,
packaging.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
titlevarchar(200)Page title
slugvarchar(220)Unique slug
page_typevarchar(80)our_story, love_websites, care_guide,
packaging
contentjsonbFlexible page content
seo_titlevarchar(255)Optional SEO title
seo_descriptiontextOptional SEO description
is_activebooleanActive flag
published_attimestamptzPublished time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## page_type

## is_active

## Custom Orders

custom_request_files
Phase: Phase 1 | Purpose: Reference uploads for custom requests.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
custom_request_iduuidFK to custom_requests
file_urltextCloudinary/file URL
cloudinary_public_idvarchar(255)Optional

B&V PostgreSQL Database Design Reference v1.0
file_typevarchar(50)image, video, document
alt_textvarchar(255)Optional
created_attimestamptzCreation timestamp

## Foreign Keys:

custom_request_id -> custom_requests.id

## Important Indexes:

## custom_request_id

## Relationships:

M-1 custom_requests
custom_requests
Phase: Phase 1 | Purpose: Custom fashion, custom jewelry, gift box, embroidery, engraving, personalized notes,
and love website inquiry submissions.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
order_iduuidOptional FK to orders
request_typevarchar(50)custom_product, custom_jewelry, gift_box,
love_website
product_typevarchar(100)Optional product category
occasionvarchar(100)Birthday, anniversary, wedding, self-love,
etc.
customization_typevarchar(150)Engraving, embroidery, print, website, etc.
personalization_texttextSubmitted personalization text
preferred_colorvarchar(100)Preferred color
preferred_materialvarchar(100)Preferred material
budget_minnumeric(12,2)Minimum budget
budget_maxnumeric(12,2)Maximum budget
required_datedateNeeded by date
customer_namevarchar(150)Contact name
customer_phonevarchar(30)Contact phone
customer_emailvarchar(255)Optional email
messagetextCustomer message
statusvarchar(30)new, reviewing, quoted, accepted, rejected,
completed
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
order_id -> orders.id

## Important Indexes:

## user_id

## order_id

(request_type, status)

## customer_phone

created_at DESC

## Relationships:

M-1 optional users
M-1 optional orders

B&V PostgreSQL Database Design Reference v1.0
1-M custom_request_files
1-M custom_quotes
custom_quotes
Phase: Phase 2 | Purpose: Admin quotes for custom requests.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
custom_request_iduuidFK to custom_requests
created_by_user_iduuidOptional FK to users/admin
quoted_amountnumeric(12,2)Quoted price
currency_codechar(3)Default LKR
notestextQuote notes
statusvarchar(30)draft, sent, accepted, rejected, expired
valid_untiltimestamptzQuote expiry
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

custom_request_id -> custom_requests.id
created_by_user_id -> users.id

## Important Indexes:

## custom_request_id

## status

## valid_until

## Relationships:

M-1 custom_requests
M-1 optional users

## Customer

customer_addresses
Phase: Phase 2 | Purpose: Saved addresses for checkout and account dashboard.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
recipient_namevarchar(150)Recipient full name
phonevarchar(30)Delivery phone
address_line1varchar(255)Primary address line
address_line2varchar(255)Optional
cityvarchar(100)City
districtvarchar(100)Nullable
provincevarchar(100)Nullable
postal_codevarchar(20)Nullable
country_codechar(2)Default LK
is_defaultbooleanDefault address flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

B&V PostgreSQL Database Design Reference v1.0

## Important Indexes:

## user_id

## city

(user_id, is_default)

## Relationships:

M-1 users
customer_profiles
Phase: Phase 2 | Purpose: Extended ecommerce customer profile separated from auth identity.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users; unique one profile per user
first_namevarchar(100)First name
last_namevarchar(100)Last name
date_of_birthdateNullable
gender_preferencevarchar(30)Optional style/audience preference
marketing_opt_inbooleanNewsletter/promo consent
preferred_languagevarchar(10)Default en
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

UNIQUE user_id

## marketing_opt_in

## Relationships:

1-1 users

## Gift Box Builder

gift_box_build_items
Phase: Phase 2 | Purpose: Selected products inside a customer gift box.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
gift_box_build_iduuidFK to gift_box_builds
product_iduuidFK to products
variant_iduuidOptional FK to product_variants
quantityintegerSelected quantity
unit_pricenumeric(12,2)Price snapshot
selected_optionsjsonbSelected options snapshot
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

gift_box_build_id -> gift_box_builds.id
product_id -> products.id

B&V PostgreSQL Database Design Reference v1.0
variant_id -> product_variants.id

## Important Indexes:

## gift_box_build_id

## product_id

## variant_id

## Relationships:

M-1 gift_box_builds
M-1 products
M-1 optional variants
gift_box_builds
Phase: Phase 2 | Purpose: Customer-created gift box session/build.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
cart_iduuidOptional FK to carts
order_iduuidOptional FK to orders
gift_box_template_iduuidOptional FK to gift_box_templates
recipient_namevarchar(150)Optional recipient
occasionvarchar(100)Occasion
message_notetextGift note
packaging_optionvarchar(100)Packaging choice
statusvarchar(30)draft, added_to_cart, ordered, abandoned
total_amountnumeric(12,2)Build total
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
cart_id -> carts.id
order_id -> orders.id
gift_box_template_id -> gift_box_templates.id

## Important Indexes:

## user_id

## cart_id

## order_id

## status

## Relationships:

M-1 optional users/carts/orders
1-M gift_box_build_items
gift_box_template_items
Phase: Phase 2 | Purpose: Default/allowed products inside gift box templates.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()

B&V PostgreSQL Database Design Reference v1.0
gift_box_template_iduuidFK to gift_box_templates
product_iduuidFK to products
variant_iduuidOptional FK to product_variants
quantityintegerDefault quantity
is_requiredbooleanRequired item flag
sort_orderintegerDisplay order
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

gift_box_template_id -> gift_box_templates.id
product_id -> products.id
variant_id -> product_variants.id

## Important Indexes:

## gift_box_template_id

## product_id

## variant_id

## Relationships:

M-1 gift_box_templates
M-1 products
M-1 optional variants
gift_box_templates
Phase: Phase 2 | Purpose: Reusable gift box templates such as self-love box, jewelry gift box, birthday box, couple
box.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Template name
slugvarchar(180)Unique slug
descriptiontextOptional
box_typevarchar(80)self_love, jewelry, birthday, couple,
anniversary, seasonal
base_pricenumeric(12,2)Base packaging/service price
image_urltextOptional image
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## box_type

## is_active

## Relationships:

1-M gift_box_template_items
1-M gift_box_builds
Gift Finder / AI
gift_finder_answers
Phase: Phase 2 | Purpose: Answers within a gift finder session.

B&V PostgreSQL Database Design Reference v1.0
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
session_iduuidFK to gift_finder_sessions
question_keyvarchar(100)Question key
answer_valuetextAnswer value
answer_jsonjsonbOptional structured answer
created_attimestamptzCreation timestamp

## Foreign Keys:

session_id -> gift_finder_sessions.id

## Important Indexes:

## session_id

## question_key

## Relationships:

M-1 gift_finder_sessions
gift_finder_recommendations
Phase: Phase 2 | Purpose: Products recommended by gift finder.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
session_iduuidFK to gift_finder_sessions
product_iduuidFK to products
scorenumeric(8,4)Recommendation score
reasontextRecommendation explanation
sort_orderintegerDisplay order
created_attimestamptzCreation timestamp

## Foreign Keys:

session_id -> gift_finder_sessions.id
product_id -> products.id

## Important Indexes:

## session_id

## product_id

score DESC

## Relationships:

M-1 sessions/products
gift_finder_sessions
Phase: Phase 2 | Purpose: One gift finder quiz attempt.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
guest_tokenvarchar(100)Anonymous token
recipientvarchar(100)Recipient
occasionvarchar(100)Occasion
budget_minnumeric(12,2)Min budget

B&V PostgreSQL Database Design Reference v1.0
budget_maxnumeric(12,2)Max budget
style_preferencevarchar(100)Style preference
statusvarchar(30)started, completed, abandoned
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

## user_id

## guest_token

## status

## Relationships:

1-M gift_finder_answers
1-M gift_finder_recommendations
product_recommendations
Phase: Phase 3 | Purpose: Precomputed product recommendations.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
source_product_iduuidOptional FK to products
recommended_product_iduuidFK to products
recommendation_typevarchar(80)similar, complete_the_look, gift_pairing,
couple_match
scorenumeric(8,4)Recommendation score
reasontextExplanation
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
source_product_id -> products.id
recommended_product_id -> products.id

## Important Indexes:

## user_id

## source_product_id

## recommended_product_id

(recommendation_type, score DESC)

## Relationships:

M-1 optional users
M-1 products
recommendation_events
Phase: Phase 3 | Purpose: Behavior events for recommendation learning.
Primary Key: id

B&V PostgreSQL Database Design Reference v1.0
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
product_iduuidOptional FK to products
event_typevarchar(80)viewed, saved, added_to_cart, purchased,
clicked_recommendation
event_valuenumeric(12,2)Optional monetary/value score
metadatajsonbFlexible context
created_attimestamptzEvent time

## Foreign Keys:

user_id -> users.id
product_id -> products.id

## Important Indexes:

## user_id

## product_id

## event_type

created_at DESC

## Relationships:

M-1 optional users/products
recommendation_profiles
Phase: Phase 3 | Purpose: User personalization profile for AI stylist/gift finder.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
preferred_stylestext[]Preferred styles
preferred_categoriestext[]Preferred categories
preferred_budget_minnumeric(12,2)Min budget
preferred_budget_maxnumeric(12,2)Max budget
favorite_colorstext[]Favorite colors
metadatajsonbFlexible AI metadata
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

UNIQUE user_id
GIN metadata

## Relationships:

1-1 users
search_queries
Phase: Phase 3 | Purpose: Search analytics and query improvement data.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()

B&V PostgreSQL Database Design Reference v1.0
user_iduuidOptional FK to users
querytextSearch query
results_countintegerNumber of results
clicked_product_iduuidOptional clicked product
created_attimestamptzSearch time

## Foreign Keys:

user_id -> users.id
clicked_product_id -> products.id

## Important Indexes:

## user_id

## clicked_product_id

created_at DESC
GIN to_tsvector(query)

## Relationships:

M-1 optional users/products

## Identity & Access

users
Phase: Phase 1 | Purpose: Main customer, staff, and admin identity. Supports guest-to-account conversion and
future customer dashboard.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Display or full name
emailvarchar(255)Unique login/contact email; normalized
lowercase in app
phonevarchar(30)Customer contact phone / WhatsApp
password_hashtextNullable when using OAuth/Auth.js only
image_urltextProfile/avatar image URL
rolevarchar(30)customer, admin, staff
statusvarchar(30)active, disabled, deleted
email_verified_attimestamptzNullable verification timestamp
last_login_attimestamptzNullable last login timestamp
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE lower(email)

## phone

## role

## status

## Relationships:

1-M customer_profiles
1-M customer_addresses
1-M carts
1-M orders
1-M custom_requests
1-M wishlists
1-M reviews

B&V PostgreSQL Database Design Reference v1.0
1-M customer_memories
1-M subscriptions
1-M love_website_projects
accounts
Phase: Phase 2 | Purpose: Auth.js/OAuth provider accounts linked to users.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
typevarchar(50)OAuth/account type
providervarchar(100)Provider name
provider_account_idvarchar(255)External provider account ID
refresh_tokentextNullable
access_tokentextNullable
expires_atintegerNullable token expiry
token_typevarchar(100)Nullable
scopetextNullable
id_tokentextNullable
session_statetextNullable
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

## user_id

UNIQUE(provider, provider_account_id)

## Relationships:

M-1 users
sessions
Phase: Phase 2 | Purpose: Auth session persistence for customer/admin accounts.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
session_tokenvarchar(255)Unique session token
expirestimestamptzSession expiration
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

UNIQUE session_token

## user_id

## expires

## Relationships:

B&V PostgreSQL Database Design Reference v1.0
M-1 users
verification_tokens
Phase: Phase 2 | Purpose: Email/passwordless verification token storage.
Primary Key: (identifier, token)
ColumnData TypePurpose / Notes
identifiervarchar(255)Email or identifier
tokenvarchar(255)Verification token
expirestimestamptzExpiration timestamp

## Important Indexes:

UNIQUE token

## identifier

## expires

authenticators
Phase: Phase 3 | Purpose: Future passkey/WebAuthn support.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
credential_idvarchar(255)Unique credential identifier
provider_account_idvarchar(255)Provider account mapping
credential_public_keytextPublic key
counterintegerReplay counter
credential_device_typevarchar(50)Device type
credential_backed_upbooleanBackup flag
transportstext[]Optional transports
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

UNIQUE credential_id

## user_id

## Relationships:

M-1 users

## Inventory

inventory_locations
Phase: Phase 3 | Purpose: Stock locations such as warehouse, studio, showroom, home.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(120)Location name
location_typevarchar(50)warehouse, studio, showroom, home
addresstextOptional address
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()

B&V PostgreSQL Database Design Reference v1.0
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

## location_type

## is_active

## Relationships:

1-M inventory_stock
1-M inventory_movements
inventory_movements
Phase: Phase 3 | Purpose: Stock movement ledger for auditability.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
variant_iduuidFK to product_variants
location_iduuidFK to inventory_locations
order_iduuidOptional FK to orders
movement_typevarchar(50)stock_in, sold, returned, damaged, adjusted,
reserved, released
quantityintegerMovement quantity
notetextOptional note
reference_typevarchar(50)Optional external reference type
reference_iduuidOptional external reference id
created_by_user_iduuidOptional FK to users
created_attimestamptzMovement time

## Foreign Keys:

variant_id -> product_variants.id
location_id -> inventory_locations.id
order_id -> orders.id
created_by_user_id -> users.id

## Important Indexes:

## variant_id

## location_id

## order_id

created_at DESC

## movement_type

## Relationships:

M-1 product_variants
M-1 inventory_locations
M-1 optional orders
inventory_stock
Phase: Phase 3 | Purpose: Current stock per variant and location.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
variant_iduuidFK to product_variants
location_iduuidFK to inventory_locations
on_hand_quantityintegerPhysical quantity

B&V PostgreSQL Database Design Reference v1.0
reserved_quantityintegerReserved quantity
available_quantityintegerAvailable sellable quantity
updated_attimestamptzLast stock update

## Foreign Keys:

variant_id -> product_variants.id
location_id -> inventory_locations.id

## Important Indexes:

UNIQUE(variant_id, location_id)

## variant_id

## location_id

## available_quantity

## Relationships:

M-1 product_variants
M-1 inventory_locations

## Love Website Services

love_website_assets
Phase: Phase 3 | Purpose: Images, videos, audio, and files used in love websites.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
project_iduuidFK to love_website_projects
page_iduuidOptional FK to love_website_pages
asset_urltextCloudinary/file URL
cloudinary_public_idvarchar(255)Optional
asset_typevarchar(50)image, video, audio, document
captiontextOptional caption
sort_orderintegerDisplay order
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

project_id -> love_website_projects.id
page_id -> love_website_pages.id

## Important Indexes:

## project_id

## page_id

## Relationships:

M-1 love_website_projects
M-1 optional pages
love_website_guestbook_entries
Phase: Phase 3 | Purpose: Public guestbook messages for love website projects.
Primary Key: id
ColumnData TypePurpose / Notes

B&V PostgreSQL Database Design Reference v1.0
iduuidPrimary key, default gen_random_uuid()
project_iduuidFK to love_website_projects
guest_namevarchar(150)Guest name
guest_emailvarchar(255)Optional
messagetextGuest message
statusvarchar(30)pending, approved, rejected
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

project_id -> love_website_projects.id

## Important Indexes:

## project_id

## status

created_at DESC

## Relationships:

M-1 love_website_projects
love_website_pages
Phase: Phase 3 | Purpose: Pages inside a generated love website.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
project_iduuidFK to love_website_projects
page_typevarchar(80)home, story, gallery, countdown, rsvp,
guestbook, timeline
titlevarchar(200)Page title
slugvarchar(180)Page slug
contentjsonbPage content blocks
sort_orderintegerPage order
is_publishedbooleanPublish flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

project_id -> love_website_projects.id

## Important Indexes:

## project_id

## slug

(project_id, sort_order)

## Relationships:

M-1 love_website_projects
1-M love_website_assets
love_website_projects
Phase: Phase 3 | Purpose: Customer-created love website project.
Primary Key: id
ColumnData TypePurpose / Notes

B&V PostgreSQL Database Design Reference v1.0
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
order_iduuidOptional FK to orders
template_iduuidOptional FK to love_website_templates
titlevarchar(200)Project title
slugvarchar(220)Unique public slug
project_typevarchar(80)Project type
statusvarchar(30)draft, in_progress, published, archived
content_snapshotjsonbProject content snapshot
published_attimestamptzPublish timestamp
expires_attimestamptzOptional expiry
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
order_id -> orders.id
template_id -> love_website_templates.id

## Important Indexes:

UNIQUE slug

## user_id

## order_id

## status

## Relationships:

M-1 users
M-1 optional orders/templates
1-M love_website_pages
1-M love_website_assets
1-M guestbook_entries
love_website_templates
Phase: Phase 3 | Purpose: Template gallery for Our Story, proposal, anniversary, wedding RSVP, birthday,
scrapbook, guestbook pages.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Template name
slugvarchar(180)Unique slug
template_typevarchar(80)our_story, proposal, anniversary,
wedding_rsvp, birthday, scrapbook,
guestbook
descriptiontextOptional
preview_image_urltextPreview image
base_pricenumeric(12,2)Base service price
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## template_type

## is_active

## Relationships:

B&V PostgreSQL Database Design Reference v1.0
1-M love_website_projects

## Marketing / Merchandising

campaign_products
Phase: Phase 2 | Purpose: Products featured in campaigns.
Primary Key: (campaign_id, product_id)
ColumnData TypePurpose / Notes
campaign_iduuidFK to campaigns
product_iduuidFK to products
sort_orderintegerDisplay order

## Foreign Keys:

campaign_id -> campaigns.id
product_id -> products.id

## Important Indexes:

## product_id

(campaign_id, sort_order)

## Relationships:

M-M campaigns/products
campaigns
Phase: Phase 2 | Purpose: Seasonal campaigns, launch drops, influencer edits, and promotional events.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Campaign name
slugvarchar(180)Unique URL slug
descriptiontextOptional
campaign_typevarchar(50)seasonal, launch, sale, collection, influencer
statusvarchar(30)draft, active, ended, archived
banner_image_urltextOptional
starts_attimestamptzCampaign start
ends_attimestamptzCampaign end
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## status

(starts_at, ends_at)

## Relationships:

M-M products through campaign_products
1-M coupons

## Marketing / Support

contact_messages
Phase: Phase 1 | Purpose: Contact form messages from website visitors.

B&V PostgreSQL Database Design Reference v1.0
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Sender name
emailvarchar(255)Optional email
phonevarchar(30)Optional phone
subjectvarchar(200)Optional subject
messagetextMessage body
sourcevarchar(50)contact_page, footer, love_website
statusvarchar(30)new, read, replied, closed
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

## status

created_at DESC

## email

newsletter_subscribers
Phase: Phase 1 | Purpose: Newsletter/drop announcement subscriptions.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
emailvarchar(255)Subscriber email
sourcevarchar(80)footer, popup, checkout, blog
statusvarchar(30)subscribed, unsubscribed, bounced
subscribed_attimestamptzSubscribe time
unsubscribed_attimestamptzUnsubscribe time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

UNIQUE lower(email)

## user_id

## status

## Relationships:

M-1 optional users
coupon_redemptions
Phase: Phase 2 | Purpose: Coupon usage history.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
coupon_iduuidFK to coupons
order_iduuidFK to orders
user_iduuidOptional FK to users
discount_amountnumeric(12,2)Applied discount
redeemed_attimestamptzRedemption time
created_attimestamptzCreation timestamp

## Foreign Keys:

B&V PostgreSQL Database Design Reference v1.0
coupon_id -> coupons.id
order_id -> orders.id
user_id -> users.id

## Important Indexes:

## coupon_id

## order_id

## user_id

## Relationships:

M-1 coupons/orders/users
coupons
Phase: Phase 2 | Purpose: Discount codes and future promotional offers.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
codevarchar(80)Unique coupon code
campaign_iduuidOptional FK to campaigns
discount_typevarchar(40)percentage, fixed_amount, free_shipping
discount_valuenumeric(12,2)Discount value
minimum_order_amountnumeric(12,2)Optional minimum spend
usage_limitintegerOptional maximum usage
usage_countintegerCurrent usage
starts_attimestamptzStart time
ends_attimestamptzEnd time
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

campaign_id -> campaigns.id

## Important Indexes:

UNIQUE upper(code)

## campaign_id

## is_active

(starts_at, ends_at)

## Relationships:

M-1 optional campaigns
1-M coupon_redemptions

## Merchandising

collection_products
Phase: Phase 1 | Purpose: Join table ordering products inside collections.
Primary Key: (collection_id, product_id)
ColumnData TypePurpose / Notes
collection_iduuidFK to collections
product_iduuidFK to products

B&V PostgreSQL Database Design Reference v1.0
sort_orderintegerProduct order in collection

## Foreign Keys:

collection_id -> collections.id
product_id -> products.id

## Important Indexes:

(collection_id, sort_order)

## product_id

## Relationships:

M-M collections/products
collections
Phase: Phase 1 | Purpose: Curated product groups such as New Arrivals, Limited Drop, Fashion Edit, Jewelry

## Highlight, Couple Collection.

Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Collection name
slugvarchar(180)Unique URL slug
descriptiontextOptional
collection_typevarchar(50)new_arrivals, limited_drop, featured, manual
image_urltextOptional image
is_activebooleanVisibility flag
sort_orderintegerDisplay order
starts_attimestamptzOptional campaign window start
ends_attimestamptzOptional campaign window end
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug
(is_active, collection_type)

## sort_order

(starts_at, ends_at)

## Relationships:

M-M products through collection_products

## Offline / Showroom

offline_sale_items
Phase: Phase 4 | Purpose: POS sale line items with product snapshots.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
offline_sale_iduuidFK to offline_sales
product_iduuidOptional FK to products
variant_iduuidOptional FK to product_variants
product_namevarchar(200)Snapshot
variant_namevarchar(150)Snapshot
skuvarchar(100)Snapshot
quantityintegerQuantity

B&V PostgreSQL Database Design Reference v1.0
unit_pricenumeric(12,2)Unit price
line_totalnumeric(12,2)Line total
created_attimestamptzCreation timestamp

## Foreign Keys:

offline_sale_id -> offline_sales.id
product_id -> products.id
variant_id -> product_variants.id

## Important Indexes:

## offline_sale_id

## product_id

## variant_id

## Relationships:

M-1 offline_sales/products/variants
offline_sales
Phase: Phase 4 | Purpose: Showroom/POS sale header.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
sale_numbervarchar(50)Unique sale number
user_iduuidOptional customer user
showroom_location_iduuidOptional FK to showroom_locations
customer_namevarchar(150)Optional snapshot
customer_phonevarchar(30)Optional snapshot
subtotal_amountnumeric(12,2)Subtotal
discount_amountnumeric(12,2)Discount
total_amountnumeric(12,2)Total
payment_methodvarchar(50)Cash/card/bank/etc.
statusvarchar(30)completed, voided, refunded
sold_attimestamptzSale time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
showroom_location_id -> showroom_locations.id

## Important Indexes:

UNIQUE sale_number

## user_id

## showroom_location_id

sold_at DESC

## Relationships:

1-M offline_sale_items
photoshoot_bookings
Phase: Phase 4 | Purpose: Photoshoot bookings.
Primary Key: id

B&V PostgreSQL Database Design Reference v1.0
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
photoshoot_package_iduuidFK to photoshoot_packages
customer_namevarchar(150)Customer name
customer_phonevarchar(30)Customer phone
customer_emailvarchar(255)Optional
scheduled_attimestamptzScheduled time
location_notetextLocation/context
statusvarchar(30)pending, confirmed, completed, cancelled
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
photoshoot_package_id -> photoshoot_packages.id

## Important Indexes:

## user_id

## photoshoot_package_id

## scheduled_at

## status

## Relationships:

M-1 users/packages
photoshoot_packages
Phase: Phase 4 | Purpose: Photoshoot service packages.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Package name
slugvarchar(180)Unique slug
descriptiontextOptional
pricenumeric(12,2)Package price
duration_minutesintegerOptional duration
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## is_active

## Relationships:

1-M photoshoot_bookings
showroom_appointments
Phase: Phase 4 | Purpose: Showroom, fitting, jewelry viewing, and custom consultation appointments.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users
showroom_location_iduuidFK to showroom_locations

B&V PostgreSQL Database Design Reference v1.0
customer_namevarchar(150)Customer name
customer_phonevarchar(30)Customer phone
customer_emailvarchar(255)Optional email
appointment_typevarchar(80)fitting, jewelry_viewing, custom_consultation
scheduled_attimestamptzAppointment time
statusvarchar(30)pending, confirmed, completed, cancelled
notestextOptional notes
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
showroom_location_id -> showroom_locations.id

## Important Indexes:

## user_id

## showroom_location_id

## scheduled_at

## status

## Relationships:

M-1 users/locations
showroom_locations
Phase: Phase 4 | Purpose: Physical showroom/studio locations.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Location name
addresstextAddress
cityvarchar(100)City
phonevarchar(30)Phone
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

## city

## is_active

## Relationships:

1-M showroom_appointments
1-M offline_sales

## Orders

order_items
Phase: Phase 1 | Purpose: Historical order line snapshots. This protects orders from later product/catalog changes.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
order_iduuidFK to orders
product_iduuidOptional FK to live product

B&V PostgreSQL Database Design Reference v1.0
variant_iduuidOptional FK to live variant
product_namevarchar(200)Checkout-time product name snapshot
variant_namevarchar(150)Checkout-time variant name snapshot
skuvarchar(100)SKU snapshot
image_urltextImage URL snapshot
quantityintegerPurchased/inquired quantity
unit_pricenumeric(12,2)Checkout-time unit price
line_totalnumeric(12,2)quantity * unit_price
selected_optionsjsonbCheckout-time options snapshot
personalizationjsonbPersonalization snapshot
gift_notetextLine-level gift note
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

order_id -> orders.id
product_id -> products.id
variant_id -> product_variants.id

## Important Indexes:

## order_id

## product_id

## variant_id

## Relationships:

M-1 orders
M-1 optional products
M-1 optional product_variants
orders
Phase: Phase 1 | Purpose: Main order/inquiry header. Supports Phase 1 inquiry-friendly flow and future paid
ecommerce orders.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
order_numbervarchar(50)Unique public order number
user_iduuidOptional FK to users
cart_iduuidOptional FK to carts
checkout_session_iduuidOptional FK to checkout_sessions
customer_namevarchar(150)Customer name snapshot
customer_phonevarchar(30)Customer phone snapshot
customer_emailvarchar(255)Optional email snapshot
shipping_address_line1varchar(255)Shipping snapshot
shipping_address_line2varchar(255)Nullable
shipping_cityvarchar(100)Shipping city
shipping_districtvarchar(100)Nullable
shipping_provincevarchar(100)Nullable
shipping_postal_codevarchar(20)Nullable
shipping_country_codechar(2)Default LK
order_notetextCustomer order note
gift_notetextGift note
whatsapp_confirmationbooleanWhatsApp confirmation requested
statusvarchar(30)inquiry, pending, confirmed, processing,
shipped, delivered, cancelled
payment_statusvarchar(30)not_required, pending, paid, failed, refunded
fulfillment_statusvarchar(30)unfulfilled, partial, fulfilled
subtotal_amountnumeric(12,2)Subtotal
shipping_amountnumeric(12,2)Shipping fee
discount_amountnumeric(12,2)Discount total
tax_amountnumeric(12,2)Tax total
total_amountnumeric(12,2)Order total

B&V PostgreSQL Database Design Reference v1.0
currency_codechar(3)Default LKR
placed_attimestamptzOrder placed timestamp
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
cart_id -> carts.id
checkout_session_id -> checkout_sessions.id

## Important Indexes:

UNIQUE order_number

## user_id

## cart_id

## status

## payment_status

## customer_phone

placed_at DESC

## Relationships:

M-1 optional users
M-1 optional carts
1-M order_items
1-M payments
1-M refunds
1-M order_status_events
1-M shipments
order_status_events
Phase: Phase 2 | Purpose: Order timeline and status audit history.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
order_iduuidFK to orders
changed_by_user_iduuidOptional FK to admin/customer user
from_statusvarchar(30)Previous status
to_statusvarchar(30)New status
notetextOptional note
metadatajsonbOptional context
created_attimestamptzEvent timestamp

## Foreign Keys:

order_id -> orders.id
changed_by_user_id -> users.id

## Important Indexes:

## order_id

created_at DESC

## changed_by_user_id

## Relationships:

M-1 orders

B&V PostgreSQL Database Design Reference v1.0
M-1 optional users

## Payments

payments
Phase: Phase 1 | Purpose: Payment attempts/results for manual inquiry flow, PayHere, and KOKO.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
order_iduuidFK to orders
providervarchar(50)manual, payhere, koko
methodvarchar(50)bank_transfer, cod, card, installment
amountnumeric(12,2)Payment amount
currency_codechar(3)Default LKR
statusvarchar(30)pending, paid, failed, cancelled, refunded
provider_referencevarchar(150)External provider reference
gateway_responsejsonbRaw/summarized gateway response
paid_attimestamptzPayment completion time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

order_id -> orders.id

## Important Indexes:

## order_id

## status

(provider, provider_reference)
paid_at DESC

## Relationships:

M-1 orders
1-M refunds
1-M payment_webhooks
payment_webhooks
Phase: Phase 2 | Purpose: Raw gateway webhook logs for PayHere/KOKO idempotency and debugging.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
payment_iduuidOptional FK to payments
order_iduuidOptional FK to orders
providervarchar(50)payhere, koko
event_typevarchar(100)Gateway event type
provider_referencevarchar(150)External reference
payloadjsonbRaw webhook payload
signature_validbooleanSignature verification result
processed_attimestamptzProcessing completion time
processing_statusvarchar(30)pending, processed, failed
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

payment_id -> payments.id

B&V PostgreSQL Database Design Reference v1.0
order_id -> orders.id

## Important Indexes:

## payment_id

## order_id

(provider, provider_reference)

## processing_status

## Relationships:

M-1 optional payments
M-1 optional orders
refunds
Phase: Phase 2 | Purpose: Refund records linked to orders and payments.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
order_iduuidFK to orders
payment_iduuidFK to payments
amountnumeric(12,2)Refund amount
currency_codechar(3)Default LKR
reasontextOptional reason
statusvarchar(30)pending, approved, completed, failed
provider_referencevarchar(150)Gateway refund reference
refunded_attimestamptzRefund completion time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

order_id -> orders.id
payment_id -> payments.id

## Important Indexes:

## order_id

## payment_id

## status

## provider_reference

## Relationships:

M-1 orders
M-1 payments

## Reviews & Memories

customer_memories
Phase: Phase 2 | Purpose: Social proof/customer stories: styling photos, gift reactions, unboxings, couple stories,
testimonials.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidOptional FK to users

B&V PostgreSQL Database Design Reference v1.0
product_iduuidOptional FK to products
order_iduuidOptional FK to orders
titlevarchar(200)Optional
storytextStory/testimonial
memory_typevarchar(50)styling, gift_reaction, jewelry_unboxing,
couple_story, testimonial
customer_namevarchar(150)Optional display name
statusvarchar(30)pending, approved, rejected
is_featuredbooleanFeature on homepage
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
product_id -> products.id
order_id -> orders.id

## Important Indexes:

## user_id

## product_id

## status

## is_featured

## Relationships:

M-1 optional users/products/orders
1-M customer_memory_assets
customer_memory_assets
Phase: Phase 2 | Purpose: Images/videos attached to customer memories.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
customer_memory_iduuidFK to customer_memories
asset_urltextCloudinary/file URL
cloudinary_public_idvarchar(255)Optional
asset_typevarchar(50)image, video
captiontextOptional
sort_orderintegerDisplay order
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

customer_memory_id -> customer_memories.id

## Important Indexes:

## customer_memory_id

## Relationships:

M-1 customer_memories
reviews
Phase: Phase 2 | Purpose: Product reviews submitted by customers.
Primary Key: id

B&V PostgreSQL Database Design Reference v1.0
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
product_iduuidFK to products
order_iduuidOptional FK to orders
ratinginteger1-5 rating
titlevarchar(200)Optional
bodytextOptional review text
statusvarchar(30)pending, approved, rejected
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
product_id -> products.id
order_id -> orders.id

## Important Indexes:

## product_id

## user_id

## order_id

## status

## rating

## Relationships:

M-1 users/products/orders

## Shipping

shipment_events
Phase: Phase 2 | Purpose: Tracking timeline for shipments.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
shipment_iduuidFK to shipments
statusvarchar(50)Tracking status
messagetextOptional message
locationvarchar(150)Optional location
event_timetimestamptzEvent time
raw_payloadjsonbOptional courier payload
created_attimestamptzCreation timestamp

## Foreign Keys:

shipment_id -> shipments.id

## Important Indexes:

## shipment_id

event_time DESC

## Relationships:

M-1 shipments
shipments
Phase: Phase 2 | Purpose: Actual shipment/package for an order.

B&V PostgreSQL Database Design Reference v1.0
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
order_iduuidFK to orders
shipping_method_iduuidOptional FK to shipping_methods
tracking_numbervarchar(150)Courier tracking number
carrier_namevarchar(100)Courier/carrier
statusvarchar(30)pending, packed, shipped, delivered,
returned
shipped_attimestamptzShipment time
delivered_attimestamptzDelivered time
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

order_id -> orders.id
shipping_method_id -> shipping_methods.id

## Important Indexes:

## order_id

## tracking_number

## status

## Relationships:

M-1 orders
M-1 shipping_methods
1-M shipment_events
shipping_methods
Phase: Phase 2 | Purpose: Delivery methods such as standard delivery, express delivery, pickup, and international
shipping.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(120)Display name
codevarchar(80)Unique code
descriptiontextOptional
base_pricenumeric(12,2)Default method price
is_activebooleanVisibility flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE code

## is_active

## Relationships:

1-M shipping_rates
1-M shipments
shipping_rates
Phase: Phase 3 | Purpose: Rates by shipping method and zone.
Primary Key: id

B&V PostgreSQL Database Design Reference v1.0
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
shipping_method_iduuidFK to shipping_methods
shipping_zone_iduuidFK to shipping_zones
pricenumeric(12,2)Rate price
min_order_amountnumeric(12,2)Optional free/conditional threshold
max_weight_gramsintegerOptional weight cap
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

shipping_method_id -> shipping_methods.id
shipping_zone_id -> shipping_zones.id

## Important Indexes:

(shipping_method_id, shipping_zone_id)

## is_active

## Relationships:

M-1 shipping_methods
M-1 shipping_zones
shipping_zones
Phase: Phase 3 | Purpose: Shipping zones for local and international shipping.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(120)Zone name
country_codechar(2)Default LK
provincevarchar(100)Nullable
districtvarchar(100)Nullable
cityvarchar(100)Nullable
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

## country_code

(province, district, city)

## is_active

## Relationships:

1-M shipping_rates

## Subscriptions

subscription_orders
Phase: Phase 3 | Purpose: Generated recurring order links.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
subscription_iduuidFK to subscriptions

B&V PostgreSQL Database Design Reference v1.0
order_iduuidFK to orders
billing_period_startdatePeriod start
billing_period_enddatePeriod end
statusvarchar(30)generated, paid, skipped, failed
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

subscription_id -> subscriptions.id
order_id -> orders.id

## Important Indexes:

## subscription_id

## order_id

(billing_period_start, billing_period_end)

## Relationships:

M-1 subscriptions/orders
subscription_plans
Phase: Phase 3 | Purpose: Recurring box plans: jewelry box, self-care box, couple box, seasonal box.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Plan name
slugvarchar(180)Unique slug
descriptiontextOptional
plan_typevarchar(80)jewelry_box, self_care_box, couple_box,
seasonal_box
pricenumeric(12,2)Plan price
currency_codechar(3)Default LKR
billing_intervalvarchar(30)monthly, quarterly, yearly
is_activebooleanActive flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

UNIQUE slug

## plan_type

## is_active

## Relationships:

1-M subscriptions
subscriptions
Phase: Phase 3 | Purpose: Customer recurring subscription.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
subscription_plan_iduuidFK to subscription_plans
statusvarchar(30)active, paused, cancelled, expired
started_attimestamptzStart time
next_billing_attimestamptzNext billing time

B&V PostgreSQL Database Design Reference v1.0
cancelled_attimestamptzCancellation time
shipping_address_snapshotjsonbShipping snapshot
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id
subscription_plan_id -> subscription_plans.id

## Important Indexes:

## user_id

## subscription_plan_id

## status

## next_billing_at

## Relationships:

M-1 users/plans
1-M subscription_orders

## Supplier & Purchasing

purchase_order_items
Phase: Phase 4 | Purpose: Purchase order line items.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
purchase_order_iduuidFK to purchase_orders
variant_iduuidFK to product_variants
quantityintegerOrdered quantity
unit_costnumeric(12,2)Unit cost
line_totalnumeric(12,2)Line total
received_quantityintegerReceived quantity
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

purchase_order_id -> purchase_orders.id
variant_id -> product_variants.id

## Important Indexes:

## purchase_order_id

## variant_id

## Relationships:

M-1 purchase_orders/product_variants
purchase_orders
Phase: Phase 4 | Purpose: Stock purchase order header.
Primary Key: id
ColumnData TypePurpose / Notes

B&V PostgreSQL Database Design Reference v1.0
iduuidPrimary key, default gen_random_uuid()
purchase_order_numbervarchar(50)Unique PO number
supplier_iduuidFK to supplier_profiles
statusvarchar(30)draft, ordered, received, cancelled
ordered_attimestamptzOrder date
received_attimestamptzReceived date
subtotal_amountnumeric(12,2)Subtotal
total_amountnumeric(12,2)Total
notestextOptional notes
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

supplier_id -> supplier_profiles.id

## Important Indexes:

UNIQUE purchase_order_number

## supplier_id

## status

ordered_at DESC

## Relationships:

M-1 suppliers
1-M purchase_order_items
supplier_profiles
Phase: Phase 4 | Purpose: Suppliers/vendors for fashion, jewelry, packaging, printing.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
namevarchar(150)Supplier name
contact_personvarchar(150)Optional contact
emailvarchar(255)Optional
phonevarchar(30)Optional
addresstextOptional
supplier_typevarchar(80)fashion, jewelry, packaging, printing
statusvarchar(30)active, inactive, blocked
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Important Indexes:

## name

## supplier_type

## status

## Relationships:

1-M purchase_orders

## Wishlist

wishlist_items
Phase: Phase 2 | Purpose: Saved products/variants.
Primary Key: id

B&V PostgreSQL Database Design Reference v1.0
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
wishlist_iduuidFK to wishlists
product_iduuidFK to products
variant_iduuidOptional FK to product_variants
created_attimestamptzCreation timestamp

## Foreign Keys:

wishlist_id -> wishlists.id
product_id -> products.id
variant_id -> product_variants.id

## Important Indexes:

UNIQUE(wishlist_id, product_id, variant_id)

## product_id

## variant_id

## Relationships:

M-1 wishlists
M-1 products
wishlists
Phase: Phase 2 | Purpose: Customer wishlist container.
Primary Key: id
ColumnData TypePurpose / Notes
iduuidPrimary key, default gen_random_uuid()
user_iduuidFK to users
namevarchar(100)Wishlist name
is_defaultbooleanDefault wishlist flag
created_attimestamptzCreation timestamp, default now()
updated_attimestamptzLast update timestamp, maintained by
application or trigger

## Foreign Keys:

user_id -> users.id

## Important Indexes:

## user_id

(user_id, is_default)

## Relationships:

M-1 users
1-M wishlist_items

- Status and Enum Reference
  The initial implementation may use varchar status fields for faster iteration. Once workflows are stable, heavily
  used statuses can be converted to PostgreSQL enums. The following values should be treated as the controlled
  vocabulary.
  DomainRecommended statuses / values
  users.statusactive, disabled, deleted
  users.rolecustomer, admin, staff
  products.statusdraft, active, archived

B&V PostgreSQL Database Design Reference v1.0
orders.statusinquiry, pending, confirmed, processing, shipped, delivered, cancelled
orders.payment_statusnot_required, pending, paid, failed, refunded
payments.providermanual, payhere, koko
payments.statuspending, paid, failed, cancelled, refunded
custom_requests.statusnew, reviewing, quoted, accepted, rejected, completed
gift_box_builds.statusdraft, added_to_cart, ordered, abandoned
love_website_projects.statusdraft, in_progress, published, archived
reviews.statuspending, approved, rejected
subscriptions.statusactive, paused, cancelled, expired
ambassadors.statuspending, active, paused, rejected
shipments.statuspending, packed, shipped, delivered, returned
inventory_movements.movement_typestock_in, sold, returned, damaged, adjusted, reserved, released
offline_sales.statuscompleted, voided, refunded
purchase_orders.statusdraft, ordered, received, cancelled

## 11. Indexing Strategy

Always index foreign key columns used in joins and admin dashboards.
Use unique indexes for slugs, SKUs, public order numbers, referral codes, coupon codes, and provider
references where appropriate.
Use descending timestamp indexes for operational lists such as orders, messages, webhook logs, analytics
events, and purchase orders.
Use GIN indexes for jsonb only when that jsonb is actually queried, such as product variant options, analytics
metadata, or recommendation metadata.
Use full-text GIN indexes for product names and search queries when internal search becomes database-
backed.
Consider partial indexes later for high-volume operational filters, such as active products, pending webhooks,
pending custom requests, and active subscriptions.

- JSONB Usage Rules
  Good jsonb useReason
  cart_items.selected_optionsSelected options vary by product type: fashion size/color, jewelry
  material/chain length, gift packaging, etc.
  cart_items.personalizationCustom engraving, notes, uploaded references, and special instructions
  are flexible.
  order_items.selected_options / personalizationHistorical checkout snapshot must remain unchanged even if product
  structure changes.
  payment_webhooks.payloadGateway payloads are provider-specific and should be preserved raw.
  love_website_pages.contentPage builder content is block-based and flexible.
  analytics_events.metadataAnalytics metadata varies by event type.
  site_settings.setting_valueSettings can be string, boolean, number, list, or object.
  Avoid jsonb for core query fields such as product name, SKU, price, stock quantity, order status, payment status,
  customer phone/email, slug, or category filters. Those should remain typed columns.

## 13. Prisma Implementation Notes

Use String @id @default(uuid()) @db.Uuid for UUID primary keys in Prisma, or map to database-generated
UUIDs depending on project convention.
Use Decimal @db.Decimal(12, 2) for money fields.
Use DateTime @db.Timestamptz for timestamp columns where supported.
Use Json for jsonb fields.
Use @@index and @@unique to mirror the indexes listed in this document.
Use explicit relation names where the same table is referenced more than once, such as
product_recommendations.source_product_id and recommended_product_id.
For join tables with extra attributes such as sort_order, model them as full Prisma models instead of implicit
many-to-many relations.
Generate migrations phase by phase, not all at once.

B&V PostgreSQL Database Design Reference v1.0

## 14. Seed Data Plan

Seed areaInitial data
categoriesWomen, Men, Jewelry, Gifts, Couples, Custom, New In, audience tags,
occasions, materials, colors
collectionsNew Arrivals, Limited Drop, Fashion Edit, Jewelry Highlight, Couple

## Collection, Gift Ready

shipping_methodsStandard Delivery, Express Delivery, Pickup
gift_box_templatesSelf-Love Box, Jewelry Gift Box, Birthday Box, Couple Box, Anniversary

## Box

love_website_templatesOur Story, Proposal, Anniversary Countdown, Wedding RSVP, Birthday

## Surprise, Digital Scrapbook, Guestbook

faq_itemsOrdering, delivery, custom orders, payments, returns, sizing, gift
packaging, love websites, jewelry care
policy_pagesPrivacy Policy, Terms & Conditions, Returns & Exchanges, Shipping /

## Delivery Policy

site_settingsWhatsApp number, Instagram URL, TikTok URL, default currency, default
country, free shipping threshold

- Future Scaling and Operational Notes
  Phase 1 can keep stock_quantity on product_variants. Phase 3 should introduce inventory_stock and
  inventory_movements for real auditability.
  Payment webhooks should be idempotent and processed exactly once using provider and provider_reference
  indexes.
  Order creation should be transactional: create order, order items, payment attempt, cart conversion, and
  optional stock reservation together.
  Use read-optimized indexes for admin lists: orders by placed_at, custom_requests by status/created_at,
  payments by status, shipments by tracking number.
  For large analytics volume, analytics_events may later move to a separate analytics store, but the schema is
  useful for admin MVP and structured event capture.
  For international expansion, shipping_zones, shipping_rates, currency_code, and country_code fields are
  already included.
  For showroom expansion, offline_sales should snapshot product names and prices just like order_items.

## 16. Final Implementation Guidance

This reference is intentionally broader than the immediate MVP. The recommended development approach is to
keep the full architecture approved, then implement only the migration batch required for the current phase.
For Phase 1, implement the core ecommerce, product, cart, order/inquiry, custom request, contact, and newsletter
tables first. Keep Phase 2 to Phase 4 tables in the reference document until their features are actively built.
Recommended Phase 1 implementation set:
users
categories
products
product_variants
product_images
product_categories
collections
collection_products
carts
cart_items
orders
order_items
payments
custom_requests

B&V PostgreSQL Database Design Reference v1.0
custom_request_files
contact_messages
newsletter_subscribers

## 17. Source References

SourceUsed for
B&V - Phase Development ReferencePhase plan, current MVP scope, future features, navigation,
product/category scope, technology direction.
Couple Brand Business Ideas And Website Strategy v1.1Business positioning, customer segments, product categories, phase
direction, brand strategy.
Brand Identity & Design System Reference v1.1Brand context, light/dark theme, design system, product/media direction.
Technology Stack & Tools Reference v1.0Approved engineering stack: Next.js, TypeScript, Prisma, PostgreSQL,
Auth.js, Sanity, Cloudinary, PayHere, KOKO.
