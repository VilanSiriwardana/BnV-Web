# B&V PostgreSQL Database Design Reference

| Field               | Value                                                       |
| ------------------- | ----------------------------------------------------------- |
| Version             | 1.0 content + v1.1 reconciliation addendum (Section 18)     |
| Status              | Approved intent; Section 18 is PROPOSED                     |
| Converted / updated | 2026-10-28                                                  |
| Based on            | BV_PostgreSQL_Database_Design_Reference_v1_0.pdf (57 pages) |

> **Reference-library note.** This is the full Phase 1–4 schema blueprint. It describes design intent, not what is migrated. The current Prisma schema in `prisma/` is the source of truth for what exists. Prisma conventions (camelCase fields, `@map`, `@@map`, file layout) live in [Database-Design.md](Database-Design.md). Section 18 lists unresolved conflicts with newer documents.

# B&V

## PostgreSQL Database Design Reference

Version 1.0 - Full Phase 1 to Phase 4 Schema Plan Prepared for the B&V Modern Romantic Lifestyle Ecommerce Web App

| Item                     | Decision                                                                          |
| ------------------------ | --------------------------------------------------------------------------------- |
| Brand direction          | Modern Romantic Lifestyle Ecommerce Brand                                         |
| Brand promise            | Style for you. Gifts for them. Moments for two.                                   |
| Database                 | PostgreSQL with Prisma ORM                                                        |
| Application stack        | Next.js, TypeScript, Tailwind CSS, Auth.js, Sanity, Cloudinary, PayHere, KOKO     |
| Scope                    | Full long-term database blueprint covering Phase 1, Phase 2, Phase 3, and Phase 4 |
| Implementation principle | Plan all modules now, implement migrations phase by phase                         |

## Table of Contents

1. Purpose and Source Alignment
2. Database Design Philosophy
3. Phase-Based Schema Strategy
4. Global Data Type Standards
5. Naming and Constraint Rules
6. Relationship Overview
7. Migration Batches by Phase
8. Table Summary by Module
9. Detailed Table Reference
10. Status and Enum Reference
11. Indexing Strategy
12. JSONB Usage Rules
13. Prisma Implementation Notes
14. Seed Data Plan
15. Future Scaling and Operational Notes
16. Final Implementation Guidance
17. Source References

## 1. Purpose and Source Alignment

This document defines the full PostgreSQL database design reference for B&V. It consolidates the database decisions made for the ecommerce platform and maps every table to the four-phase development roadmap. The design is aligned to the attached B&V Phase Development Reference, which positions B&V as a modern romantic lifestyle ecommerce brand serving women fashion customers, men fashion customers, jewelry customers, gift buyers, couple customers, custom order customers, and love website customers. The same reference defines Phase 1 as launch/MVP, Phase 2 as growth and personalization, Phase 3 as platform expansion, and Phase 4 as brand/offline expansion. The goal of this schema is to be complete enough for long-term architecture, but practical enough that implementation can proceed in staged migrations rather than creating every future table at once.

## 2. Database Design Philosophy

- Use PostgreSQL as the source of truth for transactional commerce data: products, variants, customers, carts, orders, payments, custom requests, inventory, and subscriptions.
- Use Sanity for rich editorial content where possible, while storing lightweight PostgreSQL references for product linking, search, analytics, and admin dashboards.
- Use Cloudinary for image/video storage. PostgreSQL stores media URLs, public IDs, alt text, and relationships, not binary files.
- Keep Phase 1 implementation simple, but design table relationships so Phase 2 to Phase 4 features do not require destructive rewrites.
- Preserve historical snapshots in orders, order items, gift box builds, custom requests, and payment records.
- Avoid overusing jsonb for core searchable commerce data. Use jsonb only where the data is naturally flexible or needs to preserve submitted snapshots.

### Core Rule

```text
Live catalog data can change.
Order, payment, shipment, and custom request records must preserve the exact customer-facing state at the time of submission or
purchase.
```

## 3. Phase-Based Schema Strategy

| Phase                                | Main business focus                                                                                                                                        | Database implementation intent                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Phase 1 - Launch / MVP               | Website launch, shop, products, collections, cart, checkout/order inquiry, custom order inquiries, love website landing, contact, newsletter               | Implement only the core ecommerce and inquiry tables needed to launch cleanly.      |
| Phase 2 - Growth and Personalization | Customer accounts, saved addresses, wishlist, order tracking, real gift box builder, blog references, customer memories, reviews, payment webhooks/refunds | Add customer retention and operational tables after MVP foundations are stable.     |
| Phase 3 - Platform Expansion         | Love website builder, AI stylist/gift finder, subscriptions, ambassador program, analytics dashboard, inventory ledger, international shipping             | Add platform-level tables when product-market fit and operational needs are proven. |
| Phase 4 - Brand Expansion            | Showroom, appointments, photoshoot packages, offline/POS sales, supplier purchasing, premium/luxury expansion                                              | Add offline business and supplier operations only after ecommerce proves itself.    |

## 4. Global Data Type Standards

| Data requirement   | PostgreSQL type | Decision                                                                                              |
| ------------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| Primary keys       | uuid            | Use id uuid primary key default gen_random_uuid() for public-safe identifiers.                        |
| Money and prices   | numeric(12,2)   | Use exact decimal values for prices, totals, discounts, refunds, commissions, and costs.              |
| Quantities         | integer         | Use for product quantities, stock counts, reservations, and line quantities.                          |
| Currency           | char(3)         | Default LKR. Keep currency explicit for future international expansion.                               |
| Country            | char(2)         | Default LK. Supports future international shipping.                                                   |
| Status fields      | varchar(30-50)  | Use clear string statuses first; convert to PostgreSQL enums later if stable.                         |
| Timestamps         | timestamptz     | Use timezone-aware timestamps for created_at, updated_at, paid_at, shipped_at, etc.                   |
| Flexible snapshots | jsonb           | Use for selected options, personalization, gateway payloads, page content blocks, analytics metadata. |
| URLs               | text            | Use for Cloudinary URLs, public page links, and external references.                                  |
| Email              | varchar(255)    | Normalize lowercase at app level and index lower(email).                                              |

## 5. Naming and Constraint Rules

- Table names use snake_case plural nouns, for example products, product_variants, order_items.
- Primary key column is id unless the table is a pure join table, where a composite primary key may be used.
- Foreign key names use <entity>_id, for example product_id, user_id, order_id.
- Timestamp columns are created_at and updated_at. Event-only tables may only use created_at.
- Public-facing identifiers use dedicated fields such as order_number, sale_number, purchase_order_number, slug, or referral_code.
- Soft states use status columns instead of hard deletes for business-critical data.
- Join tables use composite primary keys when the pair must be unique, such as product_categories and collection_products.

## 6. Relationship Overview

```text
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
inventory_locations
  -> inventory_stock, inventory_movements
showroom_locations
  -> showroom_appointments, offline_sales
supplier_profiles
  -> purchase_orders -> purchase_order_items
```

## 7. Migration Batches by Phase

### Phase 1

````text`
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

`````

### Phase 2

````text`
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
`````

### Phase 3

````text`
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

`````

### Phase 4

````text`
offline_sale_items
offline_sales
photoshoot_bookings
photoshoot_packages
purchase_order_items
purchase_orders
showroom_appointments
showroom_locations
supplier_profiles
`````

## 8. Table Summary by Module

| Table                          | Phase   | Module                    | Purpose                                                                                                                                |
| ------------------------------ | ------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| users                          | Phase 1 | Identity & Access         | Main customer, staff, and admin identity. Supports guest-to-account conversion and future customer dashboard.                          |
| accounts                       | Phase 2 | Identity & Access         | Auth.js/OAuth provider accounts linked to users.                                                                                       |
| sessions                       | Phase 2 | Identity & Access         | Auth session persistence for customer/admin accounts.                                                                                  |
| verification_tokens            | Phase 2 | Identity & Access         | Email/passwordless verification token storage.                                                                                         |
| authenticators                 | Phase 3 | Identity & Access         | Future passkey/WebAuthn support.                                                                                                       |
| customer_profiles              | Phase 2 | Customer                  | Extended ecommerce customer profile separated from auth identity.                                                                      |
| customer_addresses             | Phase 2 | Customer                  | Saved addresses for checkout and account dashboard.                                                                                    |
| categories                     | Phase 1 | Catalog                   | Navigation, collections, and filter taxonomy for Women, Men, Jewelry, Gifts, Couples, Custom, audience, occasion, material, and color. |
| products                       | Phase 1 | Catalog                   | Main product record for fashion, jewelry, gift boxes, couple products, custom inquiry products, and love website service products.     |
| product_variants               | Phase 1 | Catalog                   | Sellable SKU-level variant with stock and options.                                                                                     |
| product_images                 | Phase 1 | Catalog / Media           | Product gallery images and Cloudinary references.                                                                                      |
| product_categories             | Phase 1 | Catalog                   | Many-to-many relationship between products and categories/filter groups.                                                               |
| product_attributes             | Phase 3 | Catalog                   | Optional structured product attributes for advanced filtering and AI/search features.                                                  |
| collections                    | Phase 1 | Merchandising             | Curated product groups such as New Arrivals, Limited Drop, Fashion Edit, Jewelry Highlight, Couple Collection.                         |
| collection_products            | Phase 1 | Merchandising             | Join table ordering products inside collections.                                                                                       |
| campaigns                      | Phase 2 | Marketing / Merchandising | Seasonal campaigns, launch drops, influencer edits, and promotional events.                                                            |
| campaign_products              | Phase 2 | Marketing / Merchandising | Products featured in campaigns.                                                                                                        |
| carts                          | Phase 1 | Cart & Checkout           | Guest or logged-in customer cart.                                                                                                      |
| cart_items                     | Phase 1 | Cart & Checkout           | Cart line item with selected options, personalization, and gift notes.                                                                 |
| checkout_sessions              | Phase 2 | Cart & Checkout           | Checkout flow state before order creation/payment redirect; helps prevent duplicate order creation.                                    |
| orders                         | Phase 1 | Orders                    | Main order/inquiry header. Supports Phase 1 inquiry-friendly flow and future paid ecommerce orders.                                    |
| order_items                    | Phase 1 | Orders                    | Historical order line snapshots. This protects orders from later product/catalog changes.                                              |
| order_status_events            | Phase 2 | Orders                    | Order timeline and status audit history.                                                                                               |
| payments                       | Phase 1 | Payments                  | Payment attempts/results for manual inquiry flow, PayHere, and KOKO.                                                                   |
| payment_webhooks               | Phase 2 | Payments                  | Raw gateway webhook logs for PayHere/KOKO idempotency and debugging.                                                                   |
| refunds                        | Phase 2 | Payments                  | Refund records linked to orders and payments.                                                                                          |
| shipping_methods               | Phase 2 | Shipping                  | Delivery methods such as standard delivery, express delivery, pickup, and international shipping.                                      |
| shipping_zones                 | Phase 3 | Shipping                  | Shipping zones for local and international shipping.                                                                                   |
| shipping_rates                 | Phase 3 | Shipping                  | Rates by shipping method and zone.                                                                                                     |
| shipments                      | Phase 2 | Shipping                  | Actual shipment/package for an order.                                                                                                  |
| shipment_events                | Phase 2 | Shipping                  | Tracking timeline for shipments.                                                                                                       |
| inventory_locations            | Phase 3 | Inventory                 | Stock locations such as warehouse, studio, showroom, home.                                                                             |
| inventory_stock                | Phase 3 | Inventory                 | Current stock per variant and location.                                                                                                |
| inventory_movements            | Phase 3 | Inventory                 | Stock movement ledger for auditability.                                                                                                |
| custom_requests                | Phase 1 | Custom Orders             | Custom fashion, custom jewelry, gift box, embroidery, engraving, personalized notes, and love website inquiry submissions.             |
| custom_request_files           | Phase 1 | Custom Orders             | Reference uploads for custom requests.                                                                                                 |
| custom_quotes                  | Phase 2 | Custom Orders             | Admin quotes for custom requests.                                                                                                      |
| gift_box_templates             | Phase 2 | Gift Box Builder          | Reusable gift box templates such as self-love box, jewelry gift box, birthday box, couple box.                                         |
| gift_box_template_items        | Phase 2 | Gift Box Builder          | Default/allowed products inside gift box templates.                                                                                    |
| gift_box_builds                | Phase 2 | Gift Box Builder          | Customer-created gift box session/build.                                                                                               |
| gift_box_build_items           | Phase 2 | Gift Box Builder          | Selected products inside a customer gift box.                                                                                          |
| love_website_templates         | Phase 3 | Love Website Services     | Template gallery for Our Story, proposal, anniversary, wedding RSVP, birthday, scrapbook, guestbook pages.                             |
| love_website_projects          | Phase 3 | Love Website Services     | Customer-created love website project.                                                                                                 |
| love_website_pages             | Phase 3 | Love Website Services     | Pages inside a generated love website.                                                                                                 |
| love_website_assets            | Phase 3 | Love Website Services     | Images, videos, audio, and files used in love websites.                                                                                |
| love_website_guestbook_entries | Phase 3 | Love Website Services     | Public guestbook messages for love website projects.                                                                                   |
| wishlists                      | Phase 2 | Wishlist                  | Customer wishlist container.                                                                                                           |
| wishlist_items                 | Phase 2 | Wishlist                  | Saved products/variants.                                                                                                               |
| reviews                        | Phase 2 | Reviews & Memories        | Product reviews submitted by customers.                                                                                                |
| customer_memories              | Phase 2 | Reviews & Memories        | Social proof/customer stories: styling photos, gift reactions, unboxings, couple stories, testimonials.                                |
| customer_memory_assets         | Phase 2 | Reviews & Memories        | Images/videos attached to customer memories.                                                                                           |
| blog_post_refs                 | Phase 2 | Content References        | Lightweight PostgreSQL references to Sanity blog/Love Notes posts for product linking, search, and analytics.                          |
| blog_post_products             | Phase 2 | Content References        | Links blog posts to products.                                                                                                          |
| lookbook_refs                  | Phase 2 | Content References        | Lookbook/editorial references, usually backed by Sanity.                                                                               |
| lookbook_products              | Phase 2 | Content References        | Links lookbooks to products.                                                                                                           |
| faq_items                      | Phase 2 | Content References        | FAQ content for ordering, delivery, custom orders, payments, returns, sizing, gift packaging, love websites, jewelry care.             |
| policy_pages                   | Phase 2 | Content References        | Privacy, terms, returns/exchanges, and shipping/delivery policies.                                                                     |
| static_pages                   | Phase 2 | Content References        | General content pages such as Our Story, Love Websites landing, care guide, packaging.                                                 |
| contact_messages               | Phase 1 | Marketing / Support       | Contact form messages from website visitors.                                                                                           |
| newsletter_subscribers         | Phase 1 | Marketing / Support       | Newsletter/drop announcement subscriptions.                                                                                            |
| coupons                        | Phase 2 | Marketing / Support       | Discount codes and future promotional offers.                                                                                          |
| coupon_redemptions             | Phase 2 | Marketing / Support       | Coupon usage history.                                                                                                                  |
| gift_finder_sessions           | Phase 2 | Gift Finder / AI          | One gift finder quiz attempt.                                                                                                          |
| gift_finder_answers            | Phase 2 | Gift Finder / AI          | Answers within a gift finder session.                                                                                                  |
| gift_finder_recommendations    | Phase 2 | Gift Finder / AI          | Products recommended by gift finder.                                                                                                   |
| recommendation_profiles        | Phase 3 | Gift Finder / AI          | User personalization profile for AI stylist/gift finder.                                                                               |
| recommendation_events          | Phase 3 | Gift Finder / AI          | Behavior events for recommendation learning.                                                                                           |
| product_recommendations        | Phase 3 | Gift Finder / AI          | Precomputed product recommendations.                                                                                                   |
| search_queries                 | Phase 3 | Gift Finder / AI          | Search analytics and query improvement data.                                                                                           |
| subscription_plans             | Phase 3 | Subscriptions             | Recurring box plans: jewelry box, self-care box, couple box, seasonal box.                                                             |
| subscriptions                  | Phase 3 | Subscriptions             | Customer recurring subscription.                                                                                                       |
| subscription_orders            | Phase 3 | Subscriptions             | Generated recurring order links.                                                                                                       |
| ambassadors                    | Phase 3 | Ambassador Program        | Creator/ambassador profiles.                                                                                                           |
| ambassador_referrals           | Phase 3 | Ambassador Program        | Referral order tracking.                                                                                                               |
| ambassador_payouts             | Phase 3 | Ambassador Program        | Ambassador payout records.                                                                                                             |
| analytics_events               | Phase 3 | Analytics & Admin         | Internal analytics events for advanced dashboard.                                                                                      |
| admin_activity_logs            | Phase 3 | Analytics & Admin         | Audit trail for admin actions.                                                                                                         |
| site_settings                  | Phase 3 | Analytics & Admin         | Key-value site configuration.                                                                                                          |
| language_labels                | Phase 3 | Analytics & Admin         | Optional translatable UI labels for language switch.                                                                                   |
| showroom_locations             | Phase 4 | Offline / Showroom        | Physical showroom/studio locations.                                                                                                    |
| showroom_appointments          | Phase 4 | Offline / Showroom        | Showroom, fitting, jewelry viewing, and custom consultation appointments.                                                              |
| photoshoot_packages            | Phase 4 | Offline / Showroom        | Photoshoot service packages.                                                                                                           |
| photoshoot_bookings            | Phase 4 | Offline / Showroom        | Photoshoot bookings.                                                                                                                   |
| offline_sales                  | Phase 4 | Offline / Showroom        | Showroom/POS sale header.                                                                                                              |
| offline_sale_items             | Phase 4 | Offline / Showroom        | POS sale line items with product snapshots.                                                                                            |
| supplier_profiles              | Phase 4 | Supplier & Purchasing     | Suppliers/vendors for fashion, jewelry, packaging, printing.                                                                           |
| purchase_orders                | Phase 4 | Supplier & Purchasing     | Stock purchase order header.                                                                                                           |
| purchase_order_items           | Phase 4 | Supplier & Purchasing     | Purchase order line items.                                                                                                             |

