const express = require("express");
const router = express.Router();
const cms = require("../models/cms");
const products = require("../models/products");
const cloudinary = require("../../utils/cloudinary");

const getCarousel = async (req, res) => {
  var distinctValues = await products.distinct("genre");
  let getFeatured = await products.find({"genre":{$in:distinctValues}})
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: "carousel",
  });

  // const pushFeatured = new cms({
  //   featuredProducts : [...getFeatured]
  // })
  try {    
    await cms.updateOne({
      $set:{featuredProducts:[...getFeatured]},
      $set:{carousel:[...result?.resources]}
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
  const result = await cloudinary.uploader.upload(req.body.carousel[0].img,{
      folder:"carousel"
    })
    console.log('carousel Image :>> ', result);

    let getCar = await cms.find({});
    console.log(getCar);
    if (getCar.length != 0) {
      await cms
        .updateOne({ $push: { carousel: { $each: [{
          url: result.secure_url,
          public_id: result.public_id,
      }]} } })
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
const deleteCarousel  =  async (req, res, next) => {
  try {
    console.log("req.params.id",req.body.id);
const result = await cloudinary.uploader.destroy(req.body.id, function(result) { console.log(result) });
if(result.result == "ok"){
  res.status(200).send({ message: result});
}
else{
  res.status(401).send({ message: result.result});

}
    // const getOne = await cms.find({ carousel: {
    //   $elemMatch: {
    //     img_id: req.params.id
    //   }
    // }},{
    //   "carousel.$": 1
    // });
    // if (!getOne || getOne.length === 0) {
    //   res.status(500).json({ message: "Product Dosen't Exist" });
    // } else {
    //   await cms.updateOne({$pull:{
    //     "carousel":{
    //       img_id:req.params.id
    //     }
    //   }})
    //   res.status(200).send({ message: "Deleted Successfully!" });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  next();

};
module.exports = {
  getCarousel,
  postCarousel,
  deleteCarousel
};
