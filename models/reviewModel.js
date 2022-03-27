const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can not be empty."]
        },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false // Important: Doesn't work during creation of documents.
        },
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
    { id: false },
    {
        // Note: For showing virtual properties in json and object.
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Chapter: Document Middleware
// reviewSchema.pre("save", function (next) {
// Warning: Never do this to deselect field. It will permanently alter the data.
//     // this.__v = undefined;
//     // this._id = undefined;

//     next();
// });

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

// Point: Nested Route
// POST /tour/1234/reviews -> Create a new review for the tour id 1234 and the currently logged in user's id.
// GET /tour/1234/reviews -> Get all the reviews of the tour id 1234
// GET /tour/1234/reviews/1452 -> Get the review for the review id 1452 on the tour which's id is 1234.
