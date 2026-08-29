import { afterAll, beforeEach } from 'vitest';
import { createPrismaTest } from '../helpers/prismaTest.js';
import { resetDb } from '../helpers/resetDB.js';

const prisma = createPrismaTest();

beforeEach(async () => {
  await resetDb(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});
