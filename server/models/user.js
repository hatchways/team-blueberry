const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  name: {
    type: String,
    required: true,
  },
  languages: [
    {
      level: {
        type: String,
        // Will a user be able to move forward with no languages?
        // required: true,
      },
      language: {
        type: String,
        // Will a user be able to move forward with no languages?
        // required: true,
      },
    },
  ],
});

// hash and store password before user is saved
userSchema.pre("save", async function (next) {
  const user = this;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// ! Calling toObject will always remove password
userSchema.set("toObject", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
