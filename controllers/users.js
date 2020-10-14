import User from '../models/User.js';

export const registerUserPage = (_, res) => res.render('users/register');

export const createUser = async (req, res) => {
  try {
    const { password, email, username } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash('success', `Welcome To YelpCamp! ${registeredUser.username}`);
    res.redirect('/campgrounds');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/auth/register');
  }
};
