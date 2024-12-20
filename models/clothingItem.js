const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
  },
});

module.export = mongoose.model("item", clothingItemSchema);
