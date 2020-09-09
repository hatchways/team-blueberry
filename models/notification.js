const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
  text: {
    type: String,
  },
  author: {
    type: String,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Notification", notificationSchema);
