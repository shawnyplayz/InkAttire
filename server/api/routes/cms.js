const express = require("express");
const router = express.Router();
const cms = require("../models/cms");
const products = require("../models/products");
const cloudinary = require("../../utils/cloudinary");

const getCarousel = async (req, res) => {
  var distinctValues = await products.distinct("genre");
  let getFeatured = await products.find({ genre: { $in: distinctValues } });
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "carousel",
  });
  await cms.deleteMany({});
  const pushFeatured = new cms({
    carousel: [...result?.resources],
    featuredProducts: [...getFeatured],
  });
  try {
    await pushFeatured.save();
    // await cms.updateOne({
    //   $set: { featuredProducts: [...getFeatured] },
    //   $set: { carousel: [...result?.resources] },
    // });
    let getCar = await cms.find({});
    res.status(200).json(...getCar);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const postCarousel = async (req, res) => {
  try {
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
// const getCategories = async(req,res)=>{
//   let asd = await

// }
module.exports = {
  getCarousel,
  postCarousel,
  deleteCarousel,
};
