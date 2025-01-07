const router = require("express").Router();
const { getUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Apply auth middleware to all routes in this router
router.use(auth);

// Define user routes
router.get("/me", getUser);
router.patch("/me", updateUser);

module.exports = router;
