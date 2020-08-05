const mongoose = require("mongoose");

// import models
const { Review } = require("../models/review-request");

// import request handler
const requestHandler = require("./request");

module.exports = {
  createReview: async (userId, data, cb) => {
    // create const variables from data
    const language = data.language,
      title = data.title,
      codeSnippet = data.codeSnippet,
      messageText = data.messageText;
    const messagePostedBy = userId;
    const messagePostDate = new Date();

    const newReview = new Review({
      title,
      language,
      userId,
      messages: [
        { messageText, codeSnippet, messagePostedBy, messagePostDate },
      ],
    });

    newReview.save(function (err) {
      if (err) return console.log(err);

      const status = "Pending",
        userLanguageLevel = data.languageLevel;

      requestHandler.createRequest(
        {
          userId,
          userLanguageLevel,
          status,
          embeddedReview: newReview,
        },
        cb
      );
    });
  },
  // gets all relevant reviews
  async getReviews(req, res) {
    try {
      if (req.body.singleTarget) {
        const _id = req.body.reviewId;

        const review = await Review.findOne(_id);
        console.log(review);

        res.status(201).json({ review });
      } else {
        const userId = req.user;

        const reviews = await Review.find(userId);

        res.status(201).json({ reviews });
      }
    } catch {
      console.log("There was an error getting reviews.");
      return res
        .status(500)
        .send({ message: "There was an internal server error." });
    }
  },
};
