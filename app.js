const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    methodOveride = require("method-override"),
    LocalStategy = require("passport-local"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// require the routes
const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users");

// seedDB();
require("dotenv/config");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const dburi = process.env.MONGODB_URI || "mongodb://localhost:27017/yelp_camp";

mongoose
    .connect(dburi, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log(`DB connections Error : -- ${err.message}`));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// PASSPORT CONFIGURATIONS
app.use(
    require("express-session")({
        secret: "once upon a time in hell",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(userRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log(
        `YelpCamp server has started -- ${process.env.PORT}-${process.env.IP}`
    );
});
