const ERROR_CODES = {
  BAD_REQUEST: 400, // Invalid data passed
  NOT_FOUND: 404, // Resource not found
  SERVER_ERROR: 500, // Default server error
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request in data or syntax.",
  NOT_FOUND: "Page resources not found.",
  SERVER_ERROR: "Internal Server error.",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
