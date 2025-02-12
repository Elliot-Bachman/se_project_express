class NotFoundError extends Error {
  constructor(message = "The request was sent to a non-existent address.") {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
