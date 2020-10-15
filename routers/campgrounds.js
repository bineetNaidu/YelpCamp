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
  // .post(isLoggedIn, validateCampSchema, catchAsync(createCamp));
  .post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send('WORKED!');
  });

router.get('/new', newCamp);

router
  .route('/:id')
  .get(catchAsync(showCamp))
  .put(isLoggedIn, isAuthor, validateCampSchema, catchAsync(updateCamp))
  .delete(isLoggedIn, catchAsync(deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCamp));

export default router;
