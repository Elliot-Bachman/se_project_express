const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

// Public routes (no authorization needed)
router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", clothingItemRouter); // GET /items does not require authorization

// Protected routes (require valid token)
router.use("/users", userRouter);

// Add protected routes here if needed
// For example:
// router.get("/users", getUsers);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
