import { Router } from 'express';
import { hello } from '@ephemera/schemas';
const router = Router();

router.get('/', (_req, res) => res.json({ message: hello() }));

export default router;
