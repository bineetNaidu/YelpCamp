const Campground = require('../models/Campground');

module.exports = {
  getAllCamps: async (_, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  },

  newCamp: (_, res) => res.render('campgrounds/new'),

  showCamp: async (req, res) => {
    const campground = await Campground.findOne({
      _id: req.params.id,
    }).populate('reviews');
    res.render('campgrounds/show', { campground });
  },

  createCamp: async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  },

  editCamp: async (req, res) => {
    const campground = await Campground.findOne({ _id: req.params.id });
    res.render('campgrounds/edit', { campground });
  },

  updateCamp: async (req, res) => {
    const camp = await Campground.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body.campground }
    );
    res.redirect(`/campgrounds/${camp._id}`);
  },

  deleteCamp: async (req, res) => {
    await Campground.findOneAndDelete({ _id: req.params.id });
    res.redirect(`/campgrounds`);
  },
};
