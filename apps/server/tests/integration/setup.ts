import { afterAll, beforeEach } from 'vitest';
import { createPrismaTest } from '../helpers/prismaTest.js';
import { resetDb } from '../helpers/resetDB.js';
import { createRepositories } from '../../src/repositories/prisma/index.js';
import { createServices } from '../../src/services/index.js';
import { createApp } from '../../src/app.js';
import { createRouter } from '../../src/routes/index.js';
import { createControllers } from '../../src/controllers/index.js';

export const prisma = createPrismaTest();
const testRepos = createRepositories(prisma);
const testServices = createServices(testRepos);
const testControllers = createControllers(testServices);
const testRouter = createRouter(testControllers);

export const app = createApp(testServices, testRouter);

beforeEach(async () => {
  await resetDb(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});
