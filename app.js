// ************* Import ****************
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/Campground');
const methodOverride = require('method-override');
const logger = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campSchema, reviewSchema } = require('./schema');
const Review = require('./models/Review');

// *********** App Configuration ***********
const app = express();

// ? ***  DB connections ******
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB Connection Error'));
db.on('open', () => console.log('>>>> DB Connected <<<<'));
// ? ***  DB connections ******

// Middlewares
app.use(logger('dev'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampSchema = (req, res, next) => {
  const { error } = campSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};

const validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};

// Unmounting routes
app.get('/', (_, res) => res.render('home'));

app.get('/campgrounds', async (_, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (_, res) => res.render('campgrounds/new'));

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findOne({
      _id: req.params.id,
    }).populate('reviews');
    res.render('campgrounds/show', { campground });
  })
);

app.post(
  '/campgrounds',
  validateCampSchema,
  catchAsync(async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const campground = await Campground.findOne({ _id: req.params.id });
    res.render('campgrounds/edit', { campground });
  })
);

app.put(
  '/campgrounds/:id',
  validateCampSchema,
  catchAsync(async (req, res) => {
    const camp = await Campground.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body.campground }
    );
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    await Campground.findOneAndDelete({ _id: req.params.id });
    res.redirect(`/campgrounds`);
  })
);

app.post(
  '/campgrounds/:id/reviews',
  validateReviewSchema,
  catchAsync(async (req, res) => {
    const camp = await Campground.findOne({ _id: req.params.id });
    const review = await new Review(req.body.review);
    await camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.delete(
  '/campgrounds/:id/reviews/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findOneAndUpdate(
      { _id: id },
      { $pull: { reviews: reviewId } }
    );
    await Review.findOneAndDelete({ _id: reviewId });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error Handlers
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode);
  res.render('error', { err });
});

// App Listeners
app.listen(4242, () => console.log('YelpCamp Server has Started'));
