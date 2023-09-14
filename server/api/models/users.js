const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userId: {
    type: Number,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    require: true,
  },
  roleId: {
    type: Number,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("users", usersSchema);
