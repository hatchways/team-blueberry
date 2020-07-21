//const mongoose = require("mongoose");

const { Mongoose } = require("mongoose");

// model for code collection
const codeSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Code", codeSchema);
