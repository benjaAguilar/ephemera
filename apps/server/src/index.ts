import { createApp } from './app.js';
import { createControllers } from './controllers/index.js';
import { prisma } from './lib/prisma.js';
import { createRepositories } from './repositories/prisma/index.js';
import { createRouter } from './routes/index.js';
import { createServices } from './services/index.js';

const repos = createRepositories(prisma);
export const services = createServices(repos);

export const controllers = createControllers(services);

const router = createRouter(controllers);
export const app = createApp(services, router);
