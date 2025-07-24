// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const User = require("../model/userData");
const Seller = require("../model/sellerData");
const Admin = require("../model/adminData");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In-Memory OTP Store 
const otpStore = {};

//  Utility Functions 
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const getModelByRole = (role) => {
  switch (role) {
    case "user":
      return User;
    case "seller":
      return Seller;
    case "admin":
      return Admin;
    default:
      return null;
  }
};

const sendOTPEmail = async (name, email, otp) => {
  const msg = {
    to: email,
    from: "ksabhishek37@gmail.com",
    subject: "NextCart - Verify Your Email",
    html: `
  <div style="background-color: #f4f4f4; padding: 30px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <div style="text-align: center;">
        <img src="https://i.imgur.com/8Km9tLL.png" alt="NextCart Logo" style="max-width: 120px; margin-bottom: 20px;" />
        <h2 style="color: #333333;">Welcome to <span style="color: #007bff;">NextCart</span>!</h2>
      </div>

      <p style="font-size: 16px; color: #333333;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; color: #333333;">Thank you for registering with <strong>NextCart</strong>. To complete your signup, please use the following One-Time Password (OTP):</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ffffff; background: #007bff; padding: 15px 30px; border-radius: 8px; display: inline-block;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>5 minutes</strong>. For your security, do not share this code with anyone.</p>

      <p style="font-size: 14px; color: #555;">If you did not initiate this request, you can safely ignore this email.</p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 14px; color: #888;">Best regards,<br/>The <strong>NextCart</strong> Team</p>
    </div>
  </div>
`,

  };
  await sgMail.send(msg);
};

// Signup 
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const model = getModelByRole(role);
    if (!model) return res.status(400).json({ message: "Invalid role" });

    const existing = await model.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);5
    const otp = generateOTP();
    // const expiresAt = Date.now() + 5 * 60 * 1000;
    // console.log(otp);

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      userData: {
        name,
        email,
        hashedPassword,
        role, // or based on your logic
      },
    };

    await sendOTPEmail(name, email, otp);
    res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed." });
  }
};

// otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = otpStore[email];

    if (!data)
      return res.status(400).json({ message: "No OTP request found." });
    if (data.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > data.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    const { name, hashedPassword, role } = data.userData;

    const model = getModelByRole(role);
    if (!model) return res.status(400).json({ message: "Invalid role" });

    const newUser = new model({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    delete otpStore[email];

    const token = generateToken(newUser);

    res.status(201).json({
      message: "OTP verified. Signup successful.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = otpStore[email];
    if (!existing)
      return res.status(400).json({ message: "No signup request found." });

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore[email] = { ...existing, otp, expiresAt };

    await sendOTPEmail(existing.name, email, otp);
    res.status(200).json({ message: "OTP resent to email." });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ message: "Resend failed." });
  }
};

// ====== Login ======
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Temporary admin login shortcut
    if (
      email === "admin@example.com" &&
      password === "Admin123" &&
      role === "admin"
    ) {
      const token = jwt.sign({ id: "admin-id", role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Admin login successful (hardcoded)",
        token,
        user: {
          id: "admin-id",
          name: "Super Admin",
          email,
          role,
        },
      });
    }

    // Proceed with normal logic for others
    const model = getModelByRole(role);
    if (!model) return res.status(400).json({ message: "Invalid role" });

    const user = await model.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong credentials" });

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};



// ====== Forgot Password ======
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Seller.findOne({ email });
      role = "seller";
    }

    if (!user) {
      user = await Admin.findOne({ email });
      role = "admin";
    }

    if (!user)
      return res
        .status(404)
        .json({ message: "No account with that email found." });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000;

    user.resetToken = token;
    user.resetTokenExpires = expiry;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${token}&role=${role}`;
    console.log(resetLink)

    const msg = {
      to: email,
      from: "ksabhishek37@gmail.com",
      subject: "Password Reset - NextCart",
      html: `<p>Hello ${
        user.name || "User"
      },</p><p>You requested to reset your password. Click the link below to reset:</p><a href="${resetLink}">${resetLink}</a><p>This link is valid for 15 minutes.</p><p>If you didn’t request this, ignore this email.</p>`,
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

// ====== Reset Password ======
exports.resetPassword = async (req, res) => {
  try {
    const { token, role, newPassword } = req.body;
    const model = getModelByRole(role);
    if (!model) return res.status(400).json({ message: "Invalid role" });

    const user = await model.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};

// ====== Authentication Middleware ======
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches { id, role } to req.user
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

