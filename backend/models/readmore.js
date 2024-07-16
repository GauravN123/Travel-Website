const mongoose = require("mongoose");

const readmoreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Readmore = mongoose.model("Readmore", readmoreSchema);
module.exports = Readmore;
