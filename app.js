// ************* Import ****************
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/Campground');

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
app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));

// Unmounting routes
app.get('/', (_, res) => res.render('home'));

app.get('/campgrounds', async (_, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findOne({ _id: req.params.id });
  res.render('campgrounds/show', { campground });
});

// App Listeners
app.listen(4242, () => console.log('YelpCamp Server has Started'));
