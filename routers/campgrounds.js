const router = require('express').Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateCampSchema } = require('../middlewares');
const {
  getAllCamps,
  newCamp,
  showCamp,
  createCamp,
  deleteCamp,
  editCamp,
  updateCamp,
} = require('../controllers/campgrounds');

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

module.exports = router;
