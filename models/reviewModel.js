const mongoose = require("mongoose");
const Tour = require("./tourModel");

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
    // { id: false },
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

// Chapter: Static methods
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    // Important: In static method this points to the model/method on the class not of the class.
    const stats = await this.aggregate([
        // Important: Returns a promise!
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: "$tour", // Note: Grouping all the matched/filtered reviews by the tour!
                nRating: { $sum: 1 },
                averageRating: { $avg: "$rating" }
            }
        }
    ]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].averageRating
    });
};

// Chapter: Document middleware
// reviewSchema.pre("save", function (next) { // Important: Don't use pre here because pre-save middlewares run before saving the document. So in aggregation we will not get the latest document that is creating/saving right now. Aggregation should be done after saving the document!
reviewSchema.post("save", function () {
    // Remark: This points to the current document (instance of the class) but we need the model because calcAverageRatings() is a static method that only available on the class itself. (the class itself). So what can we do?
    // Important: Accessing the model/class!
    this.constructor.calcAverageRatings(this.tour);

    // next(); Warning: Post middleware doesn't have access to next()
});

module.exports = mongoose.model("Review", reviewSchema);

// Point: Nested Route
// POST /tour/1234/reviews -> Create a new review for the tour id 1234 and the currently logged in user's id.
// GET /tour/1234/reviews -> Get all the reviews of the tour id 1234
// GET /tour/1234/reviews/1452 -> Get the review for the review id 1452 on the tour which's id is 1234.
