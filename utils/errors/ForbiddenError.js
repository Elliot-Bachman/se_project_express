class ForbiddenError extends Error {
  constructor(message = "You are not allowed to delete this item.") {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
