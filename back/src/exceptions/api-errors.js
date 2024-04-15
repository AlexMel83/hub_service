module.exports = class ApiError extends Error {
  status;
  errors;

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      errors: this.errors,
    };
  }

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Користувач не авторизован");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static NotFoundError(resource) {
    return new ApiError(404, `${resource} was not found`);
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }

  static AccessDeniedForRole(detail) {
    return new ApiError(403, `Access denied: ${detail}`);
  }

  static IntServError(detail) {
    return new ApiError(500, `Internal server error: ${detail}`);
  }
};
