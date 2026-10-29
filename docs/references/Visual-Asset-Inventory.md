# B&V Visual Asset Inventory

| Field   | Value                                                       |
| ------- | ----------------------------------------------------------- |
| Version | 2.0                                                         |
| Status  | Working reference                                           |
| Created | 2026-10-28                                                  |
| Updated | 2026-10-29                                                  |
| Source  | `BnV Docs/Images/` (full library, after the Gate B cleanup) |

> **Reference-library note.** All B&V images listed here are **AI-generated prototype assets** (ChatGPT image exports, July 2026). They are suitable as design references and temporary placeholders. They are not real products, real customers, or real B&V shoots. Real photography must replace them before launch, especially in the Visual Portfolio and Our Story ([Business-Facts.md](Business-Facts.md), launch-blocking commissions).

**v2.0 (2026-10-29).** v1.0 covered only the small zips (about 20% of the library) and had wrong counts and archive names. v2.0 inventories the full folder library and records the Gate B cleanup and the exported placeholders. The old→new mapping is in [assets/image-mapping.csv](assets/image-mapping.csv).

## 0. Library Summary

276 unique images, about 533 MB of PNG/JPG, with no duplicate files (SHA-256) after the cleanup.

| Folder (under `BnV Docs/Images/`)                                                      | Files | Size    | Dimensions                    |
| -------------------------------------------------------------------------------------- | ----- | ------- | ----------------------------- |
| Banners/01 Homepage, ShopPage, WomenPage, MenPage, JewelleryPage                       | 10    | 18.0 MB | 1916×821 (8), 1672×941 (2)    |
| Banners/02 GIftsPage, COuplesPage, CustomOrdersPage, LoceWebsitesPage, VisualPortfolio | 10    | 18.0 MB | 1916×821 (8), 1672×941 (2)    |
| Banners/03 OurStoryPage, NewArrivals, LimitedDrop, FasionEdit, JewelleryHighlight      | 10    | 17.6 MB | 1916×821 (8), 1672×941 (2)    |
| Banners/04 GiftBoxCollection, CoupleCapsuleCOllection                                  | 6     | 10.4 MB | 1916×821                      |
| Banners/05 ContactPage, FAQPage, JouranelLandingPage, Careguide                        | 8     | 14.6 MB | 1916×821                      |
| Accessories Images                                                                     | 20    | 43.7 MB | 1122×1402                     |
| Candle Home LIfestyle Images                                                           | 20    | 40.6 MB | 1122×1402                     |
| CoupleOutfit Images                                                                    | 10    | 19.6 MB | 1122×1402                     |
| GiftBox Images                                                                         | 10    | 21.9 MB | 1122×1402                     |
| JewelleryImages                                                                        | 20    | 38.5 MB | 1122×1402                     |
| LadyWare Images/Phase1                                                                 | 19    | 36.0 MB | 1122×1402 (9), 1086×1448 (10) |
| LadyWare Images/Phase2                                                                 | 20    | 39.6 MB | 1122×1402                     |
| MensWare Images/Phase 1                                                                | 20    | 36.8 MB | 1122×1402                     |
| MensWare Images/Phase 2                                                                | 20    | 38.6 MB | 1122×1402                     |
| PageImages                                                                             | 19    | 33.9 MB | 1055×1491                     |
| DarkMode IMages                                                                        | 10    | 18.3 MB | 941×1672                      |
| IntialPhase Images                                                                     | 14    | 27.4 MB | Mixed                         |
| Website Images (3 subfolders)                                                          | 30    | 59.4 MB | Mixed                         |

The folder-name typos (`LIfestyle`, `IMages`, `Intial`, `Loce`, `Fasion`, `Jouranel`) are left as they are in the source library; exported files use clean names.

## 1. Banner → Page Mapping

Each banner folder holds **light/dark pairs in file order**, one pair per page: `(1)` and `(2)` are the first page's light and dark banners, and so on.

| Folder | Pages (in order)                                                 | Exported                                                                                |
| ------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 01     | Home, Shop, Women, Men, Jewelry                                  | All 10                                                                                  |
| 02     | Gifts, Couples, Custom, Love Websites, Portfolio                 | All 10 (Portfolio is a placeholder only, Brand-Identity §42)                            |
| 03     | Our Story, New In, Limited Drop, Fashion Edit, Jewelry Highlight | All 10 (Our Story shows AI people: placeholder only)                                    |
| 04     | Gift Box, Couple Capsule, Gift Set                               | All 6                                                                                   |
| 05     | Contact, FAQ, Journal, Care Guide                                | 5 of 8: Journal excluded (Phase 2); FAQ dark excluded (its text reads "BLUSH & VIOLET") |