## 9. Detailed Table Reference

Each table below includes the recommended primary key, attributes, foreign keys, relationships, and performance indexes. Index names can be adjusted during Prisma migration generation, but the indexed columns should be preserved.

### Ambassador Program

#### ambassador_payouts

Phase: Phase 3 | Purpose: Ambassador payout records. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                             |
| ----------------- | ------------- | ----------------------------------------------------------- |
| id                | uuid          | Primary key, default gen_random_uuid()                      |
| ambassador_id     | uuid          | FK to ambassadors                                           |
| amount            | numeric(12,2) | Payout amount                                               |
| currency_code     | char(3)       | Default LKR                                                 |
| status            | varchar(30)   | pending, processing, paid, failed                           |
| payment_reference | varchar(150)  | External reference                                          |
| paid_at           | timestamptz   | Paid time                                                   |
| created_at        | timestamptz   | Creation timestamp, default now()                           |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- ambassador_id -> ambassadors.id

**Important Indexes:**

- ambassador_id
- status
- paid_at DESC

**Relationships:**

- M-1 ambassadors

#### ambassador_referrals

Phase: Phase 3 | Purpose: Referral order tracking. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                             |
| ----------------- | ------------- | ----------------------------------------------------------- |
| id                | uuid          | Primary key, default gen_random_uuid()                      |
| ambassador_id     | uuid          | FK to ambassadors                                           |
| user_id           | uuid          | Optional referred user                                      |
| order_id          | uuid          | Optional referred order                                     |
| referral_code     | varchar(80)   | Used referral code                                          |
| commission_amount | numeric(12,2) | Commission amount                                           |
| status            | varchar(30)   | pending, approved, paid, rejected                           |
| created_at        | timestamptz   | Creation timestamp, default now()                           |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- ambassador_id -> ambassadors.id
- user_id -> users.id
- order_id -> orders.id

**Important Indexes:**

- ambassador_id
- user_id
- order_id
- status

**Relationships:**

- M-1 ambassadors/users/orders

#### ambassadors

Phase: Phase 3 | Purpose: Creator/ambassador profiles. Primary Key: id

| Column          | Data Type    | Purpose / Notes                                             |
| --------------- | ------------ | ----------------------------------------------------------- |
| id              | uuid         | Primary key, default gen_random_uuid()                      |
| user_id         | uuid         | Optional FK to users                                        |
| name            | varchar(150) | Ambassador name                                             |
| email           | varchar(255) | Optional                                                    |
| phone           | varchar(30)  | Optional                                                    |
| social_handle   | varchar(150) | Social handle                                               |
| platform        | varchar(50)  | instagram, tiktok, youtube                                  |
| referral_code   | varchar(80)  | Unique referral code                                        |
| commission_rate | numeric(5,2) | Commission percentage                                       |
| status          | varchar(30)  | pending, active, paused, rejected                           |
| created_at      | timestamptz  | Creation timestamp, default now()                           |
| updated_at      | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

**Important Indexes:**

- UNIQUE upper(referral_code)
- user_id
- status

**Relationships:**

- 1-M ambassador_referrals
- 1-M ambassador_payouts

### Analytics & Admin

#### admin_activity_logs

Phase: Phase 3 | Purpose: Audit trail for admin actions. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                               |
| ------------- | ------------ | ------------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                        |
| admin_user_id | uuid         | FK to users                                                   |
| action        | varchar(100) | created_product, changed_order_status, processed_refund, etc. |
| entity_type   | varchar(100) | Affected entity/table                                         |
| entity_id     | uuid         | Affected entity ID                                            |
| old_values    | jsonb        | Previous values                                               |
| new_values    | jsonb        | New values                                                    |
| ip_address    | varchar(80)  | Optional                                                      |
| created_at    | timestamptz  | Action time                                                   |

**Foreign Keys:**

- admin_user_id -> users.id

**Important Indexes:**

- admin_user_id
- (entity_type, entity_id)
- action
- created_at DESC

**Relationships:**

- M-1 users/admins

#### analytics_events

Phase: Phase 3 | Purpose: Internal analytics events for advanced dashboard. Primary Key: id

| Column     | Data Type    | Purpose / Notes                                                  |
| ---------- | ------------ | ---------------------------------------------------------------- |
| id         | uuid         | Primary key, default gen_random_uuid()                           |
| user_id    | uuid         | Optional FK to users                                             |
| product_id | uuid         | Optional FK to products                                          |
| order_id   | uuid         | Optional FK to orders                                            |
| event_type | varchar(100) | product_view, add_to_cart, checkout_started, order_created, etc. |
| session_id | varchar(150) | Session identifier                                               |
| metadata   | jsonb        | Flexible event context                                           |
| created_at | timestamptz  | Event time                                                       |

- user_id -> users.id
- product_id -> products.id
- order_id -> orders.id

**Important Indexes:**

- user_id
- product_id
- order_id
- event_type
- created_at DESC
- GIN metadata

**Relationships:**

- M-1 optional users/products/orders

#### language_labels

Phase: Phase 3 | Purpose: Optional translatable UI labels for language switch. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                             |
| ------------- | ------------ | ----------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                      |
| label_key     | varchar(150) | Label key                                                   |
| language_code | varchar(10)  | en, si, ta, etc.                                            |
| label_value   | text         | Translated value                                            |
| created_at    | timestamptz  | Creation timestamp, default now()                           |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE(label_key, language_code)
- language_code

#### site_settings

Phase: Phase 3 | Purpose: Key-value site configuration. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                             |
| ------------- | ------------ | ----------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                      |
| setting_key   | varchar(120) | Unique setting key                                          |
| setting_value | jsonb        | Flexible setting value                                      |
| description   | text         | Optional description                                        |
| is_public     | boolean      | Whether safe for public frontend                            |
| created_at    | timestamptz  | Creation timestamp, default now()                           |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE setting_key
- is_public

### Cart & Checkout

#### cart_items

Phase: Phase 1 | Purpose: Cart line item with selected options, personalization, and gift notes.

| Column           | Data Type     | Purpose / Notes                                             |
| ---------------- | ------------- | ----------------------------------------------------------- |
| id               | uuid          | Primary key, default gen_random_uuid()                      |
| cart_id          | uuid          | FK to carts                                                 |
| product_id       | uuid          | FK to products                                              |
| variant_id       | uuid          | Optional FK to product_variants                             |
| quantity         | integer       | Selected quantity                                           |
| unit_price       | numeric(12,2) | Price snapshot when added                                   |
| selected_options | jsonb         | Size/color/material/packaging selections                    |
| personalization  | jsonb         | Engraving/custom text/reference details                     |
| gift_note        | text          | Optional gift note                                          |
| created_at       | timestamptz   | Creation timestamp, default now()                           |
| updated_at       | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- cart_id -> carts.id
- product_id -> products.id
- variant_id -> product_variants.id

**Important Indexes:**

- cart_id
- product_id
- variant_id

**Relationships:**

- M-1 carts
- M-1 products
- M-1 optional product_variants

#### carts

Phase: Phase 1 | Purpose: Guest or logged-in customer cart. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                             |
| ------------- | ------------ | ----------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                      |
| user_id       | uuid         | Optional FK to users                                        |
| guest_token   | varchar(100) | Anonymous cart token                                        |
| status        | varchar(30)  | active, converted, abandoned                                |
| currency_code | char(3)      | Default LKR                                                 |
| created_at    | timestamptz  | Creation timestamp, default now()                           |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- (user_id, status)
- guest_token
- (status, updated_at)

**Relationships:**

- M-1 optional users
- 1-M cart_items
- 1-1 optional checkout_sessions
- 1-1 optional orders

#### checkout_sessions

Phase: Phase 2 | Purpose: Checkout flow state before order creation/payment redirect; helps prevent duplicate order creation. Primary Key: id

| Column            | Data Type    | Purpose / Notes                                             |
| ----------------- | ------------ | ----------------------------------------------------------- |
| id                | uuid         | Primary key, default gen_random_uuid()                      |
| cart_id           | uuid         | FK to carts                                                 |
| user_id           | uuid         | Optional FK to users                                        |
| status            | varchar(30)  | started, completed, expired, cancelled                      |
| customer_name     | varchar(150) | Snapshot                                                    |
| customer_phone    | varchar(30)  | Snapshot                                                    |
| customer_email    | varchar(255) | Snapshot                                                    |
| shipping_snapshot | jsonb        | Checkout address snapshot                                   |
| payment_method    | varchar(50)  | Selected method                                             |
| expires_at        | timestamptz  | Expiry                                                      |
| created_at        | timestamptz  | Creation timestamp, default now()                           |
| updated_at        | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- cart_id -> carts.id
- user_id -> users.id

**Important Indexes:**

- cart_id
- user_id
- status
- expires_at

**Relationships:**

- M-1 carts
- M-1 optional users
- 1-1 optional orders

### Catalog

#### categories

Phase: Phase 1 | Purpose: Navigation, collections, and filter taxonomy for Women, Men, Jewelry, Gifts, Couples, Custom, audience, occasion, material, and color. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                             |
| ------------- | ------------ | ----------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                      |
| parent_id     | uuid         | Self FK for nested categories                               |
| name          | varchar(120) | Category display name                                       |
| slug          | varchar(150) | Unique URL slug                                             |
| category_type | varchar(50)  | main, audience, product_type, occasion, material, color     |
| description   | text         | Optional                                                    |
| image_url     | text         | Optional category image                                     |
| sort_order    | integer      | Display order                                               |
| is_active     | boolean      | Visibility flag                                             |
| created_at    | timestamptz  | Creation timestamp, default now()                           |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger |

- parent_id -> categories.id

**Important Indexes:**

- UNIQUE slug
- parent_id
- (category_type, is_active)
- sort_order

**Relationships:**

- 1-M categories via parent_id
- M-M products via product_categories

#### product_categories

Phase: Phase 1 | Purpose: Many-to-many relationship between products and categories/filter groups. Primary Key: (product_id, category_id)

| Column      | Data Type | Purpose / Notes  |
| ----------- | --------- | ---------------- |
| product_id  | uuid      | FK to products   |
| category_id | uuid      | FK to categories |

**Foreign Keys:**

- product_id -> products.id
- category_id -> categories.id

**Important Indexes:**

- product_id
- category_id

**Relationships:**

- M-M products/categories

#### product_variants

