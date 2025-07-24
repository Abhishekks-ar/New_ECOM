// const express = require('express');
// const router = express.Router();
// const Product = require('../model/ProductsData');

// //  Get all pending products
// router.get('/pending', async (req, res) => {
//   try {
//     const pendingProducts = await Product.find({ status: 'pending' });
//     res.json(pendingProducts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //  Approve product
// router.put('/:id/approve', async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { status: 'approved' },
//       { new: true }
//     );
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.status(200).json({ message: 'Product approved', product });
//   } catch (error) {
//     res.status(500).json({ message: 'Error approving product', error });
//   }
// });

// //  Reject product
// router.put('/:id/reject', async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { status: 'rejected' },
//       { new: true }
//     );
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.status(200).json({ message: 'Product rejected', product });
//   } catch (error) {
//     res.status(500).json({ message: 'Error rejecting product', error });
//   }
// });

// // Get all products (any status)
// // GET /products/seller/:sellerId
// router.get("/seller-all/:sellerId", async (req, res) => {
//   try {
//     const products = await Product.find({ seller: req.params.sellerId });
//     res.status(200).json({ products });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch seller products" });
//   }
// });


// const {
//   getAllApprovedProductsByCategory,
//   getAllProductsBySeller,
// } = require("../controllers/productController");

// router.get("/by-category", getAllApprovedProductsByCategory);
// router.get("/seller-all/:sellerId", getAllProductsBySeller);

// // All other routes here...

// // ⚠️ Add this at the bottom
// router.get('/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching product', error });
//   }
// });


// module.exports = router;



const express = require('express');
const router = express.Router();
const Product = require('../model/ProductsData');

const {
  getAllApprovedProductsByCategory,
  getAllProductsBySeller
} = require("../controllers/productController");

// GET pending products
router.get('/pending', async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: 'pending' });
    res.json(pendingProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve product
router.put('/:id/approve', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product approved', product });
  } catch (error) {
    res.status(500).json({ message: 'Error approving product', error });
  }
});

// Reject product
router.put('/:id/reject', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product rejected', product });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting product', error });
  }
});

// GET all products by category
router.get("/by-category", getAllApprovedProductsByCategory);

// GET all products by seller
router.get("/seller-all/:sellerId", getAllProductsBySeller);

// GET single product by ID (MUST be last to avoid conflicts)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// 

// /products/top-by-category

// GET top 4 products from any 3 categories (approved only)
router.get("/by-category", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { status: "approved" });
    const selectedCategories = categories.slice(0, 3); // pick any 3

    const result = {};

    for (const category of selectedCategories) {
      const products = await Product.find({ category, status: "approved" })
        .sort({ totalSold: -1 }) // most sold first
        .limit(4);
      result[category] = products;
    }

    res.json(result);
  } catch (err) {
    console.error("Error in /by-category:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
