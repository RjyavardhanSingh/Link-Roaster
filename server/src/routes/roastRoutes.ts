import { Router } from 'express';
import { roastUrl } from '../controller/roastController';

const router = Router();

router.post('/roast', roastUrl);

export default router;
