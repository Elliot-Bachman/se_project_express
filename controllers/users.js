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

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(201).send(userWithoutPassword); // ✅ Explicit return
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError());
      }
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Missing required fields: name, email, password")
        );
      }
      return next(new InternalServerError());
    });
};

// GET /users/me
const getUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.status(200).send(user)) // ✅ Fix applied (implicit return)
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format."));
      }
      return next(err);
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

  return User.findUserByCredentials(email, password)
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

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError()); // ✅ Added return
      }
      return res.status(200).send(updatedUser); // ✅ Added return
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Missing required fields: name, avatar")
        );
      }
      return next(err);
    });
};

module.exports = { createUser, getUser, login, updateUser };
