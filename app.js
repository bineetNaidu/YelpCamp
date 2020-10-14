// ************* Import ****************
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const logger = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

// *********** App Configuration ***********
const app = express();

// ? ***  DB connections ******
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Unmounting routes
app.get('/', (_, res) => res.render('home'));
app.use('/campgrounds', require('./routers/campgrounds'));
app.use('/campgrounds/:id/reviews', require('./routers/reviews'));

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
