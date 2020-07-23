const express = require("express");
const router = express.Router();

const reviewModel = require("../review-request-handlers/review");

// import model User for searching
const User = require("../models/user");
const Review = require("../models/review");

router.post("/review", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    const data = {
      language: req.body.language,
      title: req.body.title,
      codeSnippet: req.body.codeSnippet,
      messageText: req.body.messageText,
    };

    await reviewModel.createReview(user, data, () => {});
  } catch {
    console.log("There was an error in creating review");
  }
});

// gets all relevant reviews
router.post("/reviews", async (req, res) => {
  try {
    // Need to implement user auth middleware here and search off the returned id

    const reviews = await Review.find({ userId: user._id });
  } catch {
    console.log("There was an error getting reviews");
  }
});

module.exports = router;
