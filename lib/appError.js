class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Remark: Calling Error class's constructor that only accepts a message argument! We set the message property to parent so no need to set it in the child because we can access it from the parent!

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor); // Note: this.constructor is the AppError class itself!
    }
}

module.exports = AppError;