Each banner is exported as `banner-<page>-<light|dark>-desktop.webp` (1920×650) and `banner-<page>-<light|dark>-mobile.webp` (1080×1080).

## 2. Exported Placeholders — `public/images/prototype/`

124 WebP files, each at or under 300 KB (the largest is 136 KB), exported with `sharp` at quality 78. Banners use a cover crop with attention positioning.

| Group                         | Files | Size (px)              | Source                       |
| ----------------------------- | ----- | ---------------------- | ---------------------------- |
| Banners                       | 82    | 1920×650 and 1080×1080 | Banners/01–05                |
| `product-women-01…06`         | 6     | 960×1200               | LadyWare Images/Phase1       |
| `product-men-01…06`           | 6     | 960×1200               | MensWare Images/Phase 1      |
| `product-jewelry-01…06`       | 6     | 960×1200               | JewelleryImages              |
| `product-accessories-01…06`   | 6     | 960×1200               | Accessories Images           |
| `product-candles-home-01…06`  | 6     | 960×1200               | Candle Home LIfestyle Images |
| `product-gift-box-01…06`      | 6     | 960×1200               | GiftBox Images               |
| `product-couple-outfit-01…06` | 6     | 960×1200               | CoupleOutfit Images          |

`public/images/brand/` stays empty until the logo, favicon and OG image are commissioned.

**Known mismatch:** the demo seed (`prisma/seed/data/products.ts`) still points at file names such as `women-lavender-wrap-dress-01.webp`. Align it with these files in sprint 1C.

## 3. Crop Gaps

- No source has a real mobile crop. The 1080×1080 mobile banners are automatic attention crops of the wide banners; check each one on a phone and recrop by hand where the subject is cut.
- The source banners are 1916×821 or 1672×941, not 1920×650, so the desktop exports lose some of the top and bottom.
- Product sources are close to 4:5 (1122×1402) and need almost no cropping.
- Nothing usable exists for the logo, favicon, OG image, Our Story or Portfolio; these need real material.

## 4. Exclusions

| Source                                  | Reason                                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| PageImages (19)                         | Page mockups with $ prices, star ratings and the old nav (D-10). Kept as the visual contract (Section 6) |
| DarkMode IMages (10)                    | Dark-mode page mockups, not photography                                                                  |
| IntialPhase Images (14)                 | Early concepts, including the "Oreate AI" watermarked file and the long-name JPG                         |
| LadyWare and MensWare Phase 2 sets (40) | Phase 2 products                                                                                         |
| Banners/05 Journal pair                 | The Journal is Phase 2 (D-16)                                                                            |
| Banners/05 FAQ dark                     | Wrong brand text in the image ("BLUSH & VIOLET")                                                         |
| Website Images (30)                     | Love-website template previews; a reference for the Love Websites page, not exported yet                 |

Product images beyond the first six per category are not exported but remain available.

## 5. Archive — `BnV Docs/_archive/`

Moved (not deleted) on 2026-10-29 after SHA-256 checks. The `BnV Docs/` file count was 451 before and after.

| Item                                                                                                                                                  | Reason                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `Images/Phase 2/`, `Images/Phase2/`                                                                                                                   | Exact copies of the MensWare and LadyWare Phase 2 sets (40 of 40) |
| `Images/Phase2.zip`, `Images/Candle Home LIfestyle Images.zip`, `Images/DarkMode IMages.zip`                                                          | Every entry exists as a loose file                                |
| `Images.zip`, `JewelleryImages.zip`, `LadyWare Images.zip`, `MensWare Images.zip`, `PageImages.zip`, `ChatGPT Image Jul 7, 2026, 05_44_49 PM (2).zip` | Every entry exists as a loose file                                |
| `non-bnv/Posters and Image ideas/` and its zip                                                                                                        | Bilesma Natural material (D-19)                                   |

## 6. Page Mockups — `PageImages/` (19 images, 1055×1491)

These are the Figma Make visual contract. Ten pages exist in light mode (`05_22_*`) and nine in dark mode (`05_44_*`; the Product Detail page has no dark version).

