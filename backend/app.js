const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");

app.use(
  cors({
    origin:
      "https://new-ecom-z6cx-5u8dvqtb1-abhishek-k-s-s-projects.vercel.app", // ✅ your frontend domain
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

require("dotenv").config();

require("./db/connection");

const userRoute = require("./routes/userRoutes");
app.use("/user", userRoute);

const authRoute = require("./routes/authRoutes");
app.use("/auth", authRoute);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const sellerRoute = require("./routes/sellerRoutes");
app.use("/seller", sellerRoute);

const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening in port ${process.env.PORT}`);
});
