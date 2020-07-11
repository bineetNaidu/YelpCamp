const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {
        type: Boolean,
        default: false,
    },
});
const options = {
    errorMessages: {
        IncorrectPasswordError: "Password is incorrect",
        IncorrectUsernameError: "Username is incorrect",
    },
};

UserSchema.plugin(passportLocalMongoose, options);
module.exports = mongoose.model("User", UserSchema);
