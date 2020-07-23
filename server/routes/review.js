const express = require("express");
const router = express.Router();

const reviewModel = require("../review_request_handlers/review/review");

// import model User for searching
const User = require("../models/user");
const Review = require("../models/review");

router.post("/createReview", async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  const data = {
    language: req.body.language,
    title: req.body.title,
    codeSnippet: req.body.codeSnippet,
    messageText: req.body.messageText,
  };

  await reviewModel.createReview(user, data, () => {
    res.status(201).json({ message: "Complete" });
  });
});

// gets all relevant reviews
router.post("/getReviews", async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  const reviews = await Review.find({ userId: user._id });

  res.status(201).json({ result: reviews });
});

module.exports = router;
