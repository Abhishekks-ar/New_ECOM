import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";

const PendingProducts = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/products/pending"
      );
      setPendingProducts(response.data);
    } catch (error) {
      console.error("Error fetching pending products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await axios.put(`http://localhost:3000/products/${productId}/approve`);
      setPendingProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error approving product:", error);
    }
  };

  const handleReject = async (productId) => {
    try {
      await axios.put(`http://localhost:3000/products/${productId}/reject`);
      setPendingProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error rejecting product:", error);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (pendingProducts.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No pending products found.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} padding={3}>
      {pendingProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">{product.description}</Typography>
              <Typography variant="subtitle2">
                Price: ₹{product.price}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="success"
                variant="contained"
                onClick={() => handleApprove(product._id)}
              >
                Approve
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => handleReject(product._id)}
              >
                Reject
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PendingProducts;
