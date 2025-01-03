const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { createUser, login } = require("../controllers/users"); // Import controllers
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

// Route handlers
router.use("/users", userRouter);
router.use("/items", clothingItem);

//  Signup and signin routes
router.post("/signup", createUser);
router.post("/signin", login); // Placeholder for now

// Middleware for handling unknown routes
router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
