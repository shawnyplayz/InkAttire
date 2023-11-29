const express = require("express");
const router = express.Router();
const cms = require("../models/cms");
const products = require("../models/products");

const getNavContent = async (req, res) => {
  try {
    var distinctValues = await products.distinct("genre");
    let getCar = await cms.find({ categories: { $exists: true } });
    let cato = getCar?.map((el) => {
      return el?.categories?.clothingType;
    });
    var distinctSkinShade = await products.aggregate([
      { $unwind: "$skinShade" },
      { $group: { _id: "$skinShade" } },
    ]);
    let themes = await products.find(
      { genre: { $in: distinctValues } },
      { _id: 0, genre: 1 }
    );
    res.status(200).json({
      navbarCategories: {
        categories: [...cato],
        theme: [...themes],
        skinTone: [...distinctSkinShade],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports = {
  getNavContent,
};
