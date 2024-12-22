const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

// Centralized error handler
const handleError = (err, res) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: "Validation failed." });
  }
  if (err.name === "CastError") {
    return res.status(400).send({ message: "Invalid ID format." });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({ message: "Document not found." });
  }
  return res.status(500).send({ message: "Internal server error." });
};

// Create a clothing item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user?._id;
  if (!owner) {
    console.error("Missing owner in request");
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Owner ID is missing from the request." });
  }

  if (!name || !weather || !imageUrl) {
    console.error("Validation failed:", req.body);
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Missing required fields: name, weather, imageUrl." });
  }

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log("Item created successfully:", item);
      return res.status(201).send({ data: item });
    })
    .catch((err) => handleError(err, res));
};

// Get all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => handleError(err, res));
};

// Update a clothing item
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => handleError(err, res));
};

// Delete a clothing item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then(() => res.status(204).send())
    .catch((err) => handleError(err, res));
};

// Like a clothing item
const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Error liking item:", err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found." });
      }

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format." });
      }

      return res.status(500).send({ message: "Internal server error." });
    });
};

// Dislike a clothing item
const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Error disliking item:", err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found." });
      }

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format." });
      }

      return res.status(500).send({ message: "Internal server error." });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
