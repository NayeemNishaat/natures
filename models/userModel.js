const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "A user must have an email!"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email!"]
    },
    photo: String,
    password: {
        type: String,
        required: [true, "A user must have a password!"],
        minlength: [8, "Minimum password length should be 8 characters"]
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password."]
    }
});

module.exports = mongoose.model("User", userSchema);