Phase: Phase 1 | Purpose: Sellable SKU-level variant with stock and options. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                                   |
| ----------------- | ------------- | ----------------------------------------------------------------- |
| id                | uuid          | Primary key, default gen_random_uuid()                            |
| product_id        | uuid          | FK to products                                                    |
| sku               | varchar(100)  | Unique SKU                                                        |
| name              | varchar(150)  | Variant label, e.g. Small / Lavender                              |
| price             | numeric(12,2) | Variant price                                                     |
| compare_at_price  | numeric(12,2) | Optional                                                          |
| stock_quantity    | integer       | Simple MVP stock count                                            |
| reserved_quantity | integer       | Reserved quantity                                                 |
| options           | jsonb         | Variant option snapshot: size, color, material, chain length, fit |
| weight_grams      | integer       | Optional shipping weight                                          |
| is_active         | boolean       | Sellable flag                                                     |
| created_at        | timestamptz   | Creation timestamp, default now()                                 |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger       |

**Foreign Keys:**

**Important Indexes:**

- UNIQUE sku
- product_id
- is_active
- stock_quantity
- GIN options

**Relationships:**

- M-1 products
- 1-M cart_items
- 1-M order_items
- 1-M inventory_stock
- 1-M inventory_movements

#### products

Phase: Phase 1 | Purpose: Main product record for fashion, jewelry, gift boxes, couple products, custom inquiry products, and love website service products. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                             |
| ----------------- | ------------- | ----------------------------------------------------------- |
| id                | uuid          | Primary key, default gen_random_uuid()                      |
| name              | varchar(200)  | Product display name                                        |
| slug              | varchar(220)  | Unique URL slug                                             |
| short_description | text          | Short card/detail summary                                   |
| description       | text          | Full product description/story                              |
| product_type      | varchar(50)   | fashion, jewelry, gift_box, couple, custom, love_website    |
| base_price        | numeric(12,2) | Default/base price                                          |
| compare_at_price  | numeric(12,2) | Optional strike-through price                               |
| currency_code     | char(3)       | Default LKR                                                 |
| status            | varchar(30)   | draft, active, archived                                     |
| is_featured       | boolean       | Featured/homepage flag                                      |
| is_customizable   | boolean       | Customizable flag                                           |
| is_gift_ready     | boolean       | Gift-ready flag                                             |
| seo_title         | varchar(255)  | Optional SEO title                                          |
| seo_description   | text          | Optional SEO description                                    |
| published_at      | timestamptz   | Published timestamp                                         |
| created_at        | timestamptz   | Creation timestamp, default now()                           |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- (status, published_at)
- product_type
- is_featured
- base_price
- GIN to_tsvector(name)

**Relationships:**

- 1-M product_variants
- 1-M product_images
- M-M categories
- M-M collections
- 1-M cart_items
- 1-M order_items
- 1-M reviews

#### product_attributes

Phase: Phase 3 | Purpose: Optional structured product attributes for advanced filtering and AI/search features. Primary Key: id

| Column          | Data Type    | Purpose / Notes                                             |
| --------------- | ------------ | ----------------------------------------------------------- |
| id              | uuid         | Primary key, default gen_random_uuid()                      |
| product_id      | uuid         | FK to products                                              |
| attribute_key   | varchar(100) | fabric, stone, jewelry_type, style, fit                     |
| attribute_value | varchar(255) | Attribute value                                             |
| created_at      | timestamptz  | Creation timestamp, default now()                           |
| updated_at      | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- product_id -> products.id

**Important Indexes:**

- product_id
- (attribute_key, attribute_value)

**Relationships:**

- M-1 products

### Catalog / Media

#### product_images

Phase: Phase 1 | Purpose: Product gallery images and Cloudinary references. Primary Key: id

| Column               | Data Type    | Purpose / Notes                                             |
| -------------------- | ------------ | ----------------------------------------------------------- |
| id                   | uuid         | Primary key, default gen_random_uuid()                      |
| product_id           | uuid         | FK to products                                              |
| variant_id           | uuid         | Optional FK to product_variants                             |
| url                  | text         | Cloudinary secure URL                                       |
| cloudinary_public_id | varchar(255) | Optional Cloudinary public ID                               |
| alt_text             | varchar(255) | Image alt text for accessibility/SEO                        |
| sort_order           | integer      | Gallery order                                               |
| is_primary           | boolean      | Primary image flag                                          |
| created_at           | timestamptz  | Creation timestamp, default now()                           |
| updated_at           | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- product_id -> products.id
- variant_id -> product_variants.id

**Important Indexes:**

- product_id
- variant_id
- (product_id, is_primary)
- (product_id, sort_order)
- M-1 products
- M-1 optional product_variants

### Content References

#### blog_post_products

Phase: Phase 2 | Purpose: Links blog posts to products. Primary Key: (blog_post_ref_id, product_id)

| Column           | Data Type | Purpose / Notes      |
| ---------------- | --------- | -------------------- |
| blog_post_ref_id | uuid      | FK to blog_post_refs |
| product_id       | uuid      | FK to products       |

**Foreign Keys:**

- blog_post_ref_id -> blog_post_refs.id
- product_id -> products.id

**Important Indexes:**

- product_id

**Relationships:**

- M-M blog posts/products

#### blog_post_refs

Phase: Phase 2 | Purpose: Lightweight PostgreSQL references to Sanity blog/Love Notes posts for product linking, search, and analytics. Primary Key: id

| Column             | Data Type    | Purpose / Notes                                             |
| ------------------ | ------------ | ----------------------------------------------------------- |
| id                 | uuid         | Primary key, default gen_random_uuid()                      |
| sanity_document_id | varchar(150) | Sanity document ID                                          |
| slug               | varchar(220) | Unique slug                                                 |
| title              | varchar(255) | Post title                                                  |
| excerpt            | text         | Short excerpt                                               |
| cover_image_url    | text         | Cover image                                                 |
| published_at       | timestamptz  | Published timestamp                                         |
| is_featured        | boolean      | Feature flag                                                |
| created_at         | timestamptz  | Creation timestamp, default now()                           |
| updated_at         | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE sanity_document_id
- UNIQUE slug
- published_at DESC
- is_featured

**Relationships:**

- M-M products through blog_post_products

#### faq_items

Phase: Phase 2 | Purpose: FAQ content for ordering, delivery, custom orders, payments, returns, sizing, gift packaging, love websites, jewelry care.

| Column     | Data Type   | Purpose / Notes                                             |
| ---------- | ----------- | ----------------------------------------------------------- |
| id         | uuid        | Primary key, default gen_random_uuid()                      |
| category   | varchar(80) | FAQ category                                                |
| question   | text        | Question                                                    |
| answer     | text        | Answer                                                      |
| sort_order | integer     | Display order                                               |
| is_active  | boolean     | Visibility flag                                             |
| created_at | timestamptz | Creation timestamp, default now()                           |
| updated_at | timestamptz | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- category
- (is_active, sort_order)

#### lookbook_products

Phase: Phase 2 | Purpose: Links lookbooks to products. Primary Key: (lookbook_ref_id, product_id)

| Column          | Data Type | Purpose / Notes     |
| --------------- | --------- | ------------------- |
| lookbook_ref_id | uuid      | FK to lookbook_refs |
| product_id      | uuid      | FK to products      |
| sort_order      | integer   | Display order       |

**Foreign Keys:**

- lookbook_ref_id -> lookbook_refs.id
- product_id -> products.id

**Important Indexes:**

- product_id
- (lookbook_ref_id, sort_order)

**Relationships:**

- M-M lookbooks/products

#### lookbook_refs

Phase: Phase 2 | Purpose: Lookbook/editorial references, usually backed by Sanity. Primary Key: id

| Column             | Data Type    | Purpose / Notes                                             |
| ------------------ | ------------ | ----------------------------------------------------------- |
| id                 | uuid         | Primary key, default gen_random_uuid()                      |
| sanity_document_id | varchar(150) | Optional Sanity document ID                                 |
| slug               | varchar(220) | Unique slug                                                 |
| title              | varchar(255) | Lookbook title                                              |
| description        | text         | Optional                                                    |
| cover_image_url    | text         | Cover image                                                 |
| lookbook_type      | varchar(50)  | women, men, couple, jewelry, gift                           |
| published_at       | timestamptz  | Published timestamp                                         |
| is_featured        | boolean      | Feature flag                                                |
| created_at         | timestamptz  | Creation timestamp, default now()                           |
| updated_at         | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- lookbook_type
- is_featured
- M-M products through lookbook_products

#### policy_pages

Phase: Phase 2 | Purpose: Privacy, terms, returns/exchanges, and shipping/delivery policies. Primary Key: id

| Column       | Data Type    | Purpose / Notes                                             |
| ------------ | ------------ | ----------------------------------------------------------- |
| id           | uuid         | Primary key, default gen_random_uuid()                      |
| title        | varchar(200) | Page title                                                  |
| slug         | varchar(220) | Unique slug                                                 |
| content      | text         | Policy content                                              |
| version      | varchar(30)  | Optional version                                            |
| is_active    | boolean      | Active flag                                                 |
| published_at | timestamptz  | Published time                                              |
| created_at   | timestamptz  | Creation timestamp, default now()                           |
| updated_at   | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- is_active

#### static_pages

Phase: Phase 2 | Purpose: General content pages such as Our Story, Love Websites landing, care guide, packaging. Primary Key: id

| Column          | Data Type    | Purpose / Notes                                             |
| --------------- | ------------ | ----------------------------------------------------------- |
| id              | uuid         | Primary key, default gen_random_uuid()                      |
| title           | varchar(200) | Page title                                                  |
| slug            | varchar(220) | Unique slug                                                 |
| page_type       | varchar(80)  | our_story, love_websites, care_guide, packaging             |
| content         | jsonb        | Flexible page content                                       |
| seo_title       | varchar(255) | Optional SEO title                                          |
| seo_description | text         | Optional SEO description                                    |
| is_active       | boolean      | Active flag                                                 |
| published_at    | timestamptz  | Published time                                              |
| created_at      | timestamptz  | Creation timestamp, default now()                           |
| updated_at      | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- page_type
- is_active

### Custom Orders

#### custom_request_files

Phase: Phase 1 | Purpose: Reference uploads for custom requests. Primary Key: id

| Column               | Data Type    | Purpose / Notes                        |
| -------------------- | ------------ | -------------------------------------- |
| id                   | uuid         | Primary key, default gen_random_uuid() |
| custom_request_id    | uuid         | FK to custom_requests                  |
| file_url             | text         | Cloudinary/file URL                    |
| cloudinary_public_id | varchar(255) | Optional                               |
| file_type            | varchar(50)  | image, video, document                 |
| alt_text             | varchar(255) | Optional                               |
| created_at           | timestamptz  | Creation timestamp                     |

**Foreign Keys:**

- custom_request_id -> custom_requests.id

**Important Indexes:**

- custom_request_id

**Relationships:**

- M-1 custom_requests

#### custom_requests

Phase: Phase 1 | Purpose: Custom fashion, custom jewelry, gift box, embroidery, engraving, personalized notes, and love website inquiry submissions. Primary Key: id

| Column               | Data Type     | Purpose / Notes                                             |
| -------------------- | ------------- | ----------------------------------------------------------- |
| id                   | uuid          | Primary key, default gen_random_uuid()                      |
| user_id              | uuid          | Optional FK to users                                        |
| order_id             | uuid          | Optional FK to orders                                       |
| request_type         | varchar(50)   | custom_product, custom_jewelry, gift_box, love_website      |
| product_type         | varchar(100)  | Optional product category                                   |
| occasion             | varchar(100)  | Birthday, anniversary, wedding, self-love, etc.             |
| customization_type   | varchar(150)  | Engraving, embroidery, print, website, etc.                 |
| personalization_text | text          | Submitted personalization text                              |
| preferred_color      | varchar(100)  | Preferred color                                             |
| preferred_material   | varchar(100)  | Preferred material                                          |
| budget_min           | numeric(12,2) | Minimum budget                                              |
| budget_max           | numeric(12,2) | Maximum budget                                              |
| required_date        | date          | Needed by date                                              |
| customer_name        | varchar(150)  | Contact name                                                |
| customer_phone       | varchar(30)   | Contact phone                                               |
| customer_email       | varchar(255)  | Optional email                                              |
| message              | text          | Customer message                                            |
| status               | varchar(30)   | new, reviewing, quoted, accepted, rejected, completed       |
| created_at           | timestamptz   | Creation timestamp, default now()                           |
| updated_at           | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- order_id -> orders.id

**Important Indexes:**

- user_id
- order_id
- (request_type, status)
- customer_phone
- created_at DESC

**Relationships:**

- M-1 optional users
- M-1 optional orders
- 1-M custom_request_files
- 1-M custom_quotes

#### custom_quotes

Phase: Phase 2 | Purpose: Admin quotes for custom requests. Primary Key: id

| Column             | Data Type     | Purpose / Notes                                             |
| ------------------ | ------------- | ----------------------------------------------------------- |
| id                 | uuid          | Primary key, default gen_random_uuid()                      |
| custom_request_id  | uuid          | FK to custom_requests                                       |
| created_by_user_id | uuid          | Optional FK to users/admin                                  |
| quoted_amount      | numeric(12,2) | Quoted price                                                |
| currency_code      | char(3)       | Default LKR                                                 |
| notes              | text          | Quote notes                                                 |
| status             | varchar(30)   | draft, sent, accepted, rejected, expired                    |
| valid_until        | timestamptz   | Quote expiry                                                |
| created_at         | timestamptz   | Creation timestamp, default now()                           |
| updated_at         | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- custom_request_id -> custom_requests.id
- created_by_user_id -> users.id

**Important Indexes:**

- custom_request_id
- status
- valid_until

**Relationships:**

- M-1 custom_requests
- M-1 optional users

### Customer

#### customer_addresses

Phase: Phase 2 | Purpose: Saved addresses for checkout and account dashboard. Primary Key: id

| Column         | Data Type    | Purpose / Notes                                             |
| -------------- | ------------ | ----------------------------------------------------------- |
| id             | uuid         | Primary key, default gen_random_uuid()                      |
| user_id        | uuid         | FK to users                                                 |
| recipient_name | varchar(150) | Recipient full name                                         |
| phone          | varchar(30)  | Delivery phone                                              |
| address_line1  | varchar(255) | Primary address line                                        |
| address_line2  | varchar(255) | Optional                                                    |
| city           | varchar(100) | City                                                        |
| district       | varchar(100) | Nullable                                                    |
| province       | varchar(100) | Nullable                                                    |
| postal_code    | varchar(20)  | Nullable                                                    |
| country_code   | char(2)      | Default LK                                                  |
| is_default     | boolean      | Default address flag                                        |
| created_at     | timestamptz  | Creation timestamp, default now()                           |
| updated_at     | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- user_id
- city
- (user_id, is_default)

