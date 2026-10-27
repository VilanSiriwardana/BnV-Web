This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local database setup

Local PostgreSQL and pgAdmin run natively, not via Docker (see ADR-0010 in `docs/decisions/DECISIONS.md`).

1. Install PostgreSQL 16 and pgAdmin 4 (Windows: the official PostgreSQL installer, components Server + pgAdmin 4 + Command Line Tools). Use port 5432.
2. In pgAdmin's Query Tool, connected as `postgres`, create the app role and database:
   ```sql
   CREATE ROLE <user> WITH LOGIN PASSWORD '<password>' CREATEDB;
   CREATE DATABASE <db> OWNER <user> ENCODING 'UTF8';
   ```
3. Copy `.env.example` to `.env` and set `DATABASE_URL` to match the role/database you created.
4. Apply the existing migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
