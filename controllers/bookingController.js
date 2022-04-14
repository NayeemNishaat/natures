const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const catchAsync = require("../lib/catchAsync");
const AppError = require("../lib/appError");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Point: Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // Point: Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get("host")}/`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        // Important: This client_reference_id field will allow us to pass some data about the session that we are currently creating. After the purchase was successful we will get accesss to this session object again and we can use it to create a new booking.
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `https://www.natours.dev/img/tours/${tour.imageCover}`
                ], // Remark: Must be hosted images
                amount: tour.price * 100,
                currency: "usd",
                quantity: 1
            }
        ]
    });

    // Point: Send the session to the client
    res.status(200).json({
        status: "success",
        session
    });
});
