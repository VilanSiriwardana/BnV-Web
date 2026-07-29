# Database Standards

This document records B&V database engineering standards that future agents must follow alongside [Database Design](Database-Design.md).

## Prisma Client Generation Standard

B&V uses the standard Prisma Client generation workflow.

Generator:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

Do not change the generator provider or configure a custom output directory unless an architectural decision has been approved and recorded in [../governance/DECISIONS.md](../governance/DECISIONS.md).

The generated Prisma Client lives in `node_modules/@prisma/client`.

AI agents must not generate or commit custom client code under `src/generated` unless explicitly instructed.
