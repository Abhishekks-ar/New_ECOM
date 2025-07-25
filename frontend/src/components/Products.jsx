import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  CardActionArea,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

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

const Products = () => {
  const [value, setValue] = useState(0);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false); // <-- added

  const selectedCategory = categories[value];
  const products = productsByCategory[selectedCategory] || [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://new-ecom-omega.vercel.app/products/by-category"
        );
        setProductsByCategory(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddToCart = async (product) => {
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user")); // ✅ get user
      const userId = user?.id;

      const res = await axios.post(
        "https://new-ecom-omega.vercel.app/user/cart/add",
        {
          userId,
          productId: product._id,
          quantity: 1, // default quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Added to cart:", res.data);
      setOpenSnackbar(true); // show toast
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err);
    }
  };

  return (
    <Box sx={{ mt: "64px", px: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Category Tabs"
        sx={{ bgcolor: "background.paper", mb: 2 }}
      >
        {categories.map((cat, index) => (
          <Tab key={index} label={cat} />
        ))}
      </Tabs>

      <Typography variant="h6" gutterBottom>
        {selectedCategory} Products
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card>
                  <CardActionArea
                    component={Link}
                    to={`/product/${product._id}`}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        product.images[0] || "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{product.price} | {product.discount}% OFF
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ pl: 2 }}>No products available.</Typography>
          )}
        </Grid>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Added to cart"
      />
    </Box>
  );
};

export default Products;
