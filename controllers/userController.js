const User = require("../models/userModel");
const catchAsync = require("../lib/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: { users }
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({ status: "error", message: "Undefined route!" });
};

exports.createUser = (req, res) => {
    res.status(500).json({ status: "error", message: "Undefined route!" });
};

exports.updateUser = (req, res) => {
    res.status(500).json({ status: "error", message: "Undefined route!" });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({ status: "error", message: "Undefined route!" });
};
