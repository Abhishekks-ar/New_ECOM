const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.mongoDB_URL)
  .then(() => {
    console.log("Connection established");
  })
  .catch(() => {
    console.log("Connection error");
  });