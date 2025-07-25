import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://new-ecom-1220kqevl-abhishek-k-s-s-projects.vercel.app/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user?.id) return alert("Please login first");

    try {
      await axios.post("https://new-ecom-1220kqevl-abhishek-k-s-s-projects.vercel.app/user/cart/add", {
        userId: user.id,
        productId: product._id,
        quantity: 1,
      });
      alert("Product added to cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Box>
    );
  }

  const priceAfterDiscount = product.price - (product.price * product.discount) / 100;
  // const averageRating =
  //   product.ratings.length > 0
  //     ? product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length
  //     : 0;

  return (
    <Box sx={{ mt: "80px", px: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <Carousel autoPlay infiniteLoop showThumbs={false}>
              {product.images.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img}
                    alt={`product-${idx}`}
                    style={{ height: 400, objectFit: "contain" }}
                  />
                </div>
              ))}
            </Carousel>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            {/* <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Rating value={averageRating} readOnly precision={0.5} />
              <Typography variant="body2">
                ({product.ratings.length} review{product.ratings.length !== 1 && "s"})
              </Typography>
            </Box> */}

            <Typography variant="h6" gutterBottom>
              <span style={{ fontWeight: 600 }}>₹{priceAfterDiscount.toFixed(2)}</span>{" "}
              {product.discount > 0 && (
                <>
                  &nbsp; <s>₹{product.price}</s>{" "}
                  <span style={{ color: "green" }}>({product.discount}% OFF)</span>
                </>
              )}
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {product.description || "No description available."}
            </Typography>

            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
