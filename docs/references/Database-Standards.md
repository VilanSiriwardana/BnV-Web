# Database Standards

| Field   | Value      |
| ------- | ---------- |
| Version | 1.1        |
| Status  | Approved   |
| Updated | 2026-10-28 |

This document records B&V database engineering standards that agents must follow alongside the [Database BaseModel Convention](Database-Design.md) and the [Database Design Reference](Database-Design-Reference.md).

## Prisma Client Generation Standard

B&V uses the standard Prisma Client generation workflow.

```prisma
generator client {
  provider = "prisma-client-js"
}
```

Do not change the generator provider or configure a custom output directory unless an architectural decision has been approved and recorded in [../decisions/DECISIONS.md](../decisions/DECISIONS.md).

The generated Prisma Client lives in `node_modules/@prisma/client`. AI agents must not generate or commit custom client code under `src/generated` unless explicitly instructed.

> **Resolved (2026-10-28, ADR-0014).** `prisma-client-js` with the default output works on Prisma 7.8.0. The client must be constructed with a driver adapter: `new PrismaClient({ adapter: new PrismaPg({ connectionString }, { schema }) })` from `@prisma/adapter-pg`. Prisma packages are pinned to exactly 7.8.0.

## Approval Boundary

These always require explicit approval: running migrations, `prisma migrate reset`, seeders, destructive SQL, deleting Docker volumes, and schema changes outside an approved task.

## Prisma Client Singleton

Phase 1 code accesses the database through one shared Prisma client module in `src/lib/` (planned location `src/lib/prisma.ts`, PROPOSED). Reuse it so development hot-reload does not open a new connection pool on every reload. Database access stays on the server side: Server Components, Server Actions, and Route Handlers only.
