const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// POST /users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name) {
    return next(new BadRequestError());
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
        return next(new ConflictError());
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError());
      }
      next(new InternalServerError());
    });
};

/// GET /users/me
const getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format."));
      }
      next(err);
    });
};

// User login
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format."));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch(() => next(new UnauthorizedError("Incorrect email or password")));
};
// Update User
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return next(new BadRequestError());
  }

  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError();
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError());
      }
      next(err);
    });
};

module.exports = { createUser, getUser, login, updateUser };
