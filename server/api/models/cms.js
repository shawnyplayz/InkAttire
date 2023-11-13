const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema({
  categories: {
    type: Object,
    require: false,
  },
});

module.exports = mongoose.model("cms", cmsSchema);
