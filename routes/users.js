const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// Apply auth middleware to all routes in this router
router.use(auth);

// Define user routes
router.get("/me", getUser);
router.get("/:userId", getUsers);
router.post("/", createUser); // Likely no longer needed if you handle signup elsewhere
router.patch("/me", updateUser);

module.exports = router;
