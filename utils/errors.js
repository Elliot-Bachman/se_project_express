class BadRequestError extends Error {
  constructor(message = "Bad request in data or syntax.") {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Authorization required.") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "You are not allowed to delete this item.") {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = "The request was sent to a non-existent address.") {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message = "That email was already taken.") {
    super(message);
    this.statusCode = 409;
  }
}

class InternalServerError extends Error {
  constructor(message = "An error has occurred on the server.") {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
