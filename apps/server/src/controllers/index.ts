import { userService } from '../services/index.js';
import { createAuthController } from './auth.controller.js';

export const authController = createAuthController(userService);
