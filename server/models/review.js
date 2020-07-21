const mongoose = require("mongoose");

// basic review model
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      messageText: {
        type: String,
      },
      codeData: {
        type: String,
      },
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
