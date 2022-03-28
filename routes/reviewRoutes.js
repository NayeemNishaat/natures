const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true }); // Remark: Because we want to get access to the id that exist in another router not in this router.

// POST /tours/125dsfd/reviews
// POST /reviews

router
    .route("/")
    .get(
        reviewController.getAllReviewsSecificTour,
        reviewController.getAllReviews
    )
    .post(
        authController.protect,
        authController.restrictTo("user"),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route("/:id")
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;
