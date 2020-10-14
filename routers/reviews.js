import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { validateReviewSchema } from '../middlewares/index.js';
import { createReview } from '../controllers/review.js';
import { deleteCamp } from '../controllers/campgrounds.js';

const router = express.Router({ mergeParams: true });

router.post('/', validateReviewSchema, catchAsync(createReview));

router.delete('/:reviewId', catchAsync(deleteCamp));

export default router;
