const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res
    .status(500)
    .send({ message: "An unexpected error occurred on the server." });
};

module.exports = errorHandler;
