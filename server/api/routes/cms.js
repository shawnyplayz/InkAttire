const express = require("express");
const router = express.Router();
const cms = require("../models/cms");
const products = require("../models/products");
const getCarousel = async (req, res) => {
  var distinctValues = await products.distinct("genre");
  let getFeatured = await products.find({"genre":{$in:distinctValues}})
  // const pushFeatured = new cms({
  //   featuredProducts : [...getFeatured]
  // })
  try {    
    await cms.updateOne({
      $set:{featuredProducts:[...getFeatured]}
    });
    let getCar = await cms.find({});
    res.status(200).json(...getCar);
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
const deleteCarousel  = ("/:id", async (req, res, next) => {
  try {
    console.log("req.params.id",req.params.id);
    const getOne = await cms.find({ carousel: {
      $elemMatch: {
        img_id: req.params.id
      }
    }},{
      "carousel.$": 1
    });
    console.log('getOne :>> ', getOne);
    if (!getOne || getOne.length === 0) {
      res.status(500).json({ message: "Product Dosen't Exist" });
    } else {
      await cms.updateOne({$pull:{
        "carousel":{
          img_id:req.params.id
        }
      }})
      res.status(200).send({ message: "Deleted Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();

});
module.exports = {
  getCarousel,
  postCarousel,
  deleteCarousel
};