| Page                                    | Light | Dark        | Key elements shown                                                                                                                                                                                                                                      |
| --------------------------------------- | ----- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                                    | yes   | yes         | Announcement bar; hero "Timeless pieces, Meaningful memories."; Shop by Collection (Women, Men, Jewelry, Gifts, Couples, Custom & Personal); Featured Favorites; Build Your Gift Box; Our Story teaser; testimonial; newsletter; footer                 |
| Shop All                                | yes   | yes         | Filter sidebar (category, price, material, occasion, color); tabs; product grid; pagination; gifting banner                                                                                                                                             |
| Collection — Couple Jewelry             | yes   | yes         | Hero "Made for connection, worn with love"; category icon row; best sellers; tabbed collection grid; Create Your Couple Box                                                                                                                             |
| Product Detail — Heart Duo Necklace Set | yes   | **missing** | Thumbnail gallery; personalisation input with character counter; material and chain-length chips; gift note; quantity; Add to Cart; Buy via WhatsApp; Add to Wishlist; trust badges; accordions; "Make it extra special" gift add-on; You may also love |
| Checkout                                | yes   | yes         | Contact, delivery, gift option, shipping method, payment, review steps; order summary sidebar                                                                                                                                                           |
| Custom Orders                           | yes   | yes         | Hero "Made just for you, made to last."; how it works; popular customisations; custom order form; categories                                                                                                                                            |
| Love Websites                           | yes   | yes         | Hero "Your Love Story, Beautifully Online"; template gallery; occasion icons; how it works; testimonial                                                                                                                                                 |
| Visual Portfolio                        | yes   | yes         | Hero "Stories we create. Connections we cherish."; category filter chips; featured shoots; portfolio gallery; motion & reels; Meet our creators (Buwi, Vila, B&V Together); collaboration form                                                          |
| Our Story                               | yes   | yes         | Hero; Our Journey timeline; values; Behind the Brand; Our Promise; B&V By the Numbers                                                                                                                                                                   |
| Contact                                 | yes   | yes         | Message form; contact channel cards (email, call, WhatsApp, order help); social links; FAQ accordion; policy cards                                                                                                                                      |

**Placeholder content that must not ship (D-10):** USD prices, "$75 free shipping", worldwide shipping, star ratings and review counts, Card/PayPal/Apple Pay, warranty claims, "100K+" style statistics, "© 2025". The mockup navigation (Collections / Couple Edit / Love Notes) is pre-pivot (D-08).

### 6.1 Product Imagery Notes (from the v1.0 zip review)

| Archive               | Count | Content                                                                                                                                                                                                                                                  | Style                                                                                               |
| --------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `JewelleryImages.zip` | 10    | Engraved heart necklace; engraved ring pair in velvet box; band pair; heart and bar bracelets; heart huggie earrings; initial disc charm necklace; heart locket in gift box; pearl heart bracelet; birthstone stacking rings; heart necklace + studs set | Gold pieces on ivory satin with lavender sprigs and blush rose petals; consistent overhead lighting |
| `LadyWare Images.zip` | 9     | Lavender knit lounge set; ivory knit lounge set; blush chiffon midi dress; champagne slip dress + cardigan; lavender floral maxi; blush cardigan; beige blazer suit; lavender wrap top + ivory trousers; ivory blouse + pleated skirt                    | One model in a cream-and-lavender Parisian interior                                                 |
| `MensWare Images.zip` | 10    | Beige knit + ivory trousers; ivory hoodie; ivory crew knit; taupe knit polo; lavender knit; taupe blazer; ivory overshirt; taupe cardigan; ivory jacket; lavender cardigan                                                                               | One model in a consistent cream interior with a B&V monogram frame in the background                |

These sets match the brand imagery rules closely (Brand Identity, Sections 26–27) and are good references for briefing real product photography.

## 7. Non-B&V Material (archived)

The Posters and Image ideas material belongs to **Bilesma Natural** (Ayurvedic skincare) and now sits in `BnV Docs/_archive/non-bnv/` (D-19). Reusable learnings:

- Hero banners come in pairs: 1920×650 for web and 1080×1080 for mobile, each with a visible CTA.
- A product image set has distinct roles: main/packshot, details, benefits, context, and in-hand scale.

## 8. Asset Handling Rules

- Rename every asset before use. Do not keep export names such as `ChatGPT Image Jul 16, 2026, 11_48_19 AM (3).png`. Pattern: `<area>-<subject>-<variant>.webp`, for example `home-hero-couple-light.webp` or `product-heart-duo-necklace-01.webp`.
- Temporary prototype images go in `public/images/prototype/`. Brand static assets go in `public/images/brand/`. Product, portfolio, and upload media go to **Cloudinary** with metadata in PostgreSQL.
- Convert to WebP or AVIF and size for the actual layout. The source PNGs are about 1.5–2 MB each.
- Write meaningful alt text for every content image. Decorative images get empty alt text.
- Images with text overlays need a gradient or overlay in dark mode (Brand Identity, Section 42).
