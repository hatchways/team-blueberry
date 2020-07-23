const mongoose = require("mongoose");

// basic request model
const requestSchema = new mongoose.Schema({
  // References review owner
  reviewOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },

  // References user owner
  userOwner: {
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
  statuses: [
    {
      statusDate: {
        type: Date,
      },
      status: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Request", requestSchema, "requestCollection");
