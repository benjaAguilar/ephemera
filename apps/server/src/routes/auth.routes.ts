import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { tryCatch } from '../utils/errorCatch.js';

const authRouter = Router();

authRouter.post('/', tryCatch(authController.auth));

export default authRouter;
