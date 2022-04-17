const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../lib/catchAsync");
const AppError = require("../lib/appError");

exports.alerts = (req, res, next) => {
    const { alert } = req.query;

    if (alert === "booking")
        res.locals.alert =
            "Your booking was successful! Please check your email for confirmation. If your booking doesn't show up immediately, please try again later.";

    next();
};

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

    if (!tour) return next(new AppError("No tour found!", 404));

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

exports.getsignupForm = catchAsync(async (req, res) => {
    res.status(200).render("signup", {
        title: "Create an account"
    });
});

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your account"
    });
};

// Important: Could be implemnted via "Virtual Populate"
exports.getMyBookings = catchAsync(async (req, res, next) => {
    // Point: Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // Point: Find tours with the tour IDs that are available in the bookings
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } }); // Remark: $in is a great operator for finding elements of an array from DB.

    res.status(200).render("overview", {
        title: "Your Bookings",
        tours
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        { new: true, runValidators: true }
    );

    res.status(200).render("account", {
        title: "Your account.",
        user: updatedUser
    });
});

exports.getActivated = catchAsync(async (req, res) => {
    return res.status(200).render("activated", {
        title: "Account Activation"
    });
});

exports.getReviews = (req, res) => {
    return res.status(200).render("reviews", { title: "Your Reviews" });
};
