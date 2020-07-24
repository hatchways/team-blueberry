const mongoose = require("mongoose");
const ReviewSchema = require("./review");

// basic request model
const requestSchema = new mongoose.Schema({
  // References user owner
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  selectedReviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // Needed for timeout eventually
  requestCreateDate: {
    type: Date,
  },
  reviewersDeclined: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
  },
  // References review owner
  embeddedReview: [ReviewSchema],
});

module.exports = mongoose.model("Request", requestSchema, "requestCollection");
