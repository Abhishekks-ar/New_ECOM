import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from "@mui/icons-material/Key";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || emailError) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
        role: "admin", 
      });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin/pending-products"); 
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      setMessage(msg);
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
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          Admin Login
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Email <MailOutlineIcon fontSize="small" />
              </Box>
            }
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? "Enter a valid email" : " "}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Password <KeyIcon fontSize="small" />
              </Box>
            }
            value={password}
            onChange={handlePasswordChange}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!email || !password || emailError || loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log In"}
          </Button>
        </form>

        {message && (
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "red" }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminLogin;
