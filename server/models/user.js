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
  name: {
    type: String,
    required: true,
  },
  languages: [
    {
      level: {
        type: String,
      },
      language: {
        type: String,
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
    ret.id = ret._id;
    delete ret.password;
    delete ret._id;
    return ret;
  },
});

userSchema.statics.addCredits = function ({ user, credits }) {
  return this.findByIdAndUpdate(
    user,
    { $inc: { balance: credits } },
    { new: true, returnOriginal: false }
  );
};

module.exports = mongoose.model("User", userSchema);
