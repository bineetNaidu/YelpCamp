const express = require("express");
const router = express.Router();
const passport = require("passport"),
    User = require("../models/user"),
    Campground = require("../models/campground");

router.get("/", (req, res) => {
    res.render("landingPage");
});

// show register form
router.get("/register", (req, res) => {
    res.render("register");
});

// sign up logic!
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    if (req.body.adminCode === "bineet980021") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Wellcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// login logic!
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: `Welcome back to YelpCamp`,
    }),
    (req, res) => {}
);

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You are logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;
