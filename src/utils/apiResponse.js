class ApiResponse {
    constructor(message, data, statusCode) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = statusCode
    }
}

export { ApiResponse }