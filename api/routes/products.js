const express = require("express");
const router = express.Router();
const products = require("../models/products");

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
    const getOne = await products.findOne({ _id: req.params.id });
    res.json(getOne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Creating One
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
//Updating One
router.put("/:id", async (req, res, next) => {
  try {
    if (req.body.sku != null) {
      const updateProd = new products({
        _id: req.params.id,
        sku: req.body.sku,
        title: req.body.title,
        description: req.body.description,
        manufacture_details: req.body.manufacture_details,
        shipping_details: req.body.shipping_details,
        quantity: req.body.quantity,
        pricing: req.body.pricing,
      });
      await products.updateOne({ _id: req.params.id }, updateProd).then(() => {
        return res.status(201).json({
          message: "Updated Successfully!",
        });
      });
      next();
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// Deleting One
router.delete("/:id", async (req, res, next) => {
  try {
    await products.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();
});
module.exports = router;
