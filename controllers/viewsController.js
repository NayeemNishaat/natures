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
});

exports.getTour = (req, res) => {
    res.status(200).render("tour", {
        title: "The Forest Hiker Tour"
    });
};
