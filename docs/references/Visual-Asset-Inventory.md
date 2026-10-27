# B&V Visual Asset Inventory

| Field   | Value                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Version | 1.0                                                                                                                                    |
| Status  | Working reference                                                                                                                      |
| Created | 2026-10-28                                                                                                                             |
| Source  | Uploaded archives `PageImages.zip`, `JewelleryImages.zip`, `LadyWare_Images.zip`, `MensWare_Images.zip`, `Posters_and_Image_ideas.zip` |

> **Reference-library note.** All B&V images listed here are **AI-generated prototype assets** (ChatGPT image exports, July 2026). They are suitable as design references and temporary placeholders. They are not real products, real customers, or real B&V shoots. Real photography must replace them before launch, especially in the Visual Portfolio.

## 1. Page Mockups — `PageImages.zip` (19 images, 1055×1491)

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

## 2. Product Imagery

| Archive               | Count | Content                                                                                                                                                                                                                                                  | Style                                                                                               |
| --------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `JewelleryImages.zip` | 10    | Engraved heart necklace; engraved ring pair in velvet box; band pair; heart and bar bracelets; heart huggie earrings; initial disc charm necklace; heart locket in gift box; pearl heart bracelet; birthstone stacking rings; heart necklace + studs set | Gold pieces on ivory satin with lavender sprigs and blush rose petals; consistent overhead lighting |
| `LadyWare_Images.zip` | 9     | Lavender knit lounge set; ivory knit lounge set; blush chiffon midi dress; champagne slip dress + cardigan; lavender floral maxi; blush cardigan; beige blazer suit; lavender wrap top + ivory trousers; ivory blouse + pleated skirt                    | One model in a cream-and-lavender Parisian interior                                                 |
| `MensWare_Images.zip` | 10    | Beige knit + ivory trousers; ivory hoodie; ivory crew knit; taupe knit polo; lavender knit; taupe blazer; ivory overshirt; taupe cardigan; ivory jacket; lavender cardigan                                                                               | One model in a consistent cream interior with a B&V monogram frame in the background                |

These sets match the brand imagery rules closely (Brand Identity, Sections 26–27) and are good references for briefing real product photography.

## 3. Non-B&V Material — `Posters_and_Image_ideas.zip`

This archive belongs to **Bilesma Natural** (Ayurvedic skincare): hero banners, Rath Hadun body lotion product image concepts, a two-colour palette (#565A2E, #F6F0E4), and banner copy. It is **not B&V content** and must not be imported (D-19). Reusable learnings:

- Hero banners come in pairs: 1920×650 for web and 1080×1080 for mobile, each with a visible CTA.
- A product image set has distinct roles: main/packshot, ingredients or details, benefits, results or context, and in-hand scale.

## 4. Asset Handling Rules

- Rename every asset before use. Do not keep export names such as `ChatGPT Image Jul 16, 2026, 11_48_19 AM (3).png`. Pattern: `<area>-<subject>-<variant>.webp`, for example `home-hero-couple-light.webp` or `product-heart-duo-necklace-01.webp`.
- Temporary prototype images go in `public/images/prototype/`. Brand static assets go in `public/images/brand/`. Product, portfolio, and upload media go to **Cloudinary** with metadata in PostgreSQL.
- Convert to WebP or AVIF and size for the actual layout. The source PNGs are about 1.5–2 MB each.
- Write meaningful alt text for every content image. Decorative images get empty alt text.
- Images with text overlays need a gradient or overlay in dark mode (Brand Identity, Section 42).
