const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema({
  categories: {
    type: Object,
    require: false,
  },
  pros: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("cms", cmsSchema);
