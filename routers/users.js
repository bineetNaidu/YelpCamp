import express from 'express';
import { createUser, registerUserPage } from '../controllers/users.js';
import catchAsync from '../utils/catchAsync.js';
const router = express.Router({ mergeParams: true });

router.route('/register').get(registerUserPage).post(catchAsync(createUser));

export default router;