**Relationships:**

- M-1 users

#### customer_profiles

Phase: Phase 2 | Purpose: Extended ecommerce customer profile separated from auth identity. Primary Key: id

| Column             | Data Type    | Purpose / Notes                                             |
| ------------------ | ------------ | ----------------------------------------------------------- |
| id                 | uuid         | Primary key, default gen_random_uuid()                      |
| user_id            | uuid         | FK to users; unique one profile per user                    |
| first_name         | varchar(100) | First name                                                  |
| last_name          | varchar(100) | Last name                                                   |
| date_of_birth      | date         | Nullable                                                    |
| gender_preference  | varchar(30)  | Optional style/audience preference                          |
| marketing_opt_in   | boolean      | Newsletter/promo consent                                    |
| preferred_language | varchar(10)  | Default en                                                  |
| created_at         | timestamptz  | Creation timestamp, default now()                           |
| updated_at         | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- UNIQUE user_id
- marketing_opt_in

**Relationships:**

- 1-1 users

### Gift Box Builder

#### gift_box_build_items

Phase: Phase 2 | Purpose: Selected products inside a customer gift box. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                             |
| ----------------- | ------------- | ----------------------------------------------------------- |
| id                | uuid          | Primary key, default gen_random_uuid()                      |
| gift_box_build_id | uuid          | FK to gift_box_builds                                       |
| product_id        | uuid          | FK to products                                              |
| variant_id        | uuid          | Optional FK to product_variants                             |
| quantity          | integer       | Selected quantity                                           |
| unit_price        | numeric(12,2) | Price snapshot                                              |
| selected_options  | jsonb         | Selected options snapshot                                   |
| created_at        | timestamptz   | Creation timestamp, default now()                           |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- gift_box_build_id -> gift_box_builds.id
- variant_id -> product_variants.id

**Important Indexes:**

- gift_box_build_id
- product_id
- variant_id

**Relationships:**

- M-1 gift_box_builds
- M-1 products
- M-1 optional variants

#### gift_box_builds

Phase: Phase 2 | Purpose: Customer-created gift box session/build. Primary Key: id

| Column               | Data Type     | Purpose / Notes                                             |
| -------------------- | ------------- | ----------------------------------------------------------- |
| id                   | uuid          | Primary key, default gen_random_uuid()                      |
| user_id              | uuid          | Optional FK to users                                        |
| cart_id              | uuid          | Optional FK to carts                                        |
| order_id             | uuid          | Optional FK to orders                                       |
| gift_box_template_id | uuid          | Optional FK to gift_box_templates                           |
| recipient_name       | varchar(150)  | Optional recipient                                          |
| occasion             | varchar(100)  | Occasion                                                    |
| message_note         | text          | Gift note                                                   |
| packaging_option     | varchar(100)  | Packaging choice                                            |
| status               | varchar(30)   | draft, added_to_cart, ordered, abandoned                    |
| total_amount         | numeric(12,2) | Build total                                                 |
| created_at           | timestamptz   | Creation timestamp, default now()                           |
| updated_at           | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- cart_id -> carts.id
- order_id -> orders.id
- gift_box_template_id -> gift_box_templates.id

**Important Indexes:**

- user_id
- cart_id
- order_id
- status

**Relationships:**

- M-1 optional users/carts/orders
- 1-M gift_box_build_items

#### gift_box_template_items

Phase: Phase 2 | Purpose: Default/allowed products inside gift box templates. Primary Key: id

| Column               | Data Type   | Purpose / Notes                                             |
| -------------------- | ----------- | ----------------------------------------------------------- |
| id                   | uuid        | Primary key, default gen_random_uuid()                      |
| gift_box_template_id | uuid        | FK to gift_box_templates                                    |
| product_id           | uuid        | FK to products                                              |
| variant_id           | uuid        | Optional FK to product_variants                             |
| quantity             | integer     | Default quantity                                            |
| is_required          | boolean     | Required item flag                                          |
| sort_order           | integer     | Display order                                               |
| created_at           | timestamptz | Creation timestamp, default now()                           |
| updated_at           | timestamptz | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- gift_box_template_id -> gift_box_templates.id
- product_id -> products.id
- variant_id -> product_variants.id

**Important Indexes:**

- gift_box_template_id
- product_id
- variant_id

**Relationships:**

- M-1 gift_box_templates
- M-1 products
- M-1 optional variants

#### gift_box_templates

Phase: Phase 2 | Purpose: Reusable gift box templates such as self-love box, jewelry gift box, birthday box, couple box. Primary Key: id

| Column      | Data Type     | Purpose / Notes                                             |
| ----------- | ------------- | ----------------------------------------------------------- |
| id          | uuid          | Primary key, default gen_random_uuid()                      |
| name        | varchar(150)  | Template name                                               |
| slug        | varchar(180)  | Unique slug                                                 |
| description | text          | Optional                                                    |
| box_type    | varchar(80)   | self_love, jewelry, birthday, couple, anniversary, seasonal |
| base_price  | numeric(12,2) | Base packaging/service price                                |
| image_url   | text          | Optional image                                              |
| is_active   | boolean       | Active flag                                                 |
| created_at  | timestamptz   | Creation timestamp, default now()                           |
| updated_at  | timestamptz   | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- box_type
- is_active

**Relationships:**

- 1-M gift_box_template_items
- 1-M gift_box_builds

### Gift Finder / AI

#### gift_finder_answers

Phase: Phase 2 | Purpose: Answers within a gift finder session.

| Column       | Data Type    | Purpose / Notes                        |
| ------------ | ------------ | -------------------------------------- |
| id           | uuid         | Primary key, default gen_random_uuid() |
| session_id   | uuid         | FK to gift_finder_sessions             |
| question_key | varchar(100) | Question key                           |
| answer_value | text         | Answer value                           |
| answer_json  | jsonb        | Optional structured answer             |
| created_at   | timestamptz  | Creation timestamp                     |

**Foreign Keys:**

- session_id -> gift_finder_sessions.id

**Important Indexes:**

- session_id
- question_key

**Relationships:**

- M-1 gift_finder_sessions

#### gift_finder_recommendations

Phase: Phase 2 | Purpose: Products recommended by gift finder. Primary Key: id

| Column     | Data Type    | Purpose / Notes                        |
| ---------- | ------------ | -------------------------------------- |
| id         | uuid         | Primary key, default gen_random_uuid() |
| session_id | uuid         | FK to gift_finder_sessions             |
| product_id | uuid         | FK to products                         |
| score      | numeric(8,4) | Recommendation score                   |
| reason     | text         | Recommendation explanation             |
| sort_order | integer      | Display order                          |
| created_at | timestamptz  | Creation timestamp                     |

**Foreign Keys:**

- session_id -> gift_finder_sessions.id
- product_id -> products.id

**Important Indexes:**

- session_id
- product_id
- score DESC

**Relationships:**

- M-1 sessions/products

#### gift_finder_sessions

Phase: Phase 2 | Purpose: One gift finder quiz attempt. Primary Key: id

| Column           | Data Type     | Purpose / Notes                                             |
| ---------------- | ------------- | ----------------------------------------------------------- |
| id               | uuid          | Primary key, default gen_random_uuid()                      |
| user_id          | uuid          | Optional FK to users                                        |
| guest_token      | varchar(100)  | Anonymous token                                             |
| recipient        | varchar(100)  | Recipient                                                   |
| occasion         | varchar(100)  | Occasion                                                    |
| budget_min       | numeric(12,2) | Min budget                                                  |
| budget_max       | numeric(12,2) | Max budget                                                  |
| style_preference | varchar(100)  | Style preference                                            |
| status           | varchar(30)   | started, completed, abandoned                               |
| created_at       | timestamptz   | Creation timestamp, default now()                           |
| updated_at       | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- user_id
- guest_token
- status

**Relationships:**

- 1-M gift_finder_answers
- 1-M gift_finder_recommendations

#### product_recommendations

Phase: Phase 3 | Purpose: Precomputed product recommendations. Primary Key: id

| Column                 | Data Type    | Purpose / Notes                                             |
| ---------------------- | ------------ | ----------------------------------------------------------- |
| id                     | uuid         | Primary key, default gen_random_uuid()                      |
| user_id                | uuid         | Optional FK to users                                        |
| source_product_id      | uuid         | Optional FK to products                                     |
| recommended_product_id | uuid         | FK to products                                              |
| recommendation_type    | varchar(80)  | similar, complete_the_look, gift_pairing, couple_match      |
| score                  | numeric(8,4) | Recommendation score                                        |
| reason                 | text         | Explanation                                                 |
| created_at             | timestamptz  | Creation timestamp, default now()                           |
| updated_at             | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- source_product_id -> products.id
- recommended_product_id -> products.id

**Important Indexes:**

- user_id
- source_product_id
- recommended_product_id
- (recommendation_type, score DESC)

**Relationships:**

- M-1 optional users
- M-1 products

#### recommendation_events

Phase: Phase 3 | Purpose: Behavior events for recommendation learning. Primary Key: id

| Column      | Data Type     | Purpose / Notes                                                 |
| ----------- | ------------- | --------------------------------------------------------------- |
| id          | uuid          | Primary key, default gen_random_uuid()                          |
| user_id     | uuid          | Optional FK to users                                            |
| product_id  | uuid          | Optional FK to products                                         |
| event_type  | varchar(80)   | viewed, saved, added_to_cart, purchased, clicked_recommendation |
| event_value | numeric(12,2) | Optional monetary/value score                                   |
| metadata    | jsonb         | Flexible context                                                |
| created_at  | timestamptz   | Event time                                                      |

**Foreign Keys:**

- user_id -> users.id
- product_id -> products.id

**Important Indexes:**

- user_id
- product_id
- event_type
- created_at DESC

**Relationships:**

- M-1 optional users/products

#### recommendation_profiles

Phase: Phase 3 | Purpose: User personalization profile for AI stylist/gift finder. Primary Key: id

| Column               | Data Type     | Purpose / Notes                                             |
| -------------------- | ------------- | ----------------------------------------------------------- |
| id                   | uuid          | Primary key, default gen_random_uuid()                      |
| user_id              | uuid          | FK to users                                                 |
| preferred_styles     | text[]        | Preferred styles                                            |
| preferred_categories | text[]        | Preferred categories                                        |
| preferred_budget_min | numeric(12,2) | Min budget                                                  |
| preferred_budget_max | numeric(12,2) | Max budget                                                  |
| favorite_colors      | text[]        | Favorite colors                                             |
| metadata             | jsonb         | Flexible AI metadata                                        |
| created_at           | timestamptz   | Creation timestamp, default now()                           |
| updated_at           | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- UNIQUE user_id
- GIN metadata

**Relationships:**

- 1-1 users

#### search_queries

Phase: Phase 3 | Purpose: Search analytics and query improvement data. Primary Key: id

| Column             | Data Type   | Purpose / Notes                        |
| ------------------ | ----------- | -------------------------------------- |
| id                 | uuid        | Primary key, default gen_random_uuid() |
| user_id            | uuid        | Optional FK to users                   |
| query              | text        | Search query                           |
| results_count      | integer     | Number of results                      |
| clicked_product_id | uuid        | Optional clicked product               |
| created_at         | timestamptz | Search time                            |

**Foreign Keys:**

- user_id -> users.id
- clicked_product_id -> products.id

**Important Indexes:**

- user_id
- clicked_product_id
- created_at DESC
- GIN to_tsvector(query)

**Relationships:**

- M-1 optional users/products

### Identity & Access

#### users

Phase: Phase 1 | Purpose: Main customer, staff, and admin identity. Supports guest-to-account conversion and future customer dashboard. Primary Key: id

| Column            | Data Type    | Purpose / Notes                                             |
| ----------------- | ------------ | ----------------------------------------------------------- |
| id                | uuid         | Primary key, default gen_random_uuid()                      |
| name              | varchar(150) | Display or full name                                        |
| email             | varchar(255) | Unique login/contact email; normalized lowercase in app     |
| phone             | varchar(30)  | Customer contact phone / WhatsApp                           |
| password_hash     | text         | Nullable when using OAuth/Auth.js only                      |
| image_url         | text         | Profile/avatar image URL                                    |
| role              | varchar(30)  | customer, admin, staff                                      |
| status            | varchar(30)  | active, disabled, deleted                                   |
| email_verified_at | timestamptz  | Nullable verification timestamp                             |
| last_login_at     | timestamptz  | Nullable last login timestamp                               |
| created_at        | timestamptz  | Creation timestamp, default now()                           |
| updated_at        | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE lower(email)
- phone
- role
- status

**Relationships:**

- 1-M customer_profiles
- 1-M customer_addresses
- 1-M carts
- 1-M orders
- 1-M custom_requests
- 1-M wishlists
- 1-M reviews
- 1-M customer_memories
- 1-M subscriptions
- 1-M love_website_projects

#### accounts

Phase: Phase 2 | Purpose: Auth.js/OAuth provider accounts linked to users. Primary Key: id

| Column              | Data Type    | Purpose / Notes                                             |
| ------------------- | ------------ | ----------------------------------------------------------- |
| id                  | uuid         | Primary key, default gen_random_uuid()                      |
| user_id             | uuid         | FK to users                                                 |
| type                | varchar(50)  | OAuth/account type                                          |
| provider            | varchar(100) | Provider name                                               |
| provider_account_id | varchar(255) | External provider account ID                                |
| refresh_token       | text         | Nullable                                                    |
| access_token        | text         | Nullable                                                    |
| expires_at          | integer      | Nullable token expiry                                       |
| token_type          | varchar(100) | Nullable                                                    |
| scope               | text         | Nullable                                                    |
| id_token            | text         | Nullable                                                    |
| session_state       | text         | Nullable                                                    |
| created_at          | timestamptz  | Creation timestamp, default now()                           |
| updated_at          | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- user_id
- UNIQUE(provider, provider_account_id)

**Relationships:**

- M-1 users

#### sessions

Phase: Phase 2 | Purpose: Auth session persistence for customer/admin accounts. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                             |
| ------------- | ------------ | ----------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                      |
| user_id       | uuid         | FK to users                                                 |
| session_token | varchar(255) | Unique session token                                        |
| expires       | timestamptz  | Session expiration                                          |
| created_at    | timestamptz  | Creation timestamp, default now()                           |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- UNIQUE session_token
- user_id
- expires

