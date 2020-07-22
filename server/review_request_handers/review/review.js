const mongoose = require("mongoose");

// import models
const Review = require("../../models/review");

// import request handler
const requestHandler = require("../request/request");

module.exports = {
  createReview: (user, data) => {
    // create const variables from user
    const name = user.email,
      userId = user._id;

    // create const variables from data
    const language = data.language,
      title = data.title,
      codeSnippet = data.codeSnippet,
      messageText = data.message.messageText,
      messagePostedBy = userId,
      messagePostDate = new Date();

    // I remember something about using just {title} instead of {title: title}
    const newReview = new Review({
      title,
      language,
      userId,
      message: [{ messageText, codeSnippet, messagePostedBy, messagePostDate }],
      reviewCreatedDate: new Date(),
    });

    newReview.save(function (err, user) {
      if (err) return handleError(err);

      const reviewId = newReview._id,
        // userId declared in createReview above
        requestedDate = new Date(),
        status = "Pending";

      requestHandler.createRequest({ reviewId, userId, status });
    });
  },
};
