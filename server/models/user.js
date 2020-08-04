const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const user = require("../mongoose-handlers/user");

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
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

userSchema.statics.update = async function ({ id, update, callback }) {
  if (update.avatar && callback) {
    // uploads avatar to bucket
    update.avatar = await callback(update.avatar);
  }
  return (
    this.findById(id, (err, user) => {
      const { avatar, name, position, company } = update;
      user.avatar = avatar || user.avatar;
      user.name = name || user.name;
      user.position = position || user.position;
      user.company = company || user.company;
      // TODO add update to projects
      user.save();
    })
      .exec()
      // ! toObject MUST be called manually !
      .then((user) => user.toObject())
  );
};

userSchema.statics.getUser = function (id) {
  // TODO extract <select> from this static into generic options
  return this.findById(id, "avatar name position company languages").exec();
};

module.exports = mongoose.model("User", userSchema);
