const mongoose = require("mongoose");

// import models
const Review = require("../../models/review");

// import request handler
const requestHandler = require("../request/request");

module.exports = {
  createReview: async (user, data, cb) => {
    // create const variables from user
    const name = user.email,
      userId = user._id;

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
      reviewCreatedDate: new Date(),
    });

    newReview.save(function (err, user) {
      if (err) return console.log(err);

      const reviewId = newReview._id,
        // userId declared in createReview above
        requestCreateDate = new Date(),
        status = "Pending";

      requestHandler.createRequest(
        {
          reviewId,
          userId,
          requestCreateDate,
          status,
        },
        cb
      );
    });
  },
};
