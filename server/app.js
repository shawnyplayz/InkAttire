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
  console.log("error==>", error);
});
db.once("open", () => {
  console.log("connected to database");
});

const productRoutes = require("./api/routes/products");
const userRoutes = require("./api/routes/users");
const cmsRoutes = require("./api/routes/cms");
const catalogueRoutes = require("./api/routes/catalogue");
const categoriesRoutes = require("./api/routes/categories");
const navbarRoutes = require("./api/routes/navbar");
const requireAuth = require("./api/middleware/requireAuth");
const options = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://inklothes.com",
    "https://admin.inklothes.com",
  ],
};
app.use(cors(options));
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
app.get("/products", productRoutes.getAllProducts);
app.get("/products", productRoutes.getProduct);
app.post("/products/updateProduct", requireAuth, productRoutes.updateProduct);
app.post(`/products/createProduct`, requireAuth, productRoutes.createProduct);
app.post("/products/deleteProduct", requireAuth, productRoutes.deleteProduct);
app.use("/catalogue", requireAuth, catalogueRoutes);
app.post("/signup", userRoutes.signup);
app.post("/login", userRoutes.login);
app.get("/check-auth", requireAuth, userRoutes.checkAuth);
app.post("/logout", userRoutes.logout);
app.get("/users", requireAuth, userRoutes.allUsers);
app.get("/cms", cmsRoutes.getAll);
app.post("/cms", requireAuth, cmsRoutes.postImages);
app.post("/cms/delete", requireAuth, cmsRoutes.deleteCarousel);
app.post("/cms/deleteCategory", requireAuth, cmsRoutes.deleteCategory);
app.post("/cms/deleteProsImages", requireAuth, cmsRoutes.deleteProsImages);
app.post("/cms/description", requireAuth, cmsRoutes.saveDescription);
app.get("/navbarContent", navbarRoutes.getNavContent);
app.get("/categoriesImg", categoriesRoutes.getCategoryPageImg);
app.post("/categoriesImg", requireAuth, categoriesRoutes.postImages);
module.exports = app;
