import type { Services } from '../services/index.js';
import { createAuthController, type AuthController } from './auth.controller.js';

export interface Controllers {
  authController: AuthController;
}

export function createControllers(services: Services): Controllers {
  return {
    authController: createAuthController(services.userService),
  };
}
