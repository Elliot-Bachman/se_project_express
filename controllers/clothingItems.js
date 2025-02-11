const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

// Create a clothing item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user?._id;

  if (!owner) {
    return next(new BadRequestError("Owner ID is missing from the request."));
  }
  if (!name || !weather || !imageUrl) {
    return next(
      new BadRequestError("Missing required fields: name, weather, imageUrl.")
    );
  }

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => next(new InternalServerError()));
};

// Get all clothing items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => next(new InternalServerError()));
};

// Delete a clothing item
const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError();
    });

    if (item.owner.toString() !== userId) {
      throw new ForbiddenError();
    }

    await item.deleteOne();
    res.status(200).send({ message: "Item deleted successfully." });
  } catch (err) {
    next(err);
  }
};

// Like a clothing item
const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format."));
      }
      next(err);
    });
};

// Dislike a clothing item
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format."));
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
