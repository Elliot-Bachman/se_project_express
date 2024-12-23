const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CREATE an item
router.post("/", createItem);

// READ all items
router.get("/", getItems);

// Like items
router.put("/:itemId/likes", likeItem);

// DELETE an item
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
