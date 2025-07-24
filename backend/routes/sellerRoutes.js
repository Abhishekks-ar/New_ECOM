const express = require("express");
const router = express.Router();
const Product = require("../model/ProductsData");
const { authenticate } = require("../controllers/authController");

// POST /seller/add-product
router.post("/add-product", authenticate, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discount,
      stock,
      image1,
      image2,
      image3,
      image4,
    } = req.body;

    // Basic validation
    if (!name || !description || !category || !price || !stock || !image1) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const images = [image1, image2, image3, image4].filter(Boolean); // Remove empty/null entries

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      discount,
      stock,
      images,
      seller: req.user.id, // Comes from the JWT token
      status: "pending", // Default
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product submitted for review", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
