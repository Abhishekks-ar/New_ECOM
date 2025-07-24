import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BadgeIcon from "@mui/icons-material/Badge";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from "@mui/icons-material/Key";

const SignUp = () => {
  const [step, setStep] = useState("signup");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [role, setRole] = useState("user");
  const [businessName, setBusinessName] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const navigate = useNavigate();

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value));
  };

  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    setPasswordError(!passwordRegex.test(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const signupData = {
      name,
      email,
      password,
      role,
      ...(role === "seller" && { businessName }),
      address,
    };

    axios
      .post("http://localhost:3000/auth/signup", signupData)
      .then((res) => {
        alert(res.data.message);
        setStep("otp");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Signup failed");
      });
  };

  const handleVerifyOtp = () => {
    axios
      .post("http://localhost:3000/auth/verify-otp", { email, otp })
      .then((res) => {
        const { token, user } = res.data;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        if (user.role === "seller") {
          sessionStorage.setItem("sellerId", user._id); // Optional
          navigate("/seller/dashboard/");
        } else {
          sessionStorage.setItem("userId", user._id); // Optional
          navigate("/customer/dashboard/");
        }
      })

      .catch((err) => {
        alert(err.response?.data?.message || "OTP verification failed");
      });
  };

  const handleResendOtp = () => {
    axios
      .post("http://localhost:3000/auth/resend-otp", { email })
      .then(() => {
        alert("OTP resent to your email.");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to resend OTP.");
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        {step === "signup" ? (
          <>
            <Typography
              variant="h4"
              sx={{ color: "#1976d2", mb: 2, textAlign: "center" }}
            >
              Create Account
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Button
                variant={role === "user" ? "contained" : "outlined"}
                onClick={() => setRole("user")}
                sx={{ mr: 1 }}
              >
                User
              </Button>
              <Button
                variant={role === "seller" ? "contained" : "outlined"}
                onClick={() => setRole("seller")}
              >
                Seller
              </Button>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Name <BadgeIcon fontSize="small" />
                  </Box>
                }
                variant="outlined"
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {role === "seller" && (
                <TextField
                  fullWidth
                  label="Business Name (Company/Store Name)"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              )}

              <TextField
                fullWidth
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Email <MailOutlineIcon fontSize="small" />
                  </Box>
                }
                variant="outlined"
                sx={{ mt: 1 }}
                value={email}
                onChange={handleEmail}
                error={emailError}
                helperText={emailError ? "Enter a valid email address" : " "}
              />

              <TextField
                fullWidth
                type="password"
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Password <KeyIcon fontSize="small" />
                  </Box>
                }
                variant="outlined"
                value={password}
                onChange={handlePassword}
                error={passwordError}
                helperText={passwordError ? "Min 6 chars, 1 uppercase" : " "}
                sx={{ mb: 2 }}
              />

              {/* Address Fields */}
              <TextField
                fullWidth
                label="Street"
                variant="outlined"
                sx={{ mb: 2 }}
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                sx={{ mb: 2 }}
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="State"
                variant="outlined"
                sx={{ mb: 2 }}
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Postal Code"
                variant="outlined"
                sx={{ mb: 2 }}
                value={address.postalCode}
                onChange={(e) =>
                  setAddress({ ...address, postalCode: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                sx={{ mb: 3 }}
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  !name ||
                  !email ||
                  !password ||
                  emailError ||
                  passwordError ||
                  (role === "seller" && !businessName) ||
                  !address.street ||
                  !address.city ||
                  !address.state ||
                  !address.postalCode ||
                  !address.country
                }
              >
                Sign Up
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account?{" "}
              <Button variant="text" size="small" onClick={() => navigate("/")}>
                Log In
              </Button>
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{ color: "#1976d2", mb: 2, textAlign: "center" }}
            >
              OTP Verification
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!otp}
              onClick={handleVerifyOtp}
              sx={{ mb: 2 }}
            >
              Verify OTP
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={handleResendOtp}
            >
              Resend OTP
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SignUp;
