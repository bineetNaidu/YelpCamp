import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isLoggedIn, validateReviewSchema } from '../middlewares/index.js';
import { createReview } from '../controllers/review.js';
import { deleteCamp } from '../controllers/campgrounds.js';

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReviewSchema, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, catchAsync(deleteCamp));

export default router;
