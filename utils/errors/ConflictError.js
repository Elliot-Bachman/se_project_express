class ConflictError extends Error {
  constructor(message = "That email was already taken.") {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
