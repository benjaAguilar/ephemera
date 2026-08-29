import { inject } from 'vitest';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client.js';

export function createPrismaTest() {
  const connectionString = inject('DATABASE_URL');

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
