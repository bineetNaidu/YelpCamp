import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => res.render('home'));
router.get('/about', (_, res) => res.render('about'));

export default router;
