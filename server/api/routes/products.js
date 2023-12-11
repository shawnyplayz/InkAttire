const express = require("express");
const router = express.Router();
const products = require("../models/products");
const multer = require("multer");
const cloudinary = require("../../utils/cloudinary");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Jpeg,Jpg and PNG file types are accepted"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
});

// Getting All
const getAllProducts = async (req, res, next) => {
  try {
    const prod = await products.find();
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Getting One
const getProduct = async (req, res, next) => {
  try {
    const getOne = await products.findOne({ sku: req.body.sku });
    res.json(getOne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Creating One
const createProduct = async (req, res, next) => {
  const uploadPromises = req.body.productImages?.map((base64Data) => {
    // Upload each image to Cloudinary
    return cloudinary.uploader.upload(base64Data, {
      folder: "productImages", // Specify the folder for uploaded images
    });
  });

  const uploadedImages = await Promise.all(uploadPromises);

  const createProd = new products({
    sku: req.body.sku,
    name: req.body.name,
    title: req.body.title,
    Length: req.body.Length,
    width: req.body.width,
    price: req.body.price,
    totalPrice: req.body.totalPrice,
    discount_percent: req.body.discount_percent,
    savings: req.body.savings,
    quantity: req.body.quantity,
    // size: req.body.size,
    description: req.body.description,
    productImages: uploadedImages,
    clothingType: req.body.clothingType,
    genre: req.body.genre,
    gender: req.body.gender,
    // skinShade: req.body.skinShade,
  });
  const querySku = await products.findOne({ sku: createProd.sku });
  "querySku==>", querySku;
  if (createProd.sku === querySku?.sku) {
    ("SKU name already EXISTS");
    res.status(500).json({ message: "SKU name already exists" });
    return;
  } else {
    try {
      await createProd.save();
      res.status(201).json({ message: "Successfully Added a Product" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
//Updating One
const updateProduct = async (req, res, next) => {
  try {
    if (req.body.sku != null) {
      const uploadPromises = req.body.productImages?.map((base64Data) => {
        //Check if the Image is Base64(String format), Only then hit the API..
        if (typeof base64Data === "string") {
          // Upload each image to Cloudinary
          return cloudinary.uploader.upload(base64Data, {
            folder: "productImages", // Specify the folder for uploaded images
          });
        } else {
          return base64Data;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      req.body.productImages = uploadedImages;
      console.log("req.body :>> ", req.body);
      await products.updateOne({ _id: req.body._id }, req.body).then(() => {
        return res.status(201).json({
          message: "Updated Successfully!",
        });
      });
      next();
    } else {
      res.status(500).send({ message: "No Product found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Deleting One
const deleteProduct = async (req, res, next) => {
  try {
    const getOne = await products.findOne({ _id: req.body._id });
    if (!getOne) {
      res.status(500).json({ message: "Product Dosen't Exist" });
    } else {
      await products.deleteOne({ _id: req.body._id });
      res.status(200).send({ message: "Deleted Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();
};

const getGenderedProducts = async (req, res, next) => {
  try {
    let findGender = await products.find({ gender: req.query.gender });
    res.status(200).json(findGender);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getGenderedProducts,
};
