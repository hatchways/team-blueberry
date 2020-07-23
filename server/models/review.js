const mongoose = require("mongoose");

// basic review model
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  language: {
    type: String,
  },

  // References user owner
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  messages: [
    {
      messageText: {
        type: String,
      },

      codeSnippet: {
        type: String,
      },

      // References message user owner
      messagePostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      messagePostDate: {
        type: Date,
      },
    },
  ],
  reviewCreatedDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Review", reviewSchema, "reviewCollection");
