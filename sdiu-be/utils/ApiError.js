class ApiError {
    constructor(statusCode, message) {
      this.message = message;
      this.statusCode = statusCode;
    }
  }
  module.exports = ApiError;