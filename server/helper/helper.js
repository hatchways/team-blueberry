const jwt = require("jsonwebtoken");
const { cookieName, cookieExpiry } = require("../constants.js");

// store all helper
const helper = {};

// generate token and save into cookie
helper.genToken = (req, res, user) => {
  // proess.env.JWT_KEY to store secret key
  const secretKey = process.env.JWT_KEY || "secret";
  const token = jwt.sign(
    {
      id: user._id,
    },
    secretKey,
    {
      expiresIn: "24hr",
    }
  );
  res.cookie(cookieName, token, {
    httpOnly: true,
    // check env if development
    secure: req.app.get("env") === "development" ? false : true,
    maxAge: cookieExpiry,
  });
  return token;
};

module.exports = helper;
