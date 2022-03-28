const User = require("../models/userModel");
const catchAsync = require("../lib/catchAsync");
const AppError = require("../lib/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // Point: Create error if user posts password data
    if (req.body.password || req.body.passwordConfirm)
        return next(
            new AppError("Updating password is not allowed here!"),
            400
        );

    // Point: Filtered out unwanted fields
    const filteredBody = filterObj(req.body, "name", "email");

    // Point: Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    ); // Important: Using findByIdAndUpdate here because if we use save() then it will trigger all the pre-save() middlewares. Where one of the pre-save() middleware requires passwordConfirm. But we don't want to pass any passwordConfirm here so to get rid of this situation we are using findByIdAndUpdate() so that the pre-save() middlewares won't be triggered!

    res.status(200).json({
        status: "success",
        data: { user: updatedUser }
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id; // Note: req.user is available via authController.protect() middleware!

    next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find();

//     res.status(200).json({
//         status: "success",
//         results: users.length,
//         data: { users }
//     });
// });

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not available. Please use /signup instead."
    });
};

// Warning: Don't try to update password with this!
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
