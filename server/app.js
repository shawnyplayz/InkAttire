require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");

const app = express();

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("error==>", error);
});
db.once("open", () => {
  console.log("connected to database");
});
var corsOptions = {
  credentials: true,
};

const productRoutes = require("./api/routes/products");
const userRoutes = require("./api/routes/users");
const requireAuth = require("./api/middleware/requireAuth");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/products", productRoutes);
app.post("/signup", userRoutes.signup);
app.post("/login", userRoutes.login);
app.get("/check-auth", cors(corsOptions), requireAuth, userRoutes.checkAuth);
app.post("/logout", userRoutes.logout);
app.get("/users", userRoutes.allUsers);
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
