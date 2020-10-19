import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/users.js';
import { isValidPassword } from '../middlewares/index.js';

const router = Router();

router
  .route('/:userid')
  .get(getUserProfile)
  .put(isValidPassword, updateUserProfile);

export default router;