**Relationships:**

- M-1 users

#### verification_tokens

Phase: Phase 2 | Purpose: Email/passwordless verification token storage. Primary Key: (identifier, token)

| Column     | Data Type    | Purpose / Notes      |
| ---------- | ------------ | -------------------- |
| identifier | varchar(255) | Email or identifier  |
| token      | varchar(255) | Verification token   |
| expires    | timestamptz  | Expiration timestamp |

**Important Indexes:**

- UNIQUE token
- identifier
- expires

#### authenticators

Phase: Phase 3 | Purpose: Future passkey/WebAuthn support. Primary Key: id

| Column                 | Data Type    | Purpose / Notes                                             |
| ---------------------- | ------------ | ----------------------------------------------------------- |
| id                     | uuid         | Primary key, default gen_random_uuid()                      |
| user_id                | uuid         | FK to users                                                 |
| credential_id          | varchar(255) | Unique credential identifier                                |
| provider_account_id    | varchar(255) | Provider account mapping                                    |
| credential_public_key  | text         | Public key                                                  |
| counter                | integer      | Replay counter                                              |
| credential_device_type | varchar(50)  | Device type                                                 |
| credential_backed_up   | boolean      | Backup flag                                                 |
| transports             | text[]       | Optional transports                                         |
| created_at             | timestamptz  | Creation timestamp, default now()                           |
| updated_at             | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- UNIQUE credential_id
- user_id

**Relationships:**

- M-1 users

### Inventory

#### inventory_locations

Phase: Phase 3 | Purpose: Stock locations such as warehouse, studio, showroom, home. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                             |
| ------------- | ------------ | ----------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                      |
| name          | varchar(120) | Location name                                               |
| location_type | varchar(50)  | warehouse, studio, showroom, home                           |
| address       | text         | Optional address                                            |
| is_active     | boolean      | Active flag                                                 |
| created_at    | timestamptz  | Creation timestamp, default now()                           |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- location_type
- is_active

**Relationships:**

- 1-M inventory_stock
- 1-M inventory_movements

#### inventory_movements

Phase: Phase 3 | Purpose: Stock movement ledger for auditability. Primary Key: id

| Column             | Data Type   | Purpose / Notes                                                 |
| ------------------ | ----------- | --------------------------------------------------------------- |
| id                 | uuid        | Primary key, default gen_random_uuid()                          |
| variant_id         | uuid        | FK to product_variants                                          |
| location_id        | uuid        | FK to inventory_locations                                       |
| order_id           | uuid        | Optional FK to orders                                           |
| movement_type      | varchar(50) | stock_in, sold, returned, damaged, adjusted, reserved, released |
| quantity           | integer     | Movement quantity                                               |
| note               | text        | Optional note                                                   |
| reference_type     | varchar(50) | Optional external reference type                                |
| reference_id       | uuid        | Optional external reference id                                  |
| created_by_user_id | uuid        | Optional FK to users                                            |
| created_at         | timestamptz | Movement time                                                   |

**Foreign Keys:**

- variant_id -> product_variants.id
- location_id -> inventory_locations.id
- order_id -> orders.id
- created_by_user_id -> users.id

**Important Indexes:**

- variant_id
- location_id
- order_id
- created_at DESC
- movement_type

**Relationships:**

- M-1 product_variants
- M-1 inventory_locations
- M-1 optional orders

#### inventory_stock

Phase: Phase 3 | Purpose: Current stock per variant and location. Primary Key: id

| Column             | Data Type   | Purpose / Notes                        |
| ------------------ | ----------- | -------------------------------------- |
| id                 | uuid        | Primary key, default gen_random_uuid() |
| variant_id         | uuid        | FK to product_variants                 |
| location_id        | uuid        | FK to inventory_locations              |
| on_hand_quantity   | integer     | Physical quantity                      |
| reserved_quantity  | integer     | Reserved quantity                      |
| available_quantity | integer     | Available sellable quantity            |
| updated_at         | timestamptz | Last stock update                      |

**Foreign Keys:**

- variant_id -> product_variants.id
- location_id -> inventory_locations.id

**Important Indexes:**

- UNIQUE(variant_id, location_id)
- variant_id
- location_id
- available_quantity

**Relationships:**

- M-1 product_variants
- M-1 inventory_locations

### Love Website Services

#### love_website_assets

Phase: Phase 3 | Purpose: Images, videos, audio, and files used in love websites. Primary Key: id

| Column               | Data Type    | Purpose / Notes                                             |
| -------------------- | ------------ | ----------------------------------------------------------- |
| id                   | uuid         | Primary key, default gen_random_uuid()                      |
| project_id           | uuid         | FK to love_website_projects                                 |
| page_id              | uuid         | Optional FK to love_website_pages                           |
| asset_url            | text         | Cloudinary/file URL                                         |
| cloudinary_public_id | varchar(255) | Optional                                                    |
| asset_type           | varchar(50)  | image, video, audio, document                               |
| caption              | text         | Optional caption                                            |
| sort_order           | integer      | Display order                                               |
| created_at           | timestamptz  | Creation timestamp, default now()                           |
| updated_at           | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- project_id -> love_website_projects.id
- page_id -> love_website_pages.id

**Important Indexes:**

- project_id
- page_id

**Relationships:**

- M-1 love_website_projects
- M-1 optional pages

#### love_website_guestbook_entries

Phase: Phase 3 | Purpose: Public guestbook messages for love website projects. Primary Key: id

| Column      | Data Type    | Purpose / Notes                                             |
| ----------- | ------------ | ----------------------------------------------------------- |
| id          | uuid         | Primary key, default gen_random_uuid()                      |
| project_id  | uuid         | FK to love_website_projects                                 |
| guest_name  | varchar(150) | Guest name                                                  |
| guest_email | varchar(255) | Optional                                                    |
| message     | text         | Guest message                                               |
| status      | varchar(30)  | pending, approved, rejected                                 |
| created_at  | timestamptz  | Creation timestamp, default now()                           |
| updated_at  | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- project_id -> love_website_projects.id

**Important Indexes:**

- project_id
- status
- created_at DESC

**Relationships:**

- M-1 love_website_projects

#### love_website_pages

Phase: Phase 3 | Purpose: Pages inside a generated love website. Primary Key: id

| Column       | Data Type    | Purpose / Notes                                             |
| ------------ | ------------ | ----------------------------------------------------------- |
| id           | uuid         | Primary key, default gen_random_uuid()                      |
| project_id   | uuid         | FK to love_website_projects                                 |
| page_type    | varchar(80)  | home, story, gallery, countdown, rsvp, guestbook, timeline  |
| title        | varchar(200) | Page title                                                  |
| slug         | varchar(180) | Page slug                                                   |
| content      | jsonb        | Page content blocks                                         |
| sort_order   | integer      | Page order                                                  |
| is_published | boolean      | Publish flag                                                |
| created_at   | timestamptz  | Creation timestamp, default now()                           |
| updated_at   | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- project_id -> love_website_projects.id

**Important Indexes:**

- project_id
- slug
- (project_id, sort_order)

**Relationships:**

- M-1 love_website_projects
- 1-M love_website_assets

#### love_website_projects

Phase: Phase 3 | Purpose: Customer-created love website project. Primary Key: id

| Column           | Data Type    | Purpose / Notes                                             |
| ---------------- | ------------ | ----------------------------------------------------------- |
| id               | uuid         | Primary key, default gen_random_uuid()                      |
| user_id          | uuid         | FK to users                                                 |
| order_id         | uuid         | Optional FK to orders                                       |
| template_id      | uuid         | Optional FK to love_website_templates                       |
| title            | varchar(200) | Project title                                               |
| slug             | varchar(220) | Unique public slug                                          |
| project_type     | varchar(80)  | Project type                                                |
| status           | varchar(30)  | draft, in_progress, published, archived                     |
| content_snapshot | jsonb        | Project content snapshot                                    |
| published_at     | timestamptz  | Publish timestamp                                           |
| expires_at       | timestamptz  | Optional expiry                                             |
| created_at       | timestamptz  | Creation timestamp, default now()                           |
| updated_at       | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- order_id -> orders.id
- template_id -> love_website_templates.id

**Important Indexes:**

- UNIQUE slug
- user_id
- order_id
- status

**Relationships:**

- M-1 users
- M-1 optional orders/templates
- 1-M love_website_pages
- 1-M love_website_assets
- 1-M guestbook_entries

#### love_website_templates

Phase: Phase 3 | Purpose: Template gallery for Our Story, proposal, anniversary, wedding RSVP, birthday, scrapbook, guestbook pages. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                                                |
| ----------------- | ------------- | ------------------------------------------------------------------------------ |
| id                | uuid          | Primary key, default gen_random_uuid()                                         |
| name              | varchar(150)  | Template name                                                                  |
| slug              | varchar(180)  | Unique slug                                                                    |
| template_type     | varchar(80)   | our_story, proposal, anniversary, wedding_rsvp, birthday, scrapbook, guestbook |
| description       | text          | Optional                                                                       |
| preview_image_url | text          | Preview image                                                                  |
| base_price        | numeric(12,2) | Base service price                                                             |
| is_active         | boolean       | Active flag                                                                    |
| created_at        | timestamptz   | Creation timestamp, default now()                                              |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger                    |

**Important Indexes:**

- UNIQUE slug
- template_type
- is_active

**Relationships:**

- 1-M love_website_projects

### Marketing / Merchandising

#### campaign_products

Phase: Phase 2 | Purpose: Products featured in campaigns. Primary Key: (campaign_id, product_id)

| Column      | Data Type | Purpose / Notes |
| ----------- | --------- | --------------- |
| campaign_id | uuid      | FK to campaigns |
| product_id  | uuid      | FK to products  |
| sort_order  | integer   | Display order   |

**Foreign Keys:**

- campaign_id -> campaigns.id
- product_id -> products.id

**Important Indexes:**

- product_id
- (campaign_id, sort_order)

**Relationships:**

- M-M campaigns/products

#### campaigns

Phase: Phase 2 | Purpose: Seasonal campaigns, launch drops, influencer edits, and promotional events. Primary Key: id

| Column           | Data Type    | Purpose / Notes                                             |
| ---------------- | ------------ | ----------------------------------------------------------- |
| id               | uuid         | Primary key, default gen_random_uuid()                      |
| name             | varchar(150) | Campaign name                                               |
| slug             | varchar(180) | Unique URL slug                                             |
| description      | text         | Optional                                                    |
| campaign_type    | varchar(50)  | seasonal, launch, sale, collection, influencer              |
| status           | varchar(30)  | draft, active, ended, archived                              |
| banner_image_url | text         | Optional                                                    |
| starts_at        | timestamptz  | Campaign start                                              |
| ends_at          | timestamptz  | Campaign end                                                |
| created_at       | timestamptz  | Creation timestamp, default now()                           |
| updated_at       | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- status
- (starts_at, ends_at)

**Relationships:**

- M-M products through campaign_products
- 1-M coupons

### Marketing / Support

#### contact_messages

Phase: Phase 1 | Purpose: Contact form messages from website visitors.

| Column     | Data Type    | Purpose / Notes                                             |
| ---------- | ------------ | ----------------------------------------------------------- |
| id         | uuid         | Primary key, default gen_random_uuid()                      |
| name       | varchar(150) | Sender name                                                 |
| email      | varchar(255) | Optional email                                              |
| phone      | varchar(30)  | Optional phone                                              |
| subject    | varchar(200) | Optional subject                                            |
| message    | text         | Message body                                                |
| source     | varchar(50)  | contact_page, footer, love_website                          |
| status     | varchar(30)  | new, read, replied, closed                                  |
| created_at | timestamptz  | Creation timestamp, default now()                           |
| updated_at | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- status
- created_at DESC
- email

#### newsletter_subscribers

Phase: Phase 1 | Purpose: Newsletter/drop announcement subscriptions. Primary Key: id

| Column          | Data Type    | Purpose / Notes                                             |
| --------------- | ------------ | ----------------------------------------------------------- |
| id              | uuid         | Primary key, default gen_random_uuid()                      |
| user_id         | uuid         | Optional FK to users                                        |
| email           | varchar(255) | Subscriber email                                            |
| source          | varchar(80)  | footer, popup, checkout, blog                               |
| status          | varchar(30)  | subscribed, unsubscribed, bounced                           |
| subscribed_at   | timestamptz  | Subscribe time                                              |
| unsubscribed_at | timestamptz  | Unsubscribe time                                            |
| created_at      | timestamptz  | Creation timestamp, default now()                           |
| updated_at      | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- UNIQUE lower(email)
- user_id
- status

**Relationships:**

- M-1 optional users

#### coupon_redemptions

Phase: Phase 2 | Purpose: Coupon usage history. Primary Key: id

| Column          | Data Type     | Purpose / Notes                        |
| --------------- | ------------- | -------------------------------------- |
| id              | uuid          | Primary key, default gen_random_uuid() |
| coupon_id       | uuid          | FK to coupons                          |
| order_id        | uuid          | FK to orders                           |
| user_id         | uuid          | Optional FK to users                   |
| discount_amount | numeric(12,2) | Applied discount                       |
| redeemed_at     | timestamptz   | Redemption time                        |
| created_at      | timestamptz   | Creation timestamp                     |

- coupon_id -> coupons.id
- order_id -> orders.id
- user_id -> users.id

**Important Indexes:**

- coupon_id
- order_id
- user_id

**Relationships:**

- M-1 coupons/orders/users

#### coupons

Phase: Phase 2 | Purpose: Discount codes and future promotional offers. Primary Key: id

| Column               | Data Type     | Purpose / Notes                                             |
| -------------------- | ------------- | ----------------------------------------------------------- |
| id                   | uuid          | Primary key, default gen_random_uuid()                      |
| code                 | varchar(80)   | Unique coupon code                                          |
| campaign_id          | uuid          | Optional FK to campaigns                                    |
| discount_type        | varchar(40)   | percentage, fixed_amount, free_shipping                     |
| discount_value       | numeric(12,2) | Discount value                                              |
| minimum_order_amount | numeric(12,2) | Optional minimum spend                                      |
| usage_limit          | integer       | Optional maximum usage                                      |
| usage_count          | integer       | Current usage                                               |
| starts_at            | timestamptz   | Start time                                                  |
| ends_at              | timestamptz   | End time                                                    |
| is_active            | boolean       | Active flag                                                 |
| created_at           | timestamptz   | Creation timestamp, default now()                           |
| updated_at           | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- campaign_id -> campaigns.id

