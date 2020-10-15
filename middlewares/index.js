import { campSchema, reviewSchema } from '../schema.js';

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
    req.flash('error', 'You Must Be Logged In First!');
    return res.redirect('/auth/login');
  }
  next();
};
