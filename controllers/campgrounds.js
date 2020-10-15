import Campground from '../models/Campground.js';

export const getAllCamps = async (_, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

export const newCamp = (_, res) => res.render('campgrounds/new');

export const showCamp = async (req, res) => {
  const campground = await Campground.findOne({
    _id: req.params.id,
  })
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Campground Not Found');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

export const createCamp = async (req, res) => {
  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  if (!camp) {
    req.flash('error', 'Campground Not Found');
    return res.redirect('/campgrounds');
  }
  await camp.save();
  req.flash('success', `Successfully Create a new Campground ${camp.title}`);
  res.redirect(`/campgrounds/${camp._id}`);
};

export const editCamp = async (req, res) => {
  const campground = await Campground.findOne({ _id: req.params.id });
  if (!campground) {
    req.flash('error', 'Campground Not Found');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

export const updateCamp = async (req, res) => {
  const camp = await Campground.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body.campground }
  );
  if (!camp) {
    req.flash('error', 'Campground Not Found');
    return res.redirect('/campgrounds');
  }
  req.flash('success', `Successfully updated ${camp.title} Campground`);
  res.redirect(`/campgrounds/${camp._id}`);
};

export const deleteCamp = async (req, res) => {
  await Campground.findOneAndDelete({ _id: req.params.id });
  req.flash('success', 'Successfully Deleted the Campground');
  res.redirect(`/campgrounds`);
};
