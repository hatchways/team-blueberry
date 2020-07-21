const mongoose = require("mongoose");

// basic review model
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  // References user owner
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      messageText: {
        type: String,
      },

      // References message user owner
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      postedDate: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Review", reviewSchema);
