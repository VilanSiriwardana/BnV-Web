import 'dotenv/config';
import { createPrismaClient } from '../../src/lib/prisma-client';

export const prisma = createPrismaClient();
