import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import {
  isLoggedIn,
  validateCampSchema,
  isAuthor,
} from '../middlewares/index.js';
import {
  getAllCamps,
  newCamp,
  showCamp,
  createCamp,
  deleteCamp,
  editCamp,
  updateCamp,
} from '../controllers/campgrounds.js';
import multer from 'multer';
import { storage } from '../configs/cloudinary.js';

const router = express.Router({ mergeParams: true });
const upload = multer({ storage });

router
  .route('/')
  .get(getAllCamps)
  .post(
    isLoggedIn,
    upload.array('image', 4),
    validateCampSchema,
    catchAsync(createCamp)
  );

router.get('/new', isLoggedIn, newCamp);

router
  .route('/:id')
  .get(catchAsync(showCamp))
  .put(isLoggedIn, isAuthor, validateCampSchema, catchAsync(updateCamp))
  .delete(isLoggedIn, catchAsync(deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCamp));

export default router;
