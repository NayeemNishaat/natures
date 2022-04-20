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

router.use(authController.protect);

router.get("/me", viewsController.getAccount);
router.get("/my-bookings", viewsController.getMyBookings);
router.get("/reviews", viewsController.getReviews);
router.get("/:tourId/provide-review", viewsController.getReviewForm);
router.get("/billing", viewsController.getBilling);
router.post("/submit-user-data", viewsController.updateUserData);

router.use(authController.restrictTo("admin", "lead-guide"));

router.get("/manage-tours", viewsController.getManageTours);
router.get("/create-tour", viewsController.getCreateTour);

module.exports = router;
