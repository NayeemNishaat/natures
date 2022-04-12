const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

// Point: Protect all routes after this middleware.
router.use(authController.protect); // Important: By using this middleware all the below middlewares will be protected because Remark: middlewares always runs in sequence!

router.patch("/update-password", authController.updatePassword);

router.get(
    "/me",
    userController.getMe,
    userController.getUser // Note: Pretty clever! Faking user id in the url by setting it with userController.getMe() middleware.
);
router.patch(
    "/update-me",
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
);
router.delete("/delete-me", userController.deleteMe);

router.use(authController.restrictTo("admin"));

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
