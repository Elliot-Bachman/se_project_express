const router = require("express").Router();
const { getUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation"); // ✅ Import validation

// ✅ Apply auth middleware to all routes in this router
router.use(auth);

// ✅ Define user routes
router.get("/me", getUser);

// ✅ Validate `name` and `avatar` in PATCH /me
router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;
