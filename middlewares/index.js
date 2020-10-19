import { campSchema, reviewSchema } from '../schema.js';
import Review from '../models/Review.js';
import Campground from '../models/Campground.js';
import { ExpressError } from '../utils/ExpressError.js';

export const validateCampSchema = (req, res, next) => {
  const { error } = campSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};

export const validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You Must Be Logged In First!');
    return res.redirect(`/auth/login`);
  }
  next();
};

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findOne({ _id: id });
  if (!camp.author.equals(req.user._id)) {
    req.flash('error', 'You Are Not Authorized!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You Are Not Authorized!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export const escapeRegex = (text) =>
  text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
