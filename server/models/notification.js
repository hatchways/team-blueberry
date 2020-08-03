const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  thread: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Thread",
    type: String,
  },
  text: {
    type: String,
  },
  author: {
    type: String, //maybe make it REF??
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
