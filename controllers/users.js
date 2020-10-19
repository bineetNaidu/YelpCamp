import User from '../models/User.js';

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
  res.render('users/profile', { user });
};
