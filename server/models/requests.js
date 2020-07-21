const mongoose = require("mongoose");

// basic request model
const requestSchema = new mongoose.Schema({
  reviewOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requestDate: {
    type: Date,
  },
  statuses: {
    type: Array,
  },
});

module.export = mongoose.model("Review", requestSchema);
