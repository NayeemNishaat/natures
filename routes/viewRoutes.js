const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
// const bookingController = require("../controllers/bookingController");

const router = express.Router();

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

router.post(
    "/submit-user-data",
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;
