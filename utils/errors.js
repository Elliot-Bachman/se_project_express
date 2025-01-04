const ERROR_CODES = {
  BAD_REQUEST: 400, // Invalid data passed
  BAD_AUTHORIZATION: 401, // Incorrect authorization
  BAD_CARD_REMOVAL: 403, // User is trying remove another users card
  NOT_FOUND: 404, // Resource not found
  USED_EMAIL: 409, // User entered an email that already exsists
  SERVER_ERROR: 500, // Default server error
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request in data or syntax.",
  BAD_AUTHORIZATION: "Authorization required.",
  BAD_CARD_REMOVAL: "You are not allowed to delete this item.",
  NOT_FOUND: "The request was sent to a non-existent address.",
  USED_EMAIL: "That email was already taken.",
  SERVER_ERROR: "An error has occurred on the server.",
  INVALID_ID_FORMAT: "Invalid ID format.",
  MISSING_OWNER: "Owner ID is missing from the request.",
  MISSING_FIELDS: "Missing required fields: name, weather, imageUrl.",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
