const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  images: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length >= 1; // At least one image required
      },
      message: "At least one image URL is required.",
    },
  },

  category: {
    type: String,
    required: true,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  totalSold: {
    type: Number,
    default: 0,
  },

  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

