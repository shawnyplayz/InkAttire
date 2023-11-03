const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  sku: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  discount_percent: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  savings: {
    type: Number,
    required: false,
  },
  size: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },
  clothingType: {
    type: String,
    require: true,
  },
  genre: {
    type: String,
    require: true,
  },
  bodyType: {
    type: String,
    require: true,
  },
  productImages: {
    type: Array,
    required: true,
  },
  sales:{
    type:Number,
    require:false,
    default : 0
  },
  reviews:{
    type:Array,
    require:false,
  },
  ratings:{
    type:Number,
    require:false
  },
  skinShade:{
    type:String,
    require:true
  }
});

module.exports = mongoose.model("products", productsSchema);
