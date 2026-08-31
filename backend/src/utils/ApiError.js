// Class untuk membuat custom error dengan HTTP status code
export default class ApiError extends Error {
  // Constructor untuk membuat instance ApiError dengan statusCode, message, dan opsi
  constructor(statusCode, message, { includeSuccess = false } = {}) {
    super(message);

    // Status code HTTP (400, 401, 404, 500, dll)
    this.statusCode = statusCode;
    // Apakah response body menyertakan field "success: false"
    this.includeSuccess = includeSuccess;
    this.name = "ApiError";
  }

  // Factory method untuk error 400 Bad Request
  static badRequest(message, options = {}) {
    return new ApiError(400, message, options);
  }

  // Factory method untuk error 401 Unauthorized
  static unauthorized(message) {
    return new ApiError(401, message);
  }

  // Factory method untuk error 404 Not Found
  static notFound(message) {
    return new ApiError(404, message);
  }

  // Factory method untuk error 500 Internal Server Error
  static internal(message, options = {}) {
    return new ApiError(500, message, options);
  }

  // Mengubah error menjadi object response body untuk dikirim ke client
  toResponseBody() {
    // Jika includeSuccess true, sertakan field success: false
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
