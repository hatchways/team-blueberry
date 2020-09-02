const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Projects = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

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
  avatar: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
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
  languages: { type: Array },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  projects: [Projects],
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

userSchema.statics.getUser = function (id) {
  // TODO extract <select> from this static into generic options
  return this.findById(id, "avatar name position company languages").exec();
};

userSchema.statics.addCredits = function ({ user, credits }) {
  return this.findByIdAndUpdate(
    user,
    { $inc: { balance: credits } },
    { new: true, returnOriginal: false }
    // ! toObject MUST be called manually !
  ).toObject();
};

module.exports = mongoose.model("User", userSchema);
