const Review = require("../models/reviewModel");
const catchAsync = require("../lib/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: { reviews }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    // Remark: Allowing nested routes
    if (!req.body.tour) req.body.tour = req.params.id;

    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    // Point: Way to deselect a field during document creation.
    newReview.__v = undefined;
    newReview.createdAt = undefined;

    res.status(201).json({
        status: "success",
        data: {
            review: newReview
        }
    });
});
