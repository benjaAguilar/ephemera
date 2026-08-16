import { Router } from 'express';
import authRouter from './auth.routes.js';
const router = Router();

router.get('/', (_req, res) => res.json({ message: 'Hello World' }));
router.use('/auth', authRouter);

export default router;
