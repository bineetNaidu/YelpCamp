import Campground from '../models/Campground.js';
import { cloudinary } from '../configs/cloudinary.js';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

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
  const { body } = await geocoder
    .forwardGeocode({ query: req.body.campground.location, limit: 1 })
    .send();
  const camp = new Campground(req.body.campground);
  camp.geometry = body.features[0].geometry;
  camp.images = await req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
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
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  camp.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await camp.save();
  req.flash('success', `Successfully updated ${camp.title} Campground`);
  res.redirect(`/campgrounds/${camp._id}`);
};

export const deleteCamp = async (req, res) => {
  const camp = await Campground.findOne({ _id: req.params.id });
  if (camp.images) {
    for (let image of camp.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
  }
  await camp.remove();
  req.flash('success', 'Successfully Deleted the Campground');
  res.redirect(`/campgrounds`);
};
