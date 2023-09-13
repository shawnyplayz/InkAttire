require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("error==>", error);
});
db.once("open", () => {
  console.log("connected to database");
});
const productRoutes = require("./api/routes/products");

app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/products", productRoutes);
app.use(cors());
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
