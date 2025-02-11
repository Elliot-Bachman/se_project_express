const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config"); // Use shared config file for the secret

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required."));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    console.log("Auth middleware set req.user:", req.user); // Debug log
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    next(new UnauthorizedError("Invalid token."));
  }
};
