const express = require("express");
const authController = require("../controllers/authController");
const tourController = require("../controllers/tourController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// Part: Param Middleware
// router.param(
//     "id",
//     tourController.checkId (req, res, next, val) => {
//     console.log(`Tour Id is ${val}`);
//     // Important: Must call next()
//     next();
// }
// );
// End|

// Note: Redirecting to review router!
router.use("/:id/reviews", reviewRouter); // Important: A major problem in this approach is we don't have access to the query params (id) to the reviewRouter middleware. So we have to us merge-params to solve this problem.

router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
    .route("/monthly-plan/:year")
    .get(
        authController.protect,
        authController.restrictTo("admin", "lead-guide", "guide"),
        tourController.getMonthlyPlan
    );

// Point: Standard way to specify url rather than using query string
router
    .route("/tours-within/:distance/canter/:latlng/unit/:unit")
    .get(tourController.getToursWithin);
// tours-within/233/center/-40,45/unit/mi

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
    .route("/")
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.createTour
    );
// .post(tourController.checkBody, tourController.createTour);
router
    .route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin ", "lead-guide"),
        tourController.deleteTour
    );

module.exports = router;
