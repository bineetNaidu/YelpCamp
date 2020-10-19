import { campSchema, reviewSchema } from '../schema.js';
import Review from '../models/Review.js';
import Campground from '../models/Campground.js';
import { ExpressError } from '../utils/ExpressError.js';
import User from '../models/User.js';

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

// validate password
export const isValidPassword = async (req, res, next) => {
  const { user } = await User.authenticate()(
    req.user.username,
    req.body.currentPassword
  );
  if (user) {
    // add user to res.locals
    res.locals.currentUser = user;
    // go to next middleware
    next();
  } else {
    // flash an error
    req.flash('error', 'Incorrect Current Password!');
    // short circuit the route middleware and redirect to /profile
    // return res.redirect(`/user/${currentUser._id}`);
    return res.redirect(`back`);
  }
};

// changing password
export const changePassword = async (req, res, next) => {
  // destructure new password values from req.body object
  const { newPassword, passwordConfirmation } = req.body;

  // check if newPassword is there but not passwordConfirmation
  if (newPassword && !passwordConfirmation) {
    req.flash('error', 'Missing password confirmation!');
    return res.redirect(`/user/${currentUser._id}`);
  }
  // check if new password values exist
  else if (newPassword && passwordConfirmation) {
    // destructure user from res.locals
    const { currentUser } = res.locals;
    // check if new passwords match
    if (newPassword === passwordConfirmation) {
      // set new password on user object
      await currentUser.setPassword(newPassword);
      // go to next middleware
      next();
    } else {
      // flash error
      req.flash('error', 'New passwords must match!');
      // short circuit the route middleware and redirect to /profile
      return res.redirect(`/user/${currentUser._id}`);
    }
  } else {
    // go to next middleware
    next();
  }
};
