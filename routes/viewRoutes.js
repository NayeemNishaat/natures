const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
// const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(viewsController.alerts);

router.get(
    "/activate/:id/:otp",
    authController.activate,
    viewsController.getActivated
);

router.get(
    "/",
    authController.isLoggedIn,
    // bookingController.createBookingCheckout,
    viewsController.getOverview
);

router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getsignupForm);
router.get("/me", authController.protect, viewsController.getAccount);
router.get(
    "/my-bookings",
    authController.protect,
    viewsController.getMyBookings
);
router.get("/reviews", authController.protect, viewsController.getReviews);
router.get(
    "/provide-review",
    authController.protect,
    viewsController.getReviewForm
);

router.post(
    "/submit-user-data",
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;
