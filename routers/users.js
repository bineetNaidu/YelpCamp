import express from 'express';
import { registerUserPage } from '../controllers/users.js';
const router = express.Router({ mergeParams: true });

router.route('/register').get(registerUserPage);

export default router;
