const express = require("express");
const products = require("../models/products");

// To Sort for gendered related Products
const getGenderedProducts = async (req, res, next) => {
  try {
    let findGender = await products.find({ gender: req.query.gender });
    res.status(200).json(findGender);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGenderedProducts,
};
