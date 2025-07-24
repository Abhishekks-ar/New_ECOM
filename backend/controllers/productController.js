const Product = require("../model/ProductsData");

// Fetch all approved products per category
const getAllApprovedProductsByCategory = async (req, res) => {
  try {
    const categories = [
      "Electronics",
      "Fashion",
      "Books",
      "Home & Kitchen",
      "Toys & Games",
      "Beauty & Personal Care",
      "Sports & Fitness",
      "Others",
    ];

    const result = {};

    for (let category of categories) {
      const products = await Product.find({ category, status: "approved" });
      result[category] = products;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get all products by a seller
const getAllProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await Product.find({ sellerId });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching seller's products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getTopProductsByCategory = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const topCategories = categories.slice(0, 3); // Pick any 3

    const results = await Promise.all(
      topCategories.map(async (cat) => {
        const products = await Product.find({ category: cat, status: 'approved' })
          .sort({ soldCount: -1 })
          .limit(4);
        return { category: cat, products };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top products", error: err });
  }
};

module.exports = { getTopProductsByCategory };

module.exports = {
  getAllApprovedProductsByCategory,
  getAllProductsBySeller,
};
