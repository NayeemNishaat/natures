const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

// Note: Not using a helper function for nested route support. Rather putting the logic inside getAll(), but using now!
exports.getAllReviewsSpecificTour = (req, res, next) => {
    let fltr = {};
    if (req.params.id) fltr = { tour: req.params.id };

    req.fltr = fltr;

    next();
};

exports.getAllReviews = factory.getAll(Review); // Important: Note: Express only calls first callback with (req, res, next). If we want this in 2nd level we need to call the 1st function() then declare the inner function. Then express will call the inner function as callback function. Btw in this way we can pass parameters to the callback function!

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.id) filter = { tour: req.params.id };

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: "success",
//         results: reviews.length,
//         data: { reviews }
//     });
// });

exports.getReview = factory.getOne(Review);

// exports.getReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findById(req.params.id);

//     res.status(200).json({
//         status: "success",
//         data: review
//     });
// });

exports.setTourUserIds = (req, res, next) => {
    // Remark: Allowing nested routes
    if (!req.body.tour) req.body.tour = req.params.id;

    if (!req.body.user) req.body.user = req.user.id;

    next();
};

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//     const newReview = await Review.create(req.body);
//     // Remark: Allowing nested routes
//     if (!req.body.tour) req.body.tour = req.params.id;

//     if (!req.body.user) req.body.user = req.user.id;

//     // Point: Way to deselect a field during document creation.
//     newReview.__v = undefined;
//     newReview.createdAt = undefined;

//     res.status(201).json({
//         status: "success",
//         data: {
//             review: newReview
//         }
//     });
// });

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
