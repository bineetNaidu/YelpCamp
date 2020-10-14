// ************* Import ****************
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import logger from 'morgan';
import ejsMate from 'ejs-mate';
import { ExpressError } from './utils/ExpressError.js';
import session from 'express-session';
import flash from 'connect-flash';

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
app.set(path.join('views'));
app.use(express.static(path.join('public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'thishouldabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // ? 1 week
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Unmounting routes
import campRoutes from './routers/campgrounds.js';
import reviewRoutes from './routers/reviews.js';

app.get('/', (_, res) => res.render('home'));
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

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