**Important Indexes:**

- UNIQUE upper(code)
- campaign_id
- is_active
- (starts_at, ends_at)

**Relationships:**

- M-1 optional campaigns
- 1-M coupon_redemptions

### Merchandising

#### collection_products

Phase: Phase 1 | Purpose: Join table ordering products inside collections. Primary Key: (collection_id, product_id)

| Column        | Data Type | Purpose / Notes             |
| ------------- | --------- | --------------------------- |
| collection_id | uuid      | FK to collections           |
| product_id    | uuid      | FK to products              |
| sort_order    | integer   | Product order in collection |

- collection_id -> collections.id
- product_id -> products.id

**Important Indexes:**

- (collection_id, sort_order)
- product_id

**Relationships:**

- M-M collections/products

#### collections

Phase: Phase 1 | Purpose: Curated product groups such as New Arrivals, Limited Drop, Fashion Edit, Jewelry Highlight, Couple Collection. Primary Key: id

| Column          | Data Type    | Purpose / Notes                                             |
| --------------- | ------------ | ----------------------------------------------------------- |
| id              | uuid         | Primary key, default gen_random_uuid()                      |
| name            | varchar(150) | Collection name                                             |
| slug            | varchar(180) | Unique URL slug                                             |
| description     | text         | Optional                                                    |
| collection_type | varchar(50)  | new_arrivals, limited_drop, featured, manual                |
| image_url       | text         | Optional image                                              |
| is_active       | boolean      | Visibility flag                                             |
| sort_order      | integer      | Display order                                               |
| starts_at       | timestamptz  | Optional campaign window start                              |
| ends_at         | timestamptz  | Optional campaign window end                                |
| created_at      | timestamptz  | Creation timestamp, default now()                           |
| updated_at      | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- (is_active, collection_type)
- sort_order
- (starts_at, ends_at)

**Relationships:**

- M-M products through collection_products

### Offline / Showroom

#### offline_sale_items

Phase: Phase 4 | Purpose: POS sale line items with product snapshots. Primary Key: id

| Column          | Data Type     | Purpose / Notes                        |
| --------------- | ------------- | -------------------------------------- |
| id              | uuid          | Primary key, default gen_random_uuid() |
| offline_sale_id | uuid          | FK to offline_sales                    |
| product_id      | uuid          | Optional FK to products                |
| variant_id      | uuid          | Optional FK to product_variants        |
| product_name    | varchar(200)  | Snapshot                               |
| variant_name    | varchar(150)  | Snapshot                               |
| sku             | varchar(100)  | Snapshot                               |
| quantity        | integer       | Quantity                               |
| unit_price      | numeric(12,2) | Unit price                             |
| line_total      | numeric(12,2) | Line total                             |
| created_at      | timestamptz   | Creation timestamp                     |

**Foreign Keys:**

- offline_sale_id -> offline_sales.id
- product_id -> products.id
- variant_id -> product_variants.id

**Important Indexes:**

- offline_sale_id
- product_id
- variant_id

**Relationships:**

- M-1 offline_sales/products/variants

#### offline_sales

Phase: Phase 4 | Purpose: Showroom/POS sale header. Primary Key: id

| Column               | Data Type     | Purpose / Notes                                             |
| -------------------- | ------------- | ----------------------------------------------------------- |
| id                   | uuid          | Primary key, default gen_random_uuid()                      |
| sale_number          | varchar(50)   | Unique sale number                                          |
| user_id              | uuid          | Optional customer user                                      |
| showroom_location_id | uuid          | Optional FK to showroom_locations                           |
| customer_name        | varchar(150)  | Optional snapshot                                           |
| customer_phone       | varchar(30)   | Optional snapshot                                           |
| subtotal_amount      | numeric(12,2) | Subtotal                                                    |
| discount_amount      | numeric(12,2) | Discount                                                    |
| total_amount         | numeric(12,2) | Total                                                       |
| payment_method       | varchar(50)   | Cash/card/bank/etc.                                         |
| status               | varchar(30)   | completed, voided, refunded                                 |
| sold_at              | timestamptz   | Sale time                                                   |
| created_at           | timestamptz   | Creation timestamp, default now()                           |
| updated_at           | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- showroom_location_id -> showroom_locations.id

**Important Indexes:**

- UNIQUE sale_number
- user_id
- showroom_location_id
- sold_at DESC

**Relationships:**

- 1-M offline_sale_items

#### photoshoot_bookings

Phase: Phase 4 | Purpose: Photoshoot bookings. Primary Key: id

| Column                | Data Type    | Purpose / Notes                                             |
| --------------------- | ------------ | ----------------------------------------------------------- |
| id                    | uuid         | Primary key, default gen_random_uuid()                      |
| user_id               | uuid         | Optional FK to users                                        |
| photoshoot_package_id | uuid         | FK to photoshoot_packages                                   |
| customer_name         | varchar(150) | Customer name                                               |
| customer_phone        | varchar(30)  | Customer phone                                              |
| customer_email        | varchar(255) | Optional                                                    |
| scheduled_at          | timestamptz  | Scheduled time                                              |
| location_note         | text         | Location/context                                            |
| status                | varchar(30)  | pending, confirmed, completed, cancelled                    |
| created_at            | timestamptz  | Creation timestamp, default now()                           |
| updated_at            | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- photoshoot_package_id -> photoshoot_packages.id

**Important Indexes:**

- user_id
- photoshoot_package_id
- scheduled_at
- status

**Relationships:**

- M-1 users/packages

#### photoshoot_packages

Phase: Phase 4 | Purpose: Photoshoot service packages. Primary Key: id

| Column           | Data Type     | Purpose / Notes                                             |
| ---------------- | ------------- | ----------------------------------------------------------- |
| id               | uuid          | Primary key, default gen_random_uuid()                      |
| name             | varchar(150)  | Package name                                                |
| slug             | varchar(180)  | Unique slug                                                 |
| description      | text          | Optional                                                    |
| price            | numeric(12,2) | Package price                                               |
| duration_minutes | integer       | Optional duration                                           |
| is_active        | boolean       | Active flag                                                 |
| created_at       | timestamptz   | Creation timestamp, default now()                           |
| updated_at       | timestamptz   | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- is_active

**Relationships:**

- 1-M photoshoot_bookings

#### showroom_appointments

Phase: Phase 4 | Purpose: Showroom, fitting, jewelry viewing, and custom consultation appointments. Primary Key: id

| Column               | Data Type    | Purpose / Notes                                             |
| -------------------- | ------------ | ----------------------------------------------------------- |
| id                   | uuid         | Primary key, default gen_random_uuid()                      |
| user_id              | uuid         | Optional FK to users                                        |
| showroom_location_id | uuid         | FK to showroom_locations                                    |
| customer_name        | varchar(150) | Customer name                                               |
| customer_phone       | varchar(30)  | Customer phone                                              |
| customer_email       | varchar(255) | Optional email                                              |
| appointment_type     | varchar(80)  | fitting, jewelry_viewing, custom_consultation               |
| scheduled_at         | timestamptz  | Appointment time                                            |
| status               | varchar(30)  | pending, confirmed, completed, cancelled                    |
| notes                | text         | Optional notes                                              |
| created_at           | timestamptz  | Creation timestamp, default now()                           |
| updated_at           | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- showroom_location_id -> showroom_locations.id

**Important Indexes:**

- user_id
- showroom_location_id
- scheduled_at
- status

**Relationships:**

- M-1 users/locations

#### showroom_locations

Phase: Phase 4 | Purpose: Physical showroom/studio locations. Primary Key: id

| Column     | Data Type    | Purpose / Notes                                             |
| ---------- | ------------ | ----------------------------------------------------------- |
| id         | uuid         | Primary key, default gen_random_uuid()                      |
| name       | varchar(150) | Location name                                               |
| address    | text         | Address                                                     |
| city       | varchar(100) | City                                                        |
| phone      | varchar(30)  | Phone                                                       |
| is_active  | boolean      | Active flag                                                 |
| created_at | timestamptz  | Creation timestamp, default now()                           |
| updated_at | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- city
- is_active

**Relationships:**

- 1-M showroom_appointments
- 1-M offline_sales

### Orders

#### order_items

Phase: Phase 1 | Purpose: Historical order line snapshots. This protects orders from later product/catalog changes. Primary Key: id

| Column           | Data Type     | Purpose / Notes                                             |
| ---------------- | ------------- | ----------------------------------------------------------- |
| id               | uuid          | Primary key, default gen_random_uuid()                      |
| order_id         | uuid          | FK to orders                                                |
| product_id       | uuid          | Optional FK to live product                                 |
| variant_id       | uuid          | Optional FK to live variant                                 |
| product_name     | varchar(200)  | Checkout-time product name snapshot                         |
| variant_name     | varchar(150)  | Checkout-time variant name snapshot                         |
| sku              | varchar(100)  | SKU snapshot                                                |
| image_url        | text          | Image URL snapshot                                          |
| quantity         | integer       | Purchased/inquired quantity                                 |
| unit_price       | numeric(12,2) | Checkout-time unit price                                    |
| line_total       | numeric(12,2) | quantity * unit_price                                       |
| selected_options | jsonb         | Checkout-time options snapshot                              |
| personalization  | jsonb         | Personalization snapshot                                    |
| gift_note        | text          | Line-level gift note                                        |
| created_at       | timestamptz   | Creation timestamp, default now()                           |
| updated_at       | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- order_id -> orders.id
- product_id -> products.id
- variant_id -> product_variants.id

**Important Indexes:**

- order_id
- product_id
- variant_id

**Relationships:**

- M-1 orders
- M-1 optional products
- M-1 optional product_variants

#### orders

Phase: Phase 1 | Purpose: Main order/inquiry header. Supports Phase 1 inquiry-friendly flow and future paid ecommerce orders. Primary Key: id

| Column                 | Data Type     | Purpose / Notes                                                        |
| ---------------------- | ------------- | ---------------------------------------------------------------------- |
| id                     | uuid          | Primary key, default gen_random_uuid()                                 |
| order_number           | varchar(50)   | Unique public order number                                             |
| user_id                | uuid          | Optional FK to users                                                   |
| cart_id                | uuid          | Optional FK to carts                                                   |
| checkout_session_id    | uuid          | Optional FK to checkout_sessions                                       |
| customer_name          | varchar(150)  | Customer name snapshot                                                 |
| customer_phone         | varchar(30)   | Customer phone snapshot                                                |
| customer_email         | varchar(255)  | Optional email snapshot                                                |
| shipping_address_line1 | varchar(255)  | Shipping snapshot                                                      |
| shipping_address_line2 | varchar(255)  | Nullable                                                               |
| shipping_city          | varchar(100)  | Shipping city                                                          |
| shipping_district      | varchar(100)  | Nullable                                                               |
| shipping_province      | varchar(100)  | Nullable                                                               |
| shipping_postal_code   | varchar(20)   | Nullable                                                               |
| shipping_country_code  | char(2)       | Default LK                                                             |
| order_note             | text          | Customer order note                                                    |
| gift_note              | text          | Gift note                                                              |
| whatsapp_confirmation  | boolean       | WhatsApp confirmation requested                                        |
| status                 | varchar(30)   | inquiry, pending, confirmed, processing, shipped, delivered, cancelled |
| payment_status         | varchar(30)   | not_required, pending, paid, failed, refunded                          |
| fulfillment_status     | varchar(30)   | unfulfilled, partial, fulfilled                                        |
| subtotal_amount        | numeric(12,2) | Subtotal                                                               |
| shipping_amount        | numeric(12,2) | Shipping fee                                                           |
| discount_amount        | numeric(12,2) | Discount total                                                         |
| tax_amount             | numeric(12,2) | Tax total                                                              |
| total_amount           | numeric(12,2) | Order total                                                            |
| currency_code          | char(3)       | Default LKR                                                            |
| placed_at              | timestamptz   | Order placed timestamp                                                 |
| created_at             | timestamptz   | Creation timestamp, default now()                                      |
| updated_at             | timestamptz   | Last update timestamp, maintained by application or trigger            |

**Foreign Keys:**

- user_id -> users.id
- cart_id -> carts.id
- checkout_session_id -> checkout_sessions.id

**Important Indexes:**

- UNIQUE order_number
- user_id
- cart_id
- status
- payment_status
- customer_phone
- placed_at DESC

**Relationships:**

- M-1 optional users
- M-1 optional carts
- 1-M order_items
- 1-M payments
- 1-M refunds
- 1-M order_status_events
- 1-M shipments

#### order_status_events

Phase: Phase 2 | Purpose: Order timeline and status audit history. Primary Key: id

| Column             | Data Type   | Purpose / Notes                        |
| ------------------ | ----------- | -------------------------------------- |
| id                 | uuid        | Primary key, default gen_random_uuid() |
| order_id           | uuid        | FK to orders                           |
| changed_by_user_id | uuid        | Optional FK to admin/customer user     |
| from_status        | varchar(30) | Previous status                        |
| to_status          | varchar(30) | New status                             |
| note               | text        | Optional note                          |
| metadata           | jsonb       | Optional context                       |
| created_at         | timestamptz | Event timestamp                        |

**Foreign Keys:**

- order_id -> orders.id
- changed_by_user_id -> users.id

**Important Indexes:**

- order_id
- created_at DESC
- changed_by_user_id

**Relationships:**

- M-1 orders
- M-1 optional users

### Payments

#### payments

Phase: Phase 1 | Purpose: Payment attempts/results for manual inquiry flow, PayHere, and KOKO. Primary Key: id

| Column             | Data Type     | Purpose / Notes                                             |
| ------------------ | ------------- | ----------------------------------------------------------- |
| id                 | uuid          | Primary key, default gen_random_uuid()                      |
| order_id           | uuid          | FK to orders                                                |
| provider           | varchar(50)   | manual, payhere, koko                                       |
| method             | varchar(50)   | bank_transfer, cod, card, installment                       |
| amount             | numeric(12,2) | Payment amount                                              |
| currency_code      | char(3)       | Default LKR                                                 |
| status             | varchar(30)   | pending, paid, failed, cancelled, refunded                  |
| provider_reference | varchar(150)  | External provider reference                                 |
| gateway_response   | jsonb         | Raw/summarized gateway response                             |
| paid_at            | timestamptz   | Payment completion time                                     |
| created_at         | timestamptz   | Creation timestamp, default now()                           |
| updated_at         | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- order_id -> orders.id

