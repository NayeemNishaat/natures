const crypto = require("crypto");
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
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
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
            validator: function (currEl) {
                // Important: Only works on SAVE or CREATE! So we need to use save not update to perform validation.
                // Note: true -> no error. currEl -> current passwordConfirm element and this.password -> the upper password property.
                // Point: Validator function will be automatically called by mongoose and it will be called with the parameter passwordConfirm.
                return currEl === this.password;
            },
            message: "Passwords didn't match!"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { type: Boolean, default: true, select: false }
});

// Chapter: Document middleware
userSchema.pre("save", async function (next) {
    // Part: Only run if password is modified.
    if (!this.isModified("password")) return next();

    // Part: Hash the password.
    this.password = await bcrypt.hash(this.password, 12);

    // Part: Delete the passwordConfirm from DB.
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // Important: To make sure the token is always created after the password has been changed.
    next();
});

// Chapter: Query middleware
userSchema.pre(/^find/, function (next) {
    // Note: Here this -> current queriable object
    this.find({ active: { $ne: false } });
    next();
});

// Chapter: Instance Method -> It is a method that is going to be available to all of the documents of a collection.
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // Important: this.password is not available because "select: false" is set.
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTtimestamp < changedTimestamp;
    }

    return false; // Note: false means password didn't change.
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 600000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
