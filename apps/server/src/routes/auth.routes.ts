import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { tryCatch } from '../utils/errorCatch.js';
import { jwtAuthStrategy } from '../middlewares/passport.js';

const authRouter = Router();

authRouter.post('/', tryCatch(authController.auth));
authRouter.post('/kill', jwtAuthStrategy, tryCatch(authController.killSession));

export default authRouter;
