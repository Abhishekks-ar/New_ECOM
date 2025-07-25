import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get userId from sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user?.id) {
      setUserId(user.id);
    } else {
      console.error("User not found in sessionStorage");
    }
  }, []);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `https://new-ecom-1220kqevl-abhishek-k-s-s-projects.vercel.app/user/cart/${userId}`
        );
        console.log("Cart response:", res.data.cart);
        setCartItems(res.data.cart || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Remove item from cart
  const handleRemove = async (productId) => {
    try {
      await axios.delete("https://new-ecom-1220kqevl-abhishek-k-s-s-projects.vercel.app/user/cart/remove", {
        data: { userId, productId },
      });
      setCartItems((prev) =>
        prev.filter((item) => item.product?._id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => {
    const product = item.product;
    if (!product) return acc;
    const priceAfterDiscount =
      product.price - (product.price * product.discount) / 100;
    return acc + item.quantity * priceAfterDiscount;
  }, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {cartItems.map(({ product, quantity, _id }) =>
            product ? (
              <Card key={_id} sx={{ display: "flex", mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120 }}
                  image={
                    product.images?.[0] || "https://via.placeholder.com/120"
                  }
                  alt={product.name}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price:&nbsp;
                    {product.discount > 0 ? (
                      <>
                        <b>
                          ₹
                          {(
                            product.price -
                            (product.price * product.discount) / 100
                          ).toFixed(2)}
                        </b>
                        &nbsp;
                        <s style={{ color: "gray" }}>₹{product.price}</s>{" "}
                        <span style={{ color: "green" }}>
                          ({product.discount}% OFF)
                        </span>
                      </>
                    ) : (
                      <>₹{product.price}</>
                    )}
                  </Typography>
                </CardContent>
                <IconButton onClick={() => handleRemove(product._id)}>
                  <DeleteIcon />
                </IconButton>
              </Card>
            ) : (
              <Typography key={_id} color="error">
                A product in your cart is no longer available.
              </Typography>
            )
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ₹{totalPrice.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            fullWidth
            onClick={async () => {
              try {
                await axios.delete(`https://new-ecom-1220kqevl-abhishek-k-s-s-projects.vercel.app/user/cart/clear`, {
                  data: { userId },
                });
                setCartItems([]);
                alert(
                  "Thank you for your purchase!"
                );
              } catch (err) {
                // console.error("Failed to clear cart:", err);
                alert("Failed to complete the purchase. Please try again.");
              }
            }}
          >
            Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
