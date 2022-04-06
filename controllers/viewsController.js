const Tour = require("../models/tourModel");
const catchAsync = require("../lib/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
    // Point: Get tour data from collection
    const tours = await Tour.find();
    // Point: Build template
    // Point: Render the template using tour data

    res.status(200).render("overview", {
        title: "All Tours",
        tours
    });

    next();
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user"
    });

    res.status(200).render("tour", {
        tour
    });

    next();
});
