# B&V Web

B&V (BuwiNVila) is a modern romantic lifestyle ecommerce site: fashion, jewelry, gifts, couple pieces, custom orders, and a visual portfolio. The build plan lives in [docs/references/Implementation-Plan.md](docs/references/Implementation-Plan.md).

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma 7 (`@prisma/adapter-pg`), PostgreSQL 16.

## Prerequisites

- Node.js 20 or later.
- PostgreSQL 16 and pgAdmin 4, installed natively (ADR-0010 in [docs/decisions/DECISIONS.md](docs/decisions/DECISIONS.md)). On Windows, use the official PostgreSQL installer with Server, pgAdmin 4 and Command Line Tools. Use port 5432.

## Setup

1. In pgAdmin's Query Tool, connected as `postgres`, create the app role and database:
   ```sql
   CREATE ROLE bnv WITH LOGIN PASSWORD '<password>' CREATEDB;
   CREATE DATABASE bnv_db OWNER bnv ENCODING 'UTF8';
   ```
2. Copy `.env.example` to `.env`. Set `DATABASE_URL` to match the role and database you created, and fill in the `SEED_ADMIN_*` values. The password must be 12 or more characters.
3. Install and set up the database:
   ```bash
   npm install
   npm run db:setup
   ```
   `db:setup` generates the Prisma client, applies the migrations, and seeds reference data (roles, permissions, the first super admin, brand, categories, collections).
4. Optional: load demo products with `npm run db:seed:demo`.
5. Start the app with `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Start the development server                                         |
| `npm run build`        | Production build                                                     |
| `npm run lint`         | ESLint                                                               |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`)                                    |
| `npm run db:validate`  | Check that every schema file loads and is valid                      |
| `npm run db:generate`  | Generate the Prisma client                                           |
| `npm run db:migrate`   | Create and apply a new migration (development)                       |
| `npm run db:deploy`    | Apply existing migrations                                            |
| `npm run db:seed`      | Seed reference data and the super admin. Safe to re-run              |
| `npm run db:seed:demo` | Seed reference data and demo products. **Development only**          |
| `npm run db:reset`     | Drop and recreate the database, then seed. **Destructive, dev only** |
| `npm run db:setup`     | Generate, deploy migrations, then seed                               |
| `npm run db:studio`    | Open Prisma Studio                                                   |

The Prisma schema is split by domain in `prisma/schema/`: `schema.prisma` (generator and datasource), `identity`, `catalog`, `products` and `commerce`. Prisma loads every `.prisma` file in that folder. Run `npm run db:validate` after editing it.

Seeders live in `prisma/seed/` (`index.ts` runs `seeders/01-…06-` in order; data is in `data/`). They upsert by unique keys, so running them again updates rows instead of duplicating them. Re-seeding never changes an existing admin's password.

## Documentation

- [AGENTS.md](AGENTS.md): entry point for contributors and AI agents.
- [docs/governance/PLAN.md](docs/governance/PLAN.md): current milestone and progress.
- [docs/references/README.md](docs/references/README.md): reference library (brand, database, SEO, decisions).
