const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../lib/catchAsync");
const AppError = require("../lib/appError");
const sendEmail = require("../lib/email");

// Segment: Generate Token
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 84600000
        ),
        httpOnly: true // Remark: To prevent css!
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    // Note: Remove password from the output.
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        // token,
        data: { user: user }
    });
};

// Chapter: SignUp
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    //  Important: Password select is false but we still get it in the response because when creating a document select false doesn't work!

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
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
    } else token = req.headers.cookie.split("=")[1];

    if (!token) {
        return next(new AppError("You are not logged in!"), 401);
    }

    // Part: Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Important: Note: Here jwt.verify could throw two types of errors. So, we are handling the errors in the global errorController.

    // Part: Check if the user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
        return next(
            new AppError(
                "The user belonging to this token does no longer exist."
            ),
            401
        );

    // Part: Check if the user changed the password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                "You have changed password recently. Please log in again!"
            ),
            401
        );
    }

    req.user = currentUser;
    next(); // Note: Grant access to the protected route.
});

exports.restrictTo =
    (...roles) =>
    // Important: We can not directly pass arguments to the middleware function. So we are creating a wrapper function.
    (req, res, next) => {
        // Note: Because of closure this function can access roles array!
        if (!roles.includes(req.user.role))
            return next(
                new AppError(
                    "You don't have permission to perform this action.",
                    403
                )
            );

        next();
    };

// Chapter: Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Part: Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user)
        return next(
            new AppError("There is no user with that email address."),
            404
        );

    // Part: Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // Important: Point: Modified data in instance method and saving here now. For saving we have a validator to check if email and password are given. But we dont send those here. So, stopping validation, hence the document will contain the previous info.

    // Part: Send it to the user email.
    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    // Important: We need to do more than simply sending errors to the client. Hence, using try/catch block.

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset link! (Valid for 10m.)",
            message
        });

        res.status(200).json({
            status: "success",
            message: "Token sent to email successfully!"
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                "There was an error sending the email. Try again later!"
            ),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Point: Get user based on the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    }).select("+password");

    // Point: If token is not expired, and there is a user, set the new password.
    if (!user)
        return next(new AppError("Token is invalid or has expired!"), 400);

    if (await user.correctPassword(req.body.password, user.password))
        return next(new AppError("Please choose a new password!"), 400);

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // console.log(user);
    // {
    // 	_id: new ObjectId("6238a13ef888c1599beda2c8"),
    // 	name: 'nayeem',
    // 	email: 'nayeem@next.com',
    // 	role: 'user',
    // 	__v: 0,
    // 	passwordChangedAt: 2022-03-21T19:44:03.816Z
    //   }

    await user.save(); //Important: Point: Here we are running the validation and mongoose will only run validation for password and passwordConfirm because we are setting/changing these above. Other properties remain same as before so, they are already valid.

    // Point: Update changedPasswordAt property for the curent user.
    // Changed it in the pre save() middleware.
    // Point: Log the user in, send JWT
    createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Point: Get user from DB
    const user = await User.findById(req.user.id).select("+password");

    // Point: Check if the posted password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
        return next(new AppError("Invalid current password!"), 401);
    // Point: If correct then update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save(); // Important: Always use save() never try to use findByIdAndUpdate() because that will not trigger pre-save() middlewares and validators!
    // Point: Log user in, send JWT
    createSendToken(user, 201, res);
});
