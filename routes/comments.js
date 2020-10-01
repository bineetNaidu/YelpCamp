const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (!err) {
            res.render("comments/new", { campground: camp });
        }
    });
});

// comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    // look up campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (!err) {
            // create an comments
            Comment.create(req.body.comment, (err, comment) => {
                if (!err) {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment with author
                    comment.save();
                    // connect the new commments to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redicted somewhere
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        } else {
            req.flash("error", "Something went Wrong!");
            res.redirect("back");
        }
    });
});

// comments edit route
router.get(
    "/:comment_id/edit",
    middleware.checkCommentOwnership,
    (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash("error", "No Campground found");
                return res.redirect("back");
            }

            Comment.findById(req.params.comment_id, (err, foundComments) => {
                if (!err) {
                    return res.render("comments/edit", {
                        campground_id: req.params.id,
                        comment: foundComments,
                    });
                }
                res.redirect("back");
            });
        });
    }
);

// comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, updatedComments) => {
            if (!err) {
                return res.redirect("/campgrounds/" + req.params.id);
            }
            res.redirect("back");
        }
    );
});

// comments delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        err
            ? res.redirect("back")
            : req.flash(
                  "success",
                  "You have Successfully deleted a campground"
              ),
            res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;
