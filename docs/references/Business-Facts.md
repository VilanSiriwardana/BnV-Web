# B&V Business Facts

| Field   | Value                                                                                         |
| ------- | --------------------------------------------------------------------------------------------- |
| Version | 1.0                                                                                           |
| Status  | Working — values TBD until the owner confirms them                                            |
| Created | 2026-10-29                                                                                    |
| Owner   | B&V project owner                                                                             |
| Purpose | Single source for the business values the site shows, so no page or agent invents them (D-10) |

## How to Use This Document

- Only the owner changes a value from **TBD** to **CONFIRMED**. Agents never fill in a value themselves.
- `src/config/brand.ts` (sprint 1A) reads its values from this document. Until a value is CONFIRMED, the site hides the element that needs it or shows a neutral fallback ("Contact us on WhatsApp for delivery details"). It never shows an invented number.
- Other references link here instead of repeating the values.

## Contact and Identity

| Field            | Value        | Status                 | Owner | Used by                                           |
| ---------------- | ------------ | ---------------------- | ----- | ------------------------------------------------- |
| WhatsApp number  | +94703802284 | CONFIRMED (2026-10-29) | Owner | Header, checkout success deep link, contact, D-20 |
| Public email     | TBD          | TBD                    | Owner | Contact, footer, order emails                     |
| Domain           | TBD          | TBD                    | Owner | `NEXT_PUBLIC_SITE_URL`, canonical URLs, sitemap   |
| Instagram handle | TBD          | TBD                    | Owner | Footer, Organization JSON-LD `sameAs`             |
| TikTok handle    | TBD          | TBD                    | Owner | Footer, Organization JSON-LD `sameAs`             |
| Facebook page    | TBD          | TBD                    | Owner | Footer, Organization JSON-LD `sameAs`             |

## Delivery (Sri Lanka only at launch)

Fees are whole LKR amounts.

| Field                         | Value | Status | Owner | Used by                             |
| ----------------------------- | ----- | ------ | ----- | ----------------------------------- |
| Delivery zones (by district)  | TBD   | TBD    | Owner | Checkout delivery fee, policy page  |
| Fee per zone (LKR)            | TBD   | TBD    | Owner | Checkout, cart estimate, PDP        |
| Delivery time per zone        | TBD   | TBD    | Owner | PDP, checkout, policy page          |
| Free-delivery threshold (LKR) | TBD   | TBD    | Owner | Announcement bar, cart progress     |
| Courier                       | TBD   | TBD    | Owner | Internal (COD collection, dispatch) |

## Payments (D-20)

| Field                        | Value | Status | Owner | Used by                                                    |
| ---------------------------- | ----- | ------ | ----- | ---------------------------------------------------------- |
| Cash on Delivery available   | TBD   | TBD    | Owner | Checkout method list                                       |
| COD fee or order limit (LKR) | TBD   | TBD    | Owner | Checkout, policy page                                      |
| Bank transfer details        | TBD   | TBD    | Owner | Sent after the order (WhatsApp/email), not on public pages |
| Payment confirmation window  | TBD   | TBD    | Owner | Order emails, admin follow-up                              |

## Policies

| Field                         | Value | Status | Owner | Used by                                 |
| ----------------------------- | ----- | ------ | ----- | --------------------------------------- |
| Returns window                | TBD   | TBD    | Owner | Returns policy, PDP accordion, FAQ      |
| Exchange rules                | TBD   | TBD    | Owner | Returns policy, FAQ                     |
| Custom-order refund rule      | TBD   | TBD    | Owner | Custom request form, returns policy     |
| Shipping/delivery policy text | TBD   | TBD    | Owner | `/policies/delivery`                    |
| Privacy policy (PDPA) text    | TBD   | TBD    | Owner | `/policies/privacy`, consent checkboxes |
| Terms and conditions text     | TBD   | TBD    | Owner | `/policies/terms`                       |

The prototype's conflicting return windows (7 days in code, 30 days in mockups) are not used ([Research_and_Prototype.md](Research_and_Prototype.md)).

## Verified Material Claims

List only claims backed by a supplier certificate or test. Unverified material wording does not ship (D-10).

| Claim                       | Products it applies to | Evidence | Status |
| --------------------------- | ---------------------- | -------- | ------ |
| 925 silver                  | TBD                    | TBD      | TBD    |
| 18k gold (plating or solid) | TBD                    | TBD      | TBD    |

## Launch-Blocking Commissions

These block the launch, not development. Placeholders are used until they arrive ([Visual-Asset-Inventory.md](Visual-Asset-Inventory.md)).

| Item                             | Status | Notes                                                  |
| -------------------------------- | ------ | ------------------------------------------------------ |
| Logo (SVG wordmark and monogram) | TBD    | Brand-Identity Sections 10–11                          |
| Favicon and app icons            | TBD    | From the monogram                                      |
| Default OG image (1200×630)      | TBD    | SEO-Guide                                              |
| Real Buwi and Vila photos        | TBD    | Our Story, Portfolio, Collaborate (Brand-Identity §42) |
| Real product photography         | TBD    | Replaces the prototype placeholders                    |
