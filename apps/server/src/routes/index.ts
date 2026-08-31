import { Router } from 'express';
import type { Controllers } from '../controllers/index.js';
import { createAuthRouter } from './auth.routes.js';

export function createRouter(controllers: Controllers) {
  const router = Router();

  router.get('/', (_req, res) => res.json({ message: 'Hello World' }));

  router.use('/auth', createAuthRouter(controllers.authController));

  return router;
}
