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
  description: {
    type: String,
    require: true,
  },
  manufacture_details: {
    type: Object,
    required: true,
  },
  shipping_details: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricing: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("products", productsSchema);
