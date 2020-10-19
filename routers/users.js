import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/users.js';
import { changePassword, isValidPassword } from '../middlewares/index.js';
import catchAsync from '../utils/catchAsync.js';

const router = Router();

router
  .route('/:userid')
  .get(catchAsync(getUserProfile))
  .put(
    catchAsync(isValidPassword),
    catchAsync(changePassword),
    catchAsync(updateUserProfile)
  );

export default router;
