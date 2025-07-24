import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const SellerAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const sellerId = sessionStorage.getItem("sellerId");
  console.log("Seller ID:", sellerId);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/products/seller-all/${sellerId}`
          
        );
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching all seller products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId && token) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [sellerId, token]);

  if (!token) {
    return (
      <Box mt={10} textAlign="center">
        <Typography color="error">Seller not logged in</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: "80px", px: 3 }}>
      <Typography variant="h5" gutterBottom>
        All Your Products 
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">₹{product.price}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Total Sold: <strong>{product.totalSold}</strong>
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label={product.status}
                      color={
                        product.status === "approved"
                          ? "success"
                          : product.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SellerAllProducts;
