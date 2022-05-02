const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:tourId", bookingController.getCheckoutSession);

router.use(authController.restrictTo("admin", "lead-guide"));

router
    .route("/")
    .get(bookingController.getAllBooking)
    .post(bookingController.getUserAndTour, bookingController.createBooking);

router
    .route("/:id")
    .get(bookingController.getBooking)
    .patch(bookingController.getUserAndTour, bookingController.updateBooking);

router.route("/delete").delete(bookingController.deleteBooking);

module.exports = router;
