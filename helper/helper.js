const jwt = require("jsonwebtoken");
const { cookieName, cookieExpiry } = require("../constants.js");
const User = require("../models/user");
const helper = {};

helper.genToken = (req, res, user) => {
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
    secure: req.app.get("env") === "development" ? false : true,
    maxAge: cookieExpiry,
    domain: "peercodereview.herokuapp.com",
  });
  return token;
};

helper.findReviewer = async ({
  userOwner,
  userLanguageLevel,
  reviewersDeclined,
  embeddedReview,
}) => {
  try {
    const notReviewers = [...reviewersDeclined, userOwner];
    const { language } = embeddedReview;
    let foundReviewer = await User.findOne({
      _id: { $nin: notReviewers },
      "languages.language": language,
      "languages.level": { $gte: userLanguageLevel },
    });
    if (foundReviewer) return foundReviewer;
    foundReviewer = await User.findOne({
      _id: { $nin: notReviewers },
      "languages.language": language,
    });
    return foundReviewer;
  } catch (err) {
    console.error(err, err.message);
  }
};

module.exports = helper;
