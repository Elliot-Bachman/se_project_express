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

  // Ensure the owner is attached to the item
  const owner = req.user?._id; // Safely access _id
  if (!owner) {
    console.error("Missing owner in request");
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Owner ID is missing from the request." });
  }

  // Validate input fields
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

// Other functions remain unchanged
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => handleError(err, res));
};

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

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => handleError(err, res));
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => handleError(err, res));
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
