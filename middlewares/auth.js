const jwt = require("jsonwebtoken");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config"); // Use the shared config file for the secret

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the Authorization header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.BAD_AUTHORIZATION)
      .send({ message: ERROR_MESSAGES.BAD_AUTHORIZATION });
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    console.log("Auth middleware set req.user:", req.user); // Debug log
    return next();
  } catch (err) {
    console.error("Invalid token:", err.message); // Log token verification errors
    return res
      .status(ERROR_CODES.BAD_AUTHORIZATION)
      .send({ message: "Invalid token" });
  }
};
