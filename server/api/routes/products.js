const express = require("express");
const router = express.Router();
const products = require("../models/products");
const multer = require("multer");

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
router.get("/", async (req, res, next) => {
  try {
    const prod = await products.find();
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Getting One
router.get("/:id", async (req, res, next) => {
  try {
    const getOne = await products.findOne({ sku: req.params.id });
    res.json(getOne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Creating One
router.post("/", async (req, res, next) => {
  console.log("Request==>", req.body);
  const createProd = new products({
    sku: req.body.sku,
    name: req.body.name,
    title: req.body.title,
    Length: req.body.Length,
    width: req.body.width,
    price: req.body.price,
    discount_percent: req.body.discount_percent,
    quantity: req.body.quantity,
    size: req.body.size,
    description: req.body.description,
    productImages: req.body.productImages,
  });
  const querySku = await products.findOne({ sku: createProd.sku });
  console.log("querySku==>", querySku);
  if (createProd.sku === querySku?.sku) {
    console.log("SKU name already EXISTS");
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
});
//Updating One
router.put("/:id", async (req, res, next) => {
  try {
    if (req.body.sku != null) {
      // const updateProd = new products({
      //   // _id: req.body.id,
      //   sku: req.body.sku,
      //   name: req.body.name,
      //   title: req.body.title,
      //   Length: req.body.Length,
      //   width: req.body.width,
      //   price: req.body.price,
      //   discount_percent: req.body.discount_percent,
      //   quantity: req.body.quantity,
      //   size: req.body.size,
      //   description: req.body.description,
      //   productImages: req.body.productImages,
      // });
      await products.updateOne({ sku: req.params.id }, req.body).then(() => {
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
});
// Deleting One
router.delete("/:id", async (req, res, next) => {
  try {
    const getOne = await products.findOne({ _id: req.params.id });
    if (!getOne) {
      res.status(500).json({ message: "Product Dosen't Exist" });
    } else {
      await products.deleteOne({ _id: req.params.id });
      res.status(200).send({ message: "Deleted Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();
});
module.exports = router;

// const product = async (req, res) => {
//   try {
//     const createProd = new products({
//       sku: req.body.sku,
//       name: req.body.name,
//       title: req.body.title,
//       length: req.body.title,
//       width: req.body.title,
//       pricing: req.body.pricing,
//       discount_percent: req.body.pricing,
//       quantity: req.body.quantity,
//       size: req.body.size,
//       description: req.body.description,
//       // productImage: req.file.filename,
//     });
//     const querySku = await products.findOne({ sku: createProd.sku });
//     if (createProd.sku === querySku?.sku) {
//       res.status(500).json({ message: "SKU name already exists" });
//       return;
//     } else {
//       try {
//         const newprod = await createProd.save();
//         res.status(201).json(newprod);
//       } catch (error) {
//         res.status(400).json({ message: error.message });
//       }
//     }
//   } catch (error) {
//     console.log("error==>", error);
//     res.status(400).json({ error: error });
//   }
// };
// module.exports = { product };
