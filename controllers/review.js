import Review from '../models/Review.js';
import Campground from '../models/Campground.js';

export const createReview = async (req, res) => {
  const camp = await Campground.findOne({ _id: req.params.id });
  if (!camp) {
    req.flash('error', 'Campground Not Found');
    return res.redirect('/campgrounds');
  }
  const review = await new Review(req.body.review);
  await camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash('success', 'Successfully Created Review');
  res.redirect(`/campgrounds/${camp._id}`);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findOneAndUpdate(
    { _id: id },
    { $pull: { reviews: reviewId } }
  );
  await Review.findOneAndDelete({ _id: reviewId });
  req.flash('success', 'Successfully Delete the Review');
  res.redirect(`/campgrounds/${id}`);
};
