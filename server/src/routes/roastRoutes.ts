import { Router } from 'express';
import { listRoasts, roastUrl } from '../controller/roastController';
import { roastLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/roasts', listRoasts);
router.post('/roast', roastLimiter, roastUrl);

export default router;
