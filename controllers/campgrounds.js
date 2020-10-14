import Campground from '../models/Campground.js';

export const getAllCamps = async (_, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

export const newCamp = (_, res) => res.render('campgrounds/new');

export const showCamp = async (req, res) => {
  const campground = await Campground.findOne({
    _id: req.params.id,
  }).populate('reviews');
  res.render('campgrounds/show', { campground });
};

export const createCamp = async (req, res) => {
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
};

export const editCamp = async (req, res) => {
  const campground = await Campground.findOne({ _id: req.params.id });
  res.render('campgrounds/edit', { campground });
};

export const updateCamp = async (req, res) => {
  const camp = await Campground.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body.campground }
  );
  res.redirect(`/campgrounds/${camp._id}`);
};

export const deleteCamp = async (req, res) => {
  await Campground.findOneAndDelete({ _id: req.params.id });
  res.redirect(`/campgrounds`);
};
