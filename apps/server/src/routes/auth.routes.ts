import { Router } from 'express';
import { tryCatch } from '../utils/errorCatch.js';
import { jwtAuthStrategy } from '../middlewares/passport.js';
import type { AuthController } from '../controllers/auth.controller.js';

export function createAuthRouter(authController: AuthController) {
  const authRouter = Router();

  authRouter.post('/', tryCatch(authController.auth));
  authRouter.post('/kill', jwtAuthStrategy, tryCatch(authController.killSession));
  authRouter.get('/session', jwtAuthStrategy, tryCatch(authController.session));

  return authRouter;
}
