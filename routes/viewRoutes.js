const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
// const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(viewsController.alerts);
router.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0"
    );

    next();
});

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
    "/:tourId/provide-review",
    authController.protect,
    viewsController.getReviewForm
);
router.get("/billing", authController.protect, viewsController.getBilling);
router.get(
    "/manage-tours",
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    viewsController.getManageTours
);
router.get(
    "/manage-users",
    authController.protect,
    authController.restrictTo("admin"),
    viewsController.getManageUsers
);
router.get(
    "/create-tour",
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    viewsController.getCreateTour
);
router.get(
    "/update-tour/:tourId",
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    viewsController.getUpdateTour
);

router.post(
    "/submit-user-data",
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;

// router.use(authController.protect);
// router.use(authController.restrictTo("admin", "lead-guide"));
// Important: Warning: Remark: Point: Never try to use router.use(middleware) inside public root ("/") route. Because for each of the browser's request this whole file will be executed at first because it's mounted on "/" and all the routes starts with "/" so if we assign a router.use(middleware) like above then it will be set for all the requests and for all routes and even worse for all the other middlewares that comes after middleware. Note: All the api middlewares come after this file. So never do like this. Instead use this way:
// router.get("/me", authController.protect, viewsController.getAccount);
