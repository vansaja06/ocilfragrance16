export default class ApiError extends Error {
  constructor(statusCode, message, { includeSuccess = false } = {}) {
    super(message);

    this.statusCode = statusCode;
    this.includeSuccess = includeSuccess;
    this.name = "ApiError";
  }

  static badRequest(message, options = {}) {
    return new ApiError(400, message, options);
  }

  static unauthorized(message) {
    return new ApiError(401, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static internal(message, options = {}) {
    return new ApiError(500, message, options);
  }

  toResponseBody() {
    if (this.includeSuccess) {
      return {
        success: false,
        message: this.message,
      };
    }

    return {
      message: this.message,
    };
  }
}
