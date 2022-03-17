const AppError = require("../lib/appError");

const sendError = (res, err, env) => {
    if (env === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });

        console.error("ERROR:", err);
    } else if (err.isOperational) {
        // Point: Operational error
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Point: Programming/unknown error
        res.status(500).json({
            status: "error",
            message: "Something went wrong!"
        });
    }
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

module.exports = (err, _req, res, _next) => {
    // Important: If all four parameters are defined, express will automatically know it's an error handeling middleware!
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error!";

    if (process.env.NODE_ENV === "development")
        sendError(res, err, "development");
    else {
        let error = { ...err };

        if (Object.prototype.hasOwnProperty.call(error, "messageFormat")) {
            error = handleCastErrorDB(error);
        }

        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error._message === "Tour validation failed") {
            error = handleValidationErrorDB(error);
        }

        sendError(res, error, "production");
    }
};
