import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.');
}

const url = new URL(databaseUrl);
const schema = url.searchParams.get('schema') ?? 'public';
url.searchParams.delete('schema');

const adapter = new PrismaPg({ connectionString: url.toString() }, { schema });

export const prisma = new PrismaClient({ adapter });
