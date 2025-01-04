const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const JWT_SECRET = require("../utils/config");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.MISSING_FIELDS });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
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

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
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

  // Validate email and password presence
  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format." }); // You can add this message to ERROR_MESSAGES if you'd like
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      // Return appropriate message for invalid credentials
      if (err.message === "Incorrect email or password") {
        return res
          .status(ERROR_CODES.BAD_AUTHORIZATION)
          .send({ message: ERROR_MESSAGES.BAD_AUTHORIZATION });
      }

      // Handle other unexpected errors
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// Update User

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  // Ensure required fields are provided
  if (!name || !avatar) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  // Use the user ID from the request object (set by the auth middleware)
  const userId = req.user._id;

  // Update user and enable validators
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // `new` returns updated document; `runValidators` ensures validation
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

module.exports = { getUsers, createUser, getUser, login, updateUser };
