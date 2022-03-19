const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
        minlength: [8, "Minimum password length should be 8 characters"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password."],
        validate: {
            validator: function (el) {
                // Important: Only works on SAVE or CREATE! So we need to use save not update to perform validation.
                // Note: true -> no error. el -> passwordConfirm and this.password -> the upper password property.
                // Point: Validator function will be automatically called by mongoose and it will be called with the parameter passwordConfirm.
                return el === this.password;
            },
            message: "Passwords didn't match!"
        }
    }
});

userSchema.pre("save", async function (next) {
    // Part: Only run if password is modified.
    if (!this.isModified("password")) return next();

    // Part: Hash the password.
    this.password = await bcrypt.hash(this.password, 12);

    // Part: Delete the passwordConfirm from DB.
    this.passwordConfirm = undefined;

    next();
});

// Segment: Instance Method -> It is a method that is going to be available to all of the documents of a collection.
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // Important: this.password is not available because "select: false" is set.
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
