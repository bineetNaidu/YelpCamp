import express from 'express';
import passport from 'passport';
import {
  createUser,
  loginUser,
  logInUserPage,
  logoutUser,
  registerUserPage,
} from '../controllers/users.js';
import catchAsync from '../utils/catchAsync.js';
const router = express.Router({ mergeParams: true });

router.route('/register').get(registerUserPage).post(catchAsync(createUser));

router
  .route('/login')
  .get(logInUserPage)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/auth/login',
    }),
    loginUser
  );

router.get('/logout', logoutUser);

export default router;
