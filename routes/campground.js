const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

// INDEX ROUTES - SHOWS ALL CAMPGROUNDS LIST
router.get("/", (req, res) => {
    // fuzzy search ability
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        // Get all campgrounds from DB
        Campground.find({ name: regex }, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                if (allCampgrounds.length < 1) {
                    noMatch =
                        "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    noMatch: noMatch,
                });
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    noMatch: noMatch,
                });
            }
        });
    }
});

// CREATE ROUTES - ADDS NEW CAMPGROUND TO DB's
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from the form and add to campground 's array
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username,
    };
    let newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author,
    };
    // create a new campground and save to the DB
    Campground.create(newCampground, (err, newlyCreatedCampground) => {
        if (err) {
            console.log(err);
        } else {
            // redirect the user back to /campground page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - shows a form to create campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - shows more about the campground details
router.get("/:id", (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCamp) => {
            if (err || !foundCamp) {
                req.flash("error", "Campgound not Found!!");
                res.redirect("back");
            } else {
                // render show template with that campground
                res.render("campgrounds/show", { campground: foundCamp });
            }
        });
});

// EDIT campgound route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE campgound route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err, updatedCamp) => {
            if (!err) {
                return res.redirect("/campgrounds/" + req.params.id);
            }
            res.redirect("/campgrounds");
        }
    );
});

// Delete/destroy Campground
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error.message);
        res.redirect("/campgrounds");
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
