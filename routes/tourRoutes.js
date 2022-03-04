const express = require("express");
// const {
//     getAllTours,
//     createTour,
//     getTour,
//     updateTour,
//     deleteTour
// } = require("../controllers/tourController");
const tourController = require("../controllers/tourController");

const router = express.Router();

// Part: Param Middleware
router.param(
    "id",
    tourController.checkId /* (req, res, next, val) => {
    console.log(`Tour Id is ${val}`);
    // Important: Must call next()
    next();
} */
);

// Test:

router
    .route("/")
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);
router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
