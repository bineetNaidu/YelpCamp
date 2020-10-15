import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isLoggedIn, validateCampSchema } from '../middlewares/index.js';
import {
  getAllCamps,
  newCamp,
  showCamp,
  createCamp,
  deleteCamp,
  editCamp,
  updateCamp,
} from '../controllers/campgrounds.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllCamps)
  .post(isLoggedIn, validateCampSchema, catchAsync(createCamp));

router.get('/new', isLoggedIn, newCamp);

router
  .route('/:id')
  .get(catchAsync(showCamp))
  .put(isLoggedIn, validateCampSchema, catchAsync(updateCamp))
  .delete(isLoggedIn, catchAsync(deleteCamp));

router.get('/:id/edit', isLoggedIn, catchAsync(editCamp));

export default router;
