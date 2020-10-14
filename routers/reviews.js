const router = require('express').Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReviewSchema } = require('../middlewares');
const { createReview } = require('../controllers/review');
const { deleteCamp } = require('../controllers/campgrounds');

router.post('/', validateReviewSchema, catchAsync(createReview));

router.delete('/:reviewId', catchAsync(deleteCamp));

module.exports = router;
