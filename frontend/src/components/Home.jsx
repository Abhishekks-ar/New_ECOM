import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Carousel images
const carouselImages = [
  "https://t4.ftcdn.net/jpg/02/49/50/15/360_F_249501541_XmWdfAfUbWAvGxBwAM0ba2aYT36ntlpH.jpg",
  "https://static.vecteezy.com/system/resources/previews/002/006/774/non_2x/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-backgroud-for-banner-market-ecommerce-free-vector.jpg",
  "https://previews.123rf.com/images/stickerside/stickerside2201/stickerside220100008/179906969-discount-banner-with-half-price-reduction-and-wholesale-sale-website-header-for-online-promotion.jpg",
];

const Home = () => {
  const [categoryProducts, setCategoryProducts] = useState({});
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch top products by category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/products/by-category"
        );
        setCategoryProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products by category:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Carousel image changer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: "80px", textAlign: "center" }}>
        <Typography variant="h6">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: "64px", px: 2 }}>
      {/* Carousel */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          height: {
            xs: "auto", // Original size on mobile
            sm: 300, // Fixed height on tablets and up
          },
        }}
      >
        <img
          src={carouselImages[currentImage]}
          alt={`carousel-${currentImage}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Paper>

      {/* Shop by Category */}
      <Typography variant="h5" gutterBottom>
        Top Picks by Category
      </Typography>

      {Object.entries(categoryProducts).map(([category, products]) =>
        Array.isArray(products) && products.length > 0 ? (
          <Paper key={category} elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {category}
            </Typography>

            <Box sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
              {products.map((product) => {
                const discountedPrice = (
                  product.price *
                  (1 - product.discount / 100)
                ).toFixed(0);

                return (
                  <Card key={product._id} sx={{ minWidth: 200 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        product.images?.[0] || "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{discountedPrice}{" "}
                        {product.discount > 0 && (
                          <del style={{ marginLeft: "8px", color: "gray" }}>
                            ₹{product.price}
                          </del>
                        )}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          </Paper>
        ) : null
      )}
    </Box>
  );
};

export default Home;
