const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema({
  carousel: {
    type: Array,
    require: false,
  },
  featuredProducts: {
    type: Array,
    require: false,
  },
  bestSelling: {
    type: Array,
    require: false,
  },
});

module.exports = mongoose.model("cms", cmsSchema);
