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
});

// ! Calling toObject will always remove password
userSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.password;
  return ret;
}

module.exports = mongoose.model("User", userSchema);
