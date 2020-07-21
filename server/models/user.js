const mongoose = require("mongoose");

// basic user model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // credits for reviews
  balance: {
    type: Number,
    default: 3,
    min: 0,
    required: true,
  },
  payments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
