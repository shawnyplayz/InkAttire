const express = require("express");
const router = express.Router();
const cms = require("../models/cms");

const getCarousel = async (req, res) => {
  let getCar = await cms.find({});
  try {
    res.status(200).json(getCar);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const postCarousel = async (req, res) => {
  let postCar = new cms({
    carousel: req.body.carousel,
  });
  try {
    let getCar = await cms.find({});
    console.log(getCar);
    if (getCar.length != 0) {
      await cms
        .updateOne({ $push: { carousel: { $each: req.body.carousel } } })
        .then(() => {
          return res.status(201).json({
            message: "Updated Successfully!",
          });
        });
    } else {
      await postCar.save();
      res.status(201).json({ message: "Successfully Added a Slide" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  getCarousel,
  postCarousel,
};
