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

    // next(); Warning: Cannot do this because after sending response the req-res cycle ends here. So there is no point of calling next() that will throw cannot set headers after the response has been sent. But still defining next for the catchAsync function.
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user"
    });

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = catchAsync(async (req, res) => {
    res.status(200).render("login", {
        title: "Log into your account."
    });
});
