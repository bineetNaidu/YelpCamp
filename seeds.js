const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

let seeds = [
    {
        name: "Cloude herst",
        price: "14.8",
        image:
            "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:
            "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
    },
    {
        name: "Nicolo dest",
        price: "25.8",
        image:
            "https://images.unsplash.com/photo-1590122401646-5534a84afa13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    },
    {
        name: "Tatiadna reyson",
        price: "48.8",
        image:
            "https://images.unsplash.com/photo-1556942154-006c061d4561?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
];

async function seedDB() {
    try {
        await Campground.remove({});
        console.log("Campgrounds removed");
        await Comment.remove({});
        console.log("Comments removed");

        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("Campground created");
            let comment = await Comment.create({
                text: "This place is great, but I wish there was internet",
                author: "Homer",
            });
            console.log("Comment created");
            campground.comments.push(comment);
            campground.save();
            console.log("Comment added to campground");
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = seedDB;
