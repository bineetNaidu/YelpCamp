import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import {
  isLoggedIn,
  isReviewAuthor,
  validateReviewSchema,
} from '../middlewares/index.js';
import { createReview, deleteReview } from '../controllers/review.js';

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReviewSchema, catchAsync(createReview));

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(deleteReview)
);

export default router;
