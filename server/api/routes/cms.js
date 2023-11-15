const express = require("express");
const router = express.Router();
const cms = require("../models/cms");
const products = require("../models/products");
const cloudinary = require("../../utils/cloudinary");
const { json } = require("body-parser");

const getCarousel = async (req, res) => {
  var distinctValues = await products.distinct("genre");
  let getFeatured = await products.find({ genre: { $in: distinctValues } });
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "carousel",
  });
  const resultCategories = await cloudinary.api.resources({
    type: "upload",
    prefix: "categories",
  });
  const resultPros = await cloudinary.api.resources({
    type: "upload",
    prefix: "prosImages",
  });
  try {
    let getCar = await cms.find({}, { categories: 1 }, { __v: 0 }, { _id: 0 });
    let fetchPros = await cms.find({}, { pros: 1 });
    res.status(200).json({
      carousel: [...result?.resources],
      featuredProducts: getFeatured,
      categories: getCar ? [...getCar] : [],
      ProsPics: resultPros?.resources,
      pros: [...fetchPros],
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const postImages = async (req, res) => {
  try {
    if (req.body.hasOwnProperty("prosImages")) {
      // Upload each image to Cloudinary
      const uploadPromises = req.body?.prosImages?.map((base64Data) => {
        return cloudinary.uploader.upload(base64Data, {
          folder: "prosImages", // Specify the folder for uploaded images
        });
      });
      const uploadedImages = await Promise.all(uploadPromises);

      if (uploadedImages.length == 0) {
        return res.status(401).json({ message: "Upload Failed" });
      } else {
        return res.status(201).json({
          message: "Images Added Successfully!",
        });
      }
    } else if (!req.body.hasOwnProperty("carousel")) {
      // Upload each image to Cloudinary
      const uploadPromises = req.body?.catImages?.map((base64Data) => {
        return cloudinary.uploader.upload(base64Data, {
          folder: "categories", // Specify the folder for uploaded images
        });
      });
      const uploadedImages = await Promise.all(uploadPromises);
      let findSimilarClothingType = await cms.find({
        "categories.clothingType": req.body?.clothingType,
      });
      if (findSimilarClothingType.length != 0) {
        return res
          .status(401)
          .json({ message: "This Clothing Type already exists" });
      } else {
        let saveCat = new cms({
          categories: {
            clothingType: req.body?.clothingType,
            url: uploadedImages[0].secure_url,
            public_id: uploadedImages[0].public_id,
          },
        });
        await saveCat.save();
        return res.status(201).json({
          message: "Updated Successfully!",
        });
      }
    } else {
      const uploadPromises = req.body.carousel?.map((base64Data) => {
        // Upload each image to Cloudinary
        return cloudinary.uploader.upload(base64Data, {
          folder: "carousel", // Specify the folder for uploaded images
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      await cms
        .updateOne({
          $push: {
            carousel: {
              $each: [
                {
                  url: uploadedImages.secure_url,
                  public_id: uploadedImages.public_id,
                },
              ],
            },
          },
        })
        .then(() => {
          return res.status(201).json({
            message: "Updated Successfully!",
          });
        });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteCarousel = async (req, res, next) => {
  try {
    console.log("req.params.id", req.body.id);
    const result = await cloudinary.uploader.destroy(
      req.body.id,
      function (result) {
        console.log(result);
      }
    );
    if (result.result == "ok") {
      res.status(200).send({ message: result });
    } else {
      res.status(401).send({ message: result.result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();
};

const deleteCategory = async (req, res, next) => {
  try {
    console.log("req.params.id", req.body.id);
    let deleteCat = await cms.deleteOne({
      "categories.public_id": req.body?.id,
    });
    console.log("deleteCat", deleteCat);
    const result = await cloudinary.uploader.destroy(
      req.body.id,
      function (result) {
        console.log(result);
      }
    );
    if (deleteCat.acknowledged && result.result == "ok") {
      res.status(200).send({ message: result });
    } else {
      res.status(401).send({ message: result.result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();
};
const deleteProsImages = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.destroy(
      req.body.id,
      function (result) {
        console.log(result);
      }
    );
    if (result?.result == "ok") {
      res.status(200).send({ message: result });
    } else {
      res.status(401).send({ message: result.result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();
};
const saveDescription = async (req, res, next) => {
  try {
    if (req.body.description === "") {
      return res.status(401).json({ message: "Description cannot be empty" });
    }
    let asd = await cms.deleteMany({}, { pros: 1 });
    console.log("asd", asd);
    let saveDesc = new cms({
      pros: req.body.description,
    });
    let saveVerdict = await saveDesc.save();
    // let updatePros = await cms.updateOne({
    //   $set: { pros: req.body.description },
    // });
    if (!saveVerdict) {
      res.status(401).json({ message: "Could not update json" });
    } else {
      res.status(200).json({ message: "Successfully updated description" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getCarousel,
  postImages,
  deleteCarousel,
  deleteCategory,
  deleteProsImages,
  saveDescription,
};
