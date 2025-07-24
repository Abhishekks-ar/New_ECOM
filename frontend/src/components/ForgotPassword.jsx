import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !email) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/auth/forgot-password", {
        email,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, textAlign: "center", fontWeight: 600 }}>
          Forgot Password
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Registered Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? "Enter a valid email address" : " "}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!email || emailError || loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 2,
              color: message.toLowerCase().includes("sent") ? "green" : "red",
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