**Important Indexes:**

- order_id
- status
- (provider, provider_reference)
- paid_at DESC

**Relationships:**

- M-1 orders
- 1-M refunds
- 1-M payment_webhooks

#### payment_webhooks

Phase: Phase 2 | Purpose: Raw gateway webhook logs for PayHere/KOKO idempotency and debugging. Primary Key: id

| Column             | Data Type    | Purpose / Notes                                             |
| ------------------ | ------------ | ----------------------------------------------------------- |
| id                 | uuid         | Primary key, default gen_random_uuid()                      |
| payment_id         | uuid         | Optional FK to payments                                     |
| order_id           | uuid         | Optional FK to orders                                       |
| provider           | varchar(50)  | payhere, koko                                               |
| event_type         | varchar(100) | Gateway event type                                          |
| provider_reference | varchar(150) | External reference                                          |
| payload            | jsonb        | Raw webhook payload                                         |
| signature_valid    | boolean      | Signature verification result                               |
| processed_at       | timestamptz  | Processing completion time                                  |
| processing_status  | varchar(30)  | pending, processed, failed                                  |
| created_at         | timestamptz  | Creation timestamp, default now()                           |
| updated_at         | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- payment_id -> payments.id
- order_id -> orders.id

**Important Indexes:**

- payment_id
- order_id
- (provider, provider_reference)
- processing_status

**Relationships:**

- M-1 optional payments
- M-1 optional orders

#### refunds

Phase: Phase 2 | Purpose: Refund records linked to orders and payments. Primary Key: id

| Column             | Data Type     | Purpose / Notes                                             |
| ------------------ | ------------- | ----------------------------------------------------------- |
| id                 | uuid          | Primary key, default gen_random_uuid()                      |
| order_id           | uuid          | FK to orders                                                |
| payment_id         | uuid          | FK to payments                                              |
| amount             | numeric(12,2) | Refund amount                                               |
| currency_code      | char(3)       | Default LKR                                                 |
| reason             | text          | Optional reason                                             |
| status             | varchar(30)   | pending, approved, completed, failed                        |
| provider_reference | varchar(150)  | Gateway refund reference                                    |
| refunded_at        | timestamptz   | Refund completion time                                      |
| created_at         | timestamptz   | Creation timestamp, default now()                           |
| updated_at         | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- order_id -> orders.id
- payment_id -> payments.id

**Important Indexes:**

- order_id
- payment_id
- status
- provider_reference

**Relationships:**

- M-1 orders
- M-1 payments

### Reviews & Memories

#### customer_memories

Phase: Phase 2 | Purpose: Social proof/customer stories: styling photos, gift reactions, unboxings, couple stories, testimonials. Primary Key: id

| Column        | Data Type    | Purpose / Notes                                                     |
| ------------- | ------------ | ------------------------------------------------------------------- |
| id            | uuid         | Primary key, default gen_random_uuid()                              |
| user_id       | uuid         | Optional FK to users                                                |
| product_id    | uuid         | Optional FK to products                                             |
| order_id      | uuid         | Optional FK to orders                                               |
| title         | varchar(200) | Optional                                                            |
| story         | text         | Story/testimonial                                                   |
| memory_type   | varchar(50)  | styling, gift_reaction, jewelry_unboxing, couple_story, testimonial |
| customer_name | varchar(150) | Optional display name                                               |
| status        | varchar(30)  | pending, approved, rejected                                         |
| is_featured   | boolean      | Feature on homepage                                                 |
| created_at    | timestamptz  | Creation timestamp, default now()                                   |
| updated_at    | timestamptz  | Last update timestamp, maintained by application or trigger         |

**Foreign Keys:**

- user_id -> users.id
- product_id -> products.id
- order_id -> orders.id

**Important Indexes:**

- user_id
- product_id
- status
- is_featured

**Relationships:**

- M-1 optional users/products/orders
- 1-M customer_memory_assets

#### customer_memory_assets

Phase: Phase 2 | Purpose: Images/videos attached to customer memories. Primary Key: id

| Column               | Data Type    | Purpose / Notes                                             |
| -------------------- | ------------ | ----------------------------------------------------------- |
| id                   | uuid         | Primary key, default gen_random_uuid()                      |
| customer_memory_id   | uuid         | FK to customer_memories                                     |
| asset_url            | text         | Cloudinary/file URL                                         |
| cloudinary_public_id | varchar(255) | Optional                                                    |
| asset_type           | varchar(50)  | image, video                                                |
| caption              | text         | Optional                                                    |
| sort_order           | integer      | Display order                                               |
| created_at           | timestamptz  | Creation timestamp, default now()                           |
| updated_at           | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- customer_memory_id -> customer_memories.id

**Important Indexes:**

- customer_memory_id

**Relationships:**

- M-1 customer_memories

#### reviews

Phase: Phase 2 | Purpose: Product reviews submitted by customers. Primary Key: id

| Column     | Data Type    | Purpose / Notes                                             |
| ---------- | ------------ | ----------------------------------------------------------- |
| id         | uuid         | Primary key, default gen_random_uuid()                      |
| user_id    | uuid         | FK to users                                                 |
| product_id | uuid         | FK to products                                              |
| order_id   | uuid         | Optional FK to orders                                       |
| rating     | integer      | 1-5 rating                                                  |
| title      | varchar(200) | Optional                                                    |
| body       | text         | Optional review text                                        |
| status     | varchar(30)  | pending, approved, rejected                                 |
| created_at | timestamptz  | Creation timestamp, default now()                           |
| updated_at | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- product_id -> products.id
- order_id -> orders.id

**Important Indexes:**

- product_id
- user_id
- order_id
- status
- rating

**Relationships:**

- M-1 users/products/orders

### Shipping

#### shipment_events

Phase: Phase 2 | Purpose: Tracking timeline for shipments. Primary Key: id

| Column      | Data Type    | Purpose / Notes                        |
| ----------- | ------------ | -------------------------------------- |
| id          | uuid         | Primary key, default gen_random_uuid() |
| shipment_id | uuid         | FK to shipments                        |
| status      | varchar(50)  | Tracking status                        |
| message     | text         | Optional message                       |
| location    | varchar(150) | Optional location                      |
| event_time  | timestamptz  | Event time                             |
| raw_payload | jsonb        | Optional courier payload               |
| created_at  | timestamptz  | Creation timestamp                     |

**Foreign Keys:**

- shipment_id -> shipments.id

**Important Indexes:**

- shipment_id
- event_time DESC

**Relationships:**

- M-1 shipments

#### shipments

Phase: Phase 2 | Purpose: Actual shipment/package for an order.

| Column             | Data Type    | Purpose / Notes                                             |
| ------------------ | ------------ | ----------------------------------------------------------- |
| id                 | uuid         | Primary key, default gen_random_uuid()                      |
| order_id           | uuid         | FK to orders                                                |
| shipping_method_id | uuid         | Optional FK to shipping_methods                             |
| tracking_number    | varchar(150) | Courier tracking number                                     |
| carrier_name       | varchar(100) | Courier/carrier                                             |
| status             | varchar(30)  | pending, packed, shipped, delivered, returned               |
| shipped_at         | timestamptz  | Shipment time                                               |
| delivered_at       | timestamptz  | Delivered time                                              |
| created_at         | timestamptz  | Creation timestamp, default now()                           |
| updated_at         | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- order_id -> orders.id
- shipping_method_id -> shipping_methods.id

**Important Indexes:**

- order_id
- tracking_number
- status

**Relationships:**

- M-1 orders
- M-1 shipping_methods
- 1-M shipment_events

#### shipping_methods

Phase: Phase 2 | Purpose: Delivery methods such as standard delivery, express delivery, pickup, and international shipping. Primary Key: id

| Column      | Data Type     | Purpose / Notes                                             |
| ----------- | ------------- | ----------------------------------------------------------- |
| id          | uuid          | Primary key, default gen_random_uuid()                      |
| name        | varchar(120)  | Display name                                                |
| code        | varchar(80)   | Unique code                                                 |
| description | text          | Optional                                                    |
| base_price  | numeric(12,2) | Default method price                                        |
| is_active   | boolean       | Visibility flag                                             |
| created_at  | timestamptz   | Creation timestamp, default now()                           |
| updated_at  | timestamptz   | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE code
- is_active

**Relationships:**

- 1-M shipping_rates
- 1-M shipments

#### shipping_rates

Phase: Phase 3 | Purpose: Rates by shipping method and zone. Primary Key: id

| Column             | Data Type     | Purpose / Notes                                             |
| ------------------ | ------------- | ----------------------------------------------------------- |
| id                 | uuid          | Primary key, default gen_random_uuid()                      |
| shipping_method_id | uuid          | FK to shipping_methods                                      |
| shipping_zone_id   | uuid          | FK to shipping_zones                                        |
| price              | numeric(12,2) | Rate price                                                  |
| min_order_amount   | numeric(12,2) | Optional free/conditional threshold                         |
| max_weight_grams   | integer       | Optional weight cap                                         |
| is_active          | boolean       | Active flag                                                 |
| created_at         | timestamptz   | Creation timestamp, default now()                           |
| updated_at         | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- shipping_method_id -> shipping_methods.id
- shipping_zone_id -> shipping_zones.id

**Important Indexes:**

- (shipping_method_id, shipping_zone_id)
- is_active

**Relationships:**

- M-1 shipping_methods
- M-1 shipping_zones

#### shipping_zones

Phase: Phase 3 | Purpose: Shipping zones for local and international shipping. Primary Key: id

| Column       | Data Type    | Purpose / Notes                                             |
| ------------ | ------------ | ----------------------------------------------------------- |
| id           | uuid         | Primary key, default gen_random_uuid()                      |
| name         | varchar(120) | Zone name                                                   |
| country_code | char(2)      | Default LK                                                  |
| province     | varchar(100) | Nullable                                                    |
| district     | varchar(100) | Nullable                                                    |
| city         | varchar(100) | Nullable                                                    |
| is_active    | boolean      | Active flag                                                 |
| created_at   | timestamptz  | Creation timestamp, default now()                           |
| updated_at   | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- country_code
- (province, district, city)
- is_active

**Relationships:**

- 1-M shipping_rates

### Subscriptions

#### subscription_orders

Phase: Phase 3 | Purpose: Generated recurring order links. Primary Key: id

| Column               | Data Type   | Purpose / Notes                                             |
| -------------------- | ----------- | ----------------------------------------------------------- |
| id                   | uuid        | Primary key, default gen_random_uuid()                      |
| subscription_id      | uuid        | FK to subscriptions                                         |
| order_id             | uuid        | FK to orders                                                |
| billing_period_start | date        | Period start                                                |
| billing_period_end   | date        | Period end                                                  |
| status               | varchar(30) | generated, paid, skipped, failed                            |
| created_at           | timestamptz | Creation timestamp, default now()                           |
| updated_at           | timestamptz | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- subscription_id -> subscriptions.id
- order_id -> orders.id

**Important Indexes:**

- subscription_id
- order_id
- (billing_period_start, billing_period_end)

**Relationships:**

- M-1 subscriptions/orders

#### subscription_plans

Phase: Phase 3 | Purpose: Recurring box plans: jewelry box, self-care box, couple box, seasonal box. Primary Key: id

| Column           | Data Type     | Purpose / Notes                                             |
| ---------------- | ------------- | ----------------------------------------------------------- |
| id               | uuid          | Primary key, default gen_random_uuid()                      |
| name             | varchar(150)  | Plan name                                                   |
| slug             | varchar(180)  | Unique slug                                                 |
| description      | text          | Optional                                                    |
| plan_type        | varchar(80)   | jewelry_box, self_care_box, couple_box, seasonal_box        |
| price            | numeric(12,2) | Plan price                                                  |
| currency_code    | char(3)       | Default LKR                                                 |
| billing_interval | varchar(30)   | monthly, quarterly, yearly                                  |
| is_active        | boolean       | Active flag                                                 |
| created_at       | timestamptz   | Creation timestamp, default now()                           |
| updated_at       | timestamptz   | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- UNIQUE slug
- plan_type
- is_active

**Relationships:**

- 1-M subscriptions

#### subscriptions

Phase: Phase 3 | Purpose: Customer recurring subscription. Primary Key: id

| Column                    | Data Type   | Purpose / Notes                                             |
| ------------------------- | ----------- | ----------------------------------------------------------- |
| id                        | uuid        | Primary key, default gen_random_uuid()                      |
| user_id                   | uuid        | FK to users                                                 |
| subscription_plan_id      | uuid        | FK to subscription_plans                                    |
| status                    | varchar(30) | active, paused, cancelled, expired                          |
| started_at                | timestamptz | Start time                                                  |
| next_billing_at           | timestamptz | Next billing time                                           |
| cancelled_at              | timestamptz | Cancellation time                                           |
| shipping_address_snapshot | jsonb       | Shipping snapshot                                           |
| created_at                | timestamptz | Creation timestamp, default now()                           |
| updated_at                | timestamptz | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id
- subscription_plan_id -> subscription_plans.id

**Important Indexes:**

- user_id
- subscription_plan_id
- status
- next_billing_at

**Relationships:**

- M-1 users/plans
- 1-M subscription_orders

### Supplier & Purchasing

#### purchase_order_items

Phase: Phase 4 | Purpose: Purchase order line items. Primary Key: id

| Column            | Data Type     | Purpose / Notes                                             |
| ----------------- | ------------- | ----------------------------------------------------------- |
| id                | uuid          | Primary key, default gen_random_uuid()                      |
| purchase_order_id | uuid          | FK to purchase_orders                                       |
| variant_id        | uuid          | FK to product_variants                                      |
| quantity          | integer       | Ordered quantity                                            |
| unit_cost         | numeric(12,2) | Unit cost                                                   |
| line_total        | numeric(12,2) | Line total                                                  |
| received_quantity | integer       | Received quantity                                           |
| created_at        | timestamptz   | Creation timestamp, default now()                           |
| updated_at        | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- purchase_order_id -> purchase_orders.id
- variant_id -> product_variants.id

**Important Indexes:**

- purchase_order_id
- variant_id

**Relationships:**

- M-1 purchase_orders/product_variants

#### purchase_orders

Phase: Phase 4 | Purpose: Stock purchase order header. Primary Key: id

