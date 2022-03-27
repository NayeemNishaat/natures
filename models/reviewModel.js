const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can not be empty."]
        },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        createdAt: { type: Date, default: new Date() },
        // Important: Parent referencing is better.
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Review must belong to a tour."]
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            userSchemarequired: [true, "Review must have an author."]
        }
    },
    {
        // Note: For showing virtual properties in json and object.
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Chapter: Query Middleware
reviewSchema.pre(/^find/, function (next) {
    // this.populate("tour", "name").populate({
    //     path: "user",
    //     select: "name photo"
    // });

    this.populate("user", "name photo");

    next();
});

module.exports = mongoose.model("Review", reviewSchema);
