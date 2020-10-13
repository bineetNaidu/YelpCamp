// Import
const express = require('express');
const path = require('path');

// App Configuration
const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));

// Unmounting routes
app.get('/', (req, res) => res.render('home'));

// App Listeners
app.listen(4242, () => console.log('YelpCamp Server has Started'));
