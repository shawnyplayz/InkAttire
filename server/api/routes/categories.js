const express = require("express");
const products = require("../models/products");
const cloudinary = require("../../utils/cloudinary");

const getCategoryPageImg = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "Category_page_Img",
    });
    return res.status(200).json({ message: [...result?.resources] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postImages = async (req, res) => {
  try {
    let answer = null;
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "Category_page_Img",
    });
    if (result?.resources?.length !== 0) {
      answer = await cloudinary.uploader.destroy(
        result?.resources[0]?.public_id,
        function (answer) {
          console.log(answer);
        }
      );
      if (answer.result != "ok") {
        return res.status(401).send({ message: answer.result });
      }
    }
    // Upload each image to Cloudinary
    const uploadPromises = req.body?.categoriesImg?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: "Category_page_Img", // Specify the folder for uploaded images
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
  } catch (error) {
    res.status(400).json({
      message: error?.message ? error?.message : error?.error?.message,
    });
  }
};
module.exports = {
  postImages,
  getCategoryPageImg,
};
