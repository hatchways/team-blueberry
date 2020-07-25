const User = require("../models/user");

const showUser = async (req, res, next) => {
  // check for logged in user
  const userId = req.user ? req.user.id : null;
  if (!userId)
    return res
      .status(401)
      .send("You are not authorized to access this resource");
  try {
    const user = await User.findById(userId)
      .exec()
      .then((user) => user.toObject());
    return res.status(200).send({ ...user });
  } catch (e) {
    // TODO maybe handle exception if user is logged in but db does not return
    // consider security implications
    console.log(e);
    return res
      .status(401)
      .send("You are not authorized to access this resource");
  }
};

module.exports = {
  showUser,
};
