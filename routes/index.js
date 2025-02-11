const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const {
  validateUserInfo,
  validateUserLogin,
} = require("../middlewares/validation"); //  Import validation
const NotFoundError = require("../utils/errors"); //  Import centralized error handling

//  Public routes (no authorization needed)
router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateUserLogin, login);

router.use("/items", clothingItemRouter); // GET /items does not require authorization

//  Protected routes (require valid token)
router.use("/users", userRouter);

//  Handle unknown routes using centralized error handling
router.use((req, res, next) => {
  next(new NotFoundError("The request was sent to a non-existent address."));
});

module.exports = router;
