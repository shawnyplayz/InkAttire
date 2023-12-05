const express = require("express");
const router = express.Router();
const catalogue = require("../models/catalogue");
const products = require("../models/products");
const cg = ["Unisex", "Men", "Women", "Kids"];
const getCatalogue = async (req, res) => {
  try {
    let getCata = await catalogue.find({});
    if (getCata) {
      const clothingType = getCata?.filter((el) => {
        if (el.clothingType != undefined || !el) {
          return {
            label: el.clothingType,
            value: el.clothingType,
          };
        }
      });
      const genre = getCata?.filter((el) => {
        if (el.genre !== undefined || !el) {
          return {
            label: el.genre,
            value: el.genre,
          };
        }
      });
      getCata = { clothingType, genre, cg };
    }
    res.status(200).json(getCata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCatalogue = async (req, res) => {
  const createCata = new catalogue({
    clothingType: req.body?.clothingType,
    genre: req.body?.genre,
    cg: req.body?.cg,
  });
  if (!createCata?.clothingType && !createCata?.genre && !createCata.cg) {
    res.status(500).json({ message: "Fields cannot be empty" });
  } else if (createCata.clothingType) {
    const clothingType = await catalogue.findOne({
      clothingType: createCata.clothingType,
    });

    if (clothingType) {
      res.status(500).json({ message: "This Clothing Type already exists" });
    } else {
      try {
        await createCata.save();
        res.status(201).json({ message: "Successfully Added a Clothing" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  } else if (createCata.genre) {
    const genre = await catalogue.findOne({ genre: createCata.genre });
    if (genre) {
      res.status(500).json({ message: "This Genre already exists" });
    } else {
      try {
        await createCata.save();
        res.status(201).json({ message: "Successfully Added a Genre" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
};

const deleteClothing =
  ("/deleteClothing/",
  async (req, res) => {
    try {
      if (req.body.clothingType) {
        let checkClothing = await products.findOne({
          clothingType: req.body.clothingType,
        });
        if (checkClothing) {
          res.status(500).json({
            message:
              "Cannot delete a Category of clothing when associated with a product!",
          });
        } else {
          await catalogue.deleteOne({ clothingType: req.body.clothingType });
          res
            .status(200)
            .json({ message: "Successfully deleted a Type of Clothing!" });
        }
      } else {
        res.status(401).json({ message: "Cannot delete a null value!" });
      }
    } catch (error) {
      res.status(401).json({ message: error });
    }
  });
const deleteGenre =
  ("/deleteGenre/",
  async (req, res) => {
    try {
      if (req.body.genre) {
        let checkGenre = await products.findOne({
          genre: req.body.genre,
        });
        if (checkGenre) {
          res.status(500).json({
            message: "Cannot delete this genre when associated with a product!",
          });
        } else {
          await catalogue.deleteOne({ genre: req.body.genre });
          res.status(200).json({ message: "Successfully deleted a Genre!" });
        }
      } else {
        res.status(401).json({ message: "Cannot delete a null value!" });
      }
    } catch (error) {
      res.status(401).json({ message: error });
    }
  });
module.exports = {
  getCatalogue,
  createCatalogue,
  deleteClothing,
  deleteGenre,
};
