const router = require("express").Router();
const auth = require("../middlewares/auth"); // Import the authorization middleware

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// READ all items (public route, no authorization needed)
router.get("/", getItems);

// The following routes require authorization
router.post("/", auth, createItem); // CREATE an item
router.put("/:itemId/likes", auth, likeItem); // Like an item
router.delete("/:itemId", auth, deleteItem); // DELETE an item
router.delete("/:itemId/likes", auth, dislikeItem); // Remove like from an item

module.exports = router;
