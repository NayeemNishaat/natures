const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../lib/catchAsync");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Point: Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // Point: Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // Warning: Temporary insecure solution best solution would be using stripe web-hook which is only available in production mode.
        // success_url: `${req.protocol}://${req.get("host")}/my-bookings?tour=${
        //     req.params.tourId
        // }&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get("host")}/my-bookings`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        // Important: This client_reference_id field will allow us to pass some data about the session that we are currently creating. After the purchase was successful we will get accesss to this session object again and we can use it to create a new booking.
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `${req.protocol}://${req.get("host")}/img/tours/${
                        tour.imageCover
                    }`
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

// Warning: Temporary insecure solution
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//     const { tour, user, price } = req.query;

//     if (!tour && !user && !price) return next();

//     await Booking.create({ tour, user, price });

//     // Important: Here we will not call next() because then the query string we specified in the getCheckoutSession() middleware will be exposed to the client which is very dangerous. Point: So to prevent this we will use redirect.

//     res.redirect(req.originalUrl.split("?")[0]);
//     // Note: Now this will hit the base url without the query string. So without query string then the upper if condition (if (!tour && !user && !price) return next();) will be fulfilled and then the next() middleware is called which in turn will render overview page.
// });

const createBooking = async (session) => {
    const tour = session.client_reference_id;
    const user = await User.findOne({
        email: session.customer_email
    }).select("_id");
    const price = session.object.amount_total / 100;
    console.log(`😍😍😍 ${tour} ${user} ${price}`);
    // await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") createBooking(event.data);
    res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
