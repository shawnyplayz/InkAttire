require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");
// const { CLIENT_ORIGIN } = require('./config')

const app = express();

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", (error) => {
  "error==>", error;
});
db.once("open", () => {
  ("connected to database");
});

const productRoutes = require("./api/routes/products");
const userRoutes = require("./api/routes/users");
const cmsRoutes = require("./api/routes/cms");
const catalogueRoutes = require("./api/routes/catalogue");
const requireAuth = require("./api/middleware/requireAuth");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
    parameterLimit: 100000,
    limit: "500mb",
  })
);
app.use(express.json({ limit: "500mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use("/products", requireAuth, productRoutes);
app.use("/catalogue", requireAuth, catalogueRoutes);
app.post("/signup", userRoutes.signup);
app.post("/login", userRoutes.login);
app.get("/check-auth", requireAuth, userRoutes.checkAuth);
app.post("/logout", userRoutes.logout);
app.get("/users", requireAuth, userRoutes.allUsers);
app.get("/cms", cmsRoutes.getCarousel);
app.post("/cms", requireAuth, cmsRoutes.postCarousel);
app.post("/cms/delete", requireAuth, cmsRoutes.deleteCarousel);
app.post("/cms/deleteCategory", requireAuth, cmsRoutes.deleteCategory);

module.exports = app;
