const mongoose = require("mongoose");

const catalogueSchema = new mongoose.Schema({
  clothingType: {
    type: String,
    require: true,
  },
  genre: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("catalogue", catalogueSchema);
