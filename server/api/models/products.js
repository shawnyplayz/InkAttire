const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  sku: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  length: {
    type: Number,
    required: true,
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
  width: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },

  // productImage: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("products", productsSchema);
