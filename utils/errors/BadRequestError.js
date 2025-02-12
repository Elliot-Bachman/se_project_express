class BadRequestError extends Error {
  constructor(message = "Bad request in data or syntax.") {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;