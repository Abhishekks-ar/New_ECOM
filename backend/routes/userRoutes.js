const express = require("express");
const router = express.Router();
const User = require("../model/userData"); // adjust path as needed
const Product = require("../model/productsData"); // optional for validation


// GET /user/cart/:userId
// GET /user/cart/:userId
router.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ cart: user.cart }); // ✅ wrap it like this
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ POST: Add product to cart
router.post("/cart/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ message: "Item added to cart", cart: user.cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// DELETE /user/cart/remove
router.delete("/cart/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const initialLength = user.cart.length;

    // Filter out the product
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await user.save();
    res.json({ message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
});


router.delete("/cart/clear", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);  // ✅ Use User model
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = [];  // ✅ Clear cart
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
});



module.exports = router;
