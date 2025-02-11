const router = require("express").Router();
const auth = require("../middlewares/auth"); // Import the authorization middleware
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation"); // ✅ Import Celebrate validation
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

//  READ all items (public route, no authorization needed)
router.get("/", getItems);

//  CREATE an item (with validation)
router.post("/", auth, validateClothingItem, createItem);

//  Like an item (with validation)
router.put("/:itemId/likes", auth, validateId, likeItem);

//  DELETE an item (with validation)
router.delete("/:itemId", auth, validateId, deleteItem);

//  Remove like from an item (with validation)
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
