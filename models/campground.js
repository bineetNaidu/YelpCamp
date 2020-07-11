const mongoose = require("mongoose");
const Comment = require("./comment");

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});
// prehook
campgroundSchema.pre("remove", async function () {
    await Comment.remove({
        _id: {
            $in: this.comments,
        },
    });
});

module.exports = mongoose.model("Campground", campgroundSchema);
