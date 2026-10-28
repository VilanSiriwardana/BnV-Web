# B&V Database BaseModel Convention

| Field               | Value                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| Version             | 1.1                                                                                    |
| Status              | Approved engineering standard                                                          |
| Converted / updated | 2026-10-28                                                                             |
| Based on            | B&V Database BaseModel Convention v1.0 (previous `docs/references/Database-Design.md`) |

> **Reference-library note.** This file keeps its original filename so existing governance links still resolve. It contains the **Prisma modelling conventions**. The full Phase 1–4 table blueprint (tables, columns, indexes, statuses, seed plan) is in [Database-Design-Reference.md](Database-Design-Reference.md). v1.1 changes formatting only, plus two clarifications marked _Clarified_.

## 1. Primary Key

Every table uses a UUID primary key.

```prisma
id String @id @default(uuid()) @db.Uuid
```

Why: safe for public URLs, cannot be enumerated, friendly to distributed systems, and matches the PostgreSQL design reference. _Clarified:_ the design reference also allows database-generated `gen_random_uuid()`. Pick one convention per project and record it as an ADR before the first domain migration (D-13).

## 2. Timestamps

Every mutable table includes:

```prisma
createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
updatedAt DateTime @updatedAt      @map("updated_at") @db.Timestamptz
```

Event-only tables may have `createdAt` only.

## 3. Naming

| Layer            | Convention                    | Example                                            |
| ---------------- | ----------------------------- | -------------------------------------------------- |
| Prisma fields    | camelCase                     | `passwordHash`, `emailVerifiedAt`, `firstName`     |
| Database columns | snake_case via `@map`         | `password_hash`, `email_verified_at`, `first_name` |
| Prisma models    | PascalCase singular           | `User`, `Product`, `Order`                         |
| Database tables  | snake_case plural via `@@map` | `users`, `products`, `orders`                      |

```prisma
passwordHash String @map("password_hash")
@@map("users")
```

## 4. Foreign Keys

Always `<entity>Id`, mapped to `<entity>_id`: `userId` → `user_id`, `productId` → `product_id`.

## 5. Relation Names

Single relations are singular (`role Role`). Collection relations are plural (`orders Order[]`). Never name a single relation in the plural.

## 6. Booleans

Start with `is`, `has`, `can`, or `should`: `isActive`, `isVerified`, `isPrimary`, `hasAcceptedTerms`, `canLogin`.

## 7. Money

Never use `Float`. Always use:

```prisma
price Decimal @db.Decimal(12, 2)
```

This applies to `price`, `salePrice`, `subtotal`, `discount`, `tax`, `shippingFee`, `grandTotal`, and every other money field. Store the currency explicitly (`currencyCode`, default `LKR`).

## 8. Status Fields

Use strings until workflows stabilise, then migrate to enums.

```prisma
status String @default("active") @db.VarChar(30)
```

Controlled vocabularies are listed in the design reference, Section 10, and in [Phase-1-Reconciled-Decisions.md](Phase-1-Reconciled-Decisions.md) (D-04).

## 9. JSON Fields

Only for flexible data: `selectedOptions`, `gatewayPayload`, `metadata`, `personalization`, `seo`. Never for `productName`, `price`, `email`, or any field you filter or sort on.

## 10. URLs

Always `String`: `imageUrl`, `secureUrl`, `avatarUrl`, `videoUrl`.

## 11. Slugs

Every public entity has `slug String @unique`. This covers products, collections, categories, portfolio shoots, and love websites.

## 12. Sort Order

Wherever manual ordering exists: `sortOrder Int @default(0)`.

## 13. Soft Delete

Use `status` or `archivedAt` instead of deleting. Never permanently delete orders, payments, users, or custom requests.

## 14. Audit Fields

The naming convention `createdById` / `updatedById` starts now. The fields are added to important tables when admin auditing arrives; they are not required on every Phase 1 table.

## 15. Indexes

```prisma
@@index([status])
@@index([createdAt])
@@index([userId])            // every foreign key
@@index([status, createdAt]) // composite lookups
```

## 16. Unique Constraints

Single-column examples: `email`, `slug`, `sku`. Composite: `@@unique([productId, categoryId])` on join tables.

_Clarified:_ v1.0 used `roleName`, `permissionKey`, and `@@unique([roleId, permissionId])` as examples. These are **naming examples only**. Phase 1 uses a `role` string on `users`; table-based RBAC is deferred (D-02).

## 17. Relation Delete Rules

The default is `Restrict`. Use `Cascade` only for pure join tables. Never cascade-delete orders, payments, or products.

## 18. Model Layout

Every model follows the same order:

```prisma
model Product {
  // Primary key
  id          String   @id @default(uuid()) @db.Uuid

  // Business fields
  name        String
  slug        String   @unique
  description String?
  status      String   @default("draft") @db.VarChar(30)

  // Foreign keys
  categoryId  String?  @map("category_id") @db.Uuid

  // Relations
  category    Category? @relation(fields: [categoryId], references: [id])
  variants    ProductVariant[]

  // Metadata
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz

  // Indexes
  @@index([status])
  @@index([categoryId])

  // Mapping
  @@map("products")
}
```

This is an illustration of layout only. The real `Product` model links to categories through the `product_categories` join table.

## 19. File Organization

> **Repository reality (VERIFIED 2026-10-28):** the tree below is the _target_ layout and doesn't match the current repository. `prisma.config.ts` sits at the repository root and loads the multi-file schema folder `prisma/schema/` (ADR-0016): `schema.prisma` plus `identity`, `catalog`, `products` and `commerce` `.prisma` files. The old `prisma/models/` copies were deleted on 2026-10-28. Seeders live in `prisma/seed/` (ADR-0015). Adopting the layout below requires an approved ADR. See the Prisma Schema Source of Truth section in [../governance/AGENTS.md](../governance/AGENTS.md).

```text
prisma/
├── schema.prisma          # root entry (generator + datasource)
├── prisma.config.ts       # repository keeps this at the root; verify location
├── migrations/
├── seed/
│   ├── index.ts           # configured in prisma.config.ts; not yet written
│   └── data/
└── models/
    ├── foundation.prisma
    ├── identity.prisma
    ├── catalog.prisma
    ├── commerce.prisma
    ├── cms.prisma
    ├── marketing.prisma
    ├── portfolio.prisma
    ├── analytics.prisma
    └── settings.prisma
```

## 20. Development Workflow for Every New Table

1. Design the model against [Database-Design-Reference.md](Database-Design-Reference.md).
2. Apply this convention.
3. Add relations.
4. Add indexes and unique constraints.
5. Run `npx prisma format`.
6. Run `npx prisma validate`.
7. **With explicit approval**, run `npx prisma migrate dev --name <migration_name>` and review the generated SQL.
8. Verify the schema in pgAdmin.
9. Add or update seed data if required (approval required to run seeders).
