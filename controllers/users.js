import User from '../models/User.js';
import Campground from '../models/Campground.js';
import util from 'util';

export const registerUserPage = (_, res) => res.render('users/register');

export const createUser = async (req, res, next) => {
  try {
    const { password, email, username } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', `Welcome To YelpCamp! ${registeredUser.username}`);
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/auth/register');
  }
};

export const logInUserPage = (_, res) => res.render('users/login');

export const loginUser = async (req, res) => {
  req.flash('success', 'Welcome Back!');
  const redirectURL = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectURL);
};

export const logoutUser = (req, res) => {
  req.logout();
  req.flash('success', 'Successfully Logged out!');
  res.redirect('/campgrounds');
};

export const getUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userid });
  const camps = await Campground.find({})
    .where('author')
    .equals(user._id)
    .exec();
  res.render('users/profile', { user, camps });
};

export const updateUserProfile = async (req, res) => {
  // destructure username and email from req.body
  const { username, email } = req.body;
  // destructure user object from res.locals
  const { currentUser } = res.locals;
  // check if username or email need to be updated
  if (username) currentUser.username = username;
  if (email) currentUser.email = email;
  // save the updated user to the database
  await currentUser.save();
  // promsify req.login
  const login = util.promisify(req.login.bind(req));
  // log the user back in with new info
  await login(currentUser);
  // redirect to /profile with a success flash message
  req.flash('success', 'Profile successfully updated!');
  res.redirect(`/user/${currentUser._id}`);
};
