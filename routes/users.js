const express = require("express");
const router = express.Router(),
    User = require("../models/user"),
    Campground = require("../models/campground");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// user profiles
router.get("/users/:id", async (req, res) => {
    try {
        User.findById(req.params.id, (err, foundUSER) => {
            if (err || !foundUSER) {
                req.flash("error", "SORRY NO USER FOUND");
                return res.redirect("back");
            }

            Campground.find()
                .where("author.id")
                .equals(foundUSER._id)
                .exec((err, camps) => {
                    if (err || !camps) {
                        req.flash("error", "Something went wrong");
                        return res.redirect("back");
                    }

                    res.render("users/show", {
                        user: foundUSER,
                        campgrounds: camps,
                    });
                });
        });
    } catch (error) {
        req.flash("error", "SOMETHING WHEN WRONG");
        res.redirect("/campground");
    }
});

// forgot password
router.get("/forgot", (req, res) => {
    res.render("users/forgot");
});

router.post("/forgot", async (req, res, next) => {
    try {
        async.waterfall(
            [
                function (done) {
                    crypto.randomBytes(20, (err, buf) => {
                        var token = buf.toString("hex");
                        done(err, token);
                    });
                },
                function (token, done) {
                    User.findOne({ email: req.body.email }, (err, user) => {
                        if (!user) {
                            req.flash(
                                "error",
                                "No account with that email address exists."
                            );
                            return res.redirect("/forgot");
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save((err) => {
                            done(err, token, user);
                        });
                    });
                },
                function (token, user, done) {
                    const smtpTransport = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: process.env.GMAIL,
                            pass: process.env.GMAILPW,
                        },
                    });
                    const mailOptions = {
                        to: user.email,
                        from: process.env.GMAIL,
                        subject: "YelpCamp Password Reset",
                        text:
                            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                            "http://" +
                            req.headers.host +
                            "/reset/" +
                            token +
                            "\n\n" +
                            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
                    };
                    smtpTransport.sendMail(mailOptions, (err) => {
                        req.flash(
                            "success",
                            "An e-mail has been sent to " +
                                user.email +
                                " with further instructions."
                        );
                        done(err, "done");
                    });
                },
            ],
            function (err) {
                if (err) return next(err);
                res.redirect("/forgot");
            }
        );
    } catch (error) {
        req.flash("error", "Something Went Wrong");
        res.redirect("back");
    }
});

router.get("/reset/:token", (req, res) => {
    User.findOne(
        {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        },
        (err, user) => {
            if (!user) {
                req.flash(
                    "error",
                    "Password reset token is invalid or has expired."
                );
                return res.redirect("/forgot");
            }
            res.render("users/reset", { token: req.params.token });
        }
    );
});

router.post("/reset/:token", async (req, res) => {
    try {
        async.waterfall(
            [
                function (done) {
                    User.findOne(
                        {
                            resetPasswordToken: req.params.token,
                            resetPasswordExpires: { $gt: Date.now() },
                        },
                        (err, user) => {
                            if (!user) {
                                req.flash(
                                    "error",
                                    "Password reset token is invalid or has expired."
                                );
                                return res.redirect("back");
                            }
                            if (req.body.password === req.body.confirm) {
                                user.setPassword(req.body.password, (err) => {
                                    user.resetPasswordToken = undefined;
                                    user.resetPasswordExpires = undefined;

                                    user.save((err) => {
                                        req.logIn(user, (err) => {
                                            done(err, user);
                                        });
                                    });
                                });
                            } else {
                                req.flash("error", "Passwords do not match.");
                                return res.redirect("back");
                            }
                        }
                    );
                },
                (user, done) => {
                    const smtpTransport = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: process.env.GMAIL,
                            pass: process.env.GMAILPW,
                        },
                    });
                    const mailOptions = {
                        to: user.email,
                        from: process.env.GMAIL,
                        subject: "Your password has been changed",
                        text:
                            "Hello,\n\n" +
                            "This is a confirmation that the password for your account " +
                            user.email +
                            " has just been changed.\n",
                    };
                    smtpTransport.sendMail(mailOptions, (err) => {
                        req.flash(
                            "success",
                            "Success! Your password has been changed."
                        );
                        done(err);
                    });
                },
            ],
            (err) => {
                res.redirect("/campgrounds");
            }
        );
    } catch (error) {
        req.flash("error", "Something Went Wrong");
        res.redirect("back");
    }
});

module.exports = router;
