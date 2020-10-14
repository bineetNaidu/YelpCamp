import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { validateCampSchema } from '../middlewares/index.js';
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
  .post(validateCampSchema, catchAsync(createCamp));

router.get('/new', newCamp);

router
  .route('/:id')
  .get(catchAsync(showCamp))
  .put(validateCampSchema, catchAsync(updateCamp))
  .delete(catchAsync(deleteCamp));

router.get('/:id/edit', catchAsync(editCamp));

export default router;
