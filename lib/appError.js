class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Remark: Calling Error class's constructor that only accepts a message argument! We set the message property to parent so no need to set it in the child because we can access it from the parent!

        this.isOperational = true;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

        Error.captureStackTrace(this, this.constructor); // Note: this.constructor is the AppError class itself and passing it as a second argument will skip all the frames/calls above and including it from the call stack.
    }
}

module.exports = AppError;
