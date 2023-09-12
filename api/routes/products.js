const express = require("express");
const router = express.Router();
const products = require("../models/products");
router.get("/", async (req, res, next) => {
  try {
    const prod = await products.find();
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", async (req, res, next) => {
  const createProd = new products({
    sku: req.body.sku,
    title: req.body.title,
    description: req.body.description,
    manufacture_details: req.body.manufacture_details,
    shipping_details: req.body.shipping_details,
    quantity: req.body.quantity,
    pricing: req.body.pricing,
  });
  const querySku = await products.findOne({ sku: createProd.sku });
  console.log("querySku==>", querySku);
  if (createProd.sku === querySku?.sku) {
    res.status(500).json({ message: "SKU name already exists" });
    return;
  } else {
    try {
      const newprod = await createProd.save();
      res.status(201).json(newprod);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});
module.exports = router;
