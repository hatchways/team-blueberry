const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  thread: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Request",
  },
  text: {
    type: String,
  },
  author: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
  },
  seen: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
