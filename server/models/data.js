const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  links: [String],
  pixels: {
    type: Number,
    required: true,
  },
  status : String,
  xcoordinate: Number,
  ycoordinate: Number,
  width: Number,
  height: Number,
  price: Number,
});

module.exports = mongoose.model("User", userSchema);