| Column                | Data Type     | Purpose / Notes                                             |
| --------------------- | ------------- | ----------------------------------------------------------- |
| id                    | uuid          | Primary key, default gen_random_uuid()                      |
| purchase_order_number | varchar(50)   | Unique PO number                                            |
| supplier_id           | uuid          | FK to supplier_profiles                                     |
| status                | varchar(30)   | draft, ordered, received, cancelled                         |
| ordered_at            | timestamptz   | Order date                                                  |
| received_at           | timestamptz   | Received date                                               |
| subtotal_amount       | numeric(12,2) | Subtotal                                                    |
| total_amount          | numeric(12,2) | Total                                                       |
| notes                 | text          | Optional notes                                              |
| created_at            | timestamptz   | Creation timestamp, default now()                           |
| updated_at            | timestamptz   | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- supplier_id -> supplier_profiles.id

**Important Indexes:**

- UNIQUE purchase_order_number
- supplier_id
- status
- ordered_at DESC

**Relationships:**

- M-1 suppliers
- 1-M purchase_order_items

#### supplier_profiles

Phase: Phase 4 | Purpose: Suppliers/vendors for fashion, jewelry, packaging, printing. Primary Key: id

| Column         | Data Type    | Purpose / Notes                                             |
| -------------- | ------------ | ----------------------------------------------------------- |
| id             | uuid         | Primary key, default gen_random_uuid()                      |
| name           | varchar(150) | Supplier name                                               |
| contact_person | varchar(150) | Optional contact                                            |
| email          | varchar(255) | Optional                                                    |
| phone          | varchar(30)  | Optional                                                    |
| address        | text         | Optional                                                    |
| supplier_type  | varchar(80)  | fashion, jewelry, packaging, printing                       |
| status         | varchar(30)  | active, inactive, blocked                                   |
| created_at     | timestamptz  | Creation timestamp, default now()                           |
| updated_at     | timestamptz  | Last update timestamp, maintained by application or trigger |

**Important Indexes:**

- name
- supplier_type
- status

**Relationships:**

- 1-M purchase_orders

### Wishlist

#### wishlist_items

Phase: Phase 2 | Purpose: Saved products/variants. Primary Key: id

| Column      | Data Type   | Purpose / Notes                        |
| ----------- | ----------- | -------------------------------------- |
| id          | uuid        | Primary key, default gen_random_uuid() |
| wishlist_id | uuid        | FK to wishlists                        |
| product_id  | uuid        | FK to products                         |
| variant_id  | uuid        | Optional FK to product_variants        |
| created_at  | timestamptz | Creation timestamp                     |

**Foreign Keys:**

- wishlist_id -> wishlists.id
- product_id -> products.id
- variant_id -> product_variants.id

**Important Indexes:**

- UNIQUE(wishlist_id, product_id, variant_id)
- product_id
- variant_id

**Relationships:**

- M-1 wishlists
- M-1 products

#### wishlists

Phase: Phase 2 | Purpose: Customer wishlist container. Primary Key: id

| Column     | Data Type    | Purpose / Notes                                             |
| ---------- | ------------ | ----------------------------------------------------------- |
| id         | uuid         | Primary key, default gen_random_uuid()                      |
| user_id    | uuid         | FK to users                                                 |
| name       | varchar(100) | Wishlist name                                               |
| is_default | boolean      | Default wishlist flag                                       |
| created_at | timestamptz  | Creation timestamp, default now()                           |
| updated_at | timestamptz  | Last update timestamp, maintained by application or trigger |

**Foreign Keys:**

- user_id -> users.id

**Important Indexes:**

- user_id
- (user_id, is_default)

**Relationships:**

- M-1 users
- 1-M wishlist_items

## 10. Status and Enum Reference

The initial implementation may use varchar status fields for faster iteration. Once workflows are stable, heavily used statuses can be converted to PostgreSQL enums. The following values should be treated as the controlled vocabulary.

| Domain                            | Recommended statuses / values                                          |
| --------------------------------- | ---------------------------------------------------------------------- |
| users.status                      | active, disabled, deleted                                              |
| users.role                        | customer, admin, staff                                                 |
| products.status                   | draft, active, archived                                                |
| orders.status                     | inquiry, pending, confirmed, processing, shipped, delivered, cancelled |
| orders.payment_status             | not_required, pending, paid, failed, refunded                          |
| payments.provider                 | manual, payhere, koko                                                  |
| payments.status                   | pending, paid, failed, cancelled, refunded                             |
| custom_requests.status            | new, reviewing, quoted, accepted, rejected, completed                  |
| gift_box_builds.status            | draft, added_to_cart, ordered, abandoned                               |
| love_website_projects.status      | draft, in_progress, published, archived                                |
| reviews.status                    | pending, approved, rejected                                            |
| subscriptions.status              | active, paused, cancelled, expired                                     |
| ambassadors.status                | pending, active, paused, rejected                                      |
| shipments.status                  | pending, packed, shipped, delivered, returned                          |
| inventory_movements.movement_type | stock_in, sold, returned, damaged, adjusted, reserved, released        |
| offline_sales.status              | completed, voided, refunded                                            |
| purchase_orders.status            | draft, ordered, received, cancelled                                    |

## 11. Indexing Strategy

- Always index foreign key columns used in joins and admin dashboards.
- Use unique indexes for slugs, SKUs, public order numbers, referral codes, coupon codes, and provider references where appropriate.
- Use descending timestamp indexes for operational lists such as orders, messages, webhook logs, analytics events, and purchase orders.
- Use GIN indexes for jsonb only when that jsonb is actually queried, such as product variant options, analytics metadata, or recommendation metadata.
- Use full-text GIN indexes for product names and search queries when internal search becomes database- backed.
- Consider partial indexes later for high-volume operational filters, such as active products, pending webhooks, pending custom requests, and active subscriptions.

## 12. JSONB Usage Rules

| Good jsonb use                                 | Reason                                                                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| cart_items.selected_options                    | Selected options vary by product type: fashion size/color, jewelry material/chain length, gift packaging, etc. |
| cart_items.personalization                     | Custom engraving, notes, uploaded references, and special instructions are flexible.                           |
| order_items.selected_options / personalization | Historical checkout snapshot must remain unchanged even if product structure changes.                          |
| payment_webhooks.payload                       | Gateway payloads are provider-specific and should be preserved raw.                                            |
| love_website_pages.content                     | Page builder content is block-based and flexible.                                                              |
| analytics_events.metadata                      | Analytics metadata varies by event type.                                                                       |
| site_settings.setting_value                    | Settings can be string, boolean, number, list, or object.                                                      |

Avoid jsonb for core query fields such as product name, SKU, price, stock quantity, order status, payment status, customer phone/email, slug, or category filters. Those should remain typed columns.

## 13. Prisma Implementation Notes

- Use String @id @default(uuid()) @db.Uuid for UUID primary keys in Prisma, or map to database-generated

UUIDs depending on project convention.

- Use Decimal @db.Decimal(12, 2) for money fields.
- Use DateTime @db.Timestamptz for timestamp columns where supported.
- Use Json for jsonb fields.
- Use @@index and @@unique to mirror the indexes listed in this document.
- Use explicit relation names where the same table is referenced more than once, such as product_recommendations.source_product_id and recommended_product_id.
- For join tables with extra attributes such as sort_order, model them as full Prisma models instead of implicit many-to-many relations.
- Generate migrations phase by phase, not all at once.

## 14. Seed Data Plan

| Seed area              | Initial data                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| categories             | Women, Men, Jewelry, Gifts, Couples, Custom, New In, audience tags, occasions, materials, colors          |
| collections            | New Arrivals, Limited Drop, Fashion Edit, Jewelry Highlight, Couple Collection, Gift Ready                |
| shipping_methods       | Standard Delivery, Express Delivery, Pickup                                                               |
| gift_box_templates     | Self-Love Box, Jewelry Gift Box, Birthday Box, Couple Box, Anniversary Box                                |
| love_website_templates | Our Story, Proposal, Anniversary Countdown, Wedding RSVP, Birthday Surprise, Digital Scrapbook, Guestbook |
| faq_items              | Ordering, delivery, custom orders, payments, returns, sizing, gift packaging, love websites, jewelry care |
| policy_pages           | Privacy Policy, Terms & Conditions, Returns & Exchanges, Shipping / Delivery Policy                       |
| site_settings          | WhatsApp number, Instagram URL, TikTok URL, default currency, default country, free shipping threshold    |

## 15. Future Scaling and Operational Notes

- Phase 1 can keep stock_quantity on product_variants. Phase 3 should introduce inventory_stock and inventory_movements for real auditability.
- Payment webhooks should be idempotent and processed exactly once using provider and provider_reference indexes.
- Order creation should be transactional: create order, order items, payment attempt, cart conversion, and optional stock reservation together.
- Use read-optimized indexes for admin lists: orders by placed_at, custom_requests by status/created_at, payments by status, shipments by tracking number.
- For large analytics volume, analytics_events may later move to a separate analytics store, but the schema is useful for admin MVP and structured event capture.
- For international expansion, shipping_zones, shipping_rates, currency_code, and country_code fields are already included.
- For showroom expansion, offline_sales should snapshot product names and prices just like order_items.

## 16. Final Implementation Guidance

This reference is intentionally broader than the immediate MVP. The recommended development approach is to keep the full architecture approved, then implement only the migration batch required for the current phase. For Phase 1, implement the core ecommerce, product, cart, order/inquiry, custom request, contact, and newsletter tables first. Keep Phase 2 to Phase 4 tables in the reference document until their features are actively built.

```text
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
custom_request_files
contact_messages
newsletter_subscribers
```

## 17. Source References

| Source                                                | Used for                                                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| B&V - Phase Development Reference                     | Phase plan, current MVP scope, future features, navigation, product/category scope, technology direction.        |
| Couple Brand Business Ideas And Website Strategy v1.1 | Business positioning, customer segments, product categories, phase direction, brand strategy.                    |
| Brand Identity & Design System Reference v1.1         | Brand context, light/dark theme, design system, product/media direction.                                         |
| Technology Stack & Tools Reference v1.0               | Approved engineering stack: Next.js, TypeScript, Prisma, PostgreSQL, Auth.js, Sanity, Cloudinary, PayHere, KOKO. |

## 18. Addendum v1.1 — Phase 1 Reconciliation (2026-10-28)

This addendum does not change the tables above. It records where this reference disagrees with the Phase 1 Step-by-Step Guidance, the Phase Development Reference v1.1, and the Database BaseModel Convention, and points to the proposed resolution in [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md). Every item is **PROPOSED** until it is approved and recorded as an ADR in `docs/decisions/DECISIONS.md`.

| Topic                   | This reference (v1.0)                                                  | Conflicting source                                                                                                | Proposed resolution                                                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth.js tables          | `accounts`, `sessions`, `verification_tokens` are Phase 2              | Phase 1 guide brings them into Phase 1                                                                            | Keep in Phase 2 unless customer Google sign-in launches in Phase 1. Admin login uses Auth.js Credentials with JWT sessions, which needs only `users` (D-03).                     |
| User roles              | `users.role`: customer, admin, staff                                   | Phase 1 guide: CUSTOMER, ADMIN, SUPER_ADMIN, EDITOR; BaseModel Convention gives `Role`/`Permission` examples      | Phase 1: `users.role` string with `customer`, `editor`, `admin`, `super_admin`. Table-based RBAC deferred to Phase 3 with `admin_activity_logs` (D-02).                          |
| Order status vocabulary | inquiry, pending, confirmed, processing, shipped, delivered, cancelled | Phase 1 guide: inquiry_received, pending_confirmation, confirmed, preparing, cancelled                            | Unified list (D-04): `inquiry_received`, `pending_confirmation`, `confirmed`, `preparing`, `shipped`, `delivered`, `cancelled`. Payment status stays a separate field.           |
| Visual Portfolio data   | No portfolio tables                                                    | Phase Development Reference defines Shoot, ShootMedia, CollaborationInquiry, ConsultationBooking, EventInvitation | Phase 1: shoots as static typed data; one `collaboration_inquiries` table with an `inquiry_type` field. `shoots`/`shoot_media` tables arrive with Phase 2 CMS work (D-05, D-06). |
| Admin password storage  | `users` has no credential column listed for admin login                | Phase 1 guide requires credential admin login                                                                     | Add `password_hash` (nullable) and `email_verified_at` to `users` in the Phase 1 migration (D-03).                                                                               |
| Column naming in Prisma | snake_case in SQL                                                      | BaseModel Convention                                                                                              | Prisma fields camelCase with `@map`, models singular PascalCase with `@@map` to plural snake_case tables. No conflict, both apply.                                               |

### Proposed Phase 1 table: `collaboration_inquiries`

| Column                  | Data Type    | Purpose / Notes                                                               |
| ----------------------- | ------------ | ----------------------------------------------------------------------------- |
| id                      | uuid         | Primary key                                                                   |
| inquiry_type            | varchar(30)  | collaboration, consultation, event_invitation                                 |
| name                    | varchar(150) | Contact person                                                                |
| brand_name              | varchar(150) | Optional brand / organizer                                                    |
| email                   | varchar(255) | Normalized lowercase                                                          |
| phone                   | varchar(30)  | Phone / WhatsApp                                                              |
| project_type            | varchar(80)  | Fashion Campaign, Jewelry Campaign, Restaurant / Cafe, Event Invitation, etc. |
| required_people         | varchar(20)  | couple, buwi, vila, not_sure                                                  |
| preferred_date          | date         | Optional                                                                      |
| preferred_time          | varchar(30)  | Consultation requests only                                                    |
| meeting_mode            | varchar(20)  | online, in_person (consultation only)                                         |
| location                | varchar(200) | Optional                                                                      |
| budget_range            | varchar(80)  | Optional                                                                      |
| expected_audience       | varchar(80)  | Event invitations only                                                        |
| requested_role          | varchar(80)  | attend, model, create_content, promotion, social_coverage, other              |
| message                 | text         | Idea / notes                                                                  |
| reference_links         | jsonb        | Optional list of URLs                                                         |
| status                  | varchar(30)  | new, reviewing, replied, accepted, declined, archived                         |
| created_at / updated_at | timestamptz  | Standard timestamps                                                           |

Indexes: `status, created_at DESC`; `inquiry_type`; `lower(email)`. Reference files use the same Cloudinary metadata pattern as `custom_request_files` (a `collaboration_inquiry_files` join table, or a polymorphic media table if one is approved later).
