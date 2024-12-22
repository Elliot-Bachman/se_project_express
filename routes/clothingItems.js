const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CREATE an item
router.post("/", createItem);

// READ all items
router.get("/", getItems);

// UPDATE an item
router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);

// DELETE an item
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
