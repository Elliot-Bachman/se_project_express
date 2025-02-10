const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Check for missing required fields
  if (!email || !password || !name) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Error in createUser:", err);
      if (err.code === 11000) {
        return res
          .status(ERROR_CODES.USED_EMAIL)
          .send({ message: ERROR_MESSAGES.USED_EMAIL });
      }
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// GET /users/me
const getUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }

      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// User login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch(() => {
      // Instead of checking the message, we directly send a 401 error
      return res
        .status(ERROR_CODES.BAD_AUTHORIZATION)
        .send({ message: "Incorrect email or password" });
    });
};

// Update User
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

module.exports = { createUser, getUser, login, updateUser };
