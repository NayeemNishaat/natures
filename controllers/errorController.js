const AppError = require("../lib/appError");

const sendError = (req, res, err, env) => {
    // Chapter: Development Error
    if (env === "development") {
        // Key: API
        if (req.originalUrl.startsWith("/api")) {
            return res.status(err.statusCode).json({
                status: err.status,
                error: err,
                message: err.message,
                stack: err.stack
            });
        }

        // Key: Rendered Website
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message
        });
    }

    // Chapter: Production Error
    if (err.isOperational) {
        // Point: Operational error
        // Key: API
        if (req.originalUrl.startsWith("/api")) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        // Key: Rendered Website
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message
        });
    }

    // Point: Programming/unknown error
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later!"
    });
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) =>
    new AppError(
        `Duplicate field value: '${err.keyValue.name}' is not allowed.`,
        400
    );
// const value = err.errmsg.match(/(['"]).*\1/);

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((ob) => ob.message);

    const message = `Invalid input data. ${errors.join(". ")}`;

    return new AppError(message, 400);
};

// new AppError("Invalid token. Please log in again!", 401); // Remark: This will potentially create an error object add some properties to it and then retuns it.
const handleJWTError = () =>
    new AppError("Please log in to get access to this page!", 401); // Note: Changing the message to hide the actual error from the user!

const handleJWTExpiredError = () =>
    new AppError("Your token has expired! Please log in again.", 401);

module.exports = (err, req, res, _next) => {
    // Important: If all four parameters are defined, express will automatically know it's an error handeling middleware!
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error!";

    if (process.env.NODE_ENV === "development")
        sendError(req, res, err, "development");
    else {
        let error = { ...err };
        error.message = err.message; // Point: Don't know why message is not copied. So setting it manually!

        if (Object.prototype.hasOwnProperty.call(error, "messageFormat")) {
            error = handleCastErrorDB(error);
        }

        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error._message === "Tour validation failed") {
            error = handleValidationErrorDB(error);
        }

        if (error.name === "JsonWebTokenError") error = handleJWTError(); // Point: Saving the created error object into error.

        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendError(req, res, error, "production");
    }
};
