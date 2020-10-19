import { Router } from 'express';
import { getUserProfile } from '../controllers/users.js';

const router = Router();

router.route('/:userid').get(getUserProfile);

export default router;
