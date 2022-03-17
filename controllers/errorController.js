module.exports = (err, req, res, next) => {
    // Important: If all four parameters are defined, express will automatically know it's an error handeling middleware!
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error!";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
