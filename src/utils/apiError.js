class ApiError extends Error {
    constructor(message = "Something went wrong", statusCode = 500, error = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.data = null;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
