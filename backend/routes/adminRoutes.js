// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../model/ProductsData");
const authenticateAdmin = require("../middleware/authmiddleware");

// GET pending products
router.get("/pending-products", authenticateAdmin, async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending products" });
  }
});

// APPROVE a product
router.put("/approve/:id", authenticateAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Product approved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error approving product" });
  }
});

// REJECT a product
router.put("/reject/:id", authenticateAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Product rejected successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting product" });
  }
});

module.exports = router;
