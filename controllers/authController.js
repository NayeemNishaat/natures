const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../lib/catchAsync");
const AppError = require("../lib/appError");

// Segment: Generate Token
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

// Chapter: SignUp
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({ status: "success", token, data: { user: newUser } });
});

// Chapter: LogIn
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Part: Check if email and password exist.
    if (!email || !password)
        return next(new AppError("Please provide email and password.", 400));

    // Part: Check if user exist && password is correct.
    const user = await User.findOne({ email }).select("+password");
    // Note: Here user is a document of User collection.

    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError("Incorrect email or password.", 401));

    // Part: If everything is ok send the token to the client!
    const token = signToken(user._id);

    res.status(200).json({ status: "success", token });
});

// Chapter: Route Protection
exports.protect = catchAsync(async (req, res, next) => {
    // Part: Check if the token exists
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in!"), 401);
    }

    // Part: Verify the token

    // Part: Check if the user still exist

    // Part: Check if the user changed the password after the token was issued

    next();
});
