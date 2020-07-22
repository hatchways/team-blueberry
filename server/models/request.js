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
  requestDate: {
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

module.export = mongoose.model("Request", requestSchema);
