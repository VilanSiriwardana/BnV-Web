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

Do not change the generator provider or configure a custom output directory unless an architectural decision has been approved and recorded in [../governance/DECISIONS.md](../governance/DECISIONS.md).

The generated Prisma Client lives in `node_modules/@prisma/client`. AI agents must not generate or commit custom client code under `src/generated` unless explicitly instructed.

> **Open verification (UNCERTAIN, added v1.1).** The repository runs Prisma 7.8.0. Prisma 7 changed several defaults compared with Prisma 5 and 6, including configuration through `prisma.config.ts` and how the client connects to the database. Before the first domain migration, confirm against the Prisma 7 documentation that `prisma-client-js` without a custom output is still supported in this version and what connection setup it needs. Record the result as an ADR. Do not change the generator until that check is done.

## Approval Boundary

These always require explicit approval: running migrations, `prisma migrate reset`, seeders, destructive SQL, deleting Docker volumes, and schema changes outside an approved task.

## Prisma Client Singleton

Phase 1 code accesses the database through one shared Prisma client module in `src/lib/` (planned location `src/lib/prisma.ts`, PROPOSED). Reuse it so development hot-reload does not open a new connection pool on every reload. Database access stays on the server side: Server Components, Server Actions, and Route Handlers only.
