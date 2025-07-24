import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";

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

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse numeric fields and trim text fields
    const cleanedProduct = {
      ...product,
      name: product.name.trim(),
      description: product.description.trim(),
      category: product.category,
      price: parseFloat(product.price),
      discount: product.discount ? parseFloat(product.discount) : 0,
      stock: parseInt(product.stock),
      image1: product.image1.trim(),
      image2: product.image2.trim(),
      image3: product.image3.trim(),
      image4: product.image4.trim(),
    };

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/seller/add-product",
        cleanedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "Product added successfully!");

      // Reset the form
      setProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        discount: "",
        stock: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 2 }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Add New Product
        </Typography>

        {message && (
          <Alert
            severity={
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("added")
                ? "success"
                : "error"
            }
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              select
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
              fullWidth
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box mb={2}>
            <TextField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Price (₹)"
              name="price"
              value={product.price}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Discount (%)"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0, max: 100 }}
              fullWidth
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Stock Quantity"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Image URL 1 (Required)"
              name="image1"
              value={product.image1}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Image URL 2 (Optional)"
              name="image2"
              value={product.image2}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Image URL 3 (Optional)"
              name="image3"
              value={product.image3}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box mb={3}>
            <TextField
              label="Image URL 4 (Optional)"
              name="image4"
              value={product.image4}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit for Review
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProduct;
