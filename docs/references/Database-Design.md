**B&V Database BaseModel Convention v1.0**

This becomes our **Database Engineering Standard** for the project.

**1\. Primary Key**

Every table uses UUID.

id String @id @default(uuid()) @db.Uuid

Database

id UUID PRIMARY KEY

**Why**

- Safe for public URLs
- Impossible to enumerate IDs
- Distributed-system friendly
- Matches our PostgreSQL design reference.

**2\. Timestamp Convention**

Every mutable table contains

createdAt DateTime @default(now()) @map("created_at")

updatedAt DateTime @updatedAt @map("updated_at")

Database

created_at

updated_at

Benefits

- Auditing
- Sorting
- Analytics
- Syncing
- Admin history

**3\. Naming Convention**

**Prisma**

Everything uses **camelCase**

createdAt

updatedAt

passwordHash

emailVerifiedAt

firstName

Database

Everything uses **snake_case**

created_at

updated_at

password_hash

email_verified_at

first_name

using

@map(...)

Example

passwordHash String @map("password_hash")

**4\. Table Naming**

Every Prisma model

model User

maps to

users

using

@@map("users")

Examples

User

Role

Permission

Order

Product

↓

users

roles

permissions

orders

products

**5\. Foreign Keys**

Always

&lt;entity&gt;Id

Example

userId

roleId

productId

categoryId

Mapped

user_id

role_id

product_id

category_id

**6\. Relation Names**

Relations are always singular.

Example

role Role

Collection relations are plural.

orders Order\[\]

Never

roles Role

for a single relation.

**7\. Boolean Naming**

Always begin with

is

has

can

should

Examples

isActive

isVerified

isPrimary

hasAcceptedTerms

canLogin

**8\. Money**

Never use Float.

Always

Decimal

price Decimal @db.Decimal(12,2)

Examples

price

salePrice

subtotal

discount

tax

shippingFee

grandTotal

**9\. Status**

Until workflows stabilize, use strings instead of Prisma enums, matching our design guidance.

Example

status String @default("active")

Later we can migrate safely to

enum ProductStatus

**10\. JSON Fields**

Only for flexible data.

Allowed

selectedOptions

gatewayPayload

metadata

personalization

seo

Never

productName

price

email

Those deserve real columns.

**11\. URLs**

Always

String

Examples

imageUrl

secureUrl

avatarUrl

videoUrl

**12\. Slugs**

Every public entity

slug String @unique

Examples

Products

Collections

Categories

Portfolio Shoots

Love Websites

**13\. Sort Order**

Whenever manual ordering exists

sortOrder Int @default(0)

**14\. Soft Delete Strategy**

Instead of deleting

Use

status

or

archivedAt

depending on the table.

Never permanently delete

- Orders
- Payments
- Users
- Custom Requests

**15\. Audit Fields**

Future-proof every important table.

Eventually we'll support

createdById

updatedById

Not in every Phase 1 table, but the naming convention starts now.

**16\. Common Indexes**

Frequently queried fields should always be indexed.

Example

@@index(\[status\])

@@index(\[createdAt\])

@@index(\[updatedAt\])

For foreign keys

@@index(\[userId\])

For composite lookups

@@index(\[status, createdAt\])

**17\. Unique Constraints**

Examples

email

slug

sku

roleName

permissionKey

Composite examples

@@unique(\[roleId, permissionId\])

**18\. Relation Delete Rules**

Default

Restrict

Only use

Cascade

for pure join tables.

Never cascade delete

- Orders
- Payments
- Products

**19\. Common Column Order**

Every model should follow the same layout:

Primary Key

Business Fields

Foreign Keys

Relations

Metadata

Indexes

Mapping

For example:

model Product {

// Primary Key

id

// Business Fields

name

slug

description

status

// Foreign Keys

categoryId

// Relations

category

variants

// Metadata

createdAt

updatedAt

// Indexes

@@index(...)

@@unique(...)

// Mapping

@@map("products")

}

This makes every model immediately recognizable to anyone working on the codebase.

**20\. File Organization**

As the schema grows, we'll split it by domain while keeping a single generated Prisma schema:

prisma/

│

├── schema.prisma # Root entry

├── prisma.config.ts

├── migrations/

├── seed.ts

│

├── models/

│ ├── foundation.prisma

│ ├── identity.prisma

│ ├── catalog.prisma

│ ├── commerce.prisma

│ ├── cms.prisma

│ ├── marketing.prisma

│ ├── portfolio.prisma

│ ├── analytics.prisma

│ └── settings.prisma

This keeps the project manageable as Phase 2-4 introduce dozens more models.

**Development Workflow Standard**

Every new table will follow this sequence:

- Design the model against the database reference.
- Apply the BaseModel convention.
- Add relationships.
- Add indexes and unique constraints.
- Format:
- npx prisma format
- Validate:
- npx prisma validate
- Generate the migration:
- npx prisma migrate dev --name &lt;migration_name&gt;
- Verify the schema in pgAdmin.
- Add or update seed data if required.
